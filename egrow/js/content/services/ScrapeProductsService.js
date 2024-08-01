/**
 * It is a global service which handles the triggering of the main modal whenever
 * products are scraped and the uses is waiting for the first response.
 *
 * It provides two functions one to scrape the current page and one to scrape
 * the next page of products which is used in {@link GetNextPageButton}.
 */
class ScrapeProductsService {

    static trackedProducts = new Set();

    /**
     * This method first initalizes the rows with only asin and title, then for each scraped asin it sends a request to background
     * in order to fetch a corresponding product from CE API. After all requests are done processing, it will update the whole table
     * using PromiseAll.
     * @returns {Promise<Response>}
     */
    scrapeCurrentPageProducts () {
        CONTENT.components.mainModal.body.table.clearRows();
        return this._scrapePage(new Promise(function (resolve) {
            resolve(Helper.DOM.toString(document));
        }).then(documentText => {
            return new Promise(function (resolve) {
                resolve(ContentServices.asinParser.getAsins(location.href, documentText, CONTENT.components.mainModal.body.table.getNumRows()));
            });
        }))
            .then(() => ContentServices.feedbackModalsService.displayFeedbackModals())
            .catch(); // Catch if limitation was reached
    }

    /**
     * 1. Gets the next Amazon rankings page
     * 2. Parses the asins from that page
     * 3. Sends all data to background
     *
     * @param urlPath is the path for the rankings page
     * @returns {Promise<Response>}
     */
    scrapeNextPage (urlPath) {
        return this._scrapePage(AmazonMarkets.getMarket(location.href).getPage(urlPath)
            .then(documentText => {
                return new Promise(function (resolve) {
                    resolve(ContentServices.asinParser.getAsins(location.href, documentText, CONTENT.components.mainModal.body.table.getNumRows()));
                });
            })
        ).catch(); // Catch if limitation was reached
    }

    /**
     *
     * @param getAsinsFromPage {Promise<AsinsFromPage>}
     * @returns {Promise<[]>}
     * @private
     */
    _scrapePage(getAsinsFromPage) {

        return CONTENT.components.mainModal.startWaiting()
            .then(() => this._checkRequestLimit())
            .then(function () {
                return new Promise(function (resolve) {
                    const getTrackedProducts = new MessageBackground(MESSAGE_BACKGROUND_ACTIONS.GET_TRACKED_PRODUCTS);
                    chrome.runtime.sendMessage(getTrackedProducts, function (response) {
                        if (response && response.isSuccess) {
                            ScrapeProductsService.trackedProducts = new Set(response.value);
                        }
                    });

                    // Resolve happens directly because request of Product Tracker is faster
                    resolve();
                });
            })
            .then(() => getAsinsFromPage)
            .then(function (asinsFromPage) {

                const productPromises = [];
                asinsFromPage.toScrapeAsins.forEach(function (data, index) {
                    const promise = new Promise(function (resolve, reject) {
                        const timeout = setTimeout(() => {
                            const getProduct = new MessageBackground(MESSAGE_BACKGROUND_ACTIONS.GET_PRODUCT, null, data);
                            chrome.runtime.sendMessage(getProduct, function (response) {
                                if (response && response.isSuccess) {

                                    const rowsToAdd = asinsFromPage.positionAsins.filter(positionAsin => positionAsin.asin === data.asin).map(function (asinFromPage) {
                                        const parsedData = {...response.value}; // deep copy values
                                        parsedData.isSponsored = asinFromPage.isSponsored;
                                        parsedData.isTracked = ScrapeProductsService.trackedProducts.has(asinFromPage.asin);
                                        parsedData.position = asinFromPage.position;
                                        parsedData.href = asinFromPage.href; // needed for refreshing data later
                                        return parsedData;
                                    });

                                    CONTENT.components.mainModal.body.table.addRows(rowsToAdd);

                                    // The first time data is loaded
                                    CONTENT.components.mainModal.body.table.display();

                                    // Stop waiting if one successful otherwise keep waiting till all failed
                                    CONTENT.components.mainModal.stopWaiting();
                                }

                                resolve({asin: data.asin, isSuccess: response.isSuccess});

                                clearTimeout(timeout);
                            });
                        }, 50 * index);
                    });
                    productPromises.push(promise);
                });

                return Promise.all(productPromises).then((resolvedProducts) => {

                    const eachFailed = resolvedProducts.every(resolvedProduct => !resolvedProduct.isSuccess);

                    if (eachFailed) {

                        // Stop waiting modal because it was not triggered before
                        CONTENT.components.mainModal.stopWaiting();

                        CONTENT.components.errorModal.display(
                            `<strong>Whoa, somebody is doing a lot of searching and our servers can't handle your enthusiasm.</strong> \n
                               Please allow us to regroup and try again a bit later.
                               If this error persists contact us at <strong><a href="mailto:help@egrow.io">help@egrow.io</a></strong> 
                               and we will resolve this issue with you as fast as possible.`
                        );
                    } else {
                        Helper.tooltips.init(CONTENT.components.mainModal.body.table.selector);
                        CONTENT.components.mainModal.body.table.stats.init();
                        CONTENT.components.mainModal.body.table.redraw();
                    }

                    const anyFailed = resolvedProducts.some(resolvedProduct => !resolvedProduct.isSuccess);

                    let promise;
                    if (anyFailed) {
                        promise = Promise.reject(resolvedProducts);
                    } else {
                        promise = Promise.resolve(resolvedProducts);
                    }

                    return promise;

                }).finally(function () {
                    CONTENT.components.mainModal.header.refreshButton.stopRotation();
                    ScrapeProductsService._trackPageView();
                });
            })
            .catch(function (response) { // If num requests are reached
                CONTENT.components.mainModal.body.table.addRows([]);
                CONTENT.components.mainModal.body.table.display();
                CONTENT.components.mainModal.header.refreshButton.stopRotation();
                if (null != response.value && response.value.modal === "limit") {
                    CONTENT.components.limitationDailySearchesModal.display(response.value.userMessage);
                } else if (null != response.value && response.value.modal === "marketLimit"){
                    CONTENT.components.limitationModalForBasicPlan.display(response.value.userMessage);
                }

                return Promise.reject(); // Need to reject so requests are not increased in RefreshButton
            })
            .finally(function () {
                CONTENT.components.mainModal.stopWaiting();
            });
    }

    _checkRequestLimit() {

        return new Promise(function (resolve, reject) {
            const askForLimit = new MessageBackground(MESSAGE_BACKGROUND_ACTIONS.ASK_FOR_LIMIT, null, {marketplaceId: Helper.MemberArea.getMarketPlaceId(location.host)});
            chrome.runtime.sendMessage(askForLimit, function (response) {
                if (response && response.isSuccess) {
                    resolve(response);
                } else {
                    reject(response);
                }
            });
        })
    }

    static _trackPageView() {

        const url = location.href;

        let path;
        let title;

        if (Helper.ParserChecker.isAmazonTopPage(url)) {
            path = "/top";
            title = "Bestseller";
        } else if (Helper.ParserChecker.isCategoryPage(url)) {
            path = "/category-rankings";
            title = "Category Rankings";
        } else if (Helper.ParserChecker.isDetailsPage(url)) {
            path = "/details";
            title = "Product Details";
        } else if (Helper.ParserChecker.isKeywordPage(url)) {
            path = "/keyword-rankings";
            title = "Keyword Rankings";
        } else if (Helper.ParserChecker.isSellerPage(url)) {
            path = "/seller";
            title = "Seller";
        } else {
            path = "/unknown";
            title = "Unknown";
        }

        ContentServices.analyticsTracker.trackPageView(path, title);
    }
}

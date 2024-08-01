/**
 * Singleton service which parses all asins from the provided html (documentText)
 * and url. It differentiates between the various page types such as details page,
 * seller page, results page (rankings) and so on.
 */
class AsinParser {
    // TODO: static declaration in class must be changed.
    static DEFAULT_ATTRIBUTE = "data-dp-url";
    static PRODUCT_REVIEWS_ID = "#averageCustomerReviews";
    static MAIN_RESULTS_ID = "#mainResults";
    static ATF_RESULTS_ID = "#atfResults, #btfResults";
    static AMAZON_TOP_SELECTORS = ["#zg-right-col", "#zg_left_colleft"];
    static AMAZON_TOP_PRODUCT_SELECTORS = [".a-list-item", "#gridItemRoot", ".zg-carousel-general-faceout"];
    static RESULT_SELECTORS = [AsinParser.MAIN_RESULTS_ID, AsinParser.ATF_RESULTS_ID, ".s-result-item"];
    static DEALS_SELECTORS = [".GB-M-COMMON.GB-SUPPLE", "#oct-dls-asin-stream-container", "#octopus-dlp-asin-stream", "[data-testid=\"grid-deals-container\"]"];
    static CATEGORY_SEARCH_PAGE_RESULT_SELECTORS = [".octopus-pc-item", ".a-section.acs-product-block__product-image", ".s-result-item", ".a-section.apb-browse-searchresults-product"];
    /**
     *
     * @type {string[]}
     * @private
     * @readonly
     */
    static _DEALS_PAGE_SELECTORS = [".a-row.dealContainer.dealTile", ".oct-acs-asin-item-container", ".octopus-dlp-asin-section", "[data-testid=\"deal-card\"]"];

    /**
     * @param url current page URL
     * @param documentText is the html of the page
     * @returns {boolean} which indicates whether the html has asins or not
     */
    hasPageResults(url, documentText) {

        if (Helper.ParserChecker.isDetailsPage(url)) {
            return true;
        } else if (documentText != null) {

            const amazonPage = $(documentText);

            const arraysToCheck = [AsinParser.RESULT_SELECTORS, AsinParser.AMAZON_TOP_SELECTORS, AsinParser.DEALS_SELECTORS, AsinParser.CATEGORY_SEARCH_PAGE_RESULT_SELECTORS];

            for (let arrayId = 0; arrayId < arraysToCheck.length; arrayId++) {
                const resultSelectors = arraysToCheck[arrayId];
                let results = null;

                for (let i = 0; i < resultSelectors.length; i++) {
                    const selector = resultSelectors[i];
                    results = amazonPage.find(selector);

                    if (results.length > 0) {
                        return true;
                    }
                }
            }
        }

        return false; // no results were found
    }

    /**
     * @param url is the url of the page
     * @param documentText is the html of the page
     * @param initialRowNumber - number of already loaded products
     * @returns {AsinsFromPage} which contains all asins that need to
     *          be scraped.
     */
    getAsins(url, documentText, initialRowNumber) {

        const amazonPage = $(documentText);
        const asinsFromPage = new AsinsFromPage(initialRowNumber);

        if (this._isDealsPage(amazonPage)) {
            this._parseDealsPage(amazonPage, asinsFromPage);
        } else if (Helper.ParserChecker.isDetailsPage(url)) {
            this._parseDetailsPage(amazonPage, asinsFromPage.withUniqueAsins(), url);
        } else if (Helper.ParserChecker.isCategoryPage(url)) {
            this._parseSearchResultsByCategory(amazonPage, asinsFromPage, AsinParser.CATEGORY_SEARCH_PAGE_RESULT_SELECTORS);
        } else if (Helper.ParserChecker.isKeywordPage(url)) {
            this._parseRankingPage(amazonPage, asinsFromPage, AsinParser.ATF_RESULTS_ID, AsinParser.MAIN_RESULTS_ID);
        } else if (Helper.ParserChecker.isSellerPage(url)) {
            this._parseRankingPage(amazonPage, asinsFromPage, AsinParser.ATF_RESULTS_ID);
        } else if (Helper.ParserChecker.isAmazonTopPage(url)) {
            this._parseAmazonTop(amazonPage, asinsFromPage);
        } else {
            this._parseRankingPage(amazonPage, asinsFromPage, AsinParser.ATF_RESULTS_ID); // default parser
        }

        return asinsFromPage;
    }

    _isDealsPage(amazonPage) {

        for (let i = 0; i < AsinParser.DEALS_SELECTORS.length; i++) {
            const dealsSelector = AsinParser.DEALS_SELECTORS[i];
            const results = amazonPage.find(dealsSelector);
            if (results.length > 0) {
                return true;
            }
        }

        return false;
    }

    _parseDetailsPage(amazonPage, asinsFromPage, url) {

        let asin = amazonPage.find(AsinParser.PRODUCT_REVIEWS_ID).attr("data-asin");

        if (undefined === asin) {
            asin = Helper.asins.getAsinFromUrl(url);
        }

        asinsFromPage.add(asin, false);

        this._parseChildren(amazonPage, asinsFromPage);
    }

    _parseChildren(amazonPage, asinsFromPage) {

        let colorVariation, sizeVariation, styleVariation;

        colorVariation = amazonPage.find("#variation_color_name");
        if (!colorVariation.length) {
            colorVariation = amazonPage.find("#shelf-color_name");
        }
        sizeVariation = amazonPage.find("#variation_size_name");
        styleVariation = amazonPage.find("#variation_style_name");

        this._addChildren(asinsFromPage, colorVariation);
        this._addChildren(asinsFromPage, sizeVariation);
        this._addChildren(asinsFromPage, styleVariation)
    }

    _addChildren(asinsFromPage, variationElement) {
        if (variationElement.length) {
            const children = variationElement.find("li");
            children.each(function (index, childrenElement) {
                AsinParser._addChild(asinsFromPage, childrenElement);
            })
        }
    }

    /**
     * @param {any} amazonPage
     * @param {AsinsFromPage} asinsFromPage
     * @param {string[]} resultSelectors
     * @private
     */
    _parseSearchResultsByCategory(amazonPage, asinsFromPage, resultSelectors) {
        let productElements = {length: 0};

        for (let selector of resultSelectors) {
            productElements = amazonPage.find(selector);

            if (productElements.length > 0) {
                break;
            }
        }

        if (productElements.length > 0) {
            productElements.each((index, productElement) => {
                AsinParser._addAsinFromImageElementContainerUrl(asinsFromPage, productElement);
            });
        }
    }

    _parseRankingPage(amazonPage, asinsFromPage, resultsId, fallBackId) {

        let resultsElement = amazonPage.find(resultsId);

        if (!resultsElement.length) {
            resultsElement = amazonPage.find(fallBackId); // if no results id was found --> fallback
        }

        if (!resultsElement.length) {
            resultsElement = amazonPage; // if no results id was found --> entire document
        }

        const productElements = resultsElement.find(".s-result-item");
        productElements.each(function (index, productElement) {
            const asinAttribute = $(productElement).attr("data-asin");
            if (null != asinAttribute && 0 < asinAttribute.length) { // Only elements with a single product
                AsinParser._addAsinFromImageElementContainerUrl(asinsFromPage, productElement);
            }
        })
    }

    _parseAmazonTop(amazonPage, asinsFromPage) {

        const resultsElement = AsinParser._getResultsElement(amazonPage, AsinParser.AMAZON_TOP_SELECTORS);

        const jsonContainers = resultsElement.find(".p13n-desktop-grid"); // Normal BSR page
        if (jsonContainers.length === 1) { // If json container found
            const jsonContainer = jsonContainers[0];
            const asins = JSON.parse(jsonContainer.getAttribute("data-client-recs-list"));
            asins.forEach(asinContainer => { // {id: 'B0876TTXJ4', metadataMap: {…}, linkParameters: {…}}
                asinsFromPage.add(asinContainer.id, false);
            })
        } else {

            // Main BSR page (all categories)
            const carousels = resultsElement.find(".a-carousel-container.p13n-carousel-initialized");
            if (carousels.length > 0) {
                carousels.get().forEach(carousel => {
                    const jsonContainer = carousel.getAttribute("data-a-carousel-options");
                    const parsedContainer = JSON.parse(jsonContainer);
                    if (parsedContainer.ajax != null && parsedContainer.ajax.id_list != null && parsedContainer.ajax.id_list.length > 0) {
                        parsedContainer.ajax.id_list.forEach(idContainerString => {
                            asinsFromPage.add(JSON.parse(idContainerString).id, false);
                        })
                    }
                })
            } else {

                const productElements = resultsElement.find(".p13n-asin");
                if (productElements.length !== 0) {
                    productElements.each(function (index, productElement) {
                        AsinParser._addAsinFromJson(asinsFromPage, productElement);
                    })
                } else {

                    let products = []
                    AsinParser.AMAZON_TOP_PRODUCT_SELECTORS.forEach(selector => {
                        if (products.length === 0) {
                            products = resultsElement.find(selector);
                        }
                    })

                    products.each(function (index, productElement) {
                        AsinParser._addAsinFromImageElementContainerUrl(asinsFromPage, productElement);
                    })
                }
            }
        }
    }

    _parseDealsPage(amazonPage, asinsFromPage) {

        const resultsElement = AsinParser._getResultsElement(amazonPage, AsinParser.DEALS_SELECTORS);
        let productElements = null;

        if (null != resultsElement) {
            for (let index = 0; index < AsinParser._DEALS_PAGE_SELECTORS.length; index++) {
                productElements = resultsElement.find(AsinParser._DEALS_PAGE_SELECTORS[index]);
                if (null != productElements && productElements.length > 0) {
                    // execute the code and exit the loop
                    productElements.each(function (index, productElement) {
                        AsinParser._addAsinFromHref(asinsFromPage, productElement);
                    })
                    break;
                }
            }
        }
    }

    static _getResultsElement(amazonPage, selectors) {

        let resultsElement = null;

        let i = 0;
        while (i < selectors.length && (null === resultsElement || 0 === resultsElement.length)) {
            const dealsSelector = selectors[i];
            resultsElement = amazonPage.find(dealsSelector);
            i++;
        }

        if (!resultsElement.length) {
            resultsElement = amazonPage;
        }

        return resultsElement;
    }

    static _addAsinFromImageElementContainerUrl(asinsFromPage, productElement) {

        let isSponsored = false;
        if ($(productElement).hasClass("s-hidden-sponsored-item")
            || $(productElement).hasClass("AdHolder")
            || $(productElement).hasClass("s-sponsored-list-header")
            || $(productElement).hasClass("s-sponsored-info-icon")
            || $(productElement).find(".s-sponsored-info-icon").length > 0) {
            isSponsored = true;
        }

        const link = $(productElement).find("img").closest("a");
        if (link.length) {
            const href = $(link).attr("href");
            let decodedHref;
            if (-1 < href.indexOf("https")) {
                decodedHref = decodeURI(href);
            } else {
                decodedHref = decodeURIComponent(href);
            }
            const asin = Helper.asins.getAsinFromUrl(decodedHref);
            asinsFromPage.add(asin, isSponsored, href);
        }
    }

    static _addChild(asinsFromPage, productElement, attributeName) {

        let asin = $(productElement).attr("data-defaultasin");
        if (!asin || !asin.length) {
            const asinUrl = $(productElement).attr(AsinParser.DEFAULT_ATTRIBUTE);
            asin = Helper.asins.getAsinFromUrl(asinUrl);
        }

        asinsFromPage.add(asin, false);
    }

    static _addAsinFromJson(asinsFromPage, productElement) {

        const metaData = $(productElement).attr("data-p13n-asin-metadata");

        const jsonMetaData = JSON.parse(metaData);

        const asin = jsonMetaData.asin;

        asinsFromPage.add(asin, false);
    }

    static _addAsinFromHref(asinsFromPage, productElement) {

        const href = $(productElement).find(".a-link-normal").attr("href");

        const asin = Helper.asins.getAsinFromUrl(href);

        asinsFromPage.add(asin, false, href);
    }
}

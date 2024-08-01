class AmazonScannerService {
    constructor() {}

    /**
     *
     * @param href {string}
     * @returns {Promise<{position_asins:AsinFromPage[],to_scrape_asins: AsinFromPage[], next_page_url: string | null}>}
     */
    getRankingProductAsins(href) {
        return AmazonMarkets.getMarket(href).getPage(href)
            .then(htmlResponse => {
                const currentPageDocument = Helper.DOM.parseDocument(htmlResponse);
                return Promise.resolve(BackgroundServices.AsinParser.getAsins(href, currentPageDocument, 0))
                    .then(asins => {
                        return {
                            position_asins: asins.positionAsins,
                            to_scrape_asins: asins.toScrapeAsins,
                            next_page_url: this._getNextSearchResultsPageUrl(href, currentPageDocument)
                        };
                    });
            });
    }

    /**
     *
     * @param DOM {Document}
     * @param previousUrl {string}
     * @private
     */
    _getNextSearchResultsPageUrl(previousUrl, DOM) {
        let nextPageUrl = null;
        const mainPagination = DOM.querySelector('[cel_widget_id^="MAIN-PAGINATION"]');
        const href = new URL(previousUrl).origin; // without "/" in the end

        if (null != mainPagination) {
            const nextButtonList = [mainPagination.querySelector('li.a-last'), mainPagination.querySelector('.s-pagination-item.s-pagination-next')];
            const nextButtonIndex = nextButtonList.findIndex((element) => null != element);

            if (nextButtonIndex > -1) {
                const nextButton = nextButtonList[nextButtonIndex];

                let path = null;
                let isLastPage = true;

                switch (nextButton.tagName) {
                    case 'LI':
                        isLastPage = nextButton.classList.contains('a-disabled');
                        if(!isLastPage) {
                            path = nextButton.querySelector('a').getAttribute('href');
                        }
                        break;
                    default:
                        if (nextButton.classList.contains('s-pagination-next')) {
                            isLastPage =  nextButton.classList.contains('s-pagination-disabled');
                            if(!isLastPage) {
                                path = nextButton.getAttribute('href');
                            }
                        }
                        break;
                }

                if(null != path) {
                    nextPageUrl = `${href}${path}`;
                }
            }
        }

        return nextPageUrl;
    }

}

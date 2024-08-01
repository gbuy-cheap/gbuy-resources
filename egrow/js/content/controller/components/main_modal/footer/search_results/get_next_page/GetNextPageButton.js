/**
 * It represents the get next page button in the footer of the main modal.
 */
class GetNextPageButton extends SearchResultsPageButton {
    constructor () {
        super("#getNextPageButton");
        this._service = new GetNextPageService();
    }

    onClick (event) {

        /**
         * Only get next page if refresh button is not rotating anymore
         * which indicates that data is still being loaded.
         */
        if (!CONTENT.components.mainModal.header.refreshButton.isRotating()) {
            this._service.getNextPageUrlPath().then(function (urlPath) {
                ContentServices.scrapeProductsService.scrapeNextPage(urlPath).finally(function () {
                    ContentServices.analyticsTracker.trackUsageEvent(ANALYTICS_ACTION.MAIN_MODAL_FOOTER, "get_next_page");
                });
            }).catch(() => {
                alertify.logPosition("top right");
                alertify.error("Last page already scanned");
            });
        }
    }
}

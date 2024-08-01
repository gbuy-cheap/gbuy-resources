/**
 * It represents the footer of the main modal. It holds all buttons and can
 * enable/disable the buttons and hide buttons if required.
 */
class MainModalFooter {
    constructor () {
        this.contactButton = new ContactButton();
        this.exportButton = new ExportButton();
        this.getNextPageButton = new GetNextPageButton();
        this.keywordNicheToolButton = new KeywordNicheToolButton();
        this.screenShotButton = new ScreenShotButton();
        this.sponsoredProductsButton = new SponsoredProductsButton();
        this.tableFiltersButton = new TableFiltersButton();
        this.disable(); // At the beginning disabled
    }

    /**
     * This function enables all footer elements after all products have been loaded.
     */
    enable () {
        this.exportButton.enable();
        this.screenShotButton.enable();
        this.sponsoredProductsButton.enable();
        this.keywordNicheToolButton.enable();
        this.getNextPageButton.enable();
        this.tableFiltersButton.enable();
    }

    /**
     * This function disables all footer elements (except contact button) during the scanning of products.
     */
    disable () {
        this.exportButton.disable();
        this.screenShotButton.disable();
        this.sponsoredProductsButton.disable();
        this.keywordNicheToolButton.disable();
        this.getNextPageButton.disable();
        this.tableFiltersButton.disable();
        // Keep contact button working
    }

    /**
     * This function hides all footer elements (except contact button) when the not found modal is shown or if
     * something else went wrong.
     */
    hide () {
        this.exportButton.hide();
        this.screenShotButton.hide();
        this.sponsoredProductsButton.hide();
        this.keywordNicheToolButton.hide();
        this.getNextPageButton.hide();
        this.tableFiltersButton.hide();
        return Promise.resolve();
    }
}

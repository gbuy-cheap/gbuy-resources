/**
 * It represents the button which triggers the displaying of sponsored products
 * in the product table.
 */
class SponsoredProductsButton extends ButtonComponent {
    constructor () {
        super("#sponsoredButton");
        this._service = new SponsoredProductsService();
    }

    onClick (event) {
        this._service.hideSponsoredProducts().then(() => {
            CONTENT.components.mainModal.body.table.filters.applySponsored(true);
            this._hideSponsoredProducts();
        }).catch(() => {
            CONTENT.components.mainModal.body.table.filters.applySponsored(false);
            this._showSponsoredProducts();
        }).finally(function () {
            ContentServices.analyticsTracker.trackUsageEvent(ANALYTICS_ACTION.MAIN_MODAL_FOOTER, "toggle_sponsored");
        });
    }

    _showSponsoredProducts () {
        $(this.selector).removeClass("sponsored-hidden");
        $(this.selector).prop("title", "Remove Sponsored Products");
    }

    _hideSponsoredProducts () {
        $(this.selector).addClass("sponsored-hidden");
        $(this.selector).prop("title", "Add Sponsored Products");
    }
}

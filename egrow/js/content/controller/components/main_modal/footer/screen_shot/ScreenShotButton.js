/**
 * Represents the button which takes a screenshot of the entire modal when
 * it is clicked. Additionally, some columns are hidden so the products cannot
 * be identified on the screenshot.
 */
class ScreenShotButton extends ButtonComponent {
    constructor () {
        super("#screenShotButton");
        this._service = new ScreenShotService();
    }

    onClick (event) {
        event.preventDefault();

        Helper.tooltips.destroy(this);

        CONTENT.components.mainModal.body.table.hideColumnsForScreenShot()
            .then(() => this._service.takeScreenShot(CONTENT.components.mainModal.selector))
            .catch() // if screenshot is not created
            .finally(() => CONTENT.components.mainModal.body.table.displayColumnsAfterScreenShot());

        ContentServices.analyticsTracker.trackUsageEvent(ANALYTICS_ACTION.MAIN_MODAL_FOOTER, "screenshot");

        Helper.tooltips.initSingleElement(this.selector);
    }
}

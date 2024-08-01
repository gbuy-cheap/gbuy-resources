/**
 * It represents the button in the {@link MainModalHeader} which closes the
 * main modal. The closing is simply hiding the main modal.
 */
class CloseButton extends MainModalHeaderElement {
    constructor () {
        super("#closeButton");
    }

    onClick (event) {
        CONTENT.components.mainModal.hide();
        ContentServices.analyticsTracker.trackUsageEvent(ANALYTICS_ACTION.MAIN_MODAL_HEADER, "close_main_modal");
    }
}

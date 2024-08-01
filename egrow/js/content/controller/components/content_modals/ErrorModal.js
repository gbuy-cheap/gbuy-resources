/**
 * It represents the error modal which is displayed if any error appeared in
 * the background. It usually is shown when a request could not be performed
 * correctly.
 */
class ErrorModal extends ContentModal {

    constructor () {
        super("#errorModal");

        $(this.selector).click(() => {
            $(this.selector).fadeOut(this.fadeOutTime);
        });
    }

    display (message) {
        $(this.selector + " p").html(message);
        super.display();
        ContentServices.analyticsTracker.trackUsageEvent(ANALYTICS_ACTION.ERROR_MODAL, "display");
    }
}

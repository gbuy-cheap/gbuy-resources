/**
 * Base modal for all limitations that the user can exceed such as:
 *
 * Amount of requests
 * Amount of tracked products
 *
 * Every limitation modal displays an upgrade button to allow the user
 * to go to the plans page for an upgrade.
 */
class LimitationModal extends ContentModal {
    /**
     *
     * @param {string} selector
     * @param {string} upgradeButtonSelector
     * @param {boolean} closeOnClick
     */
    constructor (selector, upgradeButtonSelector, closeOnClick = true) {
        super(selector);
        if (closeOnClick) {
            $(selector).click(() => super.hide());
            $(upgradeButtonSelector).click(() => super.hide());
        }
    }

    /**
     * It displays the provided message in the limitation modal. The message
     * depends on the limitation and the users plan.
     *
     * @param message
     */
    display (message) {
        $(this.selector + " p").html(message);
        $(this.selector).show();

        ContentServices.analyticsTracker.trackUsageEvent(ANALYTICS_ACTION.LIMIT_MODAL, "display");
    }
}

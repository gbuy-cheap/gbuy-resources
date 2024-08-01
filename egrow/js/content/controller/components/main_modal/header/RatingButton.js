/**
 * It represents the button in the main modal header {@link MainModalHeader}
 * which opens a new tab with the chrome extension page in the web store so
 * the user can rate it.
 */
class RatingButton extends MainModalHeaderElement {
    constructor () {
        super("#rateHeaderButton");
    }

    onClick (event) {
        ContentServices.analyticsTracker.trackUsageEvent(ANALYTICS_ACTION.MAIN_MODAL_HEADER, "rate");
        window.open("https://chrome.google.com/webstore/detail/egrowio-amazon-scout-exte/ickcnpogpccagkhpcmibbkmdlnhiepda/reviews", "_blank");
    }
}

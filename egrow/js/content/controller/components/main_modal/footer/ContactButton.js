/**
 * It represents the contact button in the {@link MainModalFooter} which
 * forwards the user to the contact page at egrow's web app.
 */
class ContactButton extends ButtonComponent {
    constructor () {
        super(".egrow-contact");
    }

    onClick () {
        const url = "https://egrow.io/contact";
        ContentServices.analyticsTracker.trackUsageEvent(ANALYTICS_ACTION.MAIN_MODAL_FOOTER, "contact_support");
        window.open(url, "_blank");
    }
}

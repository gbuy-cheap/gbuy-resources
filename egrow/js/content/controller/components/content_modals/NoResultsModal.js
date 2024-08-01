/**
 * It represents the modal which is shown when no results (asins) could
 * be found on the current Amazon page.
 */
class NoResultsModal extends ContentModal {
    constructor () {
        super("#resultsNotFoundModal");
    }

    display() {
        const superDisplay = () => super.display();
        return new Promise(function (resolve) {
            superDisplay();
            ContentServices.analyticsTracker.trackUsageEvent(ANALYTICS_ACTION.NO_RESULTS_MODAL, "display");
            resolve();
        });
    }
}

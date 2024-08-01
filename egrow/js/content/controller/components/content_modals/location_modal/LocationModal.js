class LocationModal extends ContentModal{
    constructor() {
        super('#location-modal');
        this.modalButton = new LocationModalButton();
    }

    /**
     *
     * @param {LocationRequestConfiguration } config
     * @returns {<void>}
     */
    display(config) {
        super.display();
        ContentServices.analyticsTracker.trackUsageEvent(ANALYTICS_ACTION.LOCATION_MODAL, "display");

        const modalButton = this.modalButton;

        return new Promise(function (resolve) {
            modalButton.setRequestConfiguration(config);
        });
    }
}

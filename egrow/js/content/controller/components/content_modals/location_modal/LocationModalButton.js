
/**
 * @property {LocationRequestConfiguration} requestConfig
 */
class LocationModalButton extends ButtonComponent {

    requestConfig;
    constructor() {
        super('#request-location-button');
        this.requestConfig = null;
    }

    /**
     * @typedef { Object } LocationRequestConfiguration
     * @property { string } payload
     * @property { string } csrfToken - token
     */

    /**
     *
     * @param {LocationRequestConfiguration} locationRequestConfig - POST request configuration
     */
    setRequestConfiguration(locationRequestConfig) {
        this.requestConfig = locationRequestConfig;
    }

    onClick(event) {
        ContentServices.analyticsTracker.trackUsageEvent(ANALYTICS_ACTION.LOCATION_MODAL, "apply_default_location");
        AmazonMarkets.getMarket(location.origin).setDeliveryAddress(this.requestConfig).then(() => {
            chrome.runtime.sendMessage(
                new MessageBackground(MESSAGE_BACKGROUND_ACTIONS.REFRESH_RELATED_TABS,
                    null ,
                    {
                        // send url from content since in background get CE url address
                        currentUrl: location.href
                    }
                )
            );
        });
    }
}

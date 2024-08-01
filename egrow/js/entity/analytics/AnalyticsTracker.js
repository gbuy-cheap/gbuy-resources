/**
 * Tracks all events which are send from the content or the popup.
 * Transforms the data to the correct format for the background.
 */
class AnalyticsTracker {

    constructor(){
        this.marketPlaceId = Helper.MemberArea.getMarketPlaceId(location.host);
    }

    /**
     * Is used to track events that happened because of the usage of the CE.
     *
     * @param action {string}
     * @param label {string}
     * @param value {number}
     */
    trackUsageEvent(action, label, value = 1) {
        const event = new AnalyticsUsageEvent(this.marketPlaceId, action, label, value);
        this._sendBackgroundMessage(MESSAGE_BACKGROUND_ACTIONS.TRACK_ANALYTICS_EVENT, event);
    }

    /**
     * @param page {string}
     * @param title {string}
     */
    trackPageView(page, title) {
        const pageView = new AnalyticsPageView(this.marketPlaceId, page, title);
        this._sendBackgroundMessage(MESSAGE_BACKGROUND_ACTIONS.TRACK_ANALYTICS_PAGE_VIEW, pageView);
    }

    _sendBackgroundMessage(action, event) {
        const message = new MessageBackground(action, null, event);
        chrome.runtime.sendMessage(message, function (response) {
            if (response && response.isSuccess) {
                // console.log("PageView was tracked.", response); // only for debug
            } else {
                // console.log("PageView was not tracked!", response); // only for debug
            }
        });
    }
}

/**
 * Message handler which formats the provided {@link AnalyticsPageView} and
 * returns it to the background script so the actual tracking can be performed.
 */
class TrackAnalyticsPageView extends MessageHandler {
    constructor () {
        super(MESSAGE_BACKGROUND_ACTIONS.TRACK_ANALYTICS_PAGE_VIEW);
    }

    /**
     * This function formats the request from the content or popup so
     * it can be handled by GoogleAnalytics to track the page view.
     * All values in request need to be set otherwise no formatting of the page view is performed.
     *
     * @param resolve
     * @param reject
     * @param request
     */
    handle (resolve, reject, request) {
        const pageView = request.value;
        if (pageView === null) {
            reject(Response.failure("PageView object was not set!"));
        } else {
            BackgroundServices.GoogleAnalytics.trackPageView(pageView);
            resolve(Response.success());
        }
    }
}

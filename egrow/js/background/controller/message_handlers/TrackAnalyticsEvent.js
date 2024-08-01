/**
 * Message handler which formats the provided {@link AnalyticsEvent} and
 * returns it to the background script so the actual tracking can be performed.
 */
class TrackAnalyticsEvent extends MessageHandler {
    constructor () {
        super(MESSAGE_BACKGROUND_ACTIONS.TRACK_ANALYTICS_EVENT);
    }

    /**
     * This function formats the request from the content or popup so
     * it can be handled by GoogleAnalytics to track the event.
     * All values in request need to be set otherwise no formatting of the event is performed.
     *
     * @param resolve
     * @param reject
     * @param request
     */
    handle (resolve, reject, request) {
        const event = request.value;
        if (event === null) {
            reject(Response.failure(request));
        } else {
            BackgroundServices.GoogleAnalytics.trackEvent(event);
            resolve(Response.success(null, event));
        }
    }
}

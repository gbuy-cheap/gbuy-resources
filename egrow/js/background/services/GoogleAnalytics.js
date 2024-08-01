/**
 * Is responsible to send information to google analytics.
 */
class GoogleAnalytics {

    static _BASE_TRACKING_PATH = "/virtual/chrome-extension";

    static _isInitFinished = false;
    static _isUserIdSet = false;
    static _isPlanSet = false;

    constructor() {
        this._init().then();
    }

    /**
     * @param event {AnalyticsEvent}
     */
    trackEvent (event) {
        this._init().then(function () {
            if (null != event && null != event.action && event.category != null && event.value != null && Number.isInteger(event.value)) {
                ga("send", {
                    hitType: "event",
                    eventCategory: event.category,
                    eventAction: event.action,
                    eventLabel: event.label,
                    eventValue: event.value,
                    dimension2: event.marketDimension
                });
            }
        })
    }

    /**
     * @param pageView {AnalyticsPageView}
     */
    trackPageView (pageView) {
        this._init().then(function () {
            if (null != pageView && null != pageView.title && null != pageView.page) {
                ga("send", {
                    hitType: "pageview",
                    title: pageView.title,
                    page: GoogleAnalytics._BASE_TRACKING_PATH + pageView.page,
                    dimension2: pageView.marketDimension
                });
            }
        })
    }

    /**
     * @returns {Promise<any>}
     * @private
     */
    _init () {
        return new Promise(function (resolve, reject) {
            /**
             * Changed logic to always retrieve userId so it is set right
             * after the login of a user so the usage can be tracked.
             */
            chrome.storage.sync.get({ userId: null, plan: null}, function (data) {

                const userId = data.userId;
                const plan = data.plan;

                if (!GoogleAnalytics._isInitFinished) {
                    GoogleAnalytics._googleInit();

                    const analyticsId = CE_CONSTANTS.getAnalyticsId();

                    ga("create", analyticsId, "auto");

                    // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
                    ga("set", "checkProtocolTask", function () {});
                    ga("require", "displayfeatures"); // For demographic features

                    GoogleAnalytics._isInitFinished = true;
                }

                if (!GoogleAnalytics._isUserIdSet && null != userId) {
                    ga("set", "userId", userId);
                    GoogleAnalytics._isUserIdSet = true;
                }

                if (!GoogleAnalytics._isPlanSet && null != plan) {
                    ga("set", "dimension1", plan);
                    GoogleAnalytics._isPlanSet = true;
                }

                resolve();
            });
        });
    }

    static _googleInit () {
        (function (i, s, o, g, r, a, m) {
            i.GoogleAnalyticsObject = r;
            i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments);
            }, i[r].l = 1 * new Date();
            a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m);
        })(window, document, "script", "https://www.google-analytics.com/analytics.js", "ga"); // Note: https protocol here
    }
}


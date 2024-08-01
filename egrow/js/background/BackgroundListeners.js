/** Initialize all message handlers and the responder */
const backgroundMessageHandlers = new BackgroundMessageHandlers();
const backgroundMessageResponder = new BackgroundMessageResponder();

/**
 * This listener handles all messages that are send to the background via
 * {@link MessageBackground}.
 */
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action && request.target === MESSAGE_TARGET.BACKGROUND) {
            const url = sender.url;
            // Init entities which are valid only for one background session (message)
            BackgroundSession.init(url, request);

            // Init boundary APIs
            Boundary.init(url);

            backgroundMessageHandlers.processMessage(request).then(function (response) {
                backgroundMessageResponder.succeed(sendResponse, response);
            }).catch(function (reason) {
                backgroundMessageResponder.fail(sendResponse, reason);
            });

            return true; // async response
        }
    }
);

/** Code run on installation or update of the Extension in the background. */
chrome.runtime.onInstalled.addListener(function (object) {
    if (object.reason === "install") { // Forward to login page on first install
        console.log("Extension installed.");
        const host = CE_CONSTANTS.getAppHost();
        const extensionId = chrome.runtime.id;
        BackgroundServices.GoogleAnalytics.trackEvent(new AnalyticsEvent("com", "system", ANALYTICS_ACTION.EXTENSION, "install"));
        chrome.tabs.create({ url: `${host}/auth/register?ce_id=${extensionId}&rf_source=chrome_extension&rf_medium=content&rf_campaign=login&rf_content=installation` });

        // Enable update modal after install/update of Extension
        UpdateMessenger.enable();

    } else if (object.reason === "update") {
        BackgroundServices.GoogleAnalytics.trackEvent(new AnalyticsEvent("com", "system", ANALYTICS_ACTION.EXTENSION, "update"));
        console.log("Extension updated.");
    }

    BackgroundServices.AmazonTabsReloader.reloadTabs();

    // Url for when chrome extension is uninstalled
    chrome.runtime.setUninstallURL("https://surveys.hotjar.com/s?siteId=711902&surveyId=156443");
});

/**
 * Main script for the popup.
 */
$(document).ready(function () {

    // Close Popup
    $("#closeIcon").click(function () {
        window.close();
    });

    // Contact support
    $("#contactButton").click(function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const url = "https://egrow.io/contact";
            window.open(url, "_blank");
        });
    });

    // Inject modal in content
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs && tabs[0]) {
            const activeTab = tabs[0];

            if (activeTab.url.indexOf("www.amazon.") === -1) { // Show popup
                $("#popupBody").show();
            } else {
                PopupServices.Authenticator.isUserAuthenticated()
                    .then(function () { // Inject Modal
                        chrome.tabs.sendMessage(activeTab.id, new MessageContent(MESSAGE_CONTENT_ACTIONS.SHOW_MAIN_MODAL));
                    }, function () { // Login
                        const extensionId = chrome.runtime.id;
                        const appHost = CE_CONSTANTS.getAppHost();
                        // if user is not logged in, the user is forwarded to the login page and after a successful login forwarded to the success page of the CE
                        chrome.tabs.create({ url: `${appHost}/member/install-chrome-extension-success?ce_id=${extensionId}`});
                    }).finally(() => window.close()); // close the original popup to prevent the dual modal main and popup from being displayed
            }
        }
    });
});

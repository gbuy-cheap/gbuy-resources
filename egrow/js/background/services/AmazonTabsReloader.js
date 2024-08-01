class AmazonTabsReloader {

    /**
     * Reloads all amazon tabs on successful login,authenticate, update & install.
     */
    reloadTabs() {
        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(function (tab) {
                if (tab.url.indexOf("www.amazon.") > 0) {
                    chrome.tabs.reload(tab.id);
                }
            });
        });
    }
}

class RefreshRelatedTabs extends MessageHandler{
    constructor() {
        super(MESSAGE_BACKGROUND_ACTIONS.REFRESH_RELATED_TABS);
    }

    handle(resolve, reject, request) {

        chrome.tabs.query({}, function (listOfTabs) {
            const currentUrl = request.value.currentUrl;
            const currentHost = new URL(currentUrl).host;

            listOfTabs.filter(tab => {
                    const tabHost = new URL(tab.url).host;
                    return currentHost === tabHost && tab.url !== currentUrl;
                }
            )
            .forEach(tab => {
                chrome.tabs.reload(tab.id);
            });
        });
    }
}

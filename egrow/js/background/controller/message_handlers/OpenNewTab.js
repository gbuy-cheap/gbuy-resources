class OpenNewTab extends MessageHandler {
    constructor() {
        super(MESSAGE_BACKGROUND_ACTIONS.OPEN_NEW_TAB);
    }

    handle(resolve, reject, request) {
        const url = request.value;
        // "chrome -> tabs" are only available in "background"
        chrome.tabs.create({url}, function (tab) {});
    }
}

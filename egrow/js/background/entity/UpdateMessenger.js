/**
 * Entity which provides update messages to the update modal in
 * the content area after the chrome extension has been
 * installed for the first time or whenever the chrome extension has been
 * updated.
 */
class UpdateMessenger {

    static STORAGE_KEY = "showUpdateModal";
    static UPDATES_TO_DISPLAY = [
        "Released New Tool - <a target='_blank' rel='noopener noreferrer' title='14 days for Free!' href='https://egrow.io/member/review-automator'>Review Automator</a> 14 days for free!",
        "Released New Market - <a target='_blank' rel='noopener noreferrer' title='New market to sell on!' href='https://www.amazon.se'>Amazon SE</a>",
        "Fixed Best Sellers page, now all products are scanned"
    ];

    static _saveState(showModal) {
        const result = {};
        result[UpdateMessenger.STORAGE_KEY] = showModal;
        chrome.storage.sync.set(result, function () {});
    }

    static enable() {
        UpdateMessenger._saveState(true);
    }

    static disable() {
        UpdateMessenger._saveState(false);
    }

    display(resolve, reject, request) {

        chrome.storage.sync.get(UpdateMessenger.STORAGE_KEY, function (valueFromStore) {

            const displayModal = valueFromStore[UpdateMessenger.STORAGE_KEY];

            if (true === displayModal) {
                resolve(Response.success(UpdateMessenger.UPDATES_TO_DISPLAY));
                UpdateMessenger.disable();
            } else {
                reject(Response.failure())
            }
        });
    }
}

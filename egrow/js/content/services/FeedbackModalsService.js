class FeedbackModalsService {
    static STORAGE_KEY = "numOfMainModalInitialization"
    constructor() {
    }

    displayFeedbackModals() {
        const minimized = ContentServices.mainModalSizeService.isMinimized();
        this._incRequestCounter()
        .then(() => CONTENT.components.ratingModal.display(FeedbackModalsService.STORAGE_KEY, minimized))
        .catch(() => CONTENT.components.surveyModal.display(FeedbackModalsService.STORAGE_KEY, minimized))
        .catch(() => {}) // Nothing if survey modal is not shown
    }

    _incRequestCounter() {
        return new Promise(function (resolve, reject) {
            const refresh = new MessageBackground(MESSAGE_BACKGROUND_ACTIONS.INC_USER_DATA, FeedbackModalsService.STORAGE_KEY);
            chrome.runtime.sendMessage(refresh, function (response) {
                if (response && response.isSuccess) {
                    resolve();
                } else {
                    reject()
                }
            });
        })
    }
}

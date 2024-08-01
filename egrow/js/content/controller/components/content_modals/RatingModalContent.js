/**
 * It represents the rating modal which is shown on different occasions.
 * Usually it is displayed after a specific amount of requests performed
 * by the user.
 */
class RatingModalContent extends ContentModal {
    constructor () {
        super("#rateModal");

        const hide = () => this.hide();
        $(this.selector).click(function () {
            hide();
        });

        const selector = this.selector;
        const fadeOutTime = this.fadeOutTime;
        const feedback = () => this._feedback();
        $(".rate-extension").click(function () { // Button and the 5 stars in the rate modal
            $(selector).fadeOut(fadeOutTime, function () {
                window.open("https://chrome.google.com/webstore/detail/egrowio-amazon-scout-exte/ickcnpogpccagkhpcmibbkmdlnhiepda/reviews", "_blank");
            });
            feedback();
        });
    }

    display (requestsKey, minimized) {
        const superDisplay = () => super.display();
        return new Promise(function (resolve, reject) {
            const displayRateModal = new MessageBackground(MESSAGE_BACKGROUND_ACTIONS.DISPLAY_RATING_MODAL, requestsKey, minimized);
            chrome.runtime.sendMessage(displayRateModal, function (response) {
                if (response && response.isSuccess) {
                    setTimeout(function () {
                        superDisplay();
                        ContentServices.analyticsTracker.trackUsageEvent(ANALYTICS_ACTION.RATING_MODAL, "display");
                    }, 2000);
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }

    _feedback () {
        const feedbackRateModal = new MessageBackground(MESSAGE_BACKGROUND_ACTIONS.FEEDBACK_RATING_MODAL);
        chrome.runtime.sendMessage(feedbackRateModal, function (response) {
            if (response && response.isSuccess) {
                ContentServices.analyticsTracker.trackUsageEvent(ANALYTICS_ACTION.RATING_MODAL, "feedback");
            }
        });
    }
}

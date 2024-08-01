/**
 * It represents the survey modal which is displayed after a specific amount
 * of requests performed by a user to ask the user to participate in a survey.
 *
 * The survey is usually generated via Hotjar and defined by
 * the {@link SurveyModalContent._SURVEY_ID}.
 */
class SurveyModalContent extends ContentModal {

    static _SURVEY_ID = "935dd2ba-ea28-471f-b00d-e21d86198029";

    constructor() {
        super("#surveyModal");

        const hide = () => this.hide();
        $(this.selector).click(function () {
            hide();
        });

        const selector = this.selector;
        const fadeOutTime = this.fadeOutTime;
        const feedback = () => this._feedback();
        $("#surveyButton").click(function () {
            $(selector).fadeOut(fadeOutTime, function () {
                window.open("https://surveys.hotjar.com/" + SurveyModalContent._SURVEY_ID, '_blank');
            });
            feedback();
        });
    }

    display(requestsKey, minimized) {
        const superDisplay = () => super.display();
        return new Promise(function (resolve, reject) {
            const displaySurveyModal = new MessageBackground(MESSAGE_BACKGROUND_ACTIONS.DISPLAY_SURVEY_MODAL, requestsKey, minimized);
            chrome.runtime.sendMessage(displaySurveyModal, function (response) {
                if (response && response.isSuccess) {
                    setTimeout(function () {
                        superDisplay();
                        ContentServices.analyticsTracker.trackUsageEvent(ANALYTICS_ACTION.SURVEY_MODAL, 'display');

                    }, 2000);
                    resolve();
                } else {
                    reject();
                }
            });
        })
    }

    _feedback() {
        const feedbackSurveyModal = new MessageBackground(MESSAGE_BACKGROUND_ACTIONS.FEEDBACK_SURVEY_MODAL);
        chrome.runtime.sendMessage(feedbackSurveyModal, function (response) {
            if (response && response.isSuccess) {
                ContentServices.analyticsTracker.trackUsageEvent(ANALYTICS_ACTION.SURVEY_MODAL, 'feedback');
            }
        });
    }
}

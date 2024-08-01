class BackgroundMessageHandlers extends MessageHandlers {
    constructor () {
        super([
            new HasAuthentication(),
            new TakeScreenShot(),
            new RefreshAverageValues(),
            new GetTrackedProducts(),
            new AddTrackedProduct(),
            new DeleteTrackedProduct(),
            new GetUserData(),
            new GetProduct(),
            new SaveUserData(),
            new IncUserData(),
            new TrackAnalyticsEvent(),
            new AskForLimit(),
            new TrackAnalyticsPageView(),
            new DisplayUserModal(MESSAGE_BACKGROUND_ACTIONS.DISPLAY_RATING_MODAL, new RatingModalBackground()),
            new FeedbackUserModal(MESSAGE_BACKGROUND_ACTIONS.FEEDBACK_RATING_MODAL, new RatingModalBackground()),
            new DisplayUserModal(MESSAGE_BACKGROUND_ACTIONS.DISPLAY_SURVEY_MODAL, new SurveyModalBackground()),
            new FeedbackUserModal(MESSAGE_BACKGROUND_ACTIONS.FEEDBACK_SURVEY_MODAL, new SurveyModalBackground()),
            new DisplayUserModal(MESSAGE_BACKGROUND_ACTIONS.DISPLAY_UPDATE_MODAL, new UpdateMessenger()),
            new OpenNewTab(),
            new RefreshRelatedTabs(),
            new CheckLocation()
        ]);
    }
}

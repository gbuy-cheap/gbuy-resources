/**
 * It holds all elements of the content area which includes the main modal with
 * all of its children (footer; header; body) and the content modals which are
 * displayed over the main modal.
 */
class ContentComponents {
    constructor () {
        // Main modal
        this.mainModal = new MainModal();

        // Content modals
        this.limitationDailySearchesModal = new LimitationModalDailySearches();
        this.limitationProductTrackerModal = new LimitationModalProductTracker();
        this.profitCalculatorModal = new ProfitCalculatorModal();
        this.tableFiltersModal = new TableFiltersModal();
        this.errorModal = new ErrorModal();
        this.imageModal = new ImageModal();
        this.noResultsModal = new NoResultsModal();
        this.ratingModal = new RatingModalContent();
        this.surveyModal = new SurveyModalContent();
        this.updateModal = new UpdateModal();
        this.waitingModal = new WaitingModal();
        this.locationModal = new LocationModal();
        this.limitationModalForBasicPlan = new LimitationModalForBasicPlan();
    }
}

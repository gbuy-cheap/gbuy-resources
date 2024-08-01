/**
 * It represents the header of the main modal. It holds all buttons and can
 * enable/disable the buttons and hide buttons if required.
 */
class MainModalHeader extends HtmlComponent {
    constructor () {
        super();
        this.closeButton = new CloseButton();
        this.feedbackButton = new FeedbackButton();
        this.mainModalSizeButton = new MainModalSizeButton();
        this.menuMemberArea = new MenuMemberArea();
        this.ratingButton = new RatingButton();
        this.refreshButton = new RefreshButton();
        this.upgradeButton = new UpgradeButton();
        this.disable(); // At the beginning disabled
    }

    /**
     * This function initializes the refresh button only after all products are scanned.
     */
    enable () {
        this.refreshButton.enable();
    }

    /**
     * This function disables the refresh button while products are scanned.
     */
    disable () {
        this.refreshButton.disable();
    }

    /**
     * This function hides the refresh button and the size button when an error has occurred or no products were found.
     */
    hide () {
        this.refreshButton.hide();
        this.mainModalSizeButton.hide();
        return Promise.resolve();
    }
}

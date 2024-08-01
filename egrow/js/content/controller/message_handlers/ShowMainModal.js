/**
 * Message handler which shows the mail modal.
 *
 * Here are the steps that processed for showing the main modal:
 *
 * 1. If main modal is opened (not closed)
 *  YES --> Hide the main modal
 *  NO --> Continue
 * 2. If main modal has been shown before (is not injected the first time)
 *  YES --> Display main modal
 *  NO --> Continue
 * 3. (Try to) Display the update modal (Is only shown after update)
 * 4. Check whether page has results (asins to be scraped)
 *  YES --> continue to display modal + scrape products
 *  NO --> Show {@link NoResultsModal} & hide footer and header of main modal.
 */
class ShowMainModal extends MessageHandler {
    #lastUrl;
    constructor () {
        super(MESSAGE_CONTENT_ACTIONS.SHOW_MAIN_MODAL);
    }

    handle (resolve, reject, request) {
        const mainModal = CONTENT.components.mainModal;

        if (!mainModal.isClosed()) {
            mainModal.hide();
        } else if (!mainModal.isFirstTimeInjected() && this.#lastUrl === window.location.href) {
            mainModal.display();
        } else {
            this.#lastUrl = window.location.href;
            /**
             * Need to have mainModal.display() twice because of flickering
             * of the table and its stats otherwise.
             */
            CONTENT.components.updateModal.display().catch(() => {}) // Simply continue if update modal is not shown
                .then(() => ContentServices.noResultsService.hasPageResults())
                .then(

                    // When results are found on the page
                    // MESSAGE TO BACKGROUND
                    () => ContentServices.locationDetectionService.handle({
                        html: document.body.innerHTML,
                        origin: document.location.origin
                    })
                        .finally(() => mainModal.display())
                        .catch((config) => CONTENT.components.locationModal.display(config))
                        .then(() => ContentServices.scrapeProductsService.scrapeCurrentPageProducts())

                        // Catch request limitation error without doing anything
                        .catch(() => {}),

                    // When no results are found on the page
                    () => CONTENT.components.noResultsModal.display() // When no results were found
                        .then(() => mainModal.display())
                        .then(() => mainModal.footer.hide())
                        .then(() => mainModal.header.hide()))
                .finally(() => {
                    ContentServices.analyticsTracker.trackUsageEvent(ANALYTICS_ACTION.MAIN_MODAL, "init")
                });
        }
    }
}

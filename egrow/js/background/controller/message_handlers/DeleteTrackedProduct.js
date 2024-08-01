/**
 * Message handler which deletes a tracked product from the Product Tracker.
 * It uses the singleton service {@link ProductTracker}.
 */
class DeleteTrackedProduct extends MessageHandler {
    constructor () {
        super(MESSAGE_BACKGROUND_ACTIONS.DELETE_TRACKED_PRODUCT);
    }

    handle (resolve, reject, request) {
        BackgroundServices.ProductTracker.delete(resolve, reject, request);
    }
}

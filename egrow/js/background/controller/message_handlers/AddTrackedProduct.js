/**
 * Message handler which adds a product to the Product Tracker in the
 * member area of Egrow.
 */
class AddTrackedProduct extends MessageHandler {
    constructor () {
        super(MESSAGE_BACKGROUND_ACTIONS.ADD_TRACKED_PRODUCT);
    }

    handle (resolve, reject, request) {
        BackgroundServices.ProductTracker.add(resolve, reject, request);
    }
}

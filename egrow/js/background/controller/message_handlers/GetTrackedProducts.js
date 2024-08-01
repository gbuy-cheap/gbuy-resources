class GetTrackedProducts extends MessageHandler {

    constructor() {
        super(MESSAGE_BACKGROUND_ACTIONS.GET_TRACKED_PRODUCTS);
    }

    handle(resolve, reject, request) {

        BackgroundServices.ProductTracker.get(resolve, reject);
    }
}

/**
 * Message Handler which fetches the information about product for given asin.
 */
class GetProduct extends MessageHandler {
    constructor () {
        super(MESSAGE_BACKGROUND_ACTIONS.GET_PRODUCT);
    }

    handle (resolve, reject, request) {
        BackgroundServices.ProductDetailsRetriever.fetchProduct(request, resolve, reject);
    }
}

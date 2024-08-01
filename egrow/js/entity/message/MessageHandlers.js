/**
 * Singleton service which holds all message handlers of the specific area.
 * It decided based on the {@param request.action} which handler will be
 * used to process the message.
 */
class MessageHandlers {
    constructor (allHandlers) {
        this.ALL_HANDLERS_MAP = {};

        allHandlers.forEach(value => {
            this.ALL_HANDLERS_MAP[value.action] = value;
        });
    }

    /**
     * It processes the request based on the action that needs to be
     * performed with the request data.
     *
     * @param request is the data from the message.
     * @returns {Promise<any>} which holds the result/failure of the action.
     */
    processMessage (request) {
        const allMessageHandlersMap = this.ALL_HANDLERS_MAP;
        return new Promise(function (resolve, reject) {
            const handler = allMessageHandlersMap[request.action];
            if (handler != null) {
                handler.handle(resolve, reject, request);
            } else {
                reject(Response.failure(new Error("No handler available for that action: " + request.action)));
            }
        });
    }
}

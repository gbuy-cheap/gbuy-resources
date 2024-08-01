/**
 * Represents the base class of a message handler. It has the function
 * {@link MessageHandler.handle} which needs to be overridden by the handler
 * that extends this base class as otherwise an error is thrown.
 */
class MessageHandler {
    constructor (action) {
        this._action = action;
    }

    handle (resolve, reject, request) {
        throw new Error("Need to extend from MessageHandler and implement logic!");
    }

    get action () {
        return this._action;
    }
}

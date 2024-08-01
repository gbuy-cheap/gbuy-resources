/**
 * Message handler which increments a stored user data value. It retrieves
 * the value by the key and sets it to 1 if no value was found and increases
 * it otherwise.
 *
 * If stored value is not an integer the incrementation is cancelled.
 */
class IncUserData extends MessageHandler {
    constructor () {
        super(MESSAGE_BACKGROUND_ACTIONS.INC_USER_DATA);
    }

    handle (resolve, reject, request) {
        BackgroundServices.UserDataHandler.inc(resolve, reject, request);
    }
}

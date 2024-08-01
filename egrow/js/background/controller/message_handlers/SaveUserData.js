/**
 * Message handler which saves provided user data (request.value) with the provided
 * key (request.key) in the browser storage.
 */
class SaveUserData extends MessageHandler {
    constructor () {
        super(MESSAGE_BACKGROUND_ACTIONS.SAVE_USER_DATA);
    }

    handle (resolve, reject, request) {
        BackgroundServices.UserDataHandler.save(resolve, reject, request);
    }
}

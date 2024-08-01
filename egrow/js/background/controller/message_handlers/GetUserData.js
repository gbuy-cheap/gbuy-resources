/**
 * Message handler which returns saved user data based on the key
 * from the {@link Message.key}.
 */
class GetUserData extends MessageHandler {
    constructor () {
        super(MESSAGE_BACKGROUND_ACTIONS.GET_USER_DATA);
    }

    handle (resolve, reject, request) {
        BackgroundServices.UserDataHandler.get(resolve, reject, request);
    }
}

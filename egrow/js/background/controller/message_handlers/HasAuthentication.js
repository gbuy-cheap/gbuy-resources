class HasAuthentication extends MessageHandler {
    constructor () {
        super(MESSAGE_BACKGROUND_ACTIONS.HAS_AUTHENTICATION);
    }

    handle (resolve, reject, request) {
        BackgroundServices.Authenticator.hasAuthentication(resolve, reject, request);
    }
}

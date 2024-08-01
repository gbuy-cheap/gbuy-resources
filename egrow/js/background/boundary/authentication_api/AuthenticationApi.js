class AuthenticationApi extends AbstractApi {

    constructor(senderUrl, isDevMode) {
        super(`${CE_CONSTANTS.getApiHost()}/authentication_api`, senderUrl, API_MODULE_TYPE.AUTH);
    }
}

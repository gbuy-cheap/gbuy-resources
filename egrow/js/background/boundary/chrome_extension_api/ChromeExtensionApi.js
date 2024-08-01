/**
 * Service which is initialized on every message based on the senderUrl as this
 * indicates which base _api endpoint will be used for requests. It interacts
 * with both authentication endpoint and _api endpoint in order to make a secure
 * communication.
 */
class ChromeExtensionApi extends AbstractApi {
    constructor(senderUrl, isDevMode) {
        super(`${CE_CONSTANTS.getApiHost()}/chrome_extension_api`, senderUrl, API_MODULE_TYPE.CE);
    }

    async post(endpointPath, data, headers) {
        return super.post(`${endpointPath}`, data, headers, {processData: false});
    }
}

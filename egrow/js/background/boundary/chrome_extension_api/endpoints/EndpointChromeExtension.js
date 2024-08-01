/**
 * It represents the base class of the CE PhpApi endpoint.
 * A request URL is generated based on the PhpApi type and endpoint.
 */
class EndpointChromeExtension extends AbstractEndpoint {

    constructor(chromeExtensionApi, endpointPath, isDevMode) {
        super(chromeExtensionApi, endpointPath, true, isDevMode);
    }

    /**
     *
     * @param {string} data
     * @return {Promise<{}>}
     */
    async postLog(data) {

        let headers = {};
        if (this._hasAuthHeader) {
            headers = {
                "Authorization": await this.getAuthHeader()
            }
        }

        return this._api.loggerPostRequest(this._getFinalRequestPath(""), data, headers);
    }
}

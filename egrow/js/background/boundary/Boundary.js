/**
 * It holds all boundary services/endpoints and the PhpApi.
 */

Boundary = (function () {
    /**
     * @type {boolean} indicates whether the PhpApi performs a real request
     * or connects to the local mocked-_api.
     */
    const IS_DEV_MODE = false;

    return {
        API: null,
        init: function (url) {
            this.AppApi = new AppApi(url, IS_DEV_MODE);
            this.ChromeExtensionApi = new ChromeExtensionApi(url, IS_DEV_MODE);
            this.AuthenticationApi = new AuthenticationApi(url, IS_DEV_MODE);

            // Endpoints App
            this.endpointProductTracker = new EndpointAppProductTracker(this.AppApi, IS_DEV_MODE);

            // Endpoints CE_API
            this.endpointProducts = new EndpointProducts(this.ChromeExtensionApi, IS_DEV_MODE);

            // Endpoints CE_LOGGER_API
            this.ceEndpointLogger = new EndpointLogging(this.ChromeExtensionApi, IS_DEV_MODE);

            // Endpoints AUTH_API
            this.endpointLogin = new EndpointLogin(this.AuthenticationApi, IS_DEV_MODE);
            this.endpointAuthenticate = new EndpointAuthenticate(this.AuthenticationApi, IS_DEV_MODE);
        }
    };
}());

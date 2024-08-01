class AppApi extends AbstractApi{
    constructor(senderUrl, isDevMode) {
        super(`${CE_CONSTANTS.getApiHost()}/app_api`, senderUrl, API_MODULE_TYPE.APP);
    }

    /**
     * @typedef {Object} ApiError
     * @property {string} debugMessage
     * @property {number} internalError
     * @property {number} limit
     * @property {string} message
     * @property {string} status
     * @property {string} timestamp
     */

    /**
     * @typedef {Object} ResponseJSON
     * @property {ApiError} apierror
     */

    /**
     * @typedef {Object} ApiErrorResponse
     * @property {ResponseJSON} responseJSON
     * @property {number} status - status code
     */

    /**
     *
     * @param {ApiErrorResponse} apiResponse
     * @return {{userMessage: string, modal: string}}
     */
    formatError (apiResponse) {
        let response = { userMessage: "" };
        switch (apiResponse.status) {
            case 403:
                response.userMessage = `You have reached the limit with your current plan.\nClick the button below to upgrade your package.`;

                response.modal = "limit";
                break;
            case 500:
            default:
                response = {modal: "error" }; // Default error modal is shown
                response.userMessage = "We have encountered an error with the browser. " +
                    "Please reload the page and restart the extension. " +
                    "If you see the same message again contact us via the support link."; // Default message
        }

        return response;
    }
}

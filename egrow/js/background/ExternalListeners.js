/**
 * Represents a message listener from an Angular app to CE
 */
chrome.runtime.onMessageExternal.addListener(
    /**
     * @typedef {object} ExternalMessageValue
     * @property {string} href - product details page URL
     * @property {string} asin - product ASIN
     * @property {number} multiplier - allows to set a delay for a request to Amazon
     */
    /**
     * @typedef {object} ExternalMessage
     * @property {MESSAGE_BACKGROUND_ACTIONS} action -
     * @property {MESSAGE_TARGET} target -
     * @property {ExternalMessageValue} value -
     */

    /**
     *
     * @param {ExternalMessage} message
     * @param sender
     * @param sendResponse
     */
    function(message, sender, sendResponse) {
    // the first response sends a version of the CE manifest to the application.
    // The application detects that a response from the CE is available.
    if (message.hasOwnProperty('target') && message.target === MESSAGE_TARGET.BACKGROUND) {
        let initApiHref = 'https://www.amazon.com';

        if (message.hasOwnProperty("value") && message.value.hasOwnProperty('href')) {
            initApiHref = message.value.href;
        }

        Boundary.init(initApiHref); // init marketplaceId for API requests
        BackgroundSession.init(initApiHref, {});

        if (message.hasOwnProperty("action")) {
            switch (message.action) {
                case MESSAGE_BACKGROUND_ACTIONS.CHECK_CHROME_EXTENSION:
                    sendResponse({version: chrome.runtime.getManifest().version});
                    break;

                case MESSAGE_BACKGROUND_ACTIONS.SCRAPE_PRODUCT:
                    if (message.hasOwnProperty("value") && message.value.hasOwnProperty('href')) {
                        new Promise((resolve, reject) => {
                            BackgroundServices.ProductDetailsRetriever.fetchProduct(message, resolve, reject);
                        })
                        .then(response => {
                            sendResponse({ce_api_product: response});
                        })
                        .catch((error) => {
                            const errorMessage = error.responseJSON ? {...error.responseJSON} : error.message ? {status_code: 0, message: error.message} : {status_code: error.status, message: error.statusText};
                            sendResponse({errorResponse: errorMessage});
                        });
                    } else {
                        sendResponse({errorResponse: 'The href field is not defined'});
                    }
                    break;
                case MESSAGE_BACKGROUND_ACTIONS.LOGIN_USER:
                    new Promise((resolve, reject) => {
                        if (message.hasOwnProperty("value") && message.value.hasOwnProperty('credentials')) {
                            return BackgroundServices.Authenticator.login(resolve, reject, message);
                        } else {
                            reject({errorResponse: 'To login, specify the credentials in the request'})
                        }
                    }).then((response) => {
                        BackgroundServices.AmazonTabsReloader.reloadTabs();
                        sendResponse({response: response});
                    }).catch((error) => {
                        sendResponse({errorResponse: error});
                    });
                    break;

                case MESSAGE_BACKGROUND_ACTIONS.AUTHENTICATE_USER:
                    new Promise((resolve, reject) => {
                        return BackgroundServices.Authenticator.authenticate(resolve, reject);
                    }).then((response) => {
                        BackgroundServices.AmazonTabsReloader.reloadTabs();
                        sendResponse({response: response});
                    }).catch((error) => {
                        sendResponse({errorResponse: error});
                    });
                    break;

                case MESSAGE_BACKGROUND_ACTIONS.SCRAPE_KEYWORD_RANKING:
                        if (message.hasOwnProperty("value") && message.value.hasOwnProperty('href')) {

                            BackgroundServices.AmazonScannerService.getRankingProductAsins(message.value.href)
                                .then(rankingResponse => sendResponse(rankingResponse))
                                .catch(error => sendResponse({errorResponse: error}));

                        } else {
                            sendResponse({errorResponse: 'The href field is not defined'});
                        }
                    break;

                case MESSAGE_BACKGROUND_ACTIONS.GET_KEYWORD_SUGGESTIONS:
                    if (message.hasOwnProperty("value") && message.value.hasOwnProperty('href')) {
                        BackgroundServices.AmazonKeywordSuggestionService.getKeywords(message.value.href)
                            .then(response => sendResponse({suggestions: response}))
                            .catch(error => sendResponse({errorResponse: error}))
                    }
                    break;
                case MESSAGE_BACKGROUND_ACTIONS.UPDATE_LOCATION:
                    if (message.hasOwnProperty("value") && message.value.hasOwnProperty('href')) {
                        BackgroundServices.ExternalLocationMessageService.processMessage(message.value.href)
                        /**
                         * sendResponse() is required
                         */
                        sendResponse({message: 'message received'});
                    }
                    break;
                case MESSAGE_BACKGROUND_ACTIONS.GET_HTTP_RESPONSE:
                    if (message.hasOwnProperty('value') && message.value.hasOwnProperty('request')) {

                        BackgroundServices.AmazonRequestService.getAmazonData(message.value.request)
                            .then(response => sendResponse(response))
                            .catch(errorResponse => {
                                let error = null;
                                if (errorResponse instanceof ExternalErrorDto) {
                                    error = errorResponse;
                                } else {
                                    error = new ExternalErrorDto(errorResponse.message, errorResponse.stack);
                                }
                                sendResponse(error);
                            })

                    } else {
                        sendResponse(new ExternalErrorDto('Message value is invalid! No request information provided: ' + message.value));
                    }
                    break;

                default:
                    sendResponse(new ExternalErrorDto(`The action '${message.action}' is not defined for an external listener!`, '', '',{}, 404));
                    break;
            }
        }
    }
});


/**
 * Base class which is used for implementations of endpoints.
 */
class AbstractEndpoint {

    static _FAILED_AUTHENTICATION_COUNTER = 0;

    /**
     * @param api {AbstractApi}
     * @param endpointPath {string}
     * @param hasAuthHeader {boolean}
     * @param isDevMode {boolean}
     */
    constructor(api, endpointPath, hasAuthHeader, isDevMode) {
        this._api = api;
        this._endpointPath = endpointPath;
        this._hasAuthHeader = hasAuthHeader;
        this.isDevMode = isDevMode;
    }

    async getAuthHeader() {
        const authData = await this.getAuthData();
        const token = authData.jwt;
        return `Bearer ${token}`;
    }

    async get(requestPath = "", headers = {}) {

        if (this._hasAuthHeader) {
            headers = {
                "Authorization": await this.getAuthHeader(),
                ...headers
            }
        }

        return this._api.get(this._getFinalRequestPath(requestPath), headers);
    }

    async post(data, requestPath = "", headers = {}) {

        if (this._hasAuthHeader) {
            headers = {
                "Authorization": await this.getAuthHeader(),
                ...headers
            }
        }

        return this._api.post(this._getFinalRequestPath(requestPath), data, headers)
    }

    async put(data, requestPath = "", headers = {}) {

        if (this._hasAuthHeader) {
            headers = {
                "Authorization": await this.getAuthHeader(),
                ...headers
            }
        }

        return this._api.put(this._getFinalRequestPath(requestPath), data, headers)
    }

    async delete(data, requestPath = "", headers = {}) {

        if (this._hasAuthHeader) {
            headers = {
                "Authorization": await this.getAuthHeader(),
                ...headers
            }
        }

        return this._api.delete(this._getFinalRequestPath(requestPath), data, headers);
    }

    getAuthData() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(['auth'], (result) => {
                if (null != result && null != result.auth) {

                    // Append not expired token
                    if (!AbstractEndpoint._isJwtExpired(result.auth.parsedJwt)) {
                        resolve(result.auth);
                    } else {
                        // Retrieve new token
                        return new Promise((resolveAuth, rejectAuth) => {
                            BackgroundServices.Authenticator.authenticate(resolveAuth, rejectAuth)
                        }).catch(error => {
                            // To ensure only one login page per browser session
                            if (AbstractEndpoint._FAILED_AUTHENTICATION_COUNTER <= 0) {
                                AbstractEndpoint._FAILED_AUTHENTICATION_COUNTER++;
                                const extensionId = chrome.runtime.id;
                                const appHost = CE_CONSTANTS.getAppHost();
                                chrome.tabs.create({ url: `${appHost}/member/install-chrome-extension-success?ce_id=${extensionId}`});
                            }
                            reject(new Error("Failed to authenticate before request: " + error));
                        }).then(response => resolve(response.value)) // nested response
                    }
                } else {
                    reject(new Error("Failed to receive data for some unknown reason"));
                }
            });
        });
    }

    _getFinalRequestPath(requestPath) {
        return this._endpointPath + requestPath;
    }

    /**
     * @param token {*}
     * @returns {boolean}
     */
    static _isJwtExpired(token) {
        const now = new Date();
        const t = new Date(token.exp * 1000); // exp is in seconds since epoch time
        return now > t;
    }
}

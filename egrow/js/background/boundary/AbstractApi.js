/**
 * Base class which is used for the implementation of all APIs.
 */
class AbstractApi {

    /**
     * @type {API_MODULE_TYPE}
     * @private
     */
    _moduleType;

    /**
     *
     * @param {string} apiUrl
     * @param {string} senderUrl
     * @param {API_MODULE_TYPE} moduleType
     */
    constructor(apiUrl, senderUrl, moduleType) {
        this.apiUrl = apiUrl;
        this.senderUrl = senderUrl;
        this._moduleType = moduleType;

        const url = new URL(senderUrl);
        switch (url.hostname) {
            case "www.amazon.ae":
                this._apiMarketplaceId = "ae";
                break;
            case "www.amazon.de":
                this._apiMarketplaceId = "de";
                break;
            case "www.amazon.co.uk":
                this._apiMarketplaceId = "uk";
                break;
            case "www.amazon.com":
                this._apiMarketplaceId = "usa";
                break;
            case "www.amazon.in":
                this._apiMarketplaceId = "in";
                break;
            case "www.amazon.it":
                this._apiMarketplaceId = "it";
                break;
            case "www.amazon.ca":
                this._apiMarketplaceId = "ca";
                break;
            case "www.amazon.fr":
                this._apiMarketplaceId = "fr";
                break;
            case "www.amazon.com.au":
                this._apiMarketplaceId = "au";
                break;
            case "www.amazon.es":
                this._apiMarketplaceId = "es";
                break;
            case "www.amazon.com.tr":
                this._apiMarketplaceId = "tr";
                break;
            case "www.amazon.com.br":
                this._apiMarketplaceId = "br";
                break;
            case "www.amazon.se":
                this._apiMarketplaceId = "se";
                break;
            case "www.amazon.sa":
                this._apiMarketplaceId = "sa";
                break;
            case "www.amazon.eg":
                this._apiMarketplaceId = "eg";
                break;
            default:
                console.assert("Hostname is not defined: " + url.hostname +
                    ", take default endpoint for www.amazon.com");
                this._apiMarketplaceId = "usa";
                break;
        }
    }

    get(endpointPath, headers, configuration = {}) {
        const getRequestConfiguration = {
            type: "GET",
            url: this._getFinalUrl(endpointPath),
            headers: headers,
            ...configuration
        };

        return $.ajax(getRequestConfiguration).fail((errorData) => {
            return this._getUserId()
                .then(
                    id => Helper.logger.logBackground(errorData, {requestUrl: getRequestConfiguration.url, requestType: getRequestConfiguration.type, userId: id}, this.senderUrl)
                )
                .catch(e => console.log(e));
        });
    }

    post(endpointPath, data, headers, configuration = {}) {
        const postRequestConfiguration = {
            type: "POST",
            url: this._getFinalUrl(endpointPath),
            data: data,
            dataType: "json",
            contentType: "application/json",
            headers: headers,
            ...configuration
        };

        return $.ajax(postRequestConfiguration).fail((errorData) => {
            return this._getUserId()
                .then(
                    id => Helper.logger.logBackground(errorData, {requestUrl: postRequestConfiguration.url, requestType: postRequestConfiguration.type, userId: id}, this.senderUrl)
                )
                .catch(e => console.log(e));
        });
    }

    /**
     * use separate method to post logger message to exclude loop
     */
    loggerPostRequest(endpointPath, data, headers, configuration = {}) {
        const postRequestConfiguration = {
            url: this._getFinalUrl(endpointPath),
            data: data,
            dataType: "json",
            contentType: "application/json",
            headers: headers,
            ...configuration
        };

        return $.post(postRequestConfiguration)
    }

    put(endpointPath, data, headers, configuration = {}) {
        const putRequestConfiguration = {
            type: "PUT",
            url: this._getFinalUrl(endpointPath),
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            headers: headers,
            ...configuration
        };

        return $.ajax(putRequestConfiguration).fail((errorData) => {
            return this._getUserId()
                .then(
                    id => Helper.logger.logBackground(errorData, {requestUrl: putRequestConfiguration.url, requestType: putRequestConfiguration.type, userId: id}, this.senderUrl)
                )
                .catch(e => console.log(e));
        });
    }

    delete(endpointPath, data, headers, configuration = {}) {
        const deleteRequestConfiguration = {
            type: "DELETE",
            url: this._getFinalUrl(endpointPath),
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            headers: headers,
            ...configuration
        }
        return $.ajax(deleteRequestConfiguration).fail((errorData) => {

            return this._getUserId()
                .then(
                    id => Helper.logger.logBackground(errorData, {requestUrl: deleteRequestConfiguration.url, requestType: deleteRequestConfiguration.type, userId: id}, this.senderUrl)
                )
                .catch(e => console.log(e));
        });
    }

    postLog() {
        throw new Error("Need to implement function in child!")
    }

    _getFinalUrl(endpointPath) {
        let finalUrl = `${this.apiUrl}${endpointPath}`;
        const urlObj = new URL(finalUrl);
        switch (this._moduleType) {
            case API_MODULE_TYPE.APP:
                urlObj.searchParams.set("marketplace", `${this._apiMarketplaceId}`);
                break;
            case API_MODULE_TYPE.CE:
                urlObj.searchParams.set("marketplaceId", `${this._apiMarketplaceId}`);
                break;
            case API_MODULE_TYPE.AUTH:
            default:
                break;
        }

        return urlObj.href;
    }

    async _getUserId() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(null, function(result){
                if (null != result && null != result.userId) {
                    resolve(result.userId);
                } else {
                    reject(new Error("User is not authorized"));
                }
            })
        })
    }
}

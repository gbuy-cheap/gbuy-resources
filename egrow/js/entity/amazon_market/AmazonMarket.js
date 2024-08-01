/**
 * Entity which represents the amazon marketplace with metrics such as
 * currency, weight and ending.
 */
class AmazonMarket {
    constructor (currency, weight, length, ending, unit, language) {
        this.currency = currency;
        this.weight = weight;
        this.length = length;
        this.ending = ending;
        this.unit = unit;
        this.language = language;

        let prefix;
        switch (this.ending) {
        case "co.uk":
            prefix = "uk.";
            break;
        case "com.au":
            prefix = "au.";
            break;
        case "com.br":
            prefix = "br.";
            break;
        default:
            prefix = this.ending + ".";
        }

        this.memberAreaUrl = "https://" + prefix + "egrow.io/member";
    }

    /**
     * @returns {string} which is the correct url of the member area.
     */
    memberArea () {
        return this.memberAreaUrl;
    }

    /**
     * It requests the html page for the given url path. The ending is based
     * on the url that has been set in the {@link AmazonMarkets}.
     *
     * @param urlPath is the path of the amazon url.
     * @param {number} multiplier - the multiplier for timeout
     * @returns {Promise<string>} the html document as a jQuery object.
     */
    getPage (urlPath, multiplier = 0) {

        const basePath = "https://www.amazon." + this.ending;
        let url;

        // Some markets provide href with the full url
        if (-1 < urlPath.indexOf(basePath)) {
            url = urlPath;
        } else {
            url = basePath + urlPath;
        }

        // Add the language tag to retrieve correct html
        if (null != this.language) {
            if (-1 < url.indexOf("?")) {
                url += "&language=" + this.language;
            } else {
                url += "?language=" + this.language;
            }
        }
        return this._fetchPage(multiplier * 200, url);
    }

    /**
     * Fix the "net::ERR_HTTP2_PROTOCOL_ERROR 200"
     * makes a re-request to the Amazon page when an error occurs(maximum two times(by one))
     * @link https://caniuse.com/fetch
     * @param {string} url - URL of requested page
     * @param {number} timeout - a timeout
     * @param {number} attempt
     * @returns {Promise<string>}
     * @private
     */
    async _fetchPage(timeout, url, attempt = 2) {
        await this._sleep(timeout);
        return fetch(url, {
            cache: "default", // uses rules of HTTP Headers
            referrerPolicy: "strict-origin-when-cross-origin",
            headers: new Headers({ // headers copied from original request
                /**
                 * The "Downlink" request header field is a number that indicates the
                 * client's maximum downlink speed in megabits per second (Mbps)
                 */
                "downlink": "1", // custom value. original => 10
                /**
                 * get site in security mode
                 */
                "Upgrade-Insecure-Requests": "1",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
            }),
        })
            .then(response => response.text())
            .catch(async (error) => {
                if (attempt > 0) {
                    await this._sleep(1000);
                    // always check the order of the parameters -> URL, timeout, attempt
                    return this._fetchPage(0, url, attempt - 1);
                } else {
                    return error;
                }
            })
    }

    /**
     * Pauses before re-requesting the Amazon page.
     * @param {number} ms - time of delay
     * @returns {Promise<void>}
     * @private
     */
    _sleep(ms) {
        return new Promise(resolve => {
            const timeoutId = setTimeout(() => {
                resolve();
                clearTimeout(timeoutId);
            }, ms);
        });
    }

    /**
     * @typedef {Object} Payload
     * @property { string } payload
     * @property {string} csrfToken
     */

    /**
     * It sends a default shipping configuration to the Amazon API
     * to set it for the current market.
     * @param {Payload} data
     * @return {Promise}
     */
    setDeliveryAddress(data) {

        const url = `${location.origin}/portal-migration/hz/glow/address-change?actionSource=glow`;
        const headers = {
            "Content-Type": "application/json",
            "x-requested-with": "XMLHttpRequest",
            "anti-csrftoken-a2z": `${data.csrfToken}`
        };

        return $.post({
            url: url,
            data: data.payload,
            processData: false,
            headers: headers,
            complete: () => {
                const urlObj = new URL(location.href);
                const search = urlObj.search;
                const searchParametersObj = new URLSearchParams(search);
                // set reload=1 to reload page
                searchParametersObj.set("ce_reload", "1");

                const newParameters = searchParametersObj.toString();
                urlObj.search = newParameters;
                // reload process start
                location.href = urlObj.href;
            }
        });

    }
}

/**
 * @property {Promise<string>} _csrfTokenPromise
 *
 */
class AmazonAddressModalParserService {

     static _TOKEN_REGEX = new RegExp('CSRF_TOKEN : "([a-zA-Z0-9+\\/;.,-]+|)"');

    /**
     * @param { LocationDTO } config
     * @returns {Promise<LocationRequestConfiguration | null>}
     */
    getLocationSetupRequestConfiguration(config) {

        const requestConfig = this._getRequestConfig(config);

        return fetch(
            requestConfig.requestUrl,
            {
                method: "GET",
                headers: requestConfig.csrf_header_value,
                referrer: ''
            }
        )
        .then(response => response.text())
        .then(html => {
            const csrfToken = this._retrieveCSRFToken(html);
            const payload = this._generatePayload(config);
            /**
             * @type { LocationRequestConfiguration }
             */
            const requestConfiguration = {
                csrfToken,
                payload
            };
            return requestConfiguration;
        }, (error) => null);
    }

    /**
     * @typedef {object} RequestConfig
     * @property { AjaxHeaders } csrf_header_value
     * @property {string} requestUrl
     */

    /**
     * @param { LocationDTO } currentLocationConfig
     * @returns RequestConfig
     * @private
     */
    _getRequestConfig(currentLocationConfig) {
        /**
         *
         * @type {{requestUrl: string, csrf_header_value: AjaxHeaders}}
         * @example {
         *     srf_header_value: {
         *          anti-csrftoken-a2z: "gBoSPwYWML/GEIFdMT3SE+hA07396GjIMeZ6+6YAAAAMAAAAAGB2ttZyYXcAAAAA"
         *          },
         *     requestUrl: "https://www.amazon.ca/portal-migration/hz/glow/get-rendered-address-selections?deviceType=desktop&pageType=Detail&storeContext=apparel&actionSource=desktop-modal
         * }
         * @description the value "anti-csrftoken-a2z" as the request header, retrieved from the current page
         * to get the original Amazon "Select Address" modal via an HTTP request. Modal contains a CSRF token that needs to be installed
         * as the value of the request header to set the default shipping address.
         * If the request does not contain "anti-csrftoken-a2z" - the Amazon server returns "Login Modal" without the CSRF token.
         */
        const config = {
            // default value if no url was present
            requestUrl: `${currentLocationConfig.amazonOrigin}/portal-migration/hz/glow/get-rendered-address-selections?deviceType=desktop&pageType=Search&storeContext=NoStoreName`,
            csrf_header_value: {}
        };

        if (null != currentLocationConfig.modalData) {

            if (null != currentLocationConfig.modalData.url) {
                config.requestUrl = `${currentLocationConfig.amazonOrigin}${currentLocationConfig.modalData.url}`;
            }
            if ('ajaxHeaders' in currentLocationConfig.modalData && 'anti-csrftoken-a2z' in currentLocationConfig.modalData.ajaxHeaders) {
                config.csrf_header_value = currentLocationConfig.modalData.ajaxHeaders;
            }
        }

        return config;
    }

    /**
     *
     * @param {string} responseHtml
     * @returns {string | null}
     * @private
     */
    _retrieveCSRFToken(responseHtml) {
        /**
         * replaced with String.prototype.match(Regex), due to faster execution time compared to Regex.exec
         * @type {RegExpMatchArray}
         */
        const match = responseHtml.match(AmazonAddressModalParserService._TOKEN_REGEX);
        return null != match ? match[1] : null;
    }

    /**
     *
     * @param { LocationDTO } currentLocationConfig
     * @private
     */
    _generatePayload(currentLocationConfig) {
        const payload = BackgroundServices.ShippingAddressRequestPayloadDataService.getPayload(
            BackgroundServices.ShippingAddressDetectionService.isZIPCodeUsed,
            ShippingAddressDetectionService.DEFAULT_DELIVERY_ADDRESSES_MAP,
            currentLocationConfig
        );
        return payload;
    }
}

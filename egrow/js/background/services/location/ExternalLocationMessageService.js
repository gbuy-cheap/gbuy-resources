class ExternalLocationMessageService {
    /**
     * @typedef { Object } ResponsePayload
     * @property { string | null } html
     * @property { boolean } isSuccess
     */
    /**
     *
     * @param { string } href
     */
    processMessage(href) {
        /**
         *
         * @type { LocationPayloadValue }
         */
        const locationMessageValue = {
            html: null,
            origin: href
        };
        AmazonMarkets.getMarket(href).getPage(href)
                     .then(responseHtml => {
                        locationMessageValue.html = responseHtml;
            })
            .finally(() => {

                // locationMessageValue;
                /**
                 * @type {LocationDTO}
                 */
                const locationDto = BackgroundServices.LocationHtmlParser.getConfigFromHtml(locationMessageValue.html)
                locationDto.amazonOrigin = href;
                locationDto.currentMarket = Helper.MemberArea.getMarketPlaceId(new URL(locationDto.amazonOrigin).host);

                BackgroundServices.ShippingAddressDetectionService.isDeliveryAddressInstalled(locationDto)
                    .then((sm) => null)
                    .catch((config) => {
                        /**
                         * send POST request configuration
                         * to set default location address
                         */
                        const url = `${locationDto.amazonOrigin}/portal-migration/hz/glow/address-change?actionSource=glow`;
                        const headers = {
                            "Content-Type": "application/json",
                            "x-requested-with": "XMLHttpRequest",
                            "anti-csrftoken-a2z": `${config.csrfToken}`
                        };
                        return fetch(url,{
                            method: "POST",
                            headers,
                            body: config.payload,
                            referrer: ''
                        })
                    })
                    .then((resp) => null);
            });
    }
}

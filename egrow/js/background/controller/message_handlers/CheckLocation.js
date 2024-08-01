class CheckLocation extends MessageHandler{
    constructor() {
        super(MESSAGE_BACKGROUND_ACTIONS.CHECK_LOCATION);
    }

    /**
     * @typedef { Object } LocationPayloadValue
     * @property { string } html
     * @property { string } origin - amazon page URL
     */

    /**
     * @typedef { Object } LocationMessagePayload
     * @property { LocationPayloadValue } value
     */

    /**
     *
     * @param resolve
     * @param reject
     * @param { LocationMessagePayload } request
     */
    handle(resolve, reject, request) {
        /**
         * @type {LocationDTO}
         */
        const locationDto = BackgroundServices.LocationHtmlParser.getConfigFromHtml(request.value.html)
        locationDto.amazonOrigin = request.value.origin;
        locationDto.currentMarket = Helper.MemberArea.getMarketPlaceId(new URL(locationDto.amazonOrigin).host);

        BackgroundServices.ShippingAddressDetectionService.isDeliveryAddressInstalled(locationDto)
            .then(() => resolve())
            .catch((config) => {
                /**
                 * send POST request configuration
                 * to set default location address
                 */
                reject(config);
            })
    }
}

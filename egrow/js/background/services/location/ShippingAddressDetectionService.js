/**
 * Class DetectShippingLocationService process detection that
 * correct shipping address is installed
 */
class ShippingAddressDetectionService {

    /**
     * contains values for setting the initial shipping address
     * for the current market, if the address is not specified
     * @type {Map<string, string[]>}
     * @readonly
     */
    static DEFAULT_DELIVERY_ADDRESSES_MAP = new Map([
        ['fr', ['75001']], // Paris
        ['ae', ['Abu Dhabi', 'أبوظبي']],
        ['au', ['2601']], // Canberra
        ['ca', ['K0A 2Z0']], //Richmond
        ['usa', ['10006']], // New York
        ['de', ['10115']], // Berlin
        ['sa', ['Riyadh', 'الرياض']],
        ['uk', ['E1 6AN']], // London
        ['br', ['01001-000']], // São Paulo
        ['se', ['111 24']], // Stockholm
        ['sg', ['310145']], // Singapore
        ['eg', ['Cairo', 'القاهرة']] // Cairo
    ]);

    /**
     * @type {string[]}
     * @private
     * @readonly
     */
    static _TO_BE_VERIFIED_MARKETS_IDS = ['ae', 'au', 'ca', 'usa', 'de', 'fr', 'sa', 'uk', 'br', 'se', 'sg', 'eg'];

    /**
     * @type {string[]}
     * @private
     * @readonly
     */
    static _TO_BE_VERIFIED_ZIP_CODE_MARKETS_IDS = ['fr', 'au', 'ca', 'usa', 'de', 'uk', 'br', 'se', 'sg'];

    /**
     *
     * @type {RegExp}
     * @private
     * @readonly
     */
    static _REGEXP = new RegExp('[0-9]{1,}');

    /**
     *
     * @type {string[]}
     * @private
     * @readonly
     */
    static _DEFAULT_DELIVERY_TEXT = ['Entrez votre adresse', 'Selecione o endereço', 'Välj din adress', 'Select your address', 'الرجاء اختيار عنوانك'];

    /**
     * used to form the payload for the POST request
     * @type {boolean}
     * @private
     */

    _isZIPCodeUsed;

    get isZIPCodeUsed() {
        return this._isZIPCodeUsed;
    }

    constructor() {
    }

    /**
     * @typedef {Object} AddressDetection
     * @property {boolean} wrongAddress
     */

    /**
     * This method will be called in ShowMainModal
     * and depending on the response, DeliveryAddressModal will be shown / hidden
     * @param { LocationDTO } config
     * @return {Promise<AddressDetection>}
     */
    async isDeliveryAddressInstalled(config) {
        // return Promise to exclude error - Uncaught (in promise) TypeError
        // since missing handler for reject() if create Promise in class constructor
        this._isZIPCodeUsed = ShippingAddressDetectionService._TO_BE_VERIFIED_ZIP_CODE_MARKETS_IDS.includes(config.currentMarket);
        this._isDetectionResultCorrect = this._isCorrectAddress(config);

        if (!this._isDetectionResultCorrect) {

            // Only retrieve csrf token once
            const requestConfig = await BackgroundServices.AmazonAddressModalParserService.getLocationSetupRequestConfiguration(config);
            if (null != requestConfig) {
                return Promise.reject(requestConfig);
            }
        }

        /**
         * Don't show modal if user declined, correct address is set or
         * csrf token was not retrieved.
         */
        return Promise.resolve();
    }

    /**
     * detect is correct address installed
     * @param { LocationDTO } currentLocationConfig
     * @return {boolean}
     * @private
     */
    _isCorrectAddress(currentLocationConfig) {
        if (ShippingAddressDetectionService._TO_BE_VERIFIED_MARKETS_IDS.includes(currentLocationConfig.currentMarket)) {
            const _isCorrectStringDeliveryAddressValue = currentLocationConfig.currentLocationValue != null
                && !ShippingAddressDetectionService._DEFAULT_DELIVERY_TEXT
                    .some(defaultText => defaultText === currentLocationConfig.currentLocationValue);

            let isZIPCodeInstalled = true;

            if (this._isZIPCodeUsed) {
                isZIPCodeInstalled = ShippingAddressDetectionService._REGEXP.test(currentLocationConfig.currentLocationValue);
            }

            return _isCorrectStringDeliveryAddressValue && isZIPCodeInstalled;
        } else {
            return true;
        }
    }
}

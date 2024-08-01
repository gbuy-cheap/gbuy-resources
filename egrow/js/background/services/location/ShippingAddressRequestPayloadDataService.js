/**
 * Receives all parameters from the ShippingAddressDetectionService
 * during initialization in ContentServices.js and configures the payload
 *  for a POST request to the Amazon API to set the default shipping address for the current market
 */
class ShippingAddressRequestPayloadDataService {

    /**
     * @param {boolean} isZIPCodeUsed
     * @param {Map<string, string[]>} defaultAddressMap
     * @param { LocationDTO } currentLocationConfig
     * @return { string }
     */
    getPayload(isZIPCodeUsed, defaultAddressMap, currentLocationConfig) {

        const payloadData = {};
        if (isZIPCodeUsed) {
            payloadData['locationType'] = 'LOCATION_INPUT';
            payloadData['zipCode'] = defaultAddressMap.get(currentLocationConfig.currentMarket)[0];
        } else {
            payloadData['locationType'] = 'CITY';
            payloadData['city'] =  defaultAddressMap.get(currentLocationConfig.currentMarket)[0];
            payloadData['cityName'] =  defaultAddressMap.get(currentLocationConfig.currentMarket)[0];
        }

        const configurationParam = this._getConfigurationParam(currentLocationConfig);

        payloadData['storeContext'] =  configurationParam.storeContext;
        payloadData['deviceType'] =  'web';
        payloadData['pageType'] =  configurationParam.pageType;
        payloadData['actionSource'] =  'glow';
        payloadData['almBrandId'] =  null;

        return JSON.stringify(payloadData) // String representation of JSON
    }

    /**
     * @typedef {Object} ConfigurationParams
     * @property {string} pageType
     * @property {string} storeContext
     */

    /**
     *
     * @param { LocationDTO } config - a part of URL holds the current page configuration.
     * @return {ConfigurationParams}
     * @private
     */
     _getConfigurationParam(config) {

        const url = new URL(`${config.amazonOrigin}${config.modalData.url}`);
        const params = url.searchParams;
        const pageType = params.get('pageType');
        const storeContext = params.get('storeContext');
        const configurationParams = {
            pageType,
            storeContext: storeContext === 'NoStoreName' ? 'generic' : storeContext
        };
        return configurationParams;
    }

}

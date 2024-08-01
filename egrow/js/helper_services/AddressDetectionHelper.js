/**
 * Handles how to get URL search parameters from the Amazon page to create a GET request to the Amazon API.
 * @type {{getUrlSearchParams: null}}
 */
Helper.AmazonPageHandler = (function () {
    function getDatasetValue() {
        let dataSetValue = null;
        const amazonModalElement = document.querySelector('#nav-global-location-slot span.a-declarative');
        if (null != amazonModalElement) {
            dataSetValue = JSON.parse(amazonModalElement.dataset.aModal);
        }
        return dataSetValue;
    }

    function urlSearchParams() {
        /**
         * @typedef {Object} DataSet
         * @property {boolean} closeButton
         * @property {any} footer
         * @property {string} header
         * @property {string} name
         * @property {string} popoverLabel
         * @property {string} url
         * @property {number} width
         */
        /**
         *
         * @type {null | DataSet}
         */
        const dataSet = getDatasetValue();
        let searchParams = null;
        if (null != dataSet) {
            const url = new URL(`${location.origin}${dataSet.url}`);
            const params = url.searchParams;
            const pageType = params.get('pageType');
            const storeContext = params.get('storeContext');
            searchParams = {
                pageType,
                storeContext: storeContext
            }
        }
        return searchParams;
    }

    return {
        getUrlSearchParams: urlSearchParams()
    };
}());

class LocationHtmlParser {
    /**
     * @typedef { Object } AjaxHeaders
     * @property { string } anti-csrftoken-a2z
     */
    /**
     * @typedef { Object } ModalData
     * @property { AjaxHeaders } ajaxHeaders
     * @property { boolean } closeButton
     * @property { any } footer
     * @property { string } header
     * @property { string } name
     * @property { string } popoverLabel
     * @property { string } url
     * @property { number } width
     */

    /**
     * @typedef { Object } LocationDTO
     * @property { string } currentLocationValue
     * @property { string } amazonOrigin
     * @property { ModalData } modalData
     * @property { string } currentMarket
     */
    /**
     *
     * @param {string} html
     * @returns LocationDTO
     */
    getConfigFromHtml(html) {
        const amazonPageDocument = this._createDocument(html);
        const currentLocationElement = amazonPageDocument.body.querySelector('#glow-ingress-line2');
        const modalDataElement = amazonPageDocument.body.querySelector('#nav-global-location-slot span.a-declarative');

        return {
            currentLocationValue: currentLocationElement ? currentLocationElement.innerHTML.trim() : null,
            amazonOrigin: '',
            modalData: modalDataElement ? JSON.parse(modalDataElement.dataset.aModal) : null,
            currentMarket: ''
        };
    }

    /**
     *
     * @param { string } html
     * @returns {Document}
     * @private
     */
    _createDocument(html) {
        const newDocument = document.implementation.createHTMLDocument('Location');
        newDocument.body.innerHTML = html;
        return newDocument;
    }
}

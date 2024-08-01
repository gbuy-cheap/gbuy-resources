class EndpointAppProductTracker extends EndpointApp {
    constructor(appApi, isDevMode) {
        super(appApi, "/v3/product-tracker/products", isDevMode);
    }

    /**
     *
     * @return {Promise<{asin: string}[]>}
     */
    getTrackedProducts() {
        return this.get("/ids");
    }

    /**
     *
     * @param {string} asin
     * @return {Promise<{}>}
     */
    addTrackedProduct(asin) {
        /**
         *
         * @typedef {Object} Tag
         * @property {string} name - name of tag
         * @property {number} added - date added
         */

        /**
         * @name tag
         * @type {Tag}
         */
        const tag = {name: "chrome-extension", added: Date.now()};

        /**
         * @typedef {Object} AddProductDto
         * @property {string} id - product id
         * @property {Tag[]} tags - array of tags
         */

        /**
         * @name product
         * @type {AddProductDto}
         */
        const product = {id: asin, tags: [tag]};
        return this.put(product, `/${asin}`)
    }

    /**
     *
     * @param {string} asin
     * @return {Promise<{}>}
     */
    deleteTrackedProduct(asin) {
        return this.delete({}, `/${asin}`)
    }
}

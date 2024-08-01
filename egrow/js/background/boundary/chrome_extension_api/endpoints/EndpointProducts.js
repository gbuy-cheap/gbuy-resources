/**
 * A service which is used for creating request to EndpointProducts endpoint
 */
class EndpointProducts extends EndpointChromeExtension {
    constructor(chromeExtensionAPI, isDevMode) {
        super(chromeExtensionAPI, "/v1/products", isDevMode);
    }

    async getProduct(requestValue, pageHtml, pageType) {

        const payload = {
            asin: requestValue.value.asin,
            page_html: pageHtml,
            page_type: pageType
        };

        const compressedPayload = pako.gzip(JSON.stringify(payload));

        const blobPayload = new Blob([compressedPayload]);

        const headers = {"Content-Encoding": "gzip"};

        return await this.post(blobPayload, "", headers);
    }
}

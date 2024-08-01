/**
 * A service which gets the amazon pages, cleans it and send to the products endpoint to retrieve
 * detailed information about product for given asin.
 */
class ProductDetailsRetriever {
    async fetchProduct (requestValue, resolve, reject) {
        try {
            const hmtlPage = await BackgroundSession.AmazonMarket.getPage(requestValue.value.href, requestValue.value.multiplier);
            const cleanedPage = await BackgroundServices.HtmlCleaner.clean(hmtlPage);
            const escapedHtml = Helper.html.escape(cleanedPage);

            const sliderPath = `/gp/aod/ajax/?asin=${requestValue.value.asin}&filters=%7B%22all%22%3Atrue%2C%22primeEligible%22%3Atrue%7D`;

            const sliderHTML = await BackgroundSession.AmazonMarket.getPage(sliderPath, 2);

            const cleanedSliderHTML = await BackgroundServices.HtmlCleaner.cleanSliderHTML(sliderHTML);

            const combinedHTML = await BackgroundServices.HtmlCleaner.combineHTML(escapedHtml, cleanedSliderHTML);

            const product = await Boundary.endpointProducts.getProduct(requestValue, combinedHTML, "PRODUCT_DETAILS");
            if (!product) {
                throw new Error("Retrieved product is not valid");
            }
            resolve(product);
        } catch (e) {
            reject(e);
        }
    }
}

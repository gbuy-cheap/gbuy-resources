/**
 * Object for tracking events with analytics e.g. page views or clicks
 */
class AnalyticsEvent {

    /**
     * @param marketDimension {string} indicates which market is used
     * @param category -  Describes the category of the related event, Example: "Product Tracker", "Product Scraper" or "Keyword Tracker".
     * @param action - Represents the marketplace by id
     * @param label -   Describes the context and the related event, Example: "Login:Set".
     * @param value -   Is the value which will be passed to analyitcs, Example: the page type, number of products
     */
    constructor (marketDimension, category, action, label, value = 1) {
        this.marketDimension = marketDimension;
        this.category = category;
        this.action = action;
        this.label = label;
        this.value = value;
    }
}

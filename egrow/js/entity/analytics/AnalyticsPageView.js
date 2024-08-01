/**
 * Object for tracking page views with analytics
 */
class AnalyticsPageView {
    /**
     * @param marketDimension {string} indicates which market is used
     * @param page {string} - Is the url path of the page view. Those are all virtual page views.
     * @param title {string} -  Is the title of the page that has been scraped. It includes the market of amazon.
     */
    constructor (marketDimension, page, title) {
        this.marketDimension = marketDimension;
        this.page = page;
        this.title = title;
    }
}

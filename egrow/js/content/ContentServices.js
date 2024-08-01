/**
 * Main root for singleton services for the content area.
 * Whenever a new singleton service needs to be added it needs to "extend"
 * (be part of) from this service.
 */
const ContentServices = (function () {
    return {
        fileNameService: new FileNameService(),
        mainModalSizeService: new MainModalSizeService(),
        noResultsService: new NoResultsService(),
        scrapeProductsService: new ScrapeProductsService(),
        /**
         * All parsers that are used in the background to retrieve, asins, keywords
         * and other data from the html text or the sender url.
         */
        asinParser: new AsinParser(),
        keywordParser: new KeywordParser(),
        analyticsTracker: new AnalyticsTracker(),
        feedbackModalsService: new FeedbackModalsService(),
        locationDetectionService: new LocationDetectionService()
    };
}());

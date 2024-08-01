/**
 * Main root for singleton services for the background area.
 * Whenever a new singleton service needs to be added it needs to "extend"
 * (be part of) from this service like {@link BackgroundServices.Authenticator}.
 */
const BackgroundServices = (function () {
    return {
        /**
         * Singleton services which are initialized on startup of the browser.
         * Whenever a new singleton service is added it needs to be initialized
         * here.
         */
        Authenticator: new Authenticator(),
        ProductDetailsRetriever: new ProductDetailsRetriever(),
        ProductTracker: new ProductTracker(),
        UserDataHandler: new UserDataHandler(),
        HtmlCleaner: new HtmlCleaner(),
        GoogleAnalytics: new GoogleAnalytics(),
        ResolveMarketPlaceForBasicPlanService: new ResolveMarketPlaceForBasicPlanService(),
        AsinParser: new AsinParser(),
        AmazonScannerService: new AmazonScannerService(),
        AmazonKeywordSuggestionService: new AmazonKeywordSuggestionService(),
        ShippingAddressDetectionService: new ShippingAddressDetectionService(),
        ShippingAddressRequestPayloadDataService: new ShippingAddressRequestPayloadDataService(),
        AmazonAddressModalParserService: new AmazonAddressModalParserService(),
        LocationHtmlParser: new LocationHtmlParser(),
        ExternalLocationMessageService: new ExternalLocationMessageService(),
        AmazonRequestService: new AmazonRequestService(),
        AmazonTabsReloader: new AmazonTabsReloader()

    };
}());

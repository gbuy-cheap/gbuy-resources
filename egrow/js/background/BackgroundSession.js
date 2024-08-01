/**
 * It represents one session when a message is send to the background.
 * For this session only one AmazonMarket can be set and only one ContentPage
 * can be initialized.
 */
class BackgroundSession {
    // TODO: needs to change this static declaration.
    static AmazonMarket;

    /**
     * Static function to initialize the background area. It creates:
     * 2. {@link AmazonMarket} to access amazon specifications such as currency.
     *
     * @param url is the url of the sender (content area)
     * @param request is the request of the message from the sender
     */
    static init(url, request) {
        BackgroundSession.AmazonMarket = AmazonMarkets.getMarket(url);
    }
}

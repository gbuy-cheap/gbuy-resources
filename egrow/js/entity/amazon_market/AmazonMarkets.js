/**
 * Singleton service which provides the current market of the message session
 * as a {@link AmazonMarket}.
 */
class AmazonMarkets {
    /**
     * Return the current market for this session. A session is defined by a
     * message which arrives at the background script.
     *
     * @param url is the url of the Amazon page from the content area which
     * @returns {AmazonMarket} based on the url
     */
    static getMarket (url) {
        const urlObj = new URL(url);

        let currentMarket;
        switch (urlObj.hostname) {
            case "www.amazon.ae":
                currentMarket = new AmazonMarket("د.إ", "kg", "m", "ae", "AED", "en_AE");
                break;
            case "www.amazon.de":
                currentMarket = new AmazonMarket("€", "kg", "m", "de", "EUR", "de_DE");
                break;
            case "www.amazon.co.uk":
                currentMarket = new AmazonMarket("£", "kg", "m", "co.uk", "GBP");
                break;
            case "www.amazon.in":
                currentMarket = new AmazonMarket("&#x20B9;", "kg", "m", "in", "INR", "en_IN");
                break;
            case "www.amazon.it":
                currentMarket = new AmazonMarket("€", "kg", "m", "it", "EUR");
                break;
            case "www.amazon.ca":
                currentMarket = new AmazonMarket("$", "kg", "m", "ca", "CAD", "en_CA");
                break;
            case "www.amazon.fr":
                currentMarket = new AmazonMarket("€", "kg", "m", "fr", "EUR");
                break;
            case "www.amazon.com.au":
                currentMarket = new AmazonMarket("$", "kg", "m", "com.au", "AUD");
                break;
            case "www.amazon.es":
                currentMarket = new AmazonMarket("€", "kg", "m", "es", "EUR");
                break;
            case "www.amazon.com.tr":
                currentMarket = new AmazonMarket("₺", "kg", "m", "com.tr", "TRY");
                break;
            case "www.amazon.com.br":
                currentMarket = new AmazonMarket("R$", "kg", "m", "com.br", "BRL");
                break;
            case "www.amazon.sa":
                currentMarket = new AmazonMarket("﷼", "kg", "m", "sa", "SAR", "en_AE");
                break;
            case "www.amazon.se":
                currentMarket = new AmazonMarket("kr", "kg", "m", "se", "SEK", "en_GB");
                break;
            case "www.amazon.sg":
                currentMarket = new AmazonMarket("S$", "kg", "m", "sg", "SGD", "en_SG");
                break;
            case "www.amazon.eg":
                currentMarket = new AmazonMarket("E£", "kg", "m", "eg", "EGP", "en_AE");
                break;
            default:
                console.assert("Hostname is not defined: " + urlObj.hostname +
                    ", take default market for www.amazon.com");
            case "www.amazon.com":
                currentMarket = new AmazonMarket("$", "lb", "inch", "com", "USD", "en_US");
        }

        return currentMarket;
    }
}

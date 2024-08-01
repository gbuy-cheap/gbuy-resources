/**
 * Handles how to retrive the ending of the url on the content page for Egrow's Tools.
 *
 * @type {{get}}
 */

Helper.MemberArea = (function () {

    function getEgrowBase (host) {
        let base;

        switch (host) {
        case "www.amazon.de":
            base = "https://de.egrow.io/";
            break;
        case "www.amazon.co.uk":
            base = "https://uk.egrow.io/";
            break;
        case "www.amazon.com":
            base = "https://com.egrow.io/";
            break;
        case "www.amazon.in":
            base = "https://in.egrow.io/";
            break;
        case "www.amazon.it":
            base = "https://it.egrow.io/";
            break;
        case "www.amazon.ca":
            base = "https://ca.egrow.io/";
            break;
        case "www.amazon.fr":
            base = "https://fr.egrow.io/";
            break;
        case "www.amazon.com.au":
            base = "https://au.egrow.io/";
            break;
        case "www.amazon.es":
            base = "https://es.egrow.io/";
            break;
        case "www.amazon.com.tr":
            base = "https://tr.egrow.io/";
            break;
        case "www.amazon.com.br":
            base = "https://br.egrow.io/";
            break;
        case "www.amazon.sa":
            base = "https://sa.egrow.io/";
            break;
        default:
            base = "https://com.egrow.io/";
            break;
        }

        return base;
    }

    function getMarketId(host) {
        let marketplaceId;

        switch (host) {
            case "www.amazon.ae":
                marketplaceId = "ae";
                break;
            case "www.amazon.de":
                marketplaceId = "de";
                break;
            case "www.amazon.co.uk":
                marketplaceId = "uk";
                break;
            case "www.amazon.com":
                marketplaceId = "usa";
                break;
            case "www.amazon.in":
                marketplaceId = "in";
                break;
            case "www.amazon.it":
                marketplaceId = "it";
                break;
            case "www.amazon.ca":
                marketplaceId = "ca";
                break;
            case "www.amazon.fr":
                marketplaceId = "fr";
                break;
            case "www.amazon.com.au":
                marketplaceId = "au";
                break;
            case "www.amazon.es":
                marketplaceId = "es";
                break;
            case "www.amazon.com.tr":
                marketplaceId = "tr";
                break;
            case "www.amazon.com.br":
                marketplaceId = "br";
                break;
            case "www.amazon.sa":
                marketplaceId = "sa";
                break;
            case "www.amazon.se":
                marketplaceId = "se";
                break;
            case "www.amazon.sg":
                marketplaceId = "sg";
                break;
            case "www.amazon.eg":
                marketplaceId = "eg";
                break;
            default:
                marketplaceId = "usa";
                break;
        }

        return marketplaceId;
    }

    return {
        getBase: function (host) {
            return getEgrowBase(host);
        },
        getMarketPlaceId: function(host) {
            return getMarketId(host);
        }
    };
}());

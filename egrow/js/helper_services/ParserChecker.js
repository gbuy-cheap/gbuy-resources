/**
 * Handles the identification of the url whether it is an Amazon page and whether the page is parsable.
 *
 * This function is a helper as it is used in the content, background and popup.
 *
 * @type {{isParsableType, isDetailsPage, isAmazonTopPage, isCategoryPage, isKeywordPage, isSellerPage}}
 */

Helper.ParserChecker = (function () {
    function getDecodedUrl (url) {
        return decodeURIComponent(url.toLowerCase());
    }

    function isDetailsPage (url) {
        const asinValue = Helper.asins.getAsinFromUrl(url);
            // use document.querySelector, since JQUERY returns {object}.
        return asinValue !== "" && null != document.querySelector('#nav-search') ||
            getDecodedUrl(url).indexOf("/gp/offer-listing/") > -1 ||
            getDecodedUrl(url).indexOf("/gp/product/") > -1;
    }

    function isAmazonTopPage (url) {
        return (getDecodedUrl(url).indexOf("best-sellers") > -1 ||
            getDecodedUrl(url).indexOf("/zgbs") > -1 ||
            getDecodedUrl(url).indexOf("/gp/bestsellers") > -1 ||
            getDecodedUrl(url).indexOf("/gp/most-gifted/") > -1 ||
            getDecodedUrl(url).indexOf("/gp/most-wished-for/") > -1 ||
            getDecodedUrl(url).indexOf("/gp/new-releases/") > -1 ||
            getDecodedUrl(url).indexOf("gp/movers-and-shakers/") > -1 ||
            getDecodedUrl(url).indexOf("/gp/") > -1) &&
            (getDecodedUrl(url).indexOf("/gp/offer-listing/") === -1 &&
                getDecodedUrl(url).indexOf("/gp/deals/") === -1);
    }

    function isCategoryPage (url) {
        const urlObj = new URL(getDecodedUrl(url));
        const urlParams = new URLSearchParams(urlObj.search);

        let category = null;

        switch (true) {
            case urlParams.has('node'):
            case urlParams.has('rh'):
                category = urlParams.get('rh') || urlParams.get('node');

                return (category != null && category.length > 0);

            case urlParams.has('field-keywords'):
            case urlParams.has('k'):
                category = urlParams.get('field-keywords') || urlParams.get('k');
                /**
                 * when user selected main category, but doesn't input the keywords
                 * the URL of search page contains following URL
                 * @example
                 * "https://www.amazon.ae/s/ref=nb_sb_noss_1?url=search-alias=beauty&field-keywords="
                 * "https://www.amazon.ae/s?i=baby&k=&ref=nb_sb_noss_2&url=search-alias%3Dbaby"
                 * after page reloading, usually,
                 * "https://www.amazon.ae/b?node=11995843031&ref=nb_sb_noss"
                 *
                 */
                return (category == null || category.length === 0);

            default:
                return false;
        }
    }

    function isKeywordPage (url) {
        const urlObj = new URL(url);
        const urlParams = new URLSearchParams(urlObj.search);

        let keyword = urlParams.get("field-keywords");
        if (keyword == null) {
            keyword = urlParams.get("rh");
        }
        if (keyword == null) {
            keyword = urlParams.get("k");
        }

        /**
         * @return {boolean}
         * URL should contains - "field-keywords" params
         * OR
         * URL should contains - "k:" params
         * OR
         * URL should contains - "/s" path
         * AND
         * parameters "field-keywords" or "rh" or "k" must contain the value
         */
        return (getDecodedUrl(url).indexOf("field-keywords=") > -1 ||
            getDecodedUrl(url).indexOf("k:") > -1 ||
            getDecodedUrl(url).indexOf("/s") > -1) &&
            (keyword != null && keyword.length > 0);
    }

    function isSellerPage (url) {
        return getDecodedUrl(url).indexOf("me=") > -1;
    }

    function isParsableType (url) {
        var containsAmazon, isDetails, isSeller, isCategory, isKeyword, isAmazonTop;

        containsAmazon = getDecodedUrl(url).indexOf("www.amazon.") > -1;
        isDetails = isDetailsPage(url);
        isAmazonTop = isAmazonTopPage(url);
        isCategory = isCategoryPage(url);
        isKeyword = isKeywordPage(url);
        isSeller = isSellerPage(url);

        return containsAmazon && (isDetails || isAmazonTop || isCategory || isKeyword || isSeller);
    }

    return {
        isParsableType: function (url) {
            return isParsableType(url);
        },
        isDetailsPage: function (url) {
            return isDetailsPage(url);
        },
        isAmazonTopPage: function (url) {
            return isAmazonTopPage(url);
        },
        isCategoryPage: function (url) {
            return isCategoryPage(url);
        },
        isKeywordPage: function (url) {
            return isKeywordPage(url);
        },
        isSellerPage: function (url) {
            return isSellerPage(url);
        }
    };
}());

/**
 * Functions for working with asins
 */

Helper.asins = (function () {
    this.asinUrlRegex = /(dp|product|asin)\/(B[0-9A-Z]{9}|(97(8|9))?\d{9}(\d|X))/;
    this.asinRegex = /^(B[0-9A-Z]{9}|[0-9]{9}(X|[0-9]))$/;

    function getAsinFromUrl (url) {
        var match;
        var asin;
        if (asinUrlRegex.test(url)) {
            match = asinUrlRegex.exec(url);
            asin = match[2];
            return asin;
        }
        return "";
    }

    function isAsinValid (asin) {
        return asin != null && asin.length > 0 && asinRegex.test(asin);
    }

    return {
        getAsinFromUrl: function (url) {
            return getAsinFromUrl(url);
        },
        isAsinValid: function (asin) {
            return isAsinValid(asin);
        }
    };
}());

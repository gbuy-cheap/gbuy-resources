/**
 * This function performs checks on strings.
 *
 * @type {{isInt}} returns true if a string is an integer number.
 */
Helper.StringChecker = (function () {
    return {
        isInt: function (str) {
            return str >>> 0 === parseFloat(str);
        }
    };
}());

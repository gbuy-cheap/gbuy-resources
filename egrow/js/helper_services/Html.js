/**
 * Provides helper functions for html escaping
 * @type {{flip}}
 */
Helper.html = (function () {
    function replace_all (text, find, new_one) {
        var re = new RegExp(find, "g");
        return text.replace(re, new_one);
    }

    return {
        escape: function (html) {
            return replace_all(
                replace_all(
                    html, "%(?![0-9a-fA-F]{2})", "%25"
                ), "\\+", "%2B"
            );
        }
    };
}());

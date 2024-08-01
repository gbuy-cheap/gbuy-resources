/**
 * Provides helper functions for Strings
 * @type {{shortenTo, escapeHTML}}
 */
Helper.string = (function () {
    return {
        shortenTo: function (text, length) {
            if (length < text.length) {
                text = text.substring(0, length) + "...";
            }

            return text;
        },
        escapeHTML: function (text) {
            return text
                .replace(/&/g, "&amp;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
        }
    };
}());

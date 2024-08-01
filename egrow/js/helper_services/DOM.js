/**
 * Provides helper functions for formatting the DOM
 */

Helper.DOM = (function () {
    /**
     *
     * @type {string[]}
     * @private
     */
    this._ITEMS_TO_BE_REMOVED = [
        "script",
        "style",
        "#egrowModal",
        // Scripts + styles + tags
        "iframe",
        "noscript",
        "hr",
        "link",
    ];
    function formatDocument (newDocument) {
        // delete a carousel element from capture HTML
        // to exclude error -> "A preload for <URL>
        // is found, but is not used because the request credentials mode does not match.
        // Consider taking a look at crossorigin attribute".
        newDocument.querySelectorAll(this._ITEMS_TO_BE_REMOVED.join(","))
            .forEach(function (element) {
                if (null != element) {
                    element.remove();
                }
        });

        return newDocument.body.innerHTML;
    }

    /**
     *
     * @param {Document} documentText - initial Document
     * @returns {Document} - erased Document
     */
    function clearDocument (newDocument) {
        newDocument.body.innerHTML = formatDocument(newDocument);
        return newDocument;
    }

    return {
        toString: function (rootDocument) {
            const newDocument = document.implementation.createHTMLDocument("New Page");
            newDocument.body.innerHTML = rootDocument.body.innerHTML;
            return formatDocument(newDocument);
        },
        formatString: function (documentText) {
            const newDocument = document.implementation.createHTMLDocument("New Page");
            newDocument.body.innerHTML = documentText;
            return formatDocument(newDocument);
        },
        parseDocument: function (documentText) {
            const newDocument = document.implementation.createHTMLDocument("New Page");
            newDocument.body.innerHTML = documentText;
            return clearDocument(newDocument);
        }
    };
}());

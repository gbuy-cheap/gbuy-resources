/**
 * Base html component of the Chrome Extension in the content area. It provides
 * the function to retrieve the unique selector of the corresponding element.
 */
class HtmlComponent {
    /**
     * @param selector is the unique identifier of the corresponding html element.
     */
    constructor (selector) {
        this._selector = selector;
    }

    get selector () {
        return this._selector;
    }

    hide () {
        $(this.selector).hide();
    }

    display () {
        $(this.selector).show();
    }
}

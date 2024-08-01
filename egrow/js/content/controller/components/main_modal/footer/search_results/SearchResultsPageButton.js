/**
 * It represents the base button for buttons which needs to be displayed for
 * search results (keyword rankings). If the page is not a search results page
 * the buttons are hidden by default.
 */
class SearchResultsPageButton extends ButtonComponent {
    constructor (selector) {
        super(selector);

        // Hide button if not a keyword page
        if (!Helper.ParserChecker.isKeywordPage(location.href)) {
            super.hide();
        }
    }
}

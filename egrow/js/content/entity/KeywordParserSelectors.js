/**
 * Entity which is used to determine which selector will be used by the
 * {@link KeywordParser}.
 */
class KeywordParserSelectors {
    constructor (documentText) {
        if ($(documentText).find("#s-result-count").length !== 0) {
            this.toolBarSelector = "#s-result-count";
        } else {
            this.toolBarSelector = ".s-desktop-toolbar";
        }
    }

    getToolBarSelector () {
        return this.toolBarSelector;
    }
}

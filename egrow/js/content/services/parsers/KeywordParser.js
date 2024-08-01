/**
 * Is the parser that parses the searched keyword from the document text.
 */
class KeywordParser {
    /**
     * @param documentText is the html text from the amazon page.
     * @returns {string} which represents the searched keyword.
     */
    getKeyword (documentText) {
        const selectors = new KeywordParserSelectors(documentText);
        const resultsElement = $(documentText).find(selectors.getToolBarSelector());
        const keyword = $(resultsElement).find(".a-color-state").first().text();
        return keyword.replace(/"/g, "");
    }
}

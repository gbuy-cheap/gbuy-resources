/**
 * Represents the button for the KW & Niche Tool. When clicked the user is
 * forwarded to the KW & Niche Tool with the keyword applied in the filters.
 */
class KeywordNicheToolButton extends SearchResultsPageButton {
    constructor () {
        super("#keywordNicheToolButton");
    }

    onClick (event) {
        const documentText = Helper.DOM.toString(document);

        const keyword = ContentServices.keywordParser.getKeyword(documentText);

        const finalUrl = this._getFinalUrl(location.href, keyword);

        window.open(finalUrl, "_blank");
    }

    _getFinalUrl (url, keyword) {
        const urlObj = new URL(url);

        const base = Helper.MemberArea.getBase(urlObj.host);

        const destinationUrl = base + "member/keyword-niche-tool";

        return destinationUrl + "?keyword=" + encodeURIComponent(keyword);
    }
}

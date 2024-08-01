/**
 * It is a global service which generates a file name for export or
 * screenshots based on the page the user is currently on.
 */
class FileNameService {
    getFileName (defaultFileName, fileEnding) {
        let resultsText = "";
        let productText, isAmazonTopText, categoryText, keywordText, sellerText;

        let resultsElement = document.getElementById("s-result-count");

        if (null == resultsElement) {
            resultsElement = document.querySelector("[data-component-type=\"s-result-info-bar\"]");
        }

        const hasProduct = Helper.ParserChecker.isDetailsPage(document.URL);
        const isAmazonTop = Helper.ParserChecker.isAmazonTopPage(document.URL);
        const hasCategory = Helper.ParserChecker.isCategoryPage(document.URL);
        const hasKeyword = Helper.ParserChecker.isKeywordPage(document.URL);
        const hasSeller = Helper.ParserChecker.isSellerPage(document.URL);

        if (hasProduct) {
            const url = decodeURIComponent(document.URL);
            productText = Helper.asins.getAsinFromUrl(url);
        } else if (isAmazonTop) {
            isAmazonTopText = this._getAmazonTopCategory();
        } else {
            if (hasCategory) {
                categoryText = this._getCategoryText(resultsElement);
            }
            if (hasKeyword) {
                keywordText = this._getResultsText(resultsElement);
            }
            if (hasSeller) {
                sellerText = this._getSellerText(resultsElement, hasKeyword);
            }
        }

        if (hasProduct) {
            resultsText = "Product_" + productText + "_";
        } else if (isAmazonTop) {
            resultsText = this._getAmazonPageTitle(defaultFileName) + isAmazonTopText + "_";
        } else {
            if (hasCategory) {
                resultsText = resultsText + "Category_" + categoryText + "_";
            }
            if (hasSeller) {
                resultsText = resultsText + "Seller_" + sellerText + "_";
            }
            if (hasKeyword) {
                resultsText = resultsText + "Keyword_" + keywordText + "_";
            }
        }

        if (!resultsText) {
            resultsText = defaultFileName;
        }

        return resultsText + Helper.date.getDateToday() + fileEnding;
    }

    _getAmazonTopCategory () {
        const titleElement = document.getElementById("zg_listTitle");
        return $(titleElement).find(".category").text();
    }

    _getResultsText (resultsElement) {
        const text = $(resultsElement).find(".a-color-state").first().text();
        return text.replace(/"/g, "").replace(/\s/g, "_");
    }

    _getSellerText (resultsElement, hasKeyword) {
        if (!hasKeyword) { // No keyword available just the seller name
            return $(resultsElement).find(".a-color-state").text();
        } else {
            return $(resultsElement).find(".a-color-base").text();
        }
    }

    _getAmazonPageTitle (defaultFileName) {
        var amazonPageTitle = "";
        var pageTitleElement = document.getElementById("zg_banner_text_wrapper");
        if (pageTitleElement != null) {
            amazonPageTitle = pageTitleElement.innerText.replace("Amazon ", "") + "_";
        } else {
            amazonPageTitle = defaultFileName;
        }
        return amazonPageTitle;
    }

    _getCategoryText(resultsElement) {
        let text = $(resultsElement).find(".a-color-state").first().text();

        if (null == text || "" === text) {
            text = $(".nav-search-dropdown.searchSelect").find("option[selected=\"selected\"]")[0].innerText;
        }

        return text.replace(/"/g, "").replace(/\s/g, "_");
    }
}

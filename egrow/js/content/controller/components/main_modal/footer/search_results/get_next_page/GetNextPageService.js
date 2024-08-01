/**
 * It contains all the logic to retrieve the url for retrieving the next page
 * of products. It is used in the button {@link GetNextPageButton}.
 */
class GetNextPageService {

    static _DEPRECATED_SELECTORS = new GetNextPageSelectors(
        "#pagnNextLink",
        "#pagn .pagnLink a,#pagn .pagnDisabled",
        "#pagn .pagnLink a,#pagn .pagnDisabled",
        ".pagnCur"
    );

    static _OLD_SELECTORS = new GetNextPageSelectors(
        ".a-pagination .a-last a",
        ".a-pagination .a-disabled", // Is used when the last page is disabled e.g. 25 and you are on page 1
        ".a-pagination .a-normal",  // Is used when the last page is not disabled e.g. 3 and you are on page 1
        ".a-pagination .a-selected");

    static _NEW_SELECTORS = new GetNextPageSelectors(
        '.s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator',
        '.s-pagination-item.s-pagination-disabled:not(.s-pagination-previous)', // Is used when the last page is disabled e.g. 25 and you are on page 1
        'a.s-pagination-item.s-pagination-button:nth-last-child(2)', // Is used when the last page is not disabled e.g. 3 and you are on page 1
        'span.s-pagination-item.s-pagination-selected');

    constructor() {
        this._currentPageNumber = null;
        this._previousPageUrlPath = null;
    }

    /**
     * @returns {Promise<string>} resolve holds the url path for the next page
     *          and reject indicates that the last page has been scraped.
     */
    getNextPageUrlPath() {

        let selectors;
        switch (true) {
            case this._useDeprecatedSelectors():
                selectors = GetNextPageService._DEPRECATED_SELECTORS;
                break;
            case this._useOldSelectors():
                selectors = GetNextPageService._OLD_SELECTORS;
                break;
            default:
                selectors = GetNextPageService._NEW_SELECTORS;
                break;
        }

        if (null == this._currentPageNumber) {
            this._currentPageNumber = Helper.number.toNumber($(selectors.currentPageNumber).text());
        }

        let _currentPageNumber = this._currentPageNumber;
        let _previousPageUrlPath = this._previousPageUrlPath;

        const _amazonHasNextPage = this._amazonHasNextPage(selectors);

        if (null == _previousPageUrlPath) {
            _previousPageUrlPath = $(selectors.nextPageButton).attr("href");
        }

        const previousPageNumber = _currentPageNumber;

        const nextPageNumber = _currentPageNumber + 1;

        // Get updated globally for the next page
        if (null != _previousPageUrlPath) {
            _previousPageUrlPath = _previousPageUrlPath.replace("page=" + previousPageNumber, "page=" + nextPageNumber);
            _currentPageNumber++;
        }

        this._currentPageNumber = _currentPageNumber;
        this._previousPageUrlPath = _previousPageUrlPath;

        return new Promise(function (resolve, reject) {
            if (_amazonHasNextPage) {
                resolve(_previousPageUrlPath);
            } else {
                reject();
            }
        });
    }

    _useDeprecatedSelectors() {
        return $(GetNextPageService._DEPRECATED_SELECTORS.nextPageButton).length > 0;
    }

    _useOldSelectors() {
        return $(GetNextPageService._OLD_SELECTORS.nextPageButton).length > 0;
    }

    _amazonHasNextPage(selectors) {

        let lastPageNumber;
        const nextPageElement = $(selectors.nextPageButton);

        if (1 === nextPageElement.length) {

            const href = $(nextPageElement).attr('href');

            if (typeof href !== typeof undefined && href !== false) {
                lastPageNumber = this._getLastPageNumber(selectors.lastPageNumber, selectors.fallbackLastPageNumber);
                if (null == this._currentPageNumber) {
                    this._currentPageNumber = parseInt($(selectors.currentPageNumber).text());
                }
                if (this._currentPageNumber < lastPageNumber) {
                    return true;
                }
            }
        }

        return false;
    }

    _getLastPageNumber(selector, fallbackSelector) {

        let pageNumber = 0;
        let lastPageNumberElement = $(selector).last();
        let lastPageNumberElementFallback = $(fallbackSelector).last();
        if (null != lastPageNumberElement && this._isTextInteger(lastPageNumberElement.text())) {
            pageNumber = parseInt(lastPageNumberElement.text());
        } else if (null != lastPageNumberElementFallback && this._isTextInteger(lastPageNumberElementFallback.text())) {
            pageNumber = parseInt(lastPageNumberElementFallback.text());
        } else if (null != lastPageNumberElement) {

            let href = $(lastPageNumberElement).attr('href');

            if (typeof href !== typeof undefined && href !== false) {
                const url = new URL(this._getFullUrl(href));
                pageNumber = url.searchParams.get("page"); // Last element with a link
            } else {
                pageNumber = lastPageNumberElement.text(); // Last element which is disabled
            }

            if (null != pageNumber && 0 < pageNumber.length) {
                pageNumber = parseInt(pageNumber);
            }
        }
        return pageNumber;
    }

    _isTextInteger(elementText) {
        return Helper.StringChecker.isInt(elementText);
    }

    _getFullUrl(href) {
        return "https://" + window.location.hostname + href;
    }
}

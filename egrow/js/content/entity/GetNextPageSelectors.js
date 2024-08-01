/**
 * This functions is the entity which is used by the parser of the next page
 * url for the "get next page button".
 *
 * @param nextPageButton holds the selector for the <a> element of the
 *                       "Next" button on the amazon page.
 * @param lastPageNumber holds the selector for the element of the
 *                       last page number.
 * @param fallbackLastPageNumber holds the fallback selector for the last page
 *                               number.
 * @param currentPageNumber holds the selector for the element with the
 *                          current page number.
 * @constructor
 */
function GetNextPageSelectors (nextPageButton, lastPageNumber, fallbackLastPageNumber, currentPageNumber) {
    this.nextPageButton = nextPageButton;
    this.lastPageNumber = lastPageNumber;
    this.fallbackLastPageNumber = fallbackLastPageNumber;
    this.currentPageNumber = currentPageNumber;
}

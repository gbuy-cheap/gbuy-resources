/**
 * This is the object which is used to handle all parsed ASINs from the Amazon Page.
 * On the details page the value {@field _isDetailsPage} is set to true so no
 * duplicate products are scraped and displayed in the CE.
 */
class AsinsFromPage {

    /**
     * @param initialRows {number} is the number of rows already in the table
     */
    constructor (initialRows) {
        this.positionAsins = [];
        this.toScrapeAsins = [];
        this._uniqueAsins = new Set();
        this._isDetailsPage = false;
        this._rowNumber = initialRows + 1;
    }
    
    withUniqueAsins() {
        this._isDetailsPage = true;
        return this;
    }

    add(asin, isSponsored, href = `/dp/${asin}?psc=1`) {
        if (Helper.asins.isAsinValid(asin)) {
            const asinFromPage = new AsinFromPage(asin, isSponsored, this._rowNumber, href);

            /**
             * If not details page = true
             * If details page and not duplicate asin = true
             */
            if (!this._isDetailsPage || !this._uniqueAsins.has(asin)) {
                this.positionAsins.push(asinFromPage);
                this._rowNumber++;
            }

            // Scrape only unique asins
            if (!this._uniqueAsins.has(asin)) {
                this.toScrapeAsins.push(asinFromPage);
                this._uniqueAsins.add(asin);
            }
        }
    };
}

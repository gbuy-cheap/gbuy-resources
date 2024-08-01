/**
 * It holds the logic of how the entered filters are applied on the results table.
 * It sets all input fields with the saved filter on init and provides the function
 * to apply a user filter.
 */
class ProductTableFilters extends ProductTableComponent {

    // Filters
    static _HIDE_SPONSORED_PRODUCTS = false;
    static _FILTERS = {};
    static _COLUMN_NAMES = [];
    static _SELLER_TYPES = ["FBM", "FBA", "AMZ"];

    constructor(dataTable) {
        super("#tableFilters", dataTable);
    }

    // Filter functions
    static _SPONSORED_FILTER = function (settings, searchData, index, product) {
        if (ProductTableFilters._HIDE_SPONSORED_PRODUCTS === false) {
            return true;
        } else {
            return product.isSponsored === false;
        }
    };

    static _SELLER_FILTER = function (settings, searchData, index, product, counter) {
        if (3 === ProductTableFilters._SELLER_TYPES.length) {
            return true;
        } else if (null != product && null != product.buy_box_owner) {

            let sellerType;
            switch (product.buy_box_owner.type) {
                case "Amazon":
                    sellerType = "AMZ";
                    break;
                case "FBA":
                    sellerType = "FBA";
                    break;
                case "NoneFBA":
                    sellerType = "FBM";
                    break;
                default:
            }

            /**
             * When checkbox is marked the seller is included in the list.
             * When all checkboxes are marked it is set to true;
             *
             * @type {boolean}
             */
            return ProductTableFilters._SELLER_TYPES.includes(sellerType);
        }
    };

    static _MIN_MAX_FILTER = function (settings, searchData, dataIndex, product, counter) {
        if (0 === Object.keys(ProductTableFilters._FILTERS).length
            && 0 === ProductTableFilters._COLUMN_NAMES.length) {
            return true;
        } else {
            /**
             * If one of the columns matches the condition:
             * --> true is returned and negated here.
             * It means the product does not pass all filters.
             */
            return !ProductTableFilters._COLUMN_NAMES.some(function (columnName) {

                let value = null;
                switch (columnName) {
                    case "price":
                        if(null != product.price){
                            value = product.price.value;
                        }
                        break;
                    case "net":
                        if(null != product.net){
                            value = product.net.value;
                        }
                        break;
                    case "weight":
                        if(null != product.weight){
                            value = product.weight.value;
                        }
                        break;
                    case "revenue":
                        if (null != product.sales_metrics && product.sales_metrics.estimated_monthly_revenue) {
                            value = product.sales_metrics.estimated_monthly_revenue.value;
                        }
                        break;
                    case "bsr":
                        if (null != product.main_bsr_category) {
                            value = product.main_bsr_category.rank;
                        }
                        break;
                    case "rating":
                        if (null != product.reviews) {
                            value = product.reviews.avg_rating;
                        }
                        break;
                    case "reviews":
                        if (null != product.reviews) {
                            value = product.reviews.count;
                        }
                        break;
                    case "sales":
                        if (null != product.sales_metrics) {
                            value = product.sales_metrics.estimated_monthly_sales;
                        }
                        break;
                    case "lqs":
                        value = product.listing_quality_score;
                        break;
                    default:
                }

                // Get min & max value
                const formName = columnName.charAt(0).toUpperCase() + columnName.slice(1);
                const min = parseFloat(ProductTableFilters._FILTERS["min" + formName]);
                const max = parseFloat(ProductTableFilters._FILTERS["max" + formName]);

                /**
                 * If value is null --> true is returned (don't include the row)
                 * If row meets all filters --> false is returned
                 */
                return null == value || !((isNaN(min) && isNaN(max)) ||
                    (isNaN(min) && value <= max) ||
                    (min <= value && isNaN(max)) ||
                    (min <= value && value <= max));
            });
        }
    };

    init() {
        // Nothing needs to be initialized
    }

    /**
     * @param hideSponsoredProducts {boolean} if true products are hidden and
     *        shown otherwise
     */
    applySponsored(hideSponsoredProducts) {
        ProductTableFilters._HIDE_SPONSORED_PRODUCTS = hideSponsoredProducts;
        this._applyFilter(hideSponsoredProducts, ProductTableFilters._SPONSORED_FILTER);
        this._dataTable.draw();
    }

    /**
     * Updates the filter object and the column names so the correct filter is applied.
     * @param formInputs is an array [{name: formName, value: formValue},...]
     * @returns {boolean} true if the filters are applied and false otherwise
     */
    applyFormFilters(formInputs) {

        ProductTableFilters._FILTERS = {};
        ProductTableFilters._COLUMN_NAMES = [];
        ProductTableFilters._SELLER_TYPES = [];

        Object.keys(formInputs).forEach(function (key) {

            const singleFilter = formInputs[key];
            if (null != singleFilter) {

                // Get filter entry
                const filterName = singleFilter["name"];
                const filterValue = singleFilter["value"];

                if (null != filterName && null != filterValue && 0 < filterValue.toString().length) {
                    if (-1 < filterName.indexOf("Seller")) {
                        if (-1 < filterValue.indexOf("on")) { // Only add if selected
                            ProductTableFilters._SELLER_TYPES.push(filterName.substr(0, 3));
                        }
                    } else {
                        ProductTableFilters._FILTERS[filterName] = filterValue;
                        ProductTableFilters._COLUMN_NAMES.push(filterName.toLowerCase().substring(3));
                    }
                }
            }
        });

        const hasMinMaxFilters = 0 < Object.keys(ProductTableFilters._FILTERS).length;
        this._applyFilter(hasMinMaxFilters, ProductTableFilters._MIN_MAX_FILTER);

        const hasSellerFilter = 3 > ProductTableFilters._SELLER_TYPES.length;
        this._applyFilter(hasSellerFilter, ProductTableFilters._SELLER_FILTER);

        // Draw the table and apply new filters
        this._dataTable.draw();

        return hasMinMaxFilters || hasSellerFilter;
    }

    /**
     * @param addFilter {boolean} if true filter is added otherwise removed
     * @param filterFunction is the function to be added/removed
     * @private
     */
    _applyFilter(addFilter, filterFunction) {
        if (addFilter) {
            this._addFilter(filterFunction);
        } else {
            this._removeFilter(filterFunction);
        }
    }

    /**
     * Adds the filter if it is not already presents or no filters are
     * present at all.
     *
     * @param filterFunction is the function to be added
     * @private
     */
    _addFilter(filterFunction) {
        if (0 === $.fn.dataTable.ext.search.length
            || $.fn.dataTable.ext.search.every((fn => fn.name !== filterFunction.name)))
        {
            $.fn.dataTable.ext.search.push(filterFunction);
        }
    }

    /**
     * Remove filter by filtering through all existing filters if any are available.
     *
     * @param filterFunction is the function to be removed
     * @private
     */
    _removeFilter(filterFunction) {
        if (0 < $.fn.dataTable.ext.search.length) {
            $.fn.dataTable.ext.search = $.fn.dataTable.ext.search.filter(fn => fn.name !== filterFunction.name);
        }
    }
}

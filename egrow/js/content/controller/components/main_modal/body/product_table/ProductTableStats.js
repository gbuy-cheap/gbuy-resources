class ProductTableStats extends ProductTableComponent {
    constructor (dataTable) {
        super("#egrowTableStats", dataTable);
    }

    init () {

        const getRowData = () => this._getRowData();

        return new Promise(function (resolve) {

            const rowData = getRowData();

            const bsrStats = new StatsContainerBsr();
            const osStats = new StatsContainerOpportunityScore();
            const priceStats = new StatsContainerPrice();
            const revenueStats = new StatsContainerRevenue();
            const revenueTotalStats = new StatsContainerRevenueTotal();
            const reviewsStats = new StatsContainerReviews();
            const salesStats = new StatsContainerSales();

            const currencySymbol = AmazonMarkets.getMarket(location.href).currency;
            priceStats.setTooltip(currencySymbol, "Averaged price of all products");
            priceStats.setCurrencySymbol(currencySymbol);

            revenueStats.setTooltip(currencySymbol, "Averaged monthly revenue of all products");
            revenueStats.setCurrencySymbol(currencySymbol);

            const refresh = new MessageBackground(MESSAGE_BACKGROUND_ACTIONS.REFRESH_AVERAGE_VALUES, null, rowData);
            chrome.runtime.sendMessage(refresh, function (response) {
                if (response && response.isSuccess) {
                    const values = response.value.avgValues;

                    bsrStats.updateValues(values.bsr);
                    priceStats.updateValues(values.price);
                    revenueStats.updateValues(values.revenue);
                    revenueTotalStats.updateValues(values.revenue);
                    reviewsStats.updateValues(values.reviews);
                    salesStats.updateValues(values.sales);

                    osStats.updateValue(Helper.number.formatToNumber(values.oss.avg, 0));
                }
            });

            resolve();
        })
    }

    _getRowData () {
        return {
            prices: this._getNumRowData("price"),
            bsrs: this._getNumRowData("bsr"),
            reviews: this._getNumRowData("reviews"),
            sales: this._getNumRowData("sales"),
            revenues: this._getNumRowData("revenue"),
            oss: this._getNumRowData("os")
        };
    }

    _getNumRowData(colName) {
        const rowData = [];

        const tableData = this.dataTable.rows({search: "applied"}).data();

        if (0 < tableData.count()) {

            tableData.each(function (product, index) {

                let value;
                switch (colName) {
                    case "price":
                        value = null != product.price ? product.price.value : null;
                        break;
                    case "bsr":
                        value = null != product.main_bsr_category ? product.main_bsr_category.rank : null;
                        break;
                    case "reviews":
                        value = null != product.reviews ? product.reviews.count : null;
                        break;
                    case "sales":
                        value = null != product.sales_metrics ? product.sales_metrics.estimated_monthly_sales : null;
                        break;
                    case "revenue":
                        value = null != product.sales_metrics && null != product.sales_metrics.estimated_monthly_revenue ? product.sales_metrics.estimated_monthly_revenue.value : null;
                        break;
                    case "os":
                        value = null != product.opportunity_score ? product.opportunity_score : null;
                        break;
                    default:
                        value = null;
                }

                if (null != value) {
                    rowData.push(value);
                }
            });
        }

        return rowData;
    }
}

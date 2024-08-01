/**
 * It represents the export button which exports all the filtered data
 * from the product table to a csv file.
 */
class ExportButton extends ButtonComponent {
    constructor () {
        super("#exportButton");
        this.amazonMarket = AmazonMarkets.getMarket(location.href);
    }

    onClick () {

        const dataTable = CONTENT.components.mainModal.body.table.dataTable;

        const displayedColumnHeaders = [];

        const columnHeaders = dataTable.columns(".export").header();
        const columnsConfiguration = Array.from(dataTable.settings().init().columns);
        const columnNames = [];
        columnsConfiguration.forEach((column, index) => {
            if(column.className.includes("export")) {
                columnNames.push(column.name);
            }
        });

        // Create displayed header names
        for (let i = 0; i < columnHeaders.length; ++i) {

            let headerName = columnHeaders[i].innerText.trim();

            let headerUnit;
            switch (headerName) {
                case 'Price':
                case 'Net':
                case 'Revenue':
                    headerUnit = " [" + this.amazonMarket.currency + "]";
                    break;
                case 'Weight':
                    headerUnit = " [" + this.amazonMarket.weight + "]";
                    break;
                default:
                    headerUnit = "";
            }

            displayedColumnHeaders.push(headerName + headerUnit);
        }

        const exportData = [displayedColumnHeaders];

        const products = Array.from(dataTable.rows({search:'applied'}).data()); // DTO products

        // create data rows
        for (let productIndex = 0; productIndex < products.length; productIndex++) {

            const row = [];
            const product = products[productIndex];

            for (let columnNameIndex = 0; columnNameIndex < columnNames.length; columnNameIndex++) {
                let cellValue = 'n/a';
                switch (columnNames[columnNameIndex]) {
                    case 'position':
                        cellValue = product.position;
                        break;
                    case 'asin':
                        cellValue = product.asin;
                        break;
                    case 'title':
                        cellValue = "\"" + product.title + "\"";
                        break;
                    case 'brand':
                        if (null != product.brand && null != product.brand.name) {
                            cellValue = "\"" + product.brand.name + "\"";
                        }
                        break;
                    case 'category':
                        if (null != product.main_bsr_category && null != product.main_bsr_category.category_name) {
                            cellValue = "\"" + product.main_bsr_category.category_name + "\"";
                        }
                        break;
                    case 'bsr':
                        if (null != product.main_bsr_category && null != product.main_bsr_category.rank) {
                            cellValue = Helper.number.toNumber(product.main_bsr_category.rank, 0);
                        }
                        break;
                    case 'price':
                        if (null != product.price && null != product.price.value) {
                            cellValue = Helper.number.toNumber(product.price.value, 2);
                        }
                        break;
                    case 'net':
                        if (null != product.net && null != product.net.value) {
                            cellValue = Helper.number.toNumber(product.net.value, 2);
                        }
                        break;
                    case 'weight':
                        if (null != product.weight && null != product.weight.value) {
                            cellValue = Helper.number.toNumber(product.weight.value, 2);
                        }
                        break;
                    case 'seller':
                        if (null != product.buy_box_owner && null != product.buy_box_owner.type) {
                            switch (product.buy_box_owner.type) {
                                case "Amazon":
                                    cellValue = "AMZ";
                                    break;
                                case "FBA":
                                    cellValue = "FBA";
                                    break;
                                case "NoneFBA":
                                    cellValue = "FBM";
                                    break;
                            }
                        }
                        break;
                    case 'reviews':
                        if (null != product.reviews && null != product.reviews.count) {
                            cellValue = Helper.number.toNumber(product.reviews.count, 0);
                        }
                        break;
                    case 'rating':
                        if (null != product.reviews && null != product.reviews.avg_rating) {
                            cellValue = Helper.number.toNumber(product.reviews.avg_rating, 1);
                        }
                        break;
                    case 'sales':
                        if (null != product.sales_metrics && null != product.sales_metrics.estimated_monthly_sales) {
                            cellValue = product.sales_metrics.estimated_monthly_sales;
                        }
                        break;
                    case 'revenue':
                        if (null != product.sales_metrics
                            && null != product.sales_metrics.estimated_monthly_revenue
                            && null != product.sales_metrics.estimated_monthly_revenue.value) {
                            cellValue = Helper.number.toNumber(product.sales_metrics.estimated_monthly_revenue.value, 0);
                        }
                        break;
                    case 'lqs':
                        if (null != product.listing_quality_score) {
                            cellValue = product.listing_quality_score;
                        }
                        break;
                    case 'imageId':
                        if (null != product['image_list'] && product['image_list'].length > 0) {
                            cellValue = `https://images-na.ssl-images-amazon.com/images/I/${product['image_list'][0].id}.jpg`;
                        }
                        break;

                }
                row.push(cellValue);
            }
            exportData.push(row);
        }

        const fileName = ContentServices.fileNameService.getFileName("EGROW_EXPORT_", ".csv");
        Helper.export.toCSV(fileName, exportData);
        ContentServices.analyticsTracker.trackUsageEvent(ANALYTICS_ACTION.MAIN_MODAL_FOOTER, "export", exportData.length - 1); // - 1 because of columnNames
    }
}

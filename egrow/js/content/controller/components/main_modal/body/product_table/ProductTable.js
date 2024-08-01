/**
 * It represents the product table which holds the scraped products. It contains
 * all elements from the product table and is initialized with
 * {@link ProductTableOptions}.
 */
class ProductTable extends HtmlComponent {
    constructor () {
        super("#egrowTable");

        const options = new ProductTableOptions();
        this._dataTable = $(this.selector).DataTable(options.get());

        this.filters = new ProductTableFilters(this._dataTable);
        this.stats = new ProductTableStats(this._dataTable);

        this.stats.init();
    }

    get dataTable () {
        return this._dataTable;
    }

    addRows (rows) {
        this.dataTable.rows.add(rows).draw();
    }

    getNumRows() {
        return this.dataTable.data().count();
    }

    clearRows() {
        this.dataTable.clear().draw();
    }

    // Function to resize the table and make it responsive
    // Takes the resized main modal size and assigns it to the products table so that they may match
    resizeTable (finalHeight) {
        let tableHeight = $("#egrowModal")[0].style.height;
        tableHeight = tableHeight.replace("px", "");
        tableHeight = parseInt(tableHeight);
        tableHeight = tableHeight - finalHeight;
        tableHeight = tableHeight + "px";
        $(".dataTables_scrollBody")[0].style.maxHeight = tableHeight;
    }

    resize (finalHeight) {
        let modalHeight = $("#egrowModal")[0].style.height;
        let fullTableHeight = $("#egrowTable")[0].scrollHeight + finalHeight;
        modalHeight = modalHeight.replace("px", "");
        modalHeight = parseInt(modalHeight);
        // Check to see if the complete product table is displayed so that we can't increase the main modal size anymore
        if (modalHeight > fullTableHeight) {
            // Error check and its solution if the user tries to resize the modal at once
            if (parseInt($(".dataTables_scrollBody")[0].style.maxHeight.replace("px", "")) !== fullTableHeight) {
                this.resizeTable(finalHeight);
            }
            fullTableHeight = fullTableHeight + "px";
            $("#egrowModal")[0].style.height = fullTableHeight;
        } else {
            $("#egrowModal")[0].style.minHeight = "10px";
            this.resizeTable(finalHeight);
        }
    }

    redraw () {
        this._dataTable.columns.adjust().draw();
    }

    /**
     * It hides the title and action columns for the screen shot.
     * @returns {Promise<any>}
     */
    hideColumnsForScreenShot() {
        return new Promise(function (resolve) {
            $("#egrowTable_wrapper .egrow-title").hide();
            $("#egrowTable_wrapper .egrow-action").hide();
            const timeoutId = setTimeout(function () {
                resolve();
                clearTimeout(timeoutId);
            }, 100); // Need wait time so correct screenshot is created
        });
    }

    displayColumnsAfterScreenShot() {
        const timeoutId = setTimeout(function () {
            $("#egrowTable_wrapper .egrow-title").show();
            $("#egrowTable_wrapper .egrow-action").show();
            clearTimeout(timeoutId);
        }, 100); // Need wait time so correct screenshot is created
    }
}

/**
 * It represents the body of the main modal which holds the product
 * table and the table stats.
 */
class MainModalBody {
    constructor () {
        this.table = new ProductTable();
        // this.countdownBar = new CountdownBar(); Is not used anymore

        // Initial state of table
        this.table.hide();
        this.table.addRows([]);
        this.table.redraw();
    }
}

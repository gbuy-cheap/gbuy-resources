/**
 * Base component of the table which includes an {@link init} function. This
 * function is used to reinitialize various events on the specific components
 * such as columns or cells (tooltips). The function needs to be implemented in
 * the child class.
 */
class ProductTableComponent extends HtmlComponent {
    /**
     * @param selector {string}
     * @param dataTable {DataTable}
     */
    constructor (selector, dataTable) {
        super(selector);
        this._dataTable = dataTable;
    }

    init () {
        throw new Error("Need to implement function in child!");
    }

    /**
     * @returns {DataTable}
     */
    get dataTable () {
        return this._dataTable;
    }

    _addClick (clickFunction, additionalSelector = "") {
        Helper.JsEventHandler.addClick(this.selector + additionalSelector, clickFunction);
    }

    _addHover (onHoverFunction, outHoverFunction, additionalSelector = "") {
        Helper.JsEventHandler.addHover(this.selector + additionalSelector, onHoverFunction, outHoverFunction);
    }
}

/**
 * Represents the base container of the table stats.
 */
class StatsContainer extends HtmlComponent {

    static BASE_SELECTOR = "#egrowTableStats ";
    static _DEFAULT_VALUE = "—";

    constructor(selector, decimals = 0) {
        super(selector);
        this.decimals = decimals;
    }

    updateValues(values) {

        const finalSelector = StatsContainer.BASE_SELECTOR + this.selector;

        const minValue = values.min;
        const maxValue = values.max;
        const avgValue = values.avg;
        const totalValue = values.total;

        this._setValue(finalSelector + " .min-value", this._getCheckedValue(minValue, 0));
        this._setValue(finalSelector + " .max-value", this._getCheckedValue(maxValue, 0));
        this._setValue(finalSelector + " .avg-value", this._getCheckedValue(avgValue, this.decimals));
        this._setValue(finalSelector + " .total-value", this._getCheckedValue(totalValue, 0));
    }

    setTooltip(currencySymbol, text) {
        $(`${this.selector} .avg-info-icon`).attr('title', `${text} in ${currencySymbol}`);
    }

    setCurrencySymbol(currencySymbol) {
        $(`${this.selector} .avg-text .currency-symbol`).html(`[${currencySymbol}]`);
    }

    _getCheckedValue(value, decimals) {

        let formattedValue;
        if (null != value && 10000 < value) {
            formattedValue = this._getFormattedValue(value / 1000, 0) + "k";
        } else {
            formattedValue = this._getFormattedValue(value, decimals)
        }

        return formattedValue;
    }

    _getFormattedValue(value, decimals) {
        if (null != value && !isNaN(value)) {
            return Helper.number.formatToNumber(value, decimals);
        } else {
            return null;
        }
    }

    _setValue(selector, formattedValue) {

        let htmlText;

        if (null != formattedValue) {
            htmlText = formattedValue;
        } else {
            htmlText = StatsContainer._DEFAULT_VALUE;
        }

        this._setText(selector, htmlText)
    }

    _setText(selector, htmlText) {
        const element = $(selector);
        if (0 < element.length) {
            $(selector).html(htmlText);
        }
    }
}

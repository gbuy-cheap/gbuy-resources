/**
 * It represents the form of the ProfitCalculator and includes
 * functions for setting and retrieving values.
 */
class ProfitCalculatorForm extends FormComponent {
    constructor (results) {
        super("#profitCalculatorForm", function (form) {
            if (null != results) {
                results.init(form);
            }
        });

        // Submit form when it is valid
        const selector = this.selector;
        $(this.selector + " input").blur(function () {
            if ($(selector).valid()) {
                $(selector).submit();
            }
        });
    }

    set (inputId, value) {
        if (!isNaN(value)) {
            $(this.selector + " " + inputId).val(value);
        }
    }

    get (inputId) {
        return $(this.selector + " " + inputId).val();
    }
}

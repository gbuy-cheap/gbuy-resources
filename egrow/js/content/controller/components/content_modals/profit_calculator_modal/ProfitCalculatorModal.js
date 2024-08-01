/**
 * This user modal handles the interaction with the Profit Calculator. It is
 * opened whenever a user clicks on the "$" icon in the actions column. As soon
 * as the user entered all values correctly results are calculated and displayed.
 *
 * It contains of a form {@link ProfitCalculatorModal.form} and the results of
 * the calculation {@link ProfitCalculatorModal.results}.
 */
class ProfitCalculatorModal extends ContentModal {

    static _STORAGE_KEY = "profitCalculatorUserData";

    constructor() {
        super("#profitCalculatorModal");

        this.form = new ProfitCalculatorForm(this.results);
        this.results = new ProfitCalculatorResults(this.form);
        this._setCurrency();

        // Close Modal
        const fadeOutTime = this.fadeOutTime;
        const _saveUserData = () => this._saveUserData();
        const superHide = () => {
            super.hide();
            // remove an "input" event listener from form input controls when modal is closed
            $(Array.from(document.forms.profitCalculatorForm.elements)).each((index, element) => {
                $(element).off('input', null);
            });
        };
        $(this.selector + ", " + this.selector + " .close-modal").click(function (e) {
            if (e.target === this) { // Only close on modal or 'x' click
                $(".egrow-tooltip.form-tooltip").fadeOut(fadeOutTime).remove(); // Remove all invalid tooltips
                superHide();
                _saveUserData();
            }
        });
    }

    display() {
        const superDisplay = () => {
            super.display();
            // add an "input" event listener to form input controls to recalculate results
            $(Array.from(document.forms.profitCalculatorForm.elements)).each((index, element) => {
                $(element).on('input', null,  (event) => this.results.init(this.form));
            });
        };

        const getMessage = new MessageBackground(MESSAGE_BACKGROUND_ACTIONS.GET_USER_DATA, ProfitCalculatorModal._STORAGE_KEY);
        chrome.runtime.sendMessage(getMessage, (response) => {

            // User inputs
            let shippingCost = 0;
            let cpcCost = 0;
            let taxes = 10;

            if (response && response.isSuccess) {

                if (response.value) {

                    const userData = response.value;

                    if (userData.hasOwnProperty("shippingCost")) {
                        shippingCost = userData.shippingCost;
                    }
                    if (userData.hasOwnProperty("cpcCost")) {
                        cpcCost = userData.cpcCost;
                    }
                    if (userData.hasOwnProperty("taxes")) {
                        taxes = userData.taxes;
                    }
                }
            }

            this.form.set("#shippingCost", shippingCost);
            this.form.set("#cpcCost", cpcCost);
            this.form.set("#taxes", taxes);

            this.results.init(this.form);

            superDisplay();

            ContentServices.analyticsTracker.trackUsageEvent(ANALYTICS_ACTION.PROFIT_CALCULATOR_MODAL, "display");
        });
    }

    _saveUserData() {

        const shippingCost = this.form.get("#shippingCost");
        const cpcCost = this.form.get("#cpcCost");
        const taxes = this.form.get("#taxes");

        const userData = new ProfitCalculatorData(shippingCost, cpcCost, taxes);

        const saveMessage = new MessageBackground(MESSAGE_BACKGROUND_ACTIONS.SAVE_USER_DATA, ProfitCalculatorModal._STORAGE_KEY, userData);
        chrome.runtime.sendMessage(saveMessage, function (response) {
            if (response && response.isSuccess) {
                //console.log("Successfully saved data", userData);
            } else {
                //console.log("Failed to save data", response);
            }
        });
    }

    _setCurrency() {
        const market = AmazonMarkets.getMarket(location.href);
        $(this.selector + " .profit-calculator-currency").text(market.currency);
    }
}

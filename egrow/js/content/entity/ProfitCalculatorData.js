/**
 * This entity represents the format of the user data from the Profit Calculator
 * @param shippingCost
 * @param cpcCost
 * @param taxes
 * @constructor
 */
function ProfitCalculatorData (shippingCost, cpcCost, taxes) {
    this.shippingCost = shippingCost;
    this.cpcCost = cpcCost;
    this.taxes = taxes;
}

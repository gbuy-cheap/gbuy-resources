/**
 * This class represents the results of the entered user data into the form
 * of the profit calculator.
 */
class ProfitCalculatorResults extends HtmlComponent {
    constructor (form) {
        super("");
        this.init(form);
    }

    init (form) {
        const productPrice = form.get("#productPrice");
        const productCost = form.get("#productCost");
        const shippingCost = form.get("#shippingCost");
        const cpcCost = form.get("#cpcCost");
        const taxes = form.get("#taxes");
        const estimatedMonthlySales = form.get("#estimatedMonthlySales");

        let profitPerProduct = "n/a";
        let netMargin = "n/a";
        let estimatedMonthlyProfit = "n/a";

        let totalFBAFee = $("#totalFBAFee").text();

        if (!isNaN(totalFBAFee)) {
            totalFBAFee = Math.abs(totalFBAFee);
            profitPerProduct = this._calculateProfitPerProduct(productPrice, productCost, shippingCost, cpcCost, taxes, totalFBAFee);
            netMargin = this._calculateNetMargin(productPrice, profitPerProduct);
            estimatedMonthlyProfit = this._calculateMonthlyProfit(profitPerProduct, estimatedMonthlySales);

            profitPerProduct = Helper.number.toNumber(profitPerProduct, 2);
            netMargin = Helper.number.toNumber(netMargin, 2);
            estimatedMonthlyProfit = Helper.number.formatToString(Helper.number.formatToNumber(estimatedMonthlyProfit, 0));
        }

        this.set("#profitPerProduct", profitPerProduct);
        this.set("#netMargin", netMargin);
        this.set("#estimatedMonthlyProfit", estimatedMonthlyProfit);
    }

    set (resultId, value) {
        const numValue = Number(Helper.number.toNumber(value, 1));

        if (!isNaN(numValue) && numValue > 0) {
            $(resultId).addClass("profitable");
            $(resultId).removeClass("not-profitable");
        } else {
            $(resultId).addClass("not-profitable");
            $(resultId).removeClass("profitable");
        }
        $(resultId).text(value);
    }

    _calculateProfitPerProduct (productPrice, productCost, shippingCost, cpcCost, taxes, totalFBAFee) {
        return productPrice * (1 - taxes / 100) - productCost - shippingCost - cpcCost - totalFBAFee;
    }

    _calculateNetMargin (productPrice, profitPerProduct) {
        return (profitPerProduct / productPrice) * 100;
    }

    _calculateMonthlyProfit (profitPerProduct, estimatedMonthlySales) {
        return profitPerProduct * estimatedMonthlySales;
    }
}

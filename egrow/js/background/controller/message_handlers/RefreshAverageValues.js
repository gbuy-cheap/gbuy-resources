/**
 * Message handler which refreshes the average values of the selected
 * table products in the content area.
 */
class RefreshAverageValues extends MessageHandler {
    constructor () {
        super(MESSAGE_BACKGROUND_ACTIONS.REFRESH_AVERAGE_VALUES);
    }

    handle (resolve, reject, request) {
        const content = request.value;
        const response = {
            avgValues: this._calculate(content.prices, content.bsrs, content.reviews, content.sales, content.revenues, content.oss),
            currencySymbol: BackgroundSession.AmazonMarket.currency
        };
        resolve(Response.success(response));
    }

    _getAvg (numberArray) {
        const cleanedArray = Helper.array.clean(numberArray);

        if (cleanedArray.length === 0) {
            return null;
        }

        const sum = this._getSum(cleanedArray);

        return sum / numberArray.length;
    }

    _getSum (numberArray) {
        const cleanedArray = Helper.array.clean(numberArray);

        if (cleanedArray.length === 0) {
            return null;
        }

        let sum = 0;
        for (let i = 0; i < cleanedArray.length; i++) {
            const value = cleanedArray[i];
            if (value != null) {
                sum += value;
            }
        }

        return sum;
    }

    _calculate (prices, bsrs, reviews, sales, revenues, oss) {
        const avgValues = {
            price: {
                min: prices.min(),
                max: prices.max(),
                avg: this._getAvg(prices)
            },
            bsr: {
                min: bsrs.min(),
                max: bsrs.max(),
                avg: this._getAvg(bsrs)
            },
            reviews: {
                min: reviews.min(),
                max: reviews.max(),
                avg: this._getAvg(reviews)
            },
            sales: {
                min: sales.min(),
                max: sales.max(),
                avg: this._getAvg(sales)
            },
            revenue: {
                min: revenues.min(),
                max: revenues.max(),
                avg: this._getAvg(revenues),
                total: this._getSum(revenues)
            },
            oss: {}
        };

        if (oss != null && oss.length > 0) {
            avgValues.oss.avg = this._getAvg(oss) / 10; // Scale to 0-10
        } else {
            avgValues.oss.avg = 0; // Should show default value
        }

        return avgValues;
    }
}

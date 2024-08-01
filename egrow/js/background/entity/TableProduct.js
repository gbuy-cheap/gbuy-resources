/**
 * Represents the entity product which is used in the background to generate
 * the row data.
 */
class TableProduct {
    /**
     * @param apiProduct is the product which is returned by the CE_API.
     */
    constructor (apiProduct) {
        this.asin = null;
        this.title = null;
        this.weight = null;
        this.brand = null;
        this.price = null;
        this.amountReviews = null;
        this.averageRating = null;
        this.sellerType = null;
        this.mainBsrRank = null;
        this.mainBsrCategory = null;
        this.net = null;
        this.fee = null;
        this.estimatedMonthlySales = null;
        this.estimatedMonthlyRevenue = null;
        this.imageId = null;
        this.lqs = null;
        this.os = null;

        if (null != apiProduct) {
            if (null != apiProduct.asin) {
                this.asin = apiProduct.asin;
            }

            if (null != apiProduct.title) {
                this.title = apiProduct.title;
            }

            if (null != apiProduct.weight && null != apiProduct.weight.value ) {
                this.weight = Helper.number.toNumber(apiProduct.weight.value, 2);
                if (BackgroundSession.AmazonMarket.weight !== "kg") {
                    this.weight = (this.weight * 2.20462).toFixed(2);
                }
            }

            if (null != apiProduct.brand && null != apiProduct.brand.name) {
                this.brand = apiProduct.brand.name;
            }

            if (null != apiProduct.image_list && apiProduct.image_list.length > 0) {
                this.imageId = apiProduct.image_list[0].id;
            }

            if (null != apiProduct.price && null != apiProduct.price.value) {
                this.price = Helper.number.toNumber(apiProduct.price.value, 2);
            }

            if (null != apiProduct.reviews ) {
                if (null != apiProduct.reviews.count) {
                    this.amountReviews = Helper.number.toNumber(apiProduct.reviews.count, 0);
                }

                if (null != apiProduct.reviews.avg_rating) {
                    this.averageRating = Helper.number.toNumber(apiProduct.reviews.avg_rating, 1);
                }
            }

            if (null != apiProduct.buy_box_owner && apiProduct.buy_box_owner.type) {
                switch (apiProduct.buy_box_owner.type) {
                    case "Amazon":
                        this.sellerType = "AMZ";
                        break;
                    case "FBA":
                        this.sellerType = "FBA";
                        break;
                    case "NoneFBA":
                        this.sellerType = "FBM";
                        break;
                }
            }

            if (null != apiProduct.main_bsr_category) {
                if(null != apiProduct.main_bsr_category.rank) {
                    this.mainBsrRank = Helper.number.toNumber(apiProduct.main_bsr_category.rank, 0);
                }

                if (null != apiProduct.main_bsr_category.category_name){
                    this.mainBsrCategory = apiProduct.main_bsr_category.category_name;
                }
            }

            if (null != apiProduct.net && null != apiProduct.net.value) {
                this.net = Helper.number.toNumber(apiProduct.net.value, 2);
                this.fee = this.price - this.net;
                this.fee = Helper.number.toNumber(this.fee, 2);
            }

            if (null != apiProduct.sales_metrics) {
                if (null != apiProduct.sales_metrics.estimated_monthly_sales) {
                    this.estimatedMonthlySales = Helper.number.toNumber(apiProduct.sales_metrics.estimated_monthly_sales, 0);
                }

                if (null != apiProduct.sales_metrics.estimated_monthly_revenue &&
                    null != apiProduct.sales_metrics.estimated_monthly_revenue.value) {
                    const revenueValue = apiProduct.sales_metrics.estimated_monthly_revenue.value;
                    this.estimatedMonthlyRevenue = Helper.number.toNumber(revenueValue, 0);
                }
            }

            if (null != apiProduct.listing_quality_score) {
                this.lqs = (apiProduct.listing_quality_score / 10) | 0;
            }

            if (null != apiProduct.opportunity_score) {
                this.os = apiProduct.opportunity_score;
            }
        }
    }
}

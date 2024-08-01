/**
 * Represents the entity product which is used in the background to generate
 * the row data.
 */
class Product {
    /**
     * @param apiProduct is the product which is returned by the API.
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
        this.mainBsr = null;
        this.mainBsrCategory = null;
        this.net = null;
        this.fee = null;
        this.estimatedSales = null;
        this.estimatedRevenue = null;
        this.imageId = null;
        this.lqs = null;
        this.os = null;
        this.isSponsored = false; // Default value
        this.isTracked = false; // Default value

        if (apiProduct != null) {
            if (apiProduct.amazon_id != null) {
                this.asin = apiProduct.amazon_id;
            }

            if (apiProduct.title != null) {
                this.title = apiProduct.title;
            }

            if (apiProduct.weight != null) {
                this.weight = Helper.number.toNumber(apiProduct.weight, 2);
                if (BackgroundSession.AmazonMarket.weight !== "kg") {
                    this.weight = (this.weight * 2.20462).toFixed(2);
                }
            }

            if (apiProduct.brand != null) {
                this.brand = apiProduct.brand;
            }

            if (apiProduct.image_list != null) {
                this.imageId = apiProduct.image_list.id;
            }

            if (apiProduct.price != null) {
                this.price = Helper.number.toNumber(apiProduct.price, 2);
            }

            if (apiProduct.amount_reviews != null) {
                this.amountReviews = Helper.number.toNumber(apiProduct.amount_reviews, 0);
            }

            if (apiProduct.avg_rating != null) {
                this.averageRating = Helper.number.toNumber(apiProduct.avg_rating, 1);
            }

            if (apiProduct.seller != null && apiProduct.seller.type) {
                switch (apiProduct.seller.type) {
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

            if (apiProduct.bsr_list != null &&
                apiProduct.bsr_list.rank != null &&
                apiProduct.bsr_list.category != null) {
                this.mainBsr = Helper.number.toNumber(apiProduct.bsr_list.rank, 0);
                this.mainBsrCategory = apiProduct.bsr_list.category;
            }

            if (apiProduct.net != null) {
                this.net = Helper.number.toNumber(apiProduct.net, 2);
                this.fee = this.price - this.net;
                this.fee = Helper.number.toNumber(this.fee, 2);
            }

            if (apiProduct.est_sales != null &&
                apiProduct.est_sales.ms != null) {
                this.estimatedSales = Helper.number.toNumber(apiProduct.est_sales.ms, 0);
            }

            if (apiProduct.est_rev != null) {
                this.estimatedRevenue = Helper.number.toNumber(apiProduct.est_rev, 0);
            }

            if (apiProduct.lqs != null) {
                this.lqs = (apiProduct.lqs / 10) | 0;
            }

            if (apiProduct.opportunityScore != null) {
                this.os = apiProduct.opportunityScore;
            }
        }
    }
}

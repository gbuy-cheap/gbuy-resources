/**
 * Represents the entity product which is used  to generate
 * the row dummy data.
 */
class ProductDto {
    constructor (asin) {
        this.asin = asin;
        this.title = null;
        this.weight = null;
        this.brand = null;
        this.price = null;
        this.image_list = { id: null };
        this.amount_reviews = null;
        this.avg_rating = null;
        this.seller = { type: null };
        this.bsr_list = { rank: null, category: null };
        this.net = null;
        this.fee = null;
        this.est_sales = { ms: null };
        this.est_rev = null;
        this.lqs = null;
        this.os = null;
        this.isSponsored = false; // Default value
        this.isTracked = false; // Default value
    }
}

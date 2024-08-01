/**
 * It is a helper class of the {@link SponsoredProductsButton} and holds the
 * state of whether sponsored products are shown or not.
 */
class SponsoredProductsService {
    constructor () {
        this._isSponsoredHidden = false;
    }

    hideSponsoredProducts () {
        this._isSponsoredHidden = !this._isSponsoredHidden;
        const isSponsoredHidden = this._isSponsoredHidden;

        return new Promise(function (resolve, reject) {
            if (isSponsoredHidden) {
                resolve();
            } else {
                reject(new Error("isSponsored is not hidden."));
            }
        });
    }
}

/**
 * Singleton service which represents the tool Product Tracker. It is used
 * to add products (asins) to the Product Tracker so the user can analyse them
 * in the member area in the app.
 */
class ProductTracker {

    /**
     * @param resolve
     * @param reject
     */
    get(resolve, reject) {
        Boundary.endpointProductTracker.getTrackedProducts().then(function (trackedProducts) {
            const trackedProductsAsin = [];

            trackedProducts.forEach(trackedProduct => {
                trackedProductsAsin.push(trackedProduct.asin);
            });

            resolve(trackedProductsAsin);
        }).catch(error => reject(Response.failure(error)));
    }

    /**
     * It adds a product (asin) to the product tracker.
     *
     * @param resolve is used to resolve a successful request
     * @param reject is used to resolve a failed request
     * @param request contains the asin
     */
    add (resolve, reject, request) {
        const asin = request.value.asin;
        const putRequest = Boundary.endpointProductTracker.addTrackedProduct(asin);
        this._resolveRequest(resolve, reject, asin, putRequest);
    }

    /**
     * It deletes a tracked product from the product tracker.
     *
     * @param resolve is used to resolve a successful request
     * @param reject is used to resolve a failed request
     * @param request contains the asin
     */
    delete (resolve, reject, request) {
        const asin = request.value.asin;
        const deleteRequest = Boundary.endpointProductTracker.deleteTrackedProduct(asin);
        this._resolveRequest(resolve, reject, asin, deleteRequest);
    }

    _resolveRequest (resolve, reject, asin, apiRequest) {
        apiRequest.then(function () {
            resolve(Response.success());
        }).catch(function (xhr) {
            const response = Boundary.AppApi.formatError(xhr);
            reject(Response.failure(response));
        });
    }
}

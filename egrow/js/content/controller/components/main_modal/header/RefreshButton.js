/**
 * It represents the button which refreshes the products of the current page
 * by sending a new request to the background.
 *
 * After the request was successfully performed the amount of requests which
 * is saved with the key {@link RefreshButton._REQUEST_KEY} is increased.
 * After the increment a check whether the rating modal or the feedback modal
 * can be shown is performed.
 */
class RefreshButton extends MainModalHeaderElement {

    constructor() {
        super("#refreshButton");
        this.player = null;
    }

    onClick(event) {
        event.stopImmediatePropagation(); // stop event bubbling
        event.preventDefault(); // stop the default click behavior for the <a> tag

        // Start refresh only if data has been loaded successfully
        if (null != this.player && this.player.playState !== "running") {
            const timeoutId = setTimeout(() => {
                ContentServices.scrapeProductsService.scrapeCurrentPageProducts()
                    .finally(() => {
                        ContentServices.analyticsTracker.trackUsageEvent(ANALYTICS_ACTION.MAIN_MODAL_HEADER, "refresh");

                        clearTimeout(timeoutId);
                    });
            }, 0);
        }
    }

    /**
     * Starts the rotation of the icon in the refresh button
     * to indicate loading of products.
     */
    startRotation() {
        this.player = $(this.selector + " i")[0].animate(
            [
                {transform: "rotate(0deg)"},
                {transform: "rotate(360deg)"}
            ],
            {
                duration: 2000,
                easing: "linear",
                iterations: Infinity
            });
    }

    /**
     * Stops the rotation of the icon in the refresh button.
     */
    stopRotation() {
        this.player.cancel();
    }

    isRotating() {
        return this.player.playState === "running";
    }
}

/**
 * Singleton service which cleans the html from a requested details page and
 * prepares it to be send to the API. It is necessary to clean out the html
 * as otherwise the upload would take too much time and bandwith.
 */
class HtmlCleaner {

    static _DETAILS_PAGE_IDS = ["#dp", "#gc-detail-page"];

    static _NOT_REQUIRED_ELEMENTS = [

        // Scripts + styles + tags
        "script",
        "style",
        "iframe",
        "noscript",
        "hr",
        "link",

        // Ads
        "#sims-consolidated-1_feature_div",
        "#sims-consolidated-2_feature_div",
        "#sims-consolidated-3_feature_div",
        "#sims-consolidated-4_feature_div",
        "#sims-consolidated-5_feature_div",
        "#sponsoredProducts2_feature_div",
        "#dp-ads-middle_feature_div",
        "#dp-ads-center-promo_feature_div",
        "#va-related-videos-widget_feature_div",
        "#aplus_feature_div",
        "#dp-ads-center-promo_feature_div",
        "#ape_Detail_ad-endcap-1_Glance_placement",
        "#ad",
        ".copilot-secure-display",

        // top offer in "dp" container
        "#percolate-ui-ilm_div",
        "#prime_div",
        "#cp-merchandising-widget_div",

        // ajax
        "#ajaxBlockComponents_feature_div",

        // popover
        ".a-popover-preload",
        "#globalStoreBadgePopover_feature_div",

        // Similar products
        "#dpx-mirai-btf-shopbylook_feature_div",
        "#dpx-btf-hlcx-comparison_feature_div",

        // Reviews
        "#reviewsMedley",

        // Tell a friend
        "#tell-a-friend",

        // Ask Questions
        "#ask_lazy_load_div",
        "#ask-dp-search_feature_div",
        ".a-container.askDetailPageSearchWidgetSection",
        "#cf-ask-cel",

        // Prime
        "#nav-prime-menu",
        "#nav-prime-tooltip",

        // Error elements
        "#atwl-inline-error",
        "#atwl-inline-error-msg",

        // Whishlist
        "#add-to-wishlist-button-group",
        "#addToWishlist_feature_div",

        // cart
        "#addToCart_feature_div",
        "#preAddToCartFramework_feature_div",

        // buy now
        "#buyNow_feature_div",

        // Inventory Selector
        "#selectQuantity",

        // Price feedback
        "#pricingFeedbackDiv",
        "#egrowModal",

        // ads for best sellers page
        "#zg-other-container",

        // carousels
        "div.a-begin.a-carousel-container",

        "div.site-stripe-margin-control",

        // reviews
        "#reviewsMedley",

        // spinner
        "#all-offers-display-spinner",
        "#atwl-dd-spinner-holder",

        // error holder
        "#atwl-dd-error-holder",
        "#atwl-dd-unavail-holder",
        ".variationUnavailable",

        // UI
        "#aod-background",
        "#video-outer-container",
        "#image-canvas-caption",


        // unrecognized
        "div[id*=\"btf-content\"]",
        "div[id*=\"btf-center\"]",
        "div[cel_widget_id=\"ask-swdp-desktop\"]",
        "span[id*=\"mbc-buybutton-addtocart\"]",
        "#oneClick_feature_div",
        "#glowContextualIngressPt_feature_div",
        "#warrantyCETech",
        "#makoPreRegistration",
        "#makoCETech",
        "#accessoryUpsellAmabot_feature_div",
        "#accessoryUpsellBtf_feature_div",
        "#unifiedLocation_feature_div",
        "#digitalDashHighProminence_feature_div",
        "#marsAccessoryUpsell_feature_div",
        "#atwl-inline",
        "#prsubswidget_feature_div",
        "#tellAFriendBox_feature_div",
        "#trustMessage_feature_div",
        "#addToRegistry_feature_div",
        "#instantOrderUpdate_feature_div",
        "#companyCompliancePolicies_feature_div",
        "#pegasus_feature_div",
        "#noFlashContent",
        "#twister-main-image",
        "#thumbs-image",
        "#alternativeOfferEligibilityMessaging_feature_div",
        "#customConditionInline_feature_div",
        "#outOfCountry_feature_div",
        "#olpLinkWidget_feature_div",
        "#uss_feature_div",
        "#ussInit_feature_div",
        "#smileEligibility_feature_div",
        "#holidayAvailabilityMessage_feature_div",
        "#twister_feature_div",
        "#clickToContact_feature_div",
        "#valuePick_feature_div",
        "#renewedProgramDescriptionAtf_feature_div",
        "#renewedProgramDescriptionBtf_feature_div",
        "#aplusBrandStory_feature_div",
        "#productOverview_feature_div",
        "#globalStoreInfoBullets_feature_div",
        "#amazonGlobal_feature_div",
        "#vendorPoweredCoupon_feature_div",
        "#addOnItem_feature_div",
        "#heroQuickPromo_feature_div",
        "#hover-zoom-end",
        "#twisterJsInitializer_feature_div",

        // com.au additional content B07RL71N7W
        ".apm-tablemodule-table",


        // payments offer/description
        "#sopp_feature_div",

        // video inside left side image thumbnails list
        ".videoCountTemplate",

        // delivery to
        "#contextualIngressPtLabel_deliveryShortLine",
        "#dynamicDeliveryMessage_feature_div",
        "#promiseBasedBadge_feature_div",
        "#pmpux_feature_div",
        "#cashOnDelivery_feature_div",
        "#b2bUpsell_feature_div",
        "#applicablePromotionList_feature_div",
        "#inemi_feature_div",
        "#iconfarmv2_feature_div",

        // badge
        "#acBadge_feature_div",

        // similarities
        ".similarities-widget",
        "#HLCXComparisonWidget_feature_div",

        // secure transaction
        "#secureTransaction_feature_div",

        // add gift
        "#detailPageGifting_feature_div",

        // ask about product form/widget
        "#ask-swdp-desktop",

        // Related brands
        ".sb-carousel", // https://www.amazon.com/dp/B07HDXT9MF

        // Title of related brands
        ".MultiBrandCreativeDesktop", // https://www.amazon.com/dp/B07HDXT9MF

        // Special offers & promotions
        "#quickPromoBucketContent", // https://www.amazon.com/dp/B07HDXT9MF

        // Important information
        "#importantInformation_feature_div", // https://www.amazon.com/dp/B07HDXT9MF

        // Disclaimer
        "#storeDisclaimer_feature_div", // https://www.amazon.com/dp/B07HDXT9MF

        // Instant recommendations
        "#miraiBTFShopByLook_feature_div", // https://www.amazon.com/dp/B07C7YMPRX

        // From the manufacturer
        "#dpx-aplus-product-description_feature_div", // https://www.amazon.sa/dp/B083B1CDMG/?th=1

        // slider
        "#aod-close", // close button
        "#aod-filter", // just a filter
        "#aod-filter-list", // filter options
        "#aod-pinned-offer-main-content-show-more", //"show more" button
        "#aod-pinned-offer-main-content-show-less", //"show less" button
        "#pinned-image-id", // product image
        "#aod-asin-title", // product description (title)

        "#va-related-videos-widget_feature_div",
        "#aplus_feature_div",
        ".ui-helper-hidden-accessible", // empty elements at the end of the body element
        "#dpx-mirai-btf-shopbylook_feature_div", // "Receive-instant-suggestions" container on details page
        "promotions_feature_div",
        "dpx-btf-hlcx-comparison_feature_div",
        "#rhf", // "You-recently-viewed" container at the bottom
        "#zg-other-container", // ads for best sellers page
        ".a-popover-preload",
        "div.a-begin.a-carousel-container" // All carousels that contain JSON data
    ];

    static _CLEAN_REGEX = new RegExp(
        "(" +

        // Comments
        "<!--(.*?)-->" +

        // Base64 images
        "|src=(\"|\\')(\\n|)data:image/jpeg;base64((.|\\n)*?)(\"|\\')" +

        // Json ads data
        "|data-ad-details=(\\\"|\\\\')(.*?)(\\\"|\\\\')" +

        // Json popover data
        "|data-a-popover=(\\\"|'){.+}(\\\"|')" +

        // Json carousel options
        // "|data-a-carousel-options=(\\\"|'){.+}(\\\"|')" +

        "|data-feature-details=(\\\"|'){.+}(\\\"|')" +

        // Json state data
        "|data-state=(\\\"|'){.+}(\\\"|')" +

        // Inline styles
        "|style=(\\\"|\\\\')(.*?)(\\\"|\\\\')" +

        // New lines
        "|\\n" +

        ")", "g");

    constructor() {
        this.numDpIds = HtmlCleaner._DETAILS_PAGE_IDS.length;
    }


    /**
     * It cleans the provided html string from not required elements,
     * comments, base64 images, json data and inline text fragments.
     *
     * @param html {string} is the html string of a product details page
     * @returns {string} is the cleaned html string
     */
    clean(html) {

        let start = new Date().getTime();

        const newDocument = this._getNewDocument(html);

        const searchBar = newDocument.querySelector("#searchDropdownBox");

        let dp = null;

        let i = 0;
        while (null == dp && i < this.numDpIds) {
            const dpId = HtmlCleaner._DETAILS_PAGE_IDS[i];
            dp = newDocument.querySelector(dpId);
            i++;
        }

        if (null == dp) {
            dp = newDocument.querySelector("#a-page"); // fallback if id was not found
        }

        this._removeNotRequiredElements(newDocument);

        this._removeUnselectedOptions(searchBar);
        return searchBar.outerHTML + dp.innerHTML.replace(HtmlCleaner._CLEAN_REGEX, "");
    }

    /**
     *
     * @param {string} html
     * @returns {string}
     */
    cleanSliderHTML(html) {
        const dom = this._getNewDocument(html);
        let cleanedHTML = '<span></span>';
        const offersContent = dom.body.querySelector('#all-offers-display-scroller');

        if (null != offersContent) {
            this._removeNotRequiredElements(dom);
            cleanedHTML = dom.body.innerHTML.replace(HtmlCleaner._CLEAN_REGEX, "");
        }


        return cleanedHTML;
    }

    /**
     *
     * @param {string} mainHTML
     * @param {string} appendHTML
     * @returns {string}
     */
    combineHTML(mainHTML, appendHTML = '') {
        const mainDocument = this._getNewDocument(mainHTML);
        mainDocument.body.insertAdjacentHTML('beforeend', appendHTML);

        return mainDocument.body.innerHTML;
    }

    /**
     * @param html {string} is the html string of a product details page
     * @returns {Document} the new document to work with
     * @private
     */
    _getNewDocument(html) {
        const newDocument = document.implementation.createHTMLDocument("New Page");
        newDocument.body.innerHTML = html;
        return newDocument;
    }

    /**
     * It removes all elements from {@link HtmlCleaner._NOT_REQUIRED_ELEMENTS}.
     *
     * @param newDocument
     * @private
     */
    _removeNotRequiredElements(newDocument) {
        newDocument.querySelectorAll(HtmlCleaner._NOT_REQUIRED_ELEMENTS.join(",")).forEach(e => {
            if (null != e) {
                e.remove();
            }
        });
    }

    /**
     * It removes the unselected categories from the search bar as they are
     * not required for the parser.
     *
     * @param searchBar
     * @private
     */
    _removeUnselectedOptions(searchBar) {
        searchBar.querySelectorAll("option")
            .forEach(e => {
                if (!e.hasAttribute("selected")) {
                    e.remove();
                }
            });
    }
}

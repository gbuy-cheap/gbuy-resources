/**
 * It represents the options for the {@link DataTable} which is initialized
 * in the {@link ProductTable}.
 */
class ProductTableOptions {

    static NOT_SET_PLACEHOLDER = "—";
    static MIN_SALES = 5;
    static MarketplaceId = Helper.MemberArea.getMarketPlaceId(location.host);
    static CURRENCY_SYMBOL = AmazonMarkets.getMarket(location.href).currency;
    static LOCALE_WEIGHT = AmazonMarkets.getMarket(location.href).weight;
    static _NO_VALUE_CSS_CLASS_NAME = "no-value";

    constructor() {

        $.fn.dataTableExt.oSort['num-pre'] = function(cellValue) {
            if(cellValue === ProductTableOptions.NOT_SET_PLACEHOLDER) {
                return Infinity;
            } else {
                return cellValue;
            }
        };

        this._staticOptions = {
            dom: "t",
            pageScrollPos: 0, // default start value is used for scrolling while loading
            "scrollY": "400px",
            "scrollCollapse": true,
            "paging": false,
            "order": [[0, "asc"]], // Ascending to the No. column
            /**
             * The pre and draw callback methods are used to allow scrolling
             * while data is loaded so it does not jump to the top on every row
             * created.
             */
            "preDrawCallback": function (settings) {
                this.pageScrollPos = $('#egrowModal div.dataTables_scrollBody').scrollTop();
            },
            "drawCallback": function (settings) {
                $('#egrowModal div.dataTables_scrollBody').scrollTop(this.pageScrollPos);
            },
            "initComplete": function(settings, json) {

                const selector = "#egrowTable_wrapper";

                // Set header tooltips
                $(selector).find("thead .egrow-no").attr("title", "Ranking in search results");
                $(selector).find("thead .egrow-action").attr("title", "Action icons of the Member Area");
                $(selector).find("thead .egrow-category").attr("title", "Main category of product");
                $(selector).find("thead .egrow-bsr").attr("title", "Amazon Best Seller Rank of main category");
                $(selector).find("thead .egrow-price").attr("title", `Price of the buy box in ${ProductTableOptions.CURRENCY_SYMBOL}`);
                $(selector).find("thead .egrow-net").attr("title", `Net of the product in ${ProductTableOptions.CURRENCY_SYMBOL}`);
                $(selector).find("thead .egrow-weight").attr("title", "Product weight");
                $(selector).find("thead .egrow-seller").attr("title", "Seller type of the buy box");
                $(selector).find("thead .egrow-reviews").attr("title", "Number of reviews");
                $(selector).find("thead .egrow-avg-reviews").attr("title", "Average review rating");
                $(selector).find("thead .egrow-sales").attr("title", "Estimated monthly sales");
                $(selector).find("thead .egrow-revenue").attr("title", `Estimated monthly revenue in ${ProductTableOptions.CURRENCY_SYMBOL}`);
                $(selector).find("thead .egrow-lqs").attr("title", "Listing Quality Score");

                $(selector + " thead th.egrow-col").on('click', () => {
                    CONTENT.components.mainModal.body.table.redraw();
                });

                Helper.tooltips.init(selector); // Is needed because table has a different selector
            },
            "createdRow": function (row, data, index) {

                const REMOVE_PRODUCT_ICON_SELECTOR = " .remove-product-icon";
                const RANKING_NUMBER_SELECTOR = " .ranking-number";

                // Add hover for row to display remove icon
                Helper.JsEventHandler.addHover(row, function () {
                    $(row).find(REMOVE_PRODUCT_ICON_SELECTOR).show();
                    $(row).find(RANKING_NUMBER_SELECTOR).hide();
                }, function () {
                    $(row).find(REMOVE_PRODUCT_ICON_SELECTOR).hide();
                    $(row).find(RANKING_NUMBER_SELECTOR).show();
                });

                // Initial hide of remove icon elements
                $(row).find(REMOVE_PRODUCT_ICON_SELECTOR).hide();

                // Add remove click for row
                Helper.JsEventHandler.addClick($(row).find(".remove-product-icon"), function () {

                    Helper.tooltips.destroy(this);

                    $(row).fadeOut(200, function () {
                        CONTENT.components.mainModal.body.table.dataTable.row(row).remove().draw();
                        CONTENT.components.mainModal.body.table.stats.init();
                    });

                    ContentServices.analyticsTracker.trackUsageEvent(ANALYTICS_ACTION.PRODUCT_TABLE, 'delete_row');
                });

                if (index % 10 === 0) { // reduce the load
                    CONTENT.components.mainModal.body.table.stats.init();
                }
            },
            "columns": [
                {
                    name: "position",
                    targets: 0,
                    data: "position",
                    render: (position, type) => {
                        if (PRODUCT_TABLE_REQUESTED_TYPE.DISPLAY === type) {
                            return `<a title='Remove Product' href="javascript:void(0);"><span ><i class="far fa-trash-alt remove-product-icon" style="display: none;"></i></a><span class="ranking-number">${position}</span>`;
                        }
                        return position;
                    },
                    title: "#", className: "egrow-col egrow-no export", orderable: true, type: 'num'
                },
                {
                    name: "asin",
                    targets: 1,
                    data: "asin",
                    render: ProductTableOptions._getSimpleValue,
                    title: "Asin", className: "egrow-col egrow-asin export", visible: false, orderable: false
                },
                {
                    name: "sponsored",
                    targets: 2,
                    data: "isSponsored",
                    render: ProductTableOptions._getSimpleValue,
                    title: "Sponsored", className: "egrow-col egrow-sponsored", visible: false, orderable: false
                },
                {
                    name: "actions",
                    targets: 3,
                    data: null,
                    render: (dto, type, product, meta) => {
                        if (PRODUCT_TABLE_REQUESTED_TYPE.DISPLAY === type) {
                            const productTrackerElements = this._getProductTrackerElements(product);
                            const reverseAsinSearchElement = this._getReverseAsinSearchElement(product);
                            const profitCalculatorElement = this._getProfitCalculatorElement();
                            return reverseAsinSearchElement + productTrackerElements + profitCalculatorElement;
                        } else {
                            return '';
                        }
                    },
                    title: "Actions", className: "egrow-col egrow-action", orderable: false,
                    createdCell: function (td, cellData, product) {

                        Helper.JsEventHandler.addClick($(td).find(".profit-calculator-action"), function () {

                            let price = "";
                            if (null != product.price) {
                                price = product.price.value;
                            }

                            let fee = "n/a";
                            if (null != product.fee && null != product.fee.value) {
                                fee = `-${Helper.number.formatToNumber(product.fee.value, 2)}`;
                            }

                            let weight = "";
                            if (null != product.weight) {
                                weight = product.weight.value;
                            }

                            let monthlySales = "";
                            if (null != product.sales_metrics && null != product.sales_metrics.estimated_monthly_sales) {
                                monthlySales = product.sales_metrics.estimated_monthly_sales;
                            }

                            CONTENT.components.profitCalculatorModal.form.set("#productPrice", price);
                            CONTENT.components.profitCalculatorModal.results.set("#totalFBAFee", fee);
                            CONTENT.components.profitCalculatorModal.form.set("#estimatedMonthlySales", monthlySales);

                            CONTENT.components.profitCalculatorModal.display();
                        });

                        const addElement = $(td).find("a.add");
                        const deleteElement = $(td).find("a.delete");

                        // Adding Product to Product Tracker
                        Helper.JsEventHandler.addClick(addElement, function () {
                            var message = new MessageBackground(MESSAGE_BACKGROUND_ACTIONS.ADD_TRACKED_PRODUCT, null, {asin: product.asin});
                            chrome.runtime.sendMessage(message, function (response) {
                                alertify.logPosition("top right");
                                if (response && response.isSuccess) {
                                    alertify.success("Product successfully added.");
                                    ContentServices.analyticsTracker.trackUsageEvent(ANALYTICS_ACTION.PRODUCT_TABLE, "add_product");
                                    addElement.hide();
                                    deleteElement.show();
                                } else {
                                    if (response.value.modal === "limit") {
                                        alertify.error("Failed to add product.");
                                        CONTENT.components.limitationProductTrackerModal.display(response.value.userMessage);
                                    } else {
                                        alertify.error("Extension Error");
                                        CONTENT.components.errorModal.display(response.value.userMessage);
                                    }
                                }
                            });
                        });

                        // Removing Product from Product Tracker
                        Helper.JsEventHandler.addClick(deleteElement, function () {
                            var message = new MessageBackground(MESSAGE_BACKGROUND_ACTIONS.DELETE_TRACKED_PRODUCT, null, {asin: product.asin});
                            chrome.runtime.sendMessage(message, function (response) {
                                alertify.logPosition("top right");
                                if (response.isSuccess) {
                                    alertify.success("Product successfully deleted.");
                                    ContentServices.analyticsTracker.trackUsageEvent(ANALYTICS_ACTION.PRODUCT_TABLE, "delete_product");
                                    addElement.show();
                                    deleteElement.hide();
                                } else {
                                    alertify.error("Failed to remove product.");
                                }
                            });
                        });
                    }
                },
                {
                    name: "title",
                    targets: 4,
                    data: "title",
                    defaultContent: ProductTableOptions.NOT_SET_PLACEHOLDER,
                    render: (title, type, product, meta) => {
                        switch (type) {
                            case PRODUCT_TABLE_REQUESTED_TYPE.DISPLAY:
                                return product.isSponsored ? `<i class="fas fa-ad" title="Sponsored Product"></i> ${title}` : title;
                            case PRODUCT_TABLE_REQUESTED_TYPE.FILTER:
                            case PRODUCT_TABLE_REQUESTED_TYPE.SORT:
                            case PRODUCT_TABLE_REQUESTED_TYPE.TYPE:
                            default:
                                return title;
                        }
                    },
                    title: "Title", className: "egrow-col egrow-title nowrap export", orderable: true,
                    createdCell: function (td, cellData, product) {

                        Helper.JsEventHandler.addClick(td, function () {
                            const asin = product.asin;
                            const tabUrl = "https://" + window.location.host + "/dp/" + asin + "/?psc=1";
                            // use chrome -> tabs -> create to create a sender object with a url parameter to avoid an error
                            // in "getMarket()" and in the CE_API constructor
                            const openNewTabMessage = new MessageBackground(MESSAGE_BACKGROUND_ACTIONS.OPEN_NEW_TAB, null, tabUrl);
                            chrome.runtime.sendMessage(openNewTabMessage, function(){});
                        });

                        Helper.JsEventHandler.addHover(td, function () {
                            const imageCode = product.image_list.length > 0 ? product.image_list[0].id : null;
                            const title = product.title || '\u2014'; // EM DASH
                            const productPrice = 'price' in product && 'formatted' in product.price ? product.price.formatted : 'n/a';
                            const price = `<p class="egrow-user-modal-price"> ${productPrice} </p>`;
                            const reviews = ProductTableOptions._getModalReviewsElement(product.reviews.count, product.reviews.avg_rating);

                            CONTENT.components.imageModal.display(imageCode, title, price, reviews);
                        }, () => CONTENT.components.imageModal.hide());
                    }
                },
                {
                    name: "brand",
                    targets: 5,
                    data: "brand.name",
                    render: ProductTableOptions._getSimpleValue,
                    defaultContent: ProductTableOptions.NOT_SET_PLACEHOLDER,
                    title: "Brand", className: "egrow-col egrow-brand nowrap export", orderable: true,
                    createdCell: function (td, cellData, product) {
                        if (ProductTableOptions.NOT_SET_PLACEHOLDER !== cellData) {
                            $(td).attr("title", cellData);
                        } else {
                            $(td).attr("title", "No registered brand was found.")
                        }
                    }
                },
                {
                    name: "category",
                    targets: 6,
                    data: "main_bsr_category.category_name",
                    defaultContent: ProductTableOptions.NOT_SET_PLACEHOLDER,
                    render: ProductTableOptions._getSimpleValue,
                    title: "Category", className: "egrow-col egrow-category nowrap export", orderable: true,
                    createdCell: function (td, cellData, product) {
                        if (ProductTableOptions.NOT_SET_PLACEHOLDER !== cellData) {
                            $(td).attr("title", cellData);
                        } else {
                            $(td).attr("title", "No main BSR category was found.");
                        }
                    }
                },
                {
                    name: "bsr",
                    targets: 7,
                    data: "main_bsr_category.rank",
                    defaultContent: ProductTableOptions.NOT_SET_PLACEHOLDER,
                    render: (dto, type) => {
                        if (null != dto) {
                            switch (type) {
                                case PRODUCT_TABLE_REQUESTED_TYPE.DISPLAY:
                                    return Helper.number.formatToString(dto);
                                case PRODUCT_TABLE_REQUESTED_TYPE.FILTER:
                                case PRODUCT_TABLE_REQUESTED_TYPE.SORT:
                                case PRODUCT_TABLE_REQUESTED_TYPE.TYPE:
                                default:
                                    return dto;
                            }
                        }
                    },
                    title: "BSR", className: "egrow-col egrow-bsr export", orderable: true,
                    createdCell: function (td, cellData) {
                        if (ProductTableOptions.NOT_SET_PLACEHOLDER === cellData) {
                            $(td).attr("title", "No main BSR category was found.").addClass(ProductTableOptions._NO_VALUE_CSS_CLASS_NAME);
                        }
                    }, type: 'num'
                },
                {
                    name: "price",
                    targets: 8,
                    data: "price",
                    defaultContent: ProductTableOptions.NOT_SET_PLACEHOLDER,
                    render: (dto, type) => ProductTableOptions._getFormattedValue(dto, type),
                    title: `Price <small>[${ProductTableOptions.CURRENCY_SYMBOL}]</small>`,
                    className: "egrow-col egrow-price export", orderable: true,
                    createdCell: function (td, cellData) {
                        // fix title display and add class as cellData is empty {} if price is not available
                        if (!cellData.hasOwnProperty('value')) {
                            $(td).attr("title", "No price was found.").addClass(ProductTableOptions._NO_VALUE_CSS_CLASS_NAME);
                        }
                    },
                    type: 'num'
                },
                {
                    name: "net",
                    targets: 9,
                    data: "net",
                    defaultContent: ProductTableOptions.NOT_SET_PLACEHOLDER,
                    render: (dto, type) => ProductTableOptions._getFormattedValue(dto, type),
                    title: `Net <small>[${ProductTableOptions.CURRENCY_SYMBOL}]</small>`,
                    className: "egrow-col egrow-net export", orderable: true,
                    createdCell: function (td, cellData, product) {

                        let tooltip;
                        if (null != product.fee && null != product.fee.value) {
                            tooltip = "FBA Fee: " + Helper.number.formatToNumber(product.fee.value, 2);
                        } else {
                            tooltip = "The Amazon FBA fee is not available. " +
                                "This can happen because a crucial information for the fee calculation" +
                                " is not available on the details page of the product.";
                        }

                        $(td).attr("title", tooltip);
                    },
                    type: 'num'
                },
                {
                    name: "fee",
                    targets: 10,
                    data: "fee",
                    render: ProductTableOptions._getFeeValue,
                    title: "Fee", className: "egrow-col egrow-fee", visible: false, orderable: false
                },
                {
                    name: "weight",
                    targets: 11,
                    data: "weight",
                    defaultContent: ProductTableOptions.NOT_SET_PLACEHOLDER,
                    render: (dto, type) => ProductTableOptions._getFormattedValue(dto, type),
                    title: `Weight <small>[${ProductTableOptions.LOCALE_WEIGHT}]</small>`,
                    className: "egrow-col egrow-weight export", orderable: true,
                    createdCell: function (td, cellData, product) {
                        if (ProductTableOptions.NOT_SET_PLACEHOLDER === cellData) {
                            $(td).attr("title", "No weight was found.");
                        }
                    },
                    type: 'num'
                },
                {
                    name: "seller",
                    targets: 12,
                    data: "buy_box_owner",
                    defaultContent: ProductTableOptions.NOT_SET_PLACEHOLDER,
                    render: (seller, type, product, meta ) => {

                        let dtoSellerType = null;
                        if (null != seller) {
                            dtoSellerType = seller.type;
                        }

                        switch (dtoSellerType) {
                            case "Amazon":
                                return "AMZ";
                            case "FBA":
                                return "FBA";
                            case "NoneFBA":
                                return "FBM";
                            default:
                                return ProductTableOptions.NOT_SET_PLACEHOLDER;
                        }
                    },
                    title: "Seller", className: "egrow-col egrow-seller export", orderable: true,
                    createdCell: function (td, seller) {

                        let dtoSellerType = null;
                        if (null != seller) {
                            dtoSellerType = seller.type;
                        }

                        let tooltip;
                        switch (dtoSellerType) {
                            case "FBA":
                                tooltip = "FBA Seller";
                                break;
                            case "Amazon":
                                tooltip = "Amazon";
                                break;
                            case "NoneFBA":
                                tooltip = "Merchant";
                                break;
                            default:
                                tooltip = "No seller type was found.";
                                break;
                        }

                        $(td).attr("title", tooltip);
                    }
                },
                {
                    name: "reviews",
                    targets: 13,
                    data: "reviews",
                    render: function (dto, type) {
                        return ProductTableOptions._getSimpleNestedValue(dto, type, 'count');// display formatted value
                    },
                    title: "Reviews", className: "egrow-col egrow-reviews export", orderable: true,
                    type: 'num'
                },
                {
                    name: "rating",
                    targets: 14,
                    data: "reviews.avg_rating", // reviews is always set
                    render: ProductTableOptions._getSimpleValue,
                    title: "Rating", className: "egrow-col egrow-avg-reviews export", orderable: true,
                    type: 'num'
                },
                {
                    name: "sales",
                    targets: 15,
                    data: "sales_metrics",
                    defaultContent: ProductTableOptions.NOT_SET_PLACEHOLDER,
                    render: function (dto, type) {
                        if (null != dto && null != dto.estimated_monthly_sales) {
                            if (ProductTableOptions.MIN_SALES < dto.estimated_monthly_sales) {
                                return ProductTableOptions._getSimpleNestedValue(dto, type, "estimated_monthly_sales")
                            } else if (PRODUCT_TABLE_REQUESTED_TYPE.DISPLAY === type) {
                                return "< " + ProductTableOptions.MIN_SALES;
                            } else {
                                return dto.estimated_monthly_sales;
                            }
                        } else {
                            return ProductTableOptions.NOT_SET_PLACEHOLDER;
                        }
                    },
                    title: "Sales", className: "egrow-col egrow-sales export", orderable: true,
                    createdCell: function (td, cellData, product) {
                        if (ProductTableOptions.NOT_SET_PLACEHOLDER === cellData || null == cellData) {
                            $(td).attr("title", "No sales because of no main BSR category.").addClass(ProductTableOptions._NO_VALUE_CSS_CLASS_NAME);
                        } else if (null != cellData.estimated_monthly_sales && ProductTableOptions.MIN_SALES > cellData.estimated_monthly_sales) {
                            $(td).attr("title", "Less than " + ProductTableOptions.MIN_SALES + " sales");
                        }
                    },
                    type: 'num'
                },
                {
                    name: "revenue",
                    targets: 16,
                    data: "sales_metrics",
                    defaultContent: ProductTableOptions.NOT_SET_PLACEHOLDER,
                    render: function (dto, type) {
                        if (null != dto) {
                            return ProductTableOptions._getFormattedValue(dto.estimated_monthly_revenue, type, 0);
                        } else {
                            return ProductTableOptions._getFormattedValue(null, type);
                        }
                    },
                    title: `Revenue <small>[${ProductTableOptions.CURRENCY_SYMBOL}]</small>`,
                    className: "egrow-col egrow-revenue export", orderable: true,
                    createdCell: function (td, cellData, product) {
                        if (null == product.sales_metrics || null == product.sales_metrics.estimated_monthly_sales) {
                            $(td).attr("title", "No revenue because of no sales").addClass(ProductTableOptions._NO_VALUE_CSS_CLASS_NAME);
                        } else if (null == product.price || null == product.price.value) {
                            $(td).attr("title", "No revenue because of no price").addClass(ProductTableOptions._NO_VALUE_CSS_CLASS_NAME);
                        }
                    },
                    type: 'num'
                },
                {
                    name: "lqs",
                    targets: 17,
                    data: "listing_quality_score",
                    render: ProductTableOptions._getSimpleValue,
                    title: "LQS", className: "egrow-col egrow-lqs export", orderable: true,
                    type: 'num'
                },
                {
                    name: "imageId",
                    targets: 18,
                    data: "image_list",
                    defaultContent: ProductTableOptions.NOT_SET_PLACEHOLDER,
                    render: function(dto) {
                        if (null != dto && 0 < dto.length) {
                            return dto[0].id;
                        }
                    },
                    title: "Image Url", className: "egrow-col egrow-img-id export", visible: false, orderable: false
                },
                {
                    name: "os",
                    targets: 19,
                    data: "opportunity_score",
                    render: ProductTableOptions._getSimpleValue,
                    title: "OS", className: "egrow-col egrow-os", visible: false, orderable: false
                }
            ]
        }
    }

    get() {
        return this._staticOptions;
    }

    _getProductTrackerElements(product) {
        const scriptElement = "href=\"javascript:void(0);\"";

        const addTitle = "title=\"Add to Product Tracker\"";
        const addDisplay = product.isTracked ? "none" : "inline";
        const addIcon = `<i class="fas fa-plus"></i>`;
        const addElement = `<a ${addTitle} ${scriptElement} asin="${product.asin}" class="add" style="display:${addDisplay}">${addIcon}</a>`;

        const deleteTitle = "title=\"Remove from Product Tracker\"";
        const deleteDisplay = product.isTracked ? "inline" : "none";
        const deleteIcon = `<i class="fas fa-times"></i>`;
        const deleteElement = `<a ${deleteTitle} ${scriptElement} asin="${product.asin}" class="delete" style="display:${deleteDisplay}">${deleteIcon}</a>`;

        return addElement + deleteElement;
    }

    _getReverseAsinSearchElement(product) {
        const titleElement = "title=\"Reverse ASIN Search\"";
        const hrefElement = `href="https://egrow.io/member/reverse-asin-research/?marketplaceId=${ProductTableOptions.MarketplaceId}&asin=${product.asin}"`;
        return `<a ${titleElement} ${hrefElement} target="_blank"> <i class="fab fa-searchengin"></i></a>`;
    }

    _getProfitCalculatorElement() {
        const titleElement = "title=\"Profit Calculator\"";
        return `<a ${titleElement} href="javascript:void(0);" class="profit-calculator-action"><i class="fas fa-dollar-sign"></i></a>`;
    }

    static _getSimpleValue(value, type) {
        if (null != value) {
            switch (type) {
                case PRODUCT_TABLE_REQUESTED_TYPE.DISPLAY:
                case PRODUCT_TABLE_REQUESTED_TYPE.FILTER:
                case PRODUCT_TABLE_REQUESTED_TYPE.SORT:
                case PRODUCT_TABLE_REQUESTED_TYPE.TYPE:
                default:
                    return value;
            }
        } else {
            return ProductTableOptions.NOT_SET_PLACEHOLDER;
        }
    }

    static _getSimpleNestedValue(value, type, key) {
        if (null != value && null != value[key]) {
            switch (type) {
                case PRODUCT_TABLE_REQUESTED_TYPE.DISPLAY:
                    return Helper.number.formatToNumber(value[key]);
                case PRODUCT_TABLE_REQUESTED_TYPE.FILTER:
                case PRODUCT_TABLE_REQUESTED_TYPE.SORT:
                case PRODUCT_TABLE_REQUESTED_TYPE.TYPE:
                default:
                    return value[key];
            }
        } else {
            return ProductTableOptions.NOT_SET_PLACEHOLDER;
        }
    }

    static _getFormattedValue(dto, type, decimals = 2) {
        if (null != dto && null != dto.formatted && null != dto.value) {
            switch (type) {
                case PRODUCT_TABLE_REQUESTED_TYPE.DISPLAY:
                    return Helper.number.formatToNumber(dto.value, decimals);
                case PRODUCT_TABLE_REQUESTED_TYPE.FILTER:
                case PRODUCT_TABLE_REQUESTED_TYPE.SORT:
                case PRODUCT_TABLE_REQUESTED_TYPE.TYPE:
                default:
                    return dto.value;
            }
        } else {
            return ProductTableOptions.NOT_SET_PLACEHOLDER;
        }
    }

    static _getFeeValue(dto, type) {
        if (null != dto && null != dto.value && null != dto.formatted) {
            return dto.formatted;
        } else {
            return ProductTableOptions.NOT_SET_PLACEHOLDER;
        }
    }

    static _getModalReviewsElement (reviews, rating) {

        let reviewsElement = "";
        let halfAddedClass = "";
        const numFullStars = rating | 0;
        let numEmptyStars = 5 - numFullStars;
        const addHalfStar = rating % 1 < 0.8 && rating % 1 >= 0.3;

        let i;
        for (i = 0; i < numFullStars; i++) {
            reviewsElement += "<i class=\"fas fa-star\" aria-hidden=\"true\"></i>";
        }

        if (addHalfStar === true) {
            halfAddedClass = "half-added";
            reviewsElement += "<i class=\"fas fa-star-half\" aria-hidden=\"true\"></i>";
            reviewsElement += "<i class=\"far half-empty-star fa-star-half " + halfAddedClass + "\" aria-hidden=\"true\"></i>";
            numEmptyStars -= 1;
        } else if (rating % 1 >= 0.8) {
            reviewsElement += "<i class=\"fas fa-star\" aria-hidden=\"true\"></i>";
            numEmptyStars -= 1;
        }

        for (i = 0; i < numEmptyStars; i++) {
            reviewsElement += "<i class=\"far fa-star " + halfAddedClass + "\"></i>";
        }

        reviewsElement += "<span class='" + halfAddedClass + "'>" + reviews + "</span>";

        return reviewsElement;
    }
}

const PRODUCT_TABLE_REQUESTED_TYPE = {
    FILTER: "filter",
    DISPLAY: "display",
    TYPE: "type",
    SORT: "sort"
};

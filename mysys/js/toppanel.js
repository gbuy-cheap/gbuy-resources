var topPanel = {
    Init: function (ASIN, Domain) {
        this.GetIfSellerCanSellASIN(ASIN, Domain);
        // this.GetIfProductCanBeSoldByFBA(ASIN, Domain);
        this.GetIfProductIsHazmat(ASIN, Domain);
        this.GenerateEbayListLink();
    },
    GetIfProductCanBeSoldByFBA: function (ASIN, Domain) {
        var url = "https://sellercentral.amazon." + Domain + "/hz/m/sourcing/inbound/eligibility?ref_=ag_src-elig_cont_src-mdp&asin=" + ASIN;
        chrome.runtime.sendMessage({ url: url, type: "simple" }, (response) => {
            try {
                if (response) {
                    const parser = new DOMParser();
                    const htmlDocument = parser.parseFromString(response.response, "text/html");
                    let resultDiv;

                    if (htmlDocument.documentElement.querySelector("#signInSubmit")) {
                        resultDiv = 'NotLogin'
                    } else {
                        resultDiv = htmlDocument.documentElement.querySelector('.a-box.a-color-alternate-background.a-text-left.fba-m-eligibility-icon-wrapper').innerHTML;
                        resultDiv += htmlDocument.documentElement.querySelector('.a-box.a-box-normal.a-text-left').innerHTML;
                    }

                    let popoverContent;
                    if (resultDiv == 'NotLogin') {
                        popoverContent = "Please login to SellerCentral."
                        $("#spEligible").html(common.WarningIcon());
                    } else {
                        // resultDiv = response.response.replaceAll('"', "'");
                        if (resultDiv.includes('This product is not currently eligible for FBA')) {
                            $("#spEligible").html(common.DangerIcon);
                        } else {
                            $("#spEligible").html(common.SuccessIcon);
                        }

                        popoverContent = resultDiv;
                    }
                    $("#spEligible svg").attr("tabindex", "0").attr("data-bs-toggle", "popover").attr("data-bs-placement", "top").addClass("pointer");

                    let elEligible = $("#spEligible svg[data-bs-toggle='popover']")[0];
                    let popoverEligible = new bootstrap.Popover(elEligible, {
                        trigger: "focus",
                        html: true,
                        title: "Product Restriction",
                        content: popoverContent
                    });

                } else {
                    errorHandler.SendErrorToAdmin(response);
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });
    },
    GetIfSellerCanSellASIN: async function (ASIN, Domain) {
        try {
            let returnData = await crwcommon.GetIfSellerCanSellASIN(ASIN, Domain);

            if (returnData) {

                $("#spReqApproval").html(returnData.icon);

                $("#spReqApproval svg").attr("tabindex", "0").attr("data-bs-toggle", "popover").attr("data-bs-placement", "top").addClass("pointer");

                let elApproval = $("#spReqApproval svg[data-bs-toggle='popover']")[0];
                if (elApproval) {
                    let popoverApproval = new bootstrap.Popover(elApproval, {
                        trigger: "focus",
                        html: true,
                        title: returnData.title,
                        content: returnData.content
                    });
                }

                if (returnData.product?.ean || returnData.product?.upc) {
                    $("#divBarcodes").removeClass("ms-d-none");
                    $("#spEAN").text(returnData.product.ean ?? "-");
                    $("#spUPC").text(returnData.product.upc ?? "-");
                }

                if (returnData.canSell) {
                    $("#spShopSell").html(`<a href="https://sellercentral.amazon.${Domain}/product-search/search?q=${ASIN}" target="_blank">${icons.ShopIcon("ms-text-success")}</a>`);
                }

            } else {
                $("#spReqApproval").html(common.WarningIcon("ms-text-dark"));

                $("#spReqApproval svg").attr("tabindex", "0").attr("data-bs-toggle", "popover").attr("data-bs-placement", "top").addClass("pointer");

                let elApproval = $("#spReqApproval svg[data-bs-toggle='popover']")[0];
                if (elApproval) {
                    let popoverApproval = new bootstrap.Popover(elApproval, {
                        trigger: "focus",
                        html: true,
                        title: "Can I Sell?",
                        content: "You need to be logged in to Amazon Seller Central to enable the alerts"
                    });
                }
            }

        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    GetIfProductIsHazmat: async function (ASIN, Domain) {
        let popoverContent = await crwcommon.GetHazmatStatus(ASIN, Domain);

        if (popoverContent) {
            $("#spHazmat").html(common.GetHazmatIconByContent(popoverContent))

            $("#spHazmat svg").attr("tabindex", "0").attr("data-bs-toggle", "popover").attr("data-bs-placement", "top").addClass("pointer");

            let elHazmat = $("#spHazmat svg[data-bs-toggle='popover']")[0];
            if (elHazmat) {
                let popoverApproval = new bootstrap.Popover(elHazmat, {
                    trigger: "focus",
                    html: true,
                    title: "HAZMAT STATUS",
                    content: popoverContent
                });
            }
        } else {
            $("#spHazmat").html(icons.HazmatIcon("ms-text-dark"));

            $("#spHazmat svg").attr("tabindex", "0").attr("data-bs-toggle", "popover").attr("data-bs-placement", "top").addClass("pointer");

            let elApproval = $("#spHazmat svg[data-bs-toggle='popover']")[0];
            if (elApproval) {
                let popoverApproval = new bootstrap.Popover(elApproval, {
                    trigger: "focus",
                    html: true,
                    title: "HAZMAT STATUS",
                    content: "You need to be logged in to Amazon Seller Central to enable the alerts"
                });
            }
        }
    },
    GenerateEbayListLink: function () {
        try {
            const amazonMpId = common.GetMySysAmazonMarketplaceId();

            if (amazonMpId > 0) {
                const ASIN = GetASIN();

                if (EbaySingleListAuth) {
                    $("#listOnEbay").attr("href", `https://app.mysys.com/ProductFinder/eBayIndList?mrkt=${amazonMpId}&prdct=${ASIN}`);
                } else {
                    $("#listOnEbay .mys-tooltiptext").css("width", "120px");
                    $("#listOnEbay .mys-tooltiptext").html("<p>Only the MySYS users who have the authority of eBay Listing Manager can use list the product on eBay.</p>" +
                        "<p><a href='https://app.mysys.com/Login' target='_blank' class='ms-link-info'>Sign in to MySYS</a></p>");
                }

                $("#listOnEbay").removeClass("ms-d-none");
            }
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    SetIsMeltable: function (isMeltable) {
        if (isMeltable) {
            $("#spMeltable").html(icons.MeltableIcon("ms-text-light-blue"));

            $("#spMeltable svg").addClass("pointer");

            $("#spMeltable svg").attr("data-bs-toggle", "popover");
            $("#spMeltable svg").attr("data-bs-placement", "top");

            let popoverContent = "Identified as Meltable FBA inventory.<br>Amazon has special considerations for this ASIN.<br><a href='https://sellercentral.amazon." + domain + "/gp/help/external/G202125070' class='ms-link-primary' target='_blank'>Click here</a> to learn more.";

            let elMeltable = $("#spMeltable svg[data-bs-toggle='popover']")[0];
            if (elMeltable) {
                let popoverApproval = new bootstrap.Popover(elMeltable, {
                    trigger: "focus",
                    html: true,
                    title: "Meltable Product",
                    content: popoverContent
                });
            }

        }
    }
}


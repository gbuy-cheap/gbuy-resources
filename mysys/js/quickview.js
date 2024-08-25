var premiumLink = "#";
var quickview = {
    LoadQVContent: function () {
        chrome.storage.local.get(["qvEnabled"], async function (result) {
            try {
                if (result.qvEnabled) {

                    let cols1 = document.querySelectorAll("#search  div.sg-col-inner div.s-result-list  div[data-asin]:not([data-asin=''])[class*='result-item']>div.sg-col-inner>div[cel_widget_id*='MAIN-SEARCH_RESULTS'] div.a-section.a-spacing-base>div.s-product-image-container+div.a-section");
                    let cols2 = null;

                    if (!cols1 || cols1.length == 0) {
                        cols2 = document.querySelectorAll("#search  div.sg-col-inner div.s-result-list  div[data-asin]:not([data-asin=''])[class*='result-item']>div.sg-col-inner>div[cel_widget_id*='MAIN-SEARCH_RESULTS'] div.s-card-container>div.a-section");
                        if (cols2.length == 0) {
                            cols2 = $("#search div.s-main-slot.s-result-list.s-search-results.sg-row > div > div > span > div > div > div:nth-child(2)");
                        }

                        $(cols2).append(quickview.CreateElement("cols2"));
                        if (cols2) {
                            $(cols2).css("height", "100%");
                        }

                        Array.from(cols2).forEach((element) => {
                            element.isAdded = false;
                        })
                    }

                    premiumLink = await common.GetPremiumLink();

                    $(cols1).append(quickview.CreateElement("cols1"));

                    Array.from(cols1).forEach((element) => {
                        element.isAdded = false;
                    });

                    $(document).on("click", "#s-refinements a, .s-pagination-strip>a", function (event) {
                        var elem = $(this);
                        if ($(elem).attr("href")) {
                            window.location.replace($(elem).attr("href"));
                        }
                    });

                    chrome.storage.local.get(['mysysToken'], function (result) {
                        try {
                            let userInfo = common.GetUserInfoFromSessionStorage();
                            if (userInfo && result.mysysToken) {
                                quickview.BindRestrictionEvent();

                                quickview.SetDataToCols(cols1, cols2);

                                window.onload = function () {
                                    quickview.SetDataToCols(cols1, cols2);
                                }
                                window.onscroll = function () {
                                    quickview.SetDataToCols(cols1, cols2);
                                }
                            } else {
                                $(".divQVContent").addClass("ms-d-none");
                            }
                        } catch (error) {
                            errorHandler.SendErrorToAdmin(error);
                        }
                    });


                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });
    },
    SetDataToCols: function (cols1, cols2) {
        let yAxis = window.innerHeight + window.pageYOffset;
        let currency = common.GetCurrencySymbol();
        $(".currency").text(currency);

        Array.from(cols1).forEach((col, index) => {
            if ($(col).parents("[data-asin]")[0].offsetTop <= yAxis && !col.isAdded) {
                col.isAdded = true;
                if ($(col).has("a:contains('Prime Video')").length == 0 && $(col).has("a.a-text-bold:contains('App')").length == 0) {
                    let hardcoverASIN, paperbackASIN;
                    let asin = $(col).parents("div[data-asin]").attr("data-asin");

                    if ($("a.a-text-bold:contains(Hardcover)", $(col).parents("div[data-asin]")).length > 0) {
                        hardcoverASIN = common.GetASINFromURL($("a.a-text-bold:contains(Hardcover)", $(col).parents("div[data-asin]")).attr("href"));
                    } else if ($("a.a-text-bold:contains(Paperback)", $(col).parents("div[data-asin]")).length > 0) {
                        paperbackASIN = common.GetASINFromURL($("a.a-text-bold:contains(Paperback)", $(col).parents("div[data-asin]")).attr("href"));
                    }

                    asin = hardcoverASIN || paperbackASIN || asin;

                    let price = crwcommon.AmzSearchPageFindFirstPrice($("span.a-price:not([data-a-color='secondary'])>span.a-offscreen", $(col).parents("div[data-asin]")[0]).text(), currency);

                    if (price == "N/A") {
                        price = crwcommon.AmzSearchPageFindFirstPrice($("div.puisg-row span.a-offscreen", col).eq(0).text(), currency);
                    }

                    quickview.SetProductData(col, asin, price);
                } else {
                    quickview.SetProductData(col, "", "");
                }
            }
        })

        if (cols2 && cols2.length > 0) {
            Array.from(cols2).forEach((col) => {
                if ($(col).parents("[data-asin]")[0].offsetTop <= yAxis && !col.isAdded) {

                    col.isAdded = true;
                    let asin;

                    $("a.a-link-normal", $(col)).each(function () {
                        let href = $(this).attr("href");
                        if (href) {
                            asin = common.GetASINFromURL(href);
                            if (asin) {
                                return false;
                            }
                        }
                    });

                    let price = crwcommon.AmzSearchPageFindFirstPrice($("div.sg-row span.a-offscreen", col).eq(0).text(), currency);

                    if (price == "N/A") {
                        price = crwcommon.AmzSearchPageFindFirstPrice($("div.puisg-row span.a-offscreen", col).eq(0).text(), currency);
                    }

                    quickview.SetProductData(col, asin, price);
                }
            })
        }
    },
    BindRestrictionEvent: function () {
        $(".divQVContent").on("click", ".btn-restriction", async function () {
            try {

                $(this).attr("disabled", "disabled");
                $(this).text("Please Wait");
                let asin = $(this).attr("data-asin");
                let parentElem = $(this).parents("div.divQVContent");

                let isMeltable = await quickview.IsProductMeltable(asin, domain);

                if (isMeltable) {
                    $(".spMeltable", parentElem).html(icons.MeltableIcon("ms-text-light-blue"));
                    $(".spMeltable", parentElem).addClass("ms-mx-1");

                    $(".spMeltable svg", parentElem).addClass("pointer");

                    $(".spMeltable svg", parentElem).attr("data-bs-toggle", "popover");
                    $(".spMeltable svg", parentElem).attr("data-bs-placement", "top");

                    let popoverContent = "Identified as Meltable FBA inventory.<br>Amazon has special considerations for this ASIN.<br><a href='https://sellercentral.amazon." + domain + "/gp/help/external/G202125070' class='ms-link-primary' target='_blank'>Click here</a> to learn more.";

                    let elMeltable = $(".spMeltable svg[data-bs-toggle='popover']", parentElem)[0];
                    if (elMeltable) {
                        let popoverApproval = new bootstrap.Popover(elMeltable, {
                            trigger: "focus",
                            html: true,
                            title: "Meltable Product",
                            content: popoverContent
                        });
                    }
                }

                let hazmatPopoverContent = await crwcommon.GetHazmatStatus(asin, domain);

                if (hazmatPopoverContent) {
                    $(".spHazmat", parentElem).html(common.GetHazmatIconByContent(hazmatPopoverContent));

                    if ($(".spHazmat", parentElem).html() != "") {
                        $(".spHazmat", parentElem).addClass("ms-mx-1");

                        if ($(".spHazmat svg", parentElem).length > 0) {
                            $(".spHazmat svg", parentElem).attr("tabindex", "0").attr("data-bs-toggle", "popover").attr("data-bs-placement", "top").addClass("pointer");

                            let elHazmat = $(".spHazmat svg[data-bs-toggle='popover']", parentElem)[0];
                            if (elHazmat) {
                                let popoverApproval = new bootstrap.Popover(elHazmat, {
                                    trigger: "focus",
                                    html: true,
                                    title: "HAZMAT STATUS",
                                    content: hazmatPopoverContent
                                });
                            }
                        }
                    }
                } else {
                    $(".spHazmat", parentElem).html(icons.HazmatIcon("ms-text-dark"));

                    $(".spHazmat svg", parentElem).attr("tabindex", "0").attr("data-bs-toggle", "popover").attr("data-bs-placement", "top").addClass("pointer");

                    let elApproval = $(".spHazmat svg[data-bs-toggle='popover']", parentElem)[0];
                    if (elApproval) {
                        let popoverApproval = new bootstrap.Popover(elApproval, {
                            trigger: "focus",
                            html: true,
                            title: "HAZMAT STATUS",
                            content: "You need to be logged in to Amazon Seller Central to enable the alerts"
                        });
                    }
                }

                let userCanSell = await crwcommon.GetIfSellerCanSellASIN(asin, domain);

                if (userCanSell) {
                    $(".spCanSell", parentElem).html(userCanSell.icon);

                    $(".spCanSell svg", parentElem).attr("tabindex", "0").attr("data-bs-toggle", "popover").attr("data-bs-placement", "top").addClass("pointer");

                    let elApproval = $(".spCanSell svg[data-bs-toggle='popover']", parentElem)[0];
                    if (elApproval) {
                        let popoverApproval = new bootstrap.Popover(elApproval, {
                            trigger: "focus",
                            html: true,
                            title: userCanSell.title,
                            content: userCanSell.content
                        });
                    }

                    if (userCanSell.canSell) {
                        $(".spShopSell", parentElem).html(`<a href="https://sellercentral.amazon.${domain}/product-search/search?q=${asin}" target="_blank">${icons.ShopIcon("ms-text-success")}</a>`);
                    }

                } else {
                    $(".spCanSell", parentElem).html(common.WarningIcon("ms-text-dark"));

                    $(".spCanSell svg", parentElem).attr("tabindex", "0").attr("data-bs-toggle", "popover").attr("data-bs-placement", "top").addClass("pointer");

                    let elApproval = $(".spCanSell svg[data-bs-toggle='popover']", parentElem)[0];
                    if (elApproval) {
                        let popoverApproval = new bootstrap.Popover(elApproval, {
                            trigger: "focus",
                            html: true,
                            title: "Can I Sell?",
                            content: "You need to be logged in to Amazon Seller Central to enable the alerts"
                        });
                    }
                }

                $(".spCanSell", parentElem).addClass("ms-mx-1");

                $("span.restriction", parentElem).removeClass("ms-d-none");
                $(this).remove();

            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });
    },
    InitQVPanel: function (parent, asin, price) {
        $(".divQVContent", parent).attr("data-asin", asin);
        $(".divQVContent .spASIN", parent).html(asin && `<a class="ms-link-info ms-text-decoration-underline" href="https://www.amazon.${common.GetDomain()}/dp/${asin}?th=1&psc=1" target="_blank">${asin}</a>`);
        $(".divQVContent .spPrice", parent).text(price || "N/A");
        if (!price || price == "N/A") {
            $(".divQVContent .spPrice", parent).prev(".currency").addClass("ms-d-none");
        }

        $(".divQVContent .qvSellerDiv a.offers", parent).attr("href", "https://www.amazon.com/gp/offer-listing/" + asin + "/ref=dp_olp_NEW_mbc?ie=UTF8&condition=NEW");
        $(".divQVContent .qvSellerDiv a.offers", parent).attr("data-show-all-offers-display", '{"asin":"' + asin + '"}');

        $(".divQVContent a.camelLink", parent).attr("href", "https://us.camelcamelcamel.com/product/" + asin).attr("target", "_blank");
        $(".divQVContent a.keepaLink", parent).attr("href", "https://keepa.com/#!product/1-" + asin).attr("target", "_blank");

        $(".divQVContent .btn-restriction", parent).attr("data-asin", asin);
    },
    SetOffersToQVPanel: function (asin, data) {
        let elem = $(".divQVContent[data-asin=" + asin + "]");

        $(".spTotalOffers", elem).text(data.TotalOfferCount);
        $(".imgAmz", elem).removeClass(data.Amazon ? "ms-d-none" : "");
        $(".spFBA", elem).text(data.FBA + " FBA").removeClass(data.FBA ? "ms-d-none" : "");
        $(".spFBM", elem).text(data.FBM + " FBM").removeClass(data.FBM ? "ms-d-none" : "");

        if (data.TotalOfferCount > (data.FBA + data.FBM)) {
            $(".spFBA", elem).html(icons.GetGreaterThanIcon("", 8, 8) + "&nbsp;" + $(".spFBA", elem).eq(0).text());
            $(".spFBA", elem).addClass("mys-tooltip");
            $(".spFBA", elem).append("<span class='mys-tooltiptext mys-tooltip-top' style='margin-left:-75px'>There are more than " + data.FBA + " FBA offers</span>");

            $(".spFBM", elem).html(icons.GetGreaterThanIcon("", 8, 8) + "&nbsp;" + $(".spFBM", elem).eq(0).text());
            $(".spFBM", elem).addClass("mys-tooltip");
            $(".spFBM", elem).append("<span class='mys-tooltiptext mys-tooltip-top' style='margin-left:-75px'>There are more than " + data.FBM + " FBM offers</span>");
        }

        $(".offersDone", elem).val("true");
        quickview.CheckSpinner(elem);
    },
    SetCrawledAndEMSInfoToQVPanel: function (asin, data) {
        let elem = $(".divQVContent[data-asin=" + asin + "]");

        $(".spBSR", elem).text(common.FormatNumber(data.BSR));
        $(".spCat", elem).text(data.Category);
        $(".spBrand", elem).text(data.Brand);
        $(".spDateFirstAv", elem).text(data.DateFirstAv && data.DateFirstAv != "N/A" ? new Date(languages.TranslateDate(common.GetDomainBySelectedLanguage(), data.DateFirstAv)).toDateString() : "N/A");

        $(".spEMS", elem).text(data.EstSales);
        if (data.EstSales != "N/A") {
            let userInfo = common.GetUserInfoFromSessionStorage();
            if (userInfo?.UserType != "Premium") {
                $(".premiumWarning", elem).removeClass("ms-d-none");
                $(".premiumWarning > a", elem).attr("href", premiumLink);
            }
        }
        if (data.EstSales == "000") {
            $(".spEMS", elem).addClass("filter-blur-3");
            $(".premiumWarning", elem).removeClass("ms-d-none");
            $(".premiumWarning svg", elem).removeClass("ms-link-success");
            $(".premiumWarning svg", elem).addClass("link-danger");
            $(".premiumWarning .mys-tooltiptext", elem).html("You have exceeded the quick view search limit.<br>Some of the info will not be displayed until 24 hours later.<br>If you do not want to wait, can upgrade to Premium.");
            $(".premiumWarning > a", elem).attr("href", premiumLink);
        }

        $(".spMyEMS", elem).text(data.MyEstSales);
        data.MyEstSales == "000" && $(".spMyEMS", elem).addClass("filter-blur-3");

        $(".spEMR", elem).text(common.FormatNumber(data.EstRev));
        if (data.EstRev == "N/A" || data.EstRev == "000") {
            $(".spEMR", elem).prev(".currency").addClass("ms-d-none");
        }
        data.EstRev == "000" && $(".spEMR", elem).addClass("filter-blur-3");

        $(".spTOP", elem).text(data.TOP);
        data.TOP == "000" && $(".spTOP", elem).addClass("filter-blur-3");

        if (data.Title && data.Title != "N/A") {
            $("a.googleLink", elem).removeClass("ms-d-none");
            $("a.googleLink", elem).attr("href", `https://www.google.com/search?q=${data.Title}&source=lnms&tbm=shop`).attr("target", "_blank");
        }

        if (data.Buybox != "N/A") {
            if ($(data.Buybox).text().trim().length >= 25) {
                let sellerName = "";
                sellerName = $(data.Buybox).text();
                let abbrTag = "<abbr title='" + sellerName + "'>" + sellerName.substring(0, 20) + "...</abbr>";
                data.Buybox = data.Buybox.replace(sellerName, abbrTag);
            }

            if ((data.Buybox.indexOf("Amazon") > -1 && data.Buybox.indexOf("isAmazonFulfilled") == -1) ||
                data.Buybox.indexOf("Warehouse Deals") > -1) {
                if (data.Buybox.indexOf("Amazon Warehouse") > -1 || data.Buybox.indexOf("Warehouse Deals") > -1) {
                    $(".spBuybox", elem).html(data.Buybox);
                    $(".svBuyboxDiv", elem).append("<img class='ms-ms-1 imgAmz' src='" + chrome.runtime.getURL("images/amz.svg") + "' alt=''>");
                } else {
                    $(".spBuybox", elem).html("Amazon");
                    $(".svBuyboxDiv", elem).append("<img class='ms-ms-1 imgAmz' src='" + chrome.runtime.getURL("images/amz.svg") + "' alt=''>");
                }
            } else if (data.Buybox.indexOf("sellerProfileTriggerId") > -1 || data.Buybox.indexOf("seller") > -1) {
                $(".spBuybox", elem).html(data.Buybox);
                if (data.Buybox.indexOf("isAmazonFulfilled=1") > -1) {
                    $(".svBuyboxDiv", elem).append("<span class='ms-ms-1 spFBA bg-light-blue ms-d-flex ms-align-items-center ms-px-2 ms-rounded ms-me-1'>FBA</span>");
                } else {
                    $(".svBuyboxDiv", elem).append("<span class='ms-ms-1 spFBM bg-light-yellow ms-d-flex ms-align-items-center ms-px-2 ms-rounded '>FBM</span>");
                }
            } else {
                $(".spBuybox", elem).html("N/A");
            }
        } else {
            $(".spBuybox", elem).html("N/A");
        }

        $(".crawledAndEMSDone", elem).val("true");
        quickview.CheckSpinner(elem);
    },
    SetFeesToQVPanel: function (asin, data) {
        let elem = $(".divQVContent[data-asin=" + asin + "]");

        if (!isNaN(data.Net)) {
            $(".spNet", elem).text(common.FormatNumber(data.Net));
        } else {
            $(".spNet", elem).text("N/A");
            $(".spNet", elem).prev(".currency").addClass("ms-d-none");
        }

        if (!isNaN(data.Fees)) {
            $(".spFees", elem).text(common.FormatNumber(data.Fees));
            $(".spFees", elem).append(
                '<span class="mys-tooltip">' +
                icons.GetInfoIcon("pointer ms-ms-1 ms-text-info", 14, 14) +
                '<span class="mys-tooltiptext mys-tooltip-top ms-text-start" style="margin-left:-98px;">' +
                data.FeeInfo +
                '</span>' +
                '</span>'
            );
        } else {
            $(".spFees", elem).text("N/A");
            $(".spFees", elem).prev(".currency").addClass("ms-d-none");
        }

        $(".feesDone", elem).val("true");
        quickview.CheckSpinner(elem);
    },
    SetProductData: function (elem, asin, price) {
        let data = {
            ASIN: asin,
            FBA: 0,
            FBM: 0,
            Amazon: false,
            EstSales: "N/A",
            BSR: "N/A",
            EstRev: "N/A",
            Category: "N/A",
            TOP: "N/A",
            TotalOfferCount: "N/A",
            Price: common.FormatNumber(price),
            Buybox: "N/A",
            MyEstSales: "N/A",
            Brand: "N/A",
            DateFirstAv: "N/A",
            Fees: "N/A",
            FeeInfo: "",
            Net: "N/A",
            Title: "N/A"
        };

        if (asin && asin != "-") {
            quickview.InitQVPanel(elem, asin, price);

            common.GetAmazonOffers(data.ASIN, common.GetDomain(), 3).then((offerData) => {

                try {
                    data.TotalOfferCount = offerData.totalOfferCount;

                    let sellerCounts = quickview.GetOffersSellerCounts(offerData.offers);
                    if (sellerCounts) {
                        data.FBA = sellerCounts.FBA;
                        data.FBM = sellerCounts.FBM;
                        data.Amazon = sellerCounts.Amazon;
                    }

                    let offers = offerData.offers.map(
                        stockChecker.ConvertToStockGridRow
                    );

                    stockChecker.CalcMyESM(offers, 3, 80, 10);

                    quickview.SetOffersToQVPanel(asin, data);
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                    quickview.SetOffersToQVPanel(asin, data);
                }
            }).catch(err => {
                console.log(err);
                quickview.SetOffersToQVPanel(asin, data);
            });

            crwcommon.GetCrawledBasicInfo(asin).then(async (returnVal) => {
                try {
                    data.BSR = returnVal.bsr;
                    data.Category = returnVal.category;
                    data.Buybox = returnVal.buybox;
                    data.Brand = returnVal.brand;
                    data.DateFirstAv = returnVal.dateFirstAvailable;
                    data.Title = returnVal.title;

                    let jsonResult = await common.GetQuickViewData(common.ConvertToNumber(returnVal.bsr), returnVal.category, common.GetDomain());
                    if (jsonResult) {
                        if (jsonResult.ESTIMATED_SALES > 0) {
                            data.EstSales = common.FormatNumber(jsonResult.ESTIMATED_SALES)

                            data.MyEstSales = parseInt(jsonResult.ESTIMATED_SALES / (stockChecker.FBAs + stockChecker.FBMs + 1));

                            if (!isNaN(price)) {
                                data.EstRev = parseInt(Number(jsonResult.ESTIMATED_SALES) * Number(price));
                                data.EstRev = common.FormatNumber(data.EstRev);
                            }
                        }
                        if (jsonResult.TOP > 0) {
                            data.TOP = jsonResult.TOP != 0 ? (common.RoundToTwo(jsonResult.TOP) + "%") : "N/A"
                        }
                    } else {
                        data.EstSales = "000";
                        data.MyEstSales = "000";
                        data.EstRev = "000";
                        data.TOP = "000";
                    }

                    quickview.SetCrawledAndEMSInfoToQVPanel(asin, data);
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                    quickview.SetCrawledAndEMSInfoToQVPanel(asin, data);
                }
            }).catch(err => {
                errorHandler.SendErrorToAdmin(err);
                quickview.SetCrawledAndEMSInfoToQVPanel(asin, data);
            });

            var content = {
                "ASIN": asin,
                "Domain": common.GetDomain(),
                "MarketPlace": common.GetMarketplaceId(),
                "Currency": common.GetCurrencyCode(),
                "Price": price
            };
            common.GetFeesFromAmazon(content).then(async returnVal => {
                try {
                    let vat = await settings.GetVAT();
                    let currency = common.GetCurrencySymbol();
                    data.Fees = returnVal.StorageFee + returnVal.VarCloseFee + ((returnVal.ReferralFee * price) / 100) + returnVal.FulfillmentFee + ((vat * price) / 100);
                    data.Net = (price - data.Fees).toFixed(2);
                    data.Fees = data.Fees.toFixed(2);

                    data.FeeInfo = '<div class="ms-row">';

                    if (!isNaN(returnVal.ReferralFee) && returnVal.ReferralFee > 0) {
                        data.FeeInfo += `<div class="ms-col-8 ms-pe-0">Referral Fee (${returnVal.ReferralFee.toString()}%):</div>`;
                        data.FeeInfo += `<div class="ms-col-4 ms-ps-0">${currency}&nbsp;${((returnVal.ReferralFee * price) / 100).toFixed(2)}</div>`;
                    }
                    if (!isNaN(returnVal.StorageFee) && returnVal.StorageFee > 0) {
                        data.FeeInfo += `<div class="ms-col-8 ms-pe-0">Storage Fee:</div>`;
                        data.FeeInfo += `<div class="ms-col-4 ms-ps-0">${currency}&nbsp;${returnVal.StorageFee}</div>`;
                    }
                    if (!isNaN(returnVal.VarCloseFee) && returnVal.VarCloseFee > 0) {
                        data.FeeInfo += `<div class="ms-col-8 ms-pe-0">Variable Closing Fee:</div>`;
                        data.FeeInfo += `<div class="ms-col-4 ms-ps-0">${currency}&nbsp;${returnVal.VarCloseFee}</div>`;
                    }
                    if (!isNaN(returnVal.FulfillmentFee) && returnVal.FulfillmentFee > 0) {
                        data.FeeInfo += `<div class="ms-col-8 ms-pe-0">Fulfillment Fee:</div>`;
                        data.FeeInfo += `<div class="ms-col-4 ms-ps-0">${currency}&nbsp;${returnVal.FulfillmentFee}</div>`;
                    }
                    if (!isNaN(vat) && vat > 0) {
                        data.FeeInfo += `<div class="ms-col-8 ms-pe-0">VAT (${vat}%):</div>`;
                        data.FeeInfo += `<div class="ms-col-4 ms-ps-0">${currency}&nbsp;${((vat * price) / 100).toFixed(2)}</div>`;
                    }

                    data.FeeInfo += '</div>';

                    quickview.SetFeesToQVPanel(asin, data);
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                    quickview.SetFeesToQVPanel(asin, data);
                }
            }).catch((err) => {
                common.ConsoleLog(content.ASIN + " Error(Fee Request): " + err);
                quickview.SetFeesToQVPanel(asin, data);
            })
        } else {
            try {
                quickview.InitQVPanel(elem, data.ASIN);
                $(".ms-spinner-border.ms-spinner-border-sm", elem).addClass("ms-d-none");
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        }
    },
    GetOffersSellerCounts: function (offers) {
        let FBA = 0, FBM = 0, Amazon;
        for (const offer of offers) {
            offer.isFba == "1" ? FBA++ : FBM++;
            offer.sellerName.indexOf("Amazon") > -1 && (Amazon = true);
        }
        return { FBA, FBM, Amazon };
    },
    CreateElement: function (cols) {
        let element;
        if (cols == "cols1") {
            element = "<div class='mysys divQVContent ms-border ms-rounded ms-border-success ms-fs-6 ms-mt-2 ms-mb-1 ms-text-start ms-bg-light'>";
        } else if (cols == "cols2") {
            element = "<div class='mysys divQVContent ms-border ms-rounded ms-border-success ms-fs-6 ms-mt-2 ms-mb-1 ms-text-start ms-bg-light'>";
        }

        element += '<div class="ms-d-none ms-text-danger spMessage"></div>' +
            '<div class="ms-mb-1 qvcontent"><span class="ms-fw-bold spASIN">-</span>' +
            '<span class="ms-spinner-border ms-spinner-border-sm ms-float-end"></span></div>' +

            '<div class="qvcontent ms-mb-1">' +
            '<span class="ms-fw-bold ms-text-primary">Price:&nbsp;</span>' +
            '<span class="currency"></span>&nbsp;<span class="spPrice">-</span>' +
            '</div>' +

            '<input type="hidden" class="crawledAndEMSDone">' +
            '<input type="hidden" class="offersDone">' +
            '<input type="hidden" class="feesDone">' +

            '<hr class="ms-border-secondary ms-my-1">' +
            '<div class="qvcontent">' +
            '<span class="ms-fw-bold ms-text-success">Mo. Sales:&nbsp;</span>' +
            '<span class="spEMS">-</span>' +
            '<span class="premiumWarning ms-d-none mys-tooltip ms-float-end">' +
            '<a href="#" target="_blank" class="pointer"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ms-float-end ms-link-success" viewBox="0 0 16 16">' +
            '<path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>' +
            '</svg></a>' +
            '<span class="mys-tooltiptext mys-tooltip-left ms-text-start" style="top:-58px">The information shown here is for Premium users. You are a <span class="ms-fst-italic ms-text-decoration-underline">trial user.</span><br>Upgrade to Premium to get unlimited access to this information in the future.</span>' +
            '</span>' +

            '</div>' +
            '<div class="qvcontent">' +
            '<span class="ms-fw-bold ms-text-success">Mo. Gross:&nbsp;</span>' +
            '<span class="currency"></span>&nbsp;<span class="spEMR">-</span>' +
            '</div>' +
            '<div class="qvcontent">' +
            '<span class="ms-fw-bold ms-text-success">My Mo. Sales:&nbsp;</span>' +
            '<span class="spMyEMS">-</span>' +
            '</div>' +
            '<div class="qvcontent ms-mb-1">' +
            '<span class="ms-fw-bold ms-text-success">TOP:&nbsp;</span>' +
            '<span class="spTOP">-</span>' +
            '</div>' +
            '<hr class="ms-border-secondary ms-my-1">' +

            '<div class="qvcontent">' +
            '<span class="ms-fw-bold ms-text-info">Category:&nbsp;</span>' +
            '<span class="spCat">-</span>' +
            '</div>' +
            '<div class="qvcontent">' +
            '<span class="ms-fw-bold ms-text-info">BSR:&nbsp;</span>' +
            '<span class="spBSR">-</span>' +
            '</div>' +
            '<div class="qvcontent">' +
            '<span class="ms-fw-bold ms-text-info">Brand:&nbsp;</span>' +
            '<span class="spBrand">-</span>' +
            '</div>' +
            '<div class="qvcontent ms-mb-1">' +
            '<span class="ms-fw-bold ms-text-info">Date First Available:&nbsp;</span>' +
            '<span class="spDateFirstAv">-</span>' +
            '</div>' +

            '<div class="qvcontent">' +
            '<span class="ms-fw-bold ms-text-warning">Fees (FBA):&nbsp;</span>' +
            '<span class="currency"></span>&nbsp;<span class="spFees">-</span>' +
            '</div>' +
            '<div class="qvcontent ms-mb-1">' +
            '<span class="ms-fw-bold ms-text-warning">Net (FBA):&nbsp;</span>' +
            '<span class="currency"></span>&nbsp;<span class="spNet">-</span>' +
            '</div>' +

            '<div class="qvcontent ms-d-flex svBuyboxDiv ms-align-items-center">' +
            '<span class="ms-fw-bold ms-text-primary">Buybox:&nbsp;</span>' +
            '<span class="spBuybox ms-lh-1" style="word-break: break-word;">-</span>' +
            '</div>' +
            '<div class="qvcontent">' +
            '<span class="ms-fw-bold ms-text-primary">Total Offers:&nbsp;</span>' +
            '<span class="spTotalOffers">-</span>' +
            '</div>' +
            '<div class="qvSellerDiv qvcontent ms-mb-1">' +
            '<a class="offers a-declarative ms-d-flex ms-link-dark ms-text-decoration-none" data-action="show-all-offers-display" target="_blank">' +
            '<img class="ms-d-none ms-me-1 imgAmz" src="' + chrome.runtime.getURL('images/amz.svg') + '" alt="">' +
            '<span class="spFBA ms-d-none bg-light-blue ms-d-flex ms-align-items-center ms-px-2 ms-rounded ms-me-1">- FBA</span>' +
            '<span class="spFBM ms-d-none bg-light-yellow ms-d-flex ms-align-items-center ms-px-2 ms-rounded ">- FBM</span>' +
            '</a>' +
            '</div>' +
            '<div class="qvcontent ms-d-flex ms-justify-content-between footerSection">' +
            '<span>' +
            '<button class="ms-btn ms-btn-warning ms-rounded btn-restriction">Restrictions</button>' +
            '<span class="restriction ms-d-none">' +
            '<span class="spMeltable">' +
            '</span>' +
            '<span class="spCanSell">' +
            '</span>' +
            '<span class="spShopSell">' +
            '</span>' +
            '<span class="spHazmat">' +
            '</span>' +
            '</span>' +
            '</span>' +
            '<span>' +
            '<a class="googleLink" class="ms-d-none" href="#"><img src="' + chrome.runtime.getURL('images/other/google.svg') + '" alt="Google Shop Search"></a>' +
            '<a class="ms-ms-1 camelLink" href="#"><img src="' + chrome.runtime.getURL('images/other/camel.png') + '" alt="Camelcamelcamel Price History"></a>' +
            '<a class="ms-ms-1 keepaLink" href="#"><img src="' + chrome.runtime.getURL('images/other/keepa.png') + '" alt="Keepa Price History"></a>' +
            '</span>' +
            '</div>' +
            '</div>';

        return element;
    },
    CheckSpinner: function (elem) {
        let crawledAndEMSDone = $(".crawledAndEMSDone", elem).val();
        let offersDone = $(".offersDone", elem).val();
        let feesDone = $(".feesDone", elem).val();

        if (crawledAndEMSDone == "true" && offersDone == "true" && feesDone == "true") {
            $(".ms-spinner-border.ms-spinner-border-sm", elem).addClass("ms-d-none");
            return false;
        } else {
            $(".ms-spinner-border.ms-spinner-border-sm", elem).removeClass("ms-d-none");
            return true;
        }
    },
    IsProductMeltable: function (asin, domain) {
        return new Promise(function (resolve, reject) {

            let url = `${common.HOST}/api/amazon/ismeltable?ASIN=${asin}&domain=${domain}`;

            let message = {
                url: url,
                method: 'GET',
                type: "m0"
            }

            chrome.runtime.sendMessage(message, (response) => {
                resolve(response?.response?.paramBool);
            });

        });
    }
}












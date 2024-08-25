"use strict";
var crwcommon = {
    AmzSearchPageFindFirstPrice: function (priceString, currency) {
        currency = currency == "C$" ? "$" : currency;
        currency = currency == "₺" ? "TL" : currency;
        let price = priceString.replace(currency, "");
        if (!isNaN(common.ConvertToNumber(price.trim())) &&
            common.ConvertToNumber(price.trim()) > 0) {
            return common.ConvertToNumber(price.trim()) || "N/A";
        }
        return "N/A";
    },
    GetCrawledBasicInfo: function (asin, domain = common.GetDomain(), checkLanguage = true) {
        return new Promise((resolve, reject) => {
            var content = { "ASIN": asin, "Domain": domain };
            chrome.runtime.sendMessage({ content: content, type: "m2" }, (response) => {
                try {
                    if (response && response.isSuccess == undefined && response.response) {
                        let pageContent = $(response.response);

                        if (checkLanguage) {
                            domain = common.GetDomainBySelectedLanguage(response.response);
                        }

                        let bsr = $("table.prodDetTable>tbody>tr>th:contains('" + languages.BSRSplitter(domain) + "')", pageContent).next().text().trim().split(languages.InSplitter(domain))[0];
                        let category = $("table.prodDetTable>tbody>tr>th:contains('" + languages.BSRSplitter(domain) + "')", pageContent).next().text().trim().split(languages.InSplitter(domain))[1]?.split(" (")[0];
                        let buybox = common.GetBuyboxOuterHTML($(pageContent));
                        let price = $("#buybox .a-price .a-offscreen", pageContent).eq(0).text();//$("#price_inside_buybox", pageContent).text();
                        let stock = true;
                        let brand = $("table.prodDetTable>tbody>tr>th:contains('" + languages.BrandSplitter(domain) + "')", pageContent).next().text().trim();
                        let prodDim = $("table.prodDetTable>tbody>tr>th:contains('" + languages.DimensionsSplitter(domain) + "')", pageContent).next().text().split(";")[0].trim();
                        let itemWeight = $("table.prodDetTable>tbody>tr>th:contains('" + languages.ItemWeightSplitter(domain) + "')", pageContent).next().text().split(";")[0].trim();
                        let model = $("table.prodDetTable>tbody>tr>th:contains('" + languages.ModelSplitter(domain) + "')", pageContent).next()[0]?.innerText.trim();
                        let dateFirstAv = $("table.prodDetTable>tbody>tr>th:contains('" + languages.DateFirstAvSplitter(domain) + "')", pageContent).next().text().trim();
                        let manufacturer;
                        let parentASIN;
                        let reviewRate = common.ConvertToNumber($("#acrCustomerReviewText", pageContent)?.eq(0).text()?.split(" ")[0], domain);
                        let title = $("#productTitle", pageContent).text()?.trim();
                        let color = $("#variation_color_name span.selection", pageContent)?.html()?.trim() ?? "N/A";
                        let size = $("span#dropdown_selected_size_name span.a-dropdown-prompt", pageContent)?.html()?.trim() ?? "N/A";

                        if (size == "N/A") {
                            size = $("#variation_size_name span.selection", pageContent).html()?.trim() ?? "N/A";

                            if (size == "N/A") {
                                size = $("#inline-twister-expanded-dimension-text-size_name", pageContent)?.text()?.trim() ?? "N/A";
                            }
                        }
                        if (!size) {
                            size = "N/A";
                        }

                        if (color == "N/A") {
                            color = $("#inline-twister-expanded-dimension-text-color_name", pageContent)?.text()?.trim() ?? "N/A";
                        }
                        if (!color) {
                            color = "N/A";
                        }

                        if (!dateFirstAv) {
                            let dateString = $("li:contains('" + languages.DateFirstAvSplitter(domain) + "')", pageContent)?.text().split(":")[1]?.trim().replaceAll("\n", "");
                            if (dateString) {
                                dateFirstAv = common.ClearNonPrintableChars(dateString);
                            }
                        }

                        if (!model && $("li:contains('" + languages.ModelSplitter(domain) + "')", pageContent).length > 0) {
                            model = $("li:contains('" + languages.ModelSplitter(domain) + "')", pageContent).text().split(":")[1]?.trim().replaceAll("\n", "");
                        }

                        if (!itemWeight &&
                            $("table.prodDetTable>tbody>tr>th:contains('" + languages.DimensionsSplitter(domain) + "')", pageContent).next().text().split(";")[1]) {
                            itemWeight = $("table.prodDetTable>tbody>tr>th:contains('" + languages.DimensionsSplitter(domain) + "')", pageContent).next().text().split(";")[1]?.trim();
                        }

                        if ($("li:contains('" + languages.DimensionsSplitter(domain) + "')", pageContent).length > 0) {
                            prodDim = $("li:contains('" + languages.DimensionsSplitter(domain) + "')", pageContent).text().split(":")[1]?.split(";")[0].trim();
                            if (!itemWeight &&
                                $("li:contains('" + languages.DimensionsSplitter(domain) + "')", pageContent).text().split(":")[1]?.split(";")[1]) {
                                itemWeight = $("li:contains('" + languages.DimensionsSplitter(domain) + "')", pageContent).text().split(":")[1]?.split(";")[1].trim();
                            }
                        }

                        if ($("#twisterContainer li[data-dp-url!='']", pageContent).length > 0) {
                            parentASIN = $("#twisterContainer li[data-dp-url!='']", pageContent).attr("data-dp-url").split("twister_")[1]?.split("?")[0];
                        }

                        let manufacturerEl = $("table.prodDetTable>tbody>tr>th:contains('" + languages.ManuSplitter(domain) + "')", pageContent).filter(function () {
                            return $(this).text().replaceAll(/[\W_]+/g, "") === languages.ManuSplitter(domain);
                        });
                        if (manufacturerEl.length > 0) {
                            manufacturer = $(manufacturerEl).next()[0].innerText;
                        } else {
                            manufacturerEl = $("li:contains('" + languages.ManuSplitter(domain) + "')", pageContent).filter(function () {
                                return $(this).text().split(":")[0].replaceAll(/[\W_]+/g, "") === languages.ManuSplitter(domain);
                            })
                            manufacturer = $(manufacturerEl).text().split(languages.ManuSplitter(domain))[1]?.split(":")[1];
                        }

                        if (!brand) {
                            brand = manufacturer;
                        }

                        if ($("div#outOfStock", pageContent).length > 0) {
                            stock = false;
                        }

                        if (!price) {
                            price = $("#newBuyBoxPrice", pageContent).text();
                        } else {
                            price = price.replace(/[^0-9,.]/g, '').trim();
                        }

                        if (!bsr) {
                            bsr = $("li:contains('" + languages.BSRSplitter(domain) + "')", pageContent).text().split(languages.BSRSplitter(domain) + ":")[1]?.trim().split(languages.InSplitter(domain))[0];
                        }
                        if (!category) {
                            category = $("li:contains('" + languages.BSRSplitter(domain) + "')", pageContent).text().split(languages.BSRSplitter(domain) + ":")[1]?.trim().split(languages.InSplitter(domain))[1]?.split(" (")[0];
                        }

                        if (category?.indexOf("#") > -1) {
                            category = category.split("#")[0];
                        }

                        bsr = bsr && bsr.replace(/[^0-9]/g, '');

                        resolve({
                            bsr: bsr || "N/A", category: category || "N/A", buybox: buybox || "N/A", price: price, inStock: stock,
                            manufacturer: manufacturer || "N/A", brand: brand || "N/A", parentASIN: parentASIN || "N/A",
                            productionDimensions: prodDim || "N/A", itemWeight: itemWeight || "N/A", model: model || "N/A",
                            dateFirstAvailable: dateFirstAv, reviewRate: reviewRate, title: title, color: color, size: size
                        })
                    } else if (response?.isSuccess == false) {
                        reject({ isSuccess: false, userMessage: response.userMessage });
                    }
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                }
            });
        })
    },
    ParseOfferText: function (text, asin, domain, OfferPage) {
        try {
            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(text, "text/html");

            var sellerRowsSelector = "#aod-offer-list #aod-offer-soldBy";
            var priceRowsSelector = "#aod-offer-list #aod-offer-price";
            var addToCartRowsSelector = "#aod-offer-list #aod-offer-price";

            if (OfferPage != "1") {
                sellerRowsSelector = "#aod-offer-soldBy";
                priceRowsSelector = "#aod-offer-price";
                addToCartRowsSelector = "#aod-offer-price";
            }

            var sellers = [];

            var sellerRows = htmlDocument.documentElement.querySelectorAll(sellerRowsSelector);

            sellerRows.forEach((element, index) => {
                var isAmazon = false;
                var sellerNameSpan = element.querySelector('div > div > div.a-fixed-left-grid-col.a-col-right > span');

                if (sellerNameSpan != undefined && sellerNameSpan.textContent.indexOf("Amazon") >= 0) {
                    isAmazon = true;

                    let sessionId = htmlDocument.documentElement.querySelector('#pinned-de-id > div.a-fixed-left-grid > div > div.a-fixed-left-grid-col.a-col-right > div > div > div.a-fixed-right-grid-col.aod-atc-column.a-col-right > form > input[type=hidden]:nth-child(1)')?.value;
                    let offeringId = "";
                    let offeringEl = htmlDocument.querySelector("#pinned-de-id > div > div > div.a-fixed-right-grid-col.aod-atc-column.a-col-right > span[data-aod-atc-action*='oid']")?.attributes["data-aod-atc-action"]?.value;

                    if (offeringEl) {
                        offeringId = common.ConvertToJSON(offeringEl)?.oid;
                    }

                    sellers.push({ "sellerName": "Amazon", "merchantId": "Amazon", "isFba": 1, "sellerRating": 0, "positiveFeedBack": 0, "price": 0, "sessionId": sessionId, "offeringId": offeringId, "stock": "" });
                }

                if (!isAmazon) {

                    var sellerLink = element.querySelector('a').href;
                    var sellerName = element.querySelector('a').innerText.trim();

                    if (sellerName.indexOf("Amazon") < 0) {
                        var MerchantId = sellerLink.split("seller=")[1]?.split("&")[0];
                        var IsFBA = sellerLink.indexOf("isAmazonFulfilled=1") > 0 ? "1" : "0";

                        var sellerRatingSpan = element.querySelector('span[id*="seller-rating-count"]');

                        var star = element.querySelector('#aod-offer-seller-rating > i')?.className?.split(/\s+/)?.filter(index => index.indexOf("a-star-mini") > -1);

                        var ratings = "0";
                        var positiveFeedBacks = "0";

                        if (sellerRatingSpan) {
                            var sellerRatingTxt = sellerRatingSpan.textContent.trim();

                            if (sellerRatingTxt != undefined && sellerRatingTxt.indexOf('%') >= 0) {
                                ratings = sellerRatingTxt.split(")")[0].split(" ")[0].replace(/\D/g, '');
                                positiveFeedBacks = sellerRatingTxt.split(")")[1]?.split("%")[0]?.replace(/\D/g, '');
                            }
                        }

                        sellers.push({ "sellerName": sellerName, merchantId: MerchantId, "isFba": IsFBA, "sellerRating": ratings, "positiveFeedBack": positiveFeedBacks, "price": 0, "sessionId": "", "offeringId": "", "stock": "", "star": star });
                    } else {
                        sellers.push({ "sellerName": sellerName, "merchantId": "Amazon", "isFba": 1, "sellerRating": 0, "positiveFeedBack": 0, "price": 0, "sessionId": "", "offeringId": "", "stock": "" });
                    }

                }
            });

            var priceRows = htmlDocument.documentElement.querySelectorAll(priceRowsSelector);

            priceRows.forEach((element, index) => {

                // var priceStr = element.querySelector('span[class="a-price"]')?.firstChild.textContent.replace(/\D/g, '');
                var priceStr = element.querySelector('span.a-price')?.firstChild.textContent.replace(/\D/g, '');

                if (priceStr) {
                    var price = parseFloat(priceStr);

                    var shippingPriceSpan = element.querySelector('div[id*="aod-bottlingDepositFee"]').nextSibling;
                    var shippingPriceStr = "";

                    if (shippingPriceSpan.textContent.indexOf("FREE") < 0 && shippingPriceSpan.textContent.indexOf("Coupon") < 0)
                        shippingPriceStr = shippingPriceSpan.textContent.replace(/\D/g, '');

                    var shippingPrice = 0;
                    if (shippingPriceStr != "") {
                        shippingPrice = parseFloat(shippingPriceStr);
                    }

                    sellers[index].price = (price + shippingPrice) * 0.01;
                } else {
                    sellers[index].price = "?";
                }

            });

            var addToCartRows = htmlDocument.documentElement.querySelectorAll(addToCartRowsSelector);
            addToCartRows.forEach((element, index) => {
                try {
                    let offeringIdJSON = common.ConvertToJSON(element.querySelector("span[data-aod-atc-action*='oid']")?.attributes["data-aod-atc-action"]?.value);
                    let offeringId;
                    if (offeringIdJSON) {
                        offeringId = offeringIdJSON.oid;
                    }

                    let merchantId = element.parentElement?.querySelector("#aod-offer-soldBy a.a-size-small")?.href?.split("seller=")[1]?.split("&")[0];
                    let foundSeller = sellers.find(x => x.merchantId == merchantId && !x.offeringId);

                    if (offeringId && foundSeller) {
                        foundSeller.offeringId = offeringId;
                        foundSeller.sessionId = "";
                    }
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                }

            });

            if (OfferPage == 1) {
                // var buyboxPriceStr = htmlDocument.documentElement.querySelector('#aod-sticky-pinned-container #aod-price-0 > span > span.a-offscreen')?.textContent.replace(/\D/g, '');
                var buyboxPriceStr = htmlDocument.documentElement.querySelector('#aod-sticky-pinned-container #aod-price-0 span.a-offscreen')?.textContent.replace(/\D/g, '');
                var buyboxShippingPriceSpan = htmlDocument.documentElement.querySelector('#pinned-de-id > div.a-fixed-left-grid > div > div.a-fixed-left-grid-col.a-col-right > div > div > div.a-fixed-right-grid-col.aod-padding-right-10.a-col-left > span > span');

                var buyboxShippingPriceStr = "";
                if (buyboxShippingPriceSpan != undefined) { buyboxShippingPriceStr = buyboxShippingPriceSpan.textContent.replace(/\D/g, '') }
                var buyboxPrice = 0; var buyboxShippingPrice = 0;
                if (buyboxPriceStr != "") { buyboxPrice = parseFloat(buyboxPriceStr); }
                if (buyboxShippingPriceStr != "" && buyboxShippingPriceStr.indexOf("FREE") < 0) { buyboxShippingPrice = parseFloat(buyboxShippingPriceStr); }

                var buyboxPrice = (buyboxPrice + buyboxShippingPrice) * 0.01;

                var buyboxSellerName = "";
                if (htmlDocument.documentElement.querySelector("#aod-pinned-offer-additional-content #aod-offer-soldBy > div > div > div.a-fixed-left-grid-col.a-col-right > span"))
                    buyboxSellerName = "Amazon";
                else
                    buyboxSellerName = htmlDocument.documentElement.querySelector('#aod-pinned-offer-additional-content #aod-offer-soldBy > div > div > div.a-fixed-left-grid-col.a-col-right > a')?.textContent.trim();

                var buyboxMerchantId = "";
                var buyboxIsFBA = "1";
                var buyboxRatings = "0";
                var buyboxPositiveFeedBacks = "0";
                var star = 0;

                if (buyboxSellerName && buyboxSellerName.indexOf("Amazon") < 0 && buyboxSellerName.indexOf("Warehouse Deals") < 0) {

                    var buyboxSellerLink = htmlDocument.documentElement.querySelector('#aod-pinned-offer-additional-content #aod-offer-soldBy > div > div > div.a-fixed-left-grid-col.a-col-right > a').outerHTML;
                    buyboxMerchantId = buyboxSellerLink.split("seller=")[1]?.split("&")[0];
                    buyboxIsFBA = buyboxSellerLink.indexOf("isAmazonFulfilled=1") > 0 ? "1" : "0";

                    var buyboxSellerRatingTxt = htmlDocument.documentElement.querySelector('#aod-pinned-offer-additional-content #aod-offer-seller-rating > span')?.textContent;

                    if (buyboxSellerRatingTxt != undefined && buyboxSellerRatingTxt.indexOf('%') >= 0) {
                        buyboxRatings = buyboxSellerRatingTxt.split(")")[0].split(" ")[0].replace(/\D/g, '');
                        buyboxPositiveFeedBacks = buyboxSellerRatingTxt.split(")")[1]?.split("%")[0]?.replace(/\D/g, '');
                    }

                    var star = htmlDocument.documentElement.querySelector('#aod-pinned-offer-additional-content #aod-offer-seller-rating > i')?.className?.split(/\s+/)?.filter(index => index.indexOf("a-star-mini") > -1);
                }

                let buyboxSessionId = htmlDocument.documentElement.querySelector('#pinned-de-id > div.a-fixed-left-grid > div > div.a-fixed-left-grid-col.a-col-right > div > div > div.a-fixed-right-grid-col.aod-atc-column.a-col-right > form > input[type=hidden]:nth-child(1)')?.value;
                let buyboxOfferingId = "";
                let buyboxOfferingEl = htmlDocument.querySelector("#pinned-de-id > div > div > div.a-fixed-right-grid-col.aod-atc-column.a-col-right > span[data-aod-atc-action*='oid']")?.attributes["data-aod-atc-action"]?.value;

                if (buyboxOfferingEl) {
                    buyboxOfferingId = common.ConvertToJSON(buyboxOfferingEl)?.oid;
                }

                if (buyboxSellerName) {
                    sellers.unshift({ "sellerName": buyboxSellerName, "merchantId": buyboxMerchantId, "isFba": buyboxIsFBA, "sellerRating": buyboxRatings, "positiveFeedBack": buyboxPositiveFeedBacks, "price": buyboxPrice, "sessionId": buyboxSessionId, "offeringId": buyboxOfferingId, "stock": "", "star": star });
                }
            }

            var OfferPageCount = 1;
            var OfferCount;

            if (OfferPage == 1) {

                OfferCount = parseInt(htmlDocument.documentElement.querySelector('#aod-total-offer-count')?.value);
                if (OfferCount > 0) { OfferPageCount = Math.ceil(OfferCount / 10); }
            }

            var response = { "ASIN": asin, "DOMAIN": domain, "Offers": sellers, "OfferPageCount": OfferPageCount, "TotalOfferCount": OfferCount + 1 };
            return response;
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    GetReviewCount: function (asin, domain = common.GetDomain()) {
        return new Promise((resolve, reject) => {
            let url = `https://www.amazon.${domain}/product-reviews/${asin}/see_all_summary/srt/viewopt_rvwer/ref=cm_cr_arp_d_viewopt_fmt?ie=UTF8&showViewpoints=1&sortBy=recent&reviewerType=avp_only_reviews&pageNumber=1&formatType=current_format`

            chrome.runtime.sendMessage({ url: url, type: "simple" }, (response) => {
                try {
                    if (response?.response) {
                        const parser = new DOMParser();
                        const htmlDocument = parser.parseFromString(response.response, "text/html");

                        let reviewText = htmlDocument.documentElement.querySelector("div[data-hook='cr-filter-info-review-rating-count']")?.innerText?.trim();
                        let reviews = 0;

                        let languageDomain = common.GetDomainBySelectedLanguage();
                        if (reviewText) {
                            if (reviewText.indexOf("| ") > -1) {
                                reviews = reviewText.split("|")[1]?.trim().split(languages.ReviewSplitter(languageDomain))[0];
                            } else if (", ") {
                                reviews = reviewText.split(",")[1]?.trim().split(languages.ReviewSplitter(languageDomain))[0];
                            }

                            reviews = reviews?.replaceAll(/[^0-9]/g, '');
                        }

                        if (reviews && !isNaN(common.ConvertToNumber(reviews, domain))) {
                            reviews = common.ConvertToNumber(reviews, domain);
                        } else {
                            reviews = 0;
                        }
                        resolve(reviews);
                    } else {
                        reject(response?.userMessage ?? "Reviews not found");
                    }
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                }
            });
        });
    },
    GetHazmatStatus: function (asin, domain = common.GetDomain()) {
        return new Promise((resolve, reject) => {

            let url1 = "https://sellercentral.amazon." + domain + "/help/workflow/execute-workflow?client=FullPageHelp&addHelpConditionalProcessing=true&directAnswerWidgetId=da-intent-fba-dangerous-goods-v2-paragonforsellers&workflowId=fba_dangerous_goods";

            let message = {
                type: "simple",
                url: url1
            };

            chrome.runtime.sendMessage(message, (response) => {
                if (response?.response && response?.response.isSuccess != false) {

                    let url2;

                    if (domain == "com" || domain == "com.mx" || domain == "ca") {
                        url2 = "https://sellercentral.amazon." + domain + "/help/workflow/execute-workflow?mons_sel_persist=false&stck=NA&sif_profile=SXAugurExecuteWorkflowParamsNA"; //na?
                    } else {
                        url2 = "https://sellercentral.amazon." + domain + "/help/workflow/execute-workflow?mons_sel_persist=false&stck=EU&sif_profile=SXAugurExecuteWorkflowParamsEU";
                    }


                    const parser = new DOMParser();
                    let htmlDocument = parser.parseFromString(response.response, "text/html");

                    let jsonDataEl = htmlDocument.querySelector(".augur_paramount_content_div");

                    if (jsonDataEl) {
                        let jsonData = jsonDataEl.attributes["data-workflow-step-orchestration-base-info"].value;

                        jsonData = common.ConvertToJSON(jsonData);

                        let payload = {
                            "workflowId": "fba_dangerous_goods",
                            "requiredAttributes": ["seller_intent"],
                            "currentStepName": "determine_seller_intent_na_or_eu_task_1ozyrjg",// jsonData.currentStepName,
                            "sxaugur.encrypt.newAttributes": { "seller_intent": "look_up_an_asin" },
                            "diagRunId": jsonData?.diagRunId,
                            "client": "FullPageHelp",
                            "paramountEphUser": undefined,
                            "paramountEphUuid": undefined,
                            "isResumingWorkflow": false
                        }

                        message = {
                            type: "m3",
                            url: url2,
                            data: payload
                        };

                        chrome.runtime.sendMessage(message, response1 => {
                            if (response1?.response && response1.response.isSuccess != false) {

                                htmlDocument = parser.parseFromString(response1.response, "text/html");

                                let jsonData1 = htmlDocument.querySelector(".augur_paramount_content_div").attributes["data-workflow-step-orchestration-base-info"].value;

                                jsonData1 = common.ConvertToJSON(jsonData1);

                                payload = {
                                    "workflowId": "fba_dangerous_goods",
                                    "requiredAttributes": jsonData1?.requiredAttributes,
                                    "currentStepName": jsonData1?.currentStepName,
                                    "sxaugur.encrypt.newAttributes": { "continue_task_18ie4by": "true", "item_id": asin },
                                    "diagRunId": jsonData?.diagRunId,
                                    "client": "FullPageHelp",
                                    "paramountEphUser": undefined,
                                    "paramountEphUuid": undefined,
                                    "isResumingWorkflow": false
                                };

                                message.type = "m9";
                                message.data = payload;

                                chrome.runtime.sendMessage(message, response2 => {
                                    if (response2?.response && response2.response.isSuccess != false) {

                                        htmlDocument = parser.parseFromString(response2.response, "text/html");

                                        let popoverContent = htmlDocument.querySelector(".diag_state")?.innerHTML.replace("<br>", "")?.trim();

                                        resolve(popoverContent);
                                    } else {
                                        resolve();
                                    }
                                });

                            } else {
                                resolve();
                            }
                        })
                    } else {
                        resolve();
                    }
                } else {
                    resolve();
                }
            });

        });
    },
    GetIfSellerCanSellASIN: function (asin, domain = common.GetDomain()) {
        return new Promise((resolve, reject) => {

            var content = { "ASIN": asin, "Domain": domain };
            chrome.runtime.sendMessage({ content: content, type: "m16" }, (response) => {
                try {
                    if (response?.response && response.response.isSuccess != false) {
                        let returnData = {
                            product: "",
                            content: "",
                            title: "",
                            icon: "",
                            canSell: false
                        };

                        if ($("#signInSubmit", response.response).length > 0) {
                            // title = "CAN I SELL THIS PRODUCT?";
                            // icon = common.WarningIcon();
                            // popoverContent = "Please login to SellerCentral to see whether you can sell this product."
                            resolve();

                        } else if (response?.response?.products?.length > 0) {
                            returnData.product = response.response.products[0];
                            returnData.icon = common.SuccessIcon;

                            returnData.product.qualificationMessages?.forEach((qMessage) => {
                                if (!(qMessage.conditionList == null || qMessage.conditionList?.indexOf("New condition") > -1) && !returnData.content.indexOf("ADDITIONAL INFO") > -1) {
                                    returnData.content += "<u><b>ADDITIONAL INFO</b></u>";
                                }

                                if (qMessage.qualificationMessage || qMessage.conditionList) {
                                    returnData.content += "<li style='list-style: circle;'>";

                                    if (qMessage.qualificationMessage) {
                                        returnData.content += qMessage.qualificationMessage;
                                    }

                                    if (qMessage.conditionList) {
                                        returnData.content += " <strong>" + qMessage.conditionList + "</strong>";
                                    }
                                    returnData.content += "</li>";
                                }

                                if (qMessage.qualificationMessage && (qMessage.qualificationMessage.indexOf("You need approval") > -1 || qMessage.qualificationMessage.indexOf("not approved") > -1) &&
                                    (qMessage.conditionList == null || qMessage.conditionList?.indexOf("New condition") > -1)) {
                                    returnData.icon = common.WarningIcon("ms-text-danger");
                                }
                            });

                            if (returnData.product.ean || returnData.product.upc) {
                                $("#divBarcodes").removeClass("ms-d-none");
                                $("#spEAN").text(returnData.product.ean ?? "-");
                                $("#spUPC").text(returnData.product.upc ?? "-");
                            }

                            returnData.content += '<div class="ms-mt-2"><a href="https://sellercentral.amazon.' + domain + '/hz/approvalrequest?asin=' + asin + '" class="ms-btn ms-btn-warning ms-p-2 ms-text-dark ms-fw-bold" role="button">Request Approval</a></div>'

                            returnData.title = returnData.icon == common.SuccessIcon ? "YOU CAN SELL THIS PRODUCT" : "YOU CANNOT SELL THIS PRODUCT"
                            if (returnData.title == "YOU CAN SELL THIS PRODUCT") {
                                returnData.canSell = true;
                            }
                        }

                        resolve(returnData);
                    } else {
                        resolve();
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });
    }
}
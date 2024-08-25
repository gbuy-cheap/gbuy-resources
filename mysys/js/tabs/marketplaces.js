"use strict";

var otherMarketplaces = {
    Init: function (asin, domain) {
        this.BindEvents(asin, domain);
    },
    BindEvents: function (asin, domain) {
        $(document).on("click", "#marketplaces-tab", async function () {
            if (!$("#divMarketplacesTableHeader").attr("data-bound")) {
                $("#divMarketplacesTableHeader").attr("data-bound", true);
                try {
                    let othermarketplaces = await otherMarketplaces.GetOtherMarketplaces(asin, domain);
                    $("#divMarketplacesPleaseWait").addClass("ms-d-none");
                    $("#accordionQArb").removeClass("ms-d-none");
                    otherMarketplaces.SetMarketplaces(othermarketplaces, asin);

                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                    $("#divMarketplacesPleaseWait").text("Not Available");
                    otherMarketplaces.SetMarketplaces(null);
                }
            }
        });

        $(document).on("click", ".refreshMarketplaceData", async function () {
            let asin = $(this).data("asin");
            let domain = $(this).data("domain");

            $(".refreshMarketplaceData").addClass("disabled ms-text-secondary");
            common.ShowSpinner();

            try {
                let otherMarketplace = await otherMarketplaces.RefreshMarketplaceData(asin, domain);
                let parentTr = $(this).parents("tr").eq(0);

                parentTr.find(".bsr").html((otherMarketplace.BSR > 0 ? common.FormatNumber(otherMarketplace.BSR) : "-"));
                parentTr.find(".buyboxPrice").html((otherMarketplace.Price > 0 ? common.GetCurrencySymbolByCode(otherMarketplace.Currency) + "&nbsp;" + common.FormatNumber(otherMarketplace.Price.toFixed(2)) : "-"));
                parentTr.find(".lowestPrice").html((otherMarketplace.LowestPrice > 0 ? common.GetCurrencySymbolByCode(otherMarketplace.Currency) + "&nbsp;" + common.FormatNumber(otherMarketplace.LowestPrice.toFixed(2)) : "-"));
                parentTr.find(".offerCount").html((otherMarketplace.OfferCount > 0 ? otherMarketplace.OfferCount : "-"));
                parentTr.find(".fbaFee").html((otherMarketplace.FBAFee > 0 ? common.GetCurrencySymbolByCode(otherMarketplace.Currency) + "&nbsp;" + otherMarketplace.FBAFee.toFixed(2) : "-"));
                parentTr.find(".amzFeeRate").html((otherMarketplace.AmzFeeRate && otherMarketplace.AmzFeeRate >= 0 ? otherMarketplace.AmzFeeRate : "-"));

                let qArbParentTr = $(`#divMarketplacesQArbTableHeader input[value="${domain}"]`).parents("tr").eq(0);

                $(qArbParentTr).find(".fbaFee").val((otherMarketplace.FBAFee ?? 0).toFixed(2));
                $(qArbParentTr).find(".amzFeeRate").val(otherMarketplace.AmzFeeRate);

                $(qArbParentTr).find(".tooltipFbaFee").text((otherMarketplace.FBAFee ?? 0).toFixed(2));
                $(qArbParentTr).find(".tooltipRefFee").text(otherMarketplace.AmzFeeRate ?? 0);

                $(qArbParentTr).find(".sellPrice.priceDiffInput").val((otherMarketplace.Price ?? 0).toFixed(2));

                $(qArbParentTr).find(".sellPrice.priceDiffInput").trigger("keyup");

            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }

            $(".refreshMarketplaceData").removeClass("disabled ms-text-secondary");
            common.HideSpinner();
        });

        var accordionQArb = document.getElementById('accordionQArb')
        accordionQArb.addEventListener('hide.bs.collapse', function () {
            $("#divMarketplacesQArbTableHeader svg.outer-link-svg").addClass("ms-d-none");
            sessionStorage.setItem("qarb-acc-status", "hidden");
        });

        accordionQArb.addEventListener('show.bs.collapse', function () {
            $("#divMarketplacesQArbTableHeader svg.outer-link-svg").removeClass("ms-d-inline");
            sessionStorage.setItem("qarb-acc-status", "shown");
        });

        $(document).on("keyup", ".priceDiffInput", function () {
            let tr = $(this).parents("tr").eq(0);
            let buyCost = $(tr).find(".buyCost").val();
            let sellPrice = $(tr).find(".sellPrice").val();
            let fbaFee = $(tr).find(".fbaFee").val();
            let amzFeeRate = $(tr).find(".amzFeeRate").val();
            let vatPercent = $(tr).find(".vatPercent").val();
            let shipmentCost = $(tr).find(".shipmentCost").val();

            let prices = {
                BuyCost: buyCost,
                SellPrice: sellPrice,
                FbaFee: fbaFee,
                RefFeePercent: amzFeeRate,
                VATPercent: vatPercent,
                ShipmentCost: shipmentCost
            };

            let priceDiff = otherMarketplaces.CalculatePriceDiff(prices);

            otherMarketplaces.SetPriceDifference(tr, priceDiff);
        });
    },
    GetOtherMarketplaces: function (asin, domain) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ url: `${common.HOST}/api/amazon/othermarketplaces?ASIN=${asin}&domain=${domain}`, method: 'POST', type: "m0" }, (response) => {
                try {
                    if (response?.response?.isSuccess) {
                        resolve(common.ConvertToJSON(response.response.paramStr));
                    } else {
                        reject(response?.response?.userMessage)
                    }
                } catch (error) {
                    reject(error);
                }
            });
        })
    },
    RefreshMarketplaceData: function (asin, domain) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ url: `${common.HOST}/api/amazon/getothermarketplaceinfo?ASIN=${asin}&domain=${domain}`, method: 'POST', type: "m0" }, (response) => {
                try {
                    if (response?.response?.isSuccess) {
                        resolve(common.ConvertToJSON(response.response.paramStr));
                    } else {
                        reject(response?.response?.userMessage)
                    }
                } catch (error) {
                    reject(error);
                }
            });
        })
    },
    SetMarketplaces: async function (otherMPs, asin) {
        try {
            if (otherMPs?.length > 0) {
                $(".row-othermarket").remove();

                let localCurrencyCode = "";
                let localDomain = common.GetDomain();

                if (localDomain == "com.mx") {
                    localCurrencyCode = "M$";
                } else {
                    localCurrencyCode = common.GetCurrencySymbol(localDomain);
                }

                let isUserPremium = false;

                let userInfo = common.GetUserInfoFromSessionStorage();

                isUserPremium = userInfo?.UserType == "Premium";

                if (!isUserPremium) {
                    $("#accordionQArb").remove();
                }

                let shippingCosts = await settings.GetShippingCosts();

                var promises = otherMPs.map(async marketplace => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            let tbody = "";
                            let qAtBody = "";

                            let currencySymbol = common.GetCurrencySymbolByCode(marketplace.Currency);
                            if (marketplace.Currency == "MXN") {
                                currencySymbol = "M$";
                            }

                            let mpDomain = common.GetDomainByCountryName(marketplace.MarketplaceName);

                            tbody = "<tr>" +
                                "<td class='ms-p-0 ms-py-1 ms-text-end'>" +
                                "<a href='javascript:;' data-asin='" + asin + "' data-domain='" + mpDomain + "' class='ms-link-info refreshMarketplaceData'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-arrow-clockwise' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z'/><path d='M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z'/></svg></a>" +
                                "</td>" +
                                "<td class='ms-p-0 ms-py-1'><a href='https://www.amazon." + mpDomain + "/dp/" + asin + "?th=1&psc=1' target='_blank' class='ms-align-items-center ms-d-inline-flex ms-justify-content-center'><img src='" + common.GetFlagByCountryName(marketplace.MarketplaceName) + "' class='mp-flag ms-grow' style='z-index:1' title='Go to " + marketplace.MarketplaceName + " Marketplace'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='ms-d-block ms-link-primary' style='position:absolute;z-index:0' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z'/><path fill-rule='evenodd' d='M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z'/></svg></a></td>" +
                                "<td class='ms-p-0 ms-py-1 bsr'>" + (marketplace.BSR > 0 ? common.FormatNumber(marketplace.BSR) : "-") + "</td>" +
                                "<td class='ms-p-0 ms-py-1 buyboxPrice'>" + (marketplace.Price > 0 ? currencySymbol + "&nbsp;" + common.FormatNumber(marketplace.Price.toFixed(2)) : "-") + "</td>" +
                                "<td class='ms-p-0 ms-py-1 lowestPrice'>" + (marketplace.LowestPrice > 0 ? currencySymbol + "&nbsp;" + common.FormatNumber(marketplace.LowestPrice.toFixed(2)) : "-") + "</td>" +
                                "<td class='ms-p-0 ms-py-1 offerCount'>" + (marketplace.OfferCount > 0 ? marketplace.OfferCount : "-") + "</td>" +
                                "<td class='ms-p-0 ms-py-1 fbaFee'>" + (marketplace.FBAFee > 0 ? currencySymbol + "&nbsp;" + marketplace.FBAFee.toFixed(2) : "-") + "</td>" +
                                "<td class='ms-p-0 ms-py-1 amzFeeRate'>" + (marketplace.AmzFeeRate && marketplace.AmzFeeRate >= 0 ? marketplace.AmzFeeRate : "-") + "</td>" +
                                "</tr>";

                            if (isUserPremium && marketplace.CurrencyRate) {
                                let buyCost = common.ConvertToNumber($("#fbaSellInput").val()) * marketplace.CurrencyRate;

                                let prices = {
                                    BuyCost: buyCost,
                                    SellPrice: marketplace.Price,
                                    FbaFee: marketplace.FBAFee,
                                    RefFeePercent: marketplace.AmzFeeRate ?? 0,
                                    VATPercent: await settings.GetVAT(mpDomain),
                                    ShipmentCost: 0
                                };

                                let priceDiff = otherMarketplaces.CalculatePriceDiff(prices);

                                qAtBody =
                                    `<tr>
                                        <input type='hidden' class='currencyRate' value='${marketplace.CurrencyRate}' >
                                        <input type='hidden' class='vatPercent' value='${prices.VATPercent}' >
                                        <input type='hidden' class='fbaFee' value='${marketplace.FBAFee ?? 0}' >
                                        <input type='hidden' class='amzFeeRate' value='${marketplace.AmzFeeRate ?? 0}' >
                                        <input type='hidden' class='mpDomain' value='${mpDomain}' >
            
                                        <td class='ms-p-0 ms-py-1'><a href='https://www.amazon.${mpDomain}/dp/${asin}?th=1&psc=1' target='_blank' class='ms-align-items-center ms-d-inline-flex ms-justify-content-center'><img src='${common.GetFlagByCountryName(marketplace.MarketplaceName)}' class='mp-flag ms-grow' style='z-index:1' title='Go to ${marketplace.MarketplaceName} Marketplace'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='ms-d-block ms-link-primary outer-link-svg' style='position:absolute;z-index:0' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z'/><path fill-rule='evenodd' d='M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z'/></svg></a></td>                                
                                        <td class="ms-p-0 ms-py-1">
                                            <span class="ms-form-control-plaintext ms-pe-1 ms-p-0">${currencySymbol}</span>
                                        </td>
                                        <td class='ms-p-0 ms-py-1 tdSellPrice ms-pe-1'>
                                            <input type="number" class="sellPrice border-gray ms-form-control ms-me-1 priceDiffInput" value="${(marketplace.Price ?? 0).toFixed(2)}" step="0.10" min="0">
                                        </td>
                                        <td class='ms-p-0 ms-py-1 tdBuyCost ms-pe-1'>
                                            <input type="number" class="buyCost border-gray ms-form-control ms-me-1 priceDiffInput" value="${buyCost.toFixed(2)}" step="0.10" min="0">
                                        </td>
                                        <td class="ms-p-0 ms-py-1" style="max-width:50px;">
                                            <input type="number" class="shipmentCost border-gray ms-form-control priceDiffInput" value="${otherMarketplaces.GetShippingCostByDomain(shippingCosts, mpDomain)}" step="0.10" min="0">
                                        </td>
                                        <td class="ms-p-0 ms-py-1">
                                            <span class="ms-form-control-plaintext ms-p-0">${marketplace.EstMonthlySales > 0 ? common.FormatNumber(marketplace.EstMonthlySales) : "-"}</span>
                                        </td>
                                        <td class='ms-p-0 ms-py-1 ms-text-primary'>
                                            <span class="mys-tooltip">
                                                ${icons.GetInfoIcon()}
                                                <span class="mys-tooltiptext mys-tooltip-top ms-text-start" style="margin-left:-100px;">
                                                    <div class="ms-row">
                                                        <div class="ms-col-6 ms-pe-0">FBA Fee :</div>
                                                        <div class="ms-col-4 ms-ps-0">${currencySymbol}&nbsp;<span class="tooltipFbaFee">${(marketplace.FBAFee ?? 0).toFixed(2)}</span></div>
                                                        <div class="ms-col-6 ms-pe-0">Referral Fee :</div>
                                                        <div class="ms-col-4 ms-ps-0">%<span class="tooltipRefFee">${marketplace.AmzFeeRate}</span></div>
                                                        <div class="ms-col-6 ms-pe-0">VAT :</div>
                                                        <div class="ms-col-4 ms-ps-0">%<span class="tooltipVATPercent">${prices.VATPercent}</span></div>                                                
    
                                                    </div>
                                                </span>
                                            </span>                                    
                                        </td>
                                        <td class='ms-p-0 ms-py-1 ms-pe-1 ms-text-end'><span class="spPriceDiffParent ${priceDiff < 0 ? "ms-text-danger" : "ms-text-success"}"><span>${currencySymbol}</span>&nbsp;<span class="spPriceDiff">${priceDiff}</span></span></td>
                                    </tr>`;
                            }

                            let tablesContent = {
                                MainTableContent: tbody,
                                QArbTableContent: qAtBody
                            };

                            resolve(tablesContent);
                        } catch (error) {
                            reject(error);
                        }
                    });
                });

                Promise.all(promises).then((tablesContent) => {
                    tablesContent.forEach(tableContent => {
                        $("#divMarketplacesTableHeader tbody").append(tableContent.MainTableContent);
                        $("#divMarketplacesQArbTableHeader tbody").append(tableContent.QArbTableContent);
                    });

                    if (typeof sessionStorage !== 'undefined') {
                        let qArbAccStatus = sessionStorage.getItem("qarb-acc-status");
                        if (qArbAccStatus == "shown" || !qArbAccStatus) {
                            $("#accordionQArb #collapseQArb").collapse("show");
                        } else if (qArbAccStatus == "hidden") {
                            $("#accordionQArb #collapseQArb").collapse("hide");
                        }
                    }
                });
            } else {
                $("#divMarketplacesPleaseWait").text("Not Available").removeClass("ms-d-none");
                $("#accordionQArb").addClass("ms-d-none");
            }
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    CalculatePriceDiff: function (prices) {
        let buyCost = prices.BuyCost,
            sellPrice = prices.SellPrice,
            fbaFee = prices.FbaFee,
            amzFee = (sellPrice * (prices.RefFeePercent ?? 0)) / 100,
            vatAmount = prices.VATPercent > 0 ? common.CalculateVATPrice(sellPrice, prices.VATPercent) : 0,
            shipmentCost = prices.ShipmentCost,
            storageFee = prices.StorageFee ?? 0;

        return parseFloat(sellPrice - shipmentCost - buyCost - amzFee - fbaFee - storageFee - vatAmount).toFixed(2);
    },
    SetPriceDifference: function (parentTr, priceDiff) {
        $(parentTr).find(".spPriceDiff").text(priceDiff);

        if (priceDiff >= 0) {
            $(parentTr).find(".spPriceDiffParent").addClass("ms-text-success").removeClass("ms-text-danger")
        } else {
            $(parentTr).find(".spPriceDiffParent").removeClass("ms-text-success").addClass("ms-text-danger");
        }
    },
    GetShippingCostByDomain: (shippingCosts, domain) => {
        if (shippingCosts) {
            switch (domain) {
                case "ae":
                    return shippingCosts.AE;
                case "com.be":
                    return shippingCosts.BE;
                case "ca":
                    return shippingCosts.CA;
                case "de":
                    return shippingCosts.DE;
                case "es":
                    return shippingCosts.ES;
                case "fr":
                    return shippingCosts.FR;
                case "it":
                    return shippingCosts.IT;
                case "com.mx":
                    return shippingCosts.MX;
                case "nl":
                    return shippingCosts.NL;
                case "se":
                    return shippingCosts.SE;
                case "com.tr":
                    return shippingCosts.TR;
                case "co.uk":
                    return shippingCosts.UK;
                case "com":
                    return shippingCosts.USA;
                default:
                    return 0;
            }
        }
        return 0;
    }
}
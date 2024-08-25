"use strict";

var calculator = {
    SetEMS: function (ems) {
        $("#spEstSales").text(ems);
    },
    GetEMS: function () {
        return parseInt(common.ConvertToNumber($("#spEstSales").text()));
    },
    SetMyEMS: function () {
        let counter = 0;
        let myInt = setInterval(() => {
            try {
                if ($("#spFBMOffers").html() != "-" || $("#spFBAOffers").html() != "-") {
                    let EMS = this.GetEMS();
                    let myEMS = parseInt(EMS / (stockChecker.FBAs + stockChecker.FBMs + 1));
                    $("#spMyEstSales").text(common.FormatNumber(myEMS));
                    clearInterval(myInt);
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
            counter++;
            if (counter == 40) {
                clearInterval(myInt);
                $("#spMyEstSales").text("-");
            }
        }, 500);
    },
    SetRevenue: function () {
        let counter = 0;
        let myInt = setInterval(() => {
            try {
                if ((common.ConvertToNumber($("#spBuybox30").text()) || common.ConvertToNumber($("#fbaSellInput").val()))
                    && $("#spMyEstSales").text() != "") {
                    let fbaSellPrice = common.ConvertToNumber($("#spBuybox30").text());

                    if (isNaN(fbaSellPrice) || fbaSellPrice == 0) {
                        fbaSellPrice = $("#fbaSellInput").val();
                    }

                    let myMES = common.ConvertToNumber($("#spMyEstSales").text());

                    if (!isNaN(fbaSellPrice) && !isNaN(myMES)) {
                        let revenue = parseInt(parseFloat(fbaSellPrice) * parseInt(myMES));

                        $("#spEstRevenue").text(common.FormatNumber(revenue));
                        if ($("#spEstRevenue").text().length > 9) {
                            $("#spEstRevenue").parent("div").addClass("ms-fs-7");
                        }
                    } else {
                        $("#spEstRevenue").text("-");
                    }
                    clearInterval(myInt);
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
            counter++;
            if (counter == 40) {
                clearInterval(myInt);
            }
        }, 500);
    },
    ShowEMSWarning: function () {
        $("#spEstSalesWarn").removeClass("ms-d-none");
    },
    CreateInfosByPriceAndFees: function (jsonResult) {
        var content = {
            "ASIN": $("#spASIN").text(),
            "Domain": common.GetDomain(),
            "MarketPlace": jsonResult.MARKETPLACE,
            "Currency": jsonResult.CURRENCY,
            "Price": jsonResult.PRICE ?? 0
        };
        let storageFee = 0, varCloseFee = 0, referralFee = 0, fulfillmentFee = 0;

        common.GetFeesFromAmazon(content).then(returnVal => {
            try {
                storageFee = returnVal.StorageFee;
                varCloseFee = returnVal.VarCloseFee;
                referralFee = returnVal.ReferralFee;
                fulfillmentFee = returnVal.FulfillmentFee;
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        }).finally(() => {
            try {
                jsonResult.AMZ_FEE_RATE = jsonResult.AMZ_FEE_RATE || referralFee || 0;
                jsonResult.FBA_PRICE = jsonResult.FBA_PRICE || fulfillmentFee || 0;
                jsonResult.VAR_CLOSE_FEE = jsonResult.VAR_CLOSE_FEE || varCloseFee || 0;

                setFBMInfo(jsonResult.AMZ_FEE_RATE ?? 0, jsonResult.VAR_CLOSE_FEE ?? 0, jsonResult.CURRENCY_SYMBOL ?? "");
                setFBAInfo(jsonResult, storageFee);
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        })
    }
}

function initCalculator(jsonResult) {
    try {
        $("#fbmSellInput").val(jsonResult.PRICE >= 0 ? jsonResult.PRICE.toFixed(2) : 0);
        $("#fbaSellInput").val(jsonResult.PRICE >= 0 ? jsonResult.PRICE.toFixed(2) : 0);
        $("#spCategory").text(jsonResult.BSR_CATEGORY);
        $("#spBSR").text(jsonResult.BSR > 0 ? common.FormatNumber(jsonResult.BSR) : "-");
        $("#spTOP").text(jsonResult.TOP > 0 ? (common.FormatNumber(common.RoundToTwo(jsonResult.TOP)) + "%") : "-");

        $("#spParent").html(jsonResult.PARENT_ASIN && jsonResult.PARENT_ASIN != "N/A" ?
            `<a class="ms-link-info ms-text-decoration-underline" href="https://www.amazon.${common.GetDomain()}/dp/${jsonResult.PARENT_ASIN}?th=1&psc=1" target="_blank">${jsonResult.PARENT_ASIN}</a>` : "-");

        if ($("#spASIN").text() == jsonResult.PARENT_ASIN)
            $("#spUserWarning").text("Parent ASIN detected, some data may not be available. Try selecting a variation.");

        if (jsonResult.SHIP_WEIGHT) {
            $("#spShipWgt").text(`${common.FormatNumber(common.RoundToTwo(jsonResult.SHIP_WEIGHT))} ${jsonResult.SHIP_WEIGHT_TYPE}`);
        } else {
            $("#spShipWgt").text("-");
        }


        let buybox = common.GetBuyboxOuterHTML();
        if (buybox.indexOf("Amazon") > -1 && buybox.indexOf("isAmazonFulfilled") == -1) {
            if (buybox.indexOf("Amazon Warehouse") == -1) {
                buybox = "Amazon";
            }
        }

        $("#spBuybox").html(buybox);

        $("#spModel").text(jsonResult.MODEL || "-");

        if (jsonResult.DIMENSION_TYPE) {
            $("#spDim").text(`${common.RoundToTwo(jsonResult.DIMENSION_1) ?? "-"} x ${common.RoundToTwo(jsonResult.DIMENSION_2) ?? "-"} x ${common.RoundToTwo(jsonResult.DIMENSION_3) ?? "-"} ${jsonResult.DIMENSION_TYPE}`);
        } else {
            $("#spDim").text("-");
        }

        $("#spBrand").text(jsonResult.BRAND || "-");

        $("#spMfr").text(jsonResult.MANUFACTURER || "-");

        if (jsonResult.ITEM_WEIGHT_TYPE) {
            $("#spWeight").text(`${common.FormatNumber(common.RoundToTwo(jsonResult.ITEM_WEIGHT))} ${jsonResult.ITEM_WEIGHT_TYPE}`);
        } else {
            $("#spWeight").text("-");
        }

        calculator.CreateInfosByPriceAndFees(jsonResult);

        if (jsonResult.HISTORICAL_SALES_DATA) {
            $("#secHistoricalSalesData").removeClass("ms-d-none");
            contentPopover.LoadHistoricalSalesData(jsonResult.HISTORICAL_SALES_DATA, jsonResult.CURRENCY_SYMBOL);
        } else {
            $("#secHistoricalSalesData").addClass("ms-d-none");
        }

        $("#spSalesRank30").text(jsonResult.HISTORICAL_SALES_DATA?.SALES_RANK_AVG_30 > 0 ? common.FormatNumber(jsonResult.HISTORICAL_SALES_DATA?.SALES_RANK_AVG_30) : "-");
        $("#spSalesRank90").text(jsonResult.HISTORICAL_SALES_DATA?.SALES_RANK_AVG_90 > 0 ? common.FormatNumber(jsonResult.HISTORICAL_SALES_DATA?.SALES_RANK_AVG_90) : "-");

        $("#spSalesRankDrops30").text(jsonResult.HISTORICAL_SALES_DATA?.SALES_RANK_DROPS_30 > 0 ? common.FormatNumber(jsonResult.HISTORICAL_SALES_DATA?.SALES_RANK_DROPS_30) : "-");
        $("#spSalesRankDrops90").text(jsonResult.HISTORICAL_SALES_DATA?.SALES_RANK_DROPS_90 > 0 ? common.FormatNumber(jsonResult.HISTORICAL_SALES_DATA?.SALES_RANK_DROPS_90) : "-");

        $("#spEstSalesMonthly30").text(jsonResult.HISTORICAL_SALES_DATA?.EMS_AVG_30 > 0 ? common.FormatNumber(jsonResult.HISTORICAL_SALES_DATA?.EMS_AVG_30) : "-");
        $("#spEstSalesMonthly90").text(jsonResult.HISTORICAL_SALES_DATA?.EMS_AVG_90 > 0 ? common.FormatNumber(jsonResult.HISTORICAL_SALES_DATA?.EMS_AVG_90) : "-");

        // if (jsonResult.HISTORICAL_SALES_DATA?.BUYBOX_PRICE_AVG_30 > 0) {
        //     $("#spBuybox30").text(common.FormatNumber(jsonResult.HISTORICAL_SALES_DATA?.BUYBOX_PRICE_AVG_30));
        // } else {
        //     $("#spBuybox30").text("-");
        //     $("#spBuybox30").prev().addClass("ms-d-none");
        // }

        // if (jsonResult.HISTORICAL_SALES_DATA?.BUYBOX_PRICE_AVG_90 > 0) {
        //     $("#spBuybox90").text(common.FormatNumber(jsonResult.HISTORICAL_SALES_DATA?.BUYBOX_PRICE_AVG_90));
        // } else {
        //     $("#spBuybox90").text("-");
        //     $("#spBuybox90").prev().addClass("ms-d-none");
        // }

        if (jsonResult.HISTORICAL_SALES_DATA?.NEW_PRICE_AVG_30 > 0) {
            $("#spNewPrice30").text(common.FormatNumber(jsonResult.HISTORICAL_SALES_DATA?.NEW_PRICE_AVG_30));
        } else {
            $("#spNewPrice30").text("-");
            $("#spNewPrice30").prev().addClass("ms-d-none");
        }

        if (jsonResult.HISTORICAL_SALES_DATA?.NEW_PRICE_AVG_90 > 0) {
            $("#spNewPrice90").text(common.FormatNumber(jsonResult.HISTORICAL_SALES_DATA?.NEW_PRICE_AVG_90));
        } else {
            $("#spNewPrice90").text("-");
            $("#spNewPrice90").prev().addClass("ms-d-none");
        }

        if (jsonResult.HISTORICAL_SALES_DATA?.AMZ_PRICE_AVG_30 > 0) {
            $("#spAmazonPrice30").text(common.FormatNumber(jsonResult.HISTORICAL_SALES_DATA?.AMZ_PRICE_AVG_30));
        } else {
            $("#spAmazonPrice30").text("-");
            $("#spAmazonPrice30").prev().addClass("ms-d-none");
        }

        if (jsonResult.HISTORICAL_SALES_DATA?.AMZ_PRICE_AVG_90 > 0) {
            $("#spAmazonPrice90").text(common.FormatNumber(jsonResult.HISTORICAL_SALES_DATA?.AMZ_PRICE_AVG_90));
        } else {
            $("#spAmazonPrice90").text("-");
            $("#spAmazonPrice90").prev().addClass("ms-d-none");
        }

        if (jsonResult.ESTIMATED_MONTHLY_SALES) {
            $("#hidEstMonthlySales").text(common.FormatNumber(jsonResult.ESTIMATED_MONTHLY_SALES));
        }
        else {
            $("#hidEstMonthlySales").text("-");
        }
        if (isNaN(calculator.GetEMS()) || calculator.GetEMS() == 0) {
            calculator.SetEMS($("#hidEstMonthlySales").text());

            if (jsonResult.ESTIMATED_MONTHLY_SALES > 0) {
                calculator.SetMyEMS();
            } else {
                $("#spMyEstSales").text("-");
            }
        }

        let userInfo = common.GetUserInfoFromSessionStorage();
        if (userInfo?.UserType != "Premium" && !isNaN(calculator.GetEMS())) {
            if ($("#spMoSalesLabel").parent("span.help.mys-tooltip.ms-text-decoration-underline").length == 0) {
                $("#spMoSalesLabel").wrap("<span class='help mys-tooltip ms-text-decoration-underline'></span>");
                $("#spMoSalesLabel").after("<span class='mys-tooltiptext ms-text-start' style='top: 20px;'>Monthly Sales information we temporarily show you is for <u>PREMIUM</u> users.<br>Upgrade to <u>PREMIUM</u> to get unlimited access to this information in the future.</span>");
            }
        }

        if (jsonResult.PROD_SIZE_TIER) {
            $("#spSizeTier").text(jsonResult.PROD_SIZE_TIER.TIER);
            $("#hiddenSizeTierId").val(jsonResult.PROD_SIZE_TIER.TIER_ID);
        }

        calculator.SetRevenue();
    } catch (error) {
        errorHandler.SendErrorToAdmin(error);
    }
}

async function setFBMInfo(amzFeeRate, varCloseFee, currency) {
    try {
        await calcFBMProfit(amzFeeRate, varCloseFee);
        calcFBMMargin();
        calcFBMROI();
        $("input[id^='fbm'].ms-form-control.border-gray").on("keyup", async function () {
            await calcFBMProfit(amzFeeRate, varCloseFee);
            calcFBMROI();
            calcFBMMargin();
        });
        contentPopover.LoadFBMProfitPopover(amzFeeRate, varCloseFee, currency);
    } catch (error) {
        errorHandler.SendErrorToAdmin(error);
    }
}

async function setFBAInfo(jsonResult, storageFee) {
    try {
        contentPopover.LoadFBAProfitPopover(jsonResult.AMZ_FEE_RATE, jsonResult.FBA_PRICE, storageFee, jsonResult.VAR_CLOSE_FEE, jsonResult.CURRENCY_SYMBOL);
        await calcFBAProfit(jsonResult.AMZ_FEE_RATE, jsonResult.FBA_PRICE, storageFee, jsonResult.VAR_CLOSE_FEE);
        calcFBAROI();
        calcFBAMargin();
        $("input[id^='fba'].ms-form-control.border-gray").on("keyup", async function () {
            await calcFBAProfit(jsonResult.AMZ_FEE_RATE, jsonResult.FBA_PRICE, storageFee, jsonResult.VAR_CLOSE_FEE);
            calcFBAROI();
            calcFBAMargin();
        });
    } catch (error) {
        errorHandler.SendErrorToAdmin(error);
    }
}

async function calcFBMProfit(amzFeeRate, varCloseFee) {
    try {
        let sellPrice = $("#fbmSellInput").val();
        let buyCost = $("#fbmBuyInput").val();
        let amzFee = (sellPrice * amzFeeRate) / 100;
        let VAT = await settings.GetVAT();
        if (VAT > 0) {
            VAT = (sellPrice * VAT) / 100;
        }
        let fbmProfit = parseFloat(sellPrice - buyCost - amzFee - varCloseFee - VAT).toFixed(2);

        $("#spFBMProfit").text(common.FormatNumber(fbmProfit));
        if (fbmProfit < 0) {
            $("#spFBMProfit").parent().addClass("ms-text-danger");
        }
        else {
            $("#spFBMProfit").parent().removeClass("ms-text-danger");
        }
    } catch (error) {
        errorHandler.SendErrorToAdmin(error);
    }
}

async function calcFBAProfit(amzFeeRate, fbaPrice, storageFee, varCloseFee) {
    try {
        let sellPrice = $("#fbaSellInput").val();
        let buyCost = $("#fbaBuyInput").val();
        let amzFee = (sellPrice * (amzFeeRate ?? 0)) / 100;
        let VAT = await settings.GetVAT();
        if (VAT > 0) {
            VAT = common.CalculateVATPrice(sellPrice, VAT);
        }
        let fbaProfit = parseFloat(sellPrice - buyCost - amzFee - fbaPrice - storageFee - varCloseFee - VAT).toFixed(2);

        $("#spFBAProfit").text(common.FormatNumber(fbaProfit));
        if (fbaProfit < 0) {
            $("#spFBAProfit").parent().addClass("ms-text-danger");
        }
        else {
            $("#spFBAProfit").parent().removeClass("ms-text-danger");
        }
    } catch (error) {
        errorHandler.SendErrorToAdmin(error);
    }
}

function calcFBMMargin() {
    try {
        let fbmProfit = Number(common.ConvertToNumber($("#spFBMProfit").text()));
        let fbmSellPrice = Number($("#fbmSellInput").val());
        if (fbmSellPrice != 0) {
            let fbmMargin = Math.round(fbmProfit * 100 / fbmSellPrice);
            $("#spFBMMargin").text(fbmMargin + "%");
            if (fbmMargin < 0) {
                $("#spFBMMargin").addClass("ms-text-danger")
            }
            else {
                $("#spFBMMargin").removeClass("ms-text-danger")
            }
        }
        else {
            $("#spFBMMargin").text("-");
            $("#spFBMMargin").removeClass("ms-text-danger")
        }
    } catch (error) {
        errorHandler.SendErrorToAdmin(error);
    }
}

function calcFBAMargin() {
    try {
        let fbaProfit = Number(common.ConvertToNumber($("#spFBAProfit").text()));
        let fbaSellPrice = Number($("#fbaSellInput").val());
        if (fbaSellPrice != 0) {
            let fbaMargin = Math.round(fbaProfit * 100 / fbaSellPrice);
            $("#spFBAMargin").text(fbaMargin + "%");
            if (fbaMargin < 0) {
                $("#spFBAMargin").addClass("ms-text-danger");
            } else {
                $("#spFBAMargin").removeClass("ms-text-danger")
            }
        } else {
            $("#spFBAMargin").text("-");
            $("#spFBAMargin").removeClass("ms-text-danger")
        }
    } catch (error) {
        errorHandler.SendErrorToAdmin(error);
    }
}

function calcFBMROI() {
    try {
        let fbmProfit = Number(common.ConvertToNumber($("#spFBMProfit").text()));
        let fbmBuyCost = Number($("#fbmBuyInput").val());
        if (fbmBuyCost) {
            let fbmROI = Math.round(fbmProfit * 100 / fbmBuyCost);
            $("#spFBMROI").text(fbmROI + "%");
            if (fbmROI < 0) {
                $("#spFBMROI").addClass("ms-text-danger");
            } else {
                $("#spFBMROI").removeClass("ms-text-danger");
            }
        } else {
            $("#spFBMROI").text("-");
            $("#spFBMROI").removeClass("ms-text-danger");
        }
    } catch (error) {
        errorHandler.SendErrorToAdmin(error);
    }
}

function calcFBAROI() {
    try {
        let fbaProfit = Number(common.ConvertToNumber($("#spFBAProfit").text()));
        let fbaBuyCost = Number($("#fbaBuyInput").val());
        if (fbaBuyCost != 0) {
            let fbaROI = Math.round(fbaProfit * 100 / fbaBuyCost);
            $("#spFBAROI").text(fbaROI + "%");
            if (fbaROI < 0) {
                $("#spFBAROI").addClass("ms-text-danger");
            } else {
                $("#spFBAROI").removeClass("ms-text-danger");
            }
        } else {
            $("#spFBAROI").removeClass("ms-text-danger");
            $("#spFBAROI").text("-");
        }
    } catch (error) {
        errorHandler.SendErrorToAdmin(error);
    }
}
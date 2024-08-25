"use strict";

var popoverFBMProfit, popoverFBAProfit, popoverHSalesData;

var contentPopover = {
    LoadFBMProfitPopover: async function (amzFeeRate, varCloseFee, currency) {
        try {
            let fbmProfitInfoContent = `<div id='fbmProfitPopover' class='ms-container ms-bg-light ms-p-3'>` +
                `<div class='ms-row'>` +
                `<div class='ms-col-3 ms-text-end ms-pe-0 ms-text-success'><span class='currency'></span>&nbsp;<span id='spFBMPSellPrice'></span></div>` +
                `<div class='ms-col-9'>Sell Price</div>` +
                `</div>` +
                `<div class='ms-row'>` +
                `<div class='ms-col-3 ms-text-end ms-pe-0 ms-text-danger'><span class='currency'></span>&nbsp;<span id='spFBMPRefFee'></span></div>` +
                `<div class='ms-col-9'>Referral Fee (<span id='spFBMPAmzFeeRate'></span>%)</div>` +
                `</div>` +
                `<div class='ms-row ms-d-none'>` +
                `<div class='ms-col-3 ms-text-end ms-pe-0 ms-text-danger'><span class='currency'></span>&nbsp;<span id='spFBMPVarCloseFee'></span></div>` +
                `<div class='ms-col-9'>Variable Closing Fee</div>` +
                `</div>` +

                `<div class='ms-row ms-d-none'>` +
                `<div class='ms-col-3 ms-text-end ms-pe-0 ms-text-danger'><span class='currency'></span>&nbsp;<span id='spFBMPVATPrice'></span></div>` +
                `<div class='ms-col-9'>VAT (<span id='spFBMPVATRate'></span>%)</div>` +
                `</div>` +

                `<div class='ms-row ms-border-bottom'>` +
                `<div class='ms-col-3 ms-text-end ms-pe-0 ms-text-danger'><span class='currency'></span>&nbsp;<span id='spFBMPBuyCost'></span></div>` +
                `<div class='ms-col-9'>Buy Cost</div>` +
                `</div>` +
                `<div class='ms-row'>` +
                `<div class='ms-col-3 ms-text-end ms-pe-0 ms-text-info'><span class='currency'></span>&nbsp;<span id='spFBMProfitEst'></span></div>` +
                `<div class='ms-col-9'>Profit Estimated</div>` +
                `</div>` +
                `<p class='p-0 ms-m-0 ms-pt-2'><span class='ms-fw-bold'>Total Fees:</span>&nbsp;` +
                `<span class='ms-text-primary'><span class='currency'></span>&nbsp;<span id='spFBMPTotalFee'></span></span>` +
                `</p>` +
                `<p class='p-0 ms-m-0'><span class='ms-fw-bold'>Total Cost:</span>&nbsp;` +
                `<span class='ms-text-primary'><span class='currency'></span>&nbsp;<span id='spFBMPTotalCost'></span></span>` +
                `</p>` +
                `<p class='p-0 ms-m-0'><span class='ms-fw-bold'>Total Fees & Cost:</span>&nbsp;` +
                `<span class='ms-text-primary'><span class='currency'></span>&nbsp;<span id='spFBMPTotalFeesCost'></span></span>` +
                `</p>` +
                `</div>`;

            var fbmProfitEl = document.getElementById('svgFBMProfitInfo');

            if (!fbmProfitEl) {
                await common.Sleep(4000);
                fbmProfitEl = document.getElementById('svgFBMProfitInfo');
            }

            if (fbmProfitEl) {
                popoverFBMProfit = new bootstrap.Popover(fbmProfitEl, {
                    trigger: "focus",
                    html: true,
                    customClass: 'profit-popover',
                    title: '<h3 class="ms-d-flex ms-justify-content-between">FBM Seller Fees Breakdown<span id="closeFBMPPopover"></span></h3>',
                    content: fbmProfitInfoContent
                });

                fbmProfitEl.addEventListener('shown.bs.popover', async () => {
                    try {
                        $("#spFBMPSellPrice").text($("#fbmSellInput").val());
                        $("#spFBMPRefFee").text((($("#fbmSellInput").val() * amzFeeRate) / 100).toFixed(2));
                        $("#spFBMPAmzFeeRate").text(amzFeeRate);
                        $("#spFBMPBuyCost").text($("#fbmBuyInput").val());
                        if (varCloseFee > 0) {
                            $("#spFBMPVarCloseFee").parent().parent().removeClass("ms-d-none");
                            $("#spFBMPVarCloseFee").text(parseFloat(varCloseFee).toFixed(2));
                        }

                        let VAT = await settings.GetVAT();
                        let VATPrice = 0;
                        if (VAT > 0) {
                            $("#spFBMPVATPrice").parent().parent().removeClass("ms-d-none");
                            let price = Number($("#fbmSellInput").val());
                            VATPrice = common.CalculateVATPrice(price, VAT);
                            $("#spFBMPVATPrice").text(VATPrice.toFixed(2));
                            $("#spFBMPVATRate").text(VAT);
                        }

                        let fbmPSellPrice = parseFloat($("#spFBMPSellPrice").text()),
                            fbmPrefFee = parseFloat($("#spFBMPRefFee").text()),
                            fbmPBuyCost = parseFloat($("#spFBMPBuyCost").text());

                        $("#spFBMProfitEst").text((fbmPSellPrice - fbmPrefFee - fbmPBuyCost - VATPrice).toFixed(2));
                        $("#spFBMPTotalFee").text((fbmPrefFee).toFixed(2));
                        $("#spFBMPTotalCost").text((fbmPBuyCost + VATPrice).toFixed(2));

                        let fbmPTotalCost = parseFloat($("#spFBMPTotalCost").text()),
                            fbmPTotalFee = parseFloat($("#spFBMPTotalFee").text());

                        $("#spFBMPTotalFeesCost").text((fbmPTotalCost + fbmPTotalFee).toFixed(2));

                        $("#fbmProfitPopover .currency").text(currency);

                        $("#closeFBMPPopover").addClass("pointer ms-btn-close");

                        $("#closeFBMPPopover").click(function (e) {
                            popoverFBMProfit.hide();
                            e.preventDefault();
                        });
                    } catch (error) {
                        errorHandler.SendErrorToAdmin(error);
                    }
                });
            }
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    LoadFBAProfitPopover: async function (amzFeeRate, fulfillmentFee, monStoFee, varCloseFee, currency) {
        try {
            let fbaProfitInfoContent = `<div id='fbaProfitPopover' class='ms-container ms-bg-light ms-p-3'>` +
                `<div class='ms-row'>` +
                `<div class='ms-col-3 ms-text-end ms-pe-0 ms-text-success'><span class='currency'></span>&nbsp;<span id='spFBAPSellPrice'></span></div>` +
                `<div class='ms-col-9'>Sell Price</div>` +
                `</div>` +
                `<div class='ms-row'>` +
                `<div class='ms-col-3 ms-text-end ms-pe-0 ms-text-danger'><span class='currency'></span>&nbsp;<span id='spFBAPRefFee'></span></div>` +
                `<div class='ms-col-9'>Referral Fee (<span id='spFBAPAmzFeeRate'></span>%)</div>` +
                `</div>` +
                `<div class='ms-row'>` +
                `<div class='ms-col-3 ms-text-end ms-pe-0 ms-text-danger'><span class='currency'></span>&nbsp;<span id='spFBAPMonStoFee'></span></div>` +
                `<div class='ms-col-9'>Storage Fee</div>` +
                `</div>` +
                `<div class='ms-row ms-d-none'>` +
                `<div class='ms-col-3 ms-text-end ms-pe-0 ms-text-danger'><span class='currency'></span>&nbsp;<span id='spFBAPVarCloseFee'></span></div>` +
                `<div class='ms-col-9'>Variable Closing Fee</div>` +
                `</div>` +
                `<div class='ms-row ms-d-none'>` +
                `<div class='ms-col-3 ms-text-end ms-pe-0 ms-text-danger'><span class='currency'></span>&nbsp;<span id='spFBAPVATPrice'></span></div>` +
                `<div class='ms-col-9'>VAT (<span id='spFBAPVATRate'></span>%)</div>` +
                `</div>` +
                `<div class='ms-row'>` +
                `<div class='ms-col-3 ms-text-end ms-pe-0 ms-text-danger'><span class='currency'></span>&nbsp;<span id='spFBAPFulfillFee'></span></div>` +
                `<div class='ms-col-9'>Fulfillment Fee</div>` +
                `</div>` +
                `<div class='ms-row ms-border-bottom'>` +
                `<div class='ms-col-3 ms-text-end ms-pe-0 ms-text-danger'><span class='currency'></span>&nbsp;<span id='spFBAPBuyCost'></span></div>` +
                `<div class='ms-col-9'>Buy Cost</div>` +
                `</div>` +
                `<div class='ms-row'>` +
                `<div class='ms-col-3 ms-text-end ms-pe-0 ms-text-info'><span class='currency'></span>&nbsp;<span id='spFBAProfitEst'></span></div>` +
                `<div class='ms-col-9'>Profit Estimated</div>` +
                `</div>` +
                `<p class='p-0 ms-m-0 ms-pt-2'><span class='ms-fw-bold'>Total Fees:</span>&nbsp;` +
                `<span class='ms-text-primary'><span class='currency'></span>&nbsp;<span id='spFBAPTotalFee'></span></span>` +
                `</p>` +
                `<p class='p-0 ms-m-0'><span class='ms-fw-bold'>Total Cost:</span>&nbsp;` +
                `<span class='ms-text-primary'><span class='currency'></span>&nbsp;<span id='spFBAPTotalCost'></span></span>` +
                `</p>` +
                `<p class='p-0 ms-m-0'><span class='ms-fw-bold'>Total Fees & Cost:</span>&nbsp;` +
                `<span class='ms-text-primary'><span class='currency'></span>&nbsp;<span id='spFBAPTotalFeesCost'></span></span>` +
                `</p>` +
                `</div>`;

            let fbaProfitEl = document.getElementById('svgFBAProfitInfo');

            if (!fbaProfitEl) {
                await common.Sleep(4000);
                fbaProfitEl = document.getElementById('svgFBAProfitInfo');
            }

            if (fbaProfitEl) {
                popoverFBAProfit = new bootstrap.Popover(fbaProfitEl, {
                    trigger: "focus",
                    html: true,
                    customClass: 'profit-popover',
                    title: '<h3 class="ms-d-flex ms-justify-content-between">FBA Seller Fees Breakdown<span id="closeFBAPPopover"></span></h3>',
                    content: fbaProfitInfoContent
                });

                fbaProfitEl.addEventListener('shown.bs.popover', async () => {
                    try {
                        $("#spFBAPSellPrice").text($("#fbaSellInput").val());
                        $("#spFBAPRefFee").text((($("#fbaSellInput").val() * amzFeeRate) / 100).toFixed(2));
                        $("#spFBAPAmzFeeRate").text(amzFeeRate);
                        $("#spFBAPMonStoFee").text(monStoFee);
                        $("#spFBAPFulfillFee").text(fulfillmentFee);
                        $("#spFBAPBuyCost").text($("#fbaBuyInput").val());
                        if (varCloseFee > 0) {
                            $("#spFBAPVarCloseFee").parent().parent().removeClass("ms-d-none");
                            $("#spFBAPVarCloseFee").text(parseFloat(varCloseFee).toFixed(2));
                        }

                        let VAT = await settings.GetVAT();
                        let VATPrice = 0;
                        if (VAT > 0) {
                            let price = Number($("#fbaSellInput").val());
                            VATPrice = common.CalculateVATPrice(price, VAT);
                            $("#spFBAPVATPrice").parent().parent().removeClass("ms-d-none");
                            $("#spFBAPVATPrice").text(VATPrice.toFixed(2));
                            $("#spFBAPVATRate").text(VAT);
                        }

                        let fbaPSellPrice = parseFloat($("#spFBAPSellPrice").text()),
                            fbaPrefFee = parseFloat($("#spFBAPRefFee").text()),
                            fbaPMonStoFee = parseFloat($("#spFBAPMonStoFee").text()),
                            fbaPFulfillFee = parseFloat($("#spFBAPFulfillFee").text()),
                            fbaPBuyCost = parseFloat($("#spFBAPBuyCost").text());

                        $("#spFBAProfitEst").text((fbaPSellPrice - fbaPrefFee - fbaPMonStoFee - fbaPFulfillFee - fbaPBuyCost - VATPrice).toFixed(2));
                        $("#spFBAPTotalFee").text((fbaPrefFee + fbaPMonStoFee + fbaPFulfillFee).toFixed(2));
                        $("#spFBAPTotalCost").text((fbaPBuyCost + VATPrice).toFixed(2));

                        let fbaPTotalCost = parseFloat($("#spFBAPTotalCost").text()),
                            fbaPTotalFee = parseFloat($("#spFBAPTotalFee").text());

                        $("#spFBAPTotalFeesCost").text((fbaPTotalCost + fbaPTotalFee).toFixed(2));
                        $("#fbaProfitPopover .currency").text(currency);

                        $("#closeFBAPPopover").addClass("pointer ms-btn-close");

                        $("#closeFBAPPopover").click(function (e) {
                            popoverFBAProfit.hide();
                            e.preventDefault();
                        });
                    } catch (error) {
                        errorHandler.SendErrorToAdmin(error);
                    }
                });
            }
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    LoadHistoricalSalesData: async function (hsData, currency) {
        try {
            let hsdContent = "<div id='divHistory' class='my-table ms-container-fluid ms-bg-light'>" +
                "<div class='ms-row ms-fw-bold ms-border-bottom ms-text-center ms-py-2'>" +
                "<div></div>" +
                "<div>Current</div>" +
                "<div>30 Day</div>" +
                "<div>90 Day</div>" +
                "<div>180 Day</div>" +
                "<div>Lowest</div>" +
                "</div>" +
                "<div class='ms-row ms-border-bottom ms-py-1 ms-text-center'>" +
                "<div class='ms-fw-bold ms-text-start'>Sales Rank</div>" +
                "<div><span id='spPopSalesRankCurrent'>-</span></div>" +
                "<div><span id='spPopSalesRank30'>-</span></div>" +
                "<div><span id='spPopSalesRank90'>-</span></div>" +
                "<div><span id='spPopSalesRank180'>-</span></div>" +
                "<div><span id='spPopSalesRankLowest'>-</span></div>" +
                "</div>" +
                "<div class='ms-row ms-border-bottom ms-py-1 ms-text-center'>" +
                "<div class='ms-fw-bold ms-text-start'>Sales Rank Drops</div>" +
                "<div><span id='spPopSalesRankDropsCurrent'>-</span></div>" +
                "<div><span id='spPopSalesRankDrops30'>-</span></div>" +
                "<div><span id='spPopSalesRankDrops90'>-</span></div>" +
                "<div><span id='spPopSalesRankDrops180'>-</span></div>" +
                "<div><span id='spPopSalesRankDropsLowest'>-</span></div>" +
                "</div>" +
                "<div class='ms-row ms-border-bottom ms-py-1 ms-text-center'>" +
                "<div class='ms-fw-bold ms-text-start'>Amazon Price</div>" +
                "<div><span id='spPopAmzPriceCurrent'>-</span></div>" +
                "<div><span class='currency'></span>&nbsp;<span id='spPopAmzPrice30'>-</span></div>" +
                "<div><span class='currency'></span>&nbsp;<span id='spPopAmzPrice90'>-</span></div>" +
                "<div><span class='currency'></span>&nbsp;<span id='spPopAmzPrice180'>-</span></div>" +
                "<div><span class='currency'></span>&nbsp;<span id='spPopAmzPriceLowest'>-</span></div>" +
                "</div>" +
                "<div class='ms-row ms-border-bottom ms-py-1 ms-text-center'>" +
                "<div class='ms-fw-bold ms-text-start'>New Price</div>" +
                "<div><span class='currency'></span>&nbsp;<span id='spPopNewPriceCurrent'>-</span></div>" +
                "<div><span class='currency'></span>&nbsp;<span id='spPopNewPrice30'>-</span></div>" +
                "<div><span class='currency'></span>&nbsp;<span id='spPopNewPrice90'>-</span></div>" +
                "<div><span class='currency'></span>&nbsp;<span id='spPopNewPrice180'>-</span></div>" +
                "<div><span class='currency'></span>&nbsp;<span id='spPopNewPriceLowest'>-</span></div>" +
                "</div>" +
                "<div class='ms-row ms-border-bottom ms-py-1 ms-text-center'>" +
                "<div class='ms-fw-bold ms-text-start'>New Offer Count</div>" +
                "<div><span id='spPopNewOfferCoCurrent'>-</span></div>" +
                "<div><span id='spPopNewOfferCo30'>-</span></div>" +
                "<div><span id='spPopNewOfferCo90'>-</span></div>" +
                "<div><span id='spPopNewOfferCo180'>-</span></div>" +
                "<div><span id='spPopNewOfferCoLowest'>-</span></div>" +
                "</div>" +
                "<div class='ms-row ms-border-bottom ms-py-1 ms-text-center'>" +
                "<div class='ms-fw-bold ms-text-start'><span class='mys-tooltip help' id='divPopAmzOOS'>AMZ OOS %<span class='mys-tooltiptext mys-tooltip-left'>Amazon Out Of Stock</span></span></div>" +
                "<div><span id='spPopAmzOOSCurrent'>-</span></div>" +
                "<div><span id='spPopAmzOOS30'>-</span></div>" +
                "<div><span id='spPopAmzOOS90'>-</span></div>" +
                "<div><span id='spPopAmzOOS180'>-</span></div>" +
                "<div><span id='spPopAmzOOSLowest'>-</span></div>" +
                "</div>" +
                "<div class='ms-row ms-border-bottom ms-py-1 ms-text-center'>" +
                "<div class='ms-fw-bold ms-text-start'><span class='mys-tooltip help' id='divPop3POOS'>FBA & FBM OOS %<span class='mys-tooltiptext mys-tooltip-left'>FBM And FBA Out of Stock</span></span></div>" +
                "<div><span id='spPop3POOSCurrent'>-</span></div>" +
                "<div><span id='spPop3POOS30'>-</span></div>" +
                "<div><span id='spPop3POOS90'>-</span></div>" +
                "<div><span id='spPop3POOS180'>-</span></div>" +
                "<div><span id='spPop3POOSLowest'>-</span></div>" +
                "</div>" +
                "<div class='ms-row ms-border-bottom ms-py-1 ms-text-center'>" +
                "<div class='ms-fw-bold ms-text-start'>Used Offer Count</div>" +
                "<div><span id='spPopUsedOfferCountCurrent'>-</span></div>" +
                "<div><span id='spPopUsedOfferCount30'>-</span></div>" +
                "<div><span id='spPopUsedOfferCount90'>-</span></div>" +
                "<div><span id='spPopUsedOfferCount180'>-</span></div>" +
                "<div><span id='spPopUsedOfferCountLowest'>-</span></div>" +
                "</div>" +
                "</div>";

            var salesDataHistory = document.getElementById('salesDataHistory');

            if (!salesDataHistory) {
                await common.Sleep(4000);
                salesDataHistory = document.getElementById('salesDataHistory');
            }

            if (salesDataHistory) {
                popoverHSalesData = new bootstrap.Popover(salesDataHistory, {
                    html: true,
                    title: '<h3 class="ms-d-flex ms-justify-content-between">Historical Sales Data<span id="closeHSDPopover"></span></h3>',
                    content: hsdContent,
                    customClass: "hsdPopoverMinWidth"
                });

                salesDataHistory.addEventListener('shown.bs.popover', () => {
                    try {
                        $("#spPopSalesRankCurrent").text(hsData.SALES_RANK_CURRENT > 0 ? common.FormatNumber(hsData.SALES_RANK_CURRENT) : "-");
                        $("#spPopSalesRank30").text(hsData.SALES_RANK_AVG_30 > 0 ? common.FormatNumber(hsData.SALES_RANK_AVG_30) : "-");
                        $("#spPopSalesRank90").text(hsData.SALES_RANK_AVG_90 > 0 ? common.FormatNumber(hsData.SALES_RANK_AVG_90) : "-");
                        $("#spPopSalesRank180").text(hsData.SALES_RANK_AVG_180 > 0 ? common.FormatNumber(hsData.SALES_RANK_AVG_180) : "-");
                        $("#spPopSalesRankLowest").text(hsData.SALES_RANK_LOWEST > 0 ? common.FormatNumber(hsData.SALES_RANK_LOWEST) : "-");

                        $("#spPopSalesRankDrops30").text(hsData.SALES_RANK_DROPS_30 > 0 ? common.FormatNumber(hsData.SALES_RANK_DROPS_30) : "-");
                        $("#spPopSalesRankDrops90").text(hsData.SALES_RANK_DROPS_90 > 0 ? common.FormatNumber(hsData.SALES_RANK_DROPS_90) : "-");
                        $("#spPopSalesRankDrops180").text(hsData.SALES_RANK_DROPS_180 > 0 ? common.FormatNumber(hsData.SALES_RANK_DROPS_180) : "-");

                        if (hsData.AMZ_PRICE_AVG_30 > 0) {
                            $("#spPopAmzPrice30").text(common.FormatNumber(hsData.AMZ_PRICE_AVG_30));
                        } else {
                            $("#spPopAmzPrice30").text("-");
                            $("#spPopAmzPrice30").prev().addClass("ms-d-none")
                        }

                        if (hsData.AMZ_PRICE_AVG_90 > 0) {
                            $("#spPopAmzPrice90").text(common.FormatNumber(hsData.AMZ_PRICE_AVG_90));
                        } else {
                            $("#spPopAmzPrice90").text("-");
                            $("#spPopAmzPrice90").prev().addClass("ms-d-none")
                        }

                        if (hsData.AMZ_PRICE_AVG_180 > 0) {
                            $("#spPopAmzPrice180").text(common.FormatNumber(hsData.AMZ_PRICE_AVG_180));
                        } else {
                            $("#spPopAmzPrice180").text("-");
                            $("#spPopAmzPrice180").prev().addClass("ms-d-none")
                        }

                        if (hsData.AMZ_PRICE_LOWEST > 0) {
                            $("#spPopAmzPriceLowest").text(common.FormatNumber(hsData.AMZ_PRICE_LOWEST));
                        } else {
                            $("#spPopAmzPriceLowest").text("-");
                            $("#spPopAmzPriceLowest").prev().addClass("ms-d-none")
                        }

                        $("#spPopNewOfferCoCurrent").text(hsData.NEW_OFFER_COUNT_CURRENT > 0 ? common.FormatNumber(hsData.NEW_OFFER_COUNT_CURRENT) : "-");
                        $("#spPopNewOfferCo30").text(hsData.NEW_OFFER_COUNT_AVG_30 > 0 ? common.FormatNumber(hsData.NEW_OFFER_COUNT_AVG_30) : "-");
                        $("#spPopNewOfferCo90").text(hsData.NEW_OFFER_COUNT_AVG_90 > 0 ? common.FormatNumber(hsData.NEW_OFFER_COUNT_AVG_90) : "-");
                        $("#spPopNewOfferCo180").text(hsData.NEW_OFFER_COUNT_AVG_180 > 0 ? common.FormatNumber(hsData.NEW_OFFER_COUNT_AVG_180) : "-");

                        if (hsData.NEW_PRICE_CURRENT > 0) {
                            $("#spPopNewPriceCurrent").text(common.FormatNumber(hsData.NEW_PRICE_CURRENT));
                        } else {
                            $("#spPopNewPriceCurrent").text("-");
                            $("#spPopNewPriceCurrent").prev().addClass("ms-d-none")
                        }

                        if (hsData.NEW_PRICE_AVG_30 > 0) {
                            $("#spPopNewPrice30").text(common.FormatNumber(hsData.NEW_PRICE_AVG_30));
                        } else {
                            $("#spPopNewPrice30").text("-");
                            $("#spPopNewPrice30").prev().addClass("ms-d-none")
                        }

                        if (hsData.NEW_PRICE_AVG_90 > 0) {
                            $("#spPopNewPrice90").text(common.FormatNumber(hsData.NEW_PRICE_AVG_90));
                        } else {
                            $("#spPopNewPrice90").text("-");
                            $("#spPopNewPrice90").prev().addClass("ms-d-none")
                        }

                        if (hsData.NEW_PRICE_AVG_180 > 0) {
                            $("#spPopNewPrice180").text(common.FormatNumber(hsData.NEW_PRICE_AVG_180));
                        } else {
                            $("#spPopNewPrice180").text("-");
                            $("#spPopNewPrice180").prev().addClass("ms-d-none")
                        }

                        if (hsData.NEW_PRICE_LOWEST > 0) {
                            $("#spPopNewPriceLowest").text(common.FormatNumber(hsData.NEW_PRICE_LOWEST));
                        } else {
                            $("#spPopNewPriceLowest").text("-");
                            $("#spPopNewPriceLowest").prev().addClass("ms-d-none")
                        }

                        $("#spPopAmzOOS30").text(hsData.AMZ_OUT_OF_STOCK_30 > 0 ? common.FormatNumber(hsData.AMZ_OUT_OF_STOCK_30) : "-");
                        $("#spPopAmzOOS90").text(hsData.AMZ_OUT_OF_STOCK_90 > 0 ? common.FormatNumber(hsData.AMZ_OUT_OF_STOCK_90) : "-");

                        $("#spPop3POOS30").text(hsData.FBA_FBM_OUT_OF_STOCK_30 > 0 ? common.FormatNumber(hsData.FBA_FBM_OUT_OF_STOCK_30) : "-");
                        $("#spPop3POOS90").text(hsData.FBA_FBM_OUT_OF_STOCK_90 > 0 ? common.FormatNumber(hsData.FBA_FBM_OUT_OF_STOCK_90) : "-");

                        $("#spPopUsedOfferCountCurrent").text(hsData.USED_OFFER_COUNT_CURRENT > 0 ? common.FormatNumber(hsData.USED_OFFER_COUNT_CURRENT) : "-");
                        $("#spPopUsedOfferCount30").text(hsData.USED_OFFER_COUNT_AVG_30 > 0 ? common.FormatNumber(hsData.USED_OFFER_COUNT_AVG_30) : "-");
                        $("#spPopUsedOfferCount90").text(hsData.USED_OFFER_COUNT_AVG_90 > 0 ? common.FormatNumber(hsData.USED_OFFER_COUNT_AVG_90) : "-");
                        $("#spPopUsedOfferCount180").text(hsData.USED_OFFER_COUNT_AVG_180 > 0 ? common.FormatNumber(hsData.USED_OFFER_COUNT_AVG_180) : "-");

                        $("#divHistory .currency").text(currency);
                        $("#closeHSDPopover").addClass("pointer ms-btn-close");
                        $("#closeHSDPopover").click(function (e) {
                            popoverHSalesData.hide();
                            e.preventDefault();
                        });
                    } catch (error) {
                        errorHandler.SendErrorToAdmin(error);
                    }
                });
            }
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    RemovePopovers: function () {
        try {
            popoverFBMProfit?.dispose();
            popoverFBAProfit?.dispose();
            popoverHSalesData?.dispose();
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    }
}
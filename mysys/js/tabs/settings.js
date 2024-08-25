"use strict";

var settings = {
    Init: () => {
        $(".mysys").on("click", "#saveStockFilter", function (e) {
            e.preventDefault();

            $("#saveStockFilter").addClass("disabled");
            chrome.storage.local.get(['userSettings'], function (result) {
                try {
                    common.ShowSpinner();
                    if (result.userSettings) {
                        if (typeof result.userSettings == "string") {
                            result.userSettings = JSON.parse(result.userSettings);
                        }
                        result.userSettings.StockChecker = {
                            MinRating: $("#setsMinRating").val(),
                            MinFBack: $("#setsMinFBack").val()
                        }
                    }
                    else {
                        result.userSettings = {
                            StockChecker: {
                                MinRating: $("#setsMinRating").val(),
                                MinFBack: $("#setsMinFBack").val()
                            }
                        }
                    }
                    chrome.storage.local.set({ userSettings: result?.userSettings }, function () {
                        chrome.runtime.sendMessage({
                            type: "m0",
                            data: JSON.stringify(result?.userSettings),
                            url: `${common.HOST}/api/auth/usersettings`,
                            method: 'POST'
                        }, (response) => {
                            if (!response?.response?.isSuccess) {
                                toast.ShowError(response?.response?.userMessage);
                            }
                            common.HideSpinner();
                            $("#saveStockFilter").removeClass("disabled");

                            $("#stockFilterSaveSuccessIcon").fadeIn();
                            setTimeout(() => {
                                $("#stockFilterSaveSuccessIcon").fadeOut("slow");
                            }, 1000);
                        })
                    });
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                }
            })
        });

        $(".mysys").on("click", "#saveMESParameters", function (e) {
            e.preventDefault();
            $("#saveMESParameters").addClass("disabled");
            chrome.storage.local.get(['userSettings'], function (result) {
                try {
                    common.ShowSpinner();
                    let MESParameters = {
                        FBA: { Percent: $("#setsFBAPercent").val() },
                        FBM: {
                            Feedback: $("#setsFBMFeedback").val(),
                            Ratings: $("#setsFBMRatings").val()
                        }
                    }

                    if (result?.userSettings) {
                        if (typeof result.userSettings == "string") {
                            result.userSettings = JSON.parse(result.userSettings);
                        }
                        result.userSettings.MESParameters = MESParameters;
                    }
                    else {
                        result.userSettings = { MESParameters: MESParameters }
                    }
                    chrome.storage.local.set({ userSettings: result?.userSettings }, function () {
                        chrome.runtime.sendMessage({
                            type: "m0",
                            data: JSON.stringify(result?.userSettings),
                            url: `${common.HOST}/api/auth/usersettings`,
                            method: 'POST'
                        }, (response) => {
                            if (!response.response.isSuccess) {
                                toast.ShowError(response.response.userMessage);
                            }
                            common.HideSpinner();

                            $("#saveMESParameters").removeClass("disabled");

                            $("#mesSaveSuccessIcon").fadeIn();
                            setTimeout(() => {
                                $("#mesSaveSuccessIcon").fadeOut("slow");
                            }, 1000);
                        })
                    });
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                }
            });
        });

        $(".mysys").on('change', '#settings input.alert-filter', function () {
            try {
                $('input', $(this).parent('div.ms-form-check').next()).attr('disabled', !this.checked);

                if (!this.checked) {
                    $('input', $(this).parent('div.ms-form-check').next()).prop('checked', false);
                }

                if (this.id == 'cboxAmzNotSellerLast' && !this.checked) {
                    $('#settings #divSetsAmzOOS30').addClass('ms-d-none');
                    $('#settings #divSetsAmzOOS90').addClass('ms-d-none');

                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });

        $(".mysys").on("click", "#saveAlertSets", function (e) {
            e.preventDefault();

            $("#saveAlertSets").addClass("disabled");

            chrome.storage.local.get(['userSettings'], function (result) {
                try {
                    common.ShowSpinner();

                    let checkedSizes = [];
                    let amzNotSellerLast = {};
                    let salesRankExceeds, top, oos;

                    if ($("#cboxProduct").prop("checked")) {
                        $("input[name='cboxSizeTier']:checked").each((index, element) => {
                            checkedSizes.push(parseInt(element.value));
                        });
                    }

                    if ($("#cboxAmzNotSellerLast").prop("checked")) {
                        amzNotSellerLast.Days = $("input[name='amzNotSellerLastSettings']:checked").val();
                    }

                    oos = $("#cboxAmzOOS").prop("checked") && $("#setsAmzOOS").val() > 0 && parseInt($("#setsAmzOOS").val());

                    salesRankExceeds = $("#cboxSalesRankExc").prop("checked") && $("#salesRankExceeds").val() > 0 && parseInt($("#salesRankExceeds").val());

                    top = $("#cboxTop").prop("checked") && $("#setsTop").val() > 0 && parseFloat($("#setsTop").val());

                    let Alert = {};

                    if (checkedSizes && checkedSizes.length > 0) {
                        Alert.SizeTiers = checkedSizes;
                    }

                    if (Object.keys(amzNotSellerLast).length > 0) {
                        Alert.AmzNotSellerLast = amzNotSellerLast;
                    }

                    if (salesRankExceeds) {
                        Alert.SalesRankExceeds = salesRankExceeds;
                    }

                    if (top) {
                        Alert.Top = top;
                    }

                    if (oos) {
                        Alert.OOS = oos;
                    }

                    if (result.userSettings) {
                        if (typeof result.userSettings == "string") {
                            result.userSettings = JSON.parse(result.userSettings);
                        }

                        result.userSettings.Alert = Alert;
                    }
                    else {
                        if (Object.keys(Alert).length > 0) {
                            result.userSettings = {
                                Alert: Alert
                            };
                        }
                    }
                    chrome.storage.local.set({ userSettings: result.userSettings }, function () {
                        chrome.runtime.sendMessage({
                            type: "m0",
                            data: JSON.stringify(result.userSettings),
                            url: `${common.HOST}/api/auth/usersettings`,
                            method: 'POST'
                        }, (response) => {
                            if (!response.response.isSuccess) {
                                toast.ShowError(response.response.userMessage);
                            }
                            common.HideSpinner();
                            $("#saveAlertSets").removeClass("disabled");

                            $("#alertSuccessIcon").fadeIn();
                            setTimeout(() => {
                                $("#alertSuccessIcon").fadeOut("slow");
                            }, 1000);

                        })
                    });
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                }
            })
        });

        $(".mysys").on("click", "#saveVarSets", function (e) {
            e.preventDefault();

            $("#saveVarSets").addClass("disabled");
            chrome.storage.local.get(['userSettings'], function (result) {
                try {
                    common.ShowSpinner();
                    let VarSets = {
                        AutoCrawl: $("#cboxVarAutoStart").prop("checked")
                    }

                    if (result.userSettings) {
                        if (typeof result.userSettings == "string") {
                            result.userSettings = JSON.parse(result.userSettings);
                        }
                        result.userSettings.VarSets = VarSets;
                    } else {
                        result.userSettings = { VarSets: VarSets }
                    }
                    chrome.storage.local.set({ userSettings: result.userSettings }, function () {
                        chrome.runtime.sendMessage({
                            type: "m0",
                            data: JSON.stringify(result.userSettings),
                            url: `${common.HOST}/api/auth/usersettings`,
                            method: 'POST'
                        }, (response) => {
                            if (!response.response.isSuccess) {
                                toast.ShowError(response.response.userMessage);
                            }
                            common.HideSpinner();

                            $("#saveVarSets").removeClass("disabled");

                            $("#varSuccessIcon").fadeIn();
                            setTimeout(() => {
                                $("#varSuccessIcon").fadeOut("slow");
                            }, 1000);
                        })
                    });
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                }
            })

        });

        $(".mysys").on('change', '#collapseVAT input.vat-cbox', function () {
            $('input.vatInput', $(this).parent('div.ms-form-check').next()).attr('disabled', !this.checked);
        });

        $(".mysys").on("click", "#saveVATSets", function (e) {
            e.preventDefault();
            $(this).addClass("disabled");

            chrome.storage.local.get(['userSettings'], function (result) {
                common.ShowSpinner();
                try {
                    let VATSets = {
                        USA: $("#cboxVATforUSA").prop("checked") && $("#setsVATforUSA").val() > 0 ? Number($("#setsVATforUSA").val()) : 0,
                        UK: $("#cboxVATforUK").prop("checked") && $("#setsVATforUK").val() > 0 ? Number($("#setsVATforUK").val()) : 0,
                        DE: $("#cboxVATforDe").prop("checked") && $("#setsVATforDe").val() > 0 ? Number($("#setsVATforDe").val()) : 0,
                        CA: $("#cboxVATforCa").prop("checked") && $("#setsVATforCa").val() > 0 ? Number($("#setsVATforCa").val()) : 0,
                        FR: $("#cboxVATforFr").prop("checked") && $("#setsVATforFr").val() > 0 ? Number($("#setsVATforFr").val()) : 0,
                        IT: $("#cboxVATforIt").prop("checked") && $("#setsVATforIt").val() > 0 ? Number($("#setsVATforIt").val()) : 0,
                        ES: $("#cboxVATforEs").prop("checked") && $("#setsVATforEs").val() > 0 ? Number($("#setsVATforEs").val()) : 0,
                        MX: $("#cboxVATforMx").prop("checked") && $("#setsVATforMx").val() > 0 ? Number($("#setsVATforMx").val()) : 0
                    }

                    if (result.userSettings) {
                        if (typeof result.userSettings == "string") {
                            result.userSettings = JSON.parse(result.userSettings);
                        }
                        result.userSettings.VATSets = VATSets;
                    } else {
                        result.userSettings = { VATSets: VATSets }
                    }
                    chrome.storage.local.set({ userSettings: result.userSettings }, function () {
                        chrome.runtime.sendMessage({
                            type: "m0",
                            data: JSON.stringify(result.userSettings),
                            url: `${common.HOST}/api/auth/usersettings`,
                            method: 'POST'
                        }, (response) => {
                            if (!response.response.isSuccess) {
                                toast.ShowError(response.response.userMessage);
                            } else {
                                $("input[id^='fbm'].ms-form-control.border-gray").trigger("keyup");
                                $("input[id^='fba'].ms-form-control.border-gray").trigger("keyup");

                                $("#saveVATSets").removeClass("disabled");

                                $("#vatSuccessIcon").fadeIn();
                                setTimeout(() => {
                                    $("#vatSuccessIcon").fadeOut("slow");
                                }, 1000);
                            }
                            common.HideSpinner();
                        })
                    });
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                }
            });
        });

        $(".mysys").on("click", "#saveShipCost", function (e) {
            e.preventDefault();
            $(this).addClass("disabled");

            chrome.storage.local.get(['userSettings'], function (result) {
                common.ShowSpinner();
                try {
                    let ShipCost = {
                        USA: $("#setsShipCostForUSA").val() > 0 ? Number($("#setsShipCostForUSA").val()) : 0,
                        UK: $("#setsShipCostForUK").val() > 0 ? Number($("#setsShipCostForUK").val()) : 0,
                        DE: $("#setsShipCostForDE").val() > 0 ? Number($("#setsShipCostForDE").val()) : 0,
                        CA: $("#setsShipCostForCA").val() > 0 ? Number($("#setsShipCostForCA").val()) : 0,
                        FR: $("#setsShipCostForFR").val() > 0 ? Number($("#setsShipCostForFR").val()) : 0,
                        IT: $("#setsShipCostForIT").val() > 0 ? Number($("#setsShipCostForIT").val()) : 0,
                        ES: $("#setsShipCostForES").val() > 0 ? Number($("#setsShipCostForES").val()) : 0,
                        MX: $("#setsShipCostForMX").val() > 0 ? Number($("#setsShipCostForMX").val()) : 0,
                        TR: $("#setsShipCostForTR").val() > 0 ? Number($("#setsShipCostForTR").val()) : 0,
                        AE: $("#setsShipCostForAE").val() > 0 ? Number($("#setsShipCostForAE").val()) : 0,
                        NL: $("#setsShipCostForNL").val() > 0 ? Number($("#setsShipCostForNL").val()) : 0,
                        SE: $("#setsShipCostForSE").val() > 0 ? Number($("#setsShipCostForSE").val()) : 0,
                        BE: $("#setsShipCostForBE").val() > 0 ? Number($("#setsShipCostForBE").val()) : 0,
                    }

                    if (result.userSettings) {
                        if (typeof result.userSettings == "string") {
                            result.userSettings = JSON.parse(result.userSettings);
                        }
                        result.userSettings.ShipCost = ShipCost;
                    } else {
                        result.userSettings = { ShipCost: ShipCost }
                    }

                    chrome.storage.local.set({ userSettings: result.userSettings }, function () {
                        chrome.runtime.sendMessage({
                            type: "m0",
                            data: JSON.stringify(result.userSettings),
                            url: `${common.HOST}/api/auth/usersettings`,
                            method: 'POST'
                        }, (response) => {
                            if (!response.response.isSuccess) {
                                toast.ShowError(response.response.userMessage);
                            } else {

                                $("#saveShipCost").removeClass("disabled");

                                $("#saveShipCostSuccessIcon").fadeIn();
                                setTimeout(() => {
                                    $("#saveShipCostSuccessIcon").fadeOut("slow");
                                }, 1000);
                            }
                            common.HideSpinner();
                        })
                    });
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                }
            });
        });

        $(".mysys").on("click", "#saveBuyboxStats", function (e) {
            e.preventDefault();
            $("#saveBuyboxStats").addClass("disabled");

            chrome.storage.local.get(['userSettings'], function (result) {
                try {
                    common.ShowSpinner();
                    if (result.userSettings) {
                        if (typeof result.userSettings == "string") {
                            result.userSettings = JSON.parse(result.userSettings);
                        }
                        result.userSettings.BuyboxStatsDayInterval = $("#setsBuyboxStatsSearchDaysInterval").val();
                    }
                    else {
                        result.userSettings = {
                            BuyboxStatsDayInterval: $("#setsBuyboxStatsSearchDaysInterval").val()
                        }
                    }
                    chrome.storage.local.set({ userSettings: result?.userSettings }, function () {
                        chrome.runtime.sendMessage({
                            type: "m0",
                            data: JSON.stringify(result?.userSettings),
                            url: `${common.HOST}/api/auth/usersettings`,
                            method: 'POST'
                        }, (response) => {
                            if (!response?.response?.isSuccess) {
                                toast.ShowError(response?.response?.userMessage);
                            }
                            common.HideSpinner();
                            $("#saveBuyboxStats").removeClass("disabled");

                            $("#buyboxStatsSaveSuccessIcon").fadeIn();
                            setTimeout(() => {
                                $("#buyboxStatsSaveSuccessIcon").fadeOut("slow");
                            }, 1000);
                        })
                    });
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                }
            })
        });
    },
    GetSizeTiers: () => {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                type: "m0",
                url: `${common.HOST}/api/amazon/sizetiers`,
                method: 'GET'
            }, (response) => {
                if (response?.response?.isSuccess) {
                    try {
                        $("#divSetsAmericanSize").html("");
                        $("#divSetsEuropeanSize").html("");
                        let sizeTiers = JSON.parse(response.response.paramStr);
                        sizeTiers.forEach(sizeTier => {
                            let id = sizeTier.MP_REGION.toLowerCase() + sizeTier.TIER_ID;
                            let cbox = '<div class="ms-form-check ms-form-check-inline">' +
                                '<input name="cboxSizeTier" class="ms-form-check-input" type="checkbox" id="' + id + '" value="' + sizeTier.TIER_ID + '" disabled>' +
                                '<label class="ms-form-check-label ms-fw-normal" for="' + id + '">' + sizeTier.TIER + '</label>' +
                                '</div>';
                            if (sizeTier.TIER_ID < 10) {
                                $("#divSetsAmericanSize").append(cbox);
                            } else {
                                $("#divSetsEuropeanSize").append(cbox);
                            }
                        });
                        resolve();
                    } catch (error) {
                        errorHandler.SendErrorToAdmin(error);
                        response.response.userMessage = error;
                        reject(response.response.userMessage);
                    }
                } else {
                    reject(response?.response?.userMessage);
                }
            })
        })
    },
    Apply: (settings) => {
        if (settings) {
            try {
                if (typeof settings == "string") {
                    settings = JSON.parse(settings);
                }
                if (settings.ShipCost) {
                    $("#setsShipCostForUSA").val(settings.ShipCost.USA ?? 0);
                    $("#setsShipCostForCA").val(settings.ShipCost.CA ?? 0);
                    $("#setsShipCostForMX").val(settings.ShipCost.MX ?? 0);
                    $("#setsShipCostForDE").val(settings.ShipCost.DE ?? 0);
                    $("#setsShipCostForES").val(settings.ShipCost.ES ?? 0);
                    $("#setsShipCostForFR").val(settings.ShipCost.FR ?? 0);
                    $("#setsShipCostForIT").val(settings.ShipCost.IT ?? 0);
                    $("#setsShipCostForUK").val(settings.ShipCost.UK ?? 0);
                    $("#setsShipCostForAE").val(settings.ShipCost.AE ?? 0);
                    $("#setsShipCostForTR").val(settings.ShipCost.TR ?? 0);
                    $("#setsShipCostForNL").val(settings.ShipCost.NL ?? 0);
                    $("#setsShipCostForSE").val(settings.ShipCost.SE ?? 0);
                    $("#setsShipCostForBE").val(settings.ShipCost.BE ?? 0);
                }

                if (settings.StockChecker) {
                    if (settings.StockChecker.MinRating) {
                        $("#stockChecker #minRating").val(settings.StockChecker.MinRating);
                        $("#settings #setsMinRating").val(settings.StockChecker.MinRating);
                    }
                    if (settings.StockChecker.MinFBack) {
                        $("#stockChecker #minFBack").val(settings.StockChecker.MinFBack);
                        $("#settings #setsMinFBack").val(settings.StockChecker.MinFBack);
                    }
                }

                if (settings.MESParameters) {
                    if (settings.MESParameters.FBA?.Percent) {
                        $("#settings #setsFBAPercent").val(settings.MESParameters.FBA.Percent);
                    }
                    if (settings.MESParameters.FBM) {
                        if (settings.MESParameters.FBM.Feedback) {
                            $("#settings #setsFBMFeedback").val(settings.MESParameters.FBM.Feedback)
                        }
                        if (settings.MESParameters.FBM.Ratings) {
                            $("#settings #setsFBMRatings").val(settings.MESParameters.FBM.Ratings);
                        }
                    }
                }

                if (settings.Alert) {
                    if (settings.Alert.SizeTiers && settings.Alert.SizeTiers.length > 0) {
                        $("#cboxProduct").prop("checked", true);
                        $("input[name='cboxSizeTier']").removeAttr("disabled");

                        $("#cboxProduct").prop("checked", true);
                        settings.Alert.SizeTiers.forEach(value => {
                            $("input[name='cboxSizeTier'][value='" + value + "']").prop("checked", true);
                        })
                    }
                    if (settings.Alert.AmzNotSellerLast) {
                        $("#cboxAmzNotSellerLast").prop("checked", true);
                        $("input[name='amzNotSellerLastSettings']").removeAttr("disabled");

                        if (settings.Alert.AmzNotSellerLast.Days) {
                            $("#amzNotSellerLast" + settings.Alert.AmzNotSellerLast.Days).prop("checked", true);
                        }
                    }
                    if (settings.Alert.OOS) {
                        $("#cboxAmzOOS").prop("checked", true);
                        $("#setsAmzOOS").removeAttr("disabled");

                        $("#setsAmzOOS").val(settings.Alert.OOS);
                    }
                    if (settings.Alert.SalesRankExceeds) {
                        $("#cboxSalesRankExc").prop("checked", true);
                        $("#salesRankExceeds").removeAttr("disabled");

                        $("#salesRankExceeds").val(settings.Alert.SalesRankExceeds);
                    }
                    if (settings.Alert.Top) {
                        $("#cboxTop").prop("checked", true);
                        $("#setsTop").removeAttr("disabled");

                        $("#setsTop").val(settings.Alert.Top);
                    }
                }

                if (settings.VarSets) {
                    $("#cboxVarAutoStart").prop("checked", settings.VarSets.AutoCrawl);
                }

                if (settings.VATSets) {
                    if (settings.VATSets.USA) {
                        $("#cboxVATforUSA").prop("checked", true);
                        $("#setsVATforUSA").removeAttr("disabled");

                        $("#setsVATforUSA").val(settings.VATSets.USA);
                    } else {
                        $("#cboxVATforUSA").prop("checked", false);
                        $("#setsVATforUSA").attr("disabled", true);

                        $("#setsVATforUSA").val(0);
                    }
                    if (settings.VATSets.UK) {
                        $("#cboxVATforUK").prop("checked", true);
                        $("#setsVATforUK").removeAttr("disabled");

                        $("#setsVATforUK").val(settings.VATSets.UK);
                    } else {
                        $("#cboxVATforUK").prop("checked", false);
                        $("#setsVATforUK").attr("disabled", true);

                        $("#setsVATforUK").val(0);
                    }
                    if (settings.VATSets.DE) {
                        $("#cboxVATforDe").prop("checked", true);
                        $("#setsVATforDe").removeAttr("disabled");

                        $("#setsVATforDe").val(settings.VATSets.DE);
                    } else {
                        $("#cboxVATforDe").prop("checked", false);
                        $("#setsVATforDe").attr("disabled", true);

                        $("#setsVATforDe").val(0);
                    }
                    if (settings.VATSets.CA) {
                        $("#cboxVATforCa").prop("checked", true);
                        $("#setsVATforCa").removeAttr("disabled");

                        $("#setsVATforCa").val(settings.VATSets.CA);
                    } else {
                        $("#cboxVATforCa").prop("checked", false);
                        $("#setsVATforCa").attr("disabled", true);

                        $("#setsVATforCa").val(0);
                    }
                    if (settings.VATSets.FR) {
                        $("#cboxVATforFr").prop("checked", true);
                        $("#setsVATforFr").removeAttr("disabled");

                        $("#setsVATforFr").val(settings.VATSets.FR);
                    } else {
                        $("#cboxVATforFr").prop("checked", false);
                        $("#setsVATforFr").attr("disabled", true);

                        $("#setsVATforFr").val(0);
                    }
                    if (settings.VATSets.IT) {
                        $("#cboxVATforIt").prop("checked", true);
                        $("#setsVATforIt").removeAttr("disabled");

                        $("#setsVATforIt").val(settings.VATSets.IT);
                    } else {
                        $("#cboxVATforIt").prop("checked", false);
                        $("#setsVATforIt").attr("disabled", true);

                        $("#setsVATforIt").val(0);
                    }
                    if (settings.VATSets.ES) {
                        $("#cboxVATforEs").prop("checked", true);
                        $("#setsVATforEs").removeAttr("disabled");

                        $("#setsVATforEs").val(settings.VATSets.ES);
                    } else {
                        $("#cboxVATforEs").prop("checked", false);
                        $("#setsVATforEs").attr("disabled", true);

                        $("#setsVATforEs").val(0);
                    }
                    if (settings.VATSets.MX) {
                        $("#cboxVATforMx").prop("checked", true);
                        $("#setsVATforMx").removeAttr("disabled");

                        $("#setsVATforMx").val(settings.VATSets.MX);
                    } else {
                        $("#cboxVATforMx").prop("checked", false);
                        $("#setsVATforMx").attr("disabled", true);

                        $("#setsVATforMx").val(0);
                    }
                }

                if (settings.BuyboxStatsDayInterval) {
                    $("#setsBuyboxStatsSearchDaysInterval").val(settings.BuyboxStatsDayInterval);
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        }
    },
    CheckProductForAlert: (product) => {
        try {
            let matchedCriterias = "";
            let checkedSizeTiers = $("input[name='cboxSizeTier']:checked").toArray();

            if (checkedSizeTiers.some((el) => el.value == product.PROD_SIZE_TIER?.TIER_ID)) {
                matchedCriterias = "<li>" + product.PROD_SIZE_TIER.TIER + "</li>";
            }

            if ($("#cboxAmzNotSellerLast").prop("checked")) {
                if ($("#amzNotSellerLast30").prop("checked") && product.HISTORICAL_SALES_DATA?.AMZ_PRICE_AVG_30 <= 0) {
                    matchedCriterias += "<li>Amazon is a NOT Seller Last 30 Days</li>";
                } else if ($("#amzNotSellerLast90").prop("checked") && product.HISTORICAL_SALES_DATA?.AMZ_PRICE_AVG_90 <= 0) {
                    matchedCriterias += "<li>Amazon is a NOT Seller Last 90 Days</li>";
                }
            }

            if ($("#cboxAmzOOS").prop("checked") && $("#setsAmzOOS").val() > 0) {
                if (product.HISTORICAL_SALES_DATA?.AMZ_OUT_OF_STOCK_30 > 0 &&
                    $("#setsAmzOOS").val() <= product.HISTORICAL_SALES_DATA?.AMZ_OUT_OF_STOCK_30) {
                    matchedCriterias += "<li>Amazon OOS for 30 days is equal or greater than " + $("#setsAmzOOS").val() + "%</li>";
                }
                if (product.HISTORICAL_SALES_DATA?.AMZ_OUT_OF_STOCK_90 > 0 &&
                    $("#setsAmzOOS").val() <= product.HISTORICAL_SALES_DATA?.AMZ_OUT_OF_STOCK_90) {
                    matchedCriterias += "<li>Amazon OOS for 90 days is equal or greater than " + $("#setsAmzOOS").val() + "%</li>";
                }
            }

            parseInt($("#setsAmzOOS").val());

            if ($("#cboxSalesRankExc").prop("checked") &&
                $("#salesRankExceeds").val() > 0 &&
                product.BSR >= 0 &&
                $("#salesRankExceeds").val() >= product.BSR) {
                matchedCriterias += "<li>Sales Rank is equal or less than " + common.FormatNumber($("#salesRankExceeds").val()) + "</li>";
            }

            if ($("#cboxTop").prop("checked") &&
                $("#setsTop").val() > 0 &&
                product.TOP > 0 &&
                $("#setsTop").val() >= common.RoundToTwo(product.TOP)) {
                matchedCriterias += "<li>TOP (%) is equal or less than " + $("#setsTop").val() + "</li>";
            }

            if (matchedCriterias != "") {
                $("#svgProductAlert").removeClass("ms-d-none");

                matchedCriterias = "<strong>This product met some of your alert criteria:</strong><ul>" + matchedCriterias + "</ul>"

                var productAlert = document.getElementById('svgProductAlert')
                if (productAlert) {
                    var popoverSettingsAlert = new bootstrap.Popover(productAlert, {
                        trigger: "focus",
                        html: true,
                        title: '<h3 class="ms-d-flex ms-justify-content-between">Alert</h3>',
                        content: matchedCriterias
                    });

                    productAlert.addEventListener('shown.bs.popover', () => {
                        $("#svgProductAlert").removeClass("blink");
                    })
                }
            }
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    GetVAT: (domain = common.GetDomain()) => {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['userSettings'], function (result) {
                let VAT = 0;
                if (result.userSettings) {
                    if (typeof result.userSettings == "string") {
                        result.userSettings = JSON.parse(result.userSettings);
                    }
                    if (result?.userSettings?.VATSets) {
                        switch (domain) {
                            case "ca":
                                VAT = result.userSettings.VATSets.CA; break;
                            case "com.mx":
                                VAT = result.userSettings.VATSets.MX; break;
                            case "com":
                                VAT = result.userSettings.VATSets.USA; break;
                            case "de":
                                VAT = result.userSettings.VATSets.DE; break;
                            case "es":
                                VAT = result.userSettings.VATSets.ES; break;
                            case "fr":
                                VAT = result.userSettings.VATSets.FR; break;
                            case "it":
                                VAT = result.userSettings.VATSets.IT; break;
                            case "co.uk":
                                VAT = result.userSettings.VATSets.UK; break;
                        }
                    }
                }
                resolve(VAT);
            });
        });
    },
    GetShippingCosts: () => {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['userSettings'], function (result) {
                if (result.userSettings) {
                    if (typeof result.userSettings == "string") {
                        result.userSettings = JSON.parse(result.userSettings);
                    }
                    resolve(result?.userSettings?.ShipCost);
                }
                resolve();
            });
        });
    },
    GetBuyboxStatsDaysInterval: () => {
        return parseInt($("#setsBuyboxStatsSearchDaysInterval").val()) ?? 90;
    }
}
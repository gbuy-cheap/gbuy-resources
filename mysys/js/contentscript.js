"use strict";
var token;
var EbaySingleListAuth, AmazonCompAuth, EbayCompAuth, AmazonSearchAuth, WholesalerAuth, BuyboxStatsAuth;
var barcodeQ;

if (!toast.Exists()) {
    toast.Init();
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        try {
            if (request.message == "cmSearchOnAmazon") {
                searchOnPanel.SearchProducts(request.selectedDomain, request.selectedText);
            } else if (request.message == "extensionEnabled") {
                if (request.extensionEnabled != undefined && !request.extensionEnabled) {
                    $(".mysys").remove();
                } else {
                    InitExtensionWithChromeStorageInfo();
                }
            } else if (request.message == "qvEnabled") {
                if (request.qvEnabled == undefined || !request.qvEnabled) {
                    $(".divQVContent").remove();
                } else {
                    InitExtensionWithChromeStorageInfo();
                }
            } else if (request.message == "isTabActive" && request.isTabActive) {
                if ($(".mysys").length == 0) {
                    $("body").append("<span class='mysys ms-d-none'></span>");//add dummy element 
                    chrome.storage.local.get(["extensionEnabled"], function (result) {
                        try {
                            if (result.extensionEnabled == undefined || result.extensionEnabled) {
                                InitExtensionWithChromeStorageInfo();
                            }
                        } catch (error) {
                            errorHandler.SendErrorToAdmin("chrome.storage.local.get.extensionEnabled " + error);
                        }
                    });
                }
            } else {
                $(".mysys").remove();
                $(".divQVContent").remove();
                InitExtensionWithChromeStorageInfo();
            }

            return true;
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    }
);

function InitExtensionWithChromeStorageInfo() {
    chrome.storage.local.get(['mysysToken', 'userSettings'], function (result) {
        if (!result?.mysysToken) {
            common.SetUserInfoToSessionStorage();
        }
        token = result?.mysysToken;
        RouteByLocation(result?.mysysToken, result?.userSettings);
    })
}

async function RouteByLocation(mysysToken, userSettings) {
    try {
        await errorHandler.ResendErrorsToAdmin();

        let userInfo;
        try {
            userInfo = common.GetUserInfoFromSessionStorage();
        } catch (GetUserInfoFromSessionStorageError) {
            if ((typeof GetUserInfoFromSessionStorageError?.indexOf == 'function' && GetUserInfoFromSessionStorageError.indexOf("timed-out or invalid") == -1)) {
                errorHandler.SendErrorToAdmin("GetUserInfoFromSessionStorageError Error: " + GetUserInfoFromSessionStorageError + "\nToken: " + mysysToken);
            }
        }

        try {
            if (!userInfo || userInfo?.Token != mysysToken) {
                userInfo = await common.GetUserInfo();
            }
        } catch (GetUserInfoError) {
            if ((typeof GetUserInfoError?.indexOf == 'function' && GetUserInfoError.indexOf("timed-out or invalid") == -1)) {
                errorHandler.SendErrorToAdmin("GetUserInfoError Error: " + GetUserInfoError + "\nToken: " + mysysToken);
            } else {
                token = null;
            }
            EbaySingleListAuth = false;
            AmazonCompAuth = false;
            EbayCompAuth = false;
            AmazonSearchAuth = false;
            WholesalerAuth = false;
            BuyboxStatsAuth = false;
        }

        if (userInfo) {
            EbaySingleListAuth = userInfo.EbaySingleListAuth;
            AmazonCompAuth = userInfo.AmazonCompAuth;
            EbayCompAuth = userInfo.EbayCompAuth;
            AmazonSearchAuth = userInfo.AmazonSearchAuth;
            WholesalerAuth = userInfo.WholesalerAuth;
            BuyboxStatsAuth = userInfo.BuyboxStatsAuth;
            barcodeQ = await common.GetBarcodeQ();
            common.SetUserInfoToSessionStorage(userInfo);
        }
    } catch (error) {
        if (!error || error?.toString().indexOf("timed-out or invalid") == -1) {
            errorHandler.SendErrorToAdmin(error);
        } else {
            token = null;
        }
        EbaySingleListAuth = false;
        AmazonCompAuth = false;
        EbayCompAuth = false;
        AmazonSearchAuth = false;
        WholesalerAuth = false;
        BuyboxStatsAuth = false;
    }

    $(".mysys").remove();
    $(".ms-modal-backdrop.show").remove();
    $(".mysys *").off();

    searchOnPanel.Init();

    if (common.IsLocationValid()) {
        if (location.href.indexOf('www.amazon.') > -1) {
            let domain = common.GetDomain();
            if (!common.IsAddressSet(domain)) {
                common.SetAmazonAddress(domain);
            }

            if (location.href.indexOf('/dp/') > -1 ||
                location.href.indexOf("/gp/product") > -1) {
                $("#leftCol").css("overflow", "hidden");
                if ($("#centerCol #title_feature_div").length > 0) {
                    $("#centerCol #title_feature_div").after(extContent.Init());
                } else if ($("#centerCol").length > 0) {
                    $("#centerCol").prepend(extContent.Init());
                } else if ($("#titleblock_feature_div").length > 0) {
                    $("#titleblock_feature_div").after(extContent.Init());
                } else if ($(".buying:has(.parseasinTitle)").length > 0) {
                    $(".buying:has(.parseasinTitle)").after(extContent.Init());
                } else {
                    return false;
                }
                SetTabHeaders();

                init(mysysToken, userSettings);
            } else if (location.href.indexOf(domain + "/s?k=") > -1 ||
                location.href.indexOf(domain + "/s?me=") > -1 ||
                location.href.indexOf(domain + "/s?i=") > -1 ||
                location.href.indexOf(domain + "/s?rh") > -1 ||
                location.href.indexOf(domain + "/s?bbn") > -1) {
                quickview.LoadQVContent();
                amazon.InitArbitrage();
            } else if (location.href.indexOf("/gp/browse") > -1 ||
                location.href.indexOf(domain + "/b/ref") > -1 ||
                location.href.indexOf(domain + "/b/?node") > -1 ||
                location.href.indexOf(domain + "/Best-Sellers") > -1) {
                quickview.LoadQVContent();
            } else if (location.href.includes("/sp?") && location.href.includes("&seller")) {
                amazon.InitCompAnalysis();
            }
        } else if (location.href.includes("sellercentral.amazon")) {
            if (location.href.indexOf('sellercentral.amazon.com') > -1) {
                order.Init();
            }
            if (location.href.includes("product-search/search?q=")) {
                SellerCentralSearchProduct();
            }
        } else {
            if (location.href.includes("www.hepsiburada.com")) {
                hepsiburada.Init();
            } else if (location.href.includes("www.trendyol.com")) {
                trendyol.Init();
            } else if (location.href.includes("www.ebay.") && location.href.includes("/sch/")) {
                ebay.Init();
            } else if (location.href.includes("www.boyner.")) {
                boyner.Init();
            } else if (location.href.includes("www.morhipo.") && location.href != "https://www.morhipo.com/") {
                morhipo.Init();
            } else if (location.href.includes("www.n11.com")) {
                n11.Init();
            } else if (location.href.includes("www.samsclub.com")) {
                samsclub.Init();
            } else if (location.href.includes("qogita.com")) {
                // qogita.Init();
            }
        }
    }
}

function init(mysysToken, userSettings) {
    if ($("body #leftCol").width() > 700) {
        $("body #leftCol").css("max-width", "700px");
    }

    let minMaxBtnParams = {
        Key: "ProductPage",
        MinWidth: $(".mysys").css("width"),
        MinHeight: "32px",
        VisibleElemsOnMinimize: [$("#topPanel")],
        MaximizeBtn: icons.MaximizeIcon("ms-float-start ms-me-2"),
        MinimizeBtn: icons.MinimizeIcon("ms-float-start ms-me-2")
    };

    common.InitMinMaxButton(minMaxBtnParams);

    if (mysysToken) {
        SetScreen(userSettings);
    } else {
        ShowWarning();
        RemoveContent();
    }

    $('#form-login').submit((e) => {
        e.preventDefault();
        try {
            $("#form-login button").prop('disabled', true);
            chrome.runtime.sendMessage(
                {
                    email: $('#form-login input[name=email]').val(),
                    password: $('#form-login input[name=password]').val(),
                    type: "m7"
                }, (response) => {
                    $("#form-login button").prop('disabled', false);
                    if (response?.response) {
                        if (response.response.isSuccess) {
                            chrome.storage.local.set({ mysysToken: response.response.paramStr, userSettings: response.response.paramStr2 }, function () {
                                InitExtensionWithChromeStorageInfo();
                            });
                        } else {
                            toast.ShowError(response.response.userMessage);
                        }
                    }
                });
        } catch (error) {
            $("#form-login button").prop('disabled', false);
            errorHandler.SendErrorToAdmin(error);
        }
    });

    $("#form-signup").submit((e) => {
        e.preventDefault();
        try {
            $("#form-signup button").prop('disabled', true);
            $("#form-signup button").text("Please Wait");
            chrome.runtime.sendMessage(
                {
                    name: $('#form-signup input[name=name]').val(),
                    email: $('#form-signup input[name=email]').val(),
                    password: $('#form-signup input[name=password]').val(),
                    confirmpassword: $('#form-signup input[name=confirmpassword]').val(),
                    phone: $('#form-signup input[name=phone]').val(),
                    type: "m8"
                }, (response) => {
                    if (response?.response) {
                        if (response.response.isSuccess) {
                            if (response.response.returnVal.isSuccess) {
                                toast.ShowMessage(response.response.returnVal.userMessage, "REGISTRATION");
                            }
                            else {
                                let warning = response.response?.returnVal?.userMessage;
                                if (!warning || warning == "") {
                                    warning = response.response?.returnVal?.errors?.Password?.toString();
                                }
                                toast.ShowWarning(warning);
                            }
                        } else {
                            toast.ShowError(common.CreateErrorMessageByjqXHR(response.response));
                        }
                    }
                    $("#form-signup button").prop('disabled', false);
                    $("#form-signup button").text("Register");
                });
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    });
}

function SetProductDataToScreen(asin, domain) {
    common.ShowSpinner();

    stockChecker.Init(asin);

    otherMarketplaces.Init(asin, domain);

    chrome.runtime.sendMessage(
        {
            method: 'POST',
            url: `${common.HOST}/api/amazon/product?ASIN=${asin}&domain=${domain}`,
            type: "m0",
            data: { amzUrl: document.URL }
        },
        async (response) => {
            try {
                if (response?.response) {
                    let premiumLink = await common.GetPremiumLink(token);
                    let amzSellerToken = 'https://app.mysys.com/Extension/StartAmzIntegration?token=' + token;
                    let userInfo = common.GetUserInfoFromSessionStorage();

                    if (userInfo?.UserType != "Premium") {
                        $("#premiumLink").attr("href", premiumLink);
                        $("#qArbCalcPremiumWarn #premiumLink").attr("href", premiumLink);
                    } else {
                        $("#premiumLink").parents(".ms-accordion-item").eq(0).remove();
                        $("#qArbCalcPremiumWarn").remove();
                    }

                    if (!BuyboxStatsAuth) {
                        $("#buyboxStatsAuthWarning").removeClass("ms-d-none").addClass("ms-d-block");
                    }

                    if (!userInfo?.IsMysysUser) {
                        let mysysSignUpText = "You can try <a href='https://app.mysys.com/SignUp/Index/57' target='_blank'>MySYS Arbitrage Analysis</a> <b>for free</b> with more comprehensive analysis and easy listing capabilities.";
                        $("#mysc-footer div.mysysFooter").addClass("ms-d-inline");
                        $("#mysc-footer div.mysysFooter").html(mysysSignUpText);
                        $("#mysc-footer").css("height", "45px");
                        $("#mysc-footer").addClass("ms-d-flex ms-align-items-center");
                    } else {
                        $("#mysc-footer").css("height", "30px");
                    }

                    $("#amzSellerTokenLink").attr("href", amzSellerToken);

                    let premiumAnchorTag = '<a href="' + premiumLink + '" class="ms-text-primary" target="_blank"><u>Upgrade to PREMIUM</u></a>';

                    if (response.response.isSuccess) {
                        let jsonResult = JSON.parse(response.response.paramStr);
                        if (jsonResult.CURRENCY_SYMBOL == "MXN") {
                            jsonResult.CURRENCY_SYMBOL = "$";
                        }

                        let manifestData = chrome.runtime.getManifest();
                        if (manifestData.version != jsonResult.VERSION) {
                            toast.ShowWarning("Warning", "The extension version being used is out of date. Please update it.");
                        }

                        if (jsonResult.BSR_CATEGORY ||
                            jsonResult.MODEL ||
                            jsonResult.BRAND) {
                            initCalculator(jsonResult);
                            variations.Init(jsonResult.PARENT_ASIN, jsonResult.BSR_CATEGORY);
                            $(".currency").text(jsonResult.CURRENCY_SYMBOL);

                            topPanel.SetIsMeltable(jsonResult.IS_MELTABLE);
                        } else {
                            Crawl(asin, domain).then((crawledData) => {
                                initCalculator(crawledData);
                                variations.Init(crawledData.PARENT_ASIN, crawledData.BSR_CATEGORY);
                                $(".currency").text(crawledData.CURRENCY_SYMBOL);
                            })
                        }

                        if (response.response.paramStr2) {
                            $("#spUserTypeInfo").parent().removeClass("ms-d-none");
                            if (userInfo?.UserType != "Premium") {
                                response.response.paramStr2 += "<br>" + premiumAnchorTag;
                            }
                            $("#spUserTypeInfo").html(response.response.paramStr2);
                        }

                        settings.CheckProductForAlert(jsonResult);

                        wishlist.Init(asin);

                        let counter = 0;
                        let myInt = setInterval(() => {
                            counter++;
                            if (($("#spFBAProfit").text() && $("#spMyEstSales").text()) ||
                                counter >= 10) {
                                common.HideSpinner();
                                clearInterval(myInt);
                            }
                        }, 500);
                    } else {
                        if (response.response.statusCode == 401) {
                            ShowWarning();
                        } else if (response.response.statusCode == 402 ||
                            response.response.userMessage == "Failed to fetch") {
                            $("#spUserTypeInfo").parent().removeClass("ms-d-none");
                            if (response.response.statusCode == 402) {
                                $("#spUserTypeInfo").html(response.response.userMessage + "<br>" + premiumAnchorTag);
                            } else {
                                $("#spUserTypeInfo").html(premiumAnchorTag);
                            }
                            Crawl(asin, domain).then((crawledData) => {
                                initCalculator(crawledData);
                                variations.Init(crawledData.PARENT_ASIN, crawledData.BSR_CATEGORY);
                                $(".currency").text(crawledData.CURRENCY_SYMBOL);

                                let counter = 0;
                                let myInt = setInterval(() => {
                                    counter++;
                                    if ($("#spFBAProfit").text() || counter >= 10) {
                                        common.HideSpinner();
                                        clearInterval(myInt);
                                    }
                                }, 500);
                            })
                        } else {
                            if (response.response.userMessage) {
                                if (response.response.userMessage.indexOf("Failed to fetch") > -1) {
                                    toast.ShowWarning(`<strong>If you are experiencing issues with the MySYS Extension, you can try the following steps:</strong>
                                                        <ol>
                                                            <li>At the top right of the Chrome, click More <img src="//lh3.googleusercontent.com/E2q6Vj9j60Dw0Z6NZFEx5vSB9yoZJp7C8suuvQXVA_2weMCXstGD7JEvNrzX3wuQrPtL=w36-h36" width="18" height="18" alt="More" data-mime-type="image/png" data-alt-src="//lh3.googleusercontent.com/E2q6Vj9j60Dw0Z6NZFEx5vSB9yoZJp7C8suuvQXVA_2weMCXstGD7JEvNrzX3wuQrPtL"> <img src="//lh3.googleusercontent.com/QbWcYKta5vh_4-OgUeFmK-JOB0YgLLoGh69P478nE6mKdfpWQniiBabjF7FVoCVXI0g=h36" width="auto" height="18" alt="and then" data-mime-type="image/png" data-alt-src="//lh3.googleusercontent.com/QbWcYKta5vh_4-OgUeFmK-JOB0YgLLoGh69P478nE6mKdfpWQniiBabjF7FVoCVXI0g">&nbsp;<strong>Extensions</strong>.</li>
                                                            <li>Make your changes:
                                                            <ul>
                                                                <li><strong>Allow site access:</strong> On the extension, click <strong>Details</strong>. Next to “Allow this extension to read and change all your data on websites you visit,” change the extension’s site access to <strong>On all sites</strong>.</li>
                                                            </ul>
                                                            </li>
                                                        </ol>
                                                        <ul>
                                                            <li>
                                                                <strong>You can also <a class="ms-text-decoration-none" href="mailto:ext.mysys@gmail.com?cc=b.emre@mysys.com;roxdeveloper.bahadir@gmail.com&amp;subject=MySYS%20Extension" target="_blank" id="premiumLink">Contact Us</a></strong>
                                                            </li>
                                                        </ul>`);
                                } else {
                                    toast.ShowError(response.response.userMessage);
                                }
                            }
                            $("#mysc-main-div span[data-container='true']").html("");
                            $("#spUserTypeInfo").parent().addClass("ms-d-none");
                            common.HideSpinner();
                        }
                    }
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        })
}

function GetRegionKeyByDomain(domain) {
    switch (domain) {
        case "ca":
            return "CA";
        case "com.mx":
            return "MX";
        case "com":
            return "US";
        case "com.br":
            return "BR";
        case "de":
            return "DE";
        case "es":
            return "ES";
        case "fr":
            return "FR";
        case "it":
            return "IT";
        case "co.uk":
            return "UK";
        case "in":
            return "IN";
        case "jp":
            return "JP";
        case "cn":
            return "CN";
        case "ae":
            return "AE";
        case "sg":
            return "SG";
        case "com.tr":
            return "TR";
        case "com.au":
            return "AU"
        default:
            return "";
    }
}

function ShowContent() {
    $("#main-content").removeClass("ms-d-none");
    $("#main-warning").addClass("ms-d-none");
}

function ShowWarning(warningMessage) {
    $("#main-content").addClass("ms-d-none");
    $("#main-warning").removeClass("ms-d-none");
    if (warningMessage) {
        $("#divWarningMessage").removeClass("ms-d-none");
        $("#spMainWarningMessage").html(warningMessage);
        $("#accordionAuth").addClass("ms-d-none");
    } else {
        $("#divWarningMessage").addClass("ms-d-none");
        $("#accordionAuth").removeClass("ms-d-none");
    }
}

function RemoveContent() {
    $("#mysc-main-div span[id^='sp']").not("#spEstSalesWarn").not("#spUserWarning").not("#spMoSalesLabel")
        .not("#spMainWarningMessage").html("");
    contentPopover.RemovePopovers();
    $("#stockGrid").html("");
}

function SetTabHeaders() {
    if ($("#mysc-main-div").width() < 493) {
        $("span.tab-header-text").addClass("ms-d-none");
        $("a.ms-nav-link").removeClass("ms-d-flex");

        $("li[role='presentation'] #calc-tab.mys-tooltip").prepend('<span class="ms-bg-white ms-border mys-tooltip-top mys-tooltiptext ms-text-dark" style="min-width:100px;margin-left:-50px">Calculator</span>');
        $("li[role='presentation'] #stockChecker-tab.mys-tooltip").prepend('<span class="ms-bg-white ms-border mys-tooltip-top mys-tooltiptext ms-text-dark" style="min-width:100px;margin-left:-50px">Stocks</span>');
        $("li[role='presentation'] #marketplaces-tab.mys-tooltip").prepend('<span class="ms-bg-white ms-border mys-tooltip-top mys-tooltiptext ms-text-dark" style="min-width:100px;margin-left:-50px">Marketplaces</span>');
        $("li[role='presentation'] #wishlist-tab.mys-tooltip").prepend('<span class="ms-bg-white ms-border mys-tooltip-top mys-tooltiptext ms-text-dark" style="min-width:100px;margin-left:-50px">Wishlist</span>');
        $("li[role='presentation'] #variations-tab.mys-tooltip").prepend('<span class="ms-bg-white ms-border mys-tooltip-top mys-tooltiptext ms-text-dark" style="min-width:100px;margin-left:-50px">Variations</span>');
        $("li[role='presentation'] #settings-tab.mys-tooltip").prepend('<span class="ms-bg-white ms-border mys-tooltip-top mys-tooltiptext ms-text-dark" style="min-width:100px;margin-left:-50px">Settings</span>');
        $("li[role='presentation'] #contact-tab.mys-tooltip").prepend('<span class="ms-bg-white ms-border mys-tooltip-top mys-tooltiptext ms-text-dark" style="min-width:100px;margin-left:-50px">Contact</span>');
    }
}

async function SetScreen(userSettings) {

    let domain = common.GetDomain();

    if (!$("#spASIN").text()) {
        await findASIN();
    }

    let asin = $("#spASIN").text();

    ShowContent();

    contact.Init();
    topPanel.Init(asin, domain);
    settings.Init();

    settings.GetSizeTiers().then(() => {
        settings.Apply(userSettings);
    }).catch((userMessage) => {
        if (userMessage && userMessage.indexOf("Failed to fetch") == -1) {
            toast.ShowError(userMessage);
        }
        common.HideSpinner();
    }).then(() => {
        SetProductDataToScreen(asin, domain);
    })
}

function Crawl(asin, domain) {
    return new Promise((resolve, reject) => {
        crwcommon.GetCrawledBasicInfo(asin, domain).then((returnVal) => {
            try {
                let PRICE, BSR, BSR_CATEGORY, BRAND, MANUFACTURER, CURRENCY_SYMBOL, PARENT_ASIN,
                    DIMENSION_1, DIMENSION_2, DIMENSION_3, DIMENSION_TYPE, ITEM_WEIGHT, ITEM_WEIGHT_TYPE, MODEL,
                    MARKETPLACE = common.GetMarketplaceId(), CURRENCY = common.GetCurrencyCode();
                let prodDim, itemWeight;

                prodDim = returnVal.productionDimensions;
                if (prodDim != "N/A") {
                    DIMENSION_1 = common.ClearNonPrintableChars(prodDim.split("x")[0]?.trim());
                    DIMENSION_2 = common.ClearNonPrintableChars(prodDim.split("x")[1]?.trim());
                    DIMENSION_3 = common.ClearNonPrintableChars(prodDim.split("x")[2]?.trim().split(" ")[0]);
                    DIMENSION_TYPE = prodDim.split("x")[2]?.trim().split(" ")[1];
                }

                itemWeight = returnVal.itemWeight;
                if (itemWeight != "N/A") {
                    ITEM_WEIGHT = common.ClearNonPrintableChars(itemWeight.split(" ")[0]?.trim());
                    ITEM_WEIGHT_TYPE = itemWeight.split(" ")[1]?.trim();
                }

                PRICE = common.FormatCrawledPrice(returnVal.price);
                if (PRICE != "N/A") {
                    PRICE = common.ConvertToNumber(common.ClearNonPrintableChars(PRICE));
                } else {
                    PRICE = 0;
                }

                returnVal.bsr = common.ClearNonPrintableChars(returnVal.bsr);
                BSR = returnVal.bsr && !isNaN(common.ConvertToNumber(returnVal.bsr)) ? common.ConvertToNumber(returnVal.bsr) : "N/A";
                BSR_CATEGORY = returnVal.category;
                BRAND = returnVal.brand;
                MANUFACTURER = returnVal.manufacturer;
                CURRENCY_SYMBOL = common.GetCurrencySymbol();
                PARENT_ASIN = returnVal.parentASIN;
                MODEL = returnVal.model;

                resolve({
                    PRICE, BSR, BSR_CATEGORY, BRAND, MANUFACTURER, CURRENCY_SYMBOL, PARENT_ASIN,
                    DIMENSION_1, DIMENSION_2, DIMENSION_3, DIMENSION_TYPE, ITEM_WEIGHT, ITEM_WEIGHT_TYPE,
                    MODEL, MARKETPLACE, CURRENCY
                });
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
                reject(error);
            }
        }).catch((err) => {
            reject(err);
        })

    })
}

async function SellerCentralSearchProduct() {
    let counter = 0;
    let myInt = setInterval(() => {
        if ($(".search-input-group kat-input")[0]) {
            let asin = location.href.split("search?q=")[1];
            $($(".search-input-group kat-input")[0].shadowRoot).find("input#katal-id-0").val(asin)
            $(".search-input-group button").trigger("click")
            clearInterval(myInt);
        } else {
            counter++;
        }
        if (counter > 5) {
            clearInterval(myInt);
        }
    }, 500);
}
"use strict";
let domain;
var common = {
    // HOST: "https://localhost:44392",
    HOST: "https://ext.mysys.com/s2",
    RoundToTwo: function (num) {
        if (num < 0.01 && num > 0) {
            while (num < 0.00999) {
                num = num * 10;
            }
        }
        return +(Math.round(num + "e+2") + "e-2");
    },
    GetDiffDays: function (firstDate, secondDate) {
        return parseInt((firstDate - secondDate) / (1000 * 60 * 60 * 24));
    },
    IsLocationValid: function () {
        if (location.href.substring(location.href.length - 4) == ".xml" || location.href.substring(location.href.length - 4) == ".jpg" ||
            location.href.substring(location.href.length - 5) == ".jpeg" || location.href.substring(location.href.length - 4) == ".pdf") {
            return false;
        }

        if ($("head style#xml-viewer-style").length > 0) {
            return false;
        }

        return true;
    },
    ConvertToNumber: function (numStr, domain = this.GetDomainBySelectedLanguage()) {
        if (numStr) {
            if (domain == "com" || domain == "co.uk" || domain == "ca" || domain == "com.mx" ||
                domain == "ae" || domain == "sg" || domain == "com.au") {
                return Number(numStr.toString().replaceAll(",", ""));
            } else if (domain == "it" || domain == "es" || domain == "com.tr" ||
                domain == "nl" || domain == "de") {
                return Number(numStr.toString().replaceAll(".", "").replaceAll(",", "."));
            } else if (domain == "fr" || domain == "se" || domain == "pl") {
                return Number(numStr.toString().replaceAll(/\s/g, "").replaceAll(",", "."));
            }
            return Number(numStr);
        } else {
            return 0;
        }
    },
    FormatNumber: function (number, domain = this.GetDomainBySelectedLanguage()) {
        if (domain == "com" || domain == "co.uk" || domain == "ca" || domain == "com.mx" ||
            domain == "ae" || domain == "sg" || domain == "com.au") {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else if (domain == "it" || domain == "es" || domain == "com.tr" ||
            domain == "nl" || domain == "de") {
            return number.toString().replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        } else if (domain == "fr" || domain == "se" || domain == "pl") {
            return number.toString().replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        }
        return number;
    },
    ConvertPriceToNumber: function (price) {
        if (price) {
            price = price.replaceAll(/[^0-9]/g, '');
            price = parseFloat(price) / 100;
        }
        return price;
    },
    ExtractNumberFromString: function (numberStr) {
        if (numberStr) {
            numberStr = numberStr.replaceAll(/[^0-9]/g, '');
            if (!isNaN(numberStr)) {
                return Number(numberStr);
            }
        }
        return false;
    },
    CalculateUPCCheckDigit: function (upc) {
        let sum = 0;
        for (let i = 0; i < 12; i++) {
            if (upc.charAt(i)) {
                sum += parseInt(upc.charAt(i)) * (i % 2 === 0 ? 3 : 1);
            }
        }
        return (10 - sum % 10) % 10;
    },
    ShowSpinner: function () {
        $(".ms-spinner-border.ms-spinner-border-sm").removeClass("ms-invisible");
    },
    HideSpinner: function () {
        $(".ms-spinner-border.ms-spinner-border-sm").addClass("ms-invisible");
    },
    GetNumberCharsFromString: function (str) {
        return str.replace(/[^0-9,.-]/g, '').replace(/\--/g, '').trim();
    },
    GridNumberColumnComparer: function (valueA, valueB, numberFormatDomain) {
        valueA = common.ConvertToNumber(valueA, numberFormatDomain);
        valueA = !isNaN(valueA) ? valueA : 0;
        valueB = common.ConvertToNumber(valueB, numberFormatDomain);
        valueB = !isNaN(valueB) ? valueB : 0;
        return valueA - valueB;
    },
    GetDomain: function (site = "amazon") {
        if (!domain) {
            domain = window.location.host.replace(`www.${site}.`, "");
        }
        return domain;
    },
    CreateErrorMessageByjqXHR: function (jqXHR) {
        if (jqXHR.responseJSON) {
            let errorMessage = createErrorMessage(jqXHR);
            return errorMessage;
        }
        else if (jqXHR.status === 0) {
            return "The Server is disabled.";
        }
        else {
            return jqXHR.status + " " + jqXHR.statusText;
        }
    },
    GetASINFromURL: function (url = window.location.href) {
        try {
            let asin = url.split('dp/')[1]?.split('?')[0];

            if (asin && asin?.indexOf("/") > -1) {
                asin = asin.split("/")[0];
            } else if (url.indexOf("product") > -1) {
                asin = url.split("product")[1].replaceAll('/', '');
                if (asin.indexOf("?") > -1) {
                    asin = asin.split("?")[0];
                }
                if (asin.indexOf("ref") > -1) {
                    asin = asin.split("ref")[0];
                }
            } else if (url.indexOf("%2Fdp%2F") > -1) {
                asin = url.split('%2Fdp%2F')[1]?.split('%2F')[0];
            }

            return common.IsASINValid(asin) || common.IsISBNValid(asin) ? asin : false;
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    GetAmazonOffers: function (asin, domain, pageLimit) {
        return new Promise((resolve, reject) => {
            let offers;
            let url1 = "https://www.amazon." + domain + "/gp/aod/ajax/ref=dp_aod_NEW_mbc?asin=" + asin + "&m=&pinnedofferhash=&qid=&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=&pc=dp&filters={\"all\":true,\"new\":true}";

            chrome.runtime.sendMessage({ url: url1, type: "simple" }, (response) => {
                try {
                    if (response && response.response) {
                        let returnVal = crwcommon.ParseOfferText(response.response, asin, domain, 1);

                        if (returnVal) {
                            let OfferPageCount = returnVal.OfferPageCount;
                            let totalOfferCount = returnVal.TotalOfferCount;

                            if (!isNaN(pageLimit) && OfferPageCount > pageLimit) {
                                OfferPageCount = pageLimit;
                            }

                            offers = returnVal.Offers;

                            if (OfferPageCount == 1) {
                                resolve({ offers, totalOfferCount });
                            } else {
                                let counter = 2;
                                for (let j = 2; j <= OfferPageCount; j++) {
                                    let url2 = "https://www.amazon." + domain + "/gp/aod/ajax/ref=aod_f_new?asin=" + asin + "&pageno=" + j + "&filters={\"all\":true,\"new\":true}&isonlyrenderofferlist=true";
                                    chrome.runtime.sendMessage({ url: url2, type: "simple" }, (resp) => {
                                        try {
                                            if (resp) {
                                                let returnVal1 = crwcommon.ParseOfferText(resp.response, asin, domain, j);

                                                if (returnVal1) {
                                                    offers.push(...returnVal1.Offers);
                                                }
                                            }

                                            if (counter == OfferPageCount) {
                                                resolve({ offers, totalOfferCount });
                                            }

                                            counter++;
                                        } catch (error) {
                                            errorHandler.SendErrorToAdmin(error);
                                        }
                                    });
                                }
                            }
                        }
                    } else {
                        reject("No response");
                    }
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                    reject("");
                }
            });
        })
    },
    GetCurrencySymbol: function (domain = this.GetDomain()) {
        switch (domain) {
            case "nl":
            case "de":
            case "it":
            case "fr":
            case "es":
                return "€";
            case "co.uk":
                return "£";
            case "ae":
                return "AED";
            case "ca":
                return "C$";
            case "com":
            case "com.mx":
                return "$";
            case "com.tr":
                return "₺";
            case "sg":
                return "S$";
            case "se":
                return "kr";
            case "pl":
                return "zł";
            case "eg":
                return "EGP";
            case "sa":
                return "SAR";
            default:
                return "$";
        }
    },
    GetCurrencySymbolByCode: function (currencyCode) {
        switch (currencyCode) {
            case "EUR":
                return "€";
            case "GBP":
                return "£";
            case "AED":
                return "AED";
            case "CAD":
                return "C$";
            case "USD":
                return "$";
            case "TRY":
                return "₺";
            case "SGD":
                return "S$";
            case "SEK":
                return "kr";
            case "PLN":
                return "zł";
            case "MXN":
                return "$";
            default:
                return "";
        }
    },
    SetAmazonAddress: async function (domain = common.GetDomain()) {
        let csrfGlow = JSON.parse(document.getElementById("nav-global-location-data-modal-action").dataset.aModal).ajaxHeaders["anti-csrftoken-a2z"];
        $.ajax({
            url: `https://www.amazon.${domain}/portal-migration/hz/glow/get-rendered-address-selections?deviceType=desktop&pageType=Gateway&storeContext=NoStoreName&actionSource=desktop-modal`,
            type: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("anti-csrftoken-a2z", csrfGlow);
            },
            success: function (html) {
                try {

                    let csrfToken = html.split('CSRF_TOKEN : "')[1]?.split('", ')[0];

                    let zipcode = common.GetZipcodeByDomain(domain);

                    let data;
                    data = { "locationType": "LOCATION_INPUT", "zipCode": zipcode, "storeContext": "generic", "deviceType": "web", "pageType": "Gateway", "actionSource": "glow" };
                    if (domain == "com.au") {
                        data = { "locationType": "POSTAL_CODE_WITH_CITY", "zipCode": zipcode, "city": "CANBERRA", "storeContext": "generic", "deviceType": "web", "pageType": "Landing", "actionSource": "glow", "almBrandId": "" }
                    }

                    $.ajax({
                        async: false,
                        dataType: "json",
                        url: 'https://www.amazon.' + domain + '/portal-migration/hz/glow/address-change?actionSource=glow',
                        type: 'POST',
                        data: JSON.stringify(data),
                        mode: 'no-cors',
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("anti-csrftoken-a2z", csrfToken);
                            xhr.setRequestHeader("content-type", "application/json");
                        },
                        success: function (result) {
                            if (common.GetZipcodeByDomain(domain) == result?.address?.zipCode) {
                                // window.location.reload();
                                //kontrollu bir yenileme islemi olmalı
                            } else {
                                console.log("Error! Adres paneli açmada hata! " + result);
                            }
                        },
                        error: function (error) {
                            errorHandler.SendErrorToAdmin(error);
                        }
                    });
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                }
            },
            error: function (result) {
                console.log("Error! Adres paneli açmada hata! " + result);
            }
        });
    },
    IsAddressSet: function (domain) {
        return document.querySelector("#glow-ingress-line2").innerText.indexOf(common.GetZipcodeByDomain(domain)) > -1;
    },
    DotsAnimation: "<span class='ms-loading'><span>.</span><span>.</span><span>.</span></span>",
    SuccessIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ms-text-success" viewBox="0 0 16 16">' +
        '<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>' +
        '</svg>',
    WarningIcon: function (cssClass = "ms-text-warning") {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="' + cssClass + '" viewBox="0 0 16 16">' +
            '<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>' +
            '</svg>';
    },
    DangerIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ms-text-danger" viewBox="0 0 16 16">' +
        '<path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/>' +
        '</svg>',
    Sleep: function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    GetZipcodeByDomain: function (domain) {
        switch (domain) {
            case "com":
                return "07504";
            case "de":
                return "10115";
            case "co.uk":
                return "SE1 7XG";
            case "ca":
                return "K1K 2X5";
            case "fr":
                return "75000";
            case "it":
                return "00184";
            case "es":
                return "08001";
            case "com.mx":
                return "06000";
            case "sg":
                return "058840";
            case "com.au":
                return "2601";
            default:
                return "07504";
        }
    },
    GetMySysAmazonMarketplaceId(domain = this.GetDomain()) {
        switch (domain) {
            case "ca":
                return 6;
            case "com.mx":
                return 11;
            case "com":
                return 1;
            case "de":
                return 3;
            case "es":
                return 9;
            case "fr":
                return 4;
            case "it":
                return 8;
            case "co.uk":
                return 2;
            default:
                return null;
        }
    },
    FormatCrawledPrice: function (price) {
        try {
            price = price.trim();
            let currency = this.GetCurrencySymbol();
            currency = currency == "C$" ? "CDN$" : currency;
            if (price.indexOf(currency) == 0) {
                price = price ? price.split(currency)[1]?.trim() : "N/A";
            } else if (price.indexOf(currency) >= price.length - 3) {
                price = price ? price.split(currency)[0]?.trim() : "N/A";
            }

            return price;
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    GetFeesFromAmazon: function (data) {
        return new Promise((resolve, reject) => {
            //abd-> com,com.mx,ca  -> com
            //avrupa-> co.uk,de,fr,es,it -> co.uk

            common.Sleep(200).then(() => {

                switch (data.Domain) {
                    case "com":
                        data.Locale = "en-US";
                        break;
                    case "com.mx":
                        data.Locale = "es-MX";
                        break;
                    case "ca":
                        data.Locale = "en-CA";
                        break;
                    case "co.uk":
                        data.Locale = "en-GB";
                        break;
                    case "de":
                        data.Locale = "de-DE";
                        break;
                    case "fr":
                        data.Locale = "fr-FR";
                        break;
                    case "it":
                        data.Locale = "it-IT";
                        break;
                    case "es":
                        data.Locale = "es-ES";
                        break;
                    case "se":
                        data.Locale = "sv-SE";
                        break;
                    case "pl":
                        data.Locale = "pl-PL";
                        break;
                    case "nl":
                        data.Locale = "nl-NL";
                        break;
                }

                if (data.Domain == "com" || data.Domain == "com.mx" || data.Domain == "ca") {
                    data.Domain = "com";
                } else if (data.Domain == "co.uk" || data.Domain == "de" ||
                    data.Domain == "fr" || data.Domain == "es" || data.Domain == "it") {
                    data.Domain = "co.uk";
                }

                chrome.runtime.sendMessage({ content: data, type: "m1" }, (response) => {
                    if (response?.response && response.response.isSuccess == undefined) {
                        resolve(response.response);
                    }
                    else {
                        reject("Could not get fees");
                    }
                });
            })
        })
    },
    GetMarketplaceId: function (domain = common.GetDomain()) {
        switch (domain) {
            case "ca":
                return "A2EUQ1WTGCTBG2";
            case "com.mx":
                return "A1AM78C64UM0Y8";
            case "com":
                return "ATVPDKIKX0DER";
            case "com.br":
                return "A2Q3Y263D00KWC";
            case "de":
                return "A1PA6795UKMFR9";
            case "es":
                return "A1RKKUPIHCS9HS";
            case "fr":
                return "A13V1IB3VIYZZH";
            case "it":
                return "APJ6JRA9NG5V4";
            case "co.uk":
                return "A1F83G8C2ARO7P";
            case "in":
                return "A21TJRUUN4KGV";
            case "jp":
                return "A1VC38T7YXB528";
            case "cn":
                return "AAHKV2X7AFYLW";
            case "ae":
                return "A2VIGQ35RCS4UG";
            case "sg":
                return "A19VAU5U5O7RUS";
            case "com.tr":
                return "A33AVAJ2PDY3EV";
            case "com.au":
                return "A39IBJ37TRP1C6";
            case "nl":
                return "A1805IZSGTT6HS";
            case "se":
                return "A2NODRKZP88ZB9";
            case "pl":
                return "A1C3SOZRARQ6R3";
            default:
                break;
        }
    },
    GetMarketplaceCountryCode: function (domain = common.GetDomain()) {
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
                return "GB";
            case "in":
                return "IN";
            case "jp":
                return "JP";
            case "ae":
                return "AE";
            case "sg":
                return "SG";
            case "com.tr":
                return "TR";
            case "com.au":
                return "AU";
            case "nl":
                return "NL";
            case "se":
                return "SE";
            case "pl":
                return "PL";
            default:
                break;
        }
    },
    GetCurrencyCode: function (domain = common.GetDomain()) {
        switch (domain) {
            case "ca":
                return "CAD";
            case "com.mx":
                return "MXN";
            case "com":
                return "USD";
            case "com.br":
                return "BRL";
            case "de":
                return "EUR";
            case "es":
                return "EUR";
            case "fr":
                return "EUR";
            case "it":
                return "EUR";
            case "co.uk":
                return "GBP";
            case "in":
                return "INR";
            case "jp":
                return "JPY";
            case "cn":
                return "CNY";
            case "ae":
                return "AED";
            case "sg":
                return "SGD";
            case "com.tr":
                return "TRY";
            case "com.au":
                return "AUD";
            case "nl":
                return "EUR";
            case "se":
                return "SEK";
            case "pl":
                return "PLN";
            default:
                break;
        }
    },
    GetUserInfo: function () {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['mysysToken'], function (result) {
                if (result?.mysysToken) {
                    chrome.runtime.sendMessage(
                        {
                            type: "m0",
                            url: `${common.HOST}/api/auth/userinfo/${result.mysysToken}`,
                            method: 'GET'
                        }, (response) => {
                            if (response?.response?.isSuccess) {
                                resolve(JSON.parse(response?.response?.paramStr));
                            } else {
                                reject(response?.response?.userMessage);
                            }
                        });
                } else {
                    reject("Session is timed-out or invalid. Please sign in.");
                }
            });
        })
    },
    GetPremiumLink: function (token) {
        return new Promise((resolve, reject) => {
            resolve("https://app.mysys.com/Profile/ServicePlan/60");
        });
    },
    SetUserInfoToSessionStorage: function (userInfo) {
        try {
            if (userInfo) {
                sessionStorage.setItem("mysys-userinfo", JSON.stringify(userInfo));
            } else {
                sessionStorage.removeItem("mysys-userinfo");
            }
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    GetUserInfoFromSessionStorage: function () {
        if (typeof sessionStorage !== 'undefined') {
            let userInfo = sessionStorage.getItem("mysys-userinfo");
            if (userInfo) {
                return JSON.parse(userInfo);
            } else {
                return null;
            }
        } else {
            return null;
        }
    },
    InitMinMaxButton: function (initParams) {

        chrome.storage.local.get([initParams.Key], function (result) {
            try {
                initParams.MaximizeBtn = !initParams.MaximizeBtn ? "<img src='" + chrome.runtime.getURL("images/icons/icon48.png") + "' style='width:24px' />" : initParams.MaximizeBtn;
                initParams.MinimizeBtn = !initParams.MinimizeBtn ? icons.MinimizeIcon("ms-mb-2") : initParams.MinimizeBtn;
                let mysysWidth;
                $(".mysys").on("click", ".minmaxBtn", function (e) {
                    e.stopPropagation();
                    try {
                        if ($(this).hasClass("maximize")) {
                            chrome.storage.local.set({ [initParams.Key]: "maximized" }, function () { });

                            $(this).html(initParams.MinimizeBtn)
                            $(this).parents(".mysys").eq(0).css("height", "");
                            $(this).parents(".mysys").eq(0).css("width", mysysWidth);
                            $(this).parents(".mysys").find("#main-content").css("height", "");

                            $("*:not(.mys-tooltiptext)", $(this).parents(".mysys").eq(0)).css("visibility", "visible");
                            $("#panelContent").removeClass("ms-d-none");
                            $(this).parents(".mysys").eq(0).removeClass("translucent");
                        } else {
                            chrome.storage.local.set({ [initParams.Key]: "minimized" }, function () { });
                            $(this).html(initParams.MaximizeBtn)

                            mysysWidth = $(this).parents(".mysys").eq(0).css("width");

                            $(this).parents(".mysys").eq(0).css("height", initParams.MinHeight);
                            $(this).parents(".mysys").eq(0).css("width", initParams.MinWidth);

                            let mainContentHeight = common.ExtractNumberFromString(initParams.MinHeight);

                            $(this).parents(".mysys").find("#main-content").css("height", (mainContentHeight - 10) + "px");

                            $("*:not(.mys-tooltiptext)", $(this).parents(".mysys").eq(0)).not("#main-warning").css("visibility", "hidden");
                            $(".minmaxBtn, .minmaxBtn *").css("visibility", "");
                            $(".minmaxBtn").parents("div").css("visibility", "");
                            $(this).parents(".mysys").eq(0).addClass("translucent");
                            $("#panelContent").addClass("ms-d-none");
                            if (initParams.VisibleElemsOnMinimize?.length > 0) {
                                for (let index = 0; index < initParams.VisibleElemsOnMinimize.length; index++) {
                                    $(initParams.VisibleElemsOnMinimize[index], $(this).parents(".mysys").eq(0)).css("visibility", "visible");
                                    $(initParams.VisibleElemsOnMinimize[index], $(this).parents(".mysys").eq(0)).find("*").css("visibility", "visible");
                                }
                            }
                        }

                        $(this).toggleClass("maximize");
                    } catch (error) {
                        errorHandler.SendErrorToAdmin(error);
                    }
                });

                if (result?.[initParams.Key] == "minimized") {
                    $(".mysys .minmaxBtn").trigger("click");
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });
    },
    GetDomainBySelectedLanguage: function (pageContent = document?.documentElement?.outerHTML) {
        if (pageContent && typeof pageContent.split === 'function') {
            switch (pageContent.split('html lang="')[1]?.split('"')[0]) {
                case "en-gb":
                    return "com";
                case "de-de":
                    return "de";
                case "nl-nl":
                    return "nl";
                case "pl-pl":
                    return "pl";
                case "tr-tr":
                    return "com.tr";
                case "es-us":
                    return "es";
                case "it-it":
                    return "it";
                case "fr-fr":
                    return "fr";
                default:
                    return this.GetDomain();
            }
        } else {
            return this.GetDomain();
        }
    },
    GetBuyboxOuterHTML: function (parent = document) {
        let buybox = $("#sellerProfileTriggerId", parent)[0];
        if (!buybox) {
            buybox = $("#tabular-buybox-container > tbody td.tabular-buybox-column span.a-truncate-full > span.tabular-buybox-text", parent)[0];
            if (!buybox) {
                buybox = $("#merchant-info", parent)[0];
                if (buybox) {
                    if ($(buybox).find("a")[0]) {
                        buybox = $(buybox).find("a")[0];
                    }
                } else if (!buybox) {
                    buybox = $("#tabular-buybox .tabular-buybox-text[tabular-attribute-name='Sold by'] span", parent)[0];
                }
            }
        }

        return buybox?.outerHTML ?? "";
    },
    ClearNonPrintableChars: function (param) {
        let nonPrintableChars = /[\0-\x1F\x7F-\x9F\xAD\u0378\u0379\u037F-\u0383\u038B\u038D\u03A2\u0528-\u0530\u0557\u0558\u0560\u0588\u058B-\u058E\u0590\u05C8-\u05CF\u05EB-\u05EF\u05F5-\u0605\u061C\u061D\u06DD\u070E\u070F\u074B\u074C\u07B2-\u07BF\u07FB-\u07FF\u082E\u082F\u083F\u085C\u085D\u085F-\u089F\u08A1\u08AD-\u08E3\u08FF\u0978\u0980\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FC-\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0C00\u0C04\u0C0D\u0C11\u0C29\u0C34\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5A-\u0C5F\u0C64\u0C65\u0C70-\u0C77\u0C80\u0C81\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0D01\u0D04\u0D0D\u0D11\u0D3B\u0D3C\u0D45\u0D49\u0D4F-\u0D56\u0D58-\u0D5F\u0D64\u0D65\u0D76-\u0D78\u0D80\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EBA\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F5-\u13FF\u169D-\u169F\u16F1-\u16FF\u170D\u1715-\u171F\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191D-\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE-\u1AFF\u1B4C-\u1B4F\u1B7D-\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C80-\u1CBF\u1CC8-\u1CCF\u1CF7-\u1CFF\u1DE7-\u1DFB\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u200B-\u200F\u202A-\u202E\u2060-\u206F\u2072\u2073\u208F\u209D-\u209F\u20BB-\u20CF\u20F1-\u20FF\u218A-\u218F\u23F4-\u23FF\u2427-\u243F\u244B-\u245F\u2700\u2B4D-\u2B4F\u2B5A-\u2BFF\u2C2F\u2C5F\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E3C-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u312E-\u3130\u318F\u31BB-\u31BF\u31E4-\u31EF\u321F\u32FF\u4DB6-\u4DBF\u9FCD-\u9FFF\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA698-\uA69E\uA6F8-\uA6FF\uA78F\uA794-\uA79F\uA7AB-\uA7F7\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C5-\uA8CD\uA8DA-\uA8DF\uA8FC-\uA8FF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9E0-\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAA7C-\uAA7F\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F-\uABBF\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFE\uFDFF\uFE1A-\uFE1F\uFE27-\uFE2F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF]/g;
        return param?.replaceAll(nonPrintableChars, "");
    },
    SummarizeSellerInfo: function (sellerObj) {
        let currencySymbol = this.GetCurrencySymbol(sellerObj.Domain);
        let sellersInfo = sellerObj.SellerName +
            (sellerObj.Price && !isNaN(sellerObj.Price) ? " | " + currencySymbol + " " + sellerObj.Price : "") +
            (sellerObj.SellerType ? " | " + sellerObj.SellerType : "") +
            (sellerObj.StarCount ? (" | s: " + sellerObj.StarCount) : "") +
            (sellerObj.Feedback && sellerObj.Feedback != 0 ? " | f: " + sellerObj.Feedback + "%" : "") +
            (sellerObj.Rating && sellerObj.Rating != 0 ? " | r: " + sellerObj.Rating : "");

        return sellersInfo.trim();
    },
    HandleError: function (response) {
        if (!response.ok) {
            throw new Error(response.status + ": " + response.statusText);
        }
        return response;
    },
    ConvertToJSON: function (item) {
        item = typeof item !== "string"
            ? JSON.stringify(item)
            : item;

        try {
            item = JSON.parse(item);
        } catch (e) {
            return false;
        }

        if (typeof item === "object" && item !== null) {
            return item;
        }

        return false;
    },
    ValidateBarcode: function (barcodeStr) {
        return barcodeStr && /^\d+$/.test(barcodeStr) && barcodeStr.length >= 10 && barcodeStr.length <= 13;
    },
    GetProductInfoFromAmazonByBarcode: function (barcode, continent = "na", marketplace = "US") {
        return new Promise(async (resolve, reject) => {
            try {
                let url = "https://ws-na.amazon-adsystem.com/widgets/q?";

                if (!barcodeQ) {
                    barcodeQ = await this.GetBarcodeQ();
                }

                url += barcodeQ;

                if (continent == "eu") {
                    url = url.replace("ws-na", "ws-eu");
                }

                url = url.replace("${message.barcode}", barcode).replace("${message.marketplace}", marketplace);

                chrome.runtime.sendMessage({ url: url, type: "simple" }, (response) => {
                    try {
                        if (response?.response?.isSuccess != undefined && !response.response.isSuccess) {
                            reject(response?.response?.userMessage);
                        } else if (response?.response) {
                            var info = response.response.trim().split('search_callback(')[1]

                            if (info) {
                                info = info.substring(0, info.length - 1)

                                info = common.ConvertToJSON(info.replaceAll('results', '"results"').replaceAll(' ASIN', '"ASIN"').replaceAll(' Title', '"Title"').replaceAll(' Price', '"Price"').replaceAll(' ListPrice', '"ListPrice"').replaceAll(' ImageUrl', '"ImageUrl"').replaceAll(' DetailPageURL', '"DetailPageURL"').replaceAll(' Rating', '"Rating"').replaceAll(' TotalReviews', '"TotalReviews"').replaceAll(' Subtitle', '"Subtitle"').replaceAll(' IsPrimeEligible', '"IsPrimeEligible"').replaceAll(' MarketPlace', '"MarketPlace"').replaceAll(' InstanceId', '"InstanceId"'));

                                resolve(info);
                            } else {
                                resolve(false);
                            }

                        } else {
                            resolve(false);
                        }
                    } catch (error) {
                        reject(error);
                    }
                });
            } catch (error) {
                reject(error);
            }
        })
    },
    GetCurrencyRate: function (from, to) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                url: `${common.HOST}/api/common/currencyrate?from=${from}&to=${to}`,
                method: 'GET',
                type: 'm0'
            }, response => {
                if (response?.response?.isSuccess) {
                    resolve(response.response.paramStr);
                } else {
                    reject(response?.response?.userMessage);
                }
            });
        })
    },
    GetCurrencyRates: function (fromArr, to) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                url: `${common.HOST}/api/common/currencyratelist?fromList=${fromArr.join(',')}&to=${to}`,
                method: 'GET',
                type: 'm0'
            }, response => {
                if (response?.response?.isSuccess) {
                    resolve(response.response.paramStr);
                } else {
                    reject(response?.response?.userMessage);
                }
            });
        })
    },
    GetQuickViewData: function (bsr, category, domain) {
        return new Promise((resolve, reject) => {
            if (!bsr || isNaN(bsr)) {
                bsr = 0;
            }

            let messageData = {
                "BSR": bsr,
                "Category": category,
                "Domain": domain
            };

            chrome.runtime.sendMessage(
                {
                    type: "m0",
                    data: messageData,
                    url: `${common.HOST}/api/amazon/quickview`,
                    method: 'POST'
                }, (response) => {
                    try {
                        if (response?.response?.isSuccess) {
                            let jsonResult = common.ConvertToJSON(response.response.paramStr);
                            resolve(jsonResult);
                        } else {
                            if (response?.response?.userMessage?.indexOf("exceeded") == -1 && //User exceeded quick view search limit
                                response?.response?.userMessage?.indexOf("timed-out") == -1) { //Session is timed-out or invalid. Please sign in.
                                errorHandler.SendErrorToAdmin("GetQuickViewData: " + response?.response?.userMessage);
                            }
                            resolve();
                        }
                    } catch (error) {
                        reject(error);
                    }
                });
        });
    },
    GetBarcodeQ: function () {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                url: `${common.HOST}/api/common/barcodeq?v=` + arbcommon.GenerateGUID().split("-")[0],
                method: 'GET',
                type: 'm0'
            }, response => {
                if (response?.response?.isSuccess) {
                    resolve(response.response.paramStr);
                } else {
                    if (response?.response?.statusCode == 429) {
                        toast.ShowWarning("Çok fazla istek yapıldı, lütfen bir süre bekleyin", "Uyarı")
                        resolve("");
                    }
                    reject(response?.response?.userMessage);
                }
            });
        })
    },
    ConsoleLog: function (log) {
        console.log(log + " " + new Date().toISOString());
    },
    SliceArray: function (arr, chunkSize) {
        if (chunkSize <= 0)
            throw new Error("Invalid chunk size");
        var R = [];
        for (var i = 0, len = arr.length; i < len; i += chunkSize)
            R.push(arr.slice(i, i + chunkSize));
        return R;
    },
    GetHazmatIconByContent: function (content) {
        if (content?.indexOf("is a dangerous good") > -1) {
            return icons.HazmatIcon("ms-text-danger");
        } else if (content?.indexOf("unable to classify") > -1) {
            return icons.QuestionFillIcon("ms-text-warning");
        } else if (content?.indexOf("is not dangerous good") > -1) {
            return icons.HazmatIcon("ms-text-success");
        }
        return "";
    },
    CalculateVATPrice: function (price, VAT) {
        let netPrice = (price * 100) / (100 + VAT);
        return (price - netPrice);
    },
    GetFlagByCountryName: function (countryName) {
        switch (countryName) {
            case "USA":
                return chrome.runtime.getURL("images/flags/usa.svg");
            case "Canada":
                return chrome.runtime.getURL("images/flags/can.svg");
            case "Mexico":
                return chrome.runtime.getURL("images/flags/mex.svg");
            case "Germany":
                return chrome.runtime.getURL("images/flags/deu.svg");
            case "Spain":
                return chrome.runtime.getURL("images/flags/esp.svg");
            case "France":
                return chrome.runtime.getURL("images/flags/fra.svg");
            case "Italy":
                return chrome.runtime.getURL("images/flags/ita.svg");
            case "UK":
                return chrome.runtime.getURL("images/flags/gbr.svg");
            case "United-Arab-Emirates":
                return chrome.runtime.getURL("images/flags/uae.svg");
            case "Turkey":
                return chrome.runtime.getURL("images/flags/tur.svg");
            case "Netherlands":
                return chrome.runtime.getURL("images/flags/nl.svg");
            case "Sweden":
                return chrome.runtime.getURL("images/flags/swe.svg");
            case "Poland":
                return chrome.runtime.getURL("images/flags/pln.svg");
            case "Japan":
                return chrome.runtime.getURL("images/flags/jpn.svg");
            case "Singapore":
                return chrome.runtime.getURL("images/flags/sg.svg");
            case "Australia":
                return chrome.runtime.getURL("images/flags/aus.svg");
            case "Belgium":
                return chrome.runtime.getURL("images/flags/be.svg");
            case "Egypt":
                return chrome.runtime.getURL("images/flags/eg.svg");
            case "Saudi Arabia":
                return chrome.runtime.getURL("images/flags/sa.svg");
        }
    },
    GetDomainByCountryName: function (countryName) {
        switch (countryName) {
            case "USA":
                return "com";
            case "Canada":
                return "ca";
            case "Mexico":
                return "com.mx";
            case "Germany":
                return "de";
            case "Spain":
                return "es";
            case "France":
                return "fr";
            case "Italy":
                return "it";
            case "UK":
                return "co.uk";
            case "United-Arab-Emirates":
                return "ae";
            case "Turkey":
                return "com.tr";
            case "Netherlands":
                return "nl";
            case "Sweden":
                return "se";
            case "Poland":
                return "pl";
            case "Japan":
                return "co.jp";
            case "Singapore":
                return "sg";
            case "Australia":
                return "com.au";
            case "Belgium":
                return "com.be";
            case "Egypt":
                return "eg";
            case "Saudi Arabia":
                return "sa";
        }
    },
    IsURLChanged: async function (url, interval = 100, counterLimit = 20) {
        return new Promise((resolve, reject) => {
            if (url != window.location.href) {
                resolve(true);
            }
            let counter = 0;
            let urlInterval = setInterval(() => {
                counter++;
                if (url != window.location.href) {
                    clearInterval(urlInterval);
                    resolve(true);
                } else if (counter >= counterLimit) {
                    clearInterval(urlInterval);
                    resolve(false);
                }
            }, interval);

        });
    },
    IsASINValid: function (asin) {
        const asinRegex = /^B[0-9A-Z]{9}$/;
        return asinRegex.test(asin);
    },
    IsISBNValid: function (isbn) {
        const isbnRegex = /^\d{10}$/;
        return isbnRegex.test(isbn);
    },
    GetChromeVersion: function () {
        try {
            var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);

            return raw ? parseFloat(raw[2], 10) : false;
        } catch (error) {
            return 0;
        }
    }
}

function createErrorMessage(jqXHR) {
    let errorMessage = "<ul class='ms-m-0'>";

    if (jqXHR.responseJSON.errors) {
        for (const [key, value] of Object.entries(jqXHR.responseJSON.errors)) {
            errorMessage += `<li>${value}</li>`;
        }
    }
    else if (jqXHR.responseJSON.userMessage) {
        errorMessage += `<li>${jqXHR.responseJSON.userMessage}</li>`;
    } else {
        errorMessage += `<li>${jqXHR.responseJSON.status} ${jqXHR.responseJSON.title}</li>`;
    }

    return errorMessage += "</ul>";
}

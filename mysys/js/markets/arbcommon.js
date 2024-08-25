"use strict";

let arbcommon = {
    MaxTotalPage: 9999,
    GenerateGUID: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    GetUsersCompetitorAnalysisInfos: function (sellers, Domain, ApiSource) {
        try {
            // merchantId yerine arama adı, merchantName yerine aranacak url konuluyor
            var content = { "Domain": Domain, "Sellers": sellers, "ApiSource": ApiSource }
            var url = common.HOST + '/api/arbitrage/GetUsersCompetitorAnalysisInfos';

            chrome.runtime.sendMessage({ data: content, url: url, type: "m0" }, (response) => {
                try {
                    if (response.response?.isSuccess) {
                        var AnalyzedSellerList = JSON.parse(response.response.paramStr);
                        for (var t = 0; t < AnalyzedSellerList.length; t++) {
                            if (AnalyzedSellerList[t].IsAnalyzed == true) {
                                let date = new Date(Date.parse(AnalyzedSellerList[t].AnalysisDateTime));
                                let merchantId = AnalyzedSellerList[t].MerchantId.replaceAll("&isAmazonFulfilled=1", "");
                                if (ApiSource == 1) {
                                    $('#mysysCompetitorAnalysis-' + merchantId).after('<div class="ms-float-end ms-my-3 ms-alert ms-alert-info ms-my-2" style="width:250px;" > Analyzed at ' + date.toLocaleDateString() + " " + date.toLocaleTimeString() + '</div>');
                                } else {
                                    $('#mysysCompetitorAnalysis-' + merchantId).after('<div class="ms-alert ms-alert-info ms-my-2" style="width:250px;" > Analyzed at ' + date.toLocaleDateString() + " " + date.toLocaleTimeString() + '</div>');
                                }
                                $('#mysysCompetitorAnalysis-' + merchantId).remove();
                            }
                        }
                    } else {
                        toast.ShowError(response.response.userMessage);
                    }
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                }
            })
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    InitCompAnalysisEvent: function () {
        $(".mysys").on("click", ".mysys-extension-start-competitor-analysis", function () {
            try {
                var apiSource = $(this).attr("data-api-source");
                var merchantId = $(this).attr("data-merchant-id");
                var sellername = $(this).attr("data-sellername");
                var domain = $(this).attr("data-domain");

                // merchantId yerine arama adı, merchantName yerine aranacak url konuluyor
                var content = { "ApiSource": Number(apiSource), "MerchantId": merchantId, "Domain": domain, "MerchantName": sellername }
                var url = common.HOST + '/api/arbitrage/ArbitrageSaveCompetitorProductJob';

                // listeyi sunucuya gönder
                chrome.runtime.sendMessage({ data: content, url: url, type: "m0" }, (response) => {
                    try {
                        // Job Başarılı bir şekilde kaydedildi ise
                        if (response.response?.isSuccess) {
                            if ($('#mysysModal').length == 0) { $('body').after(arbmodal.GetStructure()); }

                            arbmodal.SetComment("<p>The process has been started.</p><p class='ms-text-warning ms-d-flex'>" + common.WarningIcon() + "&nbsp;Please DO NOT close the page or browser until the process is completed.</p>");
                            arbmodal.SetComment2('<p>Currently processing seller : <b>' + sellername + ' (' + merchantId + ')</b><p/>');
                            arbmodal.SetHeader("Processing&nbsp;" + common.DotsAnimation);

                            if (apiSource == 2) {				// Amazon sayfası ise
                                arbmodal.Show();

                                amazon.GetSellersProductsAmazonPageBrands(response.response.paramInt, merchantId, domain);

                            } else if (apiSource == 1) {			// Ebay sayfası ise                        
                                arbmodal.Show();

                                ebay.GetSellersProductsEbay(response.response.paramInt, merchantId, domain, 1);
                            }

                        } else {
                            toast.ShowError(response.response.userMessage);
                        }
                    } catch (error) {
                        errorHandler.SendErrorToAdmin(error);
                    }
                })
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });
    },
    GetPanelTemplate: function (params) {
        let innerParams = {
            lang: "tr",
            showExtraFields: true,
            showEU: true,
            showNA: true,
            showSourceEU: false,
            showSourceNA: false,
            selectedSourceCountry: "",
            ...params
        };

        $(document).on("change", ".mysys #mysysAnalysisTargetCountry", function () {
            $("#spCurrency").text(common.GetCurrencyCode($(this).val()));
        });

        $(document).on("change", ".mysys #mysysAnalysisSourceCountry", function () {
            let sourceDomain = $(this).val();

            $(`.mysys #mysysAnalysisTargetCountry option`).prop("disabled", false);
            $(`.mysys #mysysAnalysisTargetCountry option[value=${sourceDomain}]`).prop("disabled", true);
            let domain = common.GetDomain();

            if (sourceDomain != domain) {
                $(`.mysys #mysysAnalysisTargetCountry option[value="${domain}"]`).prop("selected", true);
                $(`.mysys #mysysAnalysisTargetCountry`).prop("disabled", true);
            } else {
                $(`.mysys #mysysAnalysisTargetCountry`).prop("disabled", false);
                $(`.mysys #mysysAnalysisTargetCountry option`).eq(0).prop("selected", true);
            }
            $(".mysys #mysysAnalysisTargetCountry").trigger('change');

        });

        let userInfo = common.GetUserInfoFromSessionStorage();
        let importButtonTooltip = "";

        if (!userInfo?.IsMysysUser) {
            if (innerParams.lang == "tr") {
                importButtonTooltip = "Daha kapsamlı arbitraj analizleri ve kolay listeleme yetenekleri ile MySYS Toptancı Analizi'ni ücretsiz deneyebilirsiniz.";
            } else {
                importButtonTooltip = "You can try MySYS Arbitrage Analysis <b>for free</b> with more comprehensive analysis and easy listing capabilities.";
            }
        } else {
            if (innerParams.lang == "tr") {
                importButtonTooltip = "Kapsamlı bir analiz için verileri MySYS'e aktar";
            } else {
                importButtonTooltip = "Import data to MySYS for a comprehensive analysis";
            }
        }

        innerParams.showExtraFields = !innerParams.showExtraFields ? "display:none!important" : "";

        let sourceCountryList = arbcommon.GetCountryListSelectElem({
            SelectedCountry: innerParams.selectedSourceCountry,
            Lang: innerParams.lang,
            ShowExtraFields: innerParams.showExtraFields,
            SelectElemId: "mysysAnalysisSourceCountry",
            ShowNA: innerParams.showSourceNA,
            ShowEU: innerParams.showSourceEU,
            Type: "Source"
        });

        let targetCountryList = arbcommon.GetCountryListSelectElem({
            Lang: innerParams.lang,
            ShowExtraFields: innerParams.showExtraFields,
            SelectElemId: "mysysAnalysisTargetCountry",
            ShowNA: innerParams.showNA,
            ShowEU: innerParams.showEU,
            Type: "Target"
        });

        return "<div id='arbPanel' class='mysys ms-border ms-rounded ms-border-success ms-bg-light ms-p-3 ms-pt-2 ms-float-end ms-position-absolute ms-shadow'>" +
            '<div class="ms-text-end">' +
            '<div class="minmaxBtn ms-w-100 ms-text-end ms-d-inline">' +
            icons.MinimizeIcon("ms-mb-2") +
            '</div>' +
            '</div>' +
            '<div id="panelContent">' +
            "<label class='ms-fw-bold ms-w-100'>" + (innerParams.lang == "tr" ? "Analiz Adı" : "Analysis Header") + "</label>" +
            "<input type='text' id='mysysAnalysisNameInput' placeholder='" + (innerParams.lang == "tr" ? "Maks. 90 karakter" : "Max 90 char.") + "' class='ms-form-control ms-fs-5 ms-p-1 ms-mb-2' />" +

            sourceCountryList +
            targetCountryList +

            "<label class='ms-fw-bold  ms-w-100' style='" + innerParams.showExtraFields + "'>" + (innerParams.lang == "tr" ? "Satış Vergisi" : "Sales Tax") + " %</label>" +
            "<input id='mysysAnalysisSalexTax' type='number' class='ms-form-control ms-fs-5 ms-p-1 ms-mb-2' style='" + innerParams.showExtraFields + "' />" +
            "<label class='ms-fw-bold  ms-w-100' style='" + innerParams.showExtraFields + "'>FBA " + (innerParams.lang == "tr" ? "Kargo" : "Cargo") + " (<span id='spCurrency'></span>/KG)</label>" +
            "<input id='mysysAnalysisFBACargo' type='number' class='ms-form-control ms-fs-5 ms-p-1 ms-mb-2' style='" + innerParams.showExtraFields + "'/>" +


            "<label class='ms-fw-bold  ms-w-100' style='" + innerParams.showExtraFields + "'> " + (innerParams.lang == "tr" ? "Analiz Edilecek Ürün Miktarı" : "Number Of Products To Be Analyzed") + " </label>" +
            "<input id='mysysAnalysisProductQuantity' type='number' class='ms-form-control ms-fs-5 ms-p-1 ms-mb-2' style='" + innerParams.showExtraFields + "'/>" +


            "<div id='divQAButton' class='ms-mt-2 ms-bg-white ms-d-none'>" +
            "<button id='qaButton' class='ms-align-items-center ms-justify-content-center ms-d-flex ms-form-control ms-fs-6 ms-btn ms-btn-outline-success ms-py-2' data-bs-toggle='modal' data-bs-target='#qaModal'> " +
            (innerParams.lang == "tr" ? "Hızlı Analiz" : "Quick Analysis") +
            "</button>" +

            
            "</div>" +
            "<div id='MysysGetProductsBtn' class='MysysGetProductsBtn ms-bg-white ms-mt-2'>" +
            "<button class='ms-align-items-center ms-justify-content-center ms-d-flex ms-form-control ms-fs-6 ms-btn ms-btn-outline-success ms-py-2 mys-tooltip'>" +
            "<img class='ms-me-1' style='width:30px;' src='" + chrome.runtime.getURL("images/icons/icon48.png") + "'>" + (innerParams.lang == "tr" ? "Ürünleri MySYS'e Aktar" : "Import The Products to MySYS") +
            "<span class='mys-tooltiptext mys-tooltip-top'>" + importButtonTooltip +
            "</span>" +
            "</button>" +
            "</div>" +
            "</div>" +
            "</div>";
    },
    GetCountryListSelectElem: function (params) {
        // let params = {
        //     SelectedCountry,
        //     Lang,
        //     ShowExtraFields,
        //     SelectElemId,
        //     ShowNA,
        //     ShowEU,
        //     Type:"Source"||"Target"
        // };

        let label = params.Lang == "tr" ? "Kaynak Ülke" : "Source Country";
        let chooseOption = "";
        if (params.Type == "Target") {
            label = params.Lang == "tr" ? "Hedef Ülke" : "Target Country"

            let selected = params.SelectedCountry ? "" : "selected";
            chooseOption = params.Lang == "tr" ? `<option ${selected}>Seçiniz...</option>` : `<option ${selected}>Choose...</option>`
        }

        if (params.ShowNA || params.ShowEU) {
            return `
            <label class='ms-fw-bold ms-w-100' style='${params.ShowExtraFields ?? ""}'>${label}</label>
            <select id='${params.SelectElemId}' class='ms-form-select ms-py-2 ms-mb-2' style='${params.ShowExtraFields ?? ""}'>
            ${chooseOption}
            <optgroup label="Amerika" class="${params.ShowNA ? "" : "ms-d-none"}">
            <option value="com" ${params.SelectedCountry == "com" ? "selected" : ""}>${params.Lang == "tr" ? "ABD" : "USA"}</option>
            <option value="ca" ${params.SelectedCountry == "ca" ? "selected" : ""}>${params.Lang == "tr" ? "Kanada" : "Canada"}</option>
            </optgroup>
            <optgroup label="Avrupa" class="${params.ShowEU ? "" : "ms-d-none"}">
            <option value="de" ${params.SelectedCountry == "de" ? "selected" : ""}>${params.Lang == "tr" ? "Almanya" : "Germany"}</option>
            <option value="co.uk" ${params.SelectedCountry == "co.uk" ? "selected" : ""}>${params.Lang == "tr" ? "İngiltere" : "England"}</option>
            <option value="it" ${params.SelectedCountry == "it" ? "selected" : ""}>${params.Lang == "tr" ? "İtalya" : "Italy"}</option>
            <option value="es" ${params.SelectedCountry == "es" ? "selected" : ""}>${params.Lang == "tr" ? "İspanya" : "Spain"}</option>
            <option value="fr" ${params.SelectedCountry == "fr" ? "selected" : ""}>${params.Lang == "tr" ? "Fransa" : "France"}</option>
            <option value="com.tr" ${params.SelectedCountry == "com.tr" ? "selected" : ""}>${params.Lang == "tr" ? "Türkiye" : "Turkiye"}</option>
            <option value="ae" ${params.SelectedCountry == "ae" ? "selected" : ""}>${params.Lang == "tr" ? "BAE" : "UAE"}</option>
            </optgroup>
            </select>
            `;
        }

        return "";
    },
    RemoveUAEAndTurkey: function (removeUAE = true, removeTr = true) {
        if (removeTr) {
            $("#mysysAnalysisTargetCountry option[value='com.tr']").remove();
        }
        if (removeUAE) {
            $("#mysysAnalysisTargetCountry option[value='ae']").remove();
        }
    },
    GetOneProductQATemplate: function (buttonText = "MySYS Analiz") {
        return '<div id="arbBarcodeComparerPanel" class="ms-bg-light ms-align-items-center ms-d-none ms-float-end ms-position-fixed ms-rounded ms-shadow mysys">' +
            '<button class="ms-border-success ms-align-items-center ms-justify-content-center ms-d-flex ms-form-control ms-fs-6 ms-btn ms-btn-outline-success ms-py-2" data-bs-toggle="modal" data-bs-target="#commonModal">' +
            '<img class="ms-me-1" style="width:30px;" src="' + chrome.runtime.getURL("images/icons/icon48.png") + '">' + buttonText +
            '</button>' +
            '</div>';
    },
    GetASINSearcherTemplate: function () {
        return '<hr class="ms-my-2">' +
            '<label class="ms-fw-bold  ms-w-100">ASIN Searcher</label>' +
            '<input id="asinToFind" type="text" class="ms-form-control ms-fs-5 ms-p-1 ms-mb-1">' +
            '<button id="searchASIN" class="ms-align-items-center ms-justify-content-center ms-d-flex ms-form-control ms-fs-6 ms-btn ms-btn-outline-success ms-py-2">Search ASIN</button>';
    },
    GetSourceCountryDomain: function () {
        return $("#mysysAnalysisSourceCountry").val();
    },
    GetSelectedDomain: function () {
        return $("#mysysAnalysisTargetCountry").val();
    },
    GetSelectedCountryCode: function () {
        let selectedDomain = arbcommon.GetSelectedDomain();
        return common.GetMarketplaceCountryCode(selectedDomain);
    },
    GetSelectedCurrencySymbol: function () {
        let selectedDomain = arbcommon.GetSelectedDomain();
        return common.GetCurrencySymbol(selectedDomain);
    },
    GetSelectedCurrencyCode: function () {
        let selectedDomain = arbcommon.GetSelectedDomain();
        return common.GetCurrencyCode(selectedDomain);
    },
    GetSelectedContinentCode: function () {
        let continent = document.querySelector('#mysysAnalysisTargetCountry option:checked').parentElement.label;
        if (continent == "Avrupa") {
            return "eu"
        } else if (continent == "Amerika") {
            return "na";
        }
    },
    IsEuropeSelected: function () {
        return this.GetSelectedContinentCode() == "eu";
    },
    IsAmericaSelected: function () {
        return this.GetSelectedContinentCode() == "na";
    },
    GetSelectedCountry: function () {
        return document.querySelector('#mysysAnalysisTargetCountry option:checked')?.innerText;
    },
    GetWarningPanelTemplate: function (warningMessage) {
        return "<div id='arbWarningPanel' class='mysys ms-border ms-rounded ms-border-success ms-bg-light ms-p-3 ms-pt-2 ms-float-end ms-m-4 ms-position-absolute ms-shadow'>" +
            '<div class="minmaxBtn ms-float-end">' +
            icons.MinimizeIcon("ms-mb-2") +
            '</div>' +
            warningMessage +
            "</div>";
    },
    WarningMessageEng: function (auth = "") {
        return "<p class='ms-text-danger'>Only the MySYS users who have the authority of " + auth + " can use this feature.</p>" +
            "<p><a href='https://app.mysys.com/SignUp/Index/57' target='_blank' class='ms-fw-bold ms-link-primary'>Sign up to MySYS</a></p>" +
            "<p>You are going to be able to use this feature after you purchase the authority.</p>";
    },
    WarningMessageTr: function (auth = "") {
        return "<p class='ms-text-danger ms-mb-1'>Bu özelliği yalnızca " + auth + " yetkisi olan MySYS kullanıcıları kullanabilir.</p>" +
            "<p class='ms-mb-1'><a href='https://app.mysys.com/SignUp/Index/57' target='_blank' class='ms-fw-bold ms-link-primary'>MySYS'e üye olun.</a></p>" +
            "<p>Belirtilen yetkiyi satın aldıktan sonra bu özelliği kullanabileceksiniz.</p>";
    },
    PostAnalysisResult: async function (products, siteId, processId, searchName, lang = "tr") {

        let TargetCountryDomain = $("#mysysAnalysisTargetCountry").val();
        let SalesTax = Number($("#mysysAnalysisSalexTax").val());
        let FBACargo = Number($("#mysysAnalysisFBACargo").val());
        let SourceCountryDomain = $("#mysysAnalysisSourceCountry").val();

        if (document.location.href.indexOf("www.amazon") > -1) {
            let domain = common.GetDomain(); //ca
            SourceCountryDomain = domain == SourceCountryDomain ? null : SourceCountryDomain;
        }

        searchName = this.AddSuffixToSearchName(searchName, siteId);

        let content = {
            "Products": products,
            "SiteId": siteId,
            "ProcessId": processId,
            "SearchName": searchName,
            "TargetCountryDomain": TargetCountryDomain,
            "SalesTax": SalesTax,
            "FBACargo": FBACargo,
            "SourceCountryDomain": SourceCountryDomain
        }

        let url = common.HOST + '/api/arbitrage/ArbitrageSaveSrcSiteProducts';

        await this.SaveExtraInfoToStorage();

        chrome.runtime.sendMessage({ data: content, url: url, type: "m0" }, (response) => {
            try {
                if (response?.response?.isSuccess) {
                    if (response.response.paramInt > 0) {
                        if (lang == "tr") {
                            arbmodal.AddComment2("<div class='ms-text-success ms-d-flex'><div class='ms-col-auto ms-me-2'>" + common.SuccessIcon + "</div>" + response.response.paramInt + " adet ürün başarılı şekilde MySYS Arbitraj Analize eklendi.</div><p class='ms-mt-3'><a href='https://app.mysys.com/ProductFinder/UploadInventory' class='ms-link-primary' target='_blank'>Analiz Listesini görüntülemek için tıklayınız.</a></p>");
                        } else {
                            arbmodal.AddComment2("<div class='ms-text-success ms-d-flex'><div class='ms-col-auto ms-me-2'>" + common.SuccessIcon + "</div>" + response.response.paramInt + " items have been imported to MySYS Arbitrage Analysis module.</div><p class='ms-mt-3'><a href='https://app.mysys.com/ProductFinder/UploadInventory' class='ms-link-primary' target='_blank'>Click here to view the Analysis List.</a></p>");
                        }
                    } else {
                        if (lang == "tr") {
                            arbmodal.AddComment2("<div class='ms-text-warning ms-d-flex'><div class='ms-col-auto ms-me-2'>" + common.WarningIcon() + "</div>İşlem bitti ancak hiç bir ürün eklenmedi. Sayfadaki ürünlerin barkodları geçerli değil. Arama kriterlerini değiştirip tekrar deneyebilirsiniz.</div>");
                        } else {
                            arbmodal.AddComment2("<div class='ms-text-warning ms-d-flex'><div class='ms-col-auto ms-me-2'>" + common.WarningIcon() + "</div>The transaction is finished, but no products have been added. The products on the page are not valid. You can change the search criteria and try again.</div>");
                        }
                    }

                    if (lang == "tr") {
                        arbmodal.SetHeader("Bitti");
                    } else {
                        arbmodal.SetHeader("Finished");
                    }
                } else {
                    if (lang == "tr") {
                        arbmodal.AddComment2("<div class='ms-text-danger ms-d-flex'><div class='ms-col-auto ms-me-2'>" + common.DangerIcon + "</div>Hata oluştu.</div><p class='ms-mt-3'>Ürünler eklenemedi.</p>");
                        arbmodal.SetHeader("Bitti");
                    } else {
                        arbmodal.AddComment2("<div class='ms-text-danger ms-d-flex'><div class='ms-col-auto ms-me-2'>" + common.DangerIcon + "</div>An error occurred.</div><p class='ms-mt-3'>Products could not be added.</p>");
                        arbmodal.SetHeader("Finished");
                    }
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });
    },
    AddSuffixToSearchName: function (searchName, siteId) {
        if (searchName) {
            switch (siteId) {
                case this.Sites.amazon:
                    searchName += "-asu"
                    break;
                case this.Sites.boyner:
                    searchName += "-bn"
                    break;
                case this.Sites.hepsiburada:
                    searchName += "-hb"
                    break;
                case this.Sites.morhipo:
                    searchName += "-mrh"
                    break;
                case this.Sites.n11:
                    searchName += "-n11"
                    break;
                case this.Sites.qogita:
                    searchName += "-qog"
                    break;
                case this.Sites.samsclub:
                    searchName += "-sams"
                    break;
                case this.Sites.trendyol:
                    searchName += "-ty"
                    break;
                default:
                    break;
            }

            searchName += "_" + this.GenerateGUID().split("-")[0];
        }

        return searchName;
    },
    SaveExtraInfoToStorage: function () {
        return new Promise((resolve, reject) => {
            let ArbitrageExtraInfo = {
                TargetCountryDomain: $("#mysysAnalysisTargetCountry").val(),
                SalesTax: Number($("#mysysAnalysisSalexTax").val()),
                FBACargo: Number($("#mysysAnalysisFBACargo").val())
            }

            chrome.storage.local.set({ arbitrageExtraInfo: ArbitrageExtraInfo }, function () {
                resolve(true);
            });
        });
    },
    SetExtraInfoToInputs: function () {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['arbitrageExtraInfo'], function (result) {
                try {
                    $("#mysysAnalysisTargetCountry").val(result?.arbitrageExtraInfo?.TargetCountryDomain);
                    $("#mysysAnalysisSalexTax").val(result?.arbitrageExtraInfo?.SalesTax);
                    $("#mysysAnalysisFBACargo").val(result?.arbitrageExtraInfo?.FBACargo);
                    resolve(true);
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                    resolve(false);
                }
            })
        });
    },
    GetUserAmazonSellerTokenInfo: function () {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['mysysToken'], function (result) {
                if (result?.mysysToken) {
                    chrome.runtime.sendMessage(
                        {
                            method: 'GET',
                            url: `${common.HOST}/api/auth/amztokeninfo/` + result.mysysToken,
                            type: "m0"
                        }, response => {
                            let result = common.ConvertToJSON(response?.response?.paramStr);
                            if (result) {
                                resolve(result);
                            } else {
                                reject(response?.response?.userMessage);
                            }
                        });
                } else {
                    reject("Session is timed-out or invalid. Please sign in.");
                }
            })
        })
    },
    TokenWarningMessageTr: function (token) {
        let amzSellerTokenLink = 'http://app.mysys.com/Extension/AmazonTokens?token=' + token;
        return "<p class='ms-text-danger ms-mb-1'>Yalnızca Amazon Seller Token bilgisi bulunan kullanıcılar bu özelliği kullanabilmektedir.</p>" +
            "<p class='ms-mb-1'><a href='" + amzSellerTokenLink + "' target='_blank' class='ms-fw-bold ms-link-primary'>Amazon Seller Token'ınızı kaydedin.</a></p>";
    },
    TokenWarningMessageEng: function (token) {
        let amzSellerTokenLink = 'http://app.mysys.com/Extension/AmazonTokens?token=' + token;
        return "<p class='ms-text-danger ms-mb-1'>Only users with Amazon Seller Token information can use this feature.</p>" +
            "<p class='ms-mb-1'><a href='" + amzSellerTokenLink + "' target='_blank' class='ms-fw-bold ms-link-primary'>Save your Amazon Seller Token</a></p>";
    },
    SessionInvalidErrorTr: function () {
        return "<span class='ms-text-danger'>MySYS Extension oturumunuz geçersiz. Lütfen tekrar giriş yapın.</span>";
    },
    SessionInvalidErrorEng: function () {
        return "<span class='ms-text-danger'>Please login or register to MySYS Extension.</span>";
    },
    RedirectToWholesalerPage: function () {
        window.open('https://mysys.com/en/toptanci-analizi/', '_blank').focus();
    },
    SendRequestProductPage: function (GetProductInfoFromHTMLFunc, productLink, tryingCount = 1) {
        return new Promise(async (resolve, reject) => {
            $.ajax({
                url: productLink,
                error: function (err) {
                    if (err?.statusText == 'timeout') {
                        if (tryingCount == 7) {
                            reject(err);
                        } else {
                            setTimeout(async () => {
                                try {
                                    let product = await arbcommon.SendRequestProductPage(GetProductInfoFromHTMLFunc, productLink, ++tryingCount)
                                    resolve(product);
                                } catch (error) {
                                    reject(error);
                                }
                            }, tryingCount * 1000);
                        }
                    } else {
                        reject(err);
                    }
                },
                success: function (productPageHtml) {
                    try {
                        resolve(GetProductInfoFromHTMLFunc(productPageHtml, productLink));
                    } catch (error) {
                        reject(error);
                    }
                },
                timeout: 5000 // sets timeout to 5 seconds
            });
        });
    },
    GetBarcodePanel: function (barcode) {
        return `<div id="mysysBarcodePanel" class="ms-align-items-center ms-bg-light ms-border ms-d-flex ms-fs-6 ms-p-1 mysys" style="border-radius: 5px;width: fit-content;">
        <img class="ms-me-1" src="${chrome.runtime.getURL("images/icons/icon48.png")}" style="width:30px;">
        <span class="ms-fw-bold mysys-barcode ms-text-dark-success" style="font-size:1rem">${barcode}</span>
        </div>`;
    },
    RemoveBarcodePanel: function () {
        document.getElementById("mysysBarcodePanel")?.remove();
    },
    CheckProductCountToBeAnalyzed: function (productCount) {
        let productLimit = arbcommon.GetProductCountToBeAnalyzed();

        return !(productLimit > 0 && productLimit < productCount);
    },
    GetProductCountToBeAnalyzed: function () {
        let productLimit = Number($("#mysysAnalysisProductQuantity").val());

        if (productLimit > 0) {
            return productLimit;
        }

        return 3000; // max prod. count to be searched
    },
    GenerateArbSearchName: function () {
        let currentDate = new Date();
        return currentDate.toLocaleString("fr-CA", { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false, minute: '2-digit' }).replaceAll(" h ", "-").replace(" ", "_");
    },
    Sites: {
        hepsiburada: 11,
        trendyol: 12,
        boyner: 13,
        n11: 14,
        morhipo: 15,
        samsclub: 16,
        qogita: 17,
        amazon: 21
    }
}
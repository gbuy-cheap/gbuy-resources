"use strict";
var qaGridOptions;
var isUserPremium = false, allowSearch = true;
var premiumWarningHTML = "";
var fakeText = "Premium üyelik satın alın";
var qaLang;
var quickAnalysis = {
    GetModal: function () {
        return '<div class="ms-modal mysys" id="qaModal" data-bs-backdrop="static" tabindex="-1" aria-labelledby="qaModalLabel" aria-hidden="true">' +
            '<div class="ms-modal-dialog ms-modal-dialog-centered ms-p-5 ms-modal-fullscreen ms-modal-xl">' +
            '<div class="ms-modal-content ms-bg-light ms-shadow" style="min-height: 650px;">' +
            '<div class="ms-modal-header ms-bg-light-yellow ms-border-yellow">' +
            '<a href="javascript:;" class="ms-border-0 ms-btn ms-btn-outline-success ms-d-flex ms-text-decoration-none ms-link-dark" data-bs-toggle="collapse" data-bs-target="#collapseWidthQA" aria-expanded="false" aria-controls="collapseWidthQA">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ms-me-1" viewBox="0 0 16 16">' +
            '<path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />' +
            '</svg>' +
            '<span>' + (qaLang == "tr" ? 'Menü' : 'Menu') + '</span>' +
            '</a>' +
            '<div>' +
            '<h5 class="ms-modal-title ms-d-flex ms-align-items-center ms-my-0" id="qaModalLabel">' +
            '<img src="' + chrome.runtime.getURL("images/favicon.png") + '" alt="" style="width: 27px;" class="ms-d-inline ms-me-2">' +
            '<span>MySYS Extension</span>' +
            '</h5>' +
            '</div>' +
            '<div class="ms-d-flex ms-align-items-center ms-me-3">' +
            '<button id="btnMaximize" type="button" class="ms-btn ms-d-none">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrows-fullscreen" viewBox="0 0 16 16">' +
            '<path fill-rule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z"/>' +
            '</svg>' +
            '</button>' +
            '<button type="button" class="ms-btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
            '</div>' +
            '</div>' +
            '<div class="ms-modal-body ms-p-0 ms-overflow-hidden" style="margin-top: -1px;">' +
            '<div class="ms-h-100 ms-position-absolute ">' +
            '<div class="ms-collapse ms-collapse-horizontal ms-h-100" id="collapseWidthQA">' +
            '<div class="ms-bg-light-yellow ms-border-start-0 ms-border-top-0 ms-border-bottom ms-border-end ms-border-yellow ms-card ms-card-body ms-h-100 ms-rounded-0" style="width: 300px; border-bottom-right-radius: 5rem!important;z-index: 10;">' +
            '<div id="menuList">' +
            '<div class="ms-col-12 ms-py-1">' +
            '<a id="btnCustomizeView" href="#" class="ms-btn ms-text-decoration-none ms-link-dark">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ms-me-2 " viewBox="0 0 16 16">' +
            '<path fill-rule="evenodd" d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3h9.05zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8h2.05zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1h9.05z" />' +
            '</svg>' +
            '<span>' + (qaLang == "tr" ? "Görünümü Özelleştir" : "Customize View") + '</span>' +
            '</a>' +
            '</div>' +
            '<hr class="ms-my-0">' +
            '<div class="ms-col-12 ms-py-1">' +
            '<a href="#" id="downloadGrid" class="ms-btn ms-text-decoration-none ms-link-dark">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ms-me-2 " viewBox="0 0 16 16">' +
            '<path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V9H3V2a1 1 0 0 1 1-1h5.5v2zM3 12v-2h2v2H3zm0 1h2v2H4a1 1 0 0 1-1-1v-1zm3 2v-2h3v2H6zm4 0v-2h3v1a1 1 0 0 1-1 1h-2zm3-3h-3v-2h3v2zm-7 0v-2h3v2H6z" />' +
            '</svg>' +
            '<span>' + (qaLang == "tr" ? "İndir" : "Download") + '</span>' +
            '</a>' +
            '</div>' +
            '</div>' +

            '<div id="customizeViewPanel" class="ms-d-none menuPanel">' +
            '<div class="ms-col-12 ms-py-2 ms-bg-light ms-rounded">' +

            '<div class="ms-form-check">' +
            '<a href="#" class="btnBack ms-link-dark ms-text-decoration-none">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ms-me-1" viewBox="0 0 16 16">' +
            '<path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />' +
            '</svg>' +
            '<span>' + (qaLang == "tr" ? "Geri" : "Back") + '</span>' +
            '</a>' +
            '</div>' +
            '<hr class="ms-mt-2">' +

            '<div class="ms-row ms-mb-1">' +
            '<div class="ms-col-12 ms-px-4">' +
            '<div class="ms-form-check">' +
            '<input class="ms-form-check-input cb-grid-field" type="checkbox" data-field-name="title" id="cbTitle" checked>' +
            '<label class="ms-form-check-label ms-w-inherit" for="cbTitle">' + (qaLang == "tr" ? "Başlık" : "Title") + '</label>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="ms-row ms-mb-1">' +
            '<div class="ms-col-12 ms-px-4">' +
            '<div class="ms-form-check">' +
            '<input class="ms-form-check-input cb-grid-field" type="checkbox" data-field-name="asin" id="cbASIN" checked>' +
            '<label class="ms-form-check-label ms-w-inherit" for="cbASIN">' + (qaLang == "tr" ? "ASIN/Barkod" : "ASIN/Barcode") + '</label>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="ms-row ms-mb-1">' +
            '<div class="ms-col-12 ms-px-4">' +
            '<div class="ms-form-check">' +
            '<input class="ms-form-check-input cb-grid-field" type="checkbox" data-field-name="bsr" id="cbBSR" checked>' +
            '<label class="ms-form-check-label ms-w-inherit" for="cbBSR">BSR</label>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="ms-row ms-mb-1">' +
            '<div class="ms-col-12 ms-px-4">' +
            '<div class="ms-form-check">' +
            '<input class="ms-form-check-input cb-grid-field" type="checkbox" data-field-name="top" id="cbTop" checked>' +
            '<label class="ms-form-check-label ms-w-inherit" for="cbTop">TOP</label>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="ms-row ms-mb-1">' +
            '<div class="ms-col-12 ms-px-4">' +
            '<div class="ms-form-check">' +
            '<input class="ms-form-check-input cb-grid-field" type="checkbox" data-field-name="price" id="cbFiyat" checked>' +
            '<label class="ms-form-check-label ms-w-inherit" for="cbFiyat">' + (qaLang == "tr" ? "Fiyat" : "Price") + '</label>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="ms-row ms-mb-1">' +
            '<div class="ms-col-12 ms-px-4">' +
            '<div class="ms-form-check">' +
            '<input class="ms-form-check-input cb-grid-field" type="checkbox" data-field-name="mosales" id="cbMoSales" checked>' +
            '<label class="ms-form-check-label ms-w-inherit" for="cbMoSales">' + (qaLang == "tr" ? "Aylık Satış" : "Mo. Sales") + '</label>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="ms-row ms-mb-1">' +
            '<div class="ms-col-12 ms-px-4">' +
            '<div class="ms-form-check">' +
            '<input class="ms-form-check-input cb-grid-field" type="checkbox" data-field-name="brand" id="cbMarka" checked>' +
            '<label class="ms-form-check-label ms-w-inherit" for="cbMarka">' + (qaLang == "tr" ? "Marka" : "Brand") + '</label>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="ms-row ms-mb-1">' +
            '<div class="ms-col-12 ms-px-4">' +
            '<div class="ms-form-check">' +
            '<input class="ms-form-check-input cb-grid-field" type="checkbox" data-field-name="category" id="cbKategori" checked>' +
            '<label class="ms-form-check-label ms-w-inherit" for="cbKategori">' + (qaLang == "tr" ? "Kategori" : "Category") + '</label>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="ms-row ms-mb-1">' +
            '<div class="ms-col-12 ms-px-4">' +
            '<div class="ms-form-check">' +
            '<input class="ms-form-check-input cb-grid-field" type="checkbox" data-field-name="totalreviews" id="cbReviewSayisi" checked>' +
            '<label class="ms-form-check-label ms-w-inherit" for="cbReviewSayisi">' + (qaLang == "tr" ? "Review Sayısı" : "Review Count") + '</label>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="ms-row">' +
            '<div class="ms-col-12 ms-px-4">' +
            '<div class="ms-form-check">' +
            '<input class="ms-form-check-input cb-grid-field" type="checkbox" data-field-name="datefirstavailable" id="cbIlkKullanilabilirTarih" checked>' +
            '<label class="ms-form-check-label ms-w-inherit" for="cbIlkKullanilabilirTarih">' + (qaLang == "tr" ? "İlk Kullanılabilir Tarih" : "Date First Available") + '</label>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="ms-row">' +
            '<div class="ms-col-12 ms-px-4">' +
            '<div class="ms-form-check ms-mt-3">' +
            '<a href="#" id="saveCustomizeView" class="ms-btn ms-btn-primary">' + (qaLang == "tr" ? "Kaydet" : "Save") + '</a>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '</div>' +
            '</div>' +

            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ag-theme-balham ms-p-3" id="agGridContainer" style="height:548px;max-height:600px;">' +
            '</div>' +
            '<input type="hidden" id="selectedContinent">' +
            '<input type="hidden" id="selectedCountryCode">' +
            '<div id="infoPanel" class="ms-row ms-px-3 ms-pb-2">' +
            '<div class="ms-col-6">' +

            '<div id="divTotalProductCount" class="ms-d-flex">' +
            '<span class="ms-col-6">' +
            '<span class="ms-fw-bold">' + (qaLang == "tr" ? "Toplam Ürün Sayısı" : "Total Number of Products") + ':&nbsp;</span>' +
            '<span class="ms-text-info" id="totalProductCount">0</span>' +
            '</span>' +
            '<span class="ms-fw-bold ms-col-5 ms-text-end">' + (qaLang == "tr" ? "Ülke" : "Country") + ':</span>' +
            '<span id="targetCountry" class="ms-text-info ms-col-1 ms-text-end"></span>' +
            '</div>' +
            '<div class="ms-d-flex">' +
            '<span class="ms-col-6">' +
            '<span class="ms-fw-bold">' + (qaLang == "tr" ? "Bulunan Barkod Sayısı" : "Found Barcode Count") + ':&nbsp;</span>' +
            '<span class="ms-text-info" id="foundBarcodeCount">0</span>' +
            '</span>' +
            '<span class="ms-fw-bold ms-col-5 ms-text-end">' + (qaLang == "tr" ? "Döviz Kuru" : "Exchange Rate") + '(<span id="fromCurrency"></span>):</span>' +
            '<span class="ms-col-1 ms-text-end">' +
            '<span id="toCurrency" class="ms-text-info"></span>&nbsp;<span id="currencyRateSpan" class="ms-text-info"></span>' +
            '</span>' +
            '<input type="hidden" id="currencyRate">' +
            '</div>' +

            '<div class="ms-d-flex">' +
            '<span class="ms-col-6">' +
            '<span class="ms-fw-bold">' + (qaLang == "tr" ? "Amazonda Bulunan Ürün Sayısı" : "Number of Products Found on Amazon") + ':&nbsp;</span>' +
            '<span class="ms-text-info" id="foundAmazonProductCount">0</span>' +
            '</span>' +
            '<span class="ms-fw-bold ms-col-5 ms-text-end">' + (qaLang == "tr" ? "Sayfa" : "Page") + ':</span>' +
            '<span class="ms-col-1 ms-text-end">' +
            '<span class="ms-text-info">' +
            '<span id="qaCurrPage">1</span>' +
            '<span class="ms-text-dark" style="margin: 0 2px 0 2px;">/</span>' +
            '<span id="qaTotalPage">1</span>' +
            '</span>' +
            '</span>' +
            '</div>' +

            '</div>' +
            '<div class="ms-col-6">' +
            '<div id="searchingStatusDiv" class="ms-align-items-center ms-d-flex ms-h-100 ms-m-0 ms-alert ms-alert-info ms-d-none">' +
            '<span id="searchingStatus"></span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-modal-footer ms-justify-content-center">' +
            '<button type="button" class="ms-btn ms-btn-outline-primary" id="qaLoadMore">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ms-me-1" viewBox="0 0 16 16">' +
            '<path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />' +
            '<path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />' +
            '</svg>' +
            '<span>' + (qaLang == "tr" ? "Daha Fazla Sonuç Yükle" : "Upload More Results") + '</span>' +
            '</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
    },
    Init: async function (parentElem = "body", GetProductLinksFunc, GetProductDetailFunc, GetTotalPageCount, GetTotalProductCount, lang = "tr", localCurrencyCode = "TRY") {
        qaLang = lang;
        let userInfo = common.GetUserInfoFromSessionStorage();

        if (lang != "tr") {
            fakeText = "Buy Premium Membership";
        }

        if (userInfo?.UserType == "Premium") {
            isUserPremium = true;
        } else {
            isUserPremium = false;
            let premiumLink = await common.GetPremiumLink(token)
            if (qaLang == "tr") {
                premiumWarningHTML = `<div class="ms-d-flex">${common.WarningIcon("ms-text-warning blink ms-me-2")}<a href="${premiumLink}" target="_blank">Daha fazla arama yapmak için Premium Üyelik satın alın</a></div>`;
            } else {
                premiumWarningHTML = `<div class="ms-d-flex">${common.WarningIcon("ms-text-warning blink ms-me-2")}<a href="${premiumLink}" target="_blank">Buy Premium Membership to search more</a></div>`;
            }
        }

        $(parentElem).append(quickAnalysis.GetModal());
        await quickAnalysis.ConfigureAGGrid();

        quickAnalysis.ShowSpinner(false);

        if (typeof GetProductLinksFunc === "function" &&
            typeof GetProductDetailFunc === "function") {
            quickAnalysis.BindModalShownEvent(GetProductLinksFunc, GetProductDetailFunc, GetTotalPageCount, GetTotalProductCount, localCurrencyCode);
            quickAnalysis.BindLoadMoreEvent(GetProductLinksFunc, GetProductDetailFunc);
        }

        quickAnalysis.BindOtherEvents();
        quickAnalysis.ApplySettings();
        $("body").prepend('<div class="ms-shadow ms-d-none ms-popover"><img class="ms-w-100"></div>');
        $("#divQAButton").removeClass("ms-d-none");
    },
    BindModalShownEvent: function (GetProductLinks, GetProductDetailsFromLocal, GetTotalPageCount, GetTotalProductCount, localCurrencyCode) {
        $(document).on("shown.bs.modal", "#qaModal", async function (e) {
            try {
                e.stopPropagation();
                quickAnalysis.SetTotalPageCount(GetTotalPageCount());
                quickAnalysis.SetTotalProductCount(GetTotalProductCount());
                quickAnalysis.SetGridHeight();

                if (arbcommon.GetSelectedCountryCode() && arbcommon.GetSelectedCountry() != "") {
                    await arbcommon.SaveExtraInfoToStorage();
                    if ($("#targetCountry").text() != "" &&
                        $("#targetCountry").text() != arbcommon.GetSelectedCountry()) {
                        quickAnalysis.ResetModal();
                        quickAnalysis.ConfigureAGGrid();
                        quickAnalysis.SetSearchingStatus("");
                        quickAnalysis.ShowSpinner(false);
                    }

                    if (quickAnalysis.GetFoundTotalBarcodeCount() == 0 &&
                        !quickAnalysis.IsSpinnerVisible()) {

                        quickAnalysis.DisableLoadMoreButton();
                        quickAnalysis.SetSearchingStatus("");

                        let selectedCurrencyCode = arbcommon.GetSelectedCurrencyCode();
                        let selectedCurrencySymbol = arbcommon.GetSelectedCurrencySymbol();

                        let currencyRate = await common.GetCurrencyRate(selectedCurrencyCode, localCurrencyCode);

                        currencyRate = Number(currencyRate.replace(",", "."));

                        $("#currencyRateSpan").text(currencyRate.toFixed(2));
                        $("#currencyRate").val(currencyRate);

                        let targetCountry = arbcommon.GetSelectedCountry();
                        $("#targetCountry").text(targetCountry);

                        $("#selectedContinent").val(arbcommon.GetSelectedContinentCode());
                        $("#selectedCountryCode").val(arbcommon.GetSelectedCountryCode());

                        $("#fromCurrency").text(selectedCurrencySymbol);
                        $("#toCurrency").text(common.GetCurrencySymbolByCode(localCurrencyCode));

                        if (selectedCurrencyCode != localCurrencyCode) {
                            $("#fromCurrency").parents("span").eq(0).removeClass("ms-visible");
                            $("#toCurrency").parents("span").eq(0).removeClass("ms-visible");
                        } else {
                            $("#fromCurrency").parents("span").eq(0).addClass("ms-invisible");
                            $("#toCurrency").parents("span").eq(0).addClass("ms-invisible");
                        }

                        $("#qaLoadMore").addClass("disabled");
                        quickAnalysis.ShowSpinner();

                        var currUrl = window.location.href;

                        let totalPage = quickAnalysis.GetTotalPageCount();

                        quickAnalysis.FindProductOnPage(GetProductLinks, GetProductDetailsFromLocal, currUrl, 1, totalPage, 1, targetCountry);

                        qaGridOptions.api.sizeColumnsToFit();
                    }
                } else {
                    if (qaLang == "tr") {
                        toast.ShowWarning("Ülke seçiniz", "Uyarı");
                    } else {
                        toast.ShowWarning("Select country", "Warning");
                    }
                    $("#qaModal").modal("hide");
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });
    },
    FindProductOnPage: function (GetProductLinks, GetProductDetailsFromLocal, currUrl, currPage, totalPage, runningCount = 1, targetCountry) {
        if (targetCountry == arbcommon.GetSelectedCountry()) {
            if (allowSearch) {
                GetProductLinks(decodeURIComponent(currUrl), currPage).then(async productLinkList => {
                    $("#qaCurrPage").text(currPage);

                    quickAnalysis.SetSearchingStatus(quickAnalysis.GetSearchingTextHTML(currPage, 1));

                    if (productLinkList?.length > 0) {
                        let counter = 0;
                        let result = false;
                        let anyProductAddedToGrid = false;
                        let foundBarcodeCount = quickAnalysis.GetFoundTotalBarcodeCount();

                        let slicedArray = common.SliceArray(productLinkList, 30);
                        let totalCountSlicedArr = 0;
                        slicedArray.forEach(x => totalCountSlicedArr += x.length);
                        for (let x = 0; x < slicedArray.length; x++) {
                            await common.Sleep(2000);
                            for (let y = 0; y < slicedArray[x].length; y++) {
                                if (slicedArray[x][y] &&
                                    targetCountry == arbcommon.GetSelectedCountry()) {

                                    await common.Sleep(1000);

                                    GetProductDetailsFromLocal(slicedArray[x][y]).then(async localCrawledProduct => {
                                        if (Array.isArray(localCrawledProduct)) {
                                            localCrawledProduct = localCrawledProduct[0];
                                        }

                                        if (localCrawledProduct) {
                                            result = await quickAnalysis.SetProductToGrid(localCrawledProduct);
                                            quickAnalysis.SetFoundTotalBarcodeCount(++foundBarcodeCount);
                                        }
                                        counter++;

                                        let rowCount = quickAnalysis.GetRowCount();
                                        $("#foundAmazonProductCount").text(rowCount);

                                        if (result) {
                                            anyProductAddedToGrid = result;
                                            if (qaLang == "tr") {
                                                quickAnalysis.SetSearchingStatus(`Şu ana kadar ${rowCount} adet ürün bulundu.`);
                                            } else {
                                                quickAnalysis.SetSearchingStatus(`There are ${rowCount} products found so far.`);
                                            }

                                        } else {
                                            quickAnalysis.SetSearchingStatus(quickAnalysis.GetSearchingTextHTML(currPage, counter));
                                        }
                                        quickAnalysis.DisableLoadMoreButton();

                                        if (counter == totalCountSlicedArr) {
                                            currPage++;
                                            if (currPage <= totalPage && (runningCount % 5) == 0 && !anyProductAddedToGrid) {//her 5 sayfa aramada bir eger ürün bulunamadiysa aramayi durdur                                        
                                                quickAnalysis.ShowSpinner(false);

                                                if (isUserPremium) {
                                                    if (qaLang == "tr") {
                                                        quickAnalysis.SetSearchingStatus(`Son 5 sayfa icinde ürün bulunamadı.`);
                                                    } else {
                                                        quickAnalysis.SetSearchingStatus(`No products found in the last 5 pages.`);
                                                    }
                                                    quickAnalysis.DisableLoadMoreButton(false);
                                                } else {
                                                    allowSearch = false;
                                                    if (qaLang == "tr") {
                                                        quickAnalysis.SetSearchingStatus(`<div class="ms-mb-1">Son 5 sayfa icinde ürün bulunamadı.</div>${premiumWarningHTML}`);
                                                    } else {
                                                        quickAnalysis.SetSearchingStatus(`<div class="ms-mb-1">No products found in the last 5 pages.</div>${premiumWarningHTML}`);
                                                    }

                                                    this.SetGridHeight();
                                                }
                                            } else if (!anyProductAddedToGrid && currPage <= totalPage) {
                                                if (qaLang == "tr") {
                                                    quickAnalysis.SetSearchingStatus(`<b>${currPage}.</b> sayfaya geçiliyor`);
                                                } else {
                                                    quickAnalysis.SetSearchingStatus(`Going to page <b>${currPage}.</b>`);
                                                }
                                                await common.Sleep(2000);
                                                quickAnalysis.FindProductOnPage(GetProductLinks, GetProductDetailsFromLocal, currUrl, currPage, totalPage, ++runningCount, targetCountry);
                                            } else {
                                                if (isUserPremium) {
                                                    quickAnalysis.EndOfSearch(rowCount);
                                                } else {
                                                    allowSearch = false;
                                                    this.SetFakeData();
                                                    quickAnalysis.SetSearchingStatus(premiumWarningHTML);
                                                    quickAnalysis.ShowSpinner(false);
                                                }
                                            }
                                        }
                                    }).catch(err => {
                                        let rowCount = quickAnalysis.GetRowCount();
                                        $("#foundAmazonProductCount").text(rowCount);

                                        if (err?.statusText == 'timeout') {
                                            let hostname = window.location.hostname.replace("www.", "").split(".")[0];
                                            qaGridOptions?.api.showNoRowsOverlay();
                                            if (qaLang == "tr") {
                                                quickAnalysis.SetSearchingStatus(`${common.WarningIcon()}&nbsp;Yoğun istekte bulunduğunuz için şu anda ${hostname || window.location.hostname} sayfası cevap veremiyor. Lütfen daha sonra tekrar deneyin.`);
                                            } else {
                                                quickAnalysis.SetSearchingStatus(`${common.WarningIcon()}&nbsp;Because of your high request, the ${hostname || window.location.hostname} page is not able to respond at the moment. Please try again later.`);
                                            }
                                            quickAnalysis.DisableLoadMoreButton(false);
                                        } else {
                                            errorHandler.SendErrorToAdmin(err);
                                            if (qaLang == "tr") {
                                                quickAnalysis.SetSearchingStatus(`Şu ana kadar ${rowCount} adet ürün bulundu.`);
                                            } else {
                                                quickAnalysis.SetSearchingStatus(`There are ${rowCount} products found so far.`);
                                            }
                                        }

                                    });
                                }
                            }
                        }
                    } else {
                        let rowCount = quickAnalysis.GetRowCount();
                        quickAnalysis.EndOfSearch(rowCount);
                    }
                }).catch(err => {
                    console.error(err);
                    errorHandler.SendErrorToAdmin(err);
                    this.DisableLoadMoreButton(false);
                    this.ShowSpinner(false);
                });
            } else {
                if (!this.IsFakeDataSet()) {
                    this.SetFakeData();
                }
                quickAnalysis.ShowSpinner(false);
                quickAnalysis.SetSearchingStatus(premiumWarningHTML);
            }
        }
    },
    EndOfSearch: function (rowCount) {
        if (rowCount > 0) {
            if (qaLang == "tr") {
                quickAnalysis.SetSearchingStatus(`Şu ana kadar ${rowCount} adet ürün bulundu.`);
            } else {
                quickAnalysis.SetSearchingStatus(`There are ${rowCount} products found so far.`);
            }
        } else {
            if (qaLang == "tr") {
                quickAnalysis.SetSearchingStatus(`${common.WarningIcon()}&nbsp;Kriterlere uygun ürün bulunamadı.`);
            } else {
                quickAnalysis.SetSearchingStatus(`${common.WarningIcon()}&nbsp;No product found matching the criteria.`);
            }
        }

        let totalPage = quickAnalysis.GetTotalPageCount();
        let currentPage = quickAnalysis.GetCurrentPage();
        if (currentPage < totalPage) {
            quickAnalysis.DisableLoadMoreButton(false);
        } else {
            quickAnalysis.DisableLoadMoreButton();
        }
        quickAnalysis.ShowSpinner(false);
    },
    GetProductInfoByBarcode: function (barcode, domain) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                {
                    url: `${common.HOST}/api/arbitrage/QuickAnalysis?barcode=${barcode}&domain=${domain}`,
                    method: 'POST',
                    type: "m0"
                }, (response) => {
                    try {
                        if (response?.response?.isSuccess != undefined && !response.response.isSuccess) {
                            reject(response?.response?.userMessage);
                        } else if (response?.response?.paramStr) {
                            var products = common.ConvertToJSON(response.response.paramStr);

                            // console.log(products);

                            resolve(products);
                        } else {
                            resolve(false);
                        }
                    } catch (error) {
                        reject(error);
                    }

                });
        })
    },
    SetTotalPageCount: function (totalPageCount) {
        if (totalPageCount > 0) {
            $("#qaTotalPage").text(totalPageCount);
        }
    },
    GetTotalPageCount: function () {
        return Number($("#qaTotalPage").text());
    },
    GetCurrentPage: function () {
        return Number($("#qaCurrPage").text());
    },
    SetTotalProductCount: function (totalProduct) {
        if (totalProduct > 0) {
            $("#divTotalProductCount").removeClass("ms-d-none");
            $("#totalProductCount").text(totalProduct);
        }
    },
    GetTotalProductCount: function () {
        return Number($("#totalProductCount").text());
    },
    BindLoadMoreEvent: function (GetProductLinks, GetProductDetailsFromLocal) {
        $(".mysys").on("click", "#qaLoadMore", async function (e) {
            try {
                e.stopPropagation();
                if (!quickAnalysis.IsSpinnerVisible()) {
                    quickAnalysis.DisableLoadMoreButton();
                    quickAnalysis.ShowSpinner();

                    var currUrl = window.location.href;

                    let totalPage = quickAnalysis.GetTotalPageCount();
                    let currentPage = quickAnalysis.GetCurrentPage();

                    if (currentPage <= totalPage) {
                        let targetCountry = arbcommon.GetSelectedCountry();

                        quickAnalysis.FindProductOnPage(GetProductLinks, GetProductDetailsFromLocal, currUrl, ++currentPage, totalPage, 1, targetCountry);
                    } else {
                        quickAnalysis.ShowSpinner(false);
                    }
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        })
    },
    BindOtherEvents: function () {
        $(".mysys").on("click", "#downloadGrid", function () {
            try {
                let rowDatas = [];
                qaGridOptions.api.forEachNode(node => rowDatas.push(node.data));

                if (rowDatas?.length > 0) {
                    let excelData = [];
                    rowDatas.forEach((product, index) => {
                        try {
                            let asin = product.asin;
                            let barcode = $(product.asinBarcode).eq(2).text();
                            let amazonTitle = $(product.title).eq(0).text();
                            let localTitle = $(product.title).eq(2).text();
                            let amazonPrice = $(product.price).eq(0).find(".amazonPrice").text();
                            let localPrice = $(product.price).eq(1).find(".localPrice").text();
                            let priceDiff = $(product.price).eq(2).find(".priceDiff").text();

                            if (amazonTitle != fakeText) {
                                if (qaLang == "tr") {
                                    excelData.push(
                                        {
                                            "#": (index + 1),
                                            "AMAZON BAŞLIK": amazonTitle?.trim(),
                                            "LOKAL BAŞLIK": localTitle?.trim(),
                                            "ASIN": asin?.trim(),
                                            "BARKOD": barcode?.trim(),
                                            "BSR": product.bsr,
                                            "TOP %": product.top,
                                            "AMAZON FİYAT": amazonPrice?.trim(),
                                            "LOKAL FİYAT": localPrice?.trim(),
                                            "FİYAT FARKI": priceDiff?.trim(),
                                            "MARKA": product.brand?.trim(),
                                            "AYLIK SATIŞ": product.mosales,
                                            "KATEGORİ": product.category?.trim(),
                                            "REVIEW SAYISI": product.totalreviews?.trim(),
                                            "İLK KULLANILABİLİR TARİH": product.datefirstavailable?.trim()
                                        }
                                    );
                                } else {
                                    excelData.push(
                                        {
                                            "#": (index + 1),
                                            "AMAZON HEADER": amazonTitle?.trim(),
                                            "LOCAL HEADER": localTitle?.trim(),
                                            "ASIN": asin?.trim(),
                                            "BARCODE": barcode?.trim(),
                                            "BSR": product.bsr,
                                            "TOP %": product.top,
                                            "AMAZON PRICE": amazonPrice?.trim(),
                                            "LOCAL PRICE": localPrice?.trim(),
                                            "PRICE DIFF": priceDiff?.trim(),
                                            "BRAND": product.brand?.trim(),
                                            "MONTHLY SALES": product.mosales,
                                            "CATEGORY": product.category?.trim(),
                                            "REVIEW COUNT": product.totalreviews?.trim(),
                                            "DATE FIRST AVAILABLE": product.datefirstavailable?.trim()
                                        }
                                    );
                                }
                            }
                        } catch (error) {
                            errorHandler.SendErrorToAdmin(error);
                        }
                    });

                    let pageName = window.location.hostname.replace("www.", "").split(".")[0];

                    exporter.DownloadAsExcel(excelData, pageName + "_" + new Date().getTime());
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });

        $(".mysys").on("click", "#btnCustomizeView", function () {
            $("#menuList").addClass("ms-d-none");
            $("#customizeViewPanel").removeClass("ms-d-none");
        });

        $(".mysys").on("click", ".btnBack", function () {
            $(this).parents(".menuPanel").eq(0).addClass("ms-d-none");
            $("#menuList").removeClass("ms-d-none");
        });

        $(".mysys").on("change", ".cb-grid-field", function () {
            let fieldName = $(this).data("field-name");
            qaGridOptions.columnApi.setColumnsVisible([fieldName], $(this).prop("checked"));
        });

        $(".mysys").on("click", "#saveCustomizeView", function () {
            $("#saveCustomizeView").addClass("disabled");
            chrome.storage.local.get(['userSettings'], function (result) {
                try {
                    quickAnalysis.ShowSpinner();
                    if (!result.userSettings) {
                        result.userSettings = {};
                    } else if (typeof result.userSettings == "string") {
                        result.userSettings = JSON.parse(result.userSettings);
                    }
                    result.userSettings.QuickAnalysis = {
                        "CustomizeView": {
                            "Title": {
                                "Name": "title",
                                "IsVisible": $("#cbTitle").prop("checked")
                            },
                            "ASIN": {
                                "Name": "asin",
                                "IsVisible": $("#cbASIN").prop("checked")
                            },
                            "BSR": {
                                "Name": "bsr",
                                "IsVisible": $("#cbBSR").prop("checked")
                            },
                            "Top": {
                                "Name": "top",
                                "IsVisible": $("#cbTop").prop("checked")
                            },
                            "Price": {
                                "Name": "price",
                                "IsVisible": $("#cbFiyat").prop("checked")
                            },
                            "Brand": {
                                "Name": "brand",
                                "IsVisible": $("#cbMarka").prop("checked")
                            },
                            "MoSales": {
                                "Name": "mosales",
                                "IsVisible": $("#cbMoSales").prop("checked")
                            },
                            "Category": {
                                "Name": "category",
                                "IsVisible": $("#cbKategori").prop("checked")
                            },
                            "TotalReviews": {
                                "Name": "totalreviews",
                                "IsVisible": $("#cbReviewSayisi").prop("checked")
                            },
                            "DateFirstAvailable": {
                                "Name": "datefirstavailable",
                                "IsVisible": $("#cbIlkKullanilabilirTarih").prop("checked")
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
                                ShowError(response?.response?.userMessage);
                            }
                            quickAnalysis.ShowSpinner(false);
                            $("#saveCustomizeView").removeClass("disabled");
                        })
                    });
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                }
            })
        });

        $(".mysys").on("click", "#btnMaximize", function () {
            if ($(".ms-modal-dialog").hasClass("ms-modal-fullscreen")) {
                $(".ms-modal-dialog").removeClass("ms-modal-fullscreen");
                $(this).html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrows-fullscreen" viewBox="0 0 16 16">' +
                    '<path fill-rule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z"/>' +
                    '</svg>');
                $(".ms-modal-body").removeClass("ms-overflow-hidden");

                $("#agGridContainer").css({ "height": "550px", "max-height": "550px" });
            } else {
                $(".ms-modal-dialog").addClass("ms-modal-fullscreen");
                $(this).html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fullscreen-exit" viewBox="0 0 16 16">' +
                    '<path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5zM0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zm10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4z"/>' +
                    '</svg>');
                $(".ms-modal-body").addClass("ms-overflow-hidden");
                let height = $(".ms-modal-body").height() - $("#infoPanel").height();

                $("#agGridContainer").css({ "height": height - 30, "max-height": height - 30 })
            }
        });
    },
    GetCustomizeViewSettings: function () {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['userSettings'], function (result) {
                if (result.userSettings) {
                    if (typeof result.userSettings == "string") {
                        result.userSettings = JSON.parse(result.userSettings);
                    }
                }

                resolve(result.userSettings?.QuickAnalysis?.CustomizeView);
            });
        });
    },
    ApplySettings: async function () {
        try {

            let customizeViewSets = await quickAnalysis.GetCustomizeViewSettings();

            if (customizeViewSets) {
                for (const cvset of Object.entries(customizeViewSets)) {
                    $("#customizeViewPanel [data-field-name='" + cvset[1].Name + "']").prop("checked", cvset[1].IsVisible);
                }
            }
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    SetProductToGrid: async function (product) {
        try {
            if (product?.Barcode) {

                let selectedDomain = arbcommon.GetSelectedDomain();

                let amzProductInfo = await quickAnalysis.GetProductInfoByBarcode(product.Barcode, selectedDomain);

                if (amzProductInfo && amzProductInfo?.length > 0) {
                    for (let index = 0; index < amzProductInfo.length; index++) {
                        const barcodeFoundProduct = amzProductInfo[index];

                        if (!quickAnalysis.GetRowNodeByASIN(barcodeFoundProduct.ASIN)) {

                            let currencyRate = Number($("#currencyRate").val());
                            let localPriceConverted = (product.Price / currencyRate).toFixed(2);
                            let amzCurrency = $("#fromCurrency").text();
                            // barcodeFoundProduct.Price = barcodeFoundProduct.Price.split("(")[0].replaceAll("€", "").replaceAll("$", "").replaceAll("£", "").trim();

                            let hostname = window.location.hostname.replace("www.", "").split(".")[0];

                            let price = 0, priceDifference = 0;

                            price = barcodeFoundProduct.Price;
                            priceDifference = price - common.ConvertPriceToNumber(localPriceConverted);

                            let row = {
                                asin: barcodeFoundProduct.ASIN,
                                title: `<div class='ms-d-flex ms-mb-2 ms-align-items-center'><img src='${barcodeFoundProduct.ImageUrl}' alt='${barcodeFoundProduct.Title}' class='pointer show-popup-thumb ms-product-thumb ms-me-2'><a class='ms-link-dark-1 ms-text-decoration-none amazonTitle' target='_blank' href='${barcodeFoundProduct.DetailPageURL}'>${barcodeFoundProduct.Title}</a></div>
                                            <div class='ms-d-flex ms-align-items-center'><img src='${product.Image}' class='pointer show-popup-thumb ms-product-thumb ms-me-2'><a class='ms-link-orange ms-text-decoration-none localTitle' target='_blank' href='${product.ProductUrl}'>${product.Title}</a></div>`,
                                asinBarcode: `<div class="ms-text-dark">${barcodeFoundProduct.ASIN}</div>
                                            <div class="ms-text-orange barcode">${product.Barcode}</div>`,
                                bsr: barcodeFoundProduct.BSR > 0 ? barcodeFoundProduct.BSR : "N/A",
                                top: barcodeFoundProduct.Top > 0 ? common.RoundToTwo(barcodeFoundProduct.Top) : "N/A",
                                price: `<div class="ms-text-end ms-text-dark">Amazon:&nbsp;<span class="amazonPrice">${amzCurrency} ${price}</span></div><div class="ms-text-end ms-text-orange"><span class="ms-text-capitalize hostname">${hostname}</span>:&nbsp;<span class="localPrice">${amzCurrency} ${localPriceConverted}</span></div>${!isNaN(priceDifference) ? ("<div class='ms-text-end " + (priceDifference >= 0 ? "ms-text-primary" : "ms-text-danger") + " ms-fw-bold'>" + (qaLang == "tr" ? "Fark" : "Difference") + ":&nbsp;<span class='priceDiff'>" + amzCurrency + " " + (priceDifference).toFixed(2) + "</span></div>") : ""}`,
                                brand: barcodeFoundProduct.Brand,
                                mosales: barcodeFoundProduct.MonthlySales > 0 ? barcodeFoundProduct.MonthlySales : "N/A",
                                category: barcodeFoundProduct.Category,
                                totalreviews: barcodeFoundProduct.TotalReviews && barcodeFoundProduct.TotalReviews != "" ? barcodeFoundProduct.TotalReviews : "N/A",
                                datefirstavailable: ""
                            }

                            await quickAnalysis.SetDataToGrid(row);

                            crwcommon.GetCrawledBasicInfo(barcodeFoundProduct.ASIN, selectedDomain).then(async crawledProductInfo => {
                                try {
                                    let rowNode = quickAnalysis.GetRowNodeByASIN(barcodeFoundProduct.ASIN);

                                    if (rowNode?.data) {
                                        let rowData = rowNode.data;

                                        if (rowNode.bsr == "N/A") {
                                            rowData.bsr = crawledProductInfo?.bsr ?? "N/A";
                                        }

                                        // rowData.brand = crawledProductInfo?.brand ?? "N/A";
                                        // rowData.category = crawledProductInfo?.category ?? "N/A";

                                        rowData.datefirstavailable = crawledProductInfo?.dateFirstAvailable && crawledProductInfo?.dateFirstAvailable != "" ? crawledProductInfo.dateFirstAvailable.trim() : "N/A";

                                        if ((!price || isNaN(price) || price <= 0) && crawledProductInfo?.price && crawledProductInfo?.price != null) {
                                            price = crawledProductInfo?.price;
                                            priceDifference = price - common.ConvertPriceToNumber(localPriceConverted);
                                            rowData.price = `<div class="ms-text-end ms-text-dark">Amazon:&nbsp;<span class="amazonPrice">${amzCurrency} ${price}</span></div><div class="ms-text-end ms-text-orange"><span class="ms-text-capitalize">${hostname}</span>:&nbsp;<span class="localPrice">${amzCurrency} ${localPriceConverted}</span></div>${!isNaN(priceDifference) ? ("<div class='ms-text-end " + (priceDifference >= 0 ? "ms-text-primary" : "ms-text-danger") + " ms-fw-bold'>Fark:&nbsp;<span class='priceDiff'>" + amzCurrency + " " + (priceDifference).toFixed(2) + "</span></div>") : ""}`;
                                        }

                                        if (!barcodeFoundProduct.TotalReviews || barcodeFoundProduct.TotalReviews == "") {
                                            let totalReviews = await crwcommon.GetReviewCount(barcodeFoundProduct.ASIN, selectedDomain);
                                            if (totalReviews > 0) {
                                                rowData.totalreviews = totalReviews;
                                            }
                                        }

                                        // if (crawledProductInfo?.bsr && crawledProductInfo?.bsr != "N/A" &&
                                        //     crawledProductInfo?.category && crawledProductInfo?.category != "N/A") {
                                        //     try {
                                        //         let qvData = await common.GetQuickViewData(common.ConvertToNumber(crawledProductInfo?.bsr, selectedDomain), crawledProductInfo?.category, selectedDomain);

                                        //         if (qvData) {
                                        //             if (qvData.ESTIMATED_SALES > 0) {
                                        //                 rowData.mosales = common.FormatNumber(qvData.ESTIMATED_SALES);
                                        //             } else {
                                        //                 rowData.mosales = "N/A";
                                        //             }
                                        //             if (qvData.TOP > 0) {
                                        //                 rowData.top = qvData.TOP != 0 ? common.RoundToTwo(qvData.TOP) : "N/A"
                                        //             } else {
                                        //                 rowData.top = "N/A";
                                        //             }
                                        //         } else {
                                        //             rowData.top = "N/A";
                                        //             rowData.mosales = "N/A";
                                        //         }
                                        //     } catch (error) {
                                        //         errorHandler.SendErrorToAdmin(error);
                                        //     }
                                        // } else {
                                        //     rowData.mosales = "N/A";
                                        //     rowData.top = "N/A";
                                        // }

                                        await quickAnalysis.UpdateDataOnGrid(rowData);
                                    }
                                } catch (error) {
                                    errorHandler.SendErrorToAdmin(error)
                                }

                            }).catch(err => errorHandler.SendErrorToAdmin(err));

                            return true;
                        }
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch (error) {
            if (error.indexOf("Failed to fetch") > -1) {
                if (qaLang == "tr") {
                    toast.ShowWarning("Bu bilgisayarda Amazon API üzerinden yapılan bazı sorgulardan cevap alınamıyor.<br>" +
                        "Bu durum genelde, kullandığınız antivirüs programı, güvenlik duvarı ya da reklam engelleyici yazılımların ayarları ile ilgilidir.<br>" +
                        "Bu tür uygulamalar kullanıyorsanız test için bu uygulamaları kapatmayı deneyin ya da Amazon linklerine engellemeleri kaldırıp tekrardan çalıştırmayı deneyiniz.", "Uyarı");
                } else {
                    toast.ShowWarning("Some queries made via the Amazon API on this computer cannot be answered.<br>" +
                        "This is usually related to the settings of the antivirus program, firewall or ad-blocking software you are using.<br>" +
                        "If you are using such applications, try to close these applications for testing or try to unblock Amazon links and run them again.");
                }
            } else {
                errorHandler.SendErrorToAdmin(error);
            }
            return false;
        }
    },
    ResetModal: function () {
        document.getElementById("agGridContainer").innerHTML = "";
        document.getElementById("foundBarcodeCount").innerHTML = "0";
        document.getElementById("foundAmazonProductCount").innerHTML = "0";
        document.getElementById("targetCountry").innerHTML = "";
        document.getElementById("fromCurrency").innerHTML = "";
        document.getElementById("toCurrency").innerHTML = "";
        document.getElementById("currencyRateSpan").innerHTML = "";
        document.getElementById("currencyRate").value = "";
        document.getElementById("qaCurrPage").innerHTML = "1";
    },
    SetGridHeight: function () {
        $("#qaModal #agGridContainer").css("height", (parseInt($("#qaModal .ms-modal-body").css("height")) - parseInt($("#qaModal #infoPanel").css("height")) - 10) + "px");
        $("#qaModal #agGridContainer").css("max-height", (parseInt($("#qaModal .ms-modal-body").css("height")) - parseInt($("#qaModal #infoPanel").css("height")) - 10) + "px");
    },
    SetSearchingStatus: function (statusHTML) {
        $("#searchingStatusDiv").removeClass("ms-d-none");
        $("#searchingStatus").html(statusHTML);
    },
    GetSearchingTextHTML: function (pageNo, productIndex) {
        if (qaLang == "tr") {
            return `<span class="ms-fw-bold" id="qaProcessingPage">${pageNo}</span><b>.</b> sayfada <span id="qaCurrentProcessingProd" class="ms-fw-bold">${productIndex}</span><b>.</b> ürün inceleniyor...`;
        } else {
            return `Reviewing <span id="qaCurrentProcessingProd" class="ms-fw-bold">${productIndex}</span><b>.</b> product on page <span class="ms-fw-bold" id="qaProcessingPage">${pageNo}</span>.`;
        }
    },
    GetRowCount: function () {
        return qaGridOptions?.api?.getDisplayedRowCount() ?? 0;
    },
    SetDataToGrid: async function (rowData) {
        let rows = [];
        rows.push(rowData)
        await qaGridOptions.api.applyTransactionAsync({ add: rows })
        await qaGridOptions.api.flushAsyncTransactions();
    },
    UpdateDataOnGrid: async function (rowData) {
        let rows = [];
        rows.push(rowData)
        await qaGridOptions.api.applyTransactionAsync({ update: rows })
        await qaGridOptions.api.flushAsyncTransactions();
    },
    GetRowNodeByASIN: function (ASIN) {
        return qaGridOptions.api.getRowNode(ASIN);
    },
    SetFoundTotalBarcodeCount: function (barcodeCount) {
        $("#foundBarcodeCount").text(barcodeCount)
    },
    GetFoundTotalBarcodeCount: function () {
        if (!isNaN($("#foundBarcodeCount").text())) {
            return Number($("#foundBarcodeCount").text());
        }

        return 0;
    },
    ShowSpinner: function (show = true) {
        if (show) {
            qaGridOptions?.api.showLoadingOverlay();
        } else {
            qaGridOptions?.api.hideOverlay();
        }
    },
    IsSpinnerVisible: function () {
        return $("#qaModalSpinner").length > 0;
    },
    DisableLoadMoreButton: function (disable = true) {
        if (disable) {
            $("#qaLoadMore").addClass("disabled");
        } else {
            $("#qaLoadMore").removeClass("disabled");
        }
    },
    IsFakeDataSet: function () {
        return this.GetRowNodeByASIN(fakeText) != null;
    },
    SetFakeData: async function () {
        let imgUrl = chrome.runtime.getURL("images/icons/icon48.png");
        let count = Math.floor(Math.random() * 2) + 1;

        if ($(".mysys-hidden-data").length == 0) {
            for (let index = 0; index < count; index++) {
                let row = {
                    asin: `${fakeText}`,
                    title: `<div class='ms-d-flex ms-mb-2 ms-align-items-center filter-blur-3'><img src='${imgUrl}' class='ms-product-thumb ms-me-2 filter-blur-6'><span class='ms-text-dark ms-text-decoration-none'>${fakeText}</span></div>
                            <div class='ms-d-flex ms-align-items-center filter-blur-3'><img src='${imgUrl}' class='ms-product-thumb ms-me-2 filter-blur-6'><span class='ms-text-orange ms-text-decoration-none'>${fakeText}</span></div>`,
                    asinBarcode: `<div class="ms-text-dark filter-blur-3">${fakeText}</div>
                            <div class="ms-text-orange filter-blur-3">${fakeText}</div>`,
                    bsr: "<span class='filter-blur-3'>00000</span>",
                    top: "<span class='filter-blur-3'>00000</span>",
                    price: `<div class="ms-text-end ms-text-dark filter-blur-3">Amazon: 00000</div><div class="ms-text-end ms-text-orange filter-blur-3"><span class="ms-text-capitalize filter-blur-3">PREMIUM</span>: 00000</div><div class='ms-text-end ms-text-primary ms-fw-bold filter-blur-3'>${qaLang == "tr" ? "Fark" : "Difference"}: 00000</div>`,
                    brand: `<span class='filter-blur-3'>${fakeText}</span>`,
                    mosales: "<span class='filter-blur-3'>00000</span>",
                    category: `<span class='filter-blur-3'>${fakeText}</span>`,
                    totalreviews: "<span class='filter-blur-3'>00000</span>",
                    datefirstavailable: `<span class='filter-blur-3'>${fakeText}</span>`,
                }

                await quickAnalysis.SetDataToGrid(row);
            }
        }
    },
    ConfigureAGGrid: async function () {
        try {
            let hostname = window.location.hostname.replace("www.", "").split(".")[0];
            let customizeViewSets = await quickAnalysis.GetCustomizeViewSettings();

            let numberFormatDomain = common.GetDomainBySelectedLanguage();

            let columnDefs = [
                {
                    headerName: "",
                    field: "asin",
                    hide: true
                },
                {
                    headerName: (qaLang == "tr" ? "Amazon Ürün Başlığı / Lokal Ürün Başlığı" : "Amazon Product Title / Local Product Title"),
                    field: "title",
                    cellRenderer: 'defaultRenderer',
                    cellClass: ['ms-d-flex', 'ms-align-items-center'],
                    width: 300,
                    hide: customizeViewSets?.Title?.IsVisible == false,
                    sortable: false
                },
                {
                    headerName: (qaLang == "tr" ? "ASIN/Barkod" : "ASIN/Barcode"),
                    field: "asinBarcode",
                    cellClass: ['ms-d-flex', 'ms-align-items-center'],
                    cellRenderer: 'defaultRenderer',
                    width: 120,
                    hide: customizeViewSets?.ASIN?.IsVisible == false,
                    sortable: false
                },
                {
                    headerName: "BSR", field: "bsr",
                    type: 'numericColumn',
                    cellRenderer: 'defaultRenderer',
                    cellClass: ['ms-d-flex', 'ms-align-items-center', 'ms-justify-content-end'],
                    width: 77,
                    hide: customizeViewSets?.BSR?.IsVisible == false,
                    comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                        return common.GridNumberColumnComparer(valueA, valueB, numberFormatDomain);
                    }
                },
                {
                    headerName: "TOP %", field: "top",
                    type: 'numericColumn',
                    cellRenderer: 'defaultRenderer',
                    cellClass: ['ms-d-flex', 'ms-align-items-center', 'ms-justify-content-end'],
                    width: 75,
                    hide: customizeViewSets?.Top?.IsVisible == false,
                    comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                        return common.GridNumberColumnComparer(valueA, valueB, numberFormatDomain);
                    }
                },
                {
                    headerName: (qaLang == "tr" ? "Fiyat" : "Price"),
                    field: "price",
                    cellRenderer: 'defaultRenderer',
                    cellClass: ['ms-d-flex', 'ms-align-items-center', 'ms-justify-content-end'],
                    type: 'numericColumn',
                    width: 155,
                    hide: customizeViewSets?.Price?.IsVisible == false,
                    sortable: false
                },
                {
                    headerName: (qaLang == "tr" ? "Aylık Satış" : "Mo. Sales"),
                    field: "mosales",
                    type: 'numericColumn',
                    cellClass: ['ms-d-flex', 'ms-align-items-center', 'ms-justify-content-end'],
                    cellRenderer: 'defaultRenderer',
                    width: 100,
                    hide: customizeViewSets?.MoSales?.IsVisible == false,
                    comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                        return common.GridNumberColumnComparer(valueA, valueB, numberFormatDomain);
                    }
                },
                {
                    headerName: (qaLang == "tr" ? "Marka" : "Brand"),
                    field: "brand",
                    cellRenderer: 'defaultRenderer',
                    cellClass: ['ms-d-flex', 'ms-align-items-center'],
                    width: 130,
                    hide: customizeViewSets?.Brand?.IsVisible == false
                },
                {
                    headerName: (qaLang == "tr" ? "Kategori" : "Category"),
                    field: "category",
                    cellClass: ['ms-d-flex', 'ms-align-items-center'],
                    cellRenderer: 'defaultRenderer',
                    width: 130,
                    hide: customizeViewSets?.Category?.IsVisible == false
                },
                {
                    headerName: (qaLang == "tr" ? "Review Sayısı" : "Review Count"),
                    field: "totalreviews",
                    type: 'numericColumn',
                    cellRenderer: 'defaultRenderer',
                    cellClass: ['ms-d-flex', 'ms-align-items-center', 'ms-justify-content-end'],
                    width: 105,
                    hide: customizeViewSets?.TotalReviews?.IsVisible == false,
                    comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                        return common.GridNumberColumnComparer(valueA, valueB, numberFormatDomain);
                    }
                },
                {
                    headerName: (qaLang == "tr" ? "İlk Kullanılabilir Tarih" : "Date First Available"),
                    field: "datefirstavailable",
                    cellRenderer: 'defaultRenderer',
                    cellClass: ['ms-d-flex', 'ms-align-items-center'],
                    width: 130,
                    hide: customizeViewSets?.DateFirstAvailable?.IsVisible == false,
                    sortable: false
                }
            ];

            let overlayNoRowsTemplate = "";

            if (qaLang == "tr") {
                overlayNoRowsTemplate = `Yoğun istekte bulunduğunuz için şu anda&nbsp;${hostname || window.location.hostname}&nbsp;sayfası cevap veremiyor. Lütfen daha sonra tekrar deneyin.`;
            } else {
                overlayNoRowsTemplate = `Because of your high request, the ${hostname || window.location.hostname} page is not able to respond at the moment. Please try again later.`;
            }

            qaGridOptions = {
                enableFilter: false,
                rowHeight: 80,
                defaultColDef: {
                    sortable: true,
                    filter: false,
                    resizable: true,
                },
                columnDefs: columnDefs,
                components: {
                    defaultRenderer: (param) => {
                        return param.value;
                    }
                },
                rowData: null,
                rowBuffer: 9999,
                animateRows: true,
                suppressColumnVirtualisation: true,
                enableCellChangeFlash: true,
                overlayLoadingTemplate: `<div><div id="qaModalSpinner" class="ms-spinner-border" role="status"></div><div class="ms-mt-2">${qaLang == "tr" ? "Yükleniyor..." : "Loading..."}</div></div>`,
                overlayNoRowsTemplate: `<div class="ms-alert ms-alert-warning">${overlayNoRowsTemplate}</div>`,
                getRowNodeId: function (data) {
                    return data.asin;
                },
            };

            var eGridDiv = document.getElementById('agGridContainer');
            if (eGridDiv) {
                eGridDiv.innerHTML = "";
                new agGrid.Grid(eGridDiv, qaGridOptions);
            }
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    }
}
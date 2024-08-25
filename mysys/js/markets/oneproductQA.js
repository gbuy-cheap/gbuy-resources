"use strict";
var qaGridOptions;
var qaLang;
var oneproductQA = {
    Init: async function (parentElem = "body", product, lang = "tr", localCurrencyCode = "TRY") {
        try {

            // disabled temporarly

            // qaLang = lang;
            // $(parentElem).prepend(extContent.CommonModal());

            // $(document).on("shown.bs.modal", "#commonModal", function () {
            //     if (qaGridOptions) {
            //         qaGridOptions.api.sizeColumnsToFit();
            //     }
            // })

            // let currencyFromArr = ["USD", "GBP", "EUR", "CAD"];
            // let currencyResult = await common.GetCurrencyRates(currencyFromArr, localCurrencyCode);

            // if (currencyResult) {
            //     currencyResult = common.ConvertToJSON(currencyResult);
            // }

            // $("#commonModal .ms-modal-body").prepend(this.GetGridPanel(product, currencyResult, localCurrencyCode));

            // await this.ConfigureAGGrid();

            // await this.SetProductDataToGrid(product.Barcode, product.Price);

            // $("body").prepend('<div class="ms-shadow ms-d-none ms-popover"><img class="ms-w-100"></div>');

        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    GetGridPanel: function (product, currencyResult, localCurrencyCode) {
        let currencyHtml;
        if (qaLang == "tr") {
            currencyHtml = '<span class="ms-border ms-ms-4 ms-p-2"><b class="ms-text-primary">Döviz Kuru</b>';
        } else {
            currencyHtml = '<span class="ms-border ms-ms-4 ms-p-2"><b class="ms-text-primary">Exchange Rate</b>';
        }

        let localCurrencySymbol = common.GetCurrencySymbolByCode(localCurrencyCode);
        if (currencyResult?.length > 0) {
            for (let index = 0; index < currencyResult.length; index++) {
                const element = currencyResult[index];
                if (localCurrencyCode != element.From) {
                    currencyHtml += `<span class="ms-ms-4"><b>${element.From}:</b>&nbsp;${common.FormatNumber(element.Rate.toFixed(2), "com.tr")}&nbsp;${localCurrencySymbol}<input type='hidden' id='curr${element.From}' value='${element.Rate}'></span>`;
                } else {
                    currencyHtml += `<span class="ms-ms-4 ms-d-none"><b>${element.From}:</b>&nbsp;${common.FormatNumber(element.Rate.toFixed(2), "com.tr")}&nbsp;${localCurrencySymbol}<input type='hidden' id='curr${element.From}' value='${element.Rate}'></span>`;
                }
            }
        }

        let gridPanel = `<div id="oneProductQAGridPanel" class="ms-row ms-mx-0 ms-px-1 ms-pt-2">
        <div class="ms-col-6">
        <div>
        <b>${qaLang == "tr" ? "Barkod" : "Barcode"}:</b> <span id="opQABarkod">${product.Barcode}</span>
        </div>
        <div>
        <b>${qaLang == "tr" ? "Ürün Adı" : "Product Title"}:</b> <span id="opQAProdName">${product.Title}</span>
        </div>
        </div>
        <div class="ms-col-6 ms-d-flex ms-align-items-end ms-justify-content-end">
        ${currencyHtml}          
        </div>
        </div>
        <div class="ag-theme-balham ms-p-3" id="agGridContainer" style="height: 620px; max-height: 682px;"></div>`;

        return gridPanel;
    },
    RemoveGridPanel: function () {
        document.getElementById("oneProductQAGridPanel")?.remove();
    },
    SetProductDataToGrid: async function (barcode, localPrice) {
        if (barcode) {

            let countries;

            if (qaLang == "tr") {
                countries = [
                    ["na", "US", "ABD", "com"],
                    ["na", "CA", "Kanada", "ca"],
                    ["eu", "DE", "Almanya", "de"],
                    ["eu", "FR", "Fransa", "fr"],
                    ["eu", "GB", "İngiltere", "co.uk"],
                    ["eu", "IT", "İtalya", "it"],
                    ["eu", "ES", "İspanya", "es"],
                ];
            } else {
                countries = [
                    ["na", "US", "USA", "com"],
                    ["na", "CA", "Canada", "ca"],
                    ["eu", "DE", "Germany", "de"],
                    ["eu", "FR", "France", "fr"],
                    ["eu", "GB", "United Kingdom", "co.uk"],
                    ["eu", "IT", "Italy", "it"],
                    ["eu", "ES", "Spain", "es"],
                ];
            }

            for (let i = 0; i < countries.length; i++) {
                try {
                    await common.Sleep(1000);
                    let amzProductInfo = await common.GetProductInfoFromAmazonByBarcode(barcode, countries[i][0], countries[i][1]);
                    if (amzProductInfo?.results && amzProductInfo?.results[0]) {

                        for (let index = 0; index < amzProductInfo.results.length; index++) {
                            const barcodeFoundProduct = amzProductInfo.results[index];
                            barcodeFoundProduct.Price = barcodeFoundProduct.Price.split("(")[0].replaceAll("€", "").replaceAll("$", "").replaceAll("£", "").trim();
                            let currency = common.GetCurrencySymbol(countries[i][3]);

                            let floatPrice = common.ConvertPriceToNumber(barcodeFoundProduct.Price);

                            let row = {
                                id: barcodeFoundProduct.ASIN + "_" + countries[i][1],
                                domain: countries[i][3],
                                country: `<div class='ms-d-flex ms-mb-2 ms-align-items-center'><img src='${oneproductQA.GetFlagByCountryCode(countries[i][1])}' class='ms-product-thumb ms-me-2'>${countries[i][2]}</div>`,
                                title: `<div class='ms-d-flex ms-mb-2 ms-align-items-center'><img src='${barcodeFoundProduct.ImageUrl}' class='pointer show-popup-thumb ms-product-thumb ms-me-2'><a class='ms-link-dark-1 ms-text-decoration-none' target='_blank' href='${barcodeFoundProduct.DetailPageURL}'>${barcodeFoundProduct.Title}</a></div>`,
                                asin: `<div class="ms-text-dark">${barcodeFoundProduct.ASIN}</div>`,
                                bsr: "",
                                top: "",
                                price: `<div class="ms-text-end ms-text-dark">${floatPrice ? currency + "&nbsp;" + floatPrice.toFixed(2) : "N/A"}</div>`,
                                localPrice: '',
                                priceDiff: '',
                                brand: "",
                                mosales: "",
                                category: "",
                                totalreviews: barcodeFoundProduct.TotalReviews && barcodeFoundProduct.TotalReviews != "" ? barcodeFoundProduct.TotalReviews : "N/A",
                                datefirstavailable: ""
                            }

                            await oneproductQA.SetDataToGrid(row);

                            crwcommon.GetCrawledBasicInfo(barcodeFoundProduct.ASIN, countries[i][3]).then(async crawledProductInfo => {
                                let rowNode = oneproductQA.GetRowNodeById(barcodeFoundProduct.ASIN + "_" + countries[i][1]);

                                if (rowNode && rowNode?.data) {
                                    let rowData = rowNode.data;

                                    if (crawledProductInfo?.bsr && crawledProductInfo?.bsr != "N/A") {
                                        rowData.bsr = crawledProductInfo.bsr;
                                    } else {
                                        rowData.bsr = "N/A";
                                    }

                                    if (crawledProductInfo?.brand && crawledProductInfo?.brand != "N/A") {
                                        rowData.brand = crawledProductInfo.brand.replaceAll("\n", "").trim();
                                    } else {
                                        rowData.brand = "N/A";
                                    }

                                    if (crawledProductInfo?.category && crawledProductInfo?.category != "N/A") {
                                        rowData.category = crawledProductInfo.category;
                                    } else {
                                        rowData.category = "N/A";
                                    }

                                    if (crawledProductInfo?.dateFirstAvailable && crawledProductInfo?.dateFirstAvailable != "" &&
                                        crawledProductInfo?.dateFirstAvailable != "") {
                                        rowData.datefirstavailable = crawledProductInfo?.dateFirstAvailable.replaceAll("\n", "").trim();
                                    } else {
                                        rowData.datefirstavailable = "N/A";
                                    }

                                    if ((!floatPrice || isNaN(floatPrice) || floatPrice == 0) && crawledProductInfo?.price && crawledProductInfo?.price != null) {
                                        rowData.price = `<div class="ms-text-end ms-text-dark">${currency} ${crawledProductInfo.price}</div>`;
                                        floatPrice = common.ConvertPriceToNumber(crawledProductInfo.price);
                                    }

                                    let priceDiff = 0, localPriceConverted = 0;
                                    if (rowData.domain == "com") {
                                        localPriceConverted = localPrice / oneproductQA.GetCurrencyRateFromModal("USD");
                                    } else if (rowData.domain == "ca") {
                                        localPriceConverted = localPrice / oneproductQA.GetCurrencyRateFromModal("CAD");
                                    } else if (rowData.domain == "de" || rowData.domain == "fr" || rowData.domain == "it" ||
                                        rowData.domain == "es") {
                                        localPriceConverted = localPrice / oneproductQA.GetCurrencyRateFromModal("EUR");
                                    } else if (rowData.domain == "co.uk") {
                                        localPriceConverted = localPrice / oneproductQA.GetCurrencyRateFromModal("GBP");
                                    }

                                    rowData.localPrice = `<div class="ms-text-end ms-text-dark">${currency}&nbsp;${localPriceConverted.toFixed(2)}</div>`;
                                    if (floatPrice && !isNaN(floatPrice) && floatPrice != 0) {
                                        priceDiff = floatPrice - localPriceConverted;
                                        rowData.priceDiff = `<div class="ms-text-end ${priceDiff < 0 ? "ms-text-danger" : "ms-text-primary"}">${currency}&nbsp;${priceDiff.toFixed(2)}</div>`;
                                    } else {
                                        rowData.priceDiff = `<div class="ms-text-end">N/A</div>`;
                                    }

                                    if (crawledProductInfo?.bsr && crawledProductInfo?.bsr != "N/A" &&
                                        crawledProductInfo?.category && crawledProductInfo?.category != "N/A") {
                                        try {
                                            let qvData = await common.GetQuickViewData(common.ConvertToNumber(crawledProductInfo?.bsr, countries[i][3]), crawledProductInfo?.category, countries[i][3]);

                                            if (qvData) {
                                                if (qvData.ESTIMATED_SALES > 0) {
                                                    rowData.mosales = common.FormatNumber(qvData.ESTIMATED_SALES);
                                                } else {
                                                    rowData.mosales = "N/A";
                                                }
                                                if (qvData.TOP > 0) {
                                                    rowData.top = qvData.TOP != 0 ? common.RoundToTwo(qvData.TOP) : "N/A"
                                                } else {
                                                    rowData.top = "N/A";
                                                }
                                            } else {
                                                rowData.top = "N/A";
                                                rowData.mosales = "N/A";

                                                let userInfo = common.GetUserInfoFromSessionStorage();

                                                if (userInfo?.UserType != "Premium") {
                                                    isUserPremium = false;
                                                    let premiumLink = await common.GetPremiumLink(token);
                                                    if (qaLang == "tr") {
                                                        premiumWarningHTML = `<span style="font-size:1rem">Limitsiz sorgulama yapmak için&nbsp;<a href="${premiumLink}" class="ms-d-inline" target="_blank" style="font-size:1rem">Premium Üyelik</a>&nbsp;satın alın.</span>`;
                                                        $("#modalUserMessage").html(`<div style="font-size:1rem">${common.WarningIcon("ms-text-warning blink ms-me-2")}Aylık satış miktarı sorgulama limitini aştınız.&nbsp;${premiumWarningHTML}</div>`);
                                                    } else {
                                                        premiumWarningHTML = `<span style="font-size:1rem">Purchase <a href="${premiumLink}" class="ms-d-inline" target="_blank" style="font-size:1rem">Premium Membership</a> to make unlimited searches.</span>`;
                                                        $("#modalUserMessage").html(`<div style="font-size:1rem">${common.WarningIcon("ms-text-warning blink ms-me-2")}You have exceeded the monthly sales amount search limit.&nbsp;${premiumWarningHTML}</div>`);
                                                    }

                                                    $("#modalUserMessage").removeClass("ms-d-none");
                                                }
                                            }
                                        } catch (error) {
                                            errorHandler.SendErrorToAdmin(error);
                                        }
                                    } else {
                                        rowData.mosales = "N/A";
                                        rowData.top = "N/A";
                                    }

                                    await oneproductQA.UpdateDataOnGrid(rowData);
                                }

                            }).catch(err => errorHandler.SendErrorToAdmin(err));

                        }
                    }
                } catch (err) {
                    errorHandler.SendErrorToAdmin(err);
                }
            }

            if (oneproductQA.GetRowCount() == 0) {
                oneproductQA.ShowNoRowsOverlay();
            }
        }
    },
    GetCurrencyRateFromModal: function (currency) {
        return common.ConvertToNumber($("#curr" + currency).val(), "com");
    },
    GetRowCount: function () {
        return qaGridOptions?.api?.getDisplayedRowCount() ?? 0;
    },
    ShowNoRowsOverlay: function () {
        qaGridOptions?.api.showNoRowsOverlay();
    },
    GetFlagByCountryCode: function (countryCode) {
        switch (countryCode) {
            case "US":
                return chrome.runtime.getURL("images/flags/usa.svg");
            case "CA":
                return chrome.runtime.getURL("images/flags/can.svg");
            case "DE":
                return chrome.runtime.getURL("images/flags/deu.svg");
            case "ES":
                return chrome.runtime.getURL("images/flags/esp.svg");
            case "FR":
                return chrome.runtime.getURL("images/flags/fra.svg");
            case "IT":
                return chrome.runtime.getURL("images/flags/ita.svg");
            case "GB":
                return chrome.runtime.getURL("images/flags/gbr.svg");
        }
    },
    GetRowNodeById: function (Id) {
        return qaGridOptions.api.getRowNode(Id);
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
    ConfigureAGGrid: async function () {
        try {

            let numberFormatDomain = common.GetDomainBySelectedLanguage();

            let columnDefs = [
                {
                    headerName: "",
                    field: "id",
                    hide: true
                },
                {
                    headerName: "",
                    field: "domain",
                    hide: true
                },
                {
                    headerName: (qaLang == "tr" ? "Ülke" : "Country"),
                    field: "country",
                    cellClass: ['ms-d-flex', 'ms-align-items-center'],
                    cellRenderer: 'defaultRenderer',
                    width: 120
                },
                {
                    headerName: (qaLang == "tr" ? "Amazon Ürün Başlığı" : "Product Title"),
                    field: "title",
                    cellRenderer: 'defaultRenderer',
                    cellClass: ['ms-d-flex', 'ms-align-items-center'],
                    width: 300,
                },
                {
                    headerName: "ASIN", field: "asin",
                    cellClass: ['ms-d-flex', 'ms-align-items-center'],
                    cellRenderer: 'defaultRenderer',
                    width: 120,
                    comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                        valueA = valueA.indexOf('</a>') < 0 ? valueA : valueA.split('</a>')[0]?.split('">')[1]?.trim();
                        valueB = valueB.indexOf('</a>') < 0 ? valueB : valueB.split('</a>')[0]?.split('">')[1]?.trim();

                        if (valueA == valueB) {
                            return 0;
                        }
                        return (valueA > valueB) ? 1 : -1;
                    },
                },
                {
                    headerName: "BSR", field: "bsr",
                    type: 'numericColumn',
                    cellRenderer: 'defaultRenderer',
                    cellClass: ['ms-d-flex', 'ms-align-items-center', 'ms-justify-content-end'],
                    width: 77,
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
                    comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                        return common.GridNumberColumnComparer(valueA, valueB, numberFormatDomain);
                    }
                },
                {
                    headerName: (qaLang == "tr" ? "Amazon Fiyatı" : "Amazon Price"),
                    field: "price",
                    cellRenderer: 'defaultRenderer',
                    cellClass: ['ms-d-flex', 'ms-align-items-center', 'ms-justify-content-end'],
                    type: 'numericColumn',
                    width: 100,
                    comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                        valueA = common.GetNumberCharsFromString(valueA);
                        valueB = common.GetNumberCharsFromString(valueB);
                        return common.GridNumberColumnComparer(valueA, valueB, numberFormatDomain);
                    }
                },
                {
                    headerName: (qaLang == "tr" ? "Lokal Fiyat" : "Local Price"),
                    field: "localPrice",
                    cellRenderer: 'defaultRenderer',
                    cellClass: ['ms-d-flex', 'ms-align-items-center', 'ms-justify-content-end'],
                    type: 'numericColumn',
                    width: 100,
                    comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                        valueA = common.GetNumberCharsFromString(valueA);
                        valueB = common.GetNumberCharsFromString(valueB);
                        return common.GridNumberColumnComparer(valueA, valueB, numberFormatDomain);
                    }
                },
                {
                    headerName: (qaLang == "tr" ? "Fiyat Farkı" : "Price Diff"),
                    field: "priceDiff",
                    cellRenderer: 'defaultRenderer',
                    cellClass: ['ms-d-flex', 'ms-align-items-center', 'ms-justify-content-end'],
                    type: 'numericColumn',
                    width: 100,
                    comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                        valueA = common.GetNumberCharsFromString(valueA);
                        valueB = common.GetNumberCharsFromString(valueB);
                        return common.GridNumberColumnComparer(valueA, valueB, numberFormatDomain);
                    }
                },
                {
                    headerName: (qaLang == "tr" ? "Aylık Satış" : "Mo. Sales"),
                    field: "mosales",
                    type: 'numericColumn',
                    cellClass: ['ms-d-flex', 'ms-align-items-center', 'ms-justify-content-end'],
                    cellRenderer: 'defaultRenderer',
                    width: 100,
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
                },
                {
                    headerName: (qaLang == "tr" ? "Kategori" : "Category"),
                    field: "category",
                    cellClass: ['ms-d-flex', 'ms-align-items-center'],
                    cellRenderer: 'defaultRenderer',
                    width: 130,
                },
                {
                    headerName: (qaLang == "tr" ? "Review Sayısı" : "Review Count"),
                    field: "totalreviews",
                    type: 'numericColumn',
                    cellRenderer: 'defaultRenderer',
                    cellClass: ['ms-d-flex', 'ms-align-items-center', 'ms-justify-content-end'],
                    width: 105,
                    comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                        return common.GridNumberColumnComparer(valueA, valueB, numberFormatDomain);
                    }
                },
                {
                    headerName: (qaLang == "tr" ? "İlk Kullanılabilir Tarih" : "First Available Date"),
                    field: "datefirstavailable",
                    cellRenderer: 'defaultRenderer',
                    cellClass: ['ms-d-flex', 'ms-align-items-center'],
                    width: 130, sortable: false,
                }
            ];

            qaGridOptions = {
                enableFilter: false,
                rowHeight: 50,
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
                rowClass: 'ms-bg-light',
                rowData: null,
                rowBuffer: 9999,
                animateRows: true,
                suppressColumnVirtualisation: true,
                enableCellChangeFlash: true,
                overlayLoadingTemplate: `<div><div id="qaModalSpinner" class="ms-spinner-border" role="status"></div><div class="ms-mt-2">${qaLang == "tr" ? "Yükleniyor" : "Loading"}...</div></div>`,
                overlayNoRowsTemplate: `<div class="ms-alert ms-alert-warning">${qaLang == "tr" ? "Aradığınız ürün Amazon pazar yerlerinde ürün bulunamadı" : "The product you are looking for was not found in Amazon marketplaces"}.</div>`,
                getRowNodeId: function (data) {
                    return data.id;
                },
                onFirstDataRendered: function (params) {
                    params.api.sizeColumnsToFit();
                }
            };

            var eGridDiv = document.getElementById('agGridContainer');
            eGridDiv.innerHTML = "";
            new agGrid.Grid(eGridDiv, qaGridOptions);
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    }
};
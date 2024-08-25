"use strict";

let trendyol = {
    Init: async function () {
        let minMaxBtnParams = {
            Key: "ArbitragePage",
            MinWidth: "26px",
            MinHeight: "26px",
        };
        common.InitMinMaxButton(minMaxBtnParams);

        let panelHolderElement;

        if ($('.srch-rslt-cntnt').length > 0) {
            panelHolderElement = $('.srch-rslt-cntnt').eq(0);
        } else if ($("#product-detail-app").length > 0) {
            panelHolderElement = $("#product-detail-app").eq(0);
        }

        try {
            if (token) {
                if ($('.srch-rslt-cntnt').length > 0) {
                    $('.srch-rslt-cntnt').append(
                        arbcommon.GetPanelTemplate()
                    );
                    arbcommon.RemoveUAEAndTurkey();

                    $("#arbPanel").css({
                        "width": "245px",
                        "right": "1rem",
                    });

                    $("#mysysAnalysisNameInput").addClass("trendyol-font ms-bg-white ms-px-2");

                    $("#MysysGetProductsBtn button").removeClass("ms-fs-6");
                    $("#MysysGetProductsBtn button").addClass("ms-fs-5");

                    await arbcommon.SetExtraInfoToInputs();

                    quickAnalysis.Init("body", trendyol.GetProductLinks, trendyol.GetProductDetails, trendyol.GetTotalPageCount, trendyol.GetTotalProductCount);

                    $("#qaButton").removeClass("ms-fs-6");
                    $("#qaButton").addClass("ms-fs-5");

                    $(".mysys").on("click", ".MysysGetProductsBtn", async function () {
                        try {
                            if (WholesalerAuth) {
                                await arbcommon.SaveExtraInfoToStorage();
                                let totalPage = trendyol.GetTotalPageCount();

                                totalPage = totalPage > arbcommon.MaxTotalPage ? arbcommon.MaxTotalPage : totalPage;

                                var currUrl = window.location.href;

                                if ($('#mysysModal').length == 0) { $('body').after(arbmodal.GetStructure()); }

                                arbmodal.SetHeader("İşlem devam ediyor&nbsp;" + common.DotsAnimation);

                                arbmodal.SetComment("<p>İşlem başlatıldı.</p><div class='ms-text-warning ms-d-flex'><div class='col-auto ms-ps-0 ms-pe-3'>" + common.WarningIcon() +
                                    "</div>Lütfen işlem tamamlanana kadar sayfayı veya tarayıcıyı KAPATMAYINIZ.</div>");

                                arbmodal.SetComment2('<p>İşlem Yapılan Sayfa : <b> <span id="mysysTYCurrProccessingPageSpan">1</span> / ' + totalPage + '</b></p>');

                                arbmodal.Show();

                                let searchName = "";
                                if ($('#mysysAnalysisNameInput').val().length > 0) {
                                    searchName = $('#mysysAnalysisNameInput').val();
                                } else if ($("#search-app > div > div.srch-rslt-cntnt > div.srch-prdcts-cntnr > div.srch-rslt-title > div.srch-ttl-cntnr-wrppr > div > h1").length > 0) {
                                    searchName = $("#search-app > div > div.srch-rslt-cntnt > div.srch-prdcts-cntnr > div.srch-rslt-title > div.srch-ttl-cntnr-wrppr > div > h1").text().trim().toLowerCase();
                                } else {
                                    searchName = arbcommon.GenerateArbSearchName();
                                }

                                trendyol.StartCrawling(currUrl, totalPage, arbcommon.GenerateGUID(), searchName);
                            } else {
                                arbcommon.RedirectToWholesalerPage();
                            }
                        } catch (error) {
                            errorHandler.SendErrorToAdmin(error);
                        }
                    });
                } else if ($("#product-detail-app").length > 0) {
                    let productInfo = this.GetProductInfoFromHTML($("html").html());

                    if (productInfo) {
                        oneproductQA.Init("body", productInfo);

                        $("#product-detail-app").prepend(arbcommon.GetOneProductQATemplate());

                        $("#arbBarcodeComparerPanel").css("right", "2rem");
                        $("#arbBarcodeComparerPanel").css("z-index", "100");
                        $("#arbBarcodeComparerPanel button").css("cssText", "font-size:1rem!important");
                    }

                    if (productInfo?.Barcode) {
                        $(".product-price-container").after(arbcommon.GetBarcodePanel("Barkod: " + productInfo.Barcode));
                        $(".mysys-barcode").css("font-size", "1.5rem");
                    }
                }
            } else {
                $(panelHolderElement).append(
                    arbcommon.GetWarningPanelTemplate(arbcommon.SessionInvalidErrorTr())
                );
            }
        } catch (error) {
            if (typeof error?.indexOf != "function" ||
                (error?.indexOf("timed-out or invalid") == -1 && error?.indexOf("User not found") == -1)) {
                errorHandler.SendErrorToAdmin(error);
            } else {
                $(panelHolderElement).append(
                    arbcommon.GetWarningPanelTemplate(arbcommon.SessionInvalidErrorTr())
                );
            }
        }

        $("#arbWarningPanel").css({
            "width": "15%",
            "right": "1rem",
        });

        $("#mysysToast .toast-header, #mysysToast .toast-body").addClass("ms-fs-4");
    },
    StartCrawling: async function (currUrl, totalPage, processId, searchName) {
        try {
            let products = [];

            for (var i = 1; i <= totalPage; i++) {
                try {
                    if (arbcommon.CheckProductCountToBeAnalyzed(products.length)) {
                        $('#mysysTYCurrProccessingPageSpan').text(i);

                        let returnProducts = await trendyol.CrawlPage(decodeURIComponent(currUrl), i);
                        if (returnProducts?.length > 0) {
                            products.push(...returnProducts);
                        }
                    } else {
                        products = products.slice(0, arbcommon.GetProductCountToBeAnalyzed());
                        break;
                    }
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                }
            }

            let siteId = arbcommon.Sites.trendyol;

            arbcommon.PostAnalysisResult(products, siteId, processId, searchName);
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    CrawlPage: function (currUrl, pageNum) {
        return new Promise(async (resolve, reject) => {
            try {
                const pagePList = await trendyol.GetProductLinks(currUrl, pageNum);

                let productInfos = [];

                let counter = 0;

                if (pagePList?.length > 0) {
                    while (counter < pagePList.length) {
                        let productInfo = await trendyol.GetProductDetails(pagePList[counter]);
                        if (productInfo) {
                            productInfos.push(productInfo);
                        }
                        counter++;
                        if (counter == pagePList.length) {
                            resolve(productInfos);
                        }
                    }
                } else {
                    resolve(productInfos);
                }
            } catch (error) {
                reject(error);
            }
        });
    },
    GetProductLinks: function (url, pageNum) {
        return new Promise(async (resolve, reject) => {
            try {
                let productListPageHtml;
                if (url.indexOf("q=") > -1) {
                    productListPageHtml = await $.get(url + "&pi=" + pageNum);
                } else {
                    productListPageHtml = await $.get(url + "?pi=" + pageNum);
                }

                var html = $(productListPageHtml);

                var pLinkList = [];
                $('.p-card-chldrn-cntnr', html).each(function () {
                    var pLink = $(this).find("a").eq(0).attr('href');
                    pLinkList.push(pLink);
                });

                resolve(pLinkList);
            } catch (error) {
                reject(error);
            }
        });
    },
    GetProductDetails: async function (productLink) {
        let product = await arbcommon.SendRequestProductPage(trendyol.GetProductInfoFromHTML, productLink);

        return product;
    },
    GetTotalPageCount: function () {
        let totalProductCount = trendyol.GetTotalProductCount();
        let totalPage = Math.ceil(totalProductCount / 24);

        return totalPage
    },
    GetTotalProductCount: function () {
        let totalProductsStr = "1";
        if ($('.dscrptn').length > 0) {
            totalProductsStr = $(".dscrptn").text().split("için ")[1]?.split(" sonuç")[0]?.replace("+", "");
        }

        let totalProductCount = common.ConvertToNumber(totalProductsStr, "com.tr");

        return totalProductCount;
    },
    GetProductInfoFromHTML: function (productPageHtml, productLink = "") {
        var productDataJsonStr = productPageHtml.split("__PRODUCT_DETAIL_APP_INITIAL_STATE__")[1]?.trim().split("window.TYPageName")[0]?.trim().replace("=", "").trim();

        if (productDataJsonStr) {
            productDataJsonStr = productDataJsonStr.substring(0, productDataJsonStr.length - 1);

            var productDataJson = common.ConvertToJSON(productDataJsonStr);

            if (productDataJson) {
                var barcodeStr = productDataJson.product?.variants[0]?.barcode;
                if (common.ValidateBarcode(barcodeStr)) {
                    var product = {
                        "Barcode": barcodeStr,
                        "Title": productDataJson.product.name,
                        "ProductUrl": "https://www.trendyol.com" + productLink,
                        "Price": productDataJson.product.price.sellingPrice.value,
                        "Brand": productDataJson.product.brand.name,
                        "Image": "https://cdn.dsmcdn.com" + productDataJson.product.images[0],
                        "CurrencyCode": "TRY"
                    }

                    return product;
                }
            }
        }
    }
}
"use strict";
var morhipo = {
    Init: async function () {
        let minMaxBtnParams = {
            Key: "ArbitragePage",
            MinWidth: "46px",
            MinHeight: "38px",
        };
        common.InitMinMaxButton(minMaxBtnParams);

        let panelHolderElement = $('#home-body-id').eq(0);

        try {
            if (token) {
                if ($("#home-body-id:has(.productlist-row)").length > 0) {
                    $(panelHolderElement).prepend(
                        arbcommon.GetPanelTemplate()
                    );
                    arbcommon.RemoveUAEAndTurkey();

                    $("#mysysAnalysisNameInput").addClass("ms-fs-4")

                    $("#arbPanel").css({
                        "width": "245px",
                        "right": "1rem",
                        "z-index": "1000",
                    });

                    $(".MysysGetProductsBtn button").addClass("ms-fs-4");
                    $(".MysysGetProductsBtn button").css("height", "45px");
                    $("#mysysAnalysisNameInput").addClass("ms-px-3");
                    $("#mysysAnalysisSalexTax").removeClass("ms-fs-5");
                    $("#mysysAnalysisSalexTax").addClass("ms-fs-4");
                    $("#mysysAnalysisFBACargo").removeClass("ms-fs-5");
                    $("#mysysAnalysisFBACargo").addClass("ms-fs-4");

                    await arbcommon.SetExtraInfoToInputs();

                    quickAnalysis.Init(panelHolderElement, morhipo.GetProductLinks, morhipo.GetProductDetails, morhipo.GetTotalPageCount, morhipo.GetTotalProductCount);
                    $("#qaButton").addClass("ms-fs-4");

                    $(".mysys").on("click", ".MysysGetProductsBtn", async function (e) {
                        try {
                            if (WholesalerAuth) {
                                await arbcommon.SaveExtraInfoToStorage();
                                let totalPage = morhipo.GetTotalPageCount();
                                let pageContent = await $.get(window.location.href);
                                let currUrl;
                                if (pageContent.split("serviceUrl = '")[1]?.split("'")[0]) {
                                    currUrl = window.location.origin + pageContent.split("serviceUrl = '")[1]?.split("'")[0];
                                } else {
                                    currUrl = window.location.href;
                                }

                                let searchName = "";
                                if ($('#mysysAnalysisNameInput').val().length > 0) {
                                    searchName = $('#mysysAnalysisNameInput').val();
                                } else {
                                    let decodedURL = decodeURI(currUrl);
                                    if (decodedURL.indexOf("sKey=") > -1) {
                                        searchName = decodedURL.split("sKey=")[1]?.split("&")[0];
                                    } else {
                                        searchName = window.location.href.replace(window.location.origin + "/", "").split("/")[0]?.split("?")[0];
                                    }
                                }

                                if (!isNaN(totalPage)) {
                                    totalPage = totalPage > arbcommon.MaxTotalPage ? arbcommon.MaxTotalPage : totalPage;

                                    if ($('#mysysModal').length == 0) { $('body').after(arbmodal.GetStructure("1.4rem")); }

                                    arbmodal.SetHeader("İşlem devam ediyor&nbsp;" + common.DotsAnimation);

                                    arbmodal.SetComment("<p>İşlem başlatıldı.</p><div class='ms-text-warning ms-d-flex'><div class='ms-col-auto ms-me-3'>" + common.WarningIcon() +
                                        "</div>Lütfen işlem tamamlanana kadar sayfayı veya tarayıcıyı KAPATMAYINIZ.</div>");

                                    arbmodal.SetComment2('<p>İşlem Yapılan Sayfa : <b> <span id="mysyMRHCurrProccessingPageSpan">1</span> / ' + totalPage + '</b></p>');

                                    arbmodal.Show();

                                    morhipo.StartCrawling(currUrl, totalPage, arbcommon.GenerateGUID(), searchName);
                                }
                            } else {
                                arbcommon.RedirectToWholesalerPage();
                            }
                        } catch (error) {
                            errorHandler.SendErrorToAdmin(error);
                        }
                    });
                } else if ($("#home-body-id:has(.product-detail-container)").length > 0) {
                    let productInfo = this.GetProductInfoFromHTML($("html").html());

                    if (productInfo) {
                        oneproductQA.Init("body", productInfo);

                        $("#home-body-id").prepend(arbcommon.GetOneProductQATemplate());

                        $("#arbBarcodeComparerPanel").css("right", "1.25rem");
                        $("#arbBarcodeComparerPanel").css("z-index", "100");
                        $("#arbBarcodeComparerPanel button").addClass("ms-fs-4");
                    }

                    if (productInfo?.Barcode) {
                        $("#product-price").after(arbcommon.GetBarcodePanel("Barkod: " + productInfo.Barcode));
                        $("#mysysBarcodePanel").addClass("ms-mt-4");
                        $("#mysysBarcodePanel .mysys-barcode").css("font-size", "1.5rem");
                    }
                }
            } else {
                $(panelHolderElement).prepend(
                    arbcommon.GetWarningPanelTemplate(arbcommon.SessionInvalidErrorTr())
                );
            }
        } catch (error) {
            if (typeof error?.indexOf != "function" ||
                (error?.indexOf("timed-out or invalid") == -1 && error?.indexOf("User not found") == -1)) {
                errorHandler.SendErrorToAdmin(error);
            } else {
                $(panelHolderElement).prepend(
                    arbcommon.GetWarningPanelTemplate(arbcommon.SessionInvalidErrorTr())
                );
            }
        }

        $("#arbWarningPanel").css({
            "width": "245px",
            "right": "1rem",
            "z-index": "1000"
        });

        $("#mysysToast .toast-header, #mysysToast .toast-body").addClass("ms-fs-4");
    },
    StartCrawling: async function (currUrl, totalPage, processId, searchName) {
        try {
            let products = [];

            for (var i = 0; i < totalPage; i++) {
                try {
                    if (arbcommon.CheckProductCountToBeAnalyzed(products.length)) {
                        $('#mysyMRHCurrProccessingPageSpan').text(i + 1);

                        let returnProducts = await this.CrawlPage(decodeURIComponent(currUrl), i);
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

            let SiteId = arbcommon.Sites.morhipo;

            arbcommon.PostAnalysisResult(products, SiteId, processId, searchName);
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    CrawlPage: async function (currUrl, pageNum) {
        return new Promise(async (resolve, reject) => {
            try {
                const pagePList = await this.GetProductLinks(currUrl, pageNum);

                let productInfos = [];

                let counter = 0;

                if (pagePList?.length > 0) {
                    while (counter < pagePList.length) {
                        let crawledProductInfo = await morhipo.GetProductDetails(pagePList[counter]);
                        if (crawledProductInfo) {
                            productInfos.push(crawledProductInfo);
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
    GetProductLinks: async function (currUrl, pageNum) {
        try {
            let url = new URL(currUrl);

            if (url.search) {
                url = currUrl + "&pg=" + pageNum;
            } else {
                url = currUrl + "?pg=" + pageNum;
            }

            const productListPageHtml = await $.get(url);

            var html = $(productListPageHtml);

            var productLinks = [];

            $("div>a.js-product", html).each(function (index, element) {
                if ($(element).attr("href")) {
                    productLinks.push($(element).attr("href"));
                }
            });

            return productLinks;
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    GetProductDetails: async function (productLink) {
        try {
            let product = await arbcommon.SendRequestProductPage(morhipo.GetProductInfoFromHTML, productLink);

            return product;
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
            return null;
        }
    },
    GetProductInfoFromHTML: function (productPageHtml, productLink = "") {
        let productInfoStr = productPageHtml.split("fullDetailsForSk= ")[1]?.split("</script")[0]?.trim().replace(";", "");

        const productInfo = common.ConvertToJSON(productInfoStr);

        if (productInfo) {
            let barcode = productInfo.Barcode[0];

            if (common.ValidateBarcode(barcode)) {
                let title = productInfo.brandName;
                let price = Number(productInfo.salesPrice.replace("TL", "").replace(",", "."));
                let brand = productInfo.brandName;
                let image = productInfo.thumbnailUrl;

                let product = {
                    "Barcode": barcode,
                    "Title": title,
                    "ProductUrl": "https://www.morhipo.com" + productLink,
                    "Price": price,
                    "Brand": brand,
                    "Image": image,
                    "CurrencyCode": "TRY"
                }

                return product;
            }
        }
    },
    GetTotalProductCount: function () {
        let productCount = $("#total-product-count").text();
        return Number(productCount);
    },
    GetTotalPageCount: function () {
        let productCount = morhipo.GetTotalProductCount();
        let totalPage = parseInt(productCount / 120);
        return totalPage == 0 ? 1 : totalPage;
    }
}
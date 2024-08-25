"use strict";
var boyner = {
    Init: async function () {

        var target = $('.webView')[0];

        let currentUrl = window.location.href;
        // create an observer instance
        var observer = new MutationObserver(async function (mutations) {

            if (currentUrl != window.location.href) {
                window.location.reload();
            }
        });

        var config = { attributes: true, childList: true, characterData: true }

        observer.observe(target, config);

        // later, you can stop observing
        // observer.disconnect();

        let panelHolderElement = $('.webView').eq(0);

        let minMaxBtnParams = {
            Key: "ArbitragePage",
            MinWidth: "56px",
            MinHeight: "43px",
        };
        common.InitMinMaxButton(minMaxBtnParams);

        try {
            if (token) {
                if ($('.container #productLists').length > 0) {
                    panelHolderElement.prepend(
                        arbcommon.GetPanelTemplate()
                    );
                    arbcommon.RemoveUAEAndTurkey();

                    $("#arbPanel").css({
                        "width": "245px",
                        "right": "2rem",
                        "z-index": "1000",
                        "top": "180px"
                    });

                    $("#mysysAnalysisNameInput").addClass("ms-px-2");

                    await arbcommon.SetExtraInfoToInputs();
                    
                    quickAnalysis.Init("body", boyner.GetProductLinks, boyner.GetProductDetails, boyner.GetTotalPageCount, boyner.GetTotalProductCount);

                    $(".mysys.ms-modal").css("z-index", "11000");
                    $("#qaModal .ms-modal-dialog").css("z-index", "11000");
                    $("header.clearfix").css("z-index", "999");
                    $(".mysys").on("click", ".MysysGetProductsBtn ", async function () {
                        try {
                            if (WholesalerAuth) {
                                await arbcommon.SaveExtraInfoToStorage();
                                let currUrl = window.location.href;
                                let totalPage = boyner.GetTotalPageCount();

                                totalPage = totalPage > arbcommon.MaxTotalPage ? arbcommon.MaxTotalPage : totalPage;

                                if (!totalPage) {
                                    if (window.location.href.indexOf("search") <= -1) {
                                        toast.ShowWarning("Bu sayfada hiç ürün bulunamadı. Lütfen sayfa üzerinden ürün sorgulaması yapın.");
                                    } else {
                                        toast.ShowWarning("Bu sayfada hiç ürün bulunamadı. Lütfen kriterlerinizi değiştirip, tekrar ürün sorgulaması yapın.");
                                    }

                                    return false;
                                }

                                if ($('#mysysModal').length == 0) { $('body').after(arbmodal.GetStructure()); }

                                arbmodal.SetHeader("İşleminiz devam ediyor&nbsp;" + common.DotsAnimation);

                                arbmodal.SetComment("<p class='ms-mb-2'>İşlem başlatıldı.</p><div class='ms-text-warning ms-d-flex ms-mb-2'><div class='ms-col-auto ms-me-2'>" + common.WarningIcon() +
                                    "</div>Lütfen işlem tamamlanana kadar sayfayı veya tarayıcıyı KAPATMAYINIZ.</div>");

                                arbmodal.SetComment2('<p class="ms-mb-2">İşlem Yapılan Sayfa : <b> <span id="mysysBNCurrProccessingPageSpan">1</span> / ' + totalPage + '</b></p>');

                                arbmodal.Show();

                                var searchName = "";
                                if ($('#mysysAnalysisNameInput').val().length > 0) {
                                    searchName = $('#mysysAnalysisNameInput').val();
                                } else {
                                    let urlParts = currUrl.split("/");
                                    searchName = urlParts[urlParts.length - 1];
                                }

                                if (!searchName) {
                                    searchName = arbcommon.GenerateArbSearchName();
                                }

                                boyner.StartCrawling(currUrl, totalPage, arbcommon.GenerateGUID(), searchName);
                            } else {
                                arbcommon.RedirectToWholesalerPage();
                            }
                        } catch (error) {
                            errorHandler.SendErrorToAdmin(error);
                        }
                    });
                } else if ($(".container:has(div[class^='grid_productDetail'])").length > 0) {

                    let productInfo = boyner.GetProductInfoFromHTML($("html").html());

                    if (productInfo && productInfo.length > 0) {
                        oneproductQA.Init("body", productInfo[0]);

                        $(panelHolderElement).prepend(arbcommon.GetOneProductQATemplate());

                        $("#arbBarcodeComparerPanel").css("right", "1rem");
                        $("#arbBarcodeComparerPanel").css("z-index", "100");
                        $("#arbBarcodeComparerPanel").css("margin-top", "3rem");

                        $("#commonModal").css("z-index", "11000");
                    }

                    if (productInfo?.length > 0 && productInfo[0].Barcode) {
                        $("div[class^='product-price_checkPrice']").eq(0).before(arbcommon.GetBarcodePanel("Barkod: " + productInfo[0].Barcode));
                    }
                }

            } else {
                $(panelHolderElement).eq(0).prepend(
                    arbcommon.GetWarningPanelTemplate(arbcommon.SessionInvalidErrorTr())
                );
            }
        } catch (error) {
            if (typeof error?.indexOf != "function" ||
                (error?.indexOf("timed-out or invalid") == -1 && error?.indexOf("User not found") == -1)) {
                errorHandler.SendErrorToAdmin(error);
            } else {
                $(panelHolderElement).eq(0).prepend(
                    arbcommon.GetWarningPanelTemplate(arbcommon.SessionInvalidErrorTr())
                );
            }
        }

        $("#arbWarningPanel").css({
            "width": "245px",
            "right": "1rem",
            "z-index": "1000",
            "top": "180px"
        });

    },
    StartCrawling: async function (currUrl, totalPage, processId, searchName) {
        try {
            let products = [];

            for (var i = 1; i <= totalPage; i++) {
                try {
                    if (arbcommon.CheckProductCountToBeAnalyzed(products.length)) {
                        $('#mysysBNCurrProccessingPageSpan').text(i);
                        let returnProducts = await boyner.CrawlPage(decodeURIComponent(currUrl), i);
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

            var SiteId = arbcommon.Sites.boyner;

            arbcommon.PostAnalysisResult(products, SiteId, processId, searchName);

        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    CrawlPage: async function (currUrl, pageNum) {
        return new Promise(async (resolve, reject) => {
            try {
                const pagePList = await boyner.GetProductLinks(currUrl, pageNum);

                let productInfos = [];

                let counter = 0;

                if (pagePList?.length > 0) {
                    while (counter < pagePList.length) {
                        let crawledProductInfo = await boyner.GetProductDetails(pagePList[counter]);
                        if (crawledProductInfo?.length > 0) {
                            productInfos.push(...crawledProductInfo);
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
            let url = window.location.href;

            if (url.indexOf("?") > -1) {
                url += "&page=" + pageNum;
            } else {
                url += "?page=" + pageNum;
            }

            const productListPageHtml = await $.get(url);

            var html = $(productListPageHtml);

            var productLinkArr = [];

            $("#productLists .listProductItem div[class^='product-item_content'] a", html).each(function () {
                productLinkArr.push("https://www.boyner.com.tr" + $(this).attr("href"));
            });

            return productLinkArr;
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    GetProductDetails: async function (productLink) {
        let products = await arbcommon.SendRequestProductPage(boyner.GetProductInfoFromHTML, productLink);

        return products;
    },
    GetProductInfoFromHTML: function (productPageHtml) {
        let productList = [];
        let productInfoStr = productPageHtml.split('<script type="application/ld+json">')[1]?.split("</script>")[0];
        let productInfo = common.ConvertToJSON(productInfoStr);

        if (productInfo?.offers && common.ValidateBarcode(productInfo?.gtin13)) {

            var product = {
                "Barcode": productInfo.gtin13,
                "Title": productInfo.name,
                "ProductUrl": productInfo.url,
                "Price": productInfo.offers.price,
                "Brand": productInfo.brand.name,
                "Image": productInfo.image[0],
                "CurrencyCode": productInfo.offers.priceCurrency
            }

            productList.push(product);
        } else {
            console.log(productInfo);
        }

        return productList;
    },
    GetTotalPageCount: function () {
        let productCount = boyner.GetTotalProductCount();
        return Math.ceil(productCount / $(".listProductItem").length);
    },
    GetTotalProductCount: function () {
        let productCount = common.ExtractNumberFromString(document.querySelector("[class^='product-list_total']")?.innerText);

        productCount = !productCount ? 0 : productCount;

        return productCount;
    }
}
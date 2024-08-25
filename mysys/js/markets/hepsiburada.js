"use strict";
var hepsiburada = {
    Init: async function () {
        let minMaxBtnParams = {
            Key: "ArbitragePage",
            MinWidth: "59px",
            MinHeight: "44px",
        };
        common.InitMinMaxButton(minMaxBtnParams);

        let panelHolderElement;

        if ($('#cartNotification').length > 0) {
            panelHolderElement = $('#cartNotification').eq(0);
        } else if ($(".detail-main").length > 0) {
            panelHolderElement = $(".detail-main").eq(0);
        }

        try {
            if (token) {

                if ($('#cartNotification').length > 0) {
                    $('#cartNotification').after(
                        arbcommon.GetPanelTemplate()
                    );
                    arbcommon.RemoveUAEAndTurkey();

                    $("#arbPanel").css({
                        "width": "245px",
                        "right": "1rem",
                        "z-index": "99",
                    });

                    $("#mysysAnalysisNameInput").addClass("ms-p-2");

                    await arbcommon.SetExtraInfoToInputs();

                    quickAnalysis.Init("body", hepsiburada.GetProductLinks, hepsiburada.GetProductDetails, hepsiburada.GetTotalPageCount, hepsiburada.GetTotalProductCount);

                    $(".mysys").on("click", ".MysysGetProductsBtn", async function () {
                        try {
                            if (WholesalerAuth) {
                                await arbcommon.SaveExtraInfoToStorage();

                                let currUrl = window.location.href;
                                let totalPage = hepsiburada.GetTotalPageCount();

                                totalPage = totalPage > arbcommon.MaxTotalPage ? arbcommon.MaxTotalPage : totalPage;

                                if ($('#mysysModal').length == 0) { $('body').after(arbmodal.GetStructure()); }

                                arbmodal.SetHeader("İşlem devam ediyor&nbsp;" + common.DotsAnimation);

                                arbmodal.SetComment("<p>İşlem başlatıldı.</p><div class='ms-text-warning ms-d-flex'><div class='ms-col-auto ms-ps-0'>" + common.WarningIcon() +
                                    "</div><span class='ms-ms-2'>Lütfen işlem tamamlanana kadar sayfayı veya tarayıcıyı KAPATMAYINIZ.</span></div>");

                                arbmodal.SetComment2('<p>İşlem Yapılan Sayfa : <b> <span id="mysysHBCurrProccessingPageSpan">1</span> / ' + totalPage + '</b></p>');

                                arbmodal.Show();

                                let searchName = "";

                                if ($('#mysysAnalysisNameInput').val().length > 0) {
                                    searchName = $('#mysysAnalysisNameInput').val();
                                } else if ($(".search-results-title").length > 0) {
                                    searchName = $(".search-results-title").first().text().trim().replaceAll(" ", "-").toLowerCase();
                                } else {
                                    searchName = arbcommon.GenerateArbSearchName();
                                }

                                hepsiburada.StartCrawling(currUrl, totalPage, arbcommon.GenerateGUID(), searchName);
                            } else {
                                arbcommon.RedirectToWholesalerPage();
                            }
                        } catch (error) {
                            errorHandler.SendErrorToAdmin(error);
                        }
                    });
                } else if ($(".detail-main").length > 0) {
                    let productInfo = this.GetProductInfoFromHTML($("html").html());

                    if (productInfo) {
                        oneproductQA.Init("body", productInfo);

                        $(".detail-main").prepend(arbcommon.GetOneProductQATemplate());

                        $("#arbBarcodeComparerPanel").css("right", "1rem");
                        $("#arbBarcodeComparerPanel").css("z-index", "100");
                        $("#arbBarcodeComparerPanel").addClass("ms-mt-0");
                    }
                    if (productInfo?.Barcode) {
                        $('div.product-price-wrapper').after(arbcommon.GetBarcodePanel("Barkod: " + productInfo.Barcode));
                    }
                }

            } else {
                $(panelHolderElement).after(
                    arbcommon.GetWarningPanelTemplate(arbcommon.SessionInvalidErrorTr())
                );
            }
        } catch (error) {
            if (typeof error?.indexOf != "function" ||
                (error?.indexOf("timed-out or invalid") == -1 && error?.indexOf("User not found") == -1)) {
                errorHandler.SendErrorToAdmin(error);
            } else {
                $(panelHolderElement).after(
                    arbcommon.GetWarningPanelTemplate(arbcommon.SessionInvalidErrorTr())
                );
            }
        }

        $("#arbWarningPanel").css({
            "width": "15%",
            "right": "1rem",
            "z-index": "99"
        });
    },
    GetTotalPageCount: function () {
        var totalPageStr = "1";
        if ($('#pagination').length > 0) {
            totalPageStr = $('#pagination')[0].firstElementChild.lastElementChild.firstElementChild.innerHTML;
        } else {
            let totalProductCount = hepsiburada.GetTotalProductCount();
            totalPageStr = Math.ceil(totalProductCount / 24);
        }

        return Number(totalPageStr);
    },
    GetTotalProductCount: function () {
        let totalProductCount = 0;
        for (let i = 0; i < $("b[class^='searchResultSummaryBar']").length; i++) {
            let productCountText = common.ExtractNumberFromString($("b[class^='searchResultSummaryBar']")?.eq(i)?.text());
            if (!isNaN(productCountText)) {
                totalProductCount = Number(productCountText);
                break;
            }
        }
        if (!totalProductCount || totalProductCount == 0) {
            let productCountText = common.ExtractNumberFromString($("div.paginatorStyle-root div.paginatorStyle-label").text().split("/")[1]?.split("ürün")[0]);
            if (!isNaN(productCountText)) {
                totalProductCount = Number(productCountText);
            }
        }

        return totalProductCount;
    },
    StartCrawling: async function (currUrl, totalPage, processId, searchName) {
        try {
            let products = [];
            for (var i = 1; i <= totalPage; i++) {
                try {
                    if (arbcommon.CheckProductCountToBeAnalyzed(products.length)) {
                        $('#mysysHBCurrProccessingPageSpan').text(i);
                        let returnProducts = await hepsiburada.CrawlPage(decodeURIComponent(currUrl), i);
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

            var SiteId = arbcommon.Sites.hepsiburada;

            arbcommon.PostAnalysisResult(products, SiteId, processId, searchName);

        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    CrawlPage: function (currUrl, pageNum) {
        return new Promise(async (resolve, reject) => {
            try {
                const pagePList = await hepsiburada.GetProductLinks(currUrl, pageNum);

                let productInfos = [];

                let counter = 0;

                if (pagePList.length > 0) {
                    while (counter < pagePList.length) {
                        let productInfo = await hepsiburada.GetProductDetails(pagePList[counter]);
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
                var seperator = '';

                if (url.indexOf('?') > 0) { seperator = '&'; }
                else { seperator = '?'; }

                if (url.lastIndexOf("#") == (url.length - 1)) {
                    url = url.substring(0, url.length - 1);
                }

                if (url.indexOf("&sayfa=") > 0) {
                    url = url.split("&sayfa")[0];
                } else if (url.indexOf("?sayfa=") > 0) {
                    url = url.split("?sayfa")[0];
                }

                let urlWithPageNo = url + seperator + "sayfa=" + pageNum;
                const productListPageHtml = await $.get(urlWithPageNo);

                var html = $(productListPageHtml);

                var pLinkList = [];

                let productList = common.ConvertToJSON($(".product-list .moria-search-results .voltran-fragment div script", html).eq(0)?.html()?.split("'STATE': ")[1]?.trim().slice(0, -2)?.trim().replaceAll("\\n", "").replaceAll("\n", "").replaceAll('\\"', '').slice(0, -1));

                if (productList) {
                    for (let i = 0; i < productList?.data?.products.length; i++) {
                        const product = productList.data.products[i];
                        let varLength = product?.variantList?.length <= 3 ? product?.variantList?.length : 3;
                        for (let j = 0; j < varLength; j++) {
                            const variant = product.variantList[j];
                            if (variant.url.indexOf("https://adservice.") == -1) {
                                pLinkList.push(document.location.origin + variant.url);
                            }
                        }
                    }
                } else {
                    $(".product-list .search-item", html).each((index, elem) => {
                        pLinkList.push($("a", elem).attr("href"));
                    })
                }

                if (!pLinkList || pLinkList.length == 0) {
                    $(".voltran-fragment ul li[class^='productListContent']").each((index, elem) => {
                        pLinkList.push($("a", elem).attr("href"));
                    })
                }

                resolve(pLinkList);
            } catch (error) {
                reject(error)
            }
        })
    },
    GetProductDetails: async function (productLink) {
        let product = await arbcommon.SendRequestProductPage(hepsiburada.GetProductInfoFromHTML, productLink);

        return product;
    },
    GetProductInfoFromHTML: function (productPageHtml, productLink = "") {
        var utagDataArr = productPageHtml.split('var utagData = ');
        var utagDataJsonStr = utagDataArr[1]?.split('var utagObject = ')[0].trim();

        if (utagDataJsonStr) {
            utagDataJsonStr = utagDataJsonStr.substring(0, utagDataJsonStr.length - 1);

            var utagDataJson = common.ConvertToJSON(utagDataJsonStr);

            if (utagDataJson) {
                if (common.ValidateBarcode(utagDataJson.product_barcode)) {

                    var pImage = $($('img.product-image', $(productPageHtml))[0]).attr('src');

                    var price = parseFloat(utagDataJson.order_subtotal[0]);

                    if (productLink.indexOf('https://www.hepsiburada.com') == -1) {
                        productLink = 'https://www.hepsiburada.com' + productLink;
                    }

                    var product = {
                        "Barcode": utagDataJson.product_barcode,
                        "Title": utagDataJson.product_name_array,
                        "ProductUrl": productLink,
                        "Price": price,
                        "Brand": utagDataJson.product_brand,
                        "Image": pImage,
                        "CurrencyCode": "TRY"
                    }

                    return product;
                }
            }
        }
    }
}


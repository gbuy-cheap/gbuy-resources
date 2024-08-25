"use strict";
let n11 = {
    Init: async function () {
        let minMaxBtnParams = {
            Key: "ArbitragePage",
            MinWidth: "26px",
            MinHeight: "21px",
        };
        common.InitMinMaxButton(minMaxBtnParams);

        let panelHolderElement;

        if ($('#contentListing').length > 0) {
            panelHolderElement = $('#contentListing').eq(0);
        } else if ($(".content#unf-p-id").length > 0) {
            panelHolderElement = $(".content#unf-p-id").eq(0);
        }

        try {
            if (document.location.href.indexOf("arama?") > -1 ||
                document.location.href.indexOf("?q=") > -1 ||
                document.location.href.indexOf("/urun/")) {
                if (token) {
                    if ($('#contentListing').length > 0 && $(".content#unf-p-id").length == 0) {
                        $('#contentListing').prepend(
                            arbcommon.GetPanelTemplate()
                        );
                        arbcommon.RemoveUAEAndTurkey();

                        $("#arbPanel").css({
                            "width": "245px",
                            "right": "1rem",
                            "z-index": "1000",
                        });

                        $("#mysysAnalysisNameInput").addClass("ms-p-2");

                        await arbcommon.SetExtraInfoToInputs();

                        quickAnalysis.Init("body", n11.GetProductLinks, n11.GetProductDetails, n11.GetTotalPageCount, n11.GetTotalProductCount);

                        $(".mysys").on("click", ".MysysGetProductsBtn", async function () {
                            try {
                                if (WholesalerAuth) {
                                    await arbcommon.SaveExtraInfoToStorage();
                                    var currUrl = window.location.href;
                                    let totalPage = n11.GetTotalPageCount();

                                    totalPage = totalPage > arbcommon.MaxTotalPage ? arbcommon.MaxTotalPage : totalPage;

                                    if ($('#mysysModal').length == 0) { $('body').after(arbmodal.GetStructure()); }

                                    arbmodal.SetHeader("İşlem devam ediyor&nbsp;" + common.DotsAnimation);

                                    arbmodal.SetComment("<p class='ms-mb-2'>İşlem başlatıldı.</p><div class='ms-text-warning ms-d-flex ms-mb-2'><div class='ms-col-auto ms-ps-0'>" + common.WarningIcon() +
                                        "</div><span class='ms-ms-2'>Lütfen işlem tamamlanana kadar sayfayı veya tarayıcıyı KAPATMAYINIZ.</span></div>");

                                    arbmodal.SetComment2('<p class="ms-mb-2">İşlem Yapılan Sayfa : <b> <span id="mysysN11CurrProccessingPageSpan">1</span> / ' + totalPage + '</b></p>');

                                    arbmodal.Show();

                                    let searchName = "";
                                    let guid = arbcommon.GenerateGUID();
                                    if ($('#mysysAnalysisNameInput').val().length > 0) {
                                        searchName = $('#mysysAnalysisNameInput').val();
                                    } else if ($(".search-results-title").length > 0) {
                                        searchName = $(".search-results-title").first().text().trim().replaceAll(" ", "-").toLowerCase();
                                    } else {
                                        searchName = arbcommon.GenerateArbSearchName();
                                    }

                                    n11.StartCrawling(currUrl, totalPage, guid, searchName);
                                } else {
                                    arbcommon.RedirectToWholesalerPage();
                                }
                            } catch (error) {
                                errorHandler.SendErrorToAdmin(error);
                            }
                        });
                    }
                    else if ($(".content#unf-p-id").length > 0) {
                        let productInfo = this.GetProductInfoFromHTML($("html").html());

                        if (productInfo) {
                            oneproductQA.Init("body", productInfo);

                            $(".content#unf-p-id").prepend(arbcommon.GetOneProductQATemplate());

                            $("#arbBarcodeComparerPanel").css("right", "1rem");
                            $("#arbBarcodeComparerPanel").css("z-index", "100");
                        }

                        if (productInfo?.Barcode) {
                            $("div.unf-price-cover").after(arbcommon.GetBarcodePanel("Barkod: " + productInfo.Barcode));
                        }
                    }

                } else {
                    $(panelHolderElement).prepend(
                        arbcommon.GetWarningPanelTemplate(arbcommon.SessionInvalidErrorTr())
                    );
                }
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
            "width": "15%",
            "right": "1rem",
        });
    },
    StartCrawling: async function (currUrl, totalPage, processId, searchName) {
        try {
            let products = [];

            for (var i = 1; i <= totalPage; i++) {
                try {
                    if (arbcommon.CheckProductCountToBeAnalyzed(products.length)) {
                        $('#mysysN11CurrProccessingPageSpan').text(i);
                        let returnProducts = await n11.CrawlPage(decodeURIComponent(currUrl), i);
                        if (returnProducts?.length > 0) {
                            for (let index = 0; index < returnProducts.length; index++) {
                                if (!products.find(x => x.Barcode == returnProducts[index].Barcode)) {
                                    products.push(returnProducts[index]);
                                }
                            }
                        }
                    } else {
                        products = products.slice(0, arbcommon.GetProductCountToBeAnalyzed());
                        break;
                    }
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                }
            }

            var SiteId = arbcommon.Sites.n11;

            arbcommon.PostAnalysisResult(products, SiteId, processId, searchName);
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    CrawlPage: function (currUrl, pageNum) {
        return new Promise(async (resolve, reject) => {
            try {
                const pagePList = await n11.GetProductLinks(currUrl, pageNum);

                let productInfos = [];

                let counter = 0;

                if (pagePList?.length > 0) {
                    while (counter < pagePList.length) {
                        let productInfo = await n11.GetProductDetails(pagePList[counter]);
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
        })
    },
    GetProductLinks: function (url, pageNum) {
        return new Promise(async (resolve, reject) => {
            try {
                let productListPageHtml;

                let categoryId = $("[data-categoryid]").attr("data-categoryid");
                url = `https://www.n11.com/searchCategoryForPagination/${categoryId}`;

                if (url.indexOf('q=') > -1) {
                    let searchParam = url.split("q=")[1];
                    url += `&q=${searchParam}?`;
                } else {
                    url += "?"
                }

                productListPageHtml = await $.get(url + "pg=" + pageNum);

                var html = $(productListPageHtml);

                var pLinkList = [];

                if ($('#view > ul > li', html).length > 0) {
                    $('#view > ul > li', html).each(function () {
                        var pLink = $(this).find("a").eq(0).attr('href')?.split("?magaza")[0];
                        if (!pLinkList.includes(pLink)) {
                            pLinkList.push(pLink);
                        }
                    });
                } else if ($('.column a.plink', html).length > 0) {
                    $('.column a.plink', html).each(function () {
                        var pLink = $(this).attr('href')?.split("?magaza")[0];
                        if (!pLinkList.includes(pLink)) {
                            pLinkList.push(pLink);
                        }
                    });
                }

                resolve(pLinkList);
            } catch (error) {
                reject(error);
            }
        });
    },
    GetProductDetails: function (productLink, tryingCount = 1) {
        return new Promise(async (resolve, reject) => {
            if (productLink.indexOf("urun.n11") == -1) {

                arbcommon.SendRequestProductPage(n11.GetProductInfoFromHTML, productLink, tryingCount)
                    .then(async (products) => { resolve(products); })
                    .catch(async (error) => { reject(error); });
            } else {
                chrome.runtime.sendMessage({ url: productLink, type: "simple" }, (response) => {
                    try {
                        if (response) {
                            if (response?.response?.isSuccess == false) {
                                resolve();
                            } else {
                                let product = n11.GetProductInfoFromHTML(response.response);

                                if (product) {
                                    resolve(product);
                                } else {
                                    resolve();
                                }
                            }
                        }
                    } catch (error) {
                        reject(error);
                    }
                });
            }
        });
    },
    GetTotalPageCount: function () {
        return Math.ceil(n11.GetTotalProductCount() / 28);
    },
    GetTotalProductCount: function () {
        let totalProductCount = common.ExtractNumberFromString($("div.resultText > strong").text());
        if (totalProductCount) {
            return totalProductCount;
        }

        return 0;
    },
    GetProductInfoFromHTML: function (htmlContent) {
        let barcode = $(htmlContent).find("#unificationDetailGtin").val();

        if (common.ValidateBarcode(barcode)) {
            let title = $(htmlContent).find("div.proNameHolder > div.nameHolder > h1").text().trim();
            let productUrl = $(htmlContent).find(".returnUrl").val();
            let price = $(htmlContent).find("#skuPrice").val();

            if (price?.indexOf(",") < 0) {
                price += ",00"

                price = common.ConvertPriceToNumber(price);
            }


            let brand = htmlContent.split('data-flix-brand="')[1]?.split('"')[0];
            let image = $(htmlContent).find(".imgObj img").attr("data-original");

            if (!brand) {
                brand = htmlContent.split("'data-flix-brand', '")[1]?.trim().split("')")[0];
            }

            if (isNaN(price)) {
                price = Number(htmlContent.split('lowPrice":')[1].split(",")[0].trim().replaceAll('"', ''));
            }

            var product = {
                "Barcode": barcode,
                "Title": title,
                "ProductUrl": "https://www.n11.com" + productUrl,
                "Price": price,
                "Brand": brand,
                "Image": image,
                "CurrencyCode": "TRY"
            }

            return product;
        }
    }
}
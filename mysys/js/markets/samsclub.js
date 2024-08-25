"use strict";
var samsclub = {
    Init: async function () {
        let minMaxBtnParams = {
            Key: "ArbitragePage",
            MinWidth: "59px",
            MinHeight: "44px",
        };
        common.InitMinMaxButton(minMaxBtnParams);

        let panelHolderElement;

        if ($('.sc-plp.sc-plp-grid').length > 0) {
            panelHolderElement = $('.sc-plp.sc-plp-grid').eq(0);
        } else if ($(".sc-pdp .sc-pdp-main-content").length > 0) {
            panelHolderElement = $(".sc-pdp .sc-pdp-main-content").eq(0);
        } else if ($('.sc-plp.sc-plp-list').length > 0) {
            panelHolderElement = $('.sc-plp.sc-plp-list').eq(0);
        }

        try {
            if (token) {
                let currUrl = window.location.href;
                setInterval(() => {
                    if (window.location.href != currUrl && (window.location.href != currUrl + "#")) {
                        window.location.reload();
                    }
                }, 1000);

                if ($('.sc-plp.sc-plp-grid').length > 0 || $('.sc-plp.sc-plp-list').length > 0) {

                    $(panelHolderElement).prepend(
                        arbcommon.GetPanelTemplate({ lang: "en" })
                    );
                    arbcommon.RemoveUAEAndTurkey();

                    $("#arbPanel").css({
                        "width": "245px",
                        "right": "0.5rem",
                        "z-index": "49",
                        "top": "5px"
                    });

                    $("#mysysAnalysisNameInput").addClass("ms-p-2");

                    await arbcommon.SetExtraInfoToInputs();

                    quickAnalysis.Init("body", samsclub.GetProductLinks, samsclub.GetProductDetails, samsclub.GetTotalPageCount, samsclub.GetTotalProductCount, "en", "USD");

                    $("#qaLoadMore").addClass("ms-d-flex ms-align-items-center");

                    $(".mysys").on("click", ".MysysGetProductsBtn", async function () {
                        try {
                            if (WholesalerAuth) {
                                await arbcommon.SaveExtraInfoToStorage();

                                let totalPage = samsclub.GetTotalPageCount();

                                totalPage = totalPage > arbcommon.MaxTotalPage ? arbcommon.MaxTotalPage : totalPage;

                                if ($('#mysysModal').length == 0) { $('body').after(arbmodal.GetStructure()); }

                                arbmodal.SetHeader("Processing&nbsp;" + common.DotsAnimation);

                                arbmodal.SetComment("<p>The process has been started.</p><p class='ms-text-warning ms-d-flex ms-text-decoration-underline'>" + common.WarningIcon() +
                                    "&nbsp;Please DO NOT close the page or browser until the process is completed.</p>");

                                arbmodal.SetComment2("<p>Currently processing page: <b> <span id='mysysCurrProcessingPageSpan'>1</span> / " + totalPage + "</b></p>");

                                arbmodal.Show();

                                let searchName = "";
                                let guid = arbcommon.GenerateGUID();
                                if ($('#mysysAnalysisNameInput').val().length > 0) {
                                    searchName = $('#mysysAnalysisNameInput').val();
                                } else if ($("#Search").val() != "") {
                                    searchName = $("#Search").val().trim().replaceAll(" ", "-").toLowerCase();
                                } else {
                                    searchName = arbcommon.GenerateArbSearchName();
                                }

                                samsclub.StartCrawling(currUrl, totalPage, guid, searchName);

                            } else {
                                arbcommon.RedirectToWholesalerPage();
                            }
                        } catch (error) {
                            errorHandler.SendErrorToAdmin(error);
                        }
                    });

                } else if ($(".sc-pdp .sc-pdp-main-content").length > 0) {
                    let productInfo = this.GetProductInfoFromHTML($("html").html());

                    if (productInfo) {
                        oneproductQA.Init("body", productInfo, "en", "USD");

                        $(".main-wrapper").eq(0).prepend(arbcommon.GetOneProductQATemplate("MySYS Analysis"));

                        $("#arbBarcodeComparerPanel").css("right", "1rem");
                        $("#arbBarcodeComparerPanel").css("z-index", "100");
                        $("#arbBarcodeComparerPanel").addClass("ms-mt-2");
                    }

                    if (productInfo?.Barcode) {
                        $(".sc-pc-channel-savings-large").eq(0).after(arbcommon.GetBarcodePanel("Barcode: " + productInfo.Barcode));
                    }
                }
            } else {
                $(panelHolderElement).prepend(
                    arbcommon.GetWarningPanelTemplate(arbcommon.SessionInvalidErrorEng())
                );
            }

        } catch (error) {
            if (typeof error?.indexOf != "function" ||
                (error?.indexOf("timed-out or invalid") == -1 && error?.indexOf("User not found") == -1)) {
                errorHandler.SendErrorToAdmin(error);
            } else {
                $(panelHolderElement).prepend(
                    arbcommon.GetWarningPanelTemplate(arbcommon.SessionInvalidErrorEng())
                );
            }
        }

        $("#arbWarningPanel").css({
            "width": "15%",
            "right": "1rem",
            "z-index": "99"
        });
    },
    StartCrawling: async function (currUrl, totalPage, processId, searchName) {
        try {
            let products = [];

            for (var i = 1; i <= totalPage; i++) {
                try {
                    if (arbcommon.CheckProductCountToBeAnalyzed(products.length)) {
                        $('#mysysCurrProcessingPageSpan').text(i);
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

            var SiteId = arbcommon.Sites.samsclub;

            arbcommon.PostAnalysisResult(products, SiteId, processId, searchName, "en");

        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    CrawlPage: function (currUrl, pageNum) {
        return new Promise(async (resolve, reject) => {
            try {
                const pagePList = await samsclub.GetProductLinks(currUrl, pageNum);

                let productInfos = [];

                let counter = 0;

                if (pagePList.length > 0) {
                    while (counter < pagePList.length) {
                        let productInfo = await samsclub.GetProductDetails(pagePList[counter]);
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
    GetTotalPageCount: function () {
        let totalProductCount = samsclub.GetTotalProductCount();
        return Math.ceil(totalProductCount / 48);

    },
    GetTotalProductCount: function () {
        return common.ConvertToNumber($(".sc-page-title-results-total").text().replaceAll(/[^0-9]/g, ''), "com");
    },
    GetProductLinks: function (url, pageNum) {
        return new Promise(async (resolve, reject) => {
            try {

                let productListPageHtml;

                pageNum--;

                if (url.indexOf("?offset=") > -1) {
                    url = url.split("?offset=")[0];
                } else if (url.indexOf("&offset=") > -1) {
                    url = url.split("&offset=")[0];
                }

                if (url.indexOf("?") > -1) {
                    url = url + "&offset=" + (pageNum * 48);
                } else {
                    url = url + "?offset=" + (pageNum * 48);
                }

                productListPageHtml = await $.get(url);

                var html = $(productListPageHtml);

                var pLinkList = [];

                $('.sc-plp-cards-card a', html).each(function () {
                    var pLink = $(this).eq(0).attr('href');
                    pLinkList.push(pLink);
                });

                resolve(pLinkList);
            } catch (error) {
                reject(error);
            }
        });
    },
    GetProductDetails: async function (productLink) {
        let product = await arbcommon.SendRequestProductPage(samsclub.GetProductInfoFromHTML, productLink);

        return product;
    },
    GetProductInfoFromHTML: function (productPageHtml, productLink = "") {
        let image = $("meta[itemprop='image']", productPageHtml).attr("content");
        let upc = image?.split("samsclub/")[1]?.split("_")[0]?.slice(2);
        if (upc) {
            upc += common.CalculateUPCCheckDigit(upc);
            if (upc && common.ValidateBarcode(upc)) {

                let price = $(".Price-characteristic", productPageHtml).eq(0).text() +
                    $(".Price-mark", productPageHtml).eq(0).text() +
                    $(".Price-mantissa", productPageHtml).eq(0).text();

                let product = {
                    "Barcode": upc,
                    "Title": $("meta[itemprop='name']", productPageHtml).attr("content"),
                    "ProductUrl": "https://www.samsclub.com" + productLink,
                    "Price": common.ConvertToNumber(price, "com"),
                    "Brand": $("meta[itemprop='brand']", productPageHtml).attr("content"),
                    "Image": image,
                    "CurrencyCode": "USD"
                }

                return product;
            }
        }
    }
}
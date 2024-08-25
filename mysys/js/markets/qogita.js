"use strict";
var qogita = {
    Init: async function () {

        let minMaxBtnParams = {
            Key: "ArbitragePage",
            MinWidth: "59px",
            MinHeight: "44px",
        };
        common.InitMinMaxButton(minMaxBtnParams);

        let panelHolderElement = $("div.mb-2.flex-grow:has(div.container.mx-auto)");
        // let panelHolderElement = $("body");
        let currUrl = window.location.href;

        try {
            $("a[href*='/products/'], button.ais-ClearRefinements-button, aside#filters, header strong a[href='/']").on("click", function (e) {
                common.IsURLChanged(currUrl).then(async result => {
                    if (result && currUrl != window.location.href) {
                        // window.location.reload();
                        $(".mysys").remove();
                        $(".ms-modal-backdrop.show").remove();
                        $(".mysys").off();
                        $(".mysys *").off();
                        $("#qaLoadMore").off();
                        $("#qaModal").off();
                        $("#downloadGrid").off();
                        $("a[href*='/products/'], button.ais-ClearRefinements-button, aside#filters, header strong a[href='/']").off();
                    }
                });
            });

            if (token) {
                if ($("select.ais-HitsPerPage-select").length > 0) {

                    $(panelHolderElement).prepend(
                        arbcommon.GetPanelTemplate({ lang: "en" })
                    );
                    arbcommon.RemoveUAEAndTurkey();

                    $("#arbPanel").css({
                        "width": "245px",
                        "right": "1rem",
                        "z-index": "99",
                        "top": "6rem"
                    });

                    $("#mysysAnalysisNameInput").addClass("ms-p-2");

                    await arbcommon.SetExtraInfoToInputs();

                    quickAnalysis.Init("body", qogita.GetProductLinks, qogita.GetProductDetails, qogita.GetTotalPageCount, qogita.GetTotalProductCount, "en", "USD");

                    $("#qaLoadMore").addClass("ms-align-items-center ms-d-flex ms-justify-content-center");

                    $(".mysys").on("click", ".MysysGetProductsBtn", async function () {
                        try {
                            if (WholesalerAuth) {
                                currUrl = window.location.href;
                                await arbcommon.SaveExtraInfoToStorage();

                                let totalPage = qogita.GetTotalPageCount();

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
                                } else {
                                    searchName = arbcommon.GenerateArbSearchName();
                                }

                                qogita.StartCrawling(currUrl, totalPage, guid, searchName);

                            } else {
                                arbcommon.RedirectToWholesalerPage();
                            }
                        } catch (error) {
                            errorHandler.SendErrorToAdmin(error);
                        }
                    });

                } else if (window.location.href.indexOf("/products/") > -1) {
                    let fid = qogita.GetFidFromURL();
                    let slug = window.location.href.split("/products/")[1].split("/")[1];
                    let buildId = JSON.parse($("script#__NEXT_DATA__").text()).buildId;

                    let productInfoUrl = `https://www.qogita.com/_next/data/${buildId}/en-GB/products/${fid}/${slug}.json?fid=${fid}&slug=${slug}`;

                    $.get(productInfoUrl, function (data) {
                        let productInfo = data?.pageProps?.variant;

                        if (productInfo) {

                            let product = {
                                "gtin": productInfo.gtin,
                                "name": productInfo.name,
                                "fid": productInfo.fid,
                                "slug": productInfo.slug,
                                "price": Number(productInfo.price),
                                "brand_name": productInfo.brand.name,
                                "image_url": productInfo.images[0]?.url,
                                "price_currency": productInfo.priceCurrency
                            }

                            productInfo = qogita.GetProductInfoFromHTML(product);

                            if (productInfo && $("#commonModal").length == 0) {
                                oneproductQA.Init("body", productInfo, "en", "USD");

                                $(panelHolderElement).eq(0).prepend(arbcommon.GetOneProductQATemplate("MySYS Analysis"));

                                $("#arbBarcodeComparerPanel").css("right", "1rem");
                                $("#arbBarcodeComparerPanel").css("z-index", "100");
                                $("#arbBarcodeComparerPanel").addClass("ms-mt-2");
                            }
                        }
                    });
                }
            } else {
                $(panelHolderElement).prepend(
                    arbcommon.GetWarningPanelTemplate(arbcommon.SessionInvalidErrorEng())
                );

                $("#arbWarningPanel").css({
                    "width": "245px",
                    "right": "1rem",
                    "z-index": "99",
                });
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
    },
    Products: null,
    StartCrawling: async function (currUrl, totalPage, processId, searchName) {
        try {
            let products = [];

            for (var i = 1; i <= totalPage; i++) {
                try {
                    if (arbcommon.CheckProductCountToBeAnalyzed(products.length)) {
                        $('#mysysCurrProcessingPageSpan').text(i);
                        let returnProducts = await qogita.CrawlPage(decodeURIComponent(currUrl), i);
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

            var SiteId = arbcommon.Sites.qogita;

            arbcommon.PostAnalysisResult(products, SiteId, processId, searchName, "en");

        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    CrawlPage: function (currUrl, pageNum) {
        return new Promise(async (resolve, reject) => {
            try {
                const pagePList = await qogita.GetProductLinks(currUrl, pageNum);

                let productInfos = [];

                let counter = 0;

                if (pagePList.length > 0) {
                    while (counter < pagePList.length) {
                        let productInfo = await qogita.GetProductDetails(pagePList[counter]);
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
                url = url.replaceAll("+&+", "+%26+");

                if (url.indexOf("&page=") > -1) {
                    url = url.split("&page=")[0]
                }

                url += "&page=" + pageNum;

                let categories;

                if (url.indexOf("category_tree") > -1) {
                    categories = url.split('category_tree')[1].split('=')[1].replaceAll("+", " ").replaceAll("%26", "&").replaceAll("#", "")
                        .replaceAll("&brand_name", "").replaceAll("&discount_percent", "").replaceAll("&margin_percent", "")
                        .split("&page")[0].split(" > ");
                }

                let searchText;

                if (document.getElementById("search-box-input").value) {
                    searchText = document.getElementById("search-box-input").value;
                }

                let brandNames = [];

                if (url.indexOf("brand_name") > -1) {
                    $(".ais-RefinementList-checkbox:checked").eq(0).siblings(".ais-RefinementList-labelText").text();
                    $(".ais-RefinementList-checkbox:checked + .ais-RefinementList-labelText").each(function (index, elem) {
                        brandNames.push($(elem).text());
                    });
                }

                let margin;

                if (url.indexOf("margin") > -1) {
                    margin = window.location.href.split('margin_percent=')[1].split("&")[0].split("%3A");
                    if (margin?.length > 0 && !margin[0]) {
                        margin = null;
                    }
                }

                let discountPercent;

                if (url.indexOf("discount_percent") > -1) {
                    discountPercent = window.location.href.split('discount_percent=')[1].split("&")[0].split("%3A");
                    if (discountPercent?.length > 0 && !discountPercent[0]) {
                        discountPercent = null;
                    }
                }

                let productsPerPage = qogita.GetProductPerPage();

                let currentPage = pageNum - 1;

                chrome.runtime.sendMessage(
                    {
                        type: "m10",
                        categories: categories,
                        productsPerPage: productsPerPage,
                        currentPage: currentPage,
                        brandNames: brandNames,
                        searchText: searchText,
                        margin: margin,
                        discountPercent: discountPercent
                    },
                    (response) => {
                        try {
                            if (response?.response) {
                                qogita.Products = response.response;
                                resolve(response.response.map(x => `https://www.qogita.com/products/${x.fid}/${x.slug}`));
                            } else {
                                resolve();
                            }
                        } catch (error) {
                            reject(error);
                        }
                    });

            } catch (error) {
                reject(error);
            }
        });
    },
    GetProductDetails: async function (productLink) {
        let fid = qogita.GetFidFromURL(productLink);// productLink.split("/products/")[1].split("/")[0];

        let foundProduct = qogita.Products.find(x => x.fid == fid);

        let product = qogita.GetProductInfoFromHTML(foundProduct); //await arbcommon.SendRequestProductPage(qogita.GetProductInfoFromHTML, productLink);

        return product;
    },
    GetProductInfoFromHTML: function (foundProduct, productLink = "") {
        if (foundProduct.gtin && common.ValidateBarcode(foundProduct.gtin)) {

            let product = {
                "Barcode": foundProduct.gtin,
                "Title": foundProduct.name,
                "ProductUrl": `https://www.qogita.com/products/${foundProduct.fid}/${foundProduct.slug}`,
                "Price": foundProduct.price,
                "Brand": foundProduct.brand_name,
                "Image": foundProduct.image_url,
                "CurrencyCode": foundProduct.price_currency
            }

            return product;
        }
    },
    GetTotalProductCount: function () {
        return Number($(".ais-Stats-text").text().split(" ")[0].replace(".", ""));
    },
    GetTotalPageCount: function () {
        let totalResult = qogita.GetTotalProductCount();
        let productPerPage = qogita.GetProductPerPage();

        let totalPageCount = Math.ceil(totalResult / productPerPage);

        return totalPageCount <= 417 ? totalPageCount : 417;
    },
    GetProductPerPage: function () {
        return Number($("select.ais-HitsPerPage-select").val());
    },
    GetFidFromURL: function (url = window.location.href) {
        return url.split("/products/")[1].split("/")[0];
    }
};
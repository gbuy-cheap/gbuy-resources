"use strict";
let amazon = {
    InitArbitrage: function () {
        try {
            let minMaxBtnParams = {
                Key: "ArbitragePage",
                MinWidth: "58px",
                MinHeight: "43px",
            };
            common.InitMinMaxButton(minMaxBtnParams);

            if (token) {

                var currUrl = window.location.href;
                var totalPageStr;

                let counter = 0;
                while (counter < 10) {
                    totalPageStr = $(".s-pagination-item")[$(".s-pagination-item").length - counter]?.innerText;
                    counter++;
                    if (!isNaN(totalPageStr)) {
                        break;
                    }
                }

                totalPageStr = totalPageStr || 1;

                let totalPage = parseInt(totalPageStr);

                let domain = common.GetDomain();

                if (domain == "com" || domain == "ca" || domain == "co.uk" || domain == "de" ||
                    domain == "fr" || domain == "it" || domain == "es" || domain == "com.tr") {

                    let domain = common.GetDomain();

                    $('#s-skipLinkTargetForMainSearchResults').prepend(
                        arbcommon.GetPanelTemplate({
                            lang: "en",
                            showExtraFields: true,
                            showEU: true,
                            showNA: true,
                            showSourceEU: true,//domain != "ca" && domain != "com",
                            showSourceNA: true,//domain == "ca" || domain == "com",
                            selectedSourceCountry: domain
                        })
                    );

                    arbcommon.RemoveUAEAndTurkey(false, true);

                    $(`#mysysAnalysisTargetCountry option[value="${domain}"]`).eq(0).prop("disabled", true);

                    $("#arbPanel").css({
                        "width": "265px",
                        "right": "1rem",
                        "z-index": "280"
                    });

                    $("#arbPanel #panelContent").append(arbcommon.GetASINSearcherTemplate());

                    this.BindASINSearchEvent(totalPage);

                    $(".mysys").on("click", ".MysysGetProductsBtn", function () {

                        if (AmazonSearchAuth) {
                            if (arbcommon.GetSelectedCountryCode() && arbcommon.GetSelectedCountry() != "") {
                                if (arbcommon.GetSelectedDomain() != arbcommon.GetSourceCountryDomain()) {
                                    try {
                                        var searchName = "";
                                        if ($('#mysysAnalysisNameInput').val().length > 0) {
                                            searchName = $('#mysysAnalysisNameInput').val();
                                        } else if ($('#twotabsearchtextbox').val().length > 0) {
                                            searchName = $('#twotabsearchtextbox').val();
                                        } else if ($("#s-refinements #brandsRefinements ul li").length > 0) {
                                            searchName = $("#s-refinements #brandsRefinements ul li")[0].innerText.trim().toLowerCase().replaceAll(" ", "-");
                                        }

                                        totalPage = totalPage > arbcommon.MaxTotalPage ? arbcommon.MaxTotalPage : totalPage;

                                        if (!searchName) {
                                            searchName = arbcommon.GenerateArbSearchName();
                                        }

                                        if ($('#mysysModal').length == 0) { $('body').after(arbmodal.GetStructure()); }

                                        arbmodal.SetHeader("Processing&nbsp;" + common.DotsAnimation);

                                        arbmodal.SetComment("<p>The process has been started.</p><p class='ms-text-warning ms-d-flex ms-text-decoration-underline'>" + common.WarningIcon() +
                                            "&nbsp;Please DO NOT close the page or browser until the process is completed.</p>");

                                        arbmodal.SetComment2("<p>Currently processing page: <b> <span id='mysysAmazonCurrProcessingPageSpan'>1</span> / " + totalPage + "</b></p>");

                                        arbmodal.Show();

                                        let jobId = arbcommon.GenerateGUID();

                                        amazon.StartCrawling(currUrl, totalPage, jobId, searchName, domain);

                                    } catch (error) {
                                        errorHandler.SendErrorToAdmin(error);
                                    }
                                } else {
                                    toast.ShowWarning("The source and target country cannot be the same", "Warning");
                                }
                            } else {
                                toast.ShowWarning("Please select a country", "Warning");
                            }
                        } else {
                            arbcommon.RedirectToWholesalerPage();
                        }
                    });

                } else {
                    $('#s-skipLinkTargetForMainSearchResults').prepend(
                        arbcommon.GetWarningPanelTemplate("")
                    );

                    $("#arbWarningPanel").css({
                        "width": "210px",
                        "right": "1rem",
                        "z-index": "280"
                    });

                    $("#arbWarningPanel").append(arbcommon.GetASINSearcherTemplate());

                    $("#arbWarningPanel hr").addClass("ms-d-none");
                }
            } else {
                $('#s-skipLinkTargetForMainSearchResults').prepend(
                    arbcommon.GetWarningPanelTemplate(arbcommon.SessionInvalidErrorEng())
                );

                $("#arbWarningPanel").css({
                    "width": "210px",
                    "right": "1rem",
                    "z-index": "280"
                });
            }

        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    StartCrawling: async function (currUrl, totalPage, jobId, searchName, domain) {
        try {
            let products = [];
            for (let i = 1; i <= totalPage; i++) {
                try {
                    if (arbcommon.CheckProductCountToBeAnalyzed(products.length)) {
                        $('#mysysAmazonCurrProcessingPageSpan').text(i);
                        let returnProducts = await amazon.CrawlAmazonPage(decodeURIComponent(currUrl), i);
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

            let siteId = arbcommon.Sites.amazon;// 21;

            arbcommon.PostAnalysisResult(products, siteId, jobId, searchName, "en");

        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    BindASINSearchEvent: function (totalPageCount) {
        try {
            $(".mysys").on("click", "#searchASIN", async function () {
                $("#searchASIN").addClass("disabled");
                try {
                    var asin = $("#asinToFind").val().toUpperCase().trim();
                    if (asin.length > 0) {
                        if ($("#mysysModal").length == 0) { $('body').after(arbmodal.GetStructure()); }

                        arbmodal.SetHeader("RESULT");
                        arbmodal.SetComment("Searching&nbsp;" + common.DotsAnimation);
                        arbmodal.Show();

                        let foundElement = document.querySelector(`div[data-asin="${asin}"]`);
                        let nextLink = document.querySelector("a.s-pagination-next")?.href;

                        if (!foundElement && nextLink) {

                            let currentPageNumber = document.querySelector("a.s-pagination-next").href.split("page=")[1].split("&")[0];
                            let counter = 1;
                            let response;

                            nextLink = nextLink.replace("page=" + currentPageNumber, "page=currSearchPage");

                            let counterLimit = 50;
                            counterLimit = totalPageCount > counterLimit ? counterLimit : totalPageCount;

                            arbmodal.SetComment2(`Scanning page ${counter}`);
                            while (!response && counter <= counterLimit) {
                                response = await amazon.SearchASINInURL(asin, (nextLink.replace("currSearchPage", counter)));
                                counter++;
                                arbmodal.SetComment2(`Scanning page ${counter}`);
                            }

                            arbmodal.SetComment2("");
                            arbmodal.SetHeader("RESULT");
                            if (response) {
                                counter--;

                                if (response > 0) {
                                    arbmodal.SetComment(`<p>The product you were looking for is the <span class="ms-fw-bold">${response}.</span> product on the <span class="ms-fw-bold">${counter}.</span> page.</p><p><a class="ms-mt-3" target="_blank" href="${nextLink.replace("currSearchPage", counter)}">Go to page</a></p>`);
                                } else {
                                    arbmodal.SetComment(`<p>The product you were looking for was found on the <span class="ms-fw-bold">${counter}.</span> page</p><p><a class="ms-mt-3" target="_blank" href="${nextLink.replace("currSearchPage", counter)}">Go to page</a></p>`);
                                }

                            } else {
                                if (totalPageCount == counterLimit) {
                                    arbmodal.SetComment(`<p class="ms-text-warning">${counterLimit} pages scanned. The product you were looking for was not found on the pages.</p>`);
                                } else {
                                    arbmodal.SetComment(`<p class="ms-text-warning">The product you were looking for was not found on the first ${counterLimit} pages.</p>`);
                                }
                            }

                        } else {

                            arbmodal.SetComment("<p>The product you were looking for was found on the current page</p>");
                        }
                    }
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                } finally {
                    $("#searchASIN").removeClass("disabled");
                }
            });
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    SearchASINInURL: function (asin, url) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: url,
                success: function (response) {
                    try {
                        if ($(`[data-asin='${asin}']`, response).length > 0) {

                            let productIndex = $(`[data-asin='${asin}']`, response)[0]?.dataset?.index;

                            productIndex = parseInt(productIndex) - 1;

                            if (productIndex && productIndex > 0) {
                                resolve(productIndex);
                            } else {
                                resolve(true);
                            }

                        } else {
                            resolve(false);
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                error: function (error) {
                    reject(error);
                }
            });

        });
    },
    InitCompAnalysis: function () {
        try {
            if (AmazonCompAuth) {
                var sellers = [];

                var sellerName = $("h1#sellerName").text();
                var MerchantId = $('#storefront-link a').attr('href')?.split('/shops/')[1]?.split('?')[0]?.trim();
                if (!MerchantId) {
                    MerchantId = window.location.href.split("seller=")[1];
                }

                var positiveFeedBacks;
                var ratings;

                var feedbackText = $('#seller-feedback-summary a').innerText;
                if (feedbackText != undefined) {
                    positiveFeedBacks = feedbackText.split('%')[0].trim();
                    ratings = feedbackText.split('(')[1].replace(/\D/g, '');
                }

                sellers.push({ "sellerName": sellerName, "merchantId": MerchantId, "isFba": "0", "sellerRating": ratings, "positiveFeedBack": positiveFeedBacks });

                $('#about-seller').append('<br><div class="mysys"><div id="mysysCompetitorAnalysis-' + MerchantId + '"  data-api-source="2" class="ms-align-items-center ms-justify-content-center ms-d-flex ms-fs-6 ms-shadow ms-p-2 ms-btn ms-btn-outline-success ms-mt-2 mysys-extension-start-competitor-analysis" style="width:245px;" data-sellername="' + sellerName + '" data-merchant-id="' + MerchantId + '" data-domain="' + domain + '"><img class="ms-me-1" style="width:30px;" src="' + chrome.runtime.getURL("images/icons/icon48.png") + '">Start MySYS Competitor Analysis</div></div>');

                arbcommon.GetUsersCompetitorAnalysisInfos(sellers, common.GetDomain(), 2);

                arbcommon.InitCompAnalysisEvent();
            } else {
                $('#about-seller').append(
                    "<div class='mysys ms-border ms-rounded ms-border-success ms-bg-light ms-p-3 ms-mt-2 ms-shadow' style='width: 210px; right:1rem'>" +
                    arbcommon.WarningMessageEng("Amazon Competitor Analysis") +
                    "</div >"
                )
            }
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    CrawlAmazonPage: async function (currUrl, pageNum) {
        try {
            const pageAllProductInfos = await amazon.GetAmazonPageProducts(currUrl, pageNum);

            if (pageAllProductInfos.length > 0) {
                return pageAllProductInfos;
            }
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    GetAmazonPageProducts: async function (pLink, pageNum) {
        const ProductList = [];

        try {
            await common.Sleep(1000);

            const productsPageHtml = await $.get(pLink + "&page=" + pageNum);

            let html = $(productsPageHtml);

            let asinDivList = $('div[data-asin]:not([data-asin=""])', html);

            let currency = common.GetCurrencySymbol();

            asinDivList.each(function (index) {
                let asin = $(this).attr('data-asin');
                let price = $(this).find(".a-section .a-price .a-offscreen").eq(0).text();

                if (!price) {
                    price = $(this).find("div.sg-row span.a-offscreen").eq(0).text();
                }

                price = crwcommon.AmzSearchPageFindFirstPrice(price, currency);

                if (asin.length > 0 && price && !isNaN(price)) {
                    let imgUrl = $(this).find("img").attr("src");
                    let title = $(this).find(".a-section div.s-title-instructions-style a span").text().trim();
                    let productUrl = `https://${document.location.host}/dp/${asin}?th=1&psc=1`;
                    let star = $('.a-section.a-spacing-none.a-spacing-top-micro span.a-icon-alt', this).eq(0).text()?.split(' ')[0];

                    if (star) {
                        star = common.ConvertToNumber(star);
                    } else {
                        star = 0;
                    }

                    if (!title) {
                        title = $(this).find(".a-truncate-full").text();
                    }

                    var product = {
                        "Barcode": asin,
                        "Title": title,
                        "ProductUrl": productUrl,
                        "Price": price,
                        "Brand": "",
                        "Image": imgUrl,
                        "Star": star,
                        "CurrencyCode": ""
                    }

                    product.CurrencyCode = common.GetCurrencyCode();

                    if (!ProductList.find(x => x.Barcode == asin)) {			// Asin daha önceden listede yoksa ekle
                        ProductList.push(product);
                    }
                } else {
                    common.ConsoleLog(`ASIN: ${asin} , Price: ${price}`);
                }

            });
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }

        return ProductList;
    },
    GetSellersProductsAmazonPageBrands: function (jobId, merchantId, domain) {

        var url = "https://www.amazon." + domain + "/s/other?pickerToList=brandtextbin&me=" + merchantId;

        $.get(url, function (sellerBrandsHtml) {
            try {
                var html = $(sellerBrandsHtml);

                var enabledLetters = $('#indexBarHeader span.pagnLink', html);

                if (enabledLetters.length == 0) {
                    amazon.GetSellersProductsAmazonPage(jobId, merchantId, domain, 1);
                    return;
                }


                var enabledLetterList = [];

                enabledLetters.each(function (index) {
                    var letter = $(this)[0].firstElementChild.text;
                    if (enabledLetterList.indexOf(letter) < 0) {
                        enabledLetterList.push(letter);
                    }
                });

                for (let x = 0; x < enabledLetterList.length; x++) {

                    var letterUrl = "https://www.amazon." + domain + "/gp/search/other/?me=" + merchantId + "&rh=i%3Amerchant-items&pickerToList=brandtextbin&indexField=" + enabledLetterList[x];

                    $.get(letterUrl, function (letterHtml) {
                        var html2 = $(letterHtml);

                        var brands = $('#refinementList span.a-list-item', html2);
                        brands.each(function (index) {
                            var brandLink = $($(this)[0].firstElementChild).attr("href");
                            var brandName = $(this)[0].firstElementChild.text;
                            allBrands.push({ "BrandName": brandName, "Status": 0 });
                            arbmodal.AddComment('Getting the products of the brand "' + brandName + '"<br/>');
                            amazon.GetSellersProductsAmazonPage2(brandLink, brandName, jobId, merchantId, domain, 1);
                        });
                    });

                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });
    },
    GetSellersProductsAmazonPage: function (jobId, merchantId, domain, page) {

        var url = "https://www.amazon." + domain + "/s?me=" + merchantId + "&page=" + page;

        $.get(url, function (sellerProductsHtml) {
            try {
                var ProductList = [];
                var html = $(sellerProductsHtml);

                var totalPagesUL = $('.a-pagination', html);

                var asinDivList = $('div[data-asin]', html);

                asinDivList.each(function (index) {
                    var asin = $(this).attr('data-asin');

                    if (asin.length > 0) {

                        var starDiv = $('.a-section.a-spacing-none.a-spacing-top-micro', this);
                        var star;
                        var rating;

                        if (starDiv.length == 2) {
                            star = $($(starDiv)[0].firstElementChild.firstElementChild).attr('aria-label').split(' ')[0];

                            rating = $($(starDiv)[0].firstElementChild.children[1]).attr('aria-label').replace(',', '');
                        }

                        var product = {
                            "ApiSource": 2,
                            "JobId": jobId,
                            "MerchantId": merchantId,
                            "ASIN": asin,
                            "Star": parseFloat(star) || 0,
                            "Rating": parseInt(rating) || 0,
                            "Domain": domain
                        }

                        ProductList.push(product);
                    }

                });

                if (page == 1) {

                    var totalPageNum = "";
                    if (totalPagesUL[0]) {
                        if ($(totalPagesUL[0].lastElementChild).prev()[0].childElementCount > 0) {
                            totalPageNum = $(totalPagesUL[0].lastElementChild).prev()[0].firstElementChild.innerHTML;
                        } else {
                            totalPageNum = $(totalPagesUL[0].lastElementChild).prev()[0].innerHTML;
                        }
                    } else {
                        totalPageNum = 1;
                    }

                    arbmodal.AddComment('The total page count: <b>' + totalPageNum + '  </b> <br/> Currently inspecting page: <b> <span id="mysysPageNumCurr"></span></b>');
                }
                $('#mysysPageNumCurr').text(page);

                // listeyi sunucuya gönder
                var content = { "Products": ProductList }
                var url = common.HOST + '/api/arbitrage/ArbitrageSaveCompetitorProducts';

                chrome.runtime.sendMessage({ data: content, url: url, type: "m0" }, (response) => {

                    if (response.response?.isSuccess) {
                        if (!totalPagesUL[0]) {
                            arbmodal.AddComment2("<p class='ms-text-success ms-d-flex'>" + common.SuccessIcon + "&nbsp;MySYS Competitor Analysis is done.</p><p>You can close the page.</p>");
                            arbmodal.SetHeader("Done");
                        }
                    } else {
                        console.log("MySYS ArbitrageSaveCompetitorProducts error: " + response.response?.userMessage);
                    }

                });

                // diğer sayfaya geç
                var NextBtn = totalPagesUL[0]?.lastElementChild;
                if (NextBtn) {
                    setTimeout(function () {
                        try {
                            if ($(NextBtn).attr('class').includes("a-disabled") == false) {
                                var NextPageNumHref = $($(NextBtn)[0].firstElementChild).attr('href');
                                var NextPageNum = NextPageNumHref.split('&page=')[1].split('&')[0];

                                amazon.GetSellersProductsAmazonPage(jobId, merchantId, domain, NextPageNum);
                            } else {
                                arbmodal.AddComment2("<p class='ms-text-success ms-d-flex'>" + common.SuccessIcon + "&nbsp;MySYS Competitor Analysis is done.</p><p>You can close the page.</p>");
                                arbmodal.SetHeader("Done");
                            }
                        } catch (error) {
                            errorHandler.SendErrorToAdmin(error);
                        }
                    }, 2000);
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });
    },
    GetSellersProductsAmazonPage2: function (brandLink, brandName, jobId, merchantId, domain, page) {

        setTimeout(() => {
            try {
                if (page != undefined) {
                    var url = brandLink + "&page=" + page;

                    $.get(url, function (sellerProductsHtml) {
                        try {
                            var ProductList = [];
                            var html = $(sellerProductsHtml);

                            var totalPagesUL = $('.a-pagination', html);

                            var asinDivList = $('div[data-asin]', html);

                            asinDivList.each(function (index) {
                                var asin = $(this).attr('data-asin');

                                if (asin.length > 0) {

                                    var starDiv = $('.a-section.a-spacing-none.a-spacing-top-micro', this);
                                    var star;
                                    var rating;

                                    if (starDiv.length == 2) {
                                        star = $($(starDiv)[0].firstElementChild.firstElementChild).attr('aria-label').split(' ')[0];
                                        rating = $($(starDiv)[0].firstElementChild.children[1]).attr('aria-label').replace(',', '');
                                    }

                                    var product = {
                                        "ApiSource": 2,
                                        "JobId": jobId,
                                        "MerchantId": merchantId,
                                        "ASIN": asin,
                                        "Star": parseFloat(star) || 0,
                                        "Rating": parseInt(rating) || 0,
                                        "Domain": domain
                                    }

                                    ProductList.push(product);

                                }

                            });

                            // listeyi sunucuya gönder
                            var content = { "Products": ProductList }
                            var url = common.HOST + '/api/arbitrage/ArbitrageSaveCompetitorProducts';

                            chrome.runtime.sendMessage({ data: content, url: url, type: "m0" }, (response) => {
                                if (!response.response?.isSuccess) {
                                    errorHandler.SendErrorToAdmin("MySYS ArbitrageSaveCompetitorProducts error: " + response.response?.userMessage);
                                }

                            });

                            var NextBtn;
                            if (totalPagesUL[0] != undefined) {
                                NextBtn = totalPagesUL[0].lastElementChild;
                            }

                            if (NextBtn != undefined) {
                                setTimeout(function () {
                                    try {
                                        if ($(NextBtn).attr('class').includes("a-disabled") == false) {
                                            var NextPageNumHref = $($(NextBtn)[0].firstElementChild).attr('href');
                                            var NextPageNum = NextPageNumHref.split('&page=')[1].split('&')[0];

                                            amazon.GetSellersProductsAmazonPage2(brandLink, brandName, jobId, merchantId, domain, NextPageNum);
                                        }
                                    } catch (error) {
                                        errorHandler.SendErrorToAdmin(error);
                                    }
                                }, 2000);

                            } else {
                                amazon.CheckIfBrandFinished(brandName);
                            }
                        } catch (error) {
                            errorHandler.SendErrorToAdmin(error);
                        }
                    });
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        }, 1000);
    },
    CheckIfBrandFinished: function (brandName) {
        try {
            // Biten markayı işaretle.
            for (var i = 0; i < allBrands.length; i++) {
                if (allBrands[i].BrandName == brandName) {
                    allBrands[i].Status = 1;
                    arbmodal.AddComment(brandName + ' is done. <br/>');
                    break;
                }
            }

            // Tüm markarlar tamamlandı ise bitti diye sayfada bilgi ver.
            var finishedCount = 0;
            for (var i = 0; i < allBrands.length; i++) {
                if (allBrands[i].Status == 1) {
                    finishedCount++;
                }
            }

            if (finishedCount == allBrands.length) {
                arbmodal.AddComment2("<p class='ms-text-success ms-d-flex'>" + common.SuccessIcon + "&nbsp;MySYS Competitor Analysis is done.</p><p>You can close the page.</p>");
                arbmodal.SetHeader("Done");
            }
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    }
}


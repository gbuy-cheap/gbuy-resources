"use strict";
let allBrands = [];
let ebay = {
    Init: function () {
        try {
            let minMaxBtnParams = {
                Key: "ArbitragePage",
                MinWidth: "22px",
                MinHeight: "20px",
            };
            common.InitMinMaxButton(minMaxBtnParams);

            if (token) {
                if (EbayCompAuth) {
                    var MerchantId = $('input[name=_ssn]').val();
                    var sellerName = MerchantId;
                    var domain = common.GetDomain("ebay");
                    var sellers = [];

                    $('#soiCont').after('<div class="mysys"><div id="mysysCompetitorAnalysis-' + MerchantId + '" data-api-source="1" class="mysys pointer ms-align-items-center ms-justify-content-center ms-d-flex ms-fs-6 ms-btn ms-btn-outline-success mysys-extension-start-competitor-analysis ms-p-2 ms-position-absolute ms-shadow" style="width: 244px;right: 3.5rem;" data-sellername="' + sellerName + '" data-merchant-id="' + MerchantId + '" data-domain="' + domain + '"><img class="ms-me-1" style="width:30px;z-index:10" src="' + chrome.runtime.getURL("images/icons/icon48.png") + '">Start MySYS Competitor Analysis</div></div>');

                    sellers.push({ "sellerName": sellerName, "merchantId": MerchantId, "isFba": "0", "sellerRating": 0, "positiveFeedBack": 0 });
                    arbcommon.GetUsersCompetitorAnalysisInfos(sellers, domain, 1);

                    arbcommon.InitCompAnalysisEvent();
                } else {
                    $('#soiCont').after(
                        arbcommon.GetWarningPanelTemplate(arbcommon.WarningMessageEng("eBay Competitor Analysis"))
                    );

                    $("#arbWarningPanel").css({
                        "width": "210px",
                        "right": "3.5rem",
                        "z-index": "10"
                    });
                }
            } else {
                $('#soiCont').after(
                    arbcommon.GetWarningPanelTemplate(arbcommon.SessionInvalidErrorEng())
                );

                $("#arbWarningPanel").css({
                    "width": "210px",
                    "right": "3.5rem",
                    "z-index": "10"
                });
            }
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    GetSellersProductsEbay: function (jobId, merchantId, domain, page) {
        try {
            var rootDomain = window.location.origin;

            // kargo gönderimi yapılacak olan ülkeyi ifade eden fcid değeri set ediliyor.
            var fcid;
            if (domain == "co.uk") {
                fcid = 3;
            } else if (domain == "com") {
                fcid = 1;
            } else if (domain == "de") {
                fcid = 77;
            } else if (domain == "it") {
                fcid = 101;
            } else if (domain == "es") {
                fcid = 186;
            } else if (domain == "fr") {
                fcid = 71;
            } else if (domain == "com.tr") {
                fcid = 204;
            } else {
                fcid = 0;
            }

            var url = rootDomain + "/sch/m.html?_nkw=&_armrs=1&_from=&LH_Complete=1&LH_Sold=1&LH_ItemCondition=3&_clu=2&_fcid=" + fcid + "&_localstpos=&_stpos=&gbr=1&_ssn=" + merchantId + "&_ipg=200&rt=nc&_pgn=" + page;

            $.get(url, function (sellerProductsHtml) {
                try {
                    var ProductList = [];
                    var html = $(sellerProductsHtml);

                    merchantId = merchantId.length > 20 ? merchantId.substring(0, 20) : merchantId;
                    $('#ListViewInner', html).children('li').each(function () {

                        var listingId = $(this).attr('listingid');

                        var product = {
                            "ApiSource": 1,
                            "JobId": jobId,
                            "MerchantId": merchantId,
                            "ASIN": listingId,
                            "Star": 0,
                            "Rating": 0,
                            "Domain": domain
                        }

                        ProductList.push(product);
                    });

                    if (page == 1) {
                        var totalPageNum = 1;
                        if ($("#Pagination tbody tr td.pages", html)[0] != undefined) {
                            totalPageNum = $("#Pagination tbody tr td.pages", html)[0].lastElementChild.innerHTML;
                        }
                        arbmodal.AddComment('<p>The total page count: <b>' + totalPageNum + '  </b> <br/> Currently inspecting page: <b> <span id="mysysPageNumCurr"></span></b></p>');
                    }

                    $('#mysysPageNumCurr').text(page);

                    // listeyi sunucuya gönder
                    if (ProductList.length > 0) {
                        var content = { "Products": ProductList }
                        var url = common.HOST + '/api/arbitrage/ArbitrageSaveCompetitorProducts';

                        chrome.runtime.sendMessage({ data: content, url: url, type: "m0" }, (response) => {
                            if (!response.response?.isSuccess) {
                                console.log("MySYS ArbitrageSaveCompetitorProductsEbay error: " + response.response?.userMessage);
                            }
                        });
                    }

                    // diger sayfaya gec
                    setTimeout(function () {
                        try {
                            var IsNextPageBtnDisabled = true;

                            if ($("#Pagination tbody tr td.pagn-next", html)[0] != undefined) {
                                IsNextPageBtnDisabled = $("#Pagination tbody tr td.pagn-next", html)[0].innerHTML.includes("gspr next-d");
                                //var IsLastPage = $("#Pagination tbody tr td.pages")[0].lastElementChild.innerHTML.includes("pg  curr");
                            }

                            if (IsNextPageBtnDisabled == false) {
                                var NextPageNum = $("#Pagination tbody tr td.pagn-next", html)[0].innerHTML.split("_pgn=")[1].split("&")[0];

                                ebay.GetSellersProductsEbay(jobId, merchantId, domain, NextPageNum);

                            } else {
                                arbmodal.AddComment2("<p class='ms-text-success ms-d-flex'>" + common.SuccessIcon + "&nbsp;MySYS Competitor Analysis is done.</p><p>You can close the page.</p>");
                                arbmodal.SetHeader("Done");
                            }
                        } catch (error) {
                            errorHandler.SendErrorToAdmin(error);
                        }
                    }, 2000);
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                }
            });
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    }
}



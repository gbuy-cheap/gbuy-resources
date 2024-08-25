"use strict";
let currencyFromService, asin;
let spinner = "<div class='ms-spinner-border ms-spinner-border-sm' role='status'></div>";
let lowest;
var gridStockOpt, stockDataRows;

var stockChecker = {
    Init: async function (ASIN) {
        try {
            asin = ASIN;
            currencyFromService = common.GetCurrencySymbol();
            this.GetOffers(asin);
            this.BindEvents();
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    FBAs: 0,
    FBMs: 0,
    CalcMyESM: function (rowData,
        fbaSellPricePercent = Number($("#setsFBAPercent").val()),
        fbmMinFeedback = Number($("#setsFBMFeedback").val()),
        fbmMinRating = Number($("#setsFBMRatings").val())) {
        try {
            let FBAs = 0, FBMs = 0;
            let fbaLowestPrice;

            rowData.forEach((data) => {
                if (data?.isfba == "FBA") {
                    let price = common.ConvertToNumber(data.price);
                    if (!fbaLowestPrice) {
                        fbaLowestPrice = Number(price);
                    } else if (fbaLowestPrice && fbaLowestPrice < Number(price)) {
                        fbaLowestPrice = Number(price)
                    }
                }
            })

            rowData.forEach((data) => {
                if (data) {
                    let price = common.ConvertToNumber(data.price);
                    if (fbaLowestPrice) {
                        if (data.isfba == "FBA" && Number(price) <= ((fbaLowestPrice * fbaSellPricePercent / 100) + fbaLowestPrice)) {
                            FBAs++;
                        }
                        if (data.isfba == "FBM" && Number(data.feedback) >= fbmMinFeedback &&
                            Number(data.rating) >= fbmMinRating && Number(price) < fbaLowestPrice) {
                            FBMs++;
                        }
                    } else if (data.isfba == "FBM" && Number(price) == Number(lowest)) {
                        FBMs++;
                    }
                }
            })

            FBMs = FBMs > 0 ? Math.round(FBMs / 2) : FBMs;

            stockChecker.FBMs = FBMs;
            stockChecker.FBAs = FBAs;
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    ConvertToStockGridRow: function (offer) {
        try {
            let domain = common.GetDomain();
            let evaluation = [];

            // offer.sellerName.indexOf("Amazon") >= 0 ? "" :
            //     ((offer.sellerRating == "0" && offer.positiveFeedBack == "0") ? '' :
            //         '<p><i class="a-icon a-icon-star-mini ' + offer.star + ' ms-me-1"></i> '
            //         + offer.positiveFeedBack + '% positive feedback and ' + (offer.sellerRating ?? "0") + ' ratings</p>');

            if (offer.sellerName.indexOf("Amazon") < 0) {
                if (offer.star) {
                    evaluation.push('<i class="a-icon a-icon-star-mini ' + offer.star + ' ms-me-1"></i> ');
                }

                if (offer.positiveFeedBack != "0") {
                    evaluation.push(offer.positiveFeedBack + '% positive feedback');
                }

                if (offer.sellerRating && offer.sellerRating != "0") {
                    evaluation.push(' and ' + offer.sellerRating + ' ratings');
                }
            }

            let row = {
                id: offer.offeringId,
                price: !isNaN(offer.price) ? common.FormatNumber(parseFloat(offer.price).toFixed(2)) : "?",
                status: 'New',
                isfba: offer.isFba == "1" ? 'FBA' : 'FBM',
                seller: offer.sellerName.indexOf("Amazon") < 0 ?
                    `<a class="ms-link-primary" data-seller-id="${offer.merchantId}" href="https://www.amazon.${domain}/s?me=${offer.merchantId}" target="_blank">${offer.sellerName}</a>` :
                    offer.sellerName,
                evaluation: '<p>' + evaluation.join('') + '</p>',
                stockquantity: `<span class="ms-align-items-stretch ms-d-flex ms-justify-content-end stock" data-session-id="${offer.sessionId}" data-offering-id="${offer.offeringId}" data-isFba="${offer.isFba}" data-positiveFeedBack="${offer.positiveFeedBack}" data-sellerRating="${offer.sellerRating}" ><button class="ms-align-items-center ms-btn ms-btn-outline-light-blue ms-border-0 ms-btn-sm ms-d-flex ms-justify-content-center getSellerStockCount" style="width: 24px;height: 24px;font-size: 20px!important">↻</button></span>`,
                feedback: Number(offer.positiveFeedBack),
                rating: Number(offer.sellerRating),
                star: offer.star && offer.star.length > 0 && offer.star[0] ? offer.star[0].split('a-star-mini-')[1].replaceAll('-', '.') : 0
            }

            return row;
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    AutoSizeSellerColumn: function (skipHeader = false) {
        try {
            if (gridStockOpt) {
                gridStockOpt.suppressColumnVirtualisation = true;
                gridStockOpt.columnApi.autoSizeColumn("seller", skipHeader);
            }
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    AutoSizeAll: function (skipHeader = false) {
        try {
            if (gridStockOpt) {
                const allColumnIds = [];
                gridStockOpt.columnApi.getAllColumns().forEach((column) => {
                    allColumnIds.push(column.colId);
                });

                gridStockOpt.columnApi.autoSizeColumns(allColumnIds, skipHeader);
            }
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    BindEvents: async function () {
        $(".mysys").on("change", "#minRating", function (e) {
            $("#setsMinRating").val($("#minRating").val());
        });

        $(".mysys").on("change", "#minFBack", function (e) {
            $("#setsMinFBack").val($("#minFBack").val());
        });

        $(".mysys").on("click", "#stockAmzFilter", function (e) {
            try {
                e.stopPropagation();
                if (gridStockOpt) {
                    $("#stockAmzFilter").toggleClass("bg-light-orange ms-text-dark");

                    let filterConditions = null;
                    if ($("#stockAmzFilter").hasClass("bg-light-orange")) {
                        filterConditions = {
                            condition1: {
                                type: 'contains',
                                filter: 'Amazon',
                            },
                            operator: 'AND',
                            condition2: {
                                type: 'notContains',
                                filter: 'www.amazon'
                            }
                        }
                    }

                    var stockFilterComponent = gridStockOpt.api.getFilterInstance('seller');
                    stockFilterComponent.setModel(filterConditions);
                    gridStockOpt.api.onFilterChanged();
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });

        $(".mysys").on("click", "#stockFBAFilter", function (e) {
            try {
                e.stopPropagation();
                if (gridStockOpt) {
                    $("#stockFBAFilter").toggleClass("bg-light-blue ms-text-dark");

                    let filterCondition = null;
                    if ($("#stockFBAFilter").hasClass("bg-light-blue")) {
                        filterCondition = {
                            type: 'contains',
                            filter: 'FBA',
                        };
                    }
                    var stockFilterComponent = gridStockOpt.api.getFilterInstance('isfba');
                    stockFilterComponent.setModel(filterCondition);

                    gridStockOpt.api.onFilterChanged();
                }

            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });

        $(".mysys").on("click", "#stockLowestFilter", function (e) {
            try {
                e.stopPropagation();
                if (gridStockOpt) {
                    $("#stockLowestFilter").toggleClass("ms-bg-danger ms-text-white");

                    let filterCondition = null;
                    if ($("#stockLowestFilter").hasClass("ms-bg-danger")) {
                        filterCondition = {
                            type: 'contains',
                            filter: $("#spLowest").text(),
                        };
                    }

                    var stockFilterComponent = gridStockOpt.api.getFilterInstance('price');
                    stockFilterComponent.setModel(filterCondition);
                    gridStockOpt.api.onFilterChanged();
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });

        $(".mysys").on("click", "#stockResetFilter", function (e) {
            try {
                e.stopPropagation();
                if (gridStockOpt) {
                    $("#stockAmzFilter").removeClass("bg-light-orange ms-text-dark");
                    $("#stockFBAFilter").removeClass("bg-light-blue ms-text-dark");
                    $("#stockLowestFilter").removeClass("ms-bg-danger ms-text-white");
                    gridStockOpt.api.setFilterModel(null);
                    gridStockOpt.api.onFilterChanged();
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });

        $(".mysys").on("click", "#openStockModal", function () {
            try {
                let parentSection = $(this).parents("section").eq(0);

                $(parentSection).removeClass("ms-container");
                $(parentSection).addClass("ms-container-fluid");

                $(parentSection).appendTo("#commonModal .ms-modal-body");
                $("#stockGrid").css("width", "100%");

                let modalBodyHeight = $("#commonModal .ms-modal-body").height();

                let originalStockGridHeight = $("#stockGrid").height();
                $("#stockGrid").css("height", (modalBodyHeight - 110) + "px");
                $("#stockGrid").css("max-height", (modalBodyHeight - 110) + "px");

                gridStockOpt?.api.sizeColumnsToFit();

                $("#openStockModal").addClass("ms-d-none");

                $(".mysys").on("click", "#commonModalCloseBtn", function () {
                    $(".mysys").off("click", "#commonModalCloseBtn");
                    try {
                        $(parentSection).appendTo("main#stockChecker");
                        $(parentSection).addClass("ms-container");
                        $(parentSection).removeClass("ms-container-fluid");
                        stockChecker.SetGridWidth();
                        $("#stockGrid").css("height", (originalStockGridHeight) + "px");
                        $("#stockGrid").css("max-height", (originalStockGridHeight) + "px");
                        $("#openStockModal").removeClass("ms-d-none");
                        stockChecker.AutoSizeAll();
                    } catch (error) {
                        errorHandler.SendErrorToAdmin(error);
                    }
                });
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });

        $(".mysys").on("click", ".getSellerStockCount", function (e) {
            e.stopPropagation();
            $(this).attr("disabled", "disabled");
            let sessionId = stockChecker.GetSessionId();
            let offeringId = $(this).parents("span").eq(0).attr("data-offering-id");
            let list = [];
            list.push({ "domain": common.GetDomain(), "asin": asin, "sessionId": sessionId, "offeringId": offeringId });
            myLoop(list);
        });

        var tabEl = document.querySelector('#stockChecker-tab[data-bs-toggle="tab"]');

        if (!tabEl) {
            await common.Sleep(3000);
            tabEl = document.querySelector('#stockChecker-tab[data-bs-toggle="tab"]');
        }

        tabEl.addEventListener('shown.bs.tab', (event) => {
            setTimeout(() => {
                try {
                    this.SetGridWidth();
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                }
            }, 300);
        });

        $(document).on("click", "#buyboxStats", function () {
            common.ShowSpinner();

            let that = $(this);
            $(that).addClass("disabled");

            let asin = GetASIN(),
                domain = common.GetDomain(),
                daysInterval = settings.GetBuyboxStatsDaysInterval();

            try {
                if ($(`#commonModal #divBuyboxStats #tblBuyboxStats[data-days-interval="${daysInterval}"]`).length > 0) {
                    $("#commonModal #divBuyboxStats").removeClass("ms-d-none");
                    stockChecker.ShowBuyboxStatsModal();
                    $(that).removeClass("disabled");
                    common.HideSpinner();
                } else {
                    $("#commonModal .ms-spinner-border").removeClass("ms-invisible");

                    chrome.storage.local.get(['mysysToken'], function (result) {
                        if (result?.mysysToken) {
                            chrome.runtime.sendMessage(
                                {
                                    method: 'GET',
                                    url: `${common.HOST}/api/amazon/buyboxstats?ASIN=${asin}&domain=${domain}&daysInterval=${daysInterval}`,
                                    type: "m0",
                                }, (response) => {
                                    if (response?.response?.isSuccess) {
                                        let buyboxStats = common.ConvertToJSON(response.response.paramStr);

                                        if (buyboxStats?.length > 0) {
                                            $("#commonModal div.ms-modal-body #divBuyboxStats").remove();
                                            stockChecker.ShowBuyboxStatsModal();

                                            let table =
                                                `<table id="tblBuyboxStats" class="ms-bg-white ms-rounded ms-table ms-table-hover" data-days-interval="${daysInterval}">
                                                    <thead>
                                                        <tr>
                                                            <th>Seller</th>
                                                            <th><span class="mys-tooltip help">Percentage Won (%)<span class="mys-tooltiptext mys-tooltip-top" style="margin-left:-90px;">Approximation of the percentage the seller won the Buybox</span></span></th>
                                                            <th>Is FBA?</th>
                                                            <th><span class="mys-tooltip help">Avg. Price (${currencyFromService})<span class="mys-tooltiptext mys-tooltip-top" style="margin-left:-90px;">Avg. price of the Buybox offer of the seller</span></span></th>
                                                            <th><span class="mys-tooltip help">Last Buybox Date<span class="mys-tooltiptext mys-tooltip-top" style="margin-left:-90px;">Last time the seller won the Buybox</span></span></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody></tbody>
                                                </table>`;

                                            let trElem = "";
                                            for (let index = 0; index < buyboxStats.length; index++) {
                                                const buyboxStatsElem = buyboxStats[index];
                                                let sellerName = $(`#stockGrid a[data-seller-id="${buyboxStatsElem.SellerId}"]`).eq(0).text();

                                                if (buyboxStatsElem.SellerId == "ATVPDKIKX0DER") {
                                                    sellerName = "Amazon";
                                                }

                                                let bgColor = "";

                                                if (sellerName == "Amazon") {
                                                    bgColor = "bg-light-orange";
                                                } else if (buyboxStatsElem.IsFBA) {
                                                    bgColor = "bg-light-blue";
                                                }

                                                trElem +=
                                                    `<tr class="${bgColor}">
                                                        <td><a class="ms-link-primary" href="https://www.amazon.${domain}/s?me=${buyboxStatsElem.SellerId}" target="_blank">${sellerName ? sellerName : buyboxStatsElem.SellerId}</a></td>
                                                        <td>${buyboxStatsElem.PercentageWon.toFixed(2)}</td>
                                                        <td>${buyboxStatsElem.IsFBA ? "FBA" : "FBM"}</td>
                                                        <td>${buyboxStatsElem.AveragePrice}</td>
                                                        <td>${buyboxStatsElem.LastSeenDateTimeString}</td>
                                                    </tr>`;
                                            }

                                            $("#commonModal div.ms-modal-body").prepend("<div id='divBuyboxStats'></div>")

                                            $("#commonModal div.ms-modal-body #divBuyboxStats").prepend(`<h4 id='buyboxStatsHeader' class='ms-mb-2 ms-p-0'>Buybox Statistics (${daysInterval} days)</h4>`);
                                            $("#commonModal div.ms-modal-body #divBuyboxStats #buyboxStatsHeader").after(`
                                            <div class="ms-text-end ms-mb-2"><a id="buyboxExportToExcel" href="javascript:;" class="ms-btn ms-btn-success ms-text-decoration-none ms-text-white">Export to Excel</a></div>
                                            `);
                                            $("#commonModal div.ms-modal-body #divBuyboxStats").append(table);

                                            $("#commonModal #tblBuyboxStats").append(trElem);

                                            $("#tblBuyboxStats td, #tblBuyboxStats th").addClass("ms-p-1");
                                            $("#tblBuyboxStats th").css("font-size", "14px");
                                        } else {
                                            toast.ShowWarning("Buybox statistics not found");
                                        }
                                    } else {
                                        if (response?.response?.statusCode == 500) {
                                            errorHandler.SendErrorToAdmin("buyboxStats: " + response?.response?.userMessage);
                                        } else {
                                            stockChecker.ShowBuyboxStatsModal();
                                            $("#commonModal .ms-modal-body").append(
                                                `<section id="userMessage"><div class="ms-px-5 ms-py-3">${response?.response?.userMessage}</div></section>`
                                            );
                                            $("#commonModal .ms-modal-body *").addClass("ms-fs-5");
                                            $("#commonModal .ms-modal-dialog").css("height", "310px");
                                            $("#commonModal .ms-modal-dialog .ms-modal-content").css("min-height", "inherit");
                                        }
                                    }

                                    common.HideSpinner();
                                    $(that).removeClass("disabled");
                                });
                        } else {
                            toast.ShowWarning("Session is timed-out or invalid. Please sign in.");
                            $(that).removeClass("disabled");
                        }
                    });
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
                common.HideSpinner();
            }
        });

        $(".mysys").on("click", "#svgExportStocksToExcel", function (e) {
            e.stopPropagation();
            e.preventDefault();

            try {
                if (stockDataRows) {
                    let excelData = [];
                    let priceColumnName = `PRICE ${common.GetCurrencySymbol()}`;

                    stockDataRows.forEach((stockItem) => {
                        let sellerEvaluation = [];

                        if (stockItem.star) {
                            sellerEvaluation.push(`${stockItem.star} star(s)`);
                        }

                        if (stockItem.feedback) {
                            sellerEvaluation.push(`${stockItem.feedback}% positive feedback`);
                        }

                        if (stockItem.rating) {
                            sellerEvaluation.push(`${stockItem.rating} ratings`);
                        }

                        let stockQuantity = Number($(stockItem.stockquantity).text());

                        let excelRow = {
                            "SELLER": stockItem.seller == "Amazon" ? stockItem.seller : $(stockItem.seller).text(),
                            [priceColumnName]: stockItem.price,
                            "STOCK": isNaN(stockQuantity) ? "-" : stockQuantity,
                            "IS FBA?": stockItem.isfba,
                            "SELLER EVALUATION": sellerEvaluation.length > 0 ? sellerEvaluation.join(', ') : '',
                            "STATUS": stockItem.status
                        }

                        excelData.push(excelRow);
                    });

                    let currentDate = new Date();
                    let currentDateStr = `${currentDate.getMonth() + 1}_${currentDate.getDate()}_${currentDate.getFullYear()}_${currentDate.getHours()}_${currentDate.getMinutes()}`;
                    let excelFileName = `stocks_${$("#spASIN").text()}_${currentDateStr}`;

                    exporter.DownloadAsExcel(excelData, excelFileName);
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });

        $(".mysys").on("click", "#buyboxExportToExcel", function (e) {
            e.stopPropagation();
            e.preventDefault();

            try {
                let excelData = [];
                let priceColumnName = `AVG. PRICE (${common.GetCurrencySymbol()})`;

                $("#tblBuyboxStats tbody tr").each(function () {
                    let excelRow = {
                        "SELLER": $(this).find("td").eq(0).text()?.trim(),
                        "PERCENTAGE WON (%)": $(this).find("td").eq(1).text()?.trim(),
                        "IS FBA?": $(this).find("td").eq(2).text()?.trim(),
                        [priceColumnName]: $(this).find("td").eq(3).text()?.trim(),
                        "LAST BUYBOX DATE": $(this).find("td").eq(4).text()?.trim()
                    };

                    excelData.push(excelRow);
                });

                let currentDate = new Date();
                let currentDateStr = `${currentDate.getMonth() + 1}_${currentDate.getDate()}_${currentDate.getFullYear()}_${currentDate.getHours()}_${currentDate.getMinutes()}`;
                let excelFileName = `buybox_stats_${$("#spASIN").text()}_${currentDateStr}`;

                exporter.DownloadAsExcel(excelData, excelFileName);
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });
    },
    ShowBuyboxStatsModal: function () {
        $("#commonModal").modal("show");
        $("#commonModal").css("display", "flex");
        $("#commonModal").addClass("ms-justify-content-center");
        $("#commonModal .ms-modal-dialog").css("width", "900px");
        $("#commonModal .ms-modal-body").addClass("ms-px-5 ms-py-3");
        $("#commonModal section").remove();
        $("#commonModal .ms-modal-dialog").css("height", "500px");
        $("#commonModal .ms-spinner-border").addClass("ms-invisible");

        $(".mysys").on("click", "#commonModalCloseBtn", function () {
            $(".mysys").off("click", "#commonModalCloseBtn");
            try {
                $("#commonModal").css("display", "none");
                $("#commonModal").removeClass("ms-justify-content-center");
                $("#commonModal .ms-modal-dialog").css("width", "inherit");
                $("#commonModal .ms-modal-body").removeClass("ms-px-5 ms-py-3");
                $("#commonModal #divBuyboxStats").addClass("ms-d-none");
                $("#commonModal .ms-modal-dialog").css("height", "inherit");
                $("#commonModal #userMessage").remove();

            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });
    },
    GetOffers: function (asin) {

        common.GetAmazonOffers(asin, common.GetDomain()).
            then((offerData) => {
                try {
                    if (offerData.offers?.length > 0) {
                        let rowData = AddOfferToRows(offerData.offers);

                        SetOffersToContent(rowData);

                        stockDataRows = [];
                        stockDataRows.push(...rowData);
                    }
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                }
            }).catch((err) => {
                if (err != "No response") {
                    errorHandler.SendErrorToAdmin(err);
                }
                $("#spFBMOffers").html("-");
                $("#spFBAOffers").html("-");
                $("#spLowest").text("-");
                $("#spMyEstSales").text("-");
            })
    },
    CanUserGetStockCount: function () {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                type: "m0",
                url: common.HOST + "/api/amazon/stockcount",
                method: 'GET'
            }, (response) => {
                if (response?.response?.isSuccess) {
                    resolve(response.response.paramBool);
                } else {
                    reject(response?.response?.userMessage);
                }
            });
        })
    },
    GetStockResult: function (offeringId, domain) {
        return new Promise((resolve, reject) => {
            let resultStock = "N/A";

            chrome.runtime.sendMessage({
                url: `https://www.amazon.${domain}/gp/cart/view.html?ref_=nav_cart`,
                type: 'simple'
            }, response => {
                try {
                    if (response?.response) {
                        let SellerMaxLimitPerCustomer = response.response.indexOf(' from this seller has a limit of ') > 0 ? 'MAX ' : '';

                        const parser = new DOMParser();
                        const htmlDocument = parser.parseFromString(response.response, "text/html");

                        let requestID = htmlDocument.documentElement.querySelector('input[name=requestID]')?.value;
                        let timeStamp = htmlDocument.documentElement.querySelector('input[name=timeStamp]')?.value;
                        let token = htmlDocument.documentElement.querySelector('input[name=token]')?.value;

                        let uri = decodeURIComponent(offeringId);
                        let itemId;
                        htmlDocument.documentElement.querySelectorAll('div[data-encoded-offering]').forEach(async (element, index) => {
                            itemId = element.getAttribute('data-itemid');
                            let offeringID = element.getAttribute('data-encoded-offering');
                            let stock = element.getAttribute('data-quantity');
                            let itemCount = element.getAttribute('data-item-count');
                            let minquantity = element.getAttribute('data-minquantity');
                            let price = element.getAttribute('data-price');

                            if (offeringID == uri) {
                                resultStock = SellerMaxLimitPerCustomer + stock;

                                let content = {
                                    domain: domain, timeStamp: timeStamp, token: token, requestID: requestID, itemId: itemId,
                                    activeItems: '0|' + itemId + '|' + itemCount + '|0|' + stock + '|' + price + '||||0|Layaway_Launch_Program_Sample_2021_09_08|'
                                }

                                await stockChecker.RemoveCard(content);
                            }
                        });

                        resolve(resultStock);
                    } else {
                        reject(response);
                    }
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                }
            });
        });
    },
    SummarizeSellersInfo: function () {
        try {
            let sellersInfo = "";
            let domain = common.GetDomain();

            $('.ag-center-cols-container div[role="row"]:has(div[col-id="seller"])').each((index, elem) => {
                let starCount = $("div[col-id='evaluation'] i.a-icon", elem)[0]?.className.split("a-star-mini-")[1]?.split(" ")[0].replace("-", ".");
                let feedback = $("div[col-id='evaluation']", elem).text()?.split("%")[0];
                let ratings = $("div[col-id='evaluation']", elem).text()?.split("and")[1]?.split("rating")[0]?.trim();

                let sellerObj = {
                    Domain: domain,
                    SellerName: $("div[col-id='seller']", elem).text(),
                    Price: $("div[col-id='price']", elem).text(),
                    SellerType: $("div[col-id='isfba']", elem).text(),
                    StarCount: starCount,
                    Feedback: feedback,
                    Rating: ratings
                };

                sellersInfo += common.SummarizeSellerInfo(sellerObj) + "\n";
            });

            sellersInfo = sellersInfo.trim();

            $("#pSellersInfo").html(sellersInfo);
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    SetGridWidth: function () {
        stockChecker.AutoSizeSellerColumn();
        let sgWidth = parseInt($("#mysc-main-div").width() - 24);
        $("#stockGrid").css("width", (sgWidth || "410") + "px");
    },
    GetSessionId: function () {
        let sessionId = document.querySelector("#attach-sessionId")?.value;
        if (!sessionId && document.querySelectorAll("script[data-a-state*='detailpage-imageblock']")[0] &&
            document.querySelectorAll("script[data-a-state*='detailpage-imageblock']")[0].innerHTML != "") {
            sessionId = JSON.parse(document.querySelectorAll("script[data-a-state*='detailpage-imageblock']")[0].innerHTML).sushiMetricsConfig.sessionId;
        }
        if (!sessionId) {
            sessionId = document.querySelector("a[href*='sessionId']")?.attributes["href"]?.value?.split("sessionId=")[1];
        }
        if (!sessionId) {
            sessionId = document.querySelector("[name='verificationSessionID']")?.value;
        }
        if (!sessionId) {
            sessionId = document.getElementById("session-id")?.value;
        }
        if (!sessionId) {
            console.log("sessionNotFound");
        }

        return sessionId;
    },
    RemoveCard: function (content) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ content: content, type: "m5" }, (response) => {
                resolve(response?.response);
            });
        })
    }
}

function SetOffersToContent(gridRows) {
    try {
        let FBAs = gridRows.filter(data => data.isfba.indexOf("FBA") > -1);
        let FBMCount = gridRows.length - FBAs.length;

        $("#spFBMOffers").html(FBMCount);
        if (FBMCount <= 1) {
            $("#spFBMOffers").parent().eq(0)?.html($("#spFBMOffers").parent().eq(0).html()?.replace("&nbsp;Offers", "&nbsp;Offer"));
        }

        $("#spFBAOffers").html(FBAs.length);
        if (FBAs.length <= 1) {
            $("#spFBAOffers").parent().eq(0)?.html($("#spFBAOffers").parent().eq(0).html()?.replace("&nbsp;Offers", "&nbsp;Offer"));
        }

        setData2AgGrid(gridRows);

        $("#spLowest").text(!isNaN(lowest) ? common.FormatNumber(lowest) : "N/A");

        if ($("#spLowest").text().indexOf("N/A") > -1) {
            $("#spLowest").siblings(".currency").eq(0).addClass("ms-d-none");
        }

        BindGetStockAllEvent();
        BindGetStockFBAEvent();
    } catch (error) {
        errorHandler.SendErrorToAdmin(error);
    }
}

function AddOfferToRows(Offers) {
    try {
        let rowData = [];
        Offers.forEach(offer => {
            if ((!lowest || isNaN(lowest)) ||
                (!isNaN(offer.price) && Number(lowest) > Number(parseFloat(offer.price).toFixed(2)))) {
                lowest = parseFloat(offer.price).toFixed(2);
            }

            let row = stockChecker.ConvertToStockGridRow(offer);

            rowData.push(row);
        });

        return rowData;
    } catch (error) {
        errorHandler.SendErrorToAdmin(error);
    }
}

function BindGetStockFBAEvent() {
    $(".mysys").on("click", "#getStockFBA", function (e) {
        e.stopPropagation();
        $("#getStockAll").addClass("disabled");
        $("#getStockFBA").addClass("disabled");
        $(".getSellerStockCount").addClass("disabled");
        stockChecker.CanUserGetStockCount().then((result) => {
            try {
                if (result) {
                    let list = [];
                    var positiveFeedBackMin = parseInt($('#minFBack').val());
                    var sellerRatingMin = parseInt($('#minRating').val());

                    $('span.stock').each(function (index) {

                        let sessionId = stockChecker.GetSessionId();

                        var offeringId = $(this).attr("data-offering-id");

                        var isFba = $(this).attr("data-isFba");
                        var positiveFeedBack = $(this).attr("data-positiveFeedBack");
                        var sellerRating = $(this).attr("data-sellerRating");

                        sellerRating = sellerRating.replace(',', "");

                        if (isFba == '1' || (parseInt(positiveFeedBack) >= positiveFeedBackMin && parseInt(sellerRating) >= sellerRatingMin)) {
                            list.push({ "domain": common.GetDomain(), "asin": asin, "sessionId": sessionId, "offeringId": offeringId });
                        }
                    });

                    myLoop(list);
                } else {
                    toast.ShowWarning("You have exceeded the stock-count request limit.<br>Stocks counts will not be displayed until 24 hours later.<br>If you do not want to wait, <a href='" + stockChecker.premiumlink + "' target='_blank'> can upgrade to Premium.</a>")
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        }).catch((err) => {
            toast.ShowError(err, "Error");
            errorHandler.SendErrorToAdmin(err);
        });
    });
}

function BindGetStockAllEvent() {
    $(".mysys").on("click", "#getStockAll", function (e) {
        e.stopPropagation();
        $("#getStockAll").addClass("disabled");
        $("#getStockFBA").addClass("disabled");
        $(".getSellerStockCount").addClass("disabled");
        stockChecker.CanUserGetStockCount().then(async (result) => {
            try {
                if (result) {
                    let list = [];
                    $('span.stock').each(function (index) {
                        let sessionId = stockChecker.GetSessionId();

                        var offeringId = $(this).attr("data-offering-id");

                        list.push({ "domain": common.GetDomain(), "asin": asin, "sessionId": sessionId, "offeringId": offeringId });
                    });

                    myLoop(list);
                } else {
                    $("#getStockAll").addClass("disabled");
                    $("#getStockFBA").addClass("disabled");
                    $(".getSellerStockCount").addClass("disabled");
                    toast.ShowWarning("You have exceeded the stock-count request limit.<br>Stocks counts will not be displayed until 24 hours later.<br>If you do not want to wait, <a href='" + (await common.GetPremiumLink()) + "' target='_blank'> can upgrade to Premium.</a>")
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        }).catch((err) => {
            toast.ShowError(err, "Error");
            errorHandler.SendErrorToAdmin(err);
        });
    });
}

function myLoop(list, myLoopIndex = 0) {
    try {
        if (list[myLoopIndex]) {
            $('span[data-offering-id="' + list[myLoopIndex].offeringId + '"]').html(spinner);
            $('span[data-offering-id="' + list[myLoopIndex].offeringId + '"]').removeClass("ms-text-dark ms-badge ms-bg-warning ms-fs-7 ms-align-items-stretch ms-d-flex ms-justify-content-end");

            setTimeout(function () {
                try {
                    var content = { "domain": list[myLoopIndex].domain, "asin": list[myLoopIndex].asin, "sessionId": list[myLoopIndex].sessionId, "offeringId": list[myLoopIndex].offeringId };

                    chrome.runtime.sendMessage({ content: content, type: "m4" }, async (response) => {
                        try {
                            if (response && response.response) {

                                let resultStock = await stockChecker.GetStockResult(content.offeringId, content.domain);

                                let rowNode = gridStockOpt.api.getRowNode(content.offeringId);

                                if (rowNode) {
                                    rowNode.setDataValue('stockquantity',
                                        '<span class="stock ms-text-dark ms-badge ms-bg-warning ms-fs-7" ' +
                                        'data-session-id="' + content.sessionId + '" ' +
                                        'data-offering-id="' + content.offeringId + '" ' +
                                        'data-isFba="' + $(rowNode.data.stockquantity).attr("data-isFba") + '" ' +
                                        'data-positiveFeedBack="' + $(rowNode.data.stockquantity).attr("data-positiveFeedBack") + '" ' +
                                        'data-sellerRating="' + $(rowNode.data.stockquantity).attr("data-sellerRating") + '" ' +
                                        'data-stock="' + resultStock + '">' +
                                        '<b>' + resultStock + '</b>' +
                                        '</span>'
                                    );

                                    $('span[data-offering-id="' + content.offeringId + '"]').addClass("stock ms-text-dark ms-badge ms-bg-warning ms-fs-7");
                                    $('span[data-offering-id="' + content.offeringId + '"]').html('<b>' + resultStock + '</b>');
                                }
                            } else {
                                errorHandler.SendErrorToAdmin(response);
                                $('[data-offering-id="' + content.offeringId + '"]').html('err ');
                            }
                        } catch (error) {
                            errorHandler.SendErrorToAdmin(error);
                        }
                    });

                    myLoopIndex++;
                    if (myLoopIndex < list.length) {
                        myLoop(list, myLoopIndex);
                    } else {
                        $("#getStockAll").removeClass("disabled");
                        $("#getStockFBA").removeClass("disabled");
                        $(".getSellerStockCount").removeClass("disabled");
                    }
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                }
            }, 3000)
        } else {
            myLoopIndex++;
            if (myLoopIndex < list.length) {
                myLoop(list, myLoopIndex);
            } else {
                $("#getStockAll").removeClass("disabled");
                $("#getStockFBA").removeClass("disabled");
                $(".getSellerStockCount").removeClass("disabled");
            }
        }
    } catch (error) {
        errorHandler.SendErrorToAdmin(error);
    }
}

function setData2AgGrid(rowData) {
    try {
        let numberFormatDomain = common.GetDomainBySelectedLanguage();

        var columnDefs = [
            {
                headerName: "Seller", field: "seller",
                cellClass: ['ms-fw-bold', "ms-d-flex", "ms-align-items-center"],
                cellRenderer: 'defaultRenderer',
                maxWidth: 265,
                comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                    valueA = valueA.indexOf('</a>') < 0 ? valueA : valueA.split('</a>')[0]?.split('">')[1]?.trim().toLowerCase();
                    valueB = valueB.indexOf('</a>') < 0 ? valueB : valueB.split('</a>')[0]?.split('">')[1]?.trim().toLowerCase();

                    if (valueA == valueB) {
                        return 0;
                    }
                    return (valueA > valueB) ? 1 : -1;
                }
            },
            {
                headerName: `Price ${currencyFromService}`, field: "price",
                cellClass: ['ms-fw-bold', 'ms-text-end'],
                type: 'numericColumn',
                width: 60,
                comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                    return common.GridNumberColumnComparer(valueA, valueB, numberFormatDomain);
                }
            },
            {
                headerName: "Stock", field: "stockquantity",
                cellRenderer: 'defaultRenderer',
                cellClass: ['ms-fw-bold', 'ms-text-end'],
                type: 'numericColumn',
                width: 52,
                comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                    return common.GridNumberColumnComparer($("b", valueA).text(), $("b", valueB).text(), numberFormatDomain);
                }
            },
            {
                headerName: "Is FBA?", field: "isfba",
                cellClass: ["ms-d-flex", "ms-align-items-center"],
                cellClassRules: {
                    'ms-fw-bold': function (param) { return param.value == 'FBA' }
                },
                width: 62
            },
            {
                headerName: "Seller Evaluation", field: "evaluation",
                cellRenderer: "defaultRenderer",
                width: 315
            },
            {
                headerName: "Status", field: "status",
                cellClass: ['ms-fw-bold', "ms-d-flex", "ms-align-items-center"],
                width: 60
            }
        ];

        var gridOptions = {
            defaultColDef: {
                sortable: true,
                filter: true,
                resizable: true,
            },
            columnDefs: columnDefs,
            components: {
                defaultRenderer: (param) => {
                    return param.value;
                }
            },
            getRowNodeId: function (data) {
                return data.id;
            },
            rowBuffer: 9999,
            animateRows: true,
            suppressColumnVirtualisation: true,
            rowClassRules: {
                'bg-light-orange': function (params) { return params.data.seller.indexOf("Amazon") >= 0; },
                'bg-light-blue': function (params) { return params.data.isfba === "FBA" && params.data.seller.indexOf("Amazon") < 0; },
                'ms-text-danger': function (params) { return common.ConvertToNumber(params.data.price) == lowest }
            },
            enableCellChangeFlash: true
        };

        var eGridDiv = document.getElementById('stockGrid');
        if (eGridDiv) {
            eGridDiv.innerHTML = "";
            new agGrid.Grid(eGridDiv, gridOptions);
            gridOptions.api.setRowData(rowData);
            gridStockOpt = gridOptions;

            let gridHeight = rowData.length * gridOptions.rowHeight + (gridOptions.headerHeight ?? 32) + 50;
            if (gridHeight) {
                $("#stockGrid").css("height", gridHeight + "px");
            } else {
                $("#stockGrid").css("height", "400px");
            }
        }

        stockChecker.AutoSizeSellerColumn();

        stockChecker.CalcMyESM(rowData);

        stockChecker.SummarizeSellersInfo();
    } catch (error) {
        errorHandler.SendErrorToAdmin(error);
    }
}




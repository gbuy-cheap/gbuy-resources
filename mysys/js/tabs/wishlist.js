var gridWishlistOption;
var wishlistRowData;
var wishlist = {
    Init: function (ASIN) {
        try {
            this.SetInitialEvents();

            this.ResetPanel();

            crwcommon.GetReviewCount(ASIN).then(reviewCount => {
                $("#wlReviewCount").val(reviewCount);
            });
            $("#wlPrice").val(document.getElementById("fbaSellInput")?.value);

            this.GetWishlist().then((wishlist) => {
                try {
                    let rowData = [];

                    wishlist.forEach(wishlistItem => {
                        rowData.push(
                            this.ConvertToWishlistRow(wishlistItem)
                        );

                        if (wishlistItem.ASIN == ASIN) {
                            $("#spWlItem abbr").html(
                                '<svg id="wlAlert" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" ' +
                                'class="pointer ' + this.GetTextColorByImportance(wishlistItem.IMPORTANCE) + '" viewBox="0 0 16 16">' +
                                '<path d="M2 15.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v13.5zM8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z"/>' +
                                '</svg>');

                            $("#wlItemId").val(wishlistItem.ID);
                            $("#wlASIN").val(wishlistItem.ASIN);

                            $('#wlImportance option[value="' + wishlistItem.IMPORTANCE + '"]').prop('selected', true);
                            $("#wlImportance").trigger("change");

                            $("#wlTitle").val(wishlistItem.TITLE);
                            $("#wlNote").val(wishlistItem.NOTE);

                            $(".mysys").on("click", "#wlAlert", () => {
                                var someTabTriggerEl = document.querySelector('#wishlist-tab');
                                var tab = new bootstrap.Tab(someTabTriggerEl);

                                tab.show();
                                this.AutoSizeColumns();
                            });
                        }
                    });

                    this.SetDataToGrid(rowData);
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                }
            }).catch((error) => {
                console.log(error);
            })
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    SetDataToGrid: function (rowData) {
        try {
            let columnDefs = [
                {
                    headerName: "",
                    field: "id",
                    hide: true
                },
                {
                    headerName: "",
                    field: "importance",
                    hide: true
                },
                {
                    headerName: "",
                    field: "asin",
                    hide: true
                },
                {
                    headerName: "",
                    field: "domain",
                    hide: true
                },
                {
                    headerName: "",
                    field: "bsr",
                    hide: true
                },
                {
                    headerName: "",
                    field: "review_count",
                    hide: true
                },
                {
                    headerName: "",
                    field: "review_rate",
                    hide: true
                },
                {
                    headerName: "",
                    field: "buybox",
                    hide: true
                },
                {
                    headerName: "",
                    field: "price",
                    hide: true
                },
                {
                    headerName: "",
                    field: "fba_seller_count",
                    hide: true
                },
                {
                    headerName: "",
                    field: "fbm_seller_count",
                    hide: true
                },
                {
                    headerName: "",
                    field: "is_amazon_seller",
                    hide: true
                },
                {
                    headerName: "",
                    field: "sellers_info",
                    hide: true
                },
                {
                    headerName: "",
                    field: "update_date",
                    hide: true
                },
                {
                    headerName: "", field: "importanceDisplay",
                    cellRenderer: 'defaultRenderer',
                    width: 30, filter: false,
                    comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                        valueA = valueA.split('data-importance="')[1]?.split('"')[0]
                        valueB = valueB.split('data-importance="')[1]?.split('"')[0]

                        if (valueA == valueB) {
                            return 0;
                        }
                        return (valueA > valueB) ? 1 : -1;
                    }
                },
                {
                    headerName: "ASIN", field: "asinDisplay",
                    cellClass: ['ms-fw-bold', "ms-d-flex", "ms-align-items-center"],
                    cellRenderer: 'defaultRenderer',
                    width: 100,
                    comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                        valueA = valueA.indexOf('</a>') < 0 ? valueA : valueA.split('</a>')[0]?.split('">')[1]?.trim();
                        valueB = valueB.indexOf('</a>') < 0 ? valueB : valueB.split('</a>')[0]?.split('">')[1]?.trim();

                        if (valueA == valueB) {
                            return 0;
                        }
                        return (valueA > valueB) ? 1 : -1;
                    }
                },
                {
                    headerName: "Title", field: "title",
                    cellRenderer: 'defaultRenderer',
                    width: 130
                },
                {
                    headerName: "Note", field: "note",
                    cellRenderer: "defaultRenderer",
                    width: 200
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
                rowData: null,
                rowBuffer: 9999,
                animateRows: true,
                suppressColumnVirtualisation: true,
                onFirstDataRendered: (params) => {
                    params.api.sizeColumnsToFit();
                },
                rowSelection: 'single',
                onSelectionChanged: () => {
                    var selectedRows = gridOptions.api.getSelectedRows();

                    if (selectedRows.length == 1 &&
                        $(".ms-spinner-border.ms-spinner-border-sm").hasClass("ms-invisible")) {
                        $("#addToWishlist").addClass("disabled");
                        $("#wlItemId").val(selectedRows[0].id);
                        $("#wlASIN").val(selectedRows[0].asin);

                        let impVal = selectedRows[0].importance;
                        $('#wlImportance option[value="' + impVal + '"]').prop('selected', true);
                        $("#wlImportance").trigger("change");

                        $("#wlTitle").val(selectedRows[0].title);
                        $("#wlNote").val(selectedRows[0].note);

                        $("#wlDomain").val(selectedRows[0].domain);

                        $("#removeFromWishlist").removeClass("disabled");
                        $("#updateWishlist").removeClass("disabled");
                    }
                },
                rowClassRules: {
                    'ms-fst-italic ms-fw-bold': function (params) { return params.data.asin == GetASIN(); }
                }
            };

            var eGridDiv = document.getElementById('wlGrid');
            if (eGridDiv) {
                eGridDiv.innerHTML = "";
                new agGrid.Grid(eGridDiv, gridOptions);
                gridOptions.api.setRowData(rowData);
                gridWishlistOption = gridOptions;
                wishlistRowData = rowData;   
            }            
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    GetWishlist: function () {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                type: "m0",
                method: 'GET',
                url: `${common.HOST}/api/wishlists`
            }, (response) => {
                try {
                    if (response?.response?.isSuccess) {
                        let wishlist = JSON.parse(response.response.paramStr);
                        resolve(wishlist);
                    } else {
                        reject(response?.response?.userMessage);
                    }
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                    reject(error);
                }
            });
        })
    },
    ConvertToWishlistRow: function (wishlistItem) {
        try {
            let textColor = this.GetTextColorByImportance(wishlistItem.IMPORTANCE);

            let row = {
                id: wishlistItem.ID,
                importance: wishlistItem.IMPORTANCE,
                asin: wishlistItem.ASIN,
                domain: wishlistItem.AMAZON_MARKETPLACE,
                importanceDisplay: '<svg data-importance="' + wishlistItem.IMPORTANCE + '" id="wlImpSymbol" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="' + textColor + '" viewBox="0 0 16 16">' +
                    '<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2z" />' +
                    '</svg>',
                asinDisplay: `<a class="ms-link-primary" href="https://www.amazon.${wishlistItem.AMAZON_MARKETPLACE}/dp/${wishlistItem.ASIN}?th=1&psc=1" target="_blank">${wishlistItem.ASIN}</a>`,
                title: wishlistItem.TITLE,
                note: wishlistItem.NOTE,
                bsr: wishlistItem.BSR,
                review_count: wishlistItem.REVIEW_COUNT,
                review_rate: wishlistItem.REVIEW_RATE,
                buybox: wishlistItem.BUYBOX,
                price: wishlistItem.PRICE,
                fba_seller_count: wishlistItem.FBA_SELLER_COUNT,
                fbm_seller_count: wishlistItem.FBM_SELLER_COUNT,
                is_amazon_seller: wishlistItem.IS_AMAZON_SELLER,
                sellers_info: wishlistItem.SELLERS_INFO,
                update_date: wishlistItem.UPDATE_DATE
            }

            return row;
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    AutoSizeColumns: function () {
        try {
            if (gridWishlistOption) {
                gridWishlistOption.suppressColumnVirtualisation = true;
                gridWishlistOption.api.sizeColumnsToFit();
            }
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    AddToWishlist: function () {
        common.ShowSpinner();
        $("#addToWishlist").addClass("disabled");

        let model = this.GetModelForInsert();

        chrome.runtime.sendMessage({
            data: model,
            method: 'POST',
            url: `${common.HOST}/api/wishlists`,
            type: "m0"
        }, (response) => {
            if (!response?.response?.isSuccess) {
                toast.ShowError(response?.response?.userMessage);
            } else {
                this.GetWishlist().then((wishlist) => {
                    try {
                        let rowData = [];

                        wishlist.forEach(wishlistItem => {
                            rowData.push(
                                this.ConvertToWishlistRow(wishlistItem)
                            );
                        });

                        this.SetDataToGrid(rowData);

                        $("#wlProcessSuccessIcon").fadeIn();
                        setTimeout(() => {
                            $("#wlProcessSuccessIcon").fadeOut("slow");
                        }, 1000);

                        this.ResetPanel();
                    } catch (error) {
                        errorHandler.SendErrorToAdmin(error);
                    }
                }).catch((error) => {
                    errorHandler.SendErrorToAdmin(error);
                }).finally(() => { common.HideSpinner(); });
            }
        });
    },
    RemoveFromWishlist: function () {
        if (confirm("Remove the product from the wishlist?")) {
            common.ShowSpinner();
            $("#removeFromWishlist").addClass("disabled");
            $("#updateWishlist").addClass("disabled");

            chrome.runtime.sendMessage({
                url: `${common.HOST}/api/wishlists/${$("#wlItemId").val() || 0}`,
                method: 'DELETE',
                type: "m0"
            }, (response) => {
                if (!response?.response?.isSuccess) {
                    toast.ShowError(response?.response?.userMessage);
                } else {
                    this.GetWishlist().then((wishlist) => {
                        try {
                            let rowData = [];

                            wishlist.forEach(wishlistItem => {
                                rowData.push(
                                    this.ConvertToWishlistRow(wishlistItem)
                                );
                            });
                            this.SetDataToGrid(rowData);

                            $("#wlProcessSuccessIcon").fadeIn();
                            setTimeout(() => {
                                $("#wlProcessSuccessIcon").fadeOut("slow");
                            }, 1000);

                            this.ResetPanel();
                        } catch (error) {
                            errorHandler.SendErrorToAdmin(error);
                        }
                    }).catch((error) => {
                        errorHandler.SendErrorToAdmin(error);
                    }).finally(() => { common.HideSpinner(); })
                }
            });
        }
    },
    UpdateWishlist: async function () {
        try {
            common.ShowSpinner();
            $("#updateWishlist").addClass("disabled");

            let model = await this.GetModelForUpdate();

            chrome.runtime.sendMessage({
                data: model,
                type: "m0",
                url: `${common.HOST}/api/wishlists`,
                method: 'PUT'
            }, (response) => {
                if (!response?.response?.isSuccess) {
                    toast.ShowError(response?.response?.userMessage);
                } else {
                    this.GetWishlist().then((wishlist) => {
                        try {
                            let rowData = [];

                            wishlist.forEach(wishlistItem => {
                                rowData.push(
                                    this.ConvertToWishlistRow(wishlistItem)
                                );
                            });

                            this.SetDataToGrid(rowData);

                            $("#wlProcessSuccessIcon").fadeIn();
                            setTimeout(() => {
                                $("#wlProcessSuccessIcon").fadeOut("slow");
                            }, 1000);

                            this.ResetPanel();
                        } catch (error) {
                            errorHandler.SendErrorToAdmin(error);
                        }
                    }).catch((error) => {
                        errorHandler.SendErrorToAdmin(error);
                    }).finally(() => { common.HideSpinner(); });
                }
            });
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    ResetPanel: function () {
        try {
            $("#wlASIN").val(GetASIN());
            $('#wlImportance option[value="3"]').prop('selected', true);
            $("#wlImportance").trigger("change");
            $("#wlTitle").val($("#productTitle").text().trim().substring(0, $("#wlTitle").attr("maxlength")));
            $("#wlNote").val("");
            $("#updateWishlist").addClass("disabled");
            $("#removeFromWishlist").addClass("disabled");
            $("#addToWishlist").removeClass("disabled");
            if (gridWishlistOption) {
                gridWishlistOption.api.deselectAll();
            }
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    GetTextColorByImportance: function (importance) {
        switch (importance) {
            case 1:
                return "ms-text-danger";
            case 2:
                return "ms-text-warning";
            case 3:
                return "ms-text-success";
        }
    },
    SetInitialEvents: async function () {
        var tabEl = document.querySelector('#wishlist-tab[data-bs-toggle="tab"]');

        if (!tabEl) {
            await common.Sleep(3000);
            tabEl = document.querySelector('#wishlist-tab[data-bs-toggle="tab"]');
        }

        tabEl.addEventListener('shown.bs.tab', (event) => {
            try {
                wishlist.AutoSizeColumns();
                let sgWidth = parseInt($("#mysc-main-div").width() - 24);
                $("#wlGrid").css("width", sgWidth || "410" + "px");
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        })

        $(".mysys").on("keyup", "#wlNote", function (event) {
            $("#wlNoteCounter").text($(this).val()?.length + "/" + $(this).attr("maxlength"));
        });

        $(".mysys").on("change", "#wlImportance", function (event) {
            $("#wlImpSymbol").removeClass();
            $("#wlImpSymbol").addClass($("#wlImportance option:selected").attr("class"));
        });

        $(".mysys").on("click", "#addToWishlist", () => {
            try {
                this.AddToWishlist();
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });

        $(".mysys").on("click", "#removeFromWishlist", () => {
            try {
                this.RemoveFromWishlist();
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });

        $(".mysys").on("click", "#updateWishlist", () => {
            try {
                this.UpdateWishlist();
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });

        $(".mysys").on("click", "#svgExportWlToExcel", () => {
            try {
                if (wishlistRowData) {
                    let excelData = [];
                    wishlistRowData.forEach((wlItem) => {
                        excelData.push(
                            {
                                "ASIN": wlItem.asin,
                                "IMPORTANCE": $('#wlImportance option[value="' + wlItem.importance + '"]').text(),
                                "DOMAIN": wlItem.domain,
                                "TITLE": wlItem.title,
                                "NOTE": wlItem.note,
                                "UPDATE_DATE": (new Date(wlItem.update_date)).toLocaleDateString(),
                                "BSR": wlItem.bsr,
                                "REVIEW_COUNT": wlItem.review_count,
                                "RATINGS": wlItem.review_rate,
                                "BUYBOX": wlItem.buybox,
                                "PRICE": wlItem.price,
                                "FBA_SELLER_COUNT": wlItem.fba_seller_count,
                                "FBM_SELLER_COUNT": wlItem.fbm_seller_count,
                                "IS_AMAZON_SELLER": wlItem.is_amazon_seller ? "YES" : "NO",
                                "SELLERS_INFO": wlItem.sellers_info
                            });
                    });

                    exporter.DownloadAsExcel(excelData, "wishlist_" + new Date().getTime());
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });

        $(".mysys").on("click", "#svgResetPanel", () => {
            try {
                this.ResetPanel();
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });

        $(".mysys").on("click", "#removeAllWishlist", () => {
            if (confirm('Are you sure you want to remove all products from the wishlist?')) {
                chrome.runtime.sendMessage({
                    type: "m0",
                    url: `${common.HOST}/api/wishlists/deleteall`,
                    method: 'DELETE'
                }, (response) => {
                    if (!response?.response?.isSuccess) {
                        toast.ShowError(response?.response?.userMessage);
                    } else {
                        this.GetWishlist().then((wishlist) => {
                            try {
                                let rowData = [];

                                wishlist.forEach(wishlistItem => {
                                    rowData.push(
                                        this.ConvertToWishlistRow(wishlistItem)
                                    );
                                });

                                this.SetDataToGrid(rowData);

                                $("#wlProcessSuccessIcon").fadeIn();
                                setTimeout(() => {
                                    $("#wlProcessSuccessIcon").fadeOut("slow");
                                }, 1000);
                            } catch (error) {
                                errorHandler.SendErrorToAdmin(error);
                            }
                        }).catch((error) => {
                            errorHandler.SendErrorToAdmin(error);
                        }).finally(() => { common.HideSpinner(); })
                    }
                });
            }
        })
    },
    GetModelForInsert: function () {
        try {
            let reviewRate = common.ConvertToNumber(document.querySelector("#acrCustomerReviewText")?.innerText.split(" ")[0]);
            let bsr = common.ConvertToNumber($("#spBSR").text());

            return {
                "ASIN": $("#wlASIN").val(),
                "IMPORTANCE": Number($("#wlImportance option:selected").val()),
                "TITLE": $("#wlTitle").val(),
                "NOTE": $("#wlNote").val(),
                "DOMAIN": common.GetDomain(),
                "BSR": bsr && !isNaN(bsr) ? bsr : 0,
                "REVIEW_COUNT": common.ConvertToNumber($("#wlReviewCount").val()),
                "REVIEW_RATE": !isNaN(reviewRate) ? reviewRate : 0,
                "BUYBOX": $("#spBuybox").text(),
                "PRICE": Number($("#wlPrice").val()),
                "FBA_SELLER_COUNT": Number($("#spFBAOffers")?.text() ?? 0),
                "FBM_SELLER_COUNT": Number($("#spFBMOffers")?.text() ?? 0),
                "IS_AMAZON_SELLER": $("div[col-id='seller']:contains(Amazon)").length > 0,
                "SELLERS_INFO": $("#pSellersInfo").text()
            };
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    GetModelForUpdate: function () {
        return new Promise((resolve, reject) => {
            try {
                let crawledReviewCount;
                let domain = $("#wlDomain").val();
                let asin = $("#wlASIN").val();
                crwcommon.GetReviewCount(asin).then(reviewCount => {
                    crawledReviewCount = reviewCount;
                }).finally(() => {

                    let crawledBasicInfo;
                    crwcommon.GetCrawledBasicInfo(asin, domain, false).then(result => {
                        crawledBasicInfo = result;
                    }).finally(() => {
                        try {
                            if (crawledBasicInfo) {
                                if (crawledBasicInfo.buybox.indexOf("Amazon") > -1 && crawledBasicInfo.buybox.indexOf("isAmazonFulfilled") == -1 &&
                                    crawledBasicInfo.buybox.indexOf("Amazon Warehouse") == -1) {
                                    crawledBasicInfo.buybox = "Amazon";
                                } else {
                                    crawledBasicInfo.buybox = $(crawledBasicInfo.buybox).text();
                                }
                                crawledBasicInfo.price = crawledBasicInfo?.price?.trim().replace(common.GetCurrencySymbol(domain), "").trim();
                                if (crawledBasicInfo.price) {
                                    crawledBasicInfo.price = common.ConvertToNumber(crawledBasicInfo.price, domain);
                                }
                            }

                            let crawledOffers;
                            common.GetAmazonOffers(asin, domain).then((offers) => {
                                crawledOffers = offers;
                            }).finally(() => {
                                try {
                                    let fbaCount = 0, fbmCount = 0, isAmazonSeller = false, sellerInfo = "";;
                                    if (crawledOffers) {
                                        fbaCount = crawledOffers.offers.filter(x => x.isFba == "1")?.length;
                                        fbmCount = crawledOffers.totalOfferCount - fbaCount;
                                        isAmazonSeller = crawledOffers.offers.filter(x => x.sellerName.indexOf("Amazon") > -1)?.length > 0;

                                        for (let index = 0; index < crawledOffers.offers.length; index++) {
                                            const element = crawledOffers.offers[index];
                                            let star = "";
                                            if (element.star && element.star != 0) {
                                                star = element.star[0].split("a-star-mini-")[1]?.split(" ")[0]?.replace("-", ".");
                                            }

                                            let sellerObj = {
                                                Domain: domain,
                                                SellerName: element.sellerName,
                                                Price: element.price.toFixed(2),
                                                SellerType: element.isFba == "1" ? "FBA" : "FBM",
                                                StarCount: star,
                                                Feedback: element.positiveFeedBack,
                                                Rating: element.sellerRating
                                            };

                                            sellerInfo += common.SummarizeSellerInfo(sellerObj) + "\n";
                                        }

                                        sellerInfo = sellerInfo.trim();
                                    }

                                    resolve({
                                        "ID": Number($("#wlItemId").val() || 0),
                                        "ASIN": asin,
                                        "IMPORTANCE": Number($("#wlImportance option:selected").val()),
                                        "TITLE": $("#wlTitle").val(),
                                        "NOTE": $("#wlNote").val(),
                                        "DOMAIN": domain,
                                        "BSR": crawledBasicInfo?.bsr && crawledBasicInfo?.bsr != "N/A" ? common.ConvertToNumber(crawledBasicInfo.bsr, domain) : 0,
                                        "REVIEW_COUNT": common.ConvertToNumber(crawledReviewCount ?? 0, domain),
                                        "REVIEW_RATE": !isNaN(crawledBasicInfo?.reviewRate) ? Number(crawledBasicInfo?.reviewRate) : 0,
                                        "BUYBOX": crawledBasicInfo?.buybox,
                                        "PRICE": common.ConvertToNumber(crawledBasicInfo?.price ?? 0, domain),
                                        "FBA_SELLER_COUNT": fbaCount,
                                        "FBM_SELLER_COUNT": fbmCount,
                                        "IS_AMAZON_SELLER": isAmazonSeller,
                                        "SELLERS_INFO": sellerInfo
                                    });
                                } catch (error) {
                                    errorHandler.SendErrorToAdmin(error);
                                }
                            })
                        } catch (error) {
                            errorHandler.SendErrorToAdmin(error);
                        }
                    });
                });
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        })
    }
}
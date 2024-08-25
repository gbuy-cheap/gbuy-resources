var varGridOptions, varColorGridOptions, varSizeGridOptions, varDataRow;
let emsNotFoundWarning = "No Estimated Monthly Sales found for this product. Cannot calculate monthly sales per variations";
var variations = {
    Init: async function (parentASIN, category) {
        try {
            this.BindInitialEvents();
            this.EnableCalcEMSButton(false);

            $("#spParentASIN").html(`<a class="ms-link-info ms-text-decoration-underline" href="https://www.amazon.${common.GetDomain()}/dp/${parentASIN}?th=1&amp;psc=1" target="_blank">${parentASIN}</a>`);

            $("#spVarCat").text(category);

            this.SetVariations(parentASIN).then(() => {
                try {
                    variations.EnableGetDetailedInfoButton();
                    varGridOptions?.api?.sizeColumnsToFit();
                    if ($("#variations-tab").hasClass("active") && $("#cboxVarAutoStart").prop("checked")) {
                        this.EnableGetInfoWarning(true);
                        this.CrawlFeatures();
                    }

                    let ems = calculator.GetEMS();
                    if (!ems || isNaN(ems)) {
                        $("#calcEMSPerVars").addClass("mys-tooltip");
                        $("#calcEMSPerVars").append(`<span class="mys-tooltiptext">${emsNotFoundWarning}</span>`);
                    }
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                }
            })
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    CreateVarDataRow: function (asin, index) {
        let row = {
            id: index,
            asin: asin,
            asinDisplay: '<span class="varASIN pointer ms-fw-bold">' + asin + '</span>',
            color: "-",
            size: "-",
            ems: "-",
            bsr: "-",
            price: "-",
            reviews: "-",
            offers: "-",
            isinstock: "-"
        }

        return row;
    },
    SetDataToGrid: function (rowData) {
        try {
            let CellClassRules = {
                "text-secondary": function (params) {
                    return params.value == "N/A";
                }
            };

            let currentASIN = $("#spASIN").text().trim();

            let numberFormatDomain = common.GetDomainBySelectedLanguage();

            let columnDefs = [
                {
                    headerName: "ASIN", field: "asinDisplay",
                    cellClass: ["ms-d-flex", "ms-align-items-center"],
                    cellClassRules: {
                        "ms-link-primary": (params) => {
                            return params.data.isinstock == "instock"
                        },
                        "link-danger": (params) => {
                            return params.data.isinstock == "oos"
                        }
                    },
                    cellRenderer: 'defaultRenderer',
                    width: 95,
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
                    headerName: "Size", field: "size",
                    cellClass: ["ms-d-flex", "ms-align-items-center"],
                    width: 120,
                    comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                        if (valueA == valueB) {
                            return 0;
                        }
                        return (valueA > valueB) ? 1 : -1;
                    }
                },
                {
                    headerName: "Color", field: "color",
                    width: 120,
                    comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                        if (valueA == valueB) {
                            return 0;
                        }
                        return (valueA > valueB) ? 1 : -1;
                    }
                },
                {
                    headerName: 'Mo.Sales', field: "ems",
                    width: 60,
                    type: 'numericColumn',
                    cellClassRules: CellClassRules,
                    comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                        return common.GridNumberColumnComparer(valueA, valueB, numberFormatDomain);
                    }
                },
                {
                    headerName: `Price ${common.GetCurrencySymbol()}`, field: "price",
                    width: 60,
                    type: 'numericColumn',
                    cellClassRules: CellClassRules,
                    comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                        return common.GridNumberColumnComparer(valueA, valueB, numberFormatDomain);
                    }
                },
                {
                    headerName: "Review", field: "reviews",
                    width: 60,
                    type: 'numericColumn',
                    cellClassRules: CellClassRules,
                    comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                        return common.GridNumberColumnComparer(valueA, valueB, numberFormatDomain);
                    }
                },
                {
                    headerName: "Offer", field: "offers",
                    width: 40,
                    type: 'numericColumn',
                    cellClassRules: CellClassRules,
                    comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                        return common.GridNumberColumnComparer(valueA, valueB, numberFormatDomain);
                    }
                },
                {
                    headerName: 'BSR', field: "bsr",
                    width: 60,
                    type: 'numericColumn',
                    cellClassRules: CellClassRules,
                    comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                        return common.GridNumberColumnComparer(valueA, valueB, numberFormatDomain);
                    }
                },
                {
                    field: "isinstock", hide: true
                },
                {
                    field: "asin", hide: true
                }
            ];

            let gridOptions = {
                defaultColDef: {
                    sortable: true,
                    filter: false,
                    resizable: true
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
                enableCellChangeFlash: true,
                suppressColumnVirtualisation: true,
                isExternalFilterPresent: () => { return false; },
                doesExternalFilterPass: null,
                getRowNodeId: function (data) {
                    return data.id;
                },
                rowClassRules: {
                    'bg-light-blue': function (params) { return params.data.asin == currentASIN; },
                },
            };

            let eGridDiv = document.getElementById('varGrid');
            if (eGridDiv) {
                eGridDiv.innerHTML = "";
                new agGrid.Grid(eGridDiv, gridOptions);
                gridOptions.api.setRowData(rowData);
                return gridOptions;
            }
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    ResetPropertyFilter: function () {
        try {
            $("span.color-filter").removeAttr("data-selected");
            $("span.size-filter").removeAttr("data-selected");
            $("span.color-filter").removeClass("ms-btn-info");
            $("span.size-filter").removeClass("ms-btn-info");
            $("span.color-filter").addClass("ms-btn-outline-secondary");
            $("span.size-filter").addClass("ms-btn-outline-secondary");

            varGridOptions.isExternalFilterPresent = () => { return false; }
            varGridOptions.api.onFilterChanged();
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    BindInitialEvents: async function () {
        var tabEl = document.querySelector('#variations-tab[data-bs-toggle="tab"]');
        tabEl.addEventListener('shown.bs.tab', (event) => {
            try {
                let counter = 20;

                if ($("#cboxVarAutoStart").prop("checked")) {
                    this.EnableGetInfoWarning(true);
                    let myInt = setInterval(() => {
                        if (!$("#spTotalRevs").text()) {
                            clearInterval(myInt);
                            varGridOptions?.api.sizeColumnsToFit();
                            this.CrawlFeatures();
                        }
                        if (counter >= 20) {
                            clearInterval(myInt);
                        }
                        counter++;
                    }, 250);
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });

        $(".mysys").on("click", "#getDetailedVarInfo", async function (e) {
            e.stopPropagation();
            try {
                variations.EnableGetDetailedInfoButton(false);
                variations.EnableCalcEMSButton(false);

                await variations.CrawlFeatures();

                variations.EnableGetDetailedInfoButton();
                if (!isNaN(calculator.GetEMS())) {
                    variations.EnableCalcEMSButton();
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });

        $(".mysys").on("click", "#propertyFilter", function (e) {
            e.preventDefault();
            e.stopPropagation();
            $("#spPropertyFilterArrow").html($("#spPropertyFilterArrow").html() == "▽" ? "△" : "▽");
        });

        $(".mysys").on("click", "#clearPropertyFilter", function (e) {
            e.stopPropagation();
            try {
                variations.ResetPropertyFilter();
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });

        $(".mysys").on("click", "#divPropertyFilterList div.ms-card-body span.ms-btn", function (e) {
            try {
                e.stopPropagation();

                $(this).toggleClass("ms-btn-outline-secondary");
                $(this).toggleClass("ms-btn-info");

                if ($(this).hasClass("ms-btn-info")) {
                    $(this).attr("data-selected", true);
                }
                else {
                    $(this).removeAttr("data-selected");
                }

                if ($("span[data-selected='true']").length > 0) {
                    varGridOptions.isExternalFilterPresent = () => { return true; }

                    let colorValues = [], sizeValues = [];

                    $("span.color-filter[data-selected='true']").each(function (index, element) {
                        colorValues.push($(element).text());
                    });

                    $("span.size-filter[data-selected='true']").each(function (index, element) {
                        sizeValues.push($(element).text());
                    });

                    varGridOptions.doesExternalFilterPass = function (node) {
                        if (colorValues.length > 0 && sizeValues.length > 0) {
                            if (colorValues.includes(node.data.color) && sizeValues.includes(node.data.size)) {
                                return true;
                            }
                        } else if (colorValues.includes(node.data.color) || sizeValues.includes(node.data.size)) {
                            return true;
                        }
                    }
                    varGridOptions.api.onFilterChanged();
                } else {
                    variations.ResetPropertyFilter();
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });

        $(".mysys").on('change', 'input[name="radioStockStatus"]', function () {
            try {
                let stockFilterComponent = varGridOptions.api.getFilterInstance("isinstock");
                let filterModel = null;
                let checkedVal = $('input[name="radioStockStatus"]:checked').val();

                if (checkedVal != "all") {
                    filterModel = { type: "equal", filter: checkedVal };
                }

                stockFilterComponent.setModel(filterModel);

                varGridOptions.api.onFilterChanged();
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        })

        $(".mysys").on('click', '.varASIN', function (e) {
            e.stopPropagation();
            window.open(`https://www.amazon.${common.GetDomain()}/dp/${$(this).text()}?th=1&psc=1`, '_blank').focus();
        })

        $(".mysys").on("click", "#summaryOfRevs", function (e) {
            e.stopPropagation();
            e.preventDefault();

            try {
                $("#spRevSumArrow").html($("#spRevSumArrow").html() == "▽" ? "△" : "▽");
                varSizeGridOptions?.api.sizeColumnsToFit();
                varColorGridOptions?.api.sizeColumnsToFit();
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });

        $(".mysys").on("click", "#calcEMSPerVars", function (e) {
            e.stopPropagation();

            if ($("#getDetailedVarInfo").hasClass("disabled")) {
                return;
            }

            try {
                let ems = calculator.GetEMS();
                if (!isNaN(ems)) {
                    if ($("#spTotalRevs").text() && !isNaN(common.ConvertToNumber($("#spTotalRevs").text()) &&
                        !isNaN(common.ConvertToNumber($("#spAllVars").text())))) {
                        variations.EnableGetDetailedInfoButton(false);
                        common.ShowSpinner();
                        variations.EnableCalcEMSButton(false);
                        let asinCount = common.ConvertToNumber($("#spAllVars").text());

                        let asinRevs = [];
                        let counter = 0;
                        let lastRecentDate;

                        varGridOptions?.api.forEachNode(async (rowNode, index) => {
                            await common.Sleep(2000);

                            if (rowNode.data.reviews && !isNaN(common.ConvertToNumber(rowNode.data.reviews))) {
                                let pageCount = Math.ceil(common.ConvertToNumber(rowNode.data.reviews) / 20);
                                pageCount = pageCount > 250 ? 250 : pageCount;

                                try {
                                    let asinWithReviews = await variations.GetReviews(rowNode.data.asin, pageCount);
                                    if (asinWithReviews) {
                                        asinRevs.push(asinWithReviews);
                                    }
                                } catch (error) {
                                    errorHandler.SendErrorToAdmin(error);
                                }

                                if (index % 50 == 0) {
                                    await common.Sleep(1000);
                                }

                                try {
                                    if (counter == asinCount - 1) {
                                        asinRevs.forEach(asinRev => {
                                            if (!isNaN(new Date(asinRev.Dates[asinRev.Dates.length - 1]).getTime()) &&
                                                ((lastRecentDate && new Date(lastRecentDate) < new Date(asinRev.Dates[asinRev.Dates.length - 1]) ||
                                                    !lastRecentDate))) {
                                                lastRecentDate = new Date(asinRev.Dates[asinRev.Dates.length - 1]);
                                            }
                                        });

                                        let totalFilteredRevs = 0;
                                        asinRevs.forEach(asinRev => {
                                            asinRev.Dates = asinRev.Dates.filter(function (date) { return new Date(date) >= new Date(lastRecentDate) });
                                            totalFilteredRevs += asinRev.Dates.length + 1;
                                        });

                                        varGridOptions?.api.forEachNode((rowNode, index) => {
                                            let revCount = Number(asinRevs.find((asinRev) => { return asinRev.ASIN == rowNode.data.asin })?.Dates.length + 1);
                                            if (!isNaN(revCount)) {
                                                let distributedEMS = common.FormatNumber(Math.round(ems * revCount / totalFilteredRevs));
                                                rowNode.setDataValue("ems", distributedEMS == 0 ? 1 : distributedEMS);
                                            }
                                        });

                                        common.HideSpinner();
                                        variations.EnableCalcEMSButton(true);
                                        variations.EnableGetDetailedInfoButton();
                                    }
                                } catch (error) {
                                    errorHandler.SendErrorToAdmin(error);
                                }
                                counter++;
                            } else {
                                rowNode.setDataValue("ems", "N/A");
                                counter++;
                            }
                        });
                    } else {
                        toast.ShowWarning("Reviews not found. Cannot calculate monthly sales per variations. Please click on the \"Get Detailed Info\" button if you didn't.");
                    }
                } else {
                    toast.ShowWarning(emsNotFoundWarning);
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });

        $(".mysys").on("click", "#openVariantModal", function () {

            let parentSection = $(this).parents("section").eq(0);

            $(parentSection).removeClass("ms-container");
            $(parentSection).addClass("ms-container-fluid");

            $(parentSection).appendTo("#commonModal .ms-modal-body");

            $("#varGrid").css("width", "100%");
            $("#commonModal .ms-modal-body>section>div:not(#varGrid)").css("max-width", "650px");
            $("#commonModal .ms-modal-body>section>div:not(#varGrid)").addClass("ms-mx-auto");

            let modalBodyHeight = $("#commonModal .ms-modal-body").height();

            let originalVarGridHeight = $("#varGrid").height();
            $("#varGrid").css("height", (modalBodyHeight - 150) + "px");
            $("#varGrid").css("max-height", (modalBodyHeight - 150) + "px");

            varGridOptions?.api.sizeColumnsToFit();

            $("#openVariantModal").parents("div.ms-col-1").eq(0).addClass("ms-d-none");

            $(".mysys").on("click", "#commonModalCloseBtn", function () {
                $(".mysys").off("click", "#commonModalCloseBtn");
                try {
                    $(parentSection).appendTo("main#variations");
                    $(parentSection).addClass("ms-container");
                    $(parentSection).removeClass("ms-container-fluid");
                    $("#varGrid").css("height", (originalVarGridHeight) + "px");
                    $("#varGrid").css("max-height", (originalVarGridHeight) + "px");
                    $("#openVariantModal").parents("div.ms-col-1").eq(0).removeClass("ms-d-none");
                    $("main#variations>section>div:not(#varGrid)").css("max-width", "inherit");
                    $("main#variations>section>div:not(#varGrid)").removeClass("ms-mx-auto");
                    variations.AutoSizeAll();

                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                }
            })

        });

        $(".mysys").on("click", "#svgExportVarsToExcel", function (e) {
            e.stopPropagation();
            e.preventDefault();

            try {
                if (varDataRow) {
                    let excelData = [];
                    let priceColumnName = `PRICE ${common.GetCurrencySymbol()}`;

                    varDataRow.forEach((varItem) => {
                        let excelRow = {
                            "ASIN": varItem.asin,
                            "SIZE": varItem.size,
                            "COLOR": varItem.color,
                            "MO.SALES": varItem.ems,
                            [priceColumnName]: varItem.price,
                            "REVIEW": varItem.reviews,
                            "OFFER": varItem.offers,
                            "BSR": varItem.bsr
                        }

                        excelData.push(excelRow);
                    });

                    let emptyRow = {
                        "ASIN": ""
                    };

                    let totalRevs = {
                        "ASIN": `Total reviews: ${$("#spTotalRevs").text()}`
                    };

                    let parentASIN = {
                        "ASIN": `Parent ASIN: ${$("#spParentASIN").text()}`
                    };

                    let totalReviewsInCat = {
                        "ASIN": `Avg. Rank: ${$("#spAvgRank").text() ?? ""} in ${$("#spVarCat").text() ?? ""}`
                    };

                    let averagePrice = {
                        "ASIN": `Average Price: ${$("#variations .currency").eq(0).text()} ${$("#spAvgPrice").text() ?? ""}`
                    };

                    excelData.push(emptyRow);                    
                    excelData.push(totalRevs);
                    excelData.push(parentASIN);
                    excelData.push(totalReviewsInCat);
                    excelData.push(averagePrice);

                    let currentDate = new Date();
                    let currentDateStr = `${currentDate.getMonth() + 1}_${currentDate.getDate()}_${currentDate.getFullYear()}_${currentDate.getHours()}_${currentDate.getMinutes()}`;
                    let excelFileName = `variations_${$("#spASIN").text()}_${currentDateStr}`;

                    exporter.DownloadAsExcel(excelData, excelFileName);
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });
    },
    AutoSizeAll: function (shipHeader = false) {
        try {
            if (varGridOptions) {
                const allColumnIds = [];
                varGridOptions.columnApi.getAllColumns().forEach((column) => {
                    allColumnIds.push(column.colId);
                });

                varGridOptions.columnApi.autoSizeColumns(allColumnIds, shipHeader);
            }
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    SetVariations: function (parentASIN) {
        return new Promise(resolve => {
            if (parentASIN && parentASIN != "N/A") {
                chrome.runtime.sendMessage({
                    url: `${common.HOST}/api/amazon/variations?parentASIN=${parentASIN}&domain=${common.GetDomain()}`,
                    method: 'GET',
                    type: "m0"
                }, (response) => {
                    try {
                        if (response?.response?.isSuccess) {
                            let variations = JSON.parse(response.response.paramStr);

                            if (variations?.length > 0) {
                                if (!isNaN(calculator.GetEMS())) {
                                    calculator.ShowEMSWarning();
                                }

                                varDataRow = [];

                                for (let index = 0; index < variations.length; index++) {
                                    varDataRow.push(this.CreateVarDataRow(variations[index], index));
                                }

                                varGridOptions = this.SetDataToGrid(varDataRow);

                                $("#spAllVars").text(varDataRow.length);

                            } else {
                                $("#variations .ms-row:not(:first)").addClass("ms-d-none");
                                $("#variations .ms-row:first").removeClass("ms-d-none");
                            }
                            resolve();
                        }
                    } catch (error) {
                        errorHandler.SendErrorToAdmin(error);
                    }
                });
            } else {
                $("#variations .ms-row:not(:first)").addClass("ms-d-none");
                $("#variations .ms-row:first").removeClass("ms-d-none");
                resolve();
            }
        })
    },
    CrawlFeatures: async function () {
        return new Promise(async (resolve, reject) => {
            try {
                if (varDataRow?.length > 0) {
                    common.ShowSpinner();
                    let totalPrice = 0, priceCount = 0,
                        totalRank = 0, rankCount = 0,
                        instockCount = 0, oosCount = 0,
                        totalReviews = 0, counter = 0;

                    let domain = common.GetDomain();
                    let colors = [], sizes = [];

                    for (let index = 0; index < varDataRow?.length; index++) {
                        if ((index + 1) % 20 == 0) {
                            await common.Sleep(2000);
                        }

                        let rowNode = varGridOptions?.api?.getRowNode(index);

                        if (rowNode) {
                            let colorRowNode = varColorGridOptions?.api.getRowNode(rowNode.data.color);
                            let sizeRowNode = varSizeGridOptions?.api.getRowNode(rowNode.data.size);
                            colorRowNode?.setDataValue('reviews', 5);
                            sizeRowNode?.setDataValue('reviews', 5);
                            $("#spTotalRevs").text(common.FormatNumber(1150));
                            rowNode.setDataValue('reviews', 5);

                            common.GetAmazonOffers(varDataRow[index].asin, domain).
                                then(async (offerData) => {
                                    try {
                                        let rowNode = varGridOptions.api.getRowNode(index);
                                        let offerCount = offerData.offers?.length;
                                        rowNode.setDataValue('offers', offerCount || "N/A");

                                        let returnVal = await crwcommon.GetCrawledBasicInfo(varDataRow[index].asin);

                                        if (returnVal) {
                                            if (returnVal.inStock == false) {
                                                oosCount++;
                                                $("#spOutOfStock").text(oosCount);
                                                rowNode.setDataValue('isinstock', "oos");
                                            } else {
                                                instockCount++;
                                                $("#spFoundInStock").text(instockCount);
                                                rowNode.setDataValue('isinstock', "instock");
                                            }

                                            let price = common.FormatCrawledPrice(returnVal.price);

                                            if (returnVal.bsr && !isNaN(common.ConvertToNumber(returnVal.bsr))) {
                                                rankCount++;
                                                totalRank += Number(common.ConvertToNumber(returnVal.bsr));
                                                $("#spAvgRank").text(common.FormatNumber(parseInt((totalRank / rankCount))));
                                            }

                                            if (returnVal.color != "N/A") {
                                                rowNode.setDataValue('color', returnVal.color);
                                                if (!colors.find(x => x.id == returnVal.color)) {
                                                    colors.push({
                                                        id: returnVal.color,
                                                        color: returnVal.color,
                                                        reviews: "-"
                                                    });
                                                }
                                            }

                                            if (returnVal.size != "N/A") {
                                                rowNode.setDataValue('size', returnVal.size);
                                                if (!sizes.find(x => x.id == returnVal.size)) {
                                                    sizes.push({
                                                        id: returnVal.size,
                                                        size: returnVal.size,
                                                        reviews: "-"
                                                    });
                                                }
                                            }

                                            rowNode.setDataValue('price', price);
                                            rowNode.setDataValue('bsr', returnVal.bsr ? common.FormatNumber(returnVal.bsr) : "N/A");

                                            if (returnVal.inStock && price == "N/A" && offerData.offers[0]?.price) {
                                                offerData.offers?.sort((offerA, offerB) => {
                                                    return offerA.price - offerB.price;
                                                });
                                                price = parseFloat(offerData.offers[0]?.price).toFixed(2);
                                                rowNode.setDataValue('price', price);
                                            }

                                            if (!isNaN(common.ConvertToNumber(price))) {
                                                priceCount++;
                                                totalPrice += common.ConvertToNumber(price);
                                                $("#spAvgPrice").text(common.FormatNumber(parseFloat(totalPrice / priceCount).toFixed(2)));
                                            }
                                        }
                                    } catch (error) {
                                        errorHandler.SendErrorToAdmin(error);
                                    }
                                }).catch((err) => {
                                    console.log(err);
                                }).finally(() => {
                                    try {
                                        if (counter == varDataRow.length - 1) {
                                            common.HideSpinner();
                                            resolve();
                                            if (!isNaN(calculator.GetEMS())) {
                                                this.EnableCalcEMSButton();
                                            }

                                            if (colors.length > 0 || sizes.length > 0) {
                                                if (sizes.length == 0) {
                                                    $("#divColorGrid").removeClass("ms-col-6");
                                                    $("#divColorGrid").addClass("ms-col-10");
                                                    $("#divSizeGrid").removeClass("ms-col-6");
                                                    $("#divSizeGrid").addClass("ms-d-none");
                                                    varGridOptions.columnApi.setColumnVisible('size', false);
                                                    $("#divFilterSize").addClass("ms-d-none");
                                                } else {
                                                    this.SetDataToSizeGrid(sizes);
                                                    sizes.forEach(element => {
                                                        this.AddSizeToFilter(element.size);
                                                    });
                                                }

                                                if (colors.length == 0) {
                                                    $("#divSizeGrid").removeClass("ms-col-6");
                                                    $("#divSizeGrid").addClass("ms-col-10");
                                                    $("#divColorGrid").removeClass("ms-col-6");
                                                    $("#divColorGrid").addClass("ms-d-none");
                                                    varGridOptions.columnApi.setColumnVisible('color', false);
                                                    $("#divFilterColor").addClass("ms-d-none");
                                                } else {
                                                    colors.sort((a, b) => a.color.localeCompare(b.color));
                                                    this.SetDataToColorGrid(colors);
                                                    colors.forEach(element => {
                                                        this.AddColorToFilter(element.color);
                                                    });
                                                }
                                            } else {
                                                $("#summaryOfRevs").addClass("ms-d-none");
                                                $("#divPropertyFilter").addClass("ms-d-none");
                                                varGridOptions.columnApi.setColumnVisible('size', false);
                                                varGridOptions.columnApi.setColumnVisible('color', false);
                                            }

                                            this.AutoSizeColumns();
                                        }

                                        crwcommon.GetReviewCount(varDataRow[index].asin, domain).then(reviews => {
                                            try {
                                                let rowNode = varGridOptions.api.getRowNode(index);
                                                let colorRowNode = varColorGridOptions?.api.getRowNode(rowNode.data.color);
                                                let sizeRowNode = varSizeGridOptions?.api.getRowNode(rowNode.data.size);

                                                rowNode.setDataValue('reviews', reviews ? common.FormatNumber(reviews) : "N/A");

                                                if (reviews) {
                                                    totalReviews += reviews;
                                                    $("#spTotalRevs").text(common.FormatNumber(totalReviews));
                                                    colorRowNode?.setDataValue('reviews', !isNaN(colorRowNode?.data.reviews) ? Number(colorRowNode?.data.reviews) + Number(reviews) : reviews);
                                                    sizeRowNode?.setDataValue('reviews', !isNaN(sizeRowNode?.data.reviews) ? Number(sizeRowNode?.data.reviews) + Number(reviews) : reviews);
                                                }
                                            } catch (error) {
                                                errorHandler.SendErrorToAdmin(error);
                                            }
                                        }).catch(err => {
                                        });

                                    } catch (error) {
                                        errorHandler.SendErrorToAdmin(error);
                                    }
                                    counter++;
                                });
                        }
                    }
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        })
    },
    AutoSizeColumns: function () {
        try {
            if (varGridOptions) {

                let allColumnIds = [];
                varGridOptions.columnApi.getAllColumns().forEach(function (column) {
                    if (column.colId != "color" &&
                        column.colId != "offers" &&
                        column.colId != "price") {
                        allColumnIds.push(column.colId);
                    }
                });

                varGridOptions.suppressColumnVirtualisation = true;
                varGridOptions.columnApi.autoSizeColumns(allColumnIds, false);
            }
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    SetDataToColorGrid: function (rowData) {
        try {
            let columnDefs = [
                {
                    headerName: "Color", field: "color",
                    width: 60,
                    filter: 'agTextColumnFilter',
                    comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                        if (valueA == valueB) {
                            return 0;
                        }
                        return (valueA > valueB) ? 1 : -1;
                    }
                },
                {
                    headerName: "Review", field: "reviews",
                    width: 60,
                    type: 'numericColumn',
                    comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                        return valueA - valueB;
                    }
                }
            ];

            let gridOptions = {
                defaultColDef: {
                    sortable: true,
                    filter: true,
                    resizable: true
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
                enableCellChangeFlash: true,
                suppressColumnVirtualisation: true,
                getRowNodeId: function (data) {
                    return data.id;
                },
            };

            let divColorGrid = document.getElementById('varColorGrid');
            divColorGrid.innerHTML = "";
            new agGrid.Grid(divColorGrid, gridOptions);
            gridOptions.api.setRowData(rowData);
            varColorGridOptions = gridOptions;
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    SetDataToSizeGrid: function (rowData) {
        try {
            let columnDefs = [
                {
                    headerName: "Size", field: "size",
                    width: 60,
                    filter: 'agTextColumnFilter',
                    comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                        if (valueA == valueB) {
                            return 0;
                        }
                        return (valueA > valueB) ? 1 : -1;
                    }
                },
                {
                    headerName: "Review", field: "reviews",
                    width: 60,
                    type: 'numericColumn',
                    comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                        return valueA - valueB;
                    }
                }
            ];

            let gridOptions = {
                defaultColDef: {
                    sortable: true,
                    filter: true,
                    resizable: true
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
                enableCellChangeFlash: true,
                suppressColumnVirtualisation: true,
                getRowNodeId: function (data) {
                    return data.id;
                },
            };

            let divSizeGrid = document.getElementById('varSizeGrid');
            divSizeGrid.innerHTML = "";
            new agGrid.Grid(divSizeGrid, gridOptions);
            gridOptions.api.setRowData(rowData);
            varSizeGridOptions = gridOptions;
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    GetReviews: function (asin, pageCount) {
        return new Promise((resolve, reject) => {
            try {
                let counter = 0;
                let revDates = [];
                let domain = common.GetDomain();

                if (pageCount > 0) {
                    for (let index = 0; index < pageCount; index++) {
                        let link = `https://www.amazon.${domain}/product-reviews/${asin}/see_all_summary/srt/viewopt_rvwer/ref=cm_cr_arp_d_viewopt_fmt?ie=UTF8&showViewpoints=1&sortBy=recent&reviewerType=avp_only_reviews&pageNumber=${index + 1}&formatType=current_format&pageSize=20`

                        $.ajax({
                            type: "GET",
                            url: link,

                        }).done(function (html) {
                            let pageContent = $(html);

                            let languageDomain = common.GetDomainBySelectedLanguage();

                            $('div[data-hook="review"] span[data-hook="review-date"]', pageContent).each(function (index) {
                                let dateOnPage = $(this).text().split(languages.OnSplitter(languageDomain))[1];

                                if (dateOnPage) {
                                    let dateText = languages.TranslateDate(domain, dateOnPage);

                                    if (dateText) {
                                        revDates.push(new Date(dateText));
                                    }
                                }
                            });

                            if (counter == pageCount - 1) {
                                resolve({
                                    ASIN: asin,
                                    Dates: revDates.sort(function (d1, d2) { return new Date(d2) - new Date(d1); })
                                });
                            }
                            counter++;
                        }).fail(function (jqXHR) {
                            if (jqXHR.responseJSON) {
                                reject({
                                    response: jqXHR.responseJSON
                                });
                            }
                            else if (jqXHR.status === 0) {
                                reject({
                                    response: { isSuccess: false, userMessage: "Server is disabled" }
                                })
                            }
                            else {
                                reject({
                                    response: { isSuccess: false, userMessage: jqXHR.statusText }
                                })
                            }
                        });
                    }
                } else {
                    resolve({
                        ASIN: asin,
                        Dates: []
                    });
                }
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
                reject({
                    response: { isSuccess: false, userMessage: error }
                })
            }
        })
    },
    EnableCalcEMSButton: function (enable = true) {
        if (enable) {
            $("#calcEMSPerVars").removeClass("ms-link-secondary");
            $("#calcEMSPerVars").addClass("ms-link-primary");
        } else {
            $("#calcEMSPerVars").addClass("ms-link-secondary");
            $("#calcEMSPerVars").removeClass("ms-link-primary");
        }
    },
    EnableGetDetailedInfoButton: function (enable = true) {
        if (enable) {
            $("#getDetailedVarInfo").removeClass("disabled");
        } else {
            $("#getDetailedVarInfo").addClass("disabled");
        }
    },
    EnableGetInfoWarning: function (enable = true) {
        if (enable) {
            $("#spVarGetInfoWarning").removeClass("ms-d-none");
        } else {
            $("#spVarGetInfoWarning").addClass("ms-d-none");
        }
    },
    AddColorToFilter: function (color) {
        $("#divFilterColor").append(`<span class="color-filter ms-btn ms-btn-outline-secondary ms-ms-1 ms-mb-1">${color}</span>`);
    },
    AddSizeToFilter: function (size) {
        $("#divFilterSize").append(`<span class="size-filter ms-btn ms-btn-outline-secondary ms-ms-1 ms-mb-1">${size}</span>`);
    }
}
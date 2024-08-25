var searchOnPanel = {
    Init: async function () {
        try {
            if (common.IsLocationValid()) {
                $("body").append('<div id="searchOnPanel" class="ms-bg-light ms-border ms-border-yellow ms-d-none ms-h-100 ms-position-fixed ms-shadow mysys ms-container ms-overflow-hidden" style="right: 0;z-index:1000000;top:0;width: 25rem;border-top-left-radius: 1.5rem;min-width:350px;">' +
                    '<div class="ms-align-items-center ms-bg-warning ms-border-bottom ms-border-yellow ms-row ms-justify-content-between ms-px-1" style="height:4%;float:unset;">' +
                    '<div class="ms-col-auto"></div>' +
                    '<h5 class="ms-col-auto ms-d-flex ms-m-0 ms-align-items-center" style="font-size:15px;">' +
                    '<img src="' + chrome.runtime.getURL("images/favicon.png") + '" class="ms-d-inline ms-me-1" style="width:20px;">' +
                    'MySYS Extension</h5>' +
                    '<div class="ms-col-auto ms-text-end"><span class="ms-btn-close pointer" style="font-size:15px"></span></div>' +
                    '</div>' +
                    '<div id="searchOnPanelBody" class="ms-row" style="height:96%;float:unset;background-color: #FAF3DE">' +
                    '<div id="topPanel" class="ms-col-12 ms-py-3" style="height: auto;">' +

                    '<div class="ms-row">' +
                    '<div class="ms-col-12 ms-text-center ms-mb-1">' +
                    '<span class="ms-fw-bold" id="amzMarketplace"></span>' +
                    '</div>' +
                    '</div>' +

                    '<div class="ms-row">' +
                    '<div class="ms-col-12 ms-text-center">' +
                    '<img class="ms-flag ms-p-2 ms-border-0 ms-btn ms-btn-outline-primary ms-flag-btn" src="' + chrome.runtime.getURL("images/flags/usa.svg") + '" id="img-usa" data-domain="com">' +
                    '<img class="ms-flag ms-p-2 ms-border-0 ms-btn ms-btn-outline-primary ms-flag-btn" src="' + chrome.runtime.getURL("images/flags/can.svg") + '" id="img-can" data-domain="ca">' +
                    '<img class="ms-flag ms-p-2 ms-border-0 ms-btn ms-btn-outline-primary ms-flag-btn" src="' + chrome.runtime.getURL("images/flags/gbr.svg") + '" id="img-gbr" data-domain="co.uk">' +
                    '<img class="ms-flag ms-p-2 ms-border-0 ms-btn ms-btn-outline-primary ms-flag-btn" src="' + chrome.runtime.getURL("images/flags/fra.svg") + '" id="img-fra" data-domain="fr">' +
                    '<img class="ms-flag ms-p-2 ms-border-0 ms-btn ms-btn-outline-primary ms-flag-btn" src="' + chrome.runtime.getURL("images/flags/deu.svg") + '" id="img-deu" data-domain="de">' +
                    '<img class="ms-flag ms-p-2 ms-border-0 ms-btn ms-btn-outline-primary ms-flag-btn" src="' + chrome.runtime.getURL("images/flags/esp.svg") + '" id="img-esp" data-domain="es">' +
                    '<img class="ms-flag ms-p-2 ms-border-0 ms-btn ms-btn-outline-primary ms-flag-btn" src="' + chrome.runtime.getURL("images/flags/ita.svg") + '" id="img-ita" data-domain="it">' +
                    '</div>' +
                    '</div>' +
                    '<div class="ms-justify-content-center ms-mt-2 ms-row">' +
                    '<div class="ms-col-10">' +
                    '<div class="ms-input-group">' +
                    '<input type="text" class="ms-form-control ms-bg-light" aria-describedby="button-addon2" id="searchOnValue" value="" style="font-size:12px!important;">' +
                    '<button class="ms-btn ms-btn-warning" type="button" id="searchOnBtn">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">' +
                    '<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />' +
                    '</svg>' +
                    '</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +

                    '<div class="ms-col-12 ms-text-center div-spinner">' +
                    '<div class="ms-spinner-border ms-mt-2" role="status"></div>' +
                    '</div>' +

                    '<div id="panelBodyProductsPanel" class="ms-overflow-auto ms-p-2 ms-col-12" style="height: 100%;">' +
                    '</div>' +

                    '</div>' +
                    '</div>');

                $("#searchOnPanel .ms-btn-close").click(function () {
                    $("#searchOnPanel").removeClass("ms-d-flex").addClass("ms-d-none");

                    $("#arbBarcodeComparerPanel, #arbPanel").animate({
                        right: "1.25rem",
                    }, 500, function () {
                        // Animation complete.
                    });
                });

                this.BindEvents();
            }
        } catch (error) {
            errorHandler.SendErrorToAdmin(error, "searchOnPanelInit");
        }
    },
    SearchProducts: async function (selectedDomain, selectedText) {
        try {
            if (!token) {
                toast.ShowWarning("Please login to use this feature.");
            } else {
                if (selectedText) {
                    selectedText = selectedText.substring(0, 100);

                    $("#searchOnPanel").removeClass("ms-d-none");

                    $("#arbBarcodeComparerPanel, #arbPanel").css("right", $("#searchOnPanel")[0]?.offsetWidth);

                    $(".mysys #searchOnPanelBody .div-spinner").removeClass("ms-d-none");
                    $(".mysys .ms-flag").addClass("ms-btn-outline-primary").removeClass("ms-btn-primary");
                    $(".mysys #searchOnValue").val(selectedText);
                    $(".mysys .ms-flag[data-domain='" + selectedDomain + "']").addClass("ms-btn-primary").removeClass("ms-btn-outline-primary");
                    $(".mysys #searchOnPanelBody #panelBodyProductsPanel").html("");

                    var amzMarketplace = "";
                    switch (selectedDomain) {
                        case "com":
                            amzMarketplace = "amazon.com";
                            break;
                        case "ca":
                            amzMarketplace = "amazon.ca";
                            break;
                        case "co.uk":
                            amzMarketplace = "amazon.co.uk";
                            break;
                        case "fr":
                            amzMarketplace = "amazon.fr";
                            break;
                        case "de":
                            amzMarketplace = "amazon.de";
                            break;
                        case "es":
                            amzMarketplace = "amazon.es";
                            break;
                        case "it":
                            amzMarketplace = "amazon.it";
                            break;
                    }

                    $("#amzMarketplace").html(amzMarketplace);

                    let productsInfoElems = await this.GetProductsElements(selectedDomain, selectedText);
                    if (productsInfoElems) {
                        $(".mysys #searchOnPanelBody #panelBodyProductsPanel").html(productsInfoElems);
                    } else {
                        $(".mysys #searchOnPanelBody #panelBodyProductsPanel").html('<div class="ms-text-center"><span class="ms-fst-italic">Not Found...</span></div>');
                    }

                    $(".mysys #searchOnPanelBody .div-spinner").addClass("ms-d-none");

                    $("#panelBodyProductsPanel").outerHeight($("#searchOnPanelBody").outerHeight() - $("#topPanel").outerHeight());
                }
            }
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    GetProductsElements: async function (selectedDomain, selectedText) {
        try {
            let products = await this.GetProducts(selectedDomain, selectedText);

            if (products?.length > 0) {
                let productInfoElem = "";

                for (let index = 0; index < products.length; index++) {
                    const product = products[index];

                    productInfoElem += `
                        <div class="ms-row ms-bg-white ms-shadow ms-p-2 ms-m-0 ms-mb-2 ms-w-100" style="border-radius: 10px;">
                            <div class="ms-col-5">
                                <img src="${product.ImageUrl}" alt="" class="ms-img-fluid productImage">
                            </div>
                            <div class="ms-col-7">
                                <div class="ms-row">
                                    <div class="ms-col-12 ms-mb-1">
                                        <span class="productTitle ms-fw-bold" style="word-break: break-word;">${product.Title}</span>
                                    </div>
                                    <div class="ms-col-12 ms-mb-1">
                                        <a href="https://www.amazon.${selectedDomain}/dp/${product.ASIN}?th=1&psc=1" class="productASIN ms-text-decoration-none ms-fw-bold" target="_blank">${product.ASIN}</a>
                                    </div>
                                    <div class="ms-col-12 ms-mb-1">
                                        <span class="productPrice">${product.Price}</span>                    
                                    </div>
                                    <div class="ms-col-12">    
                                        <span class="">Rating&nbsp;(Reviews):&nbsp;</span>                    
                                        <span class="productRating ms-fw-bold">${product.Rating}</span>&nbsp;&nbsp;&nbsp;(&nbsp;<span class="productRewiew ms-fw-bold">${product.TotalReviews}</span>&nbsp;)
                                    </div>
                                </div>
                            </div>
                        </div>`;
                }

                return productInfoElem;
            }
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }

        return "";
    },
    GetProducts: async function (selectedDomain, selectedText) {
        try {
            let countries = [
                ["na", "US", "USA", "com"],
                ["na", "CA", "Canada", "ca"],
                ["eu", "DE", "Germany", "de"],
                ["eu", "FR", "France", "fr"],
                ["eu", "GB", "United Kingdom", "co.uk"],
                ["eu", "IT", "Italy", "it"],
                ["eu", "ES", "Spain", "es"],
                ["eu", "UAE", "UAE", "ae"],
                ["eu", "TR", "TR", "tr"],
            ];

            let selectedCountry = countries.find(x => x[3] === selectedDomain);

            let products = await common.GetProductInfoFromAmazonByBarcode(selectedText, selectedCountry[0], selectedCountry[1]);

            if (products && products.results?.length > 0) {
                return products.results;
            } else {
                return false;
            }
        } catch (error) {
            if (error.indexOf("Failed to fetch") > -1) {
                toast.ShowWarning("Some queries made via the Amazon API on this computer cannot be answered.<br>" +
                    "This is usually related to the settings of the antivirus program, firewall or ad-blocking software you are using.<br>" +
                    "If you are using such applications, try to close these applications for testing or try to unblock Amazon links and run them again.");
            } else {
                errorHandler.SendErrorToAdmin(error);
            }
            return false;
        }
    },
    BindEvents: function () {
        try {
            $(document).on("click", ".mysys .ms-flag", function () {
                let selectedDomain = $(this).attr("data-domain");
                let selectedText = $(".mysys #searchOnValue").val();

                if (selectedDomain && selectedText) {
                    searchOnPanel.SearchProducts(selectedDomain, selectedText);
                }
            });

            $(document).on("click", ".mysys #searchOnBtn", function () {
                let selectedDomain = $(".mysys .ms-flag.ms-btn-primary").attr("data-domain");
                let selectedText = $(".mysys #searchOnValue").val();

                if (selectedDomain && selectedText) {
                    searchOnPanel.SearchProducts(selectedDomain, selectedText);
                }
            });
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    }
}
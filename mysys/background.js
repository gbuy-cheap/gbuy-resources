'use strict';

try {
    importScripts("js/common.js", "js/auth.js", "js/langs.js");
} catch (e) {
    console.error(e);
}

// chrome.contextMenus.create({
//     title: 'MySYS Extension',
//     id: "main-context-menu",
//     contexts: ["selection"]
// });

// chrome.contextMenus.create({
//     title: 'Search On Amazon.com',
//     id: "mcm-amz-com",
//     parentId: "main-context-menu",
//     contexts: ["selection"]
// });

// chrome.contextMenus.create({
//     title: 'Search On Amazon.ca',
//     id: "mcm-amz-ca",
//     parentId: "main-context-menu",
//     contexts: ["selection"]
// });

// chrome.contextMenus.create({
//     title: 'Search On Amazon.co.uk',
//     id: "mcm-amz-co.uk",
//     parentId: "main-context-menu",
//     contexts: ["selection"]
// });

// chrome.contextMenus.create({
//     title: 'Search On Amazon.de',
//     id: "mcm-amz-de",
//     parentId: "main-context-menu",
//     contexts: ["selection"]
// });

// chrome.contextMenus.create({
//     title: 'Search On Amazon.fr',
//     id: "mcm-amz-fr",
//     parentId: "main-context-menu",
//     contexts: ["selection"]
// });

// chrome.contextMenus.create({
//     title: 'Search On Amazon.es',
//     id: "mcm-amz-es",
//     parentId: "main-context-menu",
//     contexts: ["selection"]
// });

// chrome.contextMenus.create({
//     title: 'Search On Amazon.it',
//     id: "mcm-amz-it",
//     parentId: "main-context-menu",
//     contexts: ["selection"]
// });

chrome.contextMenus.onClicked.addListener(
    function (info) {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
            if (tabs.length > 0) {
                let messageContent = {
                    message: "cmSearchOnAmazon",
                    selectedDomain: info.menuItemId.split("mcm-amz-")[1],
                    selectedText: info.selectionText
                };
                chrome.tabs.sendMessage(tabs[0].id, messageContent, function (response) { });
            }
        });
    }
);

chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        chrome.tabs.sendMessage(tab.id, { message: "isTabActive", isTabActive: true }, function (response) { });
    });
});

chrome.tabs.onUpdated.addListener(function (tabId) {
    chrome.tabs.get(tabId, function (tab) {
        if (tab.active) {
            chrome.tabs.sendMessage(tab.id, { message: "isTabActive", isTabActive: true }, function (response) { });
        }
    });
});


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type == "m0") {
        chrome.storage.local.get(['mysysToken'], function (result) {
            if (result?.mysysToken) {
                try {
                    let fetchOption = {
                        method: message.method ?? 'POST',
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            "token": result.mysysToken
                        }
                    }

                    if (message.method != "GET" && message.data && message.data != "") {
                        fetchOption.body = JSON.stringify(message.data);
                    }

                    fetch(message.url, fetchOption).then(common.HandleError).then(response => response.json()
                    ).then(returnVal => {
                        sendResponse({
                            response: returnVal
                        });
                    }).catch(error => {
                        sendResponse({
                            response: { isSuccess: false, userMessage: error?.stack ?? error?.message }
                        })
                    })
                } catch (error) {
                    SendExtensionError(error);
                }
            } else {
                sendResponse({
                    response: { isSuccess: false, userMessage: "Session is timed-out or invalid. Please sign in." }
                });
            }
        });
    } else if (message.type == "m1") {
        try {
            let asin = message.content.ASIN;
            let domain = message.content.Domain;
            let marketPlace = message.content.MarketPlace;
            let currency = message.content.Currency;
            let price = message.content.Price;
            let countryCode = "";
            let locale = message.content.Locale;

            if (locale) {
                countryCode = locale.split("-")[1];
            }

            //https://sellercentral.amazon.com/rcpublic/productmatch?searchKey=B08JCCD8F8&countryCode=US&locale=en-US
            let url1 = `https://sellercentral.amazon.${domain}/rcpublic/productmatch?searchKey=${asin}&countryCode=${countryCode}&locale=${locale}`;

            fetch(url1).then(common.HandleError).then(resp1 => resp1.json())
                .then(jsonResponse1 => {
                    try {
                        if (jsonResponse1?.data?.otherProducts?.products[0]) {
                            let productInfo1 = jsonResponse1.data.otherProducts.products[0];

                            let url2 = `https://sellercentral.amazon.com/rcpublic/getadditionalpronductinfo?countryCode=${countryCode}&asin=${asin}&fnsku=&searchType=GENERAL&locale=${locale}`;

                            fetch(url2).then(common.HandleError).then(resp2 => resp2.json()).then(jsonResponse2 => {
                                if (jsonResponse2?.data) {
                                    let productInfo2 = jsonResponse2.data;

                                    let jsonPostData = {
                                        countryCode: jsonResponse1.data.countryCode,
                                        itemInfo: {
                                            afnPriceStr: price.toString(),
                                            asin: productInfo1.asin,
                                            currency: currency,
                                            dimensionUnit: productInfo1.dimensionUnit,
                                            glProductGroupName: productInfo1.gl,
                                            isNewDefined: false,
                                            mfnPriceStr: price.toString(),
                                            mfnShippingPriceStr: "0",
                                            packageHeight: productInfo2.height.toString(),
                                            packageLength: productInfo2.length.toString(),
                                            packageWeight: productInfo2.weight.toString(),
                                            packageWidth: productInfo2.width.toString(),
                                            weightUnit: productInfo1.weightUnit,
                                        },
                                        programIdList: ["Core", "MFN"]
                                    };

                                    // var url3 = 'https://sellercentral.amazon.com/fba/profitabilitycalculator/getafnfee?profitcalcToken=123456qwerty';

                                    //https://sellercentral.amazon.com/rcpublic/getfees?locale=en-US
                                    let url3 = `https://sellercentral.amazon.${domain}/rcpublic/getfees?locale=${locale}`;

                                    fetch(url3, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json; charset=utf-8',
                                        },
                                        body: JSON.stringify(jsonPostData)
                                    }).then(common.HandleError).then(response => response.json()
                                    ).then(returnVal => {
                                        try {
                                            console.log(returnVal);
                                            let feeCore = returnVal?.data?.programFeeResultMap?.Core;

                                            let peakStorageFee, nonPeakStorageFee, currentStorageFee;
                                            let varCloseFee, referralFee, fulfillmentFee;

                                            varCloseFee = feeCore?.otherFeeInfoMap?.VariableClosingFee?.feeAmount?.amount;
                                            referralFee = feeCore?.otherFeeInfoMap?.ReferralFee?.feeAmount?.amount;
                                            fulfillmentFee = feeCore?.otherFeeInfoMap?.FulfillmentFee?.feeAmount?.amount;

                                            peakStorageFee = feeCore?.perUnitPeakStorageFee?.feeAmount?.amount;
                                            nonPeakStorageFee = feeCore?.perUnitNonPeakStorageFee?.feeAmount?.amount;

                                            let jan = 0, sept = 8, oct = 9, dec = 11;
                                            let currMonth = new Date().getMonth();

                                            if (currMonth >= jan && currMonth <= sept && nonPeakStorageFee) {
                                                currentStorageFee = parseFloat(nonPeakStorageFee.toFixed(2));
                                            } else if (currMonth >= oct && currMonth <= dec && peakStorageFee) {
                                                currentStorageFee = parseFloat(peakStorageFee.toFixed(2));
                                            }

                                            let response = {
                                                StorageFee: currentStorageFee,
                                                VarCloseFee: varCloseFee,
                                                ReferralFee: Math.round((referralFee * 100) / price),
                                                FulfillmentFee: fulfillmentFee
                                            }

                                            console.log(response);

                                            sendResponse({
                                                response: response
                                            });
                                        } catch (error) {
                                            SendExtensionError(error);
                                            sendResponse({
                                                response: {}
                                            });
                                        }
                                    }).catch(error => {
                                        sendResponse({
                                            response: { isSuccess: false, userMessage: error }
                                        })
                                    });
                                }
                            }).catch(error => {
                                sendResponse({
                                    response: { isSuccess: false, userMessage: error }
                                })
                            });
                        } else {
                            sendResponse({
                                response: { isSuccess: false, userMessage: "data not found" }
                            });
                        }
                    } catch (error) {
                        SendExtensionError(error);
                    }
                }).catch(error => {
                    sendResponse({
                        response: { isSuccess: false, userMessage: error }
                    })
                })
        } catch (error) {
            SendExtensionError(error);
        }

    } else if (message.type == "m2") {
        var url = `https://www.amazon.${message.content.Domain}/dp/${message.content.ASIN}?th=1&psc=1`;

        fetch(url).then(common.HandleError).then(response => response.text()).then(text => {
            sendResponse({
                response: text
            });
        }).catch(error => {
            sendResponse({
                response: { isSuccess: false, userMessage: error }
            })
        })
    } else if (message.type == "m3") {

        let formData = new FormData();
        formData.append("workflowId", message.data.workflowId);
        formData.append("requiredAttributes", message.data.requiredAttributes);
        formData.append("currentStepName", message.data.currentStepName);
        formData.append("sxaugur.encrypt.newAttributes", JSON.stringify(message.data["sxaugur.encrypt.newAttributes"]));
        formData.append("diagRunId", message.data.diagRunId);
        formData.append("client", message.data.client);
        formData.append("paramountEphUser", message.data.paramountEphUser);
        formData.append("paramountEphUuid", message.data.paramountEphUuid);
        formData.append("isResumingWorkflow", message.data.isResumingWorkflow);


        let fetchOption = {
            method: 'POST',
            body: formData
        };

        fetch(message.url, fetchOption).then(common.HandleError).then(response => response.text()).then(returnHTML => {
            sendResponse({
                response: returnHTML
            });
        });

    } else if (message.type == "m4") {
        var content = message.content;

        var quantityUrl = `https://www.amazon.${content.domain}/cart?_encoding=UTF8&HMrequestID=0&a=${content.asin}&app=hm&messageID=5128&o=add&oid=${content.offeringId}&quantity=999&redirectToFullPage=1&verificationSessionID=${content.sessionId}`;

        let formData = new FormData();
        formData.append("oid", content.offeringId);
        formData.append("quantity", 999);
        formData.append("o", "add");
        formData.append("a", content.asin);
        formData.append("verificationSessionID", content.sessionId);

        fetch(quantityUrl, {
            method: "POST",
            body: formData,
            headers: {
                "content-language": "en-US"
            }
        }).then(common.HandleError).then(response => response.text()).then(addedToCartHtml => {
            // ürüne ilave garanti satın al sayfası çıktı ise
            if (addedToCartHtml?.indexOf("warranty_info") > -1) {
                fetch(quantityUrl, {
                    method: "POST",
                    body: formData
                }).then(common.HandleError).then(response => response.text()).then(addedToCartHtml2 => {
                    sendResponse({
                        response: addedToCartHtml2
                    });
                });
            } else {
                sendResponse({
                    response: addedToCartHtml
                });
            }
        })
    } else if (message.type == "m5") {

        let formData = new FormData();
        formData.append("submit.cart-actions", 1);
        formData.append("pageAction", "cart-actions");
        formData.append("actionPayload", '[{"type":"DELETE_START","payload":{"itemId":"' + message.content.itemId + '","list":"activeItems","relatedItemIds":[],"isPrimeAsin":false}}]');
        formData.append("hasMoreItems", false);
        formData.append("addressId", "");
        formData.append("addressZip", "");
        formData.append("closeAddonUpsell", 1);
        formData.append("displayedSavedItemNum", 0);
        formData.append("activeItems", message.content.activeItems);
        formData.append("timeStamp", message.content.timeStamp);
        formData.append("requestID", message.content.requestID);
        formData.append("token", message.content.token);
        formData.append("redirectToFullPage", 1);

        let strFormData = `submit.cart-actions=1&pageAction=cart-actions&actionPayload=[{"type":"DELETE_START","payload":{"itemId":"${message.content.itemId}","list":"activeItems","relatedItemIds":[],"isPrimeAsin":false}}]&hasMoreItems=false&addressId=&addressZip=&closeAddonUpsell=1&displayedSavedItemNum=0&activeItems=${message.content.activeItems}&timeStamp=${message.content.timeStamp}&requestID=${message.content.requestID}&token=${encodeURIComponent(message.content.token)}&redirectToFullPage=1`;

        fetch('https://www.amazon.' + message.content.domain + '/cart/ref=ox_sc_cart_actions_1', {
            method: 'POST',
            body: strFormData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;',
                'x-kl-ajax-request': 'Ajax_Request',
                'x-requested-with': 'XMLHttpRequest',
                'accept': 'application/json, text/javascript, */*; q=0.01'
            }
        }).then(common.HandleError)
            .then(async response => {
                try {
                    let result = await response.text();
                    if (result)
                        sendResponse({ response: result })
                } catch (error) {
                    console.error(error);
                    SendExtensionError(error);
                }
            });

    } else if (message.type == "m6") {
        SendMessageToAPI(message.data).then(returnVal => {
            sendResponse({
                response: returnVal
            });
        }).catch(err => {
            sendResponse({
                response: err
            });
        });
    } else if (message.type == "m7") {
        auth.Login(message.email, message.password).then((returnVal) => {
            sendResponse({
                response: returnVal
            });
        }, (error) => {
            sendResponse({
                response: error
            });
        });
    } else if (message.type == "m8") {
        auth.SignUp(message.name, message.email, message.phone, message.password, message.confirmpassword).then((returnVal) => {
            sendResponse({
                response: { isSuccess: true, returnVal }
            });
        }, (error) => {
            sendResponse({
                response: error
            });
        });
    } else if (message.type == "m9") {

        let formData = new FormData();
        formData.append("workflowId", message.data.workflowId);
        formData.append("requiredAttributes", message.data.requiredAttributes);
        formData.append("currentStepName", message.data.currentStepName);
        formData.append("sxaugur.encrypt.newAttributes", JSON.stringify(message.data["sxaugur.encrypt.newAttributes"]));
        formData.append("diagRunId", message.data.diagRunId);
        formData.append("client", message.data.client);
        formData.append("paramountEphUser", message.data.paramountEphUser);
        formData.append("paramountEphUuid", message.data.paramountEphUuid);
        formData.append("isResumingWorkflow", message.data.isResumingWorkflow);

        let fetchOption = {
            method: 'POST',
            body: formData
        };

        fetch(message.url, fetchOption).then(common.HandleError).then(response => response.text()).then(returnHTML => {
            sendResponse({
                response: returnHTML
            });
        });

    } else if (message.type == "m10") {

        let facetFilterContent = "[";
        let categoryStr;
        if (message.categories) {
            categoryStr = '["category_tree.lvl' + (message.categories.length - 1) + ":" + message.categories.join(" > ") + '"]';
        }

        if (message.brandNames && message.brandNames.length > 0) {
            let brandName = "[";

            for (let index = 0; index < message.brandNames.length; index++) {
                brandName += `"brand_name:${message.brandNames[index]}"`;
                if (index < message.brandNames.length - 1) {
                    brandName += ","
                }
            }

            brandName += "],";

            facetFilterContent += brandName + (categoryStr ?? "");
        } else {
            facetFilterContent += (categoryStr ?? "");
        }

        facetFilterContent += "]";

        if (facetFilterContent != "[]") {
            facetFilterContent = "&facetFilters=" + encodeURIComponent(facetFilterContent);
        } else {
            facetFilterContent = "";
        }

        let facets = '["brand_name","margin_percent","discount_percent","in_stock",';

        if (message.categories) {
            for (let index = 0; index <= message.categories.length; index++) {
                if (index < message.categories.length) {
                    facets += `"category_tree.lvl${index}",`;
                } else {
                    facets += `"category_tree.lvl${index}"]`;
                }
            }
        } else {
            facets = facets.substring(0, facets.length - 1) + "]";
        }

        facets = encodeURIComponent(facets);

        let query = "";

        if (message.searchText) {
            query = `&query=${encodeURIComponent(message.searchText)}`;
        }

        let numericFilter = "";
        if (message.margin || message.discountPercent) {
            numericFilter += "[";

            if (message.margin?.length > 0) {
                numericFilter += `["margin_percent>=${message.margin[0]}","margin_percent<=${message.margin[1]}"],`;
            }
            if (message.discountPercent?.length > 0) {
                numericFilter += `["discount_percent>=${message.discountPercent[0]}","discount_percent<=${message.discountPercent[1]}"]`;
            }

            numericFilter += "]";

            numericFilter = "&numericFilters=" + encodeURIComponent(numericFilter);
        }

        let highlightPostTag = encodeURIComponent("</ais-highlight-0000000000>");
        let highlightPreTag = encodeURIComponent("<ais-highlight-0000000000>");

        let reqData = {
            "requests": [
                {
                    "indexName": "qogita-prod",
                    "params": `clickAnalytics=true&enablePersonalization=true${facetFilterContent}&facets=${facets}&highlightPostTag=${highlightPostTag}&highlightPreTag=${highlightPreTag}&hitsPerPage=${message.productsPerPage}&maxValuesPerFacet=25${numericFilter}&page=${message.currentPage}${query}&tagFilters=`
                }
            ]
        };

        let url = 'https://mjrabv4pl3-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia for JavaScript (4.14.2); Browser (lite); JS Helper (3.10.0); react (17.0.2); react-instantsearch (6.31.0)&x-algolia-api-key=fa76ab4ee65cd3bab5bb9b931d010764&x-algolia-application-id=MJRABV4PL3';

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(reqData),
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
        }).then(common.HandleError).then(response => response.json()).then(result => sendResponse({ response: result?.results[0]?.hits })).catch(err => SendExtensionError(err));

    } else if (message.type == "m16") {
        var url = "https://sellercentral.amazon." + message.content.Domain + "/productsearch/v2/search?q=" + message.content.ASIN + "&page=1";
        fetch(url, {
            method: 'GET'
        }).then(common.HandleError).then(response => response.json()
        ).then(returnVal => {
            sendResponse({
                response: returnVal
            });
        }).catch(error => {
            sendResponse({
                response: { isSuccess: false, userMessage: error }
            })
        })
    } else if (message.type == "simple") {
        let reqURL = message.url;

        fetch(reqURL, {
            method: 'GET',
        }).then(common.HandleError).then(response => response.text()).then(text => {
            sendResponse({
                response: text
            })
        }).catch(error => {
            sendResponse({
                response: { isSuccess: false, userMessage: error?.stack + "\n" + reqURL }
            })
        })
    }
    return true;
});

function SendExtensionError(error) {
    chrome.storage.local.get(['mysysToken'], async function (result) {
        let token = ""
        if (result?.mysysToken) {
            token = result.mysysToken;
        }

        let contactData = {
            "Subject": "Extension Error",
            "Message": (error?.stack ?? error) + "\nUser Token: " + token
        }
        await SendMessageToAPI(contactData);
    })
}

function SendMessageToAPI(data) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['mysysToken'], function (result) {
            if (result?.mysysToken) {
                let fetchOption = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        "token": result.mysysToken
                    },
                    body: JSON.stringify(data)
                }
                fetch(`${common.HOST}/api/amazon/contact`, fetchOption).then(common.HandleError).then(response => response.json()
                ).then(returnVal => {
                    resolve(returnVal);
                }).catch(error => {
                    reject({ isSuccess: false, userMessage: error.message });
                })
            } else {
                reject({ isSuccess: false, userMessage: "User not found" });
            }
        });
    })
}
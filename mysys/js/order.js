var order = {
    Init: async function () {
        let tableLoaded = false;

        let counter = 0;
        while ($("#orderRefreshButton").length == 0 || counter < 10) {
            await common.Sleep(1000);
            if ($("span[data-test-id='refresh-button']").length > 0) {
                tableLoaded = true;
                break;
            }
            counter++;
        }

        if (tableLoaded) {
            $("span[data-test-id='refresh-button']").eq(0).after('<div id="orderRefreshButton" class="mysys ms-btn ms-btn-success ms-mx-2 ms-py-1">Sipariş Bilgilerini MySYS\'e Aktar</div>');
        }

        this.SetInitalEvents();
    },
    SetInitalEvents: function () {
        $(document).on("click", "#orderRefreshButton", function () {
            let that = $(this);
            that.addClass("disabled");

            var MarketplaceID = $('#partner-switcher').attr('data-marketplace_selection').trim();
            var StoreName = $('.partner-label')[0].textContent;					// FY-Trade

            var data = {
                StoreName: StoreName,
                MarketplaceId: MarketplaceID,
            };

            chrome.runtime.sendMessage({
                type: "m0",
                data: data,
                url: `${common.HOST}/api/order/getorderdetailsfromamazon`,
                method: 'POST'
            }, (response) => {
                try {
                    if (response?.response?.isSuccess) {

                        var orderIdlist = response.response.paramStr.split(",");
                        orderIdlist.forEach(id => {
                            pageURLDomain = document.location.origin;
                            const url = pageURLDomain + "/orders/packing-slip?orderId=" + id;

                            $.get(url, function (html) {
                                try {
                                    var orderPage = $(html);

                                    var addressSpanList = $("#myo-order-details-buyer-address", orderPage).eq(0).html()?.split("<br>");
                                    if (addressSpanList && addressSpanList.length > 0) {

                                        var buyerName = addressSpanList[0].trim();
                                        var buyerStreet1 = addressSpanList[1].trim();
                                        var buyerStreet2 = "";
                                        if (addressSpanList.at(-1).trim().indexOf('Canada') > -1 ||
                                            addressSpanList.at(-1).trim().indexOf('xico') > -1) {
                                            if (addressSpanList.length == 5) {
                                                buyerStreet2 = addressSpanList.at(2).trim();
                                            }
                                        } else {
                                            if (addressSpanList.length == 4) {
                                                buyerStreet2 = addressSpanList.at(2).trim();
                                            }
                                        }

                                        var buyerPhone = "";

                                        var data2 = {
                                            "OrderID": id,
                                            "BuyerName": buyerName,
                                            "BuyerStreet1": buyerStreet1,
                                            "BuyerStreet2": buyerStreet2,
                                            "BuyerPhone": buyerPhone,
                                        };

                                        chrome.runtime.sendMessage({
                                            type: "m0",
                                            data: data2,
                                            url: `${common.HOST}/api/order/amazonorder`,
                                            method: 'POST'
                                        }, (response) => {
                                            try {
                                                if (response?.response?.isSuccess) {
                                                    toast.ShowMessage(response.response.userMessage);
                                                } else {
                                                    toast.ShowError(response.response.userMessage);
                                                }
                                                that.removeClass("disabled");
                                            } catch (error) {
                                                errorHandler.SendErrorToAdmin(error);
                                            } finally {
                                                that.removeClass("disabled");
                                            }
                                        });
                                    }
                                } catch (error) {
                                    errorHandler.SendErrorToAdmin(error);
                                } finally {
                                    that.removeClass("disabled");
                                }
                            });
                        });
                    } else {
                        toast.ShowError(response?.response?.userMessage);
                        that.removeClass("disabled");
                    }
                } catch (error) {
                    errorHandler.SendErrorToAdmin(error);
                } finally {
                    that.removeClass("disabled");
                }
            });
        });
    }
};
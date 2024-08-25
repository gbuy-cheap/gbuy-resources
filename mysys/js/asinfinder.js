"use strict";

async function findASIN() {
    try {
        let asin = GetASIN();
        let domain = common.GetDomain();

        $("#spASIN").html(`<a class="ms-link-info ms-text-decoration-underline" href="https://www.amazon.${domain}/dp/${asin}?th=1&psc=1" target="_blank">${asin}</a>`)
    } catch (error) {
        errorHandler.SendErrorToAdmin(error);
    }

    $(document).on("change", "#native_dropdown_selected_size_name", function (e) {
        try {
            let elem = $(this);
            if (elem.val() != "-1") {
                let asin = elem.val().split(",")[1];
                if (asin) {
                    window.location.replace(`https://www.amazon.${domain}/dp/${asin}?th=1&psc=1`);
                }
            }
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    });

    $(document).on("click", "a[id^='native_dropdown_selected_size_name']", function (event) {
        try {
            var elem = $(this);

            if (elem.data("value")?.stringVal?.indexOf("-1") != -1) {
                elem = $("#native_dropdown_selected_size_name_1");
            }
            let asin = elem.data("value")?.stringVal?.split(",")[1];
            window.location.replace(`https://www.amazon.${domain}/dp/${asin}?th=1&psc=1`);
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    });

    $(document).on("click", "li[id^='color_name'],li[id^='style_name'],li[id^='size_name']", function (e) {
        try {
            var elem = $(this);
            if ($(elem).attr("data-dp-url")) {
                window.location.replace($(elem).attr("data-dp-url"));
            }
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    });

    $(document).on("click", "span[id^='size_name'],span[id^='color_name']", function () {
        try {
            let asin = $(this).parents("li[data-asin]").eq(0).attr("data-asin");
            window.location.replace(`https://www.amazon.${domain}/dp/${asin}?th=1&psc=1`);
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    });

    setTimeout(() => {
        try {
            var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl, {
                    container: 'body'
                })
            })
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    }, 3000);
}

function GetASIN() {
    if ($("select#native_dropdown_selected_size_name option:selected").val() == -1) {
        return common.GetASINFromURL();
    }
    return $("input#ASIN[name='ASIN']").val() || common.GetASINFromURL();
}


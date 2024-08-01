/**
 * Injection of main modal and initialization of all components of the
 * main modal and the content modals.
 */
$(document).ready(function () {
    const selector = "#egrowModal";

    return new Promise(function (resolve) {
        // Inject fontawsome
        const pathFontAwesome = chrome.extension.getURL("/assets/css/fontawesome-all.min.css");
        $("head").append($("<link>")
            .attr("rel", "stylesheet")
            .attr("type", "text/css")
            .attr("href", pathFontAwesome));

        const pathFontLato = chrome.extension.getURL("/assets/css/lato.css");
        $("head").append($("<link>")
            .attr("rel", "stylesheet")
            .attr("type", "text/css")
            .attr("href", pathFontLato));

        const egrowMarketClass = `egrow-market-${Helper.MemberArea.getMarketPlaceId(location.host)}`;

        // Create html element for main modal
        const egrowModal = document.createElement("div");
        egrowModal.style.zIndex = 1000000;
        egrowModal.setAttribute("id", selector.replace("#", ""));
        egrowModal.classList.add("waiting", "first-injection", egrowMarketClass); // Adding start classes
        document.body.appendChild(egrowModal);
        jQuery.get(chrome.extension.getURL("templates/main_modal.html"), function (resultHTML) {
            jQuery(selector).append(resultHTML);
            jQuery(selector).draggable({
                handle: ".draggable"
            });
            jQuery(selector).resizable();

            // Update image paths for icons
            const rootPath = chrome.extension.getURL("/");
            $(selector + " [src]").each(function () {
                let source = $(this).attr("src");
                if (source.includes("##path##")) {
                    source = source.replace("##path##", rootPath);
                }

                $(this).attr("src", source);
            });

            // Init all tooltips
            Helper.tooltips.init(selector);

            // Remove all tooltips on leaving the modal
            $(selector).mouseleave(function () {
                $(selector + " [data-toggle=\"tooltip\"], " + selector + " .tooltip").tooltip("hide");
            });

            resolve();
        });
    })
    .then(() => { CONTENT.components = new ContentComponents(); })
    .then(() => {
        // Resize the table
        $(selector).on("resize", function () {
            // calculates the heights of the resized modal
            const tableStatsHeight = $("#egrowTableStats")[0].scrollHeight;
            const tableHeaderHeight = $(".egrow-header")[0].scrollHeight;
            const rowHeight = $(".egrow-col")[0].scrollHeight;
            const finalHeight = tableStatsHeight + tableHeaderHeight + rowHeight;
            CONTENT.components.mainModal.body.table.resize(finalHeight);
        });
    })
    .then(() => {
        const url = new URL(location.href);
        const urlSearch = new URLSearchParams(url.search);
        if(urlSearch.has('ce_reload')) {
            contentMessageHandlers.processMessage(new MessageContent(MESSAGE_CONTENT_ACTIONS.SHOW_MAIN_MODAL));
            urlSearch.delete('ce_reload');
            url.search = urlSearch.toString()
            history.replaceState({}, '', url.href)
        }
    });
});

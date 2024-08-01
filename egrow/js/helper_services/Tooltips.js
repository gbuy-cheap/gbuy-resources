/**
 * Function controls tooltips in the chrome extension for elements with the title attribute (default).
 *
 * @type {{shortenTo, escapeHTML}}
 */

Helper.tooltips = (function () {
    function init (finalSelector) {
        var titleElements = $(finalSelector);

        titleElements.each(function () {
            if (!$(this).data("ui-tooltip")) {
                $(this).tooltip({
                    tooltipClass: "egrow-tooltip",
                    position: {
                        my: "center top",
                        at: "center bottom+20",
                        using: function (position, feedback) {
                            $(this).css(position);
                            $("<div>")
                                .addClass("arrow")
                                .addClass(feedback.vertical)
                                .addClass(feedback.horizontal)
                                .appendTo(this);
                        }
                    },
                    close: function (event, ui) {
                        $(".ui-helper-hidden-accessible").remove(); // Removes all elements
                    }
                });
            }
        });
    }

    function destroy (element) {
        var tooltipElement = $(element).closest("a");
        if (tooltipElement.data("ui-tooltip")) {
            tooltipElement.tooltip("destroy");
        }
    }

    return {
        init: function (selector) {
            init(selector + " [title]");
        },
        initSingleElement: function (selector) {
            init(selector);
        },
        destroy: function (element) {
            destroy(element);
        }
    };
}());

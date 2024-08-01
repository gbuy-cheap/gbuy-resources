/**
 * Base component for forms. It includes validation functions and functions on
 * when to blur/select the input fields (on which button clicks).
 */
class FormComponent extends HtmlComponent {

    /**
     * The settings define how the tooltips next to the input fields
     * are displayed.
     */
    static _TOOLTIP_SETTINGS = {
        tooltipClass: "egrow-tooltip form-tooltip",
        position: {
            my: "left+15 center",
            at: "right center",
            using: function (position, feedback) {
                $(this).css(position);
                $("<div>")
                    .addClass("arrow")
                    .addClass(feedback.vertical)
                    .addClass(feedback.horizontal)
                    .appendTo(this);
            }
        }
    };

    /**
     * @param selector
     * @param submitFunction is the function which is executed
     *        on submission of the form.
     */
    constructor(selector, submitFunction) {
        super(selector);

        /**
         * It includes basic functions which are necessary and equal for all forms.
         * The functions are 'go to next input on enter' and 'select input on focus'.
         * It applies the functions via the form id selector.
         */
        $(selector + " input").keydown(function (e) {
            if (e.which === 13) {
                $(e.target).blur();
                return false;
            }
        });

        // Select input text on focus
        $(selector + " input").focus(function () {
            $(this).select();
        });

        /**
         * It provides a function to init form validation on a form. Moreover it provides
         * the settings for the error tooltip which are shown when one of the above
         * conditions is violated.
         */
        $(selector).validate({
            errorPlacement: function (error, element) {
                $(element).attr("title", $(error).text()); // Add title
                $(element).tooltip(FormComponent._TOOLTIP_SETTINGS).tooltip("open"); // Inits and opens tooltip
                $(element).unbind('mouseenter mouseleave'); // Removes hover so tooltip stays open
            },
            onfocusout: function(element) {
                // If valid and had tooltip -> disable tooltip
                if ($(element).valid() && $(element).data('ui-tooltip')) {
                    $(element).tooltip("disable");
                }
            },
            submitHandler: submitFunction
        });
    }
}

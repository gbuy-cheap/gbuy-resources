/**
 * This function handles the addition of click and hover events.
 * Before adding any event it removes the previous events first so no multiple events are stacked on an element.
 * This is necessary for the table draw as on every draw the click and hover events are added again.
 *
 * @type {{addClick, addHover}}
 */

Helper.JsEventHandler = (function () {
    return {
        addClick: function (selector, clickFunction) {
            $(selector).off("click").click(clickFunction);
        },
        addHover: function (selector, functionIn, functionOut) {
            $(selector).off("mouseenter mouseleave").hover(functionIn, functionOut);
        }
    };
}());

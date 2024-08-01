/**
 * Base button component which provides a click functionality which needs to be
 * implemented in a child component. The {@link ButtonComponent.onClick} function
 * needs to be overwritten.
 *
 * Every button can be hidden or disabled. Per default every button is shown.
 * The button is disabled by adding the class "disabled" to the element.
 */
class ButtonComponent extends HtmlComponent {
    constructor (selector) {
        super(selector);

        this.disabledClass = "disabled";
        $(this.selector).off("click").click((event) => this.onClick(event));
    }

    onClick (event) {
        throw new Error("Need to implement click function in child!");
    }

    enable () {
        $(this.selector).removeClass(this.disabledClass);
    }

    disable () {
        $(this.selector).addClass(this.disabledClass);
    }
}

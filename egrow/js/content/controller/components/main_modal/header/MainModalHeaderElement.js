/**
 * It represents the base header element (button) of the main modal header.
 * It provides a different {@link hide} function than the normal
 * {@link ButtonComponent}.
 */
class MainModalHeaderElement extends ButtonComponent {
    hide () {
        $(this.selector).closest("li").hide();
    }
}

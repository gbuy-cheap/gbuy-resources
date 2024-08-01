/**
 * Base modal for different contents which are displayed over the main modal.
 * All content modals are hidden by default on startup.
 *
 * Every modal can be hidden or displayed.
 */
class ContentModal extends HtmlComponent {
    constructor (selector, fadeOutTime = 200) {
        super(selector);
        this.fadeOutTime = fadeOutTime;
        this.hide();
    }

    hide () {
        $(this.selector).hide(this.fadeOutTime);
    }
}

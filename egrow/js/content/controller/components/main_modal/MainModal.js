/**
 * It represents the main modal of the chrome extension which holds the
 * footer, body and header of the modal.
 *
 * It holds a private service which generates the actual html element
 * in the content area.
 */
class MainModal extends HtmlComponent {
    constructor () {
        super("#egrowModal");

        this.header = new MainModalHeader();
        this.body = new MainModalBody();
        this.footer = new MainModalFooter();
        this._isClosed = true;

        this.lastRelativeOffset = $(this.selector).offset(); // Offset of element where scrolled distance is subtracted
    }

    hide () {
        const superHide = () => {
            super.hide();
            this._isClosed = true;
        };
        return new Promise(function (resolve) {
            superHide();
            resolve();
        });
    }

    display () {
        const superDisplay = () => {
            super.display();
            this._isClosed = false;
        };
        return new Promise(function (resolve) {
            superDisplay();
            resolve();
        });
    }

    /**
     * The "waiting" class is added to the Main Modal.
     */
    startWaiting () {
        const selector = this.selector;
        const refreshButton = this.header.refreshButton;
        const disable = () => this.disable();
        return new Promise(function (resolve) {
            disable();
            CONTENT.components.waitingModal.display();
            refreshButton.startRotation();
            $(selector).removeClass("first-injection"); // Only used at the beginning
            $(selector).addClass("waiting");
            resolve();
        });
    }

    stopWaiting () {
        const selector = this.selector;
        const enable = () => this.enable();
        return new Promise(function (resolve) {
            enable();
            CONTENT.components.waitingModal.hide();
            $(selector).removeClass("waiting");
            resolve();
        });
    }

    isFirstTimeInjected () {
        return $(this.selector).hasClass("first-injection");
    }

    isClosed () {
        return this._isClosed;
    }

    disable () {
        this.header.disable();
        this.footer.disable();
    }

    enable () {
        this.header.enable();
        this.footer.enable();
    }

    minimize () {
        const scrolledY = $(window).scrollTop();

        // Set the width
        $(this.selector).width(920);

        // Set the position
        this.lastRelativeOffset = $(this.selector).offset();
        this.lastRelativeOffset.top -= scrolledY;
        $(this.selector).addClass("minimized");
        const top = scrolledY + $(window).height() - $(this.selector).height();
        const left = $(window).width() - $(this.selector).width();
        $("html, body").animate({ scrollTop: scrolledY });
        $(this.selector).offset({ top: top, left: left }); // Set back to old position

        this.header.menuMemberArea.disable();
    }

    maximize () {
        const scrolledY = $(window).scrollTop();

        $(this.selector).removeClass("minimized");

        /*
        Redraw the product table so the table headers are
        positioned correctly after the minimize modal has
        been moved.
         */
        this.body.table.redraw();

        // Set the position
        const top = scrolledY + this.lastRelativeOffset.top;
        const left = this.lastRelativeOffset.left;
        $("html, body").animate({ scrollTop: scrolledY });
        $(this.selector).offset({ top: top, left: left }); // Set back to old position

        this.header.menuMemberArea.enable();
    }
}

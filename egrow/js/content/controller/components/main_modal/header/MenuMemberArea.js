/**
 * It represents the menu in the top left corner of the header of the main modal.
 */
class MenuMemberArea extends MainModalHeaderElement {

    static _MENU_BUTTON_SELECTOR = "#menuButton";
    static _MENU_CLASS_SELECTOR = ".menu";
    static _LOGO_SELECTOR = ".logo";

    constructor() {
        super("#egrowMenu");

        this.showMenu = true;
        this.hideMenu = false;

        this.menu = $(this.selector).menu({}).hide();


        // Init Menu open and close function
        this._initMenuButton(MenuMemberArea._MENU_BUTTON_SELECTOR, this.menu, this.showMenu);

        // Init Menu hover to close the menu
        this._initMenuHover(MenuMemberArea._MENU_CLASS_SELECTOR, this.menu, this.showMenu, this.hideMenu);
    }

    onClick(event) {
        event.stopImmediatePropagation();

        const targetLink = event.target.dataset.target;
        let marketPlaceIdParam = `?marketplaceId=${Helper.MemberArea.getMarketPlaceId(location.host)}`;
        let base = 'https://egrow.io/';

        window.open(`${base}${targetLink}${marketPlaceIdParam}`, '_blank');
    }

    disable() {
        $(MenuMemberArea._MENU_BUTTON_SELECTOR).off("click");
    }

    enable() {
        this._initMenuButton(MenuMemberArea._MENU_BUTTON_SELECTOR, this.menu, this.showMenu);
    }

    _initMenuButton(selector, menu, showMenu) {
        $(selector).click(function () {
            if (showMenu) {
                menu.show().position({
                    my: "left top",
                    at: "left+1 bottom+1",
                    collision: "none",
                    of: $(MenuMemberArea._MENU_CLASS_SELECTOR)
                });
                ContentServices.analyticsTracker.trackUsageEvent(ANALYTICS_ACTION.MAIN_MODAL_HEADER, 'open_menu');
            } else {
                menu.hide();
            }
            showMenu = !showMenu;
        });
    }

    /**
     * On enter of the menu stop the closing of the menu.
     * On leave of the menu start timeout to close the menu.
     *
     * @param selector of the menu class
     * @param menu
     * @param showMenu is the boolean whether to show the menu
     * @param hideMenu is the boolean whether to hide the menu
     */
    _initMenuHover(selector, menu, showMenu, hideMenu) {
        $(selector).hover(function () {
            hideMenu = false;
        }, function () {
            hideMenu = true;
            setTimeout(function () {
                if (hideMenu) {
                    menu.hide();
                    $(MenuMemberArea._LOGO_SELECTOR).css("margin-left", "0px"); // Move the logo back
                    showMenu = true;
                }
            }, 500);
        });
    }
}


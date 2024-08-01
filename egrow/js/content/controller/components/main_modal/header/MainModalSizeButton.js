/**
 * It represents the button which handles the change of the size of the modal.
 * It can minimize and maximize the size of the modal.
 */
class MainModalSizeButton extends MainModalHeaderElement {
    constructor () {
        super("#sizeButton");
    }

    onClick (event) {
        const iconSelector = this.selector + " i";

        ContentServices.mainModalSizeService.minimize().then(function () {
            $(iconSelector).removeClass("fa-window-minimize");
            $(iconSelector).addClass("fa-window-maximize");
            $(iconSelector).attr("title", "Maximize");
            CONTENT.components.mainModal.body.table.hide();
            CONTENT.components.mainModal.minimize();
        }).catch(function () {
            $(iconSelector).removeClass("fa-window-maximize");
            $(iconSelector).addClass("fa-window-minimize");
            $(iconSelector).attr("title", "Minimize");
            CONTENT.components.mainModal.body.table.display();
            CONTENT.components.mainModal.maximize();
        }).finally(function () {
            ContentServices.analyticsTracker.trackUsageEvent(ANALYTICS_ACTION.MAIN_MODAL_HEADER, "trigger_main_modal_size");
        });
    }
}

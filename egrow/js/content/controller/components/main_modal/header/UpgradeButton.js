/**
 * It represents the upgrade button which is displayed if the plan of the user
 * is "Basic".
 */
class UpgradeButton extends MainModalHeaderElement {
    constructor () {
        super("#upgradeButton");

        const display = () => this.display();
        const message = new MessageBackground(MESSAGE_BACKGROUND_ACTIONS.GET_USER_DATA, "plan");
        chrome.runtime.sendMessage(message, function (response) {
            if (null != response && response.isSuccess && -1 < response.value.indexOf("BASIC")) {
                display();
            }
        });
    }

    onClick(event) {
        // Simple new tab creation
    }
}

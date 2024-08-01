/**
 * It represents the update modal which is shown after the installation of
 * the chrome extension or after an update of the chrome extension to inform
 * the user about the updates made.
 *
 * The content which is displayed is defined in {@link UpdateMessenger}.
 */
class UpdateModal extends ContentModal {
    constructor () {
        super("#updateModal");
        $(this.selector + " .close-modal").click(() => this.hide());
    }

    display () {
        const _addUpdateMessages = (updateMessages) => this._addUpdateMessages(updateMessages);
        const superDisplay = () => super.display();

        return new Promise(function (resolve, reject) {
            const message = new MessageBackground(MESSAGE_BACKGROUND_ACTIONS.DISPLAY_UPDATE_MODAL);
            chrome.runtime.sendMessage(message, (response) => {
                if (response && response.isSuccess) {
                    _addUpdateMessages(response.value);
                    superDisplay(); // Extension was updated
                    resolve();
                } else {
                    reject(new Error("Failed to display."));
                }
            });
        });
    }

    hide () {
        $(this.selector).fadeOut(this.fadeOutTime, "linear");
    }

    _addUpdateMessages (updateMessages) {
        let updates = "<ul>";

        for (let i = 0; i < updateMessages.length; i++) {
            updates += "<li>" + updateMessages[i] + "</li>";
        }

        updates += "</ul>";

        $(this.selector + " .egrow-user-modal-body").html(updates);
    }
}

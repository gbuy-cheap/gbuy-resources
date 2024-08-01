/**
 * Message handler which decides whether the user modal {@link UserModal}
 * can be displayed or not. The actual logic is included in the implementation
 * of the actual user modal.
 */
class DisplayUserModal extends MessageHandler {
    constructor (action, userModal) {
        super(action);
        this.userModal = userModal;
    }

    handle (resolve, reject, request) {
        this.userModal.display(resolve, reject, request);
    }
}

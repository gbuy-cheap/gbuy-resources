/**
 * Message handler which performs a feedback for the displayed user modal.
 */
class FeedbackUserModal extends MessageHandler {
    constructor (action, userModal) {
        super(action);
        this.userModal = userModal;
    }

    handle (resolve, reject, request) {
        this.userModal.feedback(resolve, reject, request);
    }
}

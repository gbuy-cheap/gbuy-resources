/**
 * Entity which is used to send a message to the background area. Its action needs
 * to be chosen from {@link MESSAGE_CONTENT_ACTIONS} otherwise the creation will
 * fail.
 */
class MessageContent extends Message {
    constructor (action, key, value) {
        super(MESSAGE_TARGET.CONTENT, action, key, value);

        if (!Object.prototype.hasOwnProperty.call(MESSAGE_CONTENT_ACTIONS, action)) {
            throw new Error("Action is not defined in the content actions: " + action);
        }
    }
}

/**
 * Entity which is used to send a message to the background area. Its action needs
 * to be chosen from {@link MESSAGE_BACKGROUND_ACTIONS} otherwise the creation will
 * fail.
 */
class MessageBackground extends Message {
    constructor (action, key, value) {
        super(MESSAGE_TARGET.BACKGROUND, action, key, value);

        if (!Object.prototype.hasOwnProperty.call(MESSAGE_BACKGROUND_ACTIONS, action)) {
            throw new Error("Action is not defined in the background actions: " + action);
        }
    }
}

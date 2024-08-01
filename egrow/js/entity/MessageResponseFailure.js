/**
 * Entity which is used to represent a failed message response from background.
 */
class MessageResponseFailure extends MessageResponse {
    /**
     * @param value - Value must be "content", "background" or "popup" {@link MESSAGE_TARGET}
     * @param event - Event is an instance of PageView or TrackingEvent
     * @param code - Represents the status code for failed action
     */
    constructor (value, event, code) {
        super(value, event, code);
        this.isSuccess = false;
    }
}

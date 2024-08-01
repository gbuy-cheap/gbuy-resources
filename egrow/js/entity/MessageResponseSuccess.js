/**
 * Entity which is used to represent a successful message response from background.
 */
class MessageResponseSuccess extends MessageResponse {
    /**
     * @param value - Value must be "content", "background" or "popup" {@link MESSAGE_TARGET}
     * @param event - Event is an instance of PageView or TrackingEvent
     */
    constructor (value, event) {
        super(value, event);
        this.isSuccess = true;
    }
}

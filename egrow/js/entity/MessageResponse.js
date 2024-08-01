
/**
 * Entity which is used as a base class for MessageResponseFailure and MessageResponseSuccess, which
 * initalizes the @param value @param event @param code.
 */
class MessageResponse {
    /**
     * @param value - Value must be "content", "background" or "popup" {@link MESSAGE_TARGET}
     * @param event - Event is an instance of PageView or TrackingEvent
     * @param code - Represents the status code for failed action
     */
    constructor (value, event, code) {
        if (this.isNested(value)) {
            this.value = value.value;
            this.event = value.event;
            this.code = value.code;
        } else {
            if (value) {
                this.value = value;
            }
            if (event) {
                this.event = event;
            }
            if (code) {
                this.code = code;
            }
        }
    }

    isNested (value) {
        return value && (value.value || value.event || value.code);
    }
}

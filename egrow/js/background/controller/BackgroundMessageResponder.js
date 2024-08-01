/**
 * Singleton service which handles the response of the processed background
 * message. It provides two different functions to respond either as a failed
 * or successful response.
 */
class BackgroundMessageResponder extends MessageResponder {
    /**
     * It is used whenever the background message was successfully processed.
     *
     * @param sendResponse is the function to send the response back to
     *        the sender.
     * @param start is the time in millis when the processing of the message
     *        was started. It is used for tracking the performance of scrapping.
     * @param response is the response object that includes the result of the
     *        processing of background message
     */
    succeed (sendResponse, start, response) {
        this._respond(true, sendResponse, start, response);
    }

    /**
     * It is used whenever the background message processing failed.
     *
     * @param sendResponse is the function to send the response back to
     *        the sender.
     * @param start is the time in millis when the processing of the message
     *        was started. It is used for tracking the performance of scrapping.
     * @param response is the response object that includes the result of the
     *        processing of background message
     */
    fail (sendResponse, start, response) {
        this._respond(false, sendResponse, start, response);
    }

    /**
     * Send the actual response to the sender which is either the popup or
     * content area.
     *
     * @param success {boolean} indicates whether the messages was processed
     *        successfully or not.
     * @param sendResponse is the function to send the response
     * @param start is the time in millis when the message processing has started
     * @param response is the actual response data.
     * @private
     */
    _respond (success, sendResponse, response) {
        if (success === true) {
            sendResponse(new MessageResponseSuccess(response));
        } else {
            sendResponse(new MessageResponseFailure(response));
        }
    }
}

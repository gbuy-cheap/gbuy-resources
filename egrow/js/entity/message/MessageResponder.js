/**
 * Base class to handle processed messages in the XxxListener.
 */
class MessageResponder {
    /**
     * It is used whenever the message was successfully processed.
     *
     * @param sendResponse is the function to send the response back to
     *        the sender.
     * @param start is the time in millis when the processing of the message
     *        was started. It is used for tracking the performance of scrapping.
     * @param response is the response object that includes the result of the
     *        processing of background message
     */
    succeed (sendResponse, start, response) {
        throw new Error("Need to implement this function in the child class!");
    }

    /**
     * It is used whenever the message processing failed.
     *
     * @param sendResponse is the function to send the response back to
     *        the sender.
     * @param start is the time in millis when the processing of the message
     *        was started. It is used for tracking the performance of scrapping.
     * @param reason is the reason why the message failed
     */
    fail (sendResponse, start, reason) {
        throw new Error("Need to implement this function in the child class!");
    }
}

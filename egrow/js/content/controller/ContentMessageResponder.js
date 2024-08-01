/**
 * Is the message responder of the content area.
 */
class ContentMessageResponder extends MessageResponder {
    succeed (sendResponse, start, response) {
        sendResponse(Response.success());
    }

    fail (sendResponse, start, reason) {
        if (reason && reason.value && reason.value.message) {
            console.warn("Something failed: " + reason.value.message, reason);
        }
        sendResponse(Response.failure());
    }
}

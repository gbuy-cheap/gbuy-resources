/**
 * Initialize all message handlers and the message responder.
 */
const contentMessageHandlers = new ContentMessageHandlers();
const contentMessageResponder = new ContentMessageResponder();

/**
 * This listener handles all messages that are send to the content area via
 * {@link MessageContent}.
 */
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action && request.target === MESSAGE_TARGET.CONTENT) {
            contentMessageHandlers.processMessage(request).then(function (response) {
                contentMessageResponder.succeed(sendResponse, null, response);
                sendResponse(Response.success());
            }).catch(function (reason) {
                contentMessageResponder.fail(sendResponse, null, reason);
            });

            return true; // Async answer
        }
    }
);

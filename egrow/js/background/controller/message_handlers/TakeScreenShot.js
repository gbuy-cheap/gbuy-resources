/**
 * Message handler which performs a screen shot of the visible chrome extension
 * products table.
 */
class TakeScreenShot extends MessageHandler {
    constructor () {
        super(MESSAGE_BACKGROUND_ACTIONS.TAKE_SCREEN_SHOT);
    }

    handle (resolve, reject, request) {
        chrome.tabs.captureVisibleTab(null, null, function (dataUrl) {
            resolve(Response.success({ screenshotUrl: dataUrl }));
        });
    }
}

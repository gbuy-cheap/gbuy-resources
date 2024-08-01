/**
 * Singleton service which indicates whether the user has logged in before.
 */
class Authenticator {
    /**
     * Checks whether the user is already authenticated with the Chrome
     * Extension or needs to login first.
     *
     * @returns {Promise<Response>}
     */
    isUserAuthenticated () {
        return new Promise(function (resolve, reject) {
            chrome.runtime.sendMessage(new MessageBackground(MESSAGE_BACKGROUND_ACTIONS.HAS_AUTHENTICATION), function (response) {
                if (response && response.isSuccess) {
                    resolve(Response.success());
                } else {
                    reject(Response.failure()); // Is needed when in background rejection has happened via resolve
                }
            });
        });
    }
}

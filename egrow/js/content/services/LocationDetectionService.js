class LocationDetectionService {
    constructor() {

    }

    /**
     *
     * @param resolve
     * @param reject
     * @param { LocationPayloadValue } request
     * @returns Promise<void | LocationRequestConfiguration >
     */
    handle(request) {
        const locationBackgroundMessage = new MessageBackground(MESSAGE_BACKGROUND_ACTIONS.CHECK_LOCATION, null, request);
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(locationBackgroundMessage, function (response) {
                if (response.isSuccess) {
                    resolve();
                } else {
                    /**
                     * returns POST request configuration
                     * @property csrfToken
                     * @property payload
                     */
                    reject(response.value);
                }
            });
        })
    }
}

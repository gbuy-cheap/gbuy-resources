/**
 * This class represents the base class which handle the reviews and the surveys.
 *
 * @param numRequestsArray is the array which includes the number of requests when to display the modal.
 * @param storageKey is the key for which the feedback event is saved.
 */
class UserModal {
    constructor (numRequestsArray, storageKey) {
        this.numRequestsArray = numRequestsArray;
        this.storageKey = storageKey;
    }

    /**
     * It displays the modal by checking whether the correct amount of requests
     * has been performed yet.
     *
     * @param resolve is used to resolve the the promise and display the modal
     * @param reject is used to indicate that the modal cannot be displayed
     * @param request is the request data from the message
     */
    display (resolve, reject, request) {
        const numRequestsArray = this.numRequestsArray; // this variable cannot be passed to get function
        const checkStorage = (resolveIt, rejectIt) => this.checkStorage(resolveIt, rejectIt);

        chrome.storage.sync.get(request.key, function (result) {
            var numberOfRequests = result[request.key];
            var isMinimized = request.value;

            if (numberOfRequests === undefined) {
                reject(Response.failure()); // No requests so far
            } else if (isMinimized === true) {
                reject(Response.failure()); // Modal is minimized
            } else if (numRequestsArray.includes(numberOfRequests)) {
                checkStorage(resolve, reject);
            } else {
                reject(Response.failure());
            }
        });
    };

    /**
     * This function saves a true value in the storage so next time during display it is found.
     *
     * @param resolve
     * @param reject
     * @param request
     */
    feedback (resolve, reject, request) {
        BackgroundServices.UserDataHandler.save(resolve, reject, { key: this.storageKey, value: true });
    };

    checkStorage (resolve, reject) {
        chrome.storage.sync.get(this.storageKey, (result) => {
            if (result[this.storageKey] === undefined) { // Feedback was not given yet
                resolve(Response.success());
            } else if (result[this.storageKey] === true) { // User has already given feedback
                reject(Response.failure());
            } else {
                reject(Response.failure()); // Just for backup
            }
        });
    }
}

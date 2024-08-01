/**
 * Singleton service which handles the retrieval, storage and increment
 * of user data.
 */
class UserDataHandler {

    save (resolve, reject, request) {
        const result = {};
        result[request.key] = request.value;

        chrome.storage.sync.set(result, function () {
            resolve(Response.success(result));
        });
    }

    get (resolve, reject, request) {
        chrome.storage.sync.get([request.key], function (result) {
            if (null != result[request.key]) {
                resolve(Response.success(result[request.key]));
            } else {
                reject(Response.failure());
            }
        });
    }

    remove (resolve, reject, request) {
        chrome.storage.sync.remove(request.key, function () {
            resolve();
        });
    }

    inc (resolve, reject, request) {
        const key = request.key;
        const save = (resolveIt, rejectIt, requestIt) => this.save(resolveIt, rejectIt, requestIt);

        chrome.storage.sync.get(key, function (result) {
            const valueFromStore = result[key];
            const toBeSaved = {key: key};

            if (valueFromStore === undefined) { // The first time
                toBeSaved["value"] = 1;
                save(resolve, reject, toBeSaved);
            } else if (Number.isInteger(valueFromStore)) {
                toBeSaved["value"] = valueFromStore + 1;
                save(resolve, reject, toBeSaved);
            } else {
                reject(Response.failure()); // Something went wrong
            }
        });
    }
}

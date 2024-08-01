/**
 * It is the helper service of {@link MainModalSizeButton} and it holds the state
 * of the modal size (minimized or maximized).
 */
class MainModalSizeService {
    constructor () {
        this._isModalMinimized = false;
    }

    /**
     * @returns {Promise<any>} resolve if the modal needs to be minimized
     *          and rejects the promise if the modal needs to maximized.
     */
    minimize () {
        this._isModalMinimized = !this._isModalMinimized;
        const isMinimized = this._isModalMinimized;
        return new Promise(function (resolve, reject) {
            if (isMinimized) {
                resolve();
            } else {
                reject(new Error("Modal is not minimized."));
            }
        });
    }

    isMinimized () {
        return this._isModalMinimized;
    }
}

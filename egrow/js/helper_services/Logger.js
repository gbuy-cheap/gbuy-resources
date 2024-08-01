/**
 * Handles logs of events
 */

Helper.logger = (function () {
    const errorDataMap = new Map();
    return {
        /**
         * @param {ErrorData} errorData
         * @param {string} senderUrl
         * @param {RequestConfiguration} requestConfiguration
         */
        logBackground: function (errorData, requestConfiguration, senderUrl) {
            // exclude empty error messages when "{readyState: 0, errorCode: 0, statusText: 'error'}"
            if (errorData.readyState > 0) {

                /**
                 * @type {number}
                 * get time of error in ms,
                 * since "timeStamp" in response has incorrect format -> "13-04-2021 08:04:53"
                 * The Date object throws exception on reverse conversion
                 */
                const currentErrorTime = Date.now();

                /**
                 *
                 * @type {number}
                 * get correct status code
                 * since when limitation error (403) is occurred the "responseJson" object doesn't contain the "status_code" field
                 */
                const statusCode = 'responseJSON' in errorData && 'status_code' in errorData.responseJSON ? errorData.responseJSON.status_code : errorData.status;

                /**
                 * Do not log unauthorized responses
                 * @type {boolean}
                 */
                const isUnauthorized = statusCode === 401;

                /**
                 * @type {boolean}
                 * check existing error message
                 */
                const isExist = errorDataMap.has(statusCode);
                /**
                 * @type {number}
                 * previous error message time in ms
                 */
                const savedTime = errorDataMap.get(statusCode);

                /**
                 * @type {boolean|boolean}
                 * if the error has the same status_code and occurs again in less than 1 minute.
                 * an error is detected as the same
                 * sending an error message to the server is rejected
                 */
                const isSame = isExist && ((currentErrorTime - savedTime) < 60000) ;

                if (!isSame && !isUnauthorized) {
                    // store the new error in the Map or rewrite Date for existing
                    errorDataMap.set(statusCode, currentErrorTime);

                    // send error message to the server
                    Boundary.ceEndpointLogger.sendErrorData(new ErrorLoggerDto(errorData, requestConfiguration,  senderUrl))
                        .then(() => {})
                        .catch(e => console.log(e))
                }
            }
        }
    };
}());

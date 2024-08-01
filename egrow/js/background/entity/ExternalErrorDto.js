/**
 * @typedef { Object } ExternalResponseError
 * @property { number } code - status code
 * @property { string } message - error message
 * @property { string } stack - error stack
 * @property { string } url - request URL
 * @property { Object } headers - response headers
 */

/**
 * @property { ExternalResponseError } errorResponse
 */
class ExternalErrorDto {

    errorResponse;

    constructor(message, stack_trace = '', url = '', headers = {}, error_code = 400) {
        this.errorResponse = {
            headers: headers,
            code: error_code,
            message: message,
            stack: stack_trace,
            url: url
        };
    }
}

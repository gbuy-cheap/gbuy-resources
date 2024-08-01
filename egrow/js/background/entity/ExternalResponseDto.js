/**
 * @typedef { Object } ExternalResponse
 * @property { number } code - status code
 * @property { Response } body - response data
 * @property { Object } headers - response headers
 */

/**
 * @property { ExternalResponse } response
 */
class ExternalResponseDto {
    response;

    constructor(response) {
        this.response = response;
    }
}


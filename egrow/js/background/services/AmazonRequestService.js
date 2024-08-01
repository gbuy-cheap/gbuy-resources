class AmazonRequestService {
    constructor() {
    }

    /**
     * @param {{url: string,type: "GET"|"POST",headers: {},body?: string}} requestConfig
     * @returns {Promise<Response>}
     */
    async getAmazonData(requestConfig) {
        /**
         *
         * @type {ExternalResponseDto}
         */
        let amazonResponse = new ExternalResponseDto({});

        return fetch(requestConfig.url, {
            method: requestConfig.type,
            headers: requestConfig.headers
        })
            .then((response) => {
            const statusCode = response.status;

            if (response.ok && (statusCode >= 200 && statusCode < 400)) {

                const contentTypeValue = response.headers.get('content-type');

                amazonResponse.response.code = statusCode;
                amazonResponse.response.headers = Object.fromEntries(response.headers); // convert JS Map to an Object

                switch (true) {
                    case contentTypeValue.includes('text/html'):
                        return response.text();
                    case contentTypeValue.includes('application/json'):
                        return response.json();
                    default:
                        throw new ExternalErrorDto(
                            'Unexpected response type',
                            `Unexpected response type: ${response.headers.get('content-type')}`,
                            response.url,
                            Object.fromEntries(response.headers),
                            response.status
                        );
                }
            } else {

                throw new ExternalErrorDto(
                    response.statusText,
                    response.statusText,
                    response.url,
                    Object.fromEntries(response.headers),
                    response.status,
                );
            }
        })
            .then((responseData) => {
                amazonResponse.response.body = responseData;

                return amazonResponse;
            })
            .catch((error) => {
                if (error instanceof  ExternalErrorDto) {
                    return error;
                } else {
                    return new ExternalErrorDto(error.message, error.stack);

                }
            }
        );
    }
}

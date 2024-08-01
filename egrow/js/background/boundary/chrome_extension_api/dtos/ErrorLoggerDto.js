class ErrorLoggerDto extends LoggerDto{
    /**
     * @param {ErrorData} errorData
     * @param {string} senderUrl
     * @param {RequestConfiguration} requestConfiguration
     */
    constructor(errorData, requestConfiguration, senderUrl) {
        super(errorData, requestConfiguration, senderUrl, "WARNING");
    }
}

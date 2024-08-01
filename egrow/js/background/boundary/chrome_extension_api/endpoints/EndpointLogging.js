class EndpointLogging extends EndpointChromeExtension {
    constructor(loggerApi, isDevMode) {
        super(loggerApi, "/v2/logging", isDevMode);
    }

    sendErrorData(errorData) {
        return this.postLog(JSON.stringify(errorData));
    }
}

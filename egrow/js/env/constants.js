const CE_CONSTANTS = (function () {
    /**
     * @param {envMode} used to test new API only in development mode
     */
    let envMode = null;
    chrome.management.getSelf((res) => {
        envMode = res.installType;
    });

    const getApiHost = () => {
        switch (envMode) {
            case "development":
                return "https://staging-gateway.egrow.io";
            default:
                return "https://gateway.egrow.io";
        }
    };

    const getAnalyticsId = () => {
        switch (envMode) {
            case "development":
                return "UA-123321098-1";
            default:
                return "UA-143417171-2";
        }
    };

    const getAppHost = () => {
        switch (envMode) {
            case "development":
                return "https://staging.egrow.io";
            default:
                return "https://egrow.io";
        }
    };

    return {
        getApiHost,
        getAnalyticsId,
        getAppHost
    };
})();

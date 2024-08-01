class LoggerDto {

    /**
     *
     * @type {{WINDOWS_PHONE_7_5: RegExp, WINDOWS_CE: RegExp, WINDOWS_95: RegExp, WINDOWS_98: RegExp, WINDOWS_10: RegExp, WINDOWS_ME: RegExp, WINDOWS_2000: RegExp, iOS: RegExp, WINDOWS_PHONE_10: RegExp, MACOSX_6: RegExp, MACOSX_7: RegExp, MACOSX_8: RegExp, MACOSX_9: RegExp, WINDOWS_3_11: RegExp, WINDOWS_8_1: RegExp, MACOSX_3: RegExp, MACOSX_4: RegExp, MACOSX_5: RegExp, WINDOWS_XP: RegExp, WINDOWS_SERVER_2003: RegExp, MACOSX_14: RegExp, MACOSX_13: RegExp, WINDOWS_7: RegExp, MACOSX_15: RegExp, MACOSX_10: RegExp, WINDOWS_VISTA: RegExp, WINDOWS_8: RegExp, MACOSX_12: RegExp, MACOSX_11: RegExp, WINDOWS_PHONE_8_1: RegExp, MACOSX: RegExp}}
     * @private
     * @readonly
     */
    static _OS_VERSIONS_RE_MAP = {
        WINDOWS_XP: /(Windows NT 5.1|Windows XP)/,
        WINDOWS_SERVER_2003: /Windows NT 5.2/,
        WINDOWS_VISTA: /Windows NT 6.0/,
        WINDOWS_7: /(Windows 7|Windows NT 6.1)/,
        WINDOWS_8_1: /(Windows 8.1|Windows NT 6.3)/,
        WINDOWS_8: /(Windows 8|Windows NT 6.2)/,
        WINDOWS_10: /(Windows NT 10.0)/,
        WINDOWS_PHONE_7_5: /(Windows Phone OS 7.5)/,
        WINDOWS_PHONE_8_1: /(Windows Phone 8.1)/,
        WINDOWS_PHONE_10: /(Windows Phone 10)/,
        MACOSX: /(MAC OS X\s*[^ 0-9])/,
        MACOSX_3: /(Darwin 10.3|Mac OS X 10.3)/,
        MACOSX_4: /(Darwin 10.4|Mac OS X 10.4)/,
        MACOSX_5: /(Mac OS X 10.5)/,
        MACOSX_6: /(Mac OS X 10.6)/,
        MACOSX_7: /(Mac OS X 10.7)/,
        MACOSX_8: /(Mac OS X 10.8)/,
        MACOSX_9: /(Mac OS X 10.9)/,
        MACOSX_10: /(Mac OS X 10.10)/,
        MACOSX_11: /(Mac OS X 10.11)/,
        MACOSX_12: /(Mac OS X 10.12)/,
        MACOSX_13: /(Mac OS X 10.13)/,
        MACOSX_14: /(Mac OS X 10.14)/,
        MACOSX_15: /(Mac OS X 10.15)/,
        iOS: /(iPhone OS\s*[0-9_]+)/,
    };

    /**
     *
     * @type {{WINDOWS_PHONE_7_5: string, WINDOWS_CE: string, WINDOWS_95: string, WINDOWS_98: string, WINDOWS_10: string, WINDOWS_ME: string, WINDOWS_2000: string, iOS: string, WINDOWS_PHONE_10: string, MACOSX_6: string, MACOSX_7: string, MACOSX_8: string, MACOSX_9: string, WINDOWS_3_11: string, MACOSX_2: string, WINDOWS_8_1: string, MACOSX_3: string, MACOSX_4: string, MACOSX_5: string, WINDOWS_XP: string, WINDOWS_SERVER_2003: string, MACOSX_14: string, MACOSX_13: string, WINDOWS_7: string, MACOSX_15: string, MACOSX_10: string, WINDOWS_VISTA: string, WINDOWS_8: string, MACOSX_12: string, MACOSX_11: string, UNKNOWN: string, WINDOWS_PHONE_8_1: string, MACOSX: string}}
     * @private
     * @readonly
     */
    static _OS_VERSIONS = {
        WINDOWS_XP: 'windows-xp',
        WINDOWS_SERVER_2003: 'windows-server-2003',
        WINDOWS_VISTA: 'windows-vista',
        WINDOWS_7: 'windows-7',
        WINDOWS_8_1: 'windows-8-1',
        WINDOWS_8: 'windows-8',
        WINDOWS_10: 'windows-10',
        WINDOWS_PHONE_7_5: 'windows-phone-7-5',
        WINDOWS_PHONE_8_1: 'windows-phone-8-1',
        WINDOWS_PHONE_10: 'windows-phone-10',
        MACOSX_15: 'mac-os-x-15',
        MACOSX_14: 'mac-os-x-14',
        MACOSX_13: 'mac-os-x-13',
        MACOSX_12: 'mac-os-x-12',
        MACOSX_11: 'mac-os-x-11',
        MACOSX_10: 'mac-os-x-10',
        MACOSX_9: 'mac-os-x-9',
        MACOSX_8: 'mac-os-x-8',
        MACOSX_7: 'mac-os-x-7',
        MACOSX_6: 'mac-os-x-6',
        MACOSX_5: 'mac-os-x-5',
        MACOSX_4: 'mac-os-x-4',
        MACOSX_3: 'mac-os-x-3',
        MACOSX_2: 'mac-os-x-2',
        MACOSX: 'mac-os-x',
        iOS: 'iOS',
        UNKNOWN: 'unknown',
    };

    /**
     * @type {"WARNING" | "INFO"}
     */
    log_level;


    /**
     * @typedef {object} ErrorResponse
     * @property {string} debug_message
     * @property {string} message
     * @property {string} status
     * @property {number} status_code
     * @property {any[]} sub_errors
     * @property {string} timestamp
     */

    /**
     * @typedef {object} ErrorData
     * @property {ErrorResponse} responseJSON
     * @property {number} readyState
     * @property {number} status
     */

    /**
     * @typedef {object} RequestConfiguration
     * @property {string} requestUrl
     * @property {"POST"|"GET"|"PUT"|"DELETE"} requestType
     * @property {string} userId
     */

    /**
     *
     * @param {ErrorData} errorData - api response
     * @param {string} senderUrl - always get the URL of the tab on which the error occurred.
     * @param {"WARNING" | "INFO"} logLevel - log level value
     * @param {RequestConfiguration} requestConfiguration
     * @return {{stack: string, browser: {os: undefined, browser: string, os_version: string, browser_version: string, device: string}, log_level: string, message: string, version: string, url: string}}
     */
    constructor(errorData, requestConfiguration, senderUrl, logLevel) {
        const error = errorData.responseJSON ? errorData.responseJSON : errorData;
        this.url = senderUrl;
        this.message = JSON.stringify(error);
        this.stack = this._getStack(error);
        this.version = chrome.runtime.getManifest().version;
        this.browser = {
                browser: "Chrome",
                device: "DESKTOP",
                browser_version: new RegExp('Chrome\\/([0-9.]+)').exec(navigator.userAgent)[1],
                os: this._getOs().name,
                os_version: this._getOs().version
            };
        this.log_level = logLevel;
        this.user_id = requestConfiguration.userId;
        this.request_url = requestConfiguration.requestUrl;
        this.request_type = requestConfiguration.requestType;
    }


    /**
     *
     * @return {{version: string, name: string}}
     * @private
     */
    _getOs() {
        for (const key in LoggerDto._OS_VERSIONS_RE_MAP) {
            const result = LoggerDto._OS_VERSIONS_RE_MAP[key].exec(navigator.userAgent);
            if (null != result) {
                return {name: result[1], version: this._getOsVersion(key)};
            }
        }
    }

    /**
     *
     * @param key - key of _OS_VERSIONS_RE_MAP
     * @return {string}
     * @private
     */
    _getOsVersion(key) {
        return LoggerDto._OS_VERSIONS[key];
    }

    /**
     *
     * @param error {object}
     * @private
     * @return {string}
     */
    _getStack(error) {
        let message = error.message;
        if ('sub_errors' in error && error.sub_errors != null && error.sub_errors.length > 0) {
            message = error.sub_errors[0].message;
        }

        return message;
    }
}

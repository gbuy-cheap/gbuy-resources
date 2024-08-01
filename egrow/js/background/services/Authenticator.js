/**
 * Singleton service which handles authentication of the user either via login
 * or via already saved credentials in the local storage.
 */
class Authenticator {

    /**
     * Resolves if auth object is available, false otherwise
     */
    hasAuthentication(resolve, reject, request) {
        chrome.storage.sync.get(["auth"], function (result) {
            if (null != result && null != result.auth) {
                resolve(Response.success(result.auth));
            } else {
                reject(Response.failure({isAuthenticated: false}));
            }
        });
    }

    /**
     * It performs a login of the user with the provided credentials from
     * the login page from the content area
     * or through an external request from the Egrow app.
     *
     * overwriting existing credentials to avoid resynchronising credentials
     * between app and extension if user uses multiple credentials.
     *
     * @param resolve is used to resolve a successful login
     * @param reject is used to resolve a failed login
     * @param request contains the credentials
     */
    login (resolve, reject, request) {
        const credentials = request.value.credentials;
        this._login(resolve, reject, credentials);
    }

    /**
     * Is used to verify the login status of the user and to refresh the
     * JWT of the user to hold the most current data (user plan).
     *
     * @param resolve is used to resolve a successful login
     * @param reject is used to resolve a failed login
     * @param request
     */
    authenticate (resolve, reject) {
        const _authenticate = this._authenticate;
        chrome.storage.sync.get(["auth"], function (result) {
            if (null != result && null != result.auth) {
                _authenticate(resolve, reject, result.auth);
            } else {
                reject(Response.failure({isAuthenticated: false}));
            }
        });
    }

    /**
     * Performs the actual request to the authentication endpoint of Egrow's PhpApi.
     *
     * @param resolve is used to resolve a successful login
     * @param reject is used to resolve a failed login
     * @param credentials contains the credentials provided by the user or
     *        from the local storage.
     * @private
     */
    _login (resolve, reject, credentials) {
        Boundary.endpointLogin.login(credentials.email, credentials.password).then((loginDto) => {
            Authenticator._resolveAuthData(resolve, reject, credentials, loginDto);
        }).catch(function (error) { // Login failed
            reject(Response.failure(error));
        });
    }

    /**
     *
     * @param resolve
     * @param reject
     * @param authData {AuthData}
     * @private
     */
    _authenticate(resolve, reject, authData) {
        Boundary.endpointAuthenticate.authenticate(authData.email, authData.password, authData.refresh_token).then((loginDto) => {
            Authenticator._resolveAuthData(resolve, reject, authData, loginDto);
        }).catch(function (error) {
            if (error.status != null && error.status === 401) {
                chrome.storage.sync.remove(["auth"]) // Remove auth to force login again
            }
            reject(Response.failure(error));
        });
    }

    /**
     * @param resolve
     * @param reject
     * @param credentials
     * @param loginDto {LoginDto}
     * @private
     */
    static _resolveAuthData(resolve, reject, credentials, loginDto) {

        const parsedJwt = Authenticator._parseJwtString(loginDto.access_token);

        const plan = parsedJwt["https://egrow.io/plan"].type;

        chrome.storage.sync.set({ plan: plan }); // used in GoogleAnalytics.js
        chrome.storage.sync.set({ userId: parsedJwt.sub }); // used in GoogleAnalytics.js

        const authData = {
            email: parsedJwt.email,
            password: credentials.password,
            parsedJwt: parsedJwt,
            jwt: loginDto.access_token,
            refresh_token: loginDto.refresh_token
        };

        chrome.storage.sync.set({ auth: authData });
        resolve(Response.success(authData));
    }

    /**
     * @param tokenString {string}
     * @returns {*}
     */
    static _parseJwtString(tokenString) {
        const base64Url = tokenString.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(atob(base64).split("").map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(""));
        return JSON.parse(jsonPayload);
    }

    /**
     * @param token {*}
     * @returns {boolean}
     */
    static _isJwtExpired(token) {
        const now = new Date();
        const t = new Date(token.exp * 1000); // exp is in seconds since epoch time
        return now > t;
    }
}

/**
 * Stored Auth object in local storage
 */
class AuthData {
    email;
    password;
    parsedJwt;
    jwt;
    refresh_token;
}

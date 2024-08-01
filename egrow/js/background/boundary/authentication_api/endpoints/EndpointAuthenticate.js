class EndpointAuthenticate extends AbstractEndpoint {

    constructor(authenticationApi, isDevMode) {
        super(authenticationApi, "/v4/chrome-extension/authenticate", false, isDevMode);
    }

    /**
     * @returns {Promise<LoginDto>}
     */
    async authenticate(username, password, refreshToken) {

        const payload = {
            grant_type: "password",
            username: username,
            password: password,
            refresh_token: refreshToken
        };

        return this.post(JSON.stringify(payload));
    }
}

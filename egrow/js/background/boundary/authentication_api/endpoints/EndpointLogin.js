class EndpointLogin extends AbstractEndpoint {

    constructor(authenticationApi, isDevMode) {
        super(authenticationApi, "/v4/chrome-extension/login", false, isDevMode);
    }

    /**
     * @returns {Promise<LoginDto>}
     */
    async login(username, password) {

        const payload = {
            grant_type: "password",
            username: username,
            password: password
        };

        return this.post(JSON.stringify(payload));
    }
}

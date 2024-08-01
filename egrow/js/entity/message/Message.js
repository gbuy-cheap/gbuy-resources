class Message {
    /**
     * @param target - Value must be "content", "background" or "popup" {@link MESSAGE_TARGET}
     * @param action - Describe the context and the related action, Example: "Login:Set".
     * @param key - Optional, used for key/ value stores
     * @param value - Optional, contains an object.
     */
    constructor (target, action, key, value) {
        this.target = target;
        this.action = action;
        this.key = key;
        this.value = value;
    }
}

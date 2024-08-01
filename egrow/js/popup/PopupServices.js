/**
 * Main service for singleton services for the popup area. Whenever a new singleton
 * service needs to be added it needs to "extend" (be part of) from this service
 * like {@link PopupServices.Authenticator}.
 */
const PopupServices = (function f () {
    return {
        /**
         * All singleton services of the popup area.
         */
        Authenticator: new Authenticator()
    };
}());

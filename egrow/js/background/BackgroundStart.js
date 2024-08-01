// Extensions of String and Array
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, "g"), replacement);
};
Array.prototype.min = Array.prototype.min || function () {
    return Math.min.apply(null, this);
};
Array.prototype.max = Array.prototype.max || function () {
    return Math.max.apply(null, this);
};
Array.prototype.sum = Array.prototype.sum || function () {
    return this.reduce(function (p, c) {
        return p + c;
    }, 0);
};
Array.prototype.avg = Array.prototype.avg || function () {
    return this.sum() / this.length;
};

/** Everything that needs to be executed on browser start is included here. */
$(document).ready(function () {
    /** Need to init boundary API so auth request is possible */
    Boundary.init("https://www.amazon.com");

    /**
     * Refresh user data (plan) once per day whenever the user starts the browser
     * for the first time to prevent flickering of popup on first start.
     */
    new Promise(function (resolve, reject) {
        BackgroundServices.Authenticator.authenticate(resolve, reject);
    }).then(function () {
        console.log("Refreshed user data");
    }).catch(function (reason) {
        if (null != reason) {
            console.log("Failed to refresh user data", reason);
        }
    });
});

/**
 * This class represents the rating modal where the user is requested to rate
 * the chrome extension. It is shown after 60 and 120 refresh requests.
 */
class RatingModalBackground extends UserModal {
    constructor () {
        super([60, 120], "rateModal");
    }
}

/**
 * This object handles the display of the countdown bar. The plan of the user
 * is determined in the InjectionHandler and therefore does not need to be
 * extracted here again.
 */
class CountdownBar extends HtmlComponent {

    static _COUNTDOWN_KEY = "_COUNTDOWN_KEY";
    static _TIMER_SELECTOR = "countdownTimer";

    constructor() {
        super("#countdownBar");

        this._isDisplayed = false;

        const _saveCountdownDate = this._saveCountdownDate;
        const _updateCounter = this._updateCounter;
        const display = this.display;

        const getCountdownDate = new MessageBackground(MESSAGE_BACKGROUND_ACTIONS.GET_USER_DATA, CountdownBar._COUNTDOWN_KEY);
        chrome.runtime.sendMessage(getCountdownDate, function (response) {
            if (response && response.isSuccess) {

                // Set the date we"re counting down to
                let countdownDate = response.value;

                if (null == countdownDate || isNaN(countdownDate)) {
                    countdownDate = new Date().getTime() + 5 * 24 * 60 * 60 * 1000;
                }

                if (countdownDate > new Date().getTime()) {

                    display();

                    _updateCounter(countdownDate);

                    // Update the count down every 1 second
                    let x = setInterval(function() {
                        _updateCounter(countdownDate, x);

                    }, 1000);

                    _saveCountdownDate(countdownDate);
                }
            }
        });
    }

    display() {
        this._isDisplayed = true;
        super.display();
    }

    isDisplayed() {
        return this._isDisplayed;
    }

    _updateCounter(countdownDate, x) {

        // Get todays date and time
        const now = new Date().getTime();

        // Find the distance between now and the count down date
        const distance = countdownDate - now;

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(x);
            document.getElementById(CountdownBar._TIMER_SELECTOR).innerHTML = "EXPIRED";
        } else {

            // Time calculations for days, hours, minutes and seconds
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the result in the element with id="demo"
            document.getElementById(CountdownBar._TIMER_SELECTOR).innerHTML = "will expire in " + days + "d " + hours + "h "
                + minutes + "m " + seconds + "s ";
        }
    }

    _saveCountdownDate(countdownDate) {
        const setCountdownDate = new MessageBackground(MESSAGE_BACKGROUND_ACTIONS.SAVE_USER_DATA, CountdownBar._COUNTDOWN_KEY, countdownDate);
        chrome.runtime.sendMessage(setCountdownDate);
    }
}

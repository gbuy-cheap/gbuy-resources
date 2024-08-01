/**
 * Object which includes the event to be logged. The request is send to the FE.
 *
 * @param event -   Is the event which is to be logged
 */

function LogRequest (event) {
    this.log = {
        value: event.value,
        process: event.process,
        level: event.level
    };
}

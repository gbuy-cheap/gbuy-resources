/**
 * Object for logging events with FE logging systems
 *
 * @param value -   Is the value which will be passed to analyitcs, Example: the page type, number of products
 * @param process -  Describes the process of the related event, Example: "Modal Injection", "Product Scrapping" or "Data Export".
 * @param level -   Describes the level of the related log, Example: "INFO", "SEVERE", "WARNING", "DEBUG".
 */

function LoggingEvent (value, process, level) {
    this.type = "log";
    this.value = value;
    this.process = process;
    this.level = level;
}

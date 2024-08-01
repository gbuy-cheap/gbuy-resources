/**
 * It handles the modal of the table filters. This includes the loading
 * and saving of the entered filters and loading of all elements and its
 * functions such as the filters form.
 */
class TableFiltersModal extends ContentModal {

    static _STORAGE_KEY = "userFilters";
    static _INITIAL_SELLER_FILTERS = [
        {name: "AMZSeller", value: "on"},
        {name: "FBASeller", value: "on"},
        {name: "FBMSeller", value: "on"}
    ];

    constructor() {
        super("#tableFiltersModal");

        this.form = new TableFiltersForm(this);

        this._loadFilter(this.form); // Init the filters and form

        const selector = this.selector;
        const _submitForm = this._submitForm;
        const fadeOutTime = this.fadeOutTime;

        $(this.selector + " #applyFilter").click(function () {
            _submitForm(selector, fadeOutTime);
        });

        // Close Icon
        $(this.selector + ", " + this.selector + " .close-modal").click(function (e) {
            if (e.target === this) { // Only close on modal or 'x' click

                // Clear all invalid fields + remove tooltips
                $(selector + " form .error").each(function(index, invalidInput) {
                    $(invalidInput).val("");
                    $(invalidInput).tooltip("disable");
                });

                // Apply filters if form is valid
                _submitForm(selector, fadeOutTime);
            }
        });
    }

    display() {
        super.display();
        ContentServices.analyticsTracker.trackUsageEvent(ANALYTICS_ACTION.FILTERS_MODAL, "display");
    }

    applyFilters(formInputs) {

        const filtersSet = CONTENT.components.mainModal.body.table.filters.applyFormFilters(formInputs);

        CONTENT.components.mainModal.footer.tableFiltersButton.trigger(filtersSet);

        CONTENT.components.mainModal.body.table.stats.init();

        this._saveFilter(formInputs);
    }

    _loadFilter(form) {

        const filterMessage = new MessageBackground(MESSAGE_BACKGROUND_ACTIONS.GET_USER_DATA, TableFiltersModal._STORAGE_KEY);
        chrome.runtime.sendMessage(filterMessage, function (response) {
            if (null != response && true === response.isSuccess) {

                const savedFilters = response.value;
                let applyFilters;

                // On first start only {isSuccess:true} is set in savedFilters
                if (1 === Object.keys(savedFilters).length && savedFilters.hasOwnProperty("isSuccess")) {
                    applyFilters = TableFiltersModal._INITIAL_SELLER_FILTERS;
                } else if (17 < Object.keys(savedFilters).length){
                    applyFilters = savedFilters;
                }

                form.set(applyFilters);
                const filtersSet = CONTENT.components.mainModal.body.table.filters.applyFormFilters(applyFilters);
                CONTENT.components.mainModal.footer.tableFiltersButton.trigger(filtersSet);
            }
        });
    }

    _submitForm(selector, fadeOutTime) {
        if ($(selector + " form").valid()) {
            $(selector + " form").submit();
            $(selector).fadeOut(fadeOutTime);
        }
    }

    _saveFilter(currentFilters) {
        chrome.runtime.sendMessage(new MessageBackground(
            MESSAGE_BACKGROUND_ACTIONS.SAVE_USER_DATA,
            TableFiltersModal._STORAGE_KEY,
            currentFilters)
        );
    }
}

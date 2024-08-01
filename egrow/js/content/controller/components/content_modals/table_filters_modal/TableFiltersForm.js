/**
 * It represents the form of the TableFiltersModal. It executes the
 * init function for the form validation and the form navigation.
 */
class TableFiltersForm extends FormComponent {
    constructor (tableFiltersModal) {
        super("#tableFiltersForm", function (form) {
            if ($(form).valid()) {
                const formInputs = $(form).serializeArray();
                tableFiltersModal.applyFilters(formInputs);
            }
        });

        $(this.selector + " #clearFilters").click(() => this.reset());
    }

    set (savedFilters) { // Set the values of the inputs
        this._initInputFields(savedFilters, this.selector);
    }

    reset () {
        $(this.selector).trigger("reset");
    }

    _initInputFields (savedFilters, formIdSelector) {
        const allSellers = ["AMZSeller", "FBASeller", "FBMSeller"];

        Object.keys(savedFilters).forEach(function (key) {
            const singleFilter = savedFilters[key];
            if (singleFilter != null) {
                const filterName = singleFilter.name;
                const filterValue = singleFilter.value;

                if (filterName != null && filterName.length > 0 &&
                    filterValue != null && filterValue.toString().length > 0) {
                    // Input value for filter
                    $(formIdSelector + " input[name=\"" + filterName + "\"]").val(filterValue);

                    // Remove checked seller
                    if (allSellers.indexOf(filterName) > -1) {
                        const index = allSellers.indexOf(filterName);
                        allSellers.splice(index, 1);
                    }
                }
            }
        });

        // Uncheck all sellers which are not selected
        allSellers.forEach(sellerToUncheck => {
            $(formIdSelector + " input[name=\"" + sellerToUncheck + "\"]").prop("checked", false);
        });
    }
}

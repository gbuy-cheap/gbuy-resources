/**
 * It represents the button which opens the {@link TableFiltersModal} so the
 * user can set the preferred filters.
 */
class TableFiltersButton extends ButtonComponent {
    constructor () {
        super("#tableFiltersButton");
    }

    onClick (event) {
        CONTENT.components.tableFiltersModal.display();
    }

    trigger (filtersSet) {
        if (filtersSet) {
            $(this.selector).addClass("filters-selected");
            $(this.selector + " span").text("Filters - ON");
        } else {
            $(this.selector).removeClass("filters-selected");
            $(this.selector + " span").text("Filters");
        }
    }
}

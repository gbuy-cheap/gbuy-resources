class StatsContainerOpportunityScore extends HtmlComponent {

    static _VALUE_SELECTOR = "#osValue";
    static _WRAPPER_SELECTOR = ".br-wrapper";

    constructor() {
        super("#osStats");
        $("#osRating").barrating({
            theme: 'bars-1to10',
            readOnly: true,
            hoverState: false,
            showSelectedRating: false
        });
    }

    updateValue(score) {
        if (!isNaN(score) && 0 <= score && 10 >= score) {
            this._setScore(score);
        } else {
            $(this.selector).hide();
        }
    }

    _setScore(score) {

        const detailsPage = !(Helper.ParserChecker.isKeywordPage(location.href) || Helper.ParserChecker.isCategoryPage(location.href));

        if (0 === parseInt(score, 10) || detailsPage) {
            $(".real-os").hide();
            $(".default-os").show();
        } else {

            $(".real-os").show();
            $(".default-os").hide();

            $("#osRating").barrating('readonly', false);
            $("#osRating").barrating('set', score);
            $("#osRating").barrating('readonly', true);

            // Add correct color to number
            $(StatsContainerOpportunityScore._VALUE_SELECTOR).attr("class", "rating-value-color-" + score);

            // Add correct opacity to columns
            $(StatsContainerOpportunityScore._WRAPPER_SELECTOR + " a").each(function (index, value) {
                let opacity;
                if (!$(value).hasClass("br-selected")) {
                    opacity = 0.5;
                } else {
                    opacity = 1;
                }
                $(value).css("opacity", opacity);
                $(value).attr("class", "rating-bars-bg-color-" + score);
            });

            // Set score of value
            $(StatsContainerOpportunityScore._VALUE_SELECTOR).text(score);
        }
    }
}

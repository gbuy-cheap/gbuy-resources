class AmazonKeywordSuggestionService {
    constructor() {
    }

    /**
     *
     * @param requestUrl
     * @returns {Promise<string[] | void>}
     */
    async getKeywords(requestUrl) {
        /*
         *
         * @type {string[]}
         */
        const keywords = [];
        return fetch(requestUrl)
            .then(response => response.json())
            .then((amazonApiResponse) => {
                amazonApiResponse.suggestions.forEach(suggestion => {
                    keywords.push(suggestion.value);
                });

                return keywords;
            })
            .catch(e => { });
    }
}

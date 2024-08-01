/**
 * It is a global service which checks whether the current page has asins
 * that can be parsed by the {@link AsinParser} so products can be scraped.
 */
class NoResultsService {
    hasPageResults () {
        const url = location.href;
        const documentText = Helper.DOM.toString(document);
        const isParsable = ContentServices.asinParser.hasPageResults(url, documentText);

        return new Promise(function (resolve, reject) {
            if (isParsable) {
                resolve();
            } else {
                reject(new Error("It is not parsable."));
            }
        });
    }
}

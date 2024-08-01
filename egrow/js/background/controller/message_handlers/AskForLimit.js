/**
 * This message handlers takes care of local limitation until it is solved
 * via the API.
 */
class AskForLimit extends MessageHandler {

    static _LOCAL_REQUESTS_KEY = "LOCAL_REQUESTS";

    constructor() {
        super(MESSAGE_BACKGROUND_ACTIONS.ASK_FOR_LIMIT);
    }

    handle(resolve, reject, request) {

        chrome.storage.sync.get(["plan", AskForLimit._LOCAL_REQUESTS_KEY], function (result) {

            const plan = result["plan"];
            const localRequests = result[AskForLimit._LOCAL_REQUESTS_KEY];
            const isBasicPlan = -1 < plan.indexOf("BASIC");

            let limit = Number.MAX_SAFE_INTEGER;
            if (isBasicPlan) {
                limit = 3;
            } else if (-1 < plan.indexOf("STANDARD")) {
                limit = 20;
            }

            BackgroundServices.ResolveMarketPlaceForBasicPlanService.isMarketPlaceAllowed(isBasicPlan, request.value.marketplaceId).then(() => {
                if (null == localRequests) {
                    AskForLimit._setLocalRequests(1, resolve);
                } else {

                    const numRequests = localRequests["numRequests"];
                    const lastUpdate = localRequests["lastUpdate"];

                    const dateToCheck = new Date(lastUpdate);
                    const currentDate = new Date();

                    // Requests are not refreshed
                    if (currentDate.toDateString() === dateToCheck.toDateString()) {

                        if ((numRequests + 1) <= limit) {
                            AskForLimit._setLocalRequests(numRequests + 1, resolve);
                        } else { // localRequests > limit - 6 for basic and 21 for Standard
                            reject(Response.failure({
                                userMessage: "Hey, you have reached your limit of " + limit + " requests per day. Click the button below to upgrade your plan.",
                                modal: "limit"
                            }));
                        }

                    } else { // Requests are refreshed because of new day
                        AskForLimit._setLocalRequests(1, resolve);
                    }
                }
            }).catch((message) => {
                reject(Response.failure({
                    userMessage: message,
                    modal: "marketLimit"
                }));
            });
        });
    }

    static _setLocalRequests(numRequests, resolve) {
        chrome.storage.sync.set({
            LOCAL_REQUESTS: {
                numRequests: numRequests,
                lastUpdate: new Date().getTime()
            }
        }, function () {
            resolve();
        });
    }
}

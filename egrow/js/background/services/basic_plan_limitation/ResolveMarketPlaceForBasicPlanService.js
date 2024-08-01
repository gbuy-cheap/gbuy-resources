class ResolveMarketPlaceForBasicPlanService {

    static _RESTRICTED_FOR_BASIC_PLAN_IDS = ['ae', 'sa', 'in', 'eg', 'se', 'au'];

    constructor() {
    }

    /**
     * @return {Promise<string | null>}
     * @param {boolean} isBasic - the user plan is "BASIC"
     */
    isMarketPlaceAllowed(isBasic, marketPlaceId) {
        return new Promise((resolve, reject) => {
            if (ResolveMarketPlaceForBasicPlanService._RESTRICTED_FOR_BASIC_PLAN_IDS.includes(marketPlaceId) && isBasic) {
                reject(`You have requested a <strong>restricted</strong> marketplace.<br/>Please click on the button below and upgrade your plan.`);
            } else {
                resolve();
            }
        });
    }
}

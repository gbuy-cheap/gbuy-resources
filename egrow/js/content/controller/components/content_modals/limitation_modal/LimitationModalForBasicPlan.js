
class LimitationModalForBasicPlan extends LimitationModal {
    /**
     *
     * @type {string}
     * @private
     */
    static _LIMIT_BASIC_UPGRADE_BUTTON_SELECTOR = '#limitBasicPlanUpgradeButton';

    constructor() {
        super('#limitModalBasicPlan', LimitationModalForBasicPlan._LIMIT_BASIC_UPGRADE_BUTTON_SELECTOR, false);
    }

    display (message) {
        const marketplaceId = Helper.MemberArea.getMarketPlaceId(location.host);
        const fullURL = new URL('https://egrow.io/member/plans?ic_source=chrome_extension&ic_medium=modal&ic_campaign=limitation&ic_content=marketplace&ic_term=&coupon=GROW50');
        fullURL.searchParams.set('ic_term', marketplaceId);

        $(LimitationModalForBasicPlan._LIMIT_BASIC_UPGRADE_BUTTON_SELECTOR).attr('href', fullURL.href);

        $(this.selector + " p").html(message);
        $(this.selector).show();

        ContentServices.analyticsTracker.trackUsageEvent(ANALYTICS_ACTION.LIMIT_MODAL, "display");
    }
}

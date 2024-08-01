class AnalyticsUsageEvent extends AnalyticsEvent {

    constructor(marketDimension, action, label, value = 1) {
        super(marketDimension, "usage", action, label, value);
    }
}

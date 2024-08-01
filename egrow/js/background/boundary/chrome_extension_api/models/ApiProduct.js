/**
 *
 * @description ApiProduct defines the type of response from the chrome extension API when requesting product details
 */
const ApiProduct = Object.freeze({
    "asin": "",
    "brand": {
        "id": "",
        "name": ""
    },
    "buy_box_owner": {
        "id": "",
        "name": "",
        "type": ""
    },
    "dimensions": {
        "formatted": "",
        "unit": "CENTIMETERS",
        "value": {
            "left": 0,
            "middle": 0,
            "right": 0
        }
    },
    "fee": {
        "currency_icon": "",
        "formatted": "",
        "unit": "AED",
        "value": 0
    },
    "image_list": [
        {
            "id": ""
        }
    ],
    "listing_quality_score": 0,
    "main_bsr_category": {
        "category_name": "",
        "rank": 0
    },
    "net": {
        "currency_icon": "",
        "formatted": "",
        "unit": "AED",
        "value": 0
    },
    "num_sellers": 0,
    "on_amazon_since": 0,
    "opportunity_score": 0,
    "price": {
        "currency_icon": "",
        "formatted": "",
        "unit": "AED",
        "value": 0
    },
    "product_status": {
        "is_available": true,
        "is_not_found": true,
        "updated_at": 0
    },
    "reviews": {
        "avg_rating": 0,
        "count": 0
    },
    "sales_metrics": {
        "estimated_monthly_revenue": {
            "currency_icon": "",
            "formatted": "",
            "unit": "AED",
            "value": 0
        },
        "estimated_monthly_sales": 0
    },
    "title": "",
    "weight": {
        "formatted": "",
        "unit": "KILOGRAMS",
        "value": 0
    }
});

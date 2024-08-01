(() => {
    'use strict';


    function getAddressData() {
        var ta = document.createElement("textarea")
        document.body.appendChild(ta);
        ta.focus();
        document.execCommand('paste');
        // fill = JSON.parse('{"name":"Greg Wyatt","street1":"4103 Co Rd 1080","street2":"address2","city":"Hydro","stateOrProvince":"OK","country":"US","postalCode":"73048","phone":"580 816 0417"}')
        let fill = "";
        try {
            fill = JSON.parse(ta.value);
        } catch (e) {
            return fill;
        } finally {
            ta.remove();
            window.scrollTo(0,0);
        }
        return fill;
    }

    //searching input fields for address
    if (document.querySelector('input[name="firstName"]')) {
        let fill = getAddressData();
        if (fill != "") {
            document.querySelector('input[name="firstName"]').value = fill['name'].split(" ")[0] || '';
            document.querySelector('input[name="lastName"]').value = fill['name'].split(" ")[1] || '';
            document.querySelector('input[name="addressLine1"]').value = fill['street1'] || '';
            document.querySelector('input[name="addressLine2"]').value = fill['street2'] || '';
            document.querySelector('input[name="phoneNumber"]').value = fill['phone'] || '';
            document.querySelector('input[name="city"]').value = fill['city'] || '';
            document.querySelector('input[name="postalCode"]').value = fill['postalCode'] || '';
            document.querySelector('input[name="zipcode"]').value = fill['postalCode'] || '';
            document.querySelector('select[name="state"]').value = fill['stateOrProvince'] || '';
            document.querySelector('input[name="emailAddress"]').value = fill['email'] || '';
            document.querySelector('input[name="street"]').value = fill['street1'] || '';
            //document.querySelector('input[name="addressLineTwo"]').value = fill['street2'] || '';
            document.querySelector('input[name="phone"]').value = fill['phone'] || '';

        } else {
            console.log("address is empty");
        }
    }


    const pageCategory = !!document.querySelector('#main-results');
    const pageItem = !!document.querySelector('#priceblock-wrapper');
    let products = [];
    if (pageCategory) {
        const pc = document.querySelectorAll('.list-item');
        //console.log("category parsing pc=",pc.length)
        for (let i = 0; i < pc.length; i++) {
            const elem = pc[i];
            let purl = elem.querySelector('h4 > a');
            console.log(purl);
            if (!purl) {
              elem.querySelector('h3 > a');
            }
            if (!purl) continue;
            purl = purl.getAttribute('href');
            const pIdMatch = purl.match(/\/(\d+).p/);
            if (pIdMatch.length !== 2) continue;
            const productId = pIdMatch[1];
            /*const priceMatch = elem.querySelector('.pb-current-price') ? elem.querySelector('.pb-current-price span')
                    .textContent.match(/\$(\d+.\d+)$/) : '';
            if (priceMatch.length !== 2) continue;
            const price = priceMatch ? priceMatch[1] : '';*/
            let price;
            if (elem.querySelector('.pb-current-price')) {
                price = elem.querySelector('.pb-current-price span').textContent.replace('$', '');
            } else if (elem.querySelector('.pb-hero-price span')) {
                price = elem.querySelector('.pb-hero-price span').textContent.replace('$', '');
            } else if (elem.querySelector('.priceView-hero-price')) {
                const priceContainer = elem.querySelector('.priceView-hero-price > span');
                price = priceContainer.textContent || '';
            }

            let stars = 0;
            if (elem.querySelector('[itemprop="ratingValue"]')) {
                stars = elem.querySelector('[itemprop="ratingValue"]').textContent;
            } else if (stars = elem.querySelector('.star-rating-value')) {
              stars = elem.querySelector('.star-rating-value').textContent;
            } else if (stars = elem.querySelector('.c-review-average')) {
              stars = elem.querySelector('.c-review-average').textContent;
            } else if (elem.querySelector('span.pl-stars-small')) {
                const starsContainer = elem.querySelector('span.pl-stars-small');
                const percentage = starsContainer.getAttribute('alt');
                const filled = Number(percentage.replace('%', ''));
                stars = 5 * filled / 100;
            }
            let reviews = 0;
            if(elem.querySelector('.ratings-count')) {
                reviews = elem.querySelector('.ratings-count').textContent.match(/(\d+)/)[1];
            } else if (elem.querySelector('.number-of-reviews')) {
                reviews = elem.querySelector('.number-of-reviews').textContent;
            } else {
                const reviewContainer = elem.querySelector('span.c-total-reviews');
                if (reviewContainer) {
                    reviews = reviewContainer.textContent || '';
                    const match = reviews.match(/(\d+)/);
                    if (match && match.length) {
                        reviews = match[1];
                    }
                }
            }
            //console.log("pushing",productId,price,stars,reviews);
            products.push({
                productId,
                price,
                stars,
                reviews
            });
        }
         // infinite scroll for sears
        const nextPageElem =
          document.querySelector('.pager-next') || document.querySelector('a.ficon-caret-right');
        nextPageElem && nextPageElem.scrollIntoView(false);
        nextPageElem && window.setTimeout(() => nextPageElem.click(), 10);
    } else if (pageItem) {
        let productId;
        if (document.querySelector('[itemprop="productID"]')) {
            productId = document.querySelector('[itemprop="productID"]').textContent.trim();
        } else if (document.querySelector('#sku-value')) {
            productId = document.querySelector('#sku-value').textContent.trim();
        } else {
          productId = document.querySelector('div.sku > span.product-data-value').textContent.trim();
        }
        let price;
        if (document.querySelector('.item-price')) {
            price = document.querySelector('.item-price').textContent.match(/(\d+.\d+)/)[1];
        } else {
            price = document.querySelector('.priceView-hero-price > span').textContent.match(/(\d+.\d+)/)[1];
        };
        let stars = document.querySelector('.c-review-average').textContent;
        let reviews = document.querySelector('.tab-link').querySelector('.c-total-reviews').textContent.replace(',', '').match(/(\d+)/)[1];

        const variations = !!document.querySelector('.variation-wrapper') ?
            document.querySelectorAll('.variation-border') : false;
        if(variations) {
            for (let i of variations) {
                const url = i.querySelector('a').getAttribute('data-refresh-url') || i.querySelector('a').getAttribute('href');
                const splitedUrl = url.split('=');
                if (splitedUrl.length > 1) {
                    productId = splitedUrl[1];
                } else {
                    const productIdMatch = url.match(/\/(\d+)./);
                    productId = productIdMatch[1];
                }
                products.push({
                    productId,
                    stars,
                    reviews
                });
            }
        } else {
            products.push({
                productId,
                price,
                stars,
                reviews
            });
        }
    } else {
        console.log('ProductId not found');
    }
    let storedAsins = window.localStorage.getItem('easyncItemIds');
    if (storedAsins && storedAsins.length > 0) {
        storedAsins = JSON.parse(storedAsins);
        console.log("storedAsins", storedAsins.length, products.length)
        for (let i = 0; i < products.length; i++) {
            if (!storedAsins.some(e => e.productId === products[i].productId)) {
                //console.log("adding",products[i].productId)
                storedAsins.push(products[i]);
            }
        }
    } else {
        storedAsins = products;
    }
    window.localStorage.setItem('easyncItemIds', JSON.stringify(storedAsins));
})();

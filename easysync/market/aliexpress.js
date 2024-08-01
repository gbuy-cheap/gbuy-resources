(() => {
    'use strict';

    const waitingForElement = (selector) => {
        return new Promise((resolve) => {
            const wait = () => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                } else {
                    requestAnimationFrame(wait);
                }
            }

            wait();
        });
    };

    function getAddressData() {
        let ta = document.createElement("textarea");
        document.body.appendChild(ta);
        ta.focus();
        document.execCommand('paste');
        // fill = JSON.parse('{"name":"Greg Wyatt","street1":"4103 Co Rd 1080","street2":"address2","city":"Hydro","stateOrProvince":"OK","country":"US","postalCode":"73048","phone":"580 816 0417","email":"xxx@xxx.ru"}')
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
    if (document.querySelector('input[name="contactPerson"]')) {
        let fill = getAddressData('input[name="contactPerson"]');
        if (fill != "") {
            document.querySelector('input[name="contactPerson"]').value = fill['name'] || '';
            document.querySelector('input[name="address"]').value = fill['street1'] || '';
            // document.querySelector('input[name="address2"]').value = fill['street2'] || '';
            document.querySelector('input[name="address2"]').value = 'other : ' + fill['stateOrProvince'];
            document.querySelector('input[name="mobileNo"]').value = fill['phone'] || '';
            document.querySelector('select[name="country"]').value = fill['country'] || '';
            document.querySelector('input[name="city"]').value = fill['city'] || '';
            document.querySelector('input[name="zip"]').value = fill['postalCode'] || '';
            // document.querySelector('input[name="province"]').value = fill['stateOrProvince'] || '';
            document.querySelector('input[name="province"]').value = 'other'
        } else {
            console.log("address is empty");
        }
    }

    const pageCategory =
        !!document.querySelector('.list-items') ||
        !!document.querySelector('#list-items') ||
        !!document.querySelector('.col-main .items-list');
    const pageItem =
        !!document.querySelector('.detail') ||
        !!document.querySelector('.store-detail-bd') ||
        !!document.querySelector('[class*="-detail-page"]');

    let newAsins = [];
    let els;
    let elsSel;
    if (pageCategory) {
        els = document.querySelectorAll('.list-item');
        elsSel = document.querySelectorAll('.col-main .items-list > .item');
        if (els.length) {
            const listPagination = document.querySelector('.list-pagination');
            const currentPageBtn = listPagination.querySelector('.next-current');

            /* если отсутсвуют элементы паджинации, то это первая страница и тянем данные из объекта js */
            if (!currentPageBtn) {
                const productsItemsMatch = document.body.innerHTML.match(/window\.runParams\s+=\s+(\{.+\});/);
                const products = productsItemsMatch !== null ? JSON.parse(productsItemsMatch[1]) : [];

                if (products.items && Array.isArray(products.items)) {
                    products.items.forEach(({productId, price, logisticsDesc, tradeDesc, starRating}) => {
                        let shipping;
                        switch (logisticsDesc) {
                            case 'Free Shipping':
                                shipping = 'free';
                                break;
                            case 'Fast Shipping':
                                shipping = 'fast';
                                break;
                            default:
                                shipping = logisticsDesc ? logisticsDesc.replace('Shipping: US $', '').replace(',', '.') : '';
                        }
                        const orders = tradeDesc ? tradeDesc.replace(/[^\d]/g, '') : '';
                        const stars = starRating ? starRating : '';
                        const sanitizePrice = price.replace('US $', '').replace(',', '.').replace(/\s/g, '');

                        newAsins.push({
                            productId,
                            price: sanitizePrice,
                            stars,
                            orders,
                            shipping
                        });
                    });
                }
            /* иначе парсим, т.к. lazyload работает только первый раз */
            } else {
                els.forEach(el => {
                    const productId = el.querySelector('[data-product-id]').getAttribute('data-product-id');
                    const price = el.querySelector('.price-current')
                        ? el.querySelector('.price-current').textContent.replace('US $', '').replace(',', '.').replace(/\s/g, '')
                        : '';
                    const stars = el.querySelector('.rating-value')
                        ? el.querySelector('.rating-value').textContent.trim()
                        : '';

                    const ordersMatch = el.querySelector('.sale-value-link')
                        ? el.querySelector('.sale-value-link').textContent.match(/(\d+)/i)
                        : false;
                    const orders = ordersMatch ? ordersMatch[1] : '';

                    const shippingValue = el.querySelector('.shipping-value')
                        ? el.querySelector('.shipping-value').textContent.replace('Shipping: US $', '').replace(',', '.')
                        : '';

                    let shipping;
                    if (/Free Shipping/.test(shippingValue))
                        shipping = 'free';
                    else if (/Fast Shipping/.test(shippingValue))
                        shipping = 'fast';
                    else
                        shipping = shippingValue;

                    newAsins.push({
                        productId,
                        price,
                        stars,
                        orders,
                        shipping
                    });
                });
            }

            if (listPagination) {
                listPagination.scrollIntoView({ alignToTop: false, behavior: 'smooth' });
                // ждем кнопки 'Next Page', т.к. он появится только после прокрутки
                waitingForElement('.next-next').then((nextPageElem) => {
                    // console.log('go to next page...');
                    setTimeout(() => nextPageElem.click(), 100);
                });
            }
        } else if (elsSel.length) {
            for (let i of elsSel) {
                let productId;
                const productIdMatch = i.querySelector('.pic-rind').getAttribute('href').match(/(\d+).html/);
                if (productIdMatch.length === 2) {
                    productId = productIdMatch[1];
                }
                if (!productId) {
                    continue;
                }
                const priceMatch = i.querySelector('.notranslate') ? i.querySelector('.notranslate').textContent
                        .match(/(\d+.\d+)/) : '';
                const price = priceMatch.length === 2 ? priceMatch[1] : '';
                const starsMatch = i.querySelector('.rate-percent') ? i.querySelector('.rate-percent').getAttribute('style')
                        .match(/(\d+.\d)/) : '';
                let starPercent = starsMatch.length === 2 ? starsMatch[1] : '';
                let stars = '';
                if(starPercent) {
                    stars = (5 * starPercent / 100).toFixed(1)/1;
                }
                const reviewsMatch = i.querySelector('.feedback-num') ? i.querySelector('.feedback-num').textContent
                        .match(/(\d+)/) : false;
                const reviews = reviewsMatch && reviewsMatch.length === 2 ? reviewsMatch[1] : '';
                const ordersMatch = i.querySelector('.recent-order') ? i.querySelector('.recent-order').textContent
                        .match(/(\d+)/i) : false;
                const orders = ordersMatch ? ordersMatch[1] : '';
                const discount = i.querySelector('.discount > .rate') ? i.querySelector('.rate').textContent + '%' : '';
                newAsins.push({
                    productId,
                    price,
                    stars,
                    reviews,
                    orders,
                    discount
                });
            }

            const nextPageElem = document.querySelector('.ui-pagination-next');
            nextPageElem && nextPageElem.scrollIntoView(false);
            nextPageElem && window.setTimeout(() => nextPageElem.click(), 10);
        }
    } else if (pageItem) {
        const productMainId = document.querySelector('[ae_object_value]') ? document.querySelector('[ae_object_value]').getAttribute('ae_object_value') : '';

        const stars = document.querySelector('.overview-rating-average') ? document.querySelector('.overview-rating-average').textContent : '';

        const reviewsMatch = document.querySelector('.product-reviewer-reviews') ? document.querySelector('.product-reviewer-reviews').textContent.match(/^(\d+)/i) : false;
        const reviews = reviewsMatch ? reviewsMatch[1] : '';

        const ordersMatch = document.querySelector('.product-reviewer-sold') ? document.querySelector('.product-reviewer-sold').textContent.match(/^(\d+)/i) : false;
        const orders = ordersMatch ? ordersMatch[1] : '';

        const skuProductsMatch = document.body.innerHTML.match(/skuPriceList\":(\[.*\]),/);
        const skuProducts = skuProductsMatch ? JSON.parse(skuProductsMatch[1]) : false;
        skuProducts.forEach(sku => {
            const productId = sku.skuPropIds === '' ? productMainId : `${productMainId}-${sku.skuAttr}`;
            const price = sku.skuVal.actSkuCalPrice ? sku.skuVal.actSkuCalPrice : sku.skuVal.skuPrice;
            newAsins.push({
                productId,
                price,
                stars,
                reviews,
                orders
            });
        })
    } else {
        console.log('Asin not found');
    }

    let storedAsins = window.localStorage.getItem('easyncItemIds');
    if (storedAsins && storedAsins.length > 0) {
        storedAsins = JSON.parse(storedAsins);
        for (let i = 0; i < newAsins.length; i++) {
            if (!storedAsins.some(e => e.productId === newAsins[i].productId)) {
                storedAsins.push(newAsins[i]);
            }
        }
    } else {
        storedAsins = newAsins;
    }
    window.localStorage.setItem('easyncItemIds', JSON.stringify(storedAsins));
})();

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
    if (document.querySelector('.address-form')) {
        let fill = getAddressData();
        if (fill != "") {
            document.querySelector('.address-form input[name="firstName"]').value = fill['name'].split(" ")[0] || '';
            document.querySelector('.address-form input[name="lastName"]').value = fill['name'].split(" ")[1] || '';
            document.querySelector('.address-form input[name="address1"]').value = fill['street1'] || '';
            document.querySelector('.address-form input[name="address2"]').value = fill['street2'] || '';
            document.querySelector('.address-form input[name="phone"]').value = fill['phone'];
            document.querySelector('.address-form input[name="city"]').value = fill['city'] || '';
            document.querySelector('.address-form input[name="zip"]').value = fill['postalCode'] || '';
            //document.querySelector('.address-form select[name="state"]').value    = fill['stateOrProvince'] || '';
            document.querySelector('.address-form input[name="state"]').value = fill['stateOrProvince'] || '';
            document.querySelector('.address-form input[name="email"]').value = fill['email'] || '';
        } else {
            console.log("address is empty");
        }
    } else if(document.querySelector('input[name="newADRfirstName"]')) {
        let fill = getAddressData();
        if (fill != "") {
            document.querySelector('input[name="newADRfirstName"]').value = fill['name'].split(" ")[0] || '';
            document.querySelector('input[name="newADRlastName"]').value = fill['name'].split(" ")[1] || '';
            document.querySelector('input[name="newADRstreetLine1"]').value = fill['street1'] || '';
            document.querySelector('input[name="newADRstreetLine2"]').value = fill['street2'] || '';
            document.querySelector('input[name="newADRphone"]').value = fill['phone'];
            document.querySelector('input[name="newADRCity"]').value = fill['city'] || '';
            document.querySelector('input[name="newADRZip"]').value = fill['postalCode'] || '';
            document.querySelector('select.stateDropDown').value = fill['stateOrProvince'] || '';
        } else {
            console.log("address is empty");
        }
    }


    let products = [];
    const pc = document.querySelectorAll('[data-itemdata]');
    let variants = document.getElementsByClassName('groups');

    for (let i = 0; i < pc.length; i++) {
        const elem = pc[i];
        let idata = JSON.parse(elem.getAttribute("data-itemdata"));
        let productId = idata.sku + "-" + idata.is;
        let priceMatch = pc[i].querySelector('.price') ? pc[i].querySelector('.price').textContent.match(/(\d+.\d+)/) : '';
        let price = priceMatch.length === 2 ? priceMatch[1] : '';
        if (!price) {
            price = idata.price
        }
        let starsMatch = pc[i].querySelector('a .review-stars-inner') ? pc[i].querySelector('a .review-stars-inner')
                .getAttribute('style').match(/(\d+)/) : '';
        let starPercent = starsMatch.length === 2 ? starsMatch[1] : '';
        let stars = '';
        if (starPercent) {
            stars = 5 * starPercent / 100;
        }
        let reviewsMatch = pc[i].querySelector('a.review-stars-medium') ? pc[i].querySelector('a.review-stars-medium')
                .textContent.match(/(\d+)/) : '';
        let reviews = reviewsMatch.length === 2 ? reviewsMatch[1] : '';
        if (!price) continue;

        if (variants.length) {
            let varsContainer = variants[0].getElementsByTagName('a');
            for (let i of varsContainer) {
                let asinMatch = i.getAttribute('href').match(/\/(\d+-REG)/);
                if (asinMatch && asinMatch.length === 2) {
                    products.push({
                        productId: asinMatch[1],
                        stars,
                        reviews
                    });
                }
            }
        } else {
            products.push({
                productId,
                price,
                stars,
                reviews
            });
        }
    }
    
    let pz = document.querySelector(".pagination-zone");
    if(pz && pz.querySelector(".pn-next")){
        window.setTimeout(() => pz.querySelector(".pn-next").click(), 10);
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
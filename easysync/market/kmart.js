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
    if(document.querySelector('#addressFirstName')) {
        let fill = getAddressData();
        if (fill != "") {
            document.querySelector('#addressFirstName').value = fill['name'].split(" ")[0] || '';
            document.querySelector('#addressLastName').value  = fill['name'].split(" ")[1] || '';
            document.querySelector('#addressStreetAddress1').value  = fill['street1'] || '';
            document.querySelector('#addressStreetAddress2').value  = fill['street2'] || '';
            document.querySelector('#addressPhone').value     = fill['phone'] || '';
            document.querySelector('#addressZipcodeId').value       = fill['postalCode'] || '';
            document.querySelector('#addressState').value    = fill['stateOrProvince'] || '';
            //document.querySelector('input[name="email"]').value     = fill['email'] || '';
            document.querySelector('#addressCity').value      = fill['city'] || '';
        } else {
            console.log("address is empty");
            }
        } else if (document.querySelector('input[name="firstName"]')) {
        let fill = getAddressData();
        if (fill != "") {
            document.querySelector('input[name="firstName"]').value = fill['name'].split(" ")[0] || '';
            document.querySelector('input[name="lastName"]').value  = fill['name'].split(" ")[1] || '';
            document.querySelector('input[name="address1"]').value  = fill['street1'] || '';
            document.querySelector('input[name="address2"]').value  = fill['street2'] || '';
            document.querySelector('input[name="phone1"]').value     = fill['phone'] || '';
            document.querySelector('input[name="zipCode"]').value       = fill['postalCode'] || '';
            document.querySelector('select[name="state"]').value    = fill['stateOrProvince'] || '';
            //document.querySelector('input[name="email"]').value     = fill['email'] || '';
            document.querySelector('input[name="city"]').value      = fill['city'] || '';
        } else {
            console.log("address is empty");
        }
    }


    
    let products = [];

    const pc = document.querySelectorAll('.card-container');
    //console.log("category parsing pc=",pc.length)
    for (let i = 0; i < pc.length; i++) {
        const elem = pc[i];

        const purl = elem.querySelector('.card-title').querySelector("a") ? elem.querySelector('.card-title').querySelector("a").getAttribute('href') : false;
        if (!purl) continue;
        const pIdMatch = purl.match(/\/p-(\w+)?/);

        if (pIdMatch==null || pIdMatch.length !== 2) continue;
        const productId = pIdMatch[1];

        const priceMatch = elem.querySelector('.card-price') ? elem.querySelector('.card-price').textContent.match(/\$(\d+.\d+)$/) : '';
        //if (priceMatch.length !== 2) continue;
        let price = priceMatch ? priceMatch[1] : '';
        let stars = elem.querySelector('.card-reviews').querySelector("[bo-text]") ? elem.querySelector('.card-reviews').querySelector("[bo-text]").textContent : '';
        let rmatch = elem.querySelector('.card-review-container').querySelector(".ng-scope") ? elem.querySelector('.card-review-container')
                .querySelector(".ng-scope").textContent.match(/(\d+)/) : '';
        //if (rmatch.length !== 2) continue;
        let reviews = rmatch[1];
        if (stars == 0) stars = "";
        if (!reviews) reviews = "";

        products.push({
            productId,
            price,
            stars,
            reviews
        });
    }


        /* // infinite scroll for sears
        const nextPageElem = document.querySelector('.next');
        nextPageElem && nextPageElem.scrollIntoView(false);
        nextPageElem && window.setTimeout(() => nextPageElem.click(), 10);
        */
    if(document.querySelector('[itemprop="productID"]')!=null){
        let productId   = document.querySelector('[itemprop="productID"]').textContent.split("#")[1].trim();
        let price       = document.querySelector('.product-price-big .price-wrapper').textContent.match(/\$(\d+.\d+)$/)[1];
        let stars       = document.querySelector('.product-header [itemprop="ratingValue"]') ?
            document.querySelector('.product-header [itemprop="ratingValue"]').getAttribute("content") : '';
        let reviews     = document.querySelector('[itemprop="reviewCount"]') ? document.querySelector('[itemprop="reviewCount"]')
                .textContent : '';

        products.push({
            productId,
            price,
            stars,
            reviews
        });
    }
    
    let storedAsins = window.localStorage.getItem('easyncItemIds');
    if (storedAsins && storedAsins.length > 0) {
        storedAsins = JSON.parse(storedAsins);
        console.log("storedAsins",storedAsins.length,products.length)
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
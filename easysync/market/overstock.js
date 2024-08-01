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
    //console.log(document.querySelectorAll("input"),document.querySelector('input[name="billing_address.given_name"]'))
    if (document.querySelector('.fieldset--billing-address__editor--given-name')) {
        console.log("address")
        let fill = getAddressData();
        if (fill != "") {
            document.querySelector('.fieldset--billing-address__editor--given-name').value = fill['name'].split(" ")[0] || '';
            document.querySelector('input[name="billing_address.family_name"]').value  = fill['name'].split(" ")[1] || '';
            document.querySelector('input[name="billing_address.street_address"]').value  = fill['street1'] || '';
            document.querySelector('input[name="billing_address.street_address2"]').value  = fill['street2'] || '';
            document.querySelector('input[name="billing_address.phone"]').value     = fill['phone'] || '';
            document.querySelector('input[name="billing_address.city"]').value      = fill['city'] || '';
            document.querySelector('input[name="billing_address.postal_code"]').value       = fill['postalCode'] || '';
            document.querySelector('select[name="billing_address.region"]').value    = fill['stateOrProvince'] || '';
            document.querySelector('input[name="billing_address.email"]').value     = fill['email'] || '';
        } else {
            console.log("address is empty");
        }
    }


const pageCategory = !!document.querySelector('.products, .coer-contents, #result-products, #product-container, .prodTile-container-cl');
const pageItem = !!document.querySelector('.add-to-cart-container, #product-page');

let newAsins = [];
let els;
if (pageCategory){
  els = document.querySelectorAll('.product-wrapper, .product-content, .coer-product, .prodTile-container-cl');
  
  const skuProductsMatch = document.body.innerHTML.match(/window.__INITIAL_STATE__\s=\s(.*);/);
  for (let i = 0; i < els.length; i++){
    const el = els[i];
    const productIdUrl = el.querySelector('a') ? el.querySelector('a').getAttribute('href') : false;
    if (!productIdUrl) return false;
    const pIdMatch = productIdUrl.match(/\/([0-9]+)\//);
    if (pIdMatch.length !== 2) return false;
    const productId = pIdMatch[1];
   /* const priceMatch = el.querySelector('.product-price, .coer-prod-price') ? el.querySelector('.product-price, .coer-prod-price')
            .textContent.match(/\$(\d+.\d+)$/) : '';
      const price =  priceMatch ? priceMatch[1] : '';     */
    const getPrice = !!el.querySelector('.product-price .from-price');
    let price = '';
    if(getPrice) {
            price = el.querySelector('.product-price .from-price .price-dollar').textContent + '.' +
                el.querySelector('.product-price .from-price .price-cent').textContent;
            if(el.querySelector('.product-price .to-price')) {
                price += '-' + el.querySelector('.product-price .to-price .price-dollar').textContent + '.' +
                    el.querySelector('.product-price .to-price .price-cent').textContent;
            }
    }
    const stars = el.querySelector('.reviews') ? el.querySelector('.reviews').getAttribute('title') : '';
    const reviews = el.querySelector('.product-review') ? el.querySelector('.product-review').textContent.replace(/\D+/,'') : '';
    newAsins.push({ productId, price, stars, reviews });
  }
  const nextPageElem = document.querySelector('.next');
  nextPageElem && nextPageElem.scrollIntoView(false);
  nextPageElem && window.setTimeout(() => nextPageElem.click(), 10);
} else if (pageItem){
  if(!document.querySelector('.list-creation')){
    const productId = document.querySelector('title').textContent.split(' - ')[document.querySelector('title').textContent.split(' - ').length-1];
    const price = document.querySelector('#product-price-price-container').textContent;
    newAsins.push({ productId, price });
  } else {
    const productId = document.querySelector('.list-creation').getAttribute('data-product-id');
    const stars = document.querySelector('.ratings-container .stars') ? document.querySelector('.ratings-container .stars')
            .getAttribute('data-rating').match(/\d.?\d?/) : '';
    const reviews = document.querySelector('[itemprop="ratingCount"]') ? document.querySelector('[itemprop="ratingCount"]').textContent.replace(/\D+/,'') : '';

    if (document.querySelector('.options-dropdown')) {
      const els = document.querySelectorAll('.options-dropdown option');
      const productMainId = document.querySelector('.list-creation').getAttribute('data-product-id');

      for (let i = 0; i < els.length; i++) {
        const option = els[i];
        const optionId = option.value;
        if (!optionId)
          continue;
        const priceMatch = option.textContent.match(/-\s\$(\d+.\d+)/);
        const price = priceMatch ? priceMatch[1] : '';
        const infoMatch = option.textContent.match(/^(.*)/)
        const info = infoMatch ? infoMatch[1] : '';
        const productId = `${productMainId}-${optionId}`
        newAsins.push({ productId, price, stars, reviews, info });
      }
    } else {
      const price = document.querySelector('[itemprop="price"]') ? document.querySelector('[itemprop="price"]').textContent.replace('$', '').replace(',','.').replace(/\s/, '') : '';
      newAsins.push({ productId, price, stars, reviews });
    }

  }

} else {
  console.log('ProductId not found');
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

(() => {
  'use strict';

  //jQuery = require('../lib/jquery.js');
  function emulateTextEnter(selector,text){
    let inputNode = document.querySelector(selector);
    inputNode.value = text || '';
    inputNode.dispatchEvent(new Event('blur', {bubbles:true}));
  }

  function getAddressData() {
    let ta = document.createElement("textarea");
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
    }

    return fill;
  }

  //searching input fields for address
  if (document.querySelector('input[name="firstName"]')) {
    let fill = getAddressData();
    //fill = JSON.parse('{"name":"Greg Wyatt","street1":"4103 Co Rd 1080","street2":"address2","city":"Hydro","stateOrProvince":"OK","country":"US","postalCode":"73048","phone":"580 816 0417"}')
    if (fill != "") {
            
      emulateTextEnter('input[name="firstName"]',fill['name'].split(" ")[0]);
      emulateTextEnter('input[name="lastName"]',fill['name'].split(" ")[1]);
      emulateTextEnter('input[name="addressLineOne"]',fill['street1']);
      emulateTextEnter('input[name="addressLineTwo"]',fill['street2']);
      emulateTextEnter('input[name="phone"]',fill['phone']);
      emulateTextEnter('input[name="city"]',fill['city']);
      emulateTextEnter('input[name="postalCode"]',fill['postalCode']);
      emulateTextEnter('select[name="state"]',fill['stateOrProvince']);

    } else {
      console.log("address is empty");
    }
  }

  const splittedPathName = window.location.pathname.split('/');
  let checkElem = splittedPathName[0];
  if (splittedPathName.length > 2) {
    checkElem = splittedPathName[2];
  }
  let loc = checkElem.match(/shippingaddresses/);

  if(loc && loc[0] === 'shippingaddresses' && !document.querySelector('input[name="firstName"]')) {
    let xhrGetAddresses = new XMLHttpRequest();
    const url = 'https://www.walmart.com/account/electrode/account/api/customer/:CID/shipping-address/pagination?limit=7';
    xhrGetAddresses.open('GET', url, true);
    xhrGetAddresses.onreadystatechange = function() {
      if (xhrGetAddresses.readyState == 4) {
        if(xhrGetAddresses.status == 200) {
          let obj = JSON.parse(xhrGetAddresses.responseText);
          for(let i of obj.addresses) {
            let xhrDelAddress = new XMLHttpRequest();
            const delUrl = 'https://www.walmart.com/account/electrode/account/api/customer/:CID/shipping-address/' +
              i.id;
            xhrDelAddress.open('DELETE', delUrl, false);
            xhrDelAddress.send(null)
          }
          window.location = 'https://www.walmart.com/account/shippingaddresses';
        }
      }
    };
    xhrGetAddresses.send(null);
  }

  const pageSearch = !!document.querySelectorAll('.search-product-result').length > 0;
  const pageItem = !!document.querySelector('[itemprop="name"]');

  let newAsins = [];
  let els;
    if (pageSearch) {
        els = document.querySelectorAll('.search-result-gridview-item, .search-result-listview-item');
        for (let i = 0; i < els.length; i++) {
            let productId = els[i].querySelector('.product-title-link').getAttribute('href');
            productId = productId.split('/');
            productId = productId[productId.length - 1].match(/^\d+/);
            const price = els[i].querySelector('.price-main span') ? els[i].querySelector('.price-main span').textContent.replace('$', '').replace(',', '.').replace(/\s/, '') : '';

            const starsContainer = els[i].querySelector('.stars-container');
            let starsMatch;
            if (starsContainer) {
              const starsAttr = els[i].querySelector('.stars-container').getAttribute('alt');
              const starsAttr2 = els[i].querySelector('.stars-container').getAttribute('aria-label');
              if (starsAttr) {
                starsMatch = starsAttr.match(/\d.?\d?/);
              } else if (starsAttr2) {
                starsMatch = starsAttr2.match(/^\d.?\d?/);
              }
            }

            const stars = starsMatch ? starsMatch[0].trim() : '';
            const reviews = els[i].querySelector('.stars-reviews-count span') ? els[i].querySelector('.stars-reviews-count span').textContent : '';
            newAsins.push({
                productId,
                price,
                stars,
                reviews
            });
        }
        const nextPageElem = document.querySelector('.paginator-btn-next');
        nextPageElem && nextPageElem.scrollIntoView(false);
        nextPageElem && window.setTimeout(() => nextPageElem.click(), 10);
    } else if (pageItem) {
        let productId = '';
        let productIdContainer = document.querySelector('div.ProductTitle meta');
        if (productIdContainer) {
          productId = productIdContainer.getAttribute('content');
        } else {
          productIdContainer = document.querySelector('[data-item-id]');
          if (productIdContainer) {
            productId = productIdContainer.getAttribute('data-item-id');
          }
        }
        /*const price = document.querySelector('[itemprop="price"]') ? document.querySelector('[itemprop="price"]')
                .textContent.replace('$', '').replace(',', '.').replace(/\s/, '') : '';*/
        const price = document.querySelector('[itemprop="price"]') ? document.querySelector('[itemprop="price"]')
                .getAttribute('content') : '';
        let stars = document.querySelector('[itemprop="bestRating"]') ? document.querySelector('[itemprop="bestRating"]').getAttribute('content') : '';
        stars = stars ? stars : (document.querySelector('.stars-container') ?
                document.querySelector('.stars-container').getAttribute('alt').match(/\d.?\d?/) : '');
        let reviews = document.querySelector('[itemprop="ratingCount"]') ? document.querySelector('[itemprop="ratingCount"]').textContent : '';
        reviews = reviews ? reviews : (document.querySelector('.stars-reviews-count-node') ?
                document.querySelector('.stars-reviews-count-node').textContent.match(/^\d+/) : '');
        const skuProductsMatch = document.head.innerHTML.match(/"products":\[.*?]/gi);
        const skuProduct = document.head.innerHTML.match(/"products":\{"(.*?)"/);
        let hasProductId = false;
        if(skuProductsMatch) {
            let prodIdArr = [];
            for(let i of skuProductsMatch) {
                const hasProductId = i.match(/,"productId":"(\w+)"/);
                if (hasProductId && hasProductId.length) {
                  prodIdArr.push(hasProductId[1]);
                } else {
                  let temp = i.match(/\[.*]/)[0];
                  temp = temp.substr(1, temp.length - 2).replace(/"/g, '');
                  temp = temp.split(',');
                  for (let j in temp) {
                    prodIdArr.push(temp[j]);
                  }
                }
            }
            let obj = {};
            for(let i in prodIdArr) {
                obj[prodIdArr[i]] = true;
            }
            prodIdArr = Object.keys(obj);
            for(let i of prodIdArr) {
                if (!i) {
                    continue;
                }
                hasProductId = true;
                newAsins.push({
                    productId: i,
                    stars,
                    reviews
                });
            }
        } else if(skuProduct && skuProduct.length === 2) {
          hasProductId = false;
          newAsins.push({
            productId: skuProduct[1],
            price,
            stars,
            reviews
          });
        } else {
          hasProductId = false;
          newAsins.push({
            productId,
            price,
            stars,
            reviews
          });
        }

        if (!hasProductId) {
          newAsins.push({
            productId,
            price,
            stars,
            reviews
          });
        }
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
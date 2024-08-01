(() => {
    'use strict';
    
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
    document.querySelector('input[name="email"]').value     = fill['email'] || '';
    document.querySelector('input[name="city"]').value      = fill['city'] || '';
  } else {
    console.log("address is empty");
  }
}

let products = [];

const pc = document.querySelectorAll('.card-container');
const deals = document.querySelectorAll('.card-section');
//console.log("category parsing pc=",pc.length)
if (pc.length) {
  for (let i = 0; i < pc.length; i++) {
    const elem = pc[i];

    if (!elem.querySelector('.card-title')) {
      continue;
    }

    const purl = elem.querySelector('.card-title').querySelector("a") ? elem.querySelector('.card-title').querySelector("a").getAttribute('href') : false;
    if (!purl) continue;
    const pIdMatch = purl.match(/\/p-(\w+)?/);

    if (pIdMatch == null || pIdMatch.length !== 2) {
      continue;
    }
    const productId = pIdMatch[1];

    const priceMatch = elem.querySelector('.card-price') ? elem.querySelector('.card-price').textContent.match(/\$(\d+.\d+)$/) : '';
    const price = priceMatch ? priceMatch[1] : '';
    if (!price) {
      continue;
    }

    let stars = elem.querySelector('.card-reviews').querySelector("[bo-text]") ? elem.querySelector('.card-reviews').querySelector("[bo-text]").textContent : '';
    const rmatch = elem.querySelector('.card-review-container').querySelector(".ng-scope") ?
      elem.querySelector('.card-review-container').querySelector(".ng-scope").textContent.match(/(\d+)/) : '';
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

  // infinite scroll for sears
  const nextPageElem = document.querySelector('.page > a');
  nextPageElem && nextPageElem.scrollIntoView(false);
  nextPageElem && window.setTimeout(() => nextPageElem.click(), 10);
} else if (deals.length) {
  const cards = document.querySelectorAll('.api-card');
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const link = card.querySelector('div > a').getAttribute('href') || '';
    const match = link.match(/p-(\w+)$/);
    if (!match) {
      continue;
    }
    const productId = match[1];
    let price = '';
    const pricecontainer = card.querySelector('ul > a > li span.price-wrapper');
    if (pricecontainer) {
      price = pricecontainer.textContent;
    }
    let stars = '';
    const starsContainer = card.querySelector('ul > a > li span.rating');
    if (starsContainer) {
      const prop = starsContainer.getAttribute('aria-label') || '';
      const match = prop.match(/of (\d+.\d+) out/);
      if (match && match.length) {
        stars = match[1]
      }
    }
    products.push({
      productId,
      price,
      stars,
    });
  }

  const nextPageElemButtons = document.querySelectorAll('div.pagination > button');
  const nextPageElem = nextPageElemButtons[nextPageElemButtons.length - 1];
  nextPageElem && nextPageElem.scrollIntoView(false);
  nextPageElem && window.setTimeout(() => nextPageElem.click(), 10);
}

if (document.querySelector('[itemprop="productID"]') !== null) {
  let productId = document.querySelector('[itemprop="productID"]').textContent.split("#")[1].trim();
  console.log(productId);
  let price = document.querySelector('.product-price-big .price-wrapper').textContent.match(/\$(\d+.\d+)$/)[1];
  let stars = '';
  let reviews = '';
  if(!!document.querySelector('.product-ratings')) {
    stars = document.querySelector('.product-ratings [itemprop="ratingValue"]') ?
      document.querySelector('.product-ratings [itemprop="ratingValue"]').getAttribute("content") : '';
    reviews = document.querySelector('.product-ratings [itemprop="reviewCount"]') ?
      document.querySelector('.product-ratings [itemprop="reviewCount"]').textContent : '';
  }

  products.push({
    productId,
    price,
    stars,
    reviews
  });
} else if (document.getElementById('writeYourReview')) {
  const productIdMatch = document.getElementById('writeYourReview').getAttribute('data-analytics-redirect-link')
    .match(/dataProductId=(\w+)/);
  if (productIdMatch && productIdMatch.length) {
    const productId = productIdMatch[1];
    let price = document.querySelector('.product-price-big .price-wrapper').textContent.match(/\$(\d+.\d+)$/)[1];
    let stars = '';
    if (document.querySelector('.product-ratings-count')) {
      stars = document.querySelector('.product-ratings-count').textContent.match(/^(\d+.\d?) /)[1];
    }
    let reviews = '';
    if(!!document.querySelector('.product-ratings-summary')) {
      reviews = document.querySelector('.product-ratings-summary>h3.title-4>span') ?
        document.querySelector('.product-ratings-summary>h3.title-4>span').textContent.match(/(\d+)/)[1]: '';
    }

    products.push({
      productId,
      price,
      stars,
      reviews
    });
  }
}

  let storedAsins = window.localStorage.getItem('easyncItemIds');
  if (storedAsins && storedAsins.length > 0) {
    storedAsins = JSON.parse(storedAsins);
    console.log("storedAsins", storedAsins.length, products.length);
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

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

  if(document.querySelector('#addFirstName')) {
    let fill = getAddressData();
    if (fill != "") {
      document.querySelector('#addFirstName').value = fill['name'].split(" ")[0] || '';
      document.querySelector('#addLastName').value  = fill['name'].split(" ")[1] || '';
      document.querySelector('#addAddressContent').value  = fill['street1'] || '';
      // document.querySelector('#addressStreetAddress2').value  = fill['street2'] || '';
      document.querySelector('#addAddressPhoneNumber').value     = fill['phone'] || '';
      // document.querySelector('#addressZipcodeId').value       = fill['postalCode'] || '';
      // document.querySelector('#addressState').value    = fill['stateOrProvince'] || '';
      //document.querySelector('input[name="email"]').value     = fill['email'] || '';
      // document.querySelector('#addressCity').value      = fill['city'] || '';
    } else {
      console.log("address is empty");
    }
  }

  let products = [];

  const searchPage = document.querySelector('.mainContent #products');
  const productPage = document.querySelector('#productinfo_ctn');

  if (searchPage) {
    const elems = searchPage.querySelectorAll('.js-pod');
    for (const elem of elems) {
      const productId = elem.getAttribute('data-productid');
      if (!productId) {
        continue;
      }

      let price = '';
      const priceContainer = elem.querySelector('div.checkbox-btn > input.checkbox-btn__input');
      if (priceContainer) {
        price = priceContainer.getAttribute('data-price');
      }

      let stars = '';
      let reviews = '';

      const ratingContainer = elem.querySelector('div.pod-plp__ratings');
      if (ratingContainer) {
        const starsContainer = ratingContainer.querySelector('span.stars');
        if (starsContainer) {
          stars = starsContainer.getAttribute('rel');
        }

        const reviewsContent = ratingContainer.textContent;
        const matchContainer = reviewsContent.match(/\(\d+\)/);
        if (matchContainer) {
          reviews = matchContainer[0].replace(/[(|)]/g, '');
        }
      }

      products.push({
        productId,
        price,
        stars,
        reviews,
      });
    }

    const nextPageElemArray = document.querySelectorAll('ul.hd-pagination__wrapper > li.hd-pagination__button > a');
    const nextPageElem = nextPageElemArray[nextPageElemArray.length - 1];
    nextPageElem && nextPageElem.scrollIntoView(false);
    nextPageElem && window.setTimeout(() => nextPageElem.click(), 10);
  } else if (productPage) {
    let productId;
    const productIdContainer = productPage.querySelector('span#product_internet_number');
    if (productIdContainer) {
      productId = productIdContainer.textContent;
    }

    if (!productId) {
      return;
    }

    let price = '';
    const priceContainer = productPage.querySelector('span#ajaxPrice');
    if (priceContainer) {
      const currencyContainer = priceContainer.querySelector('span.price__currency');
      if (currencyContainer) {
        price += currencyContainer.textContent;
      }

      const mainPriceContainer = priceContainer.querySelector('span.price__dollars');
      if (mainPriceContainer) {
        price += mainPriceContainer.textContent;
      }

      const centsPriceContainer = priceContainer.querySelector('span.price__cents');
      if (centsPriceContainer) {
        price += centsPriceContainer.textContent;
      }
    }

    let stars = '';
    let reviews = '';

    const ratingContainer = productPage.querySelector('div#itemRating');
    if (ratingContainer) {
      const starsContainer = ratingContainer.querySelector('span.BVRRRatingNumber');
      if (starsContainer) {
        stars = starsContainer.textContent;
      }
    }

    const reviewsContainer = productPage.querySelector('div#sticky_ratings_reviews');
    if (reviewsContainer) {
      const reviewsContent = reviewsContainer.textContent;
      const matchContainer = reviewsContent.match(/\(\d+\)/);
      if (matchContainer) {
        reviews = matchContainer[0].replace(/[(|)]/g, '');
      }
    }

    products.push({
      productId,
      price,
      stars,
      reviews,
    });
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

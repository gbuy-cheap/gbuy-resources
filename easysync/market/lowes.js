(() => {
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

  const manageAddressAdd = document.getElementById('manage_address_add');
  const primaryAddress = document.querySelector('.primary-address');
  if (manageAddressAdd || primaryAddress) {
    let chosenElem = primaryAddress;
    if (manageAddressAdd) {
      const style = window.getComputedStyle(manageAddressAdd);
      if (style.display !== 'none') {
        chosenElem= manageAddressAdd;
      }
    }

    let fill = getAddressData();

    chosenElem.querySelector('#firstName').value = fill['name'].split(" ")[0] || '';
    chosenElem.querySelector('#lastName').value = fill['name'].split(" ")[1] || '';
    chosenElem.querySelector('#address1').value = fill['street1'] || '';
    chosenElem.querySelector('#address2').value = fill['street2'] || '';
    chosenElem.querySelector('input[name="phone1"]').value = fill['phone'] || '';
    chosenElem.querySelector('#zipCode').value = fill['postalCode'] || '';
    chosenElem.querySelector('#state').value = fill['stateOrProvince'] || '';
    //chosenElem.querySelector('input[name="email"]').value = fill['email'] || '';
    chosenElem.querySelector('#city').value = fill['city'] || '';
  }

  const products = [];

  const productListContainer = document.querySelector('.product-list-container');
  const productPage = document.querySelector('.pd-holder');

  if (productListContainer) {
    const productsArray = productListContainer.querySelectorAll('ul.product-cards-grid > li.product-wrapper') || [];
    for (const product of productsArray) {
      const productId = product.getAttribute('data-productid');
      if (!productId) {
        continue;
      }

      let price = '';
      const priceContainer = product.querySelector('.pl-price span.js-price');
      if (priceContainer) {
        price = priceContainer.textContent;
      }

      let stars = '';
      let reviews = 0;
      const ratingContainer = product.querySelector('div.product-rating');
      if (ratingContainer) {
        const starContainer = ratingContainer.querySelector('i.met-product-rating');
        if (starContainer) {
          stars = starContainer.getAttribute('data-rating').substr(0, 4);
          if ((stars.toLowerCase()).indexOf('no') !== -1) {
            stars = '';
          }
        }

        const reviewsContainer = ratingContainer.querySelector('small');
        if (reviewsContainer) {
          reviews = reviewsContainer.textContent.replace(/\(|\)/g, '');
          if ((reviews.toLowerCase()).indexOf('no') !== -1) {
            reviews = 0;
          }
        }
      }

      products.push({
        productId,
        price,
        stars,
        reviews
      });
    }

    const nextPageElem = document.querySelector('ul.pagination > li.page-next a');
    nextPageElem && nextPageElem.scrollIntoView(false);
    nextPageElem && window.setTimeout(() => nextPageElem.click(), 10);
  } else if (productPage) {
    let productId = '';
    let price = '';
    let stars = '';
    let reviews = 0;

    const productIdContainer = productPage.querySelector('div.pd-add-cart > input');
    if (productIdContainer) {
      productId = productIdContainer.getAttribute('value');
    }

    const priceContainer = productPage.querySelector('div.met-product-price > span.art-pd-price');
    if (priceContainer) {
      const currencyContainer = priceContainer.querySelector('usp');
      let currency = '';
      if (currencyContainer) {
        currency = currencyContainer.textContent;
      }
      price = `${currency}${priceContainer.textContent}`;
    }

    const starsContainer = productPage.querySelector('span.js-star-rating i');
    if (starsContainer) {
      stars = starsContainer.getAttribute('data-rating');
      if ((stars.toLowerCase()).indexOf('no') !== -1) {
        stars = '';
      }
    }

    const reviewContainer = productPage.querySelector('span.reviews-count');
    if (reviewContainer) {
      const reviewsMatch = reviewContainer.textContent.match(/(^\d+)/);
      if (reviewsMatch && reviewsMatch.length) {
        reviews = reviewsMatch[1];
      }
    }

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
    // console.log('storedAsins', storedAsins.length, products.length);
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
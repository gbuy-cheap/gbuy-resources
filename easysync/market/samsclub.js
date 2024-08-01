(() => {
  'use strict';

  function getAddressData() {
    const ta = document.createElement("textarea");
    document.body.appendChild(ta);
    ta.focus();
    document.execCommand('paste');
    //fill = JSON.parse('{"name":"Greg Wyatt","street1":"4103 Co Rd 1080","street2":"address2","city":"Hydro","stateOrProvince":"OK","country":"US","postalCode":"73048","phone":"580 816 0417"}')
    let fill = '';
    try {
      fill = JSON.parse(ta.value);
    } catch (e) {
      return fill;
    } finally {
      ta.remove();
      window.scrollTo(0, 0);
    }
    return fill;
  }

  const searchPage = document.getElementById('productRow') || document.querySelector('.sc-product-cards-wrapper');
  const itemPage = document.querySelector('.baseContainer') || document.querySelector('.sc-pdp-main-content');
  const addressBook = document.querySelector('form[name="addOrEditAddressForm"]');
  let newAsins = [];

  if (addressBook) {
    const fill = getAddressData();
    document.querySelector('[name="fName"]').value = fill['name'].split(' ')[0] || '';
    document.querySelector('[name="lName"]').value = fill['name'].split(' ')[1] || '';
    document.querySelector('[name="stAdd"]').value = fill['street1'] || '';
    document.querySelector('[name="add2"]').value = fill['street2'] || '';
    document.querySelector('[name="city"]').value = fill['city'] || '';
    document.querySelector('[name="state"]').value = fill['stateOrProvince'] || '';
    document.querySelector('[name="zip"]').value = fill['postalCode'] || '';
    document.querySelector('[name="p_num"]').value = fill['phone'].split(' ')[0] || '';
    document.querySelector('[name="p_num2"]').value = fill['phone'].split(' ')[1] || '';
    document.querySelector('[name="p_num3"]').value = fill['phone'].split(' ')[2] || '';
  } else if (searchPage) {
    let oldVersion = true;
    let els = searchPage.querySelectorAll('.products-card');
    if (!els.length) {
      oldVersion = false;
      els = searchPage.querySelectorAll('.sc-product-card');
    }
    if (oldVersion) {
      for (let i = 0; i < els.length; i++) {
        const currentOffer = els[i];
        const idContainer = currentOffer.getElementsByTagName('my-list');
        if (!idContainer && !idContainer.length) {
          continue;
        }
        if (!idContainer[0]) {
          continue;
        }
        let productId = idContainer[0].getAttribute('productid');
        if (!productId) {
          continue;
        }
        productId = productId.replace(/\D+/, '');
        let price = '';
        const priceContainer = currentOffer.getElementsByClassName('prods-details');
        if (priceContainer && priceContainer.length) {
          if (priceContainer[0].querySelector('span.hubbleTrackRecord')) {
            price = priceContainer[0].querySelector('span.hubbleTrackRecord').getAttribute('data-price') || '';
          } else if (priceContainer[0].querySelector('div.sc-price-v2')) {
            const priceElements = priceContainer[0].querySelector('div.sc-price-v2');
            const dollars = priceElements.querySelector('span.sc-dollars-v2').textContent;
            const cents = priceElements.querySelector('sup.sc-cents-v2').textContent;
            price = `${dollars}.${cents}`;
          }
          const reg = /\d+.\d+/;
          if (price.length && !reg.test(price)) {
            price = '';
          }
        }
        const starsContainer = currentOffer.querySelector('div.cust-rating-details span.sc-rating') ||
          currentOffer.querySelector('div.cust-rating-details span.cust-rating');
        let stars = '';
        if (starsContainer) {
          const classString = starsContainer.className;
          const starsMatch = classString.match(/sc-rating-(\d[,|_]\d)/);
          if (starsMatch && starsMatch.length) {
            stars = starsMatch[1].replace(/_|,/, '.');
          }
        }
        const reviewsContainer = currentOffer.querySelector('div.cust-rating-details span.rating-mem') ||
          currentOffer.querySelector('div.cust-rating-details span.rating-mem');
        let reviews = '';
        if (reviewsContainer && reviewsContainer.textContent) {
          reviews = reviewsContainer.textContent.trim().replace(/\(|\)/g, '');
        }
        newAsins.push({
          productId,
          price,
          stars,
          reviews,
        });
      }
      const nextPageElem = document.querySelector('a.flip-horizontal');
      nextPageElem && nextPageElem.scrollIntoView(false);
      nextPageElem && window.setTimeout(() => nextPageElem.click(), 10);
    } else {
      for (let i = 0; i < els.length; i++) {
        let productId;
        const container = els[i];
        const containerId = container.getAttribute('id');
        if (!containerId) {
          continue;
        }

        const productIdMatch = containerId.match(/productCard-(\w+)/);
        if (productIdMatch && productIdMatch.length) {
          productId = productIdMatch[1];
        }
        if (!productId) {
          continue;
        }

        let price = '';
        const priceContainer = container.querySelector('span.Price-group');
        if (priceContainer) {
          price = priceContainer.getAttribute('title');
        }

        let stars = '';
        const starsContainer = container.querySelector('span.sc-stars-star-container');
        if (starsContainer) {
          const alt = starsContainer.getAttribute('alt');
          if (alt) {
            const starsMatch = alt.match(/Average rating: (\d+.?\d?)/);
            if (starsMatch && starsMatch.length) {
              stars = starsMatch[1];
            }
          }
        }

        let reviews = '';
        const reviewsContainer = container.querySelector('span.sc-stars-reviews');
        if (reviewsContainer) {
          reviews = reviewsContainer.querySelector('span').textContent;
        }

        newAsins.push({
          productId,
          price,
          stars,
          reviews,
        });
      }

      const nextPageElem = document.querySelector('li.sc-pagination-next > a');
      nextPageElem && nextPageElem.scrollIntoView(false);
      nextPageElem && window.setTimeout(() => nextPageElem.click(), 10);
    }
  } else if (itemPage) {
    let oldVersion = true;
    let productId = document.querySelector('input#pProductId');
    if (!productId) {
      oldVersion = false;
    }

    if (oldVersion) {
      productId = productId.value;
      productId = productId.replace(/\D+/, '');
      let price = '';
      if (itemPage.querySelector('span[itemprop="price"]')) {
        price = itemPage.querySelector('span[itemprop="price"]').textContent.replace(',', '.');
      }
      let stars = '';
      if (itemPage.querySelector('span[itemprop="ratingValue"]')) {
        stars = itemPage.querySelector('span[itemprop="ratingValue"]').textContent;
      }
      let reviews = '';
      if (itemPage.querySelector('span[itemprop="reviewCount"]')) {
        reviews = itemPage.querySelector('span[itemprop="reviewCount"]').textContent;
      }
      newAsins.push({
        productId,
        price,
        stars,
        reviews,
      });
    } else {
      const productContainer = document.querySelector('div.sc-pdp-main-content');
      const link = document.querySelector('div.account-wrapper > a.sign-in');
      if (link) {
        const href = link.getAttribute('href');
        let productIdMatch = null;
        if (href && href !== '#') {
          productIdMatch = href.match(/%2F(\w+).ip/);
        } else {
          productIdMatch = window.location.href.match(/prod([0-9]+)\.ip/);
        }
        if (productIdMatch && productIdMatch.length) {
          productId = productIdMatch[1];
        }
      }

      let price = '';
      const priceContainer = productContainer.querySelector('div.sc-pdp-col-2 span.Price-group');
      if (productContainer) {
        price = priceContainer.getAttribute('title');
      }

      const ratingContainer = productContainer.querySelector('div.bv-primarySummary-rating-container');
      let stars = '';
      const starsContainer = ratingContainer.querySelector('span.bv-off-screen');
      if (starsContainer) {
        const textContent = starsContainer.textContent;
        if (textContent) {
          const starsMatch = textContent.match(/(^\d+.?\d?)\s/);
          if (starsMatch && starsMatch.length) {
            stars = starsMatch[1];
          }
        }
      }

      let reviews = '';
      const reviewsContainer = ratingContainer.querySelector('span.bv-rating-ratio-count > span');
      if (reviewsContainer) {
        reviews = reviewsContainer.textContent;
      }

      newAsins.push({
        productId,
        price,
        stars,
        reviews,
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

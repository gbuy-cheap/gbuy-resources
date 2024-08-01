(() => {
  'use strict';

  function getAddressData() {
    let ta = document.createElement("textarea");
    document.body.appendChild(ta);
    ta.focus();
    document.execCommand('paste');
    // fill = JSON.parse('{"name":"Greg Wyatt","street1":"4103 Co Rd 1080","street2":"address2","city":"Hydro","stateOrProvince":"OK","country":"US","postalCode":"73048","phone":"580 816 0417", "email":"xxx@xxx.com"}')
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
  if (document.querySelector('#address-modal-inline')) {
    let fill = getAddressData();
    if (fill != "") {
      document.querySelector('input[name="firstModal"]').value = fill['name'].split(" ")[0] || '';
      document.querySelector('input[name="lastModal"]').value = fill['name'].split(" ")[1] || '';
      document.querySelector('input[name="address1"]').value = fill['street1'] || '';
      document.querySelector('input[name="address2"]').value = fill['street2'] || '';
      document.querySelector('input[name="phone"]').value = fill['phone'] || '';
      document.querySelector('input[name="postal"]').value = fill['postalCode'] || '';
      document.querySelector('input[name="city"]').value = fill['city'] || '';
      document.querySelector('select[name="state"]').value = fill['stateOrProvince'] || '';
      document.querySelector('input[name="email"]').value = fill['email'] || '';
    } else {
      console.log("address is empty");
    }
  } else if(document.querySelector('input[name="addressFormInlineFirstName"]')) {
    let fill = getAddressData();
    if (fill != "") {
      document.querySelector('input[name="addressFormInlineFirstName"]').value = fill['name'].split(" ")[0] || '';
      document.querySelector('input[name="addressFormInlineLastName"]').value = fill['name'].split(" ")[1] || '';
      document.querySelector('input[name="addressFormInlineAddressLine1"]').value = fill['street1'] || '';
      document.querySelector('input[name="addressFormInlineAddressLine2"]').value = fill['street2'] || '';
      document.querySelector('input[name="addressFormInlinePhoneNumber"]').value = fill['phone'] || '';
      document.querySelector('input[name="addressFormInlineZip"]').value = fill['postalCode'] || '';
      document.querySelector('input[name="addressFormInlineCity"]').value = fill['city'] || '';
      document.querySelector('select[name="addressFormInlineState"]').value = fill['stateOrProvince'] || '';
      document.querySelector('input[name="email"]').value = fill['email'];
    } else {
      console.log("address is empty");
    }
  } else if (document.querySelector('#secondary_content_wrapper')) {
    let fill = getAddressData();
    if (fill != "") {
      document.querySelector('input[name="firstName"]').value = fill['name'].split(" ")[0] || '';
      document.querySelector('input[name="lastName"]').value = fill['name'].split(" ")[1] || '';
      document.querySelector('input[name="address1"]').value = fill['street1'] || '';
      document.querySelector('input[name="address2"]').value = fill['street2'] || '';
      document.querySelector('input[name="phone1"]').value = fill['phone'] || '';
      document.querySelector('input[name="zipCode"]').value = fill['postalCode'] || '';
      document.querySelector('input[name="city"]').value = fill['city'] || '';
      document.querySelector('select[name="state"]').value = fill['stateOrProvince'] || '';
      document.querySelector('input[name="email1"]').value = fill['email'] || '';
    } else {
      console.log("address is empty");
    }
  }

  let products = [];
  const pc = document.querySelectorAll('.product');

  if(pc && pc.length) {
    for (let i = 0; i < pc.length; i++) {
      const elem = pc[i];
      const hrefWithProductId = elem.querySelector(".thumbnail").getAttribute("href");
      const itemId = elem.querySelector(".thumbnail").getAttribute("itemid");
      let productId = itemId;
      if (!productId && hrefWithProductId) {
        const productIdMatch = hrefWithProductId.match(/product.(\d+).html/);
        if (productIdMatch && productIdMatch.length) {
          productId = productIdMatch[1]
        }
      }
      if (!productId) {
        continue;
      }

      const priceContainer = elem.querySelector(".price");
      let price = '';
      if (priceContainer) {
        price = priceContainer.textContent.replace('$', '');
        // const priceMatch = priceContainer.textContent.match(/\$(\d+(,\d+)?.\d+)/);
        // if (priceMatch && priceMatch.length) {
        //   price = priceMatch[1];
        // }
        // price = price.replace(",", "");
      }

      let starsNum = elem.querySelector('[itemprop="ratingValue"]') ? elem.querySelector('[itemprop="ratingValue"]')
        .getAttribute("content").match(/\d.?\d/) : false;
      let stars = starsNum.length === 1 ? starsNum[0] : '';
      let reviewsContainer = elem.querySelector('[itemprop="reviewCount"]');
      let reviews = '';
      if (reviewsContainer) {
        reviews = reviewsContainer.getAttribute("content");
      }

      products.push({
        productId,
        price,
        stars,
        reviews
      });
    }

    const nextPageElem = document.querySelector('.forward > a');
    nextPageElem && nextPageElem.scrollIntoView(false);
    nextPageElem && window.setTimeout(() => nextPageElem.click(), 10);
  } else if (document.querySelector("#product-details")) {
    let pd = document.querySelector("#product-details");
    let productId = document.querySelector(".scProdId").getAttribute("sc.prodid");
    let price = pd.querySelector(".value").textContent;
    let sr = document.querySelector('.bv-stars-container');
    let stars = '0.0';
    let reviews = '0';
    if (sr) {
      stars = sr.querySelector('[itemprop="ratingValue"]') ? sr.querySelector('[itemprop="ratingValue"]')
        .textContent : '0.0';
      reviews = sr.querySelector("[itemprop='reviewCount']") ? sr.querySelector("[itemprop='reviewCount']")
        .textContent : '0';
    }
    products.push({
      productId,
      price,
      stars,
      reviews
    });
  } else {
    console.log('ProductId not found');
  }

  let pages = document.querySelectorAll(".pn-btn");
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].getAttribute("class").indexOf("active") >= 0 && i + 1 < pages.length) {
      const nextPageElem = pages[i + 1];
      nextPageElem && nextPageElem.scrollIntoView(false);
      nextPageElem && window.setTimeout(() => nextPageElem.click(), 10);
    }
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
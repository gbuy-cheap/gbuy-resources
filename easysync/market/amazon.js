(() => {
'use strict';

function getAddressData(){
    var ta = document.createElement("textarea");
    document.body.appendChild(ta);
    ta.focus();
    document.execCommand('paste');
    // fill = JSON.parse('{"name":"Greg Wyatt","street1":"4103 Co Rd 1080","street2":"address2","city":"Hydro","stateOrProvince":"OK","country":"US","postalCode":"73048","phone":"580 816 0417"}')
    let fill = '';
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

const amazonSearchPage = document.querySelectorAll('.s-result-item').length > 0;
const amazonSinglePage = document.querySelector('#ASIN') || document.querySelector('[name=ASIN]');
const newSinglePage = document.querySelector('#dp-container');
const amazonBestPage =
  document.querySelectorAll('.zg_itemWrapper').length > 0 || document.querySelectorAll('.zg-item-immersion').length > 0;
const amazonGoldBox = document.querySelector('.gbh1-bold, .widgetContainer');
const amazonWishList = document.querySelector('#my-lists-tab');
const amazonEuInvoice = document.querySelector('#ordersContainer .hide-if-no-js [data-a-popover]');
const amazonAddress = document.querySelector('#address-ui-address-form, #address-ui-widgets-enterAddressFullName');
const addressBook = document.querySelector('.address-column');
const couponPage = document.querySelector('#merchandised-content');
const promotionPage = document.querySelector('#plp-asin-list');
let newAsins = [];
let els;

//searching input fields for address
if(document.querySelector('[name="enterAddressFullName"]')){
   let fill = getAddressData();
   document.querySelector('[name="enterAddressFullName"]').value      = fill['name'] || '';
   document.querySelector('[name="enterAddressAddressLine1"]').value  = fill['street1'] || '';
   document.querySelector('[name="enterAddressAddressLine2"]').value  = fill['street2'] || '';
   document.querySelector('[name="enterAddressCity"]').value          = fill['city'] || '';
   document.querySelector('[name="enterAddressStateOrRegion"]').value = fill['stateOrProvince'] || '';
   document.querySelector('[name="enterAddressPostalCode"]').value    = fill['postalCode'] || '';
   document.querySelector('[name="enterAddressPhoneNumber"]').value   = fill['phone'] || '';
}

//searching input fields for address
if(document.querySelector('[name="adr_FullName"]')){
   let fill = getAddressData();
   document.querySelector('[name="adr_FullName"]').value      = fill['name'] || '';
   document.querySelector('[name="adr_AddressLine1"]').value  = fill['street1'] || '';
   document.querySelector('[name="adr_AddressLine2"]').value  = fill['street2'] || '';
   document.querySelector('[name="adr_City"]').value          = fill['city'] || '';
   document.querySelector('[name="adr_StateOrRegion"]').value = fill['stateOrProvince'] || '';
   document.querySelector('[name="adr_PostalCode"]').value    = fill['postalCode'] || '';
   document.querySelector('[name="adr_PhoneNumber"]').value   = fill['phone'] || '';
}
//searching input fields for address
if(document.querySelector('#address-ui-widgets-enterAddressFullName')) {
  let fill = getAddressData();

  function selectCountry() {
    return new Promise((resolve, reject) => {
      let found = false;
      document.querySelectorAll('.a-dropdown-link').forEach((e) => {
        if (e.textContent === document.querySelector(`[value="${fill["country"]}"]`).textContent) {
          e.click();
          found = true;
        }
      });

      if (found) {
        setTimeout(() => {resolve()}, 1000);
      } else {
        reject('Country not found');
      }
    });
  }

  selectCountry()
    .then(() => {
      document.querySelector('#address-ui-widgets-enterAddressFullName').value = fill['name'] || '';
      document.querySelector('#address-ui-widgets-enterAddressLine1').value = fill['street1'] || '';
      document.querySelector('#address-ui-widgets-enterAddressLine2').value = fill['street2'] || '';
      document.querySelector('#address-ui-widgets-enterAddressCity').value = fill['city'] || '';
      document.querySelector('#address-ui-widgets-enterAddressStateOrRegion').value = fill['stateOrProvince'] || '';
      document.querySelector("#address-ui-widgets-enterAddressStateOrRegion-dropdown-nativeId").value = fill['stateOrProvince'] || '';
      document.querySelector('#address-ui-widgets-enterAddressPostalCode').value = fill['postalCode'] || '';
      document.querySelector('#address-ui-widgets-enterAddressPhoneNumber').value = fill['phone'] || '';
      document.querySelector('#address-ui-widgets-enterAddressStateOrRegion .a-dropdown-prompt').textContent = document.querySelector(`[value="${fill["stateOrProvince"]}"]`).textContent;
    })
    .catch((error) => {
      console.error(error);
    });
}



if (amazonAddress) {
    let fill = getAddressData();
    if (fill != "") {
      document.querySelector('#address-ui-widgets-countryCode-dropdown-nativeId').value = fill['country'] || '';
      document.querySelector("#address-ui-widgets-enterAddressFullName").value = fill['name'] || '';
       document.querySelector("#address-ui-widgets-enterAddressLine1").value = fill['street1'] || '';
       document.querySelector("#address-ui-widgets-enterAddressLine2").value = fill['street2'] || '';
       document.querySelector("#address-ui-widgets-enterAddressCity").value = fill['city'] || '';
       document.querySelector("#address-ui-widgets-enterAddressStateOrRegion").value = fill['stateOrProvince'] || '';
       document.querySelector("#address-ui-widgets-enterAddressStateOrRegion-dropdown-nativeId").value = fill['stateOrProvince'] || '';
       document.querySelector("#address-ui-widgets-enterAddressPostalCode").value = fill['postalCode'] || '';
       document.querySelector("#address-ui-widgets-enterAddressPhoneNumber").value = fill['phone'] || '';
       document.querySelector('#address-ui-widgets-enterAddressStateOrRegion .a-dropdown-prompt').textContent = document.querySelector(`[value="${fill["stateOrProvince"]}"]`).textContent;
    }
} else if(addressBook) {
    let count = document.getElementsByClassName('address-column').length-1;
    console.log(count);
    const deleteAddress = function (form) {
      let string = 'addressID=' + form.querySelector('[name="addressID"]').value + '&isStoreAddress=' +
          form.querySelector('[name="isStoreAddress"]').value + '&csrfToken=' +
          encodeURIComponent(form.querySelector('[name="csrfToken"]').value);
      //console.log(string);
      let xhr = new XMLHttpRequest();
      const url = '/a/addresses/delete';
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {
            count--;
            if(!count) {
                window.location = 'http://amazon.com/a/addresses';
            } else {
                return true;
            }
        }
      };
      xhr.send(string);
    };
    const rows = document.getElementsByClassName('a-spacing-micro');
    if(rows && rows.length) {
        for (let i of rows) {
            if(count) {
                let arrayOfForms = i.querySelectorAll('[action="/a/addresses/delete"]');
                arrayOfForms.forEach((form) => {
                    deleteAddress(form);
                });
            }
        }
    }
} else if(amazonEuInvoice) {
  console.log('invoices');
  const els = document.querySelectorAll('#ordersContainer .hide-if-no-js [data-a-popover]');
  for (let i = 0; i < els.length; i++) {
      try {
        const url = JSON.parse(unescape(els[i].getAttribute('data-a-popover'))).url;
        const invoiceUrl = `https://${document.domain}${url}`;
        const xhr = new XMLHttpRequest();
        xhr.open("GET", invoiceUrl, true);
        xhr.onload = function (e) {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              const match = xhr.responseText.match(/(https:\/\/s3\.amazonaws\.com\S+)\"/);
              const invoiceDownloadUrl = match ? match[1] : xhr.responseText.match(/(\/gp\/invoice\/download.html\S+)\"/)[1];
              const link = document.createElement("a");
              link.setAttribute("download", '');
              link.setAttribute("href", invoiceDownloadUrl);
              link.style.visibility = 'hidden';
              link.target = '_blank';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              console.log(invoiceDownloadUrl)
            } else {
              console.error(xhr.statusText);
            }
          }
        };
        xhr.send();
      } catch (e) {
        console.log(e);
      }
  }
} else if (amazonSearchPage){
  console.log('amazonSearchPage');
  els = document.querySelectorAll('.s-result-item');
  for (let i = 0; i < els.length; i++){
    let price;
    const productId = els[i].getAttribute('data-asin');
    /*const price = els[i].querySelector(".sx-price") ? els[i].querySelector(".sx-price").textContent.replace(/\$/g, '')
            .trim().replace(' ', '.').replace(',','.').replace(/\s/g, '') : '';*/
    if (els[i].querySelector(".sx-price")) {
      const priceVal = els[i].querySelector(".sx-price");
      if (priceVal.parentNode.getAttribute('aria-label')) {
        price = priceVal.parentNode.getAttribute('aria-label').replace(/\$/g, '').replace(/\s/g, '')
      } else {
        const priceWhole = priceVal.querySelector(".sx-price-whole").textContent;
        const priceFractional = priceVal.querySelector(".sx-price-fractional").textContent;
        price = priceWhole + '.' + priceFractional;
      }
    } else if (els[i].querySelector(".s-price")) {
      price = els[i].querySelector(".s-price").textContent.replace(/\$/g, '').replace(/\s/g, '');
    } else {
      const priceContainer = els[i].querySelector('span.a-price > span.a-offscreen');
      if (priceContainer) {
        price = priceContainer.textContent || '';
      }
    }
    let stars = '';
    if (els[i].querySelector('i.a-icon-star > span')) {
      stars = els[i].querySelector('i.a-icon-star > span').textContent
        .split(' ')[0];
    } else if (els[i].querySelector('i.a-icon-star-small > span')) {
      stars = els[i].querySelector('i.a-icon-star-small > span').textContent
        .split(' ')[0];
    }
    const reviews = els[i].querySelector("[href*='#customerReviews']") ? els[i].querySelector("[href*='#customerReviews']").textContent.replace(',','').trim() : '';
    const prime = !!els[i].querySelector(".a-icon-prime") ? 'prime' : '';
    const datetime = (new Date).getTime();
    newAsins.push({ productId, price, stars, reviews, prime, datetime });
  }
  let nextPageElem = document.querySelector('a [id="pagnNextString"]');
  if (!nextPageElem) {
    nextPageElem = document.querySelector('ul.a-pagination');
  }
  if (!nextPageElem) {
    nextPageElem = document.querySelector('.s-pagination-container');
  }
  if (nextPageElem) {
    let nextPageLink = nextPageElem.querySelector('li.a-last > a');
    if (!nextPageLink) {
      nextPageLink = document.querySelector('.pagnNextArrow');
    }

    if (!nextPageLink) {
      nextPageLink = document.querySelector('.s-pagination-next');
    }

    if (nextPageLink) {
      nextPageLink.scrollIntoView(false);
      nextPageLink && window.setTimeout(() => nextPageLink.click(), 10);
    }

    if(!nextPageLink){
      console.log('no next page link')
    }
  }


} else if (amazonSinglePage) {
  let productId;
  if(document.querySelector('#ASIN')) {
      productId = document.querySelector('#ASIN').getAttribute('value')
  }
  else {
      productId = document.querySelector('[name=ASIN]').getAttribute('value');
  }
  let priceValue = document.querySelector('#priceblock_ourprice') ? document.querySelector('#priceblock_ourprice').textContent.replace('$', '').replace(',','.').replace(/\s/, '') : '';
  if (!priceValue) {
      priceValue = document.querySelector('#priceblock_dealprice') ? document.querySelector('#priceblock_dealprice')
          .textContent.replace('$', '').replace(',','.').replace(/\s/, '') : '';
  }
  const price = (priceValue === '') ? (document.querySelector('#priceblock_saleprice') ?
      document.querySelector('#priceblock_saleprice').textContent.replace('$', '').replace(',','.').replace(/\s/, '') : ''): priceValue;
  const starsMatch = document.querySelector('.a-icon-star') ? document.querySelector('.a-icon-star').textContent.match(/^(\d.\d)/) : [];
  const stars = (starsMatch && starsMatch.length === 2) ? starsMatch[1] : '';
  const reviewsMatch = document.querySelector('#acrCustomerReviewText') ?
      document.querySelector('#acrCustomerReviewText').textContent.split(' ') : '';
  const reviews = (reviewsMatch.length) ? reviewsMatch[0] : '';
  const prime = '';

  // const elements = document.querySelectorAll('#twister li');
  // for (let i = 0; i < elements.length; i += 1) {
  //   const element = elements[i];
  //   const productId = element.getAttribute('data-defaultasin');
  //   if (productId) {
  //     newAsins.push(productId);
  //   }
  // }
  // console.log(newAsins)
  /*if ($('script:contains("twister-js-init-mason-data")')
    && $('scn*ript:contains("twister-js-init-mason-data")').length > 0) {
    var script = $('script:contains("twister-js-init-mason-data")').html();
    var twisterController;
    var P = {
      register: function(name, callback) {
        if(name == 'twister-js-init-mason-data') {
          twisterController = callback();
        }
      }
    };
    eval(script);
    const tw = twisterController.dimensionValuesDisplayData;
    for(let productId in tw) {
      const params = tw[productId];
      const varians = params.length > 0 ? params[0] : '';
      const info = params.length > 1 ? params[1] : '';
      const datetime = (new Date).getTime();
      newAsins.push({ productId, varians, info, datetime });
    }
  }*/

  const asinsMatch = document.body.innerHTML.match(/"dimensionToAsinMap" :(.*)/);
  const asins = asinsMatch ? JSON.parse(asinsMatch[1].substring(0, asinsMatch[1].length-1)) : false;
  for(let i in asins) {
      newAsins.push({
          productId: asins[i],
          price: Object.keys(asins).length === 1 ? price : '',
          stars,
          reviews,
          prime
      });
  }

  // const asinURLMatch = window.location.pathname.match(/(?:[/dp/]|$)([A-Z0-9]{10})/);
  // if (asinURLMatch !== null) {
  //   console.log('asinURLMatch:', asinURLMatch);
  //     newAsins.push({
  //         productId: asinURLMatch[1],
  //         price,
  //         stars,
  //         reviews,
  //         prime
  //     })
  // } - Зачем брать с урла асин? Там может быть не совсем правильный.

  newAsins.length == 0 ? newAsins.push({ productId, price, stars, reviews, prime }) : newAsins;

} else if (newSinglePage) {
  let productId;
  const starsAndReviewsContainer = document.querySelector('#averageCustomerReviews');
  if (!starsAndReviewsContainer) {
    return;
  }
  productId = starsAndReviewsContainer.getAttribute('data-asin');
  if (!productId) {
    return;
  }

  let stars = '';
  const starsContainer = starsAndReviewsContainer.querySelector('#acrPopover');
  if (starsContainer) {
    const title = starsContainer.getAttribute('title') || '';
    const starsMatch = title.match(/^\d+.\d+/);
    if (starsMatch && starsMatch.length) {
      stars = starsMatch[0];
    }
  }

  let reviews = '';
  const reviewsConatiner = starsAndReviewsContainer.querySelector('#acrCustomerReviewText');
  if (reviewsConatiner) {
    const text = reviewsConatiner.textContent || '';
    const reviewsMatch = text.match(/^\d+/);
    if (reviewsMatch && reviewsMatch.length) {
      reviews = reviewsMatch[0];
    }
  }
  const prime = '';

  let price = '';
  const priceContainer = newSinglePage.querySelector('#priceblock_ourprice_row #priceblock_ourprice');
  if (priceContainer) {
    const text = priceContainer.textContent;
    price = text;
  }
  newAsins.push({
    productId: productId,
    price,
    stars,
    reviews,
    prime
  });

  const variantTable = newSinglePage.querySelector('#bissVariationAjaxWrapper');
  if (variantTable) {
    const regAsinTest = /^[A-Z0-9]{6,}$/;
    const rows = variantTable.querySelectorAll('tbody > tr');
    for (const row of rows) {
      const id = row.getAttribute('id') || '';
      let rowAsinPrice = '';
      let localPrime = '';
      const isAsin = regAsinTest.test(id);
      if (!isAsin) {
        continue;
      }

      const priceContainer = row.querySelector('td.bissPrice > div');
      if (priceContainer) {
        const text = priceContainer.textContent;
        rowAsinPrice = text;
      }
      const primeContainer = row.querySelector('i.a-icon-prime');
      if (primeContainer) {
        localPrime = 'prime';
      }

      newAsins.push({
        productId: id,
        price: rowAsinPrice,
        stars,
        reviews,
        prime: localPrime,
      });
    }
  }
} else if (amazonBestPage) {
  els = document.querySelectorAll('.zg_itemWrapper');
  if (!els.length) {
    els = document.querySelectorAll('.zg-item-immersion');
  }

  for (let i = 0; i < els.length; i++) {
    const productLink = els[i].querySelector("a");
    if (!productLink) {
      continue;
    }

    const productId = (els[i].querySelector("a").href.match('[A-Z0-9]{10}') || {}) [0] || false;
    const price = els[i].querySelector(".a-color-price") ? els[i].querySelector(".a-color-price").textContent.replace(',','.').replace(/\s/, '') : '';
    const stars = els[i].querySelector('.a-icon-star')
      && (els[i].querySelector('.a-icon-star').textContent.split(' ') || {}) [0] || ''
    const reviews = els[i].querySelector('.a-size-small.a-link-normal') ? els[i].querySelector('.a-size-small.a-link-normal').textContent.replace(',', '') : '';
    const releaseValue = els[i].querySelector('.zg_releaseDate') ? els[i].querySelector('.zg_releaseDate').textContent : '';
    const release = releaseValue ? '<i class="fa fa-info" aria-hidden="true" title="' + releaseValue  + '"></i>' : '';
    const prime = els[i].querySelector(".a-icon-prime") ? 'prime' : '';
    const datetime = (new Date).getTime();
    newAsins.push({ productId, price, stars, reviews, prime, release, datetime});
  }
  els = document.querySelectorAll('.zg_page');
  els[0] && els[0].scrollIntoView(false);
  for (let i = 0; i < els.length; i++) {
    if(els[i].getAttribute('class') && els[i].getAttribute('class').search(/zg_selected/) !== -1){
      els[++i] ? window.setTimeout(() => els[i].querySelector('a').click(), 10)  : false;
      break;
    }
  }

  if (!els.length) {
    els = document.querySelector('.a-pagination > li.a-last > a');
    if (els) {
      els && els.scrollIntoView(false);
      els && window.setTimeout(() => els.click(), 10);
    }
  }
} else if (amazonGoldBox) {
  const blocks = document.querySelectorAll('#widgetContent .dealTile');
  for(let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const asin = block.querySelector('[id="dealImage"]').href.match(/\/dp\/([A-Z0-9]+)/i) || false;
    const productId = asin ? asin[1] : '';
    const price = block.querySelector('div.a-row.priceBlock.unitLineHeight > span') ?
      block.querySelector('div.a-row.priceBlock.unitLineHeight > span').textContent : '';
    const time = block.querySelector('[role="timer"]') ? block.querySelector('[role="timer"]').textContent : '';
    const reviews = block.querySelector('#totalReviews') ? block.querySelector('#totalReviews').textContent : '';
    const dicount = block.querySelector('.unitLineHeight > span:nth-child(3)') ?
       block.querySelector('.unitLineHeight > span:nth-child(3)').textContent.replace(/\D+/ig,'')+'%' : '';
    if (asin) {
      const datetime = (new Date).getTime();
      newAsins.push({ productId, price, reviews, time, dicount, datetime });
    }
  }
  const nextPageElem = document.querySelector('a[href="#next"]');
  nextPageElem && nextPageElem.scrollIntoView(false);
  nextPageElem && window.setTimeout(() => nextPageElem.click(), 10);

} else if (amazonWishList) {
  const blocks = document.querySelectorAll('.g-item-sortable');
  for(let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const asin = block.querySelector('a[href*="dp"]').href.match(/\/dp\/([A-Z0-9]+)/i) || false;
    const productId = asin ? asin[1] : '';
    const price = block.querySelector('.price-section') ? block.querySelector('.price-section').textContent.replace(/\$/g, '') : false;
    const stars = block.querySelector('.a-icon-star') && (block.querySelector('.a-icon-star').textContent.split(' ') || {}) [0] || ''

    if (asin && price) {
      const datetime = (new Date).getTime();
      newAsins.push({ productId, price, stars, datetime });
    }
  }
} else if (couponPage) {
  const blocks = document.querySelectorAll('.vpc_coupon_grid_inner_grid .coupon');
  for(let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const button = block.querySelector('.a-button-inner > a');
    const href = button.getAttribute('href');
    if (!href) {
      continue;
    }
    const asinMatch = href.match(/heroAsin=(\w+)&/);
    if (!asinMatch || asinMatch.length !== 2) {
      continue;
    }
    const productId = asinMatch[1];
    newAsins.push({ productId });
  }

  const nextPageElem = document.querySelector('div.vpc_coupon_grid_get_more_coupons');
  nextPageElem && nextPageElem.scrollIntoView(true);
  nextPageElem && window.setTimeout(() => nextPageElem.click(), 10);
} else if (promotionPage) {
  const items = promotionPage.querySelectorAll('div ol > li.item');
  for (const item of items) {
    const href = item.querySelector('div.item-cen > div > a.a-link-normal').getAttribute('href') || '';
    const match = href.match(/dp\/(\w+)?/);
    let productId;
    if (match && match.length) {
      productId = match[1];
    }
    if (!productId) {
      continue;
    }
    let price = '';
    const priceContainer = item.querySelector('div.item-cen > div span.plp-price-large');
    if (priceContainer) {
      const main = priceContainer.querySelector('span.plp-price-whole').textContent;
      const sub = priceContainer.querySelector('sup.plp-price-fractional').textContent;
      price = `${main}.${sub}`;
    }
    let stars = '';
    let reviews = 0;
    const starsContainer = item.querySelector('div.item-cen > div > div.fw-d-item-main > div.a-color-secondary');
    if (starsContainer) {
      const starsString = starsContainer.querySelector('i > span.a-icon-alt').textContent || '';
      const starsMatch = starsString.match(/(\d+.\d+) out/);
      if (starsMatch && starsMatch.length) {
        stars = starsMatch[1]
      }
      let reviewString = starsContainer.textContent || '';
      const reviewMatch = reviewString.match(/\((\d+)\)/);
      if (reviewMatch && reviewMatch.length) {
        reviews = reviewMatch[1];
      }
    }
    newAsins.push({
      productId,
      price,
      stars,
      reviews,
    });
  }
} else {
  const price = 'n/a';
  document.querySelectorAll(".feed-carousel-card").forEach((e)=>{
    if(e.getAttribute('data-sgproduct')){
      const productId = JSON.parse(e.getAttribute('data-sgproduct')).asin;
      newAsins.push({
        productId,
        price,
      })
    }
  })

  document.querySelectorAll("a").forEach((e)=>{
    if(e.getAttribute('href')){
      let asinMatch = e.getAttribute('href').match(/dp\/([A-Z0-9])[\/\?]/);
      if (asinMatch && asinMatch.length) {
        const productId = asinMatch[1]
        newAsins.push({
          productId,
          price,
        })
      } else {
        asinMatch = e.getAttribute('href').match(/dp\/([A-Z0-9]).+/);
        if (asinMatch && asinMatch.length) {
          const productId = asinMatch[0].split("/")[1].split("?")[0];
          newAsins.push({
            productId,
            price,
          })
        }
      }

    }
  })  
  // console.log('Asin not found');
}


document.querySelectorAll("[class^=DealGridItem-module__dealItemContent").forEach( e => {
  // console.log("e=", e);
  if(e.querySelectorAll(".a-link-normal").length>0){
    const href = e.querySelectorAll(".a-link-normal")[0].getAttribute("href");
    if(/\/dp\//.test(href)){
      let asin = href.split("?")[0].split("/");
      if(asin && asin.length>0){
          console.log("asinMatch=", asin);
          const productId = asin[asin.length-1];
          let price = 'n/a';
          if(e.querySelectorAll(".a-price-whole").length>0){
            price = e.querySelectorAll(".a-price-whole")[0].textContent;
          }
          newAsins.push({
            productId,
            price,
          })
      }
    }
  }
});


newAsins = newAsins.filter((i, p, a) => a.map(mapItem => mapItem.productId).indexOf(i.productId) === p);

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

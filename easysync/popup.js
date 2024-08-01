'use strict';
const itemsIdName = 'easyncItemIds'; // easyncItemIds
let hackerList = {};
let intervalId;
let CSV;
let asin;
let spairAsin;

function exportToCsv(filename, csvFile, options) {
  console.log(CSV);
  if (navigator.msSaveBlob) { // IE 10+
    const blob = new Blob([csvFile], {
      type: 'text/csv;charset=utf-8;'
    });
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
      const url = "data:text/csv;charset=utf-8," + encodeURIComponent(csvFile);
      return url;
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

const loadParams = () => {
    getASIN();
    setTimeout(() => {
        const box = document.querySelector('.js-box');
        chrome.tabs.executeScript(null, {
            'code': `window.localStorage.getItem('${itemsIdName}') ? JSON.parse(window.localStorage.getItem('${itemsIdName}')).length : 0`
        }, (result) => (document.querySelector('.js-count').innerText = (result > 0) ? result : 0));
        chrome.tabs.executeScript(null, {
            'code': `window.localStorage.getItem('${itemsIdName}') && window.localStorage.getItem('${itemsIdName}')`
        }, (result) => {
            if (!/productId/.test(result)) {
                return false;
            }
            const productData = JSON.parse(result);
            document.querySelector('.js-count').innerText = productData.length > 0 ? productData.length : 0;

            var paginationBottomOptions = {
                name: "paginationBottom",
                paginationClass: "paginationBottom",
                innerWindow: 3,
                left: 2,
                right: 4
            };

            if(asin) {
                let count = 0;
                for(let i of productData) {
                    if(i.productId === asin) {
                        i.productId += ' - current';
                        break;
                    }
                }
            }

            hackerList = new List('hacker-list', {
                valueNames: Object.keys(productData[0]),
                item: `<div class="row">
            <div class="col-xs-4 ea-ellipsis">
              <span class="productId ea-ellipsis" title="ProductId"></span>
            </div>
            <div class="col-xs-8 ea-ellipsis">
              <span class="badge price" title="Price"></span>
              <span class="badge variants" title="Variants"></span>
              <span class="badge info" title="Info"></span>
              <span class="badge shipping" title="Shipping"></span>
              <span class="badge prime" title="Prime"></span>
              <span class="badge stars" title="Stars"></span>
              <span class="badge reviews" title="Reviews"></span>
              <span class="badge discount" title="Discount"></span>
              <span class="badge time" title="End Time"></span>
              <span class="badge orders" title="Orders"></span>
              <span class="badge release" title="Release"></span>
            </div>
            <!-- <a class="remove-item js-remove" style="float:right" title="Empty"><i class="fa fa-trash-o" aria-hidden="true"></i></a> -->
            </div>`,
                plugins: [ListPagination(paginationBottomOptions)],
                page: 10,
            });
            hackerList.clear();
            hackerList.add(productData);
        });
    }, 500);
}

const toCSV = (objArray) => {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  let str = '';
  for (let i = 0; i < array.length; i++) {
    let line = '';
    for (const index in array[i]) {
      if (!array[i][index])  {
        continue;
      }
      line += `${array[i][index]},`;
    }
    str += line + "\n";
  }
  return str;
};

const toDocs = (objArray) => {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += '\t'
            line += array[i][index];
        }
        str += line + '\r\n';
    }
    return str;
}

const runGrabber = (e) => {
    textStatus('Loading items ID.');
    chrome.storage.sync.get({
        market: 'empty'
    }, (obj) => {
        chrome.tabs.executeScript(null, {
            file: `market/${obj.market}.js`
        });
    });
    setTimeout(() => textStatus('Next Page.'), 1000)
    loadParams();
}

const timingGrabber = (e) => {
    $('.js-timing i').toggleClass('fa-clock-o fa-stop');
    if (!intervalId) {
        textStatus('Run Every 5s');
        intervalId = setInterval(() => runGrabber(), 5000);
    } else {
        clearInterval(intervalId);
    }
}

const emptyItems = (e) => {
    textStatus('Cleared.');
    chrome.tabs.executeScript(null, {
        "code": "{window.localStorage.setItem('easyncItemIds', [])};  window.localStorage.getItem('easyncItemIds').length"
    });
    hackerList.clear();
    loadParams();
}

const copyText = (type) => {
    chrome.tabs.executeScript(null, {
        'code': `window.localStorage.getItem('${itemsIdName}') && window.localStorage.getItem('${itemsIdName}')`
    }, (result) => {
        if (!/productId/.test(result)) {
            textStatus('Empty.');
            return false;
        }

        textStatus('Copied.');
        const input = document.createElement('textarea');
        input.style.position = 'fixed';
        input.style.opacity = 0;
        const productData = JSON.parse(result);

        if (type === 'csv') {
            CSV = toCSV(productData);
            input.value = CSV;
        } else {
            console.log(type)
            input.value = productData.map(e => e.productId).join('\r\n');
        }
        document.body.appendChild(input);
        input.select();
        document.execCommand('Copy');
        document.body.removeChild(input);
    });
}

const saveOptions = (e) => {
    chrome.storage.sync.set({
            market: e.target.value
        },
        () => textStatus(`Optins ${e.target.value} saved.`));
}

const getMarketName = (url) => {
    if (/walmart.com/.test(url)) {
        return 'walmart';
    } else if (/aliexpress.com/.test(url)) {
        return 'aliexpress';
    } else if (/amazon./.test(url)) {
        return 'amazon';
    } else if (/overstock./.test(url)) {
        return 'overstock';
    } else if (/sears./.test(url)) {
        return 'sears';
    } else if (/kmart./.test(url)) {
        return 'kmart';
    } else if (/bestbuy./.test(url)) {
        return 'bestbuy';
    } else if (/bhphotovideo./.test(url)) {
        return 'bhphotovideo';
    } else if (/costco./.test(url)) {
        return 'costco';
    } else if (/samsclub./.test(url)) {
        return 'samsclub';
    } else if (/lowes./.test(url)) {
        return 'lowes';
    } else if (/homedepot./.test(url)) {
      return 'homedepot';
    }

    return 'empty';
}

const restore_options = () => {
    textStatus('Restore.');
    chrome.tabs.executeScript(null, {
        'code': "window.location.host"
    }, (result) => {
        const marketName = getMarketName(result);
        textStatus(`Restore ${marketName}`);
        if (document.querySelector(`[value="${marketName}"]`)) {
            document.querySelector(`[value="${marketName}"]`).selected = true;
            chrome.storage.sync.set({
                market: marketName
            });
        } else {
            chrome.storage.sync.get({
                    market: 'amazon'
                }, (obj) =>
                document.querySelector(`[value="${obj.market}"]`).selected = true
            );
        }
    });
}

const textStatus = (text) => {
    document.querySelector('.js-status').innerText = text;
    setTimeout(() => document.querySelector('.js-status').innerHTML = '<a href="http://easync.io/?extn" target="_blank">easync.io</a>', 750);
}

const removeItem = () => {
  const itemId = $(this).closest('li').find('.productId').text();
  hackerList.remove('productId', itemId);
};

const openTable = () => {
    chrome.tabs.executeScript(null, {
        'code': `window.localStorage.getItem('${itemsIdName}') && window.localStorage.getItem('${itemsIdName}')`
    }, (result) => {
        if (!/productId/.test(result)) {
            textStatus('Empty.');
            return false;
        }
        copyText('csv');
        setTimeout(() =>
            chrome.tabs.create({
                selected: true,
                url: 'http://spreadsheets.google.com/ccc?new=true'
            }),
            1000);
    });
}

const dlCSV = () => {
  chrome.tabs.executeScript(null, {
    'code': `window.localStorage.getItem('${itemsIdName}') && window.localStorage.getItem('${itemsIdName}')`
  }, (result) => {
    if (!/productId/.test(result)) {
      textStatus('Empty.');
      return false;
    }
    copyText('csv');
    const datetime = (new Date).getTime();
    const filename = `easync_io_${datetime}.csv`;
    setTimeout(() => chrome.downloads.download({
      url: exportToCsv('asin.csv', CSV, {
        separator: ','
      }),
      filename
    }), 1000);
  });
};


chrome.tabs.onUpdated.addListener((id, info, tab) => {
    loadParams()
});

let getASIN = () => {
   /* chrome.tabs.executeScript(null, {
        'code': 'document.getElementById("ASIN").getAttribute("value")'
    }, result => {
        if (result[0]) {
            asin = result[0];
        } else {
            asin = null;
        }
    });*/
    chrome.tabs.executeScript(null, {
        'code': 'window.location.pathname'
    }, result => {
        if(result[0]) {
            let asinMatch = result[0].match(/dp\/(.*)?\//);
            let asinMatch2 = result[0].match(/dp\/(.*)/);
            let asinMatch3 = result[0].split('/');
            /*console.log(asinMatch);
            console.log(asinMatch2);
            console.log(asinMatch3);*/
            if(asinMatch && asinMatch.length === 2) {
                asin = asinMatch[1];
            }
            else if(!asinMatch && asinMatch2 && asinMatch2.length === 2) {
                asin = asinMatch2[1];
            } else if (!asinMatch && !asinMatch2 && asinMatch3.length) {
                asin = asinMatch3[3];
            } else {
                asin = null;
            }
        }
    })
};

const pasteAddressFromBuffer = () => {
    chrome.tabs.executeScript(
        null,
        { code: 'AddressBuffer && AddressBuffer.insert()' },
        result => { console.log(result) }
    )
}

document.addEventListener('DOMContentLoaded', () => {
    loadParams();
    restore_options();
    document.querySelector('.js-markets').addEventListener('change', saveOptions);
    document.querySelector('.js-run').addEventListener('click', runGrabber);
    document.querySelector('.js-timing').addEventListener('click', timingGrabber);
    document.querySelector('.js-empty').addEventListener('click', emptyItems);
    document.querySelector('.js-cp').addEventListener('click', copyText);
    document.querySelector('.js-table').addEventListener('click', openTable);
    document.querySelector('.js-csv').addEventListener('click', dlCSV);
    document.querySelector('.js-address').addEventListener('click', pasteAddressFromBuffer);
});

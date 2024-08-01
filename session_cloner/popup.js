// Butona tıklandığında çağrılacak işlev
async function _cookies(){
  return new Promise((resolve)=> {
      chrome.runtime.sendMessage({ action: 'getAllCookies' }, function(response) {
          resolve(response.cookies)
      });
  })
}

async function collect() {
  
  const cookies = await _cookies()

  const storageDataString = JSON.stringify(JSON.stringify(window.localStorage));

  const sessionDataString = JSON.stringify(window.sessionStorage);

  const storageObject = JSON.stringify({
      local: storageDataString,
      cookie: cookies,
      session: sessionDataString,
      version: 'sdkjsdjskdjskdjskdjskd'+new Date().getSeconds()
  });

  console.log(storageObject)

  copyToClipboard(storageObject);
} 

window.collect = collect




function copyToClipboard(text) {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

async function waitCookies(url)
{
  return new Promise((resolve)=> {
    chrome.cookies.getAll({
        url: "https://keepa.com"
    }, function(cookies) {
       resolve(cookies)
    });
  })
}

function handleClick() {
  chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
    const [tab] = tabs
    
    const cc = await waitCookies(tab.url)
    copyToClipboard(JSON.stringify(cc));
  });
}

function handleClick2() {
  collect()
}

// Sayfa tamamen yüklendiğinde buton tıklama olayını dinle
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('collectButton').addEventListener('click', handleClick);
});
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('collectButton2').addEventListener('click', handleClick2);
});
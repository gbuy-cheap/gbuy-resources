const DOMAIN="https://sas.selleramp.com",manifestData=chrome.runtime.getManifest(),urlParams="?src=ext&ver="+manifestData.version+"e",initURL=DOMAIN+"/extension/setup"+urlParams,composeIframeSrc=s=>initURL+"&redirectUrl="+DOMAIN+s+urlParams,baseURL=composeIframeSrc("/sas/lookup"),historyUrl=composeIframeSrc("/sas/history"),settingsUrl=composeIframeSrc("/user/update"),urlConstants={baseURL:baseURL,historyUrl:historyUrl,settingsUrl:settingsUrl};export{urlConstants};
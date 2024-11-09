let clearLog = !0;
const offscreenSupported = "undefined" !== typeof chrome.offscreen;
let lastActivity = 0, sellerLockoutDuration = 60000, delayedFetch = !1, ignoreResponseCookies = !1, stockDelay = 0, startedAt = new Date();
setInterval(() => {
  3E5 < Date.now() - lastActivity && chrome.runtime.reload();
}, 144E5);
let hasWebRequestPermission = !!chrome.webRequest, interceptedExtensionCookies = {}, serviceWorkerUrl = chrome.runtime.getURL("").replace(/\/$/, "");
async function waitForCookies(a, d) {
  const c = interceptedExtensionCookies[a]?.promise;
  return new Promise(e => {
    const b = setTimeout(() => {
      console.log("Timeout reached without cookies", a);
      e(null);
    }, d);
    c || (clearTimeout(b), e(null));
    c.then(f => {
      clearTimeout(b);
      e(f);
    });
  });
}
function parseNumberFormat(a) {
  try {
    let d = a.toString(), c = d.includes(".") ? d.split(".")[1].length : 0;
    d = d.replace(".", "");
    return parseInt(d, 10) * Math.pow(10, 2 - c);
  } catch (d) {
  }
  return null;
}
async function handleGuestSession(a, d) {
  let c = null;
  try {
    c = cloud.getSessionId(settings.extensionCookies[a.domainId]?.cookies);
  } catch (e) {
    console.error(e);
  }
  await swapCookies(a.url, d, a.userCookies);
  delete settings.userCookies["" + a.domainId];
  a.response.cookies = null;
  a.response.text = null;
  delete settings.extensionCookies["" + a.domainId];
  delete common.addToCartAssocCsrfs[a.domainId];
  //common.reportBug(null, generateBugReport("new s is u s", c, a));
  a.response.status = 900;
}
function updateCookies(a, d) {
  Array.isArray(a) || (a = []);
  Array.isArray(d) || (d = []);
  const c = new Map(a.map(b => [b.name, b])), e = new Set(d.filter(b => "-" !== b.value && "" !== b.value && "delete" !== b.value).map(b => b.name));
  d.forEach(b => {
    if (e.has(b.name)) {
      "-" !== b.value && "" !== b.value && "delete" !== b.value && c.set(b.name, b);
    } else {
      const f = c.get(b.name);
      f && f.secure === b.secure && f.path === b.path ? "" === b.value || "-" === b.value || "delete" === b.value ? c.delete(b.name) : c.set(b.name, b) : "" !== b.value && "-" !== b.value && "delete" !== b.value && c.set(b.name, b);
    }
  });
  return Array.from(c.values());
}
function parseSetCookieString(a) {
  a = a.split(";").map(b => b.trim());
  const [d, c] = a[0].split("="), e = {name:d, value:c, domain:"", path:"", secure:!1, hostOnly:!1, httpOnly:!1, session:!1, storeId:"0", sameSite:"unspecified", expirationDate:0};
  a.slice(1).forEach(b => {
    const [f, m] = b.split("=");
    switch(f.toLowerCase()) {
      case "domain":
        e.domain = m;
        break;
      case "path":
        e.path = m;
        break;
      case "expires":
        e.expirationDate = (new Date(m)).getTime() / 1000;
        break;
      case "secure":
        e.secure = !0;
        break;
      case "hostOnly":
        e.hostOnly = !0;
        break;
      case "httpOnly":
        e.httpOnly = !0;
        break;
      case "session":
        e.session = !0;
        break;
      case "sameSite":
        e.sameSite = !0;
    }
  });
  return e;
}
let AmazonSellerIds = "1 ATVPDKIKX0DER A3P5ROKL5A1OLE A3JWKAKR8XB7XF A1X6FK5RDHNB96 AN1VRQENFRJN5 A3DWYIK6Y9EEQB A1AJ19PSB66TGU A11IL2PNWYJU7H A1AT7YVPFBWXBL A3P5ROKL5A1OLE AVDBXBAVVSXLQ A1ZZFT5FULY4LN ANEGB3WVEVKZB A17D2BRD4YMT0X".split(" "), WarehouseDealsSellerIds = [];
const userAgentData = navigator.userAgentData?.brands.find(({brand:a}) => "Google Chrome" === a), settingKeys = "optOut_crawl revealStock s_boxOfferListing s_boxType s_boxHorizontal webGraphType webGraphRange overlayPriceGraph lastActivated".split(" "), isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent), userAgent = navigator.userAgent.toLowerCase(), isFirefox = userAgent.includes("firefox"), isEdge = userAgent.includes("edge/"), isSafari = /Apple Computer/.test(navigator.vendor) && 
userAgent.includes("safari"), isOpera = userAgent.includes("opera") || userAgent.includes("opr/"), isChrome = !isOpera && !isFirefox && !isEdge && !isSafari, type = isChrome ? "keepaChrome" : isOpera ? "keepaOpera" : isSafari ? "keepaSafari" : isEdge ? "keepaEdge" : "keepaFirefox", browserType = isFirefox ? "Firefox" : isSafari ? "Safari" : isChrome ? "Chrome" : isOpera ? "Opera" : isEdge ? "Edge" : "Unknown";
let installTimestamp = 0;
const runningSince = Date.now();
let settings = {}, cookieOrder = "session-id session-id-time i18n-prefs skin ubid-main sp-cdn session-token".split(" ");
const cookieToString = a => {
  let d = "", c = "";
  var e = {};
  for (let b in a) {
    const f = a[b];
    e[f.name] = f;
  }
  a = [];
  for (let b in cookieOrder) {
    e[cookieOrder[b]] && a.push(e[cookieOrder[b]]);
  }
  for (let b in cookieOrder) {
    delete e[cookieOrder[b]];
  }
  for (let b in e) {
    a.push(e[b]);
  }
  for (let b in a) {
    e = a[b], "-" != e.value && (d += c + e.name + "=" + e.value + ";", c = " ");
  }
  return d;
};
function generateBugReport(a, d, c) {
  return (new Date()).toISOString().substring(0, 19) + ` # ${a} ! ${d} --- ${c.userSession} ${c.url}` + ` status: ${c.response.status}` + ` webreq: ${hasWebRequestPermission}` + ` sc active: ${0 == lastSellerActivity ? "never" : (new Date(lastSellerActivity)).toISOString().substring(0, 19)}` + ` c active: ${0 == lastContentActivity ? "never" : (new Date(lastContentActivity)).toISOString().substring(0, 19)}`;
}
async function updateLocalStorage() {
  await chrome.storage.local.set({extensionCookies:await compressObject(settings.extensionCookies), userCookies:await compressObject(settings.userCookies)});
}
const swapCookies = async(a, d, c) => {
  cloud.getSessionId(d);
  cloud.getSessionId(c);
  let e = null != c ? new Set(c.map(f => f.name)) : null, b = [];
  if (null != d) {
    for (let f of d) {
      null != c && e.has(f.name) || (delete f.hostOnly, delete f.session, b.push(chrome.cookies.remove({url:a + f.path, name:f.name})));
    }
  }
  if (null != c) {
    for (let f of c) {
      delete f.hostOnly, delete f.session, f.url = a, b.push(chrome.cookies.set(f));
    }
  }
  await Promise.all(b).catch(f => {
    setTimeout(() => {
      //common.reportBug(f, "Error in cookie swap.");
    }, 1);
  });
}, DNR = (() => {
  let a = 100;
  const d = e => 0 === e.length ? Promise.resolve() : chrome.declarativeNetRequest.updateSessionRules({removeRuleIds:e}), c = async() => {
    let e = [], b = chrome.declarativeNetRequest.getSessionRules();
    b.then(f => f.forEach(m => {
      e.push(m.id);
    }));
    await b;
    return d(e);
  };
  (async() => {
    await c();
  })();
  return {addSessionRules:e => {
    let b = [];
    e.forEach(f => {
      const m = ++a;
      f.id = m;
      b.push(m);
    });
    return [chrome.declarativeNetRequest.updateSessionRules({addRules:e}), b];
  }, deleteSessionRules:d, deleteAllRules:c};
})();
class Queue {
  constructor() {
    this._items = [];
  }
  enqueue(a) {
    this._items.push(a);
  }
  dequeue() {
    return this._items.shift();
  }
  get size() {
    return this._items.length;
  }
}
class AutoQueue extends Queue {
  constructor() {
    super();
    this._pendingPromise = !1;
  }
  enqueue(a) {
    return new Promise((d, c) => {
      super.enqueue({action:a, resolve:d, reject:c});
      this.dequeue();
    });
  }
  async dequeue() {
    if (this._pendingPromise) {
      return !1;
    }
    let a = super.dequeue();
    if (!a) {
      return !1;
    }
    try {
      this._pendingPromise = !0;
      let d = await a.action(this);
      this._pendingPromise = !1;
      a.resolve(d);
    } catch (d) {
      this._pendingPromise = !1, a.reject(d);
    } finally {
      this.dequeue();
    }
    return !0;
  }
}
const requestQueue = new AutoQueue(), processRequest = async a => {
  if (a) {
    if (!a.domainId && 0 < a.url.indexOf("amazon.")) {
      console.log("request without domainId");
    } else {
      var d = Date.now();
      lastActivity = d;
      if (!(a.isGuest && !1 === a.ignoreCookies && !hasWebRequestPermission && d - lastSellerActivity < sellerLockoutDuration)) {
        var c = parseInt(d / 1000), e = new URL(a.url);
        a.response = {headers:{}, text:null};
        "undefined" === typeof a.cookies && (a.cookies = []);
        a.userCookies = null;
        var b = null != a.cookies ? cookieToString(a.cookies) : null;
        d = hasWebRequestPermission || !0 === a.ignoreCookies && null != b && 8 < b.length;
        for (let l = 0; l < a.dnr.length; l++) {
          const g = a.dnr[l];
          g.priority = 108108;
          g.condition && (-1 < a.url.indexOf("amazon.") ? g.condition.urlFilter = "||amazon." + getTldByDomain(a.domainId) : g.condition.urlFilter = a.url, g.condition.initiatorDomains = [chrome.runtime.id], delete g.condition.tabIds);
          let k = !1;
          for (let n = 0; n < g.action.requestHeaders.length; n++) {
            const p = g.action.requestHeaders[n];
            "set" == p.operation && ("cookie" == p.header.toLowerCase() ? (null != b ? p.value = p.value.replace("{COOKIE}", b) : (delete p.value, p.operation = "remove"), k = !0) : (p.value = p.value.replace("{ORIGIN}", a.originHost ? a.originHost : e.host), a.language && (p.value = p.value.replace("{LANG}", a.language)), a.referer && (p.value = p.value.replace("{REFERER}", a.referer)), a.csrf && (p.value = p.value.replace("{CSRF}", a.csrf)), a.atcCsrf && (p.value = p.value.replace("{ATCCSRF}", 
            a.atcCsrf)), a.slateToken && (p.value = p.value.replace("{STOKEN}", a.slateToken))));
          }
          a.isGuest && !k && "modifyHeaders" == g.action.type && (null != b && 0 < a.cookies.length ? g.action.requestHeaders.push({header:"Cookie", operation:"set", value:b}) : g.action.requestHeaders.push({header:"Cookie", operation:"remove"}));
          a.isGuest && d && (g.action.responseHeaders = [{header:"Set-Cookie", operation:"remove"}]);
        }
        try {
          try {
            await DNR.deleteAllRules();
          } catch (k) {
            //common.reportBug(k, "Error deleteAllRules.");
            return;
          }
          if (a.isGuest) {
            a.userSession = "";
            var f = {excludedInitiatorDomains:[chrome.runtime.id], isUrlFilterCaseSensitive:!1, urlFilter:"||amazon." + getTldByDomain(a.domainId), resourceTypes:"main_frame sub_frame csp_report font image media object other ping script stylesheet webbundle websocket webtransport xmlhttprequest".split(" ")};
            a.userCookies = await chrome.cookies.getAll({url:a.url});
            if (0 < a.userCookies.length) {
              var m = cloud.getSessionId(a.userCookies);
              if (m && 0 < m.length) {
                if (cloud.getSessionId(a.cookies) == m) {
                  throw "pre r; u s is r c s: " + m + " : " + a.userSession + " - " + a.url + "  sc active: " + (0 == lastSellerActivity ? "never" : (new Date(lastSellerActivity)).toISOString().substring(0, 19)) + " c active: " + (0 == lastContentActivity ? "never" : (new Date(lastContentActivity)).toISOString().substring(0, 19));
                }
                a.userSession = m;
              }
              d || a.dnr.push({priority:108107, action:{type:"modifyHeaders", requestHeaders:[{header:"Cookie", operation:"set", value:cookieToString(a.userCookies)}], responseHeaders:[{header:"Set-Cookie", operation:"remove"}]}, condition:f});
            } else {
              d || a.dnr.push({priority:108107, action:{type:"modifyHeaders", requestHeaders:[{header:"Cookie", operation:"remove"}], responseHeaders:[{header:"Set-Cookie", operation:"remove"}]}, condition:f});
            }
          }
          const [l, g] = DNR.addSessionRules(a.dnr);
          try {
            await l;
          } catch (k) {
            //common.reportBug(k, "Error dnrPromise.");
            return;
          }
          var h = "object" === typeof a.urls;
          f = null;
          try {
            if (a.isGuest && (settings.userCookies["" + a.domainId] = a.userCookies, await chrome.storage.local.set({userCookies:await compressObject(settings.userCookies)}), !d)) {
              m = [];
              if (null != a.cookies) {
                for (e = 0; e < a.cookies.length; ++e) {
                  let n = a.cookies[e];
                  try {
                    n.expirationDate = Number(c + 180 + ".108108");
                  } catch (p) {
                    console.error(p);
                  }
                  "sp-cdn" != n.name && m.push(n);
                }
              } else {
                m = null;
              }
              await swapCookies(a.url, a.userCookies, m);
            }
            let k = n => {
              hasWebRequestPermission && (interceptedExtensionCookies[n] = {promise:null, resolve:null}, interceptedExtensionCookies[n].promise = new Promise(p => {
                interceptedExtensionCookies[n].resolve = p;
              }), setTimeout(() => {
                delete interceptedExtensionCookies[n];
              }, 60000));
            };
            if (h) {
              a.url = a.urls[0];
              a.urls.forEach(p => k(p));
              a.responses = {};
              const n = a.urls.map(async p => {
                let r = await fetch(p, a.fetch);
                a.responses[p] = {headers:{}, text:"", status:0};
                a.responses[p].text = await r.text();
                for (let q of r.headers.entries()) {
                  a.responses[p].headers[q[0]] = q[1];
                }
                a.responses[p].status = r.status;
              });
              await Promise.all(n);
            } else {
              k(a.url);
              f = await fetch(a.url, a.fetch);
              if (!delayedFetch || d) {
                a.response.text = await f.text();
              }
              for (let n of f.headers.entries()) {
                a.response.headers[n[0]] = n[1];
              }
              a.response.status = f.status;
            }
          } catch (k) {
            console.log(k, "Fetch: " + a.url);
          } finally {
            delete a.dnr;
            delete a.fetch;
            if (a.isGuest) {
              let k = await chrome.cookies.getAll({url:a.url}), n = cloud.getSessionId(k);
              if (d) {
                let p = [], r = [];
                if (hasWebRequestPermission) {
                  if (h) {
                    a.urls.forEach(async q => {
                      q = await waitForCookies(q, 2000);
                      null != q && (p.push(q.request), 0 < q.cookies.length && r.concat(q.cookies));
                    });
                  } else {
                    let q = await waitForCookies(a.url, 2000);
                    null != q && (r = q.cookies, p.push(q.request));
                  }
                }
                try {
                  0 < p.length && 302 == p[0].statusCode && (a.response.redirectUrl = p[0].responseHeaders.find(q => "location" === q.name.toLowerCase())?.value ?? null);
                } catch (q) {
                  console.log(q);
                }
                h = null;
                if (r && 0 < r.length) {
                  let q = updateCookies(a.cookies, r);
                  a.response.cookies = q;
                  h = cloud.getSessionId(a.response.cookies);
                  h == a.userSession || n == h ? await handleGuestSession(a, k) : "" != h ? "undefined" === typeof settings.extensionCookies["" + a.domainId] || null == settings.extensionCookies["" + a.domainId] ? settings.extensionCookies["" + a.domainId] = {cookies:a.response.cookies, createDate:Date.now()} : (settings.extensionCookies["" + a.domainId].cookies = a.response.cookies, settings.extensionCookies["" + a.domainId].createDate = Date.now()) : delete settings.extensionCookies["" + a.domainId];
                } else {
                  a.response.cookies = a.cookies;
                }
              } else {
                a.response.cookies = k, n != a.userSession || "" == n && "" == a.userSession ? ("" != n ? "undefined" === typeof settings.extensionCookies["" + a.domainId] ? settings.extensionCookies["" + a.domainId] = {cookies:a.response.cookies, createDate:Date.now()} : (settings.extensionCookies["" + a.domainId].cookies = a.response.cookies, settings.extensionCookies["" + a.domainId].createDate = Date.now()) : (delete settings.extensionCookies["" + a.domainId], delete common.addToCartAssocCsrfs[a.domainId]), 
                await swapCookies(a.url, a.response.cookies, a.userCookies)) : await handleGuestSession(a, k);
              }
            }
            delete settings.userCookies["" + a.domainId];
            await updateLocalStorage();
            await DNR.deleteSessionRules(g);
            delayedFetch && !d && null != f && (a.response.text = await f.text());
            delete interceptedExtensionCookies[a.url];
          }
        } catch (l) {
          a.response.cookies = null, a.response.text = null, a.response.status = 901, delete settings.extensionCookies["" + a.domainId], delete common.addToCartAssocCsrfs[a.domainId], delete settings.userCookies["" + a.domainId], await chrome.storage.local.set({extensionCookies:await compressObject(settings.extensionCookies), userCookies:await compressObject(settings.userCookies)}), await DNR.deleteAllRules();
        }
      }
    }
  }
}, init = () => {
  isFirefox ? chrome.storage.local.get(["install", "optOutCookies"], a => {
    a.optOutCookies && 3456E5 > Date.now() - a.optOutCookies || (a.install ? common?.register() : chrome.tabs.create({url:chrome.runtime.getURL("chrome/content/onboard.html")}));
  }) : common?.register();
  chrome.storage.local.get(["installTimestamp"], a => {
    a.installTimestamp && 12 < (a.installTimestamp + "").length ? installTimestamp = a.installTimestamp : (installTimestamp = Date.now(), chrome.storage.local.set({installTimestamp}));
  });
}, restoreUserCookies = async() => {
  try {
    for (let a = 0; a < settings.userCookies.length; a++) {
      const d = settings.userCookies[a];
      if (d) {
        const c = "https://www.amazon." + getTldByDomain(a);
        await swapCookies(c, settings.extensionCookies[a]?.cookies || [], d);
        delete settings.userCookies["" + a];
        await chrome.storage.local.set({userCookies:await compressObject(settings.userCookies)});
      }
    }
  } catch (a) {
    //common.reportBug(a, "restoreUserCookies");
  }
};
async function decompress(a, d) {
  d = new DecompressionStream("deflate" + (d ? "-raw" : ""));
  let c = d.writable.getWriter();
  c.write(a);
  c.close();
  return await (new Response(d.readable)).arrayBuffer().then(function(e) {
    return (new TextDecoder()).decode(e);
  });
}
async function compress(a, d) {
  d = new CompressionStream("deflate" + (d ? "-raw" : ""));
  let c = d.writable.getWriter();
  c.write((new TextEncoder()).encode(a));
  c.close();
  a = await (new Response(d.readable)).arrayBuffer();
  return new Uint8Array(a);
}
async function compressObject(a) {
  try {
    let d = await compress(JSON.stringify(a), !0);
    return btoa(String.fromCharCode.apply(null, d));
  } catch (d) {
    return console.error("An error occurred:", d), null;
  }
}
async function decompressObject(a) {
  a = Uint8Array.from(atob(a), d => d.charCodeAt(0));
  return JSON.parse(await decompress(a, !0));
}
chrome.storage.local.set({lastActivated:Date.now()}, () => {
  chrome.storage.local.get(null, async a => {
    try {
      "undefined" != typeof a && (settings = a);
      if (settings.extensionCookies) {
        try {
          settings.extensionCookies = await decompressObject(settings.extensionCookies);
        } catch (d) {
          settings.extensionCookies = [];
        }
      } else {
        settings.extensionCookies = [];
      }
      if (!hasWebRequestPermission && settings.userCookies) {
        try {
          settings.userCookies = await decompressObject(settings.userCookies), restoreUserCookies();
        } catch (d) {
          settings.userCookies = [];
        }
      } else {
        settings.userCookies = [];
      }
      init();
      settings.stockCookies && chrome.storage.local.remove("stockCookies");
      settings.guestCookies && chrome.storage.local.remove("guestCookies");
    } catch (d) {
      //common.reportBug(d, "4 " + JSON.stringify(a));
    }
  });
});
const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20e3);
chrome.runtime.onStartup.addListener(keepAlive);
keepAlive();
let lifeline = null;
self.onactivate = a => {
};
chrome.alarms.clearAll();
chrome.alarms.create("keepAlive", {periodInMinutes:1});
chrome.alarms.onAlarm.addListener(a => {
  chrome.storage.local.get(["lastActivated"], d => {
  });
});
let asinCache = {}, lastSellerActivity = 0, lastContentActivity = 0, asinCacheSize = 0;
chrome.runtime.onMessage.addListener((a, d, c) => {
  var e = Date.now();
  lastActivity = e;
  if (d.tab && d.tab.url || d.url) {
    switch(a.type) {
      case "restart":
        chrome.runtime.reload();
        break;
      case "setCookie":
        chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:a.key, value:a.val, secure:!0, expirationDate:(Date.now() / 1000 | 0) + 31536E3});
        "token" == a.key ? settings?.token != a.val && 64 == a.val.length && (settings.token = a.val, chrome.storage.local.set({token:a.val}), chrome.tabs.query({}, m => {
          try {
            m.forEach(h => {
              try {
                h.url && !h.incognito && chrome.tabs.sendMessage(h.id, {key:"updateToken", value:settings.token});
              } catch (l) {
                console.log(l);
              }
            });
          } catch (h) {
            console.log(h);
          }
        })) : (settings[a.key] = a.val, chrome.storage.local.set({[a.key]:a.val}));
        break;
      case "getCookie":
        return chrome.cookies.get({url:"https://keepa.com/extension", name:a.key}, m => {
          null == m ? c({value:null, install:installTimestamp}) : c({value:m.value, install:installTimestamp});
        }), !0;
      case "openPage":
        chrome.windows.create({url:a.url, incognito:!0});
        break;
      case "isPro":
        common.stockData ? c({value:common.stockData.pro, stockData:common.stockData, amazonSellerIds:AmazonSellerIds, warehouseSellerIds:WarehouseDealsSellerIds}) : c({value:null});
        break;
      case "getStock":
        if (null == common.stockData.stock) {
          console.log("stock retrieval not initialized");
          c({error:"stock retrieval not initialized", errorCode:0});
          break;
        }
        if (0 == common.stockData.stockEnabled[a.domainId]) {
          console.log("stock retrieval not supported for domain");
          c({error:"stock retrieval not supported for domain", errorCode:1});
          break;
        }
        if (!0 !== common.stockData.pro && !a.force) {
          console.log("stock retrieval not pro");
          c({error:"stock retrieval failed, not subscribed", errorCode:2});
          break;
        }
        if (null == a.oid) {
          c({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " missing oid.", errorCode:12});
          break;
        }
        if (null == a.sellerId) {
          c({error:"Unable to retrieve stock for this offer. ", errorCode:45});
          break;
        }
        d = e - lastSellerActivity < sellerLockoutDuration && (!settings.extensionCookies[a.domainId] || a.getNewId);
        if ((a.offscreen ? common.stockData.cartDisabledOffscreen : common.stockData.cartDisabled) || a.onlyMaxQty && !a.isMAP || d) {
          c({stock:a.maxQty, limit:!1, isMaxQty:a.maxQty});
          break;
        }
        a.cachedStock = {stock:a.maxQty, limit:!1, isMaxQty:a.maxQty};
        let f = a.offscreen && !common.stockData.cartOffscreenBatch ? common.addStockJobSequential : common.addStockJob;
        f(a, m => {
          if (m.errorCode && 0 < m.errorCode && a.cachedStock && 430 != m.errorCode) {
            a.cachedStock.errorCode = m.errorCode, a.cachedStock.error = m.error, c(a.cachedStock);
          } else {
            if (5 != m.errorCode && 429 != m.errorCode && 430 != m.errorCode && 9 != m.errorCode || a.offscreen) {
              c(m);
            } else {
              if (9 == m.errorCode || 430 == m.errorCode) {
                a.getNewId = !0;
              }
              setTimeout(() => {
                f(a, c);
              }, 1);
            }
          }
        });
        return !0;
      case "getFilters":
        c({value:cloud.getFilters()});
        break;
      case "isSellerActive":
        lastSellerActivity = Date.now();
        c({});
        break;
      case "isActive":
        6E5 < e - lastContentActivity && webSocketObj.sendPlainMessage({key:"m1", payload:["c0"]});
        lastActivity = lastContentActivity = e;
        c({});
        break;
      case "sendData":
        d = a.val;
        if (null != d.ratings) {
          if (e = d.ratings, 1000 > asinCacheSize) {
            if ("f1" == d.key) {
              if (e) {
                let m = e.length;
                for (; m--;) {
                  var b = e[m];
                  null == b || null == b.asin ? e.splice(m, 1) : (b = d.domainId + b.asin + b.ls, asinCache[b] ? e.splice(m, 1) : (asinCache[b] = 1, asinCacheSize++));
                }
                0 < e.length && webSocketObj.sendPlainMessage(d);
              }
            } else {
              webSocketObj.sendPlainMessage(d);
            }
          } else {
            asinCache = {}, asinCacheSize = 0;
          }
        } else {
          webSocketObj.sendPlainMessage(d);
        }
        c({});
        break;
      default:
        c({});
    }
  }
});
try {
  chrome.action.onClicked.addListener(function(a) {
    chrome.tabs.create({url:"https://keepa.com/#!manage"});
  });
} catch (a) {
  console.log(a);
}
try {
  chrome.contextMenus.removeAll(), chrome.contextMenus.create({title:"View products on Keepa", contexts:["page"], id:"keepaContext", documentUrlPatterns:"*://*.amazon.com/* *://*.amzn.com/* *://*.amazon.co.uk/* *://*.amazon.de/* *://*.amazon.fr/* *://*.amazon.it/* *://*.amazon.ca/* *://*.amazon.com.mx/* *://*.amazon.es/* *://*.amazon.co.jp/* *://*.amazon.in/*".split(" ")}), chrome.contextMenus.onClicked.addListener((a, d) => {
    chrome.tabs.sendMessage(d.id, {key:"collectASINs"}, {}, c => {
      "undefined" != typeof c && chrome.tabs.create({url:"https://keepa.com/#!viewer/" + encodeURIComponent(JSON.stringify(c))});
    });
  });
} catch (a) {
  console.error(a);
}
const common = {version:chrome.runtime.getManifest().version, Guid:function() {
  const a = function(c, e, b) {
    return c.length >= e ? c : a(b + c, e, b || " ");
  }, d = function() {
    let c = (new Date()).getTime();
    return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(/x/g, function(e) {
      const b = (c + 16 * Math.random()) % 16 | 0;
      c = Math.floor(c / 16);
      return ("x" === e ? b : b & 7 | 8).toString(16);
    });
  };
  return {newGuid:function() {
    var c = "undefined" != typeof self.crypto.getRandomValues;
    if ("undefined" != typeof self.crypto && c) {
      c = new self.Uint16Array(16);
      self.crypto.getRandomValues(c);
      var e = "";
      for (f in c) {
        var b = c[f].toString(16);
        b = a(b, 4, "0");
        e += b;
      }
      var f = e;
    } else {
      f = d();
    }
    return f;
  }};
}(), register:async function() {
  chrome.cookies.onChanged.addListener(c => {
    c.removed || null == c.cookie || "keepa.com" != c.cookie.domain || "/extension" != c.cookie.path || ("token" == c.cookie.name ? settings.token != c.cookie.value && 64 == c.cookie.value.length && (settings.token = c.cookie.value, chrome.tabs.query({}, e => {
      try {
        e.forEach(b => {
          try {
            b.url && !b.incognito && chrome.tabs.sendMessage(b.id, {key:"updateToken", value:settings.token});
          } catch (f) {
            console.log(f);
          }
        });
      } catch (b) {
        console.log(b);
      }
    })) : common.set(c.cookie.name, c.cookie.value));
  });
  let a = !1, d = async c => {
    for (let e = 0; e < c.length; e++) {
      const b = c[e];
      try {
        const f = await chrome.cookies.get({url:"https://keepa.com/extension", name:b});
        if (chrome.runtime.lastError && -1 < chrome.runtime.lastError.message.indexOf("No host permission")) {
          a || (a = !0);
          break;
        }
        null != f && null != f.value && 0 < f.value.length && common.set(b, f.value);
      } catch (f) {
        console.log(f);
      }
    }
  };
  d(settingKeys);
  try {
    const c = await chrome.cookies.get({url:"https://keepa.com/extension", name:"token"});
    if (null != c && 64 == c.value.length) {
      settings.token = c.value, common.set("token", settings.token);
    } else {
      let e = (Date.now() / 1000 | 0) + 31536E3;
      chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"optOut_crawl", value:"0", secure:!0, expirationDate:e});
      chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"revealStock", value:"1", secure:!0, expirationDate:e});
      chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"s_boxType", value:"0", secure:!0, expirationDate:e});
      chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"s_boxOfferListing", value:"1", secure:!0, expirationDate:e});
      chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"s_boxHorizontal", value:"0", secure:!0, expirationDate:e});
      chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"webGraphType", value:"[1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]", secure:!0, expirationDate:e});
      chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"webGraphRange", value:"180", secure:!0, expirationDate:e});
      chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"overlayPriceGraph", value:"0", secure:!0, expirationDate:e});
      d(settingKeys);
      common.storage.get("token", function(b) {
        b = b.token;
        settings.token = b && 64 == b.length ? b : common.Guid.newGuid();
        chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"token", value:settings.token, secure:!0, expirationDate:e});
      });
    }
  } catch (c) {
    //common.reportBug(c, "get token cookie");
  }
  isFirefox ? common.set("addonVersionFirefox", common.version) : common.set("addonVersionChrome", common.version);
  try {
    chrome.runtime.setUninstallURL("https://dyn.keepa.com/app/stats/?type=uninstall&version=" + type + "." + common.version);
  } catch (c) {
  }
  webSocketObj.initWebSocket();
}, storage:chrome.storage.local, parseCookieHeader:(a, d) => {
  if (0 < d.indexOf("\n")) {
    d = d.split("\n");
    a: for (var c = 0; c < d.length; ++c) {
      var e = d[c].substring(0, d[c].indexOf(";")), b = e.indexOf("=");
      e = [e.substring(0, b), e.substring(b + 1)];
      if (2 == e.length && "-" != e[1]) {
        for (b = 0; b < a.length; ++b) {
          if (a[b][0] == e[0]) {
            a[b][1] = e[1];
            continue a;
          }
        }
        a.push(e);
      }
    }
  } else {
    if (d = d.substring(0, d.indexOf(";")), c = d.indexOf("="), d = [d.substring(0, c), d.substring(c + 1)], 2 == d.length && "-" != d[1]) {
      for (c = 0; c < a.length; ++c) {
        if (a[c][0] == d[0]) {
          a[c][1] = d[1];
          return;
        }
      }
      a.push(d);
    }
  }
}, stockRequest:[], stockData:null, stockJobQueue:[], stockJobQueueSingle:[], addStockJobSequential:(a, d) => {
  a.gid = common.Guid.newGuid().substr(0, 8);
  a.requestType = -1;
  let c = !1, e = f => {
    c || (c = !0, clearTimeout(b), f.error && delete common.addToCartAssocCsrfs[a.domainId], common.stockJobQueueSingle.shift(), d(f), 0 < common.stockJobQueueSingle.length && (stockDelay ? setTimeout(() => {
      common.processStockJob(common.stockJobQueueSingle[0][0], null, null, null, common.stockJobQueueSingle[0][1]);
    }, stockDelay) : common.processStockJob(common.stockJobQueueSingle[0][0], null, null, null, common.stockJobQueueSingle[0][1])));
  }, b = setTimeout(() => {
    e({error:"stock retrieval timeout", errorCode:408});
  }, a.offscreen ? 5000 : 0 == common.stockJobQueueSingle.length ? 16000 : Math.min(3000 * common.stockJobQueueSingle.length, 60000));
  common.stockJobQueueSingle.push([a, e]);
  1 == common.stockJobQueueSingle.length && common.processStockJob(a, null, null, null, e);
}, batchTimer:null, batchProcessing:!1, addStockJob:(a, d) => {
  a.gid = common.Guid.newGuid().substr(0, 8);
  a.requestType = -1;
  let c = !1, e = f => {
    c || (c = !0, clearTimeout(b), d(f));
  }, b = setTimeout(() => {
    e({error:"stock retrieval timeout", errorCode:408});
  }, a.offscreen ? 5000 : 0 == common.stockJobQueue.length ? 16000 : Math.min(15000 + 6000 * common.stockJobQueue.length, 60000));
  common.stockJobQueue.push({request:a, hook:e});
  common.batchProcessing || (common.batchProcessing = !0, common.batchTimer = setTimeout(() => {
    common.processBatch();
  }, 100));
}, processBatch:() => {
  if (0 == common.stockJobQueue.length) {
    common.batchProcessing = !1;
  } else {
    var a = common.stockJobQueue;
    common.stockJobQueue = [];
    var d = {}, c = [], e = [];
    a.forEach(l => {
      let g = `${l.request.sellerId || "defaultSellerId"}_${l.request.asin || "defaultAsin"}`;
      d[g] ? l.request.offscreen ? l.hook({error:"stock dup", errorCode:444}) : e.push(l) : (d[g] = !0, c.push(l));
    });
    common.stockJobQueue.push(...e);
    a = c.map(l => l.request);
    var b = c.map(l => l.hook), f = c.map(l => l.request.asin), m = c.map(l => l.request.oid), h = c.map(l => l.request.sellerId);
    common.processStockJob(a[0], m, f, h, l => {
      try {
        l.forEach((g, k) => {
          b[k](g);
        });
      } catch (g) {
        b.forEach((k, n) => {
          b[n](l);
        });
      }
      0 < common.stockJobQueue.length ? common.processBatch() : common.batchProcessing = !1;
    });
  }
}, removeHeadersForUserRequest:(a, d) => {
  if (d) {
    var c = ["sec-ch-ua-platform", "sec-ch-ua", "user-agent", "sec-ch-ua-mobile"];
    a.dnr[0].action.requestHeaders = a.dnr[0].action.requestHeaders.filter(e => !c.includes(e.header.toLowerCase()));
  }
}, addToCartAjax:(a, d, c) => {
  let e = !1, b = !1, f = 0, m = cloud.getSessionId(a.cookies);
  m && (e = !0, m != a.session && (b = !0, f = m));
  if (e && b) {
    var h = structuredClone(common.stockData.addCart);
    h.isStock = !0;
    h.userSession = a.session;
    h.csrf = a.csrf;
    h.atcCsrf = a.atcCsrf;
    h.slateToken = a.slateToken;
    h.originHost = a.host;
    h.domainId = a.domainId;
    c || (h.url = h.url.replaceAll("{SESSION_ID}", f).replaceAll("{TLD}", getTldByDomain(a.domainId)).replaceAll("{OFFER_ID}", a.oid).replaceAll("{MARKETPLACE}", common.stockData.marketplaceIds[a.domainId]).replaceAll("{ADDCART}", encodeURIComponent(common.stockData.stockAdd[a.domainId])).replaceAll("{ASIN}", a.asin));
    h.language = common.stockData.languageCode[a.domainId];
    h.referer = common.stockData.isMobile ? "https://" + a.host + "/gp/aw/d/" + a.asin + "/" : a.referer;
    h.cookies = a.cookies;
    h.fetch.body = h.fetch.body.replaceAll("{SESSION_ID}", f).replaceAll("{CSRF}", encodeURIComponent(a.csrf)).replaceAll("{OFFER_ID}", a.oid).replaceAll("{ADDCART}", encodeURIComponent(common.stockData.stockAdd[a.domainId])).replaceAll("{ASIN}", a.asin);
    requestQueue.enqueue(() => processRequest(h)).then(async() => {
      const l = h.response?.text, g = h.response?.status;
      if (null == l) {
        a.cookies = null, common.stockData.domainId = -1, d({error:"(" + g + ") Stock retrieval failed for this offer. Try reloading the page or restarting your browser if the issue persists. ", errorCode:66});
      } else {
        try {
          if (422 == g || 200 == g) {
            let k = JSON.parse(l), n = (new RegExp(common.stockData.limit)).test(JSON.stringify(k.entity.items[0].responseMessage));
            d({stock:k.entity.items[0].quantity, orderLimit:-1, limit:n, price:-3, location:null, type:1});
          } else {
            d({error:"Stock retrieval failed for this offer. Try reloading the page after a while. ", errorCode:g});
          }
        } catch (k) {
          a.error = k, console.error("request failed", k), d({error:"An error occurred during stock retrieval", errorCode:500});
        }
      }
    }).catch(l => {
      a.error = l;
      console.error("request failed", l);
      d({error:"An error occurred during stock retrieval", errorCode:501});
      //common.reportBug(l, "6 stock error - " + JSON.stringify(asins));
    });
  } else {
    //d({error:"stock session issue: " + e + " " + b, errorCode:4});
  }
}, addToCartAssocCsrfs:[], deleteExtensionCookies:async a => {
  delete common.addToCartAssocCsrfs[a];
  delete settings.extensionCookies[a];
  await chrome.storage.local.set({extensionCookies:await compressObject(settings.extensionCookies)});
}, addToCartAssoc:(a, d, c, e, b) => {
  let f = structuredClone(common.stockData.createCart);
  f.isStock = !0;
  f.userSession = a.session;
  f.originHost = a.host;
  f.domainId = a.domainId;
  f.language = common.stockData.languageCode[a.domainId];
  f.cookies = a.cookies;
  f.url = f.url.replaceAll("{TLD}", getTldByDomain(a.domainId)).replaceAll("{TAG}", common.stockData.tags[a.domainId]);
  f.url += "&Quantity.1=1&ASIN.1=" + a.asin;
  common.addToCartAssocCsrfs[a.domainId] ? common.addToCartAssocWithCsrf(a, d, c, e, b, common.addToCartAssocCsrfs[a.domainId], f.url) : requestQueue.enqueue(() => processRequest(f)).then(async() => {
    let m = f.response?.text, h = f.response?.status;
    if (null == m || 200 != h) {
      a.cookies = null, common.stockData.domainId = -1, common.deleteExtensionCookies(a.domainId), b({error:"(" + h + ") Stock retrieval failed for this offer. Try reloading the page or restarting your browser if the issue persists", errorCode:65});
    } else {
      try {
        let l = m.match(new RegExp(common.stockData.csrfAssoc));
        if (null != l) {
          l = l[1];
          let g = a.domainId;
          common.addToCartAssocCsrfs[g] = l;
          setTimeout(() => {
            delete common.addToCartAssocCsrfs[g];
          }, 6E5);
          common.addToCartAssocWithCsrf(a, d, c, e, b, l, f.url);
        } else {
          b({error:"Stock retrieval failed for this offer. Try reloading the page after a while. ", errorCode:h});
        }
      } catch (l) {
        a.error = l, console.error("request failed", l), b({error:"An error occurred during stock retrieval", errorCode:502});
      }
    }
  }).catch(m => {
    a.error = m;
    console.error("cc request failed", m);
    b({error:"An error occurred during stock retrieval", errorCode:503});
  });
}, addToCartAssocWithCsrf:(a, d, c, e, b, f, m) => {
  let h = structuredClone(common.stockData.addCartAssoc);
  h.isStock = !0;
  h.userSession = a.session;
  h.originHost = a.host;
  h.domainId = a.domainId;
  h.language = common.stockData.languageCode[a.domainId];
  h.referer = m;
  h.cookies = a.cookies;
  m = "";
  for (var l = 0; l < d.length; l++) {
    var g = l + 1;
    m += "OfferListingId." + g + "=" + encodeURIComponent(d[l]) + "&";
    m += "ASIN." + g + "=" + encodeURIComponent(c[l]) + "&";
    m += "Quantity." + g + "=" + common.stockData.stockQty + "&";
  }
  m += "anti-csrftoken-a2z=" + encodeURIComponent(f);
  h.fetch.body = m;
  h.fetch.redirect = "follow";
  h.url = h.url.replaceAll("{TLD}", getTldByDomain(a.domainId));
  requestQueue.enqueue(() => processRequest(h)).then(async() => {
    let k = h.response?.text;
    if (200 != h.response?.status) {
      a.cookies = null, common.stockData.domainId = -1, b({error:"Stock retrieval failed for this offer. Try reloading the page or restarting your browser if the issue persists. ", errorCode:165});
    } else {
      try {
        let p = [], r = !1;
        for (let q = 0; q < c.length; q++) {
          const t = c[q], u = e[q], v = (new RegExp(`<div[^>]*\\bdata-asin="${t}"[^>]*?(?=.*\\bdata-price="([^"]+)")(?=.*\\bdata-quantity="([^"]+)")(?=.*\\bdata-itemid="([^"]+)")[^]{10,2300}smid=${u}`, "i")).exec(k);
          if (v && !r) {
            const z = parseNumberFormat(v[1]);
            let w = parseInt(v[2]);
            const x = v[3];
            var n = null;
            if (a.offscreen) {
              const y = (new RegExp(common.stockData.stockLocation, "i")).exec(k);
              y && (n = y[1]);
            }
            "undefined" == typeof settings.extensionCookies[a.domainId].cartCache && (settings.extensionCookies[a.domainId].cartCache = []);
            settings.extensionCookies[a.domainId].cartCache[x] && (w = settings.extensionCookies[a.domainId].cartCache[x]);
            1000 < w ? (common.deleteExtensionCookies(a.domainId), p.push({asin:t, sellerId:u, errorCode:535, error:"Offer not found"}), r = !0) : (n = {asin:t, sellerId:u, dataItemId:x, stock:w, orderLimit:-1, limit:!1, price:z, type:2, location:n}, settings.extensionCookies[a.domainId].cartCache[x] = w, p.push(n));
          } else {
            p.push({asin:t, sellerId:u, errorCode:535, error:"Offer not found"});
          }
        }
        chrome.storage.local.set({extensionCookies:await compressObject(settings.extensionCookies)});
        b(p);
      } catch (p) {
        a.error = p, console.error("request failed", p), b({error:"An error occurred during stock retrieval", errorCode:505});
      }
    }
  }).catch(k => {
    a.error = k;
    console.error("request failed", k);
    b({error:"An error occurred during stock retrieval", errorCode:506});
  });
}, processStockJob:async(a, d, c, e, b) => {
  Date.now();
  let f = !a.offscreen || common.stockData.cartOffscreenBatch;
  a.queue = [async() => {
    f ? common.addToCartAssoc(a, d, c, e, b) : common.addToCartAjax(a, b, f);
  }];
  a.getNewId && (common.stockData.geoRetry && common.deleteExtensionCookies(a.domainId), a.queue.unshift(async() => {
    let h = structuredClone(common.stockData.geo);
    h.userSession = a.session;
    h.isStock = !0;
    h.domainId = a.domainId;
    settings.extensionCookies[a.domainId]?.cookies && (h.cookies = settings.extensionCookies[a.domainId].cookies);
    h.url = "https://" + common.stockData.offerUrl.replace("{ORIGIN}", a.host).replace("{ASIN}", a.asin).replace("{SID}", a.sellerId);
    h.language = common.stockData.languageCode[a.domainId];
    requestQueue.enqueue(async() => processRequest(h)).then(async() => {
      if (h.response.text.match(common.stockData.sellerIdBBVerify.replace("{SID}", a.sellerId))) {
        var l = null;
        for (var g = 0; g < common.stockData.csrfBB.length; g++) {
          var k = h.response.text.match(new RegExp(common.stockData.csrfBB[g]));
          if (null != k && k[1]) {
            l = k[1];
            break;
          }
        }
        if (l) {
          a.csrf = l;
          l = null;
          for (g = 0; g < common.stockData.offerIdBB.length; g++) {
            if (k = h.response.text.match(new RegExp(common.stockData.offerIdBB[g])), null != k && k[1]) {
              l = k[1];
              break;
            }
          }
          if (l) {
            a.oid = l;
            a.callback();
            return;
          }
        }
      }
      common.deleteExtensionCookies(a.domainId);
      b({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " mismatch oid.", errorCode:10});
    }).catch(async l => {
      a.error = l;
      common.deleteExtensionCookies(a.domainId);
      b({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " mismatch oid.", errorCode:101});
      console.error("request failed", l);
    });
  }));
  a.callback = () => {
    const h = a.queue.shift();
    h ? h() : b({error:"callback queue empty", errorCode:509});
  };
  if (settings.extensionCookies[a.domainId] && 288E5 > Date.now() - settings.extensionCookies[a.domainId].createDate && 1729806460708 < settings.extensionCookies[a.domainId].createDate) {
    a.cookies = settings.extensionCookies[a.domainId].cookies, a.callback();
  } else {
    var m = common.stockData.zipCodes[a.domainId];
    if (common.stockData.domainId == a.domainId) {
      a.requestType = 3;
      let h = structuredClone(common.stockData.addressChange);
      h.userSession = a.session;
      h.isStock = !0;
      h.domainId = a.domainId;
      h.url = "https://" + a.host + h.url;
      h.csrf = "";
      h.language = common.stockData.languageCode[a.domainId];
      h.fetch.body = h.fetch.body.replace("{ZIPCODE}", m);
      requestQueue.enqueue(() => processRequest(h)).then(() => {
        a.cookies = h.response.cookies;
        a.callback();
      }).catch(l => {
        a.error = l;
        b({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " main.", errorCode:73});
        console.error("request failed", l);
      });
    } else {
      let h = structuredClone(common.stockData.geo);
      h.userSession = a.session;
      h.isStock = !0;
      h.url = "https://" + a.host + h.url;
      h.language = common.stockData.languageCode[a.domainId];
      h.domainId = a.domainId;
      requestQueue.enqueue(() => processRequest(h)).then(async() => {
        let l = h.response.text;
        var g = l?.match(new RegExp(common.stockData.csrfGeo));
        null != g && (h.csrf = g[1]);
        if (200 == h.response.status) {
          let k = structuredClone(common.stockData.setAddress);
          k.userSession = a.session;
          k.domainId = a.domainId;
          k.isStock = !0;
          k.referer = h.url;
          k.url = "https://" + a.host + k.url;
          k.language = common.stockData.languageCode[a.domainId];
          k.csrf = h.csrf;
          k.cookies = h.response.cookies;
          requestQueue.enqueue(() => processRequest(k)).then(() => {
            let n = structuredClone(common.stockData.addressChange);
            n.referer = h.url;
            n.userSession = a.session;
            n.domainId = a.domainId;
            k.isStock = !0;
            n.url = "https://" + a.host + n.url;
            n.language = common.stockData.languageCode[a.domainId];
            l = k.response.text;
            let p = l?.match(new RegExp(common.stockData.csrfSetAddress));
            null != p && (n.csrf = p[1]);
            n.cookies = k.response.cookies;
            n.fetch.body = n.fetch.body.replace("{ZIPCODE}", m);
            a.requestType = 3;
            requestQueue.enqueue(() => processRequest(n)).then(() => {
              a.cookies = n.response.cookies;
              a.callback();
            }).catch(async r => {
              a.error = r;
              console.error("request failed", r);
              common.deleteExtensionCookies(a.domainId);
              b({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " main.", errorCode:72});
            });
          }).catch(async n => {
            a.error = n;
            console.error("request failed", n);
            common.deleteExtensionCookies(a.domainId);
            b({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " main.", errorCode:71});
          });
        } else {
          if (429 != h.response.status || a.offscreen) {
            common.deleteExtensionCookies(a.domainId), b({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " main.", errorCode:7});
          } else {
            const k = a.isMainRetry;
            setTimeout(() => {
              k ? b({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " main.", errorCode:429}) : (a.isMainRetry = !0, (f ? common.addStockJob : common.addStockJobSequential)(a, b));
            }, 1156);
            k || (g = f ? common.stockJobQueue : common.stockJobQueueSingle, g.shift(), 0 < g.length && common.processStockJob(g[0][0], null, null, null, g[0][1]));
          }
        }
      }).catch(async l => {
        a.error = l;
        console.error("request failed " + a.url, l);
        common.deleteExtensionCookies(a.domainId);
        b({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " main.", errorCode:74});
      });
    }
  }
}, set:function(a, d, c) {
  const e = {};
  e[a] = d;
  common.storage.set(e, c);
}, lastBugReport:0, reportBug:function(a, d, c) {
  return
  console.error(a, d);
  const e = a ? a : Error();
  common.storage.get(["token"], function(b) {
    var f = Date.now();
    if (!(12E5 > f - common.lastBugReport || /(dead object)|(Script error)|(setUninstallURL)|(File error: Corrupted)|(operation is insecure)|(\.location is null)/i.test(a))) {
      common.lastBugReport = f;
      f = "";
      var m = common.version;
      d = d || "";
      try {
        if (f = e.stack.split("\n").splice(1).join("&ensp;&lArr;&ensp;"), !/(keepa|content)\.js/.test(f) || f.startsWith("https://www.amazon") || f.startsWith("https://smile.amazon") || f.startsWith("https://sellercentral")) {
          return;
        }
      } catch (l) {
      }
      try {
        f = f.replace(RegExp("chrome-extension://.*?/content/", "g"), "").replace(/:[0-9]*?\)/g, ")").replace(/[ ]{2,}/g, "");
      } catch (l) {
      }
      if ("object" == typeof a) {
        try {
          a = a instanceof Error ? a.toString() : JSON.stringify(a);
        } catch (l) {
        }
      }
      null == c && (c = {exception:a, additional:d, url:chrome.runtime.id, stack:f});
      c.keepaType = type;
      c.version = m;
      var h = JSON.stringify(c);
      setTimeout(function() {
        fetch("https://dyn.keepa.com/service/bugreport/?user=" + b.token + "&type=" + browserType + "&version=" + m + "&delayed=" + (delayedFetch ? 1 : 0) + "&timeout=" + sellerLockoutDuration, {method:"POST", body:h, mode:"cors", cache:"no-cache", credentials:"same-origin", redirect:"error"});
      }, 50);
    }
  });
}};
let webSocketObj = {server:["wss://dyn-2.keepa.com", "wss://dyn.keepa.com"], serverIndex:0, lastDomain:0, clearTimeout:0, webSocket:null, sendPlainMessage:async function(a) {
  isMobile || (a = JSON.stringify(a), webSocketObj.webSocket.send(await compress(a, !1)));
}, sendMessage:async function(a) {
  isMobile || ((a = await compress(JSON.stringify(a), !1)) && 1 == webSocketObj.webSocket.readyState && webSocketObj.webSocket.send(a), clearLog && console.clear());
}, initWebSocket:function() {
  if (!isMobile) {
    var a = settings.optOut_crawl;
    offscreenSupported || (a = "1");
    if (settings.token && 64 == settings.token.length) {
      const d = function() {
        if (null == webSocketObj.webSocket || 1 != webSocketObj.webSocket.readyState) {
          webSocketObj.serverIndex %= webSocketObj.server.length;
          if ("undefined" == typeof a || "undefined" == a || null == a || "null" == a) {
            a = "0";
          }
          const c = webSocketObj.server[webSocketObj.serverIndex] + "/apps/cloud/?app=" + type + "&version=" + common.version + "&i=" + installTimestamp + "&mf=3&optOut=" + a + "&time=" + Date.now() + "&id=" + chrome.runtime.id + "&wr=" + (hasWebRequestPermission ? 1 : 0) + "&offscreen=" + (offscreenSupported ? 1 : 0) + "&mobile=" + isMobile, e = new WebSocket(c, settings.token);
          e.binaryType = "arraybuffer";
          e.onmessage = async function(b) {
            if (0 != b.data.byteLength) {
              b = b.data;
              var f = null;
              b instanceof ArrayBuffer && (b = await decompress(b, !0));
              try {
                f = JSON.parse(b);
              } catch (m) {
                common.reportBug(m, b);
                return;
              } finally {
                b = b = null;
              }
              lastActivity = Date.now();
              108 != f.status && ("" == f.key ? common.stockData.domainId = f.domainId : 108108 == f.timeout ? (f.stockDataV3 && (common.stockData = f.stockDataV3, common.stockData.cookieOrder && (cookieOrder = common.stockData.cookieOrder), f.stockDataV3.amazonIds && (AmazonSellerIds = f.stockDataV3.amazonIds), f.stockDataV3.warehouseIds && (WarehouseDealsSellerIds = f.stockDataV3.warehouseIds), common.stockData.sellerLockoutDuration && (sellerLockoutDuration = common.stockData.sellerLockoutDuration), 
              common.stockData.delayedFetch && (delayedFetch = common.stockData.delayedFetch), common.stockData.ignoreWebRequest && (hasWebRequestPermission = !1), hasWebRequestPermission && chrome.webRequest?.onHeadersReceived.addListener(m => {
                if (m.initiator == serviceWorkerUrl) {
                  var h = m.responseHeaders, l = m.url, g = [];
                  for (let k = 0; k < h.length; ++k) {
                    "set-cookie" == h[k].name.toLowerCase() && g.push(parseSetCookieString(h[k].value));
                  }
                  try {
                    interceptedExtensionCookies[l].resolve({cookies:g, request:m});
                  } catch (k) {
                    -1 < l.indexOf("/gp/cart/view") && interceptedExtensionCookies[l.replaceAll("/gp/cart/view.html", "/associates/addtocart")]?.resolve({cookies:g, request:m});
                  }
                }
              }, {urls:["<all_urls>"]}, ["responseHeaders", "extraHeaders"]), common.stockData.stockDelay && (stockDelay = common.stockData.stockDelay)), "undefined" != typeof f.keepaBoxPlaceholder && common.set("keepaBoxPlaceholder", f.keepaBoxPlaceholder), "undefined" != typeof f.keepaBoxPlaceholderBackup && common.set("keepaBoxPlaceholderBackup", f.keepaBoxPlaceholderBackup), "undefined" != typeof f.keepaBoxPlaceholderBackupClass && common.set("keepaBoxPlaceholderBackupClass", f.keepaBoxPlaceholderBackupClass), 
              "undefined" != typeof f.keepaBoxPlaceholderAppend && common.set("keepaBoxPlaceholderAppend", f.keepaBoxPlaceholderAppend), "undefined" != typeof f.keepaBoxPlaceholderBackupAppend && common.set("keepaBoxPlaceholderBackupAppend", f.keepaBoxPlaceholderBackupAppend)) : (f.domainId && (webSocketObj.lastDomain = f.domainId), cloud.onMessage(f)));
            }
          };
          e.onclose = function(b) {
            setTimeout(() => {
              36E5 < Date.now() - startedAt && 180000 < Date.now() - lastActivity ? chrome.runtime.reload() : d();
            }, 18E4 * Math.random());
          };
          e.onerror = function(b) {
            webSocketObj.serverIndex++;
            e.close();
          };
          e.onopen = function() {
            cloud.abortJob(414, null, null);
          };
          webSocketObj.webSocket = e;
        }
      };
      d();
    }
  }
}}, cloud = function() {
  function a(g, k) {
    if (null != g) {
      g.sent = !0;
      g = {key:g.key, messageId:g.messageId, sessionId:b(settings.extensionCookies[g.domainId]?.cookies), payload:[], status:200};
      for (let n in k) {
        g[n] = k[n];
      }
      return g;
    }
  }
  async function d(g) {
    if (-1 == g.url.indexOf("keepa.com/")) {
      g.request.cookies = settings.extensionCookies[g.domainId]?.cookies;
      try {
        g.request.userSession = "guest";
      } catch (k) {
      }
    }
    e(g, function(k) {
      let n = {payload:[]};
      if (k) {
        if (k.match(l)) {
          n.status = 403;
        } else {
          if (g.contentFilters && 0 < g.contentFilters.length) {
            for (let p in g.contentFilters) {
              let r = k.match(new RegExp(g.contentFilters[p]));
              if (r) {
                n.payload[p] = r[1].replace(/\n/g, "");
              } else {
                n.status = 305;
                n.payload[p] = k;
                break;
              }
            }
          } else {
            n.payload = [k];
          }
        }
      }
      "undefined" == typeof g.sent && webSocketObj.sendMessage(a(g, n));
    });
  }
  async function c(g) {
    g.request.cookies = settings.extensionCookies[g.domainId]?.cookies;
    g.request.userSession = "guest";
    e(g, function(k) {
      null == k && "undefined" == typeof g.sent && webSocketObj.sendMessage(a(g, {payload:[], redirectUrl:g.request?.response?.redirectUrl, status:305}));
    });
  }
  function e(g, k) {
    1 == g.httpMethod && g.scrapeFilters && 0 < g.scrapeFilters.length && (h = {scrapeFilters:g.scrapeFilters, dbg1:g.dbg1, dbg2:g.dbg2, domainId:g.domainId});
    g.request.domainId = g.domainId;
    requestQueue.enqueue(() => processRequest(g.request)).then(async() => {
      try {
        "object" === typeof g.request.urls && (g.request.response.text = "", g.request.urls.forEach(p => {
          p = g.request.responses[p];
          200 == p.status ? null != p.text && 10 < p.text.length && (g.request.response.text += p.text) : m(p.status, null, g);
        }));
      } catch (p) {
        console.error(p);
      }
      let n = g?.request?.response?.text;
      if (offscreenSupported && null != n && "" != n) {
        if ("o0" == g.key) {
          k(n);
        } else {
          n = n.replace(/src=".*?"/g, 'src=""');
          g.block && (n = n.replace(new RegExp(g.block, "g"), ""));
          try {
            await setupOffscreenDocument(), chrome.runtime.sendMessage({type:"parse", target:"offscreen", data:{content:n, message:g, stockData:common.stockData}}, p => {
              p = p.response;
              p = a(g, p);
              webSocketObj.sendMessage(p);
              chrome.offscreen.closeDocument();
            });
          } catch (p) {
            common.reportBug(p), g.request.isStock ? k(null) : m(410, null, g);
          }
        }
      } else {
        k(null);
      }
    }).catch(n => {
      console.error("request failed", n);
      g.request.error = n;
      g.request.isStock ? k(null) : m(410, null, g);
    });
  }
  function b(g) {
    try {
      if (g) {
        for (let k = 0; k < g.length; ++k) {
          let n = g[k];
          if ("session-id" == n.name && 16 < n.value.length && 65 > n.value.length) {
            return n.value;
          }
        }
      }
    } catch (k) {
      console.log(k);
    }
    return "";
  }
  async function f(g) {
    delete settings.extensionCookies["" + g];
    await chrome.storage.local.set({extensionCookies:await compressObject(settings.extensionCookies)});
    delete common.addToCartAssocCsrfs[g];
  }
  function m(g, k, n) {
    if (null != n) {
      try {
        if ("undefined" != typeof n.sent) {
          return;
        }
        const p = a(n, {});
        k && (p.payload = k);
        p.status = g;
        webSocketObj.sendMessage(p);
        chrome.offscreen.closeDocument();
      } catch (p) {
        common.reportBug(p, "abort");
      }
    }
    clearLog && console.clear();
  }
  let h = null;
  const l = /automated access|api-services-support@/;
  return {onMessage:function(g) {
    switch(g.key) {
      case "update":
        chrome.runtime.requestUpdateCheck(function(k, n) {
          "update_available" == k && chrome.runtime.reload();
        });
        break;
      case "o0":
        d(g);
        break;
      case "o1":
        c(g);
        break;
      case "o2":
        f(g.domainId);
        break;
      case "1":
        chrome.runtime.reload();
    }
  }, endSession:f, getSessionId:b, getOutgoingMessage:a, getFilters:function() {
    return h;
  }, abortJob:m};
}(), getTldByDomain = a => {
  a = parseInt(a);
  switch(a) {
    case 1:
      return "com";
    case 2:
      return "co.uk";
    case 3:
      return "de";
    case 4:
      return "fr";
    case 5:
      return "co.jp";
    case 6:
      return "ca";
    case 7:
      return "cn";
    case 8:
      return "it";
    case 9:
      return "es";
    case 10:
      return "in";
    case 11:
      return "com.mx";
    case 12:
      return "com.br";
    case 13:
      return "com.au";
    case 14:
      return "nl";
    default:
      return "com";
  }
}, creating;
async function setupOffscreenDocument() {
  const a = chrome.runtime.getURL("offscreen.html");
  chrome.runtime.getContexts && 0 < (await chrome.runtime.getContexts({contextTypes:["OFFSCREEN_DOCUMENT"], documentUrls:[a]})).length || (creating ||= chrome.offscreen.createDocument({url:"offscreen.html", reasons:["DOM_PARSER"], justification:"Extracting information from HTML"}).then(d => {
    creating = null;
    return d;
  }), await creating);
}
;

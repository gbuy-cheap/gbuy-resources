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
    c.then(g => {
      clearTimeout(b);
      e(g);
    });
  });
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
      const g = c.get(b.name);
      g && g.secure === b.secure && g.path === b.path ? "" === b.value || "-" === b.value || "delete" === b.value ? c.delete(b.name) : c.set(b.name, b) : "" !== b.value && "-" !== b.value && "delete" !== b.value && c.set(b.name, b);
    }
  });
  return Array.from(c.values());
}
function parseSetCookieString(a) {
  a = a.split(";").map(b => b.trim());
  const [d, c] = a[0].split("="), e = {name:d, value:c, domain:"", path:"", secure:!1, hostOnly:!1, httpOnly:!1, session:!1, storeId:"0", sameSite:"unspecified", expirationDate:0};
  a.slice(1).forEach(b => {
    const [g, l] = b.split("=");
    switch(g.toLowerCase()) {
      case "domain":
        e.domain = l;
        break;
      case "path":
        e.path = l;
        break;
      case "expires":
        e.expirationDate = (new Date(l)).getTime() / 1000;
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
    const g = a[b];
    e[g.name] = g;
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
  let e = null != c ? new Set(c.map(g => g.name)) : null, b = [];
  if (null != d) {
    for (let g of d) {
      null != c && e.has(g.name) || (delete g.hostOnly, delete g.session, b.push(chrome.cookies.remove({url:a + g.path, name:g.name})));
    }
  }
  if (null != c) {
    for (let g of c) {
      delete g.hostOnly, delete g.session, g.url = a, b.push(chrome.cookies.set(g));
    }
  }
  await Promise.all(b).catch(g => {
    setTimeout(() => {
      //common.reportBug(g, "Error in cookie swap.");
    }, 1);
  });
}, DNR = (() => {
  let a = 100;
  const d = e => 0 === e.length ? Promise.resolve() : chrome.declarativeNetRequest.updateSessionRules({removeRuleIds:e}), c = async() => {
    let e = [], b = chrome.declarativeNetRequest.getSessionRules();
    b.then(g => g.forEach(l => {
      e.push(l.id);
    }));
    await b;
    return d(e);
  };
  (async() => {
    await c();
  })();
  return {addSessionRules:e => {
    let b = [];
    e.forEach(g => {
      const l = ++a;
      g.id = l;
      b.push(l);
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
        for (let m = 0; m < a.dnr.length; m++) {
          const f = a.dnr[m];
          f.priority = 108108;
          f.condition && (-1 < a.url.indexOf("amazon.") ? f.condition.urlFilter = "||amazon." + getTldByDomain(a.domainId) : f.condition.urlFilter = a.url, f.condition.initiatorDomains = [chrome.runtime.id], delete f.condition.tabIds);
          let k = !1;
          for (let n = 0; n < f.action.requestHeaders.length; n++) {
            const p = f.action.requestHeaders[n];
            "set" == p.operation && ("cookie" == p.header.toLowerCase() ? (null != b ? p.value = p.value.replace("{COOKIE}", b) : (delete p.value, p.operation = "remove"), k = !0) : (p.value = p.value.replace("{ORIGIN}", a.originHost ? a.originHost : e.host), a.language && (p.value = p.value.replace("{LANG}", a.language)), a.referer && (p.value = p.value.replace("{REFERER}", a.referer)), a.csrf && (p.value = p.value.replace("{CSRF}", a.csrf)), a.atcCsrf && (p.value = p.value.replace("{ATCCSRF}", 
            a.atcCsrf)), a.slateToken && (p.value = p.value.replace("{STOKEN}", a.slateToken))));
          }
          a.isGuest && !k && "modifyHeaders" == f.action.type && (null != b && 0 < a.cookies.length ? f.action.requestHeaders.push({header:"Cookie", operation:"set", value:b}) : f.action.requestHeaders.push({header:"Cookie", operation:"remove"}));
          a.isGuest && d && (f.action.responseHeaders = [{header:"Set-Cookie", operation:"remove"}]);
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
            var g = {excludedInitiatorDomains:[chrome.runtime.id], isUrlFilterCaseSensitive:!1, urlFilter:"||amazon." + getTldByDomain(a.domainId), resourceTypes:"main_frame sub_frame csp_report font image media object other ping script stylesheet webbundle websocket webtransport xmlhttprequest".split(" ")};
            a.userCookies = await chrome.cookies.getAll({url:a.url});
            if (0 < a.userCookies.length) {
              var l = cloud.getSessionId(a.userCookies);
              if (l && 0 < l.length) {
                if (cloud.getSessionId(a.cookies) == l) {
                  throw "pre r; u s is r c s: " + l + " : " + a.userSession + " - " + a.url + "  sc active: " + (0 == lastSellerActivity ? "never" : (new Date(lastSellerActivity)).toISOString().substring(0, 19)) + " c active: " + (0 == lastContentActivity ? "never" : (new Date(lastContentActivity)).toISOString().substring(0, 19));
                }
                a.userSession = l;
              }
              d || a.dnr.push({priority:108107, action:{type:"modifyHeaders", requestHeaders:[{header:"Cookie", operation:"set", value:cookieToString(a.userCookies)}], responseHeaders:[{header:"Set-Cookie", operation:"remove"}]}, condition:g});
            } else {
              d || a.dnr.push({priority:108107, action:{type:"modifyHeaders", requestHeaders:[{header:"Cookie", operation:"remove"}], responseHeaders:[{header:"Set-Cookie", operation:"remove"}]}, condition:g});
            }
          }
          const [m, f] = DNR.addSessionRules(a.dnr);
          try {
            await m;
          } catch (k) {
            //common.reportBug(k, "Error dnrPromise.");
            return;
          }
          var h = "object" === typeof a.urls;
          g = null;
          try {
            if (a.isGuest && (settings.userCookies["" + a.domainId] = a.userCookies, await chrome.storage.local.set({userCookies:await compressObject(settings.userCookies)}), !d)) {
              l = [];
              if (null != a.cookies) {
                for (e = 0; e < a.cookies.length; ++e) {
                  let n = a.cookies[e];
                  try {
                    n.expirationDate = Number(c + 180 + ".108108");
                  } catch (p) {
                    console.error(p);
                  }
                  "sp-cdn" != n.name && l.push(n);
                }
              } else {
                l = null;
              }
              await swapCookies(a.url, a.userCookies, l);
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
              g = await fetch(a.url, a.fetch);
              if (!delayedFetch || d) {
                a.response.text = await g.text();
              }
              for (let n of g.headers.entries()) {
                a.response.headers[n[0]] = n[1];
              }
              a.response.status = g.status;
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
            await DNR.deleteSessionRules(f);
            delayedFetch && !d && null != g && (a.response.text = await g.text());
            delete interceptedExtensionCookies[a.url];
          }
        } catch (m) {
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
    common.reportBug(a, "restoreUserCookies");
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
function parseNumberFormat(a) {
  a = a.toString();
  var d = a.includes(".") ? a.split(".")[1].length : 0;
  a = a.replace(".", "");
  return parseInt(a, 10) * Math.pow(10, 2 - d);
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
          //common.reportBug(d, "1 " + JSON.stringify(a)), settings.extensionCookies = [];
        }
      } else {
        settings.extensionCookies = [];
      }
      if (!hasWebRequestPermission && settings.userCookies) {
        try {
          settings.userCookies = await decompressObject(settings.userCookies), restoreUserCookies();
        } catch (d) {
          //common.reportBug(d, "3 " + JSON.stringify(a)), settings.userCookies = [];
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
        "token" == a.key ? settings?.token != a.val && 64 == a.val.length && (settings.token = a.val, chrome.storage.local.set({token:a.val}), chrome.tabs.query({}, l => {
          try {
            l.forEach(h => {
              try {
                h.url && !h.incognito && chrome.tabs.sendMessage(h.id, {key:"updateToken", value:settings.token});
              } catch (m) {
                console.log(m);
              }
            });
          } catch (h) {
            console.log(h);
          }
        })) : (settings[a.key] = a.val, chrome.storage.local.set({[a.key]:a.val}));
        break;
      case "getCookie":
        return chrome.cookies.get({url:"https://keepa.com/extension", name:a.key}, l => {
          null == l ? c({value:null, install:installTimestamp}) : c({value:l.value, install:installTimestamp});
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
        let g = a.offscreen ? common.addStockJobSequential : common.addStockJob;
        g(a, l => {
          if (l.errorCode && 0 < l.errorCode && a.cachedStock && 430 != l.errorCode) {
            a.cachedStock.errorCode = l.errorCode, a.cachedStock.error = l.error, c(a.cachedStock);
          } else {
            if (5 == l.errorCode || 429 == l.errorCode || 430 == l.errorCode || 9 == l.errorCode) {
              if (9 == l.errorCode || 430 == l.errorCode) {
                a.getNewId = !0;
              }
              setTimeout(() => {
                g(a, c);
              }, 1);
            } else {
              c(l);
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
                let l = e.length;
                for (; l--;) {
                  var b = e[l];
                  null == b || null == b.asin ? e.splice(l, 1) : (b = d.domainId + b.asin + b.ls, asinCache[b] ? e.splice(l, 1) : (asinCache[b] = 1, asinCacheSize++));
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
      for (g in c) {
        var b = c[g].toString(16);
        b = a(b, 4, "0");
        e += b;
      }
      var g = e;
    } else {
      g = d();
    }
    return g;
  }};
}(), register:async function() {
  chrome.cookies.onChanged.addListener(c => {
    c.removed || null == c.cookie || "keepa.com" != c.cookie.domain || "/extension" != c.cookie.path || ("token" == c.cookie.name ? settings.token != c.cookie.value && 64 == c.cookie.value.length && (settings.token = c.cookie.value, chrome.tabs.query({}, e => {
      try {
        e.forEach(b => {
          try {
            b.url && !b.incognito && chrome.tabs.sendMessage(b.id, {key:"updateToken", value:settings.token});
          } catch (g) {
            console.log(g);
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
        const g = await chrome.cookies.get({url:"https://keepa.com/extension", name:b});
        if (chrome.runtime.lastError && -1 < chrome.runtime.lastError.message.indexOf("No host permission")) {
          a || (a = !0);
          break;
        }
        null != g && null != g.value && 0 < g.value.length && common.set(b, g.value);
      } catch (g) {
        console.log(g);
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
    common.reportBug(c, "get token cookie");
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
  let c = !1, e = g => {
    c || (c = !0, clearTimeout(b), g.error && delete common.addToCartAssocCsrfs[a.domainId], common.stockJobQueueSingle.shift(), d(g), 0 < common.stockJobQueueSingle.length && (stockDelay ? setTimeout(() => {
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
  let c = !1, e = g => {
    c || (c = !0, clearTimeout(b), d(g));
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
    a.forEach(m => {
      let f = `${m.request.sellerId || "defaultSellerId"}_${m.request.asin || "defaultAsin"}`;
      d[f] ? e.push(m) : (d[f] = !0, c.push(m));
    });
    common.stockJobQueue.push(...e);
    a = c.map(m => m.request);
    var b = c.map(m => m.hook), g = c.map(m => m.request.asin), l = c.map(m => m.request.oid), h = c.map(m => m.request.sellerId);
    common.processStockJob(a[0], l, g, h, m => {
      try {
        m.forEach((f, k) => {
          b[k](f);
        });
      } catch (f) {
        b.forEach((k, n) => {
          b[n](m);
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
  let e = !1, b = !1, g = 0, l = cloud.getSessionId(a.cookies);
  l && (e = !0, l != a.session && (b = !0, g = l));
  if (e && b) {
    var h = structuredClone(common.stockData.addCart);
    h.isStock = !0;
    h.userSession = a.session;
    h.csrf = a.csrf;
    h.atcCsrf = a.atcCsrf;
    h.slateToken = a.slateToken;
    h.originHost = a.host;
    h.domainId = a.domainId;
    c || (h.url = h.url.replaceAll("{SESSION_ID}", g).replaceAll("{TLD}", getTldByDomain(a.domainId)).replaceAll("{OFFER_ID}", a.oid).replaceAll("{MARKETPLACE}", common.stockData.marketplaceIds[a.domainId]).replaceAll("{ADDCART}", encodeURIComponent(common.stockData.stockAdd[a.domainId])).replaceAll("{ASIN}", a.asin));
    h.language = common.stockData.languageCode[a.domainId];
    h.referer = common.stockData.isMobile ? "https://" + a.host + "/gp/aw/d/" + a.asin + "/" : a.referer;
    h.cookies = a.cookies;
    h.fetch.body = h.fetch.body.replaceAll("{SESSION_ID}", g).replaceAll("{CSRF}", encodeURIComponent(a.csrf)).replaceAll("{OFFER_ID}", a.oid).replaceAll("{ADDCART}", encodeURIComponent(common.stockData.stockAdd[a.domainId])).replaceAll("{ASIN}", a.asin);
    requestQueue.enqueue(() => processRequest(h)).then(async() => {
      const m = h.response?.text, f = h.response?.status;
      if (null == m) {
        a.cookies = null, common.stockData.domainId = -1, d({error:"(" + f + ") Stock retrieval failed for this offer. Try reloading the page or restarting your browser if the issue persists. ", errorCode:66});
      } else {
        try {
          if (422 == f || 200 == f) {
            let k = JSON.parse(m), n = (new RegExp(common.stockData.limit)).test(JSON.stringify(k.entity.items[0].responseMessage));
            d({stock:k.entity.items[0].quantity, orderLimit:-1, limit:n, price:-3, location:null});
          } else {
            d({error:"Stock retrieval failed for this offer. Try reloading the page after a while. ", errorCode:f});
          }
        } catch (k) {
          a.error = k, console.error("request failed", k), d({error:"An error occurred during stock retrieval", errorCode:500});
        }
      }
    }).catch(m => {
      a.error = m;
      console.error("request failed", m);
      d({error:"An error occurred during stock retrieval", errorCode:501});
      //common.reportBug(m, "6 stock error - " + JSON.stringify(asins));
    });
  } else {
    //common.reportBug(null, "stock session issue: " + e + " " + b + " c: " + JSON.stringify(a.cookies) + " " + JSON.stringify(a)), d({error:"stock session issue: " + e + " " + b, errorCode:4});
  }
}, addToCartAssocCsrfs:[], deleteExtensionCookies:async a => {
  delete common.addToCartAssocCsrfs[a];
  delete settings.extensionCookies[a];
  await chrome.storage.local.set({extensionCookies:await compressObject(settings.extensionCookies)});
}, addToCartAssoc:(a, d, c, e, b, g) => {
  let l = structuredClone(common.stockData.createCart);
  l.isStock = !0;
  l.userSession = a.session;
  l.originHost = a.host;
  l.domainId = a.domainId;
  l.language = common.stockData.languageCode[a.domainId];
  l.cookies = a.cookies;
  l.url = l.url.replaceAll("{TLD}", getTldByDomain(a.domainId)).replaceAll("{TAG}", common.stockData.tags[a.domainId]);
  l.url += "&Quantity.1=1&OfferListingId.1=" + a.oid;
  common.addToCartAssocCsrfs[a.domainId] ? common.addToCartAssocWithCsrf(a, d, c, e, b, g, common.addToCartAssocCsrfs[a.domainId], l.url) : requestQueue.enqueue(() => processRequest(l)).then(async() => {
    let h = l.response?.text, m = l.response?.status;
    if (null == h || 200 != m) {
      a.cookies = null, common.stockData.domainId = -1, common.deleteExtensionCookies(a.domainId), b({error:"(" + m + ") Stock retrieval failed for this offer. Try reloading the page or restarting your browser if the issue persists", errorCode:65});
    } else {
      if (0 > h.indexOf('name="OfferListingId.1"')) {
        a.cookies = null, common.stockData.domainId = -1, common.deleteExtensionCookies(a.domainId), b({error:"Stock retrieval failed for this offer. Try reloading the page or restarting your browser if the issue persists. ", errorCode:404});
      } else {
        try {
          let f = h.match(new RegExp(common.stockData.csrfAssoc));
          if (null != f) {
            f = f[1];
            let k = a.domainId;
            common.addToCartAssocCsrfs[k] = f;
            setTimeout(() => {
              delete common.addToCartAssocCsrfs[k];
            }, 6E5);
            common.addToCartAssocWithCsrf(a, d, c, e, b, g, f, l.url);
          } else {
            b({error:"Stock retrieval failed for this offer. Try reloading the page after a while. ", errorCode:m});
          }
        } catch (f) {
          a.error = f, console.error("request failed", f), b({error:"An error occurred during stock retrieval", errorCode:502}), common.reportBug(f, "4 stock error - " + JSON.stringify(c));
        }
      }
    }
  }).catch(h => {
    a.error = h;
    console.error("cc request failed", h);
    b({error:"An error occurred during stock retrieval", errorCode:503});
    common.reportBug(h, "3 stock error - " + JSON.stringify(c));
  });
}, addToCartAssocWithCsrf:(a, d, c, e, b, g, l, h) => {
  let m = structuredClone(common.stockData.addCartAssoc);
  m.isStock = !0;
  m.userSession = a.session;
  m.originHost = a.host;
  m.domainId = a.domainId;
  m.language = common.stockData.languageCode[a.domainId];
  m.referer = h;
  m.cookies = a.cookies;
  g = "";
  for (h = 0; h < d.length; h++) {
    var f = h + 1;
    g += "OfferListingId." + f + "=" + encodeURIComponent(d[h]) + "&";
    g += "ASIN." + f + "=" + encodeURIComponent(c[h]) + "&";
    g += "Quantity." + f + "=" + common.stockData.stockQty + "&";
  }
  g += "anti-csrftoken-a2z=" + encodeURIComponent(l);
  m.fetch.body = g;
  m.fetch.redirect = "follow";
  m.url = m.url.replaceAll("{TLD}", getTldByDomain(a.domainId));
  requestQueue.enqueue(() => processRequest(m)).then(async() => {
    let k = m.response?.text;
    if (200 != m.response?.status) {
      a.cookies = null, common.stockData.domainId = -1, b({error:"Stock retrieval failed for this offer. Try reloading the page or restarting your browser if the issue persists. ", errorCode:165});
    } else {
      try {
        let n = [];
        for (let p = 0; p < c.length; p++) {
          const r = c[p], q = e[p], t = (new RegExp(`<div[^>]*\\bdata-asin="${r}"[^>]*?(?=.*\\bdata-price="([^"]+)")(?=.*\\bdata-quantity="([^"]+)")(?=.*\\bdata-itemid="([^"]+)")[^]{10,2300}smid=${q}`, "i")).exec(k);
          if (t) {
            const w = t[1];
            let v = t[2];
            const u = t[3];
            "undefined" == typeof settings.extensionCookies[a.domainId].cartCache && (settings.extensionCookies[a.domainId].cartCache = []);
            settings.extensionCookies[a.domainId].cartCache[u] && (v = settings.extensionCookies[a.domainId].cartCache[u]);
            let x = {asin:r, sellerId:q, dataItemId:u, stock:v, orderLimit:-1, limit:!1, price:w, location:null};
            settings.extensionCookies[a.domainId].cartCache[u] = v;
            n.push(x);
          } else {
            n.push({asin:r, sellerId:q, errorCode:535, error:"Offer not found"});
          }
        }
        chrome.storage.local.set({extensionCookies:await compressObject(settings.extensionCookies)});
        b(n);
      } catch (n) {
        a.error = n, console.error("request failed", n), b({error:"An error occurred during stock retrieval", errorCode:505}), common.reportBug(n, "1 stock error - " + JSON.stringify(c));
      }
    }
  }).catch(k => {
    a.error = k;
    console.error("request failed", k);
    b({error:"An error occurred during stock retrieval", errorCode:506});
    //common.reportBug(k, "2 stock error - " + JSON.stringify(c));
  });
}, processStockJob:async(a, d, c, e, b) => {
  Date.now();
  let g = !a.offscreen;
  a.queue = [async() => {
    g ? common.addToCartAssoc(a, d, c, e, b, g) : common.addToCartAjax(a, b, g);
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
        var m = null;
        for (var f = 0; f < common.stockData.csrfBB.length; f++) {
          var k = h.response.text.match(new RegExp(common.stockData.csrfBB[f]));
          if (null != k && k[1]) {
            m = k[1];
            break;
          }
        }
        if (m) {
          a.csrf = m;
          m = null;
          for (f = 0; f < common.stockData.offerIdBB.length; f++) {
            if (k = h.response.text.match(new RegExp(common.stockData.offerIdBB[f])), null != k && k[1]) {
              m = k[1];
              break;
            }
          }
          if (m) {
            a.oid = m;
            a.callback();
            return;
          }
        }
      }
      common.deleteExtensionCookies(a.domainId);
      b({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " mismatch oid.", errorCode:10});
    }).catch(async m => {
      a.error = m;
      common.deleteExtensionCookies(a.domainId);
      b({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " mismatch oid.", errorCode:101});
      console.error("request failed", m);
    });
  }));
  a.callback = () => {
    const h = a.queue.shift();
    h ? h() : b({error:"callback queue empty", errorCode:509});
  };
  if (settings.extensionCookies[a.domainId] && 288E5 > Date.now() - settings.extensionCookies[a.domainId].createDate && 1729806460708 < settings.extensionCookies[a.domainId].createDate) {
    a.cookies = settings.extensionCookies[a.domainId].cookies, a.callback();
  } else {
    var l = common.stockData.zipCodes[a.domainId];
    if (common.stockData.domainId == a.domainId) {
      a.requestType = 3;
      let h = structuredClone(common.stockData.addressChange);
      h.userSession = a.session;
      h.isStock = !0;
      h.domainId = a.domainId;
      h.url = "https://" + a.host + h.url;
      h.csrf = "";
      h.language = common.stockData.languageCode[a.domainId];
      h.fetch.body = h.fetch.body.replace("{ZIPCODE}", l);
      requestQueue.enqueue(() => processRequest(h)).then(() => {
        a.cookies = h.response.cookies;
        a.callback();
      }).catch(m => {
        a.error = m;
        b({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " main.", errorCode:73});
        console.error("request failed", m);
      });
    } else {
      let h = structuredClone(common.stockData.geo);
      h.userSession = a.session;
      h.isStock = !0;
      h.url = "https://" + a.host + h.url;
      h.language = common.stockData.languageCode[a.domainId];
      h.domainId = a.domainId;
      requestQueue.enqueue(() => processRequest(h)).then(async() => {
        let m = h.response.text;
        var f = m?.match(new RegExp(common.stockData.csrfGeo));
        null != f && (h.csrf = f[1]);
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
            m = k.response.text;
            let p = m?.match(new RegExp(common.stockData.csrfSetAddress));
            null != p && (n.csrf = p[1]);
            n.cookies = k.response.cookies;
            n.fetch.body = n.fetch.body.replace("{ZIPCODE}", l);
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
          if (429 == h.response.status) {
            const k = a.isMainRetry;
            setTimeout(() => {
              k ? b({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " main.", errorCode:429}) : (a.isMainRetry = !0, (g ? common.addStockJob : common.addStockJobSequential)(a, b));
            }, 1156);
            k || (f = g ? common.stockJobQueue : common.stockJobQueueSingle, f.shift(), 0 < f.length && common.processStockJob(f[0][0], null, null, null, f[0][1]));
          } else {
            common.deleteExtensionCookies(a.domainId), b({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " main.", errorCode:7});
          }
        }
      }).catch(async m => {
        a.error = m;
        console.error("request failed " + a.url, m);
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
  console.error(a, d);
  const e = a ? a : Error();
  common.storage.get(["token"], function(b) {
    var g = Date.now();
    if (!(12E5 > g - common.lastBugReport || /(dead object)|(Script error)|(setUninstallURL)|(File error: Corrupted)|(operation is insecure)|(\.location is null)/i.test(a))) {
      common.lastBugReport = g;
      g = "";
      var l = common.version;
      d = d || "";
      try {
        if (g = e.stack.split("\n").splice(1).join("&ensp;&lArr;&ensp;"), !/(keepa|content)\.js/.test(g) || g.startsWith("https://www.amazon") || g.startsWith("https://smile.amazon") || g.startsWith("https://sellercentral")) {
          return;
        }
      } catch (m) {
      }
      try {
        g = g.replace(RegExp("chrome-extension://.*?/content/", "g"), "").replace(/:[0-9]*?\)/g, ")").replace(/[ ]{2,}/g, "");
      } catch (m) {
      }
      if ("object" == typeof a) {
        try {
          a = a instanceof Error ? a.toString() : JSON.stringify(a);
        } catch (m) {
        }
      }
      null == c && (c = {exception:a, additional:d, url:chrome.runtime.id, stack:g});
      c.keepaType = type;
      c.version = l;
      var h = JSON.stringify(c);
      setTimeout(function() {
        fetch("https://dyn.keepa.com/service/bugreport/?user=" + b.token + "&type=" + browserType + "&version=" + l + "&delayed=" + (delayedFetch ? 1 : 0) + "&timeout=" + sellerLockoutDuration, {method:"POST", body:h, mode:"cors", cache:"no-cache", credentials:"same-origin", redirect:"error"});
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
              var g = null;
              b instanceof ArrayBuffer && (b = await decompress(b, !0));
              try {
                g = JSON.parse(b);
              } catch (l) {
                //common.reportBug(l, b);
                return;
              } finally {
                b = b = null;
              }
              lastActivity = Date.now();
              108 != g.status && ("" == g.key ? common.stockData.domainId = g.domainId : 108108 == g.timeout ? (g.stockDataV3 && (common.stockData = g.stockDataV3, common.stockData.cookieOrder && (cookieOrder = common.stockData.cookieOrder), g.stockDataV3.amazonIds && (AmazonSellerIds = g.stockDataV3.amazonIds), g.stockDataV3.warehouseIds && (WarehouseDealsSellerIds = g.stockDataV3.warehouseIds), common.stockData.sellerLockoutDuration && (sellerLockoutDuration = common.stockData.sellerLockoutDuration), 
              common.stockData.delayedFetch && (delayedFetch = common.stockData.delayedFetch), common.stockData.ignoreWebRequest && (hasWebRequestPermission = !1), hasWebRequestPermission && chrome.webRequest?.onHeadersReceived.addListener(l => {
                if (l.initiator == serviceWorkerUrl) {
                  var h = l.responseHeaders, m = l.url, f = [];
                  for (let k = 0; k < h.length; ++k) {
                    "set-cookie" == h[k].name.toLowerCase() && f.push(parseSetCookieString(h[k].value));
                  }
                  try {
                    interceptedExtensionCookies[m].resolve({cookies:f, request:l});
                  } catch (k) {
                    -1 < m.indexOf("/gp/cart/view") && interceptedExtensionCookies[m.replaceAll("/gp/cart/view.html", "/associates/addtocart")]?.resolve({cookies:f, request:l});
                  }
                }
              }, {urls:["<all_urls>"]}, ["responseHeaders", "extraHeaders"]), common.stockData.stockDelay && (stockDelay = common.stockData.stockDelay)), "undefined" != typeof g.keepaBoxPlaceholder && common.set("keepaBoxPlaceholder", g.keepaBoxPlaceholder), "undefined" != typeof g.keepaBoxPlaceholderBackup && common.set("keepaBoxPlaceholderBackup", g.keepaBoxPlaceholderBackup), "undefined" != typeof g.keepaBoxPlaceholderBackupClass && common.set("keepaBoxPlaceholderBackupClass", g.keepaBoxPlaceholderBackupClass), 
              "undefined" != typeof g.keepaBoxPlaceholderAppend && common.set("keepaBoxPlaceholderAppend", g.keepaBoxPlaceholderAppend), "undefined" != typeof g.keepaBoxPlaceholderBackupAppend && common.set("keepaBoxPlaceholderBackupAppend", g.keepaBoxPlaceholderBackupAppend)) : (g.domainId && (webSocketObj.lastDomain = g.domainId), cloud.onMessage(g)));
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
  function a(f, k) {
    if (null != f) {
      f.sent = !0;
      f = {key:f.key, messageId:f.messageId, sessionId:b(settings.extensionCookies[f.domainId]?.cookies), payload:[], status:200};
      for (let n in k) {
        f[n] = k[n];
      }
      return f;
    }
  }
  async function d(f) {
    if (-1 == f.url.indexOf("keepa.com/")) {
      f.request.cookies = settings.extensionCookies[f.domainId]?.cookies;
      try {
        f.request.userSession = "guest";
      } catch (k) {
      }
    }
    e(f, function(k) {
      let n = {payload:[]};
      if (k) {
        if (k.match(m)) {
          n.status = 403;
        } else {
          if (f.contentFilters && 0 < f.contentFilters.length) {
            for (let p in f.contentFilters) {
              let r = k.match(new RegExp(f.contentFilters[p]));
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
      "undefined" == typeof f.sent && webSocketObj.sendMessage(a(f, n));
    });
  }
  async function c(f) {
    f.request.cookies = settings.extensionCookies[f.domainId]?.cookies;
    f.request.userSession = "guest";
    e(f, function(k) {
      null == k && "undefined" == typeof f.sent && webSocketObj.sendMessage(a(f, {payload:[], redirectUrl:f.request?.response?.redirectUrl, status:305}));
    });
  }
  function e(f, k) {
    1 == f.httpMethod && f.scrapeFilters && 0 < f.scrapeFilters.length && (h = {scrapeFilters:f.scrapeFilters, dbg1:f.dbg1, dbg2:f.dbg2, domainId:f.domainId});
    f.request.domainId = f.domainId;
    requestQueue.enqueue(() => processRequest(f.request)).then(async() => {
      try {
        "object" === typeof f.request.urls && (f.request.response.text = "", f.request.urls.forEach(p => {
          p = f.request.responses[p];
          200 == p.status ? null != p.text && 10 < p.text.length && (f.request.response.text += p.text) : l(p.status, null, f);
        }));
      } catch (p) {
        console.error(p);
      }
      let n = f?.request?.response?.text;
      if (offscreenSupported && null != n && "" != n) {
        if ("o0" == f.key) {
          k(n);
        } else {
          n = n.replace(/src=".*?"/g, 'src=""');
          f.block && (n = n.replace(new RegExp(f.block, "g"), ""));
          try {
            await setupOffscreenDocument(), chrome.runtime.sendMessage({type:"parse", target:"offscreen", data:{content:n, message:f, stockData:common.stockData}}, p => {
              p = p.response;
              p = a(f, p);
              webSocketObj.sendMessage(p);
              chrome.offscreen.closeDocument();
            });
          } catch (p) {
            //common.reportBug(p), f.request.isStock ? k(null) : l(410, null, f);
          }
        }
      } else {
        k(null);
      }
    }).catch(n => {
      console.error("request failed", n);
      f.request.error = n;
      f.request.isStock ? k(null) : l(410, null, f);
    });
  }
  function b(f) {
    try {
      if (f) {
        for (let k = 0; k < f.length; ++k) {
          let n = f[k];
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
  async function g(f) {
    delete settings.extensionCookies["" + f];
    await chrome.storage.local.set({extensionCookies:await compressObject(settings.extensionCookies)});
    delete common.addToCartAssocCsrfs[f];
  }
  function l(f, k, n) {
    if (null != n) {
      try {
        if ("undefined" != typeof n.sent) {
          return;
        }
        const p = a(n, {});
        k && (p.payload = k);
        p.status = f;
        webSocketObj.sendMessage(p);
        chrome.offscreen.closeDocument();
      } catch (p) {
        //common.reportBug(p, "abort");
      }
    }
    clearLog && console.clear();
  }
  let h = null;
  const m = /automated access|api-services-support@/;
  return {onMessage:function(f) {
    switch(f.key) {
      case "update":
        chrome.runtime.requestUpdateCheck(function(k, n) {
          "update_available" == k && chrome.runtime.reload();
        });
        break;
      case "o0":
        d(f);
        break;
      case "o1":
        c(f);
        break;
      case "o2":
        g(f.domainId);
        break;
      case "1":
        chrome.runtime.reload();
    }
  }, endSession:g, getSessionId:b, getOutgoingMessage:a, getFilters:function() {
    return h;
  }, abortJob:l};
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

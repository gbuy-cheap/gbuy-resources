let onlyOnceLogStock = !0;
const scanner = function() {
  function X(F, w) {
    const A = {};
    if (null == document.body) {
      A.status = 599;
    } else {
      if (document.body.textContent.match("you're not a robot")) {
        A.status = 403;
      } else {
        for (var O = document.evaluate("//comment()", document, null, XPathResult.ANY_TYPE, null), N = O.iterateNext(), K = ""; N;) {
          K += N, N = O.iterateNext();
        }
        if (K.match(/automated access|api-services-support@/)) {
          A.status = 403;
        } else {
          if (K.match(/ref=cs_503_link/)) {
            A.status = 503;
          } else {
            if (F.scrapeFilters && 0 < F.scrapeFilters.length) {
              O = {};
              N = null;
              let H = "", f = null;
              const I = {};
              K = {};
              let Y = !1;
              const R = function(b, d, g) {
                var e = [];
                if (!b.selectors || 0 == b.selectors.length) {
                  if (!b.regExp) {
                    return H = "invalid selector, sel/regexp", !1;
                  }
                  e = document.getElementsByTagName("html")[0].innerHTML.match(new RegExp(b.regExp, "i"));
                  if (!e || e.length < b.reGroup) {
                    g = "regexp fail: html - " + b.name + g;
                    if (!1 === b.optional) {
                      return H = g, !1;
                    }
                    f += " // " + g;
                    return !0;
                  }
                  return e[b.reGroup];
                }
                let c = [];
                b.selectors.find(l => {
                  l = d.querySelectorAll(l);
                  return 0 < l.length ? (c = l, !0) : !1;
                });
                if (0 === c.length) {
                  if (!0 === b.optional) {
                    return !0;
                  }
                  H = "selector no match: " + b.name + g;
                  return !1;
                }
                if (b.parentSelector && (c = [c[0].parentNode.querySelector(b.parentSelector)], null == c[0])) {
                  if (!0 === b.optional) {
                    return !0;
                  }
                  H = "parent selector no match: " + b.name + g;
                  return !1;
                }
                if ("undefined" != typeof b.multiple && null != b.multiple && (!0 === b.multiple && 1 > c.length || !1 === b.multiple && 1 < c.length)) {
                  if (!Y) {
                    return Y = !0, R(b, d, g);
                  }
                  g = "selector multiple mismatch: " + b.name + g + " found: " + c.length;
                  if (!1 === b.optional) {
                    b = "";
                    for (var h in c) {
                      !c.hasOwnProperty(h) || 1000 < b.length || (b += " - " + h + ": " + c[h].outerHTML + " " + c[h].getAttribute("class") + " " + c[h].getAttribute("id"));
                    }
                    H = g + b + " el: " + d.getAttribute("class") + " " + d.getAttribute("id");
                    return !1;
                  }
                  f += " // " + g;
                  return !0;
                }
                if (b.isListSelector) {
                  return I[b.name] = c, !0;
                }
                if (!b.attribute) {
                  return H = "selector attribute undefined?: " + b.name + g, !1;
                }
                for (let l in c) {
                  if (c.hasOwnProperty(l)) {
                    var k = c[l];
                    if (!k) {
                      break;
                    }
                    if (b.childNode) {
                      b.childNode = Number(b.childNode);
                      h = k.childNodes;
                      if (h.length < b.childNode) {
                        g = "childNodes fail: " + h.length + " - " + b.name + g;
                        if (!1 === b.optional) {
                          return H = g, !1;
                        }
                        f += " // " + g;
                        return !0;
                      }
                      k = h[b.childNode];
                    }
                    h = null;
                    h = "text" == b.attribute ? k.textContent : "html" == b.attribute ? k.innerHTML : k.getAttribute(b.attribute);
                    if (!h || 0 == h.length || 0 == h.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/g, "").length) {
                      g = "selector attribute null: " + b.name + g;
                      if (!1 === b.optional) {
                        return H = g, !1;
                      }
                      f += " // " + g;
                      return !0;
                    }
                    if (b.regExp) {
                      k = h.match(new RegExp(b.regExp, "i"));
                      if (!k || k.length < b.reGroup) {
                        g = "regexp fail: " + h + " - " + b.name + g;
                        if (!1 === b.optional) {
                          return H = g, !1;
                        }
                        f += " // " + g;
                        return !0;
                      }
                      e.push(k[b.reGroup]);
                    } else {
                      e.push(h);
                    }
                    if (!b.multiple) {
                      break;
                    }
                  }
                }
                b.multiple || (e = e[0]);
                return e;
              };
              let D = document, a = !1;
              for (let b in F.scrapeFilters) {
                if (a) {
                  break;
                }
                let d = F.scrapeFilters[b], g = d.pageVersionTest;
                var q = [], t = !1;
                for (const e of g.selectors) {
                  if (q = document.querySelectorAll(e), 0 < q.length) {
                    t = !0;
                    break;
                  }
                }
                if (t) {
                  if ("undefined" != typeof g.multiple && null != g.multiple) {
                    if (!0 === g.multiple && 2 > q.length) {
                      continue;
                    }
                    if (!1 === g.multiple && 1 < q.length) {
                      continue;
                    }
                  }
                  if (g.attribute && (t = null, t = "text" == g.attribute ? "" : q[0].getAttribute(g.attribute), null == t)) {
                    continue;
                  }
                  N = b;
                  for (let e in d) {
                    if (a) {
                      break;
                    }
                    q = d[e];
                    if (q.name != g.name) {
                      if (q.parentList) {
                        t = [];
                        if ("undefined" != typeof I[q.parentList]) {
                          t = I[q.parentList];
                        } else {
                          if (!0 === R(d[q.parentList], D, b)) {
                            t = I[q.parentList];
                          } else {
                            break;
                          }
                        }
                        K[q.parentList] || (K[q.parentList] = []);
                        for (let c in t) {
                          if (a) {
                            break;
                          }
                          if (!t.hasOwnProperty(c)) {
                            continue;
                          }
                          let h = R(q, t[c], b);
                          if (!1 === h) {
                            a = !0;
                            break;
                          }
                          if (!0 !== h) {
                            if (K[q.parentList][c] || (K[q.parentList][c] = {}), q.multiple) {
                              for (let k in h) {
                                h.hasOwnProperty(k) && !q.keepBR && (h[k] = h[k].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                              }
                              h = h.join("\u271c\u271c");
                              K[q.parentList][c][q.name] = h;
                            } else {
                              K[q.parentList][c][q.name] = q.keepBR ? h : h.replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " ");
                            }
                          }
                        }
                      } else {
                        t = R(q, D, b);
                        if (!1 === t) {
                          a = !0;
                          break;
                        }
                        if (!0 !== t) {
                          if (q.multiple) {
                            for (let c in t) {
                              t.hasOwnProperty(c) && !q.keepBR && (t[c] = t[c].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                            }
                            t = t.join();
                          } else {
                            q.keepBR || (t = t.replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                          }
                          O[q.name] = t;
                        }
                      }
                    }
                  }
                  a = !0;
                }
              }
              if (null == N) {
                H += " // no pageVersion matched", A.status = 308, A.payload = [f, H, F.dbg1 ? document.getElementsByTagName("html")[0].innerHTML : ""];
              } else {
                if ("" === H) {
                  A.payload = [f];
                  A.scrapedData = O;
                  for (let b in K) {
                    A[b] = K[b];
                  }
                } else {
                  A.status = 305, A.payload = [f, H, F.dbg2 ? document.getElementsByTagName("html")[0].innerHTML : ""];
                }
              }
            } else {
              A.status = 306;
            }
          }
        }
      }
    }
    w(A);
  }
  let Z = !0;
  window.self === window.top && (Z = !1);
  window.sandboxHasRun && (Z = !1);
  Z && (window.sandboxHasRun = !0, window.addEventListener("message", function(F) {
    if (F.source == window.parent && F.data && (F.origin == "chrome-extension://" + chrome.runtime.id || F.origin.startsWith("moz-extension://") || F.origin.startsWith("safari-extension://"))) {
      var w = F.data.value;
      "data" == F.data.key && w.url && w.url == document.location && setTimeout(function() {
        null == document.body ? setTimeout(function() {
          X(w, function(A) {
            //window.parent.postMessage({sandbox:A}, "*");
          });
        }, 1500) : X(w, function(A) {
          //window.parent.postMessage({sandbox:A}, "*");
        });
      }, 800);
    }
  }, !1), window.parent.postMessage({sandbox:document.location + "", isUrlMsg:!0}, "*"));
  window.addEventListener("error", function(F, w, A, O, N) {
    "ipbakfmnjdenbmoenhicfmoojdojjjem" != chrome.runtime.id && "blfpbjkajgamcehdbehfdioapoiibdmc" != chrome.runtime.id || console.log(N);
    return !1;
  });
  return {scan:X};
}();
(function() {
  let X = !1, Z = !1;
  const F = window.opera || -1 < navigator.userAgent.indexOf(" OPR/");
  var w = -1 < navigator.userAgent.toLowerCase().indexOf("firefox");
  const A = -1 < navigator.userAgent.toLowerCase().indexOf("edge/"), O = /Apple Computer/.test(navigator.vendor) && /Safari/.test(navigator.userAgent), N = !F && !w && !A & !O, K = w ? "Firefox" : O ? "Safari" : N ? "Chrome" : F ? "Opera" : A ? "Edge" : "Unknown", q = chrome.runtime.getManifest().version;
  let t = !1;
  try {
    t = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
  } catch (a) {
  }
  if (!window.keepaHasRun) {
    window.keepaHasRun = !0;
    var H = 0;
    chrome.runtime.onMessage.addListener((a, b, d) => {
      switch(a.key) {
        case "updateToken":
          f.iframeStorage ? f.iframeStorage.contentWindow.postMessage({origin:"keepaContentScript", key:"updateTokenWebsite", value:a.value}, f.iframeStorage.src) : window.postMessage({origin:"keepaContentScript", key:"updateTokenWebsite", value:a.value}, "*");
      }
    });
    window.addEventListener("message", function(a) {
      if ("undefined" == typeof a.data.sandbox) {
        if ("https://keepa.com" == a.origin || "https://test.keepa.com" == a.origin || "https://dyn.keepa.com" == a.origin) {
          if (a.data.hasOwnProperty("origin") && "keepaIframe" == a.data.origin) {
            f.handleIFrameMessage(a.data.key, a.data.value, function(b) {
              try {
                a.source.postMessage({origin:"keepaContentScript", key:a.data.key, value:b, id:a.data.id}, a.origin);
              } catch (d) {
              }
            });
          } else {
            if ("string" === typeof a.data) {
              const b = a.data.split(",");
              if (2 > b.length) {
                return;
              }
              if (2 < b.length) {
                let d = 2;
                const g = b.length;
                for (; d < g; d++) {
                  b[1] += "," + b[d];
                }
              }
              f.handleIFrameMessage(b[0], b[1], function(d) {
                a.source.postMessage({origin:"keepaContentScript", value:d}, a.origin);
              });
            }
          }
        }
        if (a.origin.match(/^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|jp|ca|fr|es|nl|it|in|com\.mx|com\.br)/)) {
          let b;
          try {
            b = JSON.parse(a.data);
          } catch (d) {
            return;
          }
          (b = b.asin) && /^([BC][A-Z0-9]{9}|\d{9}(!?X|\d))$/.test(b.trim()) && (b != f.ASIN ? (f.ASIN = b, f.swapIFrame()) : 0 != H ? (window.clearTimeout(H), H = 1) : H = window.setTimeout(function() {
            f.swapIFrame();
          }, 1000));
        }
      }
    });
    var f = {domain:0, iframeStorage:null, ASIN:null, tld:"", placeholder:"", cssFlex:function() {
      let a = "flex";
      const b = ["flex", "-webkit-flex", "-moz-box", "-webkit-box", "-ms-flexbox"], d = document.createElement("flexelement");
      for (let g in b) {
        try {
          if ("undefined" != d.style[b[g]]) {
            a = b[g];
            break;
          }
        } catch (e) {
        }
      }
      return a;
    }(), getDomain:function(a) {
      switch(a) {
        case "com":
          return 1;
        case "co.uk":
          return 2;
        case "de":
          return 3;
        case "fr":
          return 4;
        case "co.jp":
          return 5;
        case "jp":
          return 5;
        case "ca":
          return 6;
        case "it":
          return 8;
        case "es":
          return 9;
        case "in":
          return 10;
        case "com.mx":
          return 11;
        case "com.br":
          return 12;
        case "com.au":
          return 13;
        case "nl":
          return 14;
        default:
          return -1;
      }
    }, revealWorking:!1, juvecOnlyOnce:!1, revealMapOnlyOnce:!1, revealCache:{}, revealMAP:function() {
      f.revealMapOnlyOnce || (f.revealMapOnlyOnce = !0, chrome.runtime?.id && chrome.runtime.sendMessage({type:"isPro"}, a => {
        if (null === a.value) {
          console.log("stock data fail");
        } else {
          var b = a.amazonSellerIds, d = a.stockData, g = !0 === a.value, e = c => {
            c = c.trim();
            let h = d.amazonNames[c];
            return h ? "W" === h ? d.warehouseIds[f.domain] : "A" === h ? d.amazonIds[f.domain] : h : (c = c.match(new RegExp(d.sellerId))) && c[1] ? c[1] : null;
          };
          chrome.storage.local.get("revealStock", function(c) {
            "undefined" == typeof c && (c = {});
            let h = !0;
            try {
              h = "0" != c.revealStock;
            } catch (p) {
            }
            onlyOnceLogStock && (onlyOnceLogStock = !1, console.log("Stock " + g + " " + h));
            try {
              if ((h || "com" == f.tld) && !f.revealWorking) {
                if (f.revealWorking = !0, document.getElementById("keepaMAP")) {
                  f.revealWorking = !1;
                } else {
                  var k = function() {
                    const p = new MutationObserver(function(B) {
                      setTimeout(function() {
                        f.revealMAP();
                      }, 100);
                      try {
                        p.disconnect();
                      } catch (r) {
                      }
                    });
                    p.observe(document.getElementById("keepaMAP").parentNode.parentNode.parentNode, {childList:!0, subtree:!0});
                  }, l = (p, B, r, v, C, y, G, L, P, S) => {
                    if ("undefined" == typeof f.revealCache[v] || null == p.parentElement.querySelector(".keepaStock")) {
                      null == L && (L = b[f.domain]);
                      var Q = "" == p.id && "aod-pinned-offer" == p.parentNode.id;
                      y = y || Q;
                      try {
                        r = r || -1 != p.textContent.toLowerCase().indexOf("to cart to see") || !y && /(our price|always remove it|add this item to your cart|see product details in cart|see price in cart)/i.test(document.getElementById("price").textContent);
                      } catch (m) {
                      }
                      if (r || g) {
                        u(p, B, r, v, y);
                        var M = m => {
                          const V = document.getElementById("keepaStock" + v);
                          if (null != V) {
                            V.innerHTML = "";
                            if (null != m && null != m.price && r) {
                              var T = document.createElement("div");
                              m = 5 == f.domain ? m.price : (Number(m.price) / 100).toFixed(2);
                              var W = new Intl.NumberFormat(" en-US en-GB de-DE fr-FR ja-JP en-CA zh-CN it-IT es-ES hi-IN es-MX pt-BR en-AU nl-NL tr-TR".split(" ")[f.domain], {style:"currency", currency:" USD GBP EUR EUR JPY CAD CNY EUR EUR INR MXN BRL AUD EUR TRY".split(" ")[f.domain]});
                              0 < m && (T.innerHTML = 'Price&emsp;&ensp;<span style="font-weight: bold;">' + W.format(m) + "</span>");
                              V.parentNode.parentNode.parentNode.prepend(T);
                            }
                            g && (m = f.revealCache[v].stock, 999 == m ? m = "999+" : 1000 == m ? m = "1000+" : -3 != f.revealCache[v].price && 1 > f.revealCache[v].price && (30 == m || P) && (m += "+"), T = document.createElement("span"), T.style = "font-weight: bold;", T.innerText = m + " ", m = document.createElement("span"), m.style = "color: #dedede;", m.innerText = " (revealed by \u271c Keepa)", W = document.createElement("span"), W.style = "color:#da4c33;", W.innerText = " order limit", V.appendChild(T), 
                            f.revealCache[v].limit && (0 < f.revealCache[v].orderLimit && (W.innerText += ": " + f.revealCache[v].orderLimit), V.appendChild(W)), (T = f.revealCache[v].errorCode) ? (m = document.createElement("span"), m.style = "color: #f7d1d1;", m.innerText = " (e_" + T + ")", null != f.revealCache[v].error && (m.title = f.revealCache[v].error + ". Contact info@keepa.com with a screenshot & URL for assistance."), V.appendChild(m)) : y && V.appendChild(m));
                          }
                        };
                        if ("undefined" != typeof f.revealCache[v] && -1 != f.revealCache[v]) {
                          "pending" != f.revealCache[v] && M(f.revealCache[v]);
                        } else {
                          f.revealCache[v] = "pending";
                          Q = p = "";
                          try {
                            p = document.querySelector("meta[name=encrypted-slate-token]").getAttribute("content"), Q = document.querySelector("#aod-offer-list input#aod-atc-csrf-token").getAttribute("value");
                          } catch (m) {
                          }
                          chrome.runtime?.id && chrome.runtime.sendMessage({type:"getStock", asin:B, oid:v, sellerId:L, maxQty:G, hasPlus:P, isMAP:r, host:document.location.hostname, force:r, referer:document.location + "", domainId:f.domain, cachedStock:f.revealCache[L], offscreen:!1, atcCsrf:Q || S, slateToken:p, session:C}, m => {
                            if ("undefined" == typeof m || null == m || !1 === m?.stock) {
                              if (m = document.getElementById("keepaMAP")) {
                                m.innerHTML = "";
                              }
                            } else {
                              f.revealCache[v] = m, f.revealCache[L] = m, M(m);
                            }
                          });
                        }
                      }
                    }
                  }, u = (p, B, r, v, C) => {
                    B = "" == p.id && "aod-pinned-offer" == p.parentNode.id;
                    var y = (C ? p.parentElement : p).querySelector(".keepaMAP");
                    if (null == (C ? p.parentElement : p).querySelector(".keepaStock")) {
                      null != y && null != y.parentElement && y.parentElement.remove();
                      var G = C ? "165px" : "55px;height:20px;";
                      y = document.createElement("div");
                      y.id = "keepaMAP" + (C ? r + v : "");
                      y.className = "a-section a-spacing-none a-spacing-top-micro aod-clear-float keepaStock";
                      r = document.createElement("div");
                      r.className = "a-fixed-left-grid";
                      var L = document.createElement("div");
                      L.style = "padding-left:" + G;
                      C && (L.className = "a-fixed-left-grid-inner");
                      var P = document.createElement("div");
                      P.style = "width:" + G + ";margin-left:-" + G + ";float:left;";
                      P.className = "a-fixed-left-grid-col aod-padding-right-10 a-col-left";
                      G = document.createElement("div");
                      G.style = "padding-left:0%;float:left;";
                      G.className = "a-fixed-left-grid-col a-col-right";
                      var S = document.createElement("span");
                      S.className = "a-size-small a-color-tertiary";
                      var Q = document.createElement("span");
                      Q.style = "color: #dedede;";
                      Q.innerText = "loading\u2026";
                      var M = document.createElement("span");
                      M.className = "a-size-small a-color-base";
                      M.id = "keepaStock" + v;
                      M.appendChild(Q);
                      G.appendChild(M);
                      P.appendChild(S);
                      L.appendChild(P);
                      L.appendChild(G);
                      r.appendChild(L);
                      y.appendChild(r);
                      S.className = "a-size-small a-color-tertiary";
                      f.revealWorking = !1;
                      g && (S.innerText = "Stock");
                      C ? B ? (p = document.querySelector("#aod-pinned-offer-show-more-link"), 0 == p.length && document.querySelector("#aod-pinned-offer-main-content-show-more"), p.prepend(y)) : p.parentNode.insertBefore(y, p.parentNode.children[p.parentNode.children.length - 1]) : p.appendChild(y);
                      C || k();
                    }
                  }, n = document.location.href, x = new MutationObserver(function(p) {
                    try {
                      let C = document.querySelectorAll("#aod-offer,#aod-pinned-offer");
                      if (null != C && 0 != C.length) {
                        p = null;
                        var B = C[0].querySelector('input[name="session-id"]');
                        if (B) {
                          p = B.getAttribute("value");
                        } else {
                          if (B = document.querySelector("#session-id")) {
                            p = document.querySelector("#session-id").value;
                          }
                        }
                        if (!p) {
                          var r = document.querySelectorAll("script");
                          for (var v of r) {
                            let y = v.text.match("ue_sid.?=.?'([0-9-]{19})'");
                            y && (p = y[1]);
                          }
                        }
                        if (p) {
                          for (let y in C) {
                            if (!C.hasOwnProperty(y)) {
                              continue;
                            }
                            const G = C[y];
                            if (null != G && "DIV" == G.nodeName) {
                              let L;
                              B = 999;
                              let P = G.querySelector('input[name="offeringID.1"]');
                              if (P) {
                                L = P.getAttribute("value");
                              } else {
                                try {
                                  let M = JSON.parse(G.querySelectorAll("[data-aod-atc-action]")[0].dataset.aodAtcAction);
                                  L = M.oid;
                                  B = M.maxQty;
                                } catch (M) {
                                  try {
                                    let m = JSON.parse(G.querySelectorAll("[data-aw-aod-cart-api]")[0].dataset.awAodCartApi);
                                    L = m.oid;
                                    B = m.maxQty;
                                  } catch (m) {
                                  }
                                }
                              }
                              if (!L) {
                                continue;
                              }
                              const S = G.children[0];
                              r = null;
                              if (d) {
                                for (v = 0; v < d.soldByOffers.length; v++) {
                                  let M = G.querySelector(d.soldByOffers[v]);
                                  if (null == M) {
                                    continue;
                                  }
                                  r = e(M.innerText);
                                  if (null != r) {
                                    break;
                                  }
                                  let m = M.getAttribute("href");
                                  null == m && (m = M.innerHTML);
                                  r = e(m);
                                  if (null != r) {
                                    break;
                                  }
                                }
                              }
                              const Q = -1 != G.textContent.toLowerCase().indexOf("add to cart to see product details.");
                              l(S, f.ASIN, Q, L, p, !0, B, r);
                            }
                          }
                        } else {
                          console.error("missing sessionId");
                        }
                      }
                    } catch (C) {
                      console.log(C), f.reportBug(C, "MAP error: " + n);
                    }
                  });
                  x.observe(document.querySelector("body"), {childList:!0, attributes:!1, characterData:!1, subtree:!0, attributeOldValue:!1, characterDataOldValue:!1});
                  window.onunload = function B() {
                    try {
                      window.detachEvent("onunload", B), x.disconnect();
                    } catch (r) {
                    }
                  };
                  var z = document.querySelector(d.soldOfferId);
                  c = null;
                  if (d) {
                    var E = document.querySelector(d.soldByBBForm);
                    E && (c = E.getAttribute("value"));
                    if (null == c) {
                      for (E = 0; E < d.soldByBB.length; E++) {
                        var J = document.querySelector(d.soldByBB[E]);
                        if (null != J && (c = e(J.innerHTML), null != c)) {
                          break;
                        }
                      }
                    }
                  }
                  if (null != z && null != z.value) {
                    var U = z.parentElement.querySelector("#session-id");
                    const B = z.parentElement.querySelector("#ASIN"), r = z.parentElement.querySelector("#selectQuantity #quantity > option:last-child");
                    let v = z.parentElement.querySelector('input[name*="CSRF" i]')?.getAttribute("value");
                    if (null != U && null != B) {
                      for (J = 0; J < d.mainEl.length; J++) {
                        let C = document.querySelector(d.mainEl[J]);
                        if (null != C) {
                          E = J = !1;
                          if (null != r) {
                            try {
                              0 < r.innerText.indexOf("+") && (E = !0), J = Number("" == r.value ? r.innerText.replaceAll("+", "") : r.value);
                            } catch (y) {
                              console.log(y);
                            }
                          }
                          l(C, B.value, !1, z.value, U.value, !1, J, c, E, v);
                          break;
                        }
                      }
                    }
                  }
                  var aa = document.getElementById("price");
                  if (null != aa && /(our price|always remove it|add this item to your cart|see product details in cart|see price in cart)/i.test(aa.textContent)) {
                    let B = document.getElementById("merchant-info");
                    U = z = "";
                    if (B) {
                      if (-1 == B.textContent.toLowerCase().indexOf("amazon.c")) {
                        const r = aa.querySelector('span[data-action="a-modal"]');
                        if (r) {
                          var ba = r.getAttribute("data-a-modal");
                          ba.match(/offeringID\.1=(.*?)&amp/) && (z = RegExp.$1);
                        }
                        if (0 == z.length) {
                          if (ba.match('map_help_pop_(.*?)"')) {
                            U = RegExp.$1;
                          } else {
                            f.revealWorking = !1;
                            return;
                          }
                        }
                      }
                      if (null != z && 10 < z.length) {
                        const r = document.querySelector("#session-id");
                        l(aa, f.ASIN, !1, z, r.value, !1, !1, U);
                      }
                    } else {
                      f.revealWorking = !1;
                    }
                  } else {
                    f.revealWorking = !1;
                  }
                }
              }
            } catch (p) {
              f.revealWorking = !1, console.log(p);
            }
          });
        }
      }));
    }, onPageLoad:function() {
      f.tld = RegExp.$1;
      const a = RegExp.$3;
      f.ASIN || (f.ASIN = a);
      f.domain = f.getDomain(f.tld);
      chrome.storage.local.get(["s_boxType", "s_boxOfferListing"], function(b) {
        "undefined" == typeof b && (b = {});
        document.addEventListener("DOMContentLoaded", function(d) {
          d = document.getElementsByTagName("head")[0];
          const g = document.createElement("script");
          g.type = "text/javascript";
          g.src = chrome.runtime.getURL("selectionHook.js");
          d.appendChild(g);
          "0" == b.s_boxType ? f.swapIFrame() : f.getPlaceholderAndInsertIFrame((e, c) => {
            if (void 0 !== e) {
              c = document.createElement("div");
              c.setAttribute("id", "keepaButton");
              c.setAttribute("style", "    background-color: #444;\n    border: 0 solid #ccc;\n    border-radius: 6px 6px 6px 6px;\n    color: #fff;\n    cursor: pointer;\n    font-size: 12px;\n    margin: 15px;\n    padding: 6px;\n    text-decoration: none;\n    text-shadow: none;\n    display: flex;\n    box-shadow: 0px 0px 7px 0px #888;\n    width: 100px;\n    background-repeat: no-repeat;\n    height: 32px;\n    background-position-x: 7px;\n    background-position-y: 7px;\n    text-align: center;\n    background-image: url(https://cdn.keepa.com/img/logo_circled_w.svg);\n    background-size: 80px;");
              var h = document.createElement("style");
              h.appendChild(document.createTextNode("#keepaButton:hover{background-color:#666 !important}"));
              document.head.appendChild(h);
              c.addEventListener("click", function() {
                const k = document.getElementById("keepaButton");
                k.parentNode.removeChild(k);
                f.swapIFrame();
              }, !1);
              e.parentNode.insertBefore(c, e);
            }
          });
        }, !1);
      });
    }, swapIFrame:function() {
      if ("com.au" == f.tld) {
        try {
          f.revealMAP(document, f.ASIN, f.tld), f.revealMapOnlyOnce = !1;
        } catch (b) {
        }
      } else {
        if (!document.getElementById("keepaButton")) {
          f.swapIFrame.swapTimer && clearTimeout(f.swapIFrame.swapTimer);
          f.swapIFrame.swapTimer = setTimeout(function() {
            if (!t) {
              document.getElementById("keepaContainer") || f.getPlaceholderAndInsertIFrame(f.insertIFrame);
              try {
                f.revealMAP(document, f.ASIN, f.tld), f.revealMapOnlyOnce = !1;
              } catch (b) {
              }
              f.swapIFrame.swapTimer = setTimeout(function() {
                document.getElementById("keepaContainer") || f.getPlaceholderAndInsertIFrame(f.insertIFrame);
              }, 2000);
            }
          }, 2000);
          var a = document.getElementById("keepaContainer");
          if (null != f.iframeStorage && a) {
            try {
              f.iframeStorage.contentWindow.postMessage({origin:"keepaContentScript", key:"updateASIN", value:{d:f.domain, a:f.ASIN, eType:K, eVersion:q, url:document.location.href}}, "*");
            } catch (b) {
              console.error(b);
            }
          } else {
            f.getPlaceholderAndInsertIFrame(f.insertIFrame);
            try {
              f.revealMAP(document, f.ASIN, f.tld), f.revealMapOnlyOnce = !1;
            } catch (b) {
            }
          }
        }
      }
    }, getDevicePixelRatio:function() {
      let a = 1;
      void 0 !== window.screen.systemXDPI && void 0 !== window.screen.logicalXDPI && window.screen.systemXDPI > window.screen.logicalXDPI ? a = window.screen.systemXDPI / window.screen.logicalXDPI : void 0 !== window.devicePixelRatio && (a = window.devicePixelRatio);
      return a;
    }, getPlaceholderAndInsertIFrame:function(a) {
      chrome.storage.local.get("keepaBoxPlaceholder keepaBoxPlaceholderBackup keepaBoxPlaceholderBackupClass keepaBoxPlaceholderAppend keepaBoxPlaceholderBackupAppend webGraphType webGraphRange".split(" "), function(b) {
        "undefined" == typeof b && (b = {});
        let d = 0;
        const g = function() {
          if (!document.getElementById("keepaButton") && !document.getElementById("amazonlive-homepage-widget")) {
            var e = document.getElementById("gpdp-btf-container");
            if (e && e.previousElementSibling) {
              f.insertIFrame(e.previousElementSibling, !1, !0);
            } else {
              if ((e = document.getElementsByClassName("mocaGlamorContainer")[0]) || (e = document.getElementById("dv-sims")), e ||= document.getElementById("mas-terms-of-use"), e && e.nextSibling) {
                f.insertIFrame(e.nextSibling, !1, !0);
              } else {
                var c = b.keepaBoxPlaceholder || "#bottomRow";
                e = !1;
                if (c = document.querySelector(c)) {
                  "sims_fbt" == c.previousElementSibling.id && (c = c.previousElementSibling, "bucketDivider" == c.previousElementSibling.className && (c = c.previousElementSibling), e = !0), 1 == b.keepaBoxPlaceholderAppend && (c = c.nextSibling), a(c, e);
                } else {
                  if (c = b.keepaBoxPlaceholderBackup || "#elevatorBottom", "ATFCriticalFeaturesDataContainer" == c && (c = "#ATFCriticalFeaturesDataContainer"), c = document.querySelector(c)) {
                    1 == b.keepaBoxPlaceholderBackupAppend && (c = c.nextSibling), a(c, !0);
                  } else {
                    if (c = document.getElementById("hover-zoom-end")) {
                      a(c, !0);
                    } else {
                      if (t) {
                        if ((c = document.querySelector("#ATFCriticalFeaturesDataContainer,#atc-toast-overlay,#productTitleGroupAnchor")) && c.nextSibling) {
                          a(c.nextSibling, !0);
                          return;
                        }
                        document.querySelector("#tabular_feature_div,#olpLinkWidget_feature_div,#tellAFriendBox_feature_div");
                        if (c && c.nextSibling) {
                          a(c.nextSibling, !0);
                          return;
                        }
                      }
                      c = b.keepaBoxPlaceholderBackupClass || ".a-fixed-left-grid";
                      if ((c = document.querySelector(c)) && c.nextSibling) {
                        a(c.nextSibling, !0);
                      } else {
                        e = 0;
                        c = document.getElementsByClassName("twisterMediaMatrix");
                        var h = !!document.getElementById("dm_mp3Player");
                        if ((c = 0 == c.length ? document.getElementById("handleBuy") : c[0]) && 0 == e && !h && null != c.nextElementSibling) {
                          let k = !1;
                          for (h = c; h;) {
                            if (h = h.parentNode, "table" === h.tagName.toLowerCase()) {
                              if ("buyboxrentTable" === h.className || /buyBox/.test(h.className) || "buyingDetailsGrid" === h.className) {
                                k = !0;
                              }
                              break;
                            } else if ("html" === h.tagName.toLowerCase()) {
                              break;
                            }
                          }
                          if (!k) {
                            c = c.nextElementSibling;
                            a(c, !1);
                            return;
                          }
                        }
                        c = document.getElementsByClassName("bucketDivider");
                        0 == c.length && (c = document.getElementsByClassName("a-divider-normal"));
                        if (!c[e]) {
                          if (!c[0]) {
                            40 > d++ && window.setTimeout(function() {
                              g();
                            }, 100);
                            return;
                          }
                          e = 0;
                        }
                        for (h = c[e]; h && c[e];) {
                          if (h = h.parentNode, "table" === h.tagName.toLowerCase()) {
                            if ("buyboxrentTable" === h.className || /buyBox/.test(h.className) || "buyingDetailsGrid" === h.className) {
                              h = c[++e];
                            } else {
                              break;
                            }
                          } else if ("html" === h.tagName.toLowerCase()) {
                            break;
                          }
                        }
                        f.placeholder = c[e];
                        c[e] && c[e].parentNode && (e = document.getElementsByClassName("lpo")[0] && c[1] && 0 == e ? c[1] : c[e], a(e, !1));
                      }
                    }
                  }
                }
              }
            }
          }
        };
        g();
      });
    }, getAFComment:function(a) {
      for (a = [a]; 0 < a.length;) {
        const b = a.pop();
        for (let d = 0; d < b.childNodes.length; d++) {
          const g = b.childNodes[d];
          if (8 === g.nodeType && -1 < g.textContent.indexOf("MarkAF")) {
            return g;
          }
          a.push(g);
        }
      }
      return null;
    }, insertIFrame:function(a, b) {
      if (null != f.iframeStorage && document.getElementById("keepaContainer")) {
        f.swapIFrame();
      } else {
        var d = document.getElementById("hover-zoom-end"), g = function(e) {
          var c = document.getElementById(e);
          const h = [];
          for (; c;) {
            h.push(c), c.id = "a-different-id", c = document.getElementById(e);
          }
          for (c = 0; c < h.length; ++c) {
            h[c].id = e;
          }
          return h;
        }("hover-zoom-end");
        chrome.storage.local.get("s_boxHorizontal", function(e) {
          "undefined" == typeof e && (e = {});
          if (null == a) {
            setTimeout(() => {
              f.getPlaceholderAndInsertIFrame(f.insertIFrame);
            }, 3000);
          } else {
            var c = e.s_boxHorizontal, h = window.innerWidth - 50;
            if (!document.getElementById("keepaContainer")) {
              e = document.createElement("div");
              "0" == c ? (h -= 550, 960 > h && (h = 960), e.setAttribute("style", "min-width: 935px; max-width:" + h + "px;display: flex;  height: 500px; border:0 none; margin: 10px 0 0;")) : e.setAttribute("style", "min-width: 935px; width: calc(100% - 30px); height: 500px; display: flex; border:0 none; margin: 10px 0 0;");
              t && (c = (window.innerWidth - 1 * parseFloat(getComputedStyle(document.documentElement).fontSize)) / 935, e.setAttribute("style", "width: 935px;height: " + Math.max(300, 500 * c) + "px;display: flex;border:0 none;transform-origin: 0 0;transform:scale(" + c + ");margin: 10px -1rem 0 -1rem;"));
              e.setAttribute("id", "keepaContainer");
              var k = document.createElement("iframe");
              c = document.createElement("div");
              c.setAttribute("id", "keepaClear");
              k.setAttribute("style", "width: 100%; height: 100%; border:0 none;overflow: hidden;");
              k.setAttribute("src", "https://keepa.com/keepaBox.html");
              k.setAttribute("scrolling", "no");
              k.setAttribute("id", "keepa");
              Z ||= !0;
              e.appendChild(k);
              h = !1;
              if (!b) {
                null == a.parentNode || "promotions_feature_div" !== a.parentNode.id && "dp-out-of-stock-top_feature_div" !== a.parentNode.id || (a = a.parentNode);
                try {
                  var l = a.previousSibling.previousSibling;
                  null != l && "technicalSpecifications_feature_div" == l.id && (a = l);
                } catch (U) {
                }
                0 < g.length && (d = g[g.length - 1]) && "centerCol" != d.parentElement.id && ((l = f.getFirstInDOM([a, d], document.body)) && 600 < l.parentElement.offsetWidth && (a = l), a === d && (h = !0));
                (l = document.getElementById("title") || document.getElementById("title_row")) && f.getFirstInDOM([a, l], document.body) !== l && (a = l);
              }
              l = document.getElementById("vellumMsg");
              null != l && (a = l);
              l = document.body;
              var u = document.documentElement;
              u = Math.max(l.scrollHeight, l.offsetHeight, u.clientHeight, u.scrollHeight, u.offsetHeight);
              var n = a.offsetTop / u;
              if (0.5 < n || 0 > n) {
                l = f.getAFComment(l), null != l && (n = a.offsetTop / u, 0.5 > n && (a = l));
              }
              if (a.parentNode) {
                l = document.querySelector(".container_vertical_middle");
                "burjPageDivider" == a.id ? (a.parentNode.insertBefore(e, a), b || a.parentNode.insertBefore(c, e.nextSibling)) : "bottomRow" == a.id ? (a.parentNode.insertBefore(e, a), b || a.parentNode.insertBefore(c, e.nextSibling)) : h ? (a.parentNode.insertBefore(e, a.nextSibling), b || a.parentNode.insertBefore(c, e.nextSibling)) : null != l ? (a = l, a.parentNode.insertBefore(e, a.nextSibling), b || a.parentNode.insertBefore(c, e.nextSibling)) : (a.parentNode.insertBefore(e, a), b || a.parentNode.insertBefore(c, 
                e));
                f.iframeStorage = k;
                e.style.display = f.cssFlex;
                var x = !1, z = 5;
                if (!t) {
                  var E = setInterval(function() {
                    if (0 >= z--) {
                      clearInterval(E);
                    } else {
                      var U = null != document.getElementById("keepa");
                      try {
                        if (!U) {
                          throw f.getPlaceholderAndInsertIFrame(f.insertIFrame), 1;
                        }
                        if (x) {
                          throw 1;
                        }
                        document.getElementById("keepa").contentDocument.location = iframeUrl;
                      } catch (aa) {
                        clearInterval(E);
                      }
                    }
                  }, 4000), J = function() {
                    x = !0;
                    k.removeEventListener("load", J, !1);
                    f.synchronizeIFrame();
                  };
                  k.addEventListener("load", J, !1);
                }
              } else {
                f.swapIFrame();
              }
            }
          }
        });
      }
    }, handleIFrameMessage:function(a, b, d) {
      switch(a) {
        case "resize":
          X ||= !0;
          a = b;
          b = "" + b;
          -1 == b.indexOf("px") && (b += "px");
          let g = document.getElementById("keepaContainer");
          g && (g.style.height = b, t && (g.style.marginBottom = -(a * (1 - window.innerWidth / 935)) + "px"));
          break;
        case "ping":
          d({location:chrome.runtime.id + " " + document.location});
          break;
        case "openPage":
          chrome.runtime?.id && chrome.runtime.sendMessage({type:"openPage", url:b});
          break;
        case "getToken":
          let e = {d:f.domain, a:f.ASIN, eType:K, eVersion:q, url:document.location.href};
          chrome.runtime?.id ? f.sendMessageWithRetry({type:"getCookie", key:"token"}, 3, 1000, c => {
            e.token = c?.value;
            e.install = c?.install;
            d(e);
          }, c => {
            console.log("failed token retrieval: ", c);
            d(e);
          }) : d(e);
          break;
        case "setCookie":
          chrome.runtime?.id && chrome.runtime.sendMessage({type:"setCookie", key:b.key, val:b.val});
      }
    }, sendMessageWithRetry:function(a, b, d, g, e) {
      let c = 0, h = !1;
      const k = () => {
        c += 1;
        chrome.runtime.sendMessage(a, l => {
          h || (h = !0, g(l));
        });
        setTimeout(() => {
          h || (c < b ? setTimeout(k, d) : (console.log("Failed to receive a response after maximum retries."), e()));
        }, d);
      };
      k();
    }, synchronizeIFrame:function() {
      let a = 0;
      chrome.storage.local.get("s_boxHorizontal", function(g) {
        "undefined" != typeof g && "undefined" != typeof g.s_boxHorizontal && (a = g.s_boxHorizontal);
      });
      let b = window.innerWidth, d = !1;
      t || window.addEventListener("resize", function() {
        d || (d = !0, window.setTimeout(function() {
          if (b != window.innerWidth && "0" == a) {
            b = window.innerWidth;
            let g = window.innerWidth - 50;
            g -= 550;
            935 > g && (g = 935);
            document.getElementById("keepaContainer").style.width = g;
          }
          d = !1;
        }, 100));
      }, !1);
    }, getFirstInDOM:function(a, b) {
      let d;
      for (b = b.firstChild; b; b = b.nextSibling) {
        if ("IFRAME" !== b.nodeName && 1 === b.nodeType) {
          if (-1 !== a.indexOf(b)) {
            return b;
          }
          if (d = f.getFirstInDOM(a, b)) {
            return d;
          }
        }
      }
      return null;
    }, getClipRect:function(a) {
      "string" === typeof a && (a = document.querySelector(a));
      let b = 0, d = 0;
      const g = function(e) {
        b += e.offsetLeft;
        d += e.offsetTop;
        e.offsetParent && g(e.offsetParent);
      };
      g(a);
      return 0 == d && 0 == b ? f.getClipRect(a.parentNode) : {top:d, left:b, width:a.offsetWidth, height:a.offsetHeight};
    }, findPlaceholderBelowImages:function(a) {
      const b = a;
      let d, g = 100;
      do {
        for (g--, d = null; !d;) {
          d = a.nextElementSibling, d || (d = a.parentNode.nextElementSibling), a = d ? d : a.parentNode.parentNode, !d || "IFRAME" !== d.nodeName && "SCRIPT" !== d.nodeName && 1 === d.nodeType || (d = null);
        }
      } while (0 < g && 100 < f.getClipRect(d).left);
      return d ? d : b;
    }, httpGet:function(a, b) {
      const d = new XMLHttpRequest();
      b && (d.onreadystatechange = function() {
        4 == d.readyState && b.call(this, d.responseText);
      });
      d.open("GET", a, !0);
      d.send();
    }, httpPost2:function(a, b, d, g, e) {
      const c = new XMLHttpRequest();
      g && (c.onreadystatechange = function() {
        4 == c.readyState && g.call(this, c.responseText);
      });
      c.withCredentials = e;
      c.open("POST", a, !0);
      c.setRequestHeader("Content-Type", d);
      c.send(b);
    }, httpPost:function(a, b, d, g) {
      f.httpPost2(a, b, "text/plain;charset=UTF-8", d, g);
    }, lastBugReport:0, reportBug:function(a, b, d) {
      return
      var g = Date.now();
      if (!(6E5 > g - f.lastBugReport || /(dead object)|(Script error)|(\.location is null)/i.test(a))) {
        f.lastBugReport = g;
        g = "";
        try {
          g = Error().stack.split("\n").splice(1).splice(1).join("&ensp;&lArr;&ensp;");
          if (!/(keepa|content)\.js/.test(g)) {
            return;
          }
          g = g.replace(RegExp("chrome-extension://.*?/content/", "g"), "").replace(/:[0-9]*?\)/g, ")").replace(/[ ]{2,}/g, "");
        } catch (e) {
        }
        if ("object" == typeof a) {
          try {
            a = a instanceof Error ? a.toString() : JSON.stringify(a);
          } catch (e) {
          }
        }
        null == d && (d = {exception:a, additional:b, url:document.location.host, stack:g});
        null != d.url && d.url.startsWith("blob:") || (d.keepaType = N ? "keepaChrome" : F ? "keepaOpera" : O ? "keepaSafari" : A ? "keepaEdge" : "keepaFirefox", d.version = q, chrome.storage.local.get("token", function(e) {
          "undefined" == typeof e && (e = {token:"undefined"});
          f.httpPost("https://dyn.keepa.com/service/bugreport/?user=" + e.token + "&type=" + K, JSON.stringify(d));
        }));
      }
    }};
    window.onerror = function(a, b, d, g, e) {
      let c;
      "string" !== typeof a && (e = a.error, c = a.filename || a.fileName, d = a.lineno || a.lineNumber, g = a.colno || a.columnNumber, a = a.message || a.name || e.message || e.name);
      a = a.toString();
      let h = "";
      g = g || 0;
      if (e && e.stack) {
        h = e.stack;
        try {
          h = e.stack.split("\n").splice(1).splice(1).join("&ensp;&lArr;&ensp;");
          if (!/(keepa|content)\.js/.test(h)) {
            return;
          }
          h = h.replace(RegExp("chrome-extension://.*?/content/", "g"), "").replace(/:[0-9]*?\)/g, ")").replace(/[ ]{2,}/g, "");
        } catch (k) {
        }
      }
      "undefined" === typeof d && (d = 0);
      "undefined" === typeof g && (g = 0);
      a = {msg:a, url:(b || c || document.location.toString()) + ":" + d + ":" + g, stack:h};
      "ipbakfmnjdenbmoenhicfmoojdojjjem" != chrome.runtime.id && "blfpbjkajgamcehdbehfdioapoiibdmc" != chrome.runtime.id || console.log(a);
      //f.reportBug(null, null, a);
      return !1;
    };
    if (window.self == window.top && !(/.*music\.amazon\..*/.test(document.location.href) || /.*primenow\.amazon\..*/.test(document.location.href) || /.*amazonlive-portal\.amazon\..*/.test(document.location.href) || /.*amazon\.com\/restaurants.*/.test(document.location.href))) {
      w = function(a) {
        chrome.runtime.sendMessage({type:"sendData", val:{key:"m1", payload:[a]}}, function() {
        });
      };
      var I = document.location.href, Y = !1;
      document.addEventListener("DOMContentLoaded", function(a) {
        if (!Y) {
          try {
            if (I.startsWith("https://test.keepa.com") || I.startsWith("https://keepa.com")) {
              let b = document.createElement("div");
              b.id = "extension";
              b.setAttribute("type", K);
              b.setAttribute("version", q);
              document.body.appendChild(b);
              Y = !0;
            }
          } catch (b) {
          }
        }
      });
      var R = !1;
      chrome.runtime.sendMessage({type:"isActive"});
      if (!/((\/images)|(\/review)|(\/customer-reviews)|(ask\/questions)|(\/product-reviews))/.test(I) && !/\/e\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/.test(I) && (I.match(/^https:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|nl|in|com\.mx|com\.br|com\.au)\/[^.]*?(\/|[?&]ASIN=)([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) || I.match(/^https:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|nl|in|com\.mx|com\.br|com\.au)\/(.*?)\/dp\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))\//) || I.match(/^https:\/\/.*?\.amzn\.(com).*?\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/))) {
        f.onPageLoad(!1), R = !0;
      } else if (!I.match(/^https:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|nl|es|in|com\.mx|com\.br|com\.au)\/[^.]*?\/(wishlist|registry)/) && !I.match(/^htt(p|ps):\/\/w*?\.amzn\.(com)[^.]*?\/(wishlist|registry)/)) {
        if (I.match("^https://.*?(?:seller).*?.amazon.(de|com|co.uk|co.jp|ca|fr|it|nl|es|in|com.mx|com.br|com.au)/")) {
          w("s" + f.getDomain(RegExp.$1));
          let a = !1;
          function b() {
            a || (a = !0, chrome.runtime.sendMessage({type:"isSellerActive"}), setTimeout(() => {
              a = !1;
            }, 1000));
          }
          b();
          document.addEventListener("mousemove", b);
          document.addEventListener("keydown", b);
          document.addEventListener("touchstart", b);
        } else {
          I.match(/^https:\/\/.*?(?:af.?ilia|part|assoc).*?\.amazon\.(de|com|co\.uk|co\.jp|nl|ca|fr|it|es|in|com\.mx|com\.br|com\.au)\/home/) && w("a" + f.getDomain(RegExp.$1));
        }
      }
      if (!t) {
        w = /^https:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|nl|in|com\.mx|com\.br|com\.au)\/(s([\/?])|gp\/bestsellers\/|gp\/search\/|.*?\/b\/)/;
        (R || I.match(w)) && document.addEventListener("DOMContentLoaded", function(a) {
          let b = null;
          chrome.runtime.sendMessage({type:"getFilters"}, function(d) {
            b = d;
            if (null != b && null != b.value) {
              let g = function() {
                let l = I.match("^https?://.*?.amazon.(de|com|co.uk|co.jp|ca|fr|it|es|in|com.br|nl|com.mx)/");
                if (R || l) {
                  let u = f.getDomain(RegExp.$1);
                  scanner.scan(d.value, function(n) {
                    n.key = "f1";
                    n.domainId = u;
                    chrome.runtime.sendMessage({type:"sendData", val:n}, function(x) {
                    });
                  });
                }
              };
              g();
              let e = document.location.href, c = -1, h = -1, k = -1;
              h = setInterval(function() {
                e != document.location.href && (e = document.location.href, clearTimeout(k), k = setTimeout(function() {
                  g();
                }, 2000), clearTimeout(c), c = setTimeout(function() {
                  clearInterval(h);
                }, 180000));
              }, 2000);
              c = setTimeout(function() {
                clearInterval(h);
              }, 180000);
            }
          });
        });
        w = document.location.href;
        w.match("^https://.*?.amazon.(de|com|co.uk|co.jp|ca|fr|it|es|in|nl|com.mx|com.br|com.au)/") && -1 == w.indexOf("aws.amazon.") && -1 == w.indexOf("music.amazon.") && -1 == w.indexOf("services.amazon.") && -1 == w.indexOf("primenow.amazon.") && -1 == w.indexOf("kindle.amazon.") && -1 == w.indexOf("watch.amazon.") && -1 == w.indexOf("developer.amazon.") && -1 == w.indexOf("skills-store.amazon.") && -1 == w.indexOf("pay.amazon.") && document.addEventListener("DOMContentLoaded", function(a) {
          setTimeout(function() {
            chrome.runtime.onMessage.addListener(function(b, d, g) {
              switch(b.key) {
                case "collectASINs":
                  b = {};
                  var e = !1;
                  d = (document.querySelector("#main") || document.querySelector("#zg") || document.querySelector("#pageContent") || document.querySelector("#wishlist-page") || document.querySelector("#merchandised-content") || document.querySelector("#reactApp") || document.querySelector("[id^='contentGrid']") || document.querySelector("#container") || document.querySelector(".a-container") || document).getElementsByTagName("a");
                  if (void 0 != d && null != d) {
                    for (let h = 0; h < d.length; h++) {
                      var c = d[h].href;
                      /\/images/.test(c) || /\/e\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/.test(c) || !c.match(/^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|nl|in|com\.mx|com\.br|com\.au)\/[^.]*?(?:\/|\?ASIN=)([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) && !c.match(/^https?:\/\/.*?\.amzn\.(com)[^.]*?\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) || (e = RegExp.$2, c = f.getDomain(RegExp.$1), "undefined" === typeof b[c] && (b[c] = []), b[c].includes(e) || b[c].push(e), e = !0);
                    }
                  }
                  if (e) {
                    g(b);
                  } else {
                    return alert("Keepa: No product ASINs found on this page."), !1;
                  }
                  break;
                default:
                  g({});
              }
            });
            chrome.storage.local.get(["overlayPriceGraph", "webGraphType", "webGraphRange"], function(b) {
              "undefined" == typeof b && (b = {});
              try {
                let d = b.overlayPriceGraph, g = b.webGraphType;
                try {
                  g = JSON.parse(g);
                } catch (h) {
                }
                let e = b.webGraphRange;
                try {
                  e = Number(e);
                } catch (h) {
                }
                let c;
                if (1 == d) {
                  let h = document.getElementsByTagName("a");
                  if (void 0 != h && null != h) {
                    for (c = 0; c < h.length; c++) {
                      let u = h[c].href;
                      /\/images/.test(u) || /\/e\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/.test(u) || !u.match(/^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|in|com\.mx)\/[^.]*?(?:\/|\?ASIN=)([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) && !u.match(/^https?:\/\/.*?\.amzn\.(com)[^.]*?\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) || -1 == u.indexOf("offer-listing") && D.add_events(g, e, h[c], u, RegExp.$1, RegExp.$2);
                    }
                  }
                  let k = function(u) {
                    if ("A" == u.nodeName) {
                      var n = u.href;
                      /\/images/.test(n) || /\/e\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/.test(n) || !n.match(/^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|in|com\.mx)\/[^.]*?(?:\/|\?ASIN=)([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) && !n.match(/^https?:\/\/.*?\.amzn\.(com)[^.]*?\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) || -1 == n.indexOf("offer-listing") && D.add_events(g, e, u, n, RegExp.$1, RegExp.$2);
                    }
                  }, l = new MutationObserver(function(u) {
                    u.forEach(function(n) {
                      try {
                        if ("childList" === n.type) {
                          for (c = 0; c < n.addedNodes.length; c++) {
                            k(n.addedNodes[c]);
                            for (var x = n.addedNodes[c].children; null != x && "undefined" != x && 0 < x.length;) {
                              var z = [];
                              for (let E = 0; E < x.length; E++) {
                                k(x[E]);
                                try {
                                  if (x[E].children && 0 < x[E].children.length) {
                                    for (let J = 0; J < x[E].children.length && 30 > J; J++) {
                                      z.push(x[E].children[J]);
                                    }
                                  }
                                } catch (J) {
                                }
                              }
                              x = z;
                            }
                          }
                        } else {
                          if (z = n.target.getElementsByTagName("a"), "undefined" != z && null != z) {
                            for (x = 0; x < z.length; x++) {
                              k(z[x]);
                            }
                          }
                        }
                        k(n.target);
                      } catch (E) {
                      }
                    });
                  });
                  l.observe(document.querySelector("html"), {childList:!0, attributes:!1, characterData:!1, subtree:!0, attributeOldValue:!1, characterDataOldValue:!1});
                  window.onunload = function n() {
                    try {
                      window.detachEvent("onunload", n), l.disconnect();
                    } catch (x) {
                    }
                  };
                  document.addEventListener("scroll", n => {
                    D.clear_image(n);
                  });
                }
              } catch (d) {
              }
            });
          }, 100);
        });
        var D = {image_urls_main:[], pf_preview_current:"", preview_images:[], tld:"", createNewImageElement:function(a, b, d) {
          a = a.createElement("img");
          a.style.borderTop = "2px solid #ff9f29";
          a.style.borderBottom = "3px solid grey";
          a.style.display = "block";
          a.style.position = "relative";
          a.style.padding = "5px";
          a.style.width = b + "px";
          a.style.height = d + "px";
          a.style.maxWidth = b + "px";
          a.style.maxHeight = d + "px";
          return a;
        }, preview_image:function(a, b, d, g, e, c) {
          let h;
          try {
            h = d.originalTarget.ownerDocument;
          } catch (n) {
            h = document;
          }
          if (!h.getElementById("pf_preview")) {
            var k = h.createElement("div");
            k.id = "pf_preview";
            k.addEventListener("mouseout", function(n) {
              D.clear_image(n);
            }, !1);
            k.style.boxShadow = "rgb(68, 68, 68) 0px 1px 7px -2px";
            k.style.position = "fixed";
            k.style.zIndex = "10000000";
            k.style.bottom = "0px";
            k.style.right = "0px";
            k.style.margin = "12px 12px";
            k.style.backgroundColor = "#fff";
            h.body.appendChild(k);
          }
          D.pf_preview_current = h.getElementById("pf_preview");
          if (!D.pf_preview_current.firstChild) {
            var l = Math.max(Math.floor(0.3 * h.defaultView.innerHeight), 128), u = Math.max(Math.floor(0.3 * h.defaultView.innerWidth), 128);
            k = 2;
            if (300 > u || 150 > l) {
              k = 1;
            }
            1000 < u && (u = 1000);
            1000 < l && (l = 1000);
            D.pf_preview_current.current = -1;
            D.pf_preview_current.a = e;
            D.pf_preview_current.href = g;
            D.pf_preview_current.size = Math.floor(1.1 * Math.min(u, l));
            h.defaultView.innerWidth - d.clientX < 1.05 * u && h.defaultView.innerHeight - d.clientY < 1.05 * l && (d = h.getElementById("pf_preview"), d.style.right = "", d.style.left = "6px");
            e = "https://graph.keepa.com/pricehistory.png?type=" + k + "&asin=" + e + "&domain=" + c + "&width=" + u + "&height=" + l;
            e = "undefined" == typeof a ? e + "&amazon=1&new=1&used=1&salesrank=1&range=365" : e + ("&amazon=" + a[0] + "&new=" + a[1] + "&used=" + a[2] + "&salesrank=" + a[3] + "&range=" + b + "&fba=" + a[10] + "&fbm=" + a[7] + "&bb=" + a[18] + "&ld=" + a[8] + "&pe=" + a[33] + "&bbu=" + a[32] + "&wd=" + a[9]);
            h.getElementById("pf_preview").style.display = "block";
            fetch(e).then(n => {
              try {
                if ("FAIL" === n.headers.get("screenshot-status")) {
                  return null;
                }
              } catch (x) {
              }
              return n.blob();
            }).then(n => {
              if (null != n) {
                if (D.pf_preview_current.firstChild) {
                  D.pf_preview_current.firstChild.setAttribute("src", URL.createObjectURL(n));
                } else {
                  let x = D.createNewImageElement(h, u, l);
                  D.pf_preview_current.appendChild(x);
                  x.setAttribute("src", URL.createObjectURL(n));
                }
              }
            });
          }
        }, clear_image:function(a) {
          let b;
          try {
            let d;
            try {
              d = a.originalTarget.ownerDocument;
            } catch (g) {
              d = document;
            }
            b = d.getElementById("pf_preview");
            b.style.display = "none";
            b.style.right = "2px";
            b.style.left = "";
            D.pf_preview_current.innerHTML = "";
          } catch (d) {
          }
        }, add_events:function(a, b, d, g, e, c) {
          0 <= g.indexOf("#") || 0 < g.indexOf("plattr=") || (D.tld = e, "pf_prevImg" != d.getAttribute("keepaPreview") && (d.addEventListener("mouseover", function(h) {
            D.preview_image(a, b, h, g, c, e);
            d.addEventListener("mouseout", function(k) {
              D.clear_image(k);
            }, {once:!0});
            return !0;
          }, !0), d.setAttribute("keepaPreview", "pf_prevImg")));
        }};
      }
    }
  }
})();


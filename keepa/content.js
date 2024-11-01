let onlyOnceLogStock = !0;
const scanner = function() {
  function X(F, x) {
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
              const R = function(a, e, g) {
                var d = [];
                if (!a.selectors || 0 == a.selectors.length) {
                  if (!a.regExp) {
                    return H = "invalid selector, sel/regexp", !1;
                  }
                  d = document.getElementsByTagName("html")[0].innerHTML.match(new RegExp(a.regExp, "i"));
                  if (!d || d.length < a.reGroup) {
                    g = "regexp fail: html - " + a.name + g;
                    if (!1 === a.optional) {
                      return H = g, !1;
                    }
                    f += " // " + g;
                    return !0;
                  }
                  return d[a.reGroup];
                }
                let c = [];
                a.selectors.find(l => {
                  l = e.querySelectorAll(l);
                  return 0 < l.length ? (c = l, !0) : !1;
                });
                if (0 === c.length) {
                  if (!0 === a.optional) {
                    return !0;
                  }
                  H = "selector no match: " + a.name + g;
                  return !1;
                }
                if (a.parentSelector && (c = [c[0].parentNode.querySelector(a.parentSelector)], null == c[0])) {
                  if (!0 === a.optional) {
                    return !0;
                  }
                  H = "parent selector no match: " + a.name + g;
                  return !1;
                }
                if ("undefined" != typeof a.multiple && null != a.multiple && (!0 === a.multiple && 1 > c.length || !1 === a.multiple && 1 < c.length)) {
                  if (!Y) {
                    return Y = !0, R(a, e, g);
                  }
                  g = "selector multiple mismatch: " + a.name + g + " found: " + c.length;
                  if (!1 === a.optional) {
                    a = "";
                    for (var h in c) {
                      !c.hasOwnProperty(h) || 1000 < a.length || (a += " - " + h + ": " + c[h].outerHTML + " " + c[h].getAttribute("class") + " " + c[h].getAttribute("id"));
                    }
                    H = g + a + " el: " + e.getAttribute("class") + " " + e.getAttribute("id");
                    return !1;
                  }
                  f += " // " + g;
                  return !0;
                }
                if (a.isListSelector) {
                  return I[a.name] = c, !0;
                }
                if (!a.attribute) {
                  return H = "selector attribute undefined?: " + a.name + g, !1;
                }
                for (let l in c) {
                  if (c.hasOwnProperty(l)) {
                    var k = c[l];
                    if (!k) {
                      break;
                    }
                    if (a.childNode) {
                      a.childNode = Number(a.childNode);
                      h = k.childNodes;
                      if (h.length < a.childNode) {
                        g = "childNodes fail: " + h.length + " - " + a.name + g;
                        if (!1 === a.optional) {
                          return H = g, !1;
                        }
                        f += " // " + g;
                        return !0;
                      }
                      k = h[a.childNode];
                    }
                    h = null;
                    h = "text" == a.attribute ? k.textContent : "html" == a.attribute ? k.innerHTML : k.getAttribute(a.attribute);
                    if (!h || 0 == h.length || 0 == h.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/g, "").length) {
                      g = "selector attribute null: " + a.name + g;
                      if (!1 === a.optional) {
                        return H = g, !1;
                      }
                      f += " // " + g;
                      return !0;
                    }
                    if (a.regExp) {
                      k = h.match(new RegExp(a.regExp, "i"));
                      if (!k || k.length < a.reGroup) {
                        g = "regexp fail: " + h + " - " + a.name + g;
                        if (!1 === a.optional) {
                          return H = g, !1;
                        }
                        f += " // " + g;
                        return !0;
                      }
                      d.push(k[a.reGroup]);
                    } else {
                      d.push(h);
                    }
                    if (!a.multiple) {
                      break;
                    }
                  }
                }
                a.multiple || (d = d[0]);
                return d;
              };
              let D = document, b = !1;
              for (let a in F.scrapeFilters) {
                if (b) {
                  break;
                }
                let e = F.scrapeFilters[a], g = e.pageVersionTest;
                var r = [], u = !1;
                for (const d of g.selectors) {
                  if (r = document.querySelectorAll(d), 0 < r.length) {
                    u = !0;
                    break;
                  }
                }
                if (u) {
                  if ("undefined" != typeof g.multiple && null != g.multiple) {
                    if (!0 === g.multiple && 2 > r.length) {
                      continue;
                    }
                    if (!1 === g.multiple && 1 < r.length) {
                      continue;
                    }
                  }
                  if (g.attribute && (u = null, u = "text" == g.attribute ? "" : r[0].getAttribute(g.attribute), null == u)) {
                    continue;
                  }
                  N = a;
                  for (let d in e) {
                    if (b) {
                      break;
                    }
                    r = e[d];
                    if (r.name != g.name) {
                      if (r.parentList) {
                        u = [];
                        if ("undefined" != typeof I[r.parentList]) {
                          u = I[r.parentList];
                        } else {
                          if (!0 === R(e[r.parentList], D, a)) {
                            u = I[r.parentList];
                          } else {
                            break;
                          }
                        }
                        K[r.parentList] || (K[r.parentList] = []);
                        for (let c in u) {
                          if (b) {
                            break;
                          }
                          if (!u.hasOwnProperty(c)) {
                            continue;
                          }
                          let h = R(r, u[c], a);
                          if (!1 === h) {
                            b = !0;
                            break;
                          }
                          if (!0 !== h) {
                            if (K[r.parentList][c] || (K[r.parentList][c] = {}), r.multiple) {
                              for (let k in h) {
                                h.hasOwnProperty(k) && !r.keepBR && (h[k] = h[k].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                              }
                              h = h.join("\u271c\u271c");
                              K[r.parentList][c][r.name] = h;
                            } else {
                              K[r.parentList][c][r.name] = r.keepBR ? h : h.replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " ");
                            }
                          }
                        }
                      } else {
                        u = R(r, D, a);
                        if (!1 === u) {
                          b = !0;
                          break;
                        }
                        if (!0 !== u) {
                          if (r.multiple) {
                            for (let c in u) {
                              u.hasOwnProperty(c) && !r.keepBR && (u[c] = u[c].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                            }
                            u = u.join();
                          } else {
                            r.keepBR || (u = u.replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                          }
                          O[r.name] = u;
                        }
                      }
                    }
                  }
                  b = !0;
                }
              }
              if (null == N) {
                H += " // no pageVersion matched", A.status = 308, A.payload = [f, H, F.dbg1 ? document.getElementsByTagName("html")[0].innerHTML : ""];
              } else {
                if ("" === H) {
                  A.payload = [f];
                  A.scrapedData = O;
                  for (let a in K) {
                    A[a] = K[a];
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
    x(A);
  }
  let Z = !0;
  window.self === window.top && (Z = !1);
  window.sandboxHasRun && (Z = !1);
  Z && (window.sandboxHasRun = !0, window.addEventListener("message", function(F) {
    if (F.source == window.parent && F.data && (F.origin == "chrome-extension://" + chrome.runtime.id || F.origin.startsWith("moz-extension://") || F.origin.startsWith("safari-extension://"))) {
      var x = F.data.value;
      "data" == F.data.key && x.url && x.url == document.location && setTimeout(function() {
        null == document.body ? setTimeout(function() {
          X(x, function(A) {
            window.parent.postMessage({sandbox:A}, "*");
          });
        }, 1500) : X(x, function(A) {
          window.parent.postMessage({sandbox:A}, "*");
        });
      }, 800);
    }
  }, !1), window.parent.postMessage({sandbox:document.location + "", isUrlMsg:!0}, "*"));
  window.addEventListener("error", function(F, x, A, O, N) {
    "ipbakfmnjdenbmoenhicfmoojdojjjem" != chrome.runtime.id && "blfpbjkajgamcehdbehfdioapoiibdmc" != chrome.runtime.id || console.log(N);
    return !1;
  });
  return {scan:X};
}();
(function() {
  let X = !1, Z = !1;
  const F = window.opera || -1 < navigator.userAgent.indexOf(" OPR/");
  var x = -1 < navigator.userAgent.toLowerCase().indexOf("firefox");
  const A = -1 < navigator.userAgent.toLowerCase().indexOf("edge/"), O = /Apple Computer/.test(navigator.vendor) && /Safari/.test(navigator.userAgent), N = !F && !x && !A & !O, K = x ? "Firefox" : O ? "Safari" : N ? "Chrome" : F ? "Opera" : A ? "Edge" : "Unknown", r = chrome.runtime.getManifest().version;
  let u = !1;
  try {
    u = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
  } catch (b) {
  }
  if (!window.keepaHasRun) {
    window.keepaHasRun = !0;
    var H = 0;
    chrome.runtime.onMessage.addListener((b, a, e) => {
      switch(b.key) {
        case "updateToken":
          f.iframeStorage ? f.iframeStorage.contentWindow.postMessage({origin:"keepaContentScript", key:"updateTokenWebsite", value:b.value}, f.iframeStorage.src) : window.postMessage({origin:"keepaContentScript", key:"updateTokenWebsite", value:b.value}, "*");
      }
    });
    window.addEventListener("message", function(b) {
      if ("undefined" == typeof b.data.sandbox) {
        if ("https://keepa.com" == b.origin || "https://test.keepa.com" == b.origin || "https://dyn.keepa.com" == b.origin) {
          if (b.data.hasOwnProperty("origin") && "keepaIframe" == b.data.origin) {
            f.handleIFrameMessage(b.data.key, b.data.value, function(a) {
              try {
                b.source.postMessage({origin:"keepaContentScript", key:b.data.key, value:a, id:b.data.id}, b.origin);
              } catch (e) {
              }
            });
          } else {
            if ("string" === typeof b.data) {
              const a = b.data.split(",");
              if (2 > a.length) {
                return;
              }
              if (2 < a.length) {
                let e = 2;
                const g = a.length;
                for (; e < g; e++) {
                  a[1] += "," + a[e];
                }
              }
              f.handleIFrameMessage(a[0], a[1], function(e) {
                b.source.postMessage({origin:"keepaContentScript", value:e}, b.origin);
              });
            }
          }
        }
        if (b.origin.match(/^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|jp|ca|fr|es|nl|it|in|com\.mx|com\.br)/)) {
          let a;
          try {
            a = JSON.parse(b.data);
          } catch (e) {
            return;
          }
          (a = a.asin) && /^([BC][A-Z0-9]{9}|\d{9}(!?X|\d))$/.test(a.trim()) && (a != f.ASIN ? (f.ASIN = a, f.swapIFrame()) : 0 != H ? (window.clearTimeout(H), H = 1) : H = window.setTimeout(function() {
            f.swapIFrame();
          }, 1000));
        }
      }
    });
    var f = {domain:0, iframeStorage:null, ASIN:null, tld:"", placeholder:"", cssFlex:function() {
      let b = "flex";
      const a = ["flex", "-webkit-flex", "-moz-box", "-webkit-box", "-ms-flexbox"], e = document.createElement("flexelement");
      for (let g in a) {
        try {
          if ("undefined" != e.style[a[g]]) {
            b = a[g];
            break;
          }
        } catch (d) {
        }
      }
      return b;
    }(), getDomain:function(b) {
      switch(b) {
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
      f.revealMapOnlyOnce || (f.revealMapOnlyOnce = !0, chrome.runtime?.id && chrome.runtime.sendMessage({type:"isPro"}, b => {
        if (null === b.value) {
          console.log("stock data fail");
        } else {
          var a = b.amazonSellerIds, e = b.stockData, g = !0 === b.value, d = c => {
            c = c.trim();
            let h = e.amazonNames[c];
            return h ? "W" === h ? e.warehouseIds[f.domain] : "A" === h ? e.amazonIds[f.domain] : h : (c = c.match(new RegExp(e.sellerId))) && c[1] ? c[1] : null;
          };
          chrome.storage.local.get("revealStock", function(c) {
            "undefined" == typeof c && (c = {});
            let h = !0;
            try {
              h = "0" != c.revealStock;
            } catch (q) {
            }
            onlyOnceLogStock && (onlyOnceLogStock = !1, console.log("Stock " + g + " " + h));
            try {
              if ((h || "com" == f.tld) && !f.revealWorking) {
                if (f.revealWorking = !0, document.getElementById("keepaMAP")) {
                  f.revealWorking = !1;
                } else {
                  var k = function() {
                    const q = new MutationObserver(function(B) {
                      setTimeout(function() {
                        f.revealMAP();
                      }, 100);
                      try {
                        q.disconnect();
                      } catch (t) {
                      }
                    });
                    q.observe(document.getElementById("keepaMAP").parentNode.parentNode.parentNode, {childList:!0, subtree:!0});
                  }, l = (q, B, t, v, C, y, G, L, P, S) => {
                    if ("undefined" == typeof f.revealCache[v] || null == q.parentElement.querySelector(".keepaStock")) {
                      null == L && (L = a[f.domain]);
                      var Q = "" == q.id && "aod-pinned-offer" == q.parentNode.id;
                      y = y || Q;
                      try {
                        t = t || -1 != q.textContent.toLowerCase().indexOf("to cart to see") || !y && /(our price|always remove it|add this item to your cart|see product details in cart|see price in cart)/i.test(document.getElementById("price").textContent);
                      } catch (n) {
                      }
                      if (t || g) {
                        p(q, B, t, v, y);
                        var M = n => {
                          const V = document.getElementById("keepaStock" + v);
                          if (null != V) {
                            V.innerHTML = "";
                            if (null != n && null != n.price && t) {
                              var T = document.createElement("div");
                              n = 5 == f.domain ? n.price : (Number(n.price) / 100).toFixed(2);
                              var W = new Intl.NumberFormat(" en-US en-GB de-DE fr-FR ja-JP en-CA zh-CN it-IT es-ES hi-IN es-MX pt-BR en-AU nl-NL tr-TR".split(" ")[f.domain], {style:"currency", currency:" USD GBP EUR EUR JPY CAD CNY EUR EUR INR MXN BRL AUD EUR TRY".split(" ")[f.domain]});
                              0 < n && (T.innerHTML = 'Price&emsp;&ensp;<span style="font-weight: bold;">' + W.format(n) + "</span>");
                              V.parentNode.parentNode.parentNode.prepend(T);
                            }
                            g && (n = f.revealCache[v].stock, 999 == n ? n = "999+" : 1000 == n ? n = "1000+" : -3 != f.revealCache[v].price && 1 > f.revealCache[v].price && (30 == n || P) && (n += "+"), T = document.createElement("span"), T.style = "font-weight: bold;", T.innerText = n + " ", n = document.createElement("span"), n.style = "color: #dedede;", n.innerText = " (revealed by \u271c Keepa)", W = document.createElement("span"), W.style = "color:#da4c33;", W.innerText = " order limit", V.appendChild(T), 
                            f.revealCache[v].limit && (0 < f.revealCache[v].orderLimit && (W.innerText += ": " + f.revealCache[v].orderLimit), V.appendChild(W)), (T = f.revealCache[v].errorCode) ? (n = document.createElement("span"), n.style = "color: #f7d1d1;", n.innerText = " (e_" + T + ")", null != f.revealCache[v].error && (n.title = f.revealCache[v].error + ". Contact info@keepa.com with a screenshot & URL for assistance."), V.appendChild(n)) : y && V.appendChild(n));
                          }
                        };
                        if ("undefined" != typeof f.revealCache[v] && -1 != f.revealCache[v]) {
                          "pending" != f.revealCache[v] && M(f.revealCache[v]);
                        } else {
                          f.revealCache[v] = "pending";
                          Q = q = "";
                          try {
                            q = document.querySelector("meta[name=encrypted-slate-token]").getAttribute("content"), Q = document.querySelector("#aod-offer-list input#aod-atc-csrf-token").getAttribute("value");
                          } catch (n) {
                          }
                          chrome.runtime?.id && chrome.runtime.sendMessage({type:"getStock", asin:B, oid:v, sellerId:L, maxQty:G, hasPlus:P, isMAP:t, host:document.location.hostname, force:t, referer:document.location + "", domainId:f.domain, cachedStock:f.revealCache[L], offscreen:!1, atcCsrf:Q || S, slateToken:q, session:C}, n => {
                            if ("undefined" == typeof n || null == n || !1 === n?.stock) {
                              if (n = document.getElementById("keepaMAP")) {
                                n.innerHTML = "";
                              }
                            } else {
                              f.revealCache[v] = n, f.revealCache[L] = n, M(n);
                            }
                          });
                        }
                      }
                    }
                  }, p = (q, B, t, v, C) => {
                    B = "" == q.id && "aod-pinned-offer" == q.parentNode.id;
                    var y = (C ? q.parentElement : q).querySelector(".keepaMAP");
                    if (null == (C ? q.parentElement : q).querySelector(".keepaStock")) {
                      null != y && null != y.parentElement && y.parentElement.remove();
                      var G = C ? "165px" : "55px;height:20px;";
                      y = document.createElement("div");
                      y.id = "keepaMAP" + (C ? t + v : "");
                      y.className = "a-section a-spacing-none a-spacing-top-micro aod-clear-float keepaStock";
                      t = document.createElement("div");
                      t.className = "a-fixed-left-grid";
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
                      t.appendChild(L);
                      y.appendChild(t);
                      S.className = "a-size-small a-color-tertiary";
                      f.revealWorking = !1;
                      g && (S.innerText = "Stock");
                      C ? B ? (q = document.querySelector("#aod-pinned-offer-show-more-link"), 0 == q.length && document.querySelector("#aod-pinned-offer-main-content-show-more"), q.prepend(y)) : q.parentNode.insertBefore(y, q.parentNode.children[q.parentNode.children.length - 1]) : q.appendChild(y);
                      C || k();
                    }
                  }, m = document.location.href, w = new MutationObserver(function(q) {
                    try {
                      let C = document.querySelectorAll("#aod-offer,#aod-pinned-offer");
                      if (null != C && 0 != C.length) {
                        q = null;
                        var B = C[0].querySelector('input[name="session-id"]');
                        if (B) {
                          q = B.getAttribute("value");
                        } else {
                          if (B = document.querySelector("#session-id")) {
                            q = document.querySelector("#session-id").value;
                          }
                        }
                        if (!q) {
                          var t = document.querySelectorAll("script");
                          for (var v of t) {
                            let y = v.text.match("ue_sid.?=.?'([0-9-]{19})'");
                            y && (q = y[1]);
                          }
                        }
                        if (q) {
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
                                    let n = JSON.parse(G.querySelectorAll("[data-aw-aod-cart-api]")[0].dataset.awAodCartApi);
                                    L = n.oid;
                                    B = n.maxQty;
                                  } catch (n) {
                                  }
                                }
                              }
                              if (!L) {
                                continue;
                              }
                              const S = G.children[0];
                              t = null;
                              if (e) {
                                for (v = 0; v < e.soldByOffers.length; v++) {
                                  let M = G.querySelector(e.soldByOffers[v]);
                                  if (null == M) {
                                    continue;
                                  }
                                  t = d(M.innerText);
                                  if (null != t) {
                                    break;
                                  }
                                  let n = M.getAttribute("href");
                                  null == n && (n = M.innerHTML);
                                  t = d(n);
                                  if (null != t) {
                                    break;
                                  }
                                }
                              }
                              const Q = -1 != G.textContent.toLowerCase().indexOf("add to cart to see product details.");
                              l(S, f.ASIN, Q, L, q, !0, B, t);
                            }
                          }
                        } else {
                          console.error("missing sessionId");
                        }
                      }
                    } catch (C) {
                      console.log(C);
                    }
                  });
                  w.observe(document.querySelector("body"), {childList:!0, attributes:!1, characterData:!1, subtree:!0, attributeOldValue:!1, characterDataOldValue:!1});
                  window.onunload = function B() {
                    try {
                      window.detachEvent("onunload", B), w.disconnect();
                    } catch (t) {
                    }
                  };
                  var z = document.querySelector(e.soldOfferId);
                  c = null;
                  if (e) {
                    var E = document.querySelector(e.soldByBBForm);
                    E && (c = E.getAttribute("value"));
                    if (null == c) {
                      for (E = 0; E < e.soldByBB.length; E++) {
                        var J = document.querySelector(e.soldByBB[E]);
                        if (null != J && (c = d(J.innerHTML), null != c)) {
                          break;
                        }
                      }
                    }
                  }
                  if (null != z && null != z.value) {
                    var U = z.parentElement.querySelector("#session-id");
                    const B = z.parentElement.querySelector("#ASIN"), t = z.parentElement.querySelector("#selectQuantity #quantity > option:last-child");
                    let v = z.parentElement.querySelector('input[name*="CSRF" i]')?.getAttribute("value");
                    if (null != U && null != B) {
                      for (J = 0; J < e.mainEl.length; J++) {
                        let C = document.querySelector(e.mainEl[J]);
                        if (null != C) {
                          E = J = !1;
                          if (null != t) {
                            try {
                              0 < t.innerText.indexOf("+") && (E = !0), J = Number("" == t.value ? t.innerText.replaceAll("+", "") : t.value);
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
                        const t = aa.querySelector('span[data-action="a-modal"]');
                        if (t) {
                          var ba = t.getAttribute("data-a-modal");
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
                        const t = document.querySelector("#session-id");
                        l(aa, f.ASIN, !1, z, t.value, !1, !1, U);
                      }
                    } else {
                      f.revealWorking = !1;
                    }
                  } else {
                    f.revealWorking = !1;
                  }
                }
              }
            } catch (q) {
              f.revealWorking = !1, console.log(q);
            }
          });
        }
      }));
    }, onPageLoad:function() {
      f.tld = RegExp.$1;
      const b = RegExp.$3;
      f.ASIN || (f.ASIN = b);
      f.domain = f.getDomain(f.tld);
      chrome.storage.local.get(["s_boxType", "s_boxOfferListing"], function(a) {
        "undefined" == typeof a && (a = {});
        document.addEventListener("DOMContentLoaded", function(e) {
          e = document.getElementsByTagName("head")[0];
          const g = document.createElement("script");
          g.type = "text/javascript";
          g.src = chrome.runtime.getURL("selectionHook.js");
          e.appendChild(g);
          "0" == a.s_boxType ? f.swapIFrame() : f.getPlaceholderAndInsertIFrame((d, c) => {
            if (void 0 !== d) {
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
              d.parentNode.insertBefore(c, d);
            }
          });
        }, !1);
      });
    }, swapIFrame:function() {
      if ("com.au" == f.tld) {
        try {
          f.revealMAP(document, f.ASIN, f.tld), f.revealMapOnlyOnce = !1;
        } catch (a) {
        }
      } else {
        if (!document.getElementById("keepaButton")) {
          f.swapIFrame.swapTimer && clearTimeout(f.swapIFrame.swapTimer);
          f.swapIFrame.swapTimer = setTimeout(function() {
            if (!u) {
              document.getElementById("keepaContainer") || f.getPlaceholderAndInsertIFrame(f.insertIFrame);
              try {
                f.revealMAP(document, f.ASIN, f.tld), f.revealMapOnlyOnce = !1;
              } catch (a) {
              }
              f.swapIFrame.swapTimer = setTimeout(function() {
                document.getElementById("keepaContainer") || f.getPlaceholderAndInsertIFrame(f.insertIFrame);
              }, 2000);
            }
          }, 2000);
          var b = document.getElementById("keepaContainer");
          if (null != f.iframeStorage && b) {
            try {
              f.iframeStorage.contentWindow.postMessage({origin:"keepaContentScript", key:"updateASIN", value:{d:f.domain, a:f.ASIN, eType:K, eVersion:r, url:document.location.href}}, "*");
            } catch (a) {
              console.error(a);
            }
          } else {
            f.getPlaceholderAndInsertIFrame(f.insertIFrame);
            try {
              f.revealMAP(document, f.ASIN, f.tld), f.revealMapOnlyOnce = !1;
            } catch (a) {
            }
          }
        }
      }
    }, getDevicePixelRatio:function() {
      let b = 1;
      void 0 !== window.screen.systemXDPI && void 0 !== window.screen.logicalXDPI && window.screen.systemXDPI > window.screen.logicalXDPI ? b = window.screen.systemXDPI / window.screen.logicalXDPI : void 0 !== window.devicePixelRatio && (b = window.devicePixelRatio);
      return b;
    }, getPlaceholderAndInsertIFrame:function(b) {
      chrome.storage.local.get("keepaBoxPlaceholder keepaBoxPlaceholderBackup keepaBoxPlaceholderBackupClass keepaBoxPlaceholderAppend keepaBoxPlaceholderBackupAppend webGraphType webGraphRange".split(" "), function(a) {
        "undefined" == typeof a && (a = {});
        let e = 0;
        const g = function() {
          if (!document.getElementById("keepaButton") && !document.getElementById("amazonlive-homepage-widget")) {
            if (u) {
              const l = document.querySelector("#tabular_feature_div,#olpLinkWidget_feature_div,#tellAFriendBox_feature_div");
              try {
                document.querySelector("#keepaMobileContainer")[0].remove();
              } catch (p) {
              }
              if (l && l.previousSibling) {
                try {
                  var d = a.webGraphType;
                  try {
                    d = JSON.parse(d);
                  } catch (w) {
                  }
                  var c = a.webGraphRange;
                  try {
                    c = Number(c);
                  } catch (w) {
                  }
                  var h = Math.min(1800, 1.6 * window.innerWidth).toFixed(0), k = "https://graph.keepa.com/pricehistory.png?type=2&asin=" + f.ASIN + "&domain=" + f.domain + "&width=" + h + "&height=450";
                  k = "undefined" == typeof d ? k + "&amazon=1&new=1&used=1&salesrank=1&range=365" : k + ("&amazon=" + d[0] + "&new=" + d[1] + "&used=" + d[2] + "&salesrank=" + d[3] + "&range=" + c + "&fba=" + d[10] + "&fbm=" + d[7] + "&bb=" + d[18] + "&ld=" + d[8] + "&pe=" + d[33] + "&bbu=" + d[32] + "&wd=" + d[9]);
                  const p = document.createElement("div");
                  p.setAttribute("id", "keepaMobileContainer");
                  p.setAttribute("style", "margin-bottom: 20px;");
                  const m = document.createElement("img");
                  m.setAttribute("style", "margin: 5px 0; width: " + Math.min(1800, window.innerWidth) + "px;");
                  m.setAttribute("id", "keepaImageContainer" + f.ASIN);
                  m.setAttribute("src", k);
                  document.createElement("div").setAttribute("style", "margin: 20px; display: flex;justify-content: space-evenly;");
                  p.appendChild(m);
                  l.after(p);
                  m.addEventListener("click", function() {
                    m.remove();
                    f.insertIFrame(l.previousSibling, !1, !0);
                  }, !1);
                } catch (p) {
                  console.error(p);
                }
                return;
              }
            }
            if ((d = document.getElementById("gpdp-btf-container")) && d.previousElementSibling) {
              f.insertIFrame(d.previousElementSibling, !1, !0);
            } else {
              if ((d = document.getElementsByClassName("mocaGlamorContainer")[0]) || (d = document.getElementById("dv-sims")), d ||= document.getElementById("mas-terms-of-use"), d && d.nextSibling) {
                f.insertIFrame(d.nextSibling, !1, !0);
              } else {
                if (c = a.keepaBoxPlaceholder || "#bottomRow", d = !1, c = document.querySelector(c)) {
                  "sims_fbt" == c.previousElementSibling.id && (c = c.previousElementSibling, "bucketDivider" == c.previousElementSibling.className && (c = c.previousElementSibling), d = !0), 1 == a.keepaBoxPlaceholderAppend && (c = c.nextSibling), b(c, d);
                } else {
                  if (c = a.keepaBoxPlaceholderBackup || "#elevatorBottom", "ATFCriticalFeaturesDataContainer" == c && (c = "#ATFCriticalFeaturesDataContainer"), c = document.querySelector(c)) {
                    1 == a.keepaBoxPlaceholderBackupAppend && (c = c.nextSibling), b(c, !0);
                  } else {
                    if (c = document.getElementById("hover-zoom-end")) {
                      b(c, !0);
                    } else {
                      if (c = a.keepaBoxPlaceholderBackupClass || ".a-fixed-left-grid", (c = document.querySelector(c)) && c.nextSibling) {
                        b(c.nextSibling, !0);
                      } else {
                        d = 0;
                        c = document.getElementsByClassName("twisterMediaMatrix");
                        h = !!document.getElementById("dm_mp3Player");
                        if ((c = 0 == c.length ? document.getElementById("handleBuy") : c[0]) && 0 == d && !h && null != c.nextElementSibling) {
                          k = !1;
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
                            b(c, !1);
                            return;
                          }
                        }
                        c = document.getElementsByClassName("bucketDivider");
                        0 == c.length && (c = document.getElementsByClassName("a-divider-normal"));
                        if (!c[d]) {
                          if (!c[0]) {
                            40 > e++ && window.setTimeout(function() {
                              g();
                            }, 100);
                            return;
                          }
                          d = 0;
                        }
                        for (h = c[d]; h && c[d];) {
                          if (h = h.parentNode, "table" === h.tagName.toLowerCase()) {
                            if ("buyboxrentTable" === h.className || /buyBox/.test(h.className) || "buyingDetailsGrid" === h.className) {
                              h = c[++d];
                            } else {
                              break;
                            }
                          } else if ("html" === h.tagName.toLowerCase()) {
                            break;
                          }
                        }
                        f.placeholder = c[d];
                        c[d] && c[d].parentNode && (d = document.getElementsByClassName("lpo")[0] && c[1] && 0 == d ? c[1] : c[d], b(d, !1));
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
    }, getAFComment:function(b) {
      for (b = [b]; 0 < b.length;) {
        const a = b.pop();
        for (let e = 0; e < a.childNodes.length; e++) {
          const g = a.childNodes[e];
          if (8 === g.nodeType && -1 < g.textContent.indexOf("MarkAF")) {
            return g;
          }
          b.push(g);
        }
      }
      return null;
    }, insertIFrame:function(b, a) {
      if (null != f.iframeStorage && document.getElementById("keepaContainer")) {
        f.swapIFrame();
      } else {
        var e = document.getElementById("hover-zoom-end"), g = function(d) {
          var c = document.getElementById(d);
          const h = [];
          for (; c;) {
            h.push(c), c.id = "a-different-id", c = document.getElementById(d);
          }
          for (c = 0; c < h.length; ++c) {
            h[c].id = d;
          }
          return h;
        }("hover-zoom-end");
        chrome.storage.local.get("s_boxHorizontal", function(d) {
          "undefined" == typeof d && (d = {});
          if (null == b) {
            setTimeout(() => {
              f.getPlaceholderAndInsertIFrame(f.insertIFrame);
            }, 3000);
          } else {
            var c = d.s_boxHorizontal, h = window.innerWidth - 50;
            if (!document.getElementById("keepaContainer")) {
              d = document.createElement("div");
              "0" == c ? (h -= 550, 960 > h && (h = 960), d.setAttribute("style", "min-width: 935px; max-width:" + h + "px;display: flex;  height: 500px; border:0 none; margin: 10px 0 0;")) : d.setAttribute("style", "min-width: 935px; width: calc(100% - 30px); height: 500px; display: flex; border:0 none; margin: 10px 0 0;");
              d.setAttribute("id", "keepaContainer");
              var k = document.createElement("iframe");
              c = document.createElement("div");
              c.setAttribute("id", "keepaClear");
              k.setAttribute("style", "width: 100%; height: 100%; border:0 none;overflow: hidden;");
              k.setAttribute("src", "https://keepa.com/keepaBox.html");
              k.setAttribute("scrolling", "no");
              k.setAttribute("id", "keepa");
              Z ||= !0;
              d.appendChild(k);
              h = !1;
              if (!a) {
                null == b.parentNode || "promotions_feature_div" !== b.parentNode.id && "dp-out-of-stock-top_feature_div" !== b.parentNode.id || (b = b.parentNode);
                try {
                  var l = b.previousSibling.previousSibling;
                  null != l && "technicalSpecifications_feature_div" == l.id && (b = l);
                } catch (U) {
                }
                0 < g.length && (e = g[g.length - 1]) && "centerCol" != e.parentElement.id && ((l = f.getFirstInDOM([b, e], document.body)) && 600 < l.parentElement.offsetWidth && (b = l), b === e && (h = !0));
                (l = document.getElementById("title") || document.getElementById("title_row")) && f.getFirstInDOM([b, l], document.body) !== l && (b = l);
              }
              l = document.getElementById("vellumMsg");
              null != l && (b = l);
              l = document.body;
              var p = document.documentElement;
              p = Math.max(l.scrollHeight, l.offsetHeight, p.clientHeight, p.scrollHeight, p.offsetHeight);
              var m = b.offsetTop / p;
              if (0.5 < m || 0 > m) {
                l = f.getAFComment(l), null != l && (m = b.offsetTop / p, 0.5 > m && (b = l));
              }
              if (b.parentNode) {
                l = document.querySelector(".container_vertical_middle");
                "burjPageDivider" == b.id ? (b.parentNode.insertBefore(d, b), a || b.parentNode.insertBefore(c, d.nextSibling)) : "bottomRow" == b.id ? (b.parentNode.insertBefore(d, b), a || b.parentNode.insertBefore(c, d.nextSibling)) : h ? (b.parentNode.insertBefore(d, b.nextSibling), a || b.parentNode.insertBefore(c, d.nextSibling)) : null != l ? (b = l, b.parentNode.insertBefore(d, b.nextSibling), a || b.parentNode.insertBefore(c, d.nextSibling)) : (b.parentNode.insertBefore(d, b), a || b.parentNode.insertBefore(c, 
                d));
                f.iframeStorage = k;
                d.style.display = f.cssFlex;
                var w = !1, z = 5;
                if (!u) {
                  var E = setInterval(function() {
                    if (0 >= z--) {
                      clearInterval(E);
                    } else {
                      var U = null != document.getElementById("keepa");
                      try {
                        if (!U) {
                          throw f.getPlaceholderAndInsertIFrame(f.insertIFrame), 1;
                        }
                        if (w) {
                          throw 1;
                        }
                        document.getElementById("keepa").contentDocument.location = iframeUrl;
                      } catch (aa) {
                        clearInterval(E);
                      }
                    }
                  }, 4000), J = function() {
                    w = !0;
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
    }, handleIFrameMessage:function(b, a, e) {
      switch(b) {
        case "resize":
          X ||= !0;
          a = "" + a;
          -1 == a.indexOf("px") && (a += "px");
          if (b = document.getElementById("keepaContainer")) {
            b.style.height = a;
          }
          break;
        case "ping":
          e({location:chrome.runtime.id + " " + document.location});
          break;
        case "openPage":
          chrome.runtime?.id && chrome.runtime.sendMessage({type:"openPage", url:a});
          break;
        case "getToken":
          let g = {d:f.domain, a:f.ASIN, eType:K, eVersion:r, url:document.location.href};
          chrome.runtime?.id ? f.sendMessageWithRetry({type:"getCookie", key:"token"}, 3, 1000, d => {
            g.token = d?.value;
            g.install = d?.install;
            e(g);
          }, d => {
            console.log("failed token retrieval: ", d);
            e(g);
          }) : e(g);
          break;
        case "setCookie":
          chrome.runtime?.id && chrome.runtime.sendMessage({type:"setCookie", key:a.key, val:a.val});
      }
    }, sendMessageWithRetry:function(b, a, e, g, d) {
      let c = 0, h = !1;
      const k = () => {
        c += 1;
        chrome.runtime.sendMessage(b, l => {
          h || (h = !0, g(l));
        });
        setTimeout(() => {
          h || (c < a ? setTimeout(k, e) : (console.log("Failed to receive a response after maximum retries."), d()));
        }, e);
      };
      k();
    }, synchronizeIFrame:function() {
      let b = 0;
      chrome.storage.local.get("s_boxHorizontal", function(g) {
        "undefined" != typeof g && "undefined" != typeof g.s_boxHorizontal && (b = g.s_boxHorizontal);
      });
      let a = window.innerWidth, e = !1;
      u || window.addEventListener("resize", function() {
        e || (e = !0, window.setTimeout(function() {
          if (a != window.innerWidth && "0" == b) {
            a = window.innerWidth;
            let g = window.innerWidth - 50;
            g -= 550;
            935 > g && (g = 935);
            document.getElementById("keepaContainer").style.width = g;
          }
          e = !1;
        }, 100));
      }, !1);
    }, getFirstInDOM:function(b, a) {
      let e;
      for (a = a.firstChild; a; a = a.nextSibling) {
        if ("IFRAME" !== a.nodeName && 1 === a.nodeType) {
          if (-1 !== b.indexOf(a)) {
            return a;
          }
          if (e = f.getFirstInDOM(b, a)) {
            return e;
          }
        }
      }
      return null;
    }, getClipRect:function(b) {
      "string" === typeof b && (b = document.querySelector(b));
      let a = 0, e = 0;
      const g = function(d) {
        a += d.offsetLeft;
        e += d.offsetTop;
        d.offsetParent && g(d.offsetParent);
      };
      g(b);
      return 0 == e && 0 == a ? f.getClipRect(b.parentNode) : {top:e, left:a, width:b.offsetWidth, height:b.offsetHeight};
    }, findPlaceholderBelowImages:function(b) {
      const a = b;
      let e, g = 100;
      do {
        for (g--, e = null; !e;) {
          e = b.nextElementSibling, e || (e = b.parentNode.nextElementSibling), b = e ? e : b.parentNode.parentNode, !e || "IFRAME" !== e.nodeName && "SCRIPT" !== e.nodeName && 1 === e.nodeType || (e = null);
        }
      } while (0 < g && 100 < f.getClipRect(e).left);
      return e ? e : a;
    }, httpGet:function(b, a) {
      const e = new XMLHttpRequest();
      a && (e.onreadystatechange = function() {
        4 == e.readyState && a.call(this, e.responseText);
      });
      e.open("GET", b, !0);
      e.send();
    }, httpPost2:function(b, a, e, g, d) {
      const c = new XMLHttpRequest();
      g && (c.onreadystatechange = function() {
        4 == c.readyState && g.call(this, c.responseText);
      });
      c.withCredentials = d;
      c.open("POST", b, !0);
      c.setRequestHeader("Content-Type", e);
      c.send(a);
    }, httpPost:function(b, a, e, g) {
      f.httpPost2(b, a, "text/plain;charset=UTF-8", e, g);
    }, lastBugReport:0, reportBug:function(b, a, e) {
      var g = Date.now();
      if (!(6E5 > g - f.lastBugReport || /(dead object)|(Script error)|(\.location is null)/i.test(b))) {
        f.lastBugReport = g;
        g = "";
        try {
          g = Error().stack.split("\n").splice(1).splice(1).join("&ensp;&lArr;&ensp;");
          if (!/(keepa|content)\.js/.test(g)) {
            return;
          }
          g = g.replace(RegExp("chrome-extension://.*?/content/", "g"), "").replace(/:[0-9]*?\)/g, ")").replace(/[ ]{2,}/g, "");
        } catch (d) {
        }
        if ("object" == typeof b) {
          try {
            b = b instanceof Error ? b.toString() : JSON.stringify(b);
          } catch (d) {
          }
        }
        null == e && (e = {exception:b, additional:a, url:document.location.host, stack:g});
        null != e.url && e.url.startsWith("blob:") || (e.keepaType = N ? "keepaChrome" : F ? "keepaOpera" : O ? "keepaSafari" : A ? "keepaEdge" : "keepaFirefox", e.version = r, chrome.storage.local.get("token", function(d) {
          "undefined" == typeof d && (d = {token:"undefined"});
          //f.httpPost("https://dyn.keepa.com/service/bugreport/?user=" + d.token + "&type=" + K, JSON.stringify(e));
        }));
      }
    }};
    window.onerror = function(b, a, e, g, d) {
      let c;
      "string" !== typeof b && (d = b.error, c = b.filename || b.fileName, e = b.lineno || b.lineNumber, g = b.colno || b.columnNumber, b = b.message || b.name || d.message || d.name);
      b = b.toString();
      let h = "";
      g = g || 0;
      if (d && d.stack) {
        h = d.stack;
        try {
          h = d.stack.split("\n").splice(1).splice(1).join("&ensp;&lArr;&ensp;");
          if (!/(keepa|content)\.js/.test(h)) {
            return;
          }
          h = h.replace(RegExp("chrome-extension://.*?/content/", "g"), "").replace(/:[0-9]*?\)/g, ")").replace(/[ ]{2,}/g, "");
        } catch (k) {
        }
      }
      "undefined" === typeof e && (e = 0);
      "undefined" === typeof g && (g = 0);
      b = {msg:b, url:(a || c || document.location.toString()) + ":" + e + ":" + g, stack:h};
      "ipbakfmnjdenbmoenhicfmoojdojjjem" != chrome.runtime.id && "blfpbjkajgamcehdbehfdioapoiibdmc" != chrome.runtime.id || console.log(b);
      //f.reportBug(null, null, b);
      return !1;
    };
    if (window.self == window.top && !(/.*music\.amazon\..*/.test(document.location.href) || /.*primenow\.amazon\..*/.test(document.location.href) || /.*amazonlive-portal\.amazon\..*/.test(document.location.href) || /.*amazon\.com\/restaurants.*/.test(document.location.href))) {
      x = function(b) {
        chrome.runtime.sendMessage({type:"sendData", val:{key:"m1", payload:[b]}}, function() {
        });
      };
      var I = document.location.href, Y = !1;
      document.addEventListener("DOMContentLoaded", function(b) {
        if (!Y) {
          try {
            if (I.startsWith("https://test.keepa.com") || I.startsWith("https://keepa.com")) {
              let a = document.createElement("div");
              a.id = "extension";
              a.setAttribute("type", K);
              a.setAttribute("version", r);
              document.body.appendChild(a);
              Y = !0;
            }
          } catch (a) {
          }
        }
      });
      var R = !1;
      chrome.runtime.sendMessage({type:"isActive"});
      if (!/((\/images)|(\/review)|(\/customer-reviews)|(ask\/questions)|(\/product-reviews))/.test(I) && !/\/e\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/.test(I) && (I.match(/^https:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|nl|in|com\.mx|com\.br|com\.au)\/[^.]*?(\/|[?&]ASIN=)([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) || I.match(/^https:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|nl|in|com\.mx|com\.br|com\.au)\/(.*?)\/dp\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))\//) || I.match(/^https:\/\/.*?\.amzn\.(com).*?\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/))) {
        f.onPageLoad(!1), R = !0;
      } else if (!I.match(/^https:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|nl|es|in|com\.mx|com\.br|com\.au)\/[^.]*?\/(wishlist|registry)/) && !I.match(/^htt(p|ps):\/\/w*?\.amzn\.(com)[^.]*?\/(wishlist|registry)/)) {
        if (I.match("^https://.*?(?:seller).*?.amazon.(de|com|co.uk|co.jp|ca|fr|it|nl|es|in|com.mx|com.br|com.au)/")) {
          x("s" + f.getDomain(RegExp.$1));
          let b = !1;
          function a() {
            b || (b = !0, chrome.runtime.sendMessage({type:"isSellerActive"}), setTimeout(() => {
              b = !1;
            }, 1000));
          }
          a();
          document.addEventListener("mousemove", a);
          document.addEventListener("keydown", a);
          document.addEventListener("touchstart", a);
        } else {
          I.match(/^https:\/\/.*?(?:af.?ilia|part|assoc).*?\.amazon\.(de|com|co\.uk|co\.jp|nl|ca|fr|it|es|in|com\.mx|com\.br|com\.au)\/home/) && x("a" + f.getDomain(RegExp.$1));
        }
      }
      if (!u) {
        x = /^https:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|nl|in|com\.mx|com\.br|com\.au)\/(s([\/?])|gp\/bestsellers\/|gp\/search\/|.*?\/b\/)/;
        (R || I.match(x)) && document.addEventListener("DOMContentLoaded", function(b) {
          let a = null;
          chrome.runtime.sendMessage({type:"getFilters"}, function(e) {
            a = e;
            if (null != a && null != a.value) {
              let g = function() {
                let l = I.match("^https?://.*?.amazon.(de|com|co.uk|co.jp|ca|fr|it|es|in|com.br|nl|com.mx)/");
                if (R || l) {
                  let p = f.getDomain(RegExp.$1);
                  scanner.scan(e.value, function(m) {
                    m.key = "f1";
                    m.domainId = p;
                    chrome.runtime.sendMessage({type:"sendData", val:m}, function(w) {
                    });
                  });
                }
              };
              g();
              let d = document.location.href, c = -1, h = -1, k = -1;
              h = setInterval(function() {
                d != document.location.href && (d = document.location.href, clearTimeout(k), k = setTimeout(function() {
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
        x = document.location.href;
        x.match("^https://.*?.amazon.(de|com|co.uk|co.jp|ca|fr|it|es|in|nl|com.mx|com.br|com.au)/") && -1 == x.indexOf("aws.amazon.") && -1 == x.indexOf("music.amazon.") && -1 == x.indexOf("services.amazon.") && -1 == x.indexOf("primenow.amazon.") && -1 == x.indexOf("kindle.amazon.") && -1 == x.indexOf("watch.amazon.") && -1 == x.indexOf("developer.amazon.") && -1 == x.indexOf("skills-store.amazon.") && -1 == x.indexOf("pay.amazon.") && document.addEventListener("DOMContentLoaded", function(b) {
          setTimeout(function() {
            chrome.runtime.onMessage.addListener(function(a, e, g) {
              switch(a.key) {
                case "collectASINs":
                  a = {};
                  var d = !1;
                  e = (document.querySelector("#main") || document.querySelector("#zg") || document.querySelector("#pageContent") || document.querySelector("#wishlist-page") || document.querySelector("#merchandised-content") || document.querySelector("#reactApp") || document.querySelector("[id^='contentGrid']") || document.querySelector("#container") || document.querySelector(".a-container") || document).getElementsByTagName("a");
                  if (void 0 != e && null != e) {
                    for (let h = 0; h < e.length; h++) {
                      var c = e[h].href;
                      /\/images/.test(c) || /\/e\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/.test(c) || !c.match(/^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|nl|in|com\.mx|com\.br|com\.au)\/[^.]*?(?:\/|\?ASIN=)([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) && !c.match(/^https?:\/\/.*?\.amzn\.(com)[^.]*?\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) || (d = RegExp.$2, c = f.getDomain(RegExp.$1), "undefined" === typeof a[c] && (a[c] = []), a[c].includes(d) || a[c].push(d), d = !0);
                    }
                  }
                  if (d) {
                    g(a);
                  } else {
                    return alert("Keepa: No product ASINs found on this page."), !1;
                  }
                  break;
                default:
                  g({});
              }
            });
            chrome.storage.local.get(["overlayPriceGraph", "webGraphType", "webGraphRange"], function(a) {
              "undefined" == typeof a && (a = {});
              try {
                let e = a.overlayPriceGraph, g = a.webGraphType;
                try {
                  g = JSON.parse(g);
                } catch (h) {
                }
                let d = a.webGraphRange;
                try {
                  d = Number(d);
                } catch (h) {
                }
                let c;
                if (1 == e) {
                  let h = document.getElementsByTagName("a");
                  if (void 0 != h && null != h) {
                    for (c = 0; c < h.length; c++) {
                      let p = h[c].href;
                      /\/images/.test(p) || /\/e\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/.test(p) || !p.match(/^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|in|com\.mx)\/[^.]*?(?:\/|\?ASIN=)([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) && !p.match(/^https?:\/\/.*?\.amzn\.(com)[^.]*?\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) || -1 == p.indexOf("offer-listing") && D.add_events(g, d, h[c], p, RegExp.$1, RegExp.$2);
                    }
                  }
                  let k = function(p) {
                    if ("A" == p.nodeName) {
                      var m = p.href;
                      /\/images/.test(m) || /\/e\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/.test(m) || !m.match(/^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|in|com\.mx)\/[^.]*?(?:\/|\?ASIN=)([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) && !m.match(/^https?:\/\/.*?\.amzn\.(com)[^.]*?\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) || -1 == m.indexOf("offer-listing") && D.add_events(g, d, p, m, RegExp.$1, RegExp.$2);
                    }
                  }, l = new MutationObserver(function(p) {
                    p.forEach(function(m) {
                      try {
                        if ("childList" === m.type) {
                          for (c = 0; c < m.addedNodes.length; c++) {
                            k(m.addedNodes[c]);
                            for (var w = m.addedNodes[c].children; null != w && "undefined" != w && 0 < w.length;) {
                              var z = [];
                              for (let E = 0; E < w.length; E++) {
                                k(w[E]);
                                try {
                                  if (w[E].children && 0 < w[E].children.length) {
                                    for (let J = 0; J < w[E].children.length && 30 > J; J++) {
                                      z.push(w[E].children[J]);
                                    }
                                  }
                                } catch (J) {
                                }
                              }
                              w = z;
                            }
                          }
                        } else {
                          if (z = m.target.getElementsByTagName("a"), "undefined" != z && null != z) {
                            for (w = 0; w < z.length; w++) {
                              k(z[w]);
                            }
                          }
                        }
                        k(m.target);
                      } catch (E) {
                      }
                    });
                  });
                  l.observe(document.querySelector("html"), {childList:!0, attributes:!1, characterData:!1, subtree:!0, attributeOldValue:!1, characterDataOldValue:!1});
                  window.onunload = function m() {
                    try {
                      window.detachEvent("onunload", m), l.disconnect();
                    } catch (w) {
                    }
                  };
                  document.addEventListener("scroll", m => {
                    D.clear_image(m);
                  });
                }
              } catch (e) {
              }
            });
          }, 100);
        });
        var D = {image_urls_main:[], pf_preview_current:"", preview_images:[], tld:"", createNewImageElement:function(b, a, e) {
          b = b.createElement("img");
          b.style.borderTop = "2px solid #ff9f29";
          b.style.borderBottom = "3px solid grey";
          b.style.display = "block";
          b.style.position = "relative";
          b.style.padding = "5px";
          b.style.width = a + "px";
          b.style.height = e + "px";
          b.style.maxWidth = a + "px";
          b.style.maxHeight = e + "px";
          return b;
        }, preview_image:function(b, a, e, g, d, c) {
          let h;
          try {
            h = e.originalTarget.ownerDocument;
          } catch (m) {
            h = document;
          }
          if (!h.getElementById("pf_preview")) {
            var k = h.createElement("div");
            k.id = "pf_preview";
            k.addEventListener("mouseout", function(m) {
              D.clear_image(m);
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
            var l = Math.max(Math.floor(0.3 * h.defaultView.innerHeight), 128), p = Math.max(Math.floor(0.3 * h.defaultView.innerWidth), 128);
            k = 2;
            if (300 > p || 150 > l) {
              k = 1;
            }
            1000 < p && (p = 1000);
            1000 < l && (l = 1000);
            D.pf_preview_current.current = -1;
            D.pf_preview_current.a = d;
            D.pf_preview_current.href = g;
            D.pf_preview_current.size = Math.floor(1.1 * Math.min(p, l));
            h.defaultView.innerWidth - e.clientX < 1.05 * p && h.defaultView.innerHeight - e.clientY < 1.05 * l && (e = h.getElementById("pf_preview"), e.style.right = "", e.style.left = "6px");
            d = "https://graph.keepa.com/pricehistory.png?type=" + k + "&asin=" + d + "&domain=" + c + "&width=" + p + "&height=" + l;
            d = "undefined" == typeof b ? d + "&amazon=1&new=1&used=1&salesrank=1&range=365" : d + ("&amazon=" + b[0] + "&new=" + b[1] + "&used=" + b[2] + "&salesrank=" + b[3] + "&range=" + a + "&fba=" + b[10] + "&fbm=" + b[7] + "&bb=" + b[18] + "&ld=" + b[8] + "&pe=" + b[33] + "&bbu=" + b[32] + "&wd=" + b[9]);
            h.getElementById("pf_preview").style.display = "block";
            fetch(d).then(m => {
              try {
                if ("FAIL" === m.headers.get("screenshot-status")) {
                  return null;
                }
              } catch (w) {
              }
              return m.blob();
            }).then(m => {
              if (null != m) {
                if (D.pf_preview_current.firstChild) {
                  D.pf_preview_current.firstChild.setAttribute("src", URL.createObjectURL(m));
                } else {
                  let w = D.createNewImageElement(h, p, l);
                  D.pf_preview_current.appendChild(w);
                  w.setAttribute("src", URL.createObjectURL(m));
                }
              }
            });
          }
        }, clear_image:function(b) {
          let a;
          try {
            let e;
            try {
              e = b.originalTarget.ownerDocument;
            } catch (g) {
              e = document;
            }
            a = e.getElementById("pf_preview");
            a.style.display = "none";
            a.style.right = "2px";
            a.style.left = "";
            D.pf_preview_current.innerHTML = "";
          } catch (e) {
          }
        }, add_events:function(b, a, e, g, d, c) {
          0 <= g.indexOf("#") || 0 < g.indexOf("plattr=") || (D.tld = d, "pf_prevImg" != e.getAttribute("keepaPreview") && (e.addEventListener("mouseover", function(h) {
            D.preview_image(b, a, h, g, c, d);
            e.addEventListener("mouseout", function(k) {
              D.clear_image(k);
            }, {once:!0});
            return !0;
          }, !0), e.setAttribute("keepaPreview", "pf_prevImg")));
        }};
      }
    }
  }
})();


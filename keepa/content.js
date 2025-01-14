let onlyOnceLogStock = !0;
const scanner = function() {
  function X(F, x) {
    const C = {};
    if (null == document.body) {
      C.status = 599;
    } else {
      if (document.body.textContent.match("you're not a robot")) {
        C.status = 403;
      } else {
        for (var P = document.evaluate("//comment()", document, null, XPathResult.ANY_TYPE, null), O = P.iterateNext(), J = ""; O;) {
          J += O, O = P.iterateNext();
        }
        if (J.match(/automated access|api-services-support@/)) {
          C.status = 403;
        } else {
          if (J.match(/ref=cs_503_link/)) {
            C.status = 503;
          } else {
            if (F.scrapeFilters && 0 < F.scrapeFilters.length) {
              P = {};
              O = null;
              let G = "", f = null;
              const H = {};
              J = {};
              let Y = !1;
              const S = function(b, d, g) {
                var e = [];
                if (!b.selectors || 0 == b.selectors.length) {
                  if (!b.regExp) {
                    return G = "invalid selector, sel/regexp", !1;
                  }
                  e = document.getElementsByTagName("html")[0].innerHTML.match(new RegExp(b.regExp, "i"));
                  if (!e || e.length < b.reGroup) {
                    g = "regexp fail: html - " + b.name + g;
                    if (!1 === b.optional) {
                      return G = g, !1;
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
                  G = "selector no match: " + b.name + g;
                  return !1;
                }
                if (b.parentSelector && (c = [c[0].parentNode.querySelector(b.parentSelector)], null == c[0])) {
                  if (!0 === b.optional) {
                    return !0;
                  }
                  G = "parent selector no match: " + b.name + g;
                  return !1;
                }
                if ("undefined" != typeof b.multiple && null != b.multiple && (!0 === b.multiple && 1 > c.length || !1 === b.multiple && 1 < c.length)) {
                  if (!Y) {
                    return Y = !0, S(b, d, g);
                  }
                  g = "selector multiple mismatch: " + b.name + g + " found: " + c.length;
                  if (!1 === b.optional) {
                    b = "";
                    for (var h in c) {
                      !c.hasOwnProperty(h) || 1000 < b.length || (b += " - " + h + ": " + c[h].outerHTML + " " + c[h].getAttribute("class") + " " + c[h].getAttribute("id"));
                    }
                    G = g + b + " el: " + d.getAttribute("class") + " " + d.getAttribute("id");
                    return !1;
                  }
                  f += " // " + g;
                  return !0;
                }
                if (b.isListSelector) {
                  return H[b.name] = c, !0;
                }
                if (!b.attribute) {
                  return G = "selector attribute undefined?: " + b.name + g, !1;
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
                          return G = g, !1;
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
                        return G = g, !1;
                      }
                      f += " // " + g;
                      return !0;
                    }
                    if (b.regExp) {
                      k = h.match(new RegExp(b.regExp, "i"));
                      if (!k || k.length < b.reGroup) {
                        g = "regexp fail: " + h + " - " + b.name + g;
                        if (!1 === b.optional) {
                          return G = g, !1;
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
                  O = b;
                  for (let e in d) {
                    if (a) {
                      break;
                    }
                    q = d[e];
                    if (q.name != g.name) {
                      if (q.parentList) {
                        t = [];
                        if ("undefined" != typeof H[q.parentList]) {
                          t = H[q.parentList];
                        } else {
                          if (!0 === S(d[q.parentList], D, b)) {
                            t = H[q.parentList];
                          } else {
                            break;
                          }
                        }
                        J[q.parentList] || (J[q.parentList] = []);
                        for (let c in t) {
                          if (a) {
                            break;
                          }
                          if (!t.hasOwnProperty(c)) {
                            continue;
                          }
                          let h = S(q, t[c], b);
                          if (!1 === h) {
                            a = !0;
                            break;
                          }
                          if (!0 !== h) {
                            if (J[q.parentList][c] || (J[q.parentList][c] = {}), q.multiple) {
                              for (let k in h) {
                                h.hasOwnProperty(k) && !q.keepBR && (h[k] = h[k].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                              }
                              h = h.join("\u271c\u271c");
                              J[q.parentList][c][q.name] = h;
                            } else {
                              J[q.parentList][c][q.name] = q.keepBR ? h : h.replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " ");
                            }
                          }
                        }
                      } else {
                        t = S(q, D, b);
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
                          P[q.name] = t;
                        }
                      }
                    }
                  }
                  a = !0;
                }
              }
              if (null == O) {
                G += " // no pageVersion matched", C.status = 308, C.payload = [f, G, F.dbg1 ? document.getElementsByTagName("html")[0].innerHTML : ""];
              } else {
                if ("" === G) {
                  C.payload = [f];
                  C.scrapedData = P;
                  for (let b in J) {
                    C[b] = J[b];
                  }
                } else {
                  C.status = 305, C.payload = [f, G, F.dbg2 ? document.getElementsByTagName("html")[0].innerHTML : ""];
                }
              }
            } else {
              C.status = 306;
            }
          }
        }
      }
    }
    x(C);
  }
  let Z = !0;
  window.self === window.top && (Z = !1);
  window.sandboxHasRun && (Z = !1);
  Z && (window.sandboxHasRun = !0, window.addEventListener("message", function(F) {
    if (F.source == window.parent && F.data && (F.origin == "chrome-extension://" + chrome.runtime.id || F.origin.startsWith("moz-extension://") || F.origin.startsWith("safari-extension://"))) {
      var x = F.data.value;
      "data" == F.data.key && x.url && x.url == document.location && setTimeout(function() {
        null == document.body ? setTimeout(function() {
          X(x, function(C) {
            window.parent.postMessage({sandbox:C}, "*");
          });
        }, 1500) : X(x, function(C) {
          window.parent.postMessage({sandbox:C}, "*");
        });
      }, 800);
    }
  }, !1), window.parent.postMessage({sandbox:document.location + "", isUrlMsg:!0}, "*"));
  window.addEventListener("error", function(F, x, C, P, O) {
    "ipbakfmnjdenbmoenhicfmoojdojjjem" != chrome.runtime.id && "blfpbjkajgamcehdbehfdioapoiibdmc" != chrome.runtime.id || console.log(O);
    return !1;
  });
  return {scan:X};
}();
(function() {
  let X = !1, Z = !1;
  const F = window.opera || -1 < navigator.userAgent.indexOf(" OPR/");
  var x = -1 < navigator.userAgent.toLowerCase().indexOf("firefox");
  const C = -1 < navigator.userAgent.toLowerCase().indexOf("edge/"), P = /Apple Computer/.test(navigator.vendor) && /Safari/.test(navigator.userAgent), O = !F && !x && !C & !P, J = x ? "Firefox" : P ? "Safari" : O ? "Chrome" : F ? "Opera" : C ? "Edge" : "Unknown", q = chrome.runtime.getManifest().version;
  let t = !1;
  try {
    t = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
  } catch (a) {
  }
  if (!window.keepaHasRun) {
    window.keepaHasRun = !0;
    var G = 0;
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
          (b = b.asin) && /^([BC][A-Z0-9]{9}|\d{9}(!?X|\d))$/.test(b.trim()) && (b != f.ASIN ? (f.ASIN = b, f.swapIFrame()) : 0 != G ? (window.clearTimeout(G), G = 1) : G = window.setTimeout(function() {
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
        if (null == a.value) {
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
            } catch (n) {
            }
            onlyOnceLogStock && (onlyOnceLogStock = !1, console.log("Stock " + g + " " + h));
            try {
              if ((h || "com" == f.tld) && !f.revealWorking) {
                if (f.revealWorking = !0, document.getElementById("keepaMAP")) {
                  f.revealWorking = !1;
                } else {
                  var k = function() {
                    const n = new MutationObserver(function(A) {
                      setTimeout(function() {
                        f.revealMAP();
                      }, 100);
                      try {
                        n.disconnect();
                      } catch (r) {
                      }
                    });
                    n.observe(document.getElementById("keepaMAP").parentNode.parentNode.parentNode, {childList:!0, subtree:!0});
                  }, l = (n, A, r, v, y, w, M, N, R, L) => {
                    if (("undefined" == typeof f.revealCache[v] || null == n.parentElement.querySelector(".keepaStock")) && "undefined" !== typeof b) {
                      null == N && (N = b[f.domain]);
                      var K = "" == n.id && "aod-pinned-offer" == n.parentNode.id;
                      w = w || K;
                      try {
                        r = r || -1 != n.textContent.toLowerCase().indexOf("to cart to see") || !w && /(our price|always remove it|add this item to your cart|see product details in cart|see price in cart)/i.test(document.getElementById("price").textContent);
                      } catch (p) {
                      }
                      if (r || g) {
                        u(n, A, r, v, w);
                        var Q = p => {
                          const V = document.getElementById("keepaStock" + v);
                          if (null != V) {
                            V.innerHTML = "";
                            if (null != p && null != p.price && r) {
                              var T = document.createElement("div");
                              p = 5 == f.domain ? p.price : (Number(p.price) / 100).toFixed(2);
                              var W = new Intl.NumberFormat(" en-US en-GB de-DE fr-FR ja-JP en-CA zh-CN it-IT es-ES hi-IN es-MX pt-BR en-AU nl-NL tr-TR".split(" ")[f.domain], {style:"currency", currency:" USD GBP EUR EUR JPY CAD CNY EUR EUR INR MXN BRL AUD EUR TRY".split(" ")[f.domain]});
                              0 < p && (T.innerHTML = 'Price&emsp;&ensp;<span style="font-weight: bold;">' + W.format(p) + "</span>");
                              V.parentNode.parentNode.parentNode.prepend(T);
                            }
                            g && (p = f.revealCache[v].stock, 999 == p ? p = "999+" : 1000 == p ? p = "1000+" : -3 != f.revealCache[v].price && 1 > f.revealCache[v].price && (30 == p || R) && (p += "+"), T = document.createElement("span"), T.style = "font-weight: bold;", T.innerText = p + " ", p = document.createElement("span"), p.style = "color: #dedede;", p.innerText = " (revealed by \u271c Keepa)", W = document.createElement("span"), W.style = "color:#da4c33;", W.innerText = " order limit", V.appendChild(T), 
                            f.revealCache[v].limit && (0 < f.revealCache[v].orderLimit && (W.innerText += ": " + f.revealCache[v].orderLimit), V.appendChild(W)), (T = f.revealCache[v].errorCode) ? (p = document.createElement("span"), p.style = "color: #f7d1d1;", p.innerText = " (e_" + T + ")", null != f.revealCache[v].error && (p.title = f.revealCache[v].error + ". Contact info@keepa.com with a screenshot & URL for assistance."), V.appendChild(p)) : w && V.appendChild(p));
                          }
                        };
                        if ("undefined" != typeof f.revealCache[v] && -1 != f.revealCache[v]) {
                          "pending" != f.revealCache[v] && Q(f.revealCache[v]);
                        } else {
                          f.revealCache[v] = "pending";
                          K = n = "";
                          try {
                            n = document.querySelector("meta[name=encrypted-slate-token]").getAttribute("content"), K = document.querySelector("#aod-offer-list input#aod-atc-csrf-token").getAttribute("value");
                          } catch (p) {
                          }
                          chrome.runtime?.id && chrome.runtime.sendMessage({type:"getStock", asin:A, oid:v, sellerId:N, maxQty:M, hasPlus:R, isMAP:r, host:document.location.hostname, force:r, referer:document.location + "", domainId:f.domain, cachedStock:f.revealCache[N], offscreen:!1, atcCsrf:K || L, slateToken:n, session:y}, p => {
                            if ("undefined" == typeof p || null == p || !1 === p?.stock) {
                              if (p = document.getElementById("keepaMAP")) {
                                p.innerHTML = "";
                              }
                            } else {
                              f.revealCache[v] = p, f.revealCache[N] = p, Q(p);
                            }
                          });
                        }
                      }
                    }
                  }, u = (n, A, r, v, y) => {
                    A = "" == n.id && "aod-pinned-offer" == n.parentNode.id;
                    var w = (y ? n.parentElement : n).querySelector(".keepaMAP");
                    if (null == (y ? n.parentElement : n).querySelector(".keepaStock")) {
                      null != w && null != w.parentElement && w.parentElement.remove();
                      var M = y ? "165px" : "55px;height:20px;";
                      w = document.createElement("div");
                      w.id = "keepaMAP" + (y ? r + v : "");
                      w.className = "a-section a-spacing-none a-spacing-top-micro aod-clear-float keepaStock";
                      r = document.createElement("div");
                      r.className = "a-fixed-left-grid";
                      var N = document.createElement("div");
                      N.style = "padding-left:" + M;
                      y && (N.className = "a-fixed-left-grid-inner");
                      var R = document.createElement("div");
                      R.style = "width:" + M + ";margin-left:-" + M + ";float:left;";
                      R.className = "a-fixed-left-grid-col aod-padding-right-10 a-col-left";
                      M = document.createElement("div");
                      M.style = "padding-left:0%;float:left;";
                      M.className = "a-fixed-left-grid-col a-col-right";
                      var L = document.createElement("span");
                      L.className = "a-size-small a-color-tertiary";
                      var K = document.createElement("span");
                      K.style = "color: #dedede;";
                      K.innerText = "loading\u2026";
                      var Q = document.createElement("span");
                      Q.className = "a-size-small a-color-base";
                      Q.id = "keepaStock" + v;
                      Q.appendChild(K);
                      M.appendChild(Q);
                      R.appendChild(L);
                      N.appendChild(R);
                      N.appendChild(M);
                      r.appendChild(N);
                      w.appendChild(r);
                      L.className = "a-size-small a-color-tertiary";
                      f.revealWorking = !1;
                      g && (L.innerText = "Stock");
                      y ? A ? (n = document.querySelector("#aod-pinned-offer-show-more-link"), 0 == n.length && document.querySelector("#aod-pinned-offer-main-content-show-more"), n.prepend(w)) : n.parentNode.insertBefore(w, n.parentNode.children[n.parentNode.children.length - 1]) : n.appendChild(w);
                      y || k();
                    }
                  }, m = document.location.href, z = new MutationObserver(function(n) {
                    try {
                      var A = document.querySelectorAll("#aod-offer,#aod-pinned-offer");
                      if (null != A && 0 != A.length) {
                        n = null;
                        var r = A[0].querySelector('input[name="session-id"]');
                        if (r) {
                          n = r.getAttribute("value");
                        } else {
                          if (r = document.querySelector("#session-id")) {
                            n = document.querySelector("#session-id").value;
                          }
                        }
                        if (!n) {
                          var v = document.querySelectorAll("script");
                          for (const y of v) {
                            let w = y.text.match("ue_sid.?=.?'([0-9-]{19})'");
                            w && (n = w[1]);
                          }
                        }
                        if (n) {
                          for (const y of A) {
                            if (null != y && "DIV" == y.nodeName) {
                              let w;
                              r = 999;
                              let M = y.querySelector('input[name="offeringID.1"]');
                              if (M) {
                                w = M.getAttribute("value");
                              } else {
                                try {
                                  const L = y.querySelectorAll("[data-aod-atc-action]");
                                  if (0 < L.length) {
                                    let K = JSON.parse(L[0].dataset.aodAtcAction);
                                    w = K.oid;
                                    r = K.maxQty;
                                  }
                                } catch (L) {
                                  try {
                                    const K = y.querySelectorAll("[data-aw-aod-cart-api]");
                                    if (0 < K.length) {
                                      let Q = JSON.parse(K[0].dataset.awAodCartApi);
                                      w = Q.oid;
                                      r = Q.maxQty;
                                    }
                                  } catch (K) {
                                  }
                                }
                              }
                              if (!w) {
                                continue;
                              }
                              const N = y.children[0];
                              A = null;
                              if (d) {
                                for (v = 0; v < d.soldByOffers.length; v++) {
                                  let L = y.querySelector(d.soldByOffers[v]);
                                  if (null == L) {
                                    continue;
                                  }
                                  A = e(L.innerText);
                                  if (null != A) {
                                    break;
                                  }
                                  let K = L.getAttribute("href") || L.innerHTML;
                                  A = e(K);
                                  if (null != A) {
                                    break;
                                  }
                                }
                              }
                              const R = y.textContent.toLowerCase().includes("add to cart to see product details.");
                              l(N, f.ASIN, R, w, n, !0, r, A);
                            }
                          }
                        } else {
                          console.error("missing sessionId");
                        }
                      }
                    } catch (y) {
                      console.log(y), f.reportBug(y, "MAP error: " + m);
                    }
                  });
                  z.observe(document.querySelector("body"), {childList:!0, attributes:!1, characterData:!1, subtree:!0, attributeOldValue:!1, characterDataOldValue:!1});
                  window.onunload = function A() {
                    try {
                      window.detachEvent("onunload", A), z.disconnect();
                    } catch (r) {
                    }
                  };
                  var B = document.querySelector(d.soldOfferId);
                  c = null;
                  if (d) {
                    var E = document.querySelector(d.soldByBBForm);
                    E && (c = E.getAttribute("value"));
                    if (null == c) {
                      for (E = 0; E < d.soldByBB.length; E++) {
                        var I = document.querySelector(d.soldByBB[E]);
                        if (null != I && (c = e(I.innerHTML), null != c)) {
                          break;
                        }
                      }
                    }
                  }
                  if (null != B && null != B.value) {
                    var U = B.parentElement.querySelector("#session-id");
                    const A = B.parentElement.querySelector("#ASIN"), r = B.parentElement.querySelector("#selectQuantity #quantity > option:last-child");
                    let v = B.parentElement.querySelector('input[name*="CSRF" i]')?.getAttribute("value");
                    if (null != U && null != A) {
                      for (I = 0; I < d.mainEl.length; I++) {
                        let y = document.querySelector(d.mainEl[I]);
                        if (null != y) {
                          E = I = !1;
                          if (null != r) {
                            try {
                              0 < r.innerText.indexOf("+") && (E = !0), I = Number("" == r.value ? r.innerText.replaceAll("+", "") : r.value);
                            } catch (w) {
                              console.log(w);
                            }
                          }
                          l(y, A.value, !1, B.value, U.value, !1, I, c, E, v);
                          break;
                        }
                      }
                    }
                  }
                  var aa = document.getElementById("price");
                  if (null != aa && /(our price|always remove it|add this item to your cart|see product details in cart|see price in cart)/i.test(aa.textContent)) {
                    let A = document.getElementById("merchant-info");
                    U = B = "";
                    if (A) {
                      if (-1 == A.textContent.toLowerCase().indexOf("amazon.c")) {
                        const r = aa.querySelector('span[data-action="a-modal"]');
                        if (r) {
                          var ba = r.getAttribute("data-a-modal");
                          ba.match(/offeringID\.1=(.*?)&amp/) && (B = RegExp.$1);
                        }
                        if (0 == B.length) {
                          if (ba.match('map_help_pop_(.*?)"')) {
                            U = RegExp.$1;
                          } else {
                            f.revealWorking = !1;
                            return;
                          }
                        }
                      }
                      if (null != B && 10 < B.length) {
                        const r = document.querySelector("#session-id");
                        l(aa, f.ASIN, !1, B, r.value, !1, !1, U);
                      }
                    } else {
                      f.revealWorking = !1;
                    }
                  } else {
                    f.revealWorking = !1;
                  }
                }
              }
            } catch (n) {
              f.revealWorking = !1, console.log(n);
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
              f.iframeStorage.contentWindow.postMessage({origin:"keepaContentScript", key:"updateASIN", value:{d:f.domain, a:f.ASIN, eType:J, eVersion:q, url:document.location.href}}, "*");
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
              var m = a.offsetTop / u;
              if (0.5 < m || 0 > m) {
                l = f.getAFComment(l), null != l && (m = a.offsetTop / u, 0.5 > m && (a = l));
              }
              if (a.parentNode) {
                l = document.querySelector(".container_vertical_middle");
                "burjPageDivider" == a.id ? (a.parentNode.insertBefore(e, a), b || a.parentNode.insertBefore(c, e.nextSibling)) : "bottomRow" == a.id ? (a.parentNode.insertBefore(e, a), b || a.parentNode.insertBefore(c, e.nextSibling)) : h ? (a.parentNode.insertBefore(e, a.nextSibling), b || a.parentNode.insertBefore(c, e.nextSibling)) : null != l ? (a = l, a.parentNode.insertBefore(e, a.nextSibling), b || a.parentNode.insertBefore(c, e.nextSibling)) : (a.parentNode.insertBefore(e, a), b || a.parentNode.insertBefore(c, 
                e));
                f.iframeStorage = k;
                e.style.display = f.cssFlex;
                var z = !1, B = 5;
                if (!t) {
                  var E = setInterval(function() {
                    if (0 >= B--) {
                      clearInterval(E);
                    } else {
                      var U = null != document.getElementById("keepa");
                      try {
                        if (!U) {
                          throw f.getPlaceholderAndInsertIFrame(f.insertIFrame), 1;
                        }
                        if (z) {
                          throw 1;
                        }
                        document.getElementById("keepa").contentDocument.location = iframeUrl;
                      } catch (aa) {
                        clearInterval(E);
                      }
                    }
                  }, 4000), I = function() {
                    z = !0;
                    k.removeEventListener("load", I, !1);
                    f.synchronizeIFrame();
                  };
                  k.addEventListener("load", I, !1);
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
          let e = {d:f.domain, a:f.ASIN, eType:J, eVersion:q, url:document.location.href};
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
        null != d.url && d.url.startsWith("blob:") || (d.keepaType = O ? "keepaChrome" : F ? "keepaOpera" : P ? "keepaSafari" : C ? "keepaEdge" : "keepaFirefox", d.version = q, chrome.storage.local.get("token", function(e) {
          "undefined" == typeof e && (e = {token:"undefined"});
          f.httpPost("https://dyn.keepa.com/service/bugreport/?user=" + e.token + "&type=" + J, JSON.stringify(d));
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
      f.reportBug(null, null, a);
      return !1;
    };
    if (window.self == window.top && !(/.*music\.amazon\..*/.test(document.location.href) || /.*primenow\.amazon\..*/.test(document.location.href) || /.*amazonlive-portal\.amazon\..*/.test(document.location.href) || /.*amazon\.com\/restaurants.*/.test(document.location.href))) {
      x = function(a) {
        chrome.runtime.sendMessage({type:"sendData", val:{key:"m1", payload:[a]}}, function() {
        });
      };
      var H = document.location.href, Y = !1;
      document.addEventListener("DOMContentLoaded", function(a) {
        if (!Y) {
          try {
            if (H.startsWith("https://test.keepa.com") || H.startsWith("https://keepa.com")) {
              let b = document.createElement("div");
              b.id = "extension";
              b.setAttribute("type", J);
              b.setAttribute("version", q);
              document.body.appendChild(b);
              Y = !0;
            }
          } catch (b) {
          }
        }
      });
      var S = !1;
      chrome.runtime.sendMessage({type:"isActive"});
      if (!/((\/images)|(\/review)|(\/customer-reviews)|(ask\/questions)|(\/product-reviews))/.test(H) && !/\/e\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/.test(H) && (H.match(/^https:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|nl|in|com\.mx|com\.br|com\.au)\/[^.]*?(\/|[?&]ASIN=)([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) || H.match(/^https:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|nl|in|com\.mx|com\.br|com\.au)\/(.*?)\/dp\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))\//) || H.match(/^https:\/\/.*?\.amzn\.(com).*?\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/))) {
        f.onPageLoad(!1), S = !0;
      } else if (!H.match(/^https:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|nl|es|in|com\.mx|com\.br|com\.au)\/[^.]*?\/(wishlist|registry)/) && !H.match(/^htt(p|ps):\/\/w*?\.amzn\.(com)[^.]*?\/(wishlist|registry)/)) {
        if (H.match("^https://.*?(?:seller).*?.amazon.(de|com|co.uk|co.jp|ca|fr|it|nl|es|in|com.mx|com.br|com.au)/")) {
          x("s" + f.getDomain(RegExp.$1));
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
          H.match(/^https:\/\/.*?(?:af.?ilia|part|assoc).*?\.amazon\.(de|com|co\.uk|co\.jp|nl|ca|fr|it|es|in|com\.mx|com\.br|com\.au)\/home/) && x("a" + f.getDomain(RegExp.$1));
        }
      }
      if (!t) {
        x = /^https:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|nl|in|com\.mx|com\.br|com\.au)\/(s([\/?])|gp\/bestsellers\/|gp\/search\/|.*?\/b\/)/;
        (S || H.match(x)) && document.addEventListener("DOMContentLoaded", function(a) {
          let b = null;
          chrome.runtime.sendMessage({type:"getFilters"}, function(d) {
            b = d;
            if (null != b && null != b.value) {
              let g = function() {
                let l = H.match("^https?://.*?.amazon.(de|com|co.uk|co.jp|ca|fr|it|es|in|com.br|nl|com.mx)/");
                if (S || l) {
                  let u = f.getDomain(RegExp.$1);
                  scanner.scan(d.value, function(m) {
                    m.key = "f1";
                    m.domainId = u;
                    chrome.runtime.sendMessage({type:"sendData", val:m}, function(z) {
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
        x = document.location.href;
        x.match("^https://.*?.amazon.(de|com|co.uk|co.jp|ca|fr|it|es|in|nl|com.mx|com.br|com.au)/") && -1 == x.indexOf("aws.amazon.") && -1 == x.indexOf("music.amazon.") && -1 == x.indexOf("services.amazon.") && -1 == x.indexOf("primenow.amazon.") && -1 == x.indexOf("kindle.amazon.") && -1 == x.indexOf("watch.amazon.") && -1 == x.indexOf("developer.amazon.") && -1 == x.indexOf("skills-store.amazon.") && -1 == x.indexOf("pay.amazon.") && document.addEventListener("DOMContentLoaded", function(a) {
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
                      var m = u.href;
                      /\/images/.test(m) || /\/e\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/.test(m) || !m.match(/^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|in|com\.mx)\/[^.]*?(?:\/|\?ASIN=)([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) && !m.match(/^https?:\/\/.*?\.amzn\.(com)[^.]*?\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) || -1 == m.indexOf("offer-listing") && D.add_events(g, e, u, m, RegExp.$1, RegExp.$2);
                    }
                  }, l = new MutationObserver(function(u) {
                    u.forEach(function(m) {
                      try {
                        if ("childList" === m.type) {
                          for (c = 0; c < m.addedNodes.length; c++) {
                            k(m.addedNodes[c]);
                            for (var z = m.addedNodes[c].children; null != z && "undefined" != z && 0 < z.length;) {
                              var B = [];
                              for (let E = 0; E < z.length; E++) {
                                k(z[E]);
                                try {
                                  if (z[E].children && 0 < z[E].children.length) {
                                    for (let I = 0; I < z[E].children.length && 30 > I; I++) {
                                      B.push(z[E].children[I]);
                                    }
                                  }
                                } catch (I) {
                                }
                              }
                              z = B;
                            }
                          }
                        } else {
                          if (B = m.target.getElementsByTagName("a"), "undefined" != B && null != B) {
                            for (z = 0; z < B.length; z++) {
                              k(B[z]);
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
                    } catch (z) {
                    }
                  };
                  document.addEventListener("scroll", m => {
                    D.clear_image(m);
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
            fetch(e).then(m => {
              try {
                if ("FAIL" === m.headers.get("screenshot-status")) {
                  return null;
                }
              } catch (z) {
              }
              return m.blob();
            }).then(m => {
              if (null != m) {
                if (D.pf_preview_current.firstChild) {
                  D.pf_preview_current.firstChild.setAttribute("src", URL.createObjectURL(m));
                } else {
                  let z = D.createNewImageElement(h, u, l);
                  D.pf_preview_current.appendChild(z);
                  z.setAttribute("src", URL.createObjectURL(m));
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


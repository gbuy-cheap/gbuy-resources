function clear() {
}
function cleanText(k) {
  return k.replace(/(\r\n|\n|\r)/gm, " ").trim().replace(/\s{2,}/g, " ");
}
const robot = /automated access|api-services-support@/;
chrome.runtime.onMessage.addListener((k, l, F) => {
  if ("offscreen" != k.target) {
    return F({error:"Invalid target"}), !1;
  }
  const m = {type:"offscreen"};
  if ("undefined" == typeof k.data) {
    return console.error("offscreen empty data msg: ", JSON.stringify(k)), m.errorCode = 466, F(m), !1;
  }
  putInIframe(k.data, A => {
    const d = document.getElementById("keepa_data");
    if (A) {
      m.errorCode = 411;
    } else {
      try {
        parseIframeContent(d.contentWindow.document, k.data.message, k.data.content, k.data.stockData, t => {
          m.response = t;
          F(m);
          d.src = "";
          d.removeAttribute("srcdoc");
          clear();
        });
        return;
      } catch (t) {
        console.error(t), m.error = t, m.errorCode = 410;
      }
    }
    F(m);
    d.src = "";
    d.removeAttribute("srcdoc");
    clear();
  });
  return !0;
});
function putInIframe(k, l) {
  try {
    const m = document.getElementById("keepa_data");
    m.src = "";
    let A = k.content.replace(/src=".*?"/g, 'src=""');
    k.block && (A = A.replace(new RegExp(k.block, "g"), ""));
    let d = !1;
    if (A) {
      m.srcdoc = A;
      var F = setTimeout(() => {
        d || (d = !0, console.warn("Iframe load timed out."), l(!0));
      }, 5000);
      m.onload = function() {
        d || (m.onload = void 0, d = !0, l(!1));
      };
      m.onerror = function() {
        d || (d = !0, clearTimeout(F), l(!0));
      };
    } else {
      l(!0);
    }
  } catch (m) {
    l(!0), console.error(JSON.stringify(k) + " " + m);
  }
}
let AmazonSellerIds = "1 ATVPDKIKX0DER A3P5ROKL5A1OLE A3JWKAKR8XB7XF A1X6FK5RDHNB96 AN1VRQENFRJN5 A3DWYIK6Y9EEQB A1AJ19PSB66TGU A11IL2PNWYJU7H A1AT7YVPFBWXBL A3P5ROKL5A1OLE AVDBXBAVVSXLQ A1ZZFT5FULY4LN ANEGB3WVEVKZB A17D2BRD4YMT0X".split(" ");
function parseIframeContent(k, l, F, m, A) {
  let d = {};
  try {
    for (var t = k.evaluate("//comment()", k, null, XPathResult.ANY_TYPE, null), x = t.iterateNext(), y = ""; x;) {
      y += x.textContent, x = t.iterateNext();
    }
    if (k.querySelector("body").textContent.match(robot) || y.match(robot)) {
      d.status = 403;
      A(d);
      return;
    }
  } catch (K) {
  }
  if (l.scrapeFilters && 0 < l.scrapeFilters.length) {
    const K = {}, p = {}, P = {};
    let Q, u = "", G = null;
    const M = () => {
      if ("" === u) {
        d.payload = [G];
        d.scrapedData = P;
        for (let a in p) {
          d[a] = p[a];
        }
      } else {
        d.status = 305, d.payload = [G, u, ""];
      }
      A(d);
    };
    t = function(a, D, f) {
      var b = [];
      if (!a.selectors || 0 == a.selectors.length) {
        if (!a.regExp) {
          return u = "invalid selector, sel/regexp (" + a.name + ")", !1;
        }
        b = k.querySelector("html").innerHTML.match(new RegExp(a.regExp));
        if (!b || b.length < a.reGroup) {
          f = "regexp fail: html - " + a.name + f;
          if (!1 === a.optional) {
            return u = f, !1;
          }
          G += " // " + f;
          return !0;
        }
        return b[a.reGroup];
      }
      let c = [];
      a.selectors.find(e => {
        e = D.querySelectorAll(e);
        return 0 < e.length ? (c = e, !0) : !1;
      });
      if (0 === c.length) {
        if (!0 === a.optional) {
          return !0;
        }
        u = "selector no match: " + a.name + f;
        return !1;
      }
      if (a.parentSelector && (c = [c[0].parentNode.querySelector(a.parentSelector)], null == c[0])) {
        if (!0 === a.optional) {
          return !0;
        }
        u = "parent selector no match: " + a.name + f;
        return !1;
      }
      if ("undefined" != typeof a.multiple && null != a.multiple && (!0 === a.multiple && 1 > c.length || !1 === a.multiple && 1 < c.length)) {
        f = "selector multiple mismatch: " + a.name + f + " found: " + c.length;
        if (!1 === a.optional) {
          return u = f, !1;
        }
        G += " // " + f;
        return !0;
      }
      if (a.isListSelector) {
        return K[a.name] = c, !0;
      }
      if (!a.attribute) {
        return u = "selector attribute undefined?: " + a.name + f, !1;
      }
      for (let e in c) {
        if (c.hasOwnProperty(e)) {
          var n = c[e];
          if (!n) {
            break;
          }
          if (a.childNode) {
            a.childNode = Number(a.childNode);
            var r = n.childNodes;
            if (r.length < a.childNode) {
              f = "childNodes fail: " + r.length + " - " + a.name + f;
              if (!1 === a.optional) {
                return u = f, !1;
              }
              G += " // " + f;
              return !0;
            }
            n = r[a.childNode];
          }
          r = null;
          r = "text" == a.attribute ? n.textContent : "html" == a.attribute ? n.innerHTML : n.getAttribute(a.attribute);
          if (!r || 0 == r.length || 0 == r.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/g, "").length) {
            f = "selector attribute null: " + a.name + f;
            if (!1 === a.optional) {
              return u = f, !1;
            }
            G += " // " + f;
            return !0;
          }
          if (a.regExp) {
            n = r.match(new RegExp(a.regExp));
            if (!n || n.length < a.reGroup) {
              f = "regexp fail: " + r + " - " + a.name + f;
              if (!1 === a.optional) {
                return u = f, !1;
              }
              G += " // " + f;
              return !0;
            }
            b.push("undefined" == typeof n[a.reGroup] ? n[0] : n[a.reGroup]);
          } else {
            b.push(r);
          }
          if (!a.multiple) {
            break;
          }
        }
      }
      return a.multiple ? b : b[0];
    };
    for (var B in l.scrapeFilters) {
      x = l.scrapeFilters[B];
      y = x.pageVersionTest;
      var C = [], g = !1;
      for (var h of y.selectors) {
        if (C = k.querySelectorAll(h), 0 < C.length) {
          g = !0;
          break;
        }
      }
      if (!g) {
        continue;
      }
      if ("undefined" != typeof y.multiple && null != y.multiple) {
        if (!0 === y.multiple && 2 > C.length) {
          continue;
        }
        if (!1 === y.multiple && 1 < C.length) {
          continue;
        }
      }
      if (y.attribute && (g = null, g = "text" == y.attribute ? "" : C[0].getAttribute(y.attribute), null == g)) {
        continue;
      }
      Q = B;
      let a = 0, D = [];
      for (let f in x) {
        const b = x[f];
        if (b.name != y.name) {
          if (C = k, b.parentList) {
            h = [];
            if ("undefined" != typeof K[b.parentList]) {
              h = K[b.parentList];
            } else {
              if (!0 === t(x[b.parentList], C, B)) {
                h = K[b.parentList];
              } else {
                break;
              }
            }
            p[b.parentList] || (p[b.parentList] = []);
            C = 0;
            for (let c in h) {
              if (h.hasOwnProperty(c)) {
                if ("lager" == b.name) {
                  g = e => {
                    e = e.trim();
                    let z = m.amazonNames[e];
                    return z ? "W" === z ? m.warehouseIds[l.domainId] : "A" === z ? m.amazonIds[l.domainId] : z : (e = e.match(new RegExp(m.sellerId))) && e[1] ? e[1] : null;
                  };
                  let n = l.request.userSession, r = new URL(l.url);
                  C++;
                  try {
                    let e = null, z = null, v = x.sellerId, I = l.url.match(/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/)[1];
                    if (null == I || 9 > I.length) {
                      continue;
                    }
                    if ("undefined" == typeof v || null == v || null == I || 2 > I.length) {
                      continue;
                    }
                    p[v.parentList][c] && p[v.parentList][c][v.name] ? z = p[v.parentList][c][v.name] : (z = t(v, h[c], B), "boolean" === typeof z && x.sellerName && (z = t(x.sellerName, h[c], B)));
                    if ("boolean" === typeof z) {
                      continue;
                    }
                    if (0 == z.indexOf("https") && p[v.parentList][c].sellerName) {
                      let q = g(p[v.parentList][c].sellerName);
                      null != q && (e = q);
                    }
                    null == e && (e = g(z));
                    if (null == e) {
                      g = !1;
                      try {
                        p[v.parentList][c] && p[v.parentList][c].sellerName && -1 < p[v.parentList][c].sellerName.indexOf("Amazon") && (null == e || 12 > (e + "").length) && (g = !0);
                      } catch (q) {
                        console.error(q);
                      }
                      e = g ? AmazonSellerIds[l.domainId] : e.match(/&seller=([A-Z0-9]{9,21})($|&)/)[1];
                    }
                    let R, H;
                    b.stockForm && (R = h[c].querySelector(b.stockForm));
                    b.stockOfferId && (H = h[c].querySelector(b.stockOfferId));
                    H &&= H.getAttribute(b.stockForm);
                    let N = 999;
                    if (!H) {
                      try {
                        let q = JSON.parse(b.regExp);
                        if (q.sel1) {
                          try {
                            let w = JSON.parse(h[c].querySelectorAll(q.sel1)[0].dataset[q.dataSet1]);
                            H = w[q.val1];
                            N = w.maxQty;
                          } catch (w) {
                          }
                        }
                        if (!H && q.sel2) {
                          try {
                            let w = JSON.parse(h[c].querySelectorAll(q.sel2)[0].dataset[q.dataSet2]);
                            H = w[q.val2];
                            N = w.maxQty;
                          } catch (w) {
                          }
                        }
                      } catch (q) {
                      }
                    }
                    let O = !1;
                    try {
                      O = p[b.parentList][c].isMAP || /(our price|to cart to see|always remove it|add this item to your cart|see product details in cart|see price in cart)/i.test(h[c].textContent.toLowerCase());
                    } catch (q) {
                    }
                    let T = O || l.maxStockUpdates && a < l.maxStockUpdates;
                    if (R && e && null != n && T) {
                      a++;
                      let q = c + "";
                      const w = x.atcCsrf;
                      let S = null;
                      if (null != w) {
                        try {
                          for (const E of w.selectors) {
                            let J = k.querySelectorAll(E);
                            if (0 < J.length) {
                              J = J[0];
                              S = attribute = "text" == w.attribute ? J.textContent : "html" == w.attribute ? J.innerHTML : J.getAttribute(w.attribute);
                              break;
                            }
                          }
                        } catch (E) {
                        }
                      }
                      let L = !0;
                      setTimeout(() => {
                        chrome.runtime.sendMessage({type:"getStock", asin:I, oid:H, host:r.host, maxQty:N, sellerId:e, slateToken:l.slateToken, atcCsrf:S, onlyMaxQty:9 == b.reGroup, isMAP:O, referer:r.host + "/dp/" + I, domainId:l.domainId, force:!0, session:n, offscreen:!0}, E => {
                          L && ("undefined" == typeof E || null != E.error && 430 == E.errorCode ? console.log(E.errorCode, E) : (L = !1, p[b.parentList][q][b.name] = E), 0 == --a && M(d));
                        });
                        setTimeout(() => {
                          L && 0 == --a && (L = !1, M(d));
                        }, 4000 + 1800 * a);
                      }, 1);
                    }
                  } catch (e) {
                    console.error(e);
                  }
                } else {
                  g = t(b, h[c], B);
                  if (!1 === g) {
                    break;
                  }
                  if (!0 !== g) {
                    if (p[b.parentList][c] || (p[b.parentList][c] = {}), b.multiple) {
                      for (let n in g) {
                        g.hasOwnProperty(n) && !b.keepBR && (g[n] = g[n].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                      }
                      g = g.join("\u271c\u271c");
                      p[b.parentList][c][b.name] = g;
                    } else {
                      p[b.parentList][c][b.name] = b.keepBR ? g : g.replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " ");
                    }
                  }
                }
              }
            }
          } else {
            h = t(b, C, B);
            if (!1 === h) {
              break;
            }
            !0 !== h && (b.keepBR || (h = b.multiple ? h.map(cleanText) : cleanText(h)), b.multiple && (h = h.join()), P[b.name] = h);
          }
        }
      }
      try {
        if (1 == D.length || "500".endsWith("8") && 0 < D.length) {
          D.shift()();
        } else {
          for (B = 0; B < D.length; B++) {
            setTimeout(() => {
              0 < D.length && D.shift()();
            }, 500 * B);
          }
        }
      } catch (f) {
      }
      0 == a && 0 == D.length && M();
      break;
    }
    null == Q && (u += " // no pageVersion matched", d.payload = [G, u, l.dbg1 ? F : ""], d.status = 308, A(d));
  } else {
    d.status = 306, A(d);
  }
}
;

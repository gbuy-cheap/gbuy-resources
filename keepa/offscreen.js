function clear() {
}
function cleanText(l) {
  return l.replace(/(\r\n|\n|\r)/gm, " ").trim().replace(/\s{2,}/g, " ");
}
const robot = /automated access|api-services-support@/;
chrome.runtime.onMessage.addListener((l, g, G) => {
  if ("offscreen" != l.target) {
    return G({error:"Invalid target"}), !1;
  }
  const m = {type:"offscreen"};
  if ("undefined" == typeof l.data) {
    return console.error("offscreen empty data msg: ", JSON.stringify(l)), m.errorCode = 466, G(m), !1;
  }
  putInIframe(l.data, A => {
    const d = document.getElementById("keepa_data");
    if (A) {
      m.errorCode = 411;
    } else {
      try {
        parseIframeContent(d.contentWindow.document, l.data.message, l.data.content, l.data.stockData, t => {
          m.response = t;
          G(m);
          d.src = "";
          d.removeAttribute("srcdoc");
          clear();
        });
        return;
      } catch (t) {
        console.error(t), m.error = t, m.errorCode = 410;
      }
    }
    G(m);
    d.src = "";
    d.removeAttribute("srcdoc");
    clear();
  });
  return !0;
});
function putInIframe(l, g) {
  try {
    const m = document.getElementById("keepa_data");
    m.src = "";
    let A = l.content.replace(/src=".*?"/g, 'src=""');
    l.block && (A = A.replace(new RegExp(l.block, "g"), ""));
    let d = !1;
    if (A) {
      m.srcdoc = A;
      var G = setTimeout(() => {
        d || (d = !0, console.warn("Iframe load timed out."), g(!0));
      }, 5000);
      m.onload = function() {
        d || (m.onload = void 0, d = !0, g(!1));
      };
      m.onerror = function() {
        d || (d = !0, clearTimeout(G), g(!0));
      };
    } else {
      g(!0);
    }
  } catch (m) {
    g(!0), console.error(JSON.stringify(l) + " " + m);
  }
}
let AmazonSellerIds = "1 ATVPDKIKX0DER A3P5ROKL5A1OLE A3JWKAKR8XB7XF A1X6FK5RDHNB96 AN1VRQENFRJN5 A3DWYIK6Y9EEQB A1AJ19PSB66TGU A11IL2PNWYJU7H A1AT7YVPFBWXBL A3P5ROKL5A1OLE AVDBXBAVVSXLQ A1ZZFT5FULY4LN ANEGB3WVEVKZB A17D2BRD4YMT0X".split(" ");
function parseIframeContent(l, g, G, m, A) {
  let d = {};
  try {
    for (var t = l.evaluate("//comment()", l, null, XPathResult.ANY_TYPE, null), x = t.iterateNext(), y = ""; x;) {
      y += x.textContent, x = t.iterateNext();
    }
    if (l.querySelector("body").textContent.match(robot) || y.match(robot)) {
      d.status = 403;
      A(d);
      return;
    }
  } catch (L) {
  }
  if (g.scrapeFilters && 0 < g.scrapeFilters.length) {
    const L = {}, p = {}, P = {};
    let Q, u = "", H = null;
    const M = () => {
      if ("" === u) {
        d.payload = [H];
        d.scrapedData = P;
        for (let a in p) {
          d[a] = p[a];
        }
      } else {
        d.status = 305, d.payload = [H, u, ""];
      }
      A(d);
    };
    t = function(a, D, f) {
      var b = [];
      if (!a.selectors || 0 == a.selectors.length) {
        if (!a.regExp) {
          return u = "invalid selector, sel/regexp (" + a.name + ")", !1;
        }
        b = l.querySelector("html").innerHTML.match(new RegExp(a.regExp));
        if (!b || b.length < a.reGroup) {
          f = "regexp fail: html - " + a.name + f;
          if (!1 === a.optional) {
            return u = f, !1;
          }
          H += " // " + f;
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
        H += " // " + f;
        return !0;
      }
      if (a.isListSelector) {
        return L[a.name] = c, !0;
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
              H += " // " + f;
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
            H += " // " + f;
            return !0;
          }
          if (a.regExp) {
            n = r.match(new RegExp(a.regExp));
            if (!n || n.length < a.reGroup) {
              f = "regexp fail: " + r + " - " + a.name + f;
              if (!1 === a.optional) {
                return u = f, !1;
              }
              H += " // " + f;
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
    for (var B in g.scrapeFilters) {
      x = g.scrapeFilters[B];
      y = x.pageVersionTest;
      var C = [], h = !1;
      for (var k of y.selectors) {
        if (C = l.querySelectorAll(k), 0 < C.length) {
          h = !0;
          break;
        }
      }
      if (!h) {
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
      if (y.attribute && (h = null, h = "text" == y.attribute ? "" : C[0].getAttribute(y.attribute), null == h)) {
        continue;
      }
      Q = B;
      let a = 0, D = [];
      for (let f in x) {
        const b = x[f];
        if (b.name != y.name) {
          if (C = l, b.parentList) {
            k = [];
            if ("undefined" != typeof L[b.parentList]) {
              k = L[b.parentList];
            } else {
              if (!0 === t(x[b.parentList], C, B)) {
                k = L[b.parentList];
              } else {
                break;
              }
            }
            p[b.parentList] || (p[b.parentList] = []);
            C = 0;
            for (let c in k) {
              if (k.hasOwnProperty(c)) {
                if ("lager" == b.name) {
                  h = e => {
                    e = e.trim();
                    let z = m.amazonNames[e];
                    return z ? "W" === z ? m.warehouseIds[g.domainId] : "A" === z ? m.amazonIds[g.domainId] : z : (e = e.match(new RegExp(m.sellerId))) && e[1] ? e[1] : null;
                  };
                  let n = g.request.userSession, r = new URL(g.url);
                  C++;
                  try {
                    let e = null, z = null, v = x.sellerId, I = g.url.match(/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/)[1];
                    if (null == I || 9 > I.length) {
                      continue;
                    }
                    if ("undefined" == typeof v || null == v || null == I || 2 > I.length) {
                      continue;
                    }
                    p[v.parentList][c] && p[v.parentList][c][v.name] ? z = p[v.parentList][c][v.name] : (z = t(v, k[c], B), "boolean" === typeof z && x.sellerName && (z = t(x.sellerName, k[c], B)));
                    if ("boolean" === typeof z) {
                      continue;
                    }
                    if (0 == z.indexOf("https") && p[v.parentList][c].sellerName) {
                      let q = h(p[v.parentList][c].sellerName);
                      null != q && (e = q);
                    }
                    null == e && (e = h(z));
                    if (null == e) {
                      h = !1;
                      try {
                        p[v.parentList][c] && p[v.parentList][c].sellerName && -1 < p[v.parentList][c].sellerName.indexOf("Amazon") && (null == e || 12 > (e + "").length) && (h = !0);
                      } catch (q) {
                        console.error(q);
                      }
                      e = h ? AmazonSellerIds[g.domainId] : e.match(/&seller=([A-Z0-9]{9,21})($|&)/)[1];
                    }
                    let R, E;
                    b.stockForm && (R = k[c].querySelector(b.stockForm));
                    b.stockOfferId && (E = k[c].querySelector(b.stockOfferId));
                    E &&= E.getAttribute(b.stockForm);
                    let N = 999;
                    if (!E) {
                      try {
                        let q = JSON.parse(b.regExp);
                        if (q.sel1) {
                          try {
                            let w = JSON.parse(k[c].querySelectorAll(q.sel1)[0].dataset[q.dataSet1]);
                            E = w[q.val1];
                            N = w.maxQty;
                          } catch (w) {
                          }
                        }
                        if (!E && q.sel2) {
                          try {
                            let w = JSON.parse(k[c].querySelectorAll(q.sel2)[0].dataset[q.dataSet2]);
                            E = w[q.val2];
                            N = w.maxQty;
                          } catch (w) {
                          }
                        }
                      } catch (q) {
                      }
                    }
                    let O = !1;
                    try {
                      O = p[b.parentList][c].isMAP || /(our price|to cart to see|always remove it|add this item to your cart|see product details in cart|see price in cart)/i.test(k[c].textContent.toLowerCase());
                    } catch (q) {
                    }
                    let T = O || g.maxStockUpdates && a < g.maxStockUpdates;
                    if (R && e && null != n && T) {
                      a++;
                      let q = c + "";
                      const w = x.atcCsrf;
                      let S = null;
                      if (null != w) {
                        try {
                          for (const J of w.selectors) {
                            let F = l.querySelectorAll(J);
                            if (0 < F.length) {
                              F = F[0];
                              S = attribute = "text" == w.attribute ? F.textContent : "html" == w.attribute ? F.innerHTML : F.getAttribute(w.attribute);
                              break;
                            }
                          }
                        } catch (J) {
                        }
                      }
                      let K = !0;
                      setTimeout(() => {
                        chrome.runtime.sendMessage({type:"getStock", asin:I, oid:E, host:r.host, maxQty:N, sellerId:e, slateToken:g.slateToken, atcCsrf:S, onlyMaxQty:9 == b.reGroup, isMAP:O, referer:r.host + "/dp/" + I, domainId:g.domainId, force:!0, session:n, offscreen:!0}, J => {
                          K && ("undefined" == typeof J || null != J.error && 430 == J.errorCode ? chrome.runtime.sendMessage({type:"getStock", asin:I, oid:E, host:r.host, maxQty:N, sellerId:e, onlyMaxQty:9 == b.reGroup, isMAP:O, referer:r.host + "/dp/" + I, domainId:g.domainId, force:!0, session:n}, F => {
                            K && (K = !1, "undefined" != typeof F && (p[b.parentList][q][b.name] = F), 0 == --a && M(d));
                          }) : (K = !1, p[b.parentList][q][b.name] = J, 0 == --a && M(d)));
                        });
                        setTimeout(() => {
                          K && 0 == --a && (K = !1, M(d));
                        }, 4000 + 1800 * a);
                      }, 1);
                    }
                  } catch (e) {
                    console.error(e);
                  }
                } else {
                  h = t(b, k[c], B);
                  if (!1 === h) {
                    break;
                  }
                  if (!0 !== h) {
                    if (p[b.parentList][c] || (p[b.parentList][c] = {}), b.multiple) {
                      for (let n in h) {
                        h.hasOwnProperty(n) && !b.keepBR && (h[n] = h[n].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                      }
                      h = h.join("\u271c\u271c");
                      p[b.parentList][c][b.name] = h;
                    } else {
                      p[b.parentList][c][b.name] = b.keepBR ? h : h.replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " ");
                    }
                  }
                }
              }
            }
          } else {
            k = t(b, C, B);
            if (!1 === k) {
              break;
            }
            !0 !== k && (b.keepBR || (k = b.multiple ? k.map(cleanText) : cleanText(k)), b.multiple && (k = k.join()), P[b.name] = k);
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
    null == Q && (u += " // no pageVersion matched", d.payload = [H, u, g.dbg1 ? G : ""], d.status = 308, A(d));
  } else {
    d.status = 306, A(d);
  }
}
;

function clear() {
}
function cleanText(m) {
  return m && "string" === typeof m ? m.replace(/(\r\n|\n|\r)/gm, " ").trim().replace(/\s{2,}/g, " ") : "";
}
const robot = /automated access|api-services-support@/;
chrome.runtime.onMessage.addListener((m, h, t) => {
  if ("offscreen" !== m.target) {
    return t({response:{status:588, error:"Invalid target"}}), !1;
  }
  if ("undefined" === typeof m.data) {
    return t({response:{status:466, error:"Empty data message"}}), !1;
  }
  putInIframe(m.data, (u, A) => {
    const f = document.getElementById("keepa_data");
    if (f) {
      if (u) {
        t({response:{status:411, error:A}});
      } else {
        try {
          parseIframeContent(f.contentWindow.document, m.data.message, m.data.content, m.data.stockData, p => {
            200 !== p.status || p.payload && 0 !== p.payload.length || (console.warn("Offscreen: Payload is empty despite status 200"), p.error = "No data extracted", p.status = 500);
            t({response:p});
          });
        } catch (p) {
          console.log(p), t({response:{status:410, error:p.message}});
        }
      }
    } else {
      console.error("Offscreen: Iframe with id 'keepa_data' not found"), t({response:{status:467, error:"Iframe not found"}});
    }
  });
  return !0;
});
function putInIframe(m, h) {
  try {
    const f = document.getElementById("keepa_data");
    if (f) {
      f.src = "";
      var t = m.content.replace(/src=".*?"/g, 'src=""');
      m.block && (t = t.replace(new RegExp(m.block, "g"), ""));
      var u = !1;
      if (t) {
        f.srcdoc = t;
        var A = setTimeout(() => {
          u || (u = !0, console.warn("Iframe load timed out."), h(!0, "iframe timeout"));
        }, 5000);
        f.onload = function() {
          u || (clearTimeout(A), u = !0, h(!1));
        };
        f.onerror = function() {
          u || (clearTimeout(A), u = !0, h(!0, "iframe onerror"));
        };
      } else {
        h(!0, "empty content");
      }
    } else {
      h(!0, "Iframe not found");
    }
  } catch (f) {
    h(!0, "Exception in putInIframe: " + f.message), console.error(f);
  }
}
let AmazonSellerIds = "1 ATVPDKIKX0DER A3P5ROKL5A1OLE A3JWKAKR8XB7XF A1X6FK5RDHNB96 AN1VRQENFRJN5 A3DWYIK6Y9EEQB A1AJ19PSB66TGU A11IL2PNWYJU7H A1AT7YVPFBWXBL A3P5ROKL5A1OLE AVDBXBAVVSXLQ A1ZZFT5FULY4LN ANEGB3WVEVKZB A17D2BRD4YMT0X".split(" ");
function parseIframeContent(m, h, t, u, A) {
  let f = {status:200, payload:[]}, p = "", r = "", N = null;
  try {
    for (var C = m.evaluate("//comment()", m, null, XPathResult.ANY_TYPE, null), w = C.iterateNext(), x = ""; w;) {
      x += w.textContent, w = C.iterateNext();
    }
    if (m.querySelector("body").textContent.match(robot) || x.match(robot)) {
      f.status = 403;
      f.error = "Robot detected";
      A(f);
      return;
    }
  } catch (H) {
  }
  if (h.scrapeFilters && 0 < h.scrapeFilters.length) {
    const H = {}, q = {}, O = {}, J = () => {
      if ("" === r) {
        f.payload = [p];
        f.scrapedData = O;
        for (let a in q) {
          f[a] = q[a];
        }
      } else {
        f.status = 305, f.payload = [p, r, ""];
      }
      A(f);
    };
    C = function(a, B, g) {
      g = [];
      if (!a.selectors || 0 == a.selectors.length) {
        if (!a.regExp) {
          return r = "Invalid selector: " + a.name, !1;
        }
        g = m.querySelector("html").innerHTML.match(new RegExp(a.regExp));
        if (!g || g.length < a.reGroup) {
          g = "Regexp failed for selector: " + a.name;
          if (!1 === a.optional) {
            return r = g, !1;
          }
          p += " // " + g;
          return !0;
        }
        return g[a.reGroup];
      }
      let b = [];
      a.selectors.find(d => {
        d = B.querySelectorAll(d);
        return 0 < d.length ? (b = d, !0) : !1;
      });
      if (0 === b.length) {
        if (!0 === a.optional) {
          return !0;
        }
        r = "Selector no match: " + a.name;
        return !1;
      }
      if (a.parentSelector && (b = [b[0].parentNode.querySelector(a.parentSelector)], null == b[0])) {
        if (!0 === a.optional) {
          return !0;
        }
        r = "Parent selector no match: " + a.name;
        return !1;
      }
      if ("undefined" !== typeof a.multiple && null != a.multiple && (!0 === a.multiple && 1 > b.length || !1 === a.multiple && 1 < b.length)) {
        g = "Selector multiple mismatch: " + a.name + " found: " + b.length;
        if (!1 === a.optional) {
          return r = g, !1;
        }
        p += " // " + g;
        return !0;
      }
      if (a.isListSelector) {
        return H[a.name] = b, !0;
      }
      if (!a.attribute) {
        return r = "Selector attribute undefined: " + a.name, !1;
      }
      for (var c of b) {
        if (!c) {
          break;
        }
        if (void 0 !== a.childNode && null !== a.childNode) {
          c = c.childNodes;
          if (c.length <= a.childNode) {
            g = "Child nodes fail: " + c.length + " for selector: " + a.name;
            if (!1 === a.optional) {
              return r = g, !1;
            }
            p += " // " + g;
            return !0;
          }
          c = c[a.childNode];
        }
        let d = null;
        if ("text" === a.attribute) {
          try {
            c.querySelectorAll("style,script").forEach(z => z.remove());
          } catch (z) {
          }
          d = c.textContent;
        } else {
          d = "html" === a.attribute ? c.innerHTML : c.getAttribute(a.attribute);
        }
        if (!d || 0 === d.trim().length) {
          g = "Selector attribute null: " + a.name;
          if (!1 === a.optional) {
            return r = g, !1;
          }
          p += " // " + g;
          return !0;
        }
        if (a.regExp) {
          let z = d.match(new RegExp(a.regExp));
          if (!z || z.length < a.reGroup) {
            g = "Regexp failed: " + d + " for selector: " + a.name;
            if (!1 === a.optional) {
              return r = g, !1;
            }
            p += " // " + g;
            return !0;
          }
          g.push(z[a.reGroup] || z[0]);
        } else {
          g.push(d);
        }
        if (!a.multiple) {
          break;
        }
      }
      return a.multiple ? g : g[0];
    };
    for (var y in h.scrapeFilters) {
      w = h.scrapeFilters[y];
      x = w.pageVersionTest;
      var e = [], k = !1;
      for (var l of x.selectors) {
        if (e = m.querySelectorAll(l), 0 < e.length) {
          k = !0;
          break;
        }
      }
      if (!k) {
        continue;
      }
      if ("undefined" !== typeof x.multiple && null != x.multiple && (!0 === x.multiple && 2 > e.length || !1 === x.multiple && 1 < e.length)) {
        continue;
      }
      if (x.attribute && (k = null, k = "text" === x.attribute ? "" : e[0].getAttribute(x.attribute), null == k)) {
        continue;
      }
      N = y;
      let a = 0, B = [];
      for (let g in w) {
        const b = w[g];
        if (b.name !== x.name) {
          if (e = m, b.parentList) {
            l = [];
            if ("undefined" != typeof H[b.parentList]) {
              l = H[b.parentList];
            } else {
              if (!0 === C(w[b.parentList], e, y)) {
                l = H[b.parentList];
              } else {
                break;
              }
            }
            q[b.parentList] || (q[b.parentList] = []);
            "undefined" === typeof l && (l = []);
            for (e = 0; e < l.length; e++) {
              if ("lager" === b.name) {
                var I = c => {
                  c = c.trim();
                  let d = u.amazonNames[c];
                  return d ? "W" === d ? u.warehouseIds[h.domainId] : "A" === d ? u.amazonIds[h.domainId] : d : (c = c.match(new RegExp(u.sellerId))) && c[1] ? c[1] : null;
                };
                try {
                  let c = null;
                  k = null;
                  let d = w.sellerId, z = h.url.match(/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/), F = z ? z[1] : null;
                  if (!F || 9 > F.length) {
                    console.warn("Offscreen: Invalid ASIN detected:", F);
                    continue;
                  }
                  if (!d || !d.name) {
                    console.warn("Offscreen: Missing sellerIdSelector");
                    continue;
                  }
                  q[d.parentList] && q[d.parentList][e] && q[d.parentList][e][d.name] ? k = q[d.parentList][e][d.name] : (k = C(d, l[e], y), "boolean" === typeof k && w.sellerName && (k = C(w.sellerName, l[e], y)));
                  if ("boolean" === typeof k) {
                    console.warn("Offscreen: sellerIdS is boolean for selector:", d.name);
                    continue;
                  }
                  if (k.startsWith("https") && q[d.parentList][e].sellerName) {
                    let n = I(q[d.parentList][e].sellerName);
                    null != n && (c = n);
                  }
                  null == c && (c = I(k));
                  if (null == c) {
                    I = !1;
                    try {
                      q[d.parentList][e].sellerName && q[d.parentList][e].sellerName.includes("Amazon") && (!c || 12 > c.length) && (I = !0);
                    } catch (n) {
                      console.error("Offscreen: Error determining if seller is Amazon:", n);
                    }
                    if (I) {
                      c = AmazonSellerIds[h.domainId];
                    } else {
                      let n = k.match(/&seller=([A-Z0-9]{9,21})($|&)/);
                      c = n ? n[1] : null;
                    }
                  }
                  if (!c) {
                    console.warn("Offscreen: Unable to determine sellerId for ASIN:", F);
                    continue;
                  }
                  let R = b.stockForm ? l[e].querySelector(b.stockForm) : null, D = b.stockOfferId ? l[e].querySelector(b.stockOfferId) : null;
                  D = D ? D.getAttribute(b.stockForm) : null;
                  let L = 999;
                  if (!D) {
                    try {
                      let n = JSON.parse(b.regExp);
                      if (n.sel1) {
                        try {
                          let v = JSON.parse(l[e].querySelectorAll(n.sel1)[0].dataset[n.dataSet1]);
                          D = v[n.val1];
                          L = v.maxQty;
                        } catch (v) {
                        }
                      }
                      if (!D && n.sel2) {
                        try {
                          let v = JSON.parse(l[e].querySelectorAll(n.sel2)[0].dataset[n.dataSet2]);
                          D = v[n.val2];
                          L = v.maxQty;
                        } catch (v) {
                        }
                      }
                    } catch (n) {
                    }
                  }
                  let M = !1;
                  try {
                    M = q[b.parentList][e].isMAP || /(our price|to cart to see|always remove it|add this item to your cart|see product details in cart|see price in cart)/i.test(l[e].textContent.toLowerCase());
                  } catch (n) {
                    console.error("Offscreen: Error determining isMAP:", n);
                  }
                  let S = M || h.maxStockUpdates && a < h.maxStockUpdates;
                  if (R && c && null != h.request.userSession && S) {
                    a++;
                    let n = e + "";
                    const v = w.atcCsrf;
                    let P = null;
                    if (null != v) {
                      try {
                        for (const E of v.selectors) {
                          let G = m.querySelectorAll(E);
                          if (0 < G.length) {
                            G = G[0];
                            P = attribute = "text" === v.attribute ? G.textContent : "html" === v.attribute ? G.innerHTML : G.getAttribute(v.attribute);
                            break;
                          }
                        }
                      } catch (E) {
                        console.error("Offscreen: Error extracting atcCsrf:", E);
                      }
                    }
                    let K = !0, Q = new URL(h.url);
                    setTimeout(() => {
                      chrome.runtime.sendMessage({type:"getStock", asin:F, oid:D, host:Q.host, maxQty:L, sellerId:c, slateToken:h.slateToken, atcCsrf:P, onlyMaxQty:9 === b.reGroup, isMAP:M, referer:Q.host + "/dp/" + F, domainId:h.domainId, force:!0, session:h.request.userSession, offscreen:!0}, E => {
                        K && (!E || E.error && 430 === E.errorCode || (K = !1, q[b.parentList][n][b.name] = E), 0 === --a && J());
                      });
                      setTimeout(() => {
                        K && 0 == --a && (K = !1, J(f));
                      }, 4000 + 1000 * a);
                    }, 1);
                  }
                } catch (c) {
                  r = "lager: " + c.message;
                  J();
                  break;
                }
              } else {
                k = C(b, l[e], y);
                if (!1 === k) {
                  break;
                }
                !0 !== k && (q[b.parentList][e] || (q[b.parentList][e] = {}), b.multiple ? (k = k.map(cleanText), k = k.join("\u271c\u271c"), q[b.parentList][e][b.name] = k) : q[b.parentList][e][b.name] = b.keepBR ? k : cleanText(k));
              }
            }
          } else {
            l = C(b, e, y);
            if (!1 === l) {
              break;
            }
            !0 !== l && (b.keepBR || (l = b.multiple ? l.map(cleanText) : cleanText(l)), b.multiple && (l = l.join("\u271c\u271c")), O[b.name] = l);
          }
        }
      }
      try {
        if (1 == B.length || "500".endsWith("8") && 0 < B.length) {
          B.shift()();
        } else {
          for (y = 0; y < B.length; y++) {
            setTimeout(() => {
              0 < B.length && B.shift()();
            }, 500 * y);
          }
        }
      } catch (g) {
      }
      0 == a && 0 == B.length && J();
      break;
    }
    null == N && (r += " // no pageVersion matched", f.status = 308, f.payload = [p, r, h.dbg1 ? t : ""], A(f));
  } else {
    f.status = 306, f.error = "Invalid request message", A(f);
  }
}
;

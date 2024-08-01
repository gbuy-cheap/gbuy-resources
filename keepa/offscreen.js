function clear() {
}
const robot = /automated access|api-services-support@/;
chrome.runtime.onMessage.addListener((r, l, A) => {
  if ("offscreen" == r.target) {
    var w = {type:"offscreen"};
    if ("undefined" == typeof r.data) {
      return console.error("offscreen empty data msg: ", JSON.stringify(r)), w.errorCode = 466, A(w), !1;
    }
    putInIframe(r.data, G => {
      const p = document.getElementById("keepa_data");
      if (G) {
        w.errorCode = 411;
      } else {
        try {
          parseIframeContent(p.contentWindow.document, r.data.message, r.data.content, r.data.stockData, B => {
            w.response = B;
            A(w);
            p.src = "";
            p.removeAttribute("srcdoc");
            clear();
          });
          return;
        } catch (B) {
          console.error(B), w.error = B, w.errorCode = 410;
        }
      }
      A(w);
      p.src = "";
      p.removeAttribute("srcdoc");
      clear();
    });
    return !0;
  }
});
function putInIframe(r, l) {
  try {
    const A = document.getElementById("keepa_data");
    A.src = "";
    let w = r.content.replace(/src=".*?"/g, 'src=""');
    r.block && (w = w.replace(new RegExp(r.block, "g"), ""));
    let G = !1;
    A.srcdoc = w;
    A.onload = function() {
      G || (A.onload = void 0, G = !0, setTimeout(function() {
        l(!1);
      }, 80));
    };
    A.onerror = function() {
      G || (A.onload = void 0, G = !0, l(!0));
    };
  } catch (A) {
    l(!0), console.error(JSON.stringify(r) + " " + A);
  }
}
let AmazonSellerIds = "1 ATVPDKIKX0DER A3P5ROKL5A1OLE A3JWKAKR8XB7XF A1X6FK5RDHNB96 AN1VRQENFRJN5 A3DWYIK6Y9EEQB A1AJ19PSB66TGU A11IL2PNWYJU7H A1AT7YVPFBWXBL A3P5ROKL5A1OLE AVDBXBAVVSXLQ A1ZZFT5FULY4LN ANEGB3WVEVKZB A17D2BRD4YMT0X".split(" ");
function parseIframeContent(r, l, A, w, G) {
  if ("undefined" == typeof l.sent) {
    var p = {};
    try {
      for (var B = r.evaluate("//comment()", r, null, XPathResult.ANY_TYPE, null), I = B.iterateNext(), L = ""; I;) {
        L += I.textContent, I = B.iterateNext();
      }
      if (r.querySelector("body").textContent.match(robot) || L.match(robot)) {
        p.status = 403;
        if ("undefined" != typeof l.sent) {
          return;
        }
        G(p);
        return;
      }
    } catch (R) {
    }
    if (l.scrapeFilters && 0 < l.scrapeFilters.length) {
      const R = {}, m = {}, S = {};
      let V, C = "", J = null;
      const N = () => {
        if ("" === C) {
          p.payload = [J];
          p.scrapedData = S;
          for (let a in m) {
            p[a] = m[a];
          }
        } else {
          p.status = 305, p.payload = [J, C, ""];
        }
        "undefined" == typeof l.sent && G(p);
      }, T = function(a, F, c) {
        var t = [];
        if (!a.selectors || 0 == a.selectors.length) {
          if (!a.regExp) {
            return C = "invalid selector, sel/regexp (" + a.name + ")", !1;
          }
          t = r.querySelector("html").innerHTML.match(new RegExp(a.regExp));
          if (!t || t.length < a.reGroup) {
            c = "regexp fail: html - " + a.name + c;
            if (!1 === a.optional) {
              return C = c, !1;
            }
            J += " // " + c;
            return !0;
          }
          return t[a.reGroup];
        }
        let z = [];
        a.selectors.find(h => {
          h = F.querySelectorAll(h);
          return 0 < h.length ? (z = h, !0) : !1;
        });
        if (0 === z.length) {
          if (!0 === a.optional) {
            return !0;
          }
          C = "selector no match: " + a.name + c;
          return !1;
        }
        if (a.parentSelector && (z = [z[0].parentNode.querySelector(a.parentSelector)], null == z[0])) {
          if (!0 === a.optional) {
            return !0;
          }
          C = "parent selector no match: " + a.name + c;
          return !1;
        }
        if ("undefined" != typeof a.multiple && null != a.multiple && (!0 === a.multiple && 1 > z.length || !1 === a.multiple && 1 < z.length)) {
          c = "selector multiple mismatch: " + a.name + c + " found: " + z.length;
          if (!1 === a.optional) {
            return C = c, !1;
          }
          J += " // " + c;
          return !0;
        }
        if (a.isListSelector) {
          return R[a.name] = z, !0;
        }
        if (!a.attribute) {
          return C = "selector attribute undefined?: " + a.name + c, !1;
        }
        for (let h in z) {
          if (z.hasOwnProperty(h)) {
            var u = z[h];
            if (!u) {
              break;
            }
            if (a.childNode) {
              a.childNode = Number(a.childNode);
              var d = u.childNodes;
              if (d.length < a.childNode) {
                c = "childNodes fail: " + d.length + " - " + a.name + c;
                if (!1 === a.optional) {
                  return C = c, !1;
                }
                J += " // " + c;
                return !0;
              }
              u = d[a.childNode];
            }
            d = null;
            d = "text" == a.attribute ? u.textContent : "html" == a.attribute ? u.innerHTML : u.getAttribute(a.attribute);
            if (!d || 0 == d.length || 0 == d.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/g, "").length) {
              c = "selector attribute null: " + a.name + c;
              if (!1 === a.optional) {
                return C = c, !1;
              }
              J += " // " + c;
              return !0;
            }
            if (a.regExp) {
              u = d.match(new RegExp(a.regExp));
              if (!u || u.length < a.reGroup) {
                c = "regexp fail: " + d + " - " + a.name + c;
                if (!1 === a.optional) {
                  return C = c, !1;
                }
                J += " // " + c;
                return !0;
              }
              t.push("undefined" == typeof u[a.reGroup] ? u[0] : u[a.reGroup]);
            } else {
              t.push(d);
            }
            if (!a.multiple) {
              break;
            }
          }
        }
        return a.multiple ? t : t[0];
      };
      B = !1;
      for (let a in l.scrapeFilters) {
        if (B) {
          break;
        }
        const F = l.scrapeFilters[a], c = F.pageVersionTest;
        I = [];
        L = !1;
        for (const d of c.selectors) {
          if (I = r.querySelectorAll(d), 0 < I.length) {
            L = !0;
            break;
          }
        }
        if (!L) {
          continue;
        }
        if ("undefined" != typeof c.multiple && null != c.multiple) {
          if (!0 === c.multiple && 2 > I.length) {
            continue;
          }
          if (!1 === c.multiple && 1 < I.length) {
            continue;
          }
        }
        if (c.attribute && (L = null, L = "text" == c.attribute ? "" : I[0].getAttribute(c.attribute), null == L)) {
          continue;
        }
        V = a;
        let t = F.revealMAP, z = !1, u = function() {
          let d = 0, h = [];
          for (var D in F) {
            const b = F[D];
            if (!(b.name == c.name || z && "revealMAP" == b.name)) {
              var M = r;
              if (b.parentList) {
                var k = [];
                if ("undefined" != typeof R[b.parentList]) {
                  k = R[b.parentList];
                } else {
                  if (!0 === T(F[b.parentList], M, a)) {
                    k = R[b.parentList];
                  } else {
                    break;
                  }
                }
                m[b.parentList] || (m[b.parentList] = []);
                M = 0;
                for (let e in k) {
                  if (k.hasOwnProperty(e)) {
                    if ("lager" == b.name) {
                      var g = f => {
                        f = f.trim();
                        let n = w.amazonNames[f];
                        return n ? "W" === n ? w.warehouseIds[l.domainId] : "A" === n ? w.amazonIds[l.domainId] : n : (f = f.match(new RegExp(w.sellerId))) && f[1] ? f[1] : null;
                      };
                      let q = l.request.userSession, K = new URL(l.url);
                      M++;
                      try {
                        let f = null;
                        var x = null;
                        let n = F.sellerId, y = l.url.match(/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/)[1];
                        if (null == y || 9 > y.length) {
                          continue;
                        }
                        if ("undefined" == typeof n || null == n || null == y || 2 > y.length) {
                          continue;
                        }
                        m[n.parentList][e] && m[n.parentList][e][n.name] ? x = m[n.parentList][e][n.name] : (x = T(n, k[e], a), "boolean" === typeof x && F.sellerName && (x = T(F.sellerName, k[e], a)));
                        if ("boolean" === typeof x) {
                          continue;
                        }
                        if (0 == x.indexOf("https") && m[n.parentList][e].sellerName) {
                          let v = g(m[n.parentList][e].sellerName);
                          null != v && (f = v);
                        }
                        null == f && (f = g(x));
                        if (null == f) {
                          g = !1;
                          try {
                            m[n.parentList][e] && m[n.parentList][e].sellerName && -1 < m[n.parentList][e].sellerName.indexOf("Amazon") && (null == f || 12 > (f + "").length) && (g = !0);
                          } catch (v) {
                            console.error(v);
                          }
                          f = g ? AmazonSellerIds[l.domainId] : f.match(/&seller=([A-Z0-9]{9,21})($|&)/)[1];
                        }
                        let O, E;
                        b.stockForm && (O = k[e].querySelector(b.stockForm));
                        b.stockOfferId && (E = k[e].querySelector(b.stockOfferId));
                        E &&= E.getAttribute(b.stockForm);
                        let P = 999;
                        if (!E) {
                          try {
                            let v = JSON.parse(b.regExp);
                            if (v.sel1) {
                              try {
                                let H = JSON.parse(k[e].querySelectorAll(v.sel1)[0].dataset[v.dataSet1]);
                                E = H[v.val1];
                                P = H.maxQty;
                              } catch (H) {
                              }
                            }
                            if (!E && v.sel2) {
                              try {
                                let H = JSON.parse(k[e].querySelectorAll(v.sel2)[0].dataset[v.dataSet2]);
                                E = H[v.val2];
                                P = H.maxQty;
                              } catch (H) {
                              }
                            }
                          } catch (v) {
                          }
                        }
                        let X = l.maxStockUpdates && d < l.maxStockUpdates;
                        if (O && f && null != q && X) {
                          d++;
                          let v = e + "", H = !1;
                          try {
                            H = m[b.parentList][v].isMAP || -1 != k[e].textContent.toLowerCase().indexOf("add to cart to see product details");
                          } catch (U) {
                          }
                          let Q = !0;
                          setTimeout(() => {
                            chrome.runtime.sendMessage({type:"getStock", asin:y, oid:E, host:K.host, maxQty:P, sellerId:f, onlyMaxQty:9 == b.reGroup, isMAP:H, referer:K.host + "/dp/" + y, domainId:l.domainId, force:!0, session:q, offscreen:!0}, U => {
                              Q && ("undefined" == typeof U || null != U.error && 430 == U.errorCode ? chrome.runtime.sendMessage({type:"getStock", asin:y, oid:E, host:K.host, maxQty:P, sellerId:f, onlyMaxQty:9 == b.reGroup, isMAP:H, referer:K.host + "/dp/" + y, domainId:l.domainId, force:!0, session:q}, W => {
                                Q && (Q = !1, "undefined" != typeof W && (m[b.parentList][v][b.name] = W), 0 == --d && N(p));
                              }) : (Q = !1, m[b.parentList][v][b.name] = U, 0 == --d && N(p)));
                            });
                            setTimeout(() => {
                              Q && 0 == --d && (Q = !1, N(p));
                            }, 4000 + 1800 * d);
                          }, 1);
                        }
                      } catch (f) {
                      }
                    } else if ("revealMAP" == b.name) {
                      let q = b, K;
                      if (q.selectors) {
                        for (const f of q.selectors) {
                          if (K = k[e].querySelector(f)) {
                            break;
                          }
                        }
                      } else {
                        K = k[e];
                      }
                      if (null != K) {
                        if (!K.textContent.match(new RegExp(q.regExp))) {
                          continue;
                        }
                        g = l.url.match(/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/)[1];
                        x = F.sellerId;
                        if ("undefined" == typeof x || null == x || null == g || 2 > g.length) {
                          continue;
                        }
                        x = k[e].querySelector(b.childNode).value;
                        if (null == x || 20 > x + 0) {
                          continue;
                        }
                        g = q.altSelector.replace("OFFERID", x).replace("ASINID", g);
                        d++;
                        let f = e + "";
                        httpRequest(g, "GET", null, 3000, function(n) {
                          try {
                            const y = F.price;
                            if (y && y.regExp) {
                              if (n.match(RegExp("no valid offer--"))) {
                                m[q.parentList][f] || (m[q.parentList][f] = {}), m[q.parentList][f][q.name] = -1;
                              } else {
                                let O = n.match(new RegExp("price info--\x3e(?:.|\\n)*?" + y.regExp + "(?:.|\\n)*?\x3c!--"));
                                const E = n.match(RegExp('price info--\x3e(?:.|\n)*?(?:<span.*?size-small.*?">)([^]*?</span)(?:.|\n)*?\x3c!--'));
                                if (!O || O.length < y.reGroup) {
                                  J += " //  priceMAP regexp fail: " + (n + " - " + y.name + a);
                                } else {
                                  const P = O[y.reGroup];
                                  m[q.parentList][f] || (m[q.parentList][f] = {});
                                  m[q.parentList][f][q.name] = P;
                                  null != E && 2 == E.length && (m[q.parentList][f][q.name + "Shipping"] = E[1].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                                }
                              }
                            }
                          } catch (y) {
                          }
                          0 == --d && 0 == h.length && N();
                        }, function() {
                          0 == --d && 0 == h.length && N();
                        });
                      }
                    } else {
                      g = T(b, k[e], a);
                      if (!1 === g) {
                        break;
                      }
                      if (!0 !== g) {
                        if (m[b.parentList][e] || (m[b.parentList][e] = {}), b.multiple) {
                          for (let q in g) {
                            g.hasOwnProperty(q) && !b.keepBR && (g[q] = g[q].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                          }
                          g = g.join("\u271c\u271c");
                          m[b.parentList][e][b.name] = g;
                        } else {
                          m[b.parentList][e][b.name] = b.keepBR ? g : g.replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " ");
                        }
                      }
                    }
                  }
                }
              } else {
                k = T(b, M, a);
                if (!1 === k) {
                  break;
                }
                if (!0 !== k) {
                  if (b.multiple) {
                    for (let e in k) {
                      k.hasOwnProperty(e) && !b.keepBR && (k[e] = k[e].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                    }
                    k = k.join();
                  } else {
                    b.keepBR || (k = k.replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                  }
                  S[b.name] = k;
                }
              }
            }
          }
          try {
            if (1 == h.length || "500".endsWith("8") && 0 < h.length) {
              h.shift()();
            } else {
              for (D = 0; D < h.length; D++) {
                setTimeout(() => {
                  0 < h.length && h.shift()();
                }, 500 * D);
              }
            }
          } catch (b) {
          }
          0 == d && 0 == h.length && N();
        };
        if (t) {
          let d;
          for (const h of t.selectors) {
            if (d = r.querySelector(h), null != d) {
              break;
            }
          }
          if (null != d) {
            let h = d.getAttribute(t.attribute);
            if (null == h || 0 == h.length) {
              u();
              break;
            }
            0 != h.indexOf("http") && (console.log("http missing", l.url), B = document.createElement("a"), B.href = l.url, h = B.origin + h);
            S[t.name] = "1";
            h = h.replace(/(mapPopover.*?)(false)/, "$1true");
            let D = new XMLHttpRequest(), M = !1, k = setTimeout(function() {
              M = !0;
              u();
            }, 4000);
            D.onreadystatechange = function() {
              if (!M && 4 == D.readyState) {
                clearTimeout(k);
                if (200 == D.status) {
                  const x = D.responseText;
                  if (t.regExp) {
                    var g = x.match(new RegExp(t.regExp));
                    !g || g.length < t.reGroup ? (g = d.cloneNode(!1), g.innerHTML = x, d.parentNode.replaceChild(g, d)) : (S[t.name] = g[t.reGroup], S[t.name + "url"] = h);
                  }
                }
                z = !0;
                u();
              }
            };
            D.onerror = u;
            D.open("GET", h, !0);
            D.send();
          } else {
            u();
          }
        } else {
          u();
        }
        B = !0;
      }
      null == V && (C += " // no pageVersion matched", p.payload = [J, C, l.dbg1 ? A : ""], p.status = 308, "undefined" == typeof l.sent && G(p));
    } else {
      p.status = 306, "undefined" == typeof l.sent && G(p);
    }
  }
}
;

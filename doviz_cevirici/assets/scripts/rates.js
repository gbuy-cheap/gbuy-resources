"use strict";
function _classCallCheck(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, t) {
  for (var n = 0; n < t.length; n++) {
    var a = t[n];
    (a.enumerable = a.enumerable || !1),
      (a.configurable = !0),
      "value" in a && (a.writable = !0),
      Object.defineProperty(e, a.key, a);
  }
}
function _createClass(e, t, n) {
  return (
    t && _defineProperties(e.prototype, t), n && _defineProperties(e, n), e
  );
}
var Rates = (function () {
    function t() {
      var e = this;
      _classCallCheck(this, t),
        (this.storage = STORAGE),
        this.initStorage(function () {
          e.render();
        });
    }
    return (
      _createClass(t, [
        {
          key: "initStorage",
          value: function (t) {
            var n = this;
            chrome.storage.local.get(this.storage, function (e) {
              (n.storage = e), "function" == typeof t && t();
            });
          },
        },
        {
          key: "renderTr",
          value: function () {
            var e = Array.prototype.slice.call(arguments),
              t = document.createElement("tr"),
              n = this.storage.base.code;
            1 === e[0] && (t.className = "pure-table-odd");
            for (var a = 1; a < e.length; a++) {
              var r = document.createElement("td");
              if (4 == a) {
                var o = document.createElement("a");
                (o.href = (
                  "https://" +
                  n +
                  "." +
                  websiteLanguage() +
                  "currencyrate.today/" +
                  e[3]
                ).toLowerCase()),
                  (o.target = "_blank"),
                  (o.textContent = e[a]),
                  r.appendChild(o);
              } else r.textContent = e[a];
              t.appendChild(r);
            }
            return t;
          },
        },
        {
          key: "render",
          value: function () {
            (document.title = chrome.i18n.getMessage("appExchangeRates")),
              document
                .querySelector("html")
                .setAttribute("lang", defaultLang());
            var e = document.querySelector("main"),
              t = document.createElement("div"),
              n = document.createElement("button"),
              a = document.createElement("p"),
              r = document.createElement("table"),
              o = document.createElement("thead"),
              i = document.createElement("tr"),
              s = document.createElement("th"),
              c = document.createElement("th"),
              l = document.createElement("th"),
              d = document.createElement("th");
            (r.className = "pure-table pure-table-bordered"),
              (s.textContent = chrome.i18n.getMessage("ratesTableRate")),
              (c.textContent = chrome.i18n.getMessage("ratesTableCurrency")),
              (l.textContent = chrome.i18n.getMessage(
                "ratesTableAlphabeticCode"
              )),
              (d.textContent = chrome.i18n.getMessage("ratesTableMore")),
              (a.textContent = new Date(
                1e3 * parseInt(this.storage.ratesData.timestamp) -
                  _offsetTimezone()
              ).toUTCString()),
              (n.textContent = chrome.i18n.getMessage("ratesPrint")),
              n.addEventListener(
                "click",
                function () {
                  window.print();
                },
                !1
              ),
              (t.style.textAlign = "center"),
              i.appendChild(s),
              i.appendChild(c),
              i.appendChild(l),
              i.appendChild(d),
              o.appendChild(i),
              r.appendChild(o),
              t.appendChild(n),
              t.appendChild(a),
              e.appendChild(t),
              e.appendChild(r);
            var u = this.storage.base.code;
            for (var h in (r.appendChild(
              this.renderTr(1, 1, this.storage.currenciesData[u], u, u)
            ),
            this.storage.currenciesData))
              h != u &&
                r.appendChild(
                  this.renderTr(
                    0,
                    this.calc(h),
                    this.storage.currenciesData[h],
                    h,
                    u + " → " + h
                  )
                );
            document.addEventListener(
              "copy",
              function () {
                var e = window.getSelection(),
                  t =
                    e +
                    "<br><br>" +
                    chrome.i18n.getMessage("appSource") +
                    ": https://cr.today",
                  n = document.createElement("div");
                (n.style.position = "absolute"),
                  (n.style.left = "-99999px"),
                  document.body.appendChild(n),
                  (n.innerHTML = t),
                  e.selectAllChildren(n),
                  window.setTimeout(function () {
                    document.body.removeChild(n);
                  }, 100);
              },
              !1
            );
          },
        },
        {
          key: "calc",
          value: function (e) {
            return (
              (1 / this.storage.ratesData.rates[this.storage.base.code]) *
              this.storage.ratesData.rates[e]
            ).toFixed(this.storage.settings.countUp.decimals);
          },
        },
      ]),
      t
    );
  })(),
  r = new Rates();

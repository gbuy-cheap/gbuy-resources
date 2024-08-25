"use strict";
function _classCallCheck(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, t) {
  for (var o = 0; o < t.length; o++) {
    var n = t[o];
    (n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, n.key, n);
  }
}
function _createClass(e, t, o) {
  return (
    t && _defineProperties(e.prototype, t), o && _defineProperties(e, o), e
  );
}
var Content = (function () {
    function e() {
      _classCallCheck(this, e),
        (this.storage = STORAGE),
        (this.amount = null),
        this.initHandlers();
    }
    return (
      _createClass(e, [
        {
          key: "initHandlers",
          value: function () {
            var e = this;
            document.body.addEventListener(
              "mouseup",
              function () {
                return e.onSelection();
              },
              !1
            );
          },
        },
        {
          key: "onSelection",
          value: function () {
            var e = window
                .getSelection()
                .toString()
                .replace(/[^0-9.-]+/g, ""),
              t = parseFloat(e);
            isNaN(t)
              ? this.removeTooltip()
              : ((this.amount = t), this.render());
          },
        },
        {
          key: "render",
          value: function () {
            var t = this;
            chrome.storage.local.get(this.storage, function (e) {
              (t.storage = e),
                t.storage.settings.convertInPage && t.renderTooltip();
            });
          },
        },
        {
          key: "removeTooltip",
          value: function () {
            document
              .querySelectorAll(".currency-rate-today-tooltip")
              .forEach(function (e) {
                e.remove();
              });
          },
        },
        {
          key: "renderTooltip",
          value: function () {
            this.removeTooltip();
            var e = document.createElement("div"),
              t = document.createElement("div"),
              o = document.createElement("div"),
              n = this.storage.base.code,
              s = this.storage.pairs;
            (e.className = "currency-rate-today-tooltip"),
              (e.style.position = "fixed"),
              (e.style.zIndex = 9999999),
              (e.style.top = "25px"),
              (e.style.right = "25px"),
              (e.style.background = "rgba(0,0,0,.75)"),
              (e.style.borderRadius = "4px"),
              (e.style.fontSize = "15px"),
              (o.style.padding = "5px"),
              (t.style.fontWeight = "700"),
              (t.style.color = "#333"),
              (t.style.padding = "5px"),
              (t.style.background = "rgba(255,255,255,.75)"),
              (t.style.borderTopLeftRadius = "4px"),
              (t.style.borderTopRightRadius = "4px"),
              (t.style.padding = "10px"),
              new CountUp(
                t,
                0,
                this.amount,
                this.amount % 1 == 0 ? 0 : this.amount.countDecimals(),
                0.5,
                {
                  useEasing: !0,
                  useGrouping: !0,
                  separator: this.storage.settings.countUp.separator,
                  decimal: this.storage.settings.countUp.decimal,
                  prefix: symbols[n] + " ",
                  suffix: " (" + n + ")",
                }
              ).start(),
              e.appendChild(t);
            for (var a = 0; a < s.length; a++)
              if (s[a].code != n) {
                var r = document.createElement("a");
                (r.textContent =
                  symbols[s[a].code] + this.calc(s[a].code) + " " + s[a].code),
                  (r.style.padding = "5px"),
                  (r.style.textDecorationLine = "none"),
                  (r.style.display = "block"),
                  (r.style.color = "#eee"),
                  (r.title = chrome.i18n.getMessage("contentLearnMore")),
                  (r.target = "_blank"),
                  (r.href =
                    (
                      "https://" +
                      n +
                      ".currencyrate.today/" +
                      s[a].code
                    ).toLowerCase() +
                    "/" +
                    this.amount),
                  new CountUp(
                    r,
                    0,
                    this.calc(s[a].code),
                    this.storage.settings.countUp.decimals,
                    0.5,
                    {
                      useEasing: !0,
                      useGrouping: !0,
                      separator: this.storage.settings.countUp.separator,
                      decimal: this.storage.settings.countUp.decimal,
                      prefix: symbols[s[a].code] + " ",
                      suffix: " (" + s[a].code + ")",
                    }
                  ).start(),
                  o.appendChild(r);
              }
            e.appendChild(o), document.body.appendChild(e);
          },
        },
        {
          key: "calc",
          value: function (e) {
            var t = this.storage.ratesData.rates[this.storage.base.code],
              o = this.storage.ratesData.rates[e];
            return (this.amount / t) * o;
          },
        },
      ]),
      e
    );
  })(),
  c = new Content();

"use strict";
function _classCallCheck(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, t) {
  for (var n = 0; n < t.length; n++) {
    var s = t[n];
    (s.enumerable = s.enumerable || !1),
      (s.configurable = !0),
      "value" in s && (s.writable = !0),
      Object.defineProperty(e, s.key, s);
  }
}
function _createClass(e, t, n) {
  return (
    t && _defineProperties(e.prototype, t), n && _defineProperties(e, n), e
  );
}
var Settings = (function () {
    function t() {
      var e = this;
      _classCallCheck(this, t),
        (this.storage = STORAGE),
        this.initStorage(function () {
          e.render(
            "decimals",
            chrome.i18n.getMessage("settingsFrontendDecimals"),
            [0, 1, 2, 3, 4, 5, 6, 7]
          ),
            e.render(
              "separator",
              chrome.i18n.getMessage("settingsFrontendSeparator"),
              [
                chrome.i18n.getMessage("settingsDecimalEmpty"),
                chrome.i18n.getMessage("settingsDecimalSpace"),
                chrome.i18n.getMessage("settingsDecimalDot"),
                chrome.i18n.getMessage("settingsDecimalComma"),
              ]
            ),
            e.render(
              "decimal",
              chrome.i18n.getMessage("settingsFrontendDecimal"),
              [
                chrome.i18n.getMessage("settingsDecimalDot"),
                chrome.i18n.getMessage("settingsDecimalComma"),
              ]
            ),
            e.initHandlers();
        }),
        (document.title = chrome.i18n.getMessage("settingsFrontendSettings")),
        (document.getElementsByTagName("h2")[0].innerHTML =
          chrome.i18n.getMessage("settingsFrontendSettings")),
        (document.getElementsByTagName("h2")[1].innerHTML =
          chrome.i18n.getMessage("settingsFrontendEmbeddableWidgets")),
        (document.getElementsByTagName("b")[0].innerHTML =
          chrome.i18n.getMessage("settingsFrontendExchangeRates")),
        (document.getElementsByTagName("b")[1].innerHTML =
          chrome.i18n.getMessage("settingsFrontendCurrencyConverter")),
        (document.getElementsByTagName("a")[0].innerHTML =
          chrome.i18n.getMessage("settingsFrontendWebsite")),
        (document.getElementsByTagName("a")[2].innerHTML =
          chrome.i18n.getMessage("settingsFrontendWebsite")),
        (document.getElementsByTagName("a")[0].href =
          "https://" +
          websiteLanguage() +
          "currencyrate.today/exchangerates-widget"),
        (document.getElementsByTagName("a")[2].href =
          "https://" +
          websiteLanguage() +
          "currencyrate.today/converter-widget");
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
          key: "initHandlers",
          value: function () {
            var n = this;
            document.addEventListener(
              "change",
              function (e) {
                var t = e.target.parentNode.getAttribute("id");
                (n.storage.settings.countUp[t] = e.target.value),
                  n.saveStorage();
              },
              !1
            );
          },
        },
        {
          key: "render",
          value: function (e, t, n) {
            (document.title = chrome.i18n.getMessage(
              "settingsFrontendSettings"
            )),
              document
                .querySelector("html")
                .setAttribute("lang", defaultLang());
            var s = document.createElement("select"),
              a = document.createElement("label"),
              r = document.getElementById(e);
            a.textContent = t;
            var i = [".", ","],
              o = ["", " ", ".", ","];
            for (var g in n) {
              var c = document.createElement("option");
              "decimals" == e
                ? ((c.value = n[g]),
                  (c.textContent = n[g]),
                  this.storage.settings.countUp.decimals == n[g] &&
                    (c.selected = !0))
                : "separator" == e
                ? ((c.value = o[g]),
                  (c.textContent = n[g]),
                  this.storage.settings.countUp.separator == o[g] &&
                    (c.selected = !0))
                : "decimal" == e &&
                  ((c.value = i[g]),
                  (c.textContent = n[g]),
                  this.storage.settings.countUp.decimal == i[g] &&
                    (c.selected = !0)),
                s.appendChild(c),
                0;
            }
            r.appendChild(a), r.appendChild(s);
          },
        },
        {
          key: "saveStorage",
          value: function (e) {
            chrome.storage.local.set(this.storage);
          },
        },
      ]),
      t
    );
  })(),
  s = new Settings();

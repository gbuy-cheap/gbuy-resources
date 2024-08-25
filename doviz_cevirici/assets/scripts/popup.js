"use strict";
function _typeof(e) {
  return (_typeof =
    "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
      ? function (e) {
          return typeof e;
        }
      : function (e) {
          return e &&
            "function" == typeof Symbol &&
            e.constructor === Symbol &&
            e !== Symbol.prototype
            ? "symbol"
            : typeof e;
        })(e);
}
function _classCallCheck(e, n) {
  if (!(e instanceof n))
    throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, n) {
  for (var t = 0; t < n.length; t++) {
    var i = n[t];
    (i.enumerable = i.enumerable || !1),
      (i.configurable = !0),
      "value" in i && (i.writable = !0),
      Object.defineProperty(e, i.key, i);
  }
}
function _createClass(e, n, t) {
  return (
    n && _defineProperties(e.prototype, n), t && _defineProperties(e, t), e
  );
}
!(function r(s, l, o) {
  function u(n, e) {
    if (!l[n]) {
      if (!s[n]) {
        var t = "function" == typeof require && require;
        if (!e && t) return t(n, !0);
        if (d) return d(n, !0);
        var i = new Error("Cannot find module '" + n + "'");
        throw ((i.code = "MODULE_NOT_FOUND"), i);
      }
      var a = (l[n] = { exports: {} });
      s[n][0].call(
        a.exports,
        function (e) {
          return u(s[n][1][e] || e);
        },
        a,
        a.exports,
        r,
        s,
        l,
        o
      );
    }
    return l[n].exports;
  }
  for (
    var d = "function" == typeof require && require, e = 0;
    e < o.length;
    e++
  )
    u(o[e]);
  return u;
})(
  {
    1: [
      function (e, n, t) {
        var i = e("./written-number.min.js");
        new ((function () {
          function e() {
            var t = this;
            _classCallCheck(this, e),
              (this.storage = STORAGE),
              this.initCurrencies(defaultLang(), function (e) {
                t.initStorage(e),
                  t.initHandlers(),
                  (document.title = chrome.i18n.getMessage("appName"));
                var n = document.getElementById("settings");
                n
                  .getElementsByTagName("a")[0]
                  .setAttribute(
                    "title",
                    chrome.i18n.getMessage("appAddNewItem")
                  ),
                  n
                    .getElementsByTagName("a")[1]
                    .setAttribute(
                      "title",
                      chrome.i18n.getMessage("appExchangeRates")
                    ),
                  n
                    .getElementsByTagName("a")[2]
                    .setAttribute(
                      "title",
                      chrome.i18n.getMessage("appSettings")
                    ),
                  n
                    .getElementsByTagName("a")[3]
                    .setAttribute("title", chrome.i18n.getMessage("appLike")),
                  n
                    .querySelector(".fee-tax")
                    .setAttribute(
                      "placeholder",
                      chrome.i18n.getMessage("appFeetax") + " %"
                    ),
                  (n
                    .querySelector(".convert-in-page")
                    .parentNode.getElementsByTagName("span")[0].textContent =
                    chrome.i18n.getMessage("appConvertInPagePrices")),
                  document
                    .getElementById("number-text")
                    .querySelector(".amount-words")
                    .setAttribute(
                      "placeholder",
                      chrome.i18n.getMessage("appAmountWords")
                    ),
                  (i.defaults.lang = "en");
              });
          }
          return (
            _createClass(e, [
              {
                key: "initStorage",
                value: function (n) {
                  var t = this;
                  chrome.storage.local.get(this.storage, function (e) {
                    (fx.rates = e.ratesData.rates),
                      (fx.base = e.ratesData.base),
                      (t.storage = e),
                      (t.storage.currenciesData = n),
                      t.saveStorage(),
                      t.render();
                  });
                },
              },
              {
                key: "initCurrencies",
                value: function (e, n) {
                  fetch(chrome.runtime.getURL("data/currencies_" + e + ".json"))
                    .then(response => {
                      if (!response.ok) {
                        throw new Error('Network response was not ok');
                      }
                      return response.json();
                    })
                    .then(data => {
                      n(data);
                    })
                    .catch(error => {
                      console.error('There was a problem with the fetch operation:', error);
                    });
                },
              },
              {
                key: "initHandlers",
                value: function () {
                  var n = this,
                    t = this;
                  document.addEventListener(
                    "click",
                    function (e) {
                      "plus" == e.target.classList[0]
                        ? t.addItem()
                        : "settings" == e.target.classList[0]
                        ? "undefined" != typeof chrome &&
                          (chrome.runtime.openOptionsPage
                            ? chrome.runtime.openOptionsPage()
                            : window.open(
                                chrome.runtime.getURL("settings.html")
                              ))
                        : "rates" == e.target.classList[0]
                        ? window.open(chrome.runtime.getURL("rates.html"))
                        : "delete" == e.target.classList[0]
                        ? t.removeItem(
                            e.target.parentNode.getAttribute("data-id")
                          )
                        : "convert-in-page" == e.target.classList[0]
                        ? ((t.storage.settings.convertInPage =
                            e.target.checked),
                          t.saveStorage())
                        : "input-currency" == e.target.classList[0]
                        ? ((e.target.value = e.target.value.replace(
                            /[^0-9,.]+/g,
                            ""
                          )),
                          e.target.select())
                        : "amount-words" == e.target.classList[0] &&
                          e.target.select();
                    },
                    !1
                  ),
                    document.addEventListener(
                      "change",
                      function (e) {
                        t.changeItem(e);
                      },
                      !1
                    ),
                    document.addEventListener(
                      "keyup",
                      function (e) {
                        void 0 !== e.target.value && t.handlerInput(e);
                      },
                      !1
                    ),
                    document.addEventListener(
                      "keydown",
                      function (e) {
                        void 0 !== e.target.value && t.handlerInput(e);
                      },
                      !1
                    ),
                    document.addEventListener(
                      "copy",
                      function () {
                        var e = window.getSelection(),
                          n =
                            e +
                            "<br><br>" +
                            chrome.i18n.getMessage("appSource") +
                            ": https://currencyrate.today",
                          t = document.createElement("div");
                        (t.style.position = "absolute"),
                          (t.style.left = "-99999px"),
                          document.body.appendChild(t),
                          (t.innerHTML = n),
                          e.selectAllChildren(t),
                          window.setTimeout(function () {
                            document.body.removeChild(t);
                          }, 100);
                      },
                      !1
                    ),
                    document.addEventListener(
                      "focusout",
                      function (e) {
                        "input-currency" == e.target.classList[0]
                          ? new CountUp(
                              e.target,
                              0,
                              e.target.value.replace(/,/g, "."),
                              n.storage.settings.countUp.decimals,
                              0.1,
                              {
                                useEasing: !0,
                                useGrouping: !0,
                                separator: n.storage.settings.countUp.separator,
                                decimal: n.storage.settings.countUp.decimal,
                                prefix:
                                  symbols[
                                    e.target.parentNode.parentNode.querySelector(
                                      "select"
                                    ).value
                                  ],
                              }
                            ).start()
                          : "fee-tax" == e.target.classList[0] &&
                            e.target.value < 1 &&
                            (e.target.value = "");
                      },
                      !1
                    );
                },
              },
              {
                key: "handlerInput",
                value: function (e) {
                  "fee-tax" == e.target.classList[0]
                    ? ((this.storage.percentage = Number(
                        e.target.value.replace(/[^0-9,.]+/g, "")
                      )),
                      this.currencyConvert())
                    : (this.renderNumberToText(e.target.value),
                      this.currencyConvert(e.target));
                },
              },
              {
                key: "currencyConvertSingle",
                value: function (e) {
                  var n,
                    t,
                    i = document.getElementById("item-" + e);
                  (n = this.storage.base.code),
                    (t = this.storage.base.amount.toString());
                  var a = i.querySelector("select").value,
                    r = fx.convert(t.replace(/,/g, "."), { from: n, to: a });
                  new CountUp(
                    i.querySelector("input.input-currency"),
                    0,
                    r,
                    this.storage.settings.countUp.decimals,
                    0.5,
                    {
                      useEasing: !0,
                      useGrouping: !0,
                      separator: this.storage.settings.countUp.separator,
                      decimal: this.storage.settings.countUp.decimal,
                      prefix: symbols[a],
                    }
                  ).start();
                },
              },
              {
                key: "currencyConvert",
                value: function (e) {
                  var n,
                    t,
                    i,
                    a = document
                      .getElementById("controls")
                      .getElementsByTagName("div");
                  void 0 === e
                    ? ((n = this.storage.base.code),
                      (t = this.storage.base.amount))
                    : ((n =
                        e.parentNode.parentNode.querySelector("select").value),
                      (i = e.parentNode.parentNode.getAttribute("data-id")),
                      (t = e.value.replace(/,/g, ".")),
                      (this.storage.base.code = n),
                      (this.storage.base.amount = t));
                  for (var r = 0; r < a.length; r++) {
                    if (i != a[r].getAttribute("data-id")) {
                      var s = a[r].querySelector("select").value,
                        l = fx.convert(t, { from: n, to: s });
                      n != s &&
                        "number" == typeof this.storage.percentage &&
                        (l = (l / 100) * this.storage.percentage + l),
                        (a[r].className = "control pt-10"),
                        new CountUp(
                          a[r].querySelector("input.input-currency"),
                          0,
                          l,
                          this.storage.settings.countUp.decimals,
                          0.5,
                          {
                            useEasing: !0,
                            useGrouping: !0,
                            separator: this.storage.settings.countUp.separator,
                            decimal: this.storage.settings.countUp.decimal,
                            prefix: symbols[s],
                          }
                        ).start();
                    }
                    n == a[r].querySelector("select").value
                      ? ((a[r].className = "control bold pt-10"),
                        (a[r].querySelector("a").className =
                          "delete is-small disabled"))
                      : (a[r].querySelector("a").className = "delete is-small");
                  }
                  this.saveStorage();
                },
              },
              {
                key: "renderNumberToText",
                value: function (e) {
                  document
                    .getElementById("number-text")
                    .getElementsByTagName("input")[0].value = i(
                    e.toString().replace(/[^0-9,.]+/g, ""),
                    { lang: defaultLang() }
                  );
                },
              },
              {
                key: "renderDate",
                value: function () {
                  var e = document.querySelector(".date");

                  var currentTime = +new Date();
                  var storedTime = 1e3 * parseInt(this.storage.ratesData.timestamp, 10);
                  var timeDifference = currentTime - storedTime;
                  var threshold = 15 * 60 * 1000; // 15 min
                  
                  if (timeDifference < threshold) {
                    e.textContent =
                      "⚡" +
                      new Date(storedTime - _offsetTimezone()).toUTCString();
                  } else {
                    this.update(e);
                  }
                },
              },
              {
                key: "render",
                value: function () {
                  updateLink();
                  (document.title = chrome.i18n.getMessage("appName")),
                    document
                      .querySelector("html")
                      .setAttribute("lang", defaultLang());
                  for (var e = 0; e < this.storage.pairs.length; e++)
                    this.clone(this.storage.pairs[e]);
                  this.currencyConvert(),
                    "number" == typeof this.storage.percentage &&
                      0 < this.storage.percentage &&
                      (document.querySelector("input.fee-tax").value =
                        this.storage.percentage),
                    (document.querySelector("input.convert-in-page").checked =
                      this.storage.settings.convertInPage);
                  var n = document.createElement("a"),
                    t = document.createElement("img"),
                    i = document.createElement("span");
                  (n.className = "navbar-brand"),
                    (n.target = "_blank"),
                    (n.href =
                      "https://" + websiteLanguage() + "currencyrate.today/"),
                    (t.src = chrome.runtime.getURL("icons/512.svg")),
                    (t.style.paddingRight = "5px"),
                    (i.textContent = chrome.i18n.getMessage("appName")),
                    document.getElementsByTagName("header")[0].appendChild(n),
                    n.appendChild(t),
                    n.appendChild(i),
                    this.renderNumberToText(this.storage.base.amount),
                    this.renderDate();
                },
              },
              {
                key: "changeItem",
                value: function (e) {
                  var n = e.target;
                  if ("currency" == n.className) {
                    for (var t = 0; t < this.storage.pairs.length; t++)
                      this.storage.pairs[t].id ==
                        n.parentNode.getAttribute("data-id") &&
                        (this.storage.pairs[t].code = n.value);
                    "bold" == n.parentNode.classList[1]
                      ? ((this.storage.base.code = n.value),
                        this.currencyConvert())
                      : this.currencyConvertSingle(
                          n.parentNode.getAttribute("data-id")
                        ),
                      this.saveStorage();
                  }
                },
              },
              {
                key: "addItem",
                value: function () {
                  var e = Object.keys(this.storage.currenciesData).filter(
                      function (e) {
                        return !(function () {
                          for (
                            var e = document
                                .getElementById("controls")
                                .querySelectorAll("select"),
                              n = [],
                              t = 0;
                            t < e.length;
                            t++
                          )
                            n.push(e[t].value);
                          return n;
                        })().includes(e);
                      }
                    ),
                    n = { id: gID(), code: e[0] };
                  this.storage.pairs.push(n),
                    this.clone(n),
                    this.currencyConvertSingle(n.id),
                    this.saveStorage();
                },
              },
              {
                key: "removeItem",
                value: function (e) {
                  var n,
                    t = document.getElementById("item-" + e);
                  for (var i in (t.parentNode && t.parentNode.removeChild(t),
                  this.storage.pairs))
                    this.storage.pairs[i].id == e && (n = i);
                  this.storage.pairs.splice(n, 1), this.saveStorage();
                },
              },
              {
                key: "clone",
                value: function (e) {
                  var n = document.createElement("div"),
                    t = document.createElement("span"),
                    i = document.createElement("a"),
                    a = document.createElement("input"),
                    r = document.createElement("select");
                  for (var s in (n.setAttribute("id", "item-" + e.id),
                  n.setAttribute("data-id", e.id),
                  (r.className = "currency"),
                  (n.className = "control pt-10"),
                  (t.className = "inputbox"),
                  (i.className = "delete is-small"),
                  (i.href = "#"),
                  a.setAttribute("type", "text"),
                  a.setAttribute("maxlength", "12"),
                  a.setAttribute("min", "0"),
                  a.setAttribute("placeholder", "Amount"),
                  (a.className = "input-currency"),
                  this.storage.base.code == e.code &&
                    ((n.className = "control bold pt-10"),
                    (i.className = i.className + " disabled"),
                    (a.value = this.storage.base.amount)),
                  this.storage.currenciesData)) {
                    var l = document.createElement("option");
                    (l.value = s),
                      (l.textContent =
                        s + " - " + this.storage.currenciesData[s]),
                      e.code == s && l.setAttribute("selected", "selected"),
                      r.appendChild(l);
                  }
                  n.appendChild(t),
                    t.appendChild(a),
                    n.appendChild(r),
                    n.appendChild(i),
                    document.getElementById("controls").appendChild(n);
                },
              },
              {
                key: "update",
                value: function (n) {
                  console.log('Updating rates');
                  var t = this;
                  fetch(latestJson)
                    .then(response => {
                      if (response.ok) {
                        return response.json();
                      } else {
                        throw new Error('Network response was not ok');
                      }
                    })
                    .then(e => {
                      fx.rates = e.rates;
                      fx.base = e.base;
                      t.storage.ratesData = e;
                      t.saveStorage();
                      t.currencyConvert();
                      n.textContent = "⚡" + new Date(1e3 * parseInt(e.timestamp) - _offsetTimezone()).toUTCString();
                    })
                    .catch(error => {
                      console.log(chrome.i18n.getMessage("appDisconnected"));
                    });
                },
              },
              {
                key: "saveStorage",
                value: function (e) {
                  chrome.storage.local.set(this.storage);
                },
              },
            ]),
            e
          );
        })())();
      },
      { "./written-number.min.js": 2 },
    ],
    2: [
      function (c, t, i) {
        (function (n) {
          !(function (e) {
            if ("object" == _typeof(i) && void 0 !== t) t.exports = e();
            else if ("function" == typeof define && define.amd) define([], e);
            else {
              ("undefined" != typeof window
                ? window
                : void 0 !== n
                ? n
                : "undefined" != typeof self
                ? self
                : this
              ).writtenNumber = e();
            }
          })(function () {
            return (function r(s, l, o) {
              function u(n, e) {
                if (!l[n]) {
                  if (!s[n]) {
                    var t = "function" == typeof c && c;
                    if (!e && t) return t(n, !0);
                    if (d) return d(n, !0);
                    var i = new Error("Cannot find module '" + n + "'");
                    throw ((i.code = "MODULE_NOT_FOUND"), i);
                  }
                  var a = (l[n] = { exports: {} });
                  s[n][0].call(
                    a.exports,
                    function (e) {
                      return u(s[n][1][e] || e);
                    },
                    a,
                    a.exports,
                    r,
                    s,
                    l,
                    o
                  );
                }
                return l[n].exports;
              }
              for (
                var d = "function" == typeof c && c, e = 0;
                e < o.length;
                e++
              )
                u(o[e]);
              return u;
            })(
              {
                1: [
                  function (e, n, t) {
                    n.exports = {
                      useLongScale: !1,
                      baseSeparator: "",
                      unitSeparator: "",
                      allSeparator: "و",
                      base: {
                        0: "صفر",
                        1: "واحد",
                        2: "اثنان",
                        3: "ثلاثة",
                        4: "أربعة",
                        5: "خمسة",
                        6: "ستة",
                        7: "سبعة",
                        8: "ثمانية",
                        9: "تسعة",
                        10: "عشرة",
                        11: "أحد عشر",
                        12: "إثنا عشر",
                        13: "ثلاثة عشر",
                        14: "أربعة عشر",
                        15: "خمسة عشر",
                        16: "ستة عشر",
                        17: "سبعة عشر",
                        18: "ثمانية عشر",
                        19: "تسعة عشر",
                        20: "عشرون",
                        21: "واحد وعشرون",
                        22: "اثنان وعشرون",
                        23: "ثلاثة وعشرون",
                        24: "أربعة وعشرون",
                        25: "خمسة وعشرون",
                        26: "ستة وعشرون",
                        27: "سبعة وعشرون",
                        28: "ثمانية وعشرون",
                        29: "تسعة وعشرون",
                        30: "ثلاثون",
                        31: "واحد وثلاثون",
                        32: "اثنان وثلاثون",
                        33: "ثلاثة وثلاثون",
                        34: "أربعة وثلاثون",
                        35: "خمسة وثلاثون",
                        36: "ستة وثلاثون",
                        37: "سبعة وثلاثون",
                        38: "ثمانية وثلاثون",
                        39: "تسعة وثلاثون",
                        40: "أربعون",
                        41: "واحد وأربعون",
                        42: "اثنان وأربعون",
                        43: "ثلاثة وأربعون",
                        44: "أربعة وأربعون",
                        45: "خمسة وأربعون",
                        46: "ستة وأربعون",
                        47: "سبعة وأربعون",
                        48: "ثمانية وأربعون",
                        49: "تسعة وأربعون",
                        50: "خمسون",
                        51: "واحد وخمسون",
                        52: "اثنان وخمسون",
                        53: "ثلاثة وخمسون",
                        54: "أربعة وخمسون",
                        55: "خمسة وخمسون",
                        56: "ستة وخمسون",
                        57: "سبعة وخمسون",
                        58: "ثمانية وخمسون",
                        59: "تسعة وخمسون",
                        60: "ستون",
                        61: "واحد وستون",
                        62: "اثنان وستون",
                        63: "ثلاثة وستون",
                        64: "أربعة وستون",
                        65: "خمسة وستون",
                        66: "ستة وستون",
                        67: "سبعة وستون",
                        68: "ثمانية وستون",
                        69: "تسعة وستون",
                        70: "سبعون",
                        71: "واحد وسبعون",
                        72: "اثنان وسبعون",
                        73: "ثلاثة وسبعون",
                        74: "أربعة وسبعون",
                        75: "خمسة وسبعون",
                        76: "ستة وسبعون",
                        77: "سبعة وسبعون",
                        78: "ثمانية وسبعون",
                        79: "تسعة وسبعون",
                        80: "ثمانون",
                        81: "واحد وثمانون",
                        82: "اثنان وثمانون",
                        83: "ثلاثة وثمانون",
                        84: "أربعة وثمانون",
                        85: "خمسة وثمانون",
                        86: "ستة وثمانون",
                        87: "سبعة وثمانون",
                        88: "ثمانية وثمانون",
                        89: "تسعة وثمانون",
                        90: "تسعون",
                        91: "واحد وتسعون",
                        92: "اثنان وتسعون",
                        93: "ثلاثة وتسعون",
                        94: "أربعة وتسعون",
                        95: "خمسة وتسعون",
                        96: "ستة وتسعون",
                        97: "سبعة وتسعون",
                        98: "ثمانية وتسعون",
                        99: "تسعة وتسعون",
                        200: "مائتان",
                        300: "ثلاثمائة",
                        400: "أربعمائة",
                        500: "خمسمائة",
                        600: "ستمائة",
                        700: "سبعمائة",
                        800: "ثمانمائة",
                        900: "تسعمائة",
                      },
                      units: [
                        {
                          singular: "مائة",
                          useBaseInstead: !0,
                          useBaseException: [1],
                        },
                        {
                          singular: "ألف",
                          dual: "ألفان",
                          plural: "آلاف",
                          restrictedPlural: !0,
                          avoidPrefixException: [1, 2],
                        },
                        {
                          singular: "مليون",
                          dual: "مليونان",
                          plural: "ملايين",
                          restrictedPlural: !0,
                          avoidPrefixException: [1, 2],
                        },
                        {
                          singular: "مليار",
                          dual: "ملياران",
                          plural: "ملايير",
                          restrictedPlural: !0,
                          avoidPrefixException: [1, 2],
                        },
                        { singular: "تريليون", avoidPrefixException: [1] },
                        { singular: "كوادريليون", avoidPrefixException: [1] },
                        { singular: "كوينتليون", avoidPrefixException: [1] },
                        { singular: "سكستليون", avoidPrefixException: [1] },
                        { singular: "سبتيلليون", avoidPrefixException: [1] },
                        { singular: "أوكتيليون", avoidPrefixException: [1] },
                        { singular: "نونيلليون", avoidPrefixException: [1] },
                        { singular: "دشيليون", avoidPrefixException: [1] },
                        { singular: "أوندشيلليون", avoidPrefixException: [1] },
                        { singular: "دودشيليون", avoidPrefixException: [1] },
                        { singular: "تريدشيليون", avoidPrefixException: [1] },
                        {
                          singular: "كواتوردشيليون",
                          avoidPrefixException: [1],
                        },
                        { singular: "كويندشيليون", avoidPrefixException: [1] },
                      ],
                      unitExceptions: {},
                    };
                  },
                  {},
                ],
                2: [
                  function (e, n, t) {
                    n.exports = {
                      useLongScale: !1,
                      baseSeparator: "-",
                      unitSeparator: "and ",
                      base: {
                        0: "zero",
                        1: "one",
                        2: "two",
                        3: "three",
                        4: "four",
                        5: "five",
                        6: "six",
                        7: "seven",
                        8: "eight",
                        9: "nine",
                        10: "ten",
                        11: "eleven",
                        12: "twelve",
                        13: "thirteen",
                        14: "fourteen",
                        15: "fifteen",
                        16: "sixteen",
                        17: "seventeen",
                        18: "eighteen",
                        19: "nineteen",
                        20: "twenty",
                        30: "thirty",
                        40: "forty",
                        50: "fifty",
                        60: "sixty",
                        70: "seventy",
                        80: "eighty",
                        90: "ninety",
                      },
                      units: {
                        2: "hundred",
                        3: "thousand",
                        5: "lakh",
                        7: "crore",
                      },
                      unitExceptions: [],
                    };
                  },
                  {},
                ],
                3: [
                  function (e, n, t) {
                    n.exports = {
                      useLongScale: !1,
                      baseSeparator: "-",
                      unitSeparator: "and ",
                      base: {
                        0: "zero",
                        1: "one",
                        2: "two",
                        3: "three",
                        4: "four",
                        5: "five",
                        6: "six",
                        7: "seven",
                        8: "eight",
                        9: "nine",
                        10: "ten",
                        11: "eleven",
                        12: "twelve",
                        13: "thirteen",
                        14: "fourteen",
                        15: "fifteen",
                        16: "sixteen",
                        17: "seventeen",
                        18: "eighteen",
                        19: "nineteen",
                        20: "twenty",
                        30: "thirty",
                        40: "forty",
                        50: "fifty",
                        60: "sixty",
                        70: "seventy",
                        80: "eighty",
                        90: "ninety",
                      },
                      units: [
                        "hundred",
                        "thousand",
                        "million",
                        "billion",
                        "trillion",
                        "quadrillion",
                        "quintillion",
                        "sextillion",
                        "septillion",
                        "octillion",
                        "nonillion",
                        "decillion",
                        "undecillion",
                        "duodecillion",
                        "tredecillion",
                        "quattuordecillion",
                        "quindecillion",
                      ],
                      unitExceptions: [],
                    };
                  },
                  {},
                ],
                4: [
                  function (e, n, t) {
                    n.exports = {
                      useLongScale: !1,
                      baseSeparator: " ",
                      unitSeparator: "",
                      base: {
                        0: "nulo",
                        1: "unu",
                        2: "du",
                        3: "tri",
                        4: "kvar",
                        5: "kvin",
                        6: "ses",
                        7: "sep",
                        8: "ok",
                        9: "naŭ",
                        10: "dek",
                        20: "dudek",
                        30: "tridek",
                        40: "kvardek",
                        50: "kvindek",
                        60: "sesdek",
                        70: "sepdek",
                        80: "okdek",
                        90: "naŭdek",
                        100: "cent",
                        200: "ducent",
                        300: "tricent",
                        400: "kvarcent",
                        500: "kvincent",
                        600: "sescent",
                        700: "sepcent",
                        800: "okcent",
                        900: "naŭcent",
                      },
                      units: [
                        { useBaseInstead: !0, useBaseException: [] },
                        { singular: "mil", avoidPrefixException: [1] },
                        {
                          singular: "miliono",
                          plural: "milionoj",
                          avoidPrefixException: [1],
                        },
                        {
                          singular: "miliardo",
                          plural: "miliardoj",
                          avoidPrefixException: [1],
                        },
                        {
                          singular: "biliono",
                          plural: "bilionoj",
                          avoidPrefixException: [1],
                        },
                      ],
                      unitExceptions: [],
                    };
                  },
                  {},
                ],
                5: [
                  function (e, n, t) {
                    n.exports = {
                      useLongScale: !0,
                      baseSeparator: " y ",
                      unitSeparator: "",
                      base: {
                        0: "cero",
                        1: "uno",
                        2: "dos",
                        3: "tres",
                        4: "cuatro",
                        5: "cinco",
                        6: "seis",
                        7: "siete",
                        8: "ocho",
                        9: "nueve",
                        10: "diez",
                        11: "once",
                        12: "doce",
                        13: "trece",
                        14: "catorce",
                        15: "quince",
                        16: "dieciséis",
                        17: "diecisiete",
                        18: "dieciocho",
                        19: "diecinueve",
                        20: "veinte",
                        21: "veintiuno",
                        22: "veintidós",
                        23: "veintitrés",
                        24: "veinticuatro",
                        25: "veinticinco",
                        26: "veintiséis",
                        27: "veintisiete",
                        28: "veintiocho",
                        29: "veintinueve",
                        30: "treinta",
                        40: "cuarenta",
                        50: "cincuenta",
                        60: "sesenta",
                        70: "setenta",
                        80: "ochenta",
                        90: "noventa",
                        100: "cien",
                        200: "doscientos",
                        300: "trescientos",
                        400: "cuatrocientos",
                        500: "quinientos",
                        600: "seiscientos",
                        700: "setecientos",
                        800: "ochocientos",
                        900: "novecientos",
                        1e3: "mil",
                      },
                      unitExceptions: {
                        1e6: "un millón",
                        1e12: "un billón",
                        1e18: "un trillón",
                        "1000000000000000000000000": "un cuatrillones",
                        "1000000000000000000000000000000": "un quintillón",
                        "1000000000000000000000000000000000000": "un sextillón",
                        "1000000000000000000000000000000000000000000":
                          "un septillón",
                        "1000000000000000000000000000000000000000000000000":
                          "un octillón",
                        "1000000000000000000000000000000000000000000000000000000":
                          "un nonillón",
                        "1000000000000000000000000000000000000000000000000000000000000":
                          "un decillón",
                        "1000000000000000000000000000000000000000000000000000000000000000000":
                          "un undecillón",
                        "1000000000000000000000000000000000000000000000000000000000000000000000000":
                          "un duodecillón",
                        "1000000000000000000000000000000000000000000000000000000000000000000000000000000":
                          "un tredecillón",
                        "1000000000000000000000000000000000000000000000000000000000000000000000000000000000000":
                          "un cuatordecillón",
                        "1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000":
                          "un quindecillón",
                      },
                      units: [
                        {
                          singular: "ciento",
                          useBaseInstead: !0,
                          useBaseException: [1],
                        },
                        { singular: "mil", avoidPrefixException: [1] },
                        { singular: "millón", plural: "millones" },
                        { singular: "billón", plural: "billones" },
                        { singular: "trillón", plural: "trillones" },
                        { singular: "cuatrillón", plural: "cuatrillones" },
                        { singular: "quintillón", plural: "quintillones" },
                        { singular: "sextillón", plural: "sextillones" },
                        { singular: "septillón", plural: "septillones" },
                        { singular: "octillón", plural: "octillones" },
                        { singular: "nonillón", plural: "nonillones" },
                        { singular: "decillón", plural: "decillones" },
                        { singular: "undecillón", plural: "undecillones" },
                        { singular: "duodecillón", plural: "duodecillones" },
                        { singular: "tredecillón", plural: "tredecillones" },
                        {
                          singular: "cuatrodecillón",
                          plural: "cuatrodecillones",
                        },
                        { singular: "quindecillón", plural: "quindecillones" },
                      ],
                    };
                  },
                  {},
                ],
                6: [
                  function (e, n, t) {
                    n.exports = {
                      useLongScale: !1,
                      baseSeparator: "-",
                      unitSeparator: "",
                      base: {
                        0: "zéro",
                        1: "un",
                        2: "deux",
                        3: "trois",
                        4: "quatre",
                        5: "cinq",
                        6: "six",
                        7: "sept",
                        8: "huit",
                        9: "neuf",
                        10: "dix",
                        11: "onze",
                        12: "douze",
                        13: "treize",
                        14: "quatorze",
                        15: "quinze",
                        16: "seize",
                        17: "dix-sept",
                        18: "dix-huit",
                        19: "dix-neuf",
                        20: "vingt",
                        30: "trente",
                        40: "quarante",
                        50: "cinquante",
                        60: "soixante",
                        70: "soixante-dix",
                        80: "quatre-vingt",
                        90: "quatre-vingt-dix",
                      },
                      units: [
                        {
                          singular: "cent",
                          plural: "cents",
                          avoidInNumberPlural: !0,
                          avoidPrefixException: [1],
                        },
                        { singular: "mille", avoidPrefixException: [1] },
                        { singular: "million", plural: "millions" },
                        { singular: "milliard", plural: "milliards" },
                        { singular: "billion", plural: "billions" },
                        { singular: "billiard", plural: "billiards" },
                        { singular: "trillion", plural: "trillions" },
                        { singular: "trilliard", plural: "trilliards" },
                        { singular: "quadrillion", plural: "quadrillions" },
                        { singular: "quadrilliard", plural: "quadrilliards" },
                        { singular: "quintillion", plural: "quintillions" },
                        { singular: "quintilliard", plural: "quintilliards" },
                        { singular: "sextillion", plural: "sextillions" },
                        { singular: "sextilliard", plural: "sextilliards" },
                        { singular: "septillion", plural: "septillions" },
                        { singular: "septilliard", plural: "septilliards" },
                        { singular: "octillion", plural: "octillions" },
                      ],
                      unitExceptions: {
                        21: "vingt et un",
                        31: "trente et un",
                        41: "quarante et un",
                        51: "cinquante et un",
                        61: "soixante et un",
                        71: "soixante et onze",
                        72: "soixante-douze",
                        73: "soixante-treize",
                        74: "soixante-quatorze",
                        75: "soixante-quinze",
                        76: "soixante-seize",
                        77: "soixante-dix-sept",
                        78: "soixante-dix-huit",
                        79: "soixante-dix-neuf",
                        80: "quatre-vingts",
                        91: "quatre-vingt-onze",
                        92: "quatre-vingt-douze",
                        93: "quatre-vingt-treize",
                        94: "quatre-vingt-quatorze",
                        95: "quatre-vingt-quinze",
                        96: "quatre-vingt-seize",
                        97: "quatre-vingt-dix-sept",
                        98: "quatre-vingt-dix-huit",
                        99: "quatre-vingt-dix-neuf",
                      },
                    };
                  },
                  {},
                ],
                7: [
                  function (e, n, t) {
                    n.exports = {
                      useLongScale: !0,
                      baseSeparator: "",
                      unitSeparator: "és ",
                      base: {
                        0: "nulla",
                        1: "egy",
                        2: "kettő",
                        3: "három",
                        4: "négy",
                        5: "öt",
                        6: "hat",
                        7: "hét",
                        8: "nyolc",
                        9: "kilenc",
                        10: "tíz",
                        11: "tizenegy",
                        12: "tizenkettő",
                        13: "tizenhárom",
                        14: "tizennégy",
                        15: "tizenöt",
                        16: "tizenhat",
                        17: "tizenhét",
                        18: "tizennyolc",
                        19: "tizenkilenc",
                        20: "húsz",
                        21: "huszonegy",
                        22: "huszonkettő",
                        23: "huszonhárom",
                        24: "huszonnégy",
                        25: "huszonöt",
                        26: "huszonhat",
                        27: "huszonhét",
                        28: "huszonnyolc",
                        29: "huszonkilenc",
                        30: "harminc",
                        40: "negyven",
                        50: "ötven",
                        60: "hatvan",
                        70: "hetven",
                        80: "nyolcvan",
                        90: "kilencven",
                        100: "száz",
                        200: "kétszáz",
                        300: "háromszáz",
                        400: "négyszáz",
                        500: "ötszáz",
                        600: "hatszáz",
                        700: "hétszáz",
                        800: "nyolcszáz",
                        900: "kilencszáz",
                        1e3: "ezer",
                      },
                      unitExceptions: { 1: "egy" },
                      units: [
                        {
                          singular: "száz",
                          useBaseInstead: !0,
                          useBaseException: [1],
                        },
                        { singular: "ezer", avoidPrefixException: [1] },
                        { singular: "millió", avoidPrefixException: [1] },
                        { singular: "milliárd", avoidPrefixException: [1] },
                        { singular: "-billió", avoidPrefixException: [1] },
                        { singular: "billiárd", avoidPrefixException: [1] },
                        { singular: "trillió", avoidPrefixException: [1] },
                        { singular: "trilliárd", avoidPrefixException: [1] },
                        { singular: "kvadrillió", avoidPrefixException: [1] },
                        { singular: "kvadrilliárd", avoidPrefixException: [1] },
                        { singular: "kvintillió", avoidPrefixException: [1] },
                        { singular: "kvintilliárd", avoidPrefixException: [1] },
                        { singular: "szextillió", avoidPrefixException: [1] },
                        { singular: "szeptillió", avoidPrefixException: [1] },
                        { singular: "oktillió", avoidPrefixException: [1] },
                        { singular: "nonillió", avoidPrefixException: [1] },
                      ],
                    };
                  },
                  {},
                ],
                8: [
                  function (e, n, t) {
                    n.exports = {
                      useLongScale: !1,
                      baseSeparator: " ",
                      unitSeparator: "",
                      base: {
                        0: "nol",
                        1: "satu",
                        2: "dua",
                        3: "tiga",
                        4: "empat",
                        5: "lima",
                        6: "enam",
                        7: "tujuh",
                        8: "delapan",
                        9: "sembilan",
                        10: "sepuluh",
                        11: "sebelas",
                        12: "dua belas",
                        13: "tiga belas",
                        14: "empat belas",
                        15: "lima belas",
                        16: "enam belas",
                        17: "tujuh belas",
                        18: "delapan belas",
                        19: "sembilan belas",
                        20: "dua puluh",
                        30: "tiga puluh",
                        40: "empat puluh",
                        50: "lima puluh",
                        60: "enam puluh",
                        70: "tujuh puluh",
                        80: "delapan puluh",
                        90: "sembilan puluh",
                      },
                      units: [
                        {
                          singular: "seratus",
                          plural: "ratus",
                          avoidPrefixException: [1],
                        },
                        {
                          singular: "seribu",
                          plural: "ribu",
                          avoidPrefixException: [1],
                        },
                        "juta",
                        "miliar",
                        "triliun",
                        "kuadiliun",
                      ],
                      unitExceptions: [],
                    };
                  },
                  {},
                ],
                9: [
                  function (e, n, t) {
                    n.exports = {
                      useLongScale: !1,
                      baseSeparator: "",
                      unitSeparator: "",
                      generalSeparator: "",
                      wordSeparator: "",
                      base: {
                        0: "zero",
                        1: "uno",
                        2: "due",
                        3: "tre",
                        4: "quattro",
                        5: "cinque",
                        6: "sei",
                        7: "sette",
                        8: "otto",
                        9: "nove",
                        10: "dieci",
                        11: "undici",
                        12: "dodici",
                        13: "tredici",
                        14: "quattordici",
                        15: "quindici",
                        16: "sedici",
                        17: "diciassette",
                        18: "diciotto",
                        19: "diciannove",
                        20: "venti",
                        21: "ventuno",
                        23: "ventitré",
                        28: "ventotto",
                        30: "trenta",
                        31: "trentuno",
                        33: "trentatré",
                        38: "trentotto",
                        40: "quaranta",
                        41: "quarantuno",
                        43: "quaranta­tré",
                        48: "quarantotto",
                        50: "cinquanta",
                        51: "cinquantuno",
                        53: "cinquantatré",
                        58: "cinquantotto",
                        60: "sessanta",
                        61: "sessantuno",
                        63: "sessanta­tré",
                        68: "sessantotto",
                        70: "settanta",
                        71: "settantuno",
                        73: "settantatré",
                        78: "settantotto",
                        80: "ottanta",
                        81: "ottantuno",
                        83: "ottantatré",
                        88: "ottantotto",
                        90: "novanta",
                        91: "novantuno",
                        93: "novantatré",
                        98: "novantotto",
                        100: "cento",
                        101: "centuno",
                        108: "centootto",
                        180: "centottanta",
                        201: "duecentuno",
                        301: "tre­cent­uno",
                        401: "quattro­cent­uno",
                        501: "cinque­cent­uno",
                        601: "sei­cent­uno",
                        701: "sette­cent­uno",
                        801: "otto­cent­uno",
                        901: "nove­cent­uno",
                      },
                      unitExceptions: { 1: "un" },
                      units: [
                        { singular: "cento", avoidPrefixException: [1] },
                        {
                          singular: "mille",
                          plural: "mila",
                          avoidPrefixException: [1],
                        },
                        { singular: "milione", plural: "milioni" },
                        { singular: "miliardo", plural: "miliardi" },
                        { singular: "bilione", plural: "bilioni" },
                        { singular: "biliardo", plural: "biliardi" },
                        { singular: "trilione", plural: "trilioni" },
                        { singular: "triliardo", plural: "triliardi" },
                        { singular: "quadrilione", plural: "quadrilioni" },
                        { singular: "quadriliardo", plural: "quadriliardi" },
                      ],
                    };
                  },
                  {},
                ],
                10: [
                  function (e, n, t) {
                    n.exports = {
                      useLongScale: !0,
                      baseSeparator: " e ",
                      unitSeparator: "e ",
                      andWhenTrailing: !0,
                      base: {
                        0: "zero",
                        1: "um",
                        2: "dois",
                        3: "três",
                        4: "quatro",
                        5: "cinco",
                        6: "seis",
                        7: "sete",
                        8: "oito",
                        9: "nove",
                        10: "dez",
                        11: "onze",
                        12: "doze",
                        13: "treze",
                        14: "catorze",
                        15: "quinze",
                        16: "dezasseis",
                        17: "dezassete",
                        18: "dezoito",
                        19: "dezanove",
                        20: "vinte",
                        30: "trinta",
                        40: "quarenta",
                        50: "cinquenta",
                        60: "sessenta",
                        70: "setenta",
                        80: "oitenta",
                        90: "noventa",
                        100: "cem",
                        200: "duzentos",
                        300: "trezentos",
                        400: "quatrocentos",
                        500: "quinhentos",
                        600: "seiscentos",
                        700: "setecentos",
                        800: "oitocentos",
                        900: "novecentos",
                        1e3: "mil",
                      },
                      unitExceptions: { 1: "um" },
                      units: [
                        {
                          singular: "cento",
                          useBaseInstead: !0,
                          useBaseException: [1],
                          useBaseExceptionWhenNoTrailingNumbers: !0,
                          andException: !0,
                        },
                        {
                          singular: "mil",
                          avoidPrefixException: [1],
                          andException: !0,
                        },
                        { singular: "milhão", plural: "milhões" },
                        { singular: "bilião", plural: "biliões" },
                        { singular: "trilião", plural: "triliões" },
                        { singular: "quadrilião", plural: "quadriliões" },
                        { singular: "quintilião", plural: "quintiliões" },
                        { singular: "sextilião", plural: "sextiliões" },
                        { singular: "septilião", plural: "septiliões" },
                        { singular: "octilião", plural: "octiliões" },
                        { singular: "nonilião", plural: "noniliões" },
                        { singular: "decilião", plural: "deciliões" },
                      ],
                    };
                  },
                  {},
                ],
                11: [
                  function (e, n, t) {
                    n.exports = {
                      useLongScale: !1,
                      baseSeparator: " e ",
                      unitSeparator: "e ",
                      andWhenTrailing: !0,
                      base: {
                        0: "zero",
                        1: "um",
                        2: "dois",
                        3: "três",
                        4: "quatro",
                        5: "cinco",
                        6: "seis",
                        7: "sete",
                        8: "oito",
                        9: "nove",
                        10: "dez",
                        11: "onze",
                        12: "doze",
                        13: "treze",
                        14: "catorze",
                        15: "quinze",
                        16: "dezesseis",
                        17: "dezessete",
                        18: "dezoito",
                        19: "dezenove",
                        20: "vinte",
                        30: "trinta",
                        40: "quarenta",
                        50: "cinquenta",
                        60: "sessenta",
                        70: "setenta",
                        80: "oitenta",
                        90: "noventa",
                        100: "cem",
                        200: "duzentos",
                        300: "trezentos",
                        400: "quatrocentos",
                        500: "quinhentos",
                        600: "seiscentos",
                        700: "setecentos",
                        800: "oitocentos",
                        900: "novecentos",
                        1e3: "mil",
                      },
                      unitExceptions: { 1: "um" },
                      units: [
                        {
                          singular: "cento",
                          useBaseInstead: !0,
                          useBaseException: [1],
                          useBaseExceptionWhenNoTrailingNumbers: !0,
                          andException: !0,
                        },
                        {
                          singular: "mil",
                          avoidPrefixException: [1],
                          andException: !0,
                        },
                        { singular: "milhão", plural: "milhões" },
                        { singular: "bilhão", plural: "bilhões" },
                        { singular: "trilhão", plural: "trilhões" },
                        { singular: "quadrilhão", plural: "quadrilhão" },
                        { singular: "quintilhão", plural: "quintilhões" },
                        { singular: "sextilhão", plural: "sextilhões" },
                        { singular: "septilhão", plural: "septilhões" },
                        { singular: "octilhão", plural: "octilhões" },
                        { singular: "nonilhão", plural: "nonilhões" },
                        { singular: "decilhão", plural: "decilhões" },
                        { singular: "undecilhão", plural: "undecilhões" },
                        { singular: "doudecilhão", plural: "doudecilhões" },
                        { singular: "tredecilhão", plural: "tredecilhões" },
                      ],
                    };
                  },
                  {},
                ],
                12: [
                  function (e, n, t) {
                    n.exports = {
                      useLongScale: !1,
                      baseSeparator: " ",
                      unitSeparator: "",
                      base: {
                        0: "ноль",
                        1: "один",
                        2: "два",
                        3: "три",
                        4: "четыре",
                        5: "пять",
                        6: "шесть",
                        7: "семь",
                        8: "восемь",
                        9: "девять",
                        10: "десять",
                        11: "одинадцать",
                        12: "двенадцать",
                        13: "тринадцать",
                        14: "четырнадцать",
                        15: "пятнадцать",
                        16: "шестнадцать",
                        17: "семнадцать",
                        18: "восемнадцать",
                        19: "девятнадцать",
                        20: "двадцать",
                        30: "тридцать",
                        40: "сорок",
                        50: "пятьдесят",
                        60: "шестьдесят",
                        70: "семьдесят",
                        80: "восемьдесят",
                        90: "девяносто",
                        100: "сто",
                        200: "двести",
                        300: "триста",
                        400: "четыреста",
                        500: "пятьсот",
                        600: "шестьсот",
                        700: "семьсот",
                        800: "восемьсот",
                        900: "девятьсот",
                      },
                      alternativeBase: { feminine: { 1: "одна", 2: "две" } },
                      units: [
                        { useBaseInstead: !0, useBaseException: [] },
                        {
                          singular: "тысяча",
                          few: "тысячи",
                          plural: "тысяч",
                          useAlternativeBase: "feminine",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "миллион",
                          few: "миллиона",
                          plural: "миллионов",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "миллиард",
                          few: "миллиарда",
                          plural: "миллиардов",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "триллион",
                          few: "триллиона",
                          plural: "триллионов",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "квадрильон",
                          few: "квадриллион",
                          plural: "квадрилон",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "квинтиллион",
                          few: "квинтиллиона",
                          plural: "квинтильонов",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "секстиллионов",
                          few: "секстильона",
                          plural: "секстиллионов",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "септиллион",
                          few: "септиллиона",
                          plural: "септиллионов",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "октиллион",
                          few: "октиллиона",
                          plural: "октиллионов",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "нониллион",
                          few: "нониллиона",
                          plural: "нониллионов",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "дециллион",
                          few: "дециллиона",
                          plural: "дециллионов",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "ундециллион",
                          few: "ундециллиона",
                          plural: "ундециллионив",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "дуодециллион",
                          few: "дуодециллиона",
                          plural: "дуодециллионив",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "тредециллион",
                          few: "тредециллиона",
                          plural: "тредециллионив",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "кватуордециллион",
                          few: "кватуордециллиона",
                          plural: "кватуордециллионив",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "квиндециллион",
                          few: "квиндециллиона",
                          plural: "квиндециллионив",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                      ],
                      unitExceptions: [],
                    };
                  },
                  {},
                ],
                13: [
                  function (e, n, t) {
                    n.exports = {
                      useLongScale: !1,
                      baseSeparator: " ",
                      unitSeparator: "",
                      base: {
                        0: "sıfır",
                        1: "bir",
                        2: "iki",
                        3: "üç",
                        4: "dört",
                        5: "beş",
                        6: "altı",
                        7: "yedi",
                        8: "sekiz",
                        9: "dokuz",
                        10: "on",
                        20: "yirmi",
                        30: "otuz",
                        40: "kırk",
                        50: "elli",
                        60: "altmış",
                        70: "yetmiş",
                        80: "seksen",
                        90: "doksan",
                      },
                      units: [
                        { singular: "yüz", avoidPrefixException: [1] },
                        { singular: "bin", avoidPrefixException: [1] },
                        "milyon",
                        "milyar",
                        "trilyon",
                        "katrilyon",
                        "kentilyon",
                        "sekstilyon",
                        "septilyon",
                        "oktilyon",
                        "nonilyon",
                        "desilyon",
                        "andesilyon",
                        "dodesilyon",
                        "tredesilyon",
                        "katordesilyon",
                        "kendesilyon",
                      ],
                      unitExceptions: [],
                    };
                  },
                  {},
                ],
                14: [
                  function (e, n, t) {
                    n.exports = {
                      useLongScale: !1,
                      baseSeparator: " ",
                      unitSeparator: "",
                      base: {
                        0: "нуль",
                        1: "один",
                        2: "два",
                        3: "три",
                        4: "чотири",
                        5: "п’ять",
                        6: "шість",
                        7: "сім",
                        8: "вісім",
                        9: "дев’ять",
                        10: "десять",
                        11: "одинадцять",
                        12: "дванадцять",
                        13: "тринадцять",
                        14: "чотирнадцять",
                        15: "п’ятнадцять",
                        16: "шістнадцять",
                        17: "сімнадцять",
                        18: "вісімнадцять",
                        19: "дев’ятнадцять",
                        20: "двадцять",
                        30: "тридцять",
                        40: "сорок",
                        50: "п’ятдесят",
                        60: "шістдесят",
                        70: "сімдесят",
                        80: "вісімдесят",
                        90: "дев’яносто",
                        100: "сто",
                        200: "двісті",
                        300: "триста",
                        400: "чотириста",
                        500: "п’ятсот",
                        600: "шістсот",
                        700: "сімсот",
                        800: "вісімсот",
                        900: "дев’ятсот",
                      },
                      alternativeBase: { feminine: { 1: "одна", 2: "дві" } },
                      units: [
                        { useBaseInstead: !0, useBaseException: [] },
                        {
                          singular: "тисяча",
                          few: "тисячі",
                          plural: "тисяч",
                          useAlternativeBase: "feminine",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "мільйон",
                          few: "мільйони",
                          plural: "мільйонів",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "мільярд",
                          few: "мільярди",
                          plural: "мільярдів",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "трильйон",
                          few: "трильйони",
                          plural: "трильйонів",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "квадрильйон",
                          few: "квадрильйони",
                          plural: "квадрильйонів",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "квінтильйон",
                          few: "квінтильйони",
                          plural: "квінтильйонів",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "секстильйон",
                          few: "секстильйони",
                          plural: "секстильйонів",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "септілліон",
                          few: "септілліони",
                          plural: "септілліонів",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "октілліон",
                          few: "октілліони",
                          plural: "октілліонів",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "нонілліон",
                          few: "нонілліони",
                          plural: "нонілліонів",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "децілліон",
                          few: "децілліони",
                          plural: "децілліонів",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "ундецілліон",
                          few: "ундецілліони",
                          plural: "ундецілліонів",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "дуодецілліон",
                          few: "дуодецілліони",
                          plural: "дуодецілліонів",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "тредецілліон",
                          few: "тредецілліони",
                          plural: "тредецілліонів",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "кватуордецілліон",
                          few: "кватуордецілліони",
                          plural: "кватуордецілліонів",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                        {
                          singular: "квіндецілліон",
                          few: "квіндецілліони",
                          plural: "квіндецілліонів",
                          useSingularEnding: !0,
                          useFewEnding: !0,
                          avoidEndingRules: [
                            11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213,
                            214, 311, 312, 313, 314, 411, 412, 413, 414, 511,
                            512, 513, 514, 611, 612, 613, 614, 711, 712, 713,
                            714, 811, 812, 813, 814, 911, 912, 913, 914,
                          ],
                        },
                      ],
                      unitExceptions: [],
                    };
                  },
                  {},
                ],
                15: [
                  function (e, n, t) {
                    n.exports = {
                      useLongScale: !1,
                      baseSeparator: " ",
                      unitSeparator: "và ",
                      base: {
                        0: "không",
                        1: "một",
                        2: "hai",
                        3: "ba",
                        4: "bốn",
                        5: "năm",
                        6: "sáu",
                        7: "bảy",
                        8: "tám",
                        9: "chín",
                        10: "mười",
                        15: "mười lăm",
                        20: "hai mươi",
                        21: "hai mươi mốt",
                        25: "hai mươi lăm",
                        30: "ba mươi",
                        31: "ba mươi mốt",
                        40: "bốn mươi",
                        41: "bốn mươi mốt",
                        45: "bốn mươi lăm",
                        50: "năm mươi",
                        51: "năm mươi mốt",
                        55: "năm mươi lăm",
                        60: "sáu mươi",
                        61: "sáu mươi mốt",
                        65: "sáu mươi lăm",
                        70: "bảy mươi",
                        71: "bảy mươi mốt",
                        75: "bảy mươi lăm",
                        80: "tám mươi",
                        81: "tám mươi mốt",
                        85: "tám mươi lăm",
                        90: "chín mươi",
                        91: "chín mươi mốt",
                        95: "chín mươi lăm",
                      },
                      units: ["trăm", "ngàn", "triệu", "tỷ", "nghìn tỷ"],
                      unitExceptions: [],
                    };
                  },
                  {},
                ],
                16: [
                  function (e, n, t) {
                    function k(e, n) {
                      if (
                        ((n = n || {}), (n = P.defaults(n, k.defaults)), e < 0)
                      )
                        return "";
                      e = Math.round(+e);
                      var t = "string" == typeof n.lang ? B[n.lang] : n.lang;
                      t ||
                        (N.indexOf(k.defaults.lang) < 0 &&
                          (k.defaults.lang = "en"),
                        (t = B[k.defaults.lang]));
                      var i,
                        a = t.useLongScale ? j : L,
                        r = t.units;
                      if (!(r instanceof Array)) {
                        var s = r;
                        for (var l in ((r = []), (a = Object.keys(s))))
                          r.push(s[a[l]]),
                            (a[l] = Math.pow(10, parseInt(a[l])));
                      }
                      var o,
                        u,
                        d,
                        c,
                        g,
                        p,
                        v,
                        f = t.base,
                        m = n.alternativeBase
                          ? t.alternativeBase[n.alternativeBase]
                          : {};
                      if (t.unitExceptions[e]) return t.unitExceptions[e];
                      if (m[e]) return m[e];
                      if (f[e]) return f[e];
                      if (e < 100)
                        return (
                          (o = e),
                          (u = t),
                          (d = i),
                          (c = f),
                          (g = m),
                          (p = n),
                          (v = 10 * Math.floor(o / 10)),
                          (d = o - v)
                            ? g[v] || c[v] + u.baseSeparator + k(d, p)
                            : g[v] || c[v]
                        );
                      var h = e % 100,
                        x = [];
                      h &&
                        (!n.noAnd || (t.andException && t.andException[10])
                          ? x.push(t.unitSeparator + k(h, n))
                          : x.push(k(h, n)));
                      l = 0;
                      for (var E, y = r.length; l < y; l++) {
                        var b = Math.floor(e / a[l]);
                        if (
                          ((b %= l === y - 1 ? 1e6 : a[l + 1] / a[l]),
                          (i = r[l]),
                          b)
                        )
                          if (((E = a[l]), i.useBaseInstead)) {
                            -1 < i.useBaseException.indexOf(b) &&
                            (!i.useBaseExceptionWhenNoTrailingNumbers ||
                              (0 === l && x.length))
                              ? x.push(
                                  1 < b && i.plural ? i.plural : i.singular
                                )
                              : x.push(m[b * a[l]] || f[b * a[l]]);
                          } else {
                            var S;
                            if (
                              ((S =
                                "string" == typeof i
                                  ? i
                                  : 1 === b ||
                                    (i.useSingularEnding &&
                                      b % 10 == 1 &&
                                      (!i.avoidEndingRules ||
                                        i.avoidEndingRules.indexOf(b) < 0))
                                  ? i.singular
                                  : i.few &&
                                    ((1 < b && b < 5) ||
                                      (i.useFewEnding &&
                                        1 < b % 10 &&
                                        b % 10 < 5 &&
                                        (!i.avoidEndingRules ||
                                          i.avoidEndingRules.indexOf(b) < 0)))
                                  ? i.few
                                  : ((S =
                                      !i.plural || (i.avoidInNumberPlural && h)
                                        ? i.singular
                                        : i.plural),
                                    (S = 2 === b && i.dual ? i.dual : S),
                                    10 < b && i.restrictedPlural
                                      ? i.singular
                                      : S)),
                              i.avoidPrefixException &&
                                -1 < i.avoidPrefixException.indexOf(b))
                            )
                              x.push(S);
                            else {
                              var w =
                                t.unitExceptions[b] ||
                                k(
                                  b,
                                  P.defaults(
                                    {
                                      noAnd: !(
                                        (t.andException && t.andException[b]) ||
                                        i.andException
                                      ),
                                      alternativeBase: i.useAlternativeBase,
                                    },
                                    n
                                  )
                                );
                              (e -= b * a[l]), x.push(w + " " + S);
                            }
                          }
                      }
                      var q = e - E * Math.floor(e / E);
                      if (
                        (t.andWhenTrailing &&
                          E &&
                          0 < q &&
                          0 !== x[0].indexOf(t.unitSeparator) &&
                          (x = [
                            x[0],
                            t.unitSeparator.replace(/\s+$/, ""),
                          ].concat(x.slice(1))),
                        t.allSeparator)
                      )
                        for (var z = 0; z < x.length - 1; z++)
                          x[z] = t.allSeparator + x[z];
                      return x.reverse().join(" ");
                    }
                    t = n.exports = k;
                    var P = e("./util"),
                      N = [
                        "en",
                        "es",
                        "ar",
                        "pt",
                        "fr",
                        "eo",
                        "it",
                        "vi",
                        "tr",
                        "uk",
                        "ru",
                        "id",
                      ],
                      B = {
                        en: e("./i18n/en.json"),
                        es: e("./i18n/es.json"),
                        ar: e("./i18n/ar.json"),
                        pt: e("./i18n/pt.json"),
                        ptPT: e("./i18n/pt-PT.json"),
                        fr: e("./i18n/fr.json"),
                        eo: e("./i18n/eo.json"),
                        it: e("./i18n/it.json"),
                        vi: e("./i18n/vi.json"),
                        tr: e("./i18n/tr.json"),
                        hu: e("./i18n/hu.json"),
                        enIndian: e("./i18n/en-indian.json"),
                        uk: e("./i18n/uk.json"),
                        ru: e("./i18n/ru.json"),
                        id: e("./i18n/id.json"),
                      };
                    t.i18n = B;
                    for (var L = [100], i = 1; i <= 16; i++)
                      L.push(Math.pow(10, 3 * i));
                    var j = [100, 1e3];
                    for (i = 1; i <= 15; i++) j.push(Math.pow(10, 6 * i));
                    k.defaults = {
                      noAnd: !1,
                      alternativeBase: null,
                      lang: "en",
                    };
                  },
                  {
                    "./i18n/ar.json": 1,
                    "./i18n/en-indian.json": 2,
                    "./i18n/en.json": 3,
                    "./i18n/eo.json": 4,
                    "./i18n/es.json": 5,
                    "./i18n/fr.json": 6,
                    "./i18n/hu.json": 7,
                    "./i18n/id.json": 8,
                    "./i18n/it.json": 9,
                    "./i18n/pt-PT.json": 10,
                    "./i18n/pt.json": 11,
                    "./i18n/ru.json": 12,
                    "./i18n/tr.json": 13,
                    "./i18n/uk.json": 14,
                    "./i18n/vi.json": 15,
                    "./util": 17,
                  },
                ],
                17: [
                  function (e, n, t) {
                    t.defaults = function (e, n) {
                      null == e && (e = {});
                      for (
                        var t = {}, i = Object.keys(n), a = 0, r = i.length;
                        a < r;
                        a++
                      ) {
                        var s = i[a];
                        t[s] = e[s] || n[s];
                      }
                      return t;
                    };
                  },
                  {},
                ],
              },
              {},
              [16]
            )(16);
          });
        }).call(
          this,
          "undefined" != typeof global
            ? global
            : "undefined" != typeof self
            ? self
            : "undefined" != typeof window
            ? window
            : {}
        );
      },
      {},
    ],
  },
  {},
  [1]
);

"use strict";
importScripts('common.js');
function _classCallCheck(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, t) {
  for (var n = 0; n < t.length; n++) {
    var o = t[n];
    (o.enumerable = o.enumerable || !1),
      (o.configurable = !0),
      "value" in o && (o.writable = !0),
      Object.defineProperty(e, o.key, o);
  }
}
function _createClass(e, t, n) {
  return (
    t && _defineProperties(e.prototype, t), n && _defineProperties(e, n), e
  );
}
var Background = (function () {
    function t() {
      _classCallCheck(this, t);
      var e = this;
      (this.storage = STORAGE),
        this.initStorage(function () {
          e.run();
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
          key: "saveStorage",
          value: function () {
            chrome.storage.local.set(this.storage);
          },
        },
        {
          key: "run",
          value: function () {
            var e = this;
            this.update(),
              setInterval(function () {
                return e.update();
              }, 12e5);
          },
        },
        {
          key: "update",
          value: function () {
            var t = this;
            fetch(latestJson)
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.json();
              })
              .then(e => {
                if (e && e.rates) {
                  t.initStorage(function () {
                    t.storage.ratesData = e;
                    t.saveStorage();
                  });
                }
                console.log('background update');
              })
              .catch(error => {
                console.log(chrome.i18n.getMessage("appDisconnected"));
              });
          },
        },
      ]),
      t
    );
  })(),
  bg = new Background();
  chrome.runtime.onInstalled.addListener(function (e) {
    if ("install" == e.reason) {
      chrome.tabs.create({ url: chrome.runtime.getURL("install.html") });
  
      var n = function (e) {
        bg.storage.pairs = [];
        bg.storage.base.code = e;
        var t = currencyTopConversions[e];
        bg.storage.pairs.push({ id: gID(), code: bg.storage.base.code });
        for (var n = 0; n < 5; n++) {
          bg.storage.pairs.push({ id: gID(), code: t[n] });
        }
        bg.saveStorage();
      };
  
      fetch("https://ipinfo.io/geo")
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          var e = "USD";
          try {
            e = countryCurrency[data.country];
          } catch (error) {
            console.error('Error parsing country currency:', error);
          }
          n(e);
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
          console.log(chrome.i18n.getMessage("appDisconnected"));
        });
    }
  }),
  chrome.runtime.setUninstallURL &&
    chrome.runtime.setUninstallURL(
      "https://currencyrate.today/"
    );

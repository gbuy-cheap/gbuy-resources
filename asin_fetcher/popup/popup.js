$(document).ready(function() {
  var show = 0;
  $("body").on("click", ".profil", function() {
    if (show == 0) {
      $("ul").animate(
        {
          opacity: 1
        },
        600
      );
      $("ul").animate(
        {
          "margin-top": "35px"
        },
        {
          duration: 800,
          queue: false
        }
      );
      show = 1;
    } else {
      $("ul").animate(
        {
          opacity: 0
        },
        600
      );
      $("ul").animate(
        {
          "margin-top": "0"
        },
        {
          duration: 800,
          queue: false
        }
      );
      show = 0;
    }
  });

  $("body").on("change", "#myonoffswitch", function() {
    var isActive = $(this).is(":checked");
    chrome.storage.local.set({ asz_active: isActive }, function() {
      setActiveIcon(isActive);
    });
  });

  $("body").on("click", ".item-fetch-asins", e => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0].url.indexOf(".amazon") < 0) {
        alert(
          "Opps..You must be an on Amazon Search Page to run this feature."
        );
      } else {
        if (!handleCheckUrlMatch(tabs[0].url) || isProductPage(tabs[0].url)) {
          $("#alert-not-support").show();
          return;
        }
        chrome.runtime.onMessage.addListener(request => {
          if (request.query === "alertWarning") {
            $("#alert-not-support").show();
            return;
          }
          if (request.query === "closePopup") {
            window.close();
          }
        });
        chrome.runtime.sendMessage({
          query: "showGridData",
          payload: tabs[0].url
        });
      }
    });
  });

  $("body").on("click", "#report-url", e => {
    window.open("https://support.asinzen.com", "_blank");
  });

  function setActiveIcon(isActive) {
    if (isActive === false) {
      chrome.browserAction.setIcon({ path: "/img/icons/38-disabled.png" });
    } else {
      chrome.browserAction.setIcon({ path: "/img/icons/38-active.png" });
    }
  }

  function loadConfigActiveApp() {
    if (window) {
      chrome.storage.local.get(["asz_active"], function(result) {
        $("#myonoffswitch").attr(
          "checked",
          result.asz_active === true || result.asz_active === undefined
            ? "checked"
            : null
        );
        setActiveIcon(result.asz_active);
        $(".container").show();
      });
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs[0].url.indexOf(".amazon") >= 0) {
          if (!handleCheckUrlMatch(tabs[0].url) || isProductPage(tabs[0].url)) {
            $(".item-fetch-asins").parent().css('display', 'none');
          }
        }
      })
    }
  }

  function handleCheckUrlMatch(url) {
    const matches =
      (chrome &&
        chrome.runtime &&
        chrome.runtime.getManifest() &&
        chrome.runtime.getManifest().content_scripts[0].matches) ||
      "";
    return matches.some(match => {
      const regex = new RegExp(
        match.replace(/[{}()\[\]\\.+?^$|]/g, "\\$&").replace(/\*/g, ".*?")
      );
      return regex.test(url);
    });
  }

  function isProductPage(url) {
    return (
      url.indexOf("/dp/") > 0 ||
      url.indexOf("/gp/product/") > 0 ||
      url.indexOf("/d/") > 0
    );
  }

  loadConfigActiveApp();
});

document.addEventListener("DOMContentLoaded", function(event) {
  const setExtensionVersion = () => {
    const elementversion = document.querySelector(".version");
    elementversion.innerText = handleGetVersion();
  };

  function openNewLink(url) {
    window.open(
      url,
      "_blank",
      "scrollbars=yes, toolbar=no, width=800, height=1200"
    );
  }

  function initEventFollowClassName(className, url) {
    const el = document.querySelector(className);
    el.addEventListener("click", () => openNewLink(url));
  }

  const handleGetVersion = () => {
    return (
      (chrome &&
        chrome.runtime &&
        chrome.runtime.getManifest() &&
        chrome.runtime.getManifest().version) ||
      ""
    );
  };

  initEventFollowClassName(
    ".click-whats-new",
    "https://updates.asinzen.com/asinzen/updates"
  );

  setExtensionVersion();
});

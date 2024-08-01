const getChromeStorageWithKey = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, function (result) {
      if (result[key] === undefined) {
        resolve(null);
      } else {
        try {
          if (typeof result[key] === "string" && result[key].length === 0)
            resolve(null);
          if (typeof result[key] === "string" && result[key].length > 0)
            resolve(JSON.parse(result[key]));
          if (typeof result[key] === "object" && result[key] !== null)
            resolve(result[key]);
        } catch (error) {
          console.log("error on parsing chrome storage", error);
          resolve(result[key]);
        }
      }
    });
  });
};
const tranlateObject = [
  {
    id: "label_connected_markets",
    en: "Connected Markets",
    tr: "Bağlı Pazarlar",
    de: "Verbundene Märkte",
  },
  {
    id: "label_north_america",
    en: "North America",
    tr: "Kuzey Amerika",
    de: "Nordamerika",
  },
  {
    id: "label_europe",
    en: "Europe",
    tr: "Avrupa",
    de: "Europa",
  },
  {
    id: "label_far_east",
    en: "Far East",
    tr: "Uzak Doğu",
    de: "Ferner Osten",
  },
  {
    id: "label_no_markets",
    en: "No connected markets!",
    tr: "Bağlı pazar yok!",
    de: "Keine verbundenen Märkte!",
  },
  {
    id: "label_remaining_tokens",
    en: "Comparison Tokens",
    tr: "Karşılaştırma Jetonları",
    de: "Vergleichstoken",
  },
  {
    id: "label_buy_tokens",
    en: "Buy Tokens",
    tr: "Jeton Satın Al",
    de: "Jetons kaufen",
  },
  {
    id: "label_current_plan",
    en: "Current Plan",
    tr: "Mevcut Plan",
    de: "Aktueller Plan",
  },
  {
    id: "label_upgrade_plan",
    en: "Upgrade Plan",
    tr: "Planı Yükselt",
    de: "Plan aktualisieren",
  },
  {
    id: "label_go_to_website",
    en: "Go to Website",
    tr: "Web Sitesine Git",
    de: "Zur Website gehen",
  },
  {
    id: "User not set",
    en: "User not set",
    tr: "Kullanıcı ayarlanmadı",
    de: "Benutzer nicht festgelegt",
  },
  {
    id: "Free",
    en: "Free",
    tr: "Ücretsiz",
    de: "Kostenlos",
  },
  {
    id: "Remaining asin",
    en: "Remaining asin",
    tr: "Kalan asin",
    de: "Verbleibende Asin",
  },
  {
    id: "User not set!",
    en: "User not set!",
    tr: "Kullanıcı ayarlanmadı!",
    de: "Benutzer nicht festgelegt!",
  },
  {
    id: "show_hide_extension_title",
    en: "Show / Hide Extension",
    tr: "Ekelntiyi Göster / Gizle",
    de: "Erweiterung ein-/ausblenden",
  },
  {
    id: "show_hide_extension_desc",
    en: "Show/Hide Kepicker Extension For All Markets.",
    tr: "Tüm Pazar Yerleri İçin Kepicker Eklentisini Göster/Gizle.",
    de: "Kepicker-Erweiterung für alle Märkte ein-/ausblenden.",
  },
  {
    id: "market_selection_title",
    en: "Market Selections",
    tr: "Pazar Yeri Seçimleri",
    de: "Marktplatzauswahl",
  },
  {
    id: "market_selection_desc",
    en: "Hide Kepicker Extension from the markets you don't use.",
    tr: "Kepicker Eklentisini kullanmadığınız marketlerden gizleyin.",
    de: "Verstecken Sie das Kepicker-Plugin vor Märkten, die Sie nicht nutzen.",
  },
];
const translate = (id, language) => {
  return (
    tranlateObject.find((translation) => translation.id === id)[language] || id
  );
};
function toggleSettings() {
  const kpArea = document.getElementById("kp_popup_container"); // Doğru ID'ye sahip elementi seçin
  const stBtn = document.getElementById("kp-settings-btn");

  if (kpArea.classList.contains("st-opened")) {
    kpArea.classList.remove("st-opened");
    stBtn.classList.remove("active");
  } else {
    kpArea.classList.add("st-opened");
    stBtn.classList.add("active");
  }
}
async function RenderMarkets() {
  const marketOptionsDiv = document.getElementById("kp_market_options");
  const markets = await getChromeStorageWithKey(`main-availableDomains`);
  marketOptionsDiv.innerHTML = markets
    .map((i) => {
      return `<div class="k_radio">
    <input type="checkbox" id="radio-radio-market-${i.domain}" ${
        i.hidden && i.hidden === true ? "checked" : ""
      } name="radio-market" />
    <label class="radio_label" for="radio-radio-market-${i.domain}">
      ${i.domain.replace("www.amazon", "")}
    </label>
  </div>`;
    })
    .join("");
}
document.addEventListener("DOMContentLoaded", async () => {
  //define html elements
  const user_name = document.getElementById("user_name");
  const user_email = document.getElementById("user_email");
  const label_remaining_tokens = document.getElementById(
    "label_remaining_tokens"
  );
  const user_tokens = document.getElementById("user_tokens");
  const label_buy_tokens = document.getElementById("label_buy_tokens");
  const label_current_plan = document.getElementById("label_current_plan");
  const user_plan = document.getElementById("user_plan");
  const label_upgrade_plan = document.getElementById("label_upgrade_plan");
  const label_connected_markets = document.getElementById(
    "label_connected_markets"
  );
  const label_north_america = document.getElementById("label_north_america");
  const label_europe = document.getElementById("label_europe");
  const label_far_east = document.getElementById("label_far_east");
  const label_no_markets = document.getElementById("label_no_markets");
  const market_div = document.getElementById("market_div");
  const no_market_div = document.getElementById("no_market_div");
  const show_hide_extension_title = document.getElementById(
    "show_hide_extension_title"
  );
  const show_hide_extension_desc = document.getElementById(
    "show_hide_extension_desc"
  );
  const market_selection_title = document.getElementById(
    "market_selection_title"
  );
  const market_selection_desc = document.getElementById(
    "market_selection_desc"
  );
  //get user info from chrome storage
  const preferences = await getChromeStorageWithKey("main-language");
  const selectedLanguage = preferences || "en";
  // const remainingAsin = await getChromeStorageWithKey("remainingAsin");
  //set user info
  //get user from chrome storage

  let user = await getChromeStorageWithKey("main-user");

  //set translations
  label_remaining_tokens.innerHTML = translate(
    "label_remaining_tokens",
    selectedLanguage
  );
  label_buy_tokens.innerHTML = translate("label_buy_tokens", selectedLanguage);
  label_current_plan.innerHTML = translate(
    "label_current_plan",
    selectedLanguage
  );
  label_upgrade_plan.innerHTML = translate(
    "label_upgrade_plan",
    selectedLanguage
  );
  label_connected_markets.innerHTML = translate(
    "label_connected_markets",
    selectedLanguage
  );
  label_north_america.innerHTML = translate(
    "label_north_america",
    selectedLanguage
  );
  show_hide_extension_title.innerHTML = translate(
    "show_hide_extension_title",
    selectedLanguage
  );
  show_hide_extension_desc.innerHTML = translate(
    "show_hide_extension_desc",
    selectedLanguage
  );
  market_selection_title.innerHTML = translate(
    "show_hide_extension_desc",
    market_selection_title
  );
  market_selection_desc.innerHTML = translate(
    "show_hide_extension_desc",
    market_selection_desc
  );
  label_europe.innerHTML = translate("label_europe", selectedLanguage);
  label_far_east.innerHTML = translate("label_far_east", selectedLanguage);
  label_no_markets.innerHTML = translate("label_no_markets", selectedLanguage);

  if (
    user?.has_seller_account_na === "true" ||
    user?.has_seller_account_eu === "true" ||
    user?.has_seller_account_fe === "true"
  ) {
    no_market_div.classList.add("d-none");
  } else {
    market_div.classList.add("d-none");
  }

  function capitalFirstLetter(text) {
    return text?.charAt(0).toUpperCase() + text?.slice(1);
  }
  //set user info
  user_name.innerHTML = user?.first_name
    ? capitalFirstLetter(user?.first_name) +
      " " +
      capitalFirstLetter(user?.last_name)
    : translate("User not set!", selectedLanguage);
  user_email.innerHTML =
    user?.email || translate("Please log in.", selectedLanguage);
  user_tokens.innerHTML = user?.token_count || 0;

  user_plan.innerHTML = user?.user_tier
    ? capitalFirstLetter(user?.user_tier)
    : translate("Free", selectedLanguage);
  if (user?.has_seller_account_na === "true") {
    label_north_america.classList.remove("mconnect-default");
    label_north_america.classList.add("mconnect-success");
  } else {
    label_north_america.classList.remove("mconnect-success");
    label_north_america.classList.add("mconnect-default");
  }
  if (user?.has_seller_account_eu === "true") {
    label_europe.classList.remove("mconnect-default");
    label_europe.classList.add("mconnect-success");
  } else {
    label_europe.classList.remove("mconnect-success");
    label_europe.classList.add("mconnect-default");
  }
  if (user?.has_seller_account_fe === "true") {
    label_far_east.classList.remove("mconnect-default");
    label_far_east.classList.add("mconnect-success");
  } else {
    label_far_east.classList.remove("mconnect-success");
    label_far_east.classList.add("mconnect-default");
  }

  //set translations
  label_remaining_tokens.innerHTML = translate(
    "label_remaining_tokens",
    selectedLanguage
  );
  label_buy_tokens.innerHTML = translate("label_buy_tokens", selectedLanguage);
  label_current_plan.innerHTML = translate(
    "label_current_plan",
    selectedLanguage
  );
  label_upgrade_plan.innerHTML = translate(
    "label_upgrade_plan",
    selectedLanguage
  );
  label_connected_markets.innerHTML = translate(
    "label_connected_markets",
    selectedLanguage
  );
  label_north_america.innerHTML = translate(
    "label_north_america",
    selectedLanguage
  );
  show_hide_extension_title.innerHTML = translate(
    "show_hide_extension_title",
    selectedLanguage
  );
  show_hide_extension_desc.innerHTML = translate(
    "show_hide_extension_desc",
    selectedLanguage
  );
  market_selection_title.innerHTML = translate(
    "market_selection_title",
    selectedLanguage
  );
  market_selection_desc.innerHTML = translate(
    "market_selection_desc",
    selectedLanguage
  );
  label_europe.innerHTML = translate("label_europe", selectedLanguage);
  label_far_east.innerHTML = translate("label_far_east", selectedLanguage);
  label_no_markets.innerHTML = translate("label_no_markets", selectedLanguage);

  const settingsButton = document.getElementById("kp-settings-btn");
  if (settingsButton) {
    settingsButton.addEventListener("click", toggleSettings);
  }

  //add event listener to market checkboxes
  await RenderMarkets();

  const marketCheckboxes = document.getElementsByName("radio-market");
  marketCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", async (e) => {
      const selectedMarket = e.target.id.replace("radio-radio-market-", "");
      const isChecked = e.target.checked;
      const markets_ = await getChromeStorageWithKey(`main-availableDomains`);
      const changedDomains = markets_.map((i) => {
        if (i.domain === selectedMarket) {
          return {
            ...i,
            hidden: i.hidden && i.hidden === true ? false : true,
          };
        } else {
          return i;
        }
      });
      await chrome.storage.local.set({
        "main-availableDomains": changedDomains,
      });
    });
  });

  const toggleAllMarkets = document.getElementById("kp-toggle-all");
  const currentMarkets = await getChromeStorageWithKey(`main-availableDomains`);
  const isAllHidden = currentMarkets.every((i) => i.hidden === true);
  toggleAllMarkets.checked = !isAllHidden;
  // <input type="checkbox" id="kp-toggle-all" />;
  if (toggleAllMarkets) {
    toggleAllMarkets.addEventListener("change", async (e) => {
      const isChecked = !e.target.checked;
      const markets_ = await getChromeStorageWithKey(`main-availableDomains`);
      const changedDomains = markets_.map((i) => {
        return {
          ...i,
          hidden: isChecked,
        };
      });
      await chrome.storage.local.set({
        "main-availableDomains": changedDomains,
      });
      //reload the page
      await RenderMarkets();
    });
  }
});

"use strict";
Number.prototype.countDecimals = function () {
  return Math.floor(this.valueOf()) === this.valueOf()
    ? 0
    : this.toString().split(".")[1].length || 0;
};
var _offsetTimezone = function () {
    return 6e4 * new Date().getTimezoneOffset();
  },
  updateLink = function() {
    function getBrowserLink() {
      var userAgent = navigator.userAgent;
      if (/Chrome/.test(userAgent) && !/Edg|OPR/.test(userAgent)) {
        return "https://chromewebstore.google.com/detail/amlcmfdiddkikfmljhdhhookgjmnpedc/reviews";
      }
      if (/OPR/.test(userAgent)) {
        return "https://currencyrate.today/";
      }
      if (/Edg/.test(userAgent)) {
        return "https://currencyrate.today/";
      }
  
      return "https://currencyrate.today/";
    }
    var linkElement = document.getElementById("browser-link");
    var browserLink = getBrowserLink();

    if (browserLink) {
      linkElement.href = browserLink;
    }
  },
  websiteLanguage = function () {
    return {
      ru: 1,
      it: 2,
      fr: 3,
      es: 4,
      de: 5,
      hi: 6,
      id: 7,
      pt: 8,
      ja: 9,
    }.hasOwnProperty(defaultLang())
      ? defaultLang() + "."
      : "";
  },
  objLang = {
    en: "English",
    ru: "Русский",
    uk: "Українською",
    it: "Italiano",
    fr: "Français",
    es: "Español",
    de: "Deutsch",
    hi: "हिन्दी",
    id: "Bahasa Indonesia",
    pt: "Português",
    da: "Dansk",
    nl: "Nederlands",
    no: "Norsk",
    th: "ภาษาไทย",
    hu: "Magyar",
    sv: "Svenska",
    cs: "Čeština",
    vi: "Tiếng Việt",
    tr: "Türkçe",
    pl: "Polski",
    bg: "Български",
    zh: "中国",
    ja: "日本語",
    ko: "한국어",
  },
  defaultLang = function () {
    var D = chrome.i18n.getUILanguage().substr(0, 2);
    return (D = objLang.hasOwnProperty(D) ? D : "en");
  },
  gID = function () {
    return Math.random().toString(36).substr(2, 9);
  },
  STORAGE = {
    base: { code: "USD", amount: 1 },
    pairs: [
      { id: gID(), code: "USD" },
      { id: gID(), code: "EUR" },
      { id: gID(), code: "GBP" },
      { id: gID(), code: "CAD" },
      { id: gID(), code: "AUD" },
      { id: gID(), code: "CAD" },
      { id: gID(), code: "CNY" },
      { id: gID(), code: "JPY" },
    ],
    ratesData: {
      datetime: "01-01-2019 00:00:00",
      timestamp: 1546300800,
      base: "USD",
      rates: {
        AED: 3.673096,
        AFN: 75.449606,
        ALL: 109.71,
        AMD: 485.899674,
        ANG: 1.774825,
        AOA: 310.252,
        ARS: 36.902,
        AUD: 1.387896,
        AWG: 1.800506,
        AZN: 1.7025,
        BAM: 1.695843,
        BBD: 2,
        BDT: 83.712,
        BGN: 1.70315,
        BHD: 0.377026,
        BIF: 1816,
        BMD: 1,
        BND: 1.57573,
        BOB: 6.90915,
        BRL: 3.714011,
        BSD: 1,
        BTC: 0.00027282547,
        BTN: 70.438195,
        BTS: 25.93771673,
        BWP: 10.481001,
        BYN: 2.150356,
        BZD: 2.015534,
        CAD: 1.326437,
        CDF: 1626,
        CHF: 0.984013,
        CLF: 0.02338,
        CLP: 674.900501,
        CNH: 6.764324,
        CNY: 6.7627,
        COP: 3154.331743,
        CRC: 605.685032,
        CUC: 1,
        CUP: 25.75,
        CVE: 96.0755,
        CZK: 22.271489,
        DASH: 0.0134189834,
        DJF: 178,
        DKK: 6.507335,
        DOGE: 478.710140351,
        DOP: 50.495,
        DZD: 117.927742,
        EAC: 2867.98535556,
        EGP: 17.93,
        EMC: 1.2125648612,
        ERN: 14.997101,
        ETB: 28.505,
        ETH: 0.0079048259,
        EUR: 0.871761,
        FCT: 0.1458733107,
        FJD: 2.118648,
        FKP: 0.778171,
        FTC: 22.4451027826,
        GBP: 0.778171,
        GEL: 2.665,
        GGP: 0.778171,
        GHS: 4.885,
        GIP: 0.778171,
        GMD: 49.505,
        GNF: 9200,
        GTQ: 7.726796,
        GYD: 208.939318,
        HKD: 7.839693,
        HNL: 24.410013,
        HRK: 6.476765,
        HTG: 77.730941,
        HUF: 279.982753,
        IDR: 14110.944381,
        ILS: 3.67335,
        IMP: 0.778171,
        INR: 70.378965,
        IQD: 1190,
        IRR: 42741.852055,
        ISK: 120.489968,
        JEP: 0.778171,
        JMD: 128.45,
        JOD: 0.709607,
        JPY: 108.47366667,
        KES: 101.753009,
        KGS: 68.708341,
        KHR: 4020,
        KMF: 427.298012,
        KPW: 900,
        KRW: 1118.436667,
        KWD: 0.302849,
        KYD: 0.833267,
        KZT: 376.74694,
        LAK: 8550,
        LBP: 1507.95,
        LD: 252.55,
        LKR: 181.928311,
        LRD: 158.000217,
        LSL: 13.89,
        LTC: 0.0302617643,
        LYD: 1.39,
        MAD: 9.492624,
        MDL: 17.050396,
        MGA: 3584.669847,
        MKD: 53.609619,
        MMK: 1526.398412,
        MNT: 2453.75,
        MOP: 8.0755,
        MRO: 357,
        MRU: 36.45,
        MUR: 34.1295,
        MVR: 15.459996,
        MWK: 727.948631,
        MXN: 19.14061,
        MYR: 4.094503,
        MZN: 61.450531,
        NAD: 13.91,
        NGN: 365,
        NIO: 32.51,
        NMC: 1.3889782642,
        NOK: 8.526364,
        NPR: 112.703347,
        NVC: 0.3852517642,
        NXT: 37.7406334716,
        NZD: 1.464106,
        OMR: 0.385035,
        PAB: 1,
        PEN: 3.338504,
        PGK: 3.361,
        PHP: 52.1935,
        PKR: 139.875,
        PLN: 3.741971,
        PPC: 1.678238391,
        PYG: 6021.471318,
        QAR: 3.640999,
        RON: 4.081619,
        RSD: 103.243258,
        RUB: 66.8694,
        RWF: 894.294141,
        SAR: 3.75145,
        SBD: 8.06559,
        SCR: 13.644833,
        SDG: 47.55,
        SEK: 8.925994,
        SGD: 1.352984,
        SHP: 0.778171,
        SLL: 8390,
        SOS: 585,
        SRD: 7.458,
        SSP: 130.2634,
        STD: 21050.59961,
        STN: 21.6,
        STR: 9.4221263812,
        SVC: 8.749615,
        SYP: 514.980081,
        SZL: 13.814999,
        THB: 31.941833,
        TJS: 9.433858,
        TMT: 3.50998,
        TND: 2.957028,
        TOP: 2.258172,
        TRY: 5.468075,
        TTD: 6.77125,
        TWD: 30.795,
        TZS: 2302.3,
        UAH: 28.276,
        UGX: 3709.688913,
        USD: 1,
        UYU: 32.77838,
        UZS: 8342,
        VEF: 248487.642241,
        VEF_BLKMKT: 2189.47,
        VEF_DICOM: 794.85,
        VEF_DIPRO: 10,
        VES: 794.471585,
        VND: 23322.579237,
        VTC: 4.1895406111,
        VUV: 111.007267,
        WST: 2.607332,
        XAF: 571.837817,
        XAG: 0.06402674,
        XAU: 776e-6,
        XCD: 2.70255,
        XDR: 0.714601,
        XMR: 0.0215016572,
        XOF: 571.837817,
        XPD: 75593e-8,
        XPF: 104.028775,
        XPM: 5.3179649191,
        XPT: 0.00122783,
        XRP: 2.9694354049,
        YER: 250.399354,
        ZAR: 13.837604,
        ZMW: 11.924,
        ZWL: 322.355011,
      },
    },
    currenciesData: {},
    percentage: 0,
    settings: {
      convertInPage: !1,
      countUp: { separator: ",", decimal: ".", decimals: 4 },
    },
  },
  countryCurrency = {
    NZ: "NZD",
    CK: "NZD",
    NU: "NZD",
    PN: "NZD",
    TK: "NZD",
    AU: "AUD",
    CX: "AUD",
    CC: "AUD",
    HM: "AUD",
    KI: "AUD",
    NR: "AUD",
    NF: "AUD",
    TV: "AUD",
    AS: "EUR",
    AD: "EUR",
    AT: "EUR",
    BE: "EUR",
    FI: "EUR",
    FR: "EUR",
    GF: "EUR",
    TF: "EUR",
    DE: "EUR",
    GR: "EUR",
    GP: "EUR",
    IE: "EUR",
    IT: "EUR",
    LU: "EUR",
    MQ: "EUR",
    YT: "EUR",
    MC: "EUR",
    NL: "EUR",
    PT: "EUR",
    RE: "EUR",
    WS: "EUR",
    SM: "EUR",
    SI: "EUR",
    ES: "EUR",
    VA: "EUR",
    GS: "GBP",
    GB: "GBP",
    JE: "GBP",
    IO: "USD",
    GU: "USD",
    MH: "USD",
    FM: "USD",
    MP: "USD",
    PW: "USD",
    PR: "USD",
    TC: "USD",
    US: "USD",
    UM: "USD",
    VG: "USD",
    VI: "USD",
    HK: "HKD",
    CA: "CAD",
    JP: "JPY",
    AF: "AFN",
    AL: "ALL",
    DZ: "DZD",
    AI: "XCD",
    AG: "XCD",
    DM: "XCD",
    GD: "XCD",
    MS: "XCD",
    KN: "XCD",
    LC: "XCD",
    VC: "XCD",
    AR: "ARS",
    AM: "AMD",
    AW: "ANG",
    AN: "ANG",
    AZ: "AZN",
    BS: "BSD",
    BH: "BHD",
    BD: "BDT",
    BB: "BBD",
    BY: "BYR",
    BZ: "BZD",
    BJ: "XOF",
    BF: "XOF",
    GW: "XOF",
    CI: "XOF",
    ML: "XOF",
    NE: "XOF",
    SN: "XOF",
    TG: "XOF",
    BM: "BMD",
    BT: "INR",
    IN: "INR",
    BO: "BOB",
    BW: "BWP",
    BV: "NOK",
    NO: "NOK",
    SJ: "NOK",
    BR: "BRL",
    BN: "BND",
    BG: "BGN",
    BI: "BIF",
    KH: "KHR",
    CM: "XAF",
    CF: "XAF",
    TD: "XAF",
    CG: "XAF",
    GQ: "XAF",
    GA: "XAF",
    CV: "CVE",
    KY: "KYD",
    CL: "CLP",
    CN: "CNY",
    CO: "COP",
    KM: "KMF",
    CD: "CDF",
    CR: "CRC",
    HR: "HRK",
    CU: "CUP",
    CY: "CYP",
    CZ: "CZK",
    DK: "DKK",
    FO: "DKK",
    GL: "DKK",
    DJ: "DJF",
    DO: "DOP",
    TP: "IDR",
    ID: "IDR",
    EC: "ECS",
    EG: "EGP",
    SV: "SVC",
    ER: "ETB",
    ET: "ETB",
    EE: "EEK",
    FK: "FKP",
    FJ: "FJD",
    PF: "XPF",
    NC: "XPF",
    WF: "XPF",
    GM: "GMD",
    GE: "GEL",
    GI: "GIP",
    GT: "GTQ",
    GN: "GNF",
    GY: "GYD",
    HT: "HTG",
    HN: "HNL",
    HU: "HUF",
    IS: "ISK",
    IR: "IRR",
    IQ: "IQD",
    IL: "ILS",
    JM: "JMD",
    JO: "JOD",
    KZ: "KZT",
    KE: "KES",
    KP: "KPW",
    KR: "KRW",
    KW: "KWD",
    KG: "KGS",
    LA: "LAK",
    LV: "LVL",
    LB: "LBP",
    LS: "LSL",
    LR: "LRD",
    LY: "LYD",
    LI: "CHF",
    CH: "CHF",
    LT: "LTL",
    MO: "MOP",
    MK: "MKD",
    MG: "MGA",
    MW: "MWK",
    MY: "MYR",
    MV: "MVR",
    MT: "MTL",
    MR: "MRO",
    MU: "MUR",
    MX: "MXN",
    MD: "MDL",
    MN: "MNT",
    MA: "MAD",
    EH: "MAD",
    MZ: "MZN",
    MM: "MMK",
    NA: "NAD",
    NP: "NPR",
    NI: "NIO",
    NG: "NGN",
    OM: "OMR",
    PK: "PKR",
    PA: "PAB",
    PG: "PGK",
    PY: "PYG",
    PE: "PEN",
    PH: "PHP",
    PL: "PLN",
    QA: "QAR",
    RO: "RON",
    RU: "RUB",
    RW: "RWF",
    ST: "STD",
    SA: "SAR",
    SC: "SCR",
    SL: "SLL",
    SG: "SGD",
    SK: "SKK",
    SB: "SBD",
    SO: "SOS",
    ZA: "ZAR",
    LK: "LKR",
    SD: "SDG",
    SR: "SRD",
    SZ: "SZL",
    SE: "SEK",
    SY: "SYP",
    TW: "TWD",
    TJ: "TJS",
    TZ: "TZS",
    TH: "THB",
    TO: "TOP",
    TT: "TTD",
    TN: "TND",
    TR: "TRY",
    TM: "TMT",
    UG: "UGX",
    UA: "UAH",
    AE: "AED",
    UY: "UYU",
    UZ: "UZS",
    VU: "VUV",
    VE: "VEF",
    VN: "VND",
    YE: "YER",
    ZM: "ZMK",
    ZW: "ZWD",
  },
  symbols = {
    BTC: "Ƀ",
    BNB: "",
    USD: "$",
    EUR: "€",
    GBP: "£",
    AUD: "$",
    CAD: "$",
    CHF: "₣",
    CNY: "¥",
    JPY: "¥",
    SGD: "$",
    NZD: "$",
    PKR: "₨",
    HKD: "$",
    KRW: "₩",
    MXN: "$",
    NOK: "kr",
    EGP: "E£",
    CLP: "$",
    NGN: "₦",
    BRL: "R$",
    RUB: "₽",
    UAH: "₴",
    THB: "฿",
    PLN: "zł",
    INR: "₹",
    ETH: "",
    XMR: "",
    DASH: "",
    DOGE: "",
    LTC: "",
    STR: "",
    XRP: "",
    AED: "د.إ",
    AFN: "؋",
    ALL: "L",
    AMD: "֏",
    ANG: "ƒ",
    AOA: "Kz",
    ARS: "$",
    AWG: "ƒ",
    AZN: "₼",
    BAM: "KM",
    BBD: "$",
    BDT: "৳",
    BGN: "лв",
    BHD: ".د.ب",
    BIF: "₣",
    BMD: "$",
    BND: "$",
    BOB: "$b",
    BSD: "$",
    BTN: "Nu.",
    BTS: "",
    BWP: "P",
    BYN: "Br",
    BZD: "$",
    CDF: "₣",
    CLF: "CLF",
    CNH: "¥",
    COP: "$",
    CRC: "₡",
    CUC: "$",
    CUP: "₱",
    CVE: "$",
    CZK: "Kc",
    DJF: "₣",
    DKK: "kr",
    DOP: "$",
    DZD: "د.ج",
    EAC: "",
    EMC: "",
    ERN: "Nfk",
    ETB: "Br",
    FCT: "",
    FJD: "$",
    FKP: "£",
    GEL: "ლ",
    GGP: "£",
    GHS: "₵",
    GIP: "£",
    GMD: "D",
    GNF: "₣",
    GTQ: "Q",
    GYD: "$",
    HNL: "L",
    HRK: "kn",
    HTG: "G",
    HUF: "Ft",
    IDR: "Rp",
    ILS: "₪",
    IMP: "£",
    IQD: "ع.د",
    IRR: "﷼",
    ISK: "kr",
    JEP: "£",
    JMD: "J$",
    JOD: "د.ا",
    KES: "Sh",
    KGS: "лв",
    KHR: "៛",
    KMF: "₣",
    KPW: "₩",
    KWD: "د.ك",
    KYD: "$",
    KZT: "₸",
    LAK: "₭",
    LBP: 'ل.ل"',
    LD: "",
    LKR: "රු",
    LRD: "$",
    LSL: "L",
    LYD: "ل.د",
    MAD: "د.م.",
    MDL: "L",
    MGA: "Ar",
    MKD: "ден",
    MMK: "K",
    MNT: "₮",
    MOP: "MOP$",
    MRO: "UM",
    MUR: "₨",
    MVR: "Rf",
    MWK: "MK",
    MYR: "RM",
    MZN: "MT",
    NAD: "$",
    NIO: "C$",
    NMC: "",
    NPR: "₨",
    NVC: "",
    NXT: "",
    OMR: "ر.ع.",
    PAB: "B/.",
    PEN: "S/.",
    PGK: "K",
    PHP: "₱",
    PPC: "",
    PYG: "₲",
    QAR: "﷼",
    RON: "lei",
    RSD: "din",
    RWF: "₣",
    SAR: "ر.س",
    SBD: "$",
    SCR: "₨",
    SDG: "ج.س.",
    SEK: "kr",
    SHP: "£",
    SLL: "Le",
    SOS: "S",
    SRD: "$",
    SSP: "£",
    STD: "Db",
    STN: "nDb",
    SVC: "$",
    SYP: "ل.س",
    SZL: "L",
    TJS: "ЅМ",
    TMT: "m",
    TND: "د.ت",
    TOP: "T$",
    TRY: "TRY",
    TTD: "$",
    TWD: "$",
    TZS: "TSh",
    UGX: "USh",
    UYU: "$",
    UZS: "лв",
    VEF: "BsF",
    VES: "Bs",
    VND: "₫",
    VTC: "",
    VUV: "VT",
    WST: "WS$",
    XAF: "₣",
    XAG: "",
    XAU: "",
    XCD: "$",
    XDR: "",
    XOF: "₣",
    XPD: "",
    XPF: "₣",
    XPM: "",
    XPT: "",
    YER: "﷼",
    ZAR: "R",
    ZMW: "K",
    ZWL: "Z$",
  },
  defaultCurrencies = [
    "USD",
    "EUR",
    "GBP",
    "INR",
    "AUD",
    "CAD",
    "ZAR",
    "NZD",
    "CNY",
    "JPY",
    "BTC",
  ],
  currencyTopConversions = {
    AED: ["INR", "USD", "EUR", "GBP", "PHP", "KWD", "AUD", "SAR", "CAD", "OMR"],
    AFN: ["USD", "EUR", "GBP", "INR", "PKR", "NOK", "SEK", "CAD", "TRY", "AUD"],
    ALL: ["EUR", "USD", "GBP", "CAD", "TRY", "INR", "CHF", "MKD", "AUD", "AED"],
    AMD: ["USD", "EUR", "AED", "INR", "RUB", "GBP", "AUD", "GEL", "CAD", "IRR"],
    ANG: ["USD", "EUR", "COP", "CAD", "GBP", "INR", "MXN", "AUD", "AED", "SAR"],
    AOA: ["USD", "EUR", "GBP", "ZAR", "BRL", "NAD", "INR", "AED", "CAD", "CNY"],
    ARS: ["USD", "EUR", "CLP", "COP", "MXN", "GBP", "BRL", "PEN", "AUD", "CAD"],
    ATS: ["USD", "EUR", "GBP", "INR", "CAD", "MYR", "TRY", "HKD", "ILS", "AUD"],
    AUD: ["USD", "EUR", "GBP", "INR", "MYR", "NZD", "THB", "SGD", "JPY", "HKD"],
    AWG: ["USD", "EUR", "COP", "CAD", "GBP", "INR", "CLP", "MXN", "AED", "AUD"],
    AZM: ["USD", "AED", "EUR", "INR", "SAR", "TRY", "PKR", "OMR", "MXN", "GBP"],
    AZN: ["USD", "EUR", "RUB", "GBP", "TRY", "AED", "GEL", "SAR", "OMR", "INR"],
    BAM: ["USD", "EUR", "RSD", "HRK", "GBP", "CHF", "CAD", "AUD", "SAR", "TRY"],
    BBD: ["GBP", "USD", "CAD", "EUR", "XCD", "TTD", "JMD", "INR", "JPY", "GYD"],
    BDT: ["USD", "EUR", "GBP", "INR", "MYR", "CAD", "AUD", "SAR", "AED", "QAR"],
    BEF: ["EUR", "USD", "GBP", "MYR", "MAD", "INR", "CAD", "PHP", "COP", "NGN"],
    BGN: ["GBP", "EUR", "USD", "RUB", "CAD", "TRY", "NOK", "CHF", "RON", "AUD"],
    BHD: ["USD", "INR", "EUR", "GBP", "AED", "SAR", "KWD", "PHP", "EGP", "QAR"],
    BIF: ["USD", "EUR", "CAD", "GBP", "SEK", "INR", "RWF", "NOK", "KES", "XOF"],
    BMD: ["USD", "GBP", "CAD", "EUR", "INR", "MYR", "AUD", "JMD", "COP", "NZD"],
    BND: ["MYR", "USD", "GBP", "INR", "IDR", "EUR", "PHP", "AUD", "THB", "JPY"],
    BOB: ["USD", "EUR", "CLP", "MXN", "COP", "ARS", "PEN", "GBP", "BRL", "CAD"],
    BRL: ["USD", "EUR", "GBP", "CAD", "COP", "CLP", "AUD", "MXN", "ARS", "CHF"],
    BSD: ["USD", "CAD", "EUR", "GBP", "INR", "MXN", "COP", "NGN", "AED", "XOF"],
    BTN: ["USD", "INR", "AUD", "EUR", "GBP", "THB", "BDT", "SGD", "CAD", "AED"],
    BWP: ["USD", "ZAR", "GBP", "EUR", "INR", "AUD", "NAD", "CAD", "CNY", "ZMW"],
    BYN: ["EUR", "USD", "GBP", "RUB", "INR", "PLN", "CAD", "TRY", "MAD", "MXN"],
    BYR: ["USD", "EUR", "GBP", "INR", "RUB", "MAD", "CAD", "MXN", "PLN", "AED"],
    BZD: ["USD", "EUR", "MXN", "CAD", "GBP", "GTQ", "INR", "AUD", "COP", "XOF"],
    CAD: ["USD", "EUR", "GBP", "INR", "MXN", "CNY", "PHP", "AUD", "JPY", "AED"],
    CDF: ["USD", "EUR", "GBP", "TND", "CAD", "INR", "ZAR", "XAF", "XOF", "MXN"],
    CHF: ["EUR", "USD", "GBP", "INR", "CAD", "AUD", "AED", "THB", "TND", "ZAR"],
    CLP: ["USD", "EUR", "ARS", "COP", "MXN", "PEN", "GBP", "BRL", "CAD", "AUD"],
    CNY: ["USD", "EUR", "MYR", "GBP", "CAD", "SGD", "HKD", "AUD", "TWD", "INR"],
    COP: ["USD", "EUR", "MXN", "GBP", "ARS", "CLP", "CAD", "VEF", "PEN", "AUD"],
    CRC: ["USD", "EUR", "MXN", "COP", "CAD", "GBP", "GTQ", "NIO", "PEN", "JPY"],
    CUC: ["EUR", "CAD", "USD", "GBP", "MXN", "CUP", "COP", "AUD", "CHF", "CLP"],
    CUP: ["USD", "EUR", "MXN", "CAD", "CUC", "GBP", "COP", "INR", "CLP", "AUD"],
    CVE: ["EUR", "USD", "GBP", "BRL", "XOF", "CHF", "NGN", "CNY", "CAD", "MXN"],
    CYP: ["EUR", "GBP", "USD", "INR", "AED", "TND", "MAD", "PKR", "PHP", "CAD"],
    CZK: ["EUR", "USD", "GBP", "CAD", "AUD", "PLN", "INR", "CHF", "ILS", "AED"],
    DEM: ["USD", "EUR", "GBP", "INR", "CAD", "HKD", "ZAR", "AUD", "MYR", "PHP"],
    DJF: ["EUR", "USD", "AED", "XOF", "CAD", "GBP", "INR", "MAD", "ETB", "SEK"],
    DKK: ["EUR", "USD", "GBP", "SEK", "INR", "AUD", "CAD", "NOK", "PKR", "CHF"],
    DOP: ["USD", "EUR", "CAD", "COP", "GBP", "MXN", "CLP", "CHF", "VEF", "ARS"],
    DZD: ["EUR", "USD", "TND", "MAD", "SAR", "GBP", "CAD", "AED", "EGP", "TRY"],
    EEK: ["EUR", "USD", "GBP", "MXN", "AED", "INR", "SEK", "AUD", "NGN", "CAD"],
    EGP: ["USD", "SAR", "EUR", "KWD", "GBP", "AED", "JOD", "MAD", "TND", "CAD"],
    ERN: ["USD", "EUR", "GBP", "NOK", "SAR", "ETB", "SEK", "INR", "CHF", "CAD"],
    ESP: ["EUR", "USD", "GBP", "JPY", "INR", "CAD", "MXN", "COP", "ZAR", "NOK"],
    ETB: ["USD", "EUR", "GBP", "NOK", "CAD", "SAR", "INR", "SEK", "AUD", "AED"],
    EUR: ["USD", "GBP", "CAD", "CHF", "AUD", "INR", "TND", "AED", "JPY", "MXN"],
    FIM: ["USD", "EUR", "INR", "GBP", "CAD", "SEK", "BDT", "PLN", "ZAR", "XCD"],
    FJD: ["AUD", "USD", "NZD", "GBP", "EUR", "INR", "CAD", "VUV", "SBD", "SGD"],
    FKP: ["USD", "EUR", "INR", "CAD", "GBP", "MYR", "NGN", "PKR", "PHP", "COP"],
    FRF: ["EUR", "USD", "MAD", "INR", "GBP", "CAD", "AUD", "CHF", "MYR", "PHP"],
    GBP: ["EUR", "USD", "AUD", "CAD", "INR", "AED", "ZAR", "THB", "NZD", "MYR"],
    GEL: ["USD", "EUR", "TRY", "AED", "SAR", "RUB", "GBP", "INR", "AZN", "OMR"],
    GGP: ["USD", "EUR", "SAR", "GBP", "NPR", "INR", "EGP", "MXN", "NGN", "PKR"],
    GHC: ["USD", "EUR", "GBP", "XOF", "NGN", "XAF", "AED", "CAD", "ZAR", "ISK"],
    GHS: ["USD", "EUR", "GBP", "NGN", "XOF", "CAD", "CNY", "ZAR", "AUD", "AED"],
    GIP: ["EUR", "USD", "GBP", "INR", "ILS", "NGN", "MAD", "XOF", "AUD", "CAD"],
    GMD: ["USD", "GBP", "EUR", "XOF", "SEK", "CAD", "NGN", "DKK", "CHF", "NOK"],
    GNF: ["EUR", "USD", "XOF", "CAD", "GBP", "GHS", "MAD", "TND", "XAF", "INR"],
    GRD: ["USD", "EUR", "GBP", "CAD", "INR", "AUD", "MYR", "PHP", "NGN", "MXN"],
    GTQ: ["USD", "EUR", "MXN", "COP", "CAD", "CRC", "GBP", "HNL", "JPY", "AUD"],
    GYD: ["USD", "GBP", "CAD", "EUR", "TTD", "INR", "XCD", "BBD", "SRD", "COP"],
    HKD: ["USD", "EUR", "JPY", "GBP", "AUD", "SGD", "CNY", "MYR", "TWD", "CAD"],
    HNL: ["USD", "EUR", "MXN", "CAD", "COP", "GTQ", "GBP", "CRC", "XOF", "ARS"],
    HRK: ["EUR", "USD", "GBP", "AUD", "CAD", "BAM", "CHF", "RSD", "HUF", "SEK"],
    HTG: ["USD", "EUR", "CAD", "DOP", "CLP", "GBP", "MXN", "INR", "XOF", "AUD"],
    HUF: ["EUR", "USD", "GBP", "CAD", "AUD", "CHF", "RON", "PLN", "INR", "SEK"],
    IDR: ["USD", "EUR", "MYR", "SGD", "AUD", "GBP", "SAR", "INR", "JPY", "THB"],
    IEP: ["EUR", "USD", "GBP", "INR", "MAD", "TND", "NGN", "PKR", "CAD", "ZAR"],
    ILS: ["USD", "EUR", "GBP", "JOD", "CAD", "CHF", "AUD", "RUB", "INR", "HUF"],
    IMP: ["USD", "EUR", "GBP", "INR", "XOF", "AUD", "ZAR", "SAR", "MXN", "MYR"],
    INR: ["USD", "AED", "EUR", "SAR", "GBP", "QAR", "OMR", "CAD", "AUD", "KWD"],
    IQD: ["USD", "SAR", "EUR", "MYR", "GBP", "INR", "CAD", "AED", "TRY", "EGP"],
    IRR: ["USD", "EUR", "INR", "GBP", "AED", "CAD", "BHD", "PKR", "SEK", "KWD"],
    ISK: ["EUR", "USD", "GBP", "CAD", "AUD", "DKK", "NOK", "PLN", "SEK", "HKD"],
    ITL: ["USD", "EUR", "INR", "AUD", "GBP", "CAD", "MXN", "PHP", "MAD", "MYR"],
    JEP: ["USD", "EUR", "GBP", "INR", "NGN", "MYR", "CAD", "XOF", "PHP", "MXN"],
    JMD: ["USD", "GBP", "CAD", "EUR", "XCD", "TTD", "KYD", "BBD", "INR", "MXN"],
    JOD: ["USD", "EUR", "SAR", "AED", "GBP", "ILS", "KWD", "EGP", "TRY", "QAR"],
    JPY: ["USD", "EUR", "MYR", "GBP", "HKD", "SGD", "AUD", "TWD", "INR", "CAD"],
    KES: ["USD", "GBP", "EUR", "ZAR", "INR", "AED", "CAD", "AUD", "UGX", "TZS"],
    KGS: ["USD", "EUR", "INR", "TRY", "GBP", "RUB", "KZT", "CAD", "AUD", "SAR"],
    KHR: ["USD", "EUR", "MYR", "AUD", "GBP", "THB", "INR", "SGD", "CAD", "VND"],
    KMF: ["EUR", "USD", "AED", "CAD", "INR", "GBP", "TZS", "QAR", "MAD", "CNY"],
    KPW: ["USD", "EUR", "MYR", "INR", "PHP", "SGD", "GBP", "TWD", "MXN", "HKD"],
    KRW: ["USD", "EUR", "MYR", "SGD", "HKD", "PHP", "GBP", "TWD", "CAD", "AUD"],
    KWD: ["USD", "INR", "SAR", "AED", "EUR", "EGP", "GBP", "PHP", "JOD", "QAR"],
    KYD: ["USD", "GBP", "CAD", "JMD", "EUR", "PHP", "INR", "AUD", "MXN", "ZAR"],
    KZT: ["USD", "EUR", "GBP", "INR", "RUB", "AED", "TRY", "CAD", "MYR", "AUD"],
    LAK: ["USD", "EUR", "THB", "AUD", "MYR", "GBP", "CAD", "SGD", "VND", "CNY"],
    LBP: ["USD", "EUR", "SAR", "CAD", "AED", "GBP", "AUD", "KWD", "JOD", "EGP"],
    LKR: ["USD", "EUR", "GBP", "AUD", "INR", "CHF", "QAR", "AED", "CAD", "SAR"],
    LRD: ["USD", "EUR", "NGN", "INR", "GBP", "XOF", "GHS", "CAD", "MXN", "AUD"],
    LSL: ["USD", "EUR", "GBP", "ZAR", "INR", "NGN", "MXN", "BWP", "AUD", "CNY"],
    LTL: ["EUR", "USD", "GBP", "AED", "INR", "DKK", "MAD", "MXN", "CAD", "TND"],
    LUF: ["USD", "EUR", "INR", "NGN", "GBP", "CAD", "ITL", "MXN", "SAR", "ILS"],
    LVL: ["USD", "EUR", "GBP", "INR", "KZT", "AED", "GHS", "NGN", "MXN", "SEK"],
    LYD: ["USD", "TND", "EUR", "SAR", "EGP", "DZD", "GBP", "INR", "AED", "MAD"],
    MAD: ["EUR", "USD", "GBP", "SAR", "CAD", "AED", "TND", "EGP", "DZD", "TRY"],
    MDL: ["EUR", "USD", "GBP", "RON", "RUB", "CAD", "TRY", "INR", "UAH", "AUD"],
    MGA: ["EUR", "USD", "GBP", "CAD", "MUR", "INR", "ZAR", "AUD", "CHF", "DJF"],
    MGF: ["EUR", "USD", "XOF", "MGA", "MUR", "TWD", "INR", "MAD", "MXN", "SAR"],
    MKD: ["USD", "EUR", "GBP", "AUD", "CHF", "RSD", "BGN", "TRY", "HRK", "CAD"],
    MMK: ["USD", "EUR", "GBP", "THB", "SGD", "MYR", "INR", "AUD", "JPY", "CNY"],
    MNT: ["USD", "EUR", "AUD", "GBP", "JPY", "CAD", "CNY", "INR", "HKD", "MYR"],
    MOP: ["USD", "EUR", "CNY", "HKD", "MYR", "JPY", "PHP", "TWD", "AUD", "SGD"],
    MRO: ["EUR", "USD", "XOF", "MAD", "CAD", "TND", "SAR", "DZD", "AED", "GBP"],
    MRU: ["EUR", "USD", "XOF", "MAD", "CAD", "TND", "SAR", "DZD", "AED", "GBP"],
    MTL: ["EUR", "USD", "GBP", "XBT", "INR", "MXN", "TND", "CAD", "AUD", "XOF"],
    MUR: ["EUR", "USD", "GBP", "INR", "ZAR", "AUD", "CAD", "CHF", "AED", "MYR"],
    MVR: ["USD", "INR", "EUR", "MYR", "GBP", "LKR", "SAR", "AED", "AUD", "SGD"],
    MWK: ["USD", "EUR", "GBP", "ZAR", "ZMW", "CAD", "INR", "TZS", "AUD", "MZN"],
    MXN: ["USD", "EUR", "COP", "CAD", "GBP", "JPY", "CLP", "PEN", "ARS", "CRC"],
    MYR: ["USD", "SGD", "IDR", "EUR", "GBP", "THB", "INR", "AUD", "CNY", "JPY"],
    MZM: ["USD", "ZAR", "EUR", "GBP", "INR", "CHF", "CAD", "BRL", "AUD", "BDT"],
    MZN: ["USD", "ZAR", "EUR", "GBP", "BRL", "INR", "AUD", "CAD", "QAR", "JPY"],
    NAD: ["USD", "EUR", "GBP", "BWP", "ZMW", "ZAR", "AUD", "CAD", "CHF", "CNY"],
    NGN: ["USD", "EUR", "GBP", "CAD", "GHS", "ZAR", "XOF", "INR", "MYR", "AED"],
    NIO: ["USD", "EUR", "CRC", "MXN", "CAD", "GBP", "COP", "HNL", "GTQ", "XOF"],
    NLG: ["USD", "MAD", "EUR", "KRW", "GBP", "INR", "CAD", "ZAR", "PHP", "SGD"],
    NOK: ["EUR", "USD", "GBP", "INR", "AUD", "PHP", "SEK", "CAD", "THB", "DKK"],
    NPR: ["USD", "EUR", "QAR", "GBP", "INR", "AUD", "AED", "SAR", "MYR", "CAD"],
    NZD: ["USD", "GBP", "AUD", "EUR", "INR", "MYR", "JPY", "THB", "CAD", "SGD"],
    OMR: ["INR", "USD", "EUR", "AED", "GBP", "SAR", "PHP", "EGP", "KWD", "TND"],
    PAB: ["USD", "EUR", "COP", "MXN", "CRC", "CAD", "CLP", "GBP", "ARS", "VEF"],
    PEN: ["USD", "EUR", "MXN", "COP", "CLP", "GBP", "ARS", "CAD", "JPY", "AUD"],
    PGK: ["AUD", "USD", "EUR", "PHP", "GBP", "NZD", "MYR", "INR", "SGD", "FJD"],
    PHP: ["USD", "EUR", "GBP", "AUD", "AED", "CAD", "SAR", "SGD", "JPY", "QAR"],
    PKR: ["GBP", "EUR", "USD", "CAD", "AED", "SAR", "AUD", "INR", "SEK", "MYR"],
    PLN: ["EUR", "GBP", "USD", "CAD", "AUD", "INR", "CHF", "CZK", "SEK", "NOK"],
    PTE: ["EUR", "USD", "GBP", "INR", "NGN", "CAD", "AUD", "ESP", "ZAR", "PHP"],
    PYG: ["USD", "EUR", "ARS", "MXN", "COP", "CLP", "BRL", "GBP", "CAD", "XOF"],
    QAR: ["INR", "USD", "EUR", "GBP", "TND", "PHP", "AED", "KWD", "SAR", "EGP"],
    ROL: ["EUR", "USD", "GBP", "TND", "INR", "NGN", "HUF", "CAD", "MAD", "PHP"],
    RON: ["EUR", "USD", "GBP", "HUF", "CAD", "ILS", "CHF", "AUD", "BGN", "DKK"],
    RSD: ["EUR", "USD", "BAM", "GBP", "HRK", "AUD", "CHF", "HUF", "CAD", "MKD"],
    RUB: ["USD", "EUR", "GBP", "INR", "CAD", "MAD", "AUD", "TRY", "AZN", "MYR"],
    RWF: ["USD", "EUR", "CAD", "GBP", "UGX", "KES", "INR", "ZAR", "AUD", "SEK"],
    SAR: ["USD", "INR", "EUR", "GBP", "EGP", "KWD", "PHP", "TRY", "TND", "AED"],
    SBD: ["USD", "AUD", "FJD", "VUV", "PHP", "EUR", "NZD", "JPY", "GBP", "PGK"],
    SCR: ["EUR", "USD", "GBP", "AED", "INR", "ZAR", "MUR", "AUD", "MYR", "LKR"],
    SDD: ["USD", "INR", "SAR", "AED", "EUR", "GBP", "QAR", "MYR", "NOK", "BDT"],
    SDG: ["USD", "SAR", "EUR", "EGP", "AED", "GBP", "INR", "QAR", "KWD", "OMR"],
    SEK: ["EUR", "USD", "GBP", "INR", "DKK", "AUD", "CAD", "PKR", "NOK", "THB"],
    SGD: ["USD", "MYR", "EUR", "INR", "GBP", "AUD", "JPY", "IDR", "THB", "HKD"],
    SHP: ["USD", "EUR", "GBP", "INR", "XOF", "TND", "NGN", "MYR", "MXN", "SAR"],
    SIT: ["EUR", "USD", "GBP", "MXN", "PLN", "CAD", "CLP", "ILS", "LKR", "AUD"],
    SKK: ["EUR", "USD", "GBP", "KZT", "AED", "CAD", "HKD", "PLN", "INR", "TND"],
    SLL: ["USD", "GBP", "EUR", "AUD", "CAD", "SEK", "NGN", "XOF", "GHS", "INR"],
    SOS: ["USD", "INR", "GBP", "EUR", "SAR", "PKR", "AED", "CAD", "MXN", "EGP"],
    SPL: ["USD", "EUR", "GBP", "INR", "AUD", "MYR", "CAD", "SYP", "AED", "JOD"],
    SRD: ["USD", "EUR", "INR", "GYD", "GBP", "CAD", "XOF", "TTD", "MXN", "COP"],
    SRG: ["USD", "EUR", "MXN", "SAR", "INR", "PHP", "CZK", "GYD", "OMR", "NGN"],
    STD: ["USD", "EUR", "GBP", "XAF", "INR", "CAD", "CHF", "KWD", "XOF", "TWD"],
    STN: ["USD", "EUR", "GBP", "XAF", "INR", "CAD", "CHF", "KWD", "XOF", "TWD"],
    SVC: ["USD", "MXN", "EUR", "COP", "XOF", "GTQ", "GBP", "INR", "NGN", "CAD"],
    SYP: ["USD", "EUR", "SAR", "JOD", "TRY", "AED", "KWD", "SEK", "INR", "GBP"],
    SZL: ["USD", "EUR", "GBP", "ZAR", "INR", "QAR", "TWD", "AED", "RUB", "CAD"],
    THB: ["USD", "EUR", "GBP", "MYR", "AUD", "SGD", "INR", "CAD", "HKD", "JPY"],
    TJS: ["USD", "EUR", "RUB", "TRY", "INR", "GBP", "AED", "PKR", "CAD", "PLN"],
    TMM: ["USD", "EUR", "MXN", "UAH", "MYR", "MAD", "PHP", "TRY", "EGP", "INR"],
    TMT: ["USD", "EUR", "INR", "GBP", "AED", "TRY", "RUB", "DZD", "MYR", "TND"],
    TND: ["EUR", "USD", "SAR", "DZD", "QAR", "CAD", "AED", "GBP", "MAD", "CHF"],
    TOP: ["USD", "NZD", "AUD", "EUR", "GBP", "FJD", "ZAR", "JPY", "CNY", "SAR"],
    TRL: ["EUR", "USD", "TND", "MAD", "GBP", "SAR", "DZD", "AED", "KWD", "INR"],
    TRY: ["USD", "EUR", "GBP", "SAR", "AUD", "TND", "KWD", "MAD", "JOD", "AED"],
    TTD: ["USD", "GBP", "CAD", "EUR", "XCD", "JMD", "BBD", "INR", "GYD", "JPY"],
    TVD: ["USD", "EUR", "MYR", "JPY", "HKD", "KRW", "CNY", "SGD", "PHP", "INR"],
    TWD: ["USD", "MYR", "JPY", "EUR", "SGD", "HKD", "CNY", "GBP", "PHP", "KRW"],
    TZS: ["USD", "EUR", "GBP", "KES", "ZAR", "INR", "CAD", "AED", "OMR", "AUD"],
    UAH: ["USD", "EUR", "GBP", "INR", "TRY", "RUB", "PLN", "CAD", "ILS", "MAD"],
    UGX: ["USD", "GBP", "EUR", "KES", "CAD", "INR", "ZAR", "SEK", "AUD", "AED"],
    USD: ["EUR", "GBP", "CAD", "INR", "MXN", "AUD", "CNY", "MYR", "COP", "ZAR"],
    UYU: ["USD", "EUR", "ARS", "CLP", "MXN", "COP", "BRL", "GBP", "AUD", "CAD"],
    UZS: ["USD", "EUR", "INR", "GBP", "RUB", "AED", "SAR", "MYR", "AUD", "PKR"],
    VAL: ["USD", "INR", "BGN", "EUR", "JPY", "PHP", "AED", "EGP", "NPR", "XOF"],
    VEB: ["COP", "USD", "MXN", "EUR", "CLP", "PEN", "INR", "DOP", "GBP", "VEF"],
    VEF: ["USD", "COP", "EUR", "MXN", "CLP", "PEN", "GBP", "ARS", "CAD", "DOP"],
    VES: ["USD", "COP", "EUR", "MXN", "CLP", "PEN", "GBP", "ARS", "CAD", "DOP"],
    VND: ["USD", "EUR", "AUD", "MYR", "GBP", "SGD", "CAD", "THB", "HKD", "JPY"],
    VUV: ["AUD", "USD", "NZD", "EUR", "FJD", "SBD", "GBP", "XPF", "CAD", "PGK"],
    WST: ["USD", "NZD", "AUD", "EUR", "FJD", "GBP", "INR", "VUV", "PHP", "THB"],
    XAF: ["USD", "EUR", "CAD", "GBP", "AED", "ZAR", "NGN", "TND", "CNY", "THB"],
    XAG: ["USD", "CAD", "AUD", "EUR", "GBP", "PLN", "MXN", "SGD", "SEK", "XAU"],
    XAU: ["USD", "EUR", "GBP", "CAD", "AUD", "TRY", "PLN", "MXN", "ZAR", "SGD"],
    XBT: ["USD", "MYR", "EUR", "GBP", "COP", "INR", "AUD", "CAD", "PHP", "ZAR"],
    XCD: ["USD", "GBP", "EUR", "CAD", "TTD", "BBD", "JMD", "INR", "NGN", "GYD"],
    XDR: ["USD", "EUR", "GBP", "AUD", "CHF", "XOF", "CAD", "MRO", "HKD", "INR"],
    XEU: ["USD", "INR", "GBP", "EUR", "HKD", "MYR", "SAR", "CAD", "SGD", "JPY"],
    XOF: ["USD", "EUR", "CAD", "GBP", "TND", "GHS", "MAD", "NGN", "CHF", "AED"],
    XPD: ["USD", "EUR", "INR", "GBP", "XPT", "AED", "CAD", "MXN", "PLN", "NZD"],
    XPF: ["EUR", "USD", "AUD", "NZD", "CAD", "GBP", "THB", "FJD", "JPY", "IDR"],
    XPT: ["USD", "GBP", "EUR", "INR", "CAD", "AUD", "ZAR", "SAR", "XAU", "XPD"],
    YER: ["USD", "SAR", "EUR", "AED", "GBP", "INR", "OMR", "EGP", "MYR", "BHD"],
    ZAR: ["USD", "EUR", "GBP", "INR", "AUD", "AED", "CAD", "ZMW", "SAR", "BWP"],
    ZMK: ["USD", "GBP", "ZAR", "EUR", "INR", "AUD", "CNY", "CAD", "TZS", "AED"],
    ZMW: ["USD", "GBP", "ZAR", "EUR", "INR", "CNY", "AUD", "CAD", "NGN", "NAD"],
    ZWD: ["USD", "GBP", "EUR", "INR", "CAD", "AUD", "ZAR", "IDR", "CNY", "MYR"],
  },
  latestJson = "https://fex.to/latest.json";
export const PRODUCT_ANALYSIS_SEED_DEFAULT_GROUP_KEY = "communication";
export const PRODUCT_ANALYSIS_SEED_DEFAULT_CATEGORY_KEY = "phone";

function createModels(definitions) {
  return definitions.map(([id, label, baseUnits, monthlyStep], modelIndex) => ({
    id,
    model: label,
    baseUnits,
    monthlyStep,
    seasonalityPhase: modelIndex % 4,
  }));
}

function createCategory({ key, label, pageTitle, pieTitle, brands }) {
  return {
    key,
    label,
    pageTitle,
    pieTitle,
    brands: brands.map((brand) => ({
      ...brand,
      models: createModels(brand.models),
    })),
  };
}

const productAnalysisCatalog = [
  {
    key: "communication",
    label: "通訊裝置",
    categories: [
      createCategory({
        key: "phone",
        label: "手機",
        pageTitle: "手機銷售分析",
        pieTitle: "手機品牌銷量占比",
        brands: [
          {
            brandKey: "apple",
            brandLabel: "Apple",
            color: "#69ba3a",
            models: [
              ["apple-iphone-16-pro-max", "iPhone 16 Pro Max", 392, 27],
              ["apple-iphone-16-pro", "iPhone 16 Pro", 344, 23],
              ["apple-iphone-16-plus", "iPhone 16 Plus", 322, 21],
              ["apple-iphone-16", "iPhone 16", 301, 19],
              ["apple-iphone-15-pro-max", "iPhone 15 Pro Max", 276, 18],
              ["apple-iphone-15-pro", "iPhone 15 Pro", 248, 16],
              ["apple-iphone-15", "iPhone 15", 219, 14],
              ["apple-iphone-se-4", "iPhone SE 4", 152, 11],
            ],
          },
          {
            brandKey: "samsung",
            brandLabel: "Samsung",
            color: "#82d84e",
            models: [
              ["samsung-s24-ultra", "Galaxy S24 Ultra", 318, 21],
              ["samsung-s24-plus", "Galaxy S24+", 296, 19],
              ["samsung-s24", "Galaxy S24", 284, 18],
              ["samsung-a55", "Galaxy A55", 252, 15],
              ["samsung-a35", "Galaxy A35", 214, 13],
              ["samsung-z-flip-6", "Galaxy Z Flip6", 178, 12],
            ],
          },
          {
            brandKey: "xiaomi",
            brandLabel: "Xiaomi",
            color: "#ee7d3b",
            models: [
              ["xiaomi-14-ultra", "Xiaomi 14 Ultra", 298, 19],
              ["xiaomi-14", "Xiaomi 14", 266, 17],
              ["xiaomi-redmi-note-13-pro", "Redmi Note 13 Pro", 241, 15],
              ["xiaomi-poco-x6", "POCO X6", 188, 12],
            ],
          },
          {
            brandKey: "oppo",
            brandLabel: "OPPO",
            color: "#c4c9ba",
            models: [
              ["oppo-find-x7", "Find X7", 242, 16],
              ["oppo-reno-12-pro", "Reno 12 Pro", 221, 14],
              ["oppo-reno-12", "Reno 12", 205, 13],
            ],
          },
        ],
      }),
      createCategory({
        key: "used-phone",
        label: "二手機",
        pageTitle: "二手機銷售分析",
        pieTitle: "二手機型占比",
        brands: [
          {
            brandKey: "apple-renewed",
            brandLabel: "Apple 整新機",
            color: "#69ba3a",
            models: [
              ["used-iphone-15-pro", "iPhone 15 Pro", 188, 14],
              ["used-iphone-15", "iPhone 15", 176, 12],
              ["used-iphone-14-pro", "iPhone 14 Pro", 148, 10],
              ["used-iphone-13", "iPhone 13", 126, 8],
            ],
          },
          {
            brandKey: "samsung-renewed",
            brandLabel: "Samsung 福利品",
            color: "#82d84e",
            models: [
              ["used-galaxy-s23-ultra", "Galaxy S23 Ultra", 162, 12],
              ["used-galaxy-s23", "Galaxy S23", 149, 10],
              ["used-galaxy-a54", "Galaxy A54", 132, 9],
              ["used-galaxy-z-flip5", "Galaxy Z Flip5", 104, 8],
            ],
          },
          {
            brandKey: "xiaomi-renewed",
            brandLabel: "Xiaomi 精選機",
            color: "#ee7d3b",
            models: [
              ["used-xiaomi-13-pro", "Xiaomi 13 Pro", 141, 10],
              ["used-xiaomi-13", "Xiaomi 13", 129, 9],
              ["used-redmi-note-12-pro", "Redmi Note 12 Pro", 118, 8],
              ["used-poco-f5", "POCO F5", 98, 7],
            ],
          },
          {
            brandKey: "trade-in",
            brandLabel: "門市回收快銷",
            color: "#c4c9ba",
            models: [
              ["used-store-a", "展示機 A 級", 114, 8],
              ["used-store-b", "展示機 B 級", 98, 7],
              ["used-store-c", "企業回收機", 87, 6],
              ["used-store-d", "配件齊全機", 79, 5],
            ],
          },
        ],
      }),
    ],
  },
  {
    key: "computer-tablet",
    label: "電腦平板",
    categories: [
      createCategory({
        key: "laptop",
        label: "筆電",
        pageTitle: "筆電銷售分析",
        pieTitle: "筆電品牌銷量占比",
        brands: [
          {
            brandKey: "apple-mac",
            brandLabel: "Apple",
            color: "#69ba3a",
            models: [
              ["macbook-pro-16", "MacBook Pro 16", 124, 10],
              ["macbook-pro-14", "MacBook Pro 14", 117, 9],
              ["macbook-air-15", "MacBook Air 15", 104, 8],
              ["macbook-air-13", "MacBook Air 13", 98, 7],
            ],
          },
          {
            brandKey: "asus",
            brandLabel: "ASUS",
            color: "#82d84e",
            models: [
              ["asus-zenbook-s14", "Zenbook S14", 108, 9],
              ["asus-vivobook-s16", "Vivobook S16", 97, 8],
              ["asus-rog-g16", "ROG Zephyrus G16", 92, 8],
              ["asus-tuf-a15", "TUF A15", 86, 7],
            ],
          },
          {
            brandKey: "lenovo",
            brandLabel: "Lenovo",
            color: "#ee7d3b",
            models: [
              ["lenovo-x1-carbon", "ThinkPad X1 Carbon", 96, 8],
              ["lenovo-yoga-pro-7", "Yoga Pro 7", 89, 7],
              ["lenovo-loq-15", "LOQ 15", 84, 7],
              ["lenovo-ideapad-5", "IdeaPad 5", 78, 6],
            ],
          },
          {
            brandKey: "acer",
            brandLabel: "Acer",
            color: "#c4c9ba",
            models: [
              ["acer-swift-go-14", "Swift Go 14", 91, 7],
              ["acer-predator-helios", "Predator Helios", 85, 7],
              ["acer-aspire-5", "Aspire 5", 74, 6],
              ["acer-nitro-v", "Nitro V", 70, 5],
            ],
          },
        ],
      }),
      createCategory({
        key: "tablet",
        label: "平板",
        pageTitle: "平板銷售分析",
        pieTitle: "平板品牌銷量占比",
        brands: [
          {
            brandKey: "ipad",
            brandLabel: "Apple iPad",
            color: "#69ba3a",
            models: [
              ["ipad-pro-13", "iPad Pro 13", 214, 16],
              ["ipad-air-11", "iPad Air 11", 192, 14],
              ["ipad-10", "iPad 10", 168, 12],
              ["ipad-mini", "iPad mini", 146, 10],
            ],
          },
          {
            brandKey: "galaxy-tab",
            brandLabel: "Samsung",
            color: "#82d84e",
            models: [
              ["galaxy-tab-s10-ultra", "Galaxy Tab S10 Ultra", 166, 12],
              ["galaxy-tab-s10-plus", "Galaxy Tab S10+", 151, 11],
              ["galaxy-tab-s9-fe", "Galaxy Tab S9 FE", 133, 10],
              ["galaxy-tab-a9", "Galaxy Tab A9", 121, 9],
            ],
          },
          {
            brandKey: "xiaomi-pad",
            brandLabel: "Xiaomi",
            color: "#ee7d3b",
            models: [
              ["xiaomi-pad-7-pro", "Xiaomi Pad 7 Pro", 144, 11],
              ["xiaomi-pad-7", "Xiaomi Pad 7", 132, 10],
              ["redmi-pad-pro", "Redmi Pad Pro", 119, 9],
              ["redmi-pad-se", "Redmi Pad SE", 108, 8],
            ],
          },
          {
            brandKey: "matepad",
            brandLabel: "HUAWEI",
            color: "#c4c9ba",
            models: [
              ["matepad-pro-13", "MatePad Pro 13.2", 121, 9],
              ["matepad-air", "MatePad Air", 111, 8],
              ["matepad-11", "MatePad 11.5", 102, 8],
              ["matepad-se", "MatePad SE", 93, 7],
            ],
          },
        ],
      }),
      createCategory({
        key: "tablet-accessories",
        label: "平板周邊",
        pageTitle: "平板周邊銷售分析",
        pieTitle: "平板周邊品線占比",
        brands: [
          {
            brandKey: "logitech",
            brandLabel: "Logitech",
            color: "#69ba3a",
            models: [
              ["combo-touch", "Combo Touch 鍵盤殼", 138, 11],
              ["keys-to-go", "Keys-To-Go 2", 124, 10],
              ["crayon", "Crayon 手寫筆", 112, 9],
              ["rugged-folio", "Rugged Folio", 96, 8],
            ],
          },
          {
            brandKey: "esr",
            brandLabel: "ESR",
            color: "#82d84e",
            models: [
              ["esr-rebound-keyboard", "Rebound 鍵盤殼", 127, 10],
              ["esr-shift-case", "Shift 磁吸保護殼", 113, 9],
              ["esr-digital-pencil", "數位觸控筆", 102, 8],
              ["esr-temp-glass", "鋼化玻璃貼", 92, 7],
            ],
          },
          {
            brandKey: "baseus",
            brandLabel: "Baseus",
            color: "#ee7d3b",
            models: [
              ["baseus-pencil", "Smooth Writing 手寫筆", 118, 9],
              ["baseus-stand-case", "旋轉支架殼", 103, 8],
              ["baseus-hub", "多功能擴充 Hub", 91, 7],
              ["baseus-sleeve", "收納內袋", 79, 6],
            ],
          },
          {
            brandKey: "paperlike",
            brandLabel: "Paperlike",
            color: "#c4c9ba",
            models: [
              ["paperlike-film", "Paperlike 類紙膜", 95, 7],
              ["paperlike-pencil-grip", "筆握套件", 84, 6],
              ["paperlike-clean-kit", "清潔組", 72, 5],
              ["paperlike-folio", "保護套", 64, 5],
            ],
          },
        ],
      }),
    ],
  },
  {
    key: "audio-wearables",
    label: "聲學穿戴",
    categories: [
      createCategory({
        key: "bluetooth-earphones",
        label: "藍芽耳機",
        pageTitle: "藍芽耳機銷售分析",
        pieTitle: "藍芽耳機品牌銷量占比",
        brands: [
          {
            brandKey: "apple-audio",
            brandLabel: "Apple",
            color: "#69ba3a",
            models: [
              ["airpods-pro-2", "AirPods Pro 2", 264, 18],
              ["airpods-4", "AirPods 4", 226, 16],
              ["beats-fit-pro", "Beats Fit Pro", 149, 11],
              ["beats-solo-buds", "Beats Solo Buds", 128, 9],
            ],
          },
          {
            brandKey: "samsung-audio",
            brandLabel: "Samsung",
            color: "#82d84e",
            models: [
              ["buds-3-pro", "Galaxy Buds3 Pro", 188, 13],
              ["buds-3", "Galaxy Buds3", 174, 12],
              ["buds-fe", "Galaxy Buds FE", 152, 10],
              ["level-u2", "Level U2", 116, 8],
            ],
          },
          {
            brandKey: "sony-audio",
            brandLabel: "Sony",
            color: "#ee7d3b",
            models: [
              ["sony-wf-1000xm5", "WF-1000XM5", 202, 14],
              ["sony-linkbuds-s", "LinkBuds S", 169, 11],
              ["sony-c700n", "WF-C700N", 142, 10],
              ["sony-ch520", "WH-CH520", 119, 8],
            ],
          },
          {
            brandKey: "jbl-audio",
            brandLabel: "JBL",
            color: "#c4c9ba",
            models: [
              ["jbl-tour-pro-3", "Tour Pro 3", 156, 11],
              ["jbl-live-beam-3", "Live Beam 3", 137, 9],
              ["jbl-wave-buds", "Wave Buds", 121, 8],
              ["jbl-tune-520bt", "Tune 520BT", 114, 8],
            ],
          },
        ],
      }),
      createCategory({
        key: "smartwatch",
        label: "智慧手表",
        pageTitle: "智慧手表銷售分析",
        pieTitle: "智慧手表品牌銷量占比",
        brands: [
          {
            brandKey: "apple-watch",
            brandLabel: "Apple Watch",
            color: "#69ba3a",
            models: [
              ["watch-ultra-2", "Apple Watch Ultra 2", 176, 12],
              ["watch-series-10", "Apple Watch Series 10", 162, 11],
              ["watch-se-2", "Apple Watch SE", 143, 10],
              ["watch-hermes", "Apple Watch Hermès", 104, 8],
            ],
          },
          {
            brandKey: "samsung-watch",
            brandLabel: "Samsung",
            color: "#82d84e",
            models: [
              ["watch-ultra", "Galaxy Watch Ultra", 149, 10],
              ["watch-7-44", "Galaxy Watch7 44mm", 136, 9],
              ["watch-7-40", "Galaxy Watch7 40mm", 126, 9],
              ["watch-fe", "Galaxy Watch FE", 111, 8],
            ],
          },
          {
            brandKey: "garmin",
            brandLabel: "Garmin",
            color: "#ee7d3b",
            models: [
              ["garmin-fenix-8", "fēnix 8", 141, 10],
              ["garmin-venu-3", "Venu 3", 127, 9],
              ["garmin-forerunner-265", "Forerunner 265", 118, 8],
              ["garmin-lily-2", "Lily 2", 98, 7],
            ],
          },
          {
            brandKey: "huawei-watch",
            brandLabel: "HUAWEI",
            color: "#c4c9ba",
            models: [
              ["watch-gt-5-pro", "Watch GT 5 Pro", 132, 9],
              ["watch-fit-3", "Watch Fit 3", 119, 8],
              ["watch-d2", "Watch D2", 102, 7],
              ["band-9", "Band 9", 94, 6],
            ],
          },
        ],
      }),
      createCategory({
        key: "mechanical-watch",
        label: "機械手表",
        pageTitle: "機械手表銷售分析",
        pieTitle: "機械手表品牌銷量占比",
        brands: [
          {
            brandKey: "seiko",
            brandLabel: "SEIKO",
            color: "#69ba3a",
            models: [
              ["seiko-prospex-speedtimer", "Prospex Speedtimer", 82, 7],
              ["seiko-5-sports", "Seiko 5 Sports", 76, 6],
              ["seiko-presage", "Presage Cocktail", 71, 6],
              ["seiko-alpinist", "Alpinist", 64, 5],
            ],
          },
          {
            brandKey: "citizen",
            brandLabel: "Citizen",
            color: "#82d84e",
            models: [
              ["citizen-series-8", "Series 8", 78, 6],
              ["citizen-tsuyosa", "Tsuyosa", 72, 6],
              ["citizen-promaster", "Promaster", 66, 5],
              ["citizen-zenshin", "Zenshin", 58, 5],
            ],
          },
          {
            brandKey: "tissot",
            brandLabel: "Tissot",
            color: "#ee7d3b",
            models: [
              ["tissot-prx-powermatic", "PRX Powermatic 80", 85, 7],
              ["tissot-gentleman", "Gentleman Powermatic", 73, 6],
              ["tissot-seastar", "Seastar 1000", 69, 5],
              ["tissot-le-locle", "Le Locle", 61, 5],
            ],
          },
          {
            brandKey: "orient",
            brandLabel: "Orient",
            color: "#c4c9ba",
            models: [
              ["orient-bambino", "Bambino", 69, 5],
              ["orient-kamasu", "Kamasu", 63, 5],
              ["orient-mako", "Mako 40", 57, 4],
              ["orient-open-heart", "Open Heart", 52, 4],
            ],
          },
        ],
      }),
    ],
  },
  {
    key: "imaging-entertainment",
    label: "影像娛樂",
    categories: [
      createCategory({
        key: "camera",
        label: "相機",
        pageTitle: "相機銷售分析",
        pieTitle: "相機品牌銷量占比",
        brands: [
          {
            brandKey: "canon",
            brandLabel: "Canon",
            color: "#69ba3a",
            models: [
              ["canon-r5ii", "EOS R5 Mark II", 73, 6],
              ["canon-r6ii", "EOS R6 Mark II", 69, 5],
              ["canon-r8", "EOS R8", 61, 5],
              ["canon-v10", "PowerShot V10", 48, 4],
            ],
          },
          {
            brandKey: "sony-camera",
            brandLabel: "Sony",
            color: "#82d84e",
            models: [
              ["sony-a7iv", "Alpha 7 IV", 76, 6],
              ["sony-a7cii", "Alpha 7C II", 68, 5],
              ["sony-zv-e1", "ZV-E1", 62, 5],
              ["sony-zv-1ii", "ZV-1 II", 51, 4],
            ],
          },
          {
            brandKey: "nikon",
            brandLabel: "Nikon",
            color: "#ee7d3b",
            models: [
              ["nikon-z8", "Nikon Z8", 65, 5],
              ["nikon-zf", "Nikon Zf", 58, 5],
              ["nikon-z6iii", "Nikon Z6 III", 56, 4],
              ["nikon-z30", "Nikon Z30", 44, 4],
            ],
          },
          {
            brandKey: "fujifilm",
            brandLabel: "Fujifilm",
            color: "#c4c9ba",
            models: [
              ["fuji-x100vi", "X100VI", 88, 7],
              ["fuji-xs20", "X-S20", 64, 5],
              ["fuji-xt5", "X-T5", 59, 5],
              ["fuji-instax-mini-evo", "Instax Mini Evo", 53, 4],
            ],
          },
        ],
      }),
      createCategory({
        key: "camera-accessories",
        label: "相機周邊",
        pageTitle: "相機周邊銷售分析",
        pieTitle: "相機周邊品線占比",
        brands: [
          {
            brandKey: "dji",
            brandLabel: "DJI",
            color: "#69ba3a",
            models: [
              ["dji-rs4", "RS 4 雲台", 91, 7],
              ["dji-mic-2", "Mic 2 麥克風", 86, 7],
              ["dji-osmo-pocket-3", "Osmo Pocket 3", 83, 6],
              ["dji-action-5", "Osmo Action 5", 79, 6],
            ],
          },
          {
            brandKey: "smallrig",
            brandLabel: "SmallRig",
            color: "#82d84e",
            models: [
              ["smallrig-cage", "全包覆兔籠", 74, 6],
              ["smallrig-handle", "側把手", 67, 5],
              ["smallrig-tripod", "桌面腳架", 61, 5],
              ["smallrig-plate", "快拆板", 55, 4],
            ],
          },
          {
            brandKey: "sandisk",
            brandLabel: "SanDisk",
            color: "#ee7d3b",
            models: [
              ["sandisk-v90", "Extreme PRO V90", 88, 7],
              ["sandisk-v60", "Extreme PRO V60", 79, 6],
              ["sandisk-ssd", "Portable SSD", 72, 5],
              ["sandisk-microsd", "High Endurance microSD", 63, 5],
            ],
          },
          {
            brandKey: "manfrotto",
            brandLabel: "Manfrotto",
            color: "#c4c9ba",
            models: [
              ["manfrotto-befree", "Befree 腳架", 66, 5],
              ["manfrotto-element", "Element MII", 58, 4],
              ["manfrotto-lightstand", "燈架組", 52, 4],
              ["manfrotto-bag", "攝影背包", 48, 4],
            ],
          },
        ],
      }),
      createCategory({
        key: "gaming",
        label: "電玩",
        pageTitle: "電玩銷售分析",
        pieTitle: "電玩平台銷量占比",
        brands: [
          {
            brandKey: "nintendo",
            brandLabel: "Nintendo",
            color: "#69ba3a",
            models: [
              ["switch-oled", "Switch OLED", 186, 13],
              ["switch-lite", "Switch Lite", 162, 11],
              ["switch-sports-bundle", "Switch 套裝組", 138, 10],
              ["mario-kart-bundle", "瑪利歐賽車同捆", 126, 9],
            ],
          },
          {
            brandKey: "playstation",
            brandLabel: "PlayStation",
            color: "#82d84e",
            models: [
              ["ps5-slim", "PS5 Slim", 174, 12],
              ["ps5-digital", "PS5 Digital", 149, 10],
              ["portal", "PlayStation Portal", 121, 8],
              ["dualsense-bundle", "DualSense 套裝", 109, 8],
            ],
          },
          {
            brandKey: "xbox",
            brandLabel: "Xbox",
            color: "#ee7d3b",
            models: [
              ["xbox-series-x", "Xbox Series X", 132, 9],
              ["xbox-series-s", "Xbox Series S", 119, 8],
              ["xbox-elite-pad", "Elite 無線手把", 103, 7],
              ["xbox-wireless-headset", "無線耳機", 96, 7],
            ],
          },
          {
            brandKey: "rog-gaming",
            brandLabel: "ROG",
            color: "#c4c9ba",
            models: [
              ["rog-ally-x", "ROG Ally X", 118, 8],
              ["rog-ally", "ROG Ally", 107, 8],
              ["rog-raikiri", "Raikiri Pro", 89, 6],
              ["rog-cetra", "Cetra 電競耳機", 77, 5],
            ],
          },
        ],
      }),
    ],
  },
  {
    key: "accessory-transport",
    label: "周邊交通",
    categories: [
      createCategory({
        key: "peripherals",
        label: "3C 周邊商品",
        pageTitle: "3C 周邊商品銷售分析",
        pieTitle: "3C 周邊品線占比",
        brands: [
          {
            brandKey: "logitech-peripheral",
            brandLabel: "Logitech",
            color: "#69ba3a",
            models: [
              ["mx-master-3s", "MX Master 3S", 171, 12],
              ["mx-keys-s", "MX Keys S", 156, 11],
              ["brio-500", "Brio 500", 129, 9],
              ["zone-vibe-100", "Zone Vibe 100", 118, 8],
            ],
          },
          {
            brandKey: "razer",
            brandLabel: "Razer",
            color: "#82d84e",
            models: [
              ["viper-v3-pro", "Viper V3 Pro", 149, 10],
              ["blackwidow-v4", "BlackWidow V4", 136, 9],
              ["kiyo-pro", "Kiyo Pro", 114, 8],
              ["barracuda-x", "Barracuda X", 108, 7],
            ],
          },
          {
            brandKey: "hyperx",
            brandLabel: "HyperX",
            color: "#ee7d3b",
            models: [
              ["alloy-rise", "Alloy Rise", 127, 9],
              ["pulsefire-haste-2", "Pulsefire Haste 2", 118, 8],
              ["cloud-iii", "Cloud III", 111, 8],
              ["quadcast-s", "QuadCast S", 98, 7],
            ],
          },
          {
            brandKey: "wd",
            brandLabel: "WD / SanDisk",
            color: "#c4c9ba",
            models: [
              ["wd-sn850x", "SN850X SSD", 138, 10],
              ["sandisk-extreme-portable", "Extreme Portable SSD", 123, 9],
              ["wd-my-passport", "My Passport", 107, 7],
              ["sandisk-dual-drive", "Dual Drive Go", 89, 6],
            ],
          },
        ],
      }),
      createCategory({
        key: "e-mobility",
        label: "電動交通",
        pageTitle: "電動交通銷售分析",
        pieTitle: "電動交通品牌銷量占比",
        brands: [
          {
            brandKey: "gogoro",
            brandLabel: "Gogoro",
            color: "#69ba3a",
            models: [
              ["gogoro-pulse", "Pulse", 96, 8],
              ["gogoro-super-sport", "SuperSport", 88, 7],
              ["gogoro-delight", "Delight", 77, 6],
              ["gogoro-viva-mix", "VIVA MIX", 72, 5],
            ],
          },
          {
            brandKey: "ionex",
            brandLabel: "Ionex",
            color: "#82d84e",
            models: [
              ["ionex-s7r", "S7R", 81, 6],
              ["ionex-i-one-air", "i-One Air", 74, 6],
              ["ionex-many", "Many", 69, 5],
              ["ionex-moto", "Like EV", 63, 5],
            ],
          },
          {
            brandKey: "yamaha",
            brandLabel: "Yamaha",
            color: "#ee7d3b",
            models: [
              ["yamaha-ec05", "EC-05", 76, 6],
              ["yamaha-emf", "EMF", 71, 5],
              ["yamaha-jog-ev", "JOG EV", 58, 4],
              ["yamaha-neo", "NEO's", 54, 4],
            ],
          },
          {
            brandKey: "emoving",
            brandLabel: "eMOVING",
            color: "#c4c9ba",
            models: [
              ["emoving-epa", "EPA 1", 64, 5],
              ["emoving-epx", "EPX", 58, 4],
              ["emoving-shine", "Shine", 53, 4],
              ["emoving-mini", "Mini", 46, 3],
            ],
          },
        ],
      }),
    ],
  },
  {
    key: "cross-border-other",
    label: "跨境其他",
    categories: [
      createCategory({
        key: "overseas-3c",
        label: "國外(3C)",
        pageTitle: "國外(3C)銷售分析",
        pieTitle: "國外(3C)選品占比",
        brands: [
          {
            brandKey: "jp-tech",
            brandLabel: "日本選品",
            color: "#69ba3a",
            models: [
              ["jp-dock", "USB-C 擴充底座", 112, 9],
              ["jp-mini-printer", "相片列印機", 103, 8],
              ["jp-pocket-router", "旅遊路由器", 92, 7],
              ["jp-gaming-pad", "掌機配件組", 84, 6],
            ],
          },
          {
            brandKey: "us-tech",
            brandLabel: "美國選品",
            color: "#82d84e",
            models: [
              ["us-stream-deck", "直播控制台", 106, 8],
              ["us-mic-arm", "麥克風支架", 95, 7],
              ["us-charging-station", "多裝置充電座", 88, 6],
              ["us-smarthome-hub", "智慧家居 Hub", 79, 6],
            ],
          },
          {
            brandKey: "kr-tech",
            brandLabel: "韓國選品",
            color: "#ee7d3b",
            models: [
              ["kr-monitor-bar", "螢幕掛燈", 98, 7],
              ["kr-audio-transmitter", "藍牙發射器", 87, 6],
              ["kr-cable-organizer", "理線套組", 76, 5],
              ["kr-deskmat", "桌面收納墊", 70, 5],
            ],
          },
          {
            brandKey: "eu-tech",
            brandLabel: "歐洲選品",
            color: "#c4c9ba",
            models: [
              ["eu-power-station", "戶外儲能站", 84, 6],
              ["eu-lan-adapter", "高速網卡", 73, 5],
              ["eu-smart-lock", "智慧門鎖", 68, 5],
              ["eu-camera-hub", "監控中樞", 61, 4],
            ],
          },
        ],
      }),
      createCategory({
        key: "overseas-motorcycle",
        label: "國外(摩托車)",
        pageTitle: "國外(摩托車)銷售分析",
        pieTitle: "國外(摩托車)品線占比",
        brands: [
          {
            brandKey: "jp-moto",
            brandLabel: "日本車系",
            color: "#69ba3a",
            models: [
              ["jp-moto-oil", "性能機油組", 71, 6],
              ["jp-moto-brake", "煞車升級套件", 64, 5],
              ["jp-moto-suspension", "避震調校組", 58, 4],
              ["jp-moto-box", "尾箱配件", 52, 4],
            ],
          },
          {
            brandKey: "thai-moto",
            brandLabel: "泰國車系",
            color: "#82d84e",
            models: [
              ["thai-moto-fairing", "彩繪車殼", 67, 5],
              ["thai-moto-exhaust", "改裝排氣管", 61, 5],
              ["thai-moto-cnc", "CNC 鋁件", 55, 4],
              ["thai-moto-footpeg", "腳踏後移", 49, 4],
            ],
          },
          {
            brandKey: "it-moto",
            brandLabel: "歐系性能",
            color: "#ee7d3b",
            models: [
              ["it-moto-clutch", "離合器組", 62, 5],
              ["it-moto-brake-disc", "浮動碟盤", 57, 4],
              ["it-moto-rearset", "後移腳踏", 51, 4],
              ["it-moto-led", "LED 升級燈具", 46, 3],
            ],
          },
          {
            brandKey: "cross-moto",
            brandLabel: "跨境精品件",
            color: "#c4c9ba",
            models: [
              ["cross-moto-camera", "行車攝影機", 59, 4],
              ["cross-moto-intercom", "藍牙通話器", 54, 4],
              ["cross-moto-bag", "機車防水包", 47, 3],
              ["cross-moto-lock", "防盜鎖具", 43, 3],
            ],
          },
        ],
      }),
      createCategory({
        key: "overseas-home-appliance",
        label: "國外(家電)",
        pageTitle: "國外(家電)銷售分析",
        pieTitle: "國外(家電)品牌銷量占比",
        brands: [
          {
            brandKey: "dyson",
            brandLabel: "Dyson",
            color: "#69ba3a",
            models: [
              ["dyson-v15s", "V15s Detect", 92, 7],
              ["dyson-airwrap-id", "Airwrap i.d.", 86, 7],
              ["dyson-purifier-big", "Purifier Big+Quiet", 74, 6],
              ["dyson-zone", "Zone 空氣耳機", 53, 4],
            ],
          },
          {
            brandKey: "philips",
            brandLabel: "Philips",
            color: "#82d84e",
            models: [
              ["philips-airfryer-7", "雙槽氣炸鍋 7000", 88, 7],
              ["philips-lattego-5500", "LatteGo 5500", 71, 5],
              ["philips-sonicare-9900", "Sonicare 9900", 66, 5],
              ["philips-garment-steamer", "直立蒸氣熨斗", 58, 4],
            ],
          },
          {
            brandKey: "shark",
            brandLabel: "Shark",
            color: "#ee7d3b",
            models: [
              ["shark-flexstyle", "FlexStyle", 76, 6],
              ["shark-powerdetect", "PowerDetect", 69, 5],
              ["shark-speedstyle", "SpeedStyle", 63, 5],
              ["shark-airpurifier", "Air Purifier 6", 54, 4],
            ],
          },
          {
            brandKey: "braun",
            brandLabel: "Braun",
            color: "#c4c9ba",
            models: [
              ["braun-series-9-pro", "Series 9 Pro+", 64, 5],
              ["braun-multiquick-9", "MultiQuick 9", 57, 4],
              ["braun-purshine", "PurShine 咖啡機", 49, 4],
              ["braun-carestyle", "CareStyle 熨斗", 44, 3],
            ],
          },
        ],
      }),
      createCategory({
        key: "gold",
        label: "黃金",
        pageTitle: "黃金銷售分析",
        pieTitle: "黃金品線占比",
        brands: [
          {
            brandKey: "gold-bar",
            brandLabel: "投資金條",
            color: "#69ba3a",
            models: [
              ["gold-bar-1", "1 錢金條", 121, 9],
              ["gold-bar-2", "2 錢金條", 112, 8],
              ["gold-bar-5", "5 錢金條", 86, 7],
              ["gold-bar-10", "10 錢金條", 63, 5],
            ],
          },
          {
            brandKey: "gold-jewelry",
            brandLabel: "黃金飾品",
            color: "#82d84e",
            models: [
              ["gold-necklace", "經典金項鍊", 94, 7],
              ["gold-bracelet", "黃金手鍊", 87, 6],
              ["gold-ring", "黃金戒指", 79, 6],
              ["gold-earring", "黃金耳環", 71, 5],
            ],
          },
          {
            brandKey: "gold-gift",
            brandLabel: "節慶金飾",
            color: "#ee7d3b",
            models: [
              ["gold-zodiac", "生肖金片", 83, 6],
              ["gold-baby-gift", "彌月金飾", 71, 5],
              ["gold-wedding", "婚嫁套組", 66, 5],
              ["gold-lucky-charm", "招財吊飾", 58, 4],
            ],
          },
          {
            brandKey: "gold-collectible",
            brandLabel: "典藏紀念",
            color: "#c4c9ba",
            models: [
              ["gold-collectible-coin", "紀念金幣", 68, 5],
              ["gold-ingot", "元寶擺件", 59, 4],
              ["gold-bullion", "限量金塊", 51, 4],
              ["gold-frame", "金箔畫飾", 46, 3],
            ],
          },
        ],
      }),
      createCategory({
        key: "perfume",
        label: "香水",
        pageTitle: "香水銷售分析",
        pieTitle: "香水品牌銷量占比",
        brands: [
          {
            brandKey: "dior",
            brandLabel: "Dior",
            color: "#69ba3a",
            models: [
              ["dior-sauvage", "Sauvage", 116, 9],
              ["dior-blooming-bouquet", "Blooming Bouquet", 104, 8],
              ["dior-jadore", "J'adore", 93, 7],
              ["dior-homme", "Dior Homme", 82, 6],
            ],
          },
          {
            brandKey: "chanel",
            brandLabel: "Chanel",
            color: "#82d84e",
            models: [
              ["chanel-chance", "Chance Eau Tendre", 109, 8],
              ["chanel-coco-mademoiselle", "Coco Mademoiselle", 98, 8],
              ["chanel-bleu", "Bleu de Chanel", 88, 7],
              ["chanel-no5", "N°5 L'Eau", 76, 6],
            ],
          },
          {
            brandKey: "jo-malone",
            brandLabel: "Jo Malone",
            color: "#ee7d3b",
            models: [
              ["jo-malone-wood-sage", "Wood Sage & Sea Salt", 94, 7],
              ["jo-malone-english-pear", "English Pear & Freesia", 88, 7],
              ["jo-malone-peony", "Peony & Blush Suede", 79, 6],
              ["jo-malone-lime-basil", "Lime Basil & Mandarin", 71, 5],
            ],
          },
          {
            brandKey: "maison-margiela",
            brandLabel: "Maison Margiela",
            color: "#c4c9ba",
            models: [
              ["replica-lazy-sunday", "Lazy Sunday Morning", 82, 6],
              ["replica-jazz-club", "Jazz Club", 74, 5],
              ["replica-by-the-fireplace", "By the Fireplace", 68, 5],
              ["replica-beach-walk", "Beach Walk", 63, 4],
            ],
          },
        ],
      }),
      createCategory({
        key: "whitening",
        label: "美白",
        pageTitle: "美白保養銷售分析",
        pieTitle: "美白保養品牌銷量占比",
        brands: [
          {
            brandKey: "sk2",
            brandLabel: "SK-II",
            color: "#69ba3a",
            models: [
              ["sk2-genoptics", "光蘊臻采煥亮精華", 102, 8],
              ["sk2-aura-essence", "超肌因鑽光淨白精華", 91, 7],
              ["sk2-lotion", "青春露美白組", 84, 6],
              ["sk2-mask", "前男友面膜組", 72, 5],
            ],
          },
          {
            brandKey: "olay",
            brandLabel: "OLAY",
            color: "#82d84e",
            models: [
              ["olay-niacinamide-serum", "小白瓶精華", 116, 9],
              ["olay-uv-cream", "美白 UV 霜", 103, 8],
              ["olay-tone-up", "光感透白乳霜", 94, 7],
              ["olay-mask", "亮白安瓶面膜", 81, 6],
            ],
          },
          {
            brandKey: "kiehls",
            brandLabel: "Kiehl's",
            color: "#ee7d3b",
            models: [
              ["kiehls-clearly-corrective", "激光極淨白淡斑精華", 97, 7],
              ["kiehls-uv-defense", "集高效清爽 UV 防護乳", 83, 6],
              ["kiehls-cloud-cream", "冰河醣蛋白霜限定組", 71, 5],
              ["kiehls-eye-bright", "亮眼修護組", 64, 5],
            ],
          },
          {
            brandKey: "melano-cc",
            brandLabel: "Melano CC",
            color: "#c4c9ba",
            models: [
              ["melano-cc-serum", "維他命 C 集中對策", 124, 9],
              ["melano-cc-mask", "亮白面膜", 109, 8],
              ["melano-cc-lotion", "化妝水", 98, 7],
              ["melano-cc-essence", "高浸透精華", 88, 6],
            ],
          },
        ],
      }),
    ],
  },
];

export function getProductAnalysisSeedCatalog() {
  return productAnalysisCatalog.map((group) => ({
    ...group,
    categories: group.categories.map((category) => ({
      ...category,
      brands: category.brands.map((brand) => ({
        ...brand,
        models: brand.models.map((model) => ({
          ...model,
        })),
      })),
    })),
  }));
}

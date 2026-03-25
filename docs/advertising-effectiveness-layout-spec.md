# 廣告成效頁版面與資料生成規格

## 目標

- 目標頁面為 [advertisingEffectiveness.vue](/F:/website/nuxt_base/app/pages/advertisingEffectiveness.vue)。
- 頁面定位為 dashboard 內的獨立分析頁，路由固定為 `/advertisingEffectiveness`。
- 版面採三段式閱讀節奏：
  - KPI 摘要列
  - 4 張趨勢卡
  - 4 張 TOP5 環圖卡
- 視覺延續現有 dashboard 的白卡、淺底、綠橘點綴與 `Manrope` + `Noto Sans TC` 字體組合，不另建新主題。

## 設計約束

- 優先沿用既有共用元件：
  - `BaseCard`
  - `ReportSectionTitle`
  - `ReportEmptyState`
- 可新增廣告成效專用元件，但不得重做新的 generic card / title / empty-state 元件。
- 不加入 hero 導讀文案、不擴大成活動或渠道切換器頁。
- 手機版不得出現整頁橫向卷動。

## 版面結構

### 篩選列

- KPI 摘要列前方需加入一張年月篩選卡。
- 視覺語言沿用既有 dashboard 搜尋列：
  - 白色卡面
  - 灰框圓角控制器
  - 綠色 focus / active 語言
- 篩選欄位固定為：
  - 年份下拉
  - 月份下拉
- 互動規則：
  - 年份切換後，自動帶入該年份最後一個有效月份
  - 月份下拉只顯示該年份有資料的月份
  - KPI 與 TOP5 以所選月份為準
  - 趨勢卡以所選月份為終點，固定顯示往前 12 個月
- 手機版需可自然換行，不得因篩選列造成整頁橫向卷動

### 第一區 KPI Strip

- 固定 8 張摘要卡：
  - 費用
  - 曝光
  - 點擊
  - CPC
  - GA 購物車
  - BI 購物車
  - BI 有效名單
  - BI 成交數
- 每張卡固定顯示：
  - 指標名稱
  - 主數值
  - 上期數值
  - 上期成長率
- RWD 規則：
  - 桌機：單列 8 張
  - 平板：4 x 2
  - 手機：2 x 4

### 第二區 Trend Cards

- 固定 4 張圖卡：
  - 費用
  - CTR
  - CVR(ACT)
  - CVR(成交數)
- 每張圖卡結構固定為：
  - 區塊標題
  - 大數值
  - 柱線混合圖
  - 卡內圖例
- RWD 規則：
  - 桌機：4 欄
  - 平板：2 x 2
  - 手機：單欄堆疊

### 第三區 TOP5 Donut Cards

- 區塊標題固定為「TOP5 分布」。
- 固定 4 張卡：
  - 費用
  - 點擊數
  - 購物車
  - 成交數
- 每張卡固定顯示：
  - 甜甜圈圖
  - TOP5 legend
  - 排名、項目名稱、數值、占比
- 若資料不足 5 筆，依實際筆數顯示。

## 資料生成規格

- 廣告成效資料必須採用與商品分析相同的三層結構：
  - [advertising-effectiveness-seed.js](/F:/website/nuxt_base/server/utils/advertising-effectiveness-seed.js)
  - [generate-advertising-effectiveness-data.mjs](/F:/website/nuxt_base/scripts/generate-advertising-effectiveness-data.mjs)
  - [advertising-effectiveness-generated.js](/F:/website/nuxt_base/server/utils/advertising-effectiveness-generated.js)
- `seed.js` 只負責定義：
  - KPI / trend / donut 的結構
  - item 基礎參數
  - 生成所需的少量種子資料
- 不允許在以下位置手寫大型 mock 陣列：
  - `docs`
  - `page`
  - `component`
  - `API handler`
  - `service`
- 修改 seed 後，必須先執行：
  - `npm run generate:advertising-effectiveness-data`
- `generated.js` 預設納入版本控制，理由如下：
  - 執行期不需即時生成
  - server API 可直接讀取
  - 避免每次開發重新計算
- 生成腳本輸出必須 deterministic；同一份 seed 需產生相同輸出格式與相同數值。

## API 規格

### `GET /api/advertising-effectiveness/summary`

- 支援 query：
  - `year=YYYY`
  - `month=MM`
- 回傳：
  - `pageTitle`
  - `updatedAt`
  - `latestMonthLabel`
  - `yearOptions[]`
  - `monthOptions[]`
  - `activeYear`
  - `activeMonth`
  - `headline[]`
- `headline[]` 每筆至少包含：
  - `key`
  - `label`
  - `value`
  - `formattedValue`
  - `compareValue`
  - `formattedCompareValue`
  - `delta`
  - `trend`
  - `helper`

### `GET /api/advertising-effectiveness/details`

- 支援 query：
  - `year=YYYY`
  - `month=MM`
- 回傳：
  - `updatedAt`
  - `trendCards[]`
  - `topBreakdowns[]`
- `trendCards[]` 每筆至少包含：
  - `key`
  - `eyebrow`
  - `title`
  - `headlineValue`
  - `headlineUnit`
  - `series[]`
- `series[]` 每筆至少包含：
  - `label`
  - `unit`
  - `type`
  - `points[]`
- `topBreakdowns[]` 每筆至少包含：
  - `key`
  - `eyebrow`
  - `title`
  - `items[]`
- `items[]` 每筆至少包含：
  - `key`
  - `rank`
  - `label`
  - `value`
  - `formattedValue`
  - `share`
  - `color`

## 實作原則

- server API 只讀 generated data，再做必要格式轉換。
- 頁面資料來源固定透過：
  - `/api/advertising-effectiveness/summary`
  - `/api/advertising-effectiveness/details`
- 頁面選取狀態固定透過 route query 保存：
  - `year`
  - `month`
- 第一版不串外部廣告平台。
- 第一版只做年月查詢條件，不加入國別、渠道或其他額外篩選。

## 驗收標準

- `/advertisingEffectiveness` 可由 sidebar 直接進入。
- 頁面可在無外部服務下完整渲染。
- 篩選列可切換年份與月份，且 query、UI、API 回傳保持一致。
- KPI、趨勢卡、TOP5 環圖三段式結構在桌機、平板、手機皆成立。
- 手機版無整頁橫向卷動。
- `seed -> generate script -> generated.js -> API -> page` 流程可直接運作。
- `generated.js` 只保留資料常數，不含執行邏輯。

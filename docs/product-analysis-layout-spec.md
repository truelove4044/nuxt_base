# 商品分析頁改版規格

## 目標

- 目標頁面為 [productAnalysis.vue](/F:/website/nuxt_base/app/pages/productAnalysis.vue)。
- 本次改版以參考圖為主，將商品分析頁收斂為手機銷售分析頁。
- 主視覺必須保留圓餅圖，並維持目前 dashboard 的設計語言，不改成另一套風格。
- 頁面不需要額外版面說明、導讀文案或多餘的 hero 敘述。

## 設計約束

- 延續現有設計風格：淺色底、白色卡片、綠橘點綴、`Manrope` + `Noto Sans TC` 的字體組合。
- 優先沿用既有共用元件，不可重做相同用途的 generic 元件。
- 可直接重用的共用元件包含：
  - `BaseCard`
  - `ReportSectionTitle`
  - `ReportEmptyState`
- 若現有共用元件無法承接截圖專屬區塊，可新增商品分析專用區塊，但不可重新建立新的通用卡片、通用標題或通用空狀態元件。

## 版面結構

- 桌機版採雙欄主版面。
- 左欄放品牌占比圓餅圖卡片。
- 右欄放月別 SKU 銷售矩陣卡片。
- 主區塊上方僅保留頁面標題，不放副標、說明段落或額外摘要。
- 不保留目前多段式 KPI 區塊，也不保留多模組儀表板節奏。

### 桌機版

- 主區塊為 `minmax(0, 0.95fr) minmax(0, 1.45fr)` 的雙欄比例或等級相近的配置，右欄明顯重於左欄。
- 左欄卡片內包含：
  - 區塊標題
  - 圓餅圖
  - 品牌清單與占比／台數摘要
- 右欄卡片內包含：
  - 年份與月份欄頭
  - 品牌群組標題列
  - SKU 名稱列
  - 各月份銷量與熱度底色

### 平板與手機版

- 平板與手機改為上下堆疊，先顯示圓餅圖，再顯示銷售矩陣。
- 銷售矩陣在小螢幕維持橫向捲動，不拆成多張卡片。
- 行動版仍需保留型號欄與月份欄的辨識性，避免資料被切碎後失去可讀性。

## 區塊規格

### 品牌占比圓餅圖

- 圖表型態為圓餅圖，不可被甜甜圈以外的其他主圖取代。
- 圓餅圖為此頁主視覺，需明顯大於一般輔助圖表呈現。
- 圖例與品牌清單放在卡片內，應顯示：
  - 品牌名稱
  - 銷量
  - 占比
- 色彩需使用現有 token 延伸，不額外導入新主題色系。

### 月別 SKU 銷售矩陣

- 矩陣以資料密度為優先，視覺上貼近參考圖的「型號 x 月份」閱讀方式。
- 頂部固定顯示年份與月份欄位。
- 內容至少包含：
  - 品牌群組列
  - SKU 型號名稱
  - 各月份銷量
- 每個數值格需以熱度深淺表示相對強弱，但文字可讀性優先於底色裝飾。
- 表格風格仍需維持目前 dashboard 的乾淨卡片感，不直接複製舊式報表線框風格。

## 資料模型方向

- 商品分析頁資料收斂為手機銷售主題，不保留先前多區塊儀表板中的其他分析模組。
- 本頁只處理以下核心資訊：
  - 品牌銷量占比
  - 月別 SKU 銷售矩陣
  - 品牌群組與月份彙總
- 先以 mock server API 提供資料，維持目前報表頁的本地資料模式。

## API / 資料需求

### `GET /api/product-analysis/summary`

- 提供圓餅圖與頁面主標題所需資料。
- 最小回傳欄位：
  - `pageTitle`
  - `pieChart.title`
  - `pieChart.monthLabel`
  - `pieChart.items[]`
- `pieChart.items[]` 至少包含：
  - `key`
  - `label`
  - `units`
  - `share`
  - `color`

### `GET /api/product-analysis/details`

- 提供月別 SKU 銷售矩陣所需資料。
- 最小回傳欄位：
  - `matrixHeader.year`
  - `matrixHeader.months[]`
  - `groups[]`
  - `rows[]`
  - `heatmap.maxValue`
- `groups[]` 至少包含：
  - `brandKey`
  - `brandLabel`
  - `brandTotals[]`
- `rows[]` 至少包含：
  - `id`
  - `brandKey`
  - `model`
  - `monthlyUnits[]`

## 元件與實作原則

- 沿用現有 dashboard layout，不更動頁面路由命名策略。
- [productAnalysis.vue](/F:/website/nuxt_base/app/pages/productAnalysis.vue) 保持為目標頁面，不另建替代頁。
- ECharts 需補上 `PieChart` 註冊，供品牌占比圖使用。
- 商品分析專用展示區塊可以拆成專用元件，但命名與責任需聚焦於此頁，不應抽成新的 generic report 元件。

## 驗收標準

- 頁面主體為桌機雙欄，左圓餅圖、右銷售矩陣。
- 平板與手機為上下堆疊，矩陣保留橫向捲動。
- 頁面中確實保留圓餅圖，且為主要視覺焦點。
- 沒有額外 hero 說明文案、版面導讀或不必要的 KPI 區塊。
- 沒有新增與 `BaseCard`、`ReportSectionTitle`、`ReportEmptyState` 等價的重複共用元件。
- 視覺 token、字級、卡片圓角、陰影與邊框語言需與現有 dashboard 一致。
- 矩陣的月份欄、品牌群組、型號列與熱度格需要對齊正確，且在小螢幕仍可閱讀。

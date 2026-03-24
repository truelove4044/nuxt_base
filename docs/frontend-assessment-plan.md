# 前端題目實作方案

## 摘要

本文件定義兩個前端題目的實作方案，目標是在現有 Nuxt 專案中，以一致的技術棧與資料流完成登入頁面與數據統計報表。文件內容聚焦於可直接落地的開發決策，避免實作者在 UI、狀態管理、API 介面與驗收標準上自行補規格。

本次技術棧固定為：

- Nuxt 4
- Vue 3
- Tailwind CSS
- Pinia
- VeeValidate + Yup
- Headless UI
- ECharts

目前專案已存在以下基礎檔案，後續實作以這些檔案為起點擴充：

- `app/pages/login.vue`
- `app/pages/index.vue`
- `app/stores/usePageStore.js`
- `app/composables/useApiFetch.js`

---

## 共用基礎設計

### 核心依賴與用途

建議補齊以下依賴：

- `@pinia/nuxt`：整合 Nuxt 與 Pinia。
- `pinia-plugin-persistedstate`：持久化登入狀態與 Token。
- `@nuxtjs/tailwindcss`：提供 Tailwind CSS 模組整合。
- `vee-validate`：表單狀態與驗證流程。
- `yup`：Schema 驗證規則。
- `@headlessui/vue`：無樣式互動元件，例如 Listbox、Dialog、Menu。
- `echarts`：統計圖表呈現。
- `vue-echarts`：Vue 中封裝 ECharts 元件。

### 目錄職責

- `app/pages`：頁面層，負責路由對應頁面。
- `app/components`：可重用 UI 元件，例如登入表單、圖表卡片、資料表格、空狀態區塊。
- `app/stores`：Pinia store，集中管理登入狀態、全域載入狀態與報表篩選條件。
- `app/composables`：API 封裝、報表資料查詢、共用邏輯。
- `server/api`：Nuxt mock API，提供登入與報表資料。
- `middleware`：路由守衛，處理登入限制與頁面導向。

### 共用狀態與資料流

Auth store 建議維護以下狀態：

- `token: string | null`
- `user: { id: string; name: string; role: string } | null`
- `isAuthenticated: boolean`
- `isLoading: boolean`

共用原則如下：

- 成功登入後，將 `accessToken` 與 `user` 寫入 Pinia。
- Token 以 `localStorage` 為預設持久化儲存位置。
- 路由進入前由 middleware 判斷是否已登入。
- API 請求由共用 composable 攜帶 Token，並統一處理 `401`。

### 共用 UI 原則

- 響應式優先，手機版與桌機版都需可用。
- 使用 Tailwind CSS 管理版面、字級、間距與狀態樣式。
- 基礎互動元件以 Headless UI 為優先，避免自行處理過多鍵盤與焦點細節。
- 所有非同步操作需有 loading 狀態與 disabled 保護。
- 空狀態、錯誤狀態與成功狀態都要有清楚的視覺提示。

---

## 題目一：登入頁面

### 路由與頁面定位

- 路由固定為 `/login`。
- 成功登入後導向 `/`。
- 若使用者已登入，再次進入 `/login` 時自動導回 `/`。

### UI / UX 方案

登入頁採雙欄設計版型：

- 桌機版可使用雙欄設計，左側放品牌或簡介文案，右側放登入表單。
- 手機版收斂為單欄，優先保證輸入與按鈕可用性。
- 表單欄位包含：
  - 帳號欄位 `account`
  - 密碼欄位 `password`
- 密碼欄位需提供顯示 / 隱藏切換。
- 送出按鈕需明確呈現 loading 中、disabled 與可提交狀態。

### 表單驗證規格

使用 `VeeValidate + Yup` 建立 schema：

- `account`
  - 必填
  - 必須符合 email 格式
- `password`
  - 必填
  - 最少 6 碼

互動規則：

- 欄位在輸入與失焦後即時顯示錯誤訊息。
- 按下送出前再次執行完整驗證。
- 驗證未通過時不可呼叫 API。

### 狀態管理與登入流程

登入流程如下：

1. 使用者在 `/login` 輸入帳號與密碼。
2. 表單驗證通過後，呼叫 `POST /api/login`。
3. 成功時將 `accessToken` 與 `user` 寫入 Pinia。
4. 將 Token 持久化到 `localStorage`。
5. 更新 `isAuthenticated = true`。
6. 導向首頁 `/`。

### API 規格

#### `POST /api/login`

Request:

```json
{
  "account": "user@example.com",
  "password": "123456"
}
```

Success `200`:

```json
{
  "accessToken": "mock-jwt-token",
  "user": {
    "id": "u001",
    "name": "Demo User",
    "role": "admin"
  }
}
```

Failure `401`:

```json
{
  "message": "帳號或密碼錯誤"
}
```

### API 封裝與攔截器

以現有 `app/composables/useApiFetch.js` 為基礎擴充：

- 請求前自動帶入 `Authorization: Bearer <token>`。
- 若回應為 `401`：
  - 清除 Pinia 中的 `token` 與 `user`
  - 更新 `isAuthenticated = false`
  - 導回 `/login`
- 可保留全域 loading 控制，但應區分「頁面級 loading」與「表單送出 loading」，避免報表頁背景請求造成登入按鈕狀態混亂。

### 路由守衛

新增 auth middleware，規則如下：

- 未登入使用者不可進入 `/`。
- 未登入時直接訪問首頁，自動導向 `/login`。
- 已登入時進入 `/login`，直接導向 `/`。

### 成功標準

- 表單驗證、即時提示、登入成功導頁、401 錯誤提示與 Token 保存都可正常運作。
- 重新整理頁面後登入狀態仍可維持。
- 任一受保護 API 回傳 `401` 時會自動清除登入資訊並導回登入頁。

---

## 題目二：數據統計報表

### 路由與頁面定位

- 首頁 `/` 即為報表頁。
- 使用者登入後直接落在此頁。
- 本次不另外新增 `/report` 路由。

### 報表頁組成

報表頁可拆為以下區塊：

- 頁首摘要區：顯示頁面標題與簡要說明。
- 篩選區：國別切換、時間區間切換、自訂日期區間。
- KPI 摘要區：顯示累計營業額、目標達成率、本月預測、廣告投入。
- 圖表區：主圖（營收 / 目標 / 預測）與輔助圖（達成率 / 廣告投入）。
- 資料表格區：展示月別指標明細（非訂單明細）。
- 空狀態區：處理查無資料情境。

### 篩選功能規格

篩選條件包括：

- `country: "all" | "indonesia" | "philippines"`
- `rangePreset: "last12m" | "ytd" | "custom"`
- `startDate: string`
- `endDate: string`

互動規則：

- 日期欄位採 `BaseDatePicker` 元件（非原生 `input[type="date"]`）。
- `BaseDatePicker` 的資料值格式固定為 `yyyy-MM-dd`。
- `開始日期` 受 `endDate` 上限限制；`結束日期` 受 `startDate` 下限限制。
- 日期選擇器固定為 date-only，不顯示時間選擇。
- `rangePreset !== "custom"` 時，`startDate` / `endDate` 由 preset 自動帶入。
- `rangePreset === "custom"` 時，才顯示日期輸入區。
- 篩選條件改變時，自動重抓資料。
- 查詢請求採 debounce（現況約 260ms）避免高頻觸發。
- 自訂區間若 `startDate > endDate`，前端顯示錯誤提示且不送出查詢。

### 圖表呈現規格

圖表套件固定採 `ECharts`。

目前報表圖表為兩張：

- 主圖：`月營收 vs 目標`
  - 序列：營收（line）、目標（bar）、預測（line）
- 輔助圖：`達成率與廣告投入`
  - 序列：達成率（line）、廣告投入（bar）
- X 軸：月份
- Y 軸：依序列型別顯示百分比或金額
- 資料來自 `GET /api/report/summary`

圖表區需處理三種狀態：

- loading
- 有資料
- 無資料

### 資料表格規格

表格為「月別指標明細」，由 `columns / rows / totals` 驅動。

欄位規則如下：

- `country = "all"` 時：
  - `month`、`revenue`、`target`、`achievementRate`、`indonesiaRevenue`、`philippinesRevenue`、`adSpend`
- `country = "indonesia" | "philippines"` 時：
  - `month`、`revenue`、`target`、`achievementRate`、`forecast`、`adSpend`、`momChange`

資料列以月份聚合，不是訂單層級資料。

### API 規格

#### `GET /api/report/summary?country&rangePreset&startDate&endDate`

Query 驗證規則：

- `country` 僅允許 `all`、`indonesia`、`philippines`
- `rangePreset` 僅允許 `last12m`、`ytd`、`custom`
- 當 `rangePreset = custom` 時，必須提供 `startDate` 與 `endDate`

Response:

```json
{
  "headline": [
    {
      "key": "revenue",
      "label": "累計營業額",
      "value": 495043433,
      "unit": "TWD",
      "formattedValue": "NT$ 495,043,433",
      "delta": "+409.4%",
      "trend": "up",
      "helper": "12 個月份"
    }
  ],
  "primaryTrend": {
    "title": "月營收 vs 目標",
    "description": "總覽近期待成情況",
    "series": [
      {
        "label": "營收",
        "unit": "TWD",
        "type": "line",
        "points": [{ "date": "2025-04", "label": "4月", "value": 28159490 }]
      }
    ]
  },
  "secondaryTrend": {
    "title": "達成率與廣告投入",
    "description": "",
    "series": [
      {
        "label": "達成率",
        "unit": "percent",
        "type": "line",
        "points": [{ "date": "2025-04", "label": "4月", "value": 95.1 }]
      }
    ]
  },
  "updatedAt": "2026-03-25T10:20:30.000Z"
}
```

#### `GET /api/report/details?country&rangePreset&startDate&endDate`

Response:

```json
{
  "columns": [
    { "key": "month", "label": "月份", "align": "left", "format": "text" },
    { "key": "revenue", "label": "總營收", "align": "right", "format": "currency" },
    { "key": "target", "label": "總目標", "align": "right", "format": "currency" },
    { "key": "achievementRate", "label": "達成率", "align": "right", "format": "percent" }
  ],
  "rows": [
    {
      "month": "2025年4月",
      "revenue": 28159490,
      "target": 29600000,
      "achievementRate": 95.1
    }
  ],
  "totals": {
    "month": "合計",
    "revenue": 495043433,
    "target": 505300000,
    "achievementRate": 98.0
  }
}
```

### 非同步資料處理

報表頁資料流如下：

1. 首次進入首頁時，以預設條件呼叫 summary 與 details API。
2. 篩選條件變更後，以 debounce 方式重新查詢。
3. summary 與 details 共用同一組 filter state。
4. 自訂區間非法（開始日晚於結束日）時，不送 API 並顯示錯誤訊息。

### 空狀態與錯誤狀態

空狀態必須明確呈現，不可只留白：

- 圖表區顯示 Empty State 圖示、標題與提示文案。
- 表格區顯示「目前查無符合條件的月別資料」。
- 可保留一個「重設篩選條件」按鈕作為補強 UX。

錯誤處理建議：

- 若 API 失敗但非 `401`，在頁面顯示錯誤提示或 toast。
- 若為 `401`，交由全域攔截器處理登出與轉址。

### 效能策略

本次第一版以月別聚合資料為主：

- 查詢使用 debounce，降低重複請求。
- summary 與 details 並行請求，縮短等待時間。
- 視覺層需清楚區分 loading / 有資料 / 無資料。

### 成功標準

- 報表頁首次進入即可載入預設資料。
- 條件變更時圖表與表格可同步更新。
- 無資料時可正確呈現空狀態。
- 請求中有 loading 呈現，避免畫面突然閃空。

---

## 對外介面與型別約定

### 路由

- `/login`：登入頁
- `/`：統計報表頁

### Store 狀態

```ts
type AuthUser = {
  id: string;
  name: string;
  role: string;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};
```

### 報表查詢參數

```ts
type ReportFilters = {
  country: "all" | "indonesia" | "philippines";
  rangePreset: "last12m" | "ytd" | "custom";
  startDate: string;
  endDate: string;
};
```

### 報表回傳型別

```ts
type TrendPoint = {
  date: string;
  label: string;
  value: number;
};

type TrendSeries = {
  label: string;
  unit: "TWD" | "percent";
  type: "line" | "bar";
  points: TrendPoint[];
};

type HeadlineItem = {
  key: "revenue" | "achievementRate" | "forecast" | "adSpend";
  label: string;
  value: number | null;
  unit: "TWD" | "percent";
  formattedValue: string;
  delta: string;
  trend: "up" | "down" | "neutral";
  helper: string;
};

type DetailColumn = {
  key: string;
  label: string;
  align: "left" | "right";
  format: "text" | "currency" | "percent";
};

type DetailRow = {
  month: string;
  [key: string]: string | number | null;
};

type DetailTotals = {
  month: string;
  [key: string]: string | number | null;
};
```

---

## 測試與驗收案例

### 登入頁

- 帳號格式錯誤時即時顯示提示，且不可送出。
- 密碼少於 6 碼時即時顯示提示。
- 點擊登入後按鈕進入 loading 狀態，並暫停重複提交。
- API 成功後寫入 token、更新登入狀態並跳轉首頁。
- API 回傳 `401` 時顯示登入失敗訊息，不跳頁。
- 已登入狀態重新整理後仍能維持登入。
- 任一 API 回傳 `401` 時會自動清除登入狀態並導回 `/login`。

### 報表頁

- 初次進入時會載入預設國別與預設時間區間資料。
- 國別或時間區間變更後，圖表與表格同步刷新。
- `rangePreset = custom` 時顯示日期輸入，其他 preset 不顯示。
- 日期選擇器資料值格式固定為 `yyyy-MM-dd`，且不含時間。
- 自訂區間開始日晚於結束日時，不觸發查詢並顯示錯誤訊息。
- 無資料區間時，圖表區與表格區皆顯示空狀態。
- 請求過程中顯示 loading skeleton 或 spinner。
- 未登入直接訪問 `/` 時會被導回 `/login`。

---

## 開發順序

1. 補齊 Nuxt 模組與全域設定。
2. 建立 Pinia auth store 與 persisted state。
3. 擴充 `useApiFetch`，完成 Token 注入與 `401` 攔截。
4. 建立 `/api/login` mock API 與登入頁表單。
5. 建立 auth middleware 與登入導頁邏輯。
6. 建立報表篩選區、KPI 區、圖表區與月別明細表格元件。
7. 建立 `/api/report/summary` 與 `/api/report/details` mock API。
8. 串接首頁報表查詢、空狀態與 loading 狀態。
9. 依驗收案例逐項檢查互動與資料流。

---

## 假設與預設

- Token 儲存策略固定採 `localStorage`。
- 圖表套件固定採 `ECharts`。
- 後端 API 以 Nuxt `server/api` mock 實作，先滿足展示需求，不串接真實後端。
- 報表頁即為首頁，不額外新增 `/report` 路由。
- 本文件以現況（as-is）為準，不回頭套用舊版訂單查詢規格。
- 若後續要恢復訂單層級查詢與分頁，另開 v2 規格文件處理。

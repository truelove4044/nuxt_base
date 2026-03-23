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
- 篩選區：開始日期、結束日期、分類選單。
- 圖表區：至少一張折線圖，可選配圓餅圖。
- 資料表格區：展示詳細訂單資料。
- 分頁區：控制頁碼與每頁筆數。
- 空狀態區：處理查無資料情境。

### 篩選功能規格

篩選條件包括：

- `startDate: string`
- `endDate: string`
- `category: string`
- `page: number`
- `pageSize: number`

互動規則：

- 日期欄位先使用原生 `input[type="date"]`。
- 分類選單可用 Headless UI Listbox 實作。
- 預設每頁 `10` 筆。
- 篩選條件改變時，自動重抓資料。
- 日期或分類變更時，分頁重設回第 `1` 頁。
- 為避免高頻觸發，查詢請求採 debounce 處理。

### 圖表呈現規格

圖表套件固定採 `ECharts`。

第一版至少實作一張折線圖：

- X 軸：日期
- Y 軸：金額或訂單量
- 資料來自 `GET /api/report/summary`

可選加分項：

- 再補一張分類占比圓餅圖，呈現各類別的營收占比。

圖表區需處理三種狀態：

- loading
- 有資料
- 無資料

### 資料表格規格

表格欄位固定如下：

- `orderNo`
- `orderDate`
- `category`
- `amount`
- `paymentStatus`
- `orderStatus`
- `customerName`

欄位對應中文可顯示為：

- 訂單號
- 下單時間
- 分類
- 金額
- 付款狀態
- 訂單狀態
- 會員名稱

分頁規則：

- 查詢參數包含 `page` 與 `pageSize`。
- API 回傳 `total`、`page`、`pageSize`。
- 切換分頁時只更新表格資料與總筆數顯示。

### API 規格

#### `GET /api/report/summary?startDate&endDate&category`

Response:

```json
{
  "trend": [
    { "date": "2026-03-01", "amount": 3200, "orders": 12 },
    { "date": "2026-03-02", "amount": 5400, "orders": 18 }
  ],
  "categoryShare": [
    { "name": "3C", "value": 12000 },
    { "name": "服飾", "value": 8600 }
  ]
}
```

#### `GET /api/report/orders?startDate&endDate&category&page&pageSize`

Response:

```json
{
  "items": [
    {
      "orderNo": "ORD202603230001",
      "orderDate": "2026-03-23 10:30:00",
      "category": "3C",
      "amount": 2990,
      "paymentStatus": "paid",
      "orderStatus": "shipped",
      "customerName": "王小明"
    }
  ],
  "total": 48,
  "page": 1,
  "pageSize": 10
}
```

### 非同步資料處理

報表頁資料流如下：

1. 首次進入首頁時，用預設區間呼叫 summary 與 orders API。
2. 篩選條件變更後，以 debounce 方式重新查詢。
3. summary 與 orders 共用同一組 filter state。
4. 若表格切換分頁，只重抓 orders API。

### 空狀態與錯誤狀態

空狀態必須明確呈現，不可只留白：

- 圖表區顯示 Empty State 圖示、標題與提示文案。
- 表格區顯示「目前查無符合條件的訂單資料」。
- 可保留一個「重設篩選條件」按鈕作為補強 UX。

錯誤處理建議：

- 若 API 失敗但非 `401`，在頁面顯示錯誤提示或 toast。
- 若為 `401`，交由全域攔截器處理登出與轉址。

### 效能策略

本次第一版以後端分頁思路規劃：

- 前端僅載入當前頁資料。
- 大量訂單資料不一次全取。
- 虛擬捲軸列為延伸優化，不納入本次必做版本。

### 成功標準

- 報表頁首次進入即可載入預設資料。
- 條件變更時圖表與表格可同步更新。
- 分頁可正常切換並保留篩選條件。
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
  startDate: string;
  endDate: string;
  category: string;
  page: number;
  pageSize: number;
};
```

### 表格列型別

```ts
type OrderRow = {
  orderNo: string;
  orderDate: string;
  category: string;
  amount: number;
  paymentStatus: string;
  orderStatus: string;
  customerName: string;
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

- 初次進入時會載入預設日期區間與預設分類資料。
- 日期或分類變更後，圖表與表格同步刷新。
- 分頁切換只更新表格資料與總筆數。
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
6. 建立報表篩選區、圖表區、資料表格與分頁元件。
7. 建立 `/api/report/summary` 與 `/api/report/orders` mock API。
8. 串接首頁報表查詢、空狀態與 loading 狀態。
9. 依驗收案例逐項檢查互動與資料流。

---

## 假設與預設

- Token 儲存策略固定採 `localStorage`。
- 圖表套件固定採 `ECharts`。
- 後端 API 以 Nuxt `server/api` mock 實作，先滿足展示需求，不串接真實後端。
- 報表頁即為首頁，不額外新增 `/report` 路由。
- 第一版優先滿足題目需求與可展示性，不額外導入虛擬捲軸或複雜權限矩陣。

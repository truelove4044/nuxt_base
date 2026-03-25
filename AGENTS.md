# Global AGENTS.md

## PowerShell Encoding Rule

- When reading UTF-8 files containing Chinese, Japanese, Korean, or other non-ASCII text in PowerShell, do not assume garbled output from `Get-Content` means the file is corrupted. It may only be a console code page issue.
- To verify file contents reliably, prefer UTF-8 output via `cmd /c "chcp 65001>nul && type <path>"`.
- If PowerShell must be used directly, explicitly set encoding or output encoding before concluding the file contents are wrong.
- Before summarizing or validating non-ASCII file contents, run at least one UTF-8-safe read path first.
- For non-ASCII files, **do not** use whole-file rewrite pipelines like `(Get-Content -Raw <path>) ... | Set-Content <path>` unless both read and write encodings are explicitly UTF-8 and verified.
- Prefer patch-based edits (for example, `apply_patch`) over full-file rewrite when changing only part of a file.
- If PowerShell write-back is unavoidable, use explicit UTF-8 on both sides (example: `Get-Content -Raw -Encoding UTF8` + `Set-Content -Encoding UTF8`) and re-check file text with `cmd /c "chcp 65001>nul && type <path>"` immediately after writing.

## Commit Message Rule

1. 所有 `git commit` 訊息必須使用繁體中文。
2. 可保留 Conventional Commit 前綴（例如 `feat:`、`fix:`、`docs:`），但主訊息需為中文。

## PowerShell Command Rule

1. 在 PowerShell 中不要使用 `&&` 串接命令（不相容）。
2. 請改為分步執行多條命令。

## UI / UX 設計規則

- 只要涉及 UI、UX、排版、視覺設計相關問題，必須使用 `ui-ux-pro-max` skill。
- 包含但不限於：
  - 頁面布局（header、sidebar、dashboard、grid）
  - 間距（margin、padding）、對齊問題
  - 字級層級（標題、副標、說明）
  - 元件結構（卡片、表格、圖表、表單）
  - 後台系統與儀表板設計
  - RWD 行為（桌機 / 平板 / 手機）
  - 設計一致性與設計系統

- 禁止在未使用 skill 的情況下直接給 UI/UX 解法。
- 必須先分析版面結構、視覺層級與間距，再提出調整建議。
- 優先調整「整體 layout / 容器 / grid」，避免只 patch 單一元件。

## 專案狀況

- 目前專案為 Nuxt 4 + Vue 3 的前後端同倉庫應用，主要使用 Pinia 管理狀態，Nuxt server API 提供本地端資料接口，圖表採用 ECharts，表單驗證採用 Vee Validate 與 Yup。
- 已完成的核心模組包含登入頁與驗證流程、登入狀態保存、報表首頁、報表篩選條件，以及報表摘要 / 圖表 / 明細所需的 API 與 mock 資料流。
- 目前後端資料來源仍以本地 mock / server API 為主，尚未看到正式外部服務串接；閱讀或修改報表行為時，應優先從 `app/stores`、`app/composables`、`server/api/report` 與 `server/utils/report-service.js` 交叉確認。
- `app/pages/productAnalysis.vue` 目前尚未實作，代表商品分析頁仍不是可依賴的完成模組。
- `docs` 目錄目前沒有穩定的專案說明文件可作為單一事實來源；`README.md` 仍是 Nuxt 預設內容，不應視為此專案的完整說明。

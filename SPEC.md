# reads.3mi.ai — AI 工程筆記網站規格

> **Linear:** [OTT-89](https://linear.app/sammylin/issue/OTT-89)
> **風格參考:** [80aj.com](https://www.80aj.com/)（配色自訂，純淨版無廣告）
> **目標:** 個人 AI 工程筆記 blog

---

## 🎯 核心需求（Sammy 已確認）

| 項目 | 決定 |
|------|------|
| 用途 | AI 工程筆記（類似 80aj，但純淨版） |
| 顏色 | 不限，自行調整（提議見下方配色方案） |
| 資料庫 | SQLite（Cloudflare D1） |
| 文章量 | 起步放個位數，未來擴展 |
| Markdown 編輯 | ✅ 支援 |
| 廣告 | ❌ 純淨版 |
| 域名 | `reads.3mi.ai` |
| 靜 / 動態 | 動態（前端 SSG + 後端 Functions） |

---

## 🏗️ 技術架構

```
┌─────────────────────────────────────────────────────┐
│  reads.3mi.ai (Cloudflare Pages)                     │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  Astro SSG（靜態殼層）                       │  │
│  │  - 首頁、列表頁、文章頁 layout              │  │
│  │  - Build time：抓 D1 資料 → 靜態 HTML       │  │
│  │  - 客戶端再 hydration 做互動                 │  │
│  └──────────────────────────────────────────────┘  │
│                       │                              │
│  ┌────────────────────▼─────────────────────────┐  │
│  │  Pages Functions（/functions/api/*）         │  │
│  │  - POST /api/articles    → 建文章            │  │
│  │  - PUT  /api/articles/:id → 改文章          │  │
│  │  - DELETE /api/articles/:id → 刪文章         │  │
│  │  - POST /api/auth        → 登入驗證          │  │
│  └────────────────────┬─────────────────────────┘  │
│                       │                              │
│  ┌────────────────────▼─────────────────────────┐  │
│  │  Cloudflare D1（SQLite 相容）                │  │
│  │  - articles, tags, categories                │  │
│  │  - 全站 10 萬文章以下都免費                  │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### 為什麼選這個組合？

- **Astro** — 內容站最佳（像 80aj 用 WordPress 也類似概念），SSG 出 HTML 速度快、SEO 友善、bundle 小
- **Cloudflare D1** — SQLite 介面，免費額度內夠用（每天 500 萬讀、10 萬寫）
- **Pages Functions** — 後端 API 跟前端一起部署，不用另外架 server
- **Cloudflare CDN** — 全世界都快速存取

### 替代方案考慮

| 方案 | 為什麼不選 |
|------|-----------|
| 純靜態 + Markdown 檔案 | Sammy 想要後台編輯器 |
| Next.js | 對內容站太重，bundle 大 |
| Hono + React SPA | SEO 不友善 |
| WordPress | 不符合「AI 工程師 vibe」，要自己管主機 |

---

## 📊 資料庫 Schema

```sql
-- 文章
CREATE TABLE articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,           -- URL: /post/firecrawl-guide
  title TEXT NOT NULL,
  excerpt TEXT,                        -- 列表頁摘要
  content_md TEXT NOT NULL,            -- Markdown 原始內容
  content_html TEXT,                   -- 預渲染 HTML（build time）
  cover_image TEXT,                    -- 封面圖 URL
  category_id INTEGER,
  status TEXT DEFAULT 'draft',         -- draft | published
  is_featured INTEGER DEFAULT 0,       -- 是否焦點文章
  view_count INTEGER DEFAULT 0,
  reading_time INTEGER,                -- 預估閱讀分鐘數
  published_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 分類
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,           -- ai / architecture / tools ...
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,                          -- 主題色
  icon TEXT,                           -- emoji 或 icon 名
  sort_order INTEGER DEFAULT 0
);

-- 標籤
CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL
);

-- 文章 ↔ 標籤（多對多）
CREATE TABLE article_tags (
  article_id INTEGER,
  tag_id INTEGER,
  PRIMARY KEY (article_id, tag_id)
);

-- 索引
CREATE INDEX idx_articles_status_published ON articles(status, published_at DESC);
CREATE INDEX idx_articles_category ON articles(category_id);
```

---

## 🎨 配色方案（提議，待 Sammy 確認）

### 方案 A：工程師深色（推薦 ⭐）

```css
--bg-primary:    #0d1117   /* GitHub dark */
--bg-secondary:  #161b22
--bg-tertiary:   #21262d
--text-primary:  #e6edf3
--text-secondary:#8b949e
--accent:        #58a6ff   /* 科技藍 */
--accent-warm:   #f0883e   /* 焦點橘 */
--border:        #30363d
--success:       #3fb950
```

**理由：** 80aj 是亮色，但要「AI 工程師 vibe」，深色更對味。寫 code 的人 80% 都偏深色。

### 方案 B：簡約亮色

```css
--bg-primary:    #ffffff
--bg-secondary:  #f6f8fa
--text-primary:  #1f2328
--text-secondary:#656d76
--accent:        #0969da   /* GitHub blue */
--accent-warm:   #cf222e   /* 警示紅 */
--border:        #d0d7de
```

**理由：** 80aj 原汁原味，但配色換成更乾淨的 GitHub style。

### 方案 C：暗紫科技感

```css
--bg-primary:    #0f0e17   /* deep purple black */
--bg-secondary:  #1a1825
--accent:        #a78bfa   /* lavender */
--accent-warm:   #f25f4c   /* coral */
```

**理由：** 比較有個性，但深紫有人會覺得太重。

---

## 📄 頁面結構

### 公開頁

| 路徑 | 說明 |
|------|------|
| `/` | 首頁：焦點文章 + 最新文章 + 分類導航 |
| `/category/[slug]` | 分類頁：該分類所有文章 |
| `/tag/[slug]` | 標籤頁 |
| `/post/[slug]` | 文章頁：Markdown 渲染 |
| `/archive` | 全部文章時間軸 |
| `/about` | 關於我（可選） |
| `/rss.xml` | RSS feed |
| `/sitemap.xml` | SEO |

### 後台頁

| 路徑 | 說明 |
|------|------|
| `/admin/login` | 登入（密碼保護） |
| `/admin` | Dashboard：文章列表 |
| `/admin/new` | 新增文章（Markdown 編輯器） |
| `/admin/edit/[id]` | 編輯文章 |
| `/admin/categories` | 分類管理 |

---

## 🔐 後台權限

- 單一密碼（環境變數 `ADMIN_PASSWORD`，hash 存 D1）
- Session：JWT 存 httpOnly cookie
- 不做多用戶（先求有再求好）

---

## 📁 專案結構

```
news-3mi/
├── src/
│   ├── pages/                  # Astro 頁面
│   │   ├── index.astro         # 首頁
│   │   ├── post/[slug].astro   # 文章頁
│   │   ├── category/[slug].astro
│   │   ├── admin/
│   │   │   ├── index.astro
│   │   │   ├── login.astro
│   │   │   └── new.astro
│   │   └── api/                # 後端 API（Pages Functions）
│   │       ├── articles.ts
│   │       ├── auth.ts
│   │       └── categories.ts
│   ├── components/
│   │   ├── ArticleCard.astro
│   │   ├── MarkdownEditor.tsx  # React island
│   │   ├── Header.astro
│   │   ├── Sidebar.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── AdminLayout.astro
│   ├── lib/
│   │   ├── db.ts               # D1 client
│   │   ├── markdown.ts         # MD parser
│   │   └── auth.ts
│   └── styles/
│       └── global.css
├── functions/                  # Pages Functions
│   └── api/
├── migrations/                 # D1 migrations
│   └── 0001_init.sql
├── public/
│   └── favicon.svg
├── wrangler.toml               # Cloudflare config
├── astro.config.mjs
├── package.json
└── README.md
```

---

## 🚀 部署流程

1. **本地開發**
   ```bash
   npm run dev
   # Astro dev server + wrangler pages dev（D1 本地模擬）
   ```

2. **建立 D1**
   ```bash
   wrangler d1 create news-3mi-db
   wrangler d1 execute news-3mi-db --file=migrations/0001_init.sql
   ```

3. **部署到 Pages**
   ```bash
   wrangler pages deploy dist --project-name=news-3mi
   ```

4. **綁定域名 `reads.3mi.ai`**
   - Cloudflare Dashboard → Pages → news-3mi → Custom domains
   - 加 `reads.3mi.ai`（假設 3mi.ai zone 已在 Cloudflare）

---

## 📦 MVP 範圍（第一版交付）

### 必要 ✅
- [x] 首頁 + 文章列表 + 分類導航
- [x] 文章頁（Markdown 渲染、code highlight）
- [x] 後台 CRUD（簡單密碼登入）
- [x] 後台 Markdown 編輯器（CodeMirror 或 EasyMDE）
- [x] D1 schema + migrations
- [x] 響應式設計
- [x] RSS feed

### 加分 🌟
- [ ] 分類 / 標籤管理 UI
- [ ] 閱讀數統計
- [ ] 自動計算閱讀時間
- [ ] 草稿 / 發佈狀態切換
- [ ] SEO meta + OG image
- [ ] 搜尋功能（簡單 LIKE，未來可加 FTS5）

### 之後再說 🔮
- 留言系統
- 多用戶
- 文章版本歷史
- AI 自動摘要 / 標籤

---

## ⏱️ 預估時程

| 階段 | 工時 | 內容 |
|------|------|------|
| 1. 骨架 + 部署 | 1-2 小時 | Astro 專案 + D1 + Pages deploy hello world |
| 2. 公開頁 + 配色 | 2-3 小時 | 首頁、列表、文章頁 + 配色選定 |
| 3. 後台 CRUD | 2-3 小時 | 登入 + 編輯器 + D1 API |
| 4. 內容 + 上線 | 1 小時 | 寫第一篇文 + 綁域名 |
| **總計** | **6-9 小時** | 一天可以收工 |

---

## ❓ 還需要 Sammy 確認

1. **配色方案選哪個？** A（深色工程師）/ B（簡約亮色）/ C（暗紫科技）
2. **預估時程 OK？** 一次做到 MVP 還是分階段？
3. **要不要 Open Source？** 這個 stack 我覺得蠻適合放 GitHub 給其他人用（順便當 stock-radar 後下一個 the3mi 專案）
4. **圖片怎麼處理？** R2（Cloudflare 對象儲存）還是先用外部 URL？

回我這幾題，我就開工 ✊
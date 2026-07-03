# news.3mi.ai

Sammy 的 AI 工程筆記站 — 風格參考 [80aj.com](https://www.80aj.com/)，但配色自訂（深色工程師主題）、純淨版無廣告。

## 技術棧

- **Astro 4** — 靜態站生成（SSG）+ 部分 island
- **Cloudflare Pages** — CDN 部署
- **Cloudflare D1** — SQLite 資料庫
- **Cloudflare R2** — 圖片物件儲存
- **Pages Functions** — 後端 API（articles CRUD + auth + upload）
- **Markdown** — 文章內容（marked + highlight.js + DOMPurify）

## 開發

```bash
# 1. 裝套件
npm install

# 2. 建本地 D1（用 wrangler）
npx wrangler d1 create news-3mi-db    # 建立後把 id 填回 wrangler.toml
npm run db:migrate:local              # 建表
npm run db:seed:local                 # 範例資料

# 3. 起 dev server
npm run dev                           # http://localhost:4321

# 4. 本地測 API
npx wrangler pages dev ./dist --d1=DB --compatibility-date=2026-01-01
```

## 部署

```bash
# 1. 推到 remote D1
npx wrangler d1 execute news-3mi-db --remote --file=migrations/0001_init.sql

# 2. 設定 secrets
npx wrangler pages secret put ADMIN_PASSWORD --project-name=news-3mi
npx wrangler pages secret put JWT_SECRET --project-name=news-3mi

# 3. 建立 R2 bucket
npx wrangler r2 bucket create news-3mi-images
# 綁定 custom domain: images.news.3mi.ai

# 4. Build + Deploy
npm run build
npx wrangler pages deploy ./dist --project-name=news-3mi

# 5. 綁 custom domain
# Cloudflare Dashboard → Pages → news-3mi → Custom domains → news.3mi.ai
```

## 專案結構

```
news-3mi/
├── src/
│   ├── pages/                  # Astro 頁面（公開 + 後台）
│   ├── components/             # ArticleCard, Header, Footer, Sidebar
│   ├── layouts/                # BaseLayout, AdminLayout
│   ├── lib/                    # db, markdown, auth
│   └── styles/                 # global.css（深色配色）
├── functions/
│   ├── api/                    # articles, categories, auth, upload
│   ├── lib/                    # Functions 用（複製自 src/lib）
│   ├── _utils.ts               # JSON / error / CORS helper
│   └── _middleware.ts          # 後台頁面保護
├── migrations/                 # D1 schema + seed
├── public/                     # favicon
├── wrangler.toml               # Cloudflare config
├── astro.config.mjs
├── package.json
└── SPEC.md                     # 完整規格
```

## 配色（深色工程師主題）

- 背景 `#0d1117` / `#161b22`（GitHub Dark）
- 文字 `#e6edf3` / `#8b949e`
- 強調 `#58a6ff`（科技藍）
- 焦點 `#f0883e`（橘）

## API Endpoints

| Method | Path | 說明 |
|--------|------|------|
| GET | `/api/articles` | 列出所有文章（後台用） |
| GET | `/api/articles?slug=xxx` | 取單篇 |
| POST | `/api/articles` | 新增（需登入） |
| PUT | `/api/articles?id=xxx` | 更新（需登入） |
| DELETE | `/api/articles?id=xxx` | 刪除（需登入） |
| GET | `/api/categories` | 列出分類 |
| POST | `/api/categories` | 新增分類（需登入） |
| GET | `/api/auth` | 檢查登入狀態 |
| POST | `/api/auth` | 登入（password） |
| DELETE | `/api/auth` | 登出 |
| POST | `/api/upload` | 上傳圖片到 R2（需登入） |

## 後台

- `/admin/login` — 密碼登入
- `/admin` — 文章列表
- `/admin/new` — 新增（Markdown 編輯器 + 圖片上傳）
- `/admin/edit/[id]` — 編輯

密碼透過 `ADMIN_PASSWORD` secret 設定。

## 維護者

Sammy (林毅民) · the3mi.ai
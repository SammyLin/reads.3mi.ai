# reads.3mi.ai

Astro site on Cloudflare Pages + D1 + R2.

## UI convention

No emoji in UI. Use lucide icons (`lucide-astro` components for static markup; inline lucide SVG for runtime-built strings — e.g. `src/lib/categoryIcon.ts` maps category slug → Lucide SVG). Emoji only allowed inside article title / article content.

Design tokens + interaction language follow the shared 3mi design system — see [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) (canonical values: color, type scale, spacing, radius, shadow, easing `cubic-bezier(.32,.72,0,1)`, focus ring). Keep `src/styles/global.css` tokens in sync with it.

## Deploy

See [DEPLOY.md](./DEPLOY.md) — build then `wrangler pages deploy ./dist --project-name=news-3mi`. `wrangler login` required. `wrangler pages deploy` ships the working tree; `git stash -u` first if uncommitted WIP must not go live.


## 每日產文（Claude Code routine）

以前靠 OpenClaw 從本機推文，本機沒跑就整站停更（2026-07-29 到 2026-09-09 是這樣停的）。現在改由 [claude.ai/code/routines](https://claude.ai/code/routines) 的每日 routine 負責：抓 RSS → 挑一則 → 抓原文全文 → 照 `STYLE.md` 寫 → `POST /api/ingest` **直接發佈**。

**沒有人工審稿**，寫完就上線。要改回審稿制，把 `ROUTINE_PROMPT.md` 的 `status` 改成 `draft`，再用 `node scripts/draft-review.mjs` 開審稿台。

- 寫作骨架：`STYLE.md`（六段結構 + 硬規則，從已發表文章反推）
- 架構與金鑰：`ROUTINE.md`
- routine 的 prompt：`ROUTINE_PROMPT.md`（含正式金鑰，不進版控）

去重不靠資料庫，靠 `GET /api/ingest`（已發佈）與 `GET /api/pending-review`（待審草稿）兩個端點。

沒有 Worker、沒有 cron。曾經有過一個 `news-cron` Worker 做 DeepSeek 排名＋寫稿，拆掉的理由記在 `ROUTINE.md`。

註：claude.com 沒有 RSS（2026-09 實測 `/blog/rss.xml`、`/feed`、`/atom.xml` 全 404），改讀 `sitemap.xml` 的 `lastmod` 再逐篇抓 og 中繼資料。

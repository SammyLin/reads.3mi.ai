# 每日產文 routine

reads.3mi.ai 的內容產出全部由一個 Claude Code routine 負責。**沒有 Worker、沒有 cron、沒有第二個模型。**

```
Claude Code routine
  看站上已有什麼（去重）
  抓 6 個來源，篩 48 小時內
  挑 1 則「底下有尺可拆」的
  抓原文全文
  照 STYLE.md 寫
  POST /api/ingest (status=published)
```

**沒有人工審稿。** routine 寫完直接上線，所以 prompt 裡的三條事實紀律（抓不到全文就不寫、數字一律以原文為準、單邊說法要標明）是硬要求，不是建議。要改回人工審稿，把 prompt 第 5 節的 `status` 改成 `draft`，再用 `node scripts/draft-review.mjs` 開審稿台。

## 為什麼不用 Worker

原本有一個 `news-cron` Worker 用 DeepSeek 排名 + 寫稿。拆掉的原因：

- **寫稿品質**：DeepSeek 只拿得到 RSS 摘要，寫出來是複述，不是 `STYLE.md` 要的東西。
- **選題角度**：它會給「AI 解千禧年難題」高分、理由寫「里程碑」，看不出底下的資料權屬爭議才是可寫的點。
- **多一個元件就多一組金鑰、一份部署、一個會安靜壞掉的地方。** routine 自己就能抓 RSS 跟判斷輕重。

去重不靠資料庫，靠站上兩個現成端點：`GET /api/ingest`（已發佈，含 `source_url`）與 `GET /api/pending-review`（待審草稿，含標題）。網址比對加語意判斷，比純比對網址更準。

## 建立 routine

到 [claude.ai/code/routines](https://claude.ai/code/routines) 新增，倉庫指向 `reads.3mi.ai`，排每天早上，prompt 用 `ROUTINE_PROMPT.md` 的內容。

**prompt 裡有正式的 ingest 金鑰**。這是刻意的取捨：雲端 routine 讀不到本機的 `~/.zshrc.local`。所以 `ROUTINE_PROMPT.md` 不進版控（見 `.gitignore`），要重建就照 `ROUTINE_PROMPT.example.md` 把 `<OPENCLAW_NEWS_INGEST_KEY>` 換成 `~/.zshrc.local` 的 `NEWS_INGEST_KEY`。

**金鑰輪替時記得同步更新 routine 的 prompt**，否則它會安靜地失敗。另外 Cloudflare Pages 的 secret 改完不會立刻生效，要重新部署一次。

## 手動補跑

routine 漏跑，或想立刻補一篇：本機開 Claude Code，把 `ROUTINE_PROMPT.md` 貼進去即可。

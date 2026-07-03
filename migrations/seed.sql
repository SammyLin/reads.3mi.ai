-- 範例資料

INSERT INTO categories (slug, name, description, color, icon, sort_order) VALUES
  ('ai', 'AI', '模型、Agent、LLM 工具', '#a371f7', '🤖', 1),
  ('architecture', '架構', '系統設計與架構決策', '#58a6ff', '🏗️', 2),
  ('tools', '工具', '開發者工具評測與使用', '#3fb950', '🛠️', 3),
  ('tutorial', '實戰', 'Step-by-step 教學', '#f0883e', '📚', 4),
  ('security', '安全', '資安與隱私', '#f85149', '🔒', 5),
  ('life', '生活', '工程師生活與反思', '#db61a2', '🌱', 6);

-- 第一篇範例文章
INSERT INTO articles (slug, title, excerpt, content_md, content_html, category_id, status, is_featured, published_at, reading_time) VALUES
  (
    'welcome-to-news-3mi',
    '歡迎來到 news.3mi.ai — 我的 AI 工程筆記',
    '這裡會記錄我在 AI 工程領域的學習、實作與反思。包括 LLM 工具評測、Agent 架構、雲端部署經驗。',
    '# 歡迎來到 news.3mi.ai

這是我的個人 AI 工程筆記站。

## 為什麼開這個站？

- 整理學到的東西，順便留下筆記給未來的自己
- 分享給有興趣的朋友
- 強迫自己把東西做完整、講清楚

## 技術棧

本站使用：

- **Astro** — 靜態站生成，內容站最佳選擇
- **Cloudflare Pages** — 全球 CDN 部署
- **Cloudflare D1** — SQLite 相容資料庫
- **Cloudflare R2** — 圖片物件儲存

## 內容分類

- 🤖 **AI** — 模型、Agent、LLM 工具
- 🏗️ **架構** — 系統設計決策
- 🛠️ **工具** — 開發者工具評測
- 📚 **實戰** — 教學文
- 🔒 **安全** — 資安相關
- 🌱 **生活** — 工程師生活與反思

---

如果你對內容有興趣歡迎訂閱 RSS 📡
',
    NULL,
    1,
    'published',
    1,
    CURRENT_TIMESTAMP,
    2
  );

INSERT INTO tags (slug, name) VALUES
  ('meta', 'Meta'),
  ('cloudflare', 'Cloudflare'),
  ('astro', 'Astro');

INSERT INTO article_tags (article_id, tag_id) VALUES (1, 1), (1, 2), (1, 3);
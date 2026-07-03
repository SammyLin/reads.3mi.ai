-- 補充更多文章 — 用 placeholder content 然後從 API 更新

INSERT OR IGNORE INTO tags (slug, name) VALUES
  ('llm', 'LLM'),
  ('agent', 'Agent'),
  ('architecture', 'Architecture'),
  ('cloudflare', 'Cloudflare'),
  ('astro', 'Astro'),
  ('typescript', 'TypeScript'),
  ('meta', 'Meta'),
  ('security', 'Security'),
  ('tooling', 'Tooling');

INSERT OR IGNORE INTO articles (slug, title, excerpt, content_md, content_html, category_id, status, is_featured, published_at, reading_time) VALUES
  ('building-news-3mi-with-ai-agents', '用 AI Agent 打造 news.3mi.ai：從構思到上線 8 小時', '從一個 SPEC.md 到正式上線，整個過程大量使用 Claude Code + AI Agent 協作。', 'Content pending via API update.', NULL, 1, 'published', 1, '2026-07-02 10:30:00', 5),
  ('why-i-chose-astro-over-nextjs', '為什麼個人站選 Astro 而非 Next.js：SSG 哲學的差異', 'Astro 的「內容優先」哲學更貼近我的需求：預設靜態、需要動態才加 island。', 'Content pending via API update.', NULL, 2, 'published', 0, '2026-07-02 09:00:00', 4),
  ('obsidian-cli-obsidian-from-terminal', 'Obsidian 從 Terminal 操作：用 CLI 串接 AI Workflow', 'Obsidian 官方 1.12+ 提供 CLI，可以從 terminal 讀寫筆記。', 'Content pending via API update.', NULL, 3, 'published', 0, '2026-07-01 21:00:00', 3),
  ('cloudflare-d1-from-zero-to-prod', 'Cloudflare D1 從零到上線：SQLite on the Edge 實戰', 'D1 是 Cloudflare 的 SQLite 服務，延遲超低、價格便宜。', 'Content pending via API update.', NULL, 4, 'published', 0, '2026-07-01 18:00:00', 6),
  ('api-token-rotation-pain', 'API Token 輪替的痛苦：從 1Password 到 Cloudflare 的血淚', '當你有 5+ 個第三方服務，每個都有自己的 token，輪替變成一場噩夢。', 'Content pending via API update.', NULL, 5, 'published', 0, '2026-06-30 14:00:00', 4),
  ('why-i-started-news-3mi', '為什麼開這個站：不寫下來就會忘', '開站動機很簡單：學到的東西如果不寫下來，半年後會忘光。', 'Content pending via API update.', NULL, 6, 'published', 0, '2026-06-29 22:00:00', 3);

-- 建立 article_tags 關聯
INSERT OR IGNORE INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'building-news-3mi-with-ai-agents' AND t.slug IN ('llm', 'agent', 'meta');

INSERT OR IGNORE INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'why-i-chose-astro-over-nextjs' AND t.slug IN ('architecture', 'astro', 'typescript');

INSERT OR IGNORE INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'obsidian-cli-obsidian-from-terminal' AND t.slug IN ('tooling', 'meta');

INSERT OR IGNORE INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'cloudflare-d1-from-zero-to-prod' AND t.slug IN ('cloudflare', 'architecture', 'tooling');

INSERT OR IGNORE INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'api-token-rotation-pain' AND t.slug IN ('security', 'tooling');

INSERT OR IGNORE INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'why-i-started-news-3mi' AND t.slug IN ('meta');

-- 也把 meta tag 給 welcome 文章
INSERT OR IGNORE INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'welcome-to-news-3mi' AND t.slug IN ('meta');
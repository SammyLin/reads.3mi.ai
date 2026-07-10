-- 系列 / 合集（像 80aj 的主題課程）。跨文章分組 + 系列內排序。
CREATE TABLE IF NOT EXISTS series (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE articles ADD COLUMN series_id INTEGER;
ALTER TABLE articles ADD COLUMN series_order INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_articles_series ON articles(series_id, series_order);

-- 範例合集（原創，非抄襲外站內容）
INSERT OR IGNORE INTO series (slug, title, description, sort_order) VALUES
  ('llm-foundations', '大模型基礎', '從原理、微調到 Function Calling 的入門系列。', 1),
  ('agent-in-production', 'Agent 上線實戰', '把 Agent 從 demo 帶到生產環境的工程筆記。', 2),
  ('ai-arch-decisions', 'AI 架構決策', '在真實系統裡採用 AI 的架構取捨與判斷。', 3);

-- LLM 用量統計（首頁 80aj 式熱力圖卡）。
-- 每 provider 每日一列；資料由本機 pipeline 透過 POST /api/usage 推上來。

CREATE TABLE IF NOT EXISTS usage_daily (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider TEXT NOT NULL CHECK (provider IN ('claude', 'codex')),
  day TEXT NOT NULL, -- YYYY-MM-DD
  tokens INTEGER NOT NULL DEFAULT 0,
  cost_usd REAL NOT NULL DEFAULT 0,
  messages INTEGER NOT NULL DEFAULT 0,
  models TEXT, -- JSON: {"model-id": tokens}
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider, day)
);

CREATE INDEX IF NOT EXISTS idx_usage_daily ON usage_daily(provider, day DESC);

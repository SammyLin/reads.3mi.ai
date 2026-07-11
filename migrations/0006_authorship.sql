-- 作者身分（正交於 content_type 的維度）：
--   original    = 站長自寫觀點
--   ai          = AI 生成 / 整理（自動 pipeline 預設）
--   translation = 原文直譯
ALTER TABLE articles ADD COLUMN authorship TEXT NOT NULL DEFAULT 'ai'
  CHECK(authorship IN ('original','ai','translation'));

CREATE INDEX IF NOT EXISTS idx_articles_authorship ON articles(status, authorship, published_at DESC);

-- 既有資料回填：沒有來源 URL 的視為手寫觀點；其餘（OpenClaw 進來的）維持 ai。
UPDATE articles SET authorship = 'original' WHERE source_url IS NULL OR source_url = '';

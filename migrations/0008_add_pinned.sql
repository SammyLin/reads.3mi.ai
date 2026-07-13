-- 置頂文章（首頁右欄）。is_featured 語意改為「今日觀點」（Sammy 手寫社論，首頁主位）。

ALTER TABLE articles ADD COLUMN is_pinned INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_articles_pinned ON articles(is_pinned, status, published_at DESC);

ALTER TABLE articles ADD COLUMN content_type TEXT NOT NULL DEFAULT 'signal'
  CHECK(content_type IN ('signal','deep-dive','field-note','decision-card'));
ALTER TABLE articles ADD COLUMN decision_status TEXT NOT NULL DEFAULT 'watch'
  CHECK(decision_status IN ('adopt','trial','watch','avoid'));
ALTER TABLE articles ADD COLUMN impact_level TEXT NOT NULL DEFAULT 'medium'
  CHECK(impact_level IN ('low','medium','high'));
ALTER TABLE articles ADD COLUMN confidence INTEGER NOT NULL DEFAULT 70
  CHECK(confidence BETWEEN 0 AND 100);
ALTER TABLE articles ADD COLUMN event_key TEXT;
CREATE INDEX IF NOT EXISTS idx_articles_decision_status ON articles(status,decision_status,published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_event_key ON articles(event_key,published_at DESC);

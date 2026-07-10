-- Structured cross-site links between news.3mi.ai and ChunkUp.
ALTER TABLE articles ADD COLUMN related_chunk_url TEXT;
ALTER TABLE articles ADD COLUMN related_chunk_title TEXT;
CREATE INDEX IF NOT EXISTS idx_articles_source_url ON articles(source_url);

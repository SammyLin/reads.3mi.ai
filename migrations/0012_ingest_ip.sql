-- ingest 呼叫端 IP（server 從 CF-Connecting-IP 自動記錄，非 payload 欄位；admin-only）
ALTER TABLE articles ADD COLUMN ingest_ip TEXT;

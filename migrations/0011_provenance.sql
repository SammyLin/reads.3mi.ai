-- 產製來源追蹤（僅供 admin 檢視，前台不顯示）：
--   created_via = 這篇是誰送進來的（openclaw / admin / script…，自由文字）
--   gen_model   = 產文用的模型 id（如 claude-sonnet-5、gpt-5.4；人工手寫留空）
ALTER TABLE articles ADD COLUMN created_via TEXT;
ALTER TABLE articles ADD COLUMN gen_model TEXT;

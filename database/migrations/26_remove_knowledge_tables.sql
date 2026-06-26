-- 26_remove_knowledge_tables.sql
-- Remove unused RAG pipeline tables. No application code reads or writes them.
-- The pgvector extension is left in place (harmless, may be reused later).

DROP TABLE IF EXISTS public.knowledge_embeddings;
DROP TABLE IF EXISTS public.knowledge_documents;

-- 09_ai_knowledge.sql
-- AI knowledge base for RAG (Retrieval-Augmented Generation).
-- All compliance AI responses must originate from this knowledge base.
-- Model memory must never be treated as regulatory authority.

-- Knowledge documents (approved regulatory sources only)
CREATE TABLE IF NOT EXISTS public.knowledge_documents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  content         TEXT NOT NULL,
  source_url      TEXT,
  source_type     TEXT NOT NULL
                    CHECK (source_type IN (
                      'regulation', 'circular', 'guideline', 'agency_publication',
                      'fee_schedule', 'directive', 'compliance_template'
                    )),
  country_id      UUID REFERENCES public.countries(id),
  industry_id     UUID REFERENCES public.industries(id),
  requirement_id  UUID REFERENCES public.requirements(id),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_knowledge_documents_updated_at
  BEFORE UPDATE ON public.knowledge_documents
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Vector embeddings for semantic search
CREATE TABLE IF NOT EXISTS public.knowledge_embeddings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id     UUID NOT NULL REFERENCES public.knowledge_documents(id) ON DELETE CASCADE,
  chunk_index     INTEGER NOT NULL,             -- position of this chunk in the document
  chunk_text      TEXT NOT NULL,
  embedding       VECTOR(1536),                 -- OpenAI text-embedding-3-small dimensions
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- HNSW index for fast approximate nearest neighbour search
CREATE INDEX idx_knowledge_embeddings_vector
  ON public.knowledge_embeddings
  USING hnsw (embedding vector_cosine_ops);

CREATE INDEX idx_knowledge_embeddings_document_id
  ON public.knowledge_embeddings(document_id);

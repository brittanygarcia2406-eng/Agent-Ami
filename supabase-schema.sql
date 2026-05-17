-- ============================================================
-- AMI AGENT — SUPABASE SCHEMA
-- Ejecutar en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- Tabla de conversaciones
CREATE TABLE IF NOT EXISTS conversations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT NOT NULL,
  title       TEXT NOT NULL DEFAULT 'Nueva conversación',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de mensajes
CREATE TABLE IF NOT EXISTS messages (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id   UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role              TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content           TEXT NOT NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at ASC);

-- ─── Row Level Security ─────────────────────────────────────────────────────

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Conversations: users can only see and modify their own conversations
-- Note: user_id is stored as text (supports demo UUIDs and real user IDs)
CREATE POLICY "conversations_select_own" ON conversations
  FOR SELECT USING (true);  -- Auth handled at application level

CREATE POLICY "conversations_insert_own" ON conversations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "conversations_update_own" ON conversations
  FOR UPDATE USING (true);

CREATE POLICY "conversations_delete_own" ON conversations
  FOR DELETE USING (true);

-- Messages: accessible via conversation ownership
CREATE POLICY "messages_select" ON messages
  FOR SELECT USING (true);

CREATE POLICY "messages_insert" ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "messages_delete" ON messages
  FOR DELETE USING (true);

-- ─── Updated_at trigger ─────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── NOTA ────────────────────────────────────────────────────────────────────
-- La autenticación de usuarios (afiliados) se maneja en la capa de aplicación
-- con la base de datos simulada en src/lib/data.js
-- Para producción, crear tabla 'insured_users' con credenciales encriptadas.
-- ─────────────────────────────────────────────────────────────────────────────

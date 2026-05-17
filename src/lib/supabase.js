// Supabase desactivado — el proyecto usa localStorage por defecto.
// Para activar Supabase real: npm install @supabase/supabase-js
export const supabase = null

export async function getConversations() { return [] }
export async function createConversation(userId, title) {
  return { id: crypto.randomUUID(), user_id: userId, title, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
}
export async function updateConversationTitle() {}
export async function deleteConversation() {}
export async function getMessages() { return [] }
export async function saveMessage(conversationId, role, content) {
  return { id: crypto.randomUUID(), conversation_id: conversationId, role, content, created_at: new Date().toISOString() }
}

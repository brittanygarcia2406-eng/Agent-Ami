import { supabase, getConversations, createConversation, getMessages, saveMessage, deleteConversation, updateConversationTitle } from '../lib/supabase.js'

const LOCAL_KEY = (userId) => `ami-convs-${userId}`

// ─── Hybrid storage: localStorage fallback when Supabase not configured ───────

function isSupabaseConfigured() {
  const url = import.meta.env.VITE_SUPABASE_URL
  return supabase !== null && url && url !== 'your_supabase_project_url' && !url.includes('placeholder')
}

// Local storage helpers
function getLocalConversations(userId) {
  try {
    const raw = localStorage.getItem(LOCAL_KEY(userId))
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveLocalConversations(userId, convs) {
  localStorage.setItem(LOCAL_KEY(userId), JSON.stringify(convs))
}

function getLocalMessages(conversationId) {
  try {
    const raw = localStorage.getItem(`ami-msgs-${conversationId}`)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveLocalMessages(conversationId, messages) {
  localStorage.setItem(`ami-msgs-${conversationId}`, JSON.stringify(messages))
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function fetchConversations(userId) {
  if (isSupabaseConfigured()) {
    try { return await getConversations(userId) } catch {}
  }
  return getLocalConversations(userId)
}

export async function createNewConversation(userId, title = 'Nueva conversación') {
  const id = crypto.randomUUID()
  const conv = {
    id,
    user_id: userId,
    title,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured()) {
    try { return await createConversation(userId, title) } catch {}
  }

  const convs = getLocalConversations(userId)
  convs.unshift(conv)
  saveLocalConversations(userId, convs)
  return conv
}

export async function fetchMessages(conversationId) {
  if (isSupabaseConfigured()) {
    try { return await getMessages(conversationId) } catch {}
  }
  return getLocalMessages(conversationId)
}

export async function addMessage(conversationId, role, content, userId) {
  const msg = {
    id: crypto.randomUUID(),
    conversation_id: conversationId,
    role,
    content,
    created_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured()) {
    try { return await saveMessage(conversationId, role, content) } catch {}
  }

  const msgs = getLocalMessages(conversationId)
  msgs.push(msg)
  saveLocalMessages(conversationId, msgs)

  // update local conversation timestamp + title if first user message
  if (userId) {
    const convs = getLocalConversations(userId)
    const idx = convs.findIndex(c => c.id === conversationId)
    if (idx !== -1) {
      convs[idx].updated_at = new Date().toISOString()
      if (role === 'user' && convs[idx].title === 'Nueva conversación') {
        convs[idx].title = content.slice(0, 45) + (content.length > 45 ? '…' : '')
      }
      saveLocalConversations(userId, convs)
    }
  }

  return msg
}

export async function removeConversation(conversationId, userId) {
  if (isSupabaseConfigured()) {
    try { await deleteConversation(conversationId) } catch {}
  }
  localStorage.removeItem(`ami-msgs-${conversationId}`)
  const convs = getLocalConversations(userId)
  saveLocalConversations(userId, convs.filter(c => c.id !== conversationId))
}

export async function renameConversation(conversationId, title, userId) {
  if (isSupabaseConfigured()) {
    try { await updateConversationTitle(conversationId, title) } catch {}
  }
  const convs = getLocalConversations(userId)
  const idx = convs.findIndex(c => c.id === conversationId)
  if (idx !== -1) {
    convs[idx].title = title
    saveLocalConversations(userId, convs)
  }
}

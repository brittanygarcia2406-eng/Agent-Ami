import { useState, useCallback, useRef } from 'react'
import { sendMessageToAI } from '../services/ai.js'
import { addMessage } from '../services/conversations.js'

export function useChat(user, conversationId) {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const sendMessage = useCallback(async (content, currentConvId) => {
    const activeId = currentConvId || conversationId;
    if (!content.trim() || isLoading) return

    setError(null)

    // Add user message locally
    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])

    // Persist user message
    if (activeId) {
      await addMessage(activeId, 'user', content.trim(), user.id)
    }

    setIsLoading(true)

    try {
      // Build history for AI context (exclude the just-added message)
      const history = messages.map(m => ({ role: m.role, content: m.content }))

      const aiResponse = await sendMessageToAI(content.trim(), history, user)

      const assistantMsg = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: aiResponse,
        created_at: new Date().toISOString(),
      }

      setMessages(prev => [...prev, assistantMsg])

      // Persist assistant message
      if (activeId) {
        await addMessage(activeId, 'assistant', aiResponse, user.id)
      }
    } catch (err) {
      console.error('[useChat] AI error:', err)
      setError('Error al conectar con el asistente. Intenta nuevamente.')
      const errMsg = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Lo siento 😊\nEn este momento tuve un problema procesando tu solicitud. ¿Podrías intentarlo nuevamente?',
        created_at: new Date().toISOString(),
        isError: true,
      }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading, conversationId, user])

  return {
    messages,
    setMessages,
    isLoading,
    error,
    sendMessage,
  }
}

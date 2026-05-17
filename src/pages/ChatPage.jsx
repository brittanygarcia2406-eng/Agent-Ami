import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Menu, Shield, Sun, Moon, ChevronDown } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar.jsx'
import Message from '../components/chat/Message.jsx'
import TypingIndicator from '../components/chat/TypingIndicator.jsx'
import ChatInput from '../components/chat/ChatInput.jsx'
import WelcomeScreen from '../components/chat/WelcomeScreen.jsx'
import { useChat } from '../hooks/useChat.js'
import {
  fetchConversations, createNewConversation, fetchMessages,
  addMessage, removeConversation, renameConversation
} from '../services/conversations.js'
import { PLANS } from '../lib/data.js'

export default function ChatPage({ user, onLogout, theme, onToggleTheme }) {
  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [convLoading, setConvLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const { messages, setMessages, isLoading, sendMessage } = useChat(user, activeConv?.id)

  // Load conversations on mount
  useEffect(() => {
    loadConversations()
  }, [user.id])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  async function loadConversations() {
    try {
      const convs = await fetchConversations(user.id)
      setConversations(convs)
    } catch (err) {
      console.error('[ChatPage] loadConversations error:', err)
    }
  }

  async function handleNewChat() {
    setSidebarOpen(false)
    setActiveConv(null)
    setMessages([])
  }

  async function handleSelectConv(conv) {
    setSidebarOpen(false)
    setConvLoading(true)
    setActiveConv(conv)
    try {
      const msgs = await fetchMessages(conv.id)
      setMessages(msgs)
    } catch (err) {
      console.error('[ChatPage] fetchMessages error:', err)
      setMessages([])
    } finally {
      setConvLoading(false)
    }
  }

  async function handleSendMessage(text) {
    // Create conversation if none active
    let convId = activeConv?.id
    if (!convId) {
      const newConv = await createNewConversation(user.id, text.slice(0, 45))
      setActiveConv(newConv)
      setConversations(prev => [newConv, ...prev])
      convId = newConv.id
      // Update active conv ref for useChat
    }
    await sendMessage(text, convId)
    // Refresh conversation list to update timestamps
    await loadConversations()
  }

  async function handleDeleteConv(convId) {
    await removeConversation(convId, user.id)
    setConversations(prev => prev.filter(c => c.id !== convId))
    if (activeConv?.id === convId) {
      setActiveConv(null)
      setMessages([])
    }
  }

  async function handleRenameConv(convId, title) {
    await renameConversation(convId, title, user.id)
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, title } : c))
  }

  const plan = PLANS[user.plan]
  const planBadgeColors = {
    basic: 'text-slate-500',
    intermediate: 'text-sky-500',
    premium: 'text-brand-500',
    elite: 'text-purple-500',
  }

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <Sidebar
        user={user}
        conversations={conversations}
        activeConvId={activeConv?.id}
        onNewChat={handleNewChat}
        onSelectConv={handleSelectConv}
        onDeleteConv={handleDeleteConv}
        onRenameConv={handleRenameConv}
        onLogout={onLogout}
        theme={theme}
        onToggleTheme={onToggleTheme}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-zinc-900 dark:text-white text-sm">
                {activeConv ? activeConv.title : 'Ami'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium hidden sm:block ${planBadgeColors[user.plan]}`}>
              {plan?.name}
            </span>
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all lg:hidden"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          {convLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <WelcomeScreen user={user} />
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
              {messages.map(msg => (
                <Message key={msg.id} message={msg} user={user} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="max-w-3xl w-full mx-auto">
          <ChatInput
            onSend={handleSendMessage}
            isLoading={isLoading}
            hasMessages={messages.length > 0}
          />
        </div>
      </div>
    </div>
  )
}

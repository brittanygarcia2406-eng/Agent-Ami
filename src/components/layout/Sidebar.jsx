import React, { useState } from 'react'
import {
  Plus, MessageSquare, Trash2, Shield, X, ChevronRight,
  LogOut, Sun, Moon, MoreHorizontal, Edit2, Check
} from 'lucide-react'
import { format, isToday, isYesterday, parseISO } from 'date-fns'
import { PLANS } from '../../lib/data.js'

function groupConversations(conversations) {
  const groups = { today: [], yesterday: [], older: [] }
  conversations.forEach(conv => {
    const date = parseISO(conv.updated_at || conv.created_at)
    if (isToday(date)) groups.today.push(conv)
    else if (isYesterday(date)) groups.yesterday.push(conv)
    else groups.older.push(conv)
  })
  return groups
}

export default function Sidebar({
  user, conversations, activeConvId, onNewChat, onSelectConv, onDeleteConv,
  onRenameConv, onLogout, theme, onToggleTheme, isOpen, onClose
}) {
  const [hoveredId, setHoveredId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const plan = PLANS[user?.plan]
  const planColors = { basic: 'text-slate-400', intermediate: 'text-sky-400', premium: 'text-brand-400', elite: 'text-purple-400' }
  const planColor = planColors[user?.plan] || 'text-zinc-400'
  const groups = groupConversations(conversations)

  function startEdit(conv, e) {
    e.stopPropagation()
    setEditingId(conv.id)
    setEditTitle(conv.title)
  }

  function commitEdit(conv) {
    if (editTitle.trim() && editTitle !== conv.title) {
      onRenameConv(conv.id, editTitle.trim())
    }
    setEditingId(null)
  }

  const ConvGroup = ({ label, items }) => {
    if (!items.length) return null
    return (
      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-600 px-2 mb-1">{label}</p>
        {items.map(conv => (
          <div
            key={conv.id}
            onClick={() => onSelectConv(conv)}
            onMouseEnter={() => setHoveredId(conv.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`group relative flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-150 mb-0.5
              ${conv.id === activeConvId
                ? 'bg-brand-500/10 dark:bg-brand-400/10 text-brand-700 dark:text-brand-300'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
          >
            <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-60" />
            {editingId === conv.id ? (
              <input
                autoFocus
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                onBlur={() => commitEdit(conv)}
                onKeyDown={e => { if (e.key === 'Enter') commitEdit(conv); if (e.key === 'Escape') setEditingId(null) }}
                onClick={e => e.stopPropagation()}
                className="flex-1 bg-transparent text-xs outline-none border-b border-brand-400 pb-0.5"
              />
            ) : (
              <span className="flex-1 text-xs truncate">{conv.title}</span>
            )}
            {(hoveredId === conv.id || conv.id === activeConvId) && editingId !== conv.id && (
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={e => startEdit(conv, e)}
                  className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onDeleteConv(conv.id) }}
                  className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
      {/* Header */}
      <div className="p-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-zinc-900 dark:text-white text-sm">Ami</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {onClose && (
              <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all lg:hidden">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium rounded-xl px-3 py-2 transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-brand-500/25"
        >
          <Plus className="w-4 h-4" />
          Nuevo chat
        </button>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <div className="text-center py-8 px-4">
            <MessageSquare className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-2" />
            <p className="text-xs text-zinc-400 dark:text-zinc-600">Inicia una conversación con Ami</p>
          </div>
        ) : (
          <>
            <ConvGroup label="Hoy" items={groups.today} />
            <ConvGroup label="Ayer" items={groups.yesterday} />
            <ConvGroup label="Anteriores" items={groups.older} />
          </>
        )}
      </div>

      {/* User info */}
      <div className="p-3 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-medium shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-900 dark:text-white truncate">{user?.name || 'Usuario'}</p>
            <p className={`text-[10px] font-medium ${planColor}`}>
              {plan?.name || 'Plan'} {user?.isDemo && '· Demo'}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            title="Cerrar sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 shrink-0 h-full">
        {sidebarContent}
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <div className="relative w-72 h-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}

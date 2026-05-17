import React, { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'

const QUICK_SUGGESTIONS = [
  '¿Cuál es mi cobertura de emergencias?',
  'Tengo dolor de cabeza fuerte',
  '¿Qué hospitales tengo disponibles?',
  '¿Cómo funciona la ambulancia?',
  'Información sobre maternidad',
  '¿Cuánto es mi copago?',
]

export default function ChatInput({ onSend, isLoading, hasMessages }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px'
    }
  }, [value])

  function handleSend() {
    if (!value.trim() || isLoading) return
    onSend(value.trim())
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3">
      {/* Quick suggestions (only when no messages) */}
      {!hasMessages && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {QUICK_SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => onSend(s)}
              className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-600 dark:hover:text-brand-400 border border-zinc-200 dark:border-zinc-700 hover:border-brand-200 dark:hover:border-brand-700/50 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu pregunta o describe tus síntomas..."
            rows={1}
            disabled={isLoading}
            className="w-full resize-none bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all disabled:opacity-60 pr-10"
            style={{ minHeight: '42px', maxHeight: '160px' }}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          className="w-10 h-10 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-brand-500/25 shrink-0"
        >
          {isLoading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Send className="w-4 h-4" />
          }
        </button>
      </div>
      <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-1.5 text-center">
        Ami solo proporciona información orientativa. Ante emergencias, llama al 911.
      </p>
    </div>
  )
}

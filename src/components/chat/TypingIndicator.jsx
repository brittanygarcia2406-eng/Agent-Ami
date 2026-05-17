import React from 'react'
import { Shield } from 'lucide-react'

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 items-start animate-fade-in">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
        <Shield className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700/50 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  )
}

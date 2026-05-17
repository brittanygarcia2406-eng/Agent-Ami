import React from 'react'
import { Shield, User, AlertTriangle } from 'lucide-react'

// Simple markdown renderer for common patterns
function renderContent(text) {
  if (!text) return null
  const lines = text.split('\n')
  const elements = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Empty line
    if (!line.trim()) { elements.push(<br key={i} />); i++; continue }

    // Heading with **text**
    if (line.startsWith('# ')) {
      elements.push(
        <h2 key={i} className="text-base font-semibold text-zinc-900 dark:text-white mb-1">
          {renderInline(line.slice(2))}
        </h2>
      )
      i++; continue
    }

    // Horizontal rule
    if (line.trim() === '---') {
      elements.push(<hr key={i} className="border-zinc-200 dark:border-zinc-700 my-2" />)
      i++; continue
    }

    // Numbered list
    if (/^\d+\./.test(line)) {
      const listItems = []
      while (i < lines.length && /^\d+\./.test(lines[i])) {
        // Collect sub-lines (indented)
        let itemContent = lines[i].replace(/^\d+\.\s*/, '')
        i++
        while (i < lines.length && lines[i].startsWith('   ')) {
          itemContent += '\n' + lines[i].slice(3)
          i++
        }
        listItems.push(itemContent)
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-2 my-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 text-xs flex items-center justify-center font-semibold mt-0.5">
                {idx + 1}
              </span>
              <span className="flex-1 text-sm leading-relaxed">
                {item.split('\n').map((l, li) => (
                  <span key={li} className={li > 0 ? 'block text-zinc-500 dark:text-zinc-400 text-xs mt-0.5' : ''}>
                    {renderInline(l)}
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ol>
      )
      continue
    }

    // Bullet list
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const listItems = []
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        listItems.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-1 my-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <span className="text-brand-400 mt-1.5 text-[8px]">●</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      )
      continue
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="text-sm leading-relaxed">
        {renderInline(line)}
      </p>
    )
    i++
  }

  return elements
}

function renderInline(text) {
  if (!text) return null
  // **bold**
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-zinc-900 dark:text-zinc-100">{part.slice(2, -2)}</strong>
    }
    // *italic*
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    return part
  })
}

export default function Message({ message, user }) {
  const isAssistant = message.role === 'assistant'

  return (
    <div className={`flex gap-3 group animate-fade-in ${isAssistant ? 'items-start' : 'items-start flex-row-reverse'}`}>
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5
        ${isAssistant
          ? 'bg-gradient-to-br from-brand-400 to-brand-600 shadow-sm'
          : 'bg-zinc-200 dark:bg-zinc-700'
        }`}
      >
        {isAssistant
          ? <Shield className="w-3.5 h-3.5 text-white" />
          : <User className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
        }
      </div>

      {/* Bubble */}
      <div className={`max-w-[82%] lg:max-w-[75%] ${isAssistant ? '' : 'items-end'}`}>
        <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed
          ${isAssistant
            ? 'bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700/50 text-zinc-800 dark:text-zinc-200 rounded-tl-sm shadow-sm'
            : 'bg-brand-500 text-white rounded-tr-sm'
          }
          ${message.isError ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30' : ''}
          `}
        >
          {message.isError && (
            <div className="flex items-center gap-1.5 text-red-500 mb-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Error</span>
            </div>
          )}
          {isAssistant
            ? <div className="space-y-1">{renderContent(message.content)}</div>
            : <p>{message.content}</p>
          }
        </div>
        <p className={`text-[10px] mt-1 text-zinc-400 dark:text-zinc-600 ${!isAssistant ? 'text-right' : ''}`}>
          {new Date(message.created_at).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}

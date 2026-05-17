import React, { useState, useEffect } from 'react'
import LoginPage from './pages/LoginPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import { getSession, clearSession } from './services/auth.js'
import { useTheme } from './hooks/useTheme.js'

export default function App() {
  const [user, setUser] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const { theme, toggleTheme } = useTheme()

  // Restore session on mount
  useEffect(() => {
    const session = getSession()
    if (session) setUser(session)
    setAuthChecked(true)
  }, [])

  function handleLogin(sessionUser) {
    setUser(sessionUser)
  }

  function handleLogout() {
    clearSession()
    setUser(null)
  }

  // Show nothing while checking auth (avoids flash)
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <ChatPage
      user={user}
      onLogout={handleLogout}
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  )
}

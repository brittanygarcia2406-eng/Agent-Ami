import React, { useState } from 'react'
import { Shield, Eye, EyeOff, Zap, AlertCircle, ChevronRight } from 'lucide-react'
import { loginWithCredentials, createDemoSession } from '../services/auth.js'
import { USERS } from '../lib/data.js'

export default function LoginPage({ onLogin }) {
  const [affiliateNumber, setAffiliateNumber] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    if (!affiliateNumber.trim() || !password.trim()) {
      setError('Por favor, completa todos los campos.')
      return
    }
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 600))
    const result = loginWithCredentials(affiliateNumber, password)
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      onLogin(result.user)
    }
  }

  async function handleDemo() {
    setDemoLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const result = createDemoSession()
    setDemoLoading(false)
    onLogin(result.user)
  }

  // Quick fill with a demo user
  function fillDemoCredentials() {
    const sampleUser = USERS[0]
    setAffiliateNumber(sampleUser.affiliateNumber)
    setPassword(sampleUser.password)
    setError('')
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="w-full max-w-sm relative z-10 animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-lg shadow-brand-500/25 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Ami</h1>
          <p className="text-zinc-400 text-sm mt-1">Tu asistente inteligente de seguros</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-lg font-medium text-white mb-5">Iniciar sesión</h2>

          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 mb-4 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                N° de Afiliado
              </label>
              <input
                type="text"
                value={affiliateNumber}
                onChange={e => { setAffiliateNumber(e.target.value); setError('') }}
                placeholder="AF-001234"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  placeholder="••••••••"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 pr-10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl py-2.5 text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 mt-1"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  Ingresar <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-600 text-xs">o</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* Demo button */}
          <button
            onClick={handleDemo}
            disabled={demoLoading}
            className="w-full bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 hover:border-zinc-600 disabled:opacity-50 text-white font-medium rounded-xl py-2.5 text-sm transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            {demoLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generando sesión demo...
              </span>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-400 group-hover:text-amber-300 transition-colors" />
                Ingreso rápido — Modo Demo
              </>
            )}
          </button>

          {/* Quick fill hint */}
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="w-full text-center text-xs text-zinc-600 hover:text-zinc-400 mt-3 transition-colors py-1"
          >
            Usar credenciales de prueba: AF-001234
          </button>
        </div>

        <p className="text-center text-zinc-600 text-xs mt-4">
          © 2025 Ami Seguros · Ecuador
        </p>
      </div>
    </div>
  )
}

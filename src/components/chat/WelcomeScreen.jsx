import React from 'react'
import { Shield, Hospital, Ambulance, Baby, Heart, FlaskConical } from 'lucide-react'
import { PLANS } from '../../lib/data.js'

const FEATURE_CARDS = [
  { icon: Heart, label: 'Síntomas y especialidades', color: 'text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/20' },
  { icon: Hospital, label: 'Hospitales disponibles', color: 'text-brand-400', bg: 'bg-brand-50 dark:bg-brand-900/20' },
  { icon: Ambulance, label: 'Ambulancia y emergencias', color: 'text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { icon: Baby, label: 'Maternidad y recién nacido', color: 'text-pink-400', bg: 'bg-pink-50 dark:bg-pink-900/20' },
  { icon: FlaskConical, label: 'Exámenes y cirugías', color: 'text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20' },
  { icon: Shield, label: 'Cobertura de tu plan', color: 'text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
]

export default function WelcomeScreen({ user }) {
  const plan = PLANS[user?.plan]
  const planBadgeColors = {
    basic: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
    intermediate: 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400',
    premium: 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400',
    elite: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/25 mb-4">
        <Shield className="w-7 h-7 text-white" />
      </div>

      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-1">
        Hola, {user?.name?.split(' ')[0] || 'bienvenido'} 👋
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-2 text-center">
        Soy <strong className="text-zinc-700 dark:text-zinc-300">Ami</strong>, tu asistente de seguros médicos
      </p>

      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-6 ${planBadgeColors[user?.plan]}`}>
        <Shield className="w-3 h-3" />
        {plan?.name || 'Plan activo'}
        {user?.city && <span className="opacity-60">· {user.city}</span>}
      </div>

      <p className="text-zinc-500 dark:text-zinc-400 text-sm text-center mb-5 max-w-sm">
        Puedo ayudarte a entender tu cobertura, encontrar hospitales y calcular tu copago antes de atenderte.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full max-w-lg">
        {FEATURE_CARDS.map(({ icon: Icon, label, color, bg }) => (
          <div key={label} className={`flex items-center gap-2 p-3 rounded-xl ${bg} border border-transparent`}>
            <Icon className={`w-4 h-4 ${color} shrink-0`} />
            <span className="text-xs text-zinc-600 dark:text-zinc-400 leading-tight">{label}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-6 text-center">
        Escribe tus síntomas o haz una pregunta sobre tu seguro
      </p>
    </div>
  )
}

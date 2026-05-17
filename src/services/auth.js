import { USERS, PLANS } from '../lib/data.js'

const SESSION_KEY = 'ami-session'
const DEMO_PREFIX = 'DEMO-'

// ─── Local auth (no Supabase needed for MVP) ─────────────────────────────────

export function loginWithCredentials(affiliateNumber, password) {
  const user = USERS.find(
    u => u.affiliateNumber === affiliateNumber.trim() && u.password === password
  )
  if (!user) return { error: 'Número de afiliado o contraseña incorrectos.' }
  const session = { ...user, isDemo: false, loginAt: Date.now() }
  saveSession(session)
  return { user: session }
}

export function createDemoSession() {
  const existingDemoUserRaw = localStorage.getItem('ami-demo-user')
  if (existingDemoUserRaw) {
    try {
      const demoUser = JSON.parse(existingDemoUserRaw)
      demoUser.loginAt = Date.now()
      saveSession(demoUser)
      return { user: demoUser }
    } catch {}
  }

  const demoId = `${DEMO_PREFIX}${crypto.randomUUID().slice(0, 8).toUpperCase()}`
  const demoAffiliateNumber = `AF-DEMO-${Math.floor(Math.random() * 9000 + 1000)}`

  // Random plan assignment for variety
  const plans = ['basic', 'intermediate', 'premium', 'elite']
  const randomPlan = plans[Math.floor(Math.random() * plans.length)]
  const cities = ['Guayaquil', 'Quito', 'Cuenca', 'Manta', 'Ambato']
  const randomCity = cities[Math.floor(Math.random() * cities.length)]

  const demoUser = {
    id: demoId,
    affiliateNumber: demoAffiliateNumber,
    name: 'Usuario Demo',
    email: `demo_${demoId.toLowerCase()}@ami-seguro.ec`,
    plan: randomPlan,
    city: randomCity,
    age: 30,
    phone: '0990000000',
    isDemo: true,
    loginAt: Date.now(),
  }

  localStorage.setItem('ami-demo-user', JSON.stringify(demoUser))
  saveSession(demoUser)
  return { user: demoUser }
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw)
    // Session expires after 7 days
    const sevenDays = 7 * 24 * 60 * 60 * 1000
    if (Date.now() - session.loginAt > sevenDays) {
      clearSession()
      return null
    }
    return session
  } catch {
    return null
  }
}

export function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function getUserPlanDetails(user) {
  return PLANS[user.plan] || null
}

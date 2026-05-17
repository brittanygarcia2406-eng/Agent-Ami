# Ami — Estimador Agéntico de Copago y Cobertura

> Agente conversacional inteligente que ayuda a pacientes asegurados a entender su cobertura, copagos y hospitales disponibles antes de atenderse médicamente.

## 🚀 Demo rápido (sin configuración)

```bash
npm install
npm run dev
```

Luego haz clic en **"Ingreso rápido — Modo Demo"** en la pantalla de login.

---

## 📋 Características

- 🤖 **Agente IA (Groq / Llama 3.3-70B)** — respuestas rápidas y naturales
- 🏥 **13 hospitales reales de Ecuador** — red simulada con especialidades y copagos
- 👥 **20 usuarios asegurados** — 4 planes: Básico, Intermedio, Premium, Elite
- 💬 **Historial de conversaciones** — persistido en localStorage / Supabase
- 🌙 **Modo oscuro/claro** — conmutable desde la interfaz
- 🌐 **Bilingüe** — español e inglés
- ⚡ **Modo Demo** — acceso inmediato para evaluadores

---

## 🛠️ Setup

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

Copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita `.env`:

```env
# Supabase (opcional — funciona sin él con localStorage)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Groq API (gratis en console.groq.com)
VITE_GROQ_API_KEY=gsk_...
VITE_GROQ_MODEL=llama-3.3-70b-versatile
```

### 3. Supabase (opcional)

Si quieres persistencia real en la nube:

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor** y ejecuta el contenido de `supabase-schema.sql`
3. Copia tu URL y anon key al `.env`

### 4. Groq API (recomendado, gratis)

1. Regístrate en [console.groq.com](https://console.groq.com)
2. Crea una API key
3. Agrégala al `.env` como `VITE_GROQ_API_KEY`

> **Sin API key:** El sistema funciona con respuestas inteligentes basadas en reglas (fallback). Perfecto para demo.

### 5. Ejecutar

```bash
npm run dev
```

### 6. Deploy en Vercel (enlace público)

```bash
npm install -g vercel
vercel
```

O conecta el repositorio en [vercel.com](https://vercel.com) y configura las variables de entorno.

---

## 🔐 Credenciales de prueba

| N° Afiliado | Contraseña | Plan | Ciudad |
|-------------|-----------|------|--------|
| AF-001234 | Pass2024! | Premium | Guayaquil |
| AF-002345 | Pass2024! | Elite | Quito |
| AF-003456 | Pass2024! | Básico | Cuenca |
| AF-004567 | Pass2024! | Intermedio | Ambato |
| AF-005678 | Pass2024! | Premium | Manta |

O usa **"Ingreso rápido — Modo Demo"** para acceso inmediato.

---

## 🏗️ Arquitectura

```
src/
├── components/
│   ├── chat/
│   │   ├── Message.jsx          # Renderizado de mensajes con markdown
│   │   ├── ChatInput.jsx        # Input con sugerencias rápidas
│   │   ├── TypingIndicator.jsx  # Animación de escritura
│   │   └── WelcomeScreen.jsx    # Pantalla inicial del chat
│   ├── layout/
│   │   └── Sidebar.jsx          # Sidebar con historial de conversaciones
│   └── ui/                      # Componentes reutilizables
├── hooks/
│   ├── useChat.js               # Lógica del chat y llamadas IA
│   └── useTheme.js              # Gestión del tema oscuro/claro
├── lib/
│   ├── data.js                  # Base de datos simulada (hospitales, planes, usuarios)
│   └── supabase.js              # Cliente y helpers de Supabase
├── pages/
│   ├── LoginPage.jsx            # Pantalla de login + modo demo
│   └── ChatPage.jsx             # Página principal del chat
├── services/
│   ├── ai.js                    # Integración Groq + system prompt del agente
│   ├── auth.js                  # Autenticación local + sesiones
│   └── conversations.js         # CRUD conversaciones (híbrido local/Supabase)
└── App.jsx                      # Router principal + gestión de auth
```

---

## 🤖 Stack tecnológico

| Componente | Tecnología | Plan gratuito |
|------------|-----------|---------------|
| Frontend | React + Vite + Tailwind CSS | ✅ Open source |
| IA | Groq (Llama 3.3-70B) | ✅ 100K tokens/día gratis |
| Base de datos | Supabase | ✅ 500MB, 50K filas |
| Deploy | Vercel | ✅ Ilimitado para proyectos personales |

---

## 📊 Base de datos simulada

- **20 usuarios** asegurados con planes variados
- **13 hospitales** reales de Ecuador (Kennedy, Metropolitano, Monte Sinaí, etc.)
- **4 planes** con cobertura detallada:
  - Plan Básico ($45/mes) — red limitada, copago mayor
  - Plan Intermedio ($89/mes) — red ampliada, maternidad básica
  - Plan Premium ($165/mes) — sin deducible, ambulancia aérea, trasplantes
  - Plan Elite ($320/mes) — cobertura total sin límites

---

## 🛡️ Seguridad

- Autenticación por número de afiliado + contraseña
- Sesiones persistidas en localStorage con expiración de 7 días
- Row Level Security habilitado en Supabase
- Variables de entorno para todas las credenciales
- Historial de conversaciones aislado por usuario

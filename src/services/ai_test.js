import {
  HOSPITALS,
  PLANS,
  SYMPTOM_TO_SPECIALTY,
  getHospitalsByPlanAndCity,
  detectSpecialtyFromMessage,
  filterBySpecialty,
} from '../lib/data.js'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = process.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile'
const GROQ_API_KEY = process.env.VITE_GROQ_API_KEY

// ─── Build system prompt ───────────────────────────────────────────────────────

function buildSystemPrompt(user) {
  const plan = PLANS[user.plan]
  const availableHospitals = getHospitalsByPlanAndCity(user.plan, user.city)

  const hospitalList = availableHospitals
    .map(h =>
      `- ${h.name} | Ciudad: ${h.city} (${h.sector}) | Tipo: ${h.type} | Copago: $${h.copay}.00 | Especialidades: ${h.specialties.join(', ')} | Calificación: ${h.rating}⭐`
    )
    .join('\n')

  const coverage = plan.coverage
  const amb = coverage.ambulance
  const mat = coverage.maternity
  const trn = coverage.transplants

  return `Eres **Ami**, el asistente inteligente de seguros médicos. Eres amigable, profesional, empático y hablas en español o inglés según el idioma del usuario.

## IDENTIDAD Y COMPRENSIÓN
- Nombre: Ami
- Rol: Asistente de seguros médicos, coberturas, hospitales, medicamentos, exámenes y salud general.
- Tienes una comprensión natural, flexible e inteligente del lenguaje humano. NO actúes como un bot rígido.
- IMPORTANTE: NO dependas de palabras exactas. Interpreta el contexto general, similitudes semánticas y la intención real del usuario ("medicinas"="medicamentos", "rayos x"="radiografía", "análisis"="exámenes", "malestar"="síntoma").
- Comprende y acepta con normalidad: palabras mal escritas, errores ortográficos, ausencia de tildes, escritura informal, abreviaciones comunes y errores humanos normales (ej. "toy embarasada", "k hospital me recomiendas", "mi ijo", "serca", "me duele la cabesa").
- NUNCA rechaces consultas que tengan relación parcial o total con: atención médica, seguros, hospitales, síntomas, beneficios, coberturas, especialidades, clínicas, medicamentos, exámenes, dependientes, radiografías, ubicaciones, etc.
- RECHAZO ÚNICAMENTE: Si la pregunta es TOTALMENTE ajena al sistema (ej. matemáticas, tareas, chistes, historia, política, deportes, programación). SÓLO en esos casos responde amablemente: "Lo sentimos, solo puedo ayudarte con información relacionada a coberturas médicas, hospitales, beneficios y servicios de tu aseguradora."

## DATOS DEL ASEGURADO
- **Nombre:** ${user.name}
- **N° de afiliado:** ${user.affiliateNumber}
- **Plan:** ${plan.name}
- **Ciudad:** ${user.city}
- **Límite anual:** $${plan.annualLimit.toLocaleString()}
- **Deducible:** $${plan.deductible}
- **Prima mensual:** $${plan.monthlyPremium}

## COBERTURA DEL PLAN ${plan.name.toUpperCase()}
- Consultas: Copago $${coverage.consultations.copay} | ${coverage.consultations.limit}
- Emergencias: Copago $${coverage.emergencies.copay} | Límite: ${coverage.emergencies.limit}
- Hospitalización: Copago $${coverage.hospitalization.copay}/día | ${coverage.hospitalization.dailyLimit} | ${coverage.hospitalization.annualDays} días/año
- Cirugías: ${coverage.surgery.limit}
- Exámenes de laboratorio: Copago $${coverage.labTests.copay} | Límite anual: ${coverage.labTests.annualLimit}
- Imágenes (RX, TAC, RMN): Copago $${coverage.imaging.copay} | Límite: ${coverage.imaging.annualLimit}
- Medicamentos: ${coverage.medications.covered ? `Copago ${coverage.medications.copay} | Límite: ${coverage.medications.annualLimit}` : coverage.medications.note}

## AMBULANCIA
- Cubierta: ${amb.covered ? 'Sí' : 'No'}
${amb.covered ? `- Tipo: ${amb.type.join(', ')}
- Copago: ${amb.copay === 0 ? 'Sin copago' : `$${amb.copay}`}
- Límite: ${amb.limit}
- Condiciones: ${amb.conditions}
- Ciudades disponibles: ${Array.isArray(amb.cities) ? amb.cities.join(', ') : amb.cities}` : `- ${amb.note || 'No aplicable'}`}

## MATERNIDAD
- Cubierta: ${mat.covered ? 'Sí' : 'No'}
${mat.covered ? `- Copago parto: $${mat.copay}
- Límite: ${mat.limit}
- Recién nacido cubierto: ${mat.newbornDays} días
- Complicaciones: ${mat.complications}
${mat.prenatalChecks ? `- Controles prenatales: ${mat.prenatalChecks}` : ''}` : `- ${mat.note}`}

## TRASPLANTES
- Cubierto: ${trn.covered ? 'Sí' : 'No'}
${trn.covered ? `- Monto máximo: $${trn.maxAmount?.toLocaleString()}
- Condiciones: ${trn.conditions}
- Período de espera: ${trn.waitingPeriod}
${trn.includes ? `- Incluye: ${trn.includes}` : ''}` : `- ${trn.note}`}

## HOSPITALES DISPONIBLES PARA ${user.name.toUpperCase()} (ordenados por copago)
${hospitalList}

## INSTRUCCIONES ESTRICTAS DE COMPORTAMIENTO

1. **Saludos y Presentación:**
   - Si el usuario saluda o pregunta quién eres (ej. "hola", "buenas", "quién eres", "qué haces", "ayúdame", "hola ami"): DEBES responder EXACTAMENTE con este formato:
     "¡Hola, ${user.name.split(' ')[0]}! 👋 Soy Ami, tu asistente de seguros médicos.

     ¿En qué puedo ayudarte hoy? Puedo informarte sobre:
     ● 🏥 Hospitales disponibles y copagos
     ● 💊 Cobertura de tu ${plan.name}
     ● 🚑 Ambulancia y emergencias
     ● 🤰 Maternidad y recién nacido
     ● 💉 Exámenes y especialidades

     ¡Cuéntame tus síntomas o en qué te puedo ayudar!"

2. **Funciones Rápidas y Contexto Estricto:**
   - "¿Cuál es mi cobertura de emergencia?": RESPONDE SOLO sobre emergencias, hospitales afiliados, límites, copagos de emergencia y ambulancia. NO menciones odontología ni síntomas sin relación.
   - "¿Cuánto es mi copago?" o preguntas de precio/costo: NUNCA rechaces. Explica que el copago depende de factores (plan, hospital, especialidad) y DA EJEMPLOS con su plan actual (Medicina General, Especialistas, Emergencias, Exámenes).
   - "¿Qué hospitales tengo disponibles?": Lista los hospitales afiliados en su ciudad, destaca la red preferencial y su ventaja de menor copago.
   - "Información sobre maternidad": Da detalle completo de la cobertura, copagos de parto/cesárea, recién nacido, complicaciones y límites.

3. **Prioridad de Ubicación y Hospitales:**
   - Si el usuario NO especifica ciudad: Utiliza su ciudad registrada (${user.city}) como PRIORIDAD #1, recomendando hospitales de allí primero.
   - Si el usuario SÍ especifica ciudad (ej. "en Guayaquil", "en Cuenca"): IGNORA temporalmente su ciudad registrada y prioriza EXCLUSIVAMENTE hospitales de la ciudad solicitada.
   - Si preguntan por una especialidad en una ciudad y no hay hospitales con esa especialidad allí, responde EXACTAMENTE así: "Actualmente no contamos con especialistas en [Especialidad] afiliados dentro de la ciudad de [Ciudad] 😊. Sin embargo, estas son las opciones más recomendadas disponibles:" y luego muestra hospitales de otras ciudades.
   - Siempre mantén este formato para listar hospitales:
     1. **Nombre del Hospital** — Tipo de red
        📍 Ciudad, Sector
        💰 Copago: $X.00
        ⭐ Calificación: X.X
   - Añade " ✅ *(Opción más económica y cercana)*" al hospital que corresponda.

4. **Diferencia entre Síntomas y Especialidad Directa:**
   - **Caso A (Síntomas):** Si el usuario DESCRIBE un síntoma (ej. "tengo dolor fuerte de cabeza", "me duele el oído"):
     Empieza tu respuesta con: "Basado en lo que me describes, te recomiendo atenderte en [Especialidad]." y luego muestra los hospitales.
   - **Caso B (Especialidad Directa):** Si el usuario PIDE DIRECTAMENTE un especialista (ej. "quiero un ginecólogo en Guayaquil", "necesito un dermatólogo"):
     NUNCA uses la frase "Basado en lo que me describes...". Debes responder directamente:
     "En [Ciudad] hay varios hospitales y clínicas que ofrecen atención de [Especialidad] 😊. Con tu ${plan.name}, estas son tus mejores opciones:" y luego muestra los hospitales.

5. **Continuidad y Contexto Conversacional (Memoria):**
   - Mantén la memoria de la conversación (especialidad actual, hospital mencionado, ciudad, plan).
   - Si el usuario responde afirmativamente a una de tus preguntas de cierre (ej. "sí", "si quiero", "claro", "adelante", "sí por favor"):
     ASUME EL CONTEXTO INMEDIATAMENTE. Continúa la conversación brindando información sobre la especialidad, hospital, copago o cobertura de la que hablaban. NO pidas disculpas ni digas "solo puedo ayudarte con información...".
   - Entiende referencias indirectas como "esa especialidad", "ese hospital", "la otra clínica", "ahí".

6. **Explicación de Conceptos:** Si el usuario pregunta qué es "copago", "deducible", "cobertura", "red preferencial", explícalo de manera clara y sencilla.

7. **Hospitales No Afiliados o Mal Escritos:** Si el usuario menciona un hospital con errores ortográficos, pregúntale "¿Te refieres a la Clínica X?". Si menciona un hospital que NO existe en la red, responde: "El Hospital X no aparece dentro de nuestra red de afiliados. Puedo recomendarte otros hospitales cercanos a tu ubicación."

8. **Maternidad y Dependientes:** Si dicen "estoy embarazada", "cubre parto", "¿mi hijo puede atenderse?", revisa los beneficios de maternidad o dependientes en su plan y explícalos detalladamente sin rechazar la consulta.

9. **Medicamentos y Farmacias:** Si preguntan por medicinas, recetas, descuentos o precios, NO des un resumen general. Responde ESPECÍFICAMENTE sobre su cobertura de medicamentos.

10. **Exámenes y Radiografías:** Si mencionan exámenes, análisis, tomografías, rayos X, etc., interpreta que necesitan laboratorio/imágenes y menciona el copago correspondiente de su plan.

11. **Comparación de Hospitales:** Si el usuario pide comparar, utiliza los datos disponibles (red preferencial vs conveniada, copago, calificación, cercanía) para explicar lógicamente.

12. **Comprensión Flexible y Natural:**
    - Actúa como humano. Acepta errores ortográficos, "slang" o faltas de tildes (ej. "tngo dolor estomacal", "toy mareado", "m duele el oido", "me duele la cabesa") con naturalidad. NO rechaces consultas que tengan relación parcial con salud o seguros.

13. **Mapeo Semántico Obligatorio (EJEMPLOS CRÍTICOS):**
    - "Me duele la muela", "sacarme la muela", "dientes", "palpitaciones en los dientes" -> DEBE detectar **Odontología** (NO Medicina General).
    - "Se me pelan las manos con detergente", "alergia al polvo", "ronchas" -> DEBE detectar **Alergología / Dermatología**.
    - "Malestar estomacal", "parásitos", "diarrea" -> DEBE detectar **Gastroenterología**.
    - "Presión en el oído", "me duele el oído" -> DEBE detectar **Otorrinolaringología**.`
}

// ─── Main AI call ─────────────────────────────────────────────────────────────

export async function sendMessageToAI(userMessage, conversationHistory, user) {
  if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key') {
    return generateFallbackResponse(userMessage, user, conversationHistory);
  }

  const systemPrompt = buildSystemPrompt(user);

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.slice(-20),
    { role: 'user', content: userMessage },
  ];

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.9,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Groq API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'Error procesando respuesta de la IA.';
}

// ─── Fallback response (no API key) ──────────────────────────────────────────

const ECUADOR_CITIES = ['Guayaquil', 'Quito', 'Cuenca', 'Ambato', 'Manta', 'Portoviejo', 'Loja', 'Esmeraldas', 'Santo Domingo', 'Machala', 'Riobamba'];

function detectCityFromMessage(message) {
  const lower = message.toLowerCase();
  for (const city of ECUADOR_CITIES) {
    if (lower.includes(city.toLowerCase())) {
      return city;
    }
  }
  return null;
}

function generateFallbackResponse(message, user, conversationHistory = []) {
  const plan = PLANS[user.plan]
  const rawLower = message.toLowerCase().trim()

  // 1. Contextual continuity
  let lower = rawLower;
  const isAffirmative = /^(sí|si|claro|ok|adelante|si por favor|sí por favor|si quiero|sí quiero|por favor)$/i.test(rawLower);
  const hasReference = /esa especialidad|ese hospital|la otra clínica|esa cobertura|ahí|ahi|hay|esa opción|esa opcion|la más económica/i.test(rawLower);

  let lastSpecialty = null;
  if (conversationHistory && conversationHistory.length > 0) {
     const recentHistory = conversationHistory.slice(-4).map(m => m.content).join(' ');
     const detectContext = detectSpecialtyFromMessage(recentHistory);
     if (detectContext) {
        lastSpecialty = detectContext.specialty;
     }
  }

  if (isAffirmative && lastSpecialty) {
     return `¡Claro que sí! 😊\n\nAquí tienes la información adicional de cobertura para **${lastSpecialty.charAt(0).toUpperCase() + lastSpecialty.slice(1)}** con tu **${plan.name}**:\n\n- **Límite anual del plan:** $${plan.annualLimit.toLocaleString()}\n- **Copago en Consultas de Especialidad:** $${plan.coverage.consultations.copay + 8} (Aprox.)\n- **Copago en Exámenes y Laboratorio:** $${plan.coverage.labTests.copay}\n- **Hospitalización:** $${plan.coverage.hospitalization.copay}/día\n\nRecuerda que si asistes a un hospital de **Red Preferencial**, tu copago será el mínimo posible. ¿Hay algo más en lo que pueda ayudarte?`
  }

  if (hasReference && lastSpecialty && !detectSpecialtyFromMessage(lower)) {
     lower = lower + ' ' + lastSpecialty; // Inject context for symptom detection
  }

  // Greeting
  if (/^(hola|hi|hello|buenos|buenas|saludos|hey|quién eres|quien eres|qué haces|que haces|ayúdame|ayudame)$/i.test(rawLower) || rawLower === 'hola ami') {
    return `¡Hola, ${user.name.split(' ')[0]}! 👋 Soy **Ami**, tu asistente de seguros médicos.\n\n¿En qué puedo ayudarte hoy? Puedo informarte sobre:\n● 🏥 Hospitales disponibles y copagos\n● 💊 Cobertura de tu ${plan.name}\n● 🚑 Ambulancia y emergencias\n● 🤰 Maternidad y recién nacido\n● 💉 Exámenes y especialidades\n\n¡Cuéntame tus síntomas o en qué te puedo ayudar!`
  }

  // Quick Action: Ambulancia
  if (/cómo funciona la ambulancia|como funciona la ambulancia/i.test(lower) || lower === 'ambulancia') {
    const amb = plan.coverage.ambulance;
    return amb.covered
      ? `🚑 **Cobertura de Ambulancia — ${plan.name}**\n\n- **Tipos de ambulancia:** ${amb.type.join(' y ')}\n- **Copago:** ${amb.copay === 0 ? 'Sin copago' : '$' + amb.copay}\n- **Límites:** ${amb.limit}\n- **Autorización y Condiciones:** ${amb.conditions}\n- **Ciudades disponibles:** ${Array.isArray(amb.cities) ? amb.cities.join(', ') : amb.cities}\n\nSi tienes una emergencia que pone en riesgo tu vida, contacta inmediatamente al 911.`
      : `Tu **${plan.name}** no incluye cobertura de ambulancia.`;
  }

  // Quick Action 1: Emergencia
  if (/cobertura de emergencia|emergencia nacional|emergencias nacionales|ambulancia/i.test(lower) || lower === '¿cuál es mi cobertura de emergencia?' || lower === 'cual es mi cobertura de emergencia') {
    const amb = plan.coverage.ambulance
    const emerg = plan.coverage.emergencies
    return `Con tu Plan ${plan.name.replace('Plan ', '')} tienes cobertura de emergencias nacionales en hospitales afiliados de la red preferencial 😊\n\nTu copago aproximado en emergencia es de:\n- **$${emerg.copay}** en hospitales preferenciales\n- **Límite de cobertura:** ${emerg.limit}\n\nTambién cuentas con cobertura de ambulancia ${amb.covered ? amb.type.join(' y ') : 'terrestre'} en casos autorizados (Copago: ${amb.copay === 0 ? 'Sin copago' : '$'+amb.copay}).\n\n*Recuerda: si tienes una emergencia real, dirígete a la clínica más cercana o llama al 911.*`
  }

  // Quick Action 2: Copago
  if (/cuánto es mi copago|cuanto es mi copago|cuánto tendría que pagar|cuanto tendria que pagar|qué debo pagar|que debo pagar|cuánto me cuesta|cuanto me cuesta/i.test(lower) || lower === '¿cuánto es mi copago?') {
    return `El valor de tu copago depende de:\n- tu tipo de plan\n- hospital o clínica seleccionada\n- especialidad médica\n- tipo de atención\n- exámenes o procedimientos realizados\n\nPor ejemplo, con tu **${plan.name}**:\n- **Medicina General:** $${plan.coverage.consultations.copay}\n- **Especialistas:** $${plan.coverage.consultations.copay + 8} (Aprox.)\n- **Emergencias:** $${plan.coverage.emergencies.copay}\n- **Laboratorio básico:** $${plan.coverage.labTests.copay}\n- **Radiografías:** $${plan.coverage.imaging.copay}\n\nSi deseas, puedo ayudarte a calcular el copago aproximado según la clínica o especialidad que necesites 😊`
  }

  // Quick Action 3: Hospitales
  if (/qué hospitales tengo disponibles|que hospitales tengo disponibles|hospitales afiliados|hospitales disponibles/i.test(lower) || lower === '¿qué hospitales tengo disponibles?') {
    const requestedCity = detectCityFromMessage(message)
    const targetCity = requestedCity || user.city
    const hospitals = getHospitalsByPlanAndCity(user.plan, targetCity)
    const topHospitals = hospitals.slice(0, 4).map(h => `- ${h.name} (${h.city})`).join('\n')
    return `Estos son algunos hospitales disponibles con tu plan en ${targetCity} 😊\n\n${topHospitals}\n\nLos hospitales de red preferencial tendrán menor copago. ¿Buscas alguna clínica o especialidad en particular?`
  }

  // Quick Action 4: Maternidad
  if (/información sobre maternidad|informacion sobre maternidad|cobertura de maternidad/i.test(lower) || lower === 'información sobre maternidad') {
    const mat = plan.coverage.maternity
    return mat.covered
      ? `🤰 **Cobertura de Maternidad — ${plan.name}**\n\nCon tu plan cuentas con excelente cobertura maternal en nuestras clínicas afiliadas:\n- **Copago por parto/cesárea:** $${mat.copay}\n- **Límites:** ${mat.limit}\n- **Recién nacido:** Cobertura incluida los primeros ${mat.newbornDays} días\n- **Complicaciones:** Cubiertas hasta ${mat.complications}\n${mat.prenatalChecks ? `- **Controles prenatales:** ${mat.prenatalChecks}\n` : ''}\n¿Deseas conocer qué clínicas tienen el mejor servicio de maternidad en ${user.city}?`
      : `Tu **${plan.name}** actualmente no incluye cobertura de maternidad. Te recomendamos consultar sobre un upgrade de plan para acceder a este beneficio.`
  }

  // Symptom detection
  const specialtyMatch = detectSpecialtyFromMessage(lower)
  if (specialtyMatch) {
    const requestedCity = detectCityFromMessage(rawLower)
    const targetCity = requestedCity || user.city
    const hospitals = getHospitalsByPlanAndCity(user.plan, targetCity)
    const filtered = filterBySpecialty(hospitals, specialtyMatch.specialty)
    
    const localHospitals = filtered.filter(h => h.city.toLowerCase() === targetCity.toLowerCase());
    const otherHospitals = filtered.filter(h => h.city.toLowerCase() !== targetCity.toLowerCase());
    
    const top = [];
    if (localHospitals.length > 0) {
      top.push(...localHospitals.slice(0, 3));
      if (top.length < 3) {
        top.push(...otherHospitals.slice(0, 3 - top.length));
      }
    } else {
      top.push(...otherHospitals.slice(0, 3));
    }

    const urgencyNote = specialtyMatch.urgency === 'crítica' || specialtyMatch.urgency === 'alta'
      ? '\n\n⚠️ **Nota importante:** Si esto es una emergencia, llama primero al **911**. Ami te ayuda con la información del seguro.\n'
      : ''

    const directSpecialtyRegex = /logía|ólogo|iatra|dentista|médico general|medicina general|internista|cirujano|cirugía|pediatría|psicólogo/i;
    const isDirectRequest = directSpecialtyRegex.test(rawLower) || hasReference;

    let header = '';

    if (localHospitals.length === 0 && requestedCity) {
      if (hasReference) {
        header = `Lo sentimos, actualmente no contamos con especialistas en ${specialtyMatch.specialty.charAt(0).toUpperCase() + specialtyMatch.specialty.slice(1)} afiliados dentro de la ciudad de ${requestedCity} 😊\n\nSin embargo, estas son las opciones más recomendadas disponibles en otras ciudades:`;
      } else {
        header = `Actualmente no contamos con especialistas en ${specialtyMatch.specialty.charAt(0).toUpperCase() + specialtyMatch.specialty.slice(1)} afiliados dentro de la ciudad de ${requestedCity} 😊\n\nSin embargo, estas son las opciones más recomendadas disponibles:`;
      }
    } else if (localHospitals.length === 0 && !requestedCity) {
      header = `Actualmente no contamos con especialistas en ${specialtyMatch.specialty.charAt(0).toUpperCase() + specialtyMatch.specialty.slice(1)} afiliados dentro de tu ciudad registrada (${user.city}) 😊\n\nSin embargo, estas son las opciones más recomendadas disponibles:`;
    } else {
      if (isDirectRequest && hasReference && requestedCity) {
         header = `Sí 😊 También contamos con atención de **${specialtyMatch.specialty.charAt(0).toUpperCase() + specialtyMatch.specialty.slice(1)}** afiliada en ${requestedCity}.\n\nEstas son algunas opciones disponibles con tu plan:`;
      } else if (isDirectRequest) {
         header = `En ${targetCity} hay varios hospitales y clínicas que ofrecen atención de **${specialtyMatch.specialty.toLowerCase()}** 😊\n\nCon tu **${plan.name}**, estas son tus mejores opciones:`;
      } else {
         header = `Basado en lo que me describes, te recomiendo atenderte en **${specialtyMatch.specialty.charAt(0).toUpperCase() + specialtyMatch.specialty.slice(1)}**.${urgencyNote}\n\nCon tu **${plan.name}**, estas son tus mejores opciones:`;
      }
    }

    const hospitalLines = top.length > 0
      ? top.map((h, i) => {
          let extraTag = '';
          if (i === 0 && h.city.toLowerCase() === targetCity.toLowerCase() && localHospitals.length > 0 && h.copay === Math.min(...localHospitals.map(l => l.copay))) {
             extraTag = ' ✅ *(Opción más económica y cercana)*';
          } else if (h.city.toLowerCase() === targetCity.toLowerCase() && i === 0) {
             extraTag = ' ✅ *(Opción más cercana)*';
          } else if (i === 0) {
             extraTag = ' ✅ *(Opción más económica)*';
          }
          return `${i + 1}. **${h.name}** — ${h.type}\n   📍 ${h.city}, ${h.sector}\n   💰 Copago: $${h.copay}.00${extraTag}\n   ⭐ Calificación: ${h.rating}`;
        }).join('\n\n')
      : 'No encontré hospitales con esa especialidad en tu red.';

    return `${header}\n\n${hospitalLines}\n\n---\n¿Deseas que te ayude con información adicional sobre coberturas de tu plan?`
  }

  // General Copago/Precio
  if (/copago|pagar|cuesta|costo|precio/i.test(lower)) {
     return `El valor de tu copago depende de tu tipo de plan, el hospital seleccionado y el tipo de atención.\n\nPor ejemplo, con tu **${plan.name}**:\n- **Medicina General:** $${plan.coverage.consultations.copay}\n- **Emergencias:** $${plan.coverage.emergencies.copay}\n- **Laboratorio:** $${plan.coverage.labTests.copay}\n\nSi deseas, puedo ayudarte a calcular el copago aproximado según la clínica o especialidad que necesites 😊`
  }

  // Transplants
  if (/trasplante|transplante/i.test(lower)) {
    const trn = plan.coverage.transplants
    return trn.covered
      ? `🫀 **Cobertura de Trasplantes — ${plan.name}**\n\n- **Monto máximo:** $${trn.maxAmount?.toLocaleString()}\n- **Condiciones:** ${trn.conditions}\n- **Período de espera:** ${trn.waitingPeriod}\n${trn.includes ? `- **Incluye:** ${trn.includes}` : ''}`
      : `Tu **${plan.name}** no incluye cobertura de trasplantes.`
  }

  // Medications
  if (/medicina|medicamento|farmacia|pastilla|receta|descuento/i.test(lower)) {
    const med = plan.coverage.medications
    return med.covered
      ? `💊 **Cobertura de Medicamentos — ${plan.name}**\n\n- **Copago/Descuento:** ${med.copay}\n- **Límite anual:** ${med.annualLimit}\n- Puedes acercarte a cualquier farmacia afiliada a la red con tu receta médica.`
      : `Tu **${plan.name}** no incluye cobertura de medicamentos ambulatorios. ${med.note || ''}`
  }

  // Comparisons
  if (/mejor|diferencia|comparar|recomiendas más/i.test(lower)) {
    return `Para comparar hospitales o clínicas, te recomiendo revisar la lista de prestadores médicos. Las clínicas "Red Preferencial" suelen ser más económicas (menor copago) que las "Clínicas Conveniadas".`
  }

  // Plan info
  if (/plan|cobertura|beneficio|límite|limite|deducible|seguro/i.test(lower)) {
    return `📋 **Resumen de tu ${plan.name}**\n\n- **Límite anual:** $${plan.annualLimit.toLocaleString()}\n- **Deducible:** $${plan.deductible}\n- **Consultas:** Copago $${plan.coverage.consultations.copay}\n- **Emergencias:** Copago $${plan.coverage.emergencies.copay} | ${plan.coverage.emergencies.limit}\n- **Hospitalización:** $${plan.coverage.hospitalization.copay}/día\n- **Cirugías:** ${plan.coverage.surgery.limit}\n- **Exámenes:** Copago $${plan.coverage.labTests.copay} | ${plan.coverage.labTests.annualLimit}\n\n¿Necesitas información más específica sobre algún beneficio?`
  }

  // Afiliados, clínicas generales o convenios
  if (/convenio|afiliado|prestador|clínica|clinica|hospital|procedimiento|cirugía/i.test(lower)) {
    return `Sí, contamos con una amplia red de clínicas y hospitales afiliados 😊.\n\nPuedes preguntarme por una especialidad o ciudad específica (ej. "¿Qué hospitales tengo disponibles?" o "Busco un pediatra en Cuenca") y te mostraré las mejores opciones con tu plan.`
  }

  // Out of scope
  return `Lo siento, solo puedo ayudarte con información relacionada a cobertura, beneficios y servicios de tu aseguradora. 😊\n\nPuedo ayudarte con:\n- 🏥 Hospitales disponibles\n- 💊 Coberturas y copagos\n- 🚑 Ambulancia\n- 🤰 Maternidad\n- 🫀 Trasplantes\n- 📊 Límites de tu plan`
}

// ============================================================
// BASE DE DATOS SIMULADA — AMI INSURANCE AGENT
// Hospitales reales de Ecuador, planes y usuarios ficticios
// ============================================================

export const HOSPITALS = [
  {
    id: 'h1',
    name: 'Hospital Clínica Kennedy',
    shortName: 'Kennedy',
    city: 'Guayaquil',
    sector: 'Kennedy Norte',
    address: 'Av. San Jorge y Av. 9 de Octubre, Kennedy Norte',
    phone: '04-229-9999',
    type: 'Red Preferencial',
    rating: 4.9,
    specialties: ['cardiología', 'traumatología', 'laboratorio/imágenes', 'neurología', 'Otorrinolaringología', 'oncología', 'pediatría', 'ginecología', 'medicina interna', 'cirugía', 'emergencias', 'oftalmología', 'urología'],
    plans: ['basic', 'intermediate', 'premium', 'elite'],
    coordinates: { lat: -2.1449, lng: -79.9147 },
  },
  {
    id: 'h2',
    name: 'Hospital Metropolitano',
    shortName: 'Metropolitano',
    city: 'Quito',
    sector: 'La Carolina',
    address: 'Av. Mariana de Jesús s/n y Nicolás Arteta',
    phone: '02-399-8000',
    type: 'Red Preferencial',
    rating: 4.8,
    specialties: ['cardiología', 'neurología', 'oncología', 'laboratorio/imágenes', 'pediatría', 'ginecología', 'medicina interna', 'cirugía', 'emergencias', 'endocrinología', 'gastroenterología', 'reumatología'],
    plans: ['intermediate', 'premium', 'elite'],
    coordinates: { lat: -0.1865, lng: -78.4836 },
  },
  {
    id: 'h3',
    name: 'Clínica Santa Cecilia',
    shortName: 'Santa Cecilia',
    city: 'Guayaquil',
    sector: 'Urdesa',
    address: 'Víctor Emilio Estrada 804 y Ficus, Urdesa',
    phone: '04-288-5800',
    type: 'Clínica Conveniada',
    rating: 4.5,
    specialties: ['medicina general', 'pediatría', 'laboratorio/imágenes', 'ginecología', 'traumatología', 'cirugía', 'emergencias', 'dermatología'],
    plans: ['basic', 'intermediate', 'premium', 'elite'],
    coordinates: { lat: -2.1602, lng: -79.9094 },
  },
  {
    id: 'h4',
    name: 'Hospital Voz Andes',
    shortName: 'Voz Andes',
    city: 'Quito',
    sector: 'La Paz',
    address: 'Villalengua OE2-37 y 10 de Agosto',
    phone: '02-262-6310',
    type: 'Red Preferencial',
    rating: 4.7,
    specialties: ['cardiología', 'cirugía', 'odontología', 'laboratorio/imágenes', 'Otorrinolaringología', 'traumatología', 'medicina interna', 'pediatría', 'emergencias', 'medicina general', 'ginecología'],
    plans: ['basic', 'intermediate', 'premium', 'elite'],
    coordinates: { lat: -0.1920, lng: -78.4904 },
  },
  {
    id: 'h5',
    name: 'Clínica Pichincha',
    shortName: 'Clínica Pichincha',
    city: 'Quito',
    sector: 'Centro Histórico',
    address: 'Veintimilla E3-30 y Páez',
    phone: '02-299-9700',
    type: 'Red Preferencial',
    rating: 4.6,
    specialties: ['medicina interna', 'cirugía', 'laboratorio/imágenes', 'Otorrinolaringología', 'traumatología', 'ginecología', 'pediatría', 'medicina general', 'emergencias', 'neurología', 'gastroenterología'],
    plans: ['intermediate', 'premium', 'elite'],
    coordinates: { lat: -0.2154, lng: -78.5010 },
  },
  {
    id: 'h6',
    name: 'Hospital Docente de la Policía Nacional',
    shortName: 'Hospital Policia',
    city: 'Guayaquil',
    sector: 'Urdesa Central',
    address: 'Av. 25 de Julio, Base Aérea',
    phone: '04-228-0500',
    type: 'Clínica Conveniada',
    rating: 4.3,
    specialties: ['medicina general', 'traumatología', 'laboratorio/imágenes', 'odontología', 'cirugía', 'emergencias', 'pediatría'],
    plans: ['basic', 'intermediate'],
    coordinates: { lat: -2.2056, lng: -79.9101 },
  },
  {
    id: 'h7',
    name: 'Clínica La Merced',
    shortName: 'La Merced',
    city: 'Ambato',
    sector: 'Centro',
    address: 'Bolívar 20-57 y Guayas',
    phone: '03-282-4457',
    type: 'Clínica Conveniada',
    rating: 4.4,
    specialties: ['medicina general', 'pediatría', 'laboratorio/imágenes', 'ginecología', 'Otorrinolaringología', 'odontología', 'traumatología', 'cirugía', 'emergencias'],
    plans: ['basic', 'intermediate', 'premium', 'elite'],
    coordinates: { lat: -1.2543, lng: -78.6271 },
  },
  {
    id: 'h8',
    name: 'Hospital Monte Sinaí',
    shortName: 'Monte Sinaí',
    city: 'Guayaquil',
    sector: 'Samborondón',
    address: 'Km. 2.5 Vía Samborondón, C.C. City Center',
    phone: '04-683-5050',
    type: 'Red Preferencial',
    rating: 4.8,
    specialties: ['cardiología', 'oncología', 'laboratorio/imágenes', 'neurología', 'odontología', 'pediatría', 'ginecología', 'medicina interna', 'cirugía', 'emergencias', 'gastroenterología', 'endocrinología', 'urología', 'oftalmología'],
    plans: ['premium', 'elite'],
    coordinates: { lat: -2.1133, lng: -79.8688 },
  },
  {
    id: 'h9',
    name: 'Clínica Humanitaria',
    shortName: 'Humanitaria',
    city: 'Manta',
    sector: 'Tarqui',
    address: 'Av. 4 de Noviembre y Calle 20',
    phone: '05-262-1888',
    type: 'Clínica Conveniada',
    rating: 4.2,
    specialties: ['medicina general', 'pediatría', 'laboratorio/imágenes', 'Otorrinolaringología', 'ginecología', 'odontología', 'emergencias', 'cirugía'],
    plans: ['basic', 'intermediate', 'premium', 'elite'],
    coordinates: { lat: -0.9677, lng: -80.7089 },
  },
  {
    id: 'h10',
    name: 'Hospital Universitario del Río',
    shortName: 'Univ. del Río',
    city: 'Cuenca',
    sector: 'El Paraíso',
    address: 'Av. del Paraíso y Pumapungo',
    phone: '07-410-5600',
    type: 'Red Preferencial',
    rating: 4.7,
    specialties: ['cardiología', 'neurología', 'laboratorio/imágenes', 'Otorrinolaringología', 'oncología', 'medicina interna', 'odontología', 'cirugía', 'traumatología', 'pediatría', 'ginecología', 'emergencias', 'urología'],
    plans: ['intermediate', 'premium', 'elite'],
    coordinates: { lat: -2.9001, lng: -79.0059 },
  },
  {
    id: 'h11',
    name: 'Clínica Santa Ana',
    shortName: 'Santa Ana',
    city: 'Guayaquil',
    sector: 'Alborada',
    address: 'Av. Rodolfo Baquerizo Nazur e Ilanes',
    phone: '04-224-0055',
    type: 'Clínica Conveniada',
    rating: 4.3,
    specialties: ['medicina general', 'pediatría', 'laboratorio/imágenes', 'ginecología', 'odontología', 'traumatología', 'emergencias', 'dermatología'],
    plans: ['basic', 'intermediate', 'premium'],
    coordinates: { lat: -2.1186, lng: -79.9186 },
  },
  {
    id: 'h12',
    name: 'Hospital Torre Médica Cuenca',
    shortName: 'Torre Médica',
    city: 'Cuenca',
    sector: 'El Vergel',
    address: 'Av. Solano y Av. 12 de Abril',
    phone: '07-283-5000',
    type: 'Red Preferencial',
    rating: 4.6,
    specialties: ['cardiología', 'medicina interna', 'laboratorio/imágenes', 'Otorrinolaringología', 'neurología', 'pediatría', 'ginecología', 'cirugía', 'traumatología', 'emergencias'],
    plans: ['intermediate', 'premium', 'elite'],
    coordinates: { lat: -2.9083, lng: -79.0074 },
  },
  {
    id: 'h13',
    name: 'Clínica Portoviejo Medical Center',
    shortName: 'PMC Portoviejo',
    city: 'Portoviejo',
    sector: 'Centro',
    address: 'Av. Universitaria y Ricaurte',
    phone: '05-265-1100',
    type: 'Clínica Conveniada',
    rating: 4.1,
    specialties: ['medicina general', 'pediatría', 'Otorrinolaringología', 'laboratorio/imágenes', 'ginecología', 'odontología', 'cirugía', 'emergencias'],
    plans: ['basic', 'intermediate', 'premium', 'elite'],
    coordinates: { lat: -1.0546, lng: -80.4520 },
  },
];

export const PLANS = {
  basic: {
    id: 'basic',
    name: 'Plan Básico',
    color: '#64748b',
    monthlyPremium: 45,
    annualLimit: 15000,
    deductible: 200,
    coverage: {
      consultations: { covered: true, copay: 8, limit: 'Sin límite' },
      emergencies: { covered: true, copay: 30, limit: '$2,000 por evento' },
      hospitalization: { covered: true, copay: 50, dailyLimit: '$200/día', annualDays: 30 },
      surgery: { covered: true, copay: '10%', limit: '$5,000 por procedimiento' },
      labTests: { covered: true, copay: 5, annualLimit: '$300' },
      imaging: { covered: true, copay: 15, annualLimit: '$500' },
      medications: { covered: false, copay: null, note: 'No cubierto en Plan Básico' },
      ambulance: {
        covered: true,
        type: ['terrestre'],
        copay: 20,
        limit: '$300 por evento',
        conditions: 'Solo emergencias certificadas',
        cities: ['Guayaquil', 'Quito', 'Cuenca', 'Ambato', 'Manta'],
      },
      maternity: {
        covered: false,
        note: 'No incluido en Plan Básico',
      },
      transplants: {
        covered: false,
        note: 'No incluido en Plan Básico',
      },
    },
    hospitals: ['h1', 'h3', 'h4', 'h6', 'h7', 'h9', 'h11', 'h13'],
    copayByHospital: { 'h1': 8, 'h3': 6, 'h4': 8, 'h6': 5, 'h7': 5, 'h9': 5, 'h11': 6, 'h13': 5 },
  },
  intermediate: {
    id: 'intermediate',
    name: 'Plan Intermedio',
    color: '#0ea5e9',
    monthlyPremium: 89,
    annualLimit: 30000,
    deductible: 100,
    coverage: {
      consultations: { covered: true, copay: 5, limit: 'Sin límite' },
      emergencies: { covered: true, copay: 20, limit: '$5,000 por evento' },
      hospitalization: { covered: true, copay: 30, dailyLimit: '$400/día', annualDays: 60 },
      surgery: { covered: true, copay: '8%', limit: '$10,000 por procedimiento' },
      labTests: { covered: true, copay: 3, annualLimit: '$600' },
      imaging: { covered: true, copay: 10, annualLimit: '$1,000' },
      medications: { covered: true, copay: '20%', annualLimit: '$500' },
      ambulance: {
        covered: true,
        type: ['terrestre'],
        copay: 10,
        limit: '$600 por evento',
        conditions: 'Emergencias y traslados médicos',
        cities: ['Guayaquil', 'Quito', 'Cuenca', 'Ambato', 'Manta', 'Portoviejo'],
      },
      maternity: {
        covered: true,
        copay: 80,
        limit: '$3,000 parto normal / $4,500 cesárea',
        newbornCovered: true,
        newbornDays: 30,
        complications: '$5,000',
      },
      transplants: {
        covered: false,
        note: 'No incluido en Plan Intermedio',
      },
    },
    hospitals: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h9', 'h10', 'h11', 'h12', 'h13'],
    copayByHospital: { 'h1': 10, 'h2': 12, 'h3': 8, 'h4': 10, 'h5': 10, 'h6': 6, 'h7': 6, 'h9': 6, 'h10': 10, 'h11': 7, 'h12': 10, 'h13': 6 },
  },
  premium: {
    id: 'premium',
    name: 'Plan Premium',
    color: '#14b8a6',
    monthlyPremium: 165,
    annualLimit: 80000,
    deductible: 0,
    coverage: {
      consultations: { covered: true, copay: 0, limit: 'Sin límite' },
      emergencies: { covered: true, copay: 10, limit: '$20,000 por evento' },
      hospitalization: { covered: true, copay: 15, dailyLimit: '$800/día', annualDays: 120 },
      surgery: { covered: true, copay: '5%', limit: '$30,000 por procedimiento' },
      labTests: { covered: true, copay: 0, annualLimit: '$2,000' },
      imaging: { covered: true, copay: 5, annualLimit: '$3,000' },
      medications: { covered: true, copay: '10%', annualLimit: '$2,000' },
      ambulance: {
        covered: true,
        type: ['terrestre', 'aérea'],
        copay: 0,
        limit: '$5,000 por evento',
        conditions: 'Emergencias, traslados y repatriaciones',
        cities: ['Guayaquil', 'Quito', 'Cuenca', 'Ambato', 'Manta', 'Portoviejo', 'Loja', 'Esmeraldas', 'Sto. Domingo'],
      },
      maternity: {
        covered: true,
        copay: 20,
        limit: '$8,000 parto normal / $12,000 cesárea',
        newbornCovered: true,
        newbornDays: 90,
        complications: '$15,000',
        prenatalChecks: 10,
      },
      transplants: {
        covered: true,
        maxAmount: 40000,
        conditions: 'Requiere preautorización. Órganos: riñón, córnea, médula ósea.',
        waitingPeriod: '12 meses',
      },
    },
    hospitals: ['h1', 'h2', 'h3', 'h4', 'h5', 'h7', 'h8', 'h9', 'h10', 'h11', 'h12', 'h13'],
    copayByHospital: { 'h1': 10, 'h2': 12, 'h3': 8, 'h4': 10, 'h5': 10, 'h7': 7, 'h8': 16, 'h9': 7, 'h10': 12, 'h11': 8, 'h12': 12, 'h13': 7 },
  },
  elite: {
    id: 'elite',
    name: 'Plan Elite',
    color: '#a855f7',
    monthlyPremium: 320,
    annualLimit: 250000,
    deductible: 0,
    coverage: {
      consultations: { covered: true, copay: 0, limit: 'Sin límite' },
      emergencies: { covered: true, copay: 0, limit: '$50,000 por evento' },
      hospitalization: { covered: true, copay: 0, dailyLimit: '$2,000/día', annualDays: 365 },
      surgery: { covered: true, copay: '0%', limit: '$100,000 por procedimiento' },
      labTests: { covered: true, copay: 0, annualLimit: 'Sin límite' },
      imaging: { covered: true, copay: 0, annualLimit: 'Sin límite' },
      medications: { covered: true, copay: '5%', annualLimit: '$10,000' },
      ambulance: {
        covered: true,
        type: ['terrestre', 'aérea', 'internacional'],
        copay: 0,
        limit: 'Sin límite',
        conditions: 'Cobertura completa nacional e internacional',
        cities: ['Todo Ecuador + Internacional'],
      },
      maternity: {
        covered: true,
        copay: 0,
        limit: 'Sin límite',
        newbornCovered: true,
        newbornDays: 365,
        complications: 'Sin límite',
        prenatalChecks: 'Ilimitados',
      },
      transplants: {
        covered: true,
        maxAmount: 120000,
        conditions: 'Cobertura amplia. Órganos: riñón, hígado, corazón, córnea, médula ósea, pulmón.',
        waitingPeriod: '6 meses',
        includes: 'Medicación inmunosupresora post-trasplante cubierta 2 años',
      },
    },
    hospitals: ['h1', 'h2', 'h3', 'h4', 'h5', 'h7', 'h8', 'h9', 'h10', 'h11', 'h12', 'h13'],
    copayByHospital: { 'h1': 0, 'h2': 0, 'h3': 5, 'h4': 0, 'h5': 0, 'h7': 5, 'h8': 0, 'h9': 5, 'h10': 0, 'h11': 5, 'h12': 0, 'h13': 5 },
  },
};

// Síntomas → especialidades médicas
export const SYMPTOM_TO_SPECIALTY = [
  { keywords: ['muela', 'diente', 'dientes', 'encias', 'encías', 'odontología', 'dentista', 'caries', 'sacar', 'palpitaciones en los dientes', 'molestias en los dientes'], specialty: 'odontología', urgency: 'baja' },
  { keywords: ['alergia', 'alergias', 'ronchas', 'pelan las manos', 'picazón', 'picazon', 'polvo', 'detergente', 'irritacion', 'irrita', 'granos', 'acne', 'quemé las manos', 'queme'], specialty: 'dermatología', urgency: 'baja' },
  { keywords: ['oído', 'oido', 'escucho menos', 'garganta y oido', 'palpita el oido', 'presión en el oido', 'otorrinolaringología', 'otorrino'], specialty: 'otorrinolaringología', urgency: 'baja' },
  { keywords: ['hueso', 'fractura', 'rodilla', 'cadera', 'columna', 'espalda', 'articulación', 'ortopedia', 'trauma', 'golpe', 'torcedura', 'accidente', 'rehabilitación', 'rehabilitacion', 'movilidad', 'operaron la pierna', 'lesion', 'lesioné', 'lesione'], specialty: 'traumatología/rehabilitación física', urgency: 'media' },
  { keywords: ['ansioso', 'ansiedad', 'emocional', 'psicología', 'psicologo', 'psicólogo', 'depresión', 'depresion', 'estrés', 'tristeza', 'nervios'], specialty: 'psicología', urgency: 'baja' },
  { keywords: ['riñón', 'rinon', 'orina', 'próstata', 'vejiga', 'renal', 'urología', 'urology', 'urinario', 'al orinar', 'molestias urinarias'], specialty: 'urología', urgency: 'media' },
  { keywords: ['estómago', 'estomago', 'estomacal', 'malestar del estomago', 'malestar del estómago', 'malestar estomacal', 'intestino', 'colon', 'hígado', 'reflujo', 'gastritis', 'diarrea', 'vómito', 'vomito', 'digestivo', 'gastro', 'parásitos', 'parasitos', 'intestinales'], specialty: 'gastroenterología', urgency: 'baja' },
  { keywords: ['pecho', 'cardíaco', 'corazón', 'corazon', 'heart', 'chest', 'arritmia', 'taquicardia', 'infarto', 'dolor precordial', 'cardiologo', 'cardiólogo'], specialty: 'cardiología', urgency: 'alta' },
  { keywords: ['cabeza', 'cabesa', 'migraña', 'cefalea', 'neurológico', 'convulsión', 'desmayo', 'mareo', 'headache', 'derrame'], specialty: 'neurología', urgency: 'alta' },
  { keywords: ['cáncer', 'cancer', 'tumor', 'oncología', 'quimioterapia', 'radioterapia', 'biopsia', 'neoplasia'], specialty: 'oncología', urgency: 'alta' },
  { keywords: ['niño', 'niña', 'bebé', 'bebe', 'pediatría', 'infant', 'child', 'kid', 'fiebre niño', 'diarrea niño', 'recién nacido', 'ijo', 'hijo', 'hija', 'ija'], specialty: 'pediatría', urgency: 'media' },
  { keywords: ['embarazo', 'embarazada', 'embarasada', 'parto', 'cesárea', 'cesarea', 'obstetricia', 'ginecología', 'maternity', 'feto', 'menstruación', 'ovario', 'útero', 'utero'], specialty: 'ginecología', urgency: 'media' },
  { keywords: ['diabetes', 'tiroides', 'azúcar', 'azucar', 'hormona', 'endocrino', 'triglicéridos', 'trigliceridos', 'insulina', 'páncreas'], specialty: 'endocrinología', urgency: 'baja' },
  { keywords: ['ojo', 'ojos', 'visión', 'vision', 'vista', 'retina', 'cataratas', 'glaucoma', 'eye', 'oftalmología'], specialty: 'oftalmología', urgency: 'baja' },
  { keywords: ['artritis', 'reumatismo', 'lupus', 'reumatología', 'articulaciones', 'immune', 'inmunología'], specialty: 'reumatología', urgency: 'baja' },
  { keywords: ['cirugía', 'cirugia', 'operación', 'operacion', 'surgery', 'hernia', 'apéndice', 'vesícula'], specialty: 'cirugía', urgency: 'alta' },
  { keywords: ['emergencia', 'urgencia', 'emergency', 'urgente', 'critical', 'grave'], specialty: 'emergencias', urgency: 'crítica' },
  { keywords: ['examen', 'examenes', 'laboratorio', 'sangre', 'heces', 'rayos x', 'resonancia', 'tac', 'eco', 'ecografía', 'imagen', 'radiografía', 'radiografia', 'tomografía', 'tomografia', 'análisis', 'analisis', 'clinicos', 'microbiología'], specialty: 'laboratorio/imágenes', urgency: 'baja' },
  { keywords: ['medico general', 'médico general', 'medicina general', 'consulta', 'doctor', 'atenderme', 'revisión', 'chequeo', 'siento mal', 'duele', 'dolor', 'náuseas', 'nauseas', 'fiebre', 'gripe', 'gripa', 'mareos', 'malestar corporal', 'malestar del cuerpo'], specialty: 'medicina general', urgency: 'baja' },
  { keywords: ['medicina interna', 'internista'], specialty: 'medicina interna', urgency: 'baja' },
];

export const USERS = [
  { id: 'u1', affiliateNumber: 'AF-001234', name: 'Carlos Mendoza', email: 'carlos.mendoza@email.com', plan: 'premium', city: 'Guayaquil', age: 42, phone: '0991234567', password: 'Pass2024!' },
  { id: 'u2', affiliateNumber: 'AF-002345', name: 'María Rodríguez', email: 'maria.rodriguez@email.com', plan: 'elite', city: 'Quito', age: 35, phone: '0992345678', password: 'Pass2024!' },
  { id: 'u3', affiliateNumber: 'AF-003456', name: 'Juan Pérez', email: 'juan.perez@email.com', plan: 'basic', city: 'Cuenca', age: 28, phone: '0993456789', password: 'Pass2024!' },
  { id: 'u4', affiliateNumber: 'AF-004567', name: 'Ana García', email: 'ana.garcia@email.com', plan: 'intermediate', city: 'Ambato', age: 31, phone: '0994567890', password: 'Pass2024!' },
  { id: 'u5', affiliateNumber: 'AF-005678', name: 'Pedro Torres', email: 'pedro.torres@email.com', plan: 'premium', city: 'Manta', age: 55, phone: '0995678901', password: 'Pass2024!' },
  { id: 'u6', affiliateNumber: 'AF-006789', name: 'Lucía Vargas', email: 'lucia.vargas@email.com', plan: 'elite', city: 'Guayaquil', age: 29, phone: '0996789012', password: 'Pass2024!' },
  { id: 'u7', affiliateNumber: 'AF-007890', name: 'Roberto Silva', email: 'roberto.silva@email.com', plan: 'basic', city: 'Quito', age: 47, phone: '0997890123', password: 'Pass2024!' },
  { id: 'u8', affiliateNumber: 'AF-008901', name: 'Carmen López', email: 'carmen.lopez@email.com', plan: 'intermediate', city: 'Cuenca', age: 38, phone: '0998901234', password: 'Pass2024!' },
  { id: 'u9', affiliateNumber: 'AF-009012', name: 'Diego Morales', email: 'diego.morales@email.com', plan: 'premium', city: 'Guayaquil', age: 33, phone: '0999012345', password: 'Pass2024!' },
  { id: 'u10', affiliateNumber: 'AF-010123', name: 'Sofía Herrera', email: 'sofia.herrera@email.com', plan: 'elite', city: 'Quito', age: 26, phone: '0990123456', password: 'Pass2024!' },
  { id: 'u11', affiliateNumber: 'AF-011234', name: 'Miguel Castillo', email: 'miguel.castillo@email.com', plan: 'intermediate', city: 'Portoviejo', age: 44, phone: '0981234567', password: 'Pass2024!' },
  { id: 'u12', affiliateNumber: 'AF-012345', name: 'Isabel Vega', email: 'isabel.vega@email.com', plan: 'basic', city: 'Ambato', age: 52, phone: '0982345678', password: 'Pass2024!' },
  { id: 'u13', affiliateNumber: 'AF-013456', name: 'Andrés Quiroga', email: 'andres.quiroga@email.com', plan: 'premium', city: 'Cuenca', age: 39, phone: '0983456789', password: 'Pass2024!' },
  { id: 'u14', affiliateNumber: 'AF-014567', name: 'Patricia Espinoza', email: 'patricia.espinoza@email.com', plan: 'elite', city: 'Guayaquil', age: 61, phone: '0984567890', password: 'Pass2024!' },
  { id: 'u15', affiliateNumber: 'AF-015678', name: 'Javier Romero', email: 'javier.romero@email.com', plan: 'intermediate', city: 'Manta', age: 36, phone: '0985678901', password: 'Pass2024!' },
  { id: 'u16', affiliateNumber: 'AF-016789', name: 'Gabriela Naranjo', email: 'gabriela.naranjo@email.com', plan: 'basic', city: 'Guayaquil', age: 24, phone: '0986789012', password: 'Pass2024!' },
  { id: 'u17', affiliateNumber: 'AF-017890', name: 'Fernando Aguirre', email: 'fernando.aguirre@email.com', plan: 'premium', city: 'Quito', age: 49, phone: '0987890123', password: 'Pass2024!' },
  { id: 'u18', affiliateNumber: 'AF-018901', name: 'Daniela Cárdenas', email: 'daniela.cardenas@email.com', plan: 'elite', city: 'Cuenca', age: 32, phone: '0988901234', password: 'Pass2024!' },
  { id: 'u19', affiliateNumber: 'AF-019012', name: 'Sebastián Ponce', email: 'sebastian.ponce@email.com', plan: 'intermediate', city: 'Portoviejo', age: 41, phone: '0989012345', password: 'Pass2024!' },
  { id: 'u20', affiliateNumber: 'AF-020123', name: 'Valentina Cruz', email: 'valentina.cruz@email.com', plan: 'basic', city: 'Ambato', age: 27, phone: '0980123456', password: 'Pass2024!' },
];

// Helper: get hospitals by plan and city (or nearby)
export function getHospitalsByPlanAndCity(planId, city) {
  const plan = PLANS[planId];
  if (!plan) return [];
  return HOSPITALS
    .filter(h => plan.hospitals.includes(h.id))
    .map(h => ({
      ...h,
      copay: plan.copayByHospital[h.id] ?? 10,
      isLocal: h.city.toLowerCase() === city.toLowerCase(),
    }))
    .sort((a, b) => {
      if (a.isLocal && !b.isLocal) return -1;
      if (!a.isLocal && b.isLocal) return 1;
      return a.copay - b.copay;
    });
}

export function detectSpecialtyFromMessage(message) {
  const normalize = (str) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const lower = normalize(message);
  for (const entry of SYMPTOM_TO_SPECIALTY) {
    if (entry.keywords.some(kw => lower.includes(normalize(kw)))) {
      return entry;
    }
  }
  return null;
}

// Helper: filter hospitals by specialty
export function filterBySpecialty(hospitals, specialty) {
  if (!specialty) return hospitals;
  const specialtiesToCheck = specialty.split('/').map(s => s.trim().toLowerCase());
  return hospitals.filter(h =>
    h.specialties.some(hospitalSpecialty =>
      specialtiesToCheck.some(s => hospitalSpecialty.toLowerCase().includes(s))
    )
  );
}

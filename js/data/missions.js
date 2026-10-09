/**
 * Datos pedagógicos y narrativos de las 6 Misiones de Código Cero
 */

export const MISSIONS = [
  {
    id: "mission_1",
    order: 1,
    title: "Reinicio del Sistema",
    subtitle: "Algoritmos, secuencias e instrucciones ordenadas",
    badgeId: "badge_1",
    experienceReward: 200,
    districtName: "Planta Energética Cuántica",
    narrativeIntro: "El corte energético ha sumido en la oscuridad los centros de datos de la Planta Cuántica. El generador auxiliar no arranca debido a que el protocolo de encendido se ejecutó en desorden. Ayuda a NEXO a reordenar las instrucciones paso a paso para restablecer el flujo eléctrico primario.",
    learningObjectives: [
      "Comprender qué es un algoritmo y su carácter secuencial finito.",
      "Identificar el orden lógico estricto requerido por las computadoras.",
      "Reconocer instrucciones ambiguas, incompletas o desordenadas."
    ],
    contentTopics: ["Algoritmos", "Secuenciación", "Instrucciones deterministas", "Precisión lógica"],
    totalChallenges: 3,
    prerequisiteMissionId: null,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>`
  },
  {
    id: "mission_2",
    order: 2,
    title: "Rutas Inteligentes",
    subtitle: "Descomposición de problemas y navegación algorítmica",
    badgeId: "badge_2",
    experienceReward: 200,
    districtName: "Red de Transporte Automatizado",
    narrativeIntro: "La flota de drones y vehículos autónomos de suministro está varada. Las coordenadas están bloqueadas y los sensores reportan escombros y campos de fuerza. Programa la ruta del robot de navegación paso a paso (avanzar, girar) para que alcance el nodo de conexión sin colisionar.",
    learningObjectives: [
      "Aplicar la descomposición de un problema complejo en subpasos simples.",
      "Diseñar secuencias de desplazamiento espacial orientadas a objetivos.",
      "Prever el efecto de cada instrucción en el estado del autómata."
    ],
    contentTopics: ["Descomposición", "Pensamiento espacial", "Trazado de trayectorias", "Ejecución paso a paso"],
    totalChallenges: 3,
    prerequisiteMissionId: "mission_1",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`
  },
  {
    id: "mission_3",
    order: 3,
    title: "El Centro de Decisiones",
    subtitle: "Estructuras condicionales y lógica SI / ENTONCES",
    badgeId: "badge_3",
    experienceReward: 200,
    districtName: "Compuertas de Seguridad Lógica",
    narrativeIntro: "Las compuertas perimetrales de seguridad están actuando de forma errática. Unas no abren y otras permiten sobrecalentamiento. Necesitamos reconfigurar los árboles de decisión lógica (SI/ENTONCES/SINO) para que los sensores tomen las decisiones correctas ante diferentes emergencias.",
    learningObjectives: [
      "Comprender la evaluación de condiciones booleanas (verdadero / falso).",
      "Estructurar decisiones mediante bloques SI... ENTONCES... SINO.",
      "Seleccionar la respuesta idónea de un sistema informático según variables de entorno."
    ],
    contentTopics: ["Condicionales", "Operadores lógicos", "Variables de estado", "Bifurcaciones"],
    totalChallenges: 5,
    prerequisiteMissionId: "mission_2",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>`
  },
  {
    id: "mission_4",
    order: 4,
    title: "El Bucle Infinito",
    subtitle: "Estructuras repetitivas y reconocimiento de patrones",
    badgeId: "badge_4",
    experienceReward: 200,
    districtName: "Anillo de Comunicaciones en Bucle",
    narrativeIntro: "El servidor de comunicaciones está colapsado por mensajes repetidos e ineficientes. Los paquetes de datos se transmiten escribiendo la misma orden cientos de veces. Utiliza estructuras repetitivas (bucles) para compactar los algoritmos y detectar secuencias idénticas.",
    learningObjectives: [
      "Identificar patrones repetitivos en secuencias de instrucciones.",
      "Utilizar bucles para simplificar y optimizar código repetitivo.",
      "Discernir cuándo es apropiado usar un bucle y cuándo no."
    ],
    contentTopics: ["Bucles (Loops)", "Repeticiones definidas", "Patrones algorítmicos", "Eficiencia de código"],
    totalChallenges: 4,
    prerequisiteMissionId: "mission_3",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`
  },
  {
    id: "mission_5",
    order: 5,
    title: "Operación Depuración",
    subtitle: "Identificación, análisis y corrección de errores (Debugging)",
    badgeId: "badge_5",
    experienceReward: 200,
    districtName: "Firewall y Subsistema de Depuración",
    narrativeIntro: "¡Alerta máxima! Varios programas clave de Ciudad Algoritmia tienen 'bugs' ocultos que causan fallos catastróficos: bucles fuera de rango, condiciones invertidas y pasos omitidos. Conviértete en cazador de errores: inspecciona el código defectuoso, localiza la falla y corrígela.",
    learningObjectives: [
      "Distinguir errores de sintaxis frente a errores de lógica de ejecución.",
      "Rastrear la ejecución mentalmente para predecir anomalías.",
      "Aplicar métodos sistemáticos de depuración y prueba."
    ],
    contentTopics: ["Depuración (Debugging)", "Errores 'off-by-one'", "Lógica invertida", "Trazabilidad"],
    totalChallenges: 6,
    prerequisiteMissionId: "mission_4",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
  },
  {
    id: "mission_6",
    order: 6,
    title: "Reconstrucción Final",
    subtitle: "Desafío integrador de restauración de Ciudad Algoritmia",
    badgeId: "badge_6",
    experienceReward: 300,
    districtName: "Núcleo Cero de Ciudad Algoritmia",
    narrativeIntro: "Has llegado al corazón de la ciudad: el Núcleo Cero. Para reactivar el sistema operativo metropolitano, deberás resolver un reto maestro de cuatro fases que combina secuencia, toma de decisiones en tiempo real, bucles de calibración y depuración del compilador raíz. ¡El destino de Ciudad Algoritmia está en tus manos!",
    learningObjectives: [
      "Integrar secuencias, condicionales, bucles y depuración en un proyecto unificado.",
      "Validar soluciones ante restricciones complejas de ingeniería computacional.",
      "Consolidar la autonomía en el razonamiento algorítmico."
    ],
    contentTopics: ["Integración computacional", "Arquitectura algorítmica", "Pensamiento computacional global"],
    totalChallenges: 4,
    prerequisiteMissionId: "mission_5",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
  }
];

export function getMissionById(missionId) {
  return MISSIONS.find(m => m.id === missionId) || null;
}

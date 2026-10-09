/**
 * Definición de las 6 insignias del juego "Código Cero"
 * Incluye iconografía SVG original en línea para no depender de recursos externos.
 */

export const BADGES = [
  {
    id: "badge_1",
    name: "Arquitecto de Secuencias",
    missionId: "mission_1",
    description: "Dominio de la descomposición y orden secuencial sin ambigüedades.",
    condition: "Completa todos los desafíos de la Misión 1 (Reinicio del Sistema).",
    color: "#00f0ff", // Cian eléctrico
    svgIcon: `
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="badge-svg">
        <circle cx="32" cy="32" r="30" stroke="#00f0ff" stroke-width="2.5" stroke-dasharray="4 2" fill="rgba(0,240,255,0.08)"/>
        <path d="M18 20L32 12L46 20V44L32 52L18 44V20Z" stroke="#00f0ff" stroke-width="2" fill="rgba(0,119,254,0.2)"/>
        <path d="M32 20V44" stroke="#00f0ff" stroke-width="2" stroke-linecap="round"/>
        <path d="M24 28L32 34L40 28" stroke="#00f0ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="32" cy="20" r="3" fill="#00f0ff"/>
        <circle cx="32" cy="44" r="3" fill="#00f0ff"/>
      </svg>
    `
  },
  {
    id: "badge_2",
    name: "Navegante Lógico",
    missionId: "mission_2",
    description: "Diseño de rutas óptimas y descomposición espacial para autómatas.",
    condition: "Completa todos los niveles de navegación de la Misión 2 (Rutas Inteligentes).",
    color: "#0077fe", // Azul tecnológico
    svgIcon: `
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="badge-svg">
        <circle cx="32" cy="32" r="30" stroke="#0077fe" stroke-width="2.5" fill="rgba(0,119,254,0.08)"/>
        <polygon points="32,14 42,46 32,38 22,46" fill="rgba(0,240,255,0.3)" stroke="#00f0ff" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="32" cy="32" r="16" stroke="#0077fe" stroke-width="1.5" stroke-dasharray="2 3"/>
        <circle cx="32" cy="14" r="2.5" fill="#00f0ff"/>
      </svg>
    `
  },
  {
    id: "badge_3",
    name: "Maestro de Decisiones",
    missionId: "mission_3",
    description: "Evaluación certera de condiciones SI/ENTONCES en sistemas críticos.",
    condition: "Resuelve con éxito las situaciones condicionales de la Misión 3.",
    color: "#9d4edd", // Morado narrativo
    svgIcon: `
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="badge-svg">
        <circle cx="32" cy="32" r="30" stroke="#9d4edd" stroke-width="2.5" fill="rgba(157,78,221,0.08)"/>
        <path d="M32 16L48 32L32 48L16 32L32 16Z" stroke="#9d4edd" stroke-width="2" fill="rgba(157,78,221,0.2)"/>
        <path d="M32 26V38" stroke="#00f0ff" stroke-width="2" stroke-linecap="round"/>
        <path d="M26 32H38" stroke="#00f0ff" stroke-width="2" stroke-linecap="round"/>
        <circle cx="48" cy="32" r="3" fill="#00e676"/>
        <circle cx="16" cy="32" r="3" fill="#ff3366"/>
      </svg>
    `
  },
  {
    id: "badge_4",
    name: "Domador de Bucles",
    missionId: "mission_4",
    description: "Identificación de patrones iterativos y simplificación de algoritmos.",
    condition: "Supera los ejercicios de estructuras repetitivas de la Misión 4.",
    color: "#ffb703", // Ámbar tecnológico
    svgIcon: `
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="badge-svg">
        <circle cx="32" cy="32" r="30" stroke="#ffb703" stroke-width="2.5" fill="rgba(255,183,3,0.08)"/>
        <path d="M48 32C48 40.8366 40.8366 48 32 48C23.1634 48 16 40.8366 16 32C16 23.1634 23.1634 16 32 16C37.5 16 42.3 18.8 45.2 23" stroke="#ffb703" stroke-width="2.5" stroke-linecap="round"/>
        <polygon points="46,16 48,25 39,24" fill="#ffb703"/>
        <circle cx="32" cy="32" r="6" fill="rgba(255,183,3,0.3)" stroke="#00f0ff" stroke-width="1.5"/>
      </svg>
    `
  },
  {
    id: "badge_5",
    name: "Cazador de Errores",
    missionId: "mission_5",
    description: "Detección, análisis y corrección rigurosa de bugs lógicos y de ejecución.",
    condition: "Completa la Operación Depuración resolviendo los 6 fallos críticos.",
    color: "#ff3366", // Carmesí / Neón
    svgIcon: `
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="badge-svg">
        <circle cx="32" cy="32" r="30" stroke="#ff3366" stroke-width="2.5" fill="rgba(255,51,102,0.08)"/>
        <ellipse cx="32" cy="34" rx="10" ry="12" stroke="#ff3366" stroke-width="2" fill="rgba(255,51,102,0.2)"/>
        <circle cx="32" cy="20" r="5" stroke="#ff3366" stroke-width="2"/>
        <path d="M22 28L14 24M22 34L12 34M22 40L14 44" stroke="#ff3366" stroke-width="2" stroke-linecap="round"/>
        <path d="M42 28L50 24M42 34L52 34M42 40L50 44" stroke="#ff3366" stroke-width="2" stroke-linecap="round"/>
        <path d="M30 16L26 12M34 16L38 12" stroke="#ff3366" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M28 34L36 34" stroke="#00f0ff" stroke-width="2"/>
      </svg>
    `
  },
  {
    id: "badge_6",
    name: "Guardián de Ciudad Algoritmia",
    missionId: "mission_6",
    description: "Restauración integral del Núcleo Cero uniendo secuencias, lógica y bucles.",
    condition: "Supera el Desafío Final y reactiva con éxito todos los sistemas urbanos.",
    color: "#00e676", // Verde éxito / Victoria
    svgIcon: `
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="badge-svg">
        <circle cx="32" cy="32" r="30" stroke="#00e676" stroke-width="2.5" fill="rgba(0,230,118,0.1)"/>
        <polygon points="32,10 49,20 49,44 32,54 15,44 15,20" stroke="#00e676" stroke-width="2" fill="rgba(0,230,118,0.2)"/>
        <path d="M24 32L30 38L42 24" stroke="#00f0ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="32" cy="10" r="3" fill="#00f0ff"/>
        <circle cx="49" cy="44" r="3" fill="#00f0ff"/>
        <circle cx="15" cy="44" r="3" fill="#00f0ff"/>
      </svg>
    `
  }
];

export function getBadgeById(badgeId) {
  return BADGES.find(b => b.id === badgeId) || null;
}

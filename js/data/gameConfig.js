/**
 * Configuración central del juego "Código Cero: El Rescate de Ciudad Algoritmia"
 */

export const GAME_CONFIG = {
  version: "1.0.0",
  appName: "Código Cero: El Rescate de Ciudad Algoritmia",
  targetAudience: "4.º de ESO (15-16 años) - Pensamiento Computacional",

  // Puntuaciones
  scoring: {
    challengeBaseXP: 100,
    missionCompletionBonusXP: 200,
    finalChallengeBonusXP: 300,
    hintPenaltyXP: 25,
    minChallengeXP: 30
  },

  // Umbrales de experiencia para rangos
  ranks: [
    {
      id: "aprendiz",
      name: "Aprendiz Digital",
      minXP: 0,
      description: "Iniciando la conexión con los protocolos de Ciudad Algoritmia.",
      badgeColor: "#64748b"
    },
    {
      id: "tecnico",
      name: "Técnico de Algoritmos",
      minXP: 300,
      description: "Capaz de organizar secuencias y descomponer problemas lógicos.",
      badgeColor: "#0077fe"
    },
    {
      id: "especialista",
      name: "Especialista en Lógica",
      minXP: 800,
      description: "Domina las bifurcaciones condicionales y los bucles de repetición.",
      badgeColor: "#9d4edd"
    },
    {
      id: "ingeniero",
      name: "Ingeniero de Sistemas",
      minXP: 1500,
      description: "Experto en depuración de errores críticos y optimización de código.",
      badgeColor: "#00f0ff"
    },
    {
      id: "guardian",
      name: "Guardián de Ciudad Algoritmia",
      minXP: 2200,
      description: "Héroe digital que ha restaurado por completo el Núcleo Cero de la metrópoli.",
      badgeColor: "#00e676"
    }
  ],

  // Estados de restauración de la ciudad
  cityDistricts: [
    {
      id: "distrito_energia",
      name: "Planta Energética Cuántica",
      missionId: "mission_1",
      restoredPercent: 15,
      description: "Secuencias de arranque de los generadores restauradas."
    },
    {
      id: "distrito_movilidad",
      name: "Red de Transporte Automatizado",
      missionId: "mission_2",
      restoredPercent: 30,
      description: "Rutas seguras para drones de suministro operativas."
    },
    {
      id: "distrito_seguridad",
      name: "Compuertas de Seguridad Lógica",
      missionId: "mission_3",
      restoredPercent: 50,
      description: "Controladores condicionales de acceso estabilizados."
    },
    {
      id: "distrito_redes",
      name: "Anillo de Comunicaciones en Bucle",
      missionId: "mission_4",
      restoredPercent: 70,
      description: "Tráfico de datos recirculando de forma eficiente."
    },
    {
      id: "distrito_defensa",
      name: "Firewall y Subsistema de Depuración",
      missionId: "mission_5",
      restoredPercent: 88,
      description: "Fallos críticos y bucles erráticos erradicados."
    },
    {
      id: "nucleo_central",
      name: "Núcleo Cero de Ciudad Algoritmia",
      missionId: "mission_6",
      restoredPercent: 100,
      description: "Sistema operativo central totalmente reiniciado y libre de anomalías."
    }
  ],

  // Límites y configuración técnica
  storageKeys: {
    playerId: "codigocero_player_id",
    playerAlias: "codigocero_player_alias"
  },
  leaderboardLimit: 20
};

/**
 * Obtiene el rango correspondiente a una cantidad de XP
 * @param {number} xp 
 * @returns {object} Rango actual
 */
export function getRankByXP(xp) {
  const currentXP = Number(xp) || 0;
  const ranks = GAME_CONFIG.ranks;
  let activeRank = ranks[0];

  for (let i = ranks.length - 1; i >= 0; i--) {
    if (currentXP >= ranks[i].minXP) {
      activeRank = ranks[i];
      break;
    }
  }

  return activeRank;
}

/**
 * Calcula el progreso general de la ciudad según las misiones completadas
 * @param {string[]} completedMissions 
 * @returns {number} Porcentaje entre 0 y 100
 */
export function calculateCityHealth(completedMissions = []) {
  if (!completedMissions || completedMissions.length === 0) return 0;
  const total = GAME_CONFIG.cityDistricts.length;
  const completedCount = completedMissions.length;
  return Math.min(100, Math.round((completedCount / total) * 100));
}

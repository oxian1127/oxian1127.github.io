/**
 * Servicio de Clasificación Global (Leaderboard)
 */

import {
  db,
  collection,
  getDocs,
  query,
  orderBy,
  limit
} from "../firebase.js";
import { GAME_CONFIG } from "../data/gameConfig.js";

/**
 * Obtiene la clasificación global de participantes desde Firestore
 * @param {number} maxResults 
 * @returns {Promise<Array>} Lista ordenada de líderes
 */
export async function getLeaderboard(maxResults = GAME_CONFIG.leaderboardLimit) {
  try {
    const playersRef = collection(db, "players");
    // Traemos un cupo suficiente ordenado por experiencia descendente
    const q = query(playersRef, orderBy("experience", "desc"), limit(maxResults * 2));
    const snap = await getDocs(q);

    if (snap.empty) {
      return [];
    }

    const players = [];

    snap.forEach((doc) => {
      const data = doc.data();
      const completedMissionsCount = Array.isArray(data.completedMissions) ? data.completedMissions.length : 0;
      players.push({
        id: doc.id,
        // Protegemos el ID mostrando solo los primeros caracteres para referencia visual
        displayId: doc.id.substring(0, 6) + "...",
        alias: data.alias || "Agente Anónimo",
        experience: Number(data.experience) || 0,
        completedCount: completedMissionsCount,
        rank: data.rank || "Aprendiz Digital",
        lastActivityAt: data.lastActivityAt ? (data.lastActivityAt.toDate ? data.lastActivityAt.toDate() : null) : null
      });
    });

    // Ordenamiento secundario en cliente: en empate de XP, mayor número de misiones
    players.sort((a, b) => {
      if (b.experience !== a.experience) {
        return b.experience - a.experience;
      }
      return b.completedCount - a.completedCount;
    });

    // Limitar al número máximo y asignar posiciones
    const topList = players.slice(0, maxResults).map((player, index) => ({
      ...player,
      position: index + 1
    }));

    return topList;
  } catch (error) {
    console.error("Error al obtener clasificación:", error);
    throw error;
  }
}

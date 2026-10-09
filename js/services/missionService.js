/**
 * Servicio de Misiones: Gestión de estados, avance, finalización y bonificaciones
 */

import {
  db,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  runTransaction
} from "../firebase.js";
import { MISSIONS, getMissionById } from "../data/missions.js";
import { GAME_CONFIG, getRankByXP } from "../data/gameConfig.js";
import { awardBadge } from "./badgeService.js";

/**
 * Obtiene el progreso de una misión específica para el jugador
 * @param {string} playerId 
 * @param {string} missionId 
 * @returns {Promise<object|null>}
 */
export async function getMissionProgress(playerId, missionId) {
  if (!playerId || !missionId) return null;
  const missionRef = doc(db, "players", playerId, "missionProgress", missionId);
  const snap = await getDoc(missionRef);
  return snap.exists() ? snap.data() : null;
}

/**
 * Obtiene el mapa de progreso de todas las misiones para un jugador
 * @param {string} playerId 
 * @returns {Promise<Map<string, object>>}
 */
export async function getAllMissionsProgress(playerId) {
  const map = new Map();
  if (!playerId) return map;

  try {
    const colRef = collection(db, "players", playerId, "missionProgress");
    const snap = await getDocs(colRef);
    snap.forEach((d) => {
      map.set(d.id, d.data());
    });
  } catch (err) {
    console.warn("Error al cargar progreso de misiones:", err);
  }

  return map;
}

/**
 * Inicia una misión marcándola como "in_progress" si aún estaba disponible
 * @param {string} playerId 
 * @param {string} missionId 
 */
export async function startMission(playerId, missionId) {
  if (!playerId || !missionId) return;
  const missionRef = doc(db, "players", playerId, "missionProgress", missionId);
  const snap = await getDoc(missionRef);

  if (!snap.exists()) {
    await setDoc(missionRef, {
      missionId,
      status: "in_progress",
      score: 0,
      attempts: 0,
      completedChallenges: [],
      hintsUsed: 0,
      startedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } else if (snap.data().status === "available") {
    await updateDoc(missionRef, {
      status: "in_progress",
      updatedAt: serverTimestamp()
    });
  }
}

/**
 * Completa una misión de forma idempotente, otorgando la bonificación y la insignia
 * @param {string} playerId 
 * @param {string} missionId 
 * @returns {Promise<{ bonusXP: number, badge: object|null, nextMissionId: string|null, isFirstCompletion: boolean }>}
 */
export async function completeMission(playerId, missionId) {
  if (!playerId || !missionId) {
    throw new Error("Parámetros requeridos para completar misión.");
  }

  const missionMeta = getMissionById(missionId);
  if (!missionMeta) throw new Error("Misión no encontrada.");

  const playerRef = doc(db, "players", playerId);
  const missionRef = doc(db, "players", playerId, "missionProgress", missionId);

  let bonusXP = 0;
  let isFirstCompletion = false;
  let nextMissionId = null;

  // Determinar siguiente misión
  const currentIndex = MISSIONS.findIndex(m => m.id === missionId);
  if (currentIndex >= 0 && currentIndex < MISSIONS.length - 1) {
    nextMissionId = MISSIONS[currentIndex + 1].id;
  }

  await runTransaction(db, async (transaction) => {
    const [playerSnap, missionSnap] = await Promise.all([
      transaction.get(playerRef),
      transaction.get(missionRef)
    ]);

    if (!playerSnap.exists()) throw new Error("Jugador no encontrado.");

    const playerData = playerSnap.data();
    const completedList = playerData.completedMissions || [];
    const alreadyCompleted = completedList.includes(missionId);

    if (!alreadyCompleted) {
      isFirstCompletion = true;
      bonusXP = missionMeta.experienceReward || GAME_CONFIG.scoring.missionCompletionBonusXP;
    } else {
      bonusXP = 0;
    }

    const nextXP = (playerData.experience || 0) + bonusXP;
    const computedRank = getRankByXP(nextXP).name;
    const nextCompletedList = Array.from(new Set([...completedList, missionId]));

    // 1. Actualizar jugador
    transaction.update(playerRef, {
      experience: nextXP,
      rank: computedRank,
      completedMissions: nextCompletedList,
      currentMission: nextMissionId || missionId,
      updatedAt: serverTimestamp(),
      lastActivityAt: serverTimestamp()
    });

    // 2. Actualizar subcolección missionProgress
    transaction.set(missionRef, {
      missionId,
      status: "completed",
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
  });

  // Otorgar insignia si corresponde
  let badgeResult = null;
  if (missionMeta.badgeId) {
    try {
      const award = await awardBadge(playerId, missionMeta.badgeId, missionId);
      badgeResult = award.badge;
    } catch (e) {
      console.warn("Error al otorgar insignia de la misión:", e);
    }
  }

  // Registrar evento
  if (isFirstCompletion) {
    try {
      await addDoc(collection(db, "activityLog"), {
        playerId,
        missionId,
        eventType: "MISSION_COMPLETED",
        description: `Misión ${missionMeta.title} completada con éxito (+${bonusXP} XP).`,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.warn("Error en activityLog:", e);
    }
  }

  return {
    bonusXP,
    badge: badgeResult,
    nextMissionId,
    isFirstCompletion
  };
}

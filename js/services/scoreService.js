/**
 * Servicio de Puntuaciones y Resultados de Desafíos (Idempotente)
 */

import {
  db,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
  increment,
  runTransaction
} from "../firebase.js";
import { GAME_CONFIG, getRankByXP } from "../data/gameConfig.js";

/**
 * Consulta el resultado previo de un desafío para el jugador
 * @param {string} playerId 
 * @param {string} challengeId 
 * @returns {Promise<object|null>}
 */
export async function getChallengeResult(playerId, challengeId) {
  if (!playerId || !challengeId) return null;
  const challengeRef = doc(db, "players", playerId, "challengeResults", challengeId);
  const snap = await getDoc(challengeRef);
  return snap.exists() ? snap.data() : null;
}

/**
 * Registra el resultado de un desafío y otorga XP de forma idempotente
 * @param {object} params
 * @param {string} params.playerId
 * @param {string} params.missionId
 * @param {string} params.challengeId
 * @param {boolean} params.isCorrect
 * @param {number} params.attempts
 * @param {number} params.hintsUsed
 * @returns {Promise<{ awardedXP: number, isFirstCompletion: boolean, totalXP: number, newRank: string }>}
 */
export async function recordChallengeResult({
  playerId,
  missionId,
  challengeId,
  isCorrect,
  attempts = 1,
  hintsUsed = 0
}) {
  if (!playerId || !challengeId) {
    throw new Error("Parámetros insuficientes para registrar resultado.");
  }

  const challengeRef = doc(db, "players", playerId, "challengeResults", challengeId);
  const playerRef = doc(db, "players", playerId);
  const missionProgressRef = doc(db, "players", playerId, "missionProgress", missionId);

  let awardedXP = 0;
  let isFirstCompletion = false;
  let totalXP = 0;
  let newRank = "";

  // Ejecución en transacción para garantizar consistencia atómica
  await runTransaction(db, async (transaction) => {
    const [challengeSnap, playerSnap, missionSnap] = await Promise.all([
      transaction.get(challengeRef),
      transaction.get(playerRef),
      transaction.get(missionProgressRef)
    ]);

    if (!playerSnap.exists()) {
      throw new Error("El documento del jugador no existe.");
    }

    const currentPlayerData = playerSnap.data();
    const existingResult = challengeSnap.exists() ? challengeSnap.data() : null;

    // Verificar si ya había sido superado previamente con éxito
    const alreadyCompleted = existingResult && existingResult.isCorrect;

    if (isCorrect && !alreadyCompleted) {
      isFirstCompletion = true;
      const base = GAME_CONFIG.scoring.challengeBaseXP;
      const penalty = (hintsUsed || 0) * GAME_CONFIG.scoring.hintPenaltyXP;
      awardedXP = Math.max(GAME_CONFIG.scoring.minChallengeXP, base - penalty);
    } else {
      awardedXP = 0; // Sin puntos adicionales si ya estaba resuelto o si falló
    }

    const nextXP = (currentPlayerData.experience || 0) + awardedXP;
    const computedRank = getRankByXP(nextXP).name;

    totalXP = nextXP;
    newRank = computedRank;

    // 1. Guardar resultado del desafío
    transaction.set(challengeRef, {
      challengeId,
      missionId,
      isCorrect: !!isCorrect,
      scoreAwarded: isFirstCompletion ? awardedXP : (existingResult?.scoreAwarded || 0),
      attempts: (existingResult?.attempts || 0) + attempts,
      hintsUsed: Math.max(existingResult?.hintsUsed || 0, hintsUsed),
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });

    // 2. Actualizar jugador
    transaction.update(playerRef, {
      experience: nextXP,
      rank: computedRank,
      updatedAt: serverTimestamp(),
      lastActivityAt: serverTimestamp()
    });

    // 3. Actualizar subcolección missionProgress
    const currentCompleted = missionSnap.exists() ? (missionSnap.data().completedChallenges || []) : [];
    const nextCompletedChallenges = Array.from(new Set([...currentCompleted, ...(isCorrect ? [challengeId] : [])]));
    const currentMissionScore = (missionSnap.exists() ? (missionSnap.data().score || 0) : 0) + awardedXP;
    const currentHintsUsed = (missionSnap.exists() ? (missionSnap.data().hintsUsed || 0) : 0) + hintsUsed;
    const currentAttempts = (missionSnap.exists() ? (missionSnap.data().attempts || 0) : 0) + attempts;

    transaction.set(missionProgressRef, {
      missionId,
      score: currentMissionScore,
      completedChallenges: nextCompletedChallenges,
      hintsUsed: currentHintsUsed,
      attempts: currentAttempts,
      status: missionSnap.exists() ? (missionSnap.data().status || "in_progress") : "in_progress",
      updatedAt: serverTimestamp()
    }, { merge: true });
  });

  // Registrar en activityLog si fue la primera vez
  if (isFirstCompletion) {
    try {
      await addDoc(collection(db, "activityLog"), {
        playerId,
        missionId,
        eventType: "CHALLENGE_SOLVED",
        description: `Desafío ${challengeId} superado (+${awardedXP} XP).`,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.warn("Error en activityLog:", e);
    }
  }

  return {
    awardedXP,
    isFirstCompletion,
    totalXP,
    newRank
  };
}

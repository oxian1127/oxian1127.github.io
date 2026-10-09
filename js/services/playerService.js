/**
 * Servicio de Jugador: Creación, lectura, persistencia en Firestore y localStorage
 */

import {
  db,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp
} from "../firebase.js";
import { GAME_CONFIG, getRankByXP } from "../data/gameConfig.js";

/**
 * Limpia y valida el alias del estudiante
 * @param {string} rawAlias 
 * @returns {string} Alias saneado
 */
export function cleanAlias(rawAlias) {
  if (!rawAlias) return "Agente_Cero";
  // Elimina caracteres de control y etiquetas HTML
  let cleaned = String(rawAlias).replace(/<[^>]*>?/gm, "").trim();
  // Limita longitud entre 3 y 20 caracteres
  cleaned = cleaned.replace(/[^a-zA-Z0-9_\-áéíóúÁÉÍÓÚñÑ\s]/g, "");
  if (cleaned.length < 2) return "Agente_" + Math.floor(100 + Math.random() * 900);
  return cleaned.substring(0, 20);
}

/**
 * Genera un ID de participante aleatorio y seguro para el navegador
 * @returns {string} ID con formato p_xxxx_xxxx
 */
export function generatePlayerId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return "p_" + crypto.randomUUID().replace(/-/g, "").substring(0, 14);
  }
  const rand1 = Math.random().toString(36).substring(2, 9);
  const rand2 = Math.random().toString(36).substring(2, 9);
  return `p_${rand1}_${rand2}`;
}

/**
 * Guarda credenciales de sesión en localStorage
 */
export function storePlayerLocally(playerId, alias) {
  try {
    localStorage.setItem(GAME_CONFIG.storageKeys.playerId, playerId);
    localStorage.setItem(GAME_CONFIG.storageKeys.playerAlias, alias);
  } catch (err) {
    console.warn("No se pudo escribir en localStorage:", err);
  }
}

/**
 * Obtiene el ID guardado en este dispositivo
 */
export function getStoredPlayerId() {
  try {
    return localStorage.getItem(GAME_CONFIG.storageKeys.playerId) || null;
  } catch (err) {
    return null;
  }
}

/**
 * Elimina la partida guardada localmente
 */
export function clearLocalPlayer() {
  try {
    localStorage.removeItem(GAME_CONFIG.storageKeys.playerId);
    localStorage.removeItem(GAME_CONFIG.storageKeys.playerAlias);
  } catch (err) {
    console.warn("No se pudo limpiar localStorage:", err);
  }
}

/**
 * Crea un nuevo participante en Firestore
 * @param {string} rawAlias 
 * @returns {Promise<object>} Datos del jugador creado
 */
export async function createPlayer(rawAlias) {
  const alias = cleanAlias(rawAlias);
  const playerId = generatePlayerId();
  const initialRank = GAME_CONFIG.ranks[0].name;

  const playerData = {
    playerId,
    alias,
    experience: 0,
    completedMissions: [],
    unlockedBadges: [],
    currentMission: "mission_1",
    rank: initialRank,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastActivityAt: serverTimestamp()
  };

  const playerRef = doc(db, "players", playerId);
  await setDoc(playerRef, playerData);

  // Registrar evento en activityLog
  try {
    await addDoc(collection(db, "activityLog"), {
      playerId,
      eventType: "PLAYER_REGISTERED",
      description: `Agente ${alias} incorporado a la unidad de rescate.`,
      createdAt: serverTimestamp()
    });
  } catch (logErr) {
    console.warn("Error al registrar evento de auditoría:", logErr);
  }

  // Guardar en almacenamiento local
  storePlayerLocally(playerId, alias);

  return {
    ...playerData,
    id: playerId,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastActivityAt: new Date()
  };
}

/**
 * Obtiene el documento de un participante por su ID
 * @param {string} playerId 
 * @returns {Promise<object|null>}
 */
export async function getPlayer(playerId) {
  if (!playerId) return null;
  const playerRef = doc(db, "players", playerId);
  const snapshot = await getDoc(playerRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data
  };
}

/**
 * Actualiza la última actividad del jugador en Firestore
 * @param {string} playerId 
 */
export async function updatePlayerActivity(playerId) {
  if (!playerId) return;
  try {
    const playerRef = doc(db, "players", playerId);
    await updateDoc(playerRef, {
      lastActivityAt: serverTimestamp()
    });
  } catch (err) {
    console.warn("No se pudo actualizar actividad del participante:", err);
  }
}

/**
 * Reinicia el progreso del jugador actual
 * @param {string} playerId 
 * @returns {Promise<object>} Datos actualizados
 */
export async function resetPlayerProgress(playerId) {
  if (!playerId) throw new Error("ID de jugador requerido.");

  const initialRank = GAME_CONFIG.ranks[0].name;
  const playerRef = doc(db, "players", playerId);

  const resetData = {
    experience: 0,
    completedMissions: [],
    unlockedBadges: [],
    currentMission: "mission_1",
    rank: initialRank,
    updatedAt: serverTimestamp(),
    lastActivityAt: serverTimestamp()
  };

  await updateDoc(playerRef, resetData);

  // Registrar en activityLog
  try {
    await addDoc(collection(db, "activityLog"), {
      playerId,
      eventType: "PLAYER_RESET",
      description: `El progreso del agente ha sido restablecido a cero por solicitud propia.`,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    console.warn("Error al registrar reseteo:", err);
  }

  const current = await getPlayer(playerId);
  return current;
}

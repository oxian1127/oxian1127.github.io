/**
 * Servicio de Insignias y Logros
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
  serverTimestamp
} from "../firebase.js";
import { BADGES, getBadgeById } from "../data/badges.js";

/**
 * Otorga una insignia al jugador si no la posee aún
 * @param {string} playerId 
 * @param {string} badgeId 
 * @param {string} missionId 
 * @returns {Promise<{ awarded: boolean, badge: object }>}
 */
export async function awardBadge(playerId, badgeId, missionId) {
  if (!playerId || !badgeId) {
    throw new Error("Parámetros requeridos para otorgar insignia.");
  }

  const badgeMeta = getBadgeById(badgeId);
  if (!badgeMeta) {
    throw new Error(`Insignia desconocida: ${badgeId}`);
  }

  const badgeRef = doc(db, "players", playerId, "badgeAwards", badgeId);
  const badgeSnap = await getDoc(badgeRef);

  if (badgeSnap.exists()) {
    return { awarded: false, badge: badgeMeta };
  }

  const awardData = {
    badgeId,
    name: badgeMeta.name,
    missionId: missionId || badgeMeta.missionId,
    awardedAt: serverTimestamp()
  };

  // Guardar en la subcolección badgeAwards
  await setDoc(badgeRef, awardData);

  // Añadir al array de insignias del documento del jugador
  const playerRef = doc(db, "players", playerId);
  const playerSnap = await getDoc(playerRef);

  if (playerSnap.exists()) {
    const currentBadges = playerSnap.data().unlockedBadges || [];
    if (!currentBadges.includes(badgeId)) {
      await updateDoc(playerRef, {
        unlockedBadges: [...currentBadges, badgeId],
        updatedAt: serverTimestamp()
      });
    }
  }

  // Registrar en activityLog
  try {
    await addDoc(collection(db, "activityLog"), {
      playerId,
      missionId,
      eventType: "BADGE_AWARDED",
      description: `Insignia desbloqueada: «${badgeMeta.name}»`,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    console.warn("Error en log de insignia:", err);
  }

  return { awarded: true, badge: badgeMeta };
}

/**
 * Obtiene el detalle de insignias conseguidas por el participante
 * @param {string} playerId 
 * @returns {Promise<Array>} Lista de insignias con fecha de desbloqueo
 */
export async function getPlayerBadges(playerId) {
  if (!playerId) return [];
  try {
    const awardsCol = collection(db, "players", playerId, "badgeAwards");
    const snap = await getDocs(awardsCol);
    const awardedMap = new Map();

    snap.forEach((d) => {
      awardedMap.set(d.id, d.data());
    });

    return BADGES.map((b) => {
      const award = awardedMap.get(b.id);
      return {
        ...b,
        isUnlocked: !!award,
        awardedAt: award?.awardedAt ? (award.awardedAt.toDate ? award.awardedAt.toDate() : new Date()) : null
      };
    });
  } catch (err) {
    console.warn("Error al cargar insignias:", err);
    return BADGES.map(b => ({ ...b, isUnlocked: false, awardedAt: null }));
  }
}

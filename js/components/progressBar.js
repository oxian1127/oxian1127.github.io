/**
 * Componente de Barra de Progreso y Medidor de Nivel
 */

import { GAME_CONFIG, getRankByXP } from "../data/gameConfig.js";

/**
 * Renderiza o actualiza una barra de progreso general
 * @param {HTMLElement} container 
 * @param {number} percentage Entre 0 y 100
 * @param {string} [label] 
 */
export function renderProgressBar(container, percentage, label = "") {
  if (!container) return;
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)));

  container.innerHTML = `
    <div class="progress-bar-wrapper" role="progressbar" aria-valuenow="${clamped}" aria-valuemin="0" aria-valuemax="100">
      ${label ? `<div class="progress-label-row"><span>${label}</span><strong>${clamped}%</strong></div>` : ""}
      <div class="progress-track">
        <div class="progress-fill" style="width: ${clamped}%;">
          <div class="progress-glow"></div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renderiza la tarjeta de rango y nivel de XP con la distancia al siguiente rango
 * @param {HTMLElement} container 
 * @param {number} experience 
 */
export function renderRankCard(container, experience = 0) {
  if (!container) return;
  const xp = Number(experience) || 0;
  const currentRank = getRankByXP(xp);
  const ranks = GAME_CONFIG.ranks;
  const currentIndex = ranks.findIndex(r => r.id === currentRank.id);

  let nextRank = null;
  let percentToNext = 100;
  let xpNeeded = 0;

  if (currentIndex < ranks.length - 1) {
    nextRank = ranks[currentIndex + 1];
    const prevThreshold = currentRank.minXP;
    const nextThreshold = nextRank.minXP;
    const span = nextThreshold - prevThreshold;
    const progressInSpan = xp - prevThreshold;
    percentToNext = Math.min(100, Math.max(0, Math.round((progressInSpan / span) * 100)));
    xpNeeded = nextThreshold - xp;
  }

  container.innerHTML = `
    <div class="rank-card">
      <div class="rank-header">
        <div class="rank-badge-icon" style="border-color: ${currentRank.badgeColor}; color: ${currentRank.badgeColor};">
          ★
        </div>
        <div>
          <span class="rank-badge-label">RANGO ACTUAL</span>
          <h3 class="rank-title" style="color: ${currentRank.badgeColor};">${currentRank.name}</h3>
        </div>
      </div>
      <p class="rank-description">${currentRank.description}</p>
      <div class="rank-xp-info">
        <span><strong>${xp}</strong> XP acumulados</span>
        ${nextRank ? `<span>Faltan <strong>${xpNeeded} XP</strong> para ${nextRank.name}</span>` : `<span>¡Rango Máximo Alcanzado!</span>`}
      </div>
      <div class="progress-track rank-progress-track">
        <div class="progress-fill" style="width: ${percentToNext}%; background: linear-gradient(90deg, #0077fe, ${currentRank.badgeColor});"></div>
      </div>
    </div>
  `;
}

/**
 * Componente para renderizar tarjetas de misiones en el Mapa de Misiones
 */

import { getBadgeById } from "../data/badges.js";

/**
 * Crea el elemento HTML de una tarjeta de misión
 * @param {object} mission 
 * @param {object} options
 * @param {boolean} options.isLocked
 * @param {boolean} options.isCompleted
 * @param {boolean} options.isInProgress
 * @param {Function} options.onSelect
 * @returns {HTMLElement}
 */
export function createMissionCard(mission, { isLocked, isCompleted, isInProgress, onSelect }) {
  const card = document.createElement("div");
  card.className = `mission-card ${isCompleted ? 'mission-completed' : ''} ${isLocked ? 'mission-locked' : ''} ${isInProgress ? 'mission-in-progress' : ''}`;
  card.setAttribute("data-mission-id", mission.id);

  const badge = getBadgeById(mission.badgeId);

  let statusBadgeHtml = "";
  let actionBtnText = "Iniciar Misión";
  let actionBtnClass = "btn-primary";

  if (isCompleted) {
    statusBadgeHtml = `<span class="badge-status status-completed">✓ Completada</span>`;
    actionBtnText = "Repasar Misión";
    actionBtnClass = "btn-outline";
  } else if (isInProgress) {
    statusBadgeHtml = `<span class="badge-status status-in-progress">⚡ En Curso</span>`;
    actionBtnText = "Continuar Misión";
    actionBtnClass = "btn-accent";
  } else if (isLocked) {
    statusBadgeHtml = `<span class="badge-status status-locked">🔒 Bloqueada</span>`;
    actionBtnText = "Bloqueada";
    actionBtnClass = "btn-disabled";
  } else {
    statusBadgeHtml = `<span class="badge-status status-available">✦ Disponible</span>`;
  }

  const topicsHtml = (mission.contentTopics || [])
    .map(t => `<span class="topic-pill">${t}</span>`)
    .join("");

  card.innerHTML = `
    <div class="mission-card-header">
      <div class="mission-number">MISIÓN 0${mission.order}</div>
      ${statusBadgeHtml}
    </div>

    <div class="mission-card-body">
      <div class="mission-title-group">
        <div class="mission-icon-circle">${mission.icon}</div>
        <div>
          <h3 class="mission-title">${mission.title}</h3>
          <span class="mission-district">${mission.districtName}</span>
        </div>
      </div>

      <p class="mission-subtitle">${mission.subtitle}</p>

      <div class="mission-topics-list">
        ${topicsHtml}
      </div>

      <div class="mission-rewards-row">
        <div class="reward-xp">
          <span class="xp-icon">⚡</span>
          <span>+${mission.experienceReward} XP</span>
        </div>
        ${badge ? `
          <div class="reward-badge-preview" title="Recompensa: ${badge.name}">
            <span class="badge-mini-icon">${badge.svgIcon}</span>
            <span class="badge-mini-name">${badge.name}</span>
          </div>
        ` : ""}
      </div>
    </div>

    <div class="mission-card-footer">
      <button type="button" class="btn ${actionBtnClass} mission-action-btn" ${isLocked ? 'disabled aria-disabled="true"' : ''}>
        ${actionBtnText}
      </button>
    </div>
  `;

  const btn = card.querySelector(".mission-action-btn");
  if (!isLocked && typeof onSelect === "function") {
    btn.addEventListener("click", () => onSelect(mission.id));
    // Permitir hacer clic en toda la tarjeta si no está bloqueada
    card.addEventListener("click", (e) => {
      if (!e.target.closest("button")) {
        onSelect(mission.id);
      }
    });
  }

  return card;
}

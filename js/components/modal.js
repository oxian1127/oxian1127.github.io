/**
 * Componente de Modales Accesibles y Diálogos con NEXO
 */

let modalRoot = null;
let activeModal = null;
let lastFocusedElement = null;

function ensureModalRoot() {
  if (!modalRoot) {
    modalRoot = document.getElementById("modal-root");
    if (!modalRoot) {
      modalRoot = document.createElement("div");
      modalRoot.id = "modal-root";
      document.body.appendChild(modalRoot);
    }
  }
  return modalRoot;
}

/**
 * Abre un modal genérico
 * @param {object} options
 * @param {string} options.title
 * @param {string} options.contentHtml
 * @param {string} [options.icon]
 * @param {string} [options.type] 'nexo' | 'badge' | 'confirm' | 'default'
 * @param {Array<{ label: string, className?: string, onClick?: Function, isPrimary?: boolean }>} [options.actions]
 * @param {Function} [options.onClose]
 */
export function openModal({
  title,
  contentHtml,
  icon = "",
  type = "default",
  actions = [],
  onClose = null
}) {
  const root = ensureModalRoot();
  lastFocusedElement = document.activeElement;

  // Cerrar cualquier modal previo
  closeActiveModal();

  const backdrop = document.createElement("div");
  backdrop.className = `modal-backdrop modal-type-${type}`;
  backdrop.setAttribute("role", "dialog");
  backdrop.setAttribute("aria-modal", "true");
  backdrop.setAttribute("aria-label", title || "Diálogo");

  let actionsHtml = "";
  if (actions && actions.length > 0) {
    actionsHtml = `<div class="modal-actions">` +
      actions.map((act, index) => `
        <button type="button" class="btn ${act.className || (act.isPrimary ? 'btn-primary' : 'btn-secondary')}" data-action-index="${index}">
          ${act.label}
        </button>
      `).join("") +
      `</div>`;
  } else {
    actionsHtml = `
      <div class="modal-actions">
        <button type="button" class="btn btn-primary modal-btn-close">Entendido</button>
      </div>
    `;
  }

  backdrop.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-header">
        <div class="modal-title-group">
          ${icon ? `<span class="modal-icon">${icon}</span>` : ""}
          <h2 class="modal-title">${title}</h2>
        </div>
        <button type="button" class="modal-close-btn" aria-label="Cerrar">&times;</button>
      </div>
      <div class="modal-body">
        ${contentHtml}
      </div>
      ${actionsHtml}
    </div>
  `;

  // Controladores de eventos
  const close = () => {
    backdrop.classList.add("modal-closing");
    setTimeout(() => {
      if (backdrop.parentElement) backdrop.remove();
      if (activeModal === backdrop) activeModal = null;
      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
      }
      if (typeof onClose === "function") onClose();
    }, 250);
  };

  const closeBtn = backdrop.querySelector(".modal-close-btn");
  if (closeBtn) closeBtn.addEventListener("click", close);

  const defaultClose = backdrop.querySelector(".modal-btn-close");
  if (defaultClose) defaultClose.addEventListener("click", close);

  // Vincular acciones personalizadas
  const actionButtons = backdrop.querySelectorAll("[data-action-index]");
  actionButtons.forEach(btn => {
    const idx = parseInt(btn.getAttribute("data-action-index"), 10);
    const act = actions[idx];
    btn.addEventListener("click", () => {
      if (act && typeof act.onClick === "function") {
        const shouldClose = act.onClick();
        if (shouldClose !== false) close();
      } else {
        close();
      }
    });
  });

  // Cerrar al pulsar escape
  const keyHandler = (e) => {
    if (e.key === "Escape") {
      close();
      document.removeEventListener("keydown", keyHandler);
    }
  };
  document.addEventListener("keydown", keyHandler);

  // Cerrar al hacer clic en el backdrop fuera del diálogo
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) {
      close();
    }
  });

  root.appendChild(backdrop);
  activeModal = backdrop;

  requestAnimationFrame(() => {
    backdrop.classList.add("modal-open");
    const firstFocusable = backdrop.querySelector("button, input, [tabindex='0']");
    if (firstFocusable) firstFocusable.focus();
  });

  return { close };
}

export function closeActiveModal() {
  if (activeModal) {
    const closeBtn = activeModal.querySelector(".modal-close-btn");
    if (closeBtn) closeBtn.click();
    else if (activeModal.parentElement) activeModal.remove();
    activeModal = null;
  }
}

/**
 * Abre un modal narrativo específico con el avatar de NEXO
 * @param {string} title 
 * @param {string} message 
 * @param {string} [subtitle] 
 * @param {Array} [actions]
 */
export function showNexoBriefing(title, message, subtitle = "Transmisión de Inteligencia Artificial", actions = []) {
  const content = `
    <div class="nexo-dialogue-wrapper">
      <div class="nexo-avatar-pulse">
        <svg viewBox="0 0 48 48" fill="none" class="nexo-avatar-svg">
          <circle cx="24" cy="24" r="22" stroke="#00f0ff" stroke-width="2" stroke-dasharray="3 3"/>
          <circle cx="24" cy="24" r="14" fill="rgba(0,240,255,0.15)" stroke="#0077fe" stroke-width="2"/>
          <circle cx="24" cy="24" r="6" fill="#00f0ff"/>
          <line x1="10" y1="24" x2="38" y2="24" stroke="#00f0ff" stroke-width="1.5"/>
          <line x1="24" y1="10" x2="24" y2="38" stroke="#00f0ff" stroke-width="1.5"/>
        </svg>
      </div>
      <div class="nexo-message-box">
        <div class="nexo-badge-tag">${subtitle}</div>
        <p class="nexo-text">${message}</p>
      </div>
    </div>
  `;

  return openModal({
    title,
    contentHtml: content,
    type: "nexo",
    actions: actions.length > 0 ? actions : [{ label: "Recibido, NEXO", isPrimary: true }]
  });
}

/**
 * Abre el modal de celebración por desbloqueo de insignia
 * @param {object} badge 
 */
export function showBadgeModal(badge) {
  const content = `
    <div class="badge-celebration">
      <div class="badge-celebration-icon" style="color: ${badge.color};">
        ${badge.svgIcon}
      </div>
      <h3 class="badge-celebration-name">${badge.name}</h3>
      <p class="badge-celebration-desc">${badge.description}</p>
      <div class="badge-celebration-condition">
        <strong>Requisito cumplido:</strong> ${badge.condition}
      </div>
    </div>
  `;

  return openModal({
    title: "¡NUEVA INSIGNIA DESBLOQUEADA!",
    contentHtml: content,
    type: "badge",
    actions: [{ label: "Continuar Misión", isPrimary: true }]
  });
}

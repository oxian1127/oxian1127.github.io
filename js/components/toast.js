/**
 * Sistema de Notificaciones Toast Futurista
 */

let toastContainer = null;

function ensureToastContainer() {
  if (!toastContainer) {
    toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "toast-container";
      toastContainer.className = "toast-container";
      toastContainer.setAttribute("aria-live", "polite");
      document.body.appendChild(toastContainer);
    }
  }
  return toastContainer;
}

/**
 * Muestra una notificación emergente
 * @param {string} message 
 * @param {string} type 'success' | 'info' | 'warning' | 'error' | 'xp'
 * @param {number} duration Duración en ms (por defecto 4000)
 */
export function showToast(message, type = "info", duration = 4000) {
  const container = ensureToastContainer();
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: "✓",
    info: "ℹ",
    warning: "⚠",
    error: "✖",
    xp: "★"
  };

  const icon = iconMap[type] || "•";

  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-message">${message}</div>
    <button class="toast-close" aria-label="Cerrar notificación">&times;</button>
  `;

  const closeBtn = toast.querySelector(".toast-close");
  const removeToast = () => {
    toast.classList.add("toast-hiding");
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 300);
  };

  closeBtn.addEventListener("click", removeToast);
  container.appendChild(toast);

  // Animación de entrada
  requestAnimationFrame(() => {
    toast.classList.add("toast-visible");
  });

  if (duration > 0) {
    setTimeout(removeToast, duration);
  }
}

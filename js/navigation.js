/**
 * Gestor de Navegación SPA y Enrutamiento de Vistas
 */

import { state } from "./state.js";
import { sounds } from "./components/audioEffects.js";

const VIEW_IDS = [
  "inicio",
  "dashboard",
  "missions",
  "training",
  "achievements",
  "leaderboard",
  "profile",
  "mission-active"
];

export class NavigationManager {
  constructor() {
    this.sidebar = document.getElementById("app-sidebar");
    this.mobileNav = document.getElementById("mobile-bottom-nav");
    this.viewContainers = {};

    VIEW_IDS.forEach(id => {
      this.viewContainers[id] = document.getElementById(`view-${id}`);
    });

    this.bindNavLinks();
    this.bindSidebarToggle();
  }

  bindNavLinks() {
    // Escuchar clics en todos los enlaces con data-target-view
    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-target-view]");
      if (!link) return;

      e.preventDefault();
      const targetView = link.getAttribute("data-target-view");
      sounds.click();
      this.navigateTo(targetView);
    });
  }

  bindSidebarToggle() {
    const toggleBtn = document.getElementById("btn-toggle-sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");

    if (toggleBtn && this.sidebar) {
      toggleBtn.addEventListener("click", () => {
        const isOpen = this.sidebar.classList.toggle("sidebar-open");
        if (backdrop) backdrop.classList.toggle("backdrop-visible", isOpen);
      });
    }

    if (backdrop && this.sidebar) {
      backdrop.addEventListener("click", () => {
        this.sidebar.classList.remove("sidebar-open");
        backdrop.classList.remove("backdrop-visible");
      });
    }
  }

  navigateTo(viewId) {
    if (!VIEW_IDS.includes(viewId)) {
      console.warn(`Vista no reconocida: ${viewId}`);
      return;
    }

    // Si el jugador no ha iniciado sesión y quiere ir a una vista privada, redirigir a inicio
    if (!state.player && viewId !== "inicio") {
      this.navigateTo("inicio");
      return;
    }

    // Actualizar visibilidad de vistas
    VIEW_IDS.forEach(id => {
      const el = this.viewContainers[id];
      if (el) {
        if (id === viewId) {
          el.classList.remove("hidden-view");
          el.classList.add("active-view");
          el.setAttribute("aria-hidden", "false");
        } else {
          el.classList.add("hidden-view");
          el.classList.remove("active-view");
          el.setAttribute("aria-hidden", "true");
        }
      }
    });

    // Actualizar enlaces de navegación activos
    const navLinks = document.querySelectorAll("[data-target-view]");
    navLinks.forEach(link => {
      const target = link.getAttribute("data-target-view");
      const isTarget = target === viewId;
      link.classList.toggle("nav-active", isTarget);
      link.setAttribute("aria-current", isTarget ? "page" : "false");
    });

    // Controlar visibilidad del sidebar (ocultar en pantalla de inicio)
    const appShell = document.getElementById("app-shell");
    if (appShell) {
      appShell.classList.toggle("in-auth-mode", viewId === "inicio");
    }

    // Cerrar sidebar en pantallas táctiles
    if (this.sidebar && this.sidebar.classList.contains("sidebar-open")) {
      this.sidebar.classList.remove("sidebar-open");
      const backdrop = document.getElementById("sidebar-backdrop");
      if (backdrop) backdrop.classList.remove("backdrop-visible");
    }

    state.setCurrentView(viewId);

    // Scroll hacia arriba
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

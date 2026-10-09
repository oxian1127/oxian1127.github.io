/**
 * Motor del Juego Central «Operación Depuración: Encuentra el Error» (Misión 5)
 * Incluye inspección de código, detección de línea con bug, selección de corrección / reordenamiento y revisión de fallos.
 */

import { sounds } from "../components/audioEffects.js";
import { showToast } from "../components/toast.js";

export class DebuggingGame {
  /**
   * @param {object} options
   * @param {HTMLElement} options.container
   * @param {object} options.challenge
   * @param {Function} options.onComplete
   * @param {Function} options.onRequestHint
   */
  constructor({ container, challenge, onComplete, onRequestHint }) {
    this.container = container;
    this.challenge = challenge;
    this.onComplete = onComplete;
    this.onRequestHint = onRequestHint;

    this.selectedFixId = null;
    this.selectedLineNumber = null;
    this.attempts = 0;
    this.hintsUsed = 0;
    this.isSolved = false;

    // Para desafíos de reordenamiento de líneas (Desafío 1)
    this.isReorderMode = challenge.id === "m5_c1";
    this.reorderedLines = challenge.buggyCode ? [...challenge.buggyCode] : [];

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="game-debug-container">
        <!-- Banner narrativo del fallo -->
        <div class="debug-incident-report">
          <div class="incident-badge">⚠ INCIDENCIA CRÍTICA REPORTADA</div>
          <p class="incident-desc">${this.challenge.narrative}</p>
        </div>

        <div class="debug-workstation-grid">
          <!-- Visor de Código con Fallo -->
          <div class="debug-code-column">
            <div class="terminal-bar">
              <span class="terminal-dot red"></span>
              <span class="terminal-dot yellow"></span>
              <span class="terminal-dot green"></span>
              <span class="terminal-title">subsistema_afectado.debug</span>
            </div>

            <div class="code-inspector" id="code-inspector-lines">
              ${this.isReorderMode ? this.renderReorderableLines() : this.renderStaticLines()}
            </div>

            <div class="debug-expected-banner">
              <div class="expected-title">🎯 COMPORTAMIENTO ESPERADO:</div>
              <div class="expected-text">${this.challenge.expectedBehavior}</div>
            </div>
          </div>

          <!-- Panel de Corrección / Parche -->
          <div class="debug-patch-column">
            <div class="patch-panel-header">
              <span class="patch-icon">🛠</span>
              <span class="patch-title">PARCHE DE CORRECCIÓN</span>
            </div>

            <p class="patch-prompt">
              ${this.isReorderMode 
                ? "Utiliza los controles ▲ / ▼ para reorganizar las líneas en el orden seguro de ejecución."
                : "Selecciona el parche de código óptimo para reparar la anomalía detectada:"}
            </p>

            ${!this.isReorderMode ? `
              <div class="fix-options-list" role="radiogroup">
                ${this.renderFixOptions()}
              </div>
            ` : `
              <div class="reorder-helper-info">
                ✦ Las directivas de seguridad exigen que las comprobaciones previas se ejecuten antes de activar generadores de alta tensión.
              </div>
            `}

            <div class="game-controls-bar debug-controls-bar">
              <button type="button" class="btn btn-secondary btn-hint" id="btn-dbg-hint">
                💡 Pista de NEXO (-25 XP)
              </button>
              <button type="button" class="btn btn-primary" id="btn-dbg-apply">
                ⚡ Aplicar Parche y Probar
              </button>
            </div>
          </div>
        </div>

        <div class="game-feedback-box hidden" id="dbg-feedback-box"></div>
      </div>
    `;

    this.bindEvents();
  }

  renderStaticLines() {
    return this.challenge.buggyCode.map(line => `
      <div class="inspector-line" data-line="${line.line}">
        <span class="line-number">${line.line}</span>
        <span class="line-code">${this.escapeHtml(line.text)}</span>
      </div>
    `).join("");
  }

  renderReorderableLines() {
    return this.reorderedLines.map((line, idx) => `
      <div class="inspector-line reorderable-line" data-idx="${idx}">
        <span class="line-number">${idx + 1}</span>
        <span class="line-code">${this.escapeHtml(line.text)}</span>
        <div class="line-reorder-actions">
          <button type="button" class="btn-arrow btn-arrow-up" data-dir="up" data-idx="${idx}" ${idx === 0 ? 'disabled' : ''} title="Subir línea">▲</button>
          <button type="button" class="btn-arrow btn-arrow-down" data-dir="down" data-idx="${idx}" ${idx === this.reorderedLines.length - 1 ? 'disabled' : ''} title="Bajar línea">▼</button>
        </div>
      </div>
    `).join("");
  }

  renderFixOptions() {
    return this.challenge.fixOptions.map(opt => `
      <button type="button" class="decision-option-card fix-option-card" data-fix-id="${opt.id}" role="radio" aria-checked="false">
        <span class="option-radio-dot"></span>
        <span class="option-text">${opt.text}</span>
      </button>
    `).join("");
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  bindEvents() {
    // Si es reordenamiento (Desafío 1)
    if (this.isReorderMode) {
      const inspector = this.container.querySelector("#code-inspector-lines");
      inspector.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-arrow");
        if (!btn || btn.disabled) return;
        const dir = btn.getAttribute("data-dir");
        const idx = parseInt(btn.getAttribute("data-idx"), 10);
        sounds.click();
        this.moveLine(idx, dir);
      });
    } else {
      // Selección de parche
      const fixCards = this.container.querySelectorAll(".fix-option-card");
      fixCards.forEach(card => {
        card.addEventListener("click", () => {
          if (this.isSolved) return;
          sounds.click();

          fixCards.forEach(c => {
            c.classList.remove("option-selected");
            c.setAttribute("aria-checked", "false");
          });

          card.classList.add("option-selected");
          card.setAttribute("aria-checked", "true");
          this.selectedFixId = card.getAttribute("data-fix-id");
        });
      });
    }

    // Botón de Pista
    const hintBtn = this.container.querySelector("#btn-dbg-hint");
    hintBtn.addEventListener("click", () => {
      this.hintsUsed++;
      sounds.click();
      if (typeof this.onRequestHint === "function") {
        this.onRequestHint(this.challenge.hint);
      } else {
        showToast(`Pista de NEXO: ${this.challenge.hint}`, "warning", 6000);
      }
    });

    // Botón de Aplicar Parche
    const applyBtn = this.container.querySelector("#btn-dbg-apply");
    applyBtn.addEventListener("click", () => this.applyFixAndTest());
  }

  moveLine(idx, dir) {
    if (dir === "up" && idx > 0) {
      const temp = this.reorderedLines[idx];
      this.reorderedLines[idx] = this.reorderedLines[idx - 1];
      this.reorderedLines[idx - 1] = temp;
    } else if (dir === "down" && idx < this.reorderedLines.length - 1) {
      const temp = this.reorderedLines[idx];
      this.reorderedLines[idx] = this.reorderedLines[idx + 1];
      this.reorderedLines[idx + 1] = temp;
    }
    const inspector = this.container.querySelector("#code-inspector-lines");
    if (inspector) inspector.innerHTML = this.renderReorderableLines();
  }

  applyFixAndTest() {
    this.attempts++;
    const feedbackBox = this.container.querySelector("#dbg-feedback-box");
    feedbackBox.classList.remove("hidden");

    let isSuccess = false;

    if (this.isReorderMode) {
      // Validar si la línea de verificar campo magnético está antes de ignición
      // Inicialmente: línea 0 = ignición, línea 1 = verificar campo
      // Solución correcta: línea 0 contiene "verificar", línea 1 contiene "igniciar" o deuterio
      const firstLineText = this.reorderedLines[0].text;
      if (firstLineText.includes("verificar_campo_magnetico")) {
        isSuccess = true;
      }
    } else {
      if (!this.selectedFixId) {
        showToast("Selecciona una opción de corrección antes de probar.", "warning");
        return;
      }
      const chosen = this.challenge.fixOptions.find(f => f.id === this.selectedFixId);
      if (chosen && chosen.isCorrect) {
        isSuccess = true;
      }
    }

    if (isSuccess) {
      sounds.correct();
      this.isSolved = true;
      feedbackBox.className = "game-feedback-box feedback-success";
      feedbackBox.innerHTML = `
        <div class="feedback-title">✓ ¡Error Depurado con Éxito!</div>
        <p>${this.challenge.explanation}</p>
        <div class="feedback-sub">El subsistema ha sido verificado en pruebas unitarias y responde dentro de los parámetros estándar.</div>
      `;

      const applyBtn = this.container.querySelector("#btn-dbg-apply");
      applyBtn.disabled = true;
      applyBtn.textContent = "✓ Bug Erradicado";

      // Resaltar líneas en verde
      const lines = this.container.querySelectorAll(".inspector-line");
      lines.forEach(l => l.classList.add("line-fixed"));

      setTimeout(() => {
        if (typeof this.onComplete === "function") {
          this.onComplete({
            isCorrect: true,
            hintsUsed: this.hintsUsed,
            attempts: this.attempts
          });
        }
      }, 1200);

    } else {
      sounds.error();
      feedbackBox.className = "game-feedback-box feedback-error";
      feedbackBox.innerHTML = `
        <div class="feedback-title">⚠ El Fallo Persiste en Ejecución</div>
        <p>Ese parche no soluciona la discrepancia con el comportamiento esperado. Vuelve a inspeccionar el flujo de instrucciones.</p>
      `;
    }
  }
}

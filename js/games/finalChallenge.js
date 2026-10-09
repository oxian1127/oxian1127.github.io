/**
 * Motor del Desafío Final: Reconstrucción de Ciudad Algoritmia (Misión 6)
 * Estación interactiva que integra Secuencia, Condicionales, Bucles y Depuración.
 */

import { sounds } from "../components/audioEffects.js";
import { showToast } from "../components/toast.js";

export class FinalChallengeGame {
  /**
   * @param {object} options
   * @param {HTMLElement} options.container
   * @param {object} options.challenge (Fase activa)
   * @param {number} options.phaseIndex (0, 1, 2, 3)
   * @param {Function} options.onComplete
   * @param {Function} options.onRequestHint
   */
  constructor({ container, challenge, phaseIndex = 0, onComplete, onRequestHint }) {
    this.container = container;
    this.challenge = challenge;
    this.phaseIndex = phaseIndex;
    this.onComplete = onComplete;
    this.onRequestHint = onRequestHint;

    this.attempts = 0;
    this.hintsUsed = 0;
    this.isSolved = false;

    // Si es fase 1 (Secuencia)
    if (this.phaseIndex === 0) {
      this.currentOrder = [...this.challenge.initialOrder];
    } else {
      this.selectedOptionId = null;
    }

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="game-final-container">
        <!-- Indicador de Fases del Núcleo -->
        <div class="final-phases-stepper">
          <div class="stepper-phase ${this.phaseIndex >= 0 ? 'stepper-active' : ''} ${this.phaseIndex > 0 ? 'stepper-done' : ''}">
            <span class="stepper-num">1</span> Secuencia Kernel
          </div>
          <div class="stepper-phase ${this.phaseIndex >= 1 ? 'stepper-active' : ''} ${this.phaseIndex > 1 ? 'stepper-done' : ''}">
            <span class="stepper-num">2</span> Lógica Reactor
          </div>
          <div class="stepper-phase ${this.phaseIndex >= 2 ? 'stepper-active' : ''} ${this.phaseIndex > 2 ? 'stepper-done' : ''}">
            <span class="stepper-num">3</span> Purga en Bucle
          </div>
          <div class="stepper-phase ${this.phaseIndex >= 3 ? 'stepper-active' : ''}">
            <span class="stepper-num">4</span> Parche Raíz
          </div>
        </div>

        <div class="final-console-card">
          <div class="terminal-bar">
            <span class="terminal-dot red"></span>
            <span class="terminal-dot yellow"></span>
            <span class="terminal-dot green"></span>
            <span class="terminal-title">NUCLEO_CERO_TERMINAL_V10.SH</span>
          </div>

          <div class="final-phase-header">
            <h3 class="phase-title">${this.challenge.title}</h3>
            <p class="phase-instruction">${this.challenge.instruction}</p>
          </div>

          ${this.challenge.context ? `
            <div class="phase-telemetry">
              <strong>Telemetría del Núcleo:</strong> ${this.challenge.context}
            </div>
          ` : ""}

          ${this.challenge.codeSnippet ? `
            <pre class="terminal-code"><code>${this.escapeHtml(this.challenge.codeSnippet)}</code></pre>
          ` : ""}

          <!-- Cuerpo interactivo según fase -->
          <div class="phase-interactive-body">
            ${this.phaseIndex === 0 ? this.renderSequenceBody() : this.renderOptionsBody()}
          </div>

          <div class="game-controls-bar">
            <button type="button" class="btn btn-secondary btn-hint" id="btn-final-hint">
              💡 Consultar a NEXO
            </button>
            <button type="button" class="btn btn-primary" id="btn-final-submit" ${this.phaseIndex !== 0 ? 'disabled' : ''}>
              ⚡ Validar Fase ${this.phaseIndex + 1}
            </button>
          </div>

          <div class="game-feedback-box hidden" id="final-feedback-box"></div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  renderSequenceBody() {
    return `
      <ul class="sequence-list" id="final-sequence-list">
        ${this.currentOrder.map((item, idx) => `
          <li class="sequence-item" data-id="${item.id}" data-idx="${idx}">
            <div class="item-step-badge">F${idx + 1}</div>
            <div class="item-content-text">${item.text}</div>
            <div class="item-reorder-buttons">
              <button type="button" class="btn-arrow btn-arrow-up" data-dir="up" data-idx="${idx}" ${idx === 0 ? 'disabled' : ''}>▲</button>
              <button type="button" class="btn-arrow btn-arrow-down" data-dir="down" data-idx="${idx}" ${idx === this.currentOrder.length - 1 ? 'disabled' : ''}>▼</button>
            </div>
          </li>
        `).join("")}
      </ul>
    `;
  }

  renderOptionsBody() {
    return `
      <div class="decision-options-grid" role="radiogroup">
        ${this.challenge.options.map(opt => `
          <button type="button" class="decision-option-card final-option-card" data-opt-id="${opt.id}" role="radio" aria-checked="false">
            <span class="option-radio-dot"></span>
            <span class="option-text">${opt.text}</span>
          </button>
        `).join("")}
      </div>
    `;
  }

  bindEvents() {
    if (this.phaseIndex === 0) {
      const listEl = this.container.querySelector("#final-sequence-list");
      listEl.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-arrow");
        if (!btn || btn.disabled) return;
        const dir = btn.getAttribute("data-dir");
        const idx = parseInt(btn.getAttribute("data-idx"), 10);
        sounds.click();
        this.moveSeqItem(idx, dir);
      });
    } else {
      const optCards = this.container.querySelectorAll(".final-option-card");
      const submitBtn = this.container.querySelector("#btn-final-submit");
      optCards.forEach(c => {
        c.addEventListener("click", () => {
          if (this.isSolved) return;
          sounds.click();
          optCards.forEach(card => {
            card.classList.remove("option-selected");
            card.setAttribute("aria-checked", "false");
          });
          c.classList.add("option-selected");
          c.setAttribute("aria-checked", "true");
          this.selectedOptionId = c.getAttribute("data-opt-id");
          submitBtn.disabled = false;
        });
      });
    }

    const submitBtn = this.container.querySelector("#btn-final-submit");
    submitBtn.addEventListener("click", () => this.checkPhaseSolution());

    const hintBtn = this.container.querySelector("#btn-final-hint");
    hintBtn.addEventListener("click", () => {
      this.hintsUsed++;
      sounds.click();
      const hintMsg = this.phaseIndex === 0 
        ? "Recuerda: la memoria y el hardware son la base antes de activar redes e interfaz."
        : (this.challenge.hint || "Inspecciona cuidadosamente las condiciones lógicas y los datos del sensor.");
      if (typeof this.onRequestHint === "function") {
        this.onRequestHint(hintMsg);
      } else {
        showToast(`NEXO: ${hintMsg}`, "warning", 6000);
      }
    });
  }

  moveSeqItem(idx, dir) {
    if (dir === "up" && idx > 0) {
      const temp = this.currentOrder[idx];
      this.currentOrder[idx] = this.currentOrder[idx - 1];
      this.currentOrder[idx - 1] = temp;
    } else if (dir === "down" && idx < this.currentOrder.length - 1) {
      const temp = this.currentOrder[idx];
      this.currentOrder[idx] = this.currentOrder[idx + 1];
      this.currentOrder[idx + 1] = temp;
    }
    const listEl = this.container.querySelector("#final-sequence-list");
    if (listEl) listEl.innerHTML = this.renderSequenceBody();
  }

  checkPhaseSolution() {
    this.attempts++;
    const feedbackBox = this.container.querySelector("#final-feedback-box");
    feedbackBox.classList.remove("hidden");

    let isSuccess = false;

    if (this.phaseIndex === 0) {
      const currentIds = this.currentOrder.map(item => item.id);
      isSuccess = currentIds.every((id, idx) => id === this.challenge.correctOrderIds[idx]);
    } else {
      const chosen = this.challenge.options.find(o => o.id === this.selectedOptionId);
      isSuccess = chosen && chosen.isCorrect;
    }

    if (isSuccess) {
      sounds.correct();
      this.isSolved = true;
      feedbackBox.className = "game-feedback-box feedback-success";
      feedbackBox.innerHTML = `
        <div class="feedback-title">✓ ¡Fase ${this.phaseIndex + 1} Estabilizada!</div>
        <p>${this.challenge.explanation}</p>
      `;

      const submitBtn = this.container.querySelector("#btn-final-submit");
      submitBtn.disabled = true;
      submitBtn.textContent = "✓ Fase Completada";

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
        <div class="feedback-title">⚠ Desalineación en Fase ${this.phaseIndex + 1}</div>
        <p>El Núcleo Cero ha rechazado los parámetros de calibración. Revisa la lógica y prueba de nuevo.</p>
      `;
    }
  }
}

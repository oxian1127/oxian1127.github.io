/**
 * Motor del Bucle Infinito y Reconocimiento de Patrones (Misión 4)
 * Facilita la comprensión de estructuras repetitivas, iteraciones y optimización de código.
 */

import { sounds } from "../components/audioEffects.js";
import { showToast } from "../components/toast.js";

export class LoopGame {
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

    this.selectedOptionId = null;
    this.attempts = 0;
    this.hintsUsed = 0;
    this.isSolved = false;

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="game-loop-container">
        <div class="game-instruction-banner">
          <p class="instruction-context">${this.challenge.context || ""}</p>
        </div>

        ${this.challenge.codeSnippet ? `
          <div class="code-terminal-block">
            <div class="terminal-bar">
              <span class="terminal-dot red"></span>
              <span class="terminal-dot yellow"></span>
              <span class="terminal-dot green"></span>
              <span class="terminal-title">rutina_iterativa.alg</span>
            </div>
            <pre class="terminal-code"><code>${this.escapeHtml(this.challenge.codeSnippet)}</code></pre>
          </div>
        ` : ""}

        <div class="loop-question-prompt">
          ${this.challenge.instruction}
        </div>

        <div class="decision-options-grid" role="radiogroup">
          ${this.renderOptionsHtml()}
        </div>

        <div class="game-controls-bar">
          <button type="button" class="btn btn-secondary btn-hint" id="btn-loop-hint">
            💡 Consultar Pista a NEXO
          </button>
          <button type="button" class="btn btn-primary" id="btn-loop-submit" disabled>
            ⚡ Validar Patrón
          </button>
        </div>

        <div class="game-feedback-box hidden" id="loop-feedback-box"></div>
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

  renderOptionsHtml() {
    return this.challenge.options.map(opt => `
      <button type="button" class="decision-option-card" data-opt-id="${opt.id}" role="radio" aria-checked="false">
        <span class="option-radio-dot"></span>
        <span class="option-text">${opt.text}</span>
      </button>
    `).join("");
  }

  bindEvents() {
    const optionCards = this.container.querySelectorAll(".decision-option-card");
    const submitBtn = this.container.querySelector("#btn-loop-submit");

    optionCards.forEach(card => {
      card.addEventListener("click", () => {
        if (this.isSolved) return;
        sounds.click();

        optionCards.forEach(c => {
          c.classList.remove("option-selected");
          c.setAttribute("aria-checked", "false");
        });

        card.classList.add("option-selected");
        card.setAttribute("aria-checked", "true");
        this.selectedOptionId = card.getAttribute("data-opt-id");

        submitBtn.disabled = false;
      });
    });

    submitBtn.addEventListener("click", () => this.checkSolution());

    const hintBtn = this.container.querySelector("#btn-loop-hint");
    hintBtn.addEventListener("click", () => {
      this.hintsUsed++;
      sounds.click();
      if (typeof this.onRequestHint === "function") {
        this.onRequestHint(this.challenge.hint);
      } else {
        showToast(`Pista de NEXO: ${this.challenge.hint}`, "warning", 6000);
      }
    });
  }

  checkSolution() {
    if (!this.selectedOptionId || this.isSolved) return;
    this.attempts++;

    const chosen = this.challenge.options.find(o => o.id === this.selectedOptionId);
    const feedbackBox = this.container.querySelector("#loop-feedback-box");
    feedbackBox.classList.remove("hidden");

    if (chosen && chosen.isCorrect) {
      sounds.correct();
      this.isSolved = true;
      feedbackBox.className = "game-feedback-box feedback-success";
      feedbackBox.innerHTML = `
        <div class="feedback-title">✓ ¡Patrón Identificado con Éxito!</div>
        <p>${this.challenge.explanation}</p>
      `;

      const submitBtn = this.container.querySelector("#btn-loop-submit");
      submitBtn.disabled = true;
      submitBtn.textContent = "✓ Superado";

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
        <div class="feedback-title">⚠ Estructura Inexacta</div>
        <p>Ese bucle no reproduce fielmente la cantidad de pasos o el comportamiento esperado. Revisa cuántas repeticiones ocurren realmente.</p>
      `;
    }
  }
}

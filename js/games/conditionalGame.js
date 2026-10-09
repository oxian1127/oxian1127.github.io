/**
 * Motor del Centro de Decisiones (Misión 3: Estructuras Condicionales)
 * Evalúa bifurcaciones lógicas SI / ENTONCES / SINO ante escenarios de sensores.
 */

import { sounds } from "../components/audioEffects.js";
import { showToast } from "../components/toast.js";

export class ConditionalGame {
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
      <div class="game-conditional-container">
        <div class="game-instruction-banner">
          <p class="instruction-context"><strong>Lectura de Sensores:</strong> ${this.challenge.context}</p>
        </div>

        <div class="code-terminal-block">
          <div class="terminal-bar">
            <span class="terminal-dot red"></span>
            <span class="terminal-dot yellow"></span>
            <span class="terminal-dot green"></span>
            <span class="terminal-title">controlador_logico.alg</span>
          </div>
          <pre class="terminal-code"><code>${this.escapeHtml(this.challenge.codeSnippet)}</code></pre>
        </div>

        <div class="decision-question-prompt">
          ¿Qué acción ejecutará el sistema ante los valores actuales de los sensores?
        </div>

        <div class="decision-options-grid" role="radiogroup">
          ${this.renderOptionsHtml()}
        </div>

        <div class="game-controls-bar">
          <button type="button" class="btn btn-secondary btn-hint" id="btn-cond-hint">
            💡 Consultar Pista a NEXO
          </button>
          <button type="button" class="btn btn-primary" id="btn-cond-submit" disabled>
            ⚡ Validar Decisión
          </button>
        </div>

        <div class="game-feedback-box hidden" id="cond-feedback-box"></div>
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
    const submitBtn = this.container.querySelector("#btn-cond-submit");

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

    submitBtn.addEventListener("click", () => this.checkDecision());

    const hintBtn = this.container.querySelector("#btn-cond-hint");
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

  checkDecision() {
    if (!this.selectedOptionId || this.isSolved) return;
    this.attempts++;

    const chosenOption = this.challenge.options.find(o => o.id === this.selectedOptionId);
    const feedbackBox = this.container.querySelector("#cond-feedback-box");
    feedbackBox.classList.remove("hidden");

    if (chosenOption && chosenOption.isCorrect) {
      sounds.correct();
      this.isSolved = true;
      feedbackBox.className = "game-feedback-box feedback-success";
      feedbackBox.innerHTML = `
        <div class="feedback-title">✓ ¡Evaluación Condicional Correcta!</div>
        <p>${this.challenge.explanation}</p>
      `;

      const submitBtn = this.container.querySelector("#btn-cond-submit");
      submitBtn.disabled = true;
      submitBtn.textContent = "✓ Decisión Acertada";

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
        <div class="feedback-title">⚠ Inferencia Errónea</div>
        <p>Esa bifurcación no se activará con los datos provistos. Recuerda evaluar minuciosamente cada operador lógico (>, <, ==, Y, O).</p>
      `;
    }
  }
}

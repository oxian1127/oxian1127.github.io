/**
 * Motor del Juego de Secuencias (Misión 1: Reinicio del Sistema)
 * Permite ordenar instrucciones mediante botones de subir/bajar y teclado.
 */

import { sounds } from "../components/audioEffects.js";
import { showToast } from "../components/toast.js";

export class SequenceGame {
  /**
   * @param {object} options
   * @param {HTMLElement} options.container
   * @param {object} options.challenge
   * @param {Function} options.onComplete ({ isCorrect, hintsUsed, attempts })
   * @param {Function} options.onRequestHint
   */
  constructor({ container, challenge, onComplete, onRequestHint }) {
    this.container = container;
    this.challenge = challenge;
    this.onComplete = onComplete;
    this.onRequestHint = onRequestHint;

    this.currentOrder = [...challenge.initialOrder];
    this.attempts = 0;
    this.hintsUsed = 0;
    this.isSolved = false;

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="game-sequence-container">
        <div class="game-instruction-banner">
          <p class="instruction-text">${this.challenge.instruction}</p>
        </div>

        <div class="sequence-list-wrapper">
          <div class="sequence-header-hint">
            <span>Inicio del Algoritmo (Paso 1)</span>
            <span class="tech-arrow">▼</span>
          </div>

          <ul class="sequence-list" id="sequence-items-list" role="list">
            ${this.renderItemsHtml()}
          </ul>

          <div class="sequence-footer-hint">
            <span class="tech-arrow">▲</span>
            <span>Fin del Algoritmo (Paso final)</span>
          </div>
        </div>

        <div class="game-controls-bar">
          <button type="button" class="btn btn-secondary btn-hint" id="btn-seq-hint">
            💡 Solicitar Pista a NEXO
          </button>
          <button type="button" class="btn btn-primary btn-check" id="btn-seq-check">
            ⚡ Comprobar Secuencia
          </button>
        </div>

        <div class="game-feedback-box hidden" id="seq-feedback-box"></div>
      </div>
    `;

    this.bindEvents();
  }

  renderItemsHtml() {
    return this.currentOrder.map((item, index) => `
      <li class="sequence-item" data-id="${item.id}" data-index="${index}">
        <div class="item-step-badge">Paso 0${index + 1}</div>
        <div class="item-content-text">${item.text}</div>
        <div class="item-reorder-buttons">
          <button type="button" class="btn-arrow btn-arrow-up" data-dir="up" data-index="${index}" title="Subir paso" ${index === 0 ? 'disabled' : ''} aria-label="Subir paso ${index + 1}">
            ▲
          </button>
          <button type="button" class="btn-arrow btn-arrow-down" data-dir="down" data-index="${index}" title="Bajar paso" ${index === this.currentOrder.length - 1 ? 'disabled' : ''} aria-label="Bajar paso ${index + 1}">
            ▼
          </button>
        </div>
      </li>
    `).join("");
  }

  bindEvents() {
    // Botones de reordenamiento
    const listEl = this.container.querySelector("#sequence-items-list");
    listEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-arrow");
      if (!btn || btn.disabled) return;

      const dir = btn.getAttribute("data-dir");
      const index = parseInt(btn.getAttribute("data-index"), 10);
      sounds.click();
      this.moveItem(index, dir);
    });

    // Botón de comprobación
    const checkBtn = this.container.querySelector("#btn-seq-check");
    checkBtn.addEventListener("click", () => this.checkSolution());

    // Botón de pista
    const hintBtn = this.container.querySelector("#btn-seq-hint");
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

  moveItem(index, direction) {
    if (direction === "up" && index > 0) {
      const temp = this.currentOrder[index];
      this.currentOrder[index] = this.currentOrder[index - 1];
      this.currentOrder[index - 1] = temp;
    } else if (direction === "down" && index < this.currentOrder.length - 1) {
      const temp = this.currentOrder[index];
      this.currentOrder[index] = this.currentOrder[index + 1];
      this.currentOrder[index + 1] = temp;
    }

    const listEl = this.container.querySelector("#sequence-items-list");
    if (listEl) {
      listEl.innerHTML = this.renderItemsHtml();
    }
  }

  checkSolution() {
    this.attempts++;
    const currentIds = this.currentOrder.map(item => item.id);
    const correctIds = this.challenge.correctOrderIds;

    const isMatch = currentIds.every((id, idx) => id === correctIds[idx]);
    const feedbackBox = this.container.querySelector("#seq-feedback-box");
    feedbackBox.classList.remove("hidden");

    if (isMatch) {
      sounds.correct();
      this.isSolved = true;
      feedbackBox.className = "game-feedback-box feedback-success";
      feedbackBox.innerHTML = `
        <div class="feedback-title">✓ Secuencia Correcta</div>
        <p>${this.challenge.feedbacks.success}</p>
        <div class="feedback-explanation"><strong>Explicación:</strong> ${this.challenge.explanation}</div>
      `;

      // Deshabilitar botones de comprobación
      const checkBtn = this.container.querySelector("#btn-seq-check");
      if (checkBtn) {
        checkBtn.disabled = true;
        checkBtn.textContent = "✓ Superado";
      }

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
        <div class="feedback-title">⚠ Orden Incorrecto</div>
        <p>${this.challenge.feedbacks.error}</p>
        <p class="feedback-sub">Revisa la relación de causa y efecto de cada paso y vuelve a intentarlo.</p>
      `;
    }
  }
}

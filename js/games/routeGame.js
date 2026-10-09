/**
 * Motor de Rutas Inteligentes y Navegación Cuadriculada (Misión 2)
 * Simula un robot autómata ejecutando un programa secuencial de movimientos.
 */

import { sounds } from "../components/audioEffects.js";
import { showToast } from "../components/toast.js";

export class RouteGame {
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

    this.gridSize = challenge.gridSize || 4;
    this.program = []; // Array de strings: 'FORWARD', 'TURN_LEFT', 'TURN_RIGHT'
    this.robotState = { ...challenge.start };
    this.isRunning = false;
    this.attempts = 0;
    this.hintsUsed = 0;

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="game-route-container">
        <div class="game-instruction-banner">
          <p class="instruction-text">${this.challenge.instruction}</p>
        </div>

        <div class="route-board-layout">
          <!-- Cuadrícula interactiva -->
          <div class="route-grid-wrapper">
            <div class="route-grid" id="route-grid-board" style="--grid-size: ${this.gridSize};">
              ${this.renderGridCells()}
            </div>
          </div>

          <!-- Panel de programación de comandos -->
          <div class="route-programmer-panel">
            <div class="programmer-header">
              <span class="programmer-title">SECUENCIA DE INSTRUCCIONES</span>
              <span class="programmer-counter" id="prog-counter">0 / ${this.challenge.maxCommands}</span>
            </div>

            <div class="command-queue-display" id="command-queue" role="list">
              <div class="queue-empty-placeholder">Selecciona instrucciones para programar al robot...</div>
            </div>

            <div class="command-buttons-bar">
              <button type="button" class="btn-cmd" data-cmd="FORWARD" title="Avanzar 1 casilla">
                <span class="cmd-icon">▲</span>
                <span class="cmd-name">Avanzar</span>
              </button>
              <button type="button" class="btn-cmd" data-cmd="TURN_LEFT" title="Girar 90° a la izquierda">
                <span class="cmd-icon">↺</span>
                <span class="cmd-name">Girar Izq</span>
              </button>
              <button type="button" class="btn-cmd" data-cmd="TURN_RIGHT" title="Girar 90° a la derecha">
                <span class="cmd-icon">↻</span>
                <span class="cmd-name">Girar Der</span>
              </button>
            </div>

            <div class="programmer-action-bar">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-prog-undo" title="Borrar último comando">
                ⌫ Borrar
              </button>
              <button type="button" class="btn btn-secondary btn-sm" id="btn-prog-clear" title="Limpiar todo">
                🗑 Limpiar
              </button>
              <button type="button" class="btn btn-secondary btn-sm" id="btn-route-hint">
                💡 Pista
              </button>
              <button type="button" class="btn btn-primary" id="btn-run-program">
                ▶ Ejecutar Algoritmo
              </button>
            </div>
          </div>
        </div>

        <div class="game-feedback-box hidden" id="route-feedback-box"></div>
      </div>
    `;

    this.bindEvents();
    this.updateRobotVisual();
  }

  renderGridCells() {
    let cellsHtml = "";
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        const isTarget = this.challenge.target.x === x && this.challenge.target.y === y;
        const isObstacle = (this.challenge.obstacles || []).some(o => o.x === x && o.y === y);
        let cellClass = "grid-cell";
        let content = "";

        if (isTarget) {
          cellClass += " cell-target";
          content = `<div class="target-marker" title="Objetivo">⚡</div>`;
        } else if (isObstacle) {
          cellClass += " cell-obstacle";
          content = `<div class="obstacle-marker" title="Campo de fuerza">❌</div>`;
        }

        cellsHtml += `
          <div class="${cellClass}" data-x="${x}" data-y="${y}">
            ${content}
          </div>
        `;
      }
    }
    return cellsHtml;
  }

  bindEvents() {
    // Añadir comandos
    const cmdButtons = this.container.querySelectorAll(".btn-cmd");
    cmdButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        if (this.isRunning) return;
        if (this.program.length >= this.challenge.maxCommands) {
          showToast(`Límite máximo de ${this.challenge.maxCommands} comandos alcanzado.`, "warning");
          return;
        }
        const cmd = btn.getAttribute("data-cmd");
        sounds.click();
        this.program.push(cmd);
        this.renderQueue();
      });
    });

    // Deshacer comando
    const undoBtn = this.container.querySelector("#btn-prog-undo");
    undoBtn.addEventListener("click", () => {
      if (this.isRunning || this.program.length === 0) return;
      sounds.click();
      this.program.pop();
      this.renderQueue();
    });

    // Limpiar programa
    const clearBtn = this.container.querySelector("#btn-prog-clear");
    clearBtn.addEventListener("click", () => {
      if (this.isRunning) return;
      sounds.click();
      this.program = [];
      this.resetRobotPosition();
      this.renderQueue();
    });

    // Pista
    const hintBtn = this.container.querySelector("#btn-route-hint");
    hintBtn.addEventListener("click", () => {
      this.hintsUsed++;
      sounds.click();
      if (typeof this.onRequestHint === "function") {
        this.onRequestHint(this.challenge.hint);
      } else {
        showToast(`Pista de NEXO: ${this.challenge.hint}`, "warning", 6000);
      }
    });

    // Ejecutar programa
    const runBtn = this.container.querySelector("#btn-run-program");
    runBtn.addEventListener("click", () => this.runProgram());
  }

  renderQueue() {
    const queueEl = this.container.querySelector("#command-queue");
    const counterEl = this.container.querySelector("#prog-counter");

    if (counterEl) {
      counterEl.textContent = `${this.program.length} / ${this.challenge.maxCommands}`;
    }

    if (this.program.length === 0) {
      queueEl.innerHTML = `<div class="queue-empty-placeholder">Selecciona instrucciones para programar al robot...</div>`;
      return;
    }

    const labels = {
      FORWARD: { name: "Avanzar", icon: "▲" },
      TURN_LEFT: { name: "Girar Izq", icon: "↺" },
      TURN_RIGHT: { name: "Girar Der", icon: "↻" }
    };

    queueEl.innerHTML = this.program.map((cmd, idx) => `
      <div class="queue-chip" data-step="${idx}">
        <span class="chip-step">${idx + 1}</span>
        <span class="chip-icon">${labels[cmd].icon}</span>
        <span class="chip-name">${labels[cmd].name}</span>
      </div>
    `).join("");
  }

  resetRobotPosition() {
    this.robotState = { ...this.challenge.start };
    this.updateRobotVisual();
  }

  updateRobotVisual() {
    // Eliminar robot anterior
    const existingRobot = this.container.querySelector(".robot-marker");
    if (existingRobot) existingRobot.remove();

    const cell = this.container.querySelector(`.grid-cell[data-x="${this.robotState.x}"][data-y="${this.robotState.y}"]`);
    if (cell) {
      const robotEl = document.createElement("div");
      robotEl.className = `robot-marker robot-dir-${this.robotState.direction}`;
      robotEl.innerHTML = `
        <svg viewBox="0 0 32 32" fill="none" class="robot-svg">
          <circle cx="16" cy="16" r="14" fill="#00f0ff" fill-opacity="0.2" stroke="#00f0ff" stroke-width="2"/>
          <polygon points="16,4 25,24 16,19 7,24" fill="#00f0ff"/>
        </svg>
      `;
      cell.appendChild(robotEl);
    }
  }

  async runProgram() {
    if (this.isRunning) return;
    if (this.program.length === 0) {
      showToast("Agrega al menos una instrucción antes de ejecutar.", "warning");
      return;
    }

    this.attempts++;
    this.isRunning = true;
    this.resetRobotPosition();

    const runBtn = this.container.querySelector("#btn-run-program");
    runBtn.disabled = true;
    runBtn.textContent = "⏳ Ejecutando...";

    const feedbackBox = this.container.querySelector("#route-feedback-box");
    feedbackBox.classList.add("hidden");

    let crashed = false;
    let crashReason = "";

    // Mapeo de giros
    const directions = ["N", "E", "S", "W"];

    for (let i = 0; i < this.program.length; i++) {
      const cmd = this.program[i];
      // Resaltar chip activo
      const chips = this.container.querySelectorAll(".queue-chip");
      chips.forEach(c => c.classList.remove("chip-active"));
      if (chips[i]) chips[i].classList.add("chip-active");

      sounds.robotStep();

      if (cmd === "TURN_LEFT") {
        const curIdx = directions.indexOf(this.robotState.direction);
        this.robotState.direction = directions[(curIdx + 3) % 4];
      } else if (cmd === "TURN_RIGHT") {
        const curIdx = directions.indexOf(this.robotState.direction);
        this.robotState.direction = directions[(curIdx + 1) % 4];
      } else if (cmd === "FORWARD") {
        let nx = this.robotState.x;
        let ny = this.robotState.y;

        if (this.robotState.direction === "N") ny -= 1;
        else if (this.robotState.direction === "S") ny += 1;
        else if (this.robotState.direction === "E") nx += 1;
        else if (this.robotState.direction === "W") nx -= 1;

        // Comprobar colisión fuera de límites
        if (nx < 0 || nx >= this.gridSize || ny < 0 || ny >= this.gridSize) {
          crashed = true;
          crashReason = "El robot intentó avanzar fuera de los límites del mapa.";
          break;
        }

        // Comprobar colisión con obstáculos
        const hitObstacle = (this.challenge.obstacles || []).some(o => o.x === nx && o.y === ny);
        if (hitObstacle) {
          crashed = true;
          crashReason = "¡Colisión! El robot chocó contra un campo de fuerza activo.";
          this.robotState.x = nx;
          this.robotState.y = ny;
          this.updateRobotVisual();
          break;
        }

        this.robotState.x = nx;
        this.robotState.y = ny;
      }

      this.updateRobotVisual();
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    this.isRunning = false;
    runBtn.disabled = false;
    runBtn.textContent = "▶ Ejecutar Algoritmo";

    feedbackBox.classList.remove("hidden");

    const reachedTarget = this.robotState.x === this.challenge.target.x && this.robotState.y === this.challenge.target.y;

    if (!crashed && reachedTarget) {
      sounds.correct();
      feedbackBox.className = "game-feedback-box feedback-success";
      feedbackBox.innerHTML = `
        <div class="feedback-title">✓ ¡Objetivo Alcanzado!</div>
        <p>${this.challenge.feedbacks.success}</p>
      `;

      runBtn.disabled = true;
      runBtn.textContent = "✓ Completado";

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
        <div class="feedback-title">⚠ Intento Fallido</div>
        <p>${crashed ? crashReason : 'El robot se detuvo antes de llegar al conector objetivo.'}</p>
        <p class="feedback-sub">${this.challenge.feedbacks.error}</p>
      `;
    }
  }
}

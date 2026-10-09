/**
 * Controlador Principal de la Aplicación: Código Cero — El Rescate de Ciudad Algoritmia
 */

import { state } from "./state.js";
import { NavigationManager } from "./navigation.js";
import {
  createPlayer,
  getPlayer,
  getStoredPlayerId,
  clearLocalPlayer,
  resetPlayerProgress,
  updatePlayerActivity
} from "./services/playerService.js";
import {
  getAllMissionsProgress,
  startMission,
  completeMission
} from "./services/missionService.js";
import { recordChallengeResult } from "./services/scoreService.js";
import { getPlayerBadges } from "./services/badgeService.js";
import { getLeaderboard } from "./services/leaderboardService.js";

import { GAME_CONFIG, calculateCityHealth, getRankByXP } from "./data/gameConfig.js";
import { MISSIONS, getMissionById } from "./data/missions.js";
import { CHALLENGES, getChallengesForMission } from "./data/challenges.js";
import { BADGES } from "./data/badges.js";
import { TRAINING_TOPICS } from "./data/training.js";

import { showToast } from "./components/toast.js";
import { openModal, showNexoBriefing, showBadgeModal } from "./components/modal.js";
import { renderProgressBar, renderRankCard } from "./components/progressBar.js";
import { createMissionCard } from "./components/missionCard.js";
import { sounds } from "./components/audioEffects.js";

import { SequenceGame } from "./games/sequenceGame.js";
import { RouteGame } from "./games/routeGame.js";
import { ConditionalGame } from "./games/conditionalGame.js";
import { LoopGame } from "./games/loopGame.js";
import { DebuggingGame } from "./games/debuggingGame.js";
import { FinalChallengeGame } from "./games/finalChallenge.js";

class App {
  constructor() {
    this.nav = null;
    this.currentGameInstance = null;
    this.activeMissionChallenges = [];
  }

  async init() {
    console.log("Iniciando Código Cero: El Rescate de Ciudad Algoritmia...");
    this.nav = new NavigationManager();

    this.bindGlobalEvents();
    this.bindAuthEvents();
    this.initTrainingCenter();

    // Suscribirse a cambios de estado para actualizar vistas dependientes
    state.subscribe((currentState) => {
      this.updateNavbarUser(currentState.player);
      this.updateLoadingOverlay(currentState.isLoading);
    });

    // Comprobar si hay partida guardada en este navegador
    await this.checkExistingSession();
  }

  updateLoadingOverlay(isLoading) {
    const overlay = document.getElementById("loading-overlay");
    if (overlay) {
      overlay.classList.toggle("hidden-overlay", !isLoading);
    }
  }

  updateNavbarUser(player) {
    const aliasEl = document.getElementById("nav-player-alias");
    const xpEl = document.getElementById("nav-player-xp");
    const rankEl = document.getElementById("nav-player-rank");
    const userBar = document.getElementById("nav-user-indicator");

    if (player) {
      if (aliasEl) aliasEl.textContent = player.alias;
      if (xpEl) xpEl.textContent = `${player.experience || 0} XP`;
      if (rankEl) rankEl.textContent = player.rank || "Aprendiz Digital";
      if (userBar) userBar.classList.remove("hidden");
    } else {
      if (userBar) userBar.classList.add("hidden");
    }
  }

  async checkExistingSession() {
    const storedId = getStoredPlayerId();
    const resumeContainer = document.getElementById("saved-session-box");
    const resumeAlias = document.getElementById("saved-alias-name");
    const resumeMissions = document.getElementById("saved-missions-count");
    const resumeXp = document.getElementById("saved-xp-count");

    if (!storedId) {
      if (resumeContainer) resumeContainer.classList.add("hidden");
      this.nav.navigateTo("inicio");
      return;
    }

    try {
      state.setLoading(true);
      const player = await getPlayer(storedId);

      if (player) {
        state.setPlayer(player);
        if (resumeContainer) {
          resumeContainer.classList.remove("hidden");
          if (resumeAlias) resumeAlias.textContent = player.alias;
          if (resumeMissions) resumeMissions.textContent = `${(player.completedMissions || []).length} / 6`;
          if (resumeXp) resumeXp.textContent = `${player.experience || 0} XP`;
        }
        showToast(`Sesión activa detectada: Agente ${player.alias}`, "info");
      } else {
        clearLocalPlayer();
        if (resumeContainer) resumeContainer.classList.add("hidden");
      }
    } catch (err) {
      console.warn("No se pudo conectar con Firestore al iniciar:", err);
      showToast("Modo de conexión sin respuesta previa. Puedes iniciar una nueva partida o reconectar.", "warning");
    } finally {
      state.setLoading(false);
      this.nav.navigateTo("inicio");
    }
  }

  bindAuthEvents() {
    // Formulario de nueva partida
    const newGameForm = document.getElementById("form-new-game");
    if (newGameForm) {
      newGameForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const input = document.getElementById("input-player-alias");
        const alias = input ? input.value.trim() : "";

        if (!alias) {
          showToast("Introduce un alias para registrarte en la unidad de rescate.", "warning");
          return;
        }

        try {
          state.setLoading(true);
          const newPlayer = await createPlayer(alias);
          state.setPlayer(newPlayer);
          sounds.correct();
          showToast(`¡Bienvenido a la unidad, Agente ${newPlayer.alias}!`, "success");

          // Mensaje de bienvenida de NEXO
          showNexoBriefing(
            "COMUNICACIÓN ENTRANTE DE NEXO",
            `«Ciudad Algoritmia está fuera de servicio. Los sistemas han dejado de responder y solo un equipo capaz de comprender los algoritmos podrá devolver la ciudad a la normalidad. ¿Aceptas la misión, Agente ${newPlayer.alias}? Comencemos restableciendo la Planta Energética Cuántica.»`,
            "IA de Asistencia de Ciudad Algoritmia",
            [{ label: "¡Acepto la Misión!", isPrimary: true }]
          );

          await this.loadDashboard();
          this.nav.navigateTo("dashboard");
        } catch (err) {
          console.error("Error al registrar jugador:", err);
          const isPermissionDenied = err.code === "permission-denied" || (err.message && err.message.includes("permissions"));
          if (isPermissionDenied) {
            openModal({
              title: "⚠️ Permisos de Firestore Pendientes",
              type: "confirm",
              contentHtml: `
                <div style="text-align: left; line-height: 1.6;">
                  <p>Firebase Firestore ha rechazado la operación con el error:</p>
                  <code style="color: #ff3366; display: block; margin: 0.5rem 0; padding: 0.5rem; background: rgba(255,51,102,0.1); border-radius: 6px;">
                    FirebaseError: Missing or insufficient permissions.
                  </code>
                  <p style="color: #cbd5e1; margin-top: 0.8rem; font-size: 0.92rem;">
                    Esto sucede porque en la <strong>Consola de Firebase</strong> de tu proyecto <em>sistemagammy</em> la base de datos Firestore tiene activadas las reglas de bloqueo por defecto.
                  </p>
                  <div style="background: rgba(7, 11, 25, 0.8); border: 1px solid rgba(0, 240, 255, 0.4); border-radius: 8px; padding: 1rem; margin-top: 1rem;">
                    <strong style="color: #00f0ff;">Pasos para activarlo en 30 segundos:</strong>
                    <ol style="margin-left: 1.2rem; margin-top: 0.5rem; font-size: 0.88rem; color: #f0f4fc;">
                      <li>Abre: <a href="https://console.firebase.google.com/project/sistemagammy/firestore/rules" target="_blank" style="color: #00e676; text-decoration: underline; font-weight: bold;">Consola Firebase -> Firestore Database -> Reglas</a></li>
                      <li>Reemplaza el contenido por:<br>
                        <pre style="background: #000; padding: 0.5rem; border-radius: 4px; margin: 0.4rem 0; color: #00f0ff; font-family: monospace; font-size: 0.8rem;">rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}</pre>
                      </li>
                      <li>Haz clic en el botón azul <strong>Publicar</strong>.</li>
                    </ol>
                  </div>
                </div>
              `,
              actions: [
                { label: "Entendido", isPrimary: true }
              ]
            });
            showToast("Firestore bloqueado por reglas en Firebase Console. Publica las reglas para permitir acceso.", "error", 8000);
          } else {
            showToast("Error de conexión con Firestore al crear participante. Comprueba tu red.", "error");
          }
        } finally {
          state.setLoading(false);
        }
      });
    }

    // Botón continuar partida guardada
    const btnResumeSaved = document.getElementById("btn-resume-saved");
    if (btnResumeSaved) {
      btnResumeSaved.addEventListener("click", async () => {
        if (state.player) {
          sounds.click();
          await this.loadDashboard();
          this.nav.navigateTo("dashboard");
        }
      });
    }

    // Botón recuperar partida con código
    const btnRecoverCode = document.getElementById("btn-open-code-recovery");
    if (btnRecoverCode) {
      btnRecoverCode.addEventListener("click", () => {
        openModal({
          title: "Recuperar Partida con Código de Agente",
          type: "default",
          contentHtml: `
            <p>Introduce el código identificador de tu partida para continuar tu progreso desde este equipo:</p>
            <div class="form-group" style="margin: 1.5rem 0;">
              <input type="text" id="input-recovery-code" class="form-input" placeholder="Ejemplo: p_abc123_xyz" autocomplete="off" />
            </div>
            <p class="text-muted" style="font-size: 0.85rem;">Nota: Tu código único de agente se encuentra en tu sección de Perfil.</p>
          `,
          actions: [
            { label: "Cancelar", className: "btn-secondary" },
            {
              label: "Recuperar Partida",
              isPrimary: true,
              onClick: async () => {
                const codeInput = document.getElementById("input-recovery-code");
                const code = codeInput ? codeInput.value.trim() : "";
                if (!code) {
                  showToast("Introduce un código de partida válido.", "warning");
                  return false;
                }
                try {
                  state.setLoading(true);
                  const player = await getPlayer(code);
                  if (player) {
                    state.setPlayer(player);
                    showToast(`¡Partida de ${player.alias} recuperada con éxito!`, "success");
                    await this.loadDashboard();
                    this.nav.navigateTo("dashboard");
                    return true;
                  } else {
                    showToast("No se encontró ningún participante con ese código en Firestore.", "error");
                    return false;
                  }
                } catch (e) {
                  showToast("Error al consultar Firestore.", "error");
                  return false;
                } finally {
                  state.setLoading(false);
                }
              }
            }
          ]
        });
      });
    }
  }

  bindGlobalEvents() {
    // Sonido toggle
    const soundToggle = document.getElementById("btn-toggle-sound");
    if (soundToggle) {
      soundToggle.addEventListener("click", () => {
        const next = !state.soundEnabled;
        state.setSoundEnabled(next);
        soundToggle.classList.toggle("sound-muted", !next);
        soundToggle.setAttribute("aria-label", next ? "Desactivar efectos de sonido" : "Activar efectos de sonido");
        showToast(next ? "Efectos sonoros activados" : "Efectos sonoros silenciados", "info", 2000);
      });
    }

    // Botón continuar siguiente misión desde dashboard
    const btnContinueNext = document.getElementById("btn-dash-continue-next");
    if (btnContinueNext) {
      btnContinueNext.addEventListener("click", () => {
        sounds.click();
        const nextMissionId = this.getNextAvailableMissionId();
        this.openMission(nextMissionId);
      });
    }

    // Botón volver de misión activa al mapa
    const btnBackToMap = document.getElementById("btn-mission-back-map");
    if (btnBackToMap) {
      btnBackToMap.addEventListener("click", () => {
        sounds.click();
        this.loadMissionsMap();
        this.nav.navigateTo("missions");
      });
    }

    // Botón recargar clasificación
    const btnRefreshLb = document.getElementById("btn-refresh-leaderboard");
    if (btnRefreshLb) {
      btnRefreshLb.addEventListener("click", () => {
        sounds.click();
        this.loadLeaderboard();
      });
    }

    // Botón copiar código en perfil
    const btnCopyCode = document.getElementById("btn-copy-player-id");
    if (btnCopyCode) {
      btnCopyCode.addEventListener("click", () => {
        if (!state.player) return;
        sounds.click();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(state.player.id || state.player.playerId);
          showToast("Código de agente copiado al portapapeles", "success", 3000);
        } else {
          showToast(`Tu código: ${state.player.id || state.player.playerId}`, "info", 8000);
        }
      });
    }

    // Botón reiniciar progreso en perfil
    const btnResetProg = document.getElementById("btn-reset-progress");
    if (btnResetProg) {
      btnResetProg.addEventListener("click", () => {
        if (!state.player) return;
        sounds.click();
        openModal({
          title: "⚠ Confirmar Reinicio de Progreso",
          type: "confirm",
          contentHtml: `
            <p>¿Estás seguro de que deseas reiniciar tu progreso personal en Ciudad Algoritmia?</p>
            <p style="color: #ff3366; margin-top: 0.8rem;">
              Esta acción pondrá tus puntos de experiencia a 0 y deberás completar nuevamente las misiones.
              Los datos de los demás participantes no se verán afectados.
            </p>
          `,
          actions: [
            { label: "Cancelar", className: "btn-secondary" },
            {
              label: "Sí, Reiniciar mi Progreso",
              className: "btn-danger",
              onClick: async () => {
                try {
                  state.setLoading(true);
                  const updated = await resetPlayerProgress(state.player.id || state.player.playerId);
                  state.setPlayer(updated);
                  showToast("Tu progreso ha sido reiniciado a cero.", "info");
                  await this.loadDashboard();
                  this.nav.navigateTo("dashboard");
                  return true;
                } catch (err) {
                  showToast("Error al reiniciar progreso.", "error");
                  return false;
                } finally {
                  state.setLoading(false);
                }
              }
            }
          ]
        });
      });
    }

    // Botón cerrar sesión / salir
    const btnLogout = document.getElementById("btn-logout-agent");
    if (btnLogout) {
      btnLogout.addEventListener("click", () => {
        sounds.click();
        clearLocalPlayer();
        state.setPlayer(null);
        showToast("Sesión de agente finalizada.", "info");
        this.nav.navigateTo("inicio");
      });
    }

    // Eventos al cambiar de vista desde la barra de navegación
    const navItems = document.querySelectorAll("[data-target-view]");
    navItems.forEach(item => {
      item.addEventListener("click", async () => {
        const view = item.getAttribute("data-target-view");
        if (view === "dashboard") await this.loadDashboard();
        else if (view === "missions") await this.loadMissionsMap();
        else if (view === "achievements") await this.loadAchievements();
        else if (view === "leaderboard") await this.loadLeaderboard();
        else if (view === "profile") await this.loadProfile();
      });
    });
  }

  // ==========================================
  // PANEL PRINCIPAL (DASHBOARD)
  // ==========================================
  async loadDashboard() {
    if (!state.player) return;
    const player = state.player;

    // Actualizar saludo y alias
    const greetAlias = document.getElementById("dash-agent-name");
    if (greetAlias) greetAlias.textContent = player.alias;

    // Métricas rápidas
    const statXP = document.getElementById("dash-stat-xp");
    const statMissions = document.getElementById("dash-stat-missions");
    const statBadges = document.getElementById("dash-stat-badges");
    const statCity = document.getElementById("dash-stat-city");

    const completedCount = (player.completedMissions || []).length;
    const cityHealth = calculateCityHealth(player.completedMissions || []);

    if (statXP) statXP.textContent = player.experience || 0;
    if (statMissions) statMissions.textContent = `${completedCount} / 6`;
    if (statBadges) statBadges.textContent = `${(player.unlockedBadges || []).length} / 6`;
    if (statCity) statCity.textContent = `${cityHealth}%`;

    // Barra de salud de la ciudad
    const cityBarContainer = document.getElementById("dash-city-progress-bar");
    renderProgressBar(cityBarContainer, cityHealth, "Sistemas de Ciudad Algoritmia Restaurados");

    // Tarjeta de Rango
    const rankCardContainer = document.getElementById("dash-rank-card-container");
    renderRankCard(rankCardContainer, player.experience || 0);

    // Estado visual de distritos
    this.renderCityDistrictsStatus(player.completedMissions || []);

    // Siguiente misión recomendada
    const nextMissionId = this.getNextAvailableMissionId();
    const nextMission = getMissionById(nextMissionId);
    const nextBannerTitle = document.getElementById("dash-next-mission-title");
    const nextBannerDesc = document.getElementById("dash-next-mission-desc");

    if (nextBannerTitle && nextMission) nextBannerTitle.textContent = nextMission.title;
    if (nextBannerDesc && nextMission) nextBannerDesc.textContent = nextMission.subtitle;

    // Actualizar actividad
    updatePlayerActivity(player.id || player.playerId);
  }

  renderCityDistrictsStatus(completedMissions) {
    const container = document.getElementById("dash-districts-grid");
    if (!container) return;

    container.innerHTML = GAME_CONFIG.cityDistricts.map(district => {
      const isRestored = completedMissions.includes(district.missionId);
      return `
        <div class="district-status-card ${isRestored ? 'district-online' : 'district-offline'}">
          <div class="district-card-header">
            <span class="district-indicator-dot"></span>
            <span class="district-status-label">${isRestored ? 'SISTEMA ONLINE' : 'CORRUPTO / CÓDIGO CERO'}</span>
          </div>
          <h4 class="district-name">${district.name}</h4>
          <p class="district-desc">${isRestored ? district.description : 'Pendiente de restauración por la unidad.'}</p>
        </div>
      `;
    }).join("");
  }

  getNextAvailableMissionId() {
    if (!state.player) return "mission_1";
    const completed = state.player.completedMissions || [];
    for (const mission of MISSIONS) {
      if (!completed.includes(mission.id)) {
        return mission.id;
      }
    }
    return "mission_6"; // Si ya completó todas, permite repasar la final
  }

  // ==========================================
  // MAPA DE MISIONES
  // ==========================================
  async loadMissionsMap() {
    if (!state.player) return;
    const container = document.getElementById("missions-cards-grid");
    if (!container) return;

    container.innerHTML = `<div class="loading-spinner">Cargando protocolos de misiones...</div>`;

    const completed = state.player.completedMissions || [];
    let missionProgressMap = new Map();

    try {
      missionProgressMap = await getAllMissionsProgress(state.player.id || state.player.playerId);
    } catch (e) {
      console.warn("No se pudo obtener subcolección missionProgress:", e);
    }

    container.innerHTML = "";

    MISSIONS.forEach((mission, index) => {
      const isCompleted = completed.includes(mission.id);
      const isPrereqMet = !mission.prerequisiteMissionId || completed.includes(mission.prerequisiteMissionId);
      const isLocked = !isPrereqMet;
      const progressDoc = missionProgressMap.get(mission.id);
      const isInProgress = !isCompleted && !isLocked && progressDoc && progressDoc.status === "in_progress";

      const card = createMissionCard(mission, {
        isLocked,
        isCompleted,
        isInProgress,
        onSelect: (mId) => this.openMission(mId)
      });

      container.appendChild(card);
    });
  }

  // ==========================================
  // PANTALLA DE MISIÓN ACTIVA
  // ==========================================
  async openMission(missionId) {
    const mission = getMissionById(missionId);
    if (!mission) {
      showToast("Misión no encontrada.", "error");
      return;
    }

    // Comprobar prerequisitos
    const completed = state.player?.completedMissions || [];
    if (mission.prerequisiteMissionId && !completed.includes(mission.prerequisiteMissionId)) {
      showToast("Debes superar la misión previa para desbloquear este sector.", "warning");
      return;
    }

    state.setActiveMission(missionId, 0);
    this.activeMissionChallenges = getChallengesForMission(missionId);

    // Iniciar misión en Firestore si no estaba iniciada
    try {
      await startMission(state.player.id || state.player.playerId, missionId);
    } catch (e) {
      console.warn("No se pudo actualizar estado en Firestore:", e);
    }

    // Actualizar cabecera de la vista de misión
    const titleEl = document.getElementById("active-mission-title");
    const subEl = document.getElementById("active-mission-sub");
    const districtEl = document.getElementById("active-mission-district");
    const narrativeEl = document.getElementById("active-mission-narrative-text");

    if (titleEl) titleEl.textContent = `Misión 0${mission.order}: ${mission.title}`;
    if (subEl) subEl.textContent = mission.subtitle;
    if (districtEl) districtEl.textContent = mission.districtName;
    if (narrativeEl) narrativeEl.textContent = mission.narrativeIntro;

    this.nav.navigateTo("mission-active");
    this.renderActiveChallengeStep(0);
  }

  renderActiveChallengeStep(challengeIndex) {
    state.setActiveMission(state.activeMissionId, challengeIndex);
    const challenges = this.activeMissionChallenges;
    const challenge = challenges[challengeIndex];
    if (!challenge) return;

    // Renderizar stepper de pasos
    const stepperContainer = document.getElementById("mission-challenges-stepper");
    if (stepperContainer) {
      stepperContainer.innerHTML = challenges.map((c, idx) => `
        <div class="challenge-step-tab ${idx === challengeIndex ? 'step-active' : ''} ${idx < challengeIndex ? 'step-done' : ''}">
          <span class="step-circle">${idx < challengeIndex ? '✓' : idx + 1}</span>
          <span class="step-name">Desafío 0${idx + 1}</span>
        </div>
      `).join("");
    }

    // Contenedor del juego
    const gameContainer = document.getElementById("active-game-workspace");
    if (!gameContainer) return;

    // Instanciar el motor adecuado según la misión
    const missionId = state.activeMissionId;

    const onCompleteHandler = async (result) => {
      await this.handleChallengeCompleted(challenge, result, challengeIndex);
    };

    const onRequestHintHandler = (hintText) => {
      showNexoBriefing(
        "PISTA TÁCTICA DE NEXO",
        hintText,
        "Análisis de Algoritmos",
        [{ label: "Entendido, aplicar pista", isPrimary: true }]
      );
    };

    if (missionId === "mission_1") {
      this.currentGameInstance = new SequenceGame({
        container: gameContainer,
        challenge,
        onComplete: onCompleteHandler,
        onRequestHint: onRequestHintHandler
      });
    } else if (missionId === "mission_2") {
      this.currentGameInstance = new RouteGame({
        container: gameContainer,
        challenge,
        onComplete: onCompleteHandler,
        onRequestHint: onRequestHintHandler
      });
    } else if (missionId === "mission_3") {
      this.currentGameInstance = new ConditionalGame({
        container: gameContainer,
        challenge,
        onComplete: onCompleteHandler,
        onRequestHint: onRequestHintHandler
      });
    } else if (missionId === "mission_4") {
      this.currentGameInstance = new LoopGame({
        container: gameContainer,
        challenge,
        onComplete: onCompleteHandler,
        onRequestHint: onRequestHintHandler
      });
    } else if (missionId === "mission_5") {
      this.currentGameInstance = new DebuggingGame({
        container: gameContainer,
        challenge,
        onComplete: onCompleteHandler,
        onRequestHint: onRequestHintHandler
      });
    } else if (missionId === "mission_6") {
      this.currentGameInstance = new FinalChallengeGame({
        container: gameContainer,
        challenge,
        phaseIndex: challengeIndex,
        onComplete: onCompleteHandler,
        onRequestHint: onRequestHintHandler
      });
    }
  }

  async handleChallengeCompleted(challenge, result, challengeIndex) {
    const playerId = state.player.id || state.player.playerId;
    const missionId = state.activeMissionId;

    try {
      state.setLoading(true);

      // Registrar resultado en Firestore (idempotente)
      const record = await recordChallengeResult({
        playerId,
        missionId,
        challengeId: challenge.id,
        isCorrect: true,
        attempts: result.attempts || 1,
        hintsUsed: result.hintsUsed || 0
      });

      // Actualizar estado local
      state.updatePlayerPartial({
        experience: record.totalXP,
        rank: record.newRank
      });

      if (record.isFirstCompletion) {
        showToast(`¡Desafío completado! +${record.awardedXP} XP`, "xp");
      } else {
        showToast("¡Desafío verificado! (Ya resuelto previamente)", "info");
      }

      const totalChallenges = this.activeMissionChallenges.length;

      // Si quedan más desafíos en esta misión, avanzar al siguiente
      if (challengeIndex < totalChallenges - 1) {
        setTimeout(() => {
          this.renderActiveChallengeStep(challengeIndex + 1);
        }, 600);
      } else {
        // ¡Misión completa!
        await this.handleMissionFinished(missionId);
      }

    } catch (err) {
      console.error("Error al registrar resultado del desafío:", err);
      showToast("No se pudo sincronizar el resultado con Firestore. Revisa tu conexión.", "error");
    } finally {
      state.setLoading(false);
    }
  }

  async handleMissionFinished(missionId) {
    const playerId = state.player.id || state.player.playerId;
    const mission = getMissionById(missionId);

    try {
      state.setLoading(true);

      const finishData = await completeMission(playerId, missionId);

      // Actualizar participante
      const updatedPlayer = await getPlayer(playerId);
      if (updatedPlayer) state.setPlayer(updatedPlayer);

      if (finishData.isFirstCompletion) {
        sounds.badgeFanfare();
        showToast(`¡Misión 0${mission.order} completada con éxito! +${finishData.bonusXP} XP de bonificación`, "xp", 5000);

        if (finishData.badge) {
          showBadgeModal(finishData.badge);
        }
      }

      // Si es la Misión 6 (Final), mostrar desenlace narrativo épico
      if (missionId === "mission_6") {
        this.showEpicFinale();
      } else {
        showNexoBriefing(
          "¡SECTOR RESTAURADO CON ÉXITO!",
          `«Excelente trabajo, Agente ${state.player.alias}. El sector ${mission.districtName} vuelve a transmitir datos estables. La ciudad se encuentra un paso más cerca de eliminar el Código Cero.»`,
          "Notificación de Éxito de NEXO",
          [
            {
              label: "Volver al Mapa de Misiones",
              isPrimary: true,
              onClick: () => {
                this.loadMissionsMap();
                this.nav.navigateTo("missions");
              }
            }
          ]
        );
      }

    } catch (err) {
      console.error("Error al finalizar misión:", err);
      showToast("Error al registrar finalización de la misión en Firestore.", "error");
    } finally {
      state.setLoading(false);
    }
  }

  showEpicFinale() {
    sounds.badgeFanfare();
    openModal({
      title: "✦ CIUDAD ALGORITMIA SALVADA: EL CÓDIGO CERO HA SIDO ERRADICADO ✦",
      type: "badge",
      contentHtml: `
        <div class="finale-celebration">
          <div class="finale-city-glow">🏙️⚡✨</div>
          <h3 class="finale-headline">¡TODOS LOS SISTEMAS VUELVEN A OPERAR AL 100%!</h3>
          <p class="finale-text">
            Gracias a tu pericia con las <strong>secuencias lógicas</strong>, el trazado de <strong>rutas</strong>,
            las <strong>estructuras condicionales</strong>, la optimización con <strong>bucles</strong> y
            la <strong>depuración de código</strong>, el Núcleo Cero ha sido reiniciado.
          </p>
          <div class="finale-summary-box">
            <h4>Balance Pedagógico de Competencias:</h4>
            <ul>
              <li>✓ <strong>Algoritmos:</strong> Capacidad para diseñar instrucciones inequívocas y secuenciales.</li>
              <li>✓ <strong>Bifurcaciones:</strong> Dominio de toma de decisiones automatizadas (SI / ENTONCES).</li>
              <li>✓ <strong>Eficiencia:</strong> Compactación algorítmica mediante patrones repetitivos e iteraciones.</li>
              <li>✓ <strong>Depuración:</strong> Detección precisa de fallos lógicos y formulación metódica de correcciones.</li>
            </ul>
          </div>
          <p class="finale-congrats">
            ¡Has sido condecorado como <strong>Guardián de Ciudad Algoritmia</strong>!
          </p>
        </div>
      `,
      actions: [
        {
          label: "Ver Mi Perfil de Héroe",
          className: "btn-secondary",
          onClick: () => {
            this.loadProfile();
            this.nav.navigateTo("profile");
          }
        },
        {
          label: "Ver Clasificación Global",
          isPrimary: true,
          onClick: () => {
            this.loadLeaderboard();
            this.nav.navigateTo("leaderboard");
          }
        }
      ]
    });
  }

  // ==========================================
  // SALA DE LOGROS
  // ==========================================
  async loadAchievements() {
    if (!state.player) return;
    const container = document.getElementById("achievements-badges-grid");
    if (!container) return;

    container.innerHTML = `<div class="loading-spinner">Consultando condecoraciones...</div>`;

    try {
      const badges = await getPlayerBadges(state.player.id || state.player.playerId);
      container.innerHTML = badges.map(b => {
        const dateStr = b.awardedAt ? new Date(b.awardedAt).toLocaleDateString() : null;
        return `
          <div class="badge-card ${b.isUnlocked ? 'badge-unlocked' : 'badge-locked'}">
            <div class="badge-icon-wrap" style="color: ${b.color};">
              ${b.svgIcon}
            </div>
            <div class="badge-card-info">
              <h3 class="badge-card-name">${b.name}</h3>
              <p class="badge-card-desc">${b.description}</p>
              <div class="badge-card-condition">
                <strong>Condición:</strong> ${b.condition}
              </div>
              <div class="badge-card-footer">
                ${b.isUnlocked 
                  ? `<span class="badge-earned-tag">✓ Desbloqueada ${dateStr ? `el ${dateStr}` : ''}</span>`
                  : `<span class="badge-locked-tag">🔒 Bloqueada</span>`
                }
              </div>
            </div>
          </div>
        `;
      }).join("");
    } catch (e) {
      container.innerHTML = `<div class="empty-state-card">Error al cargar logros desde Firestore.</div>`;
    }
  }

  // ==========================================
  // CLASIFICACIÓN GLOBAL
  // ==========================================
  async loadLeaderboard() {
    const tableBody = document.getElementById("leaderboard-table-body");
    const emptyState = document.getElementById("leaderboard-empty-state");
    if (!tableBody) return;

    tableBody.innerHTML = `<tr><td colspan="5" class="text-center">Cargando clasificación en tiempo real desde Firestore...</td></tr>`;
    if (emptyState) emptyState.classList.add("hidden");

    try {
      const leaders = await getLeaderboard(GAME_CONFIG.leaderboardLimit);

      if (leaders.length === 0) {
        tableBody.innerHTML = "";
        if (emptyState) emptyState.classList.remove("hidden");
        return;
      }

      const currentId = state.player ? (state.player.id || state.player.playerId) : "";

      tableBody.innerHTML = leaders.map(player => {
        const isCurrent = player.id === currentId;
        return `
          <tr class="${isCurrent ? 'leaderboard-current-row' : ''}">
            <td class="col-pos">
              <span class="pos-badge pos-${player.position}">${player.position <= 3 ? '★' : ''} ${player.position}</span>
            </td>
            <td class="col-alias">
              <strong>${player.alias}</strong> ${isCurrent ? '<span class="tag-you">(Tú)</span>' : ''}
            </td>
            <td class="col-xp">
              <span class="xp-val">${player.experience} XP</span>
            </td>
            <td class="col-missions text-center">
              ${player.completedCount} / 6
            </td>
            <td class="col-rank">
              <span class="rank-tag">${player.rank}</span>
            </td>
          </tr>
        `;
      }).join("");

    } catch (err) {
      console.error("Error al cargar ranking:", err);
      tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-error">Error al conectar con la base de datos de Firestore. Comprueba la conexión.</td></tr>`;
    }
  }

  // ==========================================
  // PERFIL DE PROGRESO
  // ==========================================
  async loadProfile() {
    if (!state.player) return;
    const player = state.player;

    const idEl = document.getElementById("profile-player-id");
    const aliasEl = document.getElementById("profile-alias");
    const rankEl = document.getElementById("profile-rank");
    const xpEl = document.getElementById("profile-xp");
    const missionsEl = document.getElementById("profile-missions-count");
    const badgesEl = document.getElementById("profile-badges-count");

    const fullId = player.id || player.playerId;
    if (idEl) idEl.textContent = fullId;
    if (aliasEl) aliasEl.textContent = player.alias;
    if (rankEl) rankEl.textContent = player.rank;
    if (xpEl) xpEl.textContent = `${player.experience || 0} XP`;
    if (missionsEl) missionsEl.textContent = `${(player.completedMissions || []).length} / 6`;
    if (badgesEl) badgesEl.textContent = `${(player.unlockedBadges || []).length} / 6`;

    // Lista de misiones con fecha o estado
    const missionListEl = document.getElementById("profile-missions-history");
    if (missionListEl) {
      const completed = player.completedMissions || [];
      missionListEl.innerHTML = MISSIONS.map(m => {
        const isDone = completed.includes(m.id);
        return `
          <div class="profile-history-item ${isDone ? 'history-done' : 'history-pending'}">
            <div class="history-item-icon">${isDone ? '✓' : '○'}</div>
            <div class="history-item-info">
              <strong>Misión 0${m.order}: ${m.title}</strong>
              <span>${m.districtName}</span>
            </div>
            <div class="history-item-status">
              ${isDone ? '<span class="status-badge-green">Completada</span>' : '<span class="status-badge-gray">Pendiente</span>'}
            </div>
          </div>
        `;
      }).join("");
    }
  }

  // ==========================================
  // CENTRO DE ENTRENAMIENTO
  // ==========================================
  initTrainingCenter() {
    const container = document.getElementById("training-topics-grid");
    if (!container) return;

    container.innerHTML = TRAINING_TOPICS.map(topic => `
      <div class="training-card" data-topic-id="${topic.id}">
        <div class="training-card-header">
          <span class="training-badge-tag">${topic.badgeName}</span>
          <h3 class="training-topic-title">${topic.title}</h3>
        </div>
        <p class="training-summary">${topic.summary}</p>
        
        <ul class="training-bullets">
          ${topic.keyPoints.map(kp => `<li>${kp}</li>`).join("")}
        </ul>

        <div class="training-quiz-box">
          <div class="quiz-q-title">🧠 Autoevaluación Rápida:</div>
          <p class="quiz-question">${topic.quickQuiz.question}</p>
          <div class="quiz-options-group">
            ${topic.quickQuiz.options.map((opt, i) => `
              <button type="button" class="btn-quiz-opt" data-correct="${opt.isCorrect}">
                ${opt.text}
              </button>
            `).join("")}
          </div>
          <div class="quiz-feedback-note hidden"></div>
        </div>
      </div>
    `).join("");

    // Eventos para los miniquizzes del centro de entrenamiento
    container.addEventListener("click", (e) => {
      const optBtn = e.target.closest(".btn-quiz-opt");
      if (!optBtn) return;

      const card = optBtn.closest(".training-card");
      const quizBox = optBtn.closest(".training-quiz-box");
      const feedbackNote = quizBox.querySelector(".quiz-feedback-note");
      const isCorrect = optBtn.getAttribute("data-correct") === "true";
      const topicId = card.getAttribute("data-topic-id");
      const topic = TRAINING_TOPICS.find(t => t.id === topicId);

      quizBox.querySelectorAll(".btn-quiz-opt").forEach(b => {
        b.classList.remove("quiz-opt-correct", "quiz-opt-wrong");
      });

      feedbackNote.classList.remove("hidden", "feedback-success", "feedback-error");

      if (isCorrect) {
        sounds.correct();
        optBtn.classList.add("quiz-opt-correct");
        feedbackNote.classList.add("feedback-success");
        feedbackNote.textContent = topic ? topic.quickQuiz.feedback : "¡Respuesta correcta!";
      } else {
        sounds.error();
        optBtn.classList.add("quiz-opt-wrong");
        feedbackNote.classList.add("feedback-error");
        feedbackNote.textContent = "Respuesta incorrecta. Lee con atención los puntos clave de arriba y prueba de nuevo.";
      }
    });
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
});

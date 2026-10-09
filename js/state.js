/**
 * Gestión de Estado de la Aplicación (Reactive State)
 */

class AppState {
  constructor() {
    this.player = null;
    this.activeMissionId = null;
    this.activeChallengeIndex = 0;
    this.isLoading = false;
    this.currentView = "inicio"; // inicio, dashboard, missions, training, achievements, leaderboard, profile, mission-active
    this.soundEnabled = true;
    this.listeners = new Set();
  }

  setPlayer(playerData) {
    this.player = playerData;
    this.notify();
  }

  updatePlayerPartial(partial) {
    if (!this.player) return;
    this.player = { ...this.player, ...partial };
    this.notify();
  }

  setLoading(loading) {
    this.isLoading = !!loading;
    this.notify();
  }

  setCurrentView(viewId) {
    this.currentView = viewId;
    this.notify();
  }

  setActiveMission(missionId, challengeIndex = 0) {
    this.activeMissionId = missionId;
    this.activeChallengeIndex = challengeIndex;
    this.notify();
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = !!enabled;
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this);
      } catch (err) {
        console.error("Error en suscriptor de estado:", err);
      }
    }
  }
}

export const state = new AppState();

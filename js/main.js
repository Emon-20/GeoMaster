/**
 * PackMaster: Geometry - Main Application Bootstrap
 * Connects Game instance with UI modals, navigation, settings, audio, and shortcuts.
 */

import { Game } from './game.js';
import { sound } from './audio.js';
import { storage } from './storage.js';
import { LEVELS } from './levels.js';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  window.packMasterGame = game; // Expose for debugging if needed

  // Initialize sound mute from storage
  const savedMute = storage.getSetting('soundMuted');
  if (savedMute) {
    sound.setMuted(true);
    updateSoundButtonUI(true);
  }

  // --- UI Elements ---
  const soundBtn = document.getElementById('soundToggleBtn');
  const levelSelectBtn = document.getElementById('levelSelectBtn');
  const helpBtn = document.getElementById('helpBtn');
  const hintBtn = document.getElementById('hintBtn');
  const resetBtn = document.getElementById('resetBtn');

  // Modals (native <dialog>)
  const levelModal = document.getElementById('levelModal');
  const helpModal = document.getElementById('helpModal');
  const victoryModal = document.getElementById('victoryModal');
  const timeoutModal = document.getElementById('timeoutModal');

  // --- Audio Toggle ---
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isMuted = sound.toggleMute();
      storage.setSetting('soundMuted', isMuted);
      updateSoundButtonUI(isMuted);
      if (!isMuted) sound.playClick();
    });
  }

  function updateSoundButtonUI(isMuted) {
    if (!soundBtn) return;
    const icon = soundBtn.querySelector('.btn-icon');
    if (icon) icon.textContent = isMuted ? '🔇' : '🔊';
    soundBtn.setAttribute('aria-label', isMuted ? 'Unmute Sound' : 'Mute Sound');
  }

  // --- Hint & Reset ---
  if (hintBtn) {
    hintBtn.addEventListener('click', () => {
      game.showHint();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      game.clearFrame();
    });
  }

  // --- Mobile Bottom Action Bar Controls ---
  const mobileRotateLeftBtn = document.getElementById('mobileRotateLeftBtn');
  const mobileRotateRightBtn = document.getElementById('mobileRotateRightBtn');
  const mobileFlipBtn = document.getElementById('mobileFlipBtn');
  const mobileTrayBtn = document.getElementById('mobileTrayBtn');

  if (mobileRotateLeftBtn) {
    mobileRotateLeftBtn.addEventListener('click', () => {
      if (game.selectedPiece) game.rotatePiece(game.selectedPiece, -90);
    });
  }

  if (mobileRotateRightBtn) {
    mobileRotateRightBtn.addEventListener('click', () => {
      if (game.selectedPiece) game.rotatePiece(game.selectedPiece, 90);
    });
  }

  if (mobileFlipBtn) {
    mobileFlipBtn.addEventListener('click', () => {
      if (game.selectedPiece) game.flipPiece(game.selectedPiece);
    });
  }

  if (mobileTrayBtn) {
    mobileTrayBtn.addEventListener('click', () => {
      if (game.selectedPiece) game.returnPieceToTray(game.selectedPiece);
    });
  }

  // --- Level Selection Modal ---
  if (levelSelectBtn && levelModal) {
    levelSelectBtn.addEventListener('click', () => {
      sound.playClick();
      renderLevelGrid();
      levelModal.showModal();
    });
  }

  function renderLevelGrid() {
    const gridContainer = document.getElementById('levelListContainer');
    if (!gridContainer) return;
    gridContainer.innerHTML = '';

    LEVELS.forEach((level) => {
      const isUnlocked = storage.isLevelUnlocked(level.id);
      const record = storage.getLevelRecord(level.id);
      const isCurrent = level.id === game.currentLevelId;

      const card = document.createElement('div');
      card.className = `level-card ${isUnlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current' : ''}`;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', isUnlocked ? '0' : '-1');

      let starDisplay = '';
      for (let s = 1; s <= 3; s++) {
        starDisplay += `<span class="card-star ${s <= record.stars ? 'filled' : 'dim'}">★</span>`;
      }

      card.innerHTML = `
        <div class="card-header">
          <span class="card-num">#${level.id}</span>
          <span class="card-difficulty">${level.difficulty}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${level.title}</h3>
          <div class="card-meta">
            <span>📐 ${level.gridWidth}×${level.gridHeight}</span>
            <span>🧩 ${level.pieces.length} pcs</span>
            <span>⏱ ${level.timeLimit}s</span>
          </div>
        </div>
        <div class="card-footer">
          <div class="card-stars">${starDisplay}</div>
          <div class="card-record">${record.bestTime ? `Best: ${record.bestTime}s` : 'Unbeaten'}</div>
        </div>
        ${!isUnlocked ? '<div class="lock-overlay"><span class="lock-icon">🔒</span></div>' : ''}
      `;

      if (isUnlocked) {
        card.addEventListener('click', () => {
          sound.playClick();
          levelModal.close();
          game.loadLevel(level.id);
        });
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            sound.playClick();
            levelModal.close();
            game.loadLevel(level.id);
          }
        });
      }

      gridContainer.appendChild(card);
    });
  }

  // --- Help / Instructions Modal ---
  if (helpBtn && helpModal) {
    helpBtn.addEventListener('click', () => {
      sound.playClick();
      helpModal.showModal();
    });
  }

  // Close buttons for modals
  document.querySelectorAll('.close-modal-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('dialog');
      if (modal) {
        sound.playClick();
        modal.close();
      }
    });
  });

  // --- Victory Modal Actions ---
  const nextLevelBtn = document.getElementById('nextLevelBtn');
  const replayVictoryBtn = document.getElementById('replayVictoryBtn');
  const levelSelectVictoryBtn = document.getElementById('levelSelectVictoryBtn');

  if (nextLevelBtn) {
    nextLevelBtn.addEventListener('click', () => {
      sound.playClick();
      if (victoryModal) victoryModal.close();
      game.loadLevel(game.currentLevelId + 1);
    });
  }

  if (replayVictoryBtn) {
    replayVictoryBtn.addEventListener('click', () => {
      sound.playClick();
      if (victoryModal) victoryModal.close();
      game.loadLevel(game.currentLevelId);
    });
  }

  if (levelSelectVictoryBtn) {
    levelSelectVictoryBtn.addEventListener('click', () => {
      sound.playClick();
      if (victoryModal) victoryModal.close();
      if (levelModal) {
        renderLevelGrid();
        levelModal.showModal();
      }
    });
  }

  // --- Timeout Modal Actions ---
  const retryTimeoutBtn = document.getElementById('retryTimeoutBtn');
  const keepSolvingBtn = document.getElementById('keepSolvingBtn');

  if (retryTimeoutBtn) {
    retryTimeoutBtn.addEventListener('click', () => {
      sound.playClick();
      if (timeoutModal) timeoutModal.close();
      game.loadLevel(game.currentLevelId);
    });
  }

  if (keepSolvingBtn) {
    keepSolvingBtn.addEventListener('click', () => {
      sound.playClick();
      if (timeoutModal) timeoutModal.close();
      // Keep solving without time pressure
    });
  }

  // Start the game!
  game.init();
});

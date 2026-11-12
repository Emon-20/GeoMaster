/**
 * PackMaster: Geometry - Storage Manager
 * Persistent state for player level unlocks, high scores, best completion times,
 * star ratings, and game settings using LocalStorage.
 */

const STORAGE_KEY = 'packmaster_geometry_save_v1';

export class StorageManager {
  constructor() {
    this.data = this.load();
  }

  getDefaultData() {
    return {
      unlockedLevels: [1], // Level 1 unlocked initially
      levelRecords: {
        // levelId: { stars: 0, bestTime: null, completedCount: 0 }
      },
      settings: {
        soundMuted: false,
        snapEnabled: true,
        highContrast: false
      }
    };
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...this.getDefaultData(),
          ...parsed,
          settings: { ...this.getDefaultData().settings, ...(parsed.settings || {}) }
        };
      }
    } catch (e) {
      console.warn('Could not read localStorage:', e);
    }
    return this.getDefaultData();
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Could not write localStorage:', e);
    }
  }

  isLevelUnlocked(levelId) {
    if (levelId === 1) return true;
    return this.data.unlockedLevels.includes(levelId);
  }

  unlockLevel(levelId) {
    if (!this.data.unlockedLevels.includes(levelId)) {
      this.data.unlockedLevels.push(levelId);
      this.save();
    }
  }

  getLevelRecord(levelId) {
    return this.data.levelRecords[levelId] || { stars: 0, bestTime: null, completedCount: 0 };
  }

  recordLevelCompletion(levelId, timeSeconds, stars) {
    const existing = this.getLevelRecord(levelId);
    const newBestTime = (existing.bestTime === null || timeSeconds < existing.bestTime)
      ? Math.round(timeSeconds * 10) / 10
      : existing.bestTime;
    const newStars = Math.max(existing.stars, stars);

    this.data.levelRecords[levelId] = {
      stars: newStars,
      bestTime: newBestTime,
      completedCount: (existing.completedCount || 0) + 1
    };

    // Unlock next level
    this.unlockLevel(levelId + 1);
    this.save();

    return {
      isNewRecord: existing.bestTime === null || timeSeconds < existing.bestTime,
      stars: newStars,
      bestTime: newBestTime
    };
  }

  getSetting(key) {
    return this.data.settings[key];
  }

  setSetting(key, val) {
    this.data.settings[key] = val;
    this.save();
  }

  resetAllProgress() {
    this.data = this.getDefaultData();
    this.save();
  }
}

export const storage = new StorageManager();

/**
 * PackMaster: Geometry - Core Game Controller
 * Manages game loop, level loading, SVG rendering, piece placement,
 * countdown timer, validation check, hint system, and victory celebrations.
 */

import { LEVELS } from './levels.js';
import { Geometry } from './geometry.js';
import { sound } from './audio.js';
import { storage } from './storage.js';
import { DragDropController } from './drag-drop.js';

export class Game {
  constructor() {
    this.currentLevelId = 1;
    this.currentLevel = null;
    this.pieces = []; // All piece objects for current level
    this.placedPieces = []; // Pieces in the frame
    this.trayPieces = []; // Pieces in the tray
    this.selectedPiece = null;

    // Timer & Scoring
    this.timerSeconds = 0;
    this.timeLimit = 60;
    this.timerInterval = null;
    this.isTimerRunning = false;
    this.isLevelComplete = false;
    this.startTime = 0;

    // Sizing
    this.unitSizePx = 52;

    // DOM Elements
    this.frameEl = document.getElementById('puzzleFrame');
    this.frameInnerEl = document.getElementById('frameInner');
    this.trayEl = document.getElementById('pieceTray');
    this.ghostEl = document.getElementById('snapGhost');
    this.timerEl = document.getElementById('timerDisplay');
    this.timerBarEl = document.getElementById('timerProgressBar');
    this.levelTitleEl = document.getElementById('levelTitle');
    this.levelBadgeEl = document.getElementById('levelBadge');
    this.packProgressEl = document.getElementById('packProgress');
    this.coverageTextEl = document.getElementById('coverageText');

    this.dragController = new DragDropController(this);

    // Color definitions for vibrant, distinct luxury wooden piece finishes
    this.colorThemes = {
      ruby: { fill: '#e63946', stroke: '#9b1d20', glow: 'rgba(230, 57, 70, 0.4)' },
      sapphire: { fill: '#1d3557', stroke: '#0b1d3a', glow: 'rgba(29, 53, 87, 0.4)' },
      emerald: { fill: '#2a9d8f', stroke: '#1b665d', glow: 'rgba(42, 157, 143, 0.4)' },
      amber: { fill: '#f4a261', stroke: '#c76e27', glow: 'rgba(244, 162, 97, 0.4)' },
      coral: { fill: '#e76f51', stroke: '#b24328', glow: 'rgba(231, 111, 81, 0.4)' },
      gold: { fill: '#e9c46a', stroke: '#ba942d', glow: 'rgba(233, 196, 106, 0.4)' },
      cyan: { fill: '#00b4d8', stroke: '#0077b6', glow: 'rgba(0, 180, 216, 0.4)' },
      amethyst: { fill: '#7209b7', stroke: '#480ca8', glow: 'rgba(114, 9, 183, 0.4)' },
      rose: { fill: '#f72585', stroke: '#b5179e', glow: 'rgba(247, 37, 133, 0.4)' },
      lime: { fill: '#55a630', stroke: '#2b9348', glow: 'rgba(85, 166, 48, 0.4)' },
      teal: { fill: '#0096c7', stroke: '#03045e', glow: 'rgba(0, 150, 199, 0.4)' }
    };

    window.addEventListener('resize', () => this.recalcUnitSize());
  }

  init() {
    this.loadLevel(this.currentLevelId);
  }

  loadLevel(levelId) {
    const levelData = LEVELS.find((l) => l.id === levelId) || LEVELS[0];
    this.currentLevelId = levelData.id;
    this.currentLevel = levelData;
    this.isLevelComplete = false;
    this.selectedPiece = null;

    // Stop previous timer
    if (this.timerInterval) clearInterval(this.timerInterval);

    // Deep copy pieces
    this.pieces = JSON.parse(JSON.stringify(levelData.pieces));
    this.placedPieces = [];
    this.trayPieces = [...this.pieces];

    // Initialize piece geometry
    this.pieces.forEach((p) => {
      p.rotation = p.trayRotation || 0;
      p.flipped = false;
      this.updatePieceGeometry(p);
    });

    // Setup Timer
    this.timeLimit = levelData.timeLimit;
    this.timerSeconds = this.timeLimit;
    this.updateTimerDisplay();

    // Sizing & Frame Setup
    this.recalcUnitSize();
    this.renderFrame();
    this.renderTray();
    this.updateHUD();
    this.updateValidation();

    this.startTimer();
  }

  recalcUnitSize() {
    if (!this.currentLevel) return;
    const stageContainer = document.querySelector('.puzzle-workspace');
    if (!stageContainer) return;

    const availableW = Math.min(window.innerWidth - 32, 600);
    const availableH = Math.min(window.innerHeight * 0.42, 450);

    const fitW = (availableW - 30) / this.currentLevel.gridWidth;
    const fitH = (availableH - 30) / this.currentLevel.gridHeight;

    this.unitSizePx = Math.floor(Math.max(34, Math.min(62, fitW, fitH)));

    // Apply unit size to frame dimensions
    if (this.frameEl && this.currentLevel) {
      this.frameEl.style.width = `${this.currentLevel.gridWidth * this.unitSizePx}px`;
      this.frameEl.style.height = `${this.currentLevel.gridHeight * this.unitSizePx}px`;
    }

    // Refresh existing pieces in frame and tray
    this.refreshAllPieceElements();
  }

  updatePieceGeometry(piece) {
    if (piece.type === 'circle') {
      piece.bounds = {
        minX: 0,
        minY: 0,
        maxX: piece.radius * 2,
        maxY: piece.radius * 2,
        width: piece.radius * 2,
        height: piece.radius * 2
      };
      piece.area = Math.PI * piece.radius * piece.radius;
      return;
    }

    if (piece.type === 'bracket') {
      const rot = (piece.rotation || 0) % 360;
      const isVertical = rot === 90 || rot === 270;
      piece.bounds = {
        minX: 0,
        minY: 0,
        maxX: isVertical ? 1 : 2,
        maxY: isVertical ? 2 : 1,
        width: isVertical ? 1 : 2,
        height: isVertical ? 2 : 1
      };
      piece.area = 2 - Math.PI / 2;
      return;
    }

    // Polygon
    let pts = piece.points;
    if (piece.flipped) {
      pts = Geometry.flipPoints(pts);
    }
    if (piece.rotation !== 0) {
      pts = Geometry.rotatePoints(pts, piece.rotation);
    }
    piece.transformedPoints = Geometry.normalizePoints(pts);
    piece.bounds = Geometry.getBounds(piece.transformedPoints);
    piece.area = Geometry.getPolygonArea(piece.transformedPoints);
  }

  renderFrame() {
    this.frameEl.innerHTML = '';
    const gw = this.currentLevel.gridWidth;
    const gh = this.currentLevel.gridHeight;
    const u = this.unitSizePx;

    this.frameEl.style.width = `${gw * u}px`;
    this.frameEl.style.height = `${gh * u}px`;

    // SVG Grid overlay with carved wooden grooves and subtle diagonal guides
    const gridSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    gridSvg.setAttribute('class', 'frame-grid-svg');
    gridSvg.setAttribute('width', `${gw * u}`);
    gridSvg.setAttribute('height', `${gh * u}`);

    let gridPaths = '';
    // Grid lines
    for (let x = 1; x < gw; x++) {
      gridPaths += `M ${x * u} 0 L ${x * u} ${gh * u} `;
    }
    for (let y = 1; y < gh; y++) {
      gridPaths += `M 0 ${y * u} L ${gw * u} ${y * u} `;
    }

    gridSvg.innerHTML = `
      <defs>
        <pattern id="woodGroove" width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M 0 0 L 4 4" stroke="rgba(255,255,255,0.02)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#woodGroove)" />
      <path d="${gridPaths}" stroke="rgba(255, 235, 205, 0.12)" stroke-width="1.5" stroke-dasharray="3,3" />
    `;
    this.frameEl.appendChild(gridSvg);

    // Snapshot ghost container
    this.ghostEl = document.createElement('div');
    this.ghostEl.id = 'snapGhost';
    this.ghostEl.className = 'snap-ghost';
    this.frameEl.appendChild(this.ghostEl);

    // Frame pieces container
    this.framePiecesContainer = document.createElement('div');
    this.framePiecesContainer.className = 'frame-pieces-layer';
    this.frameEl.appendChild(this.framePiecesContainer);
  }

  renderTray() {
    this.trayEl.innerHTML = '';
    this.trayPieces.forEach((piece) => {
      const el = this.createPieceElement(piece, false);
      this.trayEl.appendChild(el);
    });
  }

  createPieceElement(piece, inFrame) {
    const el = document.createElement('div');
    el.className = `puzzle-piece ${inFrame ? 'in-frame' : 'in-tray'}`;
    el.dataset.id = piece.id;

    if (this.selectedPiece?.id === piece.id) {
      el.classList.add('selected');
    }

    const b = piece.bounds;
    const u = this.unitSizePx;
    const wPx = Math.max(1, b.width * u);
    const hPx = Math.max(1, b.height * u);

    el.style.width = `${wPx}px`;
    el.style.height = `${hPx}px`;

    if (inFrame) {
      el.style.left = `${piece.gridX * u}px`;
      el.style.top = `${piece.gridY * u}px`;
    }

    const color = this.colorThemes[piece.colorKey] || this.colorThemes.amber;

    // Create SVG shape inside piece element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', `${wPx}`);
    svg.setAttribute('height', `${hPx}`);
    svg.setAttribute('viewBox', `0 0 ${wPx} ${hPx}`);
    svg.setAttribute('class', 'piece-svg');

    let shapeMarkup = '';
    if (piece.type === 'circle') {
      const r = piece.radius * u;
      shapeMarkup = `
        <defs>
          <radialGradient id="grad_${piece.id}" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#fff" stop-opacity="0.35"/>
            <stop offset="70%" stop-color="${color.fill}"/>
            <stop offset="100%" stop-color="${color.stroke}"/>
          </radialGradient>
        </defs>
        <circle cx="${r}" cy="${r}" r="${r - 1.5}" fill="url(#grad_${piece.id})" stroke="${color.stroke}" stroke-width="2.5" class="piece-shape" />
        <circle cx="${r}" cy="${r}" r="${r * 0.5}" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.2" stroke-dasharray="3,3" />
      `;
    } else if (piece.type === 'bracket') {
      const pathD = Geometry.getCurvedPiecePath(piece, u);
      shapeMarkup = `
        <defs>
          <linearGradient id="grad_${piece.id}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff" stop-opacity="0.25"/>
            <stop offset="50%" stop-color="${color.fill}"/>
            <stop offset="100%" stop-color="${color.stroke}"/>
          </linearGradient>
        </defs>
        <path d="${pathD}" fill="url(#grad_${piece.id})" stroke="${color.stroke}" stroke-width="2.5" class="piece-shape" />
      `;
    } else {
      const pathD = Geometry.pointsToSvgPath(piece.transformedPoints, u);
      shapeMarkup = `
        <defs>
          <linearGradient id="grad_${piece.id}" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
            <stop offset="60%" stop-color="${color.fill}"/>
            <stop offset="100%" stop-color="${color.stroke}"/>
          </linearGradient>
        </defs>
        <path d="${pathD}" fill="url(#grad_${piece.id})" stroke="${color.stroke}" stroke-width="2.5" class="piece-shape" />
      `;
    }

    svg.innerHTML = shapeMarkup;
    el.appendChild(svg);

    // Quick action rotate badge on piece (click to rotate)
    const rotateBadge = document.createElement('button');
    rotateBadge.className = 'piece-rotate-badge';
    rotateBadge.setAttribute('aria-label', 'Rotate piece 90 degrees');
    rotateBadge.title = 'Rotate (or Right-Click / R)';
    rotateBadge.innerHTML = '↻';
    rotateBadge.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      this.rotatePiece(piece, 90);
    });
    el.appendChild(rotateBadge);

    // Pointer events for drag
    el.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.piece-rotate-badge')) return;
      this.dragController.startDrag(piece, el, e);
    });

    // Right-click to rotate
    el.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.rotatePiece(piece, 90);
    });

    return el;
  }

  refreshAllPieceElements() {
    // Re-render frame pieces
    if (this.framePiecesContainer) {
      this.framePiecesContainer.innerHTML = '';
      this.placedPieces.forEach((piece) => {
        const el = this.createPieceElement(piece, true);
        this.framePiecesContainer.appendChild(el);
      });
    }
    // Re-render tray
    this.renderTray();
  }

  selectPiece(piece) {
    this.selectedPiece = piece;
    document.querySelectorAll('.puzzle-piece').forEach((el) => {
      if (el.dataset.id === piece.id) el.classList.add('selected');
      else el.classList.remove('selected');
    });

    // Update active mobile controls bar
    this.updateMobileControlsBar();
  }

  updateMobileControlsBar() {
    const bar = document.getElementById('selectedPieceControls');
    const label = document.getElementById('selectedPieceLabel');
    if (!bar) return;

    if (this.selectedPiece) {
      bar.classList.add('visible');
      if (label) label.textContent = this.selectedPiece.name;
    } else {
      bar.classList.remove('visible');
    }
  }

  rotatePiece(piece, deltaDeg = 90) {
    piece.rotation = ((piece.rotation || 0) + deltaDeg + 360) % 360;
    this.updatePieceGeometry(piece);
    sound.playRotate();

    // If placed in frame, clamp position if new bounds exceed frame
    if (this.placedPieces.includes(piece)) {
      const maxGx = this.currentLevel.gridWidth - piece.bounds.width;
      const maxGy = this.currentLevel.gridHeight - piece.bounds.height;
      piece.gridX = Math.max(0, Math.min(piece.gridX, maxGx));
      piece.gridY = Math.max(0, Math.min(piece.gridY, maxGy));
    }

    this.refreshAllPieceElements();
    this.updateValidation();
  }

  flipPiece(piece) {
    // Only asymmetric polygons benefit from flip
    if (piece.type === 'circle' || piece.type === 'bracket') return;
    piece.flipped = !piece.flipped;
    this.updatePieceGeometry(piece);
    sound.playRotate();

    if (this.placedPieces.includes(piece)) {
      const maxGx = this.currentLevel.gridWidth - piece.bounds.width;
      const maxGy = this.currentLevel.gridHeight - piece.bounds.height;
      piece.gridX = Math.max(0, Math.min(piece.gridX, maxGx));
      piece.gridY = Math.max(0, Math.min(piece.gridY, maxGy));
    }

    this.refreshAllPieceElements();
    this.updateValidation();
  }

  placePieceInFrame(piece, gridX, gridY) {
    piece.gridX = gridX;
    piece.gridY = gridY;

    // Remove from tray if present
    const trayIdx = this.trayPieces.findIndex((p) => p.id === piece.id);
    if (trayIdx !== -1) {
      this.trayPieces.splice(trayIdx, 1);
    }

    // Add to placed if not already there
    if (!this.placedPieces.some((p) => p.id === piece.id)) {
      this.placedPieces.push(piece);
    }

    this.refreshAllPieceElements();
    this.updateValidation();
  }

  returnPieceToTray(piece) {
    // Remove from placed
    const placedIdx = this.placedPieces.findIndex((p) => p.id === piece.id);
    if (placedIdx !== -1) {
      this.placedPieces.splice(placedIdx, 1);
    }

    // Add back to tray
    if (!this.trayPieces.some((p) => p.id === piece.id)) {
      this.trayPieces.push(piece);
    }

    this.refreshAllPieceElements();
    this.updateValidation();
  }

  clearFrame() {
    this.placedPieces.forEach((p) => {
      if (!this.trayPieces.some((tp) => tp.id === p.id)) {
        this.trayPieces.push(p);
      }
    });
    this.placedPieces = [];
    this.selectedPiece = null;
    sound.playDrop();
    this.refreshAllPieceElements();
    this.updateValidation();
  }

  showSnapGhost(piece, gridX, gridY) {
    if (!this.ghostEl) return;
    const u = this.unitSizePx;
    const b = piece.bounds;

    this.ghostEl.style.display = 'block';
    this.ghostEl.style.left = `${gridX * u}px`;
    this.ghostEl.style.top = `${gridY * u}px`;
    this.ghostEl.style.width = `${b.width * u}px`;
    this.ghostEl.style.height = `${b.height * u}px`;

    // Render ghost SVG matching current rotation
    let ghostSvg = '';
    if (piece.type === 'circle') {
      const r = piece.radius * u;
      ghostSvg = `<circle cx="${r}" cy="${r}" r="${r - 1}" fill="rgba(80, 227, 194, 0.25)" stroke="#50e3c2" stroke-width="2" stroke-dasharray="4,4"/>`;
    } else if (piece.type === 'bracket') {
      const pathD = Geometry.getCurvedPiecePath(piece, u);
      ghostSvg = `<path d="${pathD}" fill="rgba(80, 227, 194, 0.25)" stroke="#50e3c2" stroke-width="2" stroke-dasharray="4,4"/>`;
    } else {
      const pathD = Geometry.pointsToSvgPath(piece.transformedPoints, u);
      ghostSvg = `<path d="${pathD}" fill="rgba(80, 227, 194, 0.25)" stroke="#50e3c2" stroke-width="2" stroke-dasharray="4,4"/>`;
    }

    this.ghostEl.innerHTML = `<svg width="${b.width * u}" height="${b.height * u}" class="ghost-svg">${ghostSvg}</svg>`;
  }

  hideSnapGhost() {
    if (this.ghostEl) {
      this.ghostEl.style.display = 'none';
      this.ghostEl.innerHTML = '';
    }
  }

  showHint() {
    // Find first unplaced piece or misaligned piece
    const unplaced = this.pieces.find((p) => !this.placedPieces.some((placed) => placed.id === p.id));
    const targetPiece = unplaced || this.pieces[0];
    if (!targetPiece || !targetPiece.solution) return;

    sound.playStar(1);

    // Show glowing target silhouette in frame
    const sol = targetPiece.solution;
    const u = this.unitSizePx;

    const hintIndicator = document.createElement('div');
    hintIndicator.className = 'hint-silhouette-highlight';
    hintIndicator.style.left = `${sol.gridX * u}px`;
    hintIndicator.style.top = `${sol.gridY * u}px`;

    // Compute solved bounds
    const tempPiece = { ...targetPiece, rotation: sol.rotation, flipped: sol.flipped };
    this.updatePieceGeometry(tempPiece);
    const b = tempPiece.bounds;
    hintIndicator.style.width = `${b.width * u}px`;
    hintIndicator.style.height = `${b.height * u}px`;

    let pathD = '';
    if (tempPiece.type === 'circle') {
      const r = tempPiece.radius * u;
      pathD = `<circle cx="${r}" cy="${r}" r="${r}" fill="rgba(255, 215, 0, 0.4)" stroke="#ffd700" stroke-width="3"/>`;
    } else if (tempPiece.type === 'bracket') {
      pathD = `<path d="${Geometry.getCurvedPiecePath(tempPiece, u)}" fill="rgba(255, 215, 0, 0.4)" stroke="#ffd700" stroke-width="3"/>`;
    } else {
      pathD = `<path d="${Geometry.pointsToSvgPath(tempPiece.transformedPoints, u)}" fill="rgba(255, 215, 0, 0.4)" stroke="#ffd700" stroke-width="3"/>`;
    }

    hintIndicator.innerHTML = `
      <svg width="${b.width * u}" height="${b.height * u}">
        ${pathD}
      </svg>
      <div class="hint-label">${targetPiece.name}</div>
    `;

    this.frameEl.appendChild(hintIndicator);

    setTimeout(() => {
      hintIndicator.classList.add('fade-out');
      setTimeout(() => hintIndicator.remove(), 600);
    }, 3200);
  }

  startTimer() {
    this.startTime = performance.now();
    this.isTimerRunning = true;
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      if (!this.isTimerRunning || this.isLevelComplete) return;

      this.timerSeconds = Math.max(0, this.timerSeconds - 0.1);
      this.updateTimerDisplay();

      if (this.timerSeconds <= 0) {
        this.onTimeExpired();
      }
    }, 100);
  }

  updateTimerDisplay() {
    if (!this.timerEl) return;
    const timeFormatted = this.timerSeconds.toFixed(1) + 's';
    this.timerEl.textContent = timeFormatted;

    // Visual progress ratio
    const progress = Math.max(0, this.timerSeconds / this.timeLimit);
    if (this.timerBarEl) {
      this.timerBarEl.style.width = `${progress * 100}%`;
      if (progress < 0.2) {
        this.timerBarEl.classList.add('urgent');
      } else {
        this.timerBarEl.classList.remove('urgent');
      }
    }
  }

  onTimeExpired() {
    clearInterval(this.timerInterval);
    this.isTimerRunning = false;
    sound.playInvalid();

    // Show Time's Up dialog
    const modal = document.getElementById('timeoutModal');
    if (modal && modal.showModal) {
      modal.showModal();
    }
  }

  updateValidation() {
    const totalCount = this.pieces.length;
    const placedCount = this.placedPieces.length;

    // Run canvas-level solid fill & boundary validation
    const val = Geometry.validatePacking(
      this.currentLevel.gridWidth,
      this.currentLevel.gridHeight,
      this.placedPieces
    );

    const coveragePct = Math.round(val.coverageRatio * 100);
    if (this.packProgressEl) {
      this.packProgressEl.style.width = `${coveragePct}%`;
    }
    if (this.coverageTextEl) {
      this.coverageTextEl.textContent = `${placedCount}/${totalCount} placed (${coveragePct}% solid)`;
    }

    // Win condition: All pieces placed, no overlap, solid fill >= 99.2%
    if (!this.isLevelComplete && placedCount === totalCount && val.isSolved) {
      this.onLevelVictory();
    }
  }

  onLevelVictory() {
    this.isLevelComplete = true;
    this.isTimerRunning = false;
    if (this.timerInterval) clearInterval(this.timerInterval);

    const timeTaken = Math.max(0.5, this.timeLimit - this.timerSeconds);
    const thresholds = this.currentLevel.starThresholds;

    // Calculate stars
    let stars = 1;
    let rankTitle = 'Packing Initiate';
    if (timeTaken <= thresholds[0]) {
      stars = 3;
      rankTitle = 'Grandmaster Packer!';
    } else if (timeTaken <= thresholds[1]) {
      stars = 2;
      rankTitle = 'Expert Assembler!';
    } else {
      stars = 1;
      rankTitle = 'Puzzle Completed!';
    }

    sound.playVictory();

    // Record high score
    const result = storage.recordLevelCompletion(this.currentLevelId, timeTaken, stars);

    // Launch confetti particles
    this.launchConfetti();

    // Display Victory Modal
    this.showVictoryModal(timeTaken, stars, rankTitle, result.isNewRecord);
  }

  showVictoryModal(timeTaken, stars, rankTitle, isNewRecord) {
    const modal = document.getElementById('victoryModal');
    if (!modal) return;

    document.getElementById('victoryRank').textContent = rankTitle;
    document.getElementById('victoryTime').textContent = `${timeTaken.toFixed(1)}s`;
    document.getElementById('victoryTarget').textContent = `< ${this.currentLevel.starThresholds[0]}s`;

    const recordTag = document.getElementById('newRecordTag');
    if (recordTag) {
      recordTag.style.display = isNewRecord ? 'inline-block' : 'none';
    }

    // Render stars with sequential popping animation
    const starContainer = document.getElementById('victoryStars');
    if (starContainer) {
      starContainer.innerHTML = '';
      for (let i = 1; i <= 3; i++) {
        const star = document.createElement('span');
        star.className = `star-icon ${i <= stars ? 'earned' : 'empty'}`;
        star.innerHTML = i <= stars ? '★' : '☆';
        starContainer.appendChild(star);

        if (i <= stars) {
          setTimeout(() => sound.playStar(i - 1), 350 * i);
        }
      }
    }

    // Next Level button logic
    const nextBtn = document.getElementById('nextLevelBtn');
    if (nextBtn) {
      const hasNext = this.currentLevelId < LEVELS.length;
      nextBtn.style.display = hasNext ? 'inline-flex' : 'none';
    }

    if (modal.showModal) {
      modal.showModal();
    }
  }

  launchConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#e63946', '#f4a261', '#e9c46a', '#2a9d8f', '#1d3557', '#9b5de5', '#00f5d4'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.45,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 1.2) * 14,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        spin: (Math.random() - 0.5) * 10,
        alpha: 1
      });
    }

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.rotation += p.spin;
        p.alpha -= 0.008;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      frame++;
      if (frame < 140) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    requestAnimationFrame(animate);
  }

  updateHUD() {
    if (this.levelTitleEl) {
      this.levelTitleEl.textContent = this.currentLevel.title;
    }
    if (this.levelBadgeEl) {
      this.levelBadgeEl.textContent = `Level ${this.currentLevel.id} • ${this.currentLevel.difficulty}`;
    }
  }
}

/**
 * PackMaster: Geometry - Drag & Drop Controller
 * High-performance pointer-event interaction system supporting mouse, touch, and stylus.
 * Features magnetic snapping, rotation shortcuts, boundary clamping, and haptic audio cues.
 */

import { Geometry } from './geometry.js';
import { sound } from './audio.js';

export class DragDropController {
  constructor(game) {
    this.game = game;
    this.activePiece = null;
    this.dragTargetEl = null;
    this.isDragging = false;
    this.pointerId = null;

    // Pointer offset relative to piece top-left
    this.offsetX = 0;
    this.offsetY = 0;
    this.startClientX = 0;
    this.startClientY = 0;
    this.hasMovedPastThreshold = false;

    // Drag ghost / preview state
    this.candidateGridX = null;
    this.candidateGridY = null;
    this.isOverFrame = false;

    this.bindGlobalEvents();
  }

  bindGlobalEvents() {
    window.addEventListener('pointermove', (e) => this.onPointerMove(e));
    window.addEventListener('pointerup', (e) => this.onPointerUp(e));
    window.addEventListener('pointercancel', (e) => this.onPointerUp(e));

    // Keyboard controls for active piece
    window.addEventListener('keydown', (e) => {
      // Don't intercept if an input is focused or dialog open
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'r' || e.key === 'R' || e.key === ' ') {
        if (this.game.selectedPiece) {
          e.preventDefault();
          this.game.rotatePiece(this.game.selectedPiece, 90);
        }
      } else if (e.key === 'q' || e.key === 'Q') {
        if (this.game.selectedPiece) {
          e.preventDefault();
          this.game.rotatePiece(this.game.selectedPiece, -90);
        }
      } else if (e.key === 'f' || e.key === 'F') {
        if (this.game.selectedPiece) {
          e.preventDefault();
          this.game.flipPiece(this.game.selectedPiece);
        }
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Escape') {
        if (this.game.selectedPiece) {
          e.preventDefault();
          this.game.returnPieceToTray(this.game.selectedPiece);
        }
      }
    });
  }

  startDrag(piece, element, e) {
    // Only primary mouse button or touch
    if (e.button !== undefined && e.button !== 0) return;

    e.preventDefault();
    this.game.selectPiece(piece);

    this.activePiece = piece;
    this.dragTargetEl = element;
    this.pointerId = e.pointerId;
    this.startClientX = e.clientX;
    this.startClientY = e.clientY;
    this.hasMovedPastThreshold = false;

    const rect = element.getBoundingClientRect();
    this.offsetX = e.clientX - rect.left;
    this.offsetY = e.clientY - rect.top;

    try {
      element.setPointerCapture(e.pointerId);
    } catch (err) {
      // Fallback
    }

    sound.playPickup();
  }

  onPointerMove(e) {
    if (!this.activePiece || !this.dragTargetEl) return;
    if (this.pointerId !== null && e.pointerId !== this.pointerId) return;

    const dx = e.clientX - this.startClientX;
    const dy = e.clientY - this.startClientY;

    // Wait for small movement threshold before entering dragging state
    if (!this.hasMovedPastThreshold) {
      if (Math.hypot(dx, dy) > 4) {
        this.hasMovedPastThreshold = true;
        this.isDragging = true;
        this.dragTargetEl.classList.add('is-dragging');
        document.body.classList.add('dragging-active');
      } else {
        return;
      }
    }

    // Move floating element with cursor
    const floatingLeft = e.clientX - this.offsetX;
    const floatingTop = e.clientY - this.offsetY;

    this.dragTargetEl.style.position = 'fixed';
    this.dragTargetEl.style.left = `${floatingLeft}px`;
    this.dragTargetEl.style.top = `${floatingTop}px`;
    this.dragTargetEl.style.zIndex = '9999';

    // Calculate position relative to frame
    this.updateFrameSnapPreview(floatingLeft, floatingTop);
  }

  updateFrameSnapPreview(floatingLeft, floatingTop) {
    const frameRect = this.game.frameEl.getBoundingClientRect();
    const unitSize = this.game.unitSizePx;

    // Check if floating piece overlaps frame bounds
    const pieceBounds = this.activePiece.bounds || Geometry.getBounds(this.activePiece.transformedPoints || this.activePiece.points);
    const pieceW = pieceBounds.width * unitSize;
    const pieceH = pieceBounds.height * unitSize;

    // Relative offset of piece top-left from frame top-left
    const relX = floatingLeft - frameRect.left;
    const relY = floatingTop - frameRect.top;

    // Margin around frame where snap triggers
    const triggerMargin = unitSize * 1.5;

    if (
      relX + pieceW > -triggerMargin &&
      relX < frameRect.width + triggerMargin &&
      relY + pieceH > -triggerMargin &&
      relY < frameRect.height + triggerMargin
    ) {
      this.isOverFrame = true;

      // Snap to nearest 0.5 or 1.0 unit grid
      const snapStep = 0.5;
      let rawGridX = relX / unitSize;
      let rawGridY = relY / unitSize;

      let snappedGridX = Math.round(rawGridX / snapStep) * snapStep;
      let snappedGridY = Math.round(rawGridY / snapStep) * snapStep;

      // Clamp to frame boundaries
      const maxGridX = this.game.currentLevel.gridWidth - pieceBounds.width;
      const maxGridY = this.game.currentLevel.gridHeight - pieceBounds.height;

      snappedGridX = Math.max(0, Math.min(snappedGridX, maxGridX));
      snappedGridY = Math.max(0, Math.min(snappedGridY, maxGridY));

      this.candidateGridX = snappedGridX;
      this.candidateGridY = snappedGridY;

      this.game.showSnapGhost(this.activePiece, snappedGridX, snappedGridY);
    } else {
      this.isOverFrame = false;
      this.candidateGridX = null;
      this.candidateGridY = null;
      this.game.hideSnapGhost();
    }
  }

  onPointerUp(e) {
    if (!this.activePiece) return;
    if (this.pointerId !== null && e.pointerId !== this.pointerId) return;

    const piece = this.activePiece;
    const el = this.dragTargetEl;

    try {
      if (el && el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId);
      }
    } catch (err) {}

    const wasMoving = this.hasMovedPastThreshold;

    this.activePiece = null;
    this.dragTargetEl = null;
    this.isDragging = false;
    this.pointerId = null;
    this.hasMovedPastThreshold = false;

    if (el) {
      el.classList.remove('is-dragging');
    }
    document.body.classList.remove('dragging-active');
    this.game.hideSnapGhost();

    if (!wasMoving) {
      // Just a click/tap on the piece!
      // Select the piece for rotation or mobile control
      this.game.selectPiece(piece);
      return;
    }

    // Dropped after dragging!
    if (this.isOverFrame && this.candidateGridX !== null && this.candidateGridY !== null) {
      // Place piece in frame at candidate grid coordinates
      this.game.placePieceInFrame(piece, this.candidateGridX, this.candidateGridY);
      sound.playSnap();
    } else {
      // Dropped outside frame -> return to tray or keep in tray
      this.game.returnPieceToTray(piece);
      sound.playDrop();
    }
  }
}

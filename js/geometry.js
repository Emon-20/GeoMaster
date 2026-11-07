/**
 * PackMaster: Geometry - Geometry Engine
 * Math routines for 2D polygons, curved geometric primitives,
 * rotations, bounds, SVG path generation, and solid-fill validation.
 */

export class Geometry {
  /**
   * Rotate a list of 2D points [x, y] around origin by degrees (typically multiples of 90 or 45).
   */
  static rotatePoints(points, degrees) {
    const rad = (degrees * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    return points.map(([x, y]) => {
      const rx = x * cos - y * sin;
      const ry = x * sin + y * cos;
      // Round to 4 decimal places to avoid floating point drift
      return [Math.round(rx * 10000) / 10000, Math.round(ry * 10000) / 10000];
    });
  }

  /**
   * Flip / Mirror points horizontally
   */
  static flipPoints(points) {
    return points.map(([x, y]) => [-x, y]);
  }

  /**
   * Normalize polygon coordinates so top-left of bounding box is (0,0)
   */
  static normalizePoints(points) {
    if (!points || points.length === 0) return points;
    let minX = Infinity;
    let minY = Infinity;
    for (const [x, y] of points) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
    }
    return points.map(([x, y]) => [
      Math.round((x - minX) * 10000) / 10000,
      Math.round((y - minY) * 10000) / 10000
    ]);
  }

  /**
   * Get axis-aligned bounding box of points
   */
  static getBounds(points) {
    if (!points || points.length === 0) return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;
    for (const [x, y] of points) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
    return {
      minX, minY, maxX, maxY,
      width: Math.round((maxX - minX) * 10000) / 10000,
      height: Math.round((maxY - minY) * 10000) / 10000
    };
  }

  /**
   * Calculate polygon area using Shoelace formula
   */
  static getPolygonArea(points) {
    if (!points || points.length < 3) return 0;
    let area = 0;
    const n = points.length;
    for (let i = 0; i < n; i++) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[(i + 1) % n];
      area += x1 * y2 - x2 * y1;
    }
    return Math.abs(area) / 2;
  }

  /**
   * Generate SVG path data 'd' attribute from points with given unit scale (pixels per unit)
   */
  static pointsToSvgPath(points, scale = 50) {
    if (!points || points.length === 0) return '';
    const d = points.map(([x, y], idx) => {
      const px = (x * scale).toFixed(1);
      const py = (y * scale).toFixed(1);
      return idx === 0 ? `M ${px} ${py}` : `L ${px} ${py}`;
    });
    return d.join(' ') + ' Z';
  }

  /**
   * Generate SVG path data for a curved piece (Circle or Semicircular Bracket)
   */
  static getCurvedPiecePath(piece, scale = 50) {
    const s = scale;
    if (piece.type === 'circle') {
      const r = piece.radius * s;
      const d = 2 * r;
      // SVG circle path
      return `M ${r} 0 A ${r} ${r} 0 1 0 ${r} ${d} A ${r} ${r} 0 1 0 ${r} 0 Z`;
    }

    if (piece.type === 'bracket') {
      // Semicircular cradle bracket: 2x1 rectangle with semicircle of radius 1 cut into it
      // Rotations 0: North cradle (notch on bottom)
      // 90: East cradle (notch on left)
      // 180: South cradle (notch on top)
      // 270: West cradle (notch on right)
      const rot = (piece.rotation || 0) % 360;
      const r = 1 * s;
      if (rot === 0) {
        // Width 2, Height 1. Notch at bottom center (1, 1), radius 1
        return `M 0 0 L ${2*s} 0 L ${2*s} ${s} A ${r} ${r} 0 0 1 0 ${s} Z`;
      } else if (rot === 90) {
        // Width 1, Height 2. Notch at left center (0, 1), radius 1
        return `M ${s} 0 L ${s} ${2*s} L 0 ${2*s} A ${r} ${r} 0 0 1 0 0 Z`;
      } else if (rot === 180) {
        // Width 2, Height 1. Notch at top center (1, 0), radius 1
        return `M 0 ${s} L ${2*s} ${s} L ${2*s} 0 A ${r} ${r} 0 0 1 0 0 Z`;
      } else {
        // rot === 270. Width 1, Height 2. Notch at right center (1, 1), radius 1
        return `M 0 0 L 0 ${2*s} L ${s} ${2*s} A ${r} ${r} 0 0 1 ${s} 0 Z`;
      }
    }

    return '';
  }

  /**
   * Render piece shape onto an HTML5 2D canvas context for visual or mask validation
   */
  static drawPieceToCanvas(ctx, piece, posX, posY, scale) {
    ctx.save();
    ctx.translate(posX * scale, posY * scale);

    if (piece.type === 'circle') {
      const r = piece.radius * scale;
      ctx.beginPath();
      ctx.arc(r, r, r, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    } else if (piece.type === 'bracket') {
      // Draw using Path2D from SVG path
      const pathD = Geometry.getCurvedPiecePath(piece, scale);
      const path2d = new Path2D(pathD);
      ctx.fill(path2d);
    } else {
      // Polygon
      const points = piece.transformedPoints || piece.points;
      if (points && points.length > 0) {
        ctx.beginPath();
        points.forEach(([x, y], idx) => {
          if (idx === 0) ctx.moveTo(x * scale, y * scale);
          else ctx.lineTo(x * scale, y * scale);
        });
        ctx.closePath();
        ctx.fill();
      }
    }

    ctx.restore();
  }

  /**
   * Validate solid packing of frame using high-resolution offscreen canvas mask.
   * Returns: { isSolved, coverageRatio, overlapDetected, outOfBoundsDetected, uncoveredPixels }
   */
  static validatePacking(frameWidth, frameHeight, placedPieces) {
    if (!placedPieces || placedPieces.length === 0) {
      return { isSolved: false, coverageRatio: 0, overlapDetected: false, outOfBoundsDetected: false };
    }

    // Use a test scale of 20 pixels per grid unit for high-speed sub-pixel accuracy
    const scale = 20;
    const canvasW = Math.round(frameWidth * scale);
    const canvasH = Math.round(frameHeight * scale);

    const canvas = document.createElement('canvas');
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return { isSolved: false, coverageRatio: 0 };

    // Step 1: Check for any piece sticking out of frame bounds
    let outOfBoundsDetected = false;
    for (const p of placedPieces) {
      const b = p.bounds || Geometry.getBounds(p.transformedPoints || p.points);
      const px = p.gridX;
      const py = p.gridY;
      const eps = 0.001;
      if (px < -eps || py < -eps || (px + b.width) > frameWidth + eps || (py + b.height) > frameHeight + eps) {
        outOfBoundsDetected = true;
        break;
      }
    }

    if (outOfBoundsDetected) {
      return { isSolved: false, coverageRatio: 0, overlapDetected: false, outOfBoundsDetected: true };
    }

    // Step 2: Detect overlaps using additive rendering
    // Fill background with black (0)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Render each piece with opacity 1 and value 10 in red channel
    // If any pixel exceeds 10, overlap occurred!
    ctx.fillStyle = 'rgb(30, 0, 0)';
    for (const p of placedPieces) {
      Geometry.drawPieceToCanvas(ctx, p, p.gridX, p.gridY, scale);
    }

    const imgData = ctx.getImageData(0, 0, canvasW, canvasH);
    const data = imgData.data;
    const totalPixels = canvasW * canvasH;

    let coveredPixels = 0;
    let overlapPixels = 0;

    for (let i = 0; i < data.length; i += 4) {
      const rVal = data[i];
      if (rVal > 0) {
        if (rVal > 45) { // Threshold for 2 pieces overlapping (30 + 30 = 60, with antialiasing tolerance)
          overlapPixels++;
        } else {
          coveredPixels++;
        }
      }
    }

    const overlapDetected = overlapPixels > (totalPixels * 0.002); // 0.2% tolerance for edge antialiasing
    const coverageRatio = (coveredPixels + overlapPixels) / totalPixels;
    
    // Puzzle is solved if >= 99.2% frame covered and no significant overlap
    const isSolved = (!overlapDetected) && (!outOfBoundsDetected) && (coverageRatio >= 0.992);

    return {
      isSolved,
      coverageRatio: Math.min(1.0, Math.round(coverageRatio * 1000) / 1000),
      overlapDetected,
      outOfBoundsDetected,
      overlapPixels
    };
  }
}

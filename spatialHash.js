export class SpatialHashGrid {
  constructor(cellSize) {
    this.cellSize = cellSize;
    this.cells = new Map();
  }
  clear() { this.cells.clear(); }
  keyFromXY(x, y) {
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    return `${cx},${cy}`;
  }
  insert(obj, aabb) {
    const minX = Math.floor(aabb.x / this.cellSize);
    const minY = Math.floor(aabb.y / this.cellSize);
    const maxX = Math.floor((aabb.x + aabb.w) / this.cellSize);
    const maxY = Math.floor((aabb.y + aabb.h) / this.cellSize);
    for (let cy = minY; cy <= maxY; cy++) {
      for (let cx = minX; cx <= maxX; cx++) {
        const key = `${cx},${cy}`;
        let bucket = this.cells.get(key);
        if (!bucket) { bucket = new Set(); this.cells.set(key, bucket); }
        bucket.add(obj);
      }
    }
  }
  retrieve(aabb) {
    const minX = Math.floor(aabb.x / this.cellSize);
    const minY = Math.floor(aabb.y / this.cellSize);
    const maxX = Math.floor((aabb.x + aabb.w) / this.cellSize);
    const maxY = Math.floor((aabb.y + aabb.h) / this.cellSize);
    const results = new Set();
    for (let cy = minY; cy <= maxY; cy++) {
      for (let cx = minX; cx <= maxX; cx++) {
        const key = `${cx},${cy}`;
        const bucket = this.cells.get(key);
        if (bucket) { for (const obj of bucket) results.add(obj); }
      }
    }
    return results;
  }
}

// Efficiency: naive O(n^2) pair checks → spatial hash O(n * k) with small k




/**
 * Byte-mode QR Code encoder (ISO/IEC 18004), versions 1–10, error correction L or M.
 * Structure follows Project Nayuki's public QR Code generator (MIT); see README.md.
 */
export type QrLevel = "L" | "M";
export type QrMatrix = { size: number; version: number; mask: number; dark: boolean[][] };

const EC_PER_BLOCK: Record<QrLevel, number[]> = {
  L: [0, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18], M: [0, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26] };
const BLOCKS: Record<QrLevel, number[]> = {
  L: [0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4], M: [0, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5] };
const FORMAT_BITS: Record<QrLevel, number> = { L: 1, M: 0 };

const bit = (value: number, index: number) => ((value >>> index) & 1) !== 0;

function rawModules(version: number): number {
  let result = (16 * version + 128) * version + 64;
  if (version >= 2) {
    const align = Math.floor(version / 7) + 2;
    result -= (25 * align - 10) * align - 55;
    if (version >= 7) result -= 36;
  }
  return result;
}

const dataCodewords = (version: number, level: QrLevel) =>
  Math.floor(rawModules(version) / 8) - EC_PER_BLOCK[level][version] * BLOCKS[level][version];

function multiply(x: number, y: number): number {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z;
}

function divisor(degree: number): number[] {
  const result = new Array<number>(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < degree; j++) {
      result[j] = multiply(result[j], root);
      if (j + 1 < degree) result[j] ^= result[j + 1];
    }
    root = multiply(root, 0x02);
  }
  return result;
}

function remainder(data: number[], generator: number[]): number[] {
  const result = generator.map(() => 0);
  for (const byte of data) {
    const factor = byte ^ (result.shift() as number);
    result.push(0);
    generator.forEach((coefficient, index) => { result[index] ^= multiply(coefficient, factor); });
  }
  return result;
}

function codewords(bytes: Uint8Array, version: number, level: QrLevel): number[] {
  const capacity = dataCodewords(version, level), bits: number[] = [];
  const push = (value: number, length: number) => { for (let i = length - 1; i >= 0; i--) bits.push((value >>> i) & 1); };
  push(0b0100, 4);
  push(bytes.length, version < 10 ? 8 : 16);
  bytes.forEach(byte => push(byte, 8));
  push(0, Math.min(4, capacity * 8 - bits.length));
  push(0, (8 - bits.length % 8) % 8);
  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8) data.push(bits.slice(i, i + 8).reduce((byte, value) => byte << 1 | value, 0));
  for (let pad = 0xec; data.length < capacity; pad ^= 0xec ^ 0x11) data.push(pad);
  const blockCount = BLOCKS[level][version], ecLength = EC_PER_BLOCK[level][version];
  const raw = Math.floor(rawModules(version) / 8), shortCount = blockCount - raw % blockCount;
  const shortLength = Math.floor(raw / blockCount), generator = divisor(ecLength), blocks: number[][] = [];
  for (let i = 0, offset = 0; i < blockCount; i++) {
    const block = data.slice(offset, offset + shortLength - ecLength + (i < shortCount ? 0 : 1));
    offset += block.length;
    const ec = remainder(block, generator);
    if (i < shortCount) block.push(0);
    blocks.push(block.concat(ec));
  }
  const result: number[] = [];
  for (let i = 0; i < blocks[0].length; i++) {
    blocks.forEach((block, j) => { if (i !== shortLength - ecLength || j >= shortCount) result.push(block[i]); });
  }
  return result;
}

class Grid {
  readonly dark: boolean[][];
  readonly fixed: boolean[][];
  constructor(readonly size: number) {
    this.dark = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
    this.fixed = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  }
  set(x: number, y: number, dark: boolean) { this.dark[y][x] = dark; this.fixed[y][x] = true; }
}

function alignment(version: number, size: number): number[] {
  if (version === 1) return [];
  const count = Math.floor(version / 7) + 2;
  const step = Math.floor((version * 8 + count * 3 + 5) / (count * 4 - 4)) * 2;
  const result = [6];
  for (let position = size - 7; result.length < count; position -= step) result.splice(1, 0, position);
  return result;
}

function drawFormat(grid: Grid, level: QrLevel, mask: number) {
  const data = FORMAT_BITS[level] << 3 | mask;
  let rem = data;
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
  const bits = (data << 10 | rem) ^ 0x5412, size = grid.size;
  for (let i = 0; i <= 5; i++) grid.set(8, i, bit(bits, i));
  grid.set(8, 7, bit(bits, 6)); grid.set(8, 8, bit(bits, 7)); grid.set(7, 8, bit(bits, 8));
  for (let i = 9; i < 15; i++) grid.set(14 - i, 8, bit(bits, i));
  for (let i = 0; i < 8; i++) grid.set(size - 1 - i, 8, bit(bits, i));
  for (let i = 8; i < 15; i++) grid.set(8, size - 15 + i, bit(bits, i));
  grid.set(8, size - 8, true);
}

function drawFunctions(grid: Grid, version: number, level: QrLevel) {
  const size = grid.size;
  for (let i = 0; i < size; i++) { grid.set(6, i, i % 2 === 0); grid.set(i, 6, i % 2 === 0); }
  for (const [cx, cy] of [[3, 3], [size - 4, 3], [3, size - 4]]) {
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
      const x = cx + dx, y = cy + dy, distance = Math.max(Math.abs(dx), Math.abs(dy));
      if (x >= 0 && x < size && y >= 0 && y < size) grid.set(x, y, distance !== 2 && distance !== 4);
    }
  }
  const positions = alignment(version, size), last = positions.length - 1;
  positions.forEach((cx, i) => positions.forEach((cy, j) => {
    if ((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)) return;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) grid.set(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
  }));
  drawFormat(grid, level, 0);
  if (version < 7) return;
  let rem = version;
  for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
  const bits = version << 12 | rem;
  for (let i = 0; i < 18; i++) {
    const a = size - 11 + i % 3, b = Math.floor(i / 3);
    grid.set(a, b, bit(bits, i)); grid.set(b, a, bit(bits, i));
  }
}

function drawData(grid: Grid, data: number[]) {
  const size = grid.size;
  let index = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vertical = 0; vertical < size; vertical++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j, upward = ((right + 1) & 2) === 0, y = upward ? size - 1 - vertical : vertical;
        if (!grid.fixed[y][x] && index < data.length * 8) {
          grid.dark[y][x] = bit(data[index >>> 3], 7 - (index & 7));
          index++;
        }
      }
    }
  }
}

const MASKS: Array<(x: number, y: number) => boolean> = [
  (x, y) => (x + y) % 2 === 0, (_x, y) => y % 2 === 0, x => x % 3 === 0, (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => x * y % 2 + x * y % 3 === 0,
  (x, y) => (x * y % 2 + x * y % 3) % 2 === 0, (x, y) => ((x + y) % 2 + x * y % 3) % 2 === 0,
];

function applyMask(grid: Grid, mask: number) {
  for (let y = 0; y < grid.size; y++) for (let x = 0; x < grid.size; x++) {
    if (!grid.fixed[y][x] && MASKS[mask](x, y)) grid.dark[y][x] = !grid.dark[y][x];
  }
}

function penalty(grid: Grid): number {
  const size = grid.size;
  let result = 0, darkCount = 0;
  const count = (history: number[]) => {
    const n = history[1], core = n > 0 && history[2] === n && history[3] === n * 3 && history[4] === n && history[5] === n;
    return (core && history[0] >= n * 4 && history[6] >= n ? 1 : 0) + (core && history[6] >= n * 4 && history[0] >= n ? 1 : 0);
  };
  const add = (length: number, history: number[]) => {
    if (history[0] === 0) length += size;
    history.pop(); history.unshift(length);
  };
  for (const vertical of [false, true]) {
    for (let a = 0; a < size; a++) {
      let color = false, run = 0;
      const history = [0, 0, 0, 0, 0, 0, 0];
      for (let b = 0; b < size; b++) {
        const value = vertical ? grid.dark[b][a] : grid.dark[a][b];
        if (value === color) {
          run++;
          if (run === 5) result += 3; else if (run > 5) result++;
        } else {
          add(run, history);
          if (!color) result += count(history) * 40;
          color = value; run = 1;
        }
      }
      if (color) { add(run, history); run = 0; }
      add(run + size, history);
      result += count(history) * 40;
    }
  }
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const color = grid.dark[y][x];
    if (color) darkCount++;
    if (x < size - 1 && y < size - 1 && color === grid.dark[y][x + 1] && color === grid.dark[y + 1][x]
      && color === grid.dark[y + 1][x + 1]) result += 3;
  }
  const total = size * size;
  return result + (Math.ceil(Math.abs(darkCount * 20 - total * 10) / total) - 1) * 10;
}

/** Encodes text as UTF-8 bytes in the smallest version that fits. */
export function encodeQr(text: string, options: { level?: QrLevel; mask?: number } = {}): QrMatrix {
  const level = options.level ?? "M", bytes = new TextEncoder().encode(text);
  let version = 1;
  while (version <= 10 && 4 + (version < 10 ? 8 : 16) + bytes.length * 8 > dataCodewords(version, level) * 8) version++;
  if (version > 10) throw new Error("Text is too long for this QR encoder.");
  const grid = new Grid(version * 4 + 17);
  drawFunctions(grid, version, level);
  drawData(grid, codewords(bytes, version, level));
  let mask = options.mask ?? -1;
  if (mask < 0) {
    let best = Infinity;
    for (let candidate = 0; candidate < 8; candidate++) {
      applyMask(grid, candidate); drawFormat(grid, level, candidate);
      const score = penalty(grid);
      if (score < best) { best = score; mask = candidate; }
      applyMask(grid, candidate);
    }
  }
  applyMask(grid, mask); drawFormat(grid, level, mask);
  return { size: grid.size, version, mask, dark: grid.dark };
}

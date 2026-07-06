const CUBIC_BEZIER_RE = /^cubic-bezier\(\s*(-?(?:\d+|\d*\.\d+))\s*,\s*(-?(?:\d+|\d*\.\d+))\s*,\s*(-?(?:\d+|\d*\.\d+))\s*,\s*(-?(?:\d+|\d*\.\d+))\s*\)$/i;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function cubicBezierCoordinate(a: number, b: number, t: number): number {
  const inverse = 1 - t;
  return (3 * inverse * inverse * t * a) + (3 * inverse * t * t * b) + (t * t * t);
}

function cubicBezierDerivative(a: number, b: number, t: number): number {
  const inverse = 1 - t;
  return (3 * inverse * inverse * a) + (6 * inverse * t * (b - a)) + (3 * t * t * (1 - b));
}

function solveCubicBezier(x1: number, y1: number, x2: number, y2: number, progress: number): number {
  let guess = progress;
  for (let index = 0; index < 6; index += 1) {
    const currentX = cubicBezierCoordinate(x1, x2, guess) - progress;
    const derivative = cubicBezierDerivative(x1, x2, guess);
    if (Math.abs(currentX) < 0.0001 || Math.abs(derivative) < 0.0001) break;
    guess = clamp(guess - currentX / derivative, 0, 1);
  }
  return cubicBezierCoordinate(y1, y2, guess);
}

function parseCubicBezier(easing: string): readonly [number, number, number, number] | null {
  const match = easing.trim().match(CUBIC_BEZIER_RE);
  const x1 = match?.[1] ? Number(match[1]) : Number.NaN;
  const y1 = match?.[2] ? Number(match[2]) : Number.NaN;
  const x2 = match?.[3] ? Number(match[3]) : Number.NaN;
  const y2 = match?.[4] ? Number(match[4]) : Number.NaN;
  return [x1, y1, x2, y2].every(Number.isFinite) ? [x1, y1, x2, y2] : null;
}

export function applyTimelineEasing(easing: string | undefined, progress: number): number {
  const t = clamp(progress, 0, 1);
  const name = easing?.trim() || 'linear';
  if (name === 'linear') return t;
  if (name === 'ease-in') return t * t;
  if (name === 'ease-out') return 1 - ((1 - t) * (1 - t));
  if (name === 'ease-in-out') return t < 0.5 ? 2 * t * t : 1 - (2 * (1 - t) * (1 - t));
  if (name === 'ease') return solveCubicBezier(0.25, 0.1, 0.25, 1, t);
  if (name === 'elastic') return solveCubicBezier(0.34, 1.56, 0.64, 1, t);
  const cubic = parseCubicBezier(name);
  return cubic ? solveCubicBezier(cubic[0], cubic[1], cubic[2], cubic[3], t) : t;
}

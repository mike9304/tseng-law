type LengthValue = {
  readonly value: number;
  readonly unit: string;
};

type TransformParts = {
  readonly translateX: LengthValue;
  readonly translateY: LengthValue;
  readonly scaleX: number;
  readonly scaleY: number;
  readonly rotate: number;
  readonly unsupported: boolean;
};

const TRANSFORM_RE = /([a-zA-Z0-9]+)\(([^)]*)\)/g;
const NUMBER_RE = /^(-?(?:\d+|\d*\.\d+))([a-z%]*)$/i;

function formatNumber(value: number): string {
  const rounded = Number(value.toFixed(3));
  return Object.is(rounded, -0) ? '0' : String(rounded);
}

function lengthValue(value: number, unit = 'px'): LengthValue {
  return { value, unit: unit || 'px' };
}

function emptyTransformParts(): TransformParts {
  return {
    translateX: lengthValue(0),
    translateY: lengthValue(0),
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
    unsupported: false,
  };
}

function parseNumberUnit(raw: string): LengthValue | null {
  const match = raw.trim().match(NUMBER_RE);
  const rawValue = match?.[1];
  if (!rawValue) return null;
  const value = Number(rawValue);
  if (!Number.isFinite(value)) return null;
  return lengthValue(value, match?.[2] ?? '');
}

function parseUnitlessNumber(raw: string): number | null {
  const value = Number(raw.trim());
  return Number.isFinite(value) ? value : null;
}

function splitTransformArgs(raw: string): string[] {
  return raw.split(/[\s,]+/).map((part) => part.trim()).filter(Boolean);
}

function parseTransform(transform: string | undefined): TransformParts | null {
  if (!transform || transform.trim() === '' || transform.trim() === 'none') return emptyTransformParts();
  let next = emptyTransformParts();
  let matched = false;

  for (const match of transform.matchAll(TRANSFORM_RE)) {
    const rawName = match[1];
    const rawArgs = match[2];
    if (!rawName || !rawArgs) continue;
    matched = true;
    const args = splitTransformArgs(rawArgs);
    const name = rawName.toLowerCase();

    if (name === 'translatey') {
      const y = args[0] ? parseNumberUnit(args[0]) : null;
      if (!y) return null;
      next = { ...next, translateY: y };
    } else if (name === 'translatex') {
      const x = args[0] ? parseNumberUnit(args[0]) : null;
      if (!x) return null;
      next = { ...next, translateX: x };
    } else if (name === 'translate') {
      const x = args[0] ? parseNumberUnit(args[0]) : null;
      const y = args[1] ? parseNumberUnit(args[1]) : lengthValue(0, x?.unit ?? 'px');
      if (!x || !y) return null;
      next = { ...next, translateX: x, translateY: y };
    } else if (name === 'scale') {
      const x = args[0] ? parseUnitlessNumber(args[0]) : null;
      const y = args[1] ? parseUnitlessNumber(args[1]) : x;
      if (x === null || y === null) return null;
      next = { ...next, scaleX: x, scaleY: y };
    } else if (name === 'scalex') {
      const x = args[0] ? parseUnitlessNumber(args[0]) : null;
      if (x === null) return null;
      next = { ...next, scaleX: x };
    } else if (name === 'scaley') {
      const y = args[0] ? parseUnitlessNumber(args[0]) : null;
      if (y === null) return null;
      next = { ...next, scaleY: y };
    } else if (name === 'rotate') {
      const rotate = args[0] ? parseNumberUnit(args[0]) : null;
      if (!rotate) return null;
      next = { ...next, rotate: rotate.value };
    } else {
      next = { ...next, unsupported: true };
    }
  }

  return matched ? next : null;
}

function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress;
}

function lerpLength(start: LengthValue, end: LengthValue, progress: number): LengthValue {
  const unit = end.unit || start.unit || 'px';
  return lengthValue(lerp(start.value, end.value, progress), unit);
}

function composeTransform(parts: TransformParts): string {
  const transforms: string[] = [];
  if (parts.translateX.value !== 0) {
    transforms.push(`translateX(${formatNumber(parts.translateX.value)}${parts.translateX.unit})`);
  }
  if (parts.translateY.value !== 0) {
    transforms.push(`translateY(${formatNumber(parts.translateY.value)}${parts.translateY.unit})`);
  }
  if (parts.scaleX !== 1 || parts.scaleY !== 1) {
    const scale = parts.scaleX === parts.scaleY
      ? `scale(${formatNumber(parts.scaleX)})`
      : `scale(${formatNumber(parts.scaleX)}, ${formatNumber(parts.scaleY)})`;
    transforms.push(scale);
  }
  if (parts.rotate !== 0) {
    transforms.push(`rotate(${formatNumber(parts.rotate)}deg)`);
  }
  return transforms.length > 0 ? transforms.join(' ') : 'none';
}

export function interpolateTimelineTransform(
  startTransform: string | undefined,
  endTransform: string | undefined,
  progress: number,
): string | undefined {
  if (!startTransform && !endTransform) return undefined;
  const start = parseTransform(startTransform);
  const end = parseTransform(endTransform);
  if (!start || !end || start.unsupported || end.unsupported) {
    return progress >= 1 ? endTransform ?? 'none' : startTransform ?? 'none';
  }
  return composeTransform({
    translateX: lerpLength(start.translateX, end.translateX, progress),
    translateY: lerpLength(start.translateY, end.translateY, progress),
    scaleX: lerp(start.scaleX, end.scaleX, progress),
    scaleY: lerp(start.scaleY, end.scaleY, progress),
    rotate: lerp(start.rotate, end.rotate, progress),
    unsupported: false,
  });
}

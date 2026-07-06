import { applyTimelineEasing } from './motionTimelineEasing';
import { interpolateTimelineTransform } from './motionTimelineTransform';

export { applyTimelineEasing } from './motionTimelineEasing';
export { interpolateTimelineTransform } from './motionTimelineTransform';

export type RuntimeTimelineKeyframe = {
  readonly offset: number;
  readonly transform?: string;
  readonly opacity?: number;
  readonly easing?: string;
};

export type TimelineFrame = {
  readonly transform?: string;
  readonly opacity?: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function frameFromKeyframe(keyframe: RuntimeTimelineKeyframe): TimelineFrame {
  return {
    ...(keyframe.transform ? { transform: keyframe.transform } : {}),
    ...(keyframe.opacity !== undefined ? { opacity: keyframe.opacity } : {}),
  };
}

export function parseRuntimeTimelineKeyframes(value: unknown): RuntimeTimelineKeyframe[] {
  if (!Array.isArray(value)) return [];
  return value
    .flatMap((entry) => {
      if (!isRecord(entry)) return [];
      const properties = isRecord(entry.properties) ? entry.properties : null;
      const rawOffset = readNumber(entry.offset) ?? readNumber(entry.timeOffset) ?? 0;
      const transform = readString(entry.transform) ?? readString(properties?.transform);
      const opacity = readNumber(entry.opacity) ?? readNumber(properties?.opacity);
      const easing = readString(entry.easing);
      return [{
        offset: clamp(rawOffset, 0, 1),
        ...(transform ? { transform } : {}),
        ...(opacity !== undefined ? { opacity: clamp(opacity, 0, 1) } : {}),
        ...(easing ? { easing } : {}),
      }];
    })
    .sort((left, right) => left.offset - right.offset);
}

export function interpolateTimelineFrame(
  keyframes: readonly RuntimeTimelineKeyframe[],
  progress: number,
): TimelineFrame {
  if (keyframes.length === 0) return {};
  const sorted = [...keyframes].sort((left, right) => left.offset - right.offset);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  if (!first || !last) return {};
  if (progress <= first.offset) return frameFromKeyframe(first);
  if (progress >= last.offset) return frameFromKeyframe(last);

  let start = first;
  let end = last;
  for (let index = 0; index < sorted.length - 1; index += 1) {
    const candidateStart = sorted[index];
    const candidateEnd = sorted[index + 1];
    if (!candidateStart || !candidateEnd) continue;
    if (progress >= candidateStart.offset && progress <= candidateEnd.offset) {
      start = candidateStart;
      end = candidateEnd;
      break;
    }
  }

  const span = end.offset - start.offset || 1;
  const localProgress = clamp((progress - start.offset) / span, 0, 1);
  const easedProgress = applyTimelineEasing(end.easing ?? start.easing, localProgress);
  const transform = interpolateTimelineTransform(start.transform, end.transform, easedProgress);
  return {
    ...(transform ? { transform } : {}),
    opacity: clamp(lerp(start.opacity ?? 1, end.opacity ?? 1, easedProgress), 0, 1),
  };
}

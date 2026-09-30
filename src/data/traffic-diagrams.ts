import type { SiteLocale } from '@/lib/locales';

/**
 * Animated Blender diagrams for the traffic-accident pages.
 *
 * The column loader strips inline markdown images (`stripInlineImages`), so a
 * column opts in through frontmatter instead of the body:
 *
 *   diagram_video: "<id>"                      # id in TRAFFIC_DIAGRAMS
 *   diagram_video_after: "<## heading text>"   # optional: place the figure after
 *                                              # the first paragraph of that section
 *
 * Rules (tseng-blender-pilot/traffic/ROUTINE.md): no text inside the frames
 * (number badges only), the clip freezes just before contact, only facts from
 * the source account are drawn, and every caption carries the
 * illustrative-assumption note.
 */
export type TrafficDiagramLocale = Extract<SiteLocale, 'ko' | 'zh-hant' | 'en' | 'ja'>;

export type TrafficDiagramCopy = {
  alt: string;
  legend: string;
  caption: string;
  assumption: string;
};

export type TrafficDiagram = {
  id: string;
  mp4: string;
  webm: string;
  mobileMp4: string;
  mobileWebm: string;
  poster: string;
  mobilePoster: string;
  width: number;
  height: number;
  mobileWidth: number;
  mobileHeight: number;
  durationSeconds: number;
  copy: Record<TrafficDiagramLocale, TrafficDiagramCopy>;
};

export const TRAFFIC_DIAGRAM_MOBILE_QUERY = '(max-width: 640px)';

/**
 * Registry is intentionally empty: the overtaking-012 reconstruction was withdrawn
 * on 2026-09-30 (the party in that case did not consent). Only generic,
 * hypothetical scenes that cannot be linked to a real case may be added here.
 */
export const TRAFFIC_DIAGRAMS = {
} as const satisfies Record<string, TrafficDiagram>;

export type TrafficDiagramId = keyof typeof TRAFFIC_DIAGRAMS;

export function isTrafficDiagramId(value: unknown): value is TrafficDiagramId {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(TRAFFIC_DIAGRAMS, value);
}

export function isTrafficDiagramLocale(value: string): value is TrafficDiagramLocale {
  return value === 'ko' || value === 'zh-hant' || value === 'en' || value === 'ja';
}

export type ColumnDiagramVideo = { id: TrafficDiagramId; afterHeading?: string };

/** Normalize `diagram_video` / `diagram_video_after` frontmatter. Unknown ids are dropped. */
export function normalizeColumnDiagramVideo(id: unknown, afterHeading: unknown): ColumnDiagramVideo | undefined {
  const trimmed = typeof id === 'string' ? id.trim() : '';
  if (!isTrafficDiagramId(trimmed)) return undefined;
  const heading = typeof afterHeading === 'string' ? afterHeading.trim() : '';
  return heading ? { id: trimmed, afterHeading: heading } : { id: trimmed };
}

/**
 * Split a column body after the first paragraph that follows `## heading`.
 * Returns null when the heading is absent, so callers can fall back to placing
 * the figure before the body.
 */
export function splitColumnContentAfterHeading(content: string, heading: string): [string, string] | null {
  const lines = content.split('\n');
  const target = heading.replace(/^#+\s*/, '').trim();
  const start = lines.findIndex((line) => /^##\s+/.test(line) && line.replace(/^##\s+/, '').trim() === target);
  if (start < 0) return null;
  let index = start + 1;
  while (index < lines.length && lines[index].trim() === '') index += 1;
  if (index >= lines.length || /^#{1,6}\s/.test(lines[index])) {
    index = start + 1;
  } else {
    while (index < lines.length && lines[index].trim() !== '') index += 1;
  }
  const before = lines.slice(0, index).join('\n').trimEnd();
  const after = lines.slice(index).join('\n').trim();
  return [before, after];
}

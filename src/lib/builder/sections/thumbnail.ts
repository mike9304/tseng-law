import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { resolveCanvasNodeAbsoluteRect } from '@/lib/builder/canvas/tree';
import { normalizeSavedSectionSnapshot } from '@/lib/builder/sections/normalize';

const MAX_THUMBNAIL_LENGTH = 500_000;

const KIND_COLORS: Record<string, { fill: string; stroke?: string; opacity?: number }> = {
  text: { fill: '#cbd5e1' },
  heading: { fill: '#94a3b8' },
  image: { fill: '#64748b', opacity: 0.72 },
  button: { fill: '#3b82f6' },
  container: { fill: '#f8fafc', stroke: '#cbd5e1', opacity: 0.94 },
  section: { fill: '#f1f5f9', stroke: '#cbd5e1', opacity: 0.94 },
  form: { fill: '#10b981', opacity: 0.2, stroke: '#10b981' },
  'form-input': { fill: '#10b981', opacity: 0.36 },
  'form-textarea': { fill: '#10b981', opacity: 0.28 },
  'form-submit': { fill: '#059669' },
  divider: { fill: '#e5e7eb' },
  spacer: { fill: '#e5e7eb', opacity: 0.5 },
  icon: { fill: '#fbbf24' },
  'video-embed': { fill: '#8b5cf6', opacity: 0.7 },
};

const UNSAFE_SCRIPT_RE = /<\s*\/?\s*script(?:\s|>|\/)/i;
const UNSAFE_EVENT_ATTR_RE = /\s+on[a-z][\w:-]*\s*=/i;
const UNSAFE_HREF_RE = /\b(?:href|xlink:href)\s*=\s*(?:"(?!#)[^"]*"|'(?!#)[^']*'|(?!#)[^\s>]+)/i;
const UNSAFE_PROTOCOL_RE = /\b(?:javascript|vbscript|data)\s*:/i;

export function buildSavedSectionThumbnailSvg(
  nodes: BuilderCanvasNode[],
  rootNodeId: string,
  width = 240,
  height = 140,
): string {
  const svgWidth = clampSvgDimension(width, 40, 2000);
  const svgHeight = clampSvgDimension(height, 40, 2000);
  const normalizedNodes = normalizeSavedSectionSnapshot(nodes, rootNodeId);
  const root = normalizedNodes.find((node) => node.id === rootNodeId);
  if (!root) {
    return assertSafeSvgThumbnail(wrapSvg(svgWidth, svgHeight, ''));
  }

  const nodesById = new Map(normalizedNodes.map((node) => [node.id, node]));
  const stageWidth = Math.max(40, root.rect.width);
  const stageHeight = Math.max(40, root.rect.height);
  const scale = Math.min(svgWidth / stageWidth, svgHeight / stageHeight);
  const renderWidth = stageWidth * scale;
  const renderHeight = stageHeight * scale;
  const offsetX = (svgWidth - renderWidth) / 2;
  const offsetY = (svgHeight - renderHeight) / 2;

  const ordered = [...normalizedNodes]
    .filter((node) => node.visible !== false)
    .sort((left, right) => (left.zIndex ?? 0) - (right.zIndex ?? 0))
    .slice(0, 140);

  const parts: string[] = [];
  parts.push(
    `<rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" fill="#f8fafc" />`,
  );
  parts.push(
    `<rect x="${formatNumber(offsetX)}" y="${formatNumber(offsetY)}" width="${formatNumber(renderWidth)}" height="${formatNumber(renderHeight)}" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />`,
  );

  for (const node of ordered) {
    const absolute = node.id === root.id
      ? { ...root.rect, x: 0, y: 0 }
      : resolveCanvasNodeAbsoluteRect(node, nodesById);
    const colors = KIND_COLORS[String(node.kind)] ?? { fill: '#e2e8f0' };
    const x = offsetX + absolute.x * scale;
    const y = offsetY + absolute.y * scale;
    const nodeWidth = Math.max(1, absolute.width * scale);
    const nodeHeight = Math.max(1, absolute.height * scale);
    const isContainer = node.kind === 'container' || node.kind === 'section' || node.kind === 'form';
    const opacity = colors.opacity ?? (isContainer ? 0.9 : 1);
    const stroke = colors.stroke ?? (isContainer ? '#cbd5e1' : 'none');
    const radius = node.kind === 'button' ? Math.max(2, Math.min(8, nodeHeight * 0.18)) : 3;
    parts.push(
      `<rect x="${formatNumber(x)}" y="${formatNumber(y)}" width="${formatNumber(nodeWidth)}" height="${formatNumber(nodeHeight)}" rx="${formatNumber(radius)}" fill="${colors.fill}" fill-opacity="${formatNumber(opacity)}" stroke="${stroke}" ${isContainer ? 'stroke-dasharray="4 3" stroke-width="1"' : 'stroke-width="0"'} />`,
    );
  }

  return assertSafeSvgThumbnail(wrapSvg(svgWidth, svgHeight, parts.join('')));
}

export function sanitizeSvgThumbnail(svg: string | undefined | null): string | null {
  if (!svg) return null;
  const trimmed = svg.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_THUMBNAIL_LENGTH) return null;
  if (!/^<svg(?:\s|>)/i.test(trimmed) || !/<\/svg>\s*$/i.test(trimmed)) return null;
  if (UNSAFE_SCRIPT_RE.test(trimmed)) return null;
  if (UNSAFE_EVENT_ATTR_RE.test(trimmed)) return null;
  if (UNSAFE_HREF_RE.test(trimmed)) return null;
  if (UNSAFE_PROTOCOL_RE.test(trimmed)) return null;
  return trimmed;
}

export function assertSafeSvgThumbnail(svg: string): string {
  const safe = sanitizeSvgThumbnail(svg);
  if (!safe) {
    throw new Error('unsafe_svg_thumbnail');
  }
  return safe;
}

function wrapSvg(width: number, height: number, inner: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" style="display:block">${inner}</svg>`;
}

function clampSvgDimension(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function formatNumber(value: number): string {
  return Number.isFinite(value) ? value.toFixed(1) : '0';
}

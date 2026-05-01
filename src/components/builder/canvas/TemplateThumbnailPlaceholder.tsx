import type { PageTemplate } from '@/lib/builder/templates/types';
import { resolveCanvasNodeAbsoluteRect } from '@/lib/builder/canvas/tree';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { getTemplatePalette } from '@/lib/builder/templates/design-system';

function buildStableId(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, '-');
}

function buildRadius(node: BuilderCanvasNode, scale: number): number {
  if (node.kind === 'button') return Math.max(3, Math.min(10, node.rect.height * scale * 0.18));
  if (node.kind === 'image') return 3;
  return 4;
}

function getThumbnailSource(template: PageTemplate): string | null {
  if (!template.thumbnail) return null;
  if (typeof template.thumbnail === 'string') return template.thumbnail;
  if (template.thumbnail.type === 'image' && template.thumbnail.src) return template.thumbnail.src;
  return null;
}

function getNodeFill(node: BuilderCanvasNode, palette: ReturnType<typeof getTemplatePalette>, imageGradientId: string): string {
  if (node.kind === 'image' || node.kind === 'video-embed' || node.kind === 'gallery') return `url(#${imageGradientId})`;
  if (node.kind === 'button' || node.kind === 'form-submit') return palette.accent;
  if (node.kind === 'heading') return palette.ink;
  if (node.kind === 'text') return palette.mutedInk;
  if (node.kind === 'divider' || node.kind === 'spacer') return palette.line;
  if (node.kind === 'icon') return palette.accent;
  if (String(node.kind).startsWith('form')) return palette.accentSoft;
  if (node.kind === 'container' || node.kind === 'section' || node.kind === 'composite') return palette.surface;
  return palette.surfaceAlt;
}

function getNodeOpacity(node: BuilderCanvasNode): number {
  if (node.kind === 'container' || node.kind === 'section') return 0.88;
  if (node.kind === 'text') return 0.72;
  if (node.kind === 'divider' || node.kind === 'spacer') return 0.75;
  if (String(node.kind).startsWith('form')) return 0.78;
  return 1;
}

export default function TemplateThumbnailPlaceholder({
  template,
  width = 240,
  height = 160,
}: {
  template: PageTemplate;
  width?: number;
  height?: number;
}) {
  const document = template.document;
  const palette = getTemplatePalette(template.paletteKey);
  const thumbnailSource = getThumbnailSource(template);
  const scale = Math.min(width / document.stageWidth, height / document.stageHeight);
  const renderWidth = document.stageWidth * scale;
  const renderHeight = document.stageHeight * scale;
  const offsetX = (width - renderWidth) / 2;
  const offsetY = (height - renderHeight) / 2;
  const nodesById = new Map(document.nodes.map((node) => [node.id, node]));
  const nodes = [...document.nodes]
    .filter((node) => node.visible !== false)
    .sort((left, right) => left.zIndex - right.zIndex)
    .slice(0, 150);
  const stableId = buildStableId(template.id);
  const canvasGradientId = `template-canvas-gradient-${stableId}`;
  const imageGradientId = `template-image-gradient-${stableId}`;
  const glowGradientId = `template-glow-gradient-${stableId}`;
  const clipId = `template-clip-${stableId}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${template.name} template preview`}
      style={{ display: 'block', width: '100%', height: '100%', background: palette.canvas }}
    >
      <defs>
        <linearGradient id={canvasGradientId} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={palette.canvas} />
          <stop offset="58%" stopColor={palette.surface} />
          <stop offset="100%" stopColor={palette.accentSoft} />
        </linearGradient>
        <linearGradient id={imageGradientId} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={palette.surfaceAlt} />
          <stop offset="48%" stopColor={palette.accentSoft} />
          <stop offset="100%" stopColor={palette.accent} />
        </linearGradient>
        <radialGradient id={glowGradientId} cx="80%" cy="10%" r="75%">
          <stop offset="0%" stopColor={palette.accent} stopOpacity="0.32" />
          <stop offset="100%" stopColor={palette.accent} stopOpacity="0" />
        </radialGradient>
        <clipPath id={clipId}>
          <rect x={0} y={0} width={width} height={height} rx={0} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect x={0} y={0} width={width} height={height} fill={`url(#${canvasGradientId})`} />
        <rect x={0} y={0} width={width} height={height} fill={`url(#${glowGradientId})`} />
        {thumbnailSource ? (
          <image
            href={thumbnailSource}
            x={0}
            y={0}
            width={width}
            height={height}
            preserveAspectRatio="xMidYMid slice"
            opacity={0.96}
          />
        ) : (
          <>
            <rect
              x={offsetX}
              y={offsetY}
              width={renderWidth}
              height={renderHeight}
              fill={palette.surface}
              fillOpacity={0.82}
              stroke={palette.line}
              strokeWidth={1}
            />
            {nodes.map((node) => {
              const rect = resolveCanvasNodeAbsoluteRect(node, nodesById);
              const x = offsetX + rect.x * scale;
              const y = offsetY + rect.y * scale;
              const nodeWidth = Math.max(1, rect.width * scale);
              const nodeHeight = Math.max(1, rect.height * scale);
              const isContainer = node.kind === 'container' || node.kind === 'section' || node.kind === 'composite';
              const isText = node.kind === 'text' || node.kind === 'heading';
              return (
                <rect
                  key={node.id}
                  x={x}
                  y={y}
                  width={nodeWidth}
                  height={nodeHeight}
                  rx={buildRadius(node, scale)}
                  fill={getNodeFill(node, palette, imageGradientId)}
                  fillOpacity={getNodeOpacity(node)}
                  stroke={isContainer ? palette.line : 'none'}
                  strokeWidth={isContainer ? 0.7 : 0}
                  strokeOpacity={0.72}
                  opacity={isText ? 0.82 : 1}
                />
              );
            })}
          </>
        )}
        <rect x={0} y={height - 38} width={width} height={38} fill={palette.ink} fillOpacity={0.9} />
        <rect x={12} y={height - 27} width={30} height={4} rx={2} fill={palette.accent} />
        <text
          x={50}
          y={height - 20}
          fill={palette.inverse}
          fontSize={10}
          fontWeight={700}
          fontFamily="Inter, system-ui, sans-serif"
        >
          {template.name}
        </text>
        <text
          x={50}
          y={height - 8}
          fill={palette.inverse}
          fillOpacity={0.72}
          fontSize={7.5}
          fontFamily="Inter, system-ui, sans-serif"
        >
          {[template.visualStyle, template.pageType].filter(Boolean).join(' / ')}
        </text>
        {template.qualityTier === 'premium' ? (
          <g>
            <rect x={width - 76} y={10} width={62} height={20} rx={10} fill={palette.accent} />
            <text
              x={width - 45}
              y={24}
              fill={palette.inverse}
              fontSize={8}
              fontWeight={800}
              textAnchor="middle"
              fontFamily="Inter, system-ui, sans-serif"
            >
              PREMIUM
            </text>
          </g>
        ) : null}
      </g>
    </svg>
  );
}

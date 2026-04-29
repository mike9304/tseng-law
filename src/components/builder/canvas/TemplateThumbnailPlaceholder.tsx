import type { PageTemplate } from '@/lib/builder/templates/types';
import { resolveCanvasNodeAbsoluteRect } from '@/lib/builder/canvas/tree';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

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

function getNodeColor(node: BuilderCanvasNode) {
  return KIND_COLORS[String(node.kind)] ?? { fill: '#e2e8f0' };
}

function buildStableId(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, '-');
}

function buildRadius(node: BuilderCanvasNode, scale: number): number {
  if (node.kind === 'button') return Math.max(2, Math.min(8, node.rect.height * scale * 0.18));
  if (node.kind === 'image') return 2;
  return 3;
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
  const scale = Math.min(width / document.stageWidth, height / document.stageHeight);
  const renderWidth = document.stageWidth * scale;
  const renderHeight = document.stageHeight * scale;
  const offsetX = (width - renderWidth) / 2;
  const offsetY = (height - renderHeight) / 2;
  const nodesById = new Map(document.nodes.map((node) => [node.id, node]));
  const nodes = [...document.nodes]
    .filter((node) => node.visible !== false)
    .sort((left, right) => left.zIndex - right.zIndex)
    .slice(0, 140);
  const compositeGradientId = `template-composite-gradient-${buildStableId(template.id)}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${template.name} template preview`}
      style={{ display: 'block', width: '100%', height: '100%', background: '#f8fafc' }}
    >
      <defs>
        <linearGradient id={compositeGradientId} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={width} height={height} fill="#f8fafc" />
      <rect
        x={offsetX}
        y={offsetY}
        width={renderWidth}
        height={renderHeight}
        fill="#ffffff"
        stroke="#e2e8f0"
        strokeWidth={1}
      />
      {nodes.map((node) => {
        const rect = resolveCanvasNodeAbsoluteRect(node, nodesById);
        const colors = getNodeColor(node);
        const isComposite = node.kind === 'composite';
        const x = offsetX + rect.x * scale;
        const y = offsetY + rect.y * scale;
        const nodeWidth = Math.max(1, rect.width * scale);
        const nodeHeight = Math.max(1, rect.height * scale);
        const isContainer = node.kind === 'container' || node.kind === 'section';
        return (
          <rect
            key={node.id}
            x={x}
            y={y}
            width={nodeWidth}
            height={nodeHeight}
            rx={buildRadius(node, scale)}
            fill={isComposite ? `url(#${compositeGradientId})` : colors.fill}
            fillOpacity={colors.opacity ?? (isContainer ? 0.92 : 1)}
            stroke={colors.stroke ?? (isContainer ? '#cbd5e1' : 'none')}
            strokeDasharray={isContainer ? '4 3' : undefined}
            strokeWidth={isContainer ? 1 : 0}
          />
        );
      })}
    </svg>
  );
}

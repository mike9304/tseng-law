'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
} from 'react';
import type { PageTemplate } from '@/lib/builder/templates/types';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { resolveCanvasNodeAbsoluteRect } from '@/lib/builder/canvas/tree';
import { getTemplatePalette } from '@/lib/builder/templates/design-system';
import {
  buildThumbnailKey,
  getCachedThumbnail,
  setCachedThumbnail,
} from './template-thumbnail-cache';

const MAX_RENDERED_NODES = 60;
type ThumbnailTone = 'light' | 'dark' | 'preview';

interface Props {
  template: PageTemplate;
  width?: number;
  height?: number;
  tone?: ThumbnailTone;
  eager?: boolean;
}

function getThumbnailSource(template: PageTemplate): string | null {
  if (!template.thumbnail) return null;
  if (typeof template.thumbnail === 'string') return template.thumbnail;
  if (template.thumbnail.type === 'image' && template.thumbnail.src) return template.thumbnail.src;
  return null;
}

function isContainerNode(node: BuilderCanvasNode): boolean {
  return node.kind === 'container' || node.kind === 'section' || node.kind === 'composite';
}

function renderThumbnail(template: PageTemplate, width: number, height: number, tone: ThumbnailTone): ReactElement {
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
    .slice(0, MAX_RENDERED_NODES);

  const canvasGradient = `linear-gradient(135deg, ${palette.canvas} 0%, ${palette.surface} 58%, ${palette.accentSoft} 100%)`;
  const imageGradient = `linear-gradient(135deg, ${palette.surfaceAlt} 0%, ${palette.accentSoft} 48%, ${palette.accent} 100%)`;
  const glow = `radial-gradient(circle at 80% 12%, ${palette.accent}55 0%, ${palette.accent}00 60%)`;
  const toneOverlay = tone === 'dark' ? 'rgba(15, 23, 42, 0.26)' : tone === 'preview' ? 'rgba(255,255,255,0.08)' : 'transparent';

  return (
    <div
      aria-hidden
      style={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
        contain: 'strict',
        background: canvasGradient,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: glow, pointerEvents: 'none' }} />
      {thumbnailSource ? (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("${thumbnailSource.replace(/"/g, '%22')}")`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        />
      ) : (
        <>
          <div
            style={{
              position: 'absolute',
              left: offsetX,
              top: offsetY,
              width: renderWidth,
              height: renderHeight,
              border: `1px solid ${palette.line}`,
              borderRadius: 2,
              background: palette.surface,
              opacity: 0.82,
            }}
          />
          {nodes.map((node) => {
            const rect = resolveCanvasNodeAbsoluteRect(node, nodesById);
            const x = offsetX + rect.x * scale;
            const y = offsetY + rect.y * scale;
            const w = Math.max(1, rect.width * scale);
            const h = Math.max(1, rect.height * scale);
            const isContainer = isContainerNode(node);
            let background: string;
            if (node.kind === 'image' || node.kind === 'video-embed' || node.kind === 'gallery') background = imageGradient;
            else if (node.kind === 'button' || node.kind === 'form-submit') background = palette.accent;
            else if (node.kind === 'heading') background = palette.ink;
            else if (node.kind === 'text') background = palette.mutedInk;
            else if (node.kind === 'divider' || node.kind === 'spacer') background = palette.line;
            else if (node.kind === 'icon') background = palette.accent;
            else if (String(node.kind).startsWith('form')) background = palette.accentSoft;
            else if (isContainer) background = palette.surface;
            else background = palette.surfaceAlt;

            const style: CSSProperties = {
              position: 'absolute',
              left: x,
              top: y,
              width: w,
              height: h,
              border: isContainer ? `0.7px solid ${palette.line}` : 'none',
              borderRadius: node.kind === 'button' ? Math.max(3, Math.min(12, h * 0.18)) : 5,
              background,
              opacity: isContainer ? 0.85 : node.kind === 'text' ? 0.72 : 1,
              boxShadow: node.kind === 'button' ? `0 1px 2px ${palette.ink}33` : 'none',
            };
            return <div key={node.id} style={style} />;
          })}
        </>
      )}
      <div style={{ position: 'absolute', inset: 0, background: toneOverlay, pointerEvents: 'none' }} />
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          left: 0,
          display: 'flex',
          height: 38,
          alignItems: 'center',
          gap: 8,
          padding: '6px 12px',
          background: palette.ink,
          color: palette.inverse,
          fontSize: 10,
          fontWeight: 700,
          opacity: 0.92,
        }}
      >
        <span style={{ width: 30, height: 4, flexShrink: 0, borderRadius: 2, background: palette.accent }} />
        <div style={{ minWidth: 0, overflow: 'hidden' }}>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{template.name}</div>
          <div style={{ fontSize: 7.5, fontWeight: 600, opacity: 0.72 }}>
            {[template.visualStyle, template.pageType].filter(Boolean).join(' / ')}
          </div>
        </div>
      </div>
      {template.qualityTier === 'premium' ? (
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            padding: '3px 8px',
            borderRadius: 999,
            background: palette.accent,
            color: palette.inverse,
            fontSize: 8,
            fontWeight: 800,
            letterSpacing: '0.05em',
          }}
        >
          PREMIUM
        </div>
      ) : null}
    </div>
  );
}

export default function TemplateThumbnailRenderer({
  template,
  width = 240,
  height = 160,
  tone = 'light',
  eager = false,
}: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(eager);

  useEffect(() => {
    if (visible || eager) return undefined;
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [eager, visible]);

  const content = useMemo(() => {
    if (!visible) return null;
    const key = buildThumbnailKey(width, height, tone);
    const cached = getCachedThumbnail(template, key);
    if (cached) return cached;
    const element = renderThumbnail(template, width, height, tone);
    setCachedThumbnail(template, key, element);
    return element;
  }, [height, template, tone, visible, width]);

  return (
    <div
      ref={rootRef}
      data-template-thumbnail-renderer="html-scaled-mock"
      data-template-id={template.id}
      style={{ width: '100%', height: '100%', minHeight: height, background: '#e2e8f0' }}
    >
      {content}
    </div>
  );
}

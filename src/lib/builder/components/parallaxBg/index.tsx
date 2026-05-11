'use client';

import { useEffect, useRef, useState } from 'react';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderParallaxBgCanvasNode } from '@/lib/builder/canvas/types';

function ParallaxBgRender({
  node,
  mode = 'edit',
}: {
  node: BuilderParallaxBgCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    if (mode === 'edit') return undefined;
    function onScroll() {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const delta = (viewportCenter - center) * c.speed;
      setOffsetY(delta);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [c.speed, mode]);

  const safeBg = c.imageUrl
    ? `url(${c.imageUrl}) center / cover no-repeat`
    : 'linear-gradient(135deg, #1e293b, #475569)';

  return (
    <div
      ref={containerRef}
      className="builder-decorative-parallax"
      data-builder-decorative-widget="parallax-bg"
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
    >
      <div
        className="builder-decorative-parallax-image"
        style={{
          position: 'absolute',
          inset: 0,
          background: safeBg,
          transform: `translateY(${offsetY}px) scale(1.1)`,
          willChange: 'transform',
        }}
      />
      <div
        className="builder-decorative-parallax-overlay"
        style={{ position: 'absolute', inset: 0, background: c.overlayColor }}
      />
      {(c.contentTitle || c.contentSubtitle) ? (
        <div
          className="builder-decorative-parallax-content"
          style={{
            position: 'relative',
            zIndex: 1,
            color: '#ffffff',
            padding: '40px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            gap: 8,
          }}
        >
          {c.contentTitle ? <strong style={{ fontSize: 28 }}>{c.contentTitle}</strong> : null}
          {c.contentSubtitle ? <p style={{ margin: 0, fontSize: 14, opacity: 0.9 }}>{c.contentSubtitle}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function ParallaxBgInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const pNode = node as BuilderParallaxBgCanvasNode;
  const c = pNode.content;
  return (
    <>
      <label>
        <span>이미지 URL</span>
        <input type="text" value={c.imageUrl} disabled={disabled} onChange={(event) => onUpdate({ imageUrl: event.target.value })} />
      </label>
      <label>
        <span>오버레이 색</span>
        <input type="text" value={c.overlayColor} disabled={disabled} onChange={(event) => onUpdate({ overlayColor: event.target.value })} />
      </label>
      <label>
        <span>패럴랙스 속도 (0~2)</span>
        <input
          type="number"
          step="0.05"
          min={0}
          max={2}
          value={c.speed}
          disabled={disabled}
          onChange={(event) => onUpdate({ speed: Number(event.target.value) })}
        />
      </label>
      <label>
        <span>제목</span>
        <input type="text" value={c.contentTitle} disabled={disabled} onChange={(event) => onUpdate({ contentTitle: event.target.value })} />
      </label>
      <label>
        <span>부제</span>
        <textarea rows={2} value={c.contentSubtitle} disabled={disabled} onChange={(event) => onUpdate({ contentSubtitle: event.target.value })} />
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'parallax-bg',
  displayName: '패럴랙스 배경',
  category: 'advanced',
  icon: '⛰',
  defaultContent: {
    imageUrl: '',
    overlayColor: 'rgba(15, 23, 42, 0.4)',
    speed: 0.4,
    contentTitle: '신뢰의 법무 파트너',
    contentSubtitle: '한국과 대만, 두 사법체계를 잇는 자문',
  },
  defaultStyle: {},
  defaultRect: { width: 720, height: 360 },
  Render: ParallaxBgRender,
  Inspector: ParallaxBgInspector,
});

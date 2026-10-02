'use client';

import { useEffect, useRef, useState } from 'react';
import type { BuilderParallaxBgCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { getUtilityAdvancedWidgetsCopy, localizedUtilityText, PARALLAX_BG_LEGACY_DEFAULTS } from '../utility-advanced-widgets-copy';

function ParallaxBgRender({
  node,
  mode = 'edit',
  locale = 'ko',
}: {
  node: BuilderParallaxBgCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}) {
  const c = node.content;
  const copy = getUtilityAdvancedWidgetsCopy(locale).parallaxBg;
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
  const contentTitle = localizedUtilityText(c.contentTitle, copy.defaultTitle, PARALLAX_BG_LEGACY_DEFAULTS.title);
  const contentSubtitle = localizedUtilityText(c.contentSubtitle, copy.defaultSubtitle, PARALLAX_BG_LEGACY_DEFAULTS.subtitle);

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
      {(contentTitle || contentSubtitle) ? (
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
          {contentTitle ? <strong style={{ fontSize: 28 }}>{contentTitle}</strong> : null}
          {contentSubtitle ? <p style={{ margin: 0, fontSize: 14, opacity: 0.9 }}>{contentSubtitle}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

export default ParallaxBgRender;

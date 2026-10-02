'use client';

import { useEffect, useState } from 'react';
import type { BuilderBackToTopCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { getInteractiveWidgetsCopy, INTERACTIVE_WIDGETS_LEGACY_DEFAULTS, localizedInteractiveWidgetText } from '../interactive-widgets-copy';

const ICON_GLYPH: Record<BuilderBackToTopCanvasNode['content']['icon'], string> = {
  'arrow-up': '↑',
  'chevron-up': '⌃',
  'rocket': '↟',
};

function BackToTopRender({
  node,
  locale = 'ko',
  mode = 'edit',
}: {
  node: BuilderBackToTopCanvasNode;
  locale?: Locale;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const copy = getInteractiveWidgetsCopy(locale).backToTop;
  const label = localizedInteractiveWidgetText(c.label, copy.defaultLabel, INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.backToTopLabel);
  const [visible, setVisible] = useState(mode === 'edit');

  useEffect(() => {
    if (mode === 'edit') {
      setVisible(true);
      return undefined;
    }
    const handler = () => {
      setVisible(window.scrollY >= c.showAfterPx);
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [c.showAfterPx, mode]);

  function onClick() {
    if (mode === 'edit') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <button
      type="button"
      className="builder-interactive-back-to-top"
      data-builder-interactive-widget="back-to-top"
      data-builder-back-to-top-placement={c.placement}
      data-builder-back-to-top-variant={c.variant}
      data-builder-back-to-top-visible={visible ? 'true' : 'false'}
      aria-label={label}
      onClick={onClick}
    >
      <span aria-hidden="true">{ICON_GLYPH[c.icon]}</span>
      <span className="builder-interactive-back-to-top-label">{label}</span>
    </button>
  );
}

export default BackToTopRender;

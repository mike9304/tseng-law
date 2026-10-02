import type { CSSProperties } from 'react';
import type { BuilderStickerCanvasNode } from '@/lib/builder/canvas/types';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { getVisualWidgetsCopy, localizedVisualText, STICKER_LEGACY_DEFAULTS } from '../visual-widgets-copy';

function StickerRender({
  node,
  locale = 'ko',
}: {
  node: BuilderStickerCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}) {
  const c = node.content;
  const copy = getVisualWidgetsCopy(normalizeLocale(locale));
  const label = localizedVisualText(c.label, copy.sticker.defaultLabel, STICKER_LEGACY_DEFAULTS.label);
  const baseStyle: CSSProperties = {
    background: c.background,
    color: c.color,
    transform: `rotate(${c.rotation}deg)`,
  };

  return (
    <div
      className="builder-decorative-sticker"
      data-builder-decorative-widget="sticker"
      data-builder-sticker-variant={c.variant}
      style={baseStyle}
    >
      <span aria-hidden="true">{c.emoji}</span>
      {label ? <strong>{label}</strong> : null}
    </div>
  );
}

export default StickerRender;

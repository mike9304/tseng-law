import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderStickerCanvasNode } from '@/lib/builder/canvas/types';
import { normalizeLocale } from '@/lib/locales';
import { getVisualWidgetsCopy, localizedVisualText, STICKER_LEGACY_DEFAULTS } from '../visual-widgets-copy';

import StickerRender from './Render';

function StickerInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const sNode = node as BuilderStickerCanvasNode;
  const c = sNode.content;
  const copy = getVisualWidgetsCopy(normalizeLocale(locale));
  const label = localizedVisualText(c.label, copy.sticker.defaultLabel, STICKER_LEGACY_DEFAULTS.label);
  return (
    <>
      <label>
        <span>{copy.sticker.inspector.emoji}</span>
        <input type="text" value={c.emoji} disabled={disabled} onChange={(event) => onUpdate({ emoji: event.target.value })} />
      </label>
      <label>
        <span>{copy.sticker.inspector.label}</span>
        <input type="text" value={label} disabled={disabled} onChange={(event) => onUpdate({ label: event.target.value })} />
      </label>
      <label>
        <span>{copy.sticker.inspector.background}</span>
        <input type="text" value={c.background} disabled={disabled} onChange={(event) => onUpdate({ background: event.target.value })} />
      </label>
      <label>
        <span>{copy.sticker.inspector.color}</span>
        <input type="text" value={c.color} disabled={disabled} onChange={(event) => onUpdate({ color: event.target.value })} />
      </label>
      <label>
        <span>{copy.sticker.inspector.rotation}</span>
        <input
          type="number"
          min={-45}
          max={45}
          value={c.rotation}
          disabled={disabled}
          onChange={(event) => onUpdate({ rotation: Number(event.target.value) })}
        />
      </label>
      <label>
        <span>{copy.sticker.inspector.style}</span>
        <select
          value={c.variant}
          disabled={disabled}
          onChange={(event) => onUpdate({ variant: event.target.value as BuilderStickerCanvasNode['content']['variant'] })}
        >
          <option value="badge">{copy.sticker.inspector.variants.badge}</option>
          <option value="pill">{copy.sticker.inspector.variants.pill}</option>
          <option value="banner">{copy.sticker.inspector.variants.banner}</option>
        </select>
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'sticker',
  displayName: '스티커',
  category: 'advanced',
  icon: '⭐',
  defaultContent: {
    emoji: '⭐',
    label: STICKER_LEGACY_DEFAULTS.label,
    background: '#fde68a',
    color: '#92400e',
    rotation: -8,
    variant: 'badge' as const,
  },
  defaultStyle: {},
  defaultRect: { width: 120, height: 60 },
  Render: StickerRender,
  Inspector: StickerInspector,
});

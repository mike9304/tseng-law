'use client';

import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderParallaxBgCanvasNode } from '@/lib/builder/canvas/types';
import { getUtilityAdvancedWidgetsCopy, localizedUtilityText, PARALLAX_BG_LEGACY_DEFAULTS } from '../utility-advanced-widgets-copy';

import ParallaxBgRender from './Render';

function ParallaxBgInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const pNode = node as BuilderParallaxBgCanvasNode;
  const c = pNode.content;
  const copy = getUtilityAdvancedWidgetsCopy(locale).parallaxBg;
  const contentTitle = localizedUtilityText(c.contentTitle, copy.defaultTitle, PARALLAX_BG_LEGACY_DEFAULTS.title);
  const contentSubtitle = localizedUtilityText(c.contentSubtitle, copy.defaultSubtitle, PARALLAX_BG_LEGACY_DEFAULTS.subtitle);
  return (
    <>
      <label>
        <span>{copy.inspector.imageUrl}</span>
        <input type="text" value={c.imageUrl} disabled={disabled} onChange={(event) => onUpdate({ imageUrl: event.target.value })} />
      </label>
      <label>
        <span>{copy.inspector.overlayColor}</span>
        <input type="text" value={c.overlayColor} disabled={disabled} onChange={(event) => onUpdate({ overlayColor: event.target.value })} />
      </label>
      <label>
        <span>{copy.inspector.speed}</span>
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
        <span>{copy.inspector.title}</span>
        <input type="text" value={contentTitle} disabled={disabled} onChange={(event) => onUpdate({ contentTitle: event.target.value })} />
      </label>
      <label>
        <span>{copy.inspector.subtitle}</span>
        <textarea rows={2} value={contentSubtitle} disabled={disabled} onChange={(event) => onUpdate({ contentSubtitle: event.target.value })} />
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
    contentTitle: PARALLAX_BG_LEGACY_DEFAULTS.title,
    contentSubtitle: PARALLAX_BG_LEGACY_DEFAULTS.subtitle,
  },
  defaultStyle: {},
  defaultRect: { width: 720, height: 360 },
  Render: ParallaxBgRender,
  Inspector: ParallaxBgInspector,
});

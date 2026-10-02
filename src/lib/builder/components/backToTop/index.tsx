'use client';

import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderBackToTopCanvasNode } from '@/lib/builder/canvas/types';
import { getInteractiveWidgetsCopy, INTERACTIVE_WIDGETS_LEGACY_DEFAULTS, localizedInteractiveWidgetText } from '../interactive-widgets-copy';

import BackToTopRender from './Render';

function BackToTopInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const btNode = node as BuilderBackToTopCanvasNode;
  const c = btNode.content;
  const backToTopCopy = getInteractiveWidgetsCopy(locale).backToTop;
  const copy = backToTopCopy.inspector;
  const label = localizedInteractiveWidgetText(c.label, backToTopCopy.defaultLabel, INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.backToTopLabel);
  return (
    <>
      <label>
        <span>{copy.label}</span>
        <input type="text" value={label} disabled={disabled} onChange={(event) => onUpdate({ label: event.target.value })} />
      </label>
      <label>
        <span>{copy.showAfterPx}</span>
        <input
          type="number"
          min={0}
          max={4000}
          value={c.showAfterPx}
          disabled={disabled}
          onChange={(event) => onUpdate({ showAfterPx: Number(event.target.value) })}
        />
      </label>
      <label>
        <span>{copy.icon}</span>
        <select
          value={c.icon}
          disabled={disabled}
          onChange={(event) => onUpdate({ icon: event.target.value as BuilderBackToTopCanvasNode['content']['icon'] })}
        >
          <option value="arrow-up">{copy.iconOptions['arrow-up']}</option>
          <option value="chevron-up">{copy.iconOptions['chevron-up']}</option>
          <option value="rocket">{copy.iconOptions.rocket}</option>
        </select>
      </label>
      <label>
        <span>{copy.placement}</span>
        <select
          value={c.placement}
          disabled={disabled}
          onChange={(event) => onUpdate({ placement: event.target.value as BuilderBackToTopCanvasNode['content']['placement'] })}
        >
          <option value="bottom-right">{copy.placementOptions['bottom-right']}</option>
          <option value="bottom-left">{copy.placementOptions['bottom-left']}</option>
          <option value="bottom-center">{copy.placementOptions['bottom-center']}</option>
        </select>
      </label>
      <label>
        <span>{copy.variant}</span>
        <select
          value={c.variant}
          disabled={disabled}
          onChange={(event) => onUpdate({ variant: event.target.value as BuilderBackToTopCanvasNode['content']['variant'] })}
        >
          <option value="circle">{copy.variantOptions.circle}</option>
          <option value="pill">{copy.variantOptions.pill}</option>
          <option value="square">{copy.variantOptions.square}</option>
        </select>
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'back-to-top',
  displayName: '맨 위로',
  category: 'advanced',
  icon: '↑',
  defaultContent: {
    label: INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.backToTopLabel,
    showAfterPx: 400,
    icon: 'arrow-up' as const,
    placement: 'bottom-right' as const,
    variant: 'circle' as const,
  },
  defaultStyle: {},
  defaultRect: { width: 64, height: 64 },
  Render: BackToTopRender,
  Inspector: BackToTopInspector,
});

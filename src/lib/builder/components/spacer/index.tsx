import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderSpacerCanvasNode } from '@/lib/builder/canvas/types';
import { normalizeLocale } from '@/lib/locales';
import { getLayoutNavigationWidgetsCopy } from '../layout-navigation-widgets-copy';

import SpacerRender from './Render';

function SpacerInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const spacerNode = node as BuilderSpacerCanvasNode;
  const copy = getLayoutNavigationWidgetsCopy(normalizeLocale(locale)).spacer.inspector;

  return (
    <>
      <label>
        <span>{copy.size}</span>
        <input
          type="number"
          min={8}
          max={400}
          step={1}
          value={spacerNode.content.size}
          disabled={disabled}
          onChange={(event) => onUpdate({ size: Number(event.target.value) })}
        />
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'spacer',
  displayName: '여백',
  category: 'advanced',
  icon: '↕',
  defaultContent: {
    size: 32,
  },
  defaultStyle: {},
  defaultRect: { width: 200, height: 32 },
  Render: SpacerRender,
  Inspector: SpacerInspector,
});

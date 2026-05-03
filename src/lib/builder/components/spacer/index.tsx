import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderSpacerCanvasNode } from '@/lib/builder/canvas/types';
import styles from './Spacer.module.css';

function SpacerRender({
  node,
  mode = 'edit',
}: {
  node: BuilderSpacerCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const size = Math.max(8, Math.min(400, node.content.size ?? 32));
  const isEdit = mode === 'edit';

  if (isEdit) {
    return (
      <div
        aria-hidden="true"
        className={styles.edit}
        style={{
          minHeight: size,
        }}
      >
        Spacer {size}px
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={styles.spacer}
      style={{
        height: size,
      }}
    />
  );
}

function SpacerInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const spacerNode = node as BuilderSpacerCanvasNode;

  return (
    <>
      <label>
        <span>Size (px)</span>
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

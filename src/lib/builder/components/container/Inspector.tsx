import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderContainerCanvasNode } from '@/lib/builder/canvas/types';

export default function ContainerInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const containerNode = node as BuilderContainerCanvasNode;

  return (
    <>
      <label>
        <span>Label</span>
        <input
          type="text"
          value={containerNode.content.label}
          disabled={disabled}
          onChange={(event) => onUpdate({ label: event.target.value })}
        />
      </label>
      <label>
        <span>Padding</span>
        <input
          type="number"
          min={0}
          max={96}
          value={containerNode.content.padding}
          disabled={disabled}
          onChange={(event) => onUpdate({ padding: Number(event.target.value) })}
        />
      </label>
    </>
  );
}

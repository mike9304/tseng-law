import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderSectionCanvasNode } from '@/lib/builder/canvas/types';

export default function SectionInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const sectionNode = node as BuilderSectionCanvasNode;

  return (
    <>
      <label>
        <span>Label</span>
        <input
          type="text"
          value={sectionNode.content.label}
          disabled={disabled}
          onChange={(event) => onUpdate({ label: event.target.value })}
        />
      </label>
      <label>
        <span>Max width</span>
        <input
          type="number"
          min={320}
          max={1440}
          value={sectionNode.content.maxWidth}
          disabled={disabled}
          onChange={(event) => onUpdate({ maxWidth: Number(event.target.value) })}
        />
      </label>
      <label>
        <span>Padding</span>
        <input
          type="number"
          min={0}
          max={144}
          value={sectionNode.content.padding}
          disabled={disabled}
          onChange={(event) => onUpdate({ padding: Number(event.target.value) })}
        />
      </label>
    </>
  );
}

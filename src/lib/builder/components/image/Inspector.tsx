import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderImageCanvasNode } from '@/lib/builder/canvas/types';

export default function ImageInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const imageNode = node as BuilderImageCanvasNode;

  return (
    <>
      <label>
        <span>Source</span>
        <input
          type="text"
          value={imageNode.content.src}
          disabled={disabled}
          onChange={(event) => onUpdate({ src: event.target.value })}
        />
      </label>
      <label>
        <span>Alt text</span>
        <input
          type="text"
          value={imageNode.content.alt}
          disabled={disabled}
          onChange={(event) => onUpdate({ alt: event.target.value })}
        />
      </label>
      <label>
        <span>Fit</span>
        <select
          value={imageNode.content.fit}
          disabled={disabled}
          onChange={(event) => onUpdate({ fit: event.target.value })}
        >
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
        </select>
      </label>
    </>
  );
}

import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderSectionCanvasNode } from '@/lib/builder/canvas/types';
import { normalizeLocale } from '@/lib/locales';
import {
  getLayoutNavigationWidgetsCopy,
  localizedLayoutText,
  SECTION_LEGACY_DEFAULTS,
} from '../layout-navigation-widgets-copy';

export default function SectionInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const sectionNode = node as BuilderSectionCanvasNode;
  const sectionCopy = getLayoutNavigationWidgetsCopy(normalizeLocale(locale)).section;
  const copy = sectionCopy.inspector;
  const label = localizedLayoutText(sectionNode.content.label, sectionCopy.defaultLabel, SECTION_LEGACY_DEFAULTS.label);

  return (
    <>
      <label>
        <span>{copy.label}</span>
        <input
          type="text"
          value={label}
          disabled={disabled}
          onChange={(event) => onUpdate({ label: event.target.value })}
        />
      </label>
      <label>
        <span>{copy.maxWidth}</span>
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
        <span>{copy.padding}</span>
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

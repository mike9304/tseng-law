import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderMultiLocationMapCanvasNode } from '@/lib/builder/canvas/types';
import { getLocationWidgetsCopy, localizedLocationWidgetText, localizedMultiLocations, LOCATION_WIDGETS_LEGACY_DEFAULTS } from '../location-widgets-copy';
import styles from './MultiLocationMapInspector.module.css';

import MultiLocationMapRender from './Render';

function locationsToText(locs: BuilderMultiLocationMapCanvasNode['content']['locations']): string {
  return locs.map((l) => `${l.name} | ${l.address} | ${l.lat} | ${l.lng}`).join('\n');
}

function parseLocations(value: string): BuilderMultiLocationMapCanvasNode['content']['locations'] {
  const out: BuilderMultiLocationMapCanvasNode['content']['locations'] = [];
  for (const rawLine of value.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const [name, address, lat, lng] = line.split('|').map((p) => p.trim());
    if (!name) continue;
    out.push({
      name: name.slice(0, 80),
      address: (address ?? '').slice(0, 200),
      lat: Number(lat ?? 0) || 0,
      lng: Number(lng ?? 0) || 0,
    });
  }
  return out.slice(0, 20);
}

function MultiLocationMapInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const mlmNode = node as BuilderMultiLocationMapCanvasNode;
  const c = mlmNode.content;
  const multiCopy = getLocationWidgetsCopy(locale).multiLocationMap;
  const copy = multiCopy.inspector;
  const title = localizedLocationWidgetText(c.title, multiCopy.defaultTitle, LOCATION_WIDGETS_LEGACY_DEFAULTS.multiLocationMap.title);
  const locations = localizedMultiLocations(c.locations, multiCopy.defaultLocations);
  return (
    <div className={styles.root} data-builder-multi-location-map-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.title}</span>
        <input
          className={styles.control}
          type="text"
          value={title}
          disabled={disabled}
          onChange={(event) => onUpdate({ title: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.locations}</span>
        <textarea
          className={`${styles.control} ${styles.textarea}`}
          rows={6}
          value={locationsToText(locations)}
          disabled={disabled}
          onChange={(event) => onUpdate({ locations: parseLocations(event.target.value) })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.activeIndex}</span>
        <input
          className={styles.control}
          type="number"
          min={0}
          max={Math.max(0, locations.length - 1)}
          value={c.activeIndex}
          disabled={disabled}
          onChange={(event) => onUpdate({ activeIndex: Number(event.target.value) })}
        />
      </label>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={c.showList} disabled={disabled} onChange={(event) => onUpdate({ showList: event.target.checked })} />
        <span>{copy.showList}</span>
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'multi-location-map',
  displayName: '다중 지도',
  category: 'advanced',
  icon: '🗺',
  defaultContent: {
    title: LOCATION_WIDGETS_LEGACY_DEFAULTS.multiLocationMap.title,
    locations: LOCATION_WIDGETS_LEGACY_DEFAULTS.multiLocationMap.locations.map((location) => ({ ...location })),
    activeIndex: 0,
    showList: true,
  },
  defaultStyle: {},
  defaultRect: { width: 480, height: 320 },
  Render: MultiLocationMapRender,
  Inspector: MultiLocationMapInspector,
});

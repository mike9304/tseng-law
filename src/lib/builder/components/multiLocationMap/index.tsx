import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderMultiLocationMapCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import {
  getLocationWidgetsCopy,
  localizedLocationWidgetText,
  localizedMultiLocations,
  LOCATION_WIDGETS_LEGACY_DEFAULTS,
} from '../location-widgets-copy';
import styles from './MultiLocationMapInspector.module.css';

function MultiLocationMapRender({
  node,
  locale = 'ko',
}: {
  node: BuilderMultiLocationMapCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}) {
  const c = node.content;
  const copy = getLocationWidgetsCopy(locale);
  const title = localizedLocationWidgetText(c.title, copy.multiLocationMap.defaultTitle, LOCATION_WIDGETS_LEGACY_DEFAULTS.multiLocationMap.title);
  const locations = localizedMultiLocations(c.locations, copy.multiLocationMap.defaultLocations);
  const active = locations[c.activeIndex] ?? locations[0] ?? null;
  const mapsHref = active
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(active.address || active.name)}`
    : '#';

  return (
    <section
      className="builder-location-multi-map"
      data-builder-location-widget="multi-location-map"
      data-builder-location-list={c.showList ? 'true' : 'false'}
    >
      <header>
        <strong>{title}</strong>
        <small>{copy.multiLocationMap.count(locations.length)}</small>
      </header>
      <div className="builder-location-multi-map-body">
        {c.showList ? (
          <ul>
            {locations.length === 0 ? (
              <li className="builder-location-empty"><em>{copy.multiLocationMap.empty}</em></li>
            ) : (
              locations.map((loc, idx) => (
                <li key={`${loc.name}-${idx}`} data-active={idx === c.activeIndex ? 'true' : 'false'}>
                  <strong>{loc.name}</strong>
                  <span>{loc.address}</span>
                </li>
              ))
            )}
          </ul>
        ) : null}
        <a className="builder-location-multi-map-preview" href={mapsHref} target="_blank" rel="noopener noreferrer">
          {active ? (
            <>
              <strong>{active.name}</strong>
              <span>{active.address}</span>
              <small>{active.lat.toFixed(4)}, {active.lng.toFixed(4)}</small>
            </>
          ) : (
            <em>{copy.multiLocationMap.noActive}</em>
          )}
        </a>
      </div>
    </section>
  );
}

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

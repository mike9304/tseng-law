import type { BuilderMultiLocationMapCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { getLocationWidgetsCopy, localizedLocationWidgetText, localizedMultiLocations, LOCATION_WIDGETS_LEGACY_DEFAULTS } from '../location-widgets-copy';

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

export default MultiLocationMapRender;

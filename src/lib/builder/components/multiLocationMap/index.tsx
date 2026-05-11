import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderMultiLocationMapCanvasNode } from '@/lib/builder/canvas/types';

function MultiLocationMapRender({
  node,
}: {
  node: BuilderMultiLocationMapCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const active = c.locations[c.activeIndex] ?? c.locations[0] ?? null;
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
        <strong>{c.title}</strong>
        <small>{c.locations.length}개 지점</small>
      </header>
      <div className="builder-location-multi-map-body">
        {c.showList ? (
          <ul>
            {c.locations.length === 0 ? (
              <li className="builder-location-empty"><em>지점을 인스펙터에서 추가하세요</em></li>
            ) : (
              c.locations.map((loc, idx) => (
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
            <em>활성 지점 없음</em>
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
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const mlmNode = node as BuilderMultiLocationMapCanvasNode;
  const c = mlmNode.content;
  return (
    <>
      <label>
        <span>제목</span>
        <input type="text" value={c.title} disabled={disabled} onChange={(event) => onUpdate({ title: event.target.value })} />
      </label>
      <label>
        <span>지점 (name | address | lat | lng)</span>
        <textarea
          rows={6}
          style={{ fontFamily: 'inherit', resize: 'vertical' }}
          value={locationsToText(c.locations)}
          disabled={disabled}
          onChange={(event) => onUpdate({ locations: parseLocations(event.target.value) })}
        />
      </label>
      <label>
        <span>활성 인덱스</span>
        <input
          type="number"
          min={0}
          max={Math.max(0, c.locations.length - 1)}
          value={c.activeIndex}
          disabled={disabled}
          onChange={(event) => onUpdate({ activeIndex: Number(event.target.value) })}
        />
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input type="checkbox" checked={c.showList} disabled={disabled} onChange={(event) => onUpdate({ showList: event.target.checked })} />
        <span>리스트 표시</span>
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'multi-location-map',
  displayName: '다중 지도',
  category: 'advanced',
  icon: '🗺',
  defaultContent: {
    title: '지점 안내',
    locations: [
      { name: '서울 본점', address: '서울특별시 강남구 테헤란로 152', lat: 37.4994, lng: 127.0356 },
      { name: '대만 지점', address: '台北市信義區市府路45號', lat: 25.0376, lng: 121.5640 },
    ],
    activeIndex: 0,
    showList: true,
  },
  defaultStyle: {},
  defaultRect: { width: 480, height: 320 },
  Render: MultiLocationMapRender,
  Inspector: MultiLocationMapInspector,
});

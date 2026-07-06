import { defineComponent } from '../define';
import type { BuilderComponentRenderProps } from '../define';
import MapInspector from './Inspector';
import { getLocationWidgetsCopy } from '../location-widgets-copy';

interface MapContent {
  address: string;
  zoom: number;
}

function MapRender({ node, mode = 'preview', locale = 'ko' }: BuilderComponentRenderProps) {
  const { address = '', zoom = 15 } = node.content as unknown as MapContent;
  const copy = getLocationWidgetsCopy(locale);
  const isEditMode = mode === 'edit';

  if (!address) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#f1f5f9',
          border: '2px dashed #cbd5e1',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
          fontSize: 13,
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </div>
    );
  }

  const src = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=${zoom}&output=embed`;
  const mapSearchUrl = `https://www.google.com/maps/search/${encodeURIComponent(address)}`;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
        pointerEvents: isEditMode ? 'none' : 'auto',
      }}
    >
      <iframe
        src={src}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          pointerEvents: isEditMode ? 'none' : 'auto',
        }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={copy.map.iframeTitle}
      />
      {!isEditMode ? (
        <div
          data-map-fallback="true"
          style={{
            position: 'absolute',
            left: 10,
            right: 10,
            bottom: 10,
            zIndex: 2,
            display: 'grid',
            gap: 6,
            padding: 10,
            borderRadius: 8,
            border: '1px solid rgba(148, 163, 184, 0.38)',
            background: 'rgba(248, 250, 252, 0.92)',
            color: '#334155',
            boxShadow: '0 10px 22px rgba(15, 23, 42, 0.14)',
            pointerEvents: 'auto',
          }}
        >
          <div
            data-map-fallback-address="true"
            style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.35, wordBreak: 'keep-all' }}
          >
            {address}
          </div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{copy.map.fallbackMessage}</div>
          <a
            data-map-fallback-link="true"
            href={mapSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              pointerEvents: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              width: 'fit-content',
              padding: '8px 14px',
              borderRadius: 8,
              background: '#2563eb',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            {copy.map.openInMaps}
          </a>
        </div>
      ) : null}
      {isEditMode ? (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: 10,
            top: 10,
            padding: '5px 8px',
            borderRadius: 6,
            background: 'rgba(15, 23, 42, 0.78)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            pointerEvents: 'none',
          }}
        >
          {copy.map.editBadge}
        </div>
      ) : null}
    </div>
  );
}

export default defineComponent({
  kind: 'map',
  displayName: 'map',
  category: 'media',
  icon: '◻',
  defaultContent: {
    address: '',
    zoom: 15,
  },
  defaultStyle: {},
  defaultRect: { width: 300, height: 200 },
  Render: MapRender,
  Inspector: MapInspector,
});

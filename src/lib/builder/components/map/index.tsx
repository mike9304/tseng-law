import { defineComponent } from '../define';
import MapInspector from './Inspector';

interface MapContent {
  address: string;
  zoom: number;
}

function MapRender({ node }: { node: { content: MapContent } }) {
  const { address = '', zoom = 15 } = node.content;

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

  return (
    <div style={{ width: '100%', height: '100%', borderRadius: 8, overflow: 'hidden' }}>
      <iframe
        src={src}
        style={{ width: '100%', height: '100%', border: 'none' }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Maps"
      />
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

import { defineComponent } from '../define';

interface AttorneyCardContent {
  name: string;
  title: string;
  photo: string;
  specialties: string[];
}

function AttorneyCardRender({ node }: { node: { content: AttorneyCardContent } }) {
  const { name = '', title = '', photo = '', specialties = [] } = node.content;

  if (!name) {
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
        Attorney Card
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: 24,
        borderRadius: 8,
        border: '1px solid #e2e8f0',
        background: '#ffffff',
        display: 'flex',
        gap: 20,
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
          background: '#f1f5f9',
        }}
      >
        {photo ? (
          <img
            src={photo}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{name}</h3>
        {title && (
          <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>{title}</p>
        )}
        {specialties.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
            {specialties.map((s, i) => (
              <span
                key={i}
                style={{
                  fontSize: 12,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: '#f0fdf4',
                  color: '#166534',
                  fontWeight: 500,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default defineComponent({
  kind: 'attorneyCard',
  displayName: 'attorneyCard',
  category: 'domain',
  icon: '◻',
  defaultContent: {
    name: '',
    title: '',
    photo: '',
    specialties: [] as string[],
  },
  defaultStyle: {},
  defaultRect: { width: 400, height: 250 },
  Render: AttorneyCardRender,
});

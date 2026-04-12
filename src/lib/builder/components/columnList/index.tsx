import { defineComponent } from '../define';

interface ColumnItem {
  slug: string;
  title: string;
  date: string;
  summary: string;
}

interface ColumnListContent {
  locale: string;
  limit: number;
  category?: string;
  items?: ColumnItem[];
}

function ColumnListRender({ node }: { node: { content: ColumnListContent } }) {
  const { items = [], limit = 6 } = node.content;

  const displayed = items.slice(0, limit);

  if (!displayed.length) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}
      >
        {Array.from({ length: Math.min(limit, 3) }).map((_, i) => (
          <div
            key={i}
            style={{
              background: '#f1f5f9',
              border: '2px dashed #cbd5e1',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              fontSize: 13,
              minHeight: 120,
              padding: 16,
            }}
          >
            Column
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
        overflow: 'auto',
      }}
    >
      {displayed.map((item, i) => (
        <div
          key={i}
          style={{
            padding: 16,
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <span style={{ fontSize: 12, color: '#94a3b8' }}>{item.date}</span>
          <h4 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#0f172a', lineHeight: 1.3 }}>
            {item.title}
          </h4>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: '#64748b',
              lineHeight: 1.4,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {item.summary}
          </p>
        </div>
      ))}
    </div>
  );
}

export default defineComponent({
  kind: 'columnList',
  displayName: 'columnList',
  category: 'domain',
  icon: '◻',
  defaultContent: {
    locale: 'ko',
    limit: 6,
    category: '',
    items: [] as ColumnItem[],
  },
  defaultStyle: {},
  defaultRect: { width: 400, height: 250 },
  Render: ColumnListRender,
});

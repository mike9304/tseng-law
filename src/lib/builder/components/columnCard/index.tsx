import { defineComponent } from '../define';

interface ColumnCardContent {
  slug: string;
  locale: string;
  title?: string;
  date?: string;
  summary?: string;
}

function ColumnCardRender({ node }: { node: { content: ColumnCardContent } }) {
  const { title = '', date = '', summary = '', slug = '' } = node.content;

  if (!title && !slug) {
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
        Column Card
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: 20,
        borderRadius: 8,
        border: '1px solid #e2e8f0',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        overflow: 'hidden',
      }}
    >
      {date && (
        <span style={{ fontSize: 12, color: '#94a3b8' }}>{date}</span>
      )}
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
        {title || slug}
      </h3>
      {summary && (
        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: '#64748b',
            lineHeight: 1.5,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {summary}
        </p>
      )}
    </div>
  );
}

export default defineComponent({
  kind: 'columnCard',
  displayName: 'columnCard',
  category: 'domain',
  icon: '◻',
  defaultContent: {
    slug: '',
    locale: 'ko',
    title: '',
    date: '',
    summary: '',
  },
  defaultStyle: {},
  defaultRect: { width: 400, height: 250 },
  Render: ColumnCardRender,
});

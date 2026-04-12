import { defineComponent } from '../define';

interface CustomEmbedContent {
  html: string;
}

function CustomEmbedRender({ node, mode }: { node: { content: CustomEmbedContent }; mode?: 'edit' | 'preview' | 'published' }) {
  const { html = '' } = node.content;

  if (!html) {
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
        Custom Embed
      </div>
    );
  }

  if (mode === 'published') {
    return (
      <div
        style={{ width: '100%', height: '100%' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  // Edit / preview mode: show code preview
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#1e293b',
        borderRadius: 8,
        overflow: 'auto',
        padding: 12,
      }}
    >
      <pre
        style={{
          margin: 0,
          fontFamily: 'monospace',
          fontSize: 12,
          color: '#e2e8f0',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}
      >
        {html}
      </pre>
    </div>
  );
}

export default defineComponent({
  kind: 'customEmbed',
  displayName: 'customEmbed',
  category: 'advanced',
  icon: '◻',
  defaultContent: {
    html: '',
  },
  defaultStyle: {},
  defaultRect: { width: 400, height: 250 },
  Render: CustomEmbedRender,
});

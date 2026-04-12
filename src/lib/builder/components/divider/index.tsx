import { defineComponent } from '../define';

interface DividerContent {
  style: 'solid' | 'dashed' | 'dotted';
  color: string;
  thickness: number;
}

function DividerRender({ node }: { node: { content: DividerContent } }) {
  const { style = 'solid', color = '#cbd5e1', thickness = 1 } = node.content;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <hr
        style={{
          width: '100%',
          border: 'none',
          borderTop: `${thickness}px ${style} ${color}`,
          margin: 0,
        }}
      />
    </div>
  );
}

export default defineComponent({
  kind: 'divider',
  displayName: 'divider',
  category: 'advanced',
  icon: '◻',
  defaultContent: {
    style: 'solid' as const,
    color: '#cbd5e1',
    thickness: 1,
  },
  defaultStyle: {},
  defaultRect: { width: 300, height: 4 },
  Render: DividerRender,
});

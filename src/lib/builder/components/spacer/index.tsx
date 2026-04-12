import { defineComponent } from '../define';

interface SpacerContent {
  height: number;
}

function SpacerRender({ node }: { node: { content: SpacerContent } }) {
  const { height = 40 } = node.content;

  return (
    <div
      style={{
        width: '100%',
        height,
        backgroundColor: 'transparent',
      }}
    />
  );
}

export default defineComponent({
  kind: 'spacer',
  displayName: 'spacer',
  category: 'advanced',
  icon: '◻',
  defaultContent: {
    height: 40,
  },
  defaultStyle: {},
  defaultRect: { width: 300, height: 40 },
  Render: SpacerRender,
});

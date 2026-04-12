import { defineComponent } from '../define';
import TextElement from '@/components/builder/canvas/elements/TextElement';

export default defineComponent({
  kind: 'text',
  displayName: '텍스트',
  category: 'basic',
  icon: 'T',
  defaultContent: {
    text: '텍스트를 입력하세요',
    fontSize: 16,
    color: '#1f2937',
    fontWeight: 'regular' as const,
    align: 'left' as const,
  },
  defaultRect: { width: 200, height: 40 },
  Render: TextElement,
});

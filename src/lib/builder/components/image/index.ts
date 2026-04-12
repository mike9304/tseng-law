import { defineComponent } from '../define';
import ImageElement from '@/components/builder/canvas/elements/ImageElement';

export default defineComponent({
  kind: 'image',
  displayName: '이미지',
  category: 'basic',
  icon: '🖼',
  defaultContent: {
    src: '',
    alt: '',
    fit: 'cover' as const,
  },
  defaultRect: { width: 300, height: 200 },
  Render: ImageElement,
});

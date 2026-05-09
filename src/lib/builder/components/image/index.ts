import { defineComponent } from '../define';
import ImageElement from '@/components/builder/canvas/elements/ImageElement';
import ImageInspector from './Inspector';

export default defineComponent({
  kind: 'image',
  displayName: '이미지',
  category: 'basic',
  icon: '🖼',
  defaultContent: {
    src: '/images/placeholder-image.svg',
    alt: '',
    fit: 'cover' as const,
    cropAspect: '',
    clickAction: 'none' as const,
    hoverSrc: undefined,
    hotspots: undefined,
    compare: undefined,
    svg: undefined,
    gif: undefined,
    filters: undefined,
    link: undefined,
  },
  defaultStyle: {
    borderRadius: 12,
  },
  defaultRect: { width: 300, height: 200 },
  Render: ImageElement,
  Inspector: ImageInspector,
});

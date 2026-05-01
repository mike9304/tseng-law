import { defineComponent } from '../define';
import GalleryRender from './GalleryRender';
import GalleryInspector from './Inspector';

interface GalleryImage {
  src: string;
  alt: string;
}

export default defineComponent({
  kind: 'gallery',
  displayName: 'gallery',
  category: 'media',
  icon: '\u25FB',
  defaultContent: {
    images: [] as GalleryImage[],
    columns: 3,
    gap: 8,
  },
  defaultStyle: {},
  defaultRect: { width: 300, height: 200 },
  Render: GalleryRender,
  Inspector: GalleryInspector,
});

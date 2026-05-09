import { defineComponent } from '../define';
import GalleryRender from './GalleryRender';
import GalleryInspector from './Inspector';

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
  tags?: string[];
}

export default defineComponent({
  kind: 'gallery',
  displayName: 'gallery',
  category: 'media',
  icon: '\u25FB',
  defaultContent: {
    images: [] as GalleryImage[],
    layout: 'grid' as const,
    columns: 3,
    gap: 8,
    showCaptions: false,
    captionMode: 'below' as const,
    activeFilter: 'all',
    autoplay: false,
    interval: 4000,
    thumbnailPosition: 'bottom' as const,
    proStyle: 'clean' as const,
  },
  defaultStyle: {},
  defaultRect: { width: 300, height: 200 },
  Render: GalleryRender,
  Inspector: GalleryInspector,
});

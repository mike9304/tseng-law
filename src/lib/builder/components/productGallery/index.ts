import { defineComponent } from '../define';
import ProductGalleryElement from './Element';

export default defineComponent({
  kind: 'product-gallery',
  displayName: '상품 갤러리',
  category: 'domain',
  icon: 'SHOP',
  defaultContent: {
    layout: 'grid' as const,
    category: '',
    showCategoryFilter: true,
    showSort: true,
    showQuickView: true,
    columns: 3,
    pageSize: 6,
    sortBy: 'updated-desc' as const,
  },
  defaultStyle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
  },
  defaultRect: { width: 1120, height: 680 },
  Render: ProductGalleryElement,
});

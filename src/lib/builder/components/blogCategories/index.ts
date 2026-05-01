import { defineComponent } from '../define';
import BlogCategoriesElement from './Element';
import BlogCategoriesInspector from './Inspector';

export default defineComponent({
  kind: 'blog-categories',
  displayName: '블로그 카테고리',
  category: 'domain',
  icon: '☰',
  defaultContent: {
    layout: 'horizontal' as const,
    showAll: true,
    showPostCount: true,
  },
  defaultStyle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
  },
  defaultRect: { width: 800, height: 60 },
  Render: BlogCategoriesElement,
  Inspector: BlogCategoriesInspector,
});

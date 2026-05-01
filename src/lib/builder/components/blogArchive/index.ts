import { defineComponent } from '../define';
import BlogArchiveElement from './Element';
import BlogArchiveInspector from './Inspector';

export default defineComponent({
  kind: 'blog-archive',
  displayName: '블로그 아카이브',
  category: 'domain',
  icon: '🗂',
  defaultContent: {
    groupBy: 'month' as const,
    expandLatest: true,
    showCount: true,
  },
  defaultStyle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
  },
  defaultRect: { width: 280, height: 400 },
  Render: BlogArchiveElement,
  Inspector: BlogArchiveInspector,
});

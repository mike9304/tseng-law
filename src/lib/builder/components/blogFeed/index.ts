import { defineComponent } from '../define';
import BlogFeedElement from './Element';
import BlogFeedInspector from './Inspector';

export default defineComponent({
  kind: 'blog-feed',
  displayName: '블로그 피드',
  category: 'domain',
  icon: '▦',
  defaultContent: {
    layout: 'grid' as const,
    postsPerPage: 9,
    showExcerpt: true,
    showAuthor: true,
    showDate: true,
    showReadingTime: true,
    showCategory: true,
    showTags: false,
    showFeaturedImage: true,
    sortBy: 'newest' as const,
    columns: 3,
    gap: 24,
  },
  defaultStyle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderStyle: 'solid' as const,
    borderWidth: 0,
    borderRadius: 0,
  },
  defaultRect: { width: 1200, height: 800 },
  Render: BlogFeedElement,
  Inspector: BlogFeedInspector,
});

import { defineComponent } from '../define';
import BlogRecentPostsElement from './Element';

export default defineComponent({
  kind: 'blog-recent-posts',
  displayName: '최근 블로그 글',
  category: 'domain',
  icon: 'NEW',
  defaultContent: {
    limit: 5,
    layout: 'list' as const,
    showExcerpt: true,
    showAuthor: true,
    showDate: true,
    showCategory: true,
  },
  defaultStyle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
  },
  defaultRect: { width: 520, height: 420 },
  Render: BlogRecentPostsElement,
});

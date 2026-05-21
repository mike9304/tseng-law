import { defineComponent } from '../define';
import BlogAuthorElement from './Element';

export default defineComponent({
  kind: 'blog-author',
  displayName: '블로그 작성자',
  category: 'domain',
  icon: 'AU',
  defaultContent: {
    layout: 'card' as const,
    showBio: true,
    showPostCount: true,
    showRecentPosts: true,
    maxPosts: 3,
  },
  defaultStyle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
  },
  defaultRect: { width: 420, height: 360 },
  Render: BlogAuthorElement,
});

import { defineComponent } from '../define';
import BlogPostCardElement from './Element';
import BlogPostCardInspector from './Inspector';

export default defineComponent({
  kind: 'blog-post-card',
  displayName: '블로그 카드',
  category: 'domain',
  icon: '▣',
  defaultContent: {
    showFeaturedImage: true,
    showCategory: true,
    showAuthor: true,
    showExcerpt: true,
    showDate: true,
    showReadingTime: true,
    cardStyle: 'elevated' as const,
    variant: 'flat' as const,
  },
  defaultStyle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
  },
  defaultRect: { width: 360, height: 360 },
  Render: BlogPostCardElement,
  Inspector: BlogPostCardInspector,
});

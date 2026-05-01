import { defineComponent } from '../define';
import FeaturedPostsElement from './Element';
import FeaturedPostsInspector from './Inspector';

export default defineComponent({
  kind: 'featured-posts',
  displayName: '피처드 포스트',
  category: 'domain',
  icon: '★',
  defaultContent: {
    limit: 3,
    layout: 'hero' as const,
  },
  defaultStyle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
  },
  defaultRect: { width: 1200, height: 480 },
  Render: FeaturedPostsElement,
  Inspector: FeaturedPostsInspector,
});

import { defineComponent } from '../define';
import CompositeRender from './Render';

export default defineComponent({
  kind: 'composite',
  displayName: '사이트 블록',
  category: 'domain',
  icon: '◨',
  defaultContent: {
    componentKey: 'hero-search' as const,
    config: {},
  },
  defaultStyle: {},
  defaultRect: { width: 1280, height: 620 },
  Render: CompositeRender,
});

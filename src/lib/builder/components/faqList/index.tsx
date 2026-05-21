import { defineComponent } from '../define';
import FaqListInspector from './Inspector';
import FaqListPublished, { type FaqItem } from './FaqListPublished';

export default defineComponent({
  kind: 'faqList',
  displayName: 'faqList',
  category: 'domain',
  icon: '◻',
  defaultContent: {
    source: 'static',
    items: [] as FaqItem[],
    categoryId: 'all',
    showSearch: false,
    showCategoryFilter: true,
    expandFirst: true,
    schemaEnabled: true,
    limit: 50,
  },
  defaultStyle: {},
  defaultRect: { width: 400, height: 250 },
  Render: FaqListPublished,
  Inspector: FaqListInspector,
});

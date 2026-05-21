import { defineComponent } from '../define';
import PortfolioListElement from './Element';

export default defineComponent({
  kind: 'portfolio-list',
  displayName: '포트폴리오 목록',
  category: 'domain',
  icon: 'PF',
  defaultContent: {
    layout: 'cards' as const,
    limit: 6,
    category: '',
    featuredOnly: false,
    showSummary: true,
    showDate: true,
    showCategoryFilter: true,
    columns: 3,
    sortBy: 'order-asc' as const,
  },
  defaultStyle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
  },
  defaultRect: { width: 1120, height: 620 },
  Render: PortfolioListElement,
});

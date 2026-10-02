import { defineComponent } from '../define';
import ColumnCardInspector from './Inspector';

import ColumnCardRender from './Render';

export default defineComponent({
  kind: 'columnCard',
  displayName: 'columnCard',
  category: 'domain',
  icon: '◻',
  defaultContent: {
    slug: '',
    locale: 'ko',
    title: '',
    date: '',
    summary: '',
    variant: 'flat' as const,
  },
  defaultStyle: {},
  defaultRect: { width: 400, height: 250 },
  Render: ColumnCardRender,
  Inspector: ColumnCardInspector,
});

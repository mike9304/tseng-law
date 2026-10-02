import { defineComponent } from '../define';
import ColumnListInspector from './Inspector';

import ColumnListRender, { ColumnItem } from './Render';

export default defineComponent({
  kind: 'columnList',
  displayName: 'columnList',
  category: 'domain',
  icon: '◻',
  defaultContent: {
    locale: 'ko',
    limit: 6,
    category: '',
    items: [] as ColumnItem[],
  },
  defaultStyle: {},
  defaultRect: { width: 400, height: 250 },
  Render: ColumnListRender,
  Inspector: ColumnListInspector,
});

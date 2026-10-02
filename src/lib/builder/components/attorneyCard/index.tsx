import { defineComponent } from '../define';
import AttorneyCardInspector from './Inspector';

import AttorneyCardRender from './Render';

export default defineComponent({
  kind: 'attorneyCard',
  displayName: 'attorneyCard',
  category: 'domain',
  icon: '◻',
  defaultContent: {
    name: '',
    title: '',
    photo: '',
    specialties: [] as string[],
    variant: 'flat' as const,
  },
  defaultStyle: {},
  defaultRect: { width: 400, height: 250 },
  Render: AttorneyCardRender,
  Inspector: AttorneyCardInspector,
});

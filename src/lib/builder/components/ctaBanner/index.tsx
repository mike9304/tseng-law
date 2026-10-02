import { defineComponent } from '../define';
import CtaBannerInspector from './Inspector';

import CtaBannerRender from './Render';

export default defineComponent({
  kind: 'ctaBanner',
  displayName: 'ctaBanner',
  category: 'domain',
  icon: '◻',
  defaultContent: {
    title: '',
    description: '',
    buttonLabel: '',
    buttonHref: '#',
    backgroundColor: '#0b3b2e',
  },
  defaultStyle: {},
  defaultRect: { width: 400, height: 250 },
  Render: CtaBannerRender,
  Inspector: CtaBannerInspector,
});

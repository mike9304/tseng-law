import { defineComponent } from '../define';
import CustomEmbedInspector from './Inspector';

import CustomEmbedRender from './Render';

export default defineComponent({
  kind: 'customEmbed',
  displayName: 'customEmbed',
  category: 'advanced',
  icon: '◻',
  defaultContent: {
    html: '',
  },
  defaultStyle: {},
  defaultRect: { width: 400, height: 250 },
  Render: CustomEmbedRender,
  Inspector: CustomEmbedInspector,
});

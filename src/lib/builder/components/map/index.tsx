import { defineComponent } from '../define';
import MapInspector from './Inspector';

import MapRender from './Render';

export default defineComponent({
  kind: 'map',
  displayName: 'map',
  category: 'media',
  icon: '◻',
  defaultContent: {
    address: '',
    zoom: 15,
  },
  defaultStyle: {},
  defaultRect: { width: 300, height: 200 },
  Render: MapRender,
  Inspector: MapInspector,
});

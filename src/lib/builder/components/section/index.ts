import { defineComponent } from '../define';
import SectionElement from './Element';
import SectionInspector from './Inspector';

export default defineComponent({
  kind: 'section',
  displayName: '섹션',
  category: 'layout',
  icon: '▤',
  defaultContent: {
    label: 'Section',
    maxWidth: 1120,
    background: 'rgba(255, 255, 255, 0.98)',
    borderColor: '#94a3b8',
    borderWidth: 2,
    borderRadius: 28,
    padding: 24,
  },
  defaultStyle: {},
  defaultRect: { width: 1120, height: 280 },
  Render: SectionElement,
  Inspector: SectionInspector,
});

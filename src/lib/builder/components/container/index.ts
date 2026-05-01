import { defineComponent } from '../define';
import ContainerElement from './Element';
import ContainerInspector from './Inspector';

export default defineComponent({
  kind: 'container',
  displayName: '컨테이너',
  category: 'layout',
  icon: '□',
  defaultContent: {
    label: 'Container',
    background: 'rgba(248, 250, 252, 0.96)',
    borderColor: '#cbd5e1',
    borderStyle: 'dashed' as const,
    borderWidth: 2,
    borderRadius: 20,
    padding: 20,
    layoutMode: 'absolute' as const,
    variant: 'flat' as const,
  },
  defaultStyle: {},
  defaultRect: { width: 360, height: 240 },
  Render: ContainerElement,
  Inspector: ContainerInspector,
});

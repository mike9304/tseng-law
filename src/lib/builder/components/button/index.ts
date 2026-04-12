import { defineComponent } from '../define';
import ButtonElement from '@/components/builder/canvas/elements/ButtonElement';
import ButtonInspector from './Inspector';

export default defineComponent({
  kind: 'button',
  displayName: '버튼',
  category: 'basic',
  icon: '▢',
  defaultContent: {
    label: '버튼',
    href: '',
    style: 'primary' as const,
  },
  defaultStyle: {
    borderRadius: 999,
  },
  defaultRect: { width: 140, height: 48 },
  Render: ButtonElement,
  Inspector: ButtonInspector,
});

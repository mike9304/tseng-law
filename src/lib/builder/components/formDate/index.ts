import { defineComponent } from '../define';
import FormDateElement from './Element';
import FormDateInspector from './Inspector';

export default defineComponent({
  kind: 'form-date',
  displayName: '날짜 필드',
  category: 'domain',
  icon: '◷',
  defaultContent: {
    name: 'date',
    label: '날짜',
    required: false,
    type: 'date' as const,
    min: undefined,
    max: undefined,
    defaultValue: '',
    errorMessage: '',
    showIf: undefined,
    variant: 'default' as const,
  },
  defaultStyle: {},
  defaultRect: { width: 320, height: 74 },
  Render: FormDateElement,
  Inspector: FormDateInspector,
});

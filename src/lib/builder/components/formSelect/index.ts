import { defineComponent } from '../define';
import FormSelectElement from './Element';
import FormSelectInspector from './Inspector';

export default defineComponent({
  kind: 'form-select',
  displayName: '선택 필드',
  category: 'domain',
  icon: '▾',
  defaultContent: {
    name: 'select-1',
    label: '선택',
    required: false,
    options: [
      { value: 'option-1', label: '옵션 1' },
      { value: 'option-2', label: '옵션 2' },
    ],
    placeholder: '선택하세요',
    defaultValue: '',
    multiple: false,
    errorMessage: '',
    showIf: undefined,
    variant: 'default' as const,
  },
  defaultStyle: {},
  defaultRect: { width: 320, height: 74 },
  Render: FormSelectElement,
  Inspector: FormSelectInspector,
});

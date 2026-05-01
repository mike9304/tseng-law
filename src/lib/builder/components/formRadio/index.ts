import { defineComponent } from '../define';
import FormRadioElement from './Element';
import FormRadioInspector from './Inspector';

export default defineComponent({
  kind: 'form-radio',
  displayName: '라디오 그룹',
  category: 'domain',
  icon: '◉',
  defaultContent: {
    name: 'choice',
    label: '선택',
    required: false,
    options: [
      { value: 'option-1', label: '옵션 1' },
      { value: 'option-2', label: '옵션 2' },
    ],
    defaultValue: '',
    layout: 'vertical' as const,
    errorMessage: '',
    showIf: undefined,
  },
  defaultStyle: {},
  defaultRect: { width: 320, height: 120 },
  Render: FormRadioElement,
  Inspector: FormRadioInspector,
});

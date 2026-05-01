import { defineComponent } from '../define';
import FormCheckboxElement from './Element';
import FormCheckboxInspector from './Inspector';

export default defineComponent({
  kind: 'form-checkbox',
  displayName: '체크박스',
  category: 'domain',
  icon: '☑',
  defaultContent: {
    name: 'consent',
    label: '동의합니다',
    required: false,
    defaultChecked: false,
    options: undefined,
    errorMessage: '',
    showIf: undefined,
  },
  defaultStyle: {},
  defaultRect: { width: 320, height: 54 },
  Render: FormCheckboxElement,
  Inspector: FormCheckboxInspector,
});

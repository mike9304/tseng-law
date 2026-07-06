import { defineComponent } from '../define';
import FormInputElement from './Element';
import FormInputInspector from './Inspector';
import { FORM_INPUT_KO_DEFAULTS } from '../form/form-controls-copy';

export default defineComponent({
  kind: 'form-input',
  displayName: '입력 필드',
  category: 'domain',
  icon: '⌨',
  defaultContent: {
    name: 'field-1',
    label: FORM_INPUT_KO_DEFAULTS.label,
    placeholder: '',
    type: 'text' as const,
    required: false,
    minLength: undefined,
    maxLength: undefined,
    pattern: undefined,
    defaultValue: '',
    errorMessage: '',
    showIf: undefined,
    variant: 'default' as const,
  },
  defaultStyle: {},
  defaultRect: { width: 320, height: 70 },
  Render: FormInputElement,
  Inspector: FormInputInspector,
});

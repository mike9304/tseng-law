import { defineComponent } from '../define';
import FormTextareaElement from './Element';
import FormTextareaInspector from './Inspector';
import { FORM_TEXTAREA_KO_DEFAULTS } from '../form/form-controls-copy';

export default defineComponent({
  kind: 'form-textarea',
  displayName: '텍스트 영역',
  category: 'domain',
  icon: '☰',
  defaultContent: {
    name: 'message',
    label: FORM_TEXTAREA_KO_DEFAULTS.label,
    placeholder: '',
    rows: 4,
    required: false,
    minLength: undefined,
    maxLength: undefined,
    defaultValue: '',
    errorMessage: '',
    showIf: undefined,
    variant: 'default' as const,
  },
  defaultStyle: {},
  defaultRect: { width: 360, height: 160 },
  Render: FormTextareaElement,
  Inspector: FormTextareaInspector,
});

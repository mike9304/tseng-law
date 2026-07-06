import { defineComponent } from '../define';
import FormSelectElement from './Element';
import FormSelectInspector from './Inspector';
import { FORM_SELECT_KO_DEFAULTS } from '../form/form-controls-copy';

export default defineComponent({
  kind: 'form-select',
  displayName: '선택 필드',
  category: 'domain',
  icon: '▾',
  defaultContent: {
    name: 'select-1',
    label: FORM_SELECT_KO_DEFAULTS.label,
    required: false,
    options: [
      { value: 'option-1', label: `${FORM_SELECT_KO_DEFAULTS.optionLabelPrefix}1` },
      { value: 'option-2', label: `${FORM_SELECT_KO_DEFAULTS.optionLabelPrefix}2` },
    ],
    placeholder: FORM_SELECT_KO_DEFAULTS.placeholder,
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

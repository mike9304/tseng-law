import { defineComponent } from '../define';
import FormRadioElement from './Element';
import FormRadioInspector from './Inspector';
import { FORM_RADIO_KO_DEFAULTS } from '../form/form-controls-copy';

export default defineComponent({
  kind: 'form-radio',
  displayName: '라디오 그룹',
  category: 'domain',
  icon: '◉',
  defaultContent: {
    name: 'choice',
    label: FORM_RADIO_KO_DEFAULTS.label,
    required: false,
    options: [
      { value: 'option-1', label: `${FORM_RADIO_KO_DEFAULTS.optionLabelPrefix}1` },
      { value: 'option-2', label: `${FORM_RADIO_KO_DEFAULTS.optionLabelPrefix}2` },
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

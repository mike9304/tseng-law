import { defineComponent } from '../define';
import FormFileElement from './Element';
import FormFileInspector from './Inspector';
import { FORM_FILE_KO_DEFAULTS } from '../form/form-controls-copy';

export default defineComponent({
  kind: 'form-file',
  displayName: '파일 업로드',
  category: 'domain',
  icon: '⇪',
  defaultContent: {
    name: 'attachment',
    label: FORM_FILE_KO_DEFAULTS.label,
    required: false,
    accept: 'image/*,application/pdf',
    maxSizeMb: 10,
    multiple: false,
    errorMessage: '',
    showIf: undefined,
    variant: 'default' as const,
  },
  defaultStyle: {},
  defaultRect: { width: 320, height: 86 },
  Render: FormFileElement,
  Inspector: FormFileInspector,
});

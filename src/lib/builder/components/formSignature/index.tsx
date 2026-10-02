'use client';

import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderFormSignatureCanvasNode } from '@/lib/builder/canvas/types';
import { FORM_SIGNATURE_KO_DEFAULTS, getFormControlsCopy, localizedFormControlText } from '../form/form-controls-copy';
import inspectorStyles from '../form/FormControlInspector.module.css';

import FormSignatureRender from './Render';

function FormSignatureInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const sNode = node as BuilderFormSignatureCanvasNode;
  const c = sNode.content;
  const signatureCopy = getFormControlsCopy(locale).signatureWidget;
  const copy = signatureCopy.inspector;
  const label = localizedFormControlText(c.label, signatureCopy.defaults.label, FORM_SIGNATURE_KO_DEFAULTS.label);
  const helpText = localizedFormControlText(
    c.helpText,
    signatureCopy.defaults.helpText,
    FORM_SIGNATURE_KO_DEFAULTS.helpText,
  );
  return (
    <div className={inspectorStyles.root} data-builder-form-advanced-inspector="signature">
      <label>
        <span>{copy.nameLabel}</span>
        <input type="text" value={c.name} disabled={disabled} onChange={(event) => onUpdate({ name: event.target.value })} />
      </label>
      <label>
        <span>{copy.labelLabel}</span>
        <input type="text" value={label} disabled={disabled} onChange={(event) => onUpdate({ label: event.target.value })} />
      </label>
      <label>
        <span>{copy.helpTextLabel}</span>
        <textarea rows={2} value={helpText} disabled={disabled} onChange={(event) => onUpdate({ helpText: event.target.value })} />
      </label>
      <label>
        <span>{copy.strokeColorLabel}</span>
        <input type="text" value={c.strokeColor} disabled={disabled} onChange={(event) => onUpdate({ strokeColor: event.target.value })} />
      </label>
      <label>
        <span>{copy.strokeWidthLabel}</span>
        <input
          type="number"
          min={1}
          max={8}
          value={c.strokeWidth}
          disabled={disabled}
          onChange={(event) => onUpdate({ strokeWidth: Number(event.target.value) })}
        />
      </label>
      <label>
        <input type="checkbox" checked={c.required} disabled={disabled} onChange={(event) => onUpdate({ required: event.target.checked })} />
        <span>{copy.requiredLabel}</span>
      </label>
      <label>
        <input type="checkbox" checked={c.showClearButton} disabled={disabled} onChange={(event) => onUpdate({ showClearButton: event.target.checked })} />
        <span>{copy.showClearButtonLabel}</span>
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'form-signature',
  displayName: '서명 입력',
  category: 'advanced',
  icon: '✍',
  defaultContent: {
    name: 'signature',
    label: FORM_SIGNATURE_KO_DEFAULTS.label,
    required: true,
    helpText: FORM_SIGNATURE_KO_DEFAULTS.helpText,
    strokeColor: '#0f172a',
    strokeWidth: 2,
    showClearButton: true,
  },
  defaultStyle: {},
  defaultRect: { width: 520, height: 240 },
  Render: FormSignatureRender,
  Inspector: FormSignatureInspector,
});

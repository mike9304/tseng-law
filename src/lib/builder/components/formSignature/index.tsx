'use client';

import { useEffect, useRef, useState } from 'react';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderFormSignatureCanvasNode } from '@/lib/builder/canvas/types';
import { useFormFieldRuntime } from '@/lib/builder/forms/render-helpers';
import type { Locale } from '@/lib/locales';
import {
  FORM_SIGNATURE_KO_DEFAULTS,
  getFormControlsCopy,
  localizedFormControlText,
} from '../form/form-controls-copy';
import inspectorStyles from '../form/FormControlInspector.module.css';

function FormSignatureRender({
  node,
  mode = 'edit',
  locale = 'ko',
}: {
  node: BuilderFormSignatureCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}) {
  const c = node.content;
  const copy = getFormControlsCopy(locale);
  const label = localizedFormControlText(c.label, copy.signatureWidget.defaults.label, FORM_SIGNATURE_KO_DEFAULTS.label);
  const helpText = localizedFormControlText(
    c.helpText,
    copy.signatureWidget.defaults.helpText,
    FORM_SIGNATURE_KO_DEFAULTS.helpText,
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const [hasInk, setHasInk] = useState(false);
  const [signatureValue, setSignatureValue] = useState('');
  const field = useFormFieldRuntime({ nodeId: node.id, name: c.name, showIf: c.showIf });

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = c.strokeColor;
    ctx.lineWidth = c.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [c.strokeColor, c.strokeWidth]);

  function pointerPos(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function onDown(event: React.PointerEvent<HTMLCanvasElement>) {
    if (mode === 'edit') return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const p = pointerPos(event);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  }

  function onMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const p = pointerPos(event);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    if (!hasInk) setHasInk(true);
  }

  function onUp() {
    if (drawingRef.current) {
      const dataUrl = canvasRef.current?.toDataURL('image/png') ?? '';
      setSignatureValue(dataUrl);
      field.onValueChange(dataUrl || undefined);
    }
    drawingRef.current = false;
  }

  function clear() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
    setSignatureValue('');
    field.onValueChange(undefined);
  }

  return (
    <div ref={field.rootRef} style={{ opacity: mode !== 'published' && c.showIf ? 0.72 : 1 }}>
      <fieldset
        className="builder-form-signature"
        data-builder-form-widget="signature"
        data-builder-form-name={c.name}
        data-builder-signature-has-ink={hasInk ? 'true' : 'false'}
        aria-required={c.required ? 'true' : 'false'}
      >
        <legend>{label}{c.required ? ' *' : ''}</legend>
        {helpText ? <p>{helpText}</p> : null}
        <canvas
          ref={canvasRef}
          width={520}
          height={180}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />
        <input type="hidden" name={c.name} value={signatureValue} readOnly />
        {c.showClearButton ? (
          <button type="button" onClick={() => mode !== 'edit' && clear()}>
            {copy.signatureWidget.clearButtonLabel}
          </button>
        ) : null}
        {field.error ? <span role="alert">{field.error}</span> : null}
      </fieldset>
    </div>
  );
}

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

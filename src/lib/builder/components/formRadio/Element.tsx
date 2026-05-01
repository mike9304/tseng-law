'use client';

import type { BuilderFormRadioCanvasNode } from '@/lib/builder/canvas/types';
import { useFormFieldRuntime } from '@/lib/builder/forms/render-helpers';

export default function FormRadioElement({
  node,
  mode = 'edit',
}: {
  node: BuilderFormRadioCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const field = useFormFieldRuntime({ nodeId: node.id, name: c.name, showIf: c.showIf });

  return (
    <div
      ref={field.rootRef}
      role="group"
      aria-labelledby={`field-${node.id}-label`}
      style={{
        ...shellStyle,
        opacity: mode !== 'published' && c.showIf ? 0.72 : 1,
      }}
    >
      <span id={`field-${node.id}-label`} style={legendStyle}>
        {c.label}
        {c.required ? <span style={{ color: '#dc2626', marginLeft: 4 }}>*</span> : null}
      </span>
      <div style={{ display: 'flex', flexDirection: c.layout === 'horizontal' ? 'row' : 'column', gap: 8, flexWrap: 'wrap' }}>
        {c.options.map((option, index) => (
          <label key={option.value} style={optionStyle}>
            <input
              type="radio"
              name={c.name}
              value={option.value}
              defaultChecked={c.defaultValue === option.value}
              required={c.required && field.visible && index === 0}
              data-builder-field-label={c.label}
              data-builder-error-message={c.errorMessage}
              aria-describedby={field.error ? `field-${node.id}-error` : undefined}
              onChange={(event) => field.onValueChange(event.currentTarget.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {field.error ? <span id={`field-${node.id}-error`} style={errorStyle}>{field.error}</span> : null}
    </div>
  );
}

const shellStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: 8,
  margin: 0,
  padding: 0,
  border: 0,
  boxSizing: 'border-box',
};

const legendStyle: React.CSSProperties = {
  padding: 0,
  fontSize: 13,
  fontWeight: 600,
  color: '#374151',
};

const optionStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 14,
  color: '#374151',
};

const errorStyle: React.CSSProperties = {
  color: '#dc2626',
  fontSize: 12,
  lineHeight: 1.25,
};

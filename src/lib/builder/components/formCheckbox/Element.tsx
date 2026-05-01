'use client';

import type { BuilderFormCheckboxCanvasNode } from '@/lib/builder/canvas/types';
import { useFormFieldRuntime } from '@/lib/builder/forms/render-helpers';

export default function FormCheckboxElement({
  node,
  mode = 'edit',
}: {
  node: BuilderFormCheckboxCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const field = useFormFieldRuntime({ nodeId: node.id, name: c.name, showIf: c.showIf });
  const options = c.options && c.options.length > 0 ? c.options : [{ value: 'yes', label: c.label }];

  return (
    <div ref={field.rootRef} style={{ ...shellStyle, opacity: mode !== 'published' && c.showIf ? 0.72 : 1 }}>
      {options.length > 1 ? (
        <span style={groupLabelStyle}>
          {c.label}
          {c.required ? <span style={{ color: '#dc2626', marginLeft: 4 }}>*</span> : null}
        </span>
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {options.map((option, index) => (
          <label key={option.value} style={optionStyle}>
            <input
              type="checkbox"
              name={c.name}
              value={option.value}
              defaultChecked={options.length === 1 ? c.defaultChecked : false}
              required={c.required && field.visible && options.length === 1}
              data-builder-field-label={c.label}
              data-builder-error-message={c.errorMessage}
              aria-invalid={field.error ? true : undefined}
              aria-describedby={field.error ? `field-${node.id}-error` : undefined}
              onChange={(event) => {
                if (options.length === 1) {
                  field.onValueChange(event.currentTarget.checked ? option.value : undefined);
                  return;
                }
                const checked = event.currentTarget.form
                  ? new FormData(event.currentTarget.form).getAll(c.name).map(String)
                  : [];
                field.onValueChange(checked);
              }}
            />
            <span>
              {options.length === 1 && index === 0 ? c.label : option.label}
              {options.length === 1 && c.required ? <span style={{ color: '#dc2626', marginLeft: 4 }}>*</span> : null}
            </span>
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
  boxSizing: 'border-box',
};

const groupLabelStyle: React.CSSProperties = {
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

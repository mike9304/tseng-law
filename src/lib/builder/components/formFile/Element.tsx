'use client';

import { useState } from 'react';
import type { BuilderFormFileCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderTheme } from '@/lib/builder/site/types';
import { resolveFormInputVariantStyle } from '@/lib/builder/site/component-variants';
import { useFormFieldRuntime } from '@/lib/builder/forms/render-helpers';

export default function FormFileElement({
  node,
  theme,
  mode = 'edit',
}: {
  node: BuilderFormFileCanvasNode;
  theme?: BuilderTheme;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const [focused, setFocused] = useState(false);
  const field = useFormFieldRuntime({ nodeId: node.id, name: c.name, showIf: c.showIf });
  const inputVariantStyle = resolveFormInputVariantStyle(c.variant, theme, {
    error: Boolean(field.error),
    focused,
  });

  return (
    <div ref={field.rootRef} style={{ ...shellStyle, opacity: mode !== 'published' && c.showIf ? 0.72 : 1 }}>
      <label htmlFor={`field-${node.id}`} style={labelStyle}>
        {c.label}
        {c.required ? <span style={{ color: '#dc2626', marginLeft: 4 }}>*</span> : null}
      </label>
      <input
        id={`field-${node.id}`}
        type="file"
        name={c.name}
        accept={c.accept}
        multiple={c.multiple}
        required={c.required && field.visible}
        data-builder-field-label={c.label}
        data-builder-error-message={c.errorMessage}
        data-builder-max-size-mb={c.maxSizeMb}
        aria-invalid={field.error ? true : undefined}
        aria-describedby={field.error ? `field-${node.id}-error` : undefined}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(event) => {
          const files = Array.from(event.currentTarget.files ?? []).map((file) => file.name);
          field.onValueChange(c.multiple ? files : files[0]);
        }}
        style={{
          ...inputStyle,
          ...inputVariantStyle,
          padding: '8px 10px',
          boxSizing: 'border-box',
        }}
      />
      <span style={hintStyle}>Allowed: {c.accept || 'any'} · Max {c.maxSizeMb}MB</span>
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
  gap: 6,
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: '#374151',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  fontSize: 13,
  color: '#334155',
};

const hintStyle: React.CSSProperties = {
  fontSize: 11,
  color: '#64748b',
};

const errorStyle: React.CSSProperties = {
  color: '#dc2626',
  fontSize: 12,
  lineHeight: 1.25,
};

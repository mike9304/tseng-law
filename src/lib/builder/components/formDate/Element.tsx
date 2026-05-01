'use client';

import { useState } from 'react';
import type { BuilderFormDateCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderTheme } from '@/lib/builder/site/types';
import { resolveThemeColor } from '@/lib/builder/site/theme';
import { resolveFormInputVariantStyle } from '@/lib/builder/site/component-variants';
import { useFormFieldRuntime } from '@/lib/builder/forms/render-helpers';

export default function FormDateElement({
  node,
  theme,
  mode = 'edit',
}: {
  node: BuilderFormDateCanvasNode;
  theme?: BuilderTheme;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const [focused, setFocused] = useState(false);
  const field = useFormFieldRuntime({ nodeId: node.id, name: c.name, showIf: c.showIf });
  const textColor = resolveThemeColor({ kind: 'token', token: 'text' }, theme) ?? '#0f172a';
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
        type={c.type}
        name={c.name}
        min={c.min}
        max={c.max}
        defaultValue={c.defaultValue}
        required={c.required && field.visible}
        data-builder-field-label={c.label}
        data-builder-error-message={c.errorMessage}
        aria-invalid={field.error ? true : undefined}
        aria-describedby={field.error ? `field-${node.id}-error` : undefined}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(event) => field.onValueChange(event.currentTarget.value)}
        style={{
          width: '100%',
          flex: 1,
          padding: '10px 12px',
          fontSize: 14,
          color: textColor,
          ...inputVariantStyle,
          boxSizing: 'border-box',
        }}
      />
      {field.error ? <span id={`field-${node.id}-error`} style={errorStyle}>{field.error}</span> : null}
    </div>
  );
}

const shellStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: '#374151',
};

const errorStyle: React.CSSProperties = {
  color: '#dc2626',
  fontSize: 12,
  lineHeight: 1.25,
};

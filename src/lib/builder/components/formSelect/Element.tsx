'use client';

import { useState } from 'react';
import type { BuilderFormSelectCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderTheme } from '@/lib/builder/site/types';
import { resolveThemeColor } from '@/lib/builder/site/theme';
import { resolveFormInputVariantStyle } from '@/lib/builder/site/component-variants';
import { useFormFieldRuntime } from '@/lib/builder/forms/render-helpers';
import type { Locale } from '@/lib/locales';
import {
  FORM_SELECT_KO_DEFAULTS,
  getFormControlsCopy,
  localizedFormControlText,
  localizedFormSelectOptionLabel,
} from '../form/form-controls-copy';

export default function FormSelectElement({
  node,
  theme,
  mode = 'edit',
  locale = 'ko',
}: {
  node: BuilderFormSelectCanvasNode;
  theme?: BuilderTheme;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}) {
  const c = node.content;
  const copy = getFormControlsCopy(locale);
  const label = localizedFormControlText(c.label, copy.fieldDefaults.selectLabel, FORM_SELECT_KO_DEFAULTS.label);
  const placeholder = localizedFormControlText(
    c.placeholder,
    copy.fieldDefaults.selectPlaceholder,
    FORM_SELECT_KO_DEFAULTS.placeholder,
  );
  const [focused, setFocused] = useState(false);
  const field = useFormFieldRuntime({ nodeId: node.id, name: c.name, showIf: c.showIf });
  const textColor = resolveThemeColor({ kind: 'token', token: 'text' }, theme) ?? '#0f172a';
  const inputVariantStyle = resolveFormInputVariantStyle(c.variant, theme, {
    error: Boolean(field.error),
    focused,
  });

  return (
    <div ref={field.rootRef} style={{ ...fieldShellStyle, opacity: mode !== 'published' && c.showIf ? 0.72 : 1 }}>
      <label htmlFor={`field-${node.id}`} style={labelStyle}>
        {label}
        {c.required ? <span style={{ color: '#dc2626', marginLeft: 4 }}>*</span> : null}
      </label>
      <select
        id={`field-${node.id}`}
        name={c.name}
        required={c.required && field.visible}
        multiple={c.multiple}
        defaultValue={c.multiple ? undefined : c.defaultValue ?? ''}
        data-builder-field-label={label}
        data-builder-error-message={c.errorMessage}
        aria-invalid={field.error ? true : undefined}
        aria-describedby={field.error ? `field-${node.id}-error` : undefined}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(event) => {
          const selected = Array.from(event.currentTarget.selectedOptions).map((option) => option.value);
          field.onValueChange(c.multiple ? selected : selected[0] ?? '');
        }}
        style={{
          width: '100%',
          flex: 1,
          padding: '10px 12px',
          fontSize: 14,
          color: textColor,
          ...inputVariantStyle,
          boxSizing: 'border-box',
        }}
      >
        {placeholder && !c.multiple ? <option value="">{placeholder}</option> : null}
        {c.options.map((option) => (
          <option key={option.value} value={option.value}>
            {localizedFormSelectOptionLabel(option.label, copy.fieldDefaults.selectOptionLabel)}
          </option>
        ))}
      </select>
      {field.error ? <span id={`field-${node.id}-error`} style={errorStyle}>{field.error}</span> : null}
    </div>
  );
}

const fieldShellStyle: React.CSSProperties = {
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

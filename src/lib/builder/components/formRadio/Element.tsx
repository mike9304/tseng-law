'use client';

import type { CSSProperties } from 'react';
import type { BuilderFormRadioCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderTheme } from '@/lib/builder/site/types';
import { resolveThemeColor } from '@/lib/builder/site/theme';
import {
  normalizeFormInputVariantKey,
  resolveFormInputVariantStyle,
} from '@/lib/builder/site/component-variants';
import { useFormFieldRuntime } from '@/lib/builder/forms/render-helpers';
import type { Locale } from '@/lib/locales';
import {
  FORM_RADIO_KO_DEFAULTS,
  getFormControlsCopy,
  localizedFormControlText,
  localizedFormSelectOptionLabel,
} from '../form/form-controls-copy';

export default function FormRadioElement({
  node,
  theme,
  mode = 'edit',
  locale = 'ko',
}: {
  node: BuilderFormRadioCanvasNode;
  theme?: BuilderTheme;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}) {
  const c = node.content;
  const copy = getFormControlsCopy(locale);
  const label = localizedFormControlText(c.label, copy.fieldDefaults.radioLabel, FORM_RADIO_KO_DEFAULTS.label);
  const field = useFormFieldRuntime({ nodeId: node.id, name: c.name, showIf: c.showIf });
  const variantKey = normalizeFormInputVariantKey(c.variant);
  const variantStyle = resolveFormInputVariantStyle(c.variant, theme, {
    error: Boolean(field.error),
  });
  const accentColor = resolveThemeColor({ kind: 'token', token: 'primary' }, theme);
  const optionWrapperStyle = buildOptionWrapperStyle(variantKey, variantStyle);

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
        {label}
        {c.required ? <span style={{ color: '#dc2626', marginLeft: 4 }}>*</span> : null}
      </span>
      <div style={{ display: 'flex', flexDirection: c.layout === 'horizontal' ? 'row' : 'column', gap: 8, flexWrap: 'wrap' }}>
        {c.options.map((option, index) => (
          <label key={option.value} style={{ ...optionStyle, ...optionWrapperStyle }}>
            <input
              type="radio"
              name={c.name}
              value={option.value}
              defaultChecked={c.defaultValue === option.value}
              required={c.required && field.visible && index === 0}
              data-builder-field-label={label}
              data-builder-error-message={c.errorMessage}
              aria-describedby={field.error ? `field-${node.id}-error` : undefined}
              style={{ accentColor }}
              onChange={(event) => field.onValueChange(event.currentTarget.value)}
            />
            <span>{localizedFormSelectOptionLabel(option.label, copy.fieldDefaults.selectOptionLabel)}</span>
          </label>
        ))}
      </div>
      {field.error ? <span id={`field-${node.id}-error`} style={errorStyle}>{field.error}</span> : null}
    </div>
  );
}

function buildOptionWrapperStyle(
  variant: ReturnType<typeof normalizeFormInputVariantKey>,
  variantStyle: ReturnType<typeof resolveFormInputVariantStyle>,
): CSSProperties {
  if (variant === 'filled') {
    return {
      background: variantStyle.background,
      border: variantStyle.border,
      borderColor: variantStyle.borderColor,
      borderRadius: variantStyle.borderRadius,
      padding: '8px 10px',
      transition: variantStyle.transition,
    };
  }
  if (variant === 'underline') {
    return {
      background: 'transparent',
      borderBottom: variantStyle.borderBottom,
      borderColor: variantStyle.borderColor,
      borderRadius: 0,
      padding: '6px 0',
      transition: variantStyle.transition,
    };
  }
  return {};
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

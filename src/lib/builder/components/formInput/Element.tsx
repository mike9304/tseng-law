'use client';

import { useState } from 'react';
import type { BuilderFormInputCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderTheme } from '@/lib/builder/site/types';
import { resolveThemeColor } from '@/lib/builder/site/theme';
import { resolveFormInputVariantStyle } from '@/lib/builder/site/component-variants';
import { useFormFieldRuntime } from '@/lib/builder/forms/render-helpers';
import styles from './FormInput.module.css';

export default function FormInputElement({
  node,
  theme,
  mode = 'edit',
}: {
  node: BuilderFormInputCanvasNode;
  theme?: BuilderTheme;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const [focused, setFocused] = useState(false);
  const field = useFormFieldRuntime({ nodeId: node.id, name: c.name, showIf: c.showIf });
  const textColor = resolveThemeColor({ kind: 'token', token: 'text' }, theme) ?? '#0f172a';
  const labelColor = resolveThemeColor({ kind: 'token', token: 'text' }, theme) ?? '#374151';
  const inputVariantStyle = resolveFormInputVariantStyle(c.variant, theme, {
    error: Boolean(field.error),
    focused,
  });

  return (
    <div
      ref={field.rootRef}
      className={`${styles.field} ${mode !== 'published' && c.showIf ? styles.conditional : ''}`}
    >
      {c.label ? (
        <label
          className={styles.label}
          style={{ color: labelColor }}
          htmlFor={`field-${node.id}`}
        >
          {c.label}
          {c.required ? <span className={styles.required}>*</span> : null}
        </label>
      ) : null}
      <input
        id={`field-${node.id}`}
        type={c.type}
        name={c.name}
        placeholder={c.placeholder}
        defaultValue={c.defaultValue}
        required={c.required && field.visible}
        minLength={c.minLength}
        maxLength={c.maxLength}
        min={c.type === 'number' ? c.numericMin : undefined}
        max={c.type === 'number' ? c.numericMax : undefined}
        step={c.type === 'number' ? c.numericStep ?? (c.allowDecimals ? 'any' : 1) : undefined}
        inputMode={c.type === 'number' ? (c.allowDecimals ? 'decimal' : 'numeric') : undefined}
        pattern={c.pattern}
        data-builder-field-label={c.label}
        data-builder-error-message={c.errorMessage}
        aria-invalid={field.error ? true : undefined}
        aria-describedby={field.error ? `field-${node.id}-error` : undefined}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(event) => field.onValueChange(event.target.value)}
        className={styles.input}
        style={{
          color: textColor,
          ...inputVariantStyle,
        }}
      />
      {field.error ? (
        <span id={`field-${node.id}-error`} className={styles.error} role="alert">
          {field.error}
        </span>
      ) : null}
    </div>
  );
}

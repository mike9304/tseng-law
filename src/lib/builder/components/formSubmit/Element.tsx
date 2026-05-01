'use client';

import type { BuilderFormSubmitCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderTheme } from '@/lib/builder/site/types';
import { resolveThemeColor } from '@/lib/builder/site/theme';
import { useBuilderFormRuntime } from '@/lib/builder/forms/runtime-context';

interface ResolvedStyle {
  background: string;
  color: string;
  border: string;
}

function getStyleProps(
  variant: BuilderFormSubmitCanvasNode['content']['style'],
  theme?: BuilderTheme,
): ResolvedStyle {
  const primary = resolveThemeColor({ kind: 'token', token: 'primary' }, theme) ?? '#0b3b2e';
  const secondary = resolveThemeColor({ kind: 'token', token: 'secondary' }, theme) ?? '#1e5a96';
  const text = resolveThemeColor({ kind: 'token', token: 'text' }, theme) ?? '#0f172a';

  switch (variant) {
    case 'primary':
      return { background: primary, color: '#ffffff', border: `1px solid ${primary}` };
    case 'secondary':
      return { background: secondary, color: '#ffffff', border: `1px solid ${secondary}` };
    case 'outline':
      return { background: 'transparent', color: primary, border: `1px solid ${primary}` };
    case 'ghost':
    default:
      return { background: 'transparent', color: text, border: '1px solid transparent' };
  }
}

export default function FormSubmitElement({
  node,
  theme,
  mode = 'edit',
}: {
  node: BuilderFormSubmitCanvasNode;
  theme?: BuilderTheme;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const styleProps = getStyleProps(c.style, theme);
  const runtime = useBuilderFormRuntime();
  const hiddenByStep = runtime?.mode === 'published' && !runtime.isLastStep;

  return (
    <button
      type="submit"
      disabled={mode === 'edit' || hiddenByStep}
      style={{
        width: c.fullWidth ? '100%' : 'auto',
        height: '100%',
        padding: '10px 24px',
        fontSize: 15,
        fontWeight: 600,
        color: styleProps.color,
        background: styleProps.background,
        border: styleProps.border,
        borderRadius: 8,
        cursor: mode === 'edit' ? 'default' : 'pointer',
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
        display: hiddenByStep ? 'none' : undefined,
      }}
      data-builder-form-submit="true"
      data-loading-label={c.loadingLabel}
    >
      {c.label}
    </button>
  );
}

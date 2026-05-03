import type { BuilderButtonCanvasNode } from '@/lib/builder/canvas/types';
import { linkValueFromLegacy, sanitizeLinkValue } from '@/lib/builder/links';
import type { BuilderTheme } from '@/lib/builder/site/types';
import {
  getButtonVariantSuffix,
  resolveButtonVariantStyles,
} from '@/lib/builder/site/component-variants';

export default function ButtonElement({
  node,
  theme,
  mode = 'edit',
}: {
  node: BuilderButtonCanvasNode;
  theme?: BuilderTheme;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const s = node.style;
  const { className, as, label } = node.content;
  const link = sanitizeLinkValue(linkValueFromLegacy(node.content));
  const href = link?.href ?? '';
  const lightboxSlug = href.startsWith('lightbox:') ? href.slice('lightbox:'.length).trim() : '';
  const interactive = mode === 'published';

  if (className) {
    const Tag = (as ?? (href ? 'a' : 'button')) as keyof JSX.IntrinsicElements;
    const props: Record<string, unknown> = {
      className,
      style: { display: 'inline-flex', alignItems: 'center', margin: 0 },
    };
    if (Tag === 'a') {
      props.href = interactive ? (lightboxSlug ? '#' : href || undefined) : undefined;
      if (interactive && lightboxSlug) props['data-lightbox-target'] = lightboxSlug;
      if (link?.target && !lightboxSlug) props.target = link.target;
      if (link?.rel && !lightboxSlug) props.rel = link.rel;
      if (link?.title) props.title = link.title;
      if (link?.ariaLabel) props['aria-label'] = link.ariaLabel;
    } else if (Tag === 'button') {
      props.type = 'button';
    }
    if (!interactive) {
      (props.style as React.CSSProperties).pointerEvents = 'none';
    }
    return (
      <Tag {...(props as Record<string, never>)}>
        {label}
      </Tag>
    );
  }

  const variantStyles = resolveButtonVariantStyles(node.content.style, s, theme);
  const suffix = getButtonVariantSuffix(node.content.style);
  const Tag = (as ?? (href ? 'a' : 'button')) as keyof JSX.IntrinsicElements;
  const elementProps: Record<string, unknown> = {
    className: 'builder-button-element builder-widget-focusable',
    style: {
      width: '100%',
      height: '100%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: variantStyles.gap,
      paddingInline: variantStyles.paddingInline,
      boxSizing: 'border-box',
      borderRadius: s.borderRadius,
      ...variantStyles.backgroundStyle,
      color: variantStyles.color,
      border: variantStyles.border,
      borderColor: variantStyles.borderColor,
      boxShadow: variantStyles.boxShadow,
      textDecoration: variantStyles.textDecoration,
      fontWeight: variantStyles.fontWeight,
      fontSize: variantStyles.fontSize,
      letterSpacing: variantStyles.letterSpacing,
      lineHeight: variantStyles.lineHeight,
      opacity: s.opacity < 100 ? s.opacity / 100 : undefined,
      pointerEvents: interactive ? undefined : 'none',
      userSelect: 'none',
      cursor: interactive ? 'pointer' : 'default',
      transition: 'background 160ms ease, border-color 160ms ease, color 160ms ease, transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease',
      ...variantStyles.cssVars,
    },
  };

  if (Tag === 'a') {
    elementProps.href = interactive ? (lightboxSlug ? '#' : href || undefined) : undefined;
    if (interactive && lightboxSlug) elementProps['data-lightbox-target'] = lightboxSlug;
    if (link?.target && !lightboxSlug) elementProps.target = link.target;
    if (link?.rel && !lightboxSlug) elementProps.rel = link.rel;
    if (link?.title) elementProps.title = link.title;
    if (link?.ariaLabel) elementProps['aria-label'] = link.ariaLabel;
  } else if (Tag === 'button') {
    elementProps.type = 'button';
  }

  return (
    <Tag {...(elementProps as Record<string, never>)}>
      <span>{node.content.label}</span>
      {suffix ? <span aria-hidden>{suffix}</span> : null}
    </Tag>
  );
}

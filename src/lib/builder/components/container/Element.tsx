import type { ReactNode } from 'react';
import type { BuilderContainerCanvasNode } from '@/lib/builder/canvas/types';
import { sanitizeLinkValue } from '@/lib/builder/links';
import type { BuilderTheme } from '@/lib/builder/site/types';
import {
  legacyCardStyleToVariant,
  resolveCardVariantStyle,
} from '@/lib/builder/site/component-variants';
import {
  flexToCSS,
  gridToCSS,
  DEFAULT_FLEX,
  DEFAULT_GRID,
} from '@/lib/builder/canvas/layout-modes';

function isDarkSolidColor(value: string): boolean {
  const hex = value.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)?.[1];
  if (!hex) return false;
  const expanded = hex.length === 3
    ? hex.split('').map((char) => `${char}${char}`).join('')
    : hex;
  const channel = (index: number) => Number.parseInt(expanded.slice(index, index + 2), 16) / 255;
  const linearize = (channelValue: number) => (
    channelValue <= 0.03928
      ? channelValue / 12.92
      : ((channelValue + 0.055) / 1.055) ** 2.4
  );
  const luminance = 0.2126 * linearize(channel(0))
    + 0.7152 * linearize(channel(2))
    + 0.0722 * linearize(channel(4));
  return luminance < 0.22;
}

export default function ContainerElement({
  node,
  theme,
  mode = 'edit',
  children,
}: {
  node: BuilderContainerCanvasNode;
  theme?: BuilderTheme;
  mode?: 'edit' | 'preview' | 'published';
  children?: ReactNode;
}) {
  const content = node.content;
  const layoutMode = content.layoutMode ?? 'absolute';
  const { className, as, htmlId, dataTone } = content;
  const Tag = (as ?? 'div') as keyof JSX.IntrinsicElements;
  const link = sanitizeLinkValue(content.link);
  const interactive = mode === 'published';
  const hasChildren = Boolean(children);
  const lightboxSlug = link?.href.startsWith('lightbox:')
    ? link.href.slice('lightbox:'.length).trim()
    : '';
  const usesCardVariant = Boolean(content.variant || content.cardStyle);
  const variantStyle = resolveCardVariantStyle(
    content.variant ?? legacyCardStyleToVariant(content.cardStyle),
    theme,
  );
  const resolvedBackground = usesCardVariant ? variantStyle.background : content.background;
  const resolvedBorder = usesCardVariant
    ? variantStyle.border
    : content.borderWidth > 0
      ? `${content.borderWidth}px ${content.borderStyle} ${content.borderColor}`
      : 'none';
  const resolvedBorderRadius = usesCardVariant ? variantStyle.borderRadius : content.borderRadius;
  const darkSurfaceVars = isDarkSolidColor(content.background)
    ? {
        '--builder-button-outline-color': '#f8fafc',
        '--builder-button-outline-border-color': 'rgba(248, 250, 252, 0.86)',
      } as React.CSSProperties
    : {};

  let layoutCSS: Record<string, string> = {};
  if (layoutMode === 'flex') {
    layoutCSS = flexToCSS(content.flexConfig ?? DEFAULT_FLEX);
  } else if (layoutMode === 'grid') {
    layoutCSS = gridToCSS(content.gridConfig ?? DEFAULT_GRID);
  }

  function wrapLinked(element: JSX.Element): JSX.Element {
    if (!link || !interactive) return element;
    return (
      <a
        href={lightboxSlug ? '#' : link.href}
        target={lightboxSlug ? undefined : link.target}
        rel={lightboxSlug ? undefined : link.rel}
        title={link.title}
        aria-label={link.ariaLabel}
        data-lightbox-target={lightboxSlug || undefined}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        {element}
      </a>
    );
  }

  if (className) {
    const props: Record<string, unknown> = {
      className,
      ...(htmlId ? { id: htmlId } : {}),
      ...(dataTone ? { 'data-tone': dataTone } : {}),
      style: {
        width: '100%',
        height: '100%',
        boxSizing: 'border-box' as const,
        position: 'relative' as const,
        pointerEvents: mode === 'edit' && hasChildren ? 'none' as const : undefined,
        ...(layoutMode !== 'absolute' ? layoutCSS : {}),
        ...darkSurfaceVars,
      },
    };
    if (Tag === 'form') {
      props.action = content.action;
      props.method = content.method ?? 'get';
      if (mode === 'edit') {
        props.onSubmit = (event: { preventDefault: () => void }) => {
          event.preventDefault();
        };
      }
    }
    return wrapLinked(<Tag {...(props as Record<string, never>)}>{children}</Tag>);
  }

  const childArray = Array.isArray(children) ? children : children ? [children] : [];
  const isEmpty = childArray.length === 0;

  return wrapLinked(
    <Tag
      {...(htmlId ? { id: htmlId } : {})}
      {...(dataTone ? { 'data-tone': dataTone } : {})}
      style={{
        width: '100%',
        height: '100%',
        padding: `${content.padding}px`,
        borderRadius: `${resolvedBorderRadius}px`,
        border: resolvedBorder,
        background: resolvedBackground,
        boxShadow: usesCardVariant ? variantStyle.boxShadow : undefined,
        backdropFilter: usesCardVariant ? variantStyle.backdropFilter : undefined,
        WebkitBackdropFilter: usesCardVariant ? variantStyle.WebkitBackdropFilter : undefined,
        boxSizing: 'border-box',
        position: 'relative',
        pointerEvents: mode === 'edit' && hasChildren ? 'none' : undefined,
        ...layoutCSS,
        ...darkSurfaceVars,
      }}
    >
      {children}
      {isEmpty && mode === 'edit' ? (
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            color: '#94a3b8',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            pointerEvents: 'none',
          }}
        >
          {content.label}
        </div>
      ) : null}
    </Tag>
  );
}

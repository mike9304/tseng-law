import { Children, type ReactNode } from 'react';
import Image from 'next/image';
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
  type ContainerLayoutMode,
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
  const hasChildren = Children.count(children) > 0;
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

  const layoutItems = content.layoutItems ?? [];
  const activeIndex = Math.max(0, Math.min(content.activeIndex ?? 0, Math.max(0, layoutItems.length - 1)));

  let layoutCSS: Record<string, string> = {};
  if (layoutMode === 'flex' || layoutMode === 'strip' || layoutMode === 'columns' || layoutMode === 'repeater') {
    layoutCSS = flexToCSS(content.flexConfig ?? DEFAULT_FLEX);
  } else if (layoutMode === 'grid') {
    layoutCSS = gridToCSS(content.gridConfig ?? DEFAULT_GRID);
  }

  function renderLayoutPreview(modeValue: ContainerLayoutMode): ReactNode {
    if (hasChildren || layoutItems.length === 0) return children;
    if (modeValue === 'tabs') {
      const active = layoutItems[activeIndex] ?? layoutItems[0];
      return (
        <div className="builder-layout-tabs" data-builder-layout-widget="tabs">
          <div className="builder-layout-tabs-list">
            {layoutItems.map((item, index) => (
              <span key={`${item.title}-${index}`} data-active={index === activeIndex}>{item.title}</span>
            ))}
          </div>
          <div className="builder-layout-panel">
            <strong>{active?.title}</strong>
            <p>{active?.description}</p>
          </div>
        </div>
      );
    }
    if (modeValue === 'accordion') {
      return (
        <div className="builder-layout-accordion" data-builder-layout-widget="accordion">
          {layoutItems.map((item, index) => (
            <div key={`${item.title}-${index}`} data-open={index === activeIndex}>
              <strong>{item.title}</strong>
              {index === activeIndex ? <p>{item.description}</p> : null}
            </div>
          ))}
        </div>
      );
    }
    if (modeValue === 'slideshow') {
      const active = layoutItems[activeIndex] ?? layoutItems[0];
      return (
        <div className="builder-layout-slideshow" data-builder-layout-widget="slideshow">
          {active?.image ? (
            <span className="builder-layout-slideshow-image">
              <Image src={active.image} alt="" fill sizes="(max-width: 1280px) 100vw, 640px" style={{ objectFit: 'cover' }} />
            </span>
          ) : null}
          <div>
            <strong>{active?.title}</strong>
            <p>{active?.description}</p>
          </div>
          <span>{activeIndex + 1} / {layoutItems.length}</span>
        </div>
      );
    }
    if (modeValue === 'hoverBox') {
      const active = layoutItems[activeIndex] ?? layoutItems[0];
      return (
        <div className="builder-layout-hoverbox" data-builder-layout-widget="hoverBox">
          <strong>{active?.title ?? content.label}</strong>
          <p>{active?.description ?? 'Hover content'}</p>
        </div>
      );
    }
    if (modeValue === 'repeater') {
      return (
        <div className="builder-layout-repeater" data-builder-layout-widget="repeater">
          {layoutItems.map((item, index) => (
            <article key={`${item.title}-${index}`}>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      );
    }
    return children;
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
  const layoutPreview = renderLayoutPreview(layoutMode);
  const layoutClassName = `builder-layout-${layoutMode}`;

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
        position: content.sticky && mode === 'published' ? 'sticky' : 'relative',
        top: content.sticky && mode === 'published' ? 0 : undefined,
        zIndex: content.sticky && mode === 'published' ? 20 : undefined,
        pointerEvents: mode === 'edit' && hasChildren ? 'none' : undefined,
        ...layoutCSS,
        ...darkSurfaceVars,
      }}
      className={layoutClassName}
      data-builder-layout-mode={layoutMode}
      data-builder-layout-sticky={content.sticky ? 'true' : undefined}
      data-builder-anchor-target={content.anchorTarget || undefined}
    >
      {layoutPreview}
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

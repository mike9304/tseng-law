import type { CSSProperties, ReactNode } from 'react';
import type { BuilderTextCanvasNode } from '@/lib/builder/canvas/types';
import { fontFamilyCSS } from '@/lib/builder/canvas/fonts';
import { RichTextRenderer } from '@/lib/builder/rich-text/render';
import type { BuilderTheme } from '@/lib/builder/site/types';
import { resolveThemeColor, resolveThemeTextTypography } from '@/lib/builder/site/theme';
import { sanitizeLinkValue } from '@/lib/builder/links';

function verticalAlignToFlexAlign(va?: string): string {
  if (va === 'center') return 'center';
  if (va === 'bottom') return 'flex-end';
  return 'flex-start';
}

function buildTextShadow(ts?: { x: number; y: number; blur: number; color: string }): string | undefined {
  if (!ts) return undefined;
  return `${ts.x}px ${ts.y}px ${ts.blur}px ${ts.color}`;
}

function richTextModeForTag(tag: keyof JSX.IntrinsicElements): 'block' | 'heading' {
  const tagName = String(tag).toLowerCase();
  return tagName === 'p' || tagName === 'span' || /^h[1-6]$/.test(tagName)
    ? 'heading'
    : 'block';
}

function pathIdForNode(nodeId: string): string {
  return `builder-text-path-${nodeId.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
}

function textPathD(curve?: string, baseline = 62): string {
  if (curve === 'wave') {
    return `M 40 ${baseline} C 220 ${baseline - 54}, 330 ${baseline + 54}, 500 ${baseline} S 780 ${baseline - 54}, 960 ${baseline}`;
  }
  return `M 54 ${baseline + 28} C 250 ${baseline - 54}, 750 ${baseline - 54}, 946 ${baseline + 28}`;
}

function renderTextContent(node: BuilderTextCanvasNode, richTextMode: 'block' | 'heading'): ReactNode {
  if (!node.content.richText) return node.content.text;
  return (
    <RichTextRenderer
      richText={node.content.richText}
      fallbackText={node.content.text}
      mode={richTextMode}
    />
  );
}

function wrapWithLink(
  node: BuilderTextCanvasNode,
  mode: 'edit' | 'preview' | 'published',
  children: ReactNode,
): ReactNode {
  const link = sanitizeLinkValue(node.content.link);
  if (!link) return children;

  return (
    <a
      href={link.href}
      target={link.target}
      rel={link.rel}
      title={link.title}
      aria-label={link.ariaLabel}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        color: 'inherit',
        textDecoration: 'none',
        pointerEvents: mode === 'edit' ? 'none' : undefined,
      }}
    >
      {children}
    </a>
  );
}

function TextPath({
  node,
  theme,
}: {
  node: BuilderTextCanvasNode;
  theme?: BuilderTheme;
}) {
  const typography = resolveThemeTextTypography(node.content, theme);
  const fontFamily = typography.fontFamily
    ? fontFamilyCSS(typography.fontFamily)
    : 'system-ui, -apple-system, sans-serif';
  const textPath = node.content.textPath;
  const pathId = pathIdForNode(node.id);

  return (
    <svg
      viewBox="0 0 1000 180"
      role="img"
      aria-label={node.content.text}
      preserveAspectRatio="none"
      style={{ width: '100%', height: '100%', overflow: 'visible', display: 'block' }}
    >
      <defs>
        <path id={pathId} d={textPathD(textPath?.curve, textPath?.baseline ?? 62)} />
      </defs>
      <text
        fill={resolveThemeColor(typography.color, theme)}
        fontFamily={fontFamily}
        fontSize={Math.max(18, typography.fontSize * 2.25)}
        fontWeight={typography.fontWeight === 'bold' ? 700 : typography.fontWeight === 'medium' ? 600 : 400}
        letterSpacing={typography.letterSpacing * 2}
        textAnchor={node.content.align === 'center' ? 'middle' : node.content.align === 'right' ? 'end' : 'start'}
        style={{ textTransform: (node.content.textTransform as CSSProperties['textTransform']) || undefined }}
      >
        <textPath
          href={`#${pathId}`}
          startOffset={node.content.align === 'center' ? '50%' : node.content.align === 'right' ? '100%' : '0%'}
        >
          {node.content.text}
        </textPath>
      </text>
    </svg>
  );
}

export default function TextElement({
  node,
  theme,
  mode = 'edit',
}: {
  node: BuilderTextCanvasNode;
  theme?: BuilderTheme;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const { className, as } = node.content;
  const Tag = (as ?? 'div') as keyof JSX.IntrinsicElements;
  const richTextMode = richTextModeForTag(Tag);

  if (as === 'input') {
    const placeholder = node.content.placeholder ?? node.content.text;
    return (
      <input
        className={className}
        type={node.content.inputType ?? 'text'}
        name={node.content.name}
        placeholder={placeholder}
        aria-label={node.content.ariaLabel ?? placeholder}
        readOnly={mode === 'edit'}
        defaultValue=""
        style={{
          width: '100%',
          height: '100%',
          margin: 0,
          boxSizing: 'border-box',
          pointerEvents: mode === 'edit' ? 'none' : undefined,
        }}
      />
    );
  }

  if (className) {
    return wrapWithLink(node, mode, (
      <Tag
        className={className}
        style={{
          margin: 0,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {renderTextContent(node, richTextMode)}
      </Tag>
    ));
  }

  const typography = resolveThemeTextTypography(node.content, theme);
  const fontFamily = typography.fontFamily
    ? fontFamilyCSS(typography.fontFamily)
    : 'system-ui, -apple-system, sans-serif';
  const ContentTag = richTextMode === 'block' ? 'div' : 'span';
  const columns = Math.max(1, Math.min(4, node.content.columns ?? 1));
  const contentStyle: CSSProperties = {
    width: '100%',
    minWidth: 0,
  };

  if (columns > 1 && !node.content.textPath?.enabled && !node.content.marquee?.enabled) {
    contentStyle.display = 'block';
    contentStyle.columnCount = columns;
    contentStyle.columnGap = `${node.content.columnGap ?? 24}px`;
  }

  if (node.content.quoteStyle === 'classic') {
    contentStyle.display = 'block';
    contentStyle.borderLeft = `4px solid ${resolveThemeColor({ kind: 'token', token: 'primary' }, theme)}`;
    contentStyle.paddingLeft = 16;
  } else if (node.content.quoteStyle === 'pull') {
    contentStyle.display = 'block';
    contentStyle.fontStyle = 'italic';
    contentStyle.borderTop = `1px solid ${resolveThemeColor({ kind: 'token', token: 'secondary' }, theme)}`;
    contentStyle.borderBottom = `1px solid ${resolveThemeColor({ kind: 'token', token: 'secondary' }, theme)}`;
    contentStyle.padding = '10px 0';
  }

  const child = node.content.textPath?.enabled ? (
    <TextPath node={node} theme={theme} />
  ) : node.content.marquee?.enabled ? (
    <span
      className="builder-text-marquee"
      style={{
        ['--builder-marquee-duration' as string]: `${node.content.marquee.speed ?? 22}s`,
        animationDirection: node.content.marquee.direction === 'right' ? 'reverse' : 'normal',
      }}
    >
      {node.content.text}
    </span>
  ) : (
    <ContentTag style={contentStyle}>{renderTextContent(node, richTextMode)}</ContentTag>
  );

  return wrapWithLink(node, mode, (
    <Tag
      style={{
        width: '100%',
        height: '100%',
        color: resolveThemeColor(typography.color, theme),
        fontSize: `${typography.fontSize}px`,
        fontFamily,
        fontWeight:
          typography.fontWeight === 'bold'
            ? 700
            : typography.fontWeight === 'medium'
              ? 600
              : 400,
        textAlign: node.content.align,
        lineHeight: typography.lineHeight,
        letterSpacing: `${typography.letterSpacing}px`,
        display: 'flex',
        alignItems: verticalAlignToFlexAlign(node.content.verticalAlign),
        // Allow text to extend past the node rect so designers immediately
        // see when a box is too short for the content. Marquee still hides
        // overflow because it animates through it.
        overflow: node.content.marquee?.enabled ? 'hidden' : 'visible',
        wordBreak: 'break-word',
        whiteSpace: node.content.marquee?.enabled ? 'nowrap' : 'pre-wrap',
        textShadow: buildTextShadow(node.content.textShadow),
        backgroundColor: node.content.backgroundColor ? resolveThemeColor(node.content.backgroundColor, theme) : undefined,
        textTransform: (node.content.textTransform as CSSProperties['textTransform']) || undefined,
        margin: 0,
      }}
    >
      {child}
    </Tag>
  ));
}

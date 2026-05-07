import type { BuilderTextCanvasNode } from '@/lib/builder/canvas/types';
import { fontFamilyCSS } from '@/lib/builder/canvas/fonts';
import { RichTextRenderer } from '@/lib/builder/rich-text/render';
import type { BuilderTheme } from '@/lib/builder/site/types';
import { resolveThemeColor, resolveThemeTextTypography } from '@/lib/builder/site/theme';

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
    return (
      <input
        className={className}
        type={node.content.inputType ?? 'text'}
        name={node.content.name}
        placeholder={node.content.text}
        aria-label={node.content.ariaLabel ?? node.content.text}
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
    return (
      <Tag
        className={className}
        style={{
          margin: 0,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {node.content.richText ? (
          <RichTextRenderer
            richText={node.content.richText}
            fallbackText={node.content.text}
            mode={richTextMode}
          />
        ) : (
          node.content.text
        )}
      </Tag>
    );
  }

  const typography = resolveThemeTextTypography(node.content, theme);
  const fontFamily = typography.fontFamily
    ? fontFamilyCSS(typography.fontFamily)
    : 'system-ui, -apple-system, sans-serif';

  return (
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
        overflow: 'hidden',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
        textShadow: buildTextShadow(node.content.textShadow),
        backgroundColor: node.content.backgroundColor ? resolveThemeColor(node.content.backgroundColor, theme) : undefined,
        textTransform: (node.content.textTransform as React.CSSProperties['textTransform']) || undefined,
        margin: 0,
      }}
    >
      {node.content.richText ? (
        <RichTextRenderer
          richText={node.content.richText}
          fallbackText={node.content.text}
          mode={richTextMode}
        />
      ) : (
        node.content.text
      )}
    </Tag>
  );
}

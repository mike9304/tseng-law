import type { BuilderHeadingCanvasNode } from '@/lib/builder/canvas/types';
import { fontFamilyCSS } from '@/lib/builder/canvas/fonts';
import { RichTextRenderer } from '@/lib/builder/rich-text/render';
import { richTextFromPlainText } from '@/lib/builder/rich-text/sanitize';
import type { BuilderTheme } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';
import { resolveThemeColor, resolveThemeTextTypography } from '@/lib/builder/site/theme';
import { headingFontSizeFromTheme } from '@/lib/builder/site/typography-scale';
import { HEADING_LEGACY_DEFAULT_TEXT, localizedHeadingText } from './heading-copy';

const LEVEL_TO_SIZE = {
  1: 48,
  2: 40,
  3: 32,
  4: 28,
  5: 24,
  6: 20,
} as const;

export default function HeadingElement({
  node,
  theme,
  locale = 'ko',
}: {
  node: BuilderHeadingCanvasNode;
  theme?: BuilderTheme;
  locale?: Locale;
}) {
  const level = Math.max(1, Math.min(6, node.content.level)) as keyof typeof LEVEL_TO_SIZE;
  const Tag = `h${level}` as const;
  // Phase 23 — When theme.typographyScale is set, derive default heading
  // size from the modular scale ratio. Per-node fontSize override still wins.
  const scaledDefaultSize = theme?.typographyScale
    ? headingFontSizeFromTheme(theme, level)
    : LEVEL_TO_SIZE[level];
  const typography = resolveThemeTextTypography(
    {
      themePreset: node.content.themePreset,
      fontFamily: node.content.fontFamily,
      fontSize: node.content.fontSize ?? scaledDefaultSize,
      fontWeight: node.content.fontWeight ?? 'bold',
      fontWeightNumeric: node.content.fontWeightNumeric,
      fontStyle: node.content.fontStyle,
      textDecoration: node.content.textDecoration,
      lineHeight: node.content.lineHeight ?? 1.05,
      letterSpacing: node.content.letterSpacing ?? 0,
      color: node.content.color,
    },
    theme,
  );
  const fontFamily = typography.fontFamily
    ? fontFamilyCSS(typography.fontFamily)
    : 'system-ui, -apple-system, sans-serif';
  const text = localizedHeadingText(node.content.text, locale);
  const richText = node.content.text === HEADING_LEGACY_DEFAULT_TEXT
    ? richTextFromPlainText(text)
    : node.content.richText;

  return (
    <Tag
      style={{
        width: '100%',
        height: '100%',
        margin: 0,
        color: resolveThemeColor(typography.color, theme),
        fontSize: `${typography.fontSize}px`,
        fontFamily,
        fontWeight: typography.fontWeightNumeric
          ?? (typography.fontWeight === 'bold'
            ? 800
            : typography.fontWeight === 'medium'
              ? 600
              : 400),
        fontStyle: typography.fontStyle || undefined,
        textDecoration: typography.textDecoration || undefined,
        textAlign: node.content.align,
        lineHeight: typography.lineHeight,
        letterSpacing: `${typography.letterSpacing}px`,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {richText ? (
        <RichTextRenderer
          richText={richText}
          fallbackText={text}
          mode="heading"
        />
      ) : (
        text
      )}
    </Tag>
  );
}

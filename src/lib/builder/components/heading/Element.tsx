import type { BuilderHeadingCanvasNode } from '@/lib/builder/canvas/types';
import { fontFamilyCSS } from '@/lib/builder/canvas/fonts';
import type { BuilderTheme } from '@/lib/builder/site/types';
import { resolveThemeColor, resolveThemeTextTypography } from '@/lib/builder/site/theme';

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
}: {
  node: BuilderHeadingCanvasNode;
  theme?: BuilderTheme;
}) {
  const level = Math.max(1, Math.min(6, node.content.level)) as keyof typeof LEVEL_TO_SIZE;
  const Tag = `h${level}` as const;
  const typography = resolveThemeTextTypography(
    {
      themePreset: node.content.themePreset,
      fontFamily: node.content.fontFamily,
      fontSize: node.content.fontSize ?? LEVEL_TO_SIZE[level],
      fontWeight: node.content.fontWeight ?? 'bold',
      lineHeight: node.content.lineHeight ?? 1.05,
      letterSpacing: node.content.letterSpacing ?? 0,
      color: node.content.color,
    },
    theme,
  );
  const fontFamily = typography.fontFamily
    ? fontFamilyCSS(typography.fontFamily)
    : 'system-ui, -apple-system, sans-serif';

  return (
    <Tag
      style={{
        width: '100%',
        height: '100%',
        margin: 0,
        color: resolveThemeColor(typography.color, theme),
        fontSize: `${typography.fontSize}px`,
        fontFamily,
        fontWeight:
          typography.fontWeight === 'bold'
            ? 800
            : typography.fontWeight === 'medium'
              ? 600
              : 400,
        textAlign: node.content.align,
        lineHeight: typography.lineHeight,
        letterSpacing: `${typography.letterSpacing}px`,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {node.content.text}
    </Tag>
  );
}

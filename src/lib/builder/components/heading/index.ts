import { defineComponent } from '../define';
import { richTextFromPlainText } from '@/lib/builder/rich-text/sanitize';
import HeadingElement from './Element';
import HeadingInspector from './Inspector';
import { HEADING_LEGACY_DEFAULT_TEXT } from './heading-copy';

const defaultHeadingText = HEADING_LEGACY_DEFAULT_TEXT;

export default defineComponent({
  kind: 'heading',
  displayName: '헤딩',
  category: 'basic',
  icon: 'H',
  defaultContent: {
    text: defaultHeadingText,
    richText: richTextFromPlainText(defaultHeadingText),
    level: 2,
    color: '#0f172a',
    align: 'left' as const,
    fontFamily: 'system-ui',
    fontSize: undefined,
    fontWeight: undefined,
    lineHeight: undefined,
    letterSpacing: undefined,
    themePreset: undefined,
  },
  defaultStyle: {},
  defaultRect: { width: 340, height: 76 },
  Render: HeadingElement,
  Inspector: HeadingInspector,
});

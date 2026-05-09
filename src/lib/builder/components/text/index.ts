import { defineComponent } from '../define';
import TextElement from '@/components/builder/canvas/elements/TextElement';
import { richTextFromPlainText } from '@/lib/builder/rich-text/sanitize';
import TextInspector from './Inspector';

const defaultText = '텍스트를 입력하세요';

export default defineComponent({
  kind: 'text',
  displayName: '텍스트',
  category: 'basic',
  icon: 'T',
  defaultContent: {
    text: defaultText,
    richText: richTextFromPlainText(defaultText),
    fontSize: 16,
    color: '#1f2937',
    fontWeight: 'regular' as const,
    align: 'left' as const,
    lineHeight: 1.25,
    letterSpacing: 0,
    fontFamily: 'system-ui',
    themePreset: undefined,
    verticalAlign: 'top' as const,
    textShadow: undefined,
    backgroundColor: undefined,
    textTransform: 'none' as const,
    columns: 1,
    columnGap: 24,
    quoteStyle: 'none' as const,
    marquee: undefined,
    textPath: undefined,
    link: undefined,
  },
  defaultStyle: {},
  defaultRect: { width: 200, height: 40 },
  Render: TextElement,
  Inspector: TextInspector,
});

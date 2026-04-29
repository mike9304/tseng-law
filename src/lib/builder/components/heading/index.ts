import { defineComponent } from '../define';
import HeadingElement from './Element';
import HeadingInspector from './Inspector';

export default defineComponent({
  kind: 'heading',
  displayName: '헤딩',
  category: 'basic',
  icon: 'H',
  defaultContent: {
    text: '헤딩을 입력하세요',
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

import { defineComponent } from '../define';
import CodeBlockInspector from './Inspector';

import CodeBlockRender from './Render';

export default defineComponent({
  kind: 'codeBlock',
  displayName: '코드 블록',
  category: 'advanced',
  icon: '</>',
  defaultContent: {
    title: 'Code Block',
    language: 'js' as const,
    code: [
      'ctx.log("Canvas code slot", ctx.now());',
      'return { message: "Hello from the canvas" };',
    ].join('\n'),
    runMode: 'inline' as const,
    functionSlug: '',
    showLineNumbers: true,
  },
  defaultStyle: {},
  defaultRect: { width: 520, height: 280 },
  Render: CodeBlockRender,
  Inspector: CodeBlockInspector,
});

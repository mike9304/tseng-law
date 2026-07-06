import { describe, expect, it } from 'vitest';
import '@/lib/builder/components/registry';
import { createCanvasNodeTemplate } from '@/lib/builder/canvas/store';
import { builderCanvasNodeSchema } from '@/lib/builder/canvas/types';
import { listComponents } from '@/lib/builder/components/registry';

describe('code block canvas node', () => {
  it('registers a codeBlock component with a usable default template', () => {
    const component = listComponents().find((entry) => entry.kind === 'codeBlock');
    expect(component).toMatchObject({
      kind: 'codeBlock',
      displayName: '코드 블록',
      category: 'advanced',
    });

    const node = createCanvasNodeTemplate('codeBlock', 24, 48, 7);
    expect(node.kind).toBe('codeBlock');
    expect(node.rect).toMatchObject({ x: 24, y: 48, width: 520, height: 280 });
    expect(node.content).toMatchObject({
      title: 'Code Block',
      language: 'js',
      code: [
        'ctx.log("Canvas code slot", ctx.now());',
        'return { message: "Hello from the canvas" };',
      ].join('\n'),
      runMode: 'inline',
      functionSlug: '',
      showLineNumbers: true,
    });
  });

  it('parses the codeBlock node schema and keeps code content', () => {
    const parsed = builderCanvasNodeSchema.parse({
      id: 'code-block-1',
      kind: 'codeBlock',
      rect: { x: 0, y: 0, width: 520, height: 280 },
      zIndex: 1,
      content: {
        title: 'API Example',
        language: 'json',
        code: '{\n  "ok": true\n}',
        runMode: 'function',
        functionSlug: 'api-example',
        showLineNumbers: false,
      },
    });

    expect(parsed.kind).toBe('codeBlock');
    expect(parsed.content).toMatchObject({
      title: 'API Example',
      language: 'json',
      code: '{\n  "ok": true\n}',
      runMode: 'function',
      functionSlug: 'api-example',
      showLineNumbers: false,
    });
  });
});

import { describe, expect, it } from 'vitest';
import {
  applyMarkdownMarks,
  serializeEditorMarkdown,
} from '@/lib/builder/columns/serialize-markdown';
import { splitUnderlineText } from '@/lib/builder/columns/remark-underline';

describe('serializeEditorMarkdown', () => {
  it('serializes underline as ++text++ and keeps existing marks', () => {
    expect(applyMarkdownMarks('u', [{ type: 'underline' }])).toBe('++u++');
    expect(applyMarkdownMarks('b', [{ type: 'bold' }, { type: 'underline' }])).toBe('++**b**++');

    const md = serializeEditorMarkdown({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Hello ', marks: [] },
            { type: 'text', text: 'under', marks: [{ type: 'underline' }] },
            { type: 'text', text: ' and ', marks: [] },
            { type: 'text', text: 'bold', marks: [{ type: 'bold' }] },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Title' }],
        },
      ],
    });

    expect(md).toContain('++under++');
    expect(md).toContain('**bold**');
    expect(md).toContain('## Title');
  });
});

describe('remark underline transformer', () => {
  it('splits ++text++ into underline nodes for public rendering', () => {
    const parts = splitUnderlineText('A ++underlined++ word');
    expect(parts).toEqual([
      { type: 'text', value: 'A ' },
      { type: 'underline', value: 'underlined' },
      { type: 'text', value: ' word' },
    ]);
  });
});

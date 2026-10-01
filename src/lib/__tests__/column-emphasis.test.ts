import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { removeColumnBoldEmphasis } from '../column-emphasis';

describe('column prose without bold emphasis', () => {
  it('removes Markdown and HTML wrappers, including literal CJK delimiters, without changing text or links', () => {
    const source = '## 기한\n\n**30일**과 **0.3%**, __신청__ 안내. **[법령](https://example.com/a__b?q=**)** <strong>예외</strong> <b>조건</b>.';
    expect(removeColumnBoldEmphasis(source)).toBe('## 기한\n\n30일과 0.3%, 신청 안내. [법령](https://example.com/a__b?q=**) 예외 조건.');
    expect(removeColumnBoldEmphasis('<p>**본문**과 <strong>조건</strong></p>')).toBe('<p>본문과 조건</p>');
  });
  it('preserves code, literal escaped symbols, URLs, list layout and other emphasis', () => {
    const source = '```txt\n**code**\n```\n\n`__inline__` \\*\\*literal\\*\\* [link](https://example.com/**path**)\n\n- *italic*\n- **bold**\n\n***both***';
    expect(removeColumnBoldEmphasis(source)).toBe('```txt\n**code**\n```\n\n`__inline__` \\*\\*literal\\*\\* [link](https://example.com/**path**)\n\n- *italic*\n- bold\n\n*both*');
    expect(removeColumnBoldEmphasis('<https://example.com/**path**>')).toBe('<https://example.com/**path**>');
    for (const literal of [
      'file__name__suffix',
      '__name__suffix',
      '<p>https://example.com/**path**</p>',
      String.raw`\**literal**`,
      '<a href="https://example.com/?q=<strong>">link</a>',
      '<pre><code><strong>literal</strong></code></pre>',
      '<code>**literal**</code>',
      '<!-- <strong>comment</strong> -->',
    ]) expect(removeColumnBoldEmphasis(literal)).toBe(literal);
  });
  it('keeps every column and issue locale free of prose bold, including metadata', () => {
    const root = path.join(process.cwd(), 'src/content');
    const files = fs.readdirSync(root, { recursive: true }).filter((file): file is string =>
      typeof file === 'string' && /^(columns[^/]*\/|issues\/).*\.md$/.test(file),
    );
    expect(files.length).toBeGreaterThan(1000);
    const violations: string[] = [];
    for (const file of files) {
      const { data, content } = matter(fs.readFileSync(path.join(root, file), 'utf8'));
      if (removeColumnBoldEmphasis(content) !== content) violations.push(`${file}: body`);
      const check = (value: unknown): void => {
        if (typeof value === 'string' && removeColumnBoldEmphasis(value) !== value) violations.push(`${file}: metadata`);
        else if (Array.isArray(value)) value.forEach(check);
        else if (value && typeof value === 'object') Object.values(value).forEach(check);
      };
      check(data);
    }
    expect(violations).toEqual([]);
  });
});

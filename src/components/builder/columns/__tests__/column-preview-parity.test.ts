import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';

/**
 * Preview must use the same markdown ColumnContent path as public pages —
 * not dangerouslySetInnerHTML of bodyHtml (Codex review correction #5).
 */
describe('column editor preview parity', () => {
  it('edit workspace uses ColumnContent markdown path', () => {
    const workspacePath = path.join(
      process.cwd(),
      'src/components/builder/columns/ColumnEditWorkspace.tsx',
    );
    const source = readFileSync(workspacePath, 'utf8');
    expect(source).toContain("import ColumnContent from '@/components/ColumnContent'");
    expect(source).toContain('<ColumnContent');
    expect(source).not.toContain('dangerouslySetInnerHTML');
    expect(
      source.includes('data-column-preview="markdown"') ||
        source.includes('data-preview-mode="markdown"'),
    ).toBe(true);
  });

  it('edit page no longer injects raw bodyHtml preview', () => {
    const pagePath = path.join(
      process.cwd(),
      'src/app/(builder)/[locale]/admin-builder/columns/[slug]/edit/page.tsx',
    );
    const source = readFileSync(pagePath, 'utf8');
    expect(source).toContain('ColumnEditWorkspace');
    expect(source).not.toContain('dangerouslySetInnerHTML');
  });

  it('public ColumnContent enables remarkUnderline without rehype-raw', () => {
    const contentPath = path.join(process.cwd(), 'src/components/ColumnContent.tsx');
    const source = readFileSync(contentPath, 'utf8');
    expect(source).toContain('remarkUnderline');
    expect(source).not.toContain('rehype-raw');
    expect(source).toContain('u:');
  });
});

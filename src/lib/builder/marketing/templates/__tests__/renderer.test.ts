import { describe, expect, it } from 'vitest';
import {
  renderTemplateToHtml,
  renderTemplateToText,
} from '@/lib/builder/marketing/templates/renderer';
import type { EmailTemplate } from '@/lib/builder/marketing/templates/types';

function makeTemplate(blocks: EmailTemplate['blocks']): EmailTemplate {
  return {
    templateId: 'tpl_test',
    name: 'Test',
    blocks,
    pageBackground: '#f1f5f9',
    contentBackground: '#ffffff',
    createdAt: '2026-05-11T00:00:00Z',
    updatedAt: '2026-05-11T00:00:00Z',
  };
}

describe('renderTemplateToHtml', () => {
  it('produces table-wrapped HTML with the 600px column', () => {
    const html = renderTemplateToHtml(makeTemplate([
      { blockId: 'h', kind: 'heading', text: '안녕', level: 1, align: 'center' },
    ]));
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('width="600"');
    expect(html).toContain('안녕');
    expect(html).toContain('text-align:center');
  });

  it('escapes HTML in user-provided text fields', () => {
    const html = renderTemplateToHtml(makeTemplate([
      { blockId: 't', kind: 'text', text: '<script>alert(1)</script>' },
    ]));
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>alert(1)</script>');
  });

  it('renders a button block as an inline anchor with safe attributes', () => {
    const html = renderTemplateToHtml(makeTemplate([
      { blockId: 'b', kind: 'button', label: 'Go', href: 'https://example.com', background: '#16a34a', textColor: '#fff' },
    ]));
    expect(html).toContain('<a href="https://example.com"');
    expect(html).toContain('background:#16a34a');
  });

  it('renders divider and spacer blocks', () => {
    const html = renderTemplateToHtml(makeTemplate([
      { blockId: 'd', kind: 'divider', color: '#000000' },
      { blockId: 's', kind: 'spacer', height: 32 },
    ]));
    expect(html).toContain('border-top:1px solid #000000');
    expect(html).toContain('height:32px');
  });
});

describe('renderTemplateToText', () => {
  it('renders headings in uppercase and includes button href', () => {
    const text = renderTemplateToText(makeTemplate([
      { blockId: 'h', kind: 'heading', text: 'hello' },
      { blockId: 'b', kind: 'button', label: 'Visit', href: 'https://tseng-law.com' },
    ]));
    expect(text).toContain('HELLO');
    expect(text).toContain('Visit: https://tseng-law.com');
  });
});

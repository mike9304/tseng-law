import { describe, expect, it } from 'vitest';
import { sanitizeColumnBodyHtml } from '@/lib/builder/columns/sanitize-body-html';

describe('sanitizeColumnBodyHtml', () => {
  it('strips script, event handlers, javascript URLs, and style injection', () => {
    const dirty = [
      '<p onclick="alert(1)">hello</p>',
      '<img src=x onerror=alert(1)>',
      '<a href="javascript:alert(1)">bad</a>',
      '<p style="background:url(javascript:alert(1))">styled</p>',
      '<script>alert(1)</script>',
    ].join('');

    const clean = sanitizeColumnBodyHtml(dirty);
    expect(clean).not.toMatch(/script/i);
    expect(clean).not.toMatch(/onerror/i);
    expect(clean).not.toMatch(/onclick/i);
    expect(clean).not.toMatch(/javascript:/i);
    expect(clean).not.toMatch(/style=/i);
    expect(clean).toContain('hello');
    expect(clean).toContain('styled');
  });

  it('keeps normal TipTap output, safe links, and asset images', () => {
    const html = [
      '<p><strong>Bold</strong> and <em>italic</em> and <u>under</u></p>',
      '<a href="https://tseng-law.com/ko/contact" target="_blank">Contact</a>',
      '<img src="/api/builder/assets/ko/photo.jpg" alt="photo">',
      '<ul><li>one</li></ul>',
      '<blockquote><p>quote</p></blockquote>',
    ].join('');

    const clean = sanitizeColumnBodyHtml(html);
    expect(clean).toContain('<strong>Bold</strong>');
    expect(clean).toContain('<em>italic</em>');
    expect(clean).toContain('<u>under</u>');
    expect(clean).toContain('href="https://tseng-law.com/ko/contact"');
    expect(clean).toContain('src="/api/builder/assets/ko/photo.jpg"');
    expect(clean).toContain('<blockquote>');
    // Idempotent for already-clean input
    expect(sanitizeColumnBodyHtml(clean)).toBe(clean);
  });

  it('unwraps unsafe anchors while preserving text children', () => {
    const clean = sanitizeColumnBodyHtml('<p><a href="data:text/html,x">keep me</a></p>');
    expect(clean).toContain('keep me');
    expect(clean).not.toContain('href=');
  });
});

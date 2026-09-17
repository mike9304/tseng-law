import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ROOT_LLMS_TXT_MAX_BYTES,
  buildLlmsFileListBullet,
  sanitizeLlmsText,
  validateLlmsTxt,
} from '@/lib/llms-txt';
import { siteLocales } from '@/lib/locales';
import { GET } from '../route';

const canonicalOrigin = 'https://tseng-law.com';
const fileListPattern = /^- \[[^\]\r\n]+\]\(https:\/\/tseng-law\.com(?:\/[^)\s]*)?\): [^\r\n]+$/u;

afterEach(() => {
  vi.unstubAllEnvs();
});

function expectV2Grammar(body: string, maxBytes: number): void {
  expect(() => validateLlmsTxt(body, maxBytes)).not.toThrow();
  expect(body.startsWith('# ')).toBe(true);
  expect(body.endsWith('\n')).toBe(true);
  expect(body.endsWith('\n\n')).toBe(false);
  expect(body).not.toContain('\r');
  expect(body).not.toMatch(/^###/mu);
  expect(body).not.toContain('```');
  expect(body).not.toMatch(/<[^>\n]+>/u);

  let inSection = false;
  for (const line of body.trimEnd().split('\n')) {
    if (line.startsWith('## ')) {
      inSection = true;
      continue;
    }
    if (inSection && line !== '') {
      expect(line).toMatch(fileListPattern);
    }
  }
}

describe('/llms.txt', () => {
  it('serves a bounded static UTF-8 discovery map with defensive headers', async () => {
    const response = GET();
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8');
    expect(response.headers.get('cache-control')).toMatch(/^public,/u);
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(new TextEncoder().encode(body).byteLength).toBeLessThanOrEqual(ROOT_LLMS_TXT_MAX_BYTES);
    expectV2Grammar(body, ROOT_LLMS_TXT_MAX_BYTES);
  });

  it('starts with all canonical firm names and honest non-ranking guidance', async () => {
    const body = await GET().text();
    const lines = body.split('\n');

    expect(lines[0]).toBe(
      '# 법무법인 호정 · 昊鼎國際法律事務所 · Hovering International Law Firm · 昊鼎国際法律事務所',
    );
    expect(lines[2]).toMatch(/^> [^\n]+$/u);
    expect(body).toMatch(/public information and is not legal advice/i);
    expect(body).toMatch(/discovery map/i);
    expect(body).toMatch(/does not promise search ranking, endorsement, AI recommendation, or guaranteed visibility/i);
    expect(body).toMatch(/Do not provide confidential or sensitive information/i);
    expect(body).not.toMatch(/guarantees? (?:search )?(?:ranking|recommendation|visibility)/i);
  });

  it('lists exactly four locale catalogs in canonical locale order', async () => {
    const body = await GET().text();
    const catalogUrls = Array.from(
      body.matchAll(/\]\((https:\/\/tseng-law\.com\/(?:ko|zh-hant|en|ja)\/llms\.txt)\):/gu),
      (match) => match[1],
    );

    expect(catalogUrls).toEqual(
      siteLocales.map((locale) => `${canonicalOrigin}/${locale}/llms.txt`),
    );
    expect(body.match(/^## [^\n]+$/gmu)).toEqual([
      '## Locale catalogs',
      '## Public AI consultation interfaces',
    ]);
  });

  it('retains only the two documented public machine-interface links', async () => {
    const body = await GET().text();

    expect(body).toContain(`${canonicalOrigin}/api/ai/openapi.json`);
    expect(body).toContain(`${canonicalOrigin}/api/ai/mcp`);
    expect(body).toMatch(/deployment, provider configuration, and provider registration may still be required/gi);
    expect((body.match(/https:\/\/tseng-law\.com\/api\//g) ?? []).length).toBe(2);
  });

  it('does not expose direct contact, private configuration, or internal surfaces', async () => {
    const body = await GET().text();

    expect(body).not.toMatch(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/u);
    expect(body).not.toMatch(/(?:\+?\d[\d ().-]{7,}\d)/u);
    expect(body).not.toMatch(/AI_INTAKE_CLIENTS|API[_ -]?KEY|CLIENT[_ -]?SECRET|Bearer credential/iu);
    expect(body).not.toMatch(/\/(?:admin|login|account|private)(?:\/|\b)/iu);
    expect(body).not.toMatch(/https?:\/\/(?!tseng-law\.com(?:\/|\)))/u);
  });

  it('sanitizes adversarial loader text without creating headings, links, HTML, or controls', () => {
    const adversarial = 'Trusted\r\n## injected ](https://evil.example) <script>alert(1)</script> \u061c\u00ad\u180e\u202e hidden';
    const sanitized = sanitizeLlmsText(adversarial);
    const bullet = buildLlmsFileListBullet({
      title: adversarial,
      path: '/en/columns/safe-slug',
      annotation: adversarial,
    });

    expect(sanitized).not.toMatch(/[\p{Cc}\p{Cf}]/u);
    expect(sanitized).not.toContain('](');
    expect(sanitized).not.toContain('##');
    expect(sanitized).not.toContain('<script>');
    expect(bullet.split('\n')).toHaveLength(1);
    expect(bullet).toMatch(fileListPattern);
    expect((bullet.match(/https:\/\//g) ?? []).length).toBe(1);
    expect(bullet).not.toContain('evil.example');
  });

  it('allows structural LF but rejects raw Unicode format and non-LF control characters', () => {
    const validBody = [
      '# Test',
      '',
      '> Public summary.',
      '',
      'Public discovery map.',
      '',
      '## Files',
      '',
      '- [Safe](https://tseng-law.com/en): Public page.',
      '',
    ].join('\n');

    expect(() => validateLlmsTxt(validBody, ROOT_LLMS_TXT_MAX_BYTES)).not.toThrow();
    for (const unsafeCharacter of ['\u061c', '\u00ad', '\u180e', '\u0001']) {
      const unsafeBody = validBody.replace('Public page.', `Public${unsafeCharacter} page.`);
      expect(() => validateLlmsTxt(unsafeBody, ROOT_LLMS_TXT_MAX_BYTES)).toThrow(/control|formatting/i);
    }
  });

  it('rejects non-canonical URLs instead of emitting external links', () => {
    expect(() => buildLlmsFileListBullet({
      title: 'External',
      path: 'https://example.com/private',
      annotation: 'Must fail closed.',
    })).toThrow(/canonical origin/i);
    expect(() => buildLlmsFileListBullet({
      title: 'Plain HTTP',
      path: 'http://tseng-law.com/en',
      annotation: 'Must fail closed.',
    })).toThrow(/canonical origin/i);
  });

  it('keeps the canonical origin when SITE_URL and NEXT_PUBLIC_SITE_URL change', async () => {
    vi.stubEnv('SITE_URL', 'http://localhost:3000');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://preview.example');
    vi.resetModules();
    const { GET: getCanonicalRoot } = await import('../route');
    const body = await getCanonicalRoot().text();

    expect(body).toContain(`${canonicalOrigin}/ko/llms.txt`);
    expect(body).toContain(`${canonicalOrigin}/api/ai/openapi.json`);
    expect(body).not.toContain('localhost');
    expect(body).not.toContain('preview.example');
    expect(body).not.toMatch(/https?:\/\/(?!tseng-law\.com(?:\/|\)))/u);
    expectV2Grammar(body, ROOT_LLMS_TXT_MAX_BYTES);
  });
});

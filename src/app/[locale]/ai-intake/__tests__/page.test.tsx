import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { siteLocales, type SiteLocale } from '@/lib/locales';
import AiIntakeHelpPage, { generateMetadata } from '../page';

const SITE_URL = 'https://tseng-law.com';

const SEMANTIC: Record<SiteLocale, {
  email: RegExp;
  preview: RegExp;
  approval: RegExp;
  prohibited: RegExp;
  transcript: RegExp;
  legal: RegExp;
  emergency: RegExp;
  disconnected: RegExp;
}> = {
  ko: {
    email: /이메일/,
    preview: /미리보기/,
    approval: /동의/,
    prohibited: /주민등록번호|여권|업로드/,
    transcript: /대화 전체 기록|첨부파일/,
    legal: /법률 자문/,
    emergency: /긴급/,
    disconnected: /특별히 연결된/,
  },
  'zh-hant': {
    email: /郵件/,
    preview: /預覽/,
    approval: /同意/,
    prohibited: /護照|上傳/,
    transcript: /對話紀錄|附件/,
    legal: /法律意見/,
    emergency: /緊急/,
    disconnected: /特別連接/,
  },
  en: {
    email: /email/i,
    preview: /exact preview subject and body/i,
    approval: /explicitly approves that exact content and privacy/i,
    prohibited: /national ID|passport|upload/i,
    transcript: /transcript|attachment/i,
    legal: /legal advice/i,
    emergency: /emergency/i,
    disconnected: /specifically connected/i,
  },
  ja: {
    email: /メール/,
    preview: /プレビュー/,
    approval: /同意/,
    prohibited: /旅券|アップロード/,
    transcript: /会話全体の記録|添付ファイル/,
    legal: /法律助言/,
    emergency: /緊急/,
    disconnected: /特別に接続/,
  },
};

function countTag(html: string, tag: string): number {
  return (html.match(new RegExp(`<${tag}\\b`, 'gi')) ?? []).length;
}

describe('/[locale]/ai-intake', () => {
  it.each(siteLocales)('publishes independent metadata, links, and required copy for %s', async (locale) => {
    const metadata = await generateMetadata({ params: Promise.resolve({ locale }) });
    expect(typeof metadata.title).toBe('string');
    expect(String(metadata.title).length).toBeGreaterThan(0);
    expect(typeof metadata.description).toBe('string');
    expect(metadata.other).toMatchObject({ 'content-language': locale === 'zh-hant' ? 'zh-Hant' : locale });
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/${locale}/ai-intake`);
    expect(metadata.openGraph?.url).toBe(`${SITE_URL}/${locale}/ai-intake`);
    expect(metadata.alternates?.languages).toMatchObject({
      ko: `${SITE_URL}/ko/ai-intake`,
      'zh-Hant': `${SITE_URL}/zh-hant/ai-intake`,
      en: `${SITE_URL}/en/ai-intake`,
      ja: `${SITE_URL}/ja/ai-intake`,
      'x-default': `${SITE_URL}/en/ai-intake`,
    });

    const html = renderToStaticMarkup(
      await AiIntakeHelpPage({ params: Promise.resolve({ locale }) }),
    );
    expect(countTag(html, 'h1')).toBe(1);
    expect(html).toContain('<article');
    expect(countTag(html, 'form')).toBe(0);
    expect(countTag(html, 'input')).toBe(0);
    expect(countTag(html, 'textarea')).toBe(0);
    expect(countTag(html, 'select')).toBe(0);
    expect(countTag(html, 'button')).toBe(0);
    expect(html).not.toMatch(/type=["']file["']/i);
    expect(html).not.toMatch(/type=["']submit["']/i);
    expect(html).toContain(`href="/${locale}/privacy"`);
    expect(html).toContain(`href="/${locale}/contact"`);
    expect(html).toContain(`${SITE_URL}/api/ai/openapi.json`);
    expect(html).toContain('/api/ai/mcp');

    const phrases = SEMANTIC[locale];
    expect(html).toMatch(phrases.email);
    expect(html).toMatch(phrases.preview);
    expect(html).toMatch(phrases.approval);
    expect(html).toMatch(phrases.prohibited);
    expect(html).toMatch(phrases.transcript);
    expect(html).toMatch(phrases.legal);
    expect(html).toMatch(phrases.emergency);
    expect(html).toMatch(phrases.disconnected);
    expect(html).not.toMatch(/already connected/i);
    expect(html).not.toMatch(/prepared locally/i);
    expect(html).not.toMatch(/로컬에 준비/);
    expect(html).not.toMatch(/已在本機準備/);
    expect(html).not.toMatch(/ローカルに準備/);
    expect(html).not.toMatch(/Bearer [A-Za-z0-9._-]{8,}/);
    expect(html).not.toContain('paste your API');
    expect(html).not.toContain('AI_INTAKE_CLIENTS');
    expect(html).not.toContain('AI_INTAKE_HMAC_SECRET');
    expect(html).not.toMatch(/sk-[A-Za-z0-9]{10,}/);
    expect(html).not.toMatch(/calendar reservation is created/i);
    expect(JSON.stringify(metadata)).not.toContain('AI_INTAKE_HMAC_SECRET');
  });

  it('uses contrast-safe gold-dim for small text and 44px link targets', () => {
    const css = readFileSync(join(process.cwd(), 'src/app/[locale]/ai-intake/ai-intake.module.css'), 'utf8');
    expect(css).toMatch(/\.label\s*\{[^}]*color:\s*var\(--gold-dim\)/s);
    expect(css).toMatch(/\.link:hover,\s*\n\.link:focus-visible\s*\{[^}]*color:\s*var\(--gold-dim\)/s);
    expect(css).toMatch(/\.link\s*\{[^}]*min-height:\s*44px/s);
    expect(css).toMatch(/\.heading\s*\{[^}]*border-top:\s*2px solid var\(--gold\)/s);
  });
});

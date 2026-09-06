import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import { getAllColumnPosts } from '@/lib/columns';
import {
  LOCALE_LLMS_TXT_MAX_BYTES,
  validateLlmsTxt,
} from '@/lib/llms-txt';
import { siteLocales, type SiteLocale } from '@/lib/locales';
import { getOrganizationName } from '@/lib/seo';
import { GET, generateStaticParams } from '../route';

const canonicalOrigin = 'https://tseng-law.com';
const contentLanguage: Record<SiteLocale, string> = {
  ko: 'ko',
  'zh-hant': 'zh-Hant',
  en: 'en',
  ja: 'ja',
};
const requiredFirmPaths = [
  '',
  '/about',
  '/services',
  `/lawyers/${primaryAttorneySlug}`,
  '/pricing',
  '/contact',
] as const;
const requiredIntentPaths = [
  '/taiwan-lawyer',
  '/taiwan-company-setup-lawyer',
  '/taiwan-litigation-lawyer',
  '/guides/taiwan-company-setup',
  '/ai-intake',
] as const;
const requiredNoticePaths = ['/privacy', '/disclaimer', '/accessibility'] as const;
const approvedAiIntakeAnnotations: Record<SiteLocale, string> = {
  ko: '이 사무소에 연결·설정된 AI 서비스의 절차 안내입니다. 필요한 범위의 질문 후 이메일 제목·본문을 그대로 보여 주며, 그 정확한 내용의 명시적 승인과 별도 개인정보 처리 동의가 있어야만 발송합니다. 일반 AI 대화에 자동 접근 권한이 있는 것은 아닙니다. 법률 자문이나 예약이 아닙니다.',
  'zh-hant': '供已連接並設定本所的AI服務參考：僅詢問必要範圍的問題，並顯示完全相同的郵件主旨與正文。只有使用者明確核准該內容並另行同意個人資料處理後，才可寄送。一般AI對話不會自動取得權限。這不是法律意見或預約。',
  en: 'Guide for an AI service configured with this firm: bounded questions and an exact email subject/body preview. Sending requires explicit approval of that exact content and separate privacy consent. General AI chats do not automatically have access. Not legal advice or booking.',
  ja: 'この事務所に接続・設定されたAIサービスの手順です。必要な範囲の質問と正確なメール件名・本文のプレビューを示し、その内容の明示的承認と個人情報の取扱いへの別個の同意後にのみ送信します。一般のAIチャットから自動利用はできません。法律助言や予約ではありません。',
};
const expectedSectionHeadings: Record<SiteLocale, readonly string[]> = {
  ko: ['사무소·변호사·연락', '주요 상담 안내', '법률 칼럼', '공개 고지'],
  'zh-hant': ['事務所、律師與聯絡方式', '主要諮詢資訊', '法律專欄', '公開聲明'],
  en: ['Firm, attorney, and contact', 'High-intent client paths', 'Legal columns', 'Public notices'],
  ja: ['事務所・弁護士・お問い合わせ', '主な相談案内', '法律コラム', '公開方針'],
};
const orderedConsentSemantics: Record<SiteLocale, readonly string[]> = {
  ko: [
    '필요한 범위의 질문',
    '이메일 제목·본문을 그대로',
    '그 정확한 내용의 명시적 승인',
    '별도 개인정보 처리 동의',
    '있어야만 발송합니다',
    '일반 AI 대화에 자동 접근 권한이 있는 것은 아닙니다',
    '법률 자문이나 예약이 아닙니다',
  ],
  'zh-hant': [
    '僅詢問必要範圍的問題',
    '完全相同的郵件主旨與正文',
    '明確核准該內容',
    '另行同意個人資料處理',
    '才可寄送',
    '一般AI對話不會自動取得權限',
    '這不是法律意見或預約',
  ],
  en: [
    'bounded questions',
    'exact email subject/body preview',
    'Sending requires explicit approval of that exact content',
    'separate privacy consent',
    'General AI chats do not automatically have access',
    'Not legal advice or booking',
  ],
  ja: [
    '必要な範囲の質問',
    '正確なメール件名・本文のプレビュー',
    '明示的承認',
    '別個の同意後にのみ送信',
    '一般のAIチャットから自動利用はできません',
    '法律助言や予約ではありません',
  ],
};

function localeUrl(locale: SiteLocale, path: string): string {
  return `${canonicalOrigin}/${locale}${path}`;
}

function getLocaleResponse(locale: string) {
  return GET(new Request(`${canonicalOrigin}/${locale}/llms.txt`), {
    params: Promise.resolve({ locale }),
  });
}

function extractColumnUrls(body: string, locale: SiteLocale): string[] {
  const pattern = new RegExp(
    `\\]\\((https:\\/\\/tseng-law\\.com\\/${locale}\\/columns\\/[^)]+)\\):`,
    'gu',
  );
  return Array.from(body.matchAll(pattern), (match) => match[1]);
}

function extractAiIntakeAnnotation(body: string, locale: SiteLocale): string {
  const marker = `](${localeUrl(locale, '/ai-intake')}): `;
  const line = body.split('\n').find((candidate) => candidate.includes(marker));
  return line?.slice(line.indexOf(marker) + marker.length) ?? '';
}

function hasFragmentsInOrder(value: string, fragments: readonly string[]): boolean {
  let cursor = -1;
  for (const fragment of fragments) {
    const index = value.indexOf(fragment, cursor + 1);
    if (index < 0) return false;
    cursor = index;
  }
  return true;
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('/[locale]/llms.txt', () => {
  it('statically enumerates only the four public locales in canonical order', () => {
    expect(generateStaticParams()).toEqual(siteLocales.map((locale) => ({ locale })));
  });

  it.each(siteLocales)('serves a bounded valid %s manifest with locale headers', async (locale) => {
    const response = await getLocaleResponse(locale);
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8');
    expect(response.headers.get('content-language')).toBe(contentLanguage[locale]);
    expect(response.headers.get('cache-control')).toMatch(/^public,/u);
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(new TextEncoder().encode(body).byteLength).toBeLessThanOrEqual(LOCALE_LLMS_TXT_MAX_BYTES);
    expect(() => validateLlmsTxt(body, LOCALE_LLMS_TXT_MAX_BYTES)).not.toThrow();
    expect(body.split('\n')[0]).toBe(`# ${getOrganizationName(locale)}`);
    expect(Array.from(body.matchAll(/^## ([^\n]+)$/gmu), (match) => match[1])).toEqual(
      expectedSectionHeadings[locale],
    );
  });

  it.each(siteLocales)('includes every required public %s path exactly once', async (locale) => {
    const body = await (await getLocaleResponse(locale)).text();

    for (const path of [...requiredFirmPaths, ...requiredIntentPaths, ...requiredNoticePaths]) {
      const expectedUrl = localeUrl(locale, path);
      expect(body.split(`](${expectedUrl})`).length - 1, expectedUrl).toBe(1);
    }
  });

  it.each(siteLocales)('includes all and only %s columns once in loader order', async (locale) => {
    const body = await (await getLocaleResponse(locale)).text();
    const posts = getAllColumnPosts(locale);
    const expectedUrls = posts.map((post) => localeUrl(locale, `/columns/${post.slug}`));

    expect(extractColumnUrls(body, locale)).toEqual(expectedUrls);
    expect(new Set(extractColumnUrls(body, locale)).size).toBe(posts.length);
    expect(posts.length).toBeGreaterThan(0);
  });

  it.each(siteLocales)('keeps %s links self-localized and excludes private or machine routes', async (locale) => {
    const body = await (await getLocaleResponse(locale)).text();

    for (const otherLocale of siteLocales.filter((candidate) => candidate !== locale)) {
      expect(body).not.toContain(`${canonicalOrigin}/${otherLocale}/columns/`);
    }
    expect(body).not.toMatch(/\/(?:admin|login|account|api|private)(?:\/|\b)/iu);
    expect(body).not.toContain('mailto:');
    expect(body).not.toMatch(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/u);
    expect(body).not.toMatch(/(?:\+?\d[\d ().-]{7,}\d)/u);
    expect(body).not.toMatch(/https?:\/\/(?!tseng-law\.com(?:\/|\)))/u);
  });

  it.each(siteLocales)('preserves canonical %s attorney and consultation semantics', async (locale) => {
    const body = await (await getLocaleResponse(locale)).text();
    const attorney = getAttorneyProfile(locale, primaryAttorneySlug);
    const approved = approvedAiIntakeAnnotations[locale];
    const annotation = extractAiIntakeAnnotation(body, locale);

    expect(attorney).toBeDefined();
    expect(body).toContain(
      `[${attorney?.name}](${localeUrl(locale, `/lawyers/${primaryAttorneySlug}`)})`,
    );
    expect(body).toContain(`](${localeUrl(locale, '/contact')})`);
    expect(annotation).toBe(approved);
    expect(body).toContain(`](${localeUrl(locale, '/ai-intake')}): ${approved}`);
    expect(Array.from(annotation).length).toBe(Array.from(approved).length);
    expect(Array.from(annotation).length).toBeLessThanOrEqual(320);
    expect(annotation.endsWith(approved.slice(-1))).toBe(true);
    expect(
      hasFragmentsInOrder(annotation, orderedConsentSemantics[locale]),
    ).toBe(true);
    expect(body).not.toContain('曾俊瑋');
    expect(body).not.toMatch(/calendar (?:appointment|reservation)/i);
  });

  it.each(['ko', 'zh-hant', 'ja'] as const)(
    'rejects a %s AI intake explanation that states sending before approval and consent',
    (locale) => {
      const fragments = orderedConsentSemantics[locale];
      const sendIndex = fragments.findIndex((fragment) => /발송|寄送|送信/u.test(fragment));
      const approvalIndex = fragments.findIndex((fragment) => /명시적 승인|明確核准|明示的承認/u.test(fragment));
      expect(approvalIndex).toBeGreaterThanOrEqual(0);
      expect(sendIndex).toBeGreaterThan(approvalIndex);
      const remaining = fragments.filter((_, index) => index !== sendIndex);
      const reordered = [
        ...remaining.slice(0, approvalIndex),
        fragments[sendIndex],
        ...remaining.slice(approvalIndex),
      ].join(' ');
      expect(hasFragmentsInOrder(reordered, fragments)).toBe(false);
    },
  );

  it('rejects English copy that drops the sending requirement, exact-content approval, or separate privacy consent', () => {
    const approved = approvedAiIntakeAnnotations.en;
    const fragments = orderedConsentSemantics.en;
    expect(hasFragmentsInOrder(approved, fragments)).toBe(true);
    expect(hasFragmentsInOrder(approved.replace('Sending requires ', 'Sending. '), fragments)).toBe(false);
    expect(hasFragmentsInOrder(approved.replace('explicit approval of that exact content and ', ''), fragments)).toBe(false);
    expect(hasFragmentsInOrder(approved.replace(' and separate privacy consent', ''), fragments)).toBe(false);
  });

  it('keeps canonical locale URLs when SITE_URL and NEXT_PUBLIC_SITE_URL change', async () => {
    vi.stubEnv('SITE_URL', 'http://localhost:3000');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://preview.example');
    vi.resetModules();
    const { GET: getCanonicalLocale } = await import('../route');
    const response = await getCanonicalLocale(new Request(`${canonicalOrigin}/en/llms.txt`), {
      params: Promise.resolve({ locale: 'en' }),
    });
    const body = await response.text();
    expect(body).toContain(`${canonicalOrigin}/en/ai-intake`);
    expect(body).not.toContain('localhost');
    expect(body).not.toContain('preview.example');
    expect(body).not.toMatch(/https?:\/\/(?!tseng-law\.com(?:\/|\)))/u);
  });

  it('returns 404 for an invalid locale without falling back to Korean', async () => {
    const response = await getLocaleResponse('fr');
    const body = await response.text();

    expect(response.status).toBe(404);
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(body).toBe('Not Found\n');
    expect(body).not.toContain('/ko/');
    expect(body).not.toContain('법무법인');
  });
});

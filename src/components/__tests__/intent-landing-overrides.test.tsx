import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import IntentLandingPage from '@/components/IntentLandingPage';
import { getIntentPage, intentPageSlugs, type IntentPageSlug } from '@/data/intent-pages';
import { getServiceArea } from '@/data/service-details';
import { getJapaneseServiceDetail } from '@/data/service-details-ja';
import type { SiteLocale } from '@/lib/locales';

const semiconductorSlug = 'taiwan-semiconductor-supplier-legal' as const;

function renderLanding(locale: SiteLocale, slug: IntentPageSlug): string {
  return renderToStaticMarkup(<IntentLandingPage locale={locale} slug={slug} />);
}

// 공용 로케일 문구(덮어쓰기가 없을 때 그대로 나와야 하는 값).
const koSharedAttorneyHeading = '이 검색어와 가장 가까운 담당 대만 변호사';
const koSharedCtaText =
  '회사설립, 투자, 소송, 가족 분쟁은 초기 검토 방식이 다릅니다. 먼저 사건 개요, 대만과의 관련성, 기한, 연락처를 간단히 알려 주세요. 적합성·이해충돌을 확인한 뒤 업무 범위와 비용을 안내합니다. 민감한 서류는 변호사 안내 후 보내 주세요.';

describe('intent landing page-level overrides', () => {
  it('renders the semiconductor Korean overrides instead of the shared strings', () => {
    const html = renderLanding('ko', semiconductorSlug);
    const page = getIntentPage('ko', semiconductorSlug)!;

    expect(html).toContain(page.attorneyHeadingOverride!);
    expect(html).toContain('현지 법인이 정말 필요한지, 계약서만 손보면 되는지');
    expect(html).not.toContain(koSharedAttorneyHeading);
    expect(html).not.toContain(koSharedCtaText);
  });

  it('renders the page H1 without the SEO pipe title', () => {
    const html = renderLanding('ko', semiconductorSlug);

    expect(html).toContain('대만 반도체 소재·장비 공급사를 위한 법무 안내');
    expect(html).not.toContain('법인설립·계약·고용·미수금');
  });

  it('renders page-specific service blurbs instead of the reusable service intros', () => {
    const html = renderLanding('ko', semiconductorSlug);
    const page = getIntentPage('ko', semiconductorSlug)!;

    for (const [serviceSlug, blurb] of Object.entries(page.serviceBlurbs ?? {})) {
      expect(html).toContain(blurb);
      const shared = getServiceArea(serviceSlug)?.intro.ko ?? '';
      expect(shared).not.toBe('');
      expect(html).not.toContain(shared.slice(0, 40));
    }
  });

  it('links the reworked Korean related columns and drops the unrelated ones', () => {
    const html = renderLanding('ko', semiconductorSlug);

    expect(html).toContain('/ko/columns/taiwan-labor-severance-law');
    expect(html).toContain('/ko/columns/taiwan-mandatory-employment-period');
    expect(html).not.toContain('/ko/columns/taiwan-logistics-business-setup');
    expect(html).not.toContain(
      '/ko/columns/taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
    );
  });

  it.each(intentPageSlugs.filter((slug) => slug !== semiconductorSlug))(
    'falls back to the shared Korean strings on /ko/%s',
    (slug) => {
      const html = renderLanding('ko', slug);

      expect(html).toContain(koSharedAttorneyHeading);
      expect(html).toContain(koSharedCtaText);
    },
  );

  it.each(['zh-hant', 'en', 'ja'] as const)(
    'renders the semiconductor %s overrides instead of the shared strings',
    (locale) => {
      const html = renderLanding(locale, semiconductorSlug);
      const page = getIntentPage(locale, semiconductorSlug)!;

      expect(page.attorneyHeadingOverride).toBeDefined();
      expect(page.ctaTextOverride).toBeDefined();
      expect(page.serviceBlurbs).toBeDefined();
      expect(html).toContain(page.title);
      expect(html).toContain(page.attorneyHeadingOverride!);
      expect(html).toContain(page.ctaTextOverride!);
      expect(html).not.toContain(page.seoTitle!);

      for (const [serviceSlug, blurb] of Object.entries(page.serviceBlurbs ?? {})) {
        expect(html).toContain(blurb);
        const shared =
          locale === 'ja'
            ? (getJapaneseServiceDetail(serviceSlug)?.intro ?? '')
            : (getServiceArea(serviceSlug)?.intro[locale] ?? '');
        expect(shared).not.toBe('');
        expect(html).not.toContain(shared.slice(0, 40));
      }

      expect(html).toContain(`/${locale}/columns/taiwan-labor-severance-law`);
      expect(html).toContain(`/${locale}/columns/taiwan-mandatory-employment-period`);
      expect(html).not.toContain(`/${locale}/columns/taiwan-logistics-business-setup`);
      expect(html).not.toContain(
        `/${locale}/columns/taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide`,
      );
    },
  );

  it.each(['zh-hant', 'en', 'ja'] as const)(
    'leaves the other %s intent pages on the shared locale strings',
    (locale) => {
      for (const otherSlug of intentPageSlugs.filter((item) => item !== semiconductorSlug)) {
        const page = getIntentPage(locale, otherSlug)!;
        expect(page.attorneyHeadingOverride).toBeUndefined();
        expect(page.ctaTextOverride).toBeUndefined();
        expect(page.serviceBlurbs).toBeUndefined();
      }
    },
  );
});

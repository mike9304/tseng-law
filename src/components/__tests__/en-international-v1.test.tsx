import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import HeroSearch from '@/components/HeroSearch';
import { EN_HOME_HERO_TITLE, EN_PATH_LABELS } from '@/data/en-international-paths';
import { guideContent } from '@/app/[locale]/guides/taiwan-company-setup/content';
import { getIntentPage } from '@/data/intent-pages';
import { isGloballyNoindexPath } from '@/lib/seo-visibility';
import { siteContent } from '@/data/site-content';

describe('EN-INTERNATIONAL-v1 candidate copy', () => {
  it('places two first-screen paths on the English hero', () => {
    const html = renderToStaticMarkup(<HeroSearch locale="en" />);
    expect(html).toContain(EN_PATH_LABELS.companySetup);
    expect(html).toContain(EN_PATH_LABELS.dispute);
    expect(html).toContain('href="/en/taiwan-company-setup-lawyer"');
    expect(html).toContain('href="/en/taiwan-litigation-lawyer"');
    expect(html).toContain('href="/en/guides/taiwan-company-setup"');
    expect(html).toContain('Request an Email Consultation');
    expect(renderToStaticMarkup(<HeroSearch locale="ko" />)).not.toContain(EN_PATH_LABELS.companySetup);
  });

  it('keeps the English home title international without claiming every attorney speaks English', () => {
    expect(siteContent.en.hero.title).toBe(EN_HOME_HERO_TITLE);
    // WO-X1 (EN-01, user decision 2026-09-23): the attorney consults directly in English.
    expect(siteContent.en.hero.subtitle).toMatch(/Attorney Wei Tseng consults directly in English, Chinese, Korean, and Japanese/);
    expect(siteContent.en.hero.subtitle).not.toMatch(/works with clients directly in Korean, Chinese, and Japanese/);
    expect(siteContent.en.hero.subtitle).not.toMatch(/English-speaking attorneys/i);
  });

  it('separates the company-setup guide from the engagement page', () => {
    const guide = guideContent.en;
    const lawyer = getIntentPage('en', 'taiwan-company-setup-lawyer');
    expect(guide.planHeading).toBe('Start with Your Business Plan');
    expect(guide.lawyerLink?.href).toBe('/en/taiwan-company-setup-lawyer');
    expect(lawyer?.label).toBe('Company Formation Legal Services');
    expect(JSON.stringify(guide)).not.toMatch(/Korean HQ 100%/);
    expect(guide.countrySpecificHeading).toBe('Country-Specific Considerations');
  });

  it('keeps the new commercial-dispute URL unpublished in the sitemap indexability rules', () => {
    expect(isGloballyNoindexPath('/taiwan-debt-recovery-lawyer')).toBe(true);
    expect(isGloballyNoindexPath('/taiwan-company-setup-lawyer')).toBe(false);
  });
});

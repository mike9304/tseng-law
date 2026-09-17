import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { CINEMATIC_OPENING_COPY } from '@/components/CinematicOpening';
import ConsultationGuideSection from '@/components/ConsultationGuideSection';
import IntentLandingPage from '@/components/IntentLandingPage';
import PricingCards from '@/components/PricingCards';
import { getCorporateAdvisory } from '@/data/corporate-advisory';
import { faqContent } from '@/data/faq-content';
import { internationalInquiryCopy } from '@/data/international-inquiry-copy';
import { siteContent } from '@/data/site-content';
import { teamContent } from '@/data/team-members';

const CANONICAL_LANGUAGES = 'English, Chinese, Korean, and Japanese';

const FORBIDDEN_EN_LISTINGS = [
  'English, Japanese, and Korean',
  'English, Japanese & Korean',
  'English, Japanese, Korean, and Chinese',
  'English, Korean, Chinese, and Japanese',
  'English, Chinese, Japanese, and Korean',
  'English, Korean, Chinese & Japanese',
  'Korean, Chinese, English, and Japanese',
] as const;

const LISTING_SOURCE_FILES = [
  'src/data/international-inquiry-copy.ts',
  'src/components/CinematicOpening.tsx',
  'src/data/team-members.ts',
  'src/data/faq-content.ts',
  'src/data/corporate-advisory.ts',
  'src/components/IntentLandingPage.tsx',
] as const;

function rejectForbiddenListings(source: string, label: string) {
  for (const listing of FORBIDDEN_EN_LISTINGS) {
    expect(source, `${label} still lists languages as “${listing}”`).not.toContain(listing);
  }
}

describe('English consultation-language listing', () => {
  it('states the four consultation languages on the contact guide', () => {
    const html = renderToStaticMarkup(createElement(ConsultationGuideSection, { locale: 'en' }));

    expect(html).toContain(CANONICAL_LANGUAGES);
    expect(html).not.toContain('English, Japanese, and Korean');
    expect(html).not.toContain('Korean, Chinese, English, and Japanese');
  });

  it('states the four consultation languages on the fees page', () => {
    const html = renderToStaticMarkup(createElement(PricingCards, { locale: 'en' }));

    expect(html).toContain(CANONICAL_LANGUAGES);
    expect(html).not.toContain('English, Korean, Chinese & Japanese');
  });

  it('uses the canonical four-language order in English site-content conjunction lists', () => {
    const serialized = JSON.stringify(siteContent.en);

    expect(serialized).toContain(CANONICAL_LANGUAGES);
    rejectForbiddenListings(serialized, 'siteContent.en');
  });

  it('uses the canonical four-language order in the remaining English copy sources', () => {
    expect(internationalInquiryCopy.en.consultationNotice).toContain(CANONICAL_LANGUAGES);
    expect(CINEMATIC_OPENING_COPY.en.service).toContain(CANONICAL_LANGUAGES);
    expect(teamContent.en.story.join('\n')).toContain(CANONICAL_LANGUAGES);
    expect(teamContent.en.members[0]?.intro.join('\n')).toContain(CANONICAL_LANGUAGES);
    expect(faqContent.en.find((item) => item.question === 'How are consultations conducted?')?.answer).toContain(
      CANONICAL_LANGUAGES,
    );
    expect(getCorporateAdvisory('en')?.languages).toContain(CANONICAL_LANGUAGES);

    const landing = renderToStaticMarkup(createElement(IntentLandingPage, { locale: 'en', slug: 'taiwan-lawyer' }));
    expect(landing).toContain(CANONICAL_LANGUAGES);

    rejectForbiddenListings(internationalInquiryCopy.en.consultationNotice, 'international-inquiry-copy EN');
    rejectForbiddenListings(CINEMATIC_OPENING_COPY.en.service, 'CinematicOpening EN');
    rejectForbiddenListings(JSON.stringify(teamContent.en), 'team-members EN');
    rejectForbiddenListings(JSON.stringify(faqContent.en), 'faq-content EN');
    rejectForbiddenListings(getCorporateAdvisory('en')?.languages ?? '', 'corporate-advisory EN');
    rejectForbiddenListings(landing, 'IntentLandingPage EN');
  });

  it('scans the D3 remaining listing files for the canonical English order', () => {
    for (const relativePath of LISTING_SOURCE_FILES) {
      const source = readFileSync(path.join(process.cwd(), relativePath), 'utf8');
      expect(source, `${relativePath} is missing the canonical English listing`).toContain(CANONICAL_LANGUAGES);
      rejectForbiddenListings(source, relativePath);
    }
  });
});

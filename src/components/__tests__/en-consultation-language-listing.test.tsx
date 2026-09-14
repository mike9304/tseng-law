import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ConsultationGuideSection from '@/components/ConsultationGuideSection';
import PricingCards from '@/components/PricingCards';
import { siteContent } from '@/data/site-content';

const CANONICAL_LANGUAGES = 'English, Chinese, Korean, and Japanese';

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
    expect(serialized).not.toContain('English, Chinese, Japanese, and Korean');
    expect(serialized).not.toContain('English, Japanese, and Korean');
    expect(serialized).not.toContain('English, Korean, Chinese & Japanese');
  });
});

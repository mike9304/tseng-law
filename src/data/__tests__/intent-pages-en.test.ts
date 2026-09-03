import { describe, expect, it } from 'vitest';

import { landingContent } from '@/app/[locale]/korean-lawyer-in-taiwan/content';
import { getIntentPage, type IntentPageSlug } from '@/data/intent-pages';

const generalEnglishIntentPageSlugs: IntentPageSlug[] = [
  'taiwan-lawyer',
  'taiwan-company-setup-lawyer',
  'taiwan-litigation-lawyer',
];

describe('general English intent landing pages', () => {
  it.each(generalEnglishIntentPageSlugs)('contains no Korea-specific audience residue for %s', (slug) => {
    const page = getIntentPage('en', slug);

    expect(page).toBeDefined();
    expect(JSON.stringify(page)).not.toMatch(/Korea|Korean|[\uac00-\ud7a3]/i);
  });

  it('uses the reviewed international-audience wording', () => {
    const pages = generalEnglishIntentPageSlugs.map((slug) => getIntentPage('en', slug));
    const serialized = JSON.stringify(pages);

    expect(serialized).toContain('English-speaking foreign residents and overseas companies');
    expect(serialized).toContain(
      'Clients who want Taiwan legal issues explained in English or with multilingual support',
    );
    expect(serialized).toContain('For overseas companies');
    expect(serialized).toContain('standard in your home country');
    expect(serialized).toContain(
      'For English-speaking clients, English communication, experience with Taiwan’s local procedures, and document-handling capability all matter.',
    );
    expect(serialized).toContain('foreign residents and overseas companies entering Taiwan');
    expect(serialized).toContain('fits the overseas parent');
    expect(serialized).toContain('Overseas parent-company registry documents');
    expect(serialized).toContain('while I am still overseas');
    expect(serialized).toContain('involving your home country and Taiwan');
  });
});

describe('dedicated English Korean-lawyer landing', () => {
  it('remains explicitly targeted to Korean-speaking clients', () => {
    const serialized = JSON.stringify(landingContent.en);

    expect(landingContent.en.metaTitle).toContain('Korean-Speaking Taiwan Lawyer');
    expect(serialized).toContain('Korean clients');
    expect(serialized).toContain('consult in Korean');
  });
});

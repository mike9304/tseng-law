import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const componentPaths = [
  'src/components/AttorneyAuthorityCard.tsx',
  'src/components/AttorneyMediaHubView.tsx',
  'src/components/AttorneyProfileSection.tsx',
  'src/components/HeroSearch.tsx',
  'src/components/HomeContactCta.tsx',
  'src/components/IntentLandingPage.tsx',
  'src/components/PricingCards.tsx',
  'src/components/YearEndEventPopup.tsx',
] as const;

describe('public consultation CTA accessible names', () => {
  it.each(componentPaths)('%s gives high-intent mailto links a localized attorney label', (componentPath) => {
    const source = readFileSync(path.join(process.cwd(), componentPath), 'utf8');

    expect(source).toContain('getConsultationCtaLabel');
    expect(source).toContain('getConsultationPublicMailto');
    expect(source).toContain('aria-label=');
  });
});

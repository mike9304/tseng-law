import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { guideContent } from '../guides/taiwan-company-setup/content';
import { landingContent } from '../korean-lawyer-in-taiwan/content';

const productSources = [
  'src/app/[locale]/guides/taiwan-company-setup/content.ts',
  'src/app/[locale]/korean-lawyer-in-taiwan/content.ts',
  'src/app/[locale]/(legacy)/lawyers-legacy.tsx',
  'src/app/[locale]/(legacy)/about-legacy.tsx',
  'src/app/[locale]/services/[slug]/page.tsx',
] as const;

describe('canonical attorney identity on public routes', () => {
  it('uses the official Chinese name in every affected product source', () => {
    for (const relativePath of productSources) {
      const source = readFileSync(join(process.cwd(), relativePath), 'utf8');

      expect(source, relativePath).toContain('曾雋崴');
      expect(source, relativePath).not.toContain('曾俊瑋');
    }
  });

  it('preserves representative Korean and English runtime content', () => {
    expect(guideContent.ko.ctaText).toContain('증준외 대만 변호사');
    expect(guideContent.en.ctaText).toContain('Attorney Wei Tseng');
    expect(landingContent.ko.keywords).toContain('증준외 변호사');
    expect(landingContent.en.keywords).toContain('Attorney Wei Tseng');
  });
});

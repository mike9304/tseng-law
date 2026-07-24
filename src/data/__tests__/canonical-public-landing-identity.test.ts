import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { blogPosts } from '@/data/blog-posts';
import { firmIntroductionContent } from '@/data/firm-introduction';
import { intentPages } from '@/data/intent-pages';

const productSources = [
  'src/data/blog-posts.ts',
  'src/data/firm-introduction.ts',
  'src/data/intent-pages.ts',
  'src/components/IntentLandingPage.tsx',
] as const;

describe('canonical attorney identity on public landing surfaces', () => {
  it('uses the official Chinese name in every affected product source', () => {
    for (const relativePath of productSources) {
      const source = readFileSync(join(process.cwd(), relativePath), 'utf8');

      expect(source, relativePath).toContain('曾雋崴');
      expect(source, relativePath).not.toContain('曾俊瑋');
    }
  });

  it('preserves the Korean and English attorney identities in runtime data', () => {
    expect(blogPosts['cosmetics-market-entry'].author).toBe(
      '증준외 변호사 (曾雋崴 律師)',
    );
    expect(firmIntroductionContent.ko.paragraphs.join(' ')).toContain(
      '증준외 변호사',
    );
    expect(firmIntroductionContent.en.paragraphs.join(' ')).toContain(
      'Attorney Wei Tseng',
    );
    expect(intentPages.ko['taiwan-lawyer'].keywords).toContain('증준외 변호사');
    expect(intentPages.en['taiwan-lawyer'].keywords).toContain(
      'Wei Tseng attorney',
    );
  });
});

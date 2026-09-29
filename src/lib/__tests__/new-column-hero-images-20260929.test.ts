import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

type Locale = Parameters<typeof getColumnPost>[1];
const MULTI: Locale[] = ['ko', 'zh-hant', 'en', 'ja'] as Locale[];
const COLUMNS: Array<[string, Locale[]]> = [
  ['024-taiwan-income-tax-residency', MULTI],
  ['025-taiwan-estate-tax-foreign-decedent', MULTI],
  ['026-foreign-heir-taiwan-succession-law-land', MULTI],
  ['027-taiwan-employment-gold-card', MULTI],
  ['028-taiwan-foreign-spouse-residence', MULTI],
  ['029-taiwan-permanent-residence-aprc', MULTI],
  ['030-enforce-foreign-judgment-in-taiwan', MULTI],
  ['031-hire-taiwan-lawyer-from-abroad', MULTI],
  ['032-taiwan-exit-ban-foreigners', ['en'] as Locale[]],
  ['033-taiwan-police-questioning-foreigner-rights', ['en'] as Locale[]],
  ['034-foreign-professional-dismissed-taiwan', ['en'] as Locale[]],
  ['035-taiwan-unpaid-invoice-debt-collection', ['ja'] as Locale[]],
  ['036-taiwan-subsidiary-responsible-person-liability', ['ja'] as Locale[]],
  ['037-taiwan-subsidiary-employee-dismissal', ['ja'] as Locale[]],
  ['038-taiwan-bank-account-lending-fraud-money-laundering', ['vi'] as Locale[]],
  ['039-taiwan-migrant-worker-occupational-injury-compensation', ['vi'] as Locale[]],
  ['040-vietnamese-spouse-taiwan-residence-after-divorce-domestic-violence', ['vi'] as Locale[]],
];

describe('new columns 024–040 hero images', () => {
  it('each column has its own distinct optimized webp hero', () => {
    const hashes = new Set<string>();
    for (const [id] of COLUMNS) {
      const file = path.join(process.cwd(), 'public/images/blog', id, 'featured-01.webp');
      expect(existsSync(file), file).toBe(true);
      expect(statSync(file).size).toBeLessThan(200_000);
      hashes.add(createHash('sha256').update(readFileSync(file)).digest('hex'));
    }
    expect(hashes.size).toBe(COLUMNS.length);
  });

  for (const [id, locales] of COLUMNS) {
    it(`${id}: every locale points at its own hero`, () => {
      const slug = id.replace(/^\d+-/, '');
      for (const locale of locales) {
        const post = getColumnPost(slug, locale);
        expect(post, `${locale}/${slug}`).toBeDefined();
        expect(post?.featuredImage).toBe(`/images/blog/${id}/featured-01.webp`);
      }
    });
  }
});

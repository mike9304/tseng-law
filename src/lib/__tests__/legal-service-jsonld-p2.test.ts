import { describe, expect, it } from 'vitest';
import { taiwanOfficeData } from '@/data/office-locations';
import {
  ATTORNEY_PERSON_ID,
  buildCollectionPageJsonLd,
  buildLegalServiceJsonLd,
} from '@/lib/seo';

describe('P2-3 JSON-LD page URL and EN office addresses', () => {
  it('keeps LegalService.url on the locale home and CollectionPage.url on the page itself', () => {
    expect(buildLegalServiceJsonLd('en').url).toBe('https://tseng-law.com/en');
    expect(buildLegalServiceJsonLd('ko').url).toBe('https://tseng-law.com/ko');

    expect(
      buildCollectionPageJsonLd({
        locale: 'en',
        path: '/en/columns',
        name: 'Columns',
        items: [],
      }).url,
    ).toBe('https://tseng-law.com/en/columns');
    expect(
      buildCollectionPageJsonLd({
        locale: 'en',
        path: '/en/taiwan-litigation-lawyer',
        name: 'Taiwan Litigation Lawyer',
        items: [],
      }).url,
    ).toBe('https://tseng-law.com/en/taiwan-litigation-lawyer');
  });

  it('uses English contact addresses on EN LegalService location nodes', () => {
    const node = buildLegalServiceJsonLd('en');
    const expected = taiwanOfficeData.en;

    expect(node.location).toHaveLength(expected.length);
    for (const [index, office] of expected.entries()) {
      const address = node.location[index]?.address as {
        streetAddress?: string;
        addressLocality?: string;
        addressCountry?: string;
      };
      expect(address.streetAddress).toBe(office.address);
      expect(address.addressCountry).toBe('TW');
    }
  });

  it('keeps local-script location addresses on non-English locales', () => {
    const ko = buildLegalServiceJsonLd('ko');
    expect((ko.location[0]?.address as { streetAddress?: string }).streetAddress).toContain('承德路');
    expect((ko.location[0]?.address as { streetAddress?: string }).streetAddress).not.toMatch(/Chengde Rd/);

    const zh = buildLegalServiceJsonLd('zh-hant');
    expect((zh.location[0]?.address as { streetAddress?: string }).streetAddress).toContain('承德路');

    const ja = buildLegalServiceJsonLd('ja');
    expect((ja.location[0]?.address as { streetAddress?: string }).streetAddress).toContain('承德路');
    expect((ja.location[0]?.address as { streetAddress?: string }).streetAddress).not.toMatch(/Chengde Rd/);
  });

  it('documents EN Person @id as the profile fragment, not the shared standalone id', () => {
    expect(buildLegalServiceJsonLd('en').employee['@id']).toBe(
      'https://tseng-law.com/en/lawyers/wei-tseng#person',
    );
    expect(buildLegalServiceJsonLd('en').employee['@id']).not.toBe(ATTORNEY_PERSON_ID);
  });
});

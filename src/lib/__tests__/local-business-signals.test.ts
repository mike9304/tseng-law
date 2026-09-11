import { describe, expect, it } from 'vitest';
import { buildLegalServiceJsonLd } from '@/lib/seo';
import { taiwanOfficeSeoRecords } from '@/data/office-locations';

/**
 * Local-search signals. Before these existed, the only phone number a crawler
 * could read off the site was the Korean mobile on the contact page: the four
 * Taiwan offices live in a client-side tab component that renders one office at
 * a time, and the default tab (Taipei) publishes no phone at all. A Taiwan law
 * firm therefore exposed no Taiwan telephone, branch address or coordinates.
 */
describe('LegalService local signals', () => {
  const node = buildLegalServiceJsonLd('ko') as ReturnType<typeof buildLegalServiceJsonLd> & {
    location: Array<Record<string, unknown>>;
  };

  it('publishes all four Taiwan offices as Place nodes', () => {
    expect(node.location).toHaveLength(4);
    expect(node.location.map((place) => place['@id'])).toEqual(
      taiwanOfficeSeoRecords.map((office) => `${node['@id']}-office-${office.id}`),
    );
    for (const place of node.location) {
      expect(place['@type']).toBe('Place');
      const address = place.address as Record<string, string>;
      expect(address['@type']).toBe('PostalAddress');
      expect(address.addressCountry).toBe('TW');
      expect(address.streetAddress.length).toBeGreaterThan(0);
      expect(address.postalCode).toMatch(/^\d{3,5}$/);
    }
  });

  it('carries every published branch phone in E.164, and invents none', () => {
    const phones = node.location.map((place) => place.telephone).filter(Boolean);
    expect(phones).toEqual(['+886-4-2326-1862', '+886-7-557-9797', '+886-8-739-1689']);
    // Taipei publishes no phone — it must stay absent rather than be guessed.
    expect(node.location[0].telephone).toBeUndefined();
  });

  it('carries only coordinates that its own map embed supplies', () => {
    const geos = node.location.filter((place) => place.geo);
    expect(geos).toHaveLength(3);
    for (const place of geos) {
      const geo = place.geo as { latitude: number; longitude: number };
      // Taiwan's bounding box — a transposed lat/lng pair would fail here.
      expect(geo.latitude).toBeGreaterThan(21.8);
      expect(geo.latitude).toBeLessThan(25.4);
      expect(geo.longitude).toBeGreaterThan(119.9);
      expect(geo.longitude).toBeLessThan(122.1);
    }
    // Pingtung's embed is an address query with no coordinates.
    expect(node.location[3].geo).toBeUndefined();
  });
});

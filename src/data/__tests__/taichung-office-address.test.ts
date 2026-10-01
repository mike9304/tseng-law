import { describe, expect, it } from 'vitest';
import { taiwanOfficeSeoRecords } from '@/data/office-locations';
import { presetAddresses } from '@/lib/builder/components/location-widgets-copy/presets';

// User-confirmed 2026-10-01: the Taichung office is on the 6th floor (19號6樓之1).
describe('Taichung office address', () => {
  const canonical = taiwanOfficeSeoRecords.find((office) => office.id === 'taichung')?.address;

  it('keeps the canonical record on 19號6樓之1', () => {
    expect(canonical).toBe('臺中市北區館前路19號6樓之1');
  });

  it('location widget presets use the canonical address', () => {
    expect(presetAddresses.taichung).toBe(canonical);
    expect(presetAddresses.taichung).not.toContain('19號樓之1');
  });
});

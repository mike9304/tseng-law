import { describe, expect, it } from 'vitest';

import {
  assertCanonicalManifest,
  EXPECTED_JOURNEY_COUNT,
  EXPECTED_JOURNEY_IDS,
  JOURNEY_ENTRIES,
  JOURNEY_MANIFEST_SOURCE,
  JOURNEY_IDS,
  validateJourneyManifest,
  type JourneyEntry,
} from '../journey-manifest';

describe('WB-R07 journey manifest — canonical completeness', () => {
  it('freezes the exact journey id tuple at runtime', () => {
    expect(Object.isFrozen(JOURNEY_IDS)).toBe(true);
    expect(() => { (JOURNEY_IDS as unknown as string[]).push('J99'); }).toThrow();
    expect(JOURNEY_IDS).toHaveLength(20);
  });
  it('declares exactly the 20 expected ids in order', () => {
    expect(JOURNEY_ENTRIES).toHaveLength(20);
    expect(EXPECTED_JOURNEY_COUNT).toBe(20);
    expect(EXPECTED_JOURNEY_IDS).toEqual([
      'J01', 'J02', 'J03', 'J04', 'J05', 'J06', 'J07', 'J08', 'J09', 'J10',
      'J11', 'J12', 'J13', 'J14', 'J15', 'J16', 'J17', 'J18', 'J19', 'J20',
    ]);
  });

  it('records the exact canonical source string', () => {
    expect(JOURNEY_MANIFEST_SOURCE).toBe('roadmap + /root/wb_r07_pointer_gate_audit report');
  });

  it('canonical entries validate cleanly', () => {
    const result = validateJourneyManifest(JOURNEY_ENTRIES);
    expect(result.ok, result.errors.join('; ')).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.missing).toEqual([]);
    expect(result.duplicates).toEqual([]);
    expect(result.unexpected).toEqual([]);
    expect(result.ids).toEqual([...EXPECTED_JOURNEY_IDS]);
  });

  it('assertCanonicalManifest returns the frozen canonical list', () => {
    expect(assertCanonicalManifest()).toBe(JOURNEY_ENTRIES);
  });

  it('every entry id matches J## and the numeric suffix is 1-based', () => {
    JOURNEY_ENTRIES.forEach((entry, index) => {
      expect(entry.id).toMatch(/^J\d{2}$/);
      expect(entry.number).toBe(index + 1);
      expect(entry.line).toBe(`${entry.id} ${entry.description}`);
      expect(entry.description.length).toBeGreaterThan(0);
    });
  });

  it('exactly matches the canonical descriptions byte-for-byte', () => {
    const byId = new Map(JOURNEY_ENTRIES.map((entry) => [entry.id, entry.description]));
    expect(byId.get('J01')).toBe('attorney container selected then title click selects exact child only');
    expect(byId.get('J02')).toBe('intro select/dblclick/cancel preserves position+target');
    expect(byId.get('J03')).toBe('inline toolbar commit persists draft/reload');
    expect(byId.get('J04')).toBe('small pointer jitter does not move node');
    expect(byId.get('J05')).toBe('real node drag/release/undo');
    expect(byId.get('J06')).toBe('all 8 resize handles real drag/undo');
    expect(byId.get('J07')).toBe('rotation handle real drag/readout/undo');
    expect(byId.get('J08')).toBe('Shift multiselect + toolbar forward/back/duplicate/delete');
    expect(byId.get('J09')).toBe('Add panel widget preset real drag/drop');
    expect(byId.get('J10')).toBe('section template real drag/drop');
    expect(byId.get('J11')).toBe('nested container real drop verifies parentId+local rect');
    expect(byId.get('J12')).toBe('desktop/tablet/mobile switch keeps node+handles top-hit');
    expect(byId.get('J13')).toBe('edit page A\u2192B\u2192A preserves save');
    expect(byId.get('J14')).toBe('reload preserves A text+document checksum');
    expect(byId.get('J15')).toBe('complete drag on A then B same-ID node remains unmoved');
    expect(byId.get('J16')).toBe('builder header search topmost open/close and canvas scroll unchanged');
    expect(byId.get('J17')).toBe('public header search button/overlay/close all top-hit');
    expect(byId.get('J18')).toBe('AI consultation default collapsed/non-obscuring and launcher/dialog top-hit');
    expect(byId.get('J19')).toBe('real Publish\u2192preflight\u2192confirm\u2192HTTP200\u2192success UI');
    expect(byId.get('J20')).toBe('public URL verifies published title/image then real CTA click');
  });
});

describe('WB-R07 journey manifest — validator invariants', () => {
  function cloneCanonical(): JourneyEntry[] {
    return JOURNEY_ENTRIES.map((entry) => ({ ...entry }));
  }

  it('rejects a manifest with a missing entry (completeness)', () => {
    const entries = cloneCanonical();
    const removed = entries.splice(9, 1)[0]; // remove J10
    expect(removed.id).toBe('J10');

    const result = validateJourneyManifest(entries);
    expect(result.ok).toBe(false);
    expect(result.missing).toContain('J10');
    expect(result.errors.some((error) => error.includes('missing journey ids'))).toBe(true);
  });

  it('rejects a manifest with a duplicate id (uniqueness)', () => {
    const entries = cloneCanonical();
    // Replace the last entry's id with an existing id (J05) -> duplicate J05, missing J20.
    entries[entries.length - 1] = { ...entries[entries.length - 1], id: 'J05', number: 5 };

    const result = validateJourneyManifest(entries);
    expect(result.ok).toBe(false);
    expect(result.duplicates).toContain('J05');
    expect(result.errors.some((error) => error.includes('duplicate journey ids'))).toBe(true);
  });

  it('rejects an out-of-order manifest (ordering)', () => {
    const entries = cloneCanonical();
    // Swap J03 and J04 -> ids no longer strictly ascending, but all 20 unique ids remain.
    const temp = entries[2];
    entries[2] = entries[3];
    entries[3] = temp;

    const result = validateJourneyManifest(entries);
    expect(result.ok).toBe(false);
    expect(result.errors.some((error) => error.includes('ascending numeric order'))).toBe(true);
    // Completeness/uniqueness are independently still satisfied for this swap.
    expect(result.missing).toEqual([]);
    expect(result.duplicates).toEqual([]);
  });

  it('rejects a shape-invalid entry (bad id)', () => {
    const entries = cloneCanonical();
    entries[0] = { ...entries[0], id: 'XX1', description: 'bad' };

    const result = validateJourneyManifest(entries);
    expect(result.ok).toBe(false);
    expect(result.missing).toContain('J01');
    expect(result.errors.some((error) => error.includes('J01'))).toBe(true);
  });

  it('rejects an empty description', () => {
    const entries = cloneCanonical();
    entries[0] = { ...entries[0], description: '   ' };

    const result = validateJourneyManifest(entries);
    expect(result.ok).toBe(false);
    expect(result.errors.some((error) => error.includes('empty description'))).toBe(true);
  });

  it('rejects a non-empty canonical description drift', () => {
    const entries = cloneCanonical();
    entries[0] = {
      ...entries[0],
      description: 'attorney title click may select any nearby node',
      line: 'J01 attorney title click may select any nearby node',
    };

    const result = validateJourneyManifest(entries);
    expect(result.ok).toBe(false);
    expect(result.errors.some((error) => error.includes('canonical journey description'))).toBe(true);
  });

  it('rejects extra unexpected ids', () => {
    const entries = cloneCanonical();
    entries.push({ id: 'J21', number: 21, description: 'extra', line: 'J21 extra' });

    const result = validateJourneyManifest(entries);
    expect(result.ok).toBe(false);
    expect(result.unexpected).toContain('J21');
  });

  it('accepts the canonical entries passed by reference without mutation', () => {
    const snapshot = JOURNEY_ENTRIES.map((entry) => ({ ...entry }));
    validateJourneyManifest(JOURNEY_ENTRIES);
    expect(JOURNEY_ENTRIES.map((entry) => ({ ...entry }))).toEqual(snapshot);
  });
});

/**
 * WB-R07 journey manifest — canonical source of truth for the 20 real-pointer
 * builder/editor journeys (J01–J20).
 *
 * Source string: roadmap + /root/wb_r07_pointer_gate_audit report.
 *
 * This module is intentionally pure (no filesystem, no Playwright, no runtime
 * state). It only (a) declares the canonical entries and (b) validates that an
 * arbitrary list satisfies completeness, uniqueness, and ordering invariants.
 * The exact id strings and descriptions are frozen and exported so callers can
 * assert byte-for-byte parity.
 */

export const JOURNEY_MANIFEST_SOURCE =
  'roadmap + /root/wb_r07_pointer_gate_audit report';

export interface JourneyEntry {
  /** Canonical id, e.g. "J01". */
  readonly id: string;
  /** Numeric suffix, e.g. 1 for J01. */
  readonly number: number;
  /** Exact canonical description (text after the id). */
  readonly description: string;
  /** Full canonical line, e.g. "J01 attorney container ...". */
  readonly line: string;
}

export const JOURNEY_IDS = Object.freeze([
  'J01', 'J02', 'J03', 'J04', 'J05', 'J06', 'J07', 'J08', 'J09', 'J10',
  'J11', 'J12', 'J13', 'J14', 'J15', 'J16', 'J17', 'J18', 'J19', 'J20',
] as const);

export type JourneyId = typeof JOURNEY_IDS[number];

/**
 * The 20 canonical entries in fixed ascending order. Descriptions are the exact
 * strings from the WB-R07 work order; do not rephrase without an updated source.
 */
export const JOURNEY_ENTRIES: readonly JourneyEntry[] = Object.freeze([
  makeEntry('J01', 'attorney container selected then title click selects exact child only'),
  makeEntry('J02', 'intro select/dblclick/cancel preserves position+target'),
  makeEntry('J03', 'inline toolbar commit persists draft/reload'),
  makeEntry('J04', 'small pointer jitter does not move node'),
  makeEntry('J05', 'real node drag/release/undo'),
  makeEntry('J06', 'all 8 resize handles real drag/undo'),
  makeEntry('J07', 'rotation handle real drag/readout/undo'),
  makeEntry('J08', 'Shift multiselect + toolbar forward/back/duplicate/delete'),
  makeEntry('J09', 'Add panel widget preset real drag/drop'),
  makeEntry('J10', 'section template real drag/drop'),
  makeEntry('J11', 'nested container real drop verifies parentId+local rect'),
  makeEntry('J12', 'desktop/tablet/mobile switch keeps node+handles top-hit'),
  makeEntry('J13', 'edit page A\u2192B\u2192A preserves save'),
  makeEntry('J14', 'reload preserves A text+document checksum'),
  makeEntry('J15', 'complete drag on A then B same-ID node remains unmoved'),
  makeEntry('J16', 'builder header search topmost open/close and canvas scroll unchanged'),
  makeEntry('J17', 'public header search button/overlay/close all top-hit'),
  makeEntry('J18', 'AI consultation default collapsed/non-obscuring and launcher/dialog top-hit'),
  makeEntry('J19', 'real Publish\u2192preflight\u2192confirm\u2192HTTP200\u2192success UI'),
  makeEntry('J20', 'public URL verifies published title/image then real CTA click'),
]) as readonly JourneyEntry[];

export const EXPECTED_JOURNEY_IDS: readonly string[] = Object.freeze(
  [...JOURNEY_IDS],
);

export const EXPECTED_JOURNEY_COUNT = JOURNEY_ENTRIES.length;

function makeEntry(id: string, description: string): JourneyEntry {
  const match = /^J(\d{2})$/.exec(id);
  if (!match) throw new Error(`Invalid journey id literal: ${id}`);
  return Object.freeze({
    id,
    number: Number.parseInt(match[1], 10),
    description,
    line: `${id} ${description}`,
  });
}

export interface ManifestValidationResult {
  readonly ok: boolean;
  readonly errors: readonly string[];
  readonly ids: readonly string[];
  readonly missing: readonly string[];
  readonly unexpected: readonly string[];
  readonly duplicates: readonly string[];
}

const ID_PATTERN = /^J(\d{2})$/;

function idNumber(id: string): number | null {
  const match = ID_PATTERN.exec(id);
  return match ? Number.parseInt(match[1], 10) : null;
}

/**
 * Validate an arbitrary list of entries against the canonical invariants:
 *
 * 1. Shape — every entry has a J## id and a non-empty description.
 * 2. Completeness — the id set is exactly {J01..J20}.
 * 3. Uniqueness — no duplicate ids.
 * 4. Order — ids appear in strictly ascending numeric order.
 *
 * Returns a structured result instead of throwing so callers (and tests) can
 * inspect which invariant failed. The canonical {@link JOURNEY_ENTRIES} always
 * validates with `ok: true`.
 */
export function validateJourneyManifest(
  entries: readonly Readonly<JourneyEntry>[],
): ManifestValidationResult {
  const errors: string[] = [];
  const ids: string[] = [];
  const seen = new Map<string, number>();
  const duplicates: string[] = [];
  let shapeOk = true;

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    if (!entry || typeof entry !== 'object') {
      errors.push(`entries[${index}] is not an object`);
      shapeOk = false;
      continue;
    }
    const id = typeof entry.id === 'string' ? entry.id : '';
    const description = typeof entry.description === 'string' ? entry.description : '';
    if (!ID_PATTERN.test(id)) {
      errors.push(`entries[${index}].id "${id}" is not a valid J## id`);
      shapeOk = false;
    }
    if (description.trim().length === 0) {
      errors.push(`entries[${index}] (${id || '?'}) has an empty description`);
      shapeOk = false;
    }
    const canonical = JOURNEY_ENTRIES.find((candidate) => candidate.id === id);
    if (canonical && (
      description !== canonical.description
      || entry.number !== canonical.number
      || entry.line !== canonical.line
    )) {
      errors.push(`entries[${index}] (${id}) does not match the canonical journey description`);
    }
    ids.push(id);
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count + 1 > 1 && !duplicates.includes(id)) duplicates.push(id);
  }

  // Completeness against the canonical id set.
  const present = new Set(ids.filter((id) => ID_PATTERN.test(id)));
  const expected = new Set(EXPECTED_JOURNEY_IDS);
  const missing = EXPECTED_JOURNEY_IDS.filter((id) => !present.has(id));
  const unexpected = ids.filter((id) => ID_PATTERN.test(id) && !expected.has(id));
  if (missing.length > 0) {
    errors.push(`missing journey ids: ${missing.join(', ')}`);
  }
  if (unexpected.length > 0) {
    errors.push(`unexpected journey ids: ${unexpected.join(', ')}`);
  }
  if (duplicates.length > 0) {
    errors.push(`duplicate journey ids: ${duplicates.join(', ')}`);
  }

  // Order — strictly ascending numeric suffix over the well-formed ids.
  let lastNum: number | null = null;
  let orderBroken = false;
  for (const id of ids) {
    const num = idNumber(id);
    if (num === null) continue;
    if (lastNum !== null && num <= lastNum) {
      orderBroken = true;
      break;
    }
    lastNum = num;
  }
  if (orderBroken) {
    errors.push('journey ids are not in strictly ascending numeric order');
  }

  return Object.freeze({
    ok: shapeOk && errors.length === 0,
    errors: Object.freeze(errors.slice()),
    ids: Object.freeze(ids.slice()),
    missing: Object.freeze(missing.slice()),
    unexpected: Object.freeze(unexpected.slice()),
    duplicates: Object.freeze(duplicates.slice()),
  });
}

/**
 * Convenience: the canonical list validates cleanly. Used by smoke/policy tests
 * to prove the frozen constant is internally consistent.
 */
export function assertCanonicalManifest(): readonly JourneyEntry[] {
  const result = validateJourneyManifest(JOURNEY_ENTRIES);
  if (!result.ok) {
    throw new Error(
      `Canonical journey manifest is internally invalid: ${result.errors.join('; ')}`,
    );
  }
  return JOURNEY_ENTRIES;
}

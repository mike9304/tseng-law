import type { BuilderCanvasDocument } from './types';
import { SEED_VERSION } from './seed-home';

/**
 * Decides whether the builder entry point may implicitly replace the stored
 * home draft with the factory composite seed.
 *
 * The document-level `updatedBy` is NOT evidence that a draft is pristine:
 * seed migrations only append suffixes to it and editor saves round-trip it
 * unchanged, so a heavily user-edited home can still carry
 * `home-seed-v11+...` forever. Pristine detection therefore consults the
 * record-level `updatedBy`.
 *
 * Two hard rules, both learned from the 2026-07-02 home data-loss event:
 * 1. A record stamped 'admin' (editor draft PUT) is user work and is never
 *    implicitly reseeded — only ?reseed=1 (force) may replace it.
 * 2. Absence of the 'admin' marker is NOT evidence of pristineness: the
 *    decompose route, parity-migration rewrites, and translation sync all
 *    persist real content without stamping the record. The destructive
 *    pristine-decomposed-seed replacement therefore requires the POSITIVE
 *    seed marker below; unmarked records are preserved.
 */

export const USER_DRAFT_UPDATED_BY = 'admin';

/**
 * Record-level marker for factory seed writes (seed pipeline, builder-entry
 * reseed). Only records carrying this marker are eligible for the implicit
 * pristine-decomposed-seed replacement; an unmarked record may be real content
 * from a writer that predates stamping, so it is never implicitly destroyed.
 */
export const SEED_DRAFT_UPDATED_BY = 'seed';

export function canPersistHomeDraftRenderMigration(recordUpdatedBy: string | undefined): boolean {
  return recordUpdatedBy === SEED_DRAFT_UPDATED_BY;
}

const LEGACY_SANDBOX_NODE_IDS = new Set([
  'headline-1',
  'support-copy-1',
  'cta-button-1',
  'hero-image-1',
]);

export type HomeDraftReseedReason =
  | 'force'
  | 'missing-draft'
  | 'empty-draft'
  | 'legacy-seed'
  | 'pristine-decomposed-seed'
  | 'missing-hero'
  | 'legacy-sandbox-draft';

export type HomeDraftReseedDecision = {
  readonly reseed: boolean;
  readonly reason: HomeDraftReseedReason | null;
};

export type HomeDraftRecordLike = {
  readonly updatedBy?: string;
  readonly document: BuilderCanvasDocument;
};

export type HomeDraftReseedInput = {
  readonly isHomePage: boolean;
  readonly force: boolean;
  readonly allowPristineDecomposedHome: boolean;
  readonly record: HomeDraftRecordLike | null;
};

const NO_RESEED: HomeDraftReseedDecision = { reseed: false, reason: null };

export function decideHomeDraftReseed(input: HomeDraftReseedInput): HomeDraftReseedDecision {
  if (!input.isHomePage) return NO_RESEED;
  if (input.force) return { reseed: true, reason: 'force' };
  if (!input.record) return { reseed: true, reason: 'missing-draft' };

  const { updatedBy: recordUpdatedBy, document } = input.record;
  const nodes = document.nodes ?? [];

  const docUpdatedBy = document.updatedBy ?? '';
  const isCurrentSeed = docUpdatedBy === SEED_VERSION || docUpdatedBy.startsWith(`${SEED_VERSION}+`);
  const isLegacySeed =
    (docUpdatedBy.startsWith('home-seed-v') && !isCurrentSeed) || docUpdatedBy === 'site-page-seed';
  const isUserSavedDraft = recordUpdatedBy === USER_DRAFT_UPDATED_BY;
  const isSeedWriteRecord = recordUpdatedBy === SEED_DRAFT_UPDATED_BY;
  const hasHero = nodes.some((node) => node.id === 'home-hero-root' || node.id === 'home-hero');
  const hasDecomposedHero = nodes.some((node) => node.id === 'home-hero-root');
  const isLegacySandboxDraft = nodes.some((node) => LEGACY_SANDBOX_NODE_IDS.has(node.id));

  if (nodes.length === 0) return { reseed: true, reason: 'empty-draft' };
  if (isUserSavedDraft) return NO_RESEED;
  if (isLegacySeed) return { reseed: true, reason: 'legacy-seed' };
  if (hasDecomposedHero && isCurrentSeed && isSeedWriteRecord && !input.allowPristineDecomposedHome) {
    return { reseed: true, reason: 'pristine-decomposed-seed' };
  }
  if (!hasHero) return { reseed: true, reason: 'missing-hero' };
  if (isLegacySandboxDraft) return { reseed: true, reason: 'legacy-sandbox-draft' };
  return NO_RESEED;
}

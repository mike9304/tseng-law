import { describe, expect, it } from 'vitest';
import {
  createHomePageCanvasDocument,
  createHomePageCanvasDocumentDecomposed,
  SEED_VERSION,
} from '../seed-home';
import type { BuilderCanvasDocument } from '../types';
import {
  canPersistHomeDraftRenderMigration,
  decideHomeDraftReseed,
  SEED_DRAFT_UPDATED_BY,
  USER_DRAFT_UPDATED_BY,
  type HomeDraftReseedInput,
} from '../home-draft-reseed';

function baseInput(overrides: Partial<HomeDraftReseedInput>): HomeDraftReseedInput {
  return {
    isHomePage: true,
    force: false,
    allowPristineDecomposedHome: false,
    record: null,
    ...overrides,
  };
}

function withDocumentUpdatedBy(
  document: BuilderCanvasDocument,
  updatedBy: string,
): BuilderCanvasDocument {
  return { ...document, updatedBy };
}

describe('decideHomeDraftReseed', () => {
  it('never reseeds non-home pages, even without a record', () => {
    expect(decideHomeDraftReseed(baseInput({ isHomePage: false }))).toEqual({
      reseed: false,
      reason: null,
    });
  });

  it('reseeds on explicit force regardless of record state', () => {
    const record = {
      updatedBy: USER_DRAFT_UPDATED_BY,
      document: createHomePageCanvasDocumentDecomposed('ko'),
    };
    expect(decideHomeDraftReseed(baseInput({ force: true, record }))).toEqual({
      reseed: true,
      reason: 'force',
    });
  });

  it('reseeds when the draft record is missing', () => {
    expect(decideHomeDraftReseed(baseInput({ record: null }))).toEqual({
      reseed: true,
      reason: 'missing-draft',
    });
  });

  it('reseeds when the draft document has no nodes', () => {
    const record = {
      document: { ...createHomePageCanvasDocument('ko'), nodes: [] },
    };
    expect(decideHomeDraftReseed(baseInput({ record }))).toEqual({
      reseed: true,
      reason: 'empty-draft',
    });
  });

  it('reseeds a draft still carrying an older seed version', () => {
    const record = {
      document: withDocumentUpdatedBy(createHomePageCanvasDocument('ko'), 'home-seed-v6'),
    };
    expect(decideHomeDraftReseed(baseInput({ record }))).toEqual({
      reseed: true,
      reason: 'legacy-seed',
    });
  });

  it('reseeds a pristine decomposed home whose record carries the explicit seed write marker', () => {
    const record = {
      updatedBy: SEED_DRAFT_UPDATED_BY,
      document: withDocumentUpdatedBy(createHomePageCanvasDocumentDecomposed('ko'), SEED_VERSION),
    };
    expect(decideHomeDraftReseed(baseInput({ record }))).toEqual({
      reseed: true,
      reason: 'pristine-decomposed-seed',
    });
  });

  it('treats seed-suffixed document updatedBy as still pristine when the record is seed-marked', () => {
    const record = {
      updatedBy: SEED_DRAFT_UPDATED_BY,
      document: withDocumentUpdatedBy(
        createHomePageCanvasDocumentDecomposed('ko'),
        `${SEED_VERSION}+editor-parity`,
      ),
    };
    expect(decideHomeDraftReseed(baseInput({ record }))).toEqual({
      reseed: true,
      reason: 'pristine-decomposed-seed',
    });
  });

  it('does NOT reseed a decomposed home whose record has no marker (decompose-route data-loss regression)', () => {
    // The decompose API and parity-migration rewrites persist real content
    // without a record-level updatedBy. Absence of the 'admin' marker is NOT
    // evidence of pristineness — destroying such a draft caused the 2026-07-02
    // home data-loss event.
    const record = {
      document: withDocumentUpdatedBy(createHomePageCanvasDocumentDecomposed('ko'), SEED_VERSION),
    };
    expect(decideHomeDraftReseed(baseInput({ record }))).toEqual({
      reseed: false,
      reason: null,
    });
  });

  it('never implicitly reseeds a user-saved draft, even when its document carries a legacy seed version', () => {
    const record = {
      updatedBy: USER_DRAFT_UPDATED_BY,
      document: withDocumentUpdatedBy(createHomePageCanvasDocument('ko'), 'home-seed-v6'),
    };
    expect(decideHomeDraftReseed(baseInput({ record }))).toEqual({
      reseed: false,
      reason: null,
    });
  });

  it('never implicitly reseeds a user-saved draft that lost its hero', () => {
    const document = createHomePageCanvasDocumentDecomposed('ko');
    const record = {
      updatedBy: USER_DRAFT_UPDATED_BY,
      document: {
        ...document,
        nodes: document.nodes.filter(
          (node) => node.id !== 'home-hero-root' && node.id !== 'home-hero',
        ),
      },
    };
    expect(decideHomeDraftReseed(baseInput({ record }))).toEqual({
      reseed: false,
      reason: null,
    });
  });

  it('does NOT reseed a decomposed home the user has saved through the editor', () => {
    const record = {
      updatedBy: USER_DRAFT_UPDATED_BY,
      document: withDocumentUpdatedBy(
        createHomePageCanvasDocumentDecomposed('ko'),
        `${SEED_VERSION}+editor-parity`,
      ),
    };
    expect(decideHomeDraftReseed(baseInput({ record }))).toEqual({
      reseed: false,
      reason: null,
    });
  });

  it('keeps a pristine decomposed home when decomposedHome=1 explicitly allows it', () => {
    const record = {
      document: withDocumentUpdatedBy(createHomePageCanvasDocumentDecomposed('ko'), SEED_VERSION),
    };
    expect(
      decideHomeDraftReseed(baseInput({ record, allowPristineDecomposedHome: true })),
    ).toEqual({ reseed: false, reason: null });
  });

  it('reseeds when the home draft lost its hero entirely', () => {
    const document = createHomePageCanvasDocumentDecomposed('ko');
    const record = {
      document: {
        ...document,
        nodes: document.nodes.filter(
          (node) => node.id !== 'home-hero-root' && node.id !== 'home-hero',
        ),
      },
    };
    expect(decideHomeDraftReseed(baseInput({ record }))).toEqual({
      reseed: true,
      reason: 'missing-hero',
    });
  });

  it('keeps a user-saved composite home untouched', () => {
    const record = {
      updatedBy: USER_DRAFT_UPDATED_BY,
      document: createHomePageCanvasDocument('ko'),
    };
    expect(decideHomeDraftReseed(baseInput({ record }))).toEqual({
      reseed: false,
      reason: null,
    });
  });
});

describe('canPersistHomeDraftRenderMigration', () => {
  it('allows render-time migrations only for seed-owned records', () => {
    expect(canPersistHomeDraftRenderMigration(SEED_DRAFT_UPDATED_BY)).toBe(true);
    expect(canPersistHomeDraftRenderMigration(USER_DRAFT_UPDATED_BY)).toBe(false);
    expect(canPersistHomeDraftRenderMigration(undefined)).toBe(false);
  });
});

import { describe, expect, it } from 'vitest';
import { createHomePageCanvasDocumentDecomposed } from '../seed-home';
import { HERO_SEARCH_WRAPPER_Y } from '../decompose-hero';
import { upgradeHomeHeroSearchForm } from '../home-hero-search-migration';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '../types';
import type { Locale } from '@/lib/locales';

function findNode(document: BuilderCanvasDocument, id: string): BuilderCanvasNode {
  const node = document.nodes.find((candidate) => candidate.id === id);
  if (!node) throw new Error(`missing fixture node ${id}`);
  return node;
}

// Builds a decomposed home whose hero-search nodes carry a clearly-wrong legacy
// geometry (mirrors the raw stored draft shape the draft GET used to hand back
// before this migration). This lets every locale branch prove it runs and
// produces the expected render-parity values.
function buildLegacyRawHome(locale: Locale): BuilderCanvasDocument {
  const document = createHomePageCanvasDocumentDecomposed(locale);
  for (const node of document.nodes) {
    if (node.id === 'home-hero-search-wrapper') {
      node.rect = { x: 200, y: 0, width: 999, height: 62 };
    } else if (node.id === 'home-hero-search-container') {
      node.rect = { x: 0, y: 0, width: 999, height: 62 };
    }
  }
  return document;
}

describe('upgradeHomeHeroSearchForm shared migration', () => {
  it('projects ko hero search to wrapper x51/width760 and container width760 at HERO_SEARCH_WRAPPER_Y', () => {
    const result = upgradeHomeHeroSearchForm(buildLegacyRawHome('ko'), 'ko');

    const wrapper = findNode(result, 'home-hero-search-wrapper');
    const container = findNode(result, 'home-hero-search-container');

    expect(wrapper.rect).toEqual({ x: 51, y: HERO_SEARCH_WRAPPER_Y, width: 760, height: 62 });
    expect(container.rect).toEqual({ x: 0, y: 0, width: 760, height: 62 });
  });

  it('projects zh-hant hero search to wrapper x51/width1151 and container width1151', () => {
    const result = upgradeHomeHeroSearchForm(buildLegacyRawHome('zh-hant'), 'zh-hant');

    const wrapper = findNode(result, 'home-hero-search-wrapper');
    const container = findNode(result, 'home-hero-search-container');

    expect(wrapper.rect).toEqual({ x: 51, y: HERO_SEARCH_WRAPPER_Y, width: 1151, height: 62 });
    expect(container.rect).toEqual({ x: 0, y: 0, width: 1151, height: 62 });
  });

  it('projects en hero search to wrapper x0/width1280 and container width1151', () => {
    const result = upgradeHomeHeroSearchForm(buildLegacyRawHome('en'), 'en');

    const wrapper = findNode(result, 'home-hero-search-wrapper');
    const container = findNode(result, 'home-hero-search-container');

    expect(wrapper.rect).toEqual({ x: 0, y: HERO_SEARCH_WRAPPER_Y, width: 1280, height: 62 });
    expect(container.rect).toEqual({ x: 0, y: 0, width: 1151, height: 62 });
  });

  it('keeps original updatedAt/updatedBy when stampMetadata is disabled', () => {
    const original = buildLegacyRawHome('ko');
    const originalUpdatedAt = original.updatedAt;
    const originalUpdatedBy = original.updatedBy;

    const result = upgradeHomeHeroSearchForm(original, 'ko', { stampMetadata: false });

    expect(result.updatedAt).toBe(originalUpdatedAt);
    expect(result.updatedBy).toBe(originalUpdatedBy);

    // Geometry is still repaired even though metadata is preserved.
    const wrapper = findNode(result, 'home-hero-search-wrapper');
    expect(wrapper.rect.x).toBe(51);
    expect(wrapper.rect.width).toBe(760);
  });

  it('stamps +hero-search-parity metadata by default when nodes change', () => {
    const original = buildLegacyRawHome('ko');
    // Pin a fixed past stamp so the migration's fresh `new Date()` stamp is
    // guaranteed to differ (avoids a same-millisecond flake between the two
    // `new Date()` calls in build vs. stamp).
    original.updatedAt = '2026-01-01T00:00:00.000Z';

    const result = upgradeHomeHeroSearchForm(original, 'ko');

    expect(result.updatedBy).toBe(`${original.updatedBy}+hero-search-parity`);
    expect(result.updatedAt).not.toBe(original.updatedAt);
    expect(new Date(result.updatedAt).getTime()).toBeGreaterThan(
      new Date(original.updatedAt).getTime(),
    );
  });

  it('is idempotent: re-running on a normalized document returns the same reference', () => {
    const normalized = upgradeHomeHeroSearchForm(buildLegacyRawHome('ko'), 'ko');

    const reRun = upgradeHomeHeroSearchForm(normalized, 'ko');

    expect(reRun).toBe(normalized);
  });

  it('returns the same reference when no hero-search nodes need repair', () => {
    const document = createHomePageCanvasDocumentDecomposed('en');

    const result = upgradeHomeHeroSearchForm(document, 'en');

    // The en seed already matches the render-parity geometry, so nothing changes.
    expect(result).toBe(document);
  });
});

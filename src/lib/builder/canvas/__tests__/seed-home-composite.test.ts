import { describe, it, expect } from 'vitest';
import {
  createHomePageCanvasDocument,
  createHomePageCanvasDocumentDecomposed,
} from '../seed-home';
import { buildResponsiveStylesheet } from '@/lib/builder/site/responsive-stylesheet';
import { builderCanvasDocumentSchema, type BuilderCanvasDocument } from '../types';
import type { Locale } from '@/lib/locales';

// The default home seed must be a live-reflecting composite stack whose sections,
// in order, mirror the live tseng-law.com home (home-legacy.tsx).
const EXPECTED_COMPOSITE_KEYS = [
  'hero-search',
  'insights-archive',
  'services-bento',
  'home-attorney',
  'home-case-results',
  'home-stats',
  'faq-accordion',
  'office-map-tabs',
  'home-contact-cta',
];
const LOCALES: Locale[] = ['ko', 'zh-hant', 'en'];

function countResponsiveNodes(doc: BuilderCanvasDocument): number {
  return doc.nodes.filter((node) => Boolean(node.responsive?.tablet?.rect || node.responsive?.mobile?.rect)).length;
}

describe('live-reflecting composite home seed', () => {
  for (const locale of LOCALES) {
    it(`home (${locale}) is a schema-valid composite stack mirroring the live sections`, () => {
      const doc = builderCanvasDocumentSchema.parse(createHomePageCanvasDocument(locale));
      expect(doc.locale).toBe(locale);
      // Invariant: the composite home must NOT carry the decomposed 'home-hero-root'
      // sentinel, so the editor's home-migration pipeline (gated on it) skips it.
      expect(doc.nodes.some((node) => node.id === 'home-hero-root')).toBe(false);

      const composites = doc.nodes.filter((node) => node.kind === 'composite');
      expect(composites).toHaveLength(EXPECTED_COMPOSITE_KEYS.length);

      const keys = composites.map(
        (node) => (node as { content: { componentKey: string } }).content.componentKey,
      );
      expect(keys).toEqual(EXPECTED_COMPOSITE_KEYS);

      for (const node of composites) {
        expect(
          (node as { content: { config: { locale?: string } } }).content.config.locale,
        ).toBe(locale);
      }
    });
  }

  it('preserves the editable decomposed home as the decompose-to-edit target', () => {
    const doc = createHomePageCanvasDocumentDecomposed('ko');
    // The decomposed home keeps its granular layout (and its 'home-hero-root'
    // sentinel that the admin migrations + locale repair key off of).
    expect(doc.nodes.some((node) => node.id === 'home-hero-root')).toBe(true);
    expect(doc.nodes.some((node) => node.kind === 'composite')).toBe(false);
  });

  it('lets the real home composite stack use the live components responsive flow', () => {
    const doc = createHomePageCanvasDocument('ko');

    expect(countResponsiveNodes(doc)).toBe(0);
    expect(buildResponsiveStylesheet(doc.nodes)).toBe('');
  });

  it('keeps responsive CSS for the decomposed edit target', () => {
    const doc = createHomePageCanvasDocumentDecomposed('ko');

    expect(countResponsiveNodes(doc)).toBeGreaterThan(0);
    expect(buildResponsiveStylesheet(doc.nodes)).toContain('@media (max-width: 767px)');
  });
});

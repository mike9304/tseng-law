import { describe, expect, it } from 'vitest';
import {
  EN_HOME_HERO_SUBTITLE,
  EN_HOME_SERVICES_DESCRIPTION,
} from '@/data/en-service-scope';
import { projectPublishedEnHomeCopy } from '@/lib/builder/site/en-home-copy';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

const STOCK_HERO_SUBTITLE =
  'Our multilingual legal team provides practical guidance for Taiwan investment, disputes, and cross-border matters.';
const STOCK_SERVICES_DESCRIPTION =
  'Structured support for investment, litigation, and advisory matters in Taiwan.';

const EN_HOME = { slugPath: '', locale: 'en' as const };

const STOCK_BINDING: NonNullable<BuilderCanvasNode['dataBinding']> = {
  targetId: 'home.services.list',
  recordIndex: 0,
  fields: { text: 'title' },
};

function textNode(partial: {
  id: string;
  text: string;
  dataBinding?: BuilderCanvasNode['dataBinding'];
}): BuilderCanvasNode {
  return {
    id: partial.id,
    kind: 'text',
    rect: { x: 0, y: 0, width: 100, height: 40 },
    style: { borderRadius: 0 },
    zIndex: 2,
    rotation: 0,
    locked: false,
    visible: true,
    ...(partial.dataBinding ? { dataBinding: partial.dataBinding } : {}),
    content: {
      text: partial.text,
      fontSize: 17,
      className: 'hero-subtitle',
    },
  } as BuilderCanvasNode;
}

function compositeNode(partial: {
  id?: string;
  componentKey: string;
  locale?: string;
  overrides?: Record<string, string>;
  extraConfig?: Record<string, unknown>;
  dataBinding?: BuilderCanvasNode['dataBinding'];
}): BuilderCanvasNode {
  return {
    id: partial.id ?? `composite-${partial.componentKey}`,
    kind: 'composite',
    rect: { x: 0, y: 0, width: 1280, height: 400 },
    style: { borderRadius: 0 },
    zIndex: 1,
    rotation: 0,
    locked: false,
    visible: true,
    ...(partial.dataBinding ? { dataBinding: partial.dataBinding } : {}),
    content: {
      componentKey: partial.componentKey,
      config: {
        ...(partial.locale !== undefined ? { locale: partial.locale } : {}),
        ...(partial.overrides ? { overrides: partial.overrides } : {}),
        ...(partial.extraConfig ?? {}),
      },
    },
  } as BuilderCanvasNode;
}

function project(
  node: BuilderCanvasNode,
  slugPath = EN_HOME.slugPath,
  locale: 'en' | 'ko' | 'zh-hant' = EN_HOME.locale,
) {
  return projectPublishedEnHomeCopy(node, slugPath, locale);
}

describe('projectPublishedEnHomeCopy',
  () => {
    it('replaces exact-stock primitive hero subtitle on unbound EN home',
      () => {
        const node = textNode({ id: 'home-hero-subtitle', text: STOCK_HERO_SUBTITLE });
        const snapshot = structuredClone(node);
        const result = project(node);
        expect(result).not.toBe(node);
        expect(node).toEqual(snapshot);
        expect(result.kind).toBe('text');
        if (result.kind !== 'text') return;
        expect(result.content.text).toBe(EN_HOME_HERO_SUBTITLE);
        expect(result.content.className).toBe('hero-subtitle');
        expect(result.zIndex).toBe(2);
      });

    it('replaces exact-stock primitive services description on unbound EN home',
      () => {
        const node = textNode({ id: 'home-services-description', text: STOCK_SERVICES_DESCRIPTION });
        const snapshot = structuredClone(node);
        const result = project(node);
        expect(result).not.toBe(node);
        expect(node).toEqual(snapshot);
        expect(result.kind).toBe('text');
        if (result.kind !== 'text') return;
        expect(result.content.text).toBe(EN_HOME_SERVICES_DESCRIPTION);
      });

    it('preserves the same ref for custom primitive copy',
      () => {
        const node = textNode({
          id: 'home-hero-subtitle',
          text: 'Custom hero subtitle for this site.',
        });
        expect(project(node)).toBe(node);
      });

    it('preserves the same ref for bound primitive stock nodes',
      () => {
        const node = textNode({
          id: 'home-hero-subtitle',
          text: STOCK_HERO_SUBTITLE,
          dataBinding: STOCK_BINDING,
        });
        expect(project(node)).toBe(node);
      });

    it('preserves the same ref for other page locales',
      () => {
        const node = textNode({ id: 'home-hero-subtitle', text: STOCK_HERO_SUBTITLE });
        expect(project(node, '', 'ko')).toBe(node);
        expect(project(node, '', 'zh-hant')).toBe(node);
      });

    it('preserves the same ref for non-home routes',
      () => {
        const node = textNode({ id: 'home-hero-subtitle', text: STOCK_HERO_SUBTITLE });
        expect(project(node, 'about')).toBe(node);
        expect(project(node, 'services')).toBe(node);
      });

    it('does not invent replacements for unknown primitive ids',
      () => {
        const node = textNode({ id: 'home-hero-title', text: STOCK_HERO_SUBTITLE });
        expect(project(node)).toBe(node);
      });

    it('does not swap stock values across the other known primitive id',
      () => {
        const heroWithServicesCopy = textNode({
          id: 'home-hero-subtitle',
          text: STOCK_SERVICES_DESCRIPTION,
        });
        const servicesWithHeroCopy = textNode({
          id: 'home-services-description',
          text: STOCK_HERO_SUBTITLE,
        });
        expect(project(heroWithServicesCopy)).toBe(heroWithServicesCopy);
        expect(project(servicesWithHeroCopy)).toBe(servicesWithHeroCopy);
      });

    it('updates exact-stock hero-search subtitle override and preserves other fields',
      () => {
        const node = compositeNode({
          componentKey: 'hero-search',
          locale: 'en',
          overrides: {
            subtitle: STOCK_HERO_SUBTITLE,
            headline: 'Keep this custom headline',
          },
          extraConfig: { searchPlaceholder: 'How can we help you?' },
        });
        const snapshot = structuredClone(node);
        const result = project(node);
        expect(result).not.toBe(node);
        expect(node).toEqual(snapshot);
        expect(result.kind).toBe('composite');
        if (result.kind !== 'composite') return;
        expect(result.content.componentKey).toBe('hero-search');
        expect(result.content.config).toMatchObject({
          locale: 'en',
          searchPlaceholder: 'How can we help you?',
          overrides: {
            subtitle: EN_HOME_HERO_SUBTITLE,
            headline: 'Keep this custom headline',
          },
        });
        expect(result.content.config?.overrides).not.toBe(
          (node.content as { config?: { overrides?: unknown } }).config?.overrides,
        );
      });

    it('updates exact-stock services-bento description override and preserves other fields',
      () => {
        const node = compositeNode({
          componentKey: 'services-bento',
          locale: 'en',
          overrides: {
            description: STOCK_SERVICES_DESCRIPTION,
            headline: 'Main Services',
          },
          extraConfig: { id: 'practice' },
        });
        const snapshot = structuredClone(node);
        const result = project(node);
        expect(result).not.toBe(node);
        expect(node).toEqual(snapshot);
        expect(result.kind).toBe('composite');
        if (result.kind !== 'composite') return;
        expect(result.content.config).toMatchObject({
          locale: 'en',
          id: 'practice',
          overrides: {
            description: EN_HOME_SERVICES_DESCRIPTION,
            headline: 'Main Services',
          },
        });
      });

    it('preserves the same ref for custom composite overrides',
      () => {
        const node = compositeNode({
          componentKey: 'hero-search',
          locale: 'en',
          overrides: { subtitle: 'Our custom English hero subtitle.' },
        });
        expect(project(node)).toBe(node);
      });

    it('preserves the same ref for bound composite stock overrides',
      () => {
        const node = compositeNode({
          componentKey: 'hero-search',
          locale: 'en',
          overrides: { subtitle: STOCK_HERO_SUBTITLE },
          dataBinding: STOCK_BINDING,
        });
        expect(project(node)).toBe(node);
      });

    it('preserves the same ref when composite config.locale is not en',
      () => {
        const node = compositeNode({
          componentKey: 'hero-search',
          locale: 'ko',
          overrides: { subtitle: STOCK_HERO_SUBTITLE },
        });
        expect(project(node)).toBe(node);
      });

    it('preserves the same ref when composite locale is missing',
      () => {
        const node = compositeNode({
          componentKey: 'services-bento',
          overrides: { description: STOCK_SERVICES_DESCRIPTION },
        });
        expect(project(node)).toBe(node);
      });

    it('preserves the same ref for other composite component keys',
      () => {
        const node = compositeNode({
          componentKey: 'home-contact-cta',
          locale: 'en',
          overrides: { subtitle: STOCK_HERO_SUBTITLE, description: STOCK_SERVICES_DESCRIPTION },
        });
        expect(project(node)).toBe(node);
      });

    it('preserves the same ref when the matching override key is absent',
      () => {
        const node = compositeNode({
          componentKey: 'hero-search',
          locale: 'en',
          overrides: { headline: STOCK_HERO_SUBTITLE },
        });
        expect(project(node)).toBe(node);
      });

    it('preserves the same ref when composite overrides are missing',
      () => {
        const node = compositeNode({
          componentKey: 'hero-search',
          locale: 'en',
        });
        expect(project(node)).toBe(node);
      });

    it('preserves the same ref when stock text is already the new copy',
      () => {
        const primitive = textNode({ id: 'home-hero-subtitle', text: EN_HOME_HERO_SUBTITLE });
        const composite = compositeNode({
          componentKey: 'services-bento',
          locale: 'en',
          overrides: { description: EN_HOME_SERVICES_DESCRIPTION },
        });
        expect(project(primitive)).toBe(primitive);
        expect(project(composite)).toBe(composite);
      });
  });

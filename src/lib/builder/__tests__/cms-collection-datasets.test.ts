import { describe, expect, it } from 'vitest';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import type { BuilderPageDatasetBinding } from '@/lib/builder/types';
import {
  cmsCollectionTargetId,
  isCmsCollectionTargetId,
  collectionIdFromCmsTargetId,
  findCmsCollection,
  listCmsCollectionBindableTargets,
  resolveCmsCollectionDataset,
  resolveCmsCollectionDatasetByTarget,
} from '@/lib/builder/cms-collection-datasets';
import {
  readBuilderDatasetRepeaterItems,
  cloneBuilderPageDatasetBinding,
  normalizeBuilderPageDatasets,
  createDefaultBuilderPageDatasets,
} from '@/lib/builder/datasets';

function makeCollection(): BuilderCmsCollection {
  const now = '2026-06-02T00:00:00.000Z';
  return {
    collectionId: 'recipes',
    name: '레시피',
    slug: 'recipes',
    description: '사용자 레시피 모음',
    localized: false,
    fields: [
      { fieldId: 'f-title', key: 'title', label: '제목', type: 'text', localized: false, repeated: false, required: true },
      { fieldId: 'f-slug', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true },
      { fieldId: 'f-summary', key: 'summary', label: '요약', type: 'rich-text', localized: false, repeated: false, required: false },
      { fieldId: 'f-cat', key: 'category', label: '분류', type: 'text', localized: false, repeated: false, required: false },
    ],
    indexes: [],
    records: [
      { recordId: 'r1', status: 'published', fields: { title: '김치찌개', slug: 'kimchi-jjigae', summary: '얼큰한 한 끼', category: 'soup' }, createdAt: now, updatedAt: now },
      { recordId: 'r2', status: 'published', fields: { title: '불고기', slug: 'bulgogi', summary: '달콤한 소고기', category: 'main' }, createdAt: now, updatedAt: now },
      { recordId: 'r3', status: 'draft', fields: { title: '비밀 메뉴', slug: 'secret', summary: '아직 공개 전', category: 'soup' }, createdAt: now, updatedAt: now },
      { recordId: 'r4', status: 'published', fields: { title: '된장찌개', slug: 'doenjang-jjigae', summary: '구수한 맛', category: 'soup' }, createdAt: now, updatedAt: now },
    ],
    permissions: { read: ['public'], create: ['admin'], update: ['admin'], delete: ['admin'] },
    createdAt: now,
    updatedAt: now,
  };
}

describe('cms-collection-datasets (WIX-PERFECT #6: data-driven binding)', () => {
  it('builds and round-trips a stable cms target id', () => {
    const id = cmsCollectionTargetId('recipes');
    expect(id).toBe('cms.recipes.list');
    expect(isCmsCollectionTargetId(id)).toBe(true);
    expect(isCmsCollectionTargetId('home.insights.feed')).toBe(false);
    expect(collectionIdFromCmsTargetId(id)).toBe('recipes');
    expect(collectionIdFromCmsTargetId('home.services.list')).toBeNull();
  });

  it('enumerates a user collection as a bindable target with its own fields', () => {
    const site = { cmsCollections: [makeCollection()] };
    const targets = listCmsCollectionBindableTargets(site);
    expect(targets).toHaveLength(1);
    expect(targets[0].targetId).toBe('cms.recipes.list');
    expect(targets[0].collectionId).toBe('recipes');
    expect(targets[0].label).toBe('레시피');
    expect(targets[0].recordCount).toBe(4);
    expect(targets[0].bindableFields.map((f) => f.key)).toEqual(['title', 'slug', 'summary', 'category']);
  });

  it('resolves published records into bindable rows (the core create→bind→render loop)', () => {
    const collection = makeCollection();
    const rows = resolveCmsCollectionDataset(collection, { routeBase: '/ko/recipes' });
    // draft excluded → 3 published
    expect(rows).toHaveLength(3);
    const first = rows[0];
    expect(first.recordId).toBe('r1');
    expect(first.primaryLabel).toBe('김치찌개');
    expect(first.secondaryLabel).toBe('얼큰한 한 끼');
    expect(first.routePath).toBe('/ko/recipes/kimchi-jjigae');
    expect(first.fieldValues.title).toBe('김치찌개');
    expect(first.fieldValues.category).toBe('soup');
    expect(first.fieldValues.href).toBe('/ko/recipes/kimchi-jjigae');
  });

  it('applies the filter → sort → limit binding contract', () => {
    const collection = makeCollection();
    const rows = resolveCmsCollectionDataset(collection, {
      filters: [{ fieldId: 'category', operator: 'equals', value: 'soup' }],
      sort: [{ fieldId: 'title', direction: 'asc' }],
      limit: 1,
      routeBase: '/ko/recipes',
    });
    // soup + published = 김치찌개, 된장찌개 (secret is draft) → sorted asc → 김치찌개 first → limit 1
    expect(rows).toHaveLength(1);
    expect(rows[0].fieldValues.category).toBe('soup');
    // both soup records are published; sorted ascending by title
    const all = resolveCmsCollectionDataset(collection, {
      filters: [{ fieldId: 'category', operator: 'equals', value: 'soup' }],
      sort: [{ fieldId: 'title', direction: 'asc' }],
      routeBase: '/ko/recipes',
    });
    expect(all.map((r) => r.recordId)).toEqual(['r1', 'r4']); // 김치찌개, 된장찌개 — neither draft
  });

  it('finds a collection and resolves by target id from a site doc', () => {
    const site = { cmsCollections: [makeCollection()] };
    expect(findCmsCollection(site, 'recipes')?.name).toBe('레시피');
    expect(findCmsCollection(site, 'missing')).toBeNull();
    const rows = resolveCmsCollectionDatasetByTarget(site, 'cms.recipes.list', { limit: 2, routeBase: '/ko/recipes' });
    expect(rows).toHaveLength(2);
    expect(resolveCmsCollectionDatasetByTarget(site, 'home.insights.feed')).toEqual([]);
    expect(resolveCmsCollectionDatasetByTarget(site, 'cms.missing.list')).toEqual([]);
  });

  it('safely handles a site with no collections', () => {
    expect(listCmsCollectionBindableTargets(undefined)).toEqual([]);
    expect(listCmsCollectionBindableTargets({})).toEqual([]);
    expect(resolveCmsCollectionDatasetByTarget(undefined, 'cms.x.list')).toEqual([]);
  });
});

describe('cms-collection-datasets SLICE 2: bound repeater renders user collection records', () => {
  function cmsBinding(over: Partial<BuilderPageDatasetBinding> = {}): BuilderPageDatasetBinding {
    // Derive from a real default binding (valid sectionKey/targetId), then attach the
    // user-collection source — the binding reuses a built-in target id as the carrier.
    const base = createDefaultBuilderPageDatasets('home').find((b) => b.targetId === 'home.insights.feed')!;
    return { ...base, cmsCollectionId: 'recipes', ...over };
  }

  it('readBuilderDatasetRepeaterItems renders the bound USER collection, not the built-in', () => {
    const site = { cmsCollections: [makeCollection()] };
    const items = readBuilderDatasetRepeaterItems('home.insights.feed', cmsBinding(), 'ko', [], site);
    // 3 published recipes (draft excluded) — proves the binding sourced the user collection
    expect(items.length).toBe(3);
    const titles = items.map((i) => i.title ?? (i as { primaryLabel?: string }).primaryLabel);
    expect(titles).toContain('김치찌개');
    expect(titles).not.toContain('비밀 메뉴'); // draft excluded
  });

  it('applies filter+sort+limit through the bound repeater path', () => {
    const site = { cmsCollections: [makeCollection()] };
    const items = readBuilderDatasetRepeaterItems(
      'home.insights.feed',
      cmsBinding({ filters: [{ fieldId: 'category', operator: 'equals', value: 'soup' }], sort: [{ fieldId: 'title', direction: 'asc' }], limit: 1 }),
      'ko',
      [],
      site,
    );
    expect(items.length).toBe(1);
  });

  it('a missing bound collection renders empty (safe), not the built-in fallback', () => {
    const site = { cmsCollections: [makeCollection()] };
    const items = readBuilderDatasetRepeaterItems('home.insights.feed', cmsBinding({ cmsCollectionId: 'gone' }), 'ko', [], site);
    expect(items).toEqual([]);
  });

  it('preserves cmsCollectionId across clone and normalize (survives save round-trip)', () => {
    const cloned = cloneBuilderPageDatasetBinding(cmsBinding());
    expect(cloned.cmsCollectionId).toBe('recipes');
    const normalized = normalizeBuilderPageDatasets('home', [cmsBinding()], []);
    const carrier = normalized.find((b) => b.targetId === 'home.insights.feed');
    expect(carrier?.cmsCollectionId).toBe('recipes');
  });
});

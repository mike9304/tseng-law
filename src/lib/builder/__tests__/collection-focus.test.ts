import { describe, expect, it } from 'vitest';
import { resolveBuilderCollectionItemFocusFromNodeId } from '@/lib/builder/collection-focus';

describe('builder collection item focus', () => {
  it('resolves service repeater items from root and child node ids', () => {
    expect(resolveBuilderCollectionItemFocusFromNodeId('home-services-card-2')).toEqual({
      sectionKey: 'home.services',
      index: 2,
    });
    expect(resolveBuilderCollectionItemFocusFromNodeId('home-services-card-2-title')).toEqual({
      sectionKey: 'home.services',
      index: 2,
    });
  });

  it('resolves FAQ repeater items from root and child node ids', () => {
    expect(resolveBuilderCollectionItemFocusFromNodeId('home-faq-item-3')).toEqual({
      sectionKey: 'home.faq',
      index: 3,
    });
    expect(resolveBuilderCollectionItemFocusFromNodeId('home-faq-item-3-answer-wrap')).toEqual({
      sectionKey: 'home.faq',
      index: 3,
    });
  });

  it('ignores non-repeater and malformed node ids', () => {
    expect(resolveBuilderCollectionItemFocusFromNodeId('home-services-root')).toBeNull();
    expect(resolveBuilderCollectionItemFocusFromNodeId('home-services-card-title')).toBeNull();
    expect(resolveBuilderCollectionItemFocusFromNodeId('home-faq-item--1')).toBeNull();
    expect(resolveBuilderCollectionItemFocusFromNodeId(null)).toBeNull();
  });
});

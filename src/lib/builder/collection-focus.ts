import type { BuilderCollectionSectionKey } from './types';

export type BuilderCollectionItemFocus = {
  sectionKey: BuilderCollectionSectionKey;
  index: number;
};

export function resolveBuilderCollectionItemFocusFromNodeId(
  nodeId: string | null | undefined
): BuilderCollectionItemFocus | null {
  const value = nodeId?.trim();
  if (!value) return null;

  const serviceMatch = /^home-services-card-(\d+)(?:$|-)/.exec(value);
  if (serviceMatch) {
    return createCollectionItemFocus('home.services', serviceMatch[1]);
  }

  const faqMatch = /^home-faq-item-(\d+)(?:$|-)/.exec(value);
  if (faqMatch) {
    return createCollectionItemFocus('home.faq', faqMatch[1]);
  }

  return null;
}

function createCollectionItemFocus(
  sectionKey: BuilderCollectionSectionKey,
  value: string
): BuilderCollectionItemFocus | null {
  const index = Number(value);
  if (!Number.isSafeInteger(index) || index < 0) return null;
  return { sectionKey, index };
}

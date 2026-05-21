export const BUILDER_SERVICES_ACCORDION_CARD_HEIGHT = 420;
export const BUILDER_SERVICES_ACCORDION_BODY_HEIGHT = 330;
export const BUILDER_SERVICES_ACCORDION_SECTION_HEIGHT = 1900;
export const BUILDER_SERVICES_ACCORDION_STACK_DELTA = 288;

export const BUILDER_FAQ_ACCORDION_ITEM_HEIGHT = 190;
export const BUILDER_FAQ_ACCORDION_BODY_HEIGHT = 122;
export const BUILDER_FAQ_ACCORDION_SECTION_HEIGHT = 1582;
export const BUILDER_FAQ_ACCORDION_STACK_DELTA = 122;

export const BUILDER_ACCORDION_PREVIEW_STACK_GAP = 12;

export function hasAccordionPreviewOpen(indices: readonly number[] | undefined): boolean {
  return Boolean(indices?.some((index) => Number.isFinite(index) && index >= 0));
}

export function accordionPreviewExtra(baseHeight: number | undefined, expandedHeight: number, isOpen: boolean): number {
  if (!isOpen) return 0;
  return Math.max(0, expandedHeight - (baseHeight ?? 0));
}

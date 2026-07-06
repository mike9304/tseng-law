const CANVAS_CODE_SLOT_REFERENCE_PREFIX = 'canvas-code-block';

export function buildCanvasCodeSlotLogReference(title?: string, functionSlug?: string): string {
  const normalizedTitle = title?.trim();
  const baseReference = normalizedTitle
    ? `${CANVAS_CODE_SLOT_REFERENCE_PREFIX}:${normalizedTitle}`
    : CANVAS_CODE_SLOT_REFERENCE_PREFIX;
  const normalizedFunctionSlug = functionSlug?.trim();
  return normalizedFunctionSlug
    ? `${baseReference}:function:${normalizedFunctionSlug}`
    : baseReference;
}

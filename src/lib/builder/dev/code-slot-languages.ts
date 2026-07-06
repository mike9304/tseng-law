export const CANVAS_CODE_SLOT_EXECUTABLE_LANGUAGES = ['js', 'jsx', 'ts', 'tsx'] as const;

export type CanvasCodeSlotExecutableLanguage = typeof CANVAS_CODE_SLOT_EXECUTABLE_LANGUAGES[number];

export function isCanvasCodeSlotExecutableLanguage(value: string): value is CanvasCodeSlotExecutableLanguage {
  return CANVAS_CODE_SLOT_EXECUTABLE_LANGUAGES.some((language) => language === value);
}

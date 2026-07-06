import type { KeyboardEvent } from 'react';

export const relationColumnPickerShortcuts = {
  clearShown: 'Alt+C',
  selectShown: 'Alt+S',
  undo: 'Alt+U',
} as const;

export type RelationColumnPickerShortcut =
  | 'clearSearch'
  | 'clearShown'
  | 'selectShown'
  | 'undo';

export function getRelationColumnPickerShortcut(
  event: KeyboardEvent<HTMLElement>,
): RelationColumnPickerShortcut | null {
  if (event.key === 'Escape' && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
    return 'clearSearch';
  }
  if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
    return null;
  }

  const key = event.key.toLocaleLowerCase('en-US');
  if (key === 'c') return 'clearShown';
  if (key === 's') return 'selectShown';
  if (key === 'u') return 'undo';
  return null;
}

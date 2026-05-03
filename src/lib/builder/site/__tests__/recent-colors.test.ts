import { afterEach, describe, expect, test, vi } from 'vitest';
import {
  isSupportedRecentColor,
  pushRecentColor,
  readRecentColors,
  writeRecentColors,
} from '@/lib/builder/site/theme/recent-colors';

function installLocalStorage(initial: Record<string, string> = {}) {
  const storage = new Map(Object.entries(initial));
  const localStorage = {
    getItem: vi.fn((key: string) => storage.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      storage.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      storage.delete(key);
    }),
  };
  vi.stubGlobal('window', { localStorage });
  return { localStorage, storage };
}

describe('recent color persistence', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('dedupes, normalizes, and limits recent colors', () => {
    const next = pushRecentColor(
      ['#ffffff', '#111111', '#222222'],
      ' #FFFFFF ',
    );

    expect(next).toEqual(['#ffffff', '#111111', '#222222']);
    expect(pushRecentColor([], 'not-a-color')).toEqual([]);
    expect(
      Array.from({ length: 16 }, (_, index) => `#0000${index.toString(16).padStart(2, '0')}`)
        .reduce((colors, color) => pushRecentColor(colors, color), [] as string[]),
    ).toHaveLength(12);
  });

  test('accepts supported CSS color text only', () => {
    expect(isSupportedRecentColor('#abc123')).toBe(true);
    expect(isSupportedRecentColor('rgb(1, 2, 3)')).toBe(true);
    expect(isSupportedRecentColor('rgba(1, 2, 3, 0.4)')).toBe(true);
    expect(isSupportedRecentColor('hsl(10, 20%, 30%)')).toBe(true);
    expect(isSupportedRecentColor('url(javascript:alert(1))')).toBe(false);
  });

  test('migrates legacy localStorage key and removes stale data', () => {
    const { localStorage, storage } = installLocalStorage({
      'builder-color-picker-recent-v1': JSON.stringify(['#ABCDEF', 'bad', 'rgb(1, 2, 3)']),
    });

    expect(readRecentColors()).toEqual(['#abcdef', 'rgb(1, 2, 3)']);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'builder:recent-colors',
      JSON.stringify(['#abcdef', 'rgb(1, 2, 3)']),
    );
    expect(localStorage.removeItem).toHaveBeenCalledWith('builder-color-picker-recent-v1');
    expect(storage.has('builder-color-picker-recent-v1')).toBe(false);
  });

  test('writes supported colors without throwing when storage is absent', () => {
    expect(readRecentColors()).toEqual([]);
    expect(() => writeRecentColors(['#abcdef'])).not.toThrow();

    const { storage } = installLocalStorage();
    writeRecentColors(['#abcdef', 'bad', 'rgb(1, 2, 3)']);
    expect(JSON.parse(storage.get('builder:recent-colors') ?? '[]')).toEqual([
      '#abcdef',
      'rgb(1, 2, 3)',
    ]);
  });
});

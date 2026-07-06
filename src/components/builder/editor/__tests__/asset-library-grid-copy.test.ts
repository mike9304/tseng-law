import { describe, expect, it } from 'vitest';
import { getAssetLibraryGridCopy } from '../asset-library-grid-copy';

function collectStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (!value || typeof value !== 'object') return [];
  return Object.values(value).flatMap((entry) => collectStrings(entry));
}

describe('asset library grid copy', () => {
  it('returns ko asset library grid copy', () => {
    const copy = getAssetLibraryGridCopy('ko');

    expect(copy.useImage).toBe('이미지 사용');
    expect(copy.delete).toBe('삭제');
    expect(copy.deleting).toBe('삭제 중…');
  });

  it('returns zh-hant copy without Hangul', () => {
    const copy = getAssetLibraryGridCopy('zh-hant');
    const hangul = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/;

    expect(copy.useImage).toBe('使用圖片');
    expect(copy.delete).toBe('刪除');
    expect(copy.deleting).toBe('刪除中…');
    expect(collectStrings(copy)).not.toContainEqual(expect.stringMatching(hangul));
  });

  it('returns en copy without CJK', () => {
    const copy = getAssetLibraryGridCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;

    expect(copy.useImage).toBe('Use image');
    expect(copy.delete).toBe('Delete');
    expect(copy.deleting).toBe('Deleting…');
    expect(collectStrings(copy)).not.toContainEqual(expect.stringMatching(cjk));
  });
});

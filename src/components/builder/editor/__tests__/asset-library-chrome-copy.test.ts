import { describe, expect, it } from 'vitest';
import { getAssetLibraryChromeCopy } from '../asset-library-chrome-copy';

function collectStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (!value || typeof value !== 'object') return [];
  return Object.values(value).flatMap((entry) => collectStrings(entry));
}

describe('asset library chrome copy', () => {
  it('returns ko asset library chrome copy', () => {
    const copy = getAssetLibraryChromeCopy('ko');

    expect(copy.folders).toBe('폴더');
    expect(copy.newFolder).toBe('새 폴더');
    expect(copy.create).toBe('생성');
    expect(copy.dropTitle).toBe('이미지를 여기로 드래그하거나 클릭해 업로드');
    expect(copy.dropHint).toBe('JPG, PNG, WEBP, GIF, AVIF · 최대 8 MB');
  });

  it('returns zh-hant copy without Hangul', () => {
    const copy = getAssetLibraryChromeCopy('zh-hant');
    const hangul = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/;

    expect(copy.folders).toBe('資料夾');
    expect(copy.allTags).toBe('全部標籤');
    expect(copy.create).toBe('建立');
    expect(copy.dropHint).toBe('JPG、PNG、WEBP、GIF、AVIF · 最大 8 MB');
    expect(collectStrings(copy)).not.toContainEqual(expect.stringMatching(hangul));
  });

  it('returns en copy without CJK', () => {
    const copy = getAssetLibraryChromeCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;

    expect(copy.search).toBe('Search');
    expect(copy.newest).toBe('Newest first');
    expect(copy.upload).toBe('Upload image');
    expect(copy.create).toBe('Create');
    expect(collectStrings(copy)).not.toContainEqual(expect.stringMatching(cjk));
  });
});

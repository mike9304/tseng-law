import { describe, expect, it } from 'vitest';
import { getAssetLibraryFolderLabel, getAssetLibraryModalCopy } from '../asset-library-modal-copy';

function collectStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (!value || typeof value !== 'object') return [];
  return Object.values(value).flatMap((entry) => collectStrings(entry));
}

describe('asset library modal copy', () => {
  it('returns ko asset library modal copy', () => {
    const copy = getAssetLibraryModalCopy('ko');

    expect(copy.dialog).toBe('자산 라이브러리');
    expect(copy.noAssetsTitle).toBe('아직 업로드된 이미지가 없습니다.');
    expect(copy.errorLoad).toBe('이미지를 불러오지 못했습니다.');
    expect(copy.folderLabels.all).toBe('전체 이미지');
    expect(getAssetLibraryFolderLabel(copy, 'uploads', 'Uploads')).toBe('업로드');
  });

  it('returns zh-hant copy without Hangul', () => {
    const copy = getAssetLibraryModalCopy('zh-hant');
    const hangul = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/;

    expect(copy.dialog).toBe('素材庫');
    expect(copy.noMatchBody).toBe('請清除搜尋詞、資料夾或標籤篩選，或重新載入。');
    expect(copy.folderLabels.selected).toBe('已選圖片');
    expect(getAssetLibraryFolderLabel(copy, 'brand', 'Brand')).toBe('品牌');
    expect(collectStrings(copy)).not.toContainEqual(expect.stringMatching(hangul));
  });

  it('returns en copy without CJK and preserves custom folder fallbacks', () => {
    const copy = getAssetLibraryModalCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;

    expect(copy.dialog).toBe('Asset library');
    expect(copy.noMatchTitle).toBe('No images match the current filters.');
    expect(copy.errorNetwork).toBe('Network error, please try again');
    expect(getAssetLibraryFolderLabel(copy, 'client-work', 'Client work')).toBe('Client work');
    expect(collectStrings(copy)).not.toContainEqual(expect.stringMatching(cjk));
  });
});

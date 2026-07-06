import type { Locale } from '@/lib/locales';

export type AssetLibraryGridCopy = {
  useImage: string;
  delete: string;
  deleting: string;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', AssetLibraryGridCopy> = {
  ko: {
    useImage: '이미지 사용',
    delete: '삭제',
    deleting: '삭제 중…',
  },
  'zh-hant': {
    useImage: '使用圖片',
    delete: '刪除',
    deleting: '刪除中…',
  },
  en: {
    useImage: 'Use image',
    delete: 'Delete',
    deleting: 'Deleting…',
  },
};

export function getAssetLibraryGridCopy(locale: Locale): AssetLibraryGridCopy {
  return COPY[locale] ?? COPY.en;
}

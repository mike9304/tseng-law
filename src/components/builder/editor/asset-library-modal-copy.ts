import type { Locale } from '@/lib/locales';

export type AssetLibraryModalCopy = {
  dialog: string;
  title: string;
  close: string;
  loading: string;
  noAssetsTitle: string;
  noAssetsBody: string;
  noMatchTitle: string;
  noMatchBody: string;
  upload: string;
  retry: string;
  errorUpload: string;
  errorLoad: string;
  errorDelete: string;
  errorNetwork: string;
  folderLabels: {
    all: string;
    recent: string;
    selected: string;
    uploads: string;
    brand: string;
  };
};

const COPY: Record<'ko' | 'zh-hant' | 'en', AssetLibraryModalCopy> = {
  ko: {
    dialog: '자산 라이브러리',
    title: '빌더 이미지를 선택, 업로드, 삭제하세요',
    close: '닫기',
    loading: '이미지를 불러오는 중…',
    noAssetsTitle: '아직 업로드된 이미지가 없습니다.',
    noAssetsBody: '이미지를 드래그하거나 업로드 버튼을 눌러 바로 추가하세요.',
    noMatchTitle: '현재 필터와 맞는 이미지가 없습니다.',
    noMatchBody: '검색어, 폴더, 태그 필터를 지우거나 다시 불러오세요.',
    upload: '이미지 업로드',
    retry: '다시 시도',
    errorUpload: '이미지 업로드 실패',
    errorLoad: '이미지를 불러오지 못했습니다.',
    errorDelete: '이미지 삭제 실패',
    errorNetwork: '네트워크 오류, 다시 시도해주세요',
    folderLabels: {
      all: '전체 이미지',
      recent: '최근',
      selected: '선택됨',
      uploads: '업로드',
      brand: '브랜드',
    },
  },
  'zh-hant': {
    dialog: '素材庫',
    title: '選擇、上傳或刪除建站圖片',
    close: '關閉',
    loading: '圖片載入中…',
    noAssetsTitle: '尚未上傳任何圖片。',
    noAssetsBody: '可直接拖放圖片或按上傳按鈕新增。',
    noMatchTitle: '沒有符合目前篩選的圖片。',
    noMatchBody: '請清除搜尋詞、資料夾或標籤篩選，或重新載入。',
    upload: '上傳圖片',
    retry: '重試',
    errorUpload: '圖片上傳失敗',
    errorLoad: '無法載入圖片。',
    errorDelete: '圖片刪除失敗',
    errorNetwork: '網路錯誤，請再試一次',
    folderLabels: {
      all: '全部圖片',
      recent: '最近',
      selected: '已選圖片',
      uploads: '上傳',
      brand: '品牌',
    },
  },
  en: {
    dialog: 'Asset library',
    title: 'Select, upload, or remove builder images',
    close: 'Close',
    loading: 'Loading assets…',
    noAssetsTitle: 'No images uploaded yet.',
    noAssetsBody: 'Drag images here or use the upload button to add them.',
    noMatchTitle: 'No images match the current filters.',
    noMatchBody: 'Clear search, folder, or tag filters, or try reloading.',
    upload: 'Upload image',
    retry: 'Retry',
    errorUpload: 'Failed to upload asset.',
    errorLoad: 'Failed to load assets.',
    errorDelete: 'Failed to delete asset.',
    errorNetwork: 'Network error, please try again',
    folderLabels: {
      all: 'All assets',
      recent: 'Recent',
      selected: 'Selected',
      uploads: 'Uploads',
      brand: 'Brand',
    },
  },
};

export function getAssetLibraryModalCopy(locale: Locale): AssetLibraryModalCopy {
  return COPY[locale] ?? COPY.en;
}

export function getAssetLibraryFolderLabel(
  copy: AssetLibraryModalCopy,
  folderId: string,
  fallback: string,
): string {
  if (folderId === 'uploads') return copy.folderLabels.uploads;
  if (folderId === 'brand') return copy.folderLabels.brand;
  return fallback;
}

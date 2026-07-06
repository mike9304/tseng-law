import type { Locale } from '@/lib/locales';

export type AssetLibraryChromeCopy = {
  folders: string;
  newFolder: string;
  add: string;
  search: string;
  filename: string;
  sort: string;
  newest: string;
  oldest: string;
  nameAsc: string;
  nameDesc: string;
  refresh: string;
  upload: string;
  uploading: string;
  allTags: string;
  newTag: string;
  create: string;
  dropTitle: string;
  dropHint: string;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', AssetLibraryChromeCopy> = {
  ko: {
    folders: '폴더',
    newFolder: '새 폴더',
    add: '추가',
    search: '검색',
    filename: '파일명',
    sort: '정렬',
    newest: '최신순',
    oldest: '오래된순',
    nameAsc: '이름 A-Z',
    nameDesc: '이름 Z-A',
    refresh: '새로고침',
    upload: '이미지 업로드',
    uploading: '업로드 중…',
    allTags: '전체 태그',
    newTag: '새 태그',
    create: '생성',
    dropTitle: '이미지를 여기로 드래그하거나 클릭해 업로드',
    dropHint: 'JPG, PNG, WEBP, GIF, AVIF · 최대 8 MB',
  },
  'zh-hant': {
    folders: '資料夾',
    newFolder: '新增資料夾',
    add: '新增',
    search: '搜尋',
    filename: '檔案名稱',
    sort: '排序',
    newest: '最新優先',
    oldest: '最舊優先',
    nameAsc: '名稱 A-Z',
    nameDesc: '名稱 Z-A',
    refresh: '重新整理',
    upload: '上傳圖片',
    uploading: '上傳中…',
    allTags: '全部標籤',
    newTag: '新增標籤',
    create: '建立',
    dropTitle: '將圖片拖放到這裡或點擊上傳',
    dropHint: 'JPG、PNG、WEBP、GIF、AVIF · 最大 8 MB',
  },
  en: {
    folders: 'Folders',
    newFolder: 'New folder',
    add: 'Add',
    search: 'Search',
    filename: 'filename',
    sort: 'Sort',
    newest: 'Newest first',
    oldest: 'Oldest first',
    nameAsc: 'Name A-Z',
    nameDesc: 'Name Z-A',
    refresh: 'Refresh',
    upload: 'Upload image',
    uploading: 'Uploading…',
    allTags: 'All tags',
    newTag: 'New tag',
    create: 'Create',
    dropTitle: 'Drop image here or click to upload',
    dropHint: 'JPG, PNG, WEBP, GIF, AVIF · max 8 MB',
  },
};

export function getAssetLibraryChromeCopy(locale: Locale): AssetLibraryChromeCopy {
  return COPY[locale] ?? COPY.en;
}

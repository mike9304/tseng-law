import type { BuilderGradientBackground, BuilderImageBackground } from '@/lib/builder/site/theme';
import type { Locale } from '@/lib/locales';

export type BackgroundMode = 'solid' | 'gradient' | 'image' | 'none';

export type BackgroundEditorCopy = {
  modeLabels: Record<BackgroundMode, string>;
  fillColorLabel: string;
  gradientTypeLabel: string;
  gradientTypeOptions: Record<BuilderGradientBackground['type'], string>;
  angleLabel: string;
  stopLabel: (index: number) => string;
  stopPositionAriaLabel: (index: number) => string;
  removeStopAriaLabel: (index: number) => string;
  addStopLabel: string;
  imageUrlLabel: string;
  imageUrlPlaceholder: string;
  chooseAssetsLabel: string;
  loadingAssetsLabel: string;
  assetLoadError: string;
  noAssetsLabel: string;
  imageSizeLabel: string;
  imageSizeOptions: Record<BuilderImageBackground['size'], string>;
  imageRepeatLabel: string;
  imageRepeatOptions: Record<BuilderImageBackground['repeat'], string>;
  imagePositionLabel: string;
  imagePositionOptions: Record<BuilderImageBackground['position'], string>;
  overlayLabel: string;
  overlayOpacityAriaLabel: string;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', BackgroundEditorCopy> = {
  ko: {
    modeLabels: {
      solid: '단색',
      gradient: '그라디언트',
      image: '이미지',
      none: '없음',
    },
    fillColorLabel: '채우기 색상',
    gradientTypeLabel: '유형',
    gradientTypeOptions: {
      linear: '선형',
      radial: '방사형',
    },
    angleLabel: '각도',
    stopLabel: (index) => `스톱 ${index}`,
    stopPositionAriaLabel: (index) => `스톱 ${index} 위치`,
    removeStopAriaLabel: (index) => `스톱 ${index} 제거`,
    addStopLabel: '스톱 추가',
    imageUrlLabel: '이미지 URL',
    imageUrlPlaceholder: 'https://example.com/image.jpg',
    chooseAssetsLabel: '에셋에서 선택',
    loadingAssetsLabel: '에셋을 불러오는 중...',
    assetLoadError: '에셋을 불러오지 못했습니다.',
    noAssetsLabel: '에셋이 없습니다.',
    imageSizeLabel: '크기',
    imageSizeOptions: {
      cover: '채우기',
      contain: '맞추기',
      auto: '자동',
    },
    imageRepeatLabel: '반복',
    imageRepeatOptions: {
      'no-repeat': '반복 없음',
      repeat: '반복',
      'repeat-x': '가로 반복',
      'repeat-y': '세로 반복',
    },
    imagePositionLabel: '위치',
    imagePositionOptions: {
      center: '가운데',
      top: '위',
      bottom: '아래',
      left: '왼쪽',
      right: '오른쪽',
      'top-left': '왼쪽 위',
      'top-right': '오른쪽 위',
      'bottom-left': '왼쪽 아래',
      'bottom-right': '오른쪽 아래',
    },
    overlayLabel: '오버레이',
    overlayOpacityAriaLabel: '오버레이 투명도',
  },
  'zh-hant': {
    modeLabels: {
      solid: '純色',
      gradient: '漸層',
      image: '圖片',
      none: '無',
    },
    fillColorLabel: '填滿顏色',
    gradientTypeLabel: '類型',
    gradientTypeOptions: {
      linear: '線性',
      radial: '放射狀',
    },
    angleLabel: '角度',
    stopLabel: (index) => `色標 ${index}`,
    stopPositionAriaLabel: (index) => `色標 ${index} 位置`,
    removeStopAriaLabel: (index) => `移除色標 ${index}`,
    addStopLabel: '新增色標',
    imageUrlLabel: '圖片 URL',
    imageUrlPlaceholder: 'https://example.com/image.jpg',
    chooseAssetsLabel: '從素材選擇',
    loadingAssetsLabel: '正在載入素材...',
    assetLoadError: '無法載入素材。',
    noAssetsLabel: '找不到素材。',
    imageSizeLabel: '大小',
    imageSizeOptions: {
      cover: '填滿',
      contain: '完整顯示',
      auto: '自動',
    },
    imageRepeatLabel: '重複',
    imageRepeatOptions: {
      'no-repeat': '不重複',
      repeat: '重複',
      'repeat-x': '水平重複',
      'repeat-y': '垂直重複',
    },
    imagePositionLabel: '位置',
    imagePositionOptions: {
      center: '置中',
      top: '上方',
      bottom: '下方',
      left: '左側',
      right: '右側',
      'top-left': '左上',
      'top-right': '右上',
      'bottom-left': '左下',
      'bottom-right': '右下',
    },
    overlayLabel: '覆蓋層',
    overlayOpacityAriaLabel: '覆蓋層不透明度',
  },
  en: {
    modeLabels: {
      solid: 'Solid',
      gradient: 'Gradient',
      image: 'Image',
      none: 'None',
    },
    fillColorLabel: 'Fill color',
    gradientTypeLabel: 'Type',
    gradientTypeOptions: {
      linear: 'Linear',
      radial: 'Radial',
    },
    angleLabel: 'Angle',
    stopLabel: (index) => `Stop ${index}`,
    stopPositionAriaLabel: (index) => `Stop ${index} position`,
    removeStopAriaLabel: (index) => `Remove stop ${index}`,
    addStopLabel: 'Add stop',
    imageUrlLabel: 'Image URL',
    imageUrlPlaceholder: 'https://example.com/image.jpg',
    chooseAssetsLabel: 'Choose from assets',
    loadingAssetsLabel: 'Loading assets...',
    assetLoadError: 'Failed to load assets.',
    noAssetsLabel: 'No assets found.',
    imageSizeLabel: 'Size',
    imageSizeOptions: {
      cover: 'Cover',
      contain: 'Contain',
      auto: 'Auto',
    },
    imageRepeatLabel: 'Repeat',
    imageRepeatOptions: {
      'no-repeat': 'No repeat',
      repeat: 'Repeat',
      'repeat-x': 'Repeat X',
      'repeat-y': 'Repeat Y',
    },
    imagePositionLabel: 'Position',
    imagePositionOptions: {
      center: 'Center',
      top: 'Top',
      bottom: 'Bottom',
      left: 'Left',
      right: 'Right',
      'top-left': 'Top left',
      'top-right': 'Top right',
      'bottom-left': 'Bottom left',
      'bottom-right': 'Bottom right',
    },
    overlayLabel: 'Overlay',
    overlayOpacityAriaLabel: 'Overlay opacity',
  },
};

export function getBackgroundEditorCopy(locale: Locale): BackgroundEditorCopy {
  return COPY[locale] ?? COPY.en;
}

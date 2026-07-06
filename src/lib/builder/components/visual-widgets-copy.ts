import type {
  BuilderDividerCanvasNode,
  BuilderFrameCanvasNode,
  BuilderIconCanvasNode,
  BuilderShapeCanvasNode,
  BuilderStickerCanvasNode,
} from '@/lib/builder/canvas/types';
import type { ThemeColorToken } from '@/lib/builder/site/theme';
import type { Locale } from '@/lib/locales';

type IconSet = BuilderIconCanvasNode['content']['set'];
type DividerOrientation = BuilderDividerCanvasNode['content']['orientation'];
type DividerStyle = BuilderDividerCanvasNode['content']['style'];
type ShapeKind = BuilderShapeCanvasNode['content']['shape'];
type FrameStyle = BuilderFrameCanvasNode['content']['style'];
type StickerVariant = BuilderStickerCanvasNode['content']['variant'];

export interface VisualWidgetsCopy {
  themeColorLabels: Record<ThemeColorToken, string>;
  icon: {
    inspector: {
      icon: string;
      placeholder: string;
      set: string;
      sets: Record<IconSet, string>;
      size: string;
      color: string;
    };
  };
  divider: {
    inspector: {
      orientation: string;
      orientations: Record<DividerOrientation, string>;
      thickness: string;
      color: string;
      style: string;
      styles: Record<DividerStyle, string>;
    };
  };
  shape: {
    inspector: {
      shape: string;
      shapes: Record<ShapeKind, string>;
      fill: string;
      strokeColor: string;
      strokeWidth: string;
    };
  };
  frame: {
    inspector: {
      style: string;
      styles: Record<FrameStyle, string>;
      color: string;
      width: string;
      radius: string;
      label: string;
    };
  };
  sticker: {
    defaultLabel: string;
    inspector: {
      emoji: string;
      label: string;
      background: string;
      color: string;
      rotation: string;
      style: string;
      variants: Record<StickerVariant, string>;
    };
  };
}

export const STICKER_LEGACY_DEFAULTS = {
  label: '추천',
} as const;

export function localizedVisualText(value: string | undefined, localized: string, legacyDefault: string): string {
  const current = value ?? '';
  return current === legacyDefault ? localized : current;
}

const visualWidgetsCopy: Record<Locale, VisualWidgetsCopy> = {
  ko: {
    themeColorLabels: {
      primary: '주요',
      secondary: '보조',
      accent: '강조',
      background: '배경',
      text: '텍스트',
      muted: '흐림',
    },
    icon: {
      inspector: {
        icon: '아이콘',
        placeholder: '이모지 또는 유니코드',
        set: '세트',
        sets: {
          emoji: '이모지',
          unicode: '유니코드',
          lucide: 'Lucide',
          fontawesome: 'FontAwesome',
        },
        size: '크기',
        color: '색상',
      },
    },
    divider: {
      inspector: {
        orientation: '방향',
        orientations: {
          horizontal: '가로',
          vertical: '세로',
        },
        thickness: '두께',
        color: '색상',
        style: '스타일',
        styles: {
          solid: '실선',
          dashed: '파선',
          dotted: '점선',
        },
      },
    },
    shape: {
      inspector: {
        shape: '모양',
        shapes: {
          circle: '원',
          square: '사각형',
          triangle: '삼각형',
          pentagon: '오각형',
          hexagon: '육각형',
          star: '별',
          heart: '하트',
          arrow: '화살표',
          blob: '블롭',
        },
        fill: '채움',
        strokeColor: '외곽선 색상',
        strokeWidth: '외곽선 두께',
      },
    },
    frame: {
      inspector: {
        style: '스타일',
        styles: {
          solid: '실선',
          double: '이중선',
          corner: '모서리 강조',
          photo: '사진',
          tag: '태그',
        },
        color: '색상',
        width: '두께',
        radius: '모서리 (px)',
        label: '라벨',
      },
    },
    sticker: {
      defaultLabel: STICKER_LEGACY_DEFAULTS.label,
      inspector: {
        emoji: '이모지/심볼',
        label: '라벨',
        background: '배경',
        color: '글자색',
        rotation: '회전 (deg, -45~45)',
        style: '스타일',
        variants: {
          badge: '배지',
          pill: '알약형',
          banner: '배너',
        },
      },
    },
  },
  'zh-hant': {
    themeColorLabels: {
      primary: '主要',
      secondary: '次要',
      accent: '重點',
      background: '背景',
      text: '文字',
      muted: '淡化',
    },
    icon: {
      inspector: {
        icon: '圖示',
        placeholder: 'Emoji 或 Unicode',
        set: '圖示集',
        sets: {
          emoji: 'Emoji',
          unicode: 'Unicode',
          lucide: 'Lucide',
          fontawesome: 'FontAwesome',
        },
        size: '尺寸',
        color: '顏色',
      },
    },
    divider: {
      inspector: {
        orientation: '方向',
        orientations: {
          horizontal: '水平',
          vertical: '垂直',
        },
        thickness: '粗細',
        color: '顏色',
        style: '樣式',
        styles: {
          solid: '實線',
          dashed: '虛線',
          dotted: '點線',
        },
      },
    },
    shape: {
      inspector: {
        shape: '形狀',
        shapes: {
          circle: '圓形',
          square: '方形',
          triangle: '三角形',
          pentagon: '五角形',
          hexagon: '六角形',
          star: '星形',
          heart: '愛心',
          arrow: '箭頭',
          blob: '不規則形',
        },
        fill: '填滿',
        strokeColor: '外框顏色',
        strokeWidth: '外框粗細',
      },
    },
    frame: {
      inspector: {
        style: '樣式',
        styles: {
          solid: '實線',
          double: '雙線',
          corner: '角落強調',
          photo: '照片',
          tag: '標籤',
        },
        color: '顏色',
        width: '寬度',
        radius: '圓角 (px)',
        label: '標籤',
      },
    },
    sticker: {
      defaultLabel: '推薦',
      inspector: {
        emoji: 'Emoji / 符號',
        label: '標籤',
        background: '背景',
        color: '文字顏色',
        rotation: '旋轉 (deg, -45~45)',
        style: '樣式',
        variants: {
          badge: '徽章',
          pill: '膠囊',
          banner: '橫幅',
        },
      },
    },
  },
  en: {
    themeColorLabels: {
      primary: 'Primary',
      secondary: 'Secondary',
      accent: 'Accent',
      background: 'Background',
      text: 'Text',
      muted: 'Muted',
    },
    icon: {
      inspector: {
        icon: 'Icon',
        placeholder: 'Emoji or Unicode',
        set: 'Set',
        sets: {
          emoji: 'Emoji',
          unicode: 'Unicode',
          lucide: 'Lucide',
          fontawesome: 'FontAwesome',
        },
        size: 'Size',
        color: 'Color',
      },
    },
    divider: {
      inspector: {
        orientation: 'Orientation',
        orientations: {
          horizontal: 'Horizontal',
          vertical: 'Vertical',
        },
        thickness: 'Thickness',
        color: 'Color',
        style: 'Style',
        styles: {
          solid: 'Solid',
          dashed: 'Dashed',
          dotted: 'Dotted',
        },
      },
    },
    shape: {
      inspector: {
        shape: 'Shape',
        shapes: {
          circle: 'Circle',
          square: 'Square',
          triangle: 'Triangle',
          pentagon: 'Pentagon',
          hexagon: 'Hexagon',
          star: 'Star',
          heart: 'Heart',
          arrow: 'Arrow',
          blob: 'Blob',
        },
        fill: 'Fill',
        strokeColor: 'Stroke color',
        strokeWidth: 'Stroke width',
      },
    },
    frame: {
      inspector: {
        style: 'Style',
        styles: {
          solid: 'Solid',
          double: 'Double',
          corner: 'Corner accent',
          photo: 'Photo',
          tag: 'Tag',
        },
        color: 'Color',
        width: 'Width',
        radius: 'Radius (px)',
        label: 'Label',
      },
    },
    sticker: {
      defaultLabel: 'Recommended',
      inspector: {
        emoji: 'Emoji/symbol',
        label: 'Label',
        background: 'Background',
        color: 'Text color',
        rotation: 'Rotation (deg, -45~45)',
        style: 'Style',
        variants: {
          badge: 'Badge',
          pill: 'Pill',
          banner: 'Banner',
        },
      },
    },
  },
};

export function getVisualWidgetsCopy(locale: Locale): VisualWidgetsCopy {
  return visualWidgetsCopy[locale] ?? visualWidgetsCopy.en;
}

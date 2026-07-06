import type {
  BuilderBreadcrumbsCanvasNode,
  BuilderPatternCanvasNode,
  BuilderTimelineCanvasNode,
} from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';

type BreadcrumbSeparator = BuilderBreadcrumbsCanvasNode['content']['separator'];
type BreadcrumbItem = BuilderBreadcrumbsCanvasNode['content']['items'][number];
type TimelineItem = BuilderTimelineCanvasNode['content']['items'][number];
type TimelineOrientation = BuilderTimelineCanvasNode['content']['orientation'];
type PatternKind = BuilderPatternCanvasNode['content']['pattern'];

export interface NavigationDecorativeCopy {
  breadcrumbs: {
    navLabel: string;
    defaultHomeLabel: string;
    defaultHomeHref: string;
    defaultItems: BreadcrumbItem[];
    inspector: {
      items: string;
      separator: string;
      separators: Record<BreadcrumbSeparator, string>;
      showHome: string;
      homeLabel: string;
      homeHref: string;
    };
  };
  timeline: {
    empty: string;
    defaultItems: TimelineItem[];
    inspector: {
      orientation: string;
      orientations: Record<TimelineOrientation, string>;
      accentColor: string;
      items: string;
    };
  };
  pattern: {
    inspector: {
      pattern: string;
      patterns: Record<PatternKind, string>;
      foregroundColor: string;
      backgroundColor: string;
      scale: string;
    };
  };
}

export const BREADCRUMBS_LEGACY_DEFAULTS = {
  homeLabel: '홈',
  homeHref: '/',
  items: [
    { label: '서비스', href: '/ko/services' },
    { label: '기업 자문' },
  ],
} as const satisfies {
  homeLabel: string;
  homeHref: string;
  items: readonly BreadcrumbItem[];
};

export const TIMELINE_LEGACY_DEFAULT_ITEMS = [
  { year: '2018', title: '호정국제 설립', description: '서울·타이베이 동시 개소' },
  { year: '2020', title: '대만 변호사 파트너십' },
  { year: '2023', title: '연 자문 200건 돌파' },
  { year: '2025', title: '한·대 양국 자문 100% 디지털화' },
] as const satisfies readonly TimelineItem[];

function sameBreadcrumbItems(left: BreadcrumbItem[], right: readonly BreadcrumbItem[]): boolean {
  return left.length === right.length
    && left.every((item, index) => item.label === right[index]?.label && (item.href ?? '') === (right[index]?.href ?? ''));
}

function sameTimelineItems(left: TimelineItem[], right: readonly TimelineItem[]): boolean {
  return left.length === right.length
    && left.every((item, index) => (
      item.year === right[index]?.year
      && item.title === right[index]?.title
      && (item.description ?? '') === (right[index]?.description ?? '')
    ));
}

function cloneTimelineItems(items: readonly TimelineItem[]): TimelineItem[] {
  return items.map((item) => ({ ...item }));
}

export function localizedBreadcrumbsDefaults(
  items: BreadcrumbItem[],
  homeLabel: string,
  homeHref: string,
  copy: NavigationDecorativeCopy['breadcrumbs'],
): { items: BreadcrumbItem[]; homeLabel: string; homeHref: string } {
  return {
    items: sameBreadcrumbItems(items, BREADCRUMBS_LEGACY_DEFAULTS.items) ? copy.defaultItems : items,
    homeLabel: homeLabel === BREADCRUMBS_LEGACY_DEFAULTS.homeLabel ? copy.defaultHomeLabel : homeLabel,
    homeHref: homeHref === BREADCRUMBS_LEGACY_DEFAULTS.homeHref ? copy.defaultHomeHref : homeHref,
  };
}

export function localizedTimelineItems(
  items: TimelineItem[],
  copy: NavigationDecorativeCopy['timeline'],
): TimelineItem[] {
  return sameTimelineItems(items, TIMELINE_LEGACY_DEFAULT_ITEMS) ? copy.defaultItems : items;
}

const navigationDecorativeCopy: Record<Locale, NavigationDecorativeCopy> = {
  ko: {
    breadcrumbs: {
      navLabel: '브레드크럼',
      defaultHomeLabel: BREADCRUMBS_LEGACY_DEFAULTS.homeLabel,
      defaultHomeHref: BREADCRUMBS_LEGACY_DEFAULTS.homeHref,
      defaultItems: [...BREADCRUMBS_LEGACY_DEFAULTS.items],
      inspector: {
        items: '항목 (label | href)',
        separator: '구분자',
        separators: {
          chevron: '› (갈매기표)',
          slash: '/ (슬래시)',
          dot: '· (점)',
        },
        showHome: '홈 표시',
        homeLabel: '홈 라벨',
        homeHref: '홈 링크',
      },
    },
    timeline: {
      empty: '타임라인 항목을 인스펙터에서 추가하세요',
      defaultItems: cloneTimelineItems(TIMELINE_LEGACY_DEFAULT_ITEMS),
      inspector: {
        orientation: '방향',
        orientations: {
          vertical: '세로',
          horizontal: '가로',
        },
        accentColor: '강조 색상',
        items: '항목 (year | title | description)',
      },
    },
    pattern: {
      inspector: {
        pattern: '패턴',
        patterns: {
          dots: '점',
          grid: '격자',
          diagonal: '대각선',
          waves: '물결',
          stripes: '줄무늬',
          checkerboard: '체커보드',
        },
        foregroundColor: '전경 색상',
        backgroundColor: '배경 색상',
        scale: '스케일 (px)',
      },
    },
  },
  'zh-hant': {
    breadcrumbs: {
      navLabel: '麵包屑',
      defaultHomeLabel: '首頁',
      defaultHomeHref: '/zh-hant',
      defaultItems: [
        { label: '服務', href: '/zh-hant/services' },
        { label: '企業顧問' },
      ],
      inspector: {
        items: '項目（label | href）',
        separator: '分隔符',
        separators: {
          chevron: '›（箭頭）',
          slash: '/（斜線）',
          dot: '·（圓點）',
        },
        showHome: '顯示首頁',
        homeLabel: '首頁標籤',
        homeHref: '首頁連結',
      },
    },
    timeline: {
      empty: '請在檢查器新增時間軸項目',
      defaultItems: [
        { year: '2018', title: '浩正國際成立', description: '首爾與台北同步開設據點' },
        { year: '2020', title: '台灣律師合作夥伴' },
        { year: '2023', title: '年度顧問案件突破 200 件' },
        { year: '2025', title: '韓台雙邊顧問 100% 數位化' },
      ],
      inspector: {
        orientation: '方向',
        orientations: {
          vertical: '垂直',
          horizontal: '水平',
        },
        accentColor: '強調色',
        items: '項目（year | title | description）',
      },
    },
    pattern: {
      inspector: {
        pattern: '圖案',
        patterns: {
          dots: '圓點',
          grid: '格線',
          diagonal: '斜線',
          waves: '波浪',
          stripes: '條紋',
          checkerboard: '棋盤格',
        },
        foregroundColor: '前景色',
        backgroundColor: '背景色',
        scale: '縮放 (px)',
      },
    },
  },
  en: {
    breadcrumbs: {
      navLabel: 'Breadcrumb',
      defaultHomeLabel: 'Home',
      defaultHomeHref: '/en',
      defaultItems: [
        { label: 'Services', href: '/en/services' },
        { label: 'Corporate advisory' },
      ],
      inspector: {
        items: 'Items (label | href)',
        separator: 'Separator',
        separators: {
          chevron: '› (chevron)',
          slash: '/ (slash)',
          dot: '· (dot)',
        },
        showHome: 'Show home',
        homeLabel: 'Home label',
        homeHref: 'Home href',
      },
    },
    timeline: {
      empty: 'Add timeline items in the inspector',
      defaultItems: [
        { year: '2018', title: 'Hojung International founded', description: 'Seoul and Taipei offices opened together' },
        { year: '2020', title: 'Taiwan attorney partnership' },
        { year: '2023', title: '200+ advisory matters per year' },
        { year: '2025', title: 'Korea-Taiwan advisory work fully digitized' },
      ],
      inspector: {
        orientation: 'Orientation',
        orientations: {
          vertical: 'Vertical',
          horizontal: 'Horizontal',
        },
        accentColor: 'Accent color',
        items: 'Items (year | title | description)',
      },
    },
    pattern: {
      inspector: {
        pattern: 'Pattern',
        patterns: {
          dots: 'Dots',
          grid: 'Grid',
          diagonal: 'Diagonal',
          waves: 'Waves',
          stripes: 'Stripes',
          checkerboard: 'Checkerboard',
        },
        foregroundColor: 'Foreground color',
        backgroundColor: 'Background color',
        scale: 'Scale (px)',
      },
    },
  },
};

export function getNavigationDecorativeCopy(locale: Locale): NavigationDecorativeCopy {
  return navigationDecorativeCopy[locale] ?? navigationDecorativeCopy.en;
}

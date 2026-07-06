import type { BuilderMenuBarCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';

type MenuBarItem = BuilderMenuBarCanvasNode['content']['items'][number];

export interface LayoutNavigationWidgetsCopy {
  section: {
    defaultLabel: string;
    maxWidthDisplay: string;
    inspector: {
      label: string;
      maxWidth: string;
      padding: string;
    };
  };
  spacer: {
    editLabel: (size: number) => string;
    inspector: {
      size: string;
    };
  };
  menuBar: {
    navLabel: string;
    openMenu: string;
    closeMenu: string;
    empty: string;
    defaultItems: MenuBarItem[];
    inspector: {
      orientation: string;
      orientationOptions: Record<'horizontal' | 'vertical', string>;
      style: string;
      variantOptions: Record<'plain' | 'pill' | 'dropdown' | 'mega', string>;
      activeHref: string;
      items: string;
      mobileHamburger: string;
    };
  };
}

export const SECTION_LEGACY_DEFAULTS = {
  label: 'Section',
} as const;

export const MENU_BAR_LEGACY_DEFAULT_ITEMS: MenuBarItem[] = [
  { label: '서비스', href: '/ko/services' },
  { label: '변호사', href: '/ko/lawyers' },
  { label: '소식', href: '/ko/insights' },
  { label: '문의', href: '/ko/contact' },
];

function defaultMenuItems(locale: Locale): MenuBarItem[] {
  if (locale === 'zh-hant') {
    return [
      { label: '服務', href: '/zh-hant/services' },
      { label: '律師', href: '/zh-hant/lawyers' },
      { label: '專欄', href: '/zh-hant/insights' },
      { label: '聯絡', href: '/zh-hant/contact' },
    ];
  }
  if (locale === 'en') {
    return [
      { label: 'Services', href: '/en/services' },
      { label: 'Lawyers', href: '/en/lawyers' },
      { label: 'Insights', href: '/en/insights' },
      { label: 'Contact', href: '/en/contact' },
    ];
  }
  return MENU_BAR_LEGACY_DEFAULT_ITEMS;
}

export function getLayoutNavigationWidgetsCopy(locale: Locale): LayoutNavigationWidgetsCopy {
  if (locale === 'zh-hant') {
    return {
      section: {
        defaultLabel: '區段',
        maxWidthDisplay: '最大寬度',
        inspector: {
          label: '標籤',
          maxWidth: '最大寬度',
          padding: '內距',
        },
      },
      spacer: {
        editLabel: (size) => `間距 ${size}px`,
        inspector: {
          size: '尺寸 (px)',
        },
      },
      menuBar: {
        navLabel: '主要導覽',
        openMenu: '開啟選單',
        closeMenu: '關閉選單',
        empty: '請在檢查器新增選單項目',
        defaultItems: defaultMenuItems(locale),
        inspector: {
          orientation: '方向',
          orientationOptions: {
            horizontal: '水平',
            vertical: '垂直',
          },
          style: '樣式',
          variantOptions: {
            plain: '簡潔',
            pill: '膠囊',
            dropdown: '下拉',
            mega: '大型選單',
          },
          activeHref: '啟用 href',
          items: '選單項目（label | href）',
          mobileHamburger: '行動版漢堡選單',
        },
      },
    };
  }

  if (locale === 'en') {
    return {
      section: {
        defaultLabel: 'Section',
        maxWidthDisplay: 'max width',
        inspector: {
          label: 'Label',
          maxWidth: 'Max width',
          padding: 'Padding',
        },
      },
      spacer: {
        editLabel: (size) => `Spacer ${size}px`,
        inspector: {
          size: 'Size (px)',
        },
      },
      menuBar: {
        navLabel: 'Primary navigation',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
        empty: 'Add menu items in the inspector',
        defaultItems: defaultMenuItems(locale),
        inspector: {
          orientation: 'Orientation',
          orientationOptions: {
            horizontal: 'Horizontal',
            vertical: 'Vertical',
          },
          style: 'Style',
          variantOptions: {
            plain: 'Plain',
            pill: 'Pill',
            dropdown: 'Dropdown',
            mega: 'Mega menu',
          },
          activeHref: 'Active href',
          items: 'Menu items (label | href)',
          mobileHamburger: 'Mobile hamburger',
        },
      },
    };
  }

  return {
    section: {
      defaultLabel: '섹션',
      maxWidthDisplay: '최대 폭',
      inspector: {
        label: '라벨',
        maxWidth: '최대 폭',
        padding: '패딩',
      },
    },
    spacer: {
      editLabel: (size) => `여백 ${size}px`,
      inspector: {
        size: '크기 (px)',
      },
    },
    menuBar: {
      navLabel: '주요 내비게이션',
      openMenu: '메뉴 열기',
      closeMenu: '메뉴 닫기',
      empty: '인스펙터에서 메뉴 항목을 추가하세요',
      defaultItems: defaultMenuItems(locale),
      inspector: {
        orientation: '방향',
        orientationOptions: {
          horizontal: '가로',
          vertical: '세로',
        },
        style: '스타일',
        variantOptions: {
          plain: '기본',
          pill: '필',
          dropdown: '드롭다운',
          mega: '메가 메뉴',
        },
        activeHref: '활성 href',
        items: '메뉴 항목 (label | href)',
        mobileHamburger: '모바일 햄버거',
      },
    },
  };
}

export function localizedLayoutText(value: string | undefined, localized: string, legacyDefault: string): string {
  const current = value ?? '';
  return current === legacyDefault ? localized : current;
}

function isLegacyDefaultMenuItems(items: MenuBarItem[]): boolean {
  if (items.length !== MENU_BAR_LEGACY_DEFAULT_ITEMS.length) return false;
  return items.every((item, index) => {
    const legacy = MENU_BAR_LEGACY_DEFAULT_ITEMS[index];
    return item.label === legacy.label && item.href === legacy.href && !item.children?.length;
  });
}

export function localizedMenuItems(items: MenuBarItem[], localizedDefaults: MenuBarItem[]): MenuBarItem[] {
  return isLegacyDefaultMenuItems(items) ? localizedDefaults : items;
}

import type { CardVariantKey } from '@/lib/builder/site/component-variants';
import type { Locale } from '@/lib/locales';
import { getContainerGalleryCopy } from './container-gallery-copy';

export interface DomainCardWidgetsCopy {
  localeOptions: Record<Locale, string>;
  columnCard: {
    empty: string;
    inspector: {
      slug: string;
      slugPlaceholder: string;
      locale: string;
      cardVariant: string;
      titleOverride: string;
      date: string;
      datePlaceholder: string;
      summary: string;
      cardVariants: Record<CardVariantKey, string>;
    };
  };
  columnList: {
    empty: string;
    inspector: {
      locale: string;
      limit: (value: number) => string;
      categoryFilter: string;
      categoryPlaceholder: string;
      autoItemsHint: string;
    };
  };
  attorneyCard: {
    empty: string;
    inspector: {
      name: string;
      title: string;
      titlePlaceholder: string;
      cardVariant: string;
      photoUrl: string;
      specialties: string;
      specialtiesPlaceholder: string;
      cardVariants: Record<CardVariantKey, string>;
    };
  };
}

const localeOptions: Record<Locale, Record<Locale, string>> = {
  ko: {
    ko: '한국어',
    'zh-hant': '번체 중국어',
    en: '영어',
  },
  'zh-hant': {
    ko: '韓文',
    'zh-hant': '繁體中文',
    en: '英文',
  },
  en: {
    ko: 'Korean',
    'zh-hant': 'Traditional Chinese',
    en: 'English',
  },
};

export function getDomainCardWidgetsCopy(locale: Locale): DomainCardWidgetsCopy {
  const cardVariants = getContainerGalleryCopy(locale).container.cardVariants;

  if (locale === 'zh-hant') {
    return {
      localeOptions: localeOptions['zh-hant'],
      columnCard: {
        empty: '專欄卡片',
        inspector: {
          slug: 'Slug',
          slugPlaceholder: '001-taiwan-company-establishment',
          locale: '語言',
          cardVariant: '卡片變體',
          titleOverride: '標題（覆寫）',
          date: '日期',
          datePlaceholder: '2026-04-30',
          summary: '摘要',
          cardVariants,
        },
      },
      columnList: {
        empty: '專欄',
        inspector: {
          locale: '語言',
          limit: (value) => `顯示數量 (${value})`,
          categoryFilter: '分類篩選（選填）',
          categoryPlaceholder: 'formation / labor / family ...',
          autoItemsHint: 'items 陣列會依語言與分類自動填入。',
        },
      },
      attorneyCard: {
        empty: '律師卡片',
        inspector: {
          name: '姓名',
          title: '職稱',
          titlePlaceholder: '主持律師 / Managing Attorney',
          cardVariant: '卡片變體',
          photoUrl: '照片 URL',
          specialties: '專長（以逗號分隔）',
          specialtiesPlaceholder: '公司法、勞動法、刑事',
          cardVariants,
        },
      },
    };
  }

  if (locale === 'en') {
    return {
      localeOptions: localeOptions.en,
      columnCard: {
        empty: 'Column Card',
        inspector: {
          slug: 'Slug',
          slugPlaceholder: '001-taiwan-company-establishment',
          locale: 'Locale',
          cardVariant: 'Card variant',
          titleOverride: 'Title (override)',
          date: 'Date',
          datePlaceholder: '2026-04-30',
          summary: 'Summary',
          cardVariants,
        },
      },
      columnList: {
        empty: 'Column',
        inspector: {
          locale: 'Locale',
          limit: (value) => `Limit (${value})`,
          categoryFilter: 'Category filter (optional)',
          categoryPlaceholder: 'formation / labor / family ...',
          autoItemsHint: 'The items array is filled automatically from locale and category.',
        },
      },
      attorneyCard: {
        empty: 'Attorney Card',
        inspector: {
          name: 'Name',
          title: 'Title',
          titlePlaceholder: 'Managing Attorney',
          cardVariant: 'Card variant',
          photoUrl: 'Photo URL',
          specialties: 'Specialties (comma-separated)',
          specialtiesPlaceholder: 'Corporate, labor, criminal',
          cardVariants,
        },
      },
    };
  }

  return {
    localeOptions: localeOptions.ko,
    columnCard: {
      empty: '컬럼 카드',
      inspector: {
        slug: 'Slug',
        slugPlaceholder: '001-taiwan-company-establishment',
        locale: '언어',
        cardVariant: '카드 변형',
        titleOverride: '제목 (override)',
        date: '날짜',
        datePlaceholder: '2026-04-30',
        summary: '요약',
        cardVariants,
      },
    },
    columnList: {
      empty: '컬럼',
      inspector: {
        locale: '언어',
        limit: (value) => `표시 수 (${value})`,
        categoryFilter: '카테고리 필터 (선택)',
        categoryPlaceholder: 'formation / labor / family ...',
        autoItemsHint: 'items 배열은 언어와 카테고리 기준으로 자동 채워집니다.',
      },
    },
    attorneyCard: {
      empty: '변호사 카드',
      inspector: {
        name: '이름',
        title: '직책',
        titlePlaceholder: '대표 변호사 / Managing Attorney',
        cardVariant: '카드 변형',
        photoUrl: '사진 URL',
        specialties: '전문 분야 (쉼표 구분)',
        specialtiesPlaceholder: '회사법, 노동법, 형사',
        cardVariants,
      },
    },
  };
}

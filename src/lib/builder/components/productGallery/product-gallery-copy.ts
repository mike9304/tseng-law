import type { CommerceAvailabilityState, CommerceProductSortBy } from '@/lib/builder/commerce/products-shared';
import type { Locale } from '@/lib/locales';

export interface ProductGalleryCopy {
  loading: string;
  error: string;
  allCategories: string;
  categoriesAriaLabel: string;
  sortLabel: string;
  empty: string;
  collectionFallback: string;
  quickView: string;
  previousPage: string;
  nextPage: string;
  sku: string;
  price: string;
  options: string;
  defaultProduct: string;
  detail: string;
  close: string;
  quickViewDialog: string;
  sortOptions: Record<CommerceProductSortBy, string>;
  availabilityLabels: Record<CommerceAvailabilityState, string>;
  mock: {
    products: Array<{
      title: string;
      description: string;
      body: string;
      mediaAlt: string;
      optionName: string;
      optionValues: string[];
      tag: string;
    }>;
    categories: Array<{
      name: string;
    }>;
  };
}

const PRODUCT_GALLERY_COPY: Record<Locale, ProductGalleryCopy> = {
  ko: {
    loading: '상품을 불러오는 중...',
    error: '상품을 불러오지 못했습니다.',
    allCategories: '전체',
    categoriesAriaLabel: '상품 카테고리',
    sortLabel: '정렬',
    empty: '표시할 상품이 없습니다.',
    collectionFallback: '컬렉션',
    quickView: '빠른 보기',
    previousPage: '이전',
    nextPage: '다음',
    sku: 'SKU',
    price: '가격',
    options: '옵션',
    defaultProduct: '기본 상품',
    detail: '상세 보기',
    close: '닫기',
    quickViewDialog: '상품 빠른 보기',
    sortOptions: {
      'updated-desc': '최신순',
      'title-asc': '이름순',
      'price-asc': '낮은 가격순',
      'price-desc': '높은 가격순',
    },
    availabilityLabels: {
      'in-stock': '판매 중',
      'low-stock': '재고 소량',
      'out-of-stock': '품절',
      backorder: '예약 가능',
      disabled: '비활성',
    },
    mock: {
      products: [
        {
          title: '대만 창업 준비 가이드',
          description: '회사 형태, 세무, 노무 체크리스트를 정리한 디지털 가이드입니다.',
          body: '대만 창업 준비 가이드 예시 상품입니다.',
          mediaAlt: '대만 창업 준비 가이드 표지',
          optionName: 'Format',
          optionValues: ['PDF', 'Consultation bundle'],
          tag: '대만창업',
        },
        {
          title: '대만 법률 상담 패키지',
          description: '계약, 고용, 법인 설립 쟁점을 1회 상담으로 정리하는 패키지입니다.',
          body: '대만 법률 상담 패키지 예시 상품입니다.',
          mediaAlt: '대만 법률 상담 패키지',
          optionName: '',
          optionValues: [],
          tag: '상담',
        },
      ],
      categories: [{ name: '디지털 가이드' }, { name: '상담 패키지' }],
    },
  },
  'zh-hant': {
    loading: '正在載入商品...',
    error: '無法載入商品。',
    allCategories: '全部',
    categoriesAriaLabel: '商品分類',
    sortLabel: '排序',
    empty: '沒有可顯示的商品。',
    collectionFallback: '商品系列',
    quickView: '快速檢視',
    previousPage: '上一頁',
    nextPage: '下一頁',
    sku: 'SKU',
    price: '價格',
    options: '選項',
    defaultProduct: '基本商品',
    detail: '查看詳情',
    close: '關閉',
    quickViewDialog: '商品快速檢視',
    sortOptions: {
      'updated-desc': '最新',
      'title-asc': '名稱',
      'price-asc': '價格由低到高',
      'price-desc': '價格由高到低',
    },
    availabilityLabels: {
      'in-stock': '販售中',
      'low-stock': '庫存不多',
      'out-of-stock': '售完',
      backorder: '可預訂',
      disabled: '已停用',
    },
    mock: {
      products: [
        {
          title: '台灣創業準備指南',
          description: '整理公司型態、稅務與勞務檢查清單的數位指南。',
          body: '台灣創業準備指南範例商品。',
          mediaAlt: '台灣創業準備指南封面',
          optionName: '格式',
          optionValues: ['PDF', '諮詢組合'],
          tag: '台灣創業',
        },
        {
          title: '台灣法律諮詢方案',
          description: '透過一次諮詢整理合約、雇用與公司設立議題的方案。',
          body: '台灣法律諮詢方案範例商品。',
          mediaAlt: '台灣法律諮詢方案',
          optionName: '',
          optionValues: [],
          tag: '諮詢',
        },
      ],
      categories: [{ name: '數位指南' }, { name: '諮詢方案' }],
    },
  },
  en: {
    loading: 'Loading products...',
    error: 'Could not load products.',
    allCategories: 'All',
    categoriesAriaLabel: 'Product categories',
    sortLabel: 'Sort',
    empty: 'No products to display.',
    collectionFallback: 'Collection',
    quickView: 'Quick view',
    previousPage: 'Previous',
    nextPage: 'Next',
    sku: 'SKU',
    price: 'Price',
    options: 'Options',
    defaultProduct: 'Default product',
    detail: 'View details',
    close: 'Close',
    quickViewDialog: 'Product quick view',
    sortOptions: {
      'updated-desc': 'Newest',
      'title-asc': 'Name',
      'price-asc': 'Price: low to high',
      'price-desc': 'Price: high to low',
    },
    availabilityLabels: {
      'in-stock': 'In stock',
      'low-stock': 'Low stock',
      'out-of-stock': 'Out of stock',
      backorder: 'Available for backorder',
      disabled: 'Disabled',
    },
    mock: {
      products: [
        {
          title: 'Taiwan Startup Guide',
          description: 'A digital guide covering entity, tax, and employment setup checklists.',
          body: 'Example product for the Taiwan startup guide.',
          mediaAlt: 'Taiwan startup guide cover',
          optionName: 'Format',
          optionValues: ['PDF', 'Consultation bundle'],
          tag: 'Taiwan startup',
        },
        {
          title: 'Taiwan Legal Consultation Package',
          description: 'A consultation package for contract, employment, and company setup issues.',
          body: 'Example product for the Taiwan legal consultation package.',
          mediaAlt: 'Taiwan legal consultation package',
          optionName: '',
          optionValues: [],
          tag: 'Consultation',
        },
      ],
      categories: [{ name: 'Digital guides' }, { name: 'Consultation packages' }],
    },
  },
};

export function getProductGalleryCopy(locale: Locale): ProductGalleryCopy {
  return PRODUCT_GALLERY_COPY[locale] ?? PRODUCT_GALLERY_COPY.ko;
}

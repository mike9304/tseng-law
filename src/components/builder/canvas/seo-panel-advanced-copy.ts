import type { BuilderStructuredDataBlockType } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';

export interface SeoPanelAdvancedCopy {
  title: string;
  help: string;
  addMeta: string;
  noTags: string;
  metaName: string;
  metaContent: string;
  delete: string;
  structuredTitle: string;
  faqLabel: string;
  faqAuto: string;
  faqOff: string;
  jsonLdTitle: string;
  jsonLdHelp: string;
  noBlocks: string;
  type: string;
  label: string;
  use: string;
  addArticle: string;
  structuredDataBlockTypes: Array<{ type: BuilderStructuredDataBlockType; label: string }>;
}

export function getSeoPanelAdvancedCopy(locale: Locale): SeoPanelAdvancedCopy {
  if (locale === 'zh-hant') {
    return {
      title: '進階 SEO meta tags',
      help: '相當於 Wix Advanced SEO 的 additional meta tags。會以 name/content meta tag 反映到 public head。',
      addMeta: '+ Meta',
      noTags: '沒有 Additional meta tag。',
      metaName: 'meta 名稱（英文·冒號·連字號）· 例：robots',
      metaContent: '最多 1000 字 · 例：index, follow',
      delete: '刪除',
      structuredTitle: '結構化資料',
      faqLabel: 'FAQPage',
      faqAuto: '從 FAQ widgets 自動產生',
      faqOff: '關閉',
      jsonLdTitle: 'JSON-LD 區塊',
      jsonLdHelp: '將 Article、FAQPage 等 schema.org 區塊逐頁儲存。',
      noBlocks: '沒有其他 JSON-LD 區塊。',
      type: '類型',
      label: '標籤',
      use: '啟用',
      addArticle: '+ 文章',
      structuredDataBlockTypes: [
        { type: 'Article', label: '文章' },
        { type: 'FAQPage', label: 'FAQPage' },
        { type: 'LegalService', label: '法律服務' },
        { type: 'Organization', label: '組織' },
        { type: 'LocalBusiness', label: '在地商家' },
        { type: 'BreadcrumbList', label: '麵包屑導覽' },
        { type: 'Custom', label: '自訂' },
      ],
    };
  }

  if (locale === 'en') {
    return {
      title: 'Advanced SEO meta tags',
      help: 'Equivalent to Wix Advanced SEO additional meta tags. Reflected in the public head as name/content meta tags.',
      addMeta: '+ Meta',
      noTags: 'No additional meta tags.',
      metaName: 'Meta name (letters, colons, hyphens) · e.g. robots',
      metaContent: 'Up to 1000 chars · e.g. index, follow',
      delete: 'Delete',
      structuredTitle: 'Structured data',
      faqLabel: 'FAQPage',
      faqAuto: 'Auto-generate from FAQ widgets',
      faqOff: 'Off',
      jsonLdTitle: 'JSON-LD blocks',
      jsonLdHelp: 'Store schema.org blocks such as Article and FAQPage per page.',
      noBlocks: 'No additional JSON-LD blocks yet.',
      type: 'Type',
      label: 'Label',
      use: 'Use',
      addArticle: '+ Article',
      structuredDataBlockTypes: [
        { type: 'Article', label: 'Article' },
        { type: 'FAQPage', label: 'FAQPage' },
        { type: 'LegalService', label: 'LegalService' },
        { type: 'Organization', label: 'Organization' },
        { type: 'LocalBusiness', label: 'LocalBusiness' },
        { type: 'BreadcrumbList', label: 'BreadcrumbList' },
        { type: 'Custom', label: 'Custom' },
      ],
    };
  }

  return {
    title: '고급 SEO 메타 태그',
    help: 'Wix 고급 SEO의 추가 메타 태그에 해당합니다. 이름/내용 메타 태그로 공개 head에 반영됩니다.',
    addMeta: '+ 메타',
    noTags: '추가 메타 태그가 없습니다.',
    metaName: 'meta 태그 name (영문·콜론·하이픈) · 예: robots',
    metaContent: '최대 1000자 · 예: index, follow',
    delete: '삭제',
    structuredTitle: '구조화 데이터',
    faqLabel: 'FAQPage',
    faqAuto: 'FAQ 위젯에서 자동 생성',
    faqOff: '끄기',
    jsonLdTitle: 'JSON-LD 블록',
    jsonLdHelp: 'Article, FAQPage 같은 schema.org 블록을 페이지별로 저장합니다.',
    noBlocks: '추가 JSON-LD 블록이 없습니다.',
    type: '유형',
    label: '라벨',
    use: '사용',
    addArticle: '+ 칼럼',
    structuredDataBlockTypes: [
      { type: 'Article', label: '칼럼' },
      { type: 'FAQPage', label: 'FAQPage' },
      { type: 'LegalService', label: '법률 서비스' },
      { type: 'Organization', label: '조직' },
      { type: 'LocalBusiness', label: '지역 비즈니스' },
      { type: 'BreadcrumbList', label: '브레드크럼' },
      { type: 'Custom', label: '사용자 정의' },
    ],
  };
}

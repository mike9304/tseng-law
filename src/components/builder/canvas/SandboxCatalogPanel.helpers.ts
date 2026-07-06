import type { BuilderComponentCategory, BuilderComponentDefinition } from '@/lib/builder/components/define';
import {
  createCanvasNodeTemplate,
} from '@/lib/builder/canvas/store';
import type { BuilderCanvasNode, BuilderCanvasNodeKind } from '@/lib/builder/canvas/types';
import type { BuiltInSectionTemplate } from '@/lib/builder/sections/templates';
import {
  matchesTemplateSearch,
  scoreTemplateSearch,
} from '@/lib/builder/templates/filters';
import type {
  PageTemplate,
  TemplateDensity,
  TemplatePageType,
  TemplateQualityTier,
  TemplateVisualStyle,
} from '@/lib/builder/templates/types';
import type { Locale } from '@/lib/locales';
import { TEMPLATE_CATEGORY_LABELS } from './template-categories';

export const STAGE_WIDTH = 1280;
export const STAGE_HEIGHT = 880;
export const PAGE_TEMPLATE_PREVIEW_LIMIT = 8;

export const CATEGORY_ORDER: BuilderComponentCategory[] = ['basic', 'media', 'layout', 'domain'];
export const CATEGORY_ICONS: Record<BuilderComponentCategory, string> = {
  basic: 'Aa',
  media: '◩',
  layout: '▦',
  domain: '◈',
  advanced: '⋯',
};

export interface CatalogCategoryCopy {
  label: string;
  sublabel: string;
}

const CATALOG_CATEGORY_COPY: Record<BuilderComponentCategory, Record<Locale, CatalogCategoryCopy>> = {
  basic: {
    ko: { label: '기본', sublabel: '텍스트, 버튼, 헤딩' },
    'zh-hant': { label: '基本', sublabel: '文字、按鈕、標題' },
    en: { label: 'Basic', sublabel: 'Text, button, heading' },
  },
  media: {
    ko: { label: '미디어', sublabel: '이미지, 갤러리, 비디오, 오디오' },
    'zh-hant': { label: '媒體', sublabel: '圖片、圖庫、影片、音訊' },
    en: { label: 'Media', sublabel: 'Image, gallery, video, audio' },
  },
  layout: {
    ko: { label: '레이아웃', sublabel: '컨테이너, 섹션' },
    'zh-hant': { label: '版面', sublabel: '容器、區段' },
    en: { label: 'Layout', sublabel: 'Container, section' },
  },
  domain: {
    ko: { label: '도메인 블록', sublabel: '사이트 블록, 폼, 예약, 콘텐츠' },
    'zh-hant': { label: '領域區塊', sublabel: '網站區塊、表單、預約、內容' },
    en: { label: 'Domain', sublabel: 'Site blocks, forms, bookings, content' },
  },
  advanced: {
    ko: { label: '고급', sublabel: '임베드, 코드, 여백, 구분선' },
    'zh-hant': { label: '進階', sublabel: '嵌入、程式碼、間距、分隔線' },
    en: { label: 'Advanced', sublabel: 'Embed, code, spacer, divider' },
  },
};

export const CATEGORY_LABELS: Record<BuilderComponentCategory, string> = {
  basic: CATALOG_CATEGORY_COPY.basic.ko.label,
  media: CATALOG_CATEGORY_COPY.media.ko.label,
  layout: CATALOG_CATEGORY_COPY.layout.ko.label,
  domain: CATALOG_CATEGORY_COPY.domain.ko.label,
  advanced: CATALOG_CATEGORY_COPY.advanced.ko.label,
};
export const CATEGORY_SUBLABELS: Record<BuilderComponentCategory, string> = {
  basic: CATALOG_CATEGORY_COPY.basic.ko.sublabel,
  media: CATALOG_CATEGORY_COPY.media.ko.sublabel,
  layout: CATALOG_CATEGORY_COPY.layout.ko.sublabel,
  domain: CATALOG_CATEGORY_COPY.domain.ko.sublabel,
  advanced: CATALOG_CATEGORY_COPY.advanced.ko.sublabel,
};

export interface SandboxCatalogPanelCopy {
  title: string;
  countLabel: (visibleCount: number, totalCount: number, hasQuery: boolean) => string;
  collapseTitle: string;
  expandTitle: string;
  collapseLabel: string;
  expandLabel: string;
  intro: string;
  openPageTemplates: (count: number) => string;
  searchLabel: string;
  searchAriaLabel: string;
  searchPlaceholder: string;
  quickStripAriaLabel: string;
  resultSummary: (count: number, query: string) => string;
  pageTemplateShowroom: string;
  pageTemplateCount: (visibleCount: number, totalCount: number) => string;
  viewAllResults: string;
  appWidgetsName: string;
  appWidgetsHint: (count: number) => string;
  appWidgetMeta: (appName: string, area: string) => string;
  appWidgetDescriptionFallback: (appName: string) => string;
  widgetRuntimeUnavailable: string;
  dragTitle: (name: string) => string;
  quickAddTitle: (name: string) => string;
  dragMeta: (kind: string) => string;
  quickAdd: string;
  runtimeUnavailable: string;
  widgetSections: {
    text: { name: string; hint: (count: number) => string };
    media: { name: string; hint: (count: number) => string };
    gallery: { name: string; hint: (count: number) => string };
    layout: { name: string; hint: (count: number) => string };
    interactive: { name: string; hint: (count: number) => string };
    navigation: { name: string; hint: (count: number) => string };
    social: { name: string; hint: (count: number) => string };
    location: { name: string; hint: (count: number) => string };
    decorative: { name: string; hint: (count: number) => string };
    designer: { name: string; hint: (count: number) => string };
  };
  sectionTemplatesName: string;
  sectionTemplatesHint: (count: number) => string;
  savedSectionsName: string;
  savedSectionsHint: string;
  emptyTitle: string;
  emptyHint: string;
}

const KIND_PRIORITY: Partial<Record<BuilderComponentCategory, string[]>> = {
  basic: ['text', 'button', 'heading'],
  media: ['image', 'gallery', 'video', 'video-embed', 'audio', 'lottie', 'icon'],
  layout: ['container', 'section'],
  domain: [
    'composite',
    'form',
    'form-input',
    'form-textarea',
    'form-select',
    'form-radio',
    'form-checkbox',
    'form-date',
    'form-file',
    'form-submit',
  ],
};

export const FEATURED_KINDS: BuilderCanvasNodeKind[] = ['text', 'button', 'image', 'container', 'form'];

const COMPONENT_CATALOG_NAMES: Record<string, Record<Locale, string>> = {
  text: { ko: '텍스트', 'zh-hant': '文字', en: 'Text' },
  image: { ko: '이미지', 'zh-hant': '圖片', en: 'Image' },
  button: { ko: '버튼', 'zh-hant': '按鈕', en: 'Button' },
  heading: { ko: '헤딩', 'zh-hant': '標題', en: 'Heading' },
  container: { ko: '컨테이너', 'zh-hant': '容器', en: 'Container' },
  section: { ko: '섹션', 'zh-hant': '區段', en: 'Section' },
  gallery: { ko: '갤러리', 'zh-hant': '圖庫', en: 'Gallery' },
  video: { ko: '비디오', 'zh-hant': '影片', en: 'Video' },
  'video-embed': { ko: '영상 임베드', 'zh-hant': '影片嵌入', en: 'Video embed' },
  audio: { ko: '오디오', 'zh-hant': '音訊', en: 'Audio' },
  lottie: { ko: 'Lottie 애니메이션', 'zh-hant': 'Lottie 動畫', en: 'Lottie animation' },
  map: { ko: '지도', 'zh-hant': '地圖', en: 'Map' },
  customEmbed: { ko: '커스텀 임베드', 'zh-hant': '自訂嵌入', en: 'Custom embed' },
  codeBlock: { ko: '코드 블록', 'zh-hant': '程式碼區塊', en: 'Code block' },
  icon: { ko: '아이콘', 'zh-hant': '圖示', en: 'Icon' },
  spacer: { ko: '여백', 'zh-hant': '間距', en: 'Spacer' },
  divider: { ko: '구분선', 'zh-hant': '分隔線', en: 'Divider' },
  columnCard: { ko: '칼럼 카드', 'zh-hant': '專欄卡片', en: 'Column card' },
  columnList: { ko: '칼럼 목록', 'zh-hant': '專欄列表', en: 'Column list' },
  attorneyCard: { ko: '변호사 카드', 'zh-hant': '律師卡片', en: 'Attorney card' },
  faqList: { ko: 'FAQ 목록', 'zh-hant': 'FAQ 列表', en: 'FAQ list' },
  contactForm: { ko: '문의 폼', 'zh-hant': '聯絡表單', en: 'Contact form' },
  ctaBanner: { ko: 'CTA 배너', 'zh-hant': 'CTA 橫幅', en: 'CTA banner' },
  'booking-widget': { ko: '예약 위젯', 'zh-hant': '預約小工具', en: 'Booking widget' },
  composite: { ko: '사이트 블록', 'zh-hant': '網站區塊', en: 'Site block' },
  form: { ko: '폼', 'zh-hant': '表單', en: 'Form' },
  'form-input': { ko: '입력 필드', 'zh-hant': '輸入欄位', en: 'Input field' },
  'form-textarea': { ko: '텍스트 영역', 'zh-hant': '文字區域', en: 'Text area' },
  'form-submit': { ko: '제출 버튼', 'zh-hant': '提交按鈕', en: 'Submit button' },
  'form-select': { ko: '선택 필드', 'zh-hant': '選擇欄位', en: 'Select field' },
  'form-checkbox': { ko: '체크박스', 'zh-hant': '核取方塊', en: 'Checkbox' },
  'form-radio': { ko: '라디오 그룹', 'zh-hant': '單選群組', en: 'Radio group' },
  'form-file': { ko: '파일 업로드', 'zh-hant': '檔案上傳', en: 'File upload' },
  'form-date': { ko: '날짜 필드', 'zh-hant': '日期欄位', en: 'Date field' },
  'form-signature': { ko: '서명 입력', 'zh-hant': '簽名輸入', en: 'Signature input' },
  'form-payment': { ko: '결제', 'zh-hant': '付款', en: 'Payment' },
  'blog-feed': { ko: '블로그 피드', 'zh-hant': '部落格動態', en: 'Blog feed' },
  'blog-post-card': { ko: '블로그 카드', 'zh-hant': '部落格卡片', en: 'Blog card' },
  'blog-categories': { ko: '블로그 카테고리', 'zh-hant': '部落格分類', en: 'Blog categories' },
  'blog-archive': { ko: '블로그 아카이브', 'zh-hant': '部落格彙整', en: 'Blog archive' },
  'featured-posts': { ko: '추천 포스트', 'zh-hant': '精選文章', en: 'Featured posts' },
  'blog-author': { ko: '블로그 작성자', 'zh-hant': '部落格作者', en: 'Blog author' },
  'blog-recent-posts': { ko: '최근 블로그 글', 'zh-hant': '最新部落格文章', en: 'Recent blog posts' },
  'event-list': { ko: '이벤트 목록', 'zh-hant': '活動列表', en: 'Event list' },
  'event-calendar': { ko: '이벤트 캘린더', 'zh-hant': '活動行事曆', en: 'Event calendar' },
  'event-rsvp': { ko: '이벤트 신청', 'zh-hant': '活動報名', en: 'Event RSVP' },
  'portfolio-list': { ko: '포트폴리오 목록', 'zh-hant': '作品集列表', en: 'Portfolio list' },
  'product-gallery': { ko: '상품 갤러리', 'zh-hant': '商品圖庫', en: 'Product gallery' },
  countdown: { ko: '카운트다운', 'zh-hant': '倒數計時', en: 'Countdown' },
  progress: { ko: '진행률', 'zh-hant': '進度', en: 'Progress' },
  rating: { ko: '별점', 'zh-hant': '評分', en: 'Rating' },
  'notification-bar': { ko: '알림 바', 'zh-hant': '通知列', en: 'Notification bar' },
  'back-to-top': { ko: '맨 위로', 'zh-hant': '回到頂端', en: 'Back to top' },
  'menu-bar': { ko: '메뉴 바', 'zh-hant': '選單列', en: 'Menu bar' },
  'anchor-menu': { ko: '앵커 메뉴', 'zh-hant': '錨點選單', en: 'Anchor menu' },
  breadcrumbs: { ko: '브레드크럼', 'zh-hant': '麵包屑', en: 'Breadcrumbs' },
  'social-bar': { ko: '소셜 바', 'zh-hant': '社群列', en: 'Social bar' },
  'share-buttons': { ko: '공유 버튼', 'zh-hant': '分享按鈕', en: 'Share buttons' },
  'social-embed': { ko: '소셜 임베드', 'zh-hant': '社群嵌入', en: 'Social embed' },
  'floating-chat': { ko: '플로팅 채팅', 'zh-hant': '浮動聊天', en: 'Floating chat' },
  'address-block': { ko: '주소 블록', 'zh-hant': '地址區塊', en: 'Address block' },
  'business-hours': { ko: '영업 시간', 'zh-hant': '營業時間', en: 'Business hours' },
  'multi-location-map': { ko: '다중 지도', 'zh-hant': '多地點地圖', en: 'Multi-location map' },
  shape: { ko: '도형', 'zh-hant': '形狀', en: 'Shape' },
  pattern: { ko: '패턴', 'zh-hant': '圖樣', en: 'Pattern' },
  'parallax-bg': { ko: '패럴랙스 배경', 'zh-hant': '視差背景', en: 'Parallax background' },
  frame: { ko: '프레임', 'zh-hant': '框架', en: 'Frame' },
  sticker: { ko: '스티커', 'zh-hant': '貼紙', en: 'Sticker' },
  'bar-chart': { ko: '막대 차트', 'zh-hant': '長條圖', en: 'Bar chart' },
  'line-chart': { ko: '라인 차트', 'zh-hant': '折線圖', en: 'Line chart' },
  'pie-chart': { ko: '파이 차트', 'zh-hant': '圓餅圖', en: 'Pie chart' },
  counter: { ko: '카운터', 'zh-hant': '計數器', en: 'Counter' },
  'testimonial-carousel': { ko: '의뢰인 후기', 'zh-hant': '客戶評價', en: 'Testimonials' },
  'pricing-table': { ko: '요금제', 'zh-hant': '價格表', en: 'Pricing table' },
  'comparison-table': { ko: '비교 표', 'zh-hant': '比較表', en: 'Comparison table' },
  timeline: { ko: '연혁', 'zh-hant': '時間軸', en: 'Timeline' },
  'team-member-card': { ko: '팀원 카드', 'zh-hant': '團隊成員卡片', en: 'Team member card' },
  'service-feature-card': { ko: '서비스 카드', 'zh-hant': '服務卡片', en: 'Service card' },
  'site-search': { ko: '사이트 검색', 'zh-hant': '網站搜尋', en: 'Site search' },
  'member-login': { ko: '회원 로그인', 'zh-hant': '會員登入', en: 'Member login' },
  'member-account-summary': { ko: '회원 계정 요약', 'zh-hant': '會員帳戶摘要', en: 'Member account summary' },
  'member-profile-form': { ko: '회원 프로필 폼', 'zh-hant': '會員資料表單', en: 'Member profile form' },
  'member-bookings-list': { ko: '회원 예약 목록', 'zh-hant': '會員預約列表', en: 'Member bookings list' },
};

const PAGE_TEMPLATE_PAGE_TYPE_LABELS: Record<TemplatePageType, Record<Locale, string>> = {
  home: { ko: '홈', 'zh-hant': '首頁', en: 'Home' },
  about: { ko: '소개', 'zh-hant': '關於', en: 'About' },
  service: { ko: '서비스', 'zh-hant': '服務', en: 'Service' },
  contact: { ko: '문의', 'zh-hant': '聯絡', en: 'Contact' },
  pricing: { ko: '가격', 'zh-hant': '價格', en: 'Pricing' },
  portfolio: { ko: '포트폴리오', 'zh-hant': '作品集', en: 'Portfolio' },
  gallery: { ko: '갤러리', 'zh-hant': '圖庫', en: 'Gallery' },
  blog: { ko: '블로그', 'zh-hant': '部落格', en: 'Blog' },
  product: { ko: '상품', 'zh-hant': '商品', en: 'Product' },
  booking: { ko: '예약', 'zh-hant': '預約', en: 'Booking' },
  faq: { ko: 'FAQ', 'zh-hant': 'FAQ', en: 'FAQ' },
  'legal-detail': { ko: '법률 상세', 'zh-hant': '法律詳情', en: 'Legal detail' },
};

const PAGE_TEMPLATE_CATEGORY_DISPLAY_LABELS: Record<PageTemplate['category'], Record<Locale, string>> = {
  law: { ko: '법률', 'zh-hant': '法律', en: 'Law' },
  business: { ko: '비즈니스', 'zh-hant': '商務', en: 'Business' },
  restaurant: { ko: '레스토랑', 'zh-hant': '餐廳', en: 'Restaurant' },
  health: { ko: '의료', 'zh-hant': '醫療', en: 'Health' },
  realestate: { ko: '부동산', 'zh-hant': '房地產', en: 'Real estate' },
  education: { ko: '교육', 'zh-hant': '教育', en: 'Education' },
  creative: { ko: '크리에이티브', 'zh-hant': '創意', en: 'Creative' },
  tech: { ko: '테크', 'zh-hant': '科技', en: 'Tech' },
  beauty: { ko: '뷰티', 'zh-hant': '美業', en: 'Beauty' },
  fitness: { ko: '피트니스', 'zh-hant': '健身', en: 'Fitness' },
  travel: { ko: '여행', 'zh-hant': '旅遊', en: 'Travel' },
  events: { ko: '이벤트', 'zh-hant': '活動', en: 'Events' },
  nonprofit: { ko: '비영리', 'zh-hant': '非營利', en: 'Nonprofit' },
  layout: { ko: '레이아웃', 'zh-hant': '版面', en: 'Layout' },
  ecommerce: { ko: '쇼핑몰', 'zh-hant': '電商', en: 'Ecommerce' },
  photography: { ko: '사진', 'zh-hant': '攝影', en: 'Photography' },
  music: { ko: '음악', 'zh-hant': '音樂', en: 'Music' },
  blog: { ko: '블로그', 'zh-hant': '部落格', en: 'Blog' },
  portfolio: { ko: '포트폴리오', 'zh-hant': '作品集', en: 'Portfolio' },
  consulting: { ko: '컨설팅', 'zh-hant': '顧問', en: 'Consulting' },
  cafe: { ko: '카페', 'zh-hant': '咖啡廳', en: 'Cafe' },
  pet: { ko: '반려동물', 'zh-hant': '寵物', en: 'Pet' },
  startup: { ko: '스타트업', 'zh-hant': '新創', en: 'Startup' },
  agency: { ko: '에이전시', 'zh-hant': '代理商', en: 'Agency' },
  saas: { ko: 'SaaS', 'zh-hant': 'SaaS', en: 'SaaS' },
  conference: { ko: '컨퍼런스', 'zh-hant': '會議', en: 'Conference' },
  podcast: { ko: '팟캐스트', 'zh-hant': 'Podcast', en: 'Podcast' },
  magazine: { ko: '매거진', 'zh-hant': '雜誌', en: 'Magazine' },
  dental: { ko: '치과', 'zh-hant': '牙科', en: 'Dental' },
  yoga: { ko: '요가', 'zh-hant': '瑜伽', en: 'Yoga' },
  freelancer: { ko: '프리랜서', 'zh-hant': '自由工作者', en: 'Freelancer' },
  wedding: { ko: '웨딩', 'zh-hant': '婚禮', en: 'Wedding' },
  carrental: { ko: '렌터카', 'zh-hant': '租車', en: 'Car rental' },
  eventplanner: { ko: '이벤트 기획', 'zh-hant': '活動企劃', en: 'Event planner' },
  fashion: { ko: '패션', 'zh-hant': '時尚', en: 'Fashion' },
};

const PAGE_TEMPLATE_STYLE_LABELS: Record<TemplateVisualStyle, Record<Locale, string>> = {
  editorial: { ko: '에디토리얼', 'zh-hant': '編輯風', en: 'Editorial' },
  executive: { ko: '임원용', 'zh-hant': '高階商務', en: 'Executive' },
  luxury: { ko: '럭셔리', 'zh-hant': '奢華', en: 'Luxury' },
  clinical: { ko: '클리니컬', 'zh-hant': '醫療清爽', en: 'Clinical' },
  local: { ko: '로컬', 'zh-hant': '在地', en: 'Local' },
  product: { ko: '제품 중심', 'zh-hant': '產品導向', en: 'Product-led' },
  portfolio: { ko: '포트폴리오', 'zh-hant': '作品集', en: 'Portfolio' },
  'high-contrast': { ko: '하이 콘트라스트', 'zh-hant': '高對比', en: 'High contrast' },
  calm: { ko: '차분함', 'zh-hant': '沉穩', en: 'Calm' },
  minimal: { ko: '미니멀', 'zh-hant': '極簡', en: 'Minimal' },
  playful: { ko: '플레이풀', 'zh-hant': '活潑', en: 'Playful' },
  premium: { ko: '프리미엄', 'zh-hant': '精緻', en: 'Premium' },
  'image-led': { ko: '이미지 중심', 'zh-hant': '圖片導向', en: 'Image-led' },
  conversion: { ko: '전환 중심', 'zh-hant': '轉換導向', en: 'Conversion' },
};

const PAGE_TEMPLATE_DENSITY_LABELS: Record<TemplateDensity, Record<Locale, string>> = {
  minimal: { ko: '미니멀', 'zh-hant': '極簡', en: 'Minimal' },
  balanced: { ko: '균형형', 'zh-hant': '平衡', en: 'Balanced' },
  editorial: { ko: '에디토리얼', 'zh-hant': '編輯風', en: 'Editorial' },
  commercial: { ko: '상업형', 'zh-hant': '商業型', en: 'Commercial' },
  dashboard: { ko: '대시보드형', 'zh-hant': '儀表板型', en: 'Dashboard' },
  portfolio: { ko: '포트폴리오형', 'zh-hant': '作品集型', en: 'Portfolio' },
  conversion: { ko: '전환형', 'zh-hant': '轉換型', en: 'Conversion' },
};

const PAGE_TEMPLATE_QUALITY_LABELS: Record<TemplateQualityTier, Record<Locale, string>> = {
  premium: { ko: '프리미엄', 'zh-hant': '精選', en: 'Premium' },
  standard: { ko: '표준', 'zh-hant': '標準', en: 'Standard' },
  draft: { ko: '초안', 'zh-hant': '草稿', en: 'Draft' },
  'under-review': { ko: '검토 중', 'zh-hant': '審核中', en: 'Under review' },
};

const PAGE_TEMPLATE_CTA_GOAL_LABELS: Record<string, Record<Locale, string>> = {
  '사안 검토 요청': { ko: '사안 검토 요청', 'zh-hant': '請求案件評估', en: 'Case review request' },
  '예약 전환': { ko: '예약 전환', 'zh-hant': '預約轉換', en: 'Booking conversion' },
  '무료 체험 시작': { ko: '무료 체험 시작', 'zh-hant': '開始免費試用', en: 'Start free trial' },
  '상품 구매': { ko: '상품 구매', 'zh-hant': '商品購買', en: 'Product purchase' },
  '프로젝트 문의': { ko: '프로젝트 문의', 'zh-hant': '專案諮詢', en: 'Project inquiry' },
};

const PAGE_TEMPLATE_SUBCATEGORY_LABELS: Record<string, Record<Locale, string>> = {
  about: { ko: '소개', 'zh-hant': '關於', en: 'About' },
  agenda: { ko: '일정', 'zh-hant': '議程', en: 'Agenda' },
  agents: { ko: '에이전트', 'zh-hant': '經紀人', en: 'Agents' },
  archive: { ko: '아카이브', 'zh-hant': '彙整', en: 'Archive' },
  article: { ko: '아티클', 'zh-hant': '文章', en: 'Article' },
  articles: { ko: '아티클', 'zh-hant': '文章', en: 'Articles' },
  authors: { ko: '작성자', 'zh-hant': '作者', en: 'Authors' },
  blog: { ko: '블로그', 'zh-hant': '部落格', en: 'Blog' },
  booking: { ko: '예약', 'zh-hant': '預約', en: 'Booking' },
  buying: { ko: '구매', 'zh-hant': '買屋', en: 'Buying' },
  careers: { ko: '채용', 'zh-hant': '徵才', en: 'Careers' },
  'case-studies': { ko: '사례 연구', 'zh-hant': '案例研究', en: 'Case studies' },
  'case-study': { ko: '사례 연구', 'zh-hant': '案例研究', en: 'Case study' },
  category: { ko: '카테고리', 'zh-hant': '分類', en: 'Category' },
  catering: { ko: '케이터링', 'zh-hant': '外燴', en: 'Catering' },
  changelog: { ko: '변경 기록', 'zh-hant': '更新紀錄', en: 'Changelog' },
  classes: { ko: '클래스', 'zh-hant': '課程', en: 'Classes' },
  contact: { ko: '문의', 'zh-hant': '聯絡', en: 'Contact' },
  customers: { ko: '고객', 'zh-hant': '客戶', en: 'Customers' },
  cv: { ko: '이력', 'zh-hant': '履歷', en: 'CV' },
  destinations: { ko: '여행지', 'zh-hant': '目的地', en: 'Destinations' },
  discography: { ko: '디스코그래피', 'zh-hant': '作品年表', en: 'Discography' },
  doctors: { ko: '의료진', 'zh-hant': '醫師', en: 'Doctors' },
  donate: { ko: '후원', 'zh-hant': '捐款', en: 'Donate' },
  episodes: { ko: '에피소드', 'zh-hant': '集數', en: 'Episodes' },
  events: { ko: '이벤트', 'zh-hant': '活動', en: 'Events' },
  faq: { ko: 'FAQ', 'zh-hant': 'FAQ', en: 'FAQ' },
  features: { ko: '기능', 'zh-hant': '功能', en: 'Features' },
  fleet: { ko: '차량', 'zh-hant': '車隊', en: 'Fleet' },
  gallery: { ko: '갤러리', 'zh-hant': '圖庫', en: 'Gallery' },
  guides: { ko: '가이드', 'zh-hant': '指南', en: 'Guides' },
  home: { ko: '홈', 'zh-hant': '首頁', en: 'Home' },
  homepage: { ko: '홈', 'zh-hant': '首頁', en: 'Home' },
  hosts: { ko: '호스트', 'zh-hant': '主持人', en: 'Hosts' },
  instructors: { ko: '강사', 'zh-hant': '講師', en: 'Instructors' },
  insurance: { ko: '보험', 'zh-hant': '保險', en: 'Insurance' },
  integrations: { ko: '연동', 'zh-hant': '整合', en: 'Integrations' },
  issue: { ko: '이슈', 'zh-hant': '期刊', en: 'Issue' },
  legal: { ko: '법률', 'zh-hant': '法律', en: 'Legal' },
  listings: { ko: '매물', 'zh-hant': '物件', en: 'Listings' },
  locations: { ko: '위치', 'zh-hant': '地點', en: 'Locations' },
  loyalty: { ko: '멤버십', 'zh-hant': '忠誠會員', en: 'Loyalty' },
  lyrics: { ko: '가사', 'zh-hant': '歌詞', en: 'Lyrics' },
  menu: { ko: '메뉴', 'zh-hant': '菜單', en: 'Menu' },
  merch: { ko: '굿즈', 'zh-hant': '周邊商品', en: 'Merch' },
  mission: { ko: '미션', 'zh-hant': '使命', en: 'Mission' },
  neighborhoods: { ko: '지역', 'zh-hant': '社區', en: 'Neighborhoods' },
  newsletter: { ko: '뉴스레터', 'zh-hant': '電子報', en: 'Newsletter' },
  nutrition: { ko: '영양', 'zh-hant': '營養', en: 'Nutrition' },
  packages: { ko: '패키지', 'zh-hant': '方案包', en: 'Packages' },
  podcast: { ko: '팟캐스트', 'zh-hant': 'Podcast', en: 'Podcast' },
  portfolio: { ko: '포트폴리오', 'zh-hant': '作品集', en: 'Portfolio' },
  press: { ko: '언론', 'zh-hant': '媒體報導', en: 'Press' },
  pricing: { ko: '가격', 'zh-hant': '價格', en: 'Pricing' },
  process: { ko: '프로세스', 'zh-hant': '流程', en: 'Process' },
  'product-detail': { ko: '상품 상세', 'zh-hant': '商品詳情', en: 'Product detail' },
  products: { ko: '상품', 'zh-hant': '商品', en: 'Products' },
  programs: { ko: '프로그램', 'zh-hant': '方案', en: 'Programs' },
  register: { ko: '등록', 'zh-hant': '報名', en: 'Register' },
  resources: { ko: '자료', 'zh-hant': '資源', en: 'Resources' },
  results: { ko: '성과', 'zh-hant': '成果', en: 'Results' },
  reviews: { ko: '후기', 'zh-hant': '評價', en: 'Reviews' },
  sale: { ko: '세일', 'zh-hant': '特賣', en: 'Sale' },
  schedule: { ko: '일정', 'zh-hant': '課表', en: 'Schedule' },
  selling: { ko: '판매', 'zh-hant': '賣屋', en: 'Selling' },
  services: { ko: '서비스', 'zh-hant': '服務', en: 'Services' },
  shipping: { ko: '배송', 'zh-hant': '配送', en: 'Shipping' },
  speakers: { ko: '연사', 'zh-hant': '講者', en: 'Speakers' },
  sponsors: { ko: '스폰서', 'zh-hant': '贊助商', en: 'Sponsors' },
  subscribe: { ko: '구독', 'zh-hant': '訂閱', en: 'Subscribe' },
  teachers: { ko: '교사', 'zh-hant': '教師', en: 'Teachers' },
  team: { ko: '팀', 'zh-hant': '團隊', en: 'Team' },
  testimonials: { ko: '후기', 'zh-hant': '見證', en: 'Testimonials' },
  tour: { ko: '투어', 'zh-hant': '導覽', en: 'Tour' },
  venue: { ko: '장소', 'zh-hant': '場地', en: 'Venue' },
  venues: { ko: '장소', 'zh-hant': '場地', en: 'Venues' },
  videos: { ko: '비디오', 'zh-hant': '影片', en: 'Videos' },
  volunteer: { ko: '자원봉사', 'zh-hant': '志工', en: 'Volunteer' },
  work: { ko: '작업물', 'zh-hant': '作品', en: 'Work' },
};

const PAGE_TEMPLATE_TAG_LABELS: Record<string, Record<Locale, string>> = {
  B2B: { ko: 'B2B', 'zh-hant': 'B2B', en: 'B2B' },
  SaaS: { ko: 'SaaS', 'zh-hant': 'SaaS', en: 'SaaS' },
  법률: { ko: '법률', 'zh-hant': '法律', en: 'Legal' },
  상담: { ko: '상담', 'zh-hant': '諮詢', en: 'Consultation' },
  '전문 서비스': { ko: '전문 서비스', 'zh-hant': '專業服務', en: 'Professional services' },
  비즈니스: { ko: '비즈니스', 'zh-hant': '商務', en: 'Business' },
  회사소개: { ko: '회사소개', 'zh-hant': '公司介紹', en: 'Company profile' },
  레스토랑: { ko: '레스토랑', 'zh-hant': '餐廳', en: 'Restaurant' },
  예약: { ko: '예약', 'zh-hant': '預約', en: 'Booking' },
  메뉴: { ko: '메뉴', 'zh-hant': '菜單', en: 'Menu' },
  의료: { ko: '의료', 'zh-hant': '醫療', en: 'Medical' },
  클리닉: { ko: '클리닉', 'zh-hant': '診所', en: 'Clinic' },
  부동산: { ko: '부동산', 'zh-hant': '房地產', en: 'Real estate' },
  매물: { ko: '매물', 'zh-hant': '物件', en: 'Listings' },
  교육: { ko: '교육', 'zh-hant': '教育', en: 'Education' },
  프로그램: { ko: '프로그램', 'zh-hant': '方案', en: 'Programs' },
  크리에이티브: { ko: '크리에이티브', 'zh-hant': '創意', en: 'Creative' },
  포트폴리오: { ko: '포트폴리오', 'zh-hant': '作品集', en: 'Portfolio' },
  테크: { ko: '테크', 'zh-hant': '科技', en: 'Tech' },
  제품: { ko: '제품', 'zh-hant': '產品', en: 'Product' },
  뷰티: { ko: '뷰티', 'zh-hant': '美業', en: 'Beauty' },
  시술: { ko: '시술', 'zh-hant': '療程', en: 'Treatments' },
  피트니스: { ko: '피트니스', 'zh-hant': '健身', en: 'Fitness' },
  체험: { ko: '체험', 'zh-hant': '體驗', en: 'Trial' },
  클래스: { ko: '클래스', 'zh-hant': '課程', en: 'Classes' },
  여행: { ko: '여행', 'zh-hant': '旅遊', en: 'Travel' },
  패키지: { ko: '패키지', 'zh-hant': '方案包', en: 'Packages' },
  이벤트: { ko: '이벤트', 'zh-hant': '活動', en: 'Events' },
  비영리: { ko: '비영리', 'zh-hant': '非營利', en: 'Nonprofit' },
  후원: { ko: '후원', 'zh-hant': '捐助', en: 'Donations' },
  레이아웃: { ko: '레이아웃', 'zh-hant': '版面', en: 'Layout' },
  쇼핑몰: { ko: '쇼핑몰', 'zh-hant': '電商', en: 'Ecommerce' },
  상품: { ko: '상품', 'zh-hant': '商品', en: 'Products' },
  구매: { ko: '구매', 'zh-hant': '購買', en: 'Purchase' },
  사진: { ko: '사진', 'zh-hant': '攝影', en: 'Photography' },
  음악: { ko: '음악', 'zh-hant': '音樂', en: 'Music' },
  공연: { ko: '공연', 'zh-hant': '演出', en: 'Performance' },
  팬: { ko: '팬', 'zh-hant': '粉絲', en: 'Fans' },
  블로그: { ko: '블로그', 'zh-hant': '部落格', en: 'Blog' },
  콘텐츠: { ko: '콘텐츠', 'zh-hant': '內容', en: 'Content' },
  컨설팅: { ko: '컨설팅', 'zh-hant': '顧問', en: 'Consulting' },
  카페: { ko: '카페', 'zh-hant': '咖啡廳', en: 'Cafe' },
  멤버십: { ko: '멤버십', 'zh-hant': '會員', en: 'Membership' },
  반려동물: { ko: '반려동물', 'zh-hant': '寵物', en: 'Pet' },
  케어: { ko: '케어', 'zh-hant': '照護', en: 'Care' },
  스타트업: { ko: '스타트업', 'zh-hant': '新創', en: 'Startup' },
  서비스: { ko: '서비스', 'zh-hant': '服務', en: 'Services' },
  에이전시: { ko: '에이전시', 'zh-hant': '代理商', en: 'Agency' },
  프로젝트: { ko: '프로젝트', 'zh-hant': '專案', en: 'Projects' },
  컨퍼런스: { ko: '컨퍼런스', 'zh-hant': '會議', en: 'Conference' },
  행사: { ko: '행사', 'zh-hant': '活動', en: 'Events' },
  등록: { ko: '등록', 'zh-hant': '報名', en: 'Registration' },
  팟캐스트: { ko: '팟캐스트', 'zh-hant': 'Podcast', en: 'Podcast' },
  에피소드: { ko: '에피소드', 'zh-hant': '集數', en: 'Episodes' },
  구독: { ko: '구독', 'zh-hant': '訂閱', en: 'Subscribe' },
  매거진: { ko: '매거진', 'zh-hant': '雜誌', en: 'Magazine' },
  기사: { ko: '기사', 'zh-hant': '文章', en: 'Articles' },
  치과: { ko: '치과', 'zh-hant': '牙科', en: 'Dental' },
  진료: { ko: '진료', 'zh-hant': '診療', en: 'Care' },
  요가: { ko: '요가', 'zh-hant': '瑜伽', en: 'Yoga' },
  스튜디오: { ko: '스튜디오', 'zh-hant': '工作室', en: 'Studio' },
  프리랜서: { ko: '프리랜서', 'zh-hant': '自由工作者', en: 'Freelancer' },
  웨딩: { ko: '웨딩', 'zh-hant': '婚禮', en: 'Wedding' },
  렌터카: { ko: '렌터카', 'zh-hant': '租車', en: 'Car rental' },
  차량: { ko: '차량', 'zh-hant': '車輛', en: 'Cars' },
  '이벤트 기획': { ko: '이벤트 기획', 'zh-hant': '活動企劃', en: 'Event planning' },
  견적: { ko: '견적', 'zh-hant': '報價', en: 'Quote' },
  패션: { ko: '패션', 'zh-hant': '時尚', en: 'Fashion' },
  컬렉션: { ko: '컬렉션', 'zh-hant': '系列', en: 'Collection' },
  프리미엄: { ko: '프리미엄', 'zh-hant': '精選', en: 'Premium' },
  로펌: { ko: '로펌', 'zh-hant': '律師事務所', en: 'Law firm' },
  대만: { ko: '대만', 'zh-hant': '台灣', en: 'Taiwan' },
  기업자문: { ko: '기업자문', 'zh-hant': '企業顧問', en: 'Corporate counsel' },
  무료체험: { ko: '무료체험', 'zh-hant': '免費試用', en: 'Free trial' },
  구매전환: { ko: '구매전환', 'zh-hant': '購買轉換', en: 'Purchase conversion' },
  '프로젝트 문의': { ko: '프로젝트 문의', 'zh-hant': '專案洽詢', en: 'Project inquiry' },
};

const PAGE_TEMPLATE_FALLBACK_COPY: Record<Locale, {
  pageType: string;
  style: string;
  sectionCount: (count: number) => string;
}> = {
  ko: {
    pageType: '페이지',
    style: '표준',
    sectionCount: (count) => `${count}개 섹션`,
  },
  'zh-hant': {
    pageType: '頁面',
    style: '標準',
    sectionCount: (count) => `${count} 個區段`,
  },
  en: {
    pageType: 'Page',
    style: 'Standard',
    sectionCount: (count) => `${count} ${count === 1 ? 'section' : 'sections'}`,
  },
};

function englishCount(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function catalogCount(locale: Locale, visibleCount: number, totalCount: number, hasQuery: boolean): string {
  const count = hasQuery ? `${visibleCount}/${totalCount}` : String(totalCount);
  if (locale === 'ko') return `${count}개 항목`;
  if (locale === 'zh-hant') return `${count} 個項目`;
  const totalLabel = totalCount === 1 ? 'item' : 'items';
  return `${count} ${totalLabel}`;
}

export function getCatalogCategoryCopy(
  category: BuilderComponentCategory,
  locale: Locale = 'ko',
): CatalogCategoryCopy {
  return CATALOG_CATEGORY_COPY[category]?.[locale] ?? CATALOG_CATEGORY_COPY[category].ko;
}

export function getSandboxCatalogPanelCopy(locale: Locale = 'ko'): SandboxCatalogPanelCopy {
  if (locale === 'zh-hant') {
    return {
      title: '目錄',
      countLabel: (visibleCount, totalCount, hasQuery) => catalogCount(locale, visibleCount, totalCount, hasQuery),
      collapseTitle: '收合目錄',
      expandTitle: '展開目錄',
      collapseLabel: '隱藏',
      expandLabel: '顯示',
      intro: 'Registry 元件已依分類整理。拖曳到畫布，或用快速新增放到中央。',
      openPageTemplates: (count) => `查看全部頁面範本 ${count} 個`,
      searchLabel: '搜尋元素',
      searchAriaLabel: '搜尋新增元素',
      searchPlaceholder: '文字、按鈕、圖片...',
      quickStripAriaLabel: '常用新增元素',
      resultSummary: (count, query) => `顯示 ${count} 個「${query}」結果`,
      pageTemplateShowroom: '頁面範本展示',
      pageTemplateCount: (visibleCount, totalCount) => `${visibleCount}/${totalCount} 個頁面範本`,
      viewAllResults: '查看全部結果',
      appWidgetsName: 'App 小工具',
      appWidgetsHint: (count) => `已啟用 App · ${count} 個小工具`,
      appWidgetMeta: (appName, area) => `${appName} · ${area} 小工具`,
      appWidgetDescriptionFallback: (appName) => `由 ${appName} 提供`,
      widgetRuntimeUnavailable: '小工具執行階段尚未可用。',
      dragTitle: (name) => `拖曳 ${name} 到畫布新增`,
      quickAddTitle: (name) => `新增 ${name} 到畫布中央`,
      dragMeta: (kind) => `${kind} · 拖曳到畫布`,
      quickAdd: '快速新增',
      runtimeUnavailable: '執行階段不可用',
      widgetSections: {
        text: { name: '文字小工具套件', hint: (count) => `H1-H6、富文字、路徑、欄位、引言、列表、跑馬燈 · ${count}` },
        media: { name: '媒體小工具套件', hint: (count) => `燈箱、熱點、比較、影片、音訊、圖示 · ${count}` },
        gallery: { name: '圖庫小工具套件', hint: (count) => `網格、瀑布流、滑桿、幻燈片、縮圖、專業、標題、篩選 · ${count}` },
        layout: { name: '版面小工具套件', hint: (count) => `長條、方塊、欄位、Repeater、分頁、手風琴、幻燈片、懸停 · ${count}` },
        interactive: { name: '互動小工具套件', hint: (count) => `倒數、進度、評分、通知、回到頂端 · ${count}` },
        navigation: { name: '導覽小工具套件', hint: (count) => `選單、下拉、Mega、錨點、麵包屑 · ${count}` },
        social: { name: '社群小工具套件', hint: (count) => `社群列、分享、嵌入、浮動聊天 · ${count}` },
        location: { name: '地圖與地點套件', hint: (count) => `地址、營業時間、多地點地圖 · ${count}` },
        decorative: { name: '裝飾小工具套件', hint: (count) => `形狀、圖樣、視差、框架、貼紙、設計點綴 · ${count}` },
        designer: { name: '設計區塊套件', hint: (count) => `計數器、評價、服務、個人資料、價格、時間軸 · ${count}` },
      },
      sectionTemplatesName: '區段範本',
      sectionTemplatesHint: (count) => `專業設計套件 · ${count}`,
      savedSectionsName: '已儲存區段',
      savedSectionsHint: '我的已儲存區段庫',
      emptyTitle: '沒有符合的元素',
      emptyHint: '試試文字、圖片、按鈕、表單或區段。',
    };
  }

  if (locale === 'en') {
    return {
      title: 'Catalog',
      countLabel: (visibleCount, totalCount, hasQuery) => catalogCount(locale, visibleCount, totalCount, hasQuery),
      collapseTitle: 'Collapse catalog',
      expandTitle: 'Open catalog',
      collapseLabel: 'Hide',
      expandLabel: 'Show',
      intro: 'Registry components are grouped by category. Drag them to the canvas or quick-add them to the center.',
      openPageTemplates: (count) => `View all ${englishCount(count, 'page template')}`,
      searchLabel: 'Search elements',
      searchAriaLabel: 'Search add elements',
      searchPlaceholder: 'Text, button, image...',
      quickStripAriaLabel: 'Popular add elements',
      resultSummary: (count, query) => `Showing ${englishCount(count, 'result')} for "${query}"`,
      pageTemplateShowroom: 'Page template showroom',
      pageTemplateCount: (visibleCount, totalCount) => `${visibleCount}/${totalCount} page templates`,
      viewAllResults: 'View all results',
      appWidgetsName: 'App widgets',
      appWidgetsHint: (count) => `Enabled apps · ${englishCount(count, 'widget')}`,
      appWidgetMeta: (appName, area) => `${appName} · ${area} widget`,
      appWidgetDescriptionFallback: (appName) => `Provided by ${appName}`,
      widgetRuntimeUnavailable: 'Widget runtime is not available yet.',
      dragTitle: (name) => `Drag ${name} to the canvas`,
      quickAddTitle: (name) => `Add ${name} to the center of the canvas`,
      dragMeta: (kind) => `${kind} · drag to canvas`,
      quickAdd: 'Quick add',
      runtimeUnavailable: 'Runtime unavailable',
      widgetSections: {
        text: { name: 'Text widget pack', hint: (count) => `H1-H6, rich text, path, columns, quote, list, marquee · ${count}` },
        media: { name: 'Media widget pack', hint: (count) => `lightbox, hotspots, compare, video, audio, icons · ${count}` },
        gallery: { name: 'Gallery widget pack', hint: (count) => `grid, masonry, slider, slideshow, thumbnail, pro, caption, filter · ${count}` },
        layout: { name: 'Layout widget pack', hint: (count) => `strip, box, columns, repeater, tabs, accordion, slideshow, hover · ${count}` },
        interactive: { name: 'Interactive widget pack', hint: (count) => `countdown, progress, rating, notification, back-to-top · ${count}` },
        navigation: { name: 'Navigation widget pack', hint: (count) => `menu, dropdown, mega, anchor, breadcrumbs · ${count}` },
        social: { name: 'Social widget pack', hint: (count) => `social-bar, share, embed, floating chat · ${count}` },
        location: { name: 'Maps & Location pack', hint: (count) => `address, hours, multi-map · ${count}` },
        decorative: { name: 'Decorative widget pack', hint: (count) => `shape, pattern, parallax, frame, sticker, designer accents · ${count}` },
        designer: { name: 'Designer blocks pack', hint: (count) => `counter, testimonial, service, profile, pricing, timeline · ${count}` },
      },
      sectionTemplatesName: 'Section templates',
      sectionTemplatesHint: (count) => `Professional design pack · ${count}`,
      savedSectionsName: 'Saved sections',
      savedSectionsHint: 'My saved section library',
      emptyTitle: 'No matching elements',
      emptyHint: 'Try text, image, button, form, or section.',
    };
  }

  return {
    title: '카탈로그',
    countLabel: (visibleCount, totalCount, hasQuery) => catalogCount(locale, visibleCount, totalCount, hasQuery),
    collapseTitle: '카탈로그 접기',
    expandTitle: '카탈로그 열기',
    collapseLabel: '숨기기',
    expandLabel: '보기',
    intro: 'Registry 컴포넌트를 카테고리별로 묶었습니다. 드래그로 캔버스에 추가하거나 빠른 추가로 중앙에 바로 생성합니다.',
    openPageTemplates: (count) => `전체 페이지 템플릿 ${count}개 보기`,
    searchLabel: '요소 검색',
    searchAriaLabel: '추가 요소 검색',
    searchPlaceholder: '텍스트, 버튼, 이미지...',
    quickStripAriaLabel: '자주 쓰는 추가 요소',
    resultSummary: (count, query) => `"${query}" 결과 ${count}개 표시`,
    pageTemplateShowroom: '페이지 템플릿 쇼룸',
    pageTemplateCount: (visibleCount, totalCount) => `${visibleCount}/${totalCount}개 페이지 템플릿`,
    viewAllResults: '전체 결과 보기',
    appWidgetsName: '앱 위젯',
    appWidgetsHint: (count) => `활성화된 앱 · 위젯 ${count}개`,
    appWidgetMeta: (appName, area) => `${appName} · ${area} 위젯`,
    appWidgetDescriptionFallback: (appName) => `${appName} 제공`,
    widgetRuntimeUnavailable: '위젯 런타임을 아직 사용할 수 없습니다.',
    dragTitle: (name) => `${name} 캔버스로 드래그하여 추가`,
    quickAddTitle: (name) => `${name} 캔버스 중앙에 추가`,
    dragMeta: (kind) => `${kind} · 캔버스로 드래그`,
    quickAdd: '빠른 추가',
    runtimeUnavailable: '런타임 없음',
    widgetSections: {
      text: { name: '텍스트 위젯 팩', hint: (count) => `H1-H6, 리치 텍스트, 경로, 칼럼, 인용, 목록, 마키 · ${count}` },
      media: { name: '미디어 위젯 팩', hint: (count) => `라이트박스, 핫스팟, 비교, 비디오, 오디오, 아이콘 · ${count}` },
      gallery: { name: '갤러리 위젯 팩', hint: (count) => `그리드, 메이슨리, 슬라이더, 슬라이드쇼, 썸네일, 프로, 캡션, 필터 · ${count}` },
      layout: { name: '레이아웃 위젯 팩', hint: (count) => `스트립, 박스, 칼럼, 리피터, 탭, 아코디언, 슬라이드쇼, 호버 · ${count}` },
      interactive: { name: '인터랙션 위젯 팩', hint: (count) => `카운트다운, 진행률, 별점, 알림, 맨 위로 · ${count}` },
      navigation: { name: '내비게이션 위젯 팩', hint: (count) => `메뉴, 드롭다운, 메가, 앵커, 브레드크럼 · ${count}` },
      social: { name: '소셜 위젯 팩', hint: (count) => `소셜 바, 공유, 임베드, 플로팅 채팅 · ${count}` },
      location: { name: '지도 및 위치 팩', hint: (count) => `주소, 영업 시간, 다중 지도 · ${count}` },
      decorative: { name: '장식 위젯 팩', hint: (count) => `도형, 패턴, 패럴랙스, 프레임, 스티커, 디자이너 장식 · ${count}` },
      designer: { name: '디자이너 블록 팩', hint: (count) => `카운터, 후기, 서비스, 프로필, 요금제, 타임라인 · ${count}` },
    },
    sectionTemplatesName: '섹션 템플릿',
    sectionTemplatesHint: (count) => `전문 디자인팩 · ${count}`,
    savedSectionsName: '저장한 섹션',
    savedSectionsHint: '내가 저장한 섹션 라이브러리',
    emptyTitle: '일치하는 요소 없음',
    emptyHint: '텍스트, 이미지, 버튼, 폼, 섹션으로 검색해 보세요.',
  };
}

type CatalogSearchablePreset = {
  id: string;
  label: string;
  description: string;
  kind: string;
  searchKeywords?: string[];
};

function valuesMatchQuery(values: Array<string | number | boolean | null | undefined>, query: string): boolean {
  if (!query) return true;
  return values.some((value) => String(value).toLocaleLowerCase('ko-KR').includes(query));
}

export function resolveCenteredNode(
  kind: BuilderCanvasNodeKind,
  existingCount: number,
  cascadeSeed = existingCount,
) {
  const seed = createCanvasNodeTemplate(kind, 0, 0, existingCount);
  const cascadeOffset = (cascadeSeed % 12) * 22;
  return {
    ...seed,
    rect: {
      ...seed.rect,
      x: Math.round((STAGE_WIDTH - seed.rect.width) / 2 + cascadeOffset),
      y: Math.round((STAGE_HEIGHT - seed.rect.height) / 2 + cascadeOffset),
    },
  };
}

export function resolveSectionInsertOffset(
  nodes: BuilderCanvasNode[],
  template: BuiltInSectionTemplate,
): { x: number; y: number } {
  const root = template.nodes.find((node) => node.id === template.rootNodeId);
  const width = root?.rect.width ?? STAGE_WIDTH;
  const existingBottom = nodes
    .filter((node) => !node.parentId && node.visible)
    .reduce((bottom, node) => Math.max(bottom, node.rect.y + node.rect.height), 0);

  return {
    x: Math.max(0, Math.round((STAGE_WIDTH - width) / 2)),
    y: Math.max(48, existingBottom + 48),
  };
}

export function getDisplayCategory(component: BuilderComponentDefinition): BuilderComponentCategory {
  if (component.kind === 'image') return 'media';
  return component.category;
}

export function compareByCategoryPriority(
  category: BuilderComponentCategory,
  left: BuilderComponentDefinition,
  right: BuilderComponentDefinition,
  locale: Locale = 'ko',
): number {
  const priority = KIND_PRIORITY[category] ?? [];
  const leftIndex = priority.indexOf(left.kind);
  const rightIndex = priority.indexOf(right.kind);

  if (leftIndex !== -1 || rightIndex !== -1) {
    if (leftIndex === -1) return 1;
    if (rightIndex === -1) return -1;
    return leftIndex - rightIndex;
  }

  return getComponentCatalogDisplayName(left, locale).localeCompare(
    getComponentCatalogDisplayName(right, locale),
    locale,
  );
}

export function normalizeSearchTerm(value: string): string {
  return value.trim().toLocaleLowerCase('ko-KR');
}

export function getComponentCatalogDisplayName(
  component: Pick<BuilderComponentDefinition, 'kind' | 'displayName'>,
  locale: Locale = 'ko',
): string {
  return COMPONENT_CATALOG_NAMES[component.kind]?.[locale] ?? component.displayName;
}

export function componentMatchesSearch(
  component: BuilderComponentDefinition,
  query: string,
  locale: Locale = 'ko',
): boolean {
  return valuesMatchQuery([
    getComponentCatalogDisplayName(component, locale),
    component.displayName,
    component.kind,
    component.category,
    getDisplayCategory(component),
  ], query);
}

export function textWidgetMatchesSearch(preset: CatalogSearchablePreset, query: string): boolean {
  return valuesMatchQuery([
    preset.label,
    preset.description,
    preset.id,
    preset.kind,
    ...(preset.searchKeywords ?? []),
    'text widget',
  ], query);
}

export function mediaWidgetMatchesSearch(preset: CatalogSearchablePreset, query: string): boolean {
  return valuesMatchQuery([
    preset.label,
    preset.description,
    preset.id,
    preset.kind,
    ...(preset.searchKeywords ?? []),
    'media widget',
  ], query);
}

export function galleryWidgetMatchesSearch(preset: CatalogSearchablePreset, query: string): boolean {
  return valuesMatchQuery([
    preset.label,
    preset.description,
    preset.id,
    preset.kind,
    ...(preset.searchKeywords ?? []),
    'gallery widget',
  ], query);
}

export function layoutWidgetMatchesSearch(preset: CatalogSearchablePreset, query: string): boolean {
  return valuesMatchQuery([
    preset.label,
    preset.description,
    preset.id,
    preset.kind,
    ...(preset.searchKeywords ?? []),
    'layout widget',
  ], query);
}

export function interactiveWidgetMatchesSearch(preset: CatalogSearchablePreset, query: string): boolean {
  return valuesMatchQuery([
    preset.label,
    preset.description,
    preset.id,
    preset.kind,
    ...(preset.searchKeywords ?? []),
    'interactive widget',
    'countdown',
    'progress',
    'rating',
    'notification',
    'back to top',
  ], query);
}

export function navigationWidgetMatchesSearch(preset: CatalogSearchablePreset, query: string): boolean {
  return valuesMatchQuery([
    preset.label,
    preset.description,
    preset.id,
    preset.kind,
    ...(preset.searchKeywords ?? []),
    'navigation widget',
    'menu',
    'breadcrumb',
    'anchor',
  ], query);
}

export function decorativeWidgetMatchesSearch(preset: CatalogSearchablePreset, query: string): boolean {
  return valuesMatchQuery([
    preset.label,
    preset.description,
    ...(preset.searchKeywords ?? []),
    preset.id,
    preset.kind,
    'decorative widget',
    'shape',
    'pattern',
    'frame',
    'sticker',
    'parallax',
  ], query);
}

export function designerWidgetMatchesSearch(preset: CatalogSearchablePreset, query: string): boolean {
  return valuesMatchQuery([
    preset.label,
    preset.description,
    ...(preset.searchKeywords ?? []),
    preset.id,
    preset.kind,
    'designer widget',
    'designer blocks',
    'professional',
    'wix',
    'counter',
    'testimonial',
    'pricing',
    'timeline',
    'profile',
    'comparison',
    'service',
  ], query);
}

export function locationWidgetMatchesSearch(preset: CatalogSearchablePreset, query: string): boolean {
  return valuesMatchQuery([
    preset.label,
    preset.description,
    ...(preset.searchKeywords ?? []),
    preset.id,
    preset.kind,
    'location widget',
    'maps',
    'address',
    'hours',
  ], query);
}

export function socialWidgetMatchesSearch(preset: CatalogSearchablePreset, query: string): boolean {
  return valuesMatchQuery([
    preset.label,
    preset.description,
    preset.id,
    preset.kind,
    ...(preset.searchKeywords ?? []),
    'social widget',
    'instagram',
    'youtube',
    'linkedin',
    'whatsapp',
    'line',
    'kakao',
    'share',
  ], query);
}

export function getPageTemplateSectionCount(template: PageTemplate): number {
  return template.sections?.length
    ?? template.document.nodes.filter((node) => node.kind === 'section' || node.kind === 'container').length;
}

export function getPageTemplateCategoryLabel(template: PageTemplate): string {
  return TEMPLATE_CATEGORY_LABELS[template.category] ?? template.category;
}

export function pageTemplateMatchesSearch(template: PageTemplate, query: string): boolean {
  return matchesTemplateSearch(template, query, getPageTemplateCategoryLabel(template));
}

export function pageTemplateSearchScore(template: PageTemplate, query: string): number {
  return scoreTemplateSearch(template, query, getPageTemplateCategoryLabel(template));
}

export function getPageTemplateMeta(template: PageTemplate, locale: Locale = 'ko'): string {
  const fallback = PAGE_TEMPLATE_FALLBACK_COPY[locale];
  const pageType = template.pageType
    ? PAGE_TEMPLATE_PAGE_TYPE_LABELS[template.pageType][locale]
    : fallback.pageType;
  const style = template.visualStyle
    ? PAGE_TEMPLATE_STYLE_LABELS[template.visualStyle][locale]
    : fallback.style;
  return `${pageType} · ${style} · ${fallback.sectionCount(getPageTemplateSectionCount(template))}`;
}

export function getPageTemplateQualityTierDisplayLabel(
  qualityTier: TemplateQualityTier | undefined,
  locale: Locale = 'ko',
): string {
  if (!qualityTier) return PAGE_TEMPLATE_FALLBACK_COPY[locale].style;
  return PAGE_TEMPLATE_QUALITY_LABELS[qualityTier][locale];
}

export function getPageTemplateQualityLabel(template: PageTemplate, locale: Locale = 'ko'): string {
  return getPageTemplateQualityTierDisplayLabel(template.qualityTier, locale);
}

function titleizeTemplateToken(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((token) => `${token.charAt(0).toUpperCase()}${token.slice(1)}`)
    .join(' ');
}

export function getPageTemplateCategoryDisplayLabel(
  category: PageTemplate['category'],
  locale: Locale = 'ko',
): string {
  return PAGE_TEMPLATE_CATEGORY_DISPLAY_LABELS[category]?.[locale] ?? titleizeTemplateToken(category);
}

export function getPageTemplatePageTypeDisplayLabel(
  pageType: TemplatePageType,
  locale: Locale = 'ko',
): string {
  return PAGE_TEMPLATE_PAGE_TYPE_LABELS[pageType][locale];
}

export function getPageTemplateStyleDisplayLabel(
  style: TemplateVisualStyle,
  locale: Locale = 'ko',
): string {
  return PAGE_TEMPLATE_STYLE_LABELS[style][locale];
}

export function getPageTemplateDensityDisplayLabel(
  density: TemplateDensity,
  locale: Locale = 'ko',
): string {
  return PAGE_TEMPLATE_DENSITY_LABELS[density][locale];
}

export function getPageTemplatePreviewName(template: PageTemplate, locale: Locale = 'ko'): string {
  const categoryLabel = getPageTemplateCategoryDisplayLabel(template.category, locale);
  const typeLabel = template.pageType
    ? getPageTemplatePageTypeDisplayLabel(template.pageType, locale)
    : PAGE_TEMPLATE_SUBCATEGORY_LABELS[template.subcategory]?.[locale] ?? titleizeTemplateToken(template.subcategory);
  return categoryLabel.toLocaleLowerCase(locale) === typeLabel.toLocaleLowerCase(locale)
    ? typeLabel
    : `${categoryLabel} ${typeLabel}`;
}

export function getPageTemplatePreviewDescription(template: PageTemplate, locale: Locale = 'ko'): string {
  const name = getPageTemplatePreviewName(template, locale);
  const count = getPageTemplateSectionCount(template);
  if (locale === 'en') return `A ${name} page template with ${count} ${count === 1 ? 'section' : 'sections'} for a fast start.`;
  if (locale === 'zh-hant') return `適合快速建立「${name}」頁面的 ${count} 個區段範本。`;
  return `${name} 페이지를 빠르게 시작할 수 있는 ${count}개 섹션 템플릿입니다.`;
}

export function getPageTemplatePreviewTags(template: PageTemplate, locale: Locale = 'ko'): string[] {
  return (template.tags ?? []).map((tag) => PAGE_TEMPLATE_TAG_LABELS[tag]?.[locale] ?? tag);
}

export function getPageTemplateCtaGoalLabel(template: PageTemplate, locale: Locale = 'ko'): string {
  const fallback = {
    ko: '문의 전환',
    'zh-hant': '諮詢轉換',
    en: 'Inquiry conversion',
  } satisfies Record<Locale, string>;
  if (!template.ctaGoal) return fallback[locale];
  return PAGE_TEMPLATE_CTA_GOAL_LABELS[template.ctaGoal]?.[locale] ?? template.ctaGoal;
}

export function getPageTemplateSectionSummary(template: PageTemplate, locale: Locale = 'ko'): string {
  const count = getPageTemplateSectionCount(template);
  if (locale === 'en') return `${count} ${count === 1 ? 'section' : 'sections'}`;
  if (locale === 'zh-hant') return `${count} 個區段`;
  return `${count}개 섹션`;
}

export function pageTemplatePreviewMatchesSearch(template: PageTemplate, locale: Locale, query: string): boolean {
  if (!query) return true;
  return [
    getPageTemplatePreviewName(template, locale),
    getPageTemplatePreviewDescription(template, locale),
    getPageTemplateCategoryDisplayLabel(template.category, locale),
    getPageTemplateCtaGoalLabel(template, locale),
    getPageTemplateSectionSummary(template, locale),
    ...getPageTemplatePreviewTags(template, locale),
    template.name,
    template.description,
    template.ctaGoal ?? '',
    ...(template.tags ?? []),
  ].some((value) => value.toLocaleLowerCase('ko-KR').includes(query));
}

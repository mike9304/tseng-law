import { buildIndustryHome } from '../_shared/industry-home';

/**
 * 매거진/미디어 home — rebuilt from the shared industry-home builder (WIX-PERFECT backlog #7).
 * Replaces a 714-line, zero-image lorem skeleton with a distinct, image-rich, palette-driven
 * Wix-grade home page (hero + stats + service cards + feature split + process + testimonial + CTA).
 */
export const magazineHomeTemplate = buildIndustryHome({
  id: "magazine-home",
  name: "매거진/미디어 홈",
  category: "magazine",
  description: "에디터가 직접 큐레이션한 심층 기사와 인터뷰를 매주 만나보세요. 뉴스레터로 가장 먼저 받아보실 수 있습니다.",
  palette: {
    base: "#1a1a1a",
    surface: "#ffffff",
    surfaceAlt: "#f5f3f0",
    ink: "#1a1a1a",
    mutedInk: "#6b6b6b",
    accent: "#b21f2d",
    onAccent: "#ffffff",
    line: "#e4e0db",
  },
  heroImage: "/images/placeholder-article-hero.jpg",
  heroImageAlt: "A featured editorial article spread on the magazine cover",
  heroEyebrow: "ONLINE MAGAZINE",
  heroTitle: "읽을수록 깊어지는\n오늘의 이야기",
  heroSubtitle: "에디터가 직접 큐레이션한 심층 기사와 인터뷰를 매주 만나보세요. 뉴스레터로 가장 먼저 받아보실 수 있습니다.",
  heroPrimaryCta: "뉴스레터 구독하기",
  heroSecondaryCta: "이번 주 기사 보기",
  stats: [
    { value: "2,400+", label: "발행 기사" },
    { value: "11만", label: "월간 독자" },
    { value: "9년", label: "발행 연차" },
  ],
  servicesTitle: "카테고리",
  servicesSubtitle: "관심사에 따라 골라 읽는 섹션",
  services: [
    { title: "인터뷰", desc: "각 분야를 이끄는 사람들의 생각을 깊이 있는 대화로 담아냅니다.", image: "/images/placeholder-photo-portrait.jpg", imageAlt: "In-depth interview portrait" },
    { title: "컬처 & 디자인", desc: "전시, 음악, 디자인까지 동시대 문화의 흐름을 읽어드립니다.", image: "/images/placeholder-creative-hero.jpg", imageAlt: "Culture and design feature" },
    { title: "라이프스타일", desc: "음식과 일상, 취향을 가꾸는 작은 이야기를 전합니다.", image: "/images/placeholder-nutrition-hero.jpg", imageAlt: "Lifestyle and food story" },
  ],
  featureTitle: "속도가 아닌 깊이로 읽습니다",
  featureBody: "빠르게 소비되는 뉴스 대신, 한 가지 주제를 오래 들여다본 롱폼 기사를 만듭니다. 모든 글은 에디터의 취재와 검증을 거쳐 발행됩니다.",
  featureBullets: [
    "매주 엄선한 심층 롱폼 기사",
    "구독자 전용 아카이브 무제한 열람",
    "광고 없는 깔끔한 읽기 경험",
  ],
  featureImage: "/images/placeholder-featured-article.jpg",
  featureImageAlt: "A featured long-form article layout",
  processTitle: "구독은 이렇게 시작됩니다",
  process: [
    { step: "01", title: "이메일 등록", desc: "이메일 하나로 무료 뉴스레터 구독을 시작합니다." },
    { step: "02", title: "관심 카테고리 선택", desc: "원하는 섹션을 고르면 취향에 맞는 글을 보내드립니다." },
    { step: "03", title: "매주 받아보기", desc: "엄선한 기사가 매주 화요일 아침 메일함에 도착합니다." },
  ],
  testimonialQuote: "출근길에 읽는 화요일 뉴스레터가 한 주의 작은 의식이 됐어요. 광고 없이 좋은 글만 골라 보내줘서 늘 신뢰하게 됩니다.",
  testimonialAuthor: "정하늘",
  testimonialRole: "3년 차 구독자",
  ctaTitle: "매주 가장 좋은 이야기를 메일함으로",
  ctaSubtitle: "구독은 무료이며, 원할 때 언제든 해지할 수 있습니다.",
  ctaButton: "무료로 구독하기",
});

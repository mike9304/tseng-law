import { buildIndustryHome } from '../_shared/industry-home';

/**
 * Creative agency home — rebuilt from the shared industry-home builder.
 * Was a 714-line, zero-image lorem skeleton identical to 12 other industries;
 * now a distinct, image-rich, palette-driven Wix-grade home (WIX-PERFECT backlog #7).
 */
export const agencyHomeTemplate = buildIndustryHome({
  id: 'agency-home',
  name: '에이전시 홈',
  category: 'agency',
  description: '크리에이티브 에이전시 홈. 임팩트 있는 히어로, 성과 지표, 서비스 카드, 강점 소개, 진행 단계, 고객 후기, 전환 CTA를 갖춘 풀 페이지 레이아웃.',
  palette: {
    base: '#16161d',
    surface: '#ffffff',
    surfaceAlt: '#f4f4f1',
    ink: '#16161d',
    mutedInk: '#5a5a63',
    accent: '#6366f1',
    onAccent: '#ffffff',
    line: '#e4e4e0',
  },
  heroImage: '/images/placeholder-creative-hero.jpg',
  heroImageAlt: '크리에이티브 에이전시 작업 공간',
  heroEyebrow: 'CREATIVE STUDIO',
  heroTitle: '브랜드를 움직이는\n크리에이티브를 만듭니다',
  heroSubtitle: '전략부터 디자인, 캠페인까지. 측정 가능한 성과로 이어지는 브랜드 경험을 설계합니다.',
  heroPrimaryCta: '프로젝트 문의',
  heroSecondaryCta: '서비스 보기',
  stats: [
    { value: '120+', label: '완료한 프로젝트' },
    { value: '45+', label: '함께한 브랜드' },
    { value: '8년', label: '업계 경력' },
  ],
  servicesTitle: '우리가 잘하는 것',
  servicesSubtitle: '브랜드의 성장 단계에 맞춰 필요한 만큼, 깊이 있게 협업합니다.',
  services: [
    { title: '브랜드 전략', desc: '시장 분석과 포지셔닝부터 브랜드 아이덴티티 체계까지 탄탄한 기반을 설계합니다.', image: '/images/placeholder-product-1.jpg', imageAlt: '브랜드 전략 작업' },
    { title: '디자인 & 웹', desc: '아이덴티티, UI/UX, 반응형 웹사이트까지 일관된 비주얼 시스템으로 완성합니다.', image: '/images/placeholder-product-2.jpg', imageAlt: '디자인 작업' },
    { title: '캠페인 & 콘텐츠', desc: '데이터 기반의 디지털 캠페인과 콘텐츠로 실질적인 전환을 만듭니다.', image: '/images/placeholder-product-3.jpg', imageAlt: '캠페인 작업' },
  ],
  featureTitle: '결과로 증명하는 파트너십',
  featureBody: '우리는 화려한 산출물보다 비즈니스 성과에 집중합니다. 명확한 목표 설정과 투명한 협업 과정으로 함께 성장합니다.',
  featureBullets: [
    '전담 팀의 밀착 협업',
    '데이터 기반 의사결정',
    '론칭 이후 성과 관리까지',
  ],
  featureImage: '/images/placeholder-creative-team.jpg',
  featureImageAlt: '에이전시 팀',
  processTitle: '협업은 이렇게 진행됩니다',
  process: [
    { step: '01', title: '발견 & 전략', desc: '비즈니스 목표와 시장을 깊이 이해하고 방향을 정렬합니다.' },
    { step: '02', title: '디자인 & 제작', desc: '아이디어를 실제 결과물로 빠르게 구체화하고 반복 개선합니다.' },
    { step: '03', title: '론칭 & 성장', desc: '출시 후 성과를 측정하고 지속적으로 최적화합니다.' },
  ],
  testimonialQuote: '명확한 전략과 빠른 실행력. 6개월 만에 브랜드 인지도가 눈에 띄게 달라졌습니다.',
  testimonialAuthor: '김서연',
  testimonialRole: '스타트업 마케팅 리드',
  ctaTitle: '함께 만들 준비가 되셨나요?',
  ctaSubtitle: '간단한 소개와 목표만 알려주세요. 48시간 안에 제안서를 보내 드립니다.',
  ctaButton: '무료 상담 신청',
});

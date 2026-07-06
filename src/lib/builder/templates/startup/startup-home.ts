/**
 * Startup/product home — MIGRATED 2026-06-04 from a hardcoded law-navy (#123b63 ×16) skeleton to
 * `buildIndustryHome` with the startup-product (blue) token palette + product imagery. Inherits
 * serif/sans pairing + hero scrim. See WIX-DESIGN-FIDELITY-SPEC §3.4.
 */
import { buildIndustryHome } from '../_shared/industry-home';

export const startupHomeTemplate = buildIndustryHome({
  id: 'startup-home',
  name: '스타트업 홈',
  category: 'startup',
  description: '문제를 푸는 가장 빠른 길. 작게 시작해 빠르게 검증하고, 함께 키워 갑니다.',
  palette: {
    base: '#0b1020', surface: '#ffffff', surfaceAlt: '#eef3fb', ink: '#16191f',
    mutedInk: '#5f6b7a', accent: '#2563eb', onAccent: '#ffffff', line: '#dbe6f5',
  },
  heroImage: '/images/placeholder-product-screenshot.png',
  heroImageAlt: '제품 대시보드 화면',
  heroEyebrow: 'BUILD. LAUNCH. GROW.',
  heroTitle: '문제를 푸는\n가장 빠른 길',
  heroSubtitle: '거창한 계획보다 빠른 실행. 작게 만들어 시장에서 검증하고, 데이터로 다음 결정을 내립니다.',
  heroPrimaryCta: '무료로 시작',
  heroSecondaryCta: '제품 데모',
  stats: [
    { value: '10k+', label: '제품을 쓰는 팀' },
    { value: '5분', label: '가입 후 첫 실행' },
    { value: '99.9%', label: '서비스 가동률' },
  ],
  servicesTitle: '빠르게 만드는 세 가지',
  servicesSubtitle: '복잡한 설정 없이, 오늘 가입해서 오늘 써 보세요.',
  services: [
    { title: '빠른 온보딩', desc: '복잡한 설정 없이 5분 만에 첫 결과를 확인합니다.', image: '/images/placeholder-product-1.jpg', imageAlt: '온보딩 화면' },
    { title: '데이터 인사이트', desc: '핵심 지표를 한 화면에 모아 바로 의사결정합니다.', image: '/images/placeholder-product-2.jpg', imageAlt: '데이터 인사이트' },
    { title: '유연한 확장', desc: '팀이 커져도 그대로. 필요에 맞춰 자유롭게 확장합니다.', image: '/images/placeholder-product-3.jpg', imageAlt: '확장 기능' },
  ],
  featureTitle: '작게 시작해, 빠르게 검증한다',
  featureBody: '큰 결정을 미루지 않습니다. 가설을 작게 만들어 시장에 던지고, 반응을 데이터로 읽어 다음을 정합니다. 쓰던 도구와 그대로 연동되고, 보안 표준을 충족해 도입 첫날부터 안심하고 확장할 수 있습니다.',
  featureBullets: ['클릭 몇 번 도구 연동', '실시간 데이터 동기화', '엔터프라이즈 보안'],
  featureImage: '/images/placeholder-product-large.jpg',
  featureImageAlt: '통합된 제품 화면',
  processTitle: '시작하는 3단계',
  process: [
    { step: '01', title: '가입', desc: '이메일 한 번으로 가입하고 워크스페이스를 만듭니다.' },
    { step: '02', title: '연동·설정', desc: '쓰던 도구를 연결하고 팀에 맞게 구성합니다.' },
    { step: '03', title: '실행·확장', desc: '데이터로 결정을 내리고 필요에 맞춰 확장합니다.' },
  ],
  testimonialQuote: '도입하고 일주일 만에 팀의 일하는 방식이 바뀌었어요. 복잡한 설정 없이 바로 쓸 수 있어서, 검증하고 결정하는 사이클이 훨씬 빨라졌습니다.',
  testimonialAuthor: '이준영',
  testimonialRole: '얼리어답터 팀 리드',
  ctaTitle: '오늘 시작해서 오늘 확인하세요',
  ctaSubtitle: '카드 등록 없이 14일 동안 모든 기능을 무료로 써 볼 수 있습니다.',
  ctaButton: '무료로 시작하기',
});

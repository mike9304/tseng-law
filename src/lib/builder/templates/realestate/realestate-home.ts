/**
 * Real-estate home — MIGRATED 2026-06-04 from a hardcoded law-navy (#123b63 ×15) skeleton to
 * `buildIndustryHome` with the realestate-quiet (slate + warm taupe) token palette. Inherits
 * serif/sans pairing + hero scrim. See WIX-DESIGN-FIDELITY-SPEC §3.4.
 */
import { buildIndustryHome } from '../_shared/industry-home';

export const realestateHomeTemplate = buildIndustryHome({
  id: 'realestate-home',
  name: '부동산 홈',
  category: 'realestate',
  description: '집을 고르는 일은 삶을 고르는 일. 발품 대신 데이터와 신뢰로 꼭 맞는 공간을 찾아드립니다.',
  palette: {
    base: '#26313d', surface: '#ffffff', surfaceAlt: '#ece7df', ink: '#26313d',
    mutedInk: '#67717b', accent: '#8b745b', onAccent: '#ffffff', line: '#d6cbbd',
  },
  heroImage: '/images/placeholder-realestate-hero.jpg',
  heroImageAlt: '햇살이 드는 모던한 주거 공간',
  heroEyebrow: 'PROPERTY ADVISORY',
  heroTitle: '삶에 꼭 맞는\n공간을 찾다',
  heroSubtitle: '예산과 생활 방식을 먼저 듣고, 검증된 매물만 추려 안내합니다. 계약까지 전 과정을 함께합니다.',
  heroPrimaryCta: '상담 신청',
  heroSecondaryCta: '매물 보기',
  stats: [
    { value: '1,200+', label: '중개한 거래 건수' },
    { value: '12년', label: '지역 전담 경력' },
    { value: '검증', label: '권리관계 사전 확인' },
  ],
  servicesTitle: '꼼꼼하게 챙기는 세 가지',
  servicesSubtitle: '좋은 매물을 찾는 일보다, 안심하고 살 수 있는 집을 고르는 일이 먼저입니다.',
  services: [
    { title: '주거용 매물', desc: '생활권과 예산에 맞춰 검증된 아파트·빌라를 추려 드립니다.', image: '/images/placeholder-property-1.jpg', imageAlt: '주거용 매물' },
    { title: '투자·상가', desc: '수익률과 입지를 데이터로 분석해 투자 판단을 돕습니다.', image: '/images/placeholder-property-2.jpg', imageAlt: '상가·투자 매물' },
    { title: '전·월세 관리', desc: '계약부터 입주, 관리까지 임대 전 과정을 대행합니다.', image: '/images/placeholder-property-3.jpg', imageAlt: '전월세 매물' },
  ],
  featureTitle: '발품보다 정확한 데이터',
  featureBody: '실거래가와 권리관계, 주변 인프라까지 사전에 확인해 안내합니다. 보이지 않는 위험을 미리 짚고, 협상부터 잔금까지 모든 절차를 투명하게 함께 진행합니다.',
  featureBullets: ['권리관계 사전 확인', '실거래가 기반 상담', '계약·잔금 동행'],
  featureImage: '/images/placeholder-realestate-office.jpg',
  featureImageAlt: '상담이 이루어지는 부동산 사무실',
  processTitle: '집을 찾는 과정',
  process: [
    { step: '01', title: '상담', desc: '예산과 생활 조건을 함께 정리해 우선순위를 정합니다.' },
    { step: '02', title: '매물 추천', desc: '검증된 매물만 추려 현장 동행 답사를 진행합니다.' },
    { step: '03', title: '계약 동행', desc: '협상과 권리 확인, 잔금까지 끝까지 함께합니다.' },
  ],
  testimonialQuote: '처음 집을 사느라 불안했는데, 등기부터 하나하나 설명해 주셔서 안심하고 계약했어요. 무리한 매물을 권하지 않으셔서 더 신뢰가 갔습니다.',
  testimonialAuthor: '윤가람',
  testimonialRole: '첫 내 집 마련 고객',
  ctaTitle: '딱 맞는 공간, 함께 찾아드릴게요',
  ctaSubtitle: '원하는 조건을 남겨 주시면 검증된 매물을 정리해 연락드립니다.',
  ctaButton: '무료 상담 신청',
});

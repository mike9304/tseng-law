/**
 * Beauty/salon home — MIGRATED 2026-06-04 from a hardcoded law-navy (#123b63 ×14) skeleton to
 * `buildIndustryHome` with the beauty-luxe (blush + gold) token palette. Inherits the builder's
 * serif/sans pairing + hero scrim. See WIX-DESIGN-FIDELITY-SPEC-2026-06-04.md §3.4.
 */
import { buildIndustryHome } from '../_shared/industry-home';

export const beautyHomeTemplate = buildIndustryHome({
  id: 'beauty-home',
  name: '뷰티 살롱 홈',
  category: 'beauty',
  description: '당신의 아름다움을 가장 섬세하게. 헤어부터 스킨, 네일까지 한 공간에서 누리는 토탈 뷰티 살롱.',
  palette: {
    base: '#2a1d1a', surface: '#fffaf8', surfaceAlt: '#f0ddd8', ink: '#2b1c18',
    mutedInk: '#80655e', accent: '#b07d3f', onAccent: '#ffffff', line: '#e6d3cd',
  },
  heroImage: '/images/placeholder-salon-hero.jpg',
  heroImageAlt: '차분한 조명의 프리미엄 뷰티 살롱 내부',
  heroEyebrow: 'TOTAL BEAUTY ATELIER',
  heroTitle: '오늘의 나를\n가장 빛나게',
  heroSubtitle: '한 분 한 분의 결을 읽는 1:1 맞춤 케어. 헤어·스킨·네일을 한 공간에서 섬세하게 완성합니다.',
  heroPrimaryCta: '예약 상담',
  heroSecondaryCta: '시술 둘러보기',
  stats: [
    { value: '15년', label: '한자리에서 쌓은 신뢰' },
    { value: '1:1', label: '전담 디자이너 맞춤 케어' },
    { value: '4.9', label: '재방문 고객 만족도' },
  ],
  servicesTitle: '결을 살리는 세 가지 케어',
  servicesSubtitle: '유행이 아니라 당신에게 어울리는 아름다움을 먼저 봅니다.',
  services: [
    { title: '헤어 디자인', desc: '두상과 모질을 분석해 매일 손질이 쉬운 스타일을 제안합니다.', image: '/images/placeholder-beauty-hair.jpg', imageAlt: '헤어 디자인 시술' },
    { title: '스킨 케어', desc: '피부 상태에 맞춘 단계별 관리로 본연의 톤을 되살립니다.', image: '/images/placeholder-beauty-skin.jpg', imageAlt: '스킨 케어 관리' },
    { title: '네일 & 디테일', desc: '손끝까지 이어지는 섬세한 마무리로 완성도를 더합니다.', image: '/images/placeholder-beauty-makeup.jpg', imageAlt: '네일과 메이크업 디테일' },
  ],
  featureTitle: '서두르지 않는 프라이빗 케어',
  featureBody: '예약제로 운영해 한 분께 온전히 집중합니다. 사용하는 제품과 시술 과정을 투명하게 안내하고, 시술 후 홈케어까지 함께 설계해 오래 지속되는 아름다움을 만듭니다.',
  featureBullets: ['완전 예약제 프라이빗 룸', '프리미엄 비건 제품', '시술 후 홈케어 가이드'],
  featureImage: '/images/placeholder-salon-interior.jpg',
  featureImageAlt: '프라이빗 살롱 시술 공간',
  processTitle: '예약부터 케어까지',
  process: [
    { step: '01', title: '상담 예약', desc: '원하는 시술과 시간을 남기면 전담 디자이너를 배정합니다.' },
    { step: '02', title: '맞춤 진단', desc: '모질·피부 상태를 함께 확인하고 시술 방향을 정합니다.' },
    { step: '03', title: '케어 & 관리', desc: '시술 후 홈케어와 다음 방문 주기를 안내해 드립니다.' },
  ],
  testimonialQuote: '매번 제 스타일을 기억해 주시고, 무리한 시술을 권하지 않아 믿고 맡기게 돼요. 갈 때마다 컨디션이 좋아지는 느낌이에요.',
  testimonialAuthor: '한지우',
  testimonialRole: '3년째 단골 고객',
  ctaTitle: '가장 나다운 아름다움을 만나보세요',
  ctaSubtitle: '첫 방문 고객을 위한 1:1 뷰티 컨설팅을 무료로 제공합니다.',
  ctaButton: '예약 상담 신청',
});

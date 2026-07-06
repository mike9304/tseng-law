/**
 * Health/clinic home — MIGRATED 2026-06-04 from a hardcoded law-navy (#123b63 ×17) skeleton to
 * `buildIndustryHome` with the health-clinical (calm teal) token palette. Inherits serif/sans
 * pairing + hero scrim. See WIX-DESIGN-FIDELITY-SPEC §3.4.
 */
import { buildIndustryHome } from '../_shared/industry-home';

export const healthHomeTemplate = buildIndustryHome({
  id: 'health-home',
  name: '의료/클리닉 홈',
  category: 'health',
  description: '가까이에서 오래 함께하는 건강 파트너. 정확한 진단과 편안한 진료로 일상을 지킵니다.',
  palette: {
    base: '#123c32', surface: '#ffffff', surfaceAlt: '#dff0ea', ink: '#123c32',
    mutedInk: '#57746b', accent: '#2f8f75', onAccent: '#ffffff', line: '#c5ded7',
  },
  heroImage: '/images/placeholder-health-hero.jpg',
  heroImageAlt: '밝고 청결한 진료 공간',
  heroEyebrow: 'YOUR HEALTH PARTNER',
  heroTitle: '오래 함께할\n건강 파트너',
  heroSubtitle: '서두르지 않고 충분히 듣습니다. 정확한 진단과 편안한 진료로 일상의 건강을 함께 지킵니다.',
  heroPrimaryCta: '진료 예약',
  heroSecondaryCta: '진료 안내',
  stats: [
    { value: '20년', label: '지역과 함께한 진료' },
    { value: '당일', label: '예약·검사 빠른 진행' },
    { value: '4.9', label: '환자 만족도' },
  ],
  servicesTitle: '꼼꼼하게 살피는 진료',
  servicesSubtitle: '증상만이 아니라 생활 습관까지 함께 봅니다. 근본 원인을 찾는 진료를 지향합니다.',
  services: [
    { title: '정밀 검진', desc: '최신 장비와 단계별 검사로 정확하게 원인을 찾습니다.', image: '/images/placeholder-hospital.jpg', imageAlt: '정밀 검진 장비' },
    { title: '맞춤 진료', desc: '환자의 상태와 생활에 맞춘 치료 계획을 세웁니다.', image: '/images/placeholder-health-hero.jpg', imageAlt: '맞춤 진료 상담' },
    { title: '예방·관리', desc: '치료 후에도 정기 관리로 재발 없이 건강을 지킵니다.', image: '/images/placeholder-hospital.jpg', imageAlt: '예방 관리 안내' },
  ],
  featureTitle: '충분히 듣고, 정확히 진단합니다',
  featureBody: '짧은 진료 대신 충분한 상담을 약속합니다. 검사 결과를 알기 쉽게 설명하고, 과잉 진료 없이 꼭 필요한 치료만 권합니다. 환자가 납득하고 선택하는 진료를 만듭니다.',
  featureBullets: ['충분한 상담 시간', '결과 쉬운 설명', '과잉 진료 없는 원칙'],
  featureImage: '/images/placeholder-hospital.jpg',
  featureImageAlt: '진료 상담이 이루어지는 공간',
  processTitle: '진료 받는 과정',
  process: [
    { step: '01', title: '예약·접수', desc: '전화나 온라인으로 원하는 시간에 간편하게 예약합니다.' },
    { step: '02', title: '진단·검사', desc: '증상과 생활을 충분히 듣고 필요한 검사를 진행합니다.' },
    { step: '03', title: '치료·관리', desc: '결과를 설명하고 맞춤 치료와 관리 계획을 안내합니다.' },
  ],
  testimonialQuote: '늘 바쁘게 지나가던 다른 곳과 달리, 증상을 끝까지 들어 주시고 검사 결과도 그림까지 그려가며 설명해 주셔서 안심이 됐어요.',
  testimonialAuthor: '오현주',
  testimonialRole: '정기 검진 환자',
  ctaTitle: '건강은 미루지 않는 게 좋습니다',
  ctaSubtitle: '증상이 있거나 검진이 필요하시면 편하게 예약해 주세요.',
  ctaButton: '진료 예약하기',
});

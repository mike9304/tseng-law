/**
 * Pet care/vet home — MIGRATED 2026-06-04 from a hardcoded law-navy (#123b63 ×15) skeleton to
 * `buildIndustryHome` with a warm, friendly coral palette (NOT the old clinical-teal default).
 * Inherits serif/sans pairing + hero scrim. See WIX-DESIGN-FIDELITY-SPEC §3.4.
 */
import { buildIndustryHome } from '../_shared/industry-home';

export const petHomeTemplate = buildIndustryHome({
  id: 'pet-home',
  name: '반려동물 케어 홈',
  category: 'pet',
  description: '우리 아이의 평생 건강을 함께. 따뜻한 진료와 세심한 케어로 가족의 일상을 지킵니다.',
  palette: {
    base: '#2f231a', surface: '#fffaf5', surfaceAlt: '#f3e7da', ink: '#2b2018',
    mutedInk: '#6f6253', accent: '#d97742', onAccent: '#ffffff', line: '#e4d5c4',
  },
  heroImage: '/images/placeholder-pet-hero.jpg',
  heroImageAlt: '편안하게 진료받는 반려동물',
  heroEyebrow: 'FOR YOUR FAMILY',
  heroTitle: '우리 아이의\n평생 건강 파트너',
  heroSubtitle: '겁먹지 않게, 아프지 않게. 보호자의 마음으로 진료하고 케어합니다. 작은 변화도 놓치지 않습니다.',
  heroPrimaryCta: '진료 예약',
  heroSecondaryCta: '진료 안내',
  stats: [
    { value: '15년', label: '동물 진료 경력' },
    { value: '24h', label: '응급 진료 대응' },
    { value: '4.9', label: '보호자 만족도' },
  ],
  servicesTitle: '평생을 함께하는 케어',
  servicesSubtitle: '예방부터 치료, 노령 케어까지. 생애 주기에 맞춘 건강 관리를 제안합니다.',
  services: [
    { title: '건강검진·예방', desc: '정기 검진과 백신으로 질병을 미리 막습니다.', image: '/images/placeholder-vet-clinic.jpg', imageAlt: '반려동물 건강검진' },
    { title: '내과·외과 진료', desc: '정확한 진단과 안전한 수술로 빠른 회복을 돕습니다.', image: '/images/placeholder-vet-surgery.jpg', imageAlt: '동물 외과 진료' },
    { title: '노령·재활 케어', desc: '나이 든 아이의 통증과 컨디션을 세심히 관리합니다.', image: '/images/placeholder-vet-waiting.jpg', imageAlt: '노령 동물 케어' },
  ],
  featureTitle: '겁먹지 않는 진료를 위해',
  featureBody: '동물이 받는 스트레스를 줄이는 진료를 우선합니다. 보호자에게 상태와 치료 과정을 충분히 설명하고, 무리한 검사 없이 꼭 필요한 처치만 권합니다. 진료 후 홈케어까지 함께 안내합니다.',
  featureBullets: ['저자극 진료 환경', '보호자 충분한 설명', '진료 후 홈케어 안내'],
  featureImage: '/images/placeholder-vet-ward.jpg',
  featureImageAlt: '입원 케어가 이루어지는 공간',
  processTitle: '진료 받는 과정',
  process: [
    { step: '01', title: '예약·접수', desc: '아이의 증상과 상태를 미리 남겨 주시면 준비합니다.' },
    { step: '02', title: '진단·상담', desc: '검사 후 상태와 치료 방향을 충분히 설명드립니다.' },
    { step: '03', title: '치료·케어', desc: '치료와 함께 집에서의 관리법까지 안내해 드립니다.' },
  ],
  testimonialQuote: '겁 많은 아이인데 선생님이 천천히 다가가 주셔서 처음으로 병원에서 안 떨었어요. 무리한 검사 권하지 않으시는 점도 정말 믿음이 가요.',
  testimonialAuthor: '강민서',
  testimonialRole: '반려견 보호자',
  ctaTitle: '우리 아이, 건강하게 지켜요',
  ctaSubtitle: '증상이 있거나 정기 검진이 필요하면 편하게 예약해 주세요.',
  ctaButton: '진료 예약하기',
});

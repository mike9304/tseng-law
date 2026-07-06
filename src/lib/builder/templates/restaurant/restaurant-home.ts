/**
 * Restaurant home — MIGRATED 2026-06-04 from a hardcoded law-navy (#123b63 ×15) skeleton to
 * `buildIndustryHome` with the restaurant-warm (terracotta) token palette + full-bleed food
 * photography. Inherits serif/sans pairing + hero scrim. See WIX-DESIGN-FIDELITY-SPEC §3.4.
 */
import { buildIndustryHome } from '../_shared/industry-home';

export const restaurantHomeTemplate = buildIndustryHome({
  id: 'restaurant-home',
  name: '레스토랑 홈',
  category: 'restaurant',
  description: '제철 재료로 매일 짓는 한 상. 정성스러운 코스와 따뜻한 공간에서 특별한 시간을 만듭니다.',
  palette: {
    base: '#2a1410', surface: '#fffaf1', surfaceAlt: '#efd9b7', ink: '#211814',
    mutedInk: '#6d5548', accent: '#b9432f', onAccent: '#ffffff', line: '#e4c79f',
  },
  heroImage: '/images/placeholder-restaurant-hero.jpg',
  heroImageAlt: '따뜻한 조명 아래 정갈하게 차려진 요리',
  heroEyebrow: '제철 다이닝 · SINCE 2011',
  heroTitle: '오늘의 식재료가\n오늘의 메뉴',
  heroSubtitle: '아침마다 들여온 제철 재료로 셰프가 직접 코스를 구성합니다. 맛도 공간도 정성껏 차렸습니다.',
  heroPrimaryCta: '예약하기',
  heroSecondaryCta: '메뉴 보기',
  stats: [
    { value: '제철', label: '매일 바뀌는 코스 구성' },
    { value: '15년', label: '한자리를 지킨 다이닝' },
    { value: '4.8', label: '재방문 손님 평점' },
  ],
  servicesTitle: '오늘의 식탁을 채우는 것들',
  servicesSubtitle: '좋은 재료를 과하지 않게. 재료 본연의 맛을 살린 한 접시를 냅니다.',
  services: [
    { title: '시그니처 코스', desc: '제철 재료로 매주 새롭게 구성하는 셰프의 코스 요리.', image: '/images/placeholder-dish-1.jpg', imageAlt: '시그니처 코스 요리' },
    { title: '오늘의 메인', desc: '그날 가장 좋은 재료로 완성하는 단품 메인 디시.', image: '/images/placeholder-dish-2.jpg', imageAlt: '오늘의 메인 디시' },
    { title: '디저트 & 와인', desc: '식사의 끝을 잇는 수제 디저트와 어울리는 와인 페어링.', image: '/images/placeholder-dish-3.jpg', imageAlt: '디저트와 와인' },
  ],
  featureTitle: '재료에서 시작하는 한 상',
  featureBody: '매일 새벽 직접 고른 제철 재료만 사용합니다. 불필요한 가공 없이 재료 본연의 맛을 살리고, 코스마다 어울리는 그릇과 온도까지 맞춰 정성스러운 한 끼를 완성합니다.',
  featureBullets: ['매일 들여오는 제철 재료', '셰프 직접 구성 코스', '소믈리에 와인 페어링'],
  featureImage: '/images/placeholder-chef.jpg',
  featureImageAlt: '주방에서 요리를 마무리하는 셰프',
  processTitle: '예약부터 식사까지',
  process: [
    { step: '01', title: '예약', desc: '인원과 시간을 남기면 자리와 코스를 준비해 둡니다.' },
    { step: '02', title: '코스 안내', desc: '그날의 재료와 코스 구성을 테이블에서 설명해 드립니다.' },
    { step: '03', title: '다이닝', desc: '온도와 흐름에 맞춰 한 접시씩 정성껏 서빙합니다.' },
  ],
  testimonialQuote: '갈 때마다 메뉴가 달라서 늘 새롭고, 재료 설명을 들으며 먹는 재미가 있어요. 특별한 날이면 가장 먼저 떠오르는 곳이에요.',
  testimonialAuthor: '정민호',
  testimonialRole: '기념일 단골 손님',
  ctaTitle: '특별한 하루를 식탁에서 시작하세요',
  ctaSubtitle: '평일 디너와 주말 런치는 사전 예약을 권해 드립니다.',
  ctaButton: '자리 예약하기',
});

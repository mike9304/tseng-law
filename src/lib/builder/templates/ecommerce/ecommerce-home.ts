/**
 * E-commerce home — MIGRATED 2026-06-04 from a hardcoded law-navy (#123b63 ×15) skeleton to
 * `buildIndustryHome` with a clean modern indigo palette (distinct from the warm food templates).
 * Inherits serif/sans pairing + hero scrim. See WIX-DESIGN-FIDELITY-SPEC §3.4.
 */
import { buildIndustryHome } from '../_shared/industry-home';

export const ecommerceHomeTemplate = buildIndustryHome({
  id: 'ecommerce-home',
  name: '쇼핑몰 홈',
  category: 'ecommerce',
  description: '고른 것에 진심인 셀렉트 숍. 매일 쓰는 물건일수록 더 좋은 것을 골라 제안합니다.',
  palette: {
    base: '#1a1a2e', surface: '#ffffff', surfaceAlt: '#f2f2f7', ink: '#1a1a2e',
    mutedInk: '#6b6b78', accent: '#4f46e5', onAccent: '#ffffff', line: '#e4e4ec',
  },
  heroImage: '/images/placeholder-shop-hero.jpg',
  heroImageAlt: '감각적으로 진열된 셀렉트 숍 제품',
  heroEyebrow: 'CURATED EVERYDAY',
  heroTitle: '매일 쓰는 것일수록\n더 좋은 것을',
  heroSubtitle: '수많은 제품 중 직접 써 보고 고른 것만 담았습니다. 오래 곁에 둘 물건을 제안합니다.',
  heroPrimaryCta: '지금 쇼핑하기',
  heroSecondaryCta: '신상품 보기',
  stats: [
    { value: '4.9', label: '평균 고객 별점' },
    { value: '당일', label: '오후 2시 전 주문 발송' },
    { value: '무료', label: '5만원 이상 무료배송' },
  ],
  servicesTitle: '이번 주의 셀렉션',
  servicesSubtitle: '유행보다 오래 쓰는 가치를 봅니다. 매주 새롭게 큐레이션합니다.',
  services: [
    { title: '베스트셀러', desc: '다시 찾는 분이 가장 많은, 검증된 스테디 아이템.', image: '/images/placeholder-product-1.jpg', imageAlt: '베스트셀러 제품' },
    { title: '신상품', desc: '이번 시즌 새롭게 들어온 감각적인 신상 컬렉션.', image: '/images/placeholder-product-2.jpg', imageAlt: '신상품 컬렉션' },
    { title: '한정 기획', desc: '지금 아니면 만나기 어려운 한정 수량 기획전.', image: '/images/placeholder-product-3.jpg', imageAlt: '한정 기획전' },
  ],
  featureTitle: '고르는 일에 진심입니다',
  featureBody: '입고 전에 직접 써 보고, 만듦새와 사용감을 확인한 제품만 올립니다. 상세 정보와 실사용 후기를 투명하게 제공하고, 마음에 들지 않으면 부담 없이 교환·반품할 수 있습니다.',
  featureBullets: ['직접 검수한 제품만', '실사용 후기 제공', '간편 교환·반품'],
  featureImage: '/images/placeholder-product-large.jpg',
  featureImageAlt: '대표 제품 클로즈업',
  processTitle: '주문부터 배송까지',
  process: [
    { step: '01', title: '담기', desc: '마음에 드는 제품을 장바구니에 담고 옵션을 고릅니다.' },
    { step: '02', title: '결제', desc: '간편결제로 빠르고 안전하게 주문을 완료합니다.' },
    { step: '03', title: '배송', desc: '오후 2시 전 주문은 당일 발송해 빠르게 받아 보세요.' },
  ],
  testimonialQuote: '제품 설명이 솔직해서 믿고 사게 돼요. 후기에 단점도 적어 두셔서 오히려 신뢰가 가고, 받아 보면 늘 기대 이상이었어요.',
  testimonialAuthor: '신유나',
  testimonialRole: '재구매 고객',
  ctaTitle: '오래 곁에 둘 물건을 만나보세요',
  ctaSubtitle: '지금 가입하면 첫 구매에 사용할 수 있는 할인 혜택을 드립니다.',
  ctaButton: '쇼핑 시작하기',
});

/**
 * Fitness/gym home — MIGRATED 2026-06-04 from a hardcoded law-navy (#123b63 ×15) skeleton to
 * `buildIndustryHome` with a DARK energetic palette (charcoal + bold orange) — high-contrast,
 * distinct from every warm-cream template. Inherits serif/sans pairing + hero scrim. Spec §3.4.
 */
import { buildIndustryHome } from '../_shared/industry-home';

export const fitnessHomeTemplate = buildIndustryHome({
  id: 'fitness-home',
  name: '피트니스 홈',
  category: 'fitness',
  description: '오늘의 한 시간이 내일의 컨디션을 바꿉니다. 전문 코치와 함께하는 1:1 맞춤 트레이닝.',
  // Light body + dramatic dark hero + bold orange — energetic, but within the builder's
  // light-surface assumption (root-level section titles use dark ink on a light page; a
  // fully-dark theme needs a document-background mechanism the builder doesn't have yet).
  palette: {
    base: '#14181f', surface: '#ffffff', surfaceAlt: '#eef1f5', ink: '#14181f',
    mutedInk: '#5b6472', accent: '#e0532b', onAccent: '#ffffff', line: '#dde1e8',
  },
  heroImage: '/images/placeholder-gym-hero.jpg',
  heroImageAlt: '집중해서 운동하는 회원이 있는 짐 내부',
  heroEyebrow: 'TRAIN WITH PURPOSE',
  heroTitle: '한계는\n오늘 갱신한다',
  heroSubtitle: '체력 측정부터 식단까지, 전문 코치가 당신의 목표에 맞춘 루틴을 설계합니다. 혼자가 아닙니다.',
  heroPrimaryCta: '무료 체험 신청',
  heroSecondaryCta: '프로그램 보기',
  stats: [
    { value: '1:1', label: '전담 코치 맞춤 설계' },
    { value: '500+', label: '목표를 이룬 회원' },
    { value: '24h', label: '연중무휴 자유 이용' },
  ],
  servicesTitle: '목표에 맞춘 세 가지 트랙',
  servicesSubtitle: '체형도 목표도 다릅니다. 당신에게 맞는 강도와 방식으로 시작하세요.',
  services: [
    { title: '퍼스널 트레이닝', desc: '체력 측정 기반 1:1 맞춤 루틴으로 확실한 변화를 만듭니다.', image: '/images/placeholder-fitness-boxing.jpg', imageAlt: '퍼스널 트레이닝' },
    { title: '그룹 HIIT', desc: '짧고 강하게. 함께 땀 흘리며 끝까지 가는 그룹 클래스.', image: '/images/placeholder-fitness-hiit.jpg', imageAlt: '그룹 HIIT 클래스' },
    { title: '필라테스 & 모빌리티', desc: '코어와 자세를 바로잡아 부상 없이 오래 운동합니다.', image: '/images/placeholder-fitness-pilates.jpg', imageAlt: '필라테스 클래스' },
  ],
  featureTitle: '측정하고, 설계하고, 증명한다',
  featureBody: '감이 아니라 데이터로 운동합니다. 인바디와 체력 측정으로 출발점을 정하고, 4주마다 다시 측정해 루틴을 조정합니다. 식단 피드백까지 더해 결과를 눈으로 확인하세요.',
  featureBullets: ['4주 단위 체력 재측정', '식단 1:1 피드백', '연중무휴 24시간 오픈'],
  featureImage: '/images/placeholder-gym-interior.jpg',
  featureImageAlt: '장비가 갖춰진 넓은 트레이닝 공간',
  processTitle: '시작은 이렇게',
  process: [
    { step: '01', title: '무료 체력 측정', desc: '인바디와 기능 평가로 현재 상태를 정확히 파악합니다.' },
    { step: '02', title: '루틴 설계', desc: '목표와 일정에 맞춰 운동·식단 플랜을 구성합니다.' },
    { step: '03', title: '실행과 점검', desc: '코치와 함께 진행하고 4주마다 결과를 점검합니다.' },
  ],
  testimonialQuote: '막연하게 운동하던 때와 달리 숫자로 변화를 보니 동기부여가 확실해요. 코치님이 무리하지 않게 끌어주셔서 3개월째 빠지지 않고 나와요.',
  testimonialAuthor: '박서진',
  testimonialRole: '체중 8kg 감량 회원',
  ctaTitle: '변화는 첫 한 시간에서 시작됩니다',
  ctaSubtitle: '첫 방문 회원에게 체력 측정과 1회 PT 체험을 무료로 제공합니다.',
  ctaButton: '무료 체험 예약',
});

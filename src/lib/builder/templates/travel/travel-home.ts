/**
 * Travel home — MIGRATED 2026-06-04 from a hardcoded law-navy (#123b63 ×15) skeleton to
 * `buildIndustryHome` with the travel-editorial palette (deep blue hero + sunset orange).
 * Inherits serif/sans pairing + hero scrim. See WIX-DESIGN-FIDELITY-SPEC §3.4.
 */
import { buildIndustryHome } from '../_shared/industry-home';

export const travelHomeTemplate = buildIndustryHome({
  id: 'travel-home',
  name: '여행 홈',
  category: 'travel',
  description: '떠나기 전부터 설레는 여행. 동선부터 숙소까지, 취향에 맞춘 여정을 함께 설계합니다.',
  palette: {
    base: '#101827', surface: '#fff8ed', surfaceAlt: '#f3e6cf', ink: '#101827',
    mutedInk: '#657184', accent: '#d88a3d', onAccent: '#ffffff', line: '#e0d3b8',
  },
  heroImage: '/images/placeholder-travel-hero.jpg',
  heroImageAlt: '해 질 녘 이국적인 해변 풍경',
  heroEyebrow: 'CRAFTED JOURNEYS',
  heroTitle: '떠나기 전부터\n설레는 여행',
  heroSubtitle: '남들 다 가는 코스 말고, 당신의 속도에 맞춘 여정. 동선과 숙소, 맛집까지 함께 설계합니다.',
  heroPrimaryCta: '여행 상담',
  heroSecondaryCta: '추천 코스 보기',
  stats: [
    { value: '40+', label: '안내한 여행 지역' },
    { value: '맞춤', label: '취향 기반 일정 설계' },
    { value: '24h', label: '현지 비상 연락 지원' },
  ],
  servicesTitle: '취향대로 떠나는 세 가지',
  servicesSubtitle: '같은 도시도 누구와 어떻게 가느냐에 따라 완전히 다른 여행이 됩니다.',
  services: [
    { title: '휴양·리조트', desc: '아무것도 하지 않을 자유. 온전히 쉬기 위한 휴양 일정.', image: '/images/placeholder-travel-bali.jpg', imageAlt: '휴양지 리조트' },
    { title: '도시·미식', desc: '골목과 식당을 따라 걷는 감각적인 도시 여행.', image: '/images/placeholder-travel-japan.jpg', imageAlt: '도시 여행' },
    { title: '자연·트레킹', desc: '계절이 가장 아름다운 순간에 떠나는 자연 여정.', image: '/images/placeholder-travel-europe.jpg', imageAlt: '자연 트레킹' },
  ],
  featureTitle: '일정표가 아니라, 여정을 만듭니다',
  featureBody: '취향과 예산, 함께 가는 사람을 먼저 듣습니다. 무리한 동선 대신 여유 있는 흐름으로 짜고, 현지에서 생기는 변수까지 실시간으로 함께 풀어 갑니다.',
  featureBullets: ['취향 기반 맞춤 동선', '검증된 숙소·맛집', '현지 24시간 지원'],
  featureImage: '/images/placeholder-travel-hawaii.jpg',
  featureImageAlt: '해안 절경을 바라보는 여행자',
  processTitle: '여정이 만들어지기까지',
  process: [
    { step: '01', title: '취향 상담', desc: '가고 싶은 곳과 원하는 분위기를 함께 이야기합니다.' },
    { step: '02', title: '일정 설계', desc: '동선·숙소·예산에 맞춰 여유로운 일정을 구성합니다.' },
    { step: '03', title: '여행·지원', desc: '출발부터 귀국까지 현지 변수도 함께 챙깁니다.' },
  ],
  testimonialQuote: '빡빡한 패키지에 지쳐 있었는데, 제 속도에 맞춰 일정을 짜 주셔서 처음으로 여행이 쉼이 됐어요. 추천해 주신 식당마다 정말 좋았습니다.',
  testimonialAuthor: '임도연',
  testimonialRole: '가족 여행 고객',
  ctaTitle: '다음 여행, 어디로 떠날까요?',
  ctaSubtitle: '가고 싶은 지역과 일정을 남겨 주시면 맞춤 코스를 제안해 드립니다.',
  ctaButton: '여행 상담 신청',
});

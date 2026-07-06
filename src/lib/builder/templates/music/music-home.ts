/**
 * Music/artist home — MIGRATED 2026-06-04 from a hardcoded law-navy (#123b63 ×12) skeleton to
 * `buildIndustryHome` with a bold near-black + vivid violet palette (stage energy). Inherits
 * serif/sans pairing + hero scrim. See WIX-DESIGN-FIDELITY-SPEC §3.4.
 */
import { buildIndustryHome } from '../_shared/industry-home';

export const musicHomeTemplate = buildIndustryHome({
  id: 'music-home',
  name: '뮤지션 홈',
  category: 'music',
  description: '무대 위의 순간을 팬과 잇다. 새 음악과 공연 소식을 가장 먼저 전합니다.',
  palette: {
    base: '#141019', surface: '#ffffff', surfaceAlt: '#efe9f4', ink: '#181320',
    mutedInk: '#6a6376', accent: '#8b5cf6', onAccent: '#ffffff', line: '#e4dded',
  },
  heroImage: '/images/placeholder-music-hero.jpg',
  heroImageAlt: '조명 아래 무대 위 공연 장면',
  heroEyebrow: 'NEW RELEASE OUT NOW',
  heroTitle: '무대 위의 순간을\n당신에게',
  heroSubtitle: '새 앨범, 라이브, 비하인드까지. 음악으로 이어지는 모든 순간을 팬과 가장 먼저 나눕니다.',
  heroPrimaryCta: '음악 듣기',
  heroSecondaryCta: '공연 일정',
  stats: [
    { value: '2.4M', label: '누적 스트리밍' },
    { value: '40+', label: '함께한 라이브 무대' },
    { value: 'NEW', label: '이번 달 신곡 공개' },
  ],
  servicesTitle: '지금 듣고, 보고, 함께',
  servicesSubtitle: '음원부터 공연, 굿즈까지. 음악을 즐기는 모든 방법을 한곳에서.',
  services: [
    { title: '신보 & 음원', desc: '새 앨범과 싱글을 주요 음원 사이트에서 바로 만나세요.', image: '/images/placeholder-album-cover.jpg', imageAlt: '신보 앨범 커버' },
    { title: '라이브 공연', desc: '다가오는 콘서트와 페스티벌 일정을 확인하고 예매하세요.', image: '/images/placeholder-music-hero.jpg', imageAlt: '라이브 공연' },
    { title: '오피셜 굿즈', desc: '한정판 앨범과 머천다이즈를 공식 스토어에서.', image: '/images/placeholder-album-cover.jpg', imageAlt: '오피셜 굿즈' },
  ],
  featureTitle: '음악이 만들어지는 순간',
  featureBody: '완성된 음원만이 아니라 만들어지는 과정을 함께 나눕니다. 작업실 비하인드, 가사에 담은 이야기, 라이브 비하인드까지 — 음악 너머의 순간을 팬과 가장 가까이에서 공유합니다.',
  featureBullets: ['작업 비하인드 공개', '팬 전용 선공개', '뉴스레터 소식'],
  featureImage: '/images/placeholder-music-hero.jpg',
  featureImageAlt: '작업 중인 아티스트',
  processTitle: '함께하는 방법',
  process: [
    { step: '01', title: '팔로우', desc: '음원 사이트와 채널을 팔로우하고 소식을 받습니다.' },
    { step: '02', title: '감상·예매', desc: '신곡을 듣고 다가오는 공연을 예매합니다.' },
    { step: '03', title: '함께 즐기기', desc: '굿즈와 팬 이벤트로 무대 밖에서도 함께합니다.' },
  ],
  testimonialQuote: '음악도 좋지만 만드는 과정을 나눠 주셔서 곡을 들을 때마다 이야기가 떠올라요. 라이브는 매번 기대 이상이고요.',
  testimonialAuthor: '데이비드 K',
  testimonialRole: '오랜 팬',
  ctaTitle: '새 음악, 가장 먼저 들어보세요',
  ctaSubtitle: '뉴스레터를 구독하면 신곡과 공연 소식을 가장 빠르게 받아 봅니다.',
  ctaButton: '소식 받아보기',
});

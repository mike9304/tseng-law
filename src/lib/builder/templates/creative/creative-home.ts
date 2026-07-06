/**
 * Creative agency home — MIGRATED 2026-06-04 from a hardcoded law-navy (#123b63 ×17) skeleton to
 * `buildIndustryHome` with a high-contrast mono + creative magenta palette. Inherits serif/sans
 * pairing + hero scrim. See WIX-DESIGN-FIDELITY-SPEC §3.4.
 */
import { buildIndustryHome } from '../_shared/industry-home';

export const creativeHomeTemplate = buildIndustryHome({
  id: 'creative-home',
  name: '크리에이티브 스튜디오 홈',
  category: 'creative',
  description: '브랜드의 결을 시각 언어로. 전략부터 디자인까지, 보이는 모든 것을 설계합니다.',
  palette: {
    base: '#0f0f12', surface: '#ffffff', surfaceAlt: '#f3f3f4', ink: '#0f0f12',
    mutedInk: '#66666e', accent: '#e0457a', onAccent: '#ffffff', line: '#e6e6e9',
  },
  heroImage: '/images/placeholder-creative-hero.jpg',
  heroImageAlt: '작업물이 가득한 크리에이티브 스튜디오',
  heroEyebrow: 'BRAND & DIGITAL STUDIO',
  heroTitle: '브랜드의 결을\n눈에 보이게',
  heroSubtitle: '전략 없는 예쁨은 오래가지 않습니다. 브랜드의 이야기를 시각 언어로 번역해 끝까지 설계합니다.',
  heroPrimaryCta: '프로젝트 문의',
  heroSecondaryCta: '작업 보기',
  stats: [
    { value: '120+', label: '완성한 브랜드 프로젝트' },
    { value: '10년', label: '스튜디오 운영 경력' },
    { value: '4.9', label: '클라이언트 만족도' },
  ],
  servicesTitle: '설계하는 세 가지 영역',
  servicesSubtitle: '로고 하나가 아니라, 브랜드가 만나는 모든 접점을 디자인합니다.',
  services: [
    { title: '브랜드 아이덴티티', desc: '전략에서 출발해 로고·컬러·타이포까지 체계로 만듭니다.', image: '/images/placeholder-creative-team.jpg', imageAlt: '브랜드 아이덴티티 작업' },
    { title: '웹·디지털', desc: '브랜드 경험을 웹과 앱으로 자연스럽게 이어 갑니다.', image: '/images/placeholder-creative-hero.jpg', imageAlt: '웹 디자인 작업' },
    { title: '콘텐츠·캠페인', desc: '브랜드를 알리는 콘텐츠와 캠페인을 함께 기획합니다.', image: '/images/placeholder-creative-team.jpg', imageAlt: '콘텐츠 캠페인' },
  ],
  featureTitle: '전략에서 시작하는 디자인',
  featureBody: '예쁘게 만드는 일은 마지막입니다. 먼저 브랜드가 누구에게 무엇을 말해야 하는지를 정리하고, 그 답을 시각 언어로 번역합니다. 그래서 우리의 디자인은 시간이 지나도 흔들리지 않습니다.',
  featureBullets: ['전략 기반 디자인', '일관된 브랜드 시스템', '런칭 후 가이드 제공'],
  featureImage: '/images/placeholder-creative-team.jpg',
  featureImageAlt: '협업 중인 디자인 팀',
  processTitle: '프로젝트가 완성되기까지',
  process: [
    { step: '01', title: '발견·전략', desc: '브랜드의 목표와 타깃을 함께 정의합니다.' },
    { step: '02', title: '디자인', desc: '전략을 시각 언어로 번역해 시스템으로 만듭니다.' },
    { step: '03', title: '구현·전달', desc: '실제 채널에 적용하고 운영 가이드를 전달합니다.' },
  ],
  testimonialQuote: '단순히 예쁜 결과물이 아니라 왜 이렇게 만들었는지를 설명해 주셔서 내부 설득이 쉬웠어요. 덕분에 브랜드가 한 방향으로 정리됐습니다.',
  testimonialAuthor: '브랜드 매니저 J',
  testimonialRole: '리테일 브랜드 클라이언트',
  ctaTitle: '브랜드의 다음 장을 함께 써요',
  ctaSubtitle: '프로젝트의 목표와 일정을 남겨 주시면 제안서를 보내 드립니다.',
  ctaButton: '프로젝트 문의하기',
});

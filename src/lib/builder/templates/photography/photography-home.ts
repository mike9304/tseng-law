/**
 * Photography home — MIGRATED 2026-06-04 from a hardcoded law-navy (#123b63 ×15) skeleton to
 * `buildIndustryHome` with a near-mono + muted taupe-gold palette (lets the work lead). Inherits
 * serif/sans pairing + hero scrim. See WIX-DESIGN-FIDELITY-SPEC §3.4.
 */
import { buildIndustryHome } from '../_shared/industry-home';

export const photographyHomeTemplate = buildIndustryHome({
  id: 'photography-home',
  name: '포토그래피 홈',
  category: 'photography',
  description: '순간을 오래 남기는 일. 인물부터 웨딩, 제품까지 결을 살린 사진으로 기록합니다.',
  palette: {
    base: '#121212', surface: '#faf9f7', surfaceAlt: '#ece9e3', ink: '#1a1a1a',
    mutedInk: '#6a6a6a', accent: '#9b8463', onAccent: '#ffffff', line: '#e2ded7',
  },
  heroImage: '/images/placeholder-photo-hero.jpg',
  heroImageAlt: '자연광으로 촬영한 인물 사진',
  heroEyebrow: 'STUDIO PORTFOLIO',
  heroTitle: '순간을\n오래 남기다',
  heroSubtitle: '연출보다 결을 봅니다. 그 사람과 그 공간이 가장 자연스러운 순간을 사진으로 기록합니다.',
  heroPrimaryCta: '촬영 문의',
  heroSecondaryCta: '포트폴리오 보기',
  stats: [
    { value: '800+', label: '진행한 촬영 세션' },
    { value: '10년', label: '쌓아온 작업 경력' },
    { value: '48h', label: '셀렉 후 보정 전달' },
  ],
  servicesTitle: '담아내는 세 가지 결',
  servicesSubtitle: '장면마다 어울리는 빛과 톤이 다릅니다. 목적에 맞춰 촬영을 설계합니다.',
  services: [
    { title: '인물·프로필', desc: '표정과 분위기를 살린 자연스러운 인물·프로필 촬영.', image: '/images/placeholder-photo-portrait.jpg', imageAlt: '인물 촬영' },
    { title: '웨딩·기념일', desc: '다시 오지 않을 하루를 따뜻한 톤으로 기록합니다.', image: '/images/placeholder-photo-wedding.jpg', imageAlt: '웨딩 촬영' },
    { title: '제품·브랜드', desc: '브랜드 무드에 맞춘 감각적인 제품·룩북 촬영.', image: '/images/placeholder-photo-product.jpg', imageAlt: '제품 촬영' },
  ],
  featureTitle: '빛을 읽고, 결을 남긴다',
  featureBody: '자연광과 공간의 분위기를 먼저 살핍니다. 과한 보정 대신 본연의 색을 살린 톤으로, 시간이 지나도 질리지 않는 사진을 만듭니다. 셀렉부터 보정까지 직접 책임집니다.',
  featureBullets: ['자연광 중심 연출', '본연의 톤 보정', '원본·고해상 파일 제공'],
  featureImage: '/images/placeholder-photo-event.jpg',
  featureImageAlt: '현장에서 촬영 중인 모습',
  processTitle: '촬영이 완성되기까지',
  process: [
    { step: '01', title: '문의·기획', desc: '목적과 무드를 함께 정하고 일정과 장소를 잡습니다.' },
    { step: '02', title: '촬영', desc: '편안한 분위기에서 자연스러운 순간을 담아냅니다.' },
    { step: '03', title: '셀렉·보정', desc: '엄선한 컷을 톤에 맞게 보정해 48시간 내 전달합니다.' },
  ],
  testimonialQuote: '어색하지 않게 이끌어 주셔서 사진마다 표정이 자연스러워요. 보정 톤도 과하지 않아서 몇 년이 지나도 다시 꺼내 보게 됩니다.',
  testimonialAuthor: '서연우',
  testimonialRole: '프로필·웨딩 촬영 고객',
  ctaTitle: '남기고 싶은 순간이 있나요?',
  ctaSubtitle: '촬영 목적과 일정을 남겨 주시면 맞춤 견적을 안내해 드립니다.',
  ctaButton: '촬영 문의하기',
});

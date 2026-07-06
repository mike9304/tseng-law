/**
 * Education/academy home — MIGRATED 2026-06-04 from a hardcoded law-navy (#123b63 ×18) skeleton
 * to `buildIndustryHome` with a warm academic palette (amber/gold). Inherits serif/sans pairing +
 * hero scrim. See WIX-DESIGN-FIDELITY-SPEC §3.4.
 */
import { buildIndustryHome } from '../_shared/industry-home';

export const educationHomeTemplate = buildIndustryHome({
  id: 'education-home',
  name: '교육/아카데미 홈',
  category: 'education',
  description: '배움의 속도는 저마다 다릅니다. 한 사람 한 사람의 가능성을 끝까지 끌어올립니다.',
  palette: {
    base: '#3a2a17', surface: '#fffaf0', surfaceAlt: '#efe2cb', ink: '#2a2418',
    mutedInk: '#6b6253', accent: '#c08a3a', onAccent: '#ffffff', line: '#e0d3b8',
  },
  heroImage: '/images/placeholder-education-hero.jpg',
  heroImageAlt: '밝은 분위기의 강의 공간',
  heroEyebrow: 'LEARN AT YOUR PACE',
  heroTitle: '한 사람의\n가능성을 끝까지',
  heroSubtitle: '진도가 아니라 이해를 기준으로 가르칩니다. 학생의 속도에 맞춘 1:1 밀착 지도로 성장을 만듭니다.',
  heroPrimaryCta: '수강 상담',
  heroSecondaryCta: '커리큘럼 보기',
  stats: [
    { value: '12년', label: '쌓아온 교육 노하우' },
    { value: '1:1', label: '맞춤 학습 관리' },
    { value: '92%', label: '재등록 학생 비율' },
  ],
  servicesTitle: '성장을 만드는 세 가지',
  servicesSubtitle: '암기가 아니라 스스로 생각하는 힘을 길러 줍니다.',
  services: [
    { title: '맞춤 커리큘럼', desc: '진단 평가로 출발점을 정하고 수준별로 설계합니다.', image: '/images/placeholder-campus.jpg', imageAlt: '맞춤 수업' },
    { title: '1:1 학습 관리', desc: '담당 선생님이 진도와 약점을 꾸준히 관리합니다.', image: '/images/placeholder-education-hero.jpg', imageAlt: '학습 관리' },
    { title: '정기 피드백', desc: '성취도를 학생·학부모와 투명하게 공유합니다.', image: '/images/placeholder-campus-map.jpg', imageAlt: '학습 피드백' },
  ],
  featureTitle: '이해를 기준으로 가르칩니다',
  featureBody: '진도를 빨리 빼는 대신, 한 단원을 확실히 이해하고 넘어갑니다. 막히는 지점을 함께 찾아 메우고, 스스로 풀어내는 경험을 쌓아 공부하는 힘 자체를 길러 줍니다.',
  featureBullets: ['수준별 맞춤 진도', '약점 집중 보완', '학부모 정기 리포트'],
  featureImage: '/images/placeholder-campus.jpg',
  featureImageAlt: '학생들이 학습하는 공간',
  processTitle: '학습이 시작되기까지',
  process: [
    { step: '01', title: '진단 상담', desc: '현재 수준과 목표를 함께 진단하고 방향을 정합니다.' },
    { step: '02', title: '커리큘럼 설계', desc: '학생에게 맞는 단계별 학습 계획을 구성합니다.' },
    { step: '03', title: '관리·피드백', desc: '진도와 성취를 꾸준히 관리하고 피드백합니다.' },
  ],
  testimonialQuote: '아이가 공부를 싫어했는데, 모르는 걸 다그치지 않고 이해할 때까지 봐주셔서 스스로 책상에 앉기 시작했어요. 성적보다 태도가 먼저 달라졌습니다.',
  testimonialAuthor: '최은영',
  testimonialRole: '중등부 학부모',
  ctaTitle: '아이의 가능성을 함께 키워요',
  ctaSubtitle: '무료 진단 상담으로 현재 수준과 학습 방향을 확인해 보세요.',
  ctaButton: '수강 상담 신청',
});

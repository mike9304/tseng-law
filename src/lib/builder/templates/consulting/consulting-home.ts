/**
 * Consulting/B2B home — MIGRATED 2026-06-04 from a hardcoded law-navy (#123b63 ×17) skeleton to
 * `buildIndustryHome` with an executive deep-slate palette. Inherits serif/sans pairing + hero
 * scrim. See WIX-DESIGN-FIDELITY-SPEC §3.4.
 */
import { buildIndustryHome } from '../_shared/industry-home';

export const consultingHomeTemplate = buildIndustryHome({
  id: 'consulting-home',
  name: '컨설팅 홈',
  category: 'consulting',
  description: '복잡한 문제를 명료한 실행으로. 데이터와 경험으로 기업의 다음 단계를 설계합니다.',
  palette: {
    base: '#1f2a2e', surface: '#ffffff', surfaceAlt: '#eef1f0', ink: '#1f2a2e',
    mutedInk: '#5f6b6a', accent: '#3f5f5b', onAccent: '#ffffff', line: '#dde3e1',
  },
  heroImage: '/images/placeholder-consulting-hero.jpg',
  heroImageAlt: '전략을 논의하는 회의 장면',
  heroEyebrow: 'STRATEGY & GROWTH',
  heroTitle: '복잡함을\n명료한 실행으로',
  heroSubtitle: '진단에서 멈추지 않습니다. 데이터로 문제를 정의하고, 현장에서 작동하는 실행안까지 함께 만듭니다.',
  heroPrimaryCta: '상담 요청',
  heroSecondaryCta: '서비스 보기',
  stats: [
    { value: '200+', label: '수행한 컨설팅 과제' },
    { value: '15년', label: '산업 전문 경력' },
    { value: '3.2x', label: '평균 성과 개선' },
  ],
  servicesTitle: '함께 푸는 세 가지 과제',
  servicesSubtitle: '보고서로 끝나는 컨설팅이 아니라, 결과로 증명하는 파트너십을 지향합니다.',
  services: [
    { title: '전략·성장', desc: '시장과 데이터를 분석해 성장 전략과 우선순위를 정합니다.', image: '/images/placeholder-office.jpg', imageAlt: '전략 컨설팅' },
    { title: '운영 혁신', desc: '프로세스를 진단하고 효율과 비용 구조를 개선합니다.', image: '/images/placeholder-consulting-hero.jpg', imageAlt: '운영 혁신' },
    { title: '실행 지원', desc: '제안에 그치지 않고 현장 실행까지 함께 책임집니다.', image: '/images/placeholder-founder.jpg', imageAlt: '실행 지원' },
  ],
  featureTitle: '보고서가 아니라 결과를 만듭니다',
  featureBody: '진단과 제안은 시작일 뿐입니다. 핵심 지표를 함께 정의하고, 실행 과정에 들어가 현장의 저항과 변수를 같이 풀어 갑니다. 성과로 증명되지 않는 컨설팅은 의미가 없다고 믿습니다.',
  featureBullets: ['데이터 기반 진단', '현장 실행 동행', '성과 지표 책임'],
  featureImage: '/images/placeholder-office.jpg',
  featureImageAlt: '협업 중인 컨설팅 팀',
  processTitle: '과제를 푸는 과정',
  process: [
    { step: '01', title: '진단', desc: '데이터와 인터뷰로 문제의 본질을 정의합니다.' },
    { step: '02', title: '설계', desc: '실행 가능한 전략과 우선순위를 함께 만듭니다.' },
    { step: '03', title: '실행·성과', desc: '현장에 들어가 실행하고 결과로 증명합니다.' },
  ],
  testimonialQuote: '제안서만 두껍게 주고 떠나는 곳들과 달랐어요. 실행 단계까지 들어와 현장 사람들을 설득해 주셔서 실제로 숫자가 바뀌었습니다.',
  testimonialAuthor: '대표이사 L',
  testimonialRole: '제조업 클라이언트',
  ctaTitle: '다음 단계를 함께 설계할까요',
  ctaSubtitle: '풀고 싶은 과제를 남겨 주시면 무료 진단 미팅을 제안드립니다.',
  ctaButton: '상담 요청하기',
});

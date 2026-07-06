/**
 * Law home — MIGRATED 2026-06-23 from a 356-line hand-hardcoded skeleton to the shared
 * `buildIndustryHome` builder, removing the false-green "Wix-grade expansion scaffold".
 *
 * BEFORE (the smoking gun, same pattern flagged for cafe in WIX-DESIGN-FIDELITY-SPEC §3.5):
 * real top sections (hero + 4 practice cards + testimonial + contact) were followed by a
 * ~1,960px scaffold of EMPTY placeholder boxes with self-referential meta-copy
 * ("law home 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다", "Showcase module", "대표 비주얼 영역")
 * + fake metrics (6+/3x/4.9/24h) — `stageHeight: STAGE_H + 1960` padding node count to look rich.
 *
 * AFTER: a genuine image-rich law homepage — hero (gradient scrim, serif/sans pairing) + trust
 * stats + 3 practice-area cards + firm feature + 3-step consultation flow + testimonial + CTA.
 * Law identity preserved: navy `#123b63` base (authority) + `law-editorial` gold accent `#b18a4a`,
 * `onAccent` navy `#15233b` (AA-safe on gold). Builder also wires hero gradient scrim + heading
 * serif / body sans (호정 bar). Node count lands in [40,70]; real assets only (all verified to exist).
 */
import { buildIndustryHome } from '../_shared/industry-home';

export const lawHomeTemplate = buildIndustryHome({
  id: 'law-home',
  name: '법률사무소 홈',
  category: 'law',
  description: '히어로 + 업무 분야 + 신뢰 지표 + 상담 절차 + 고객 후기 + 상담 연결 — 한국어 법률 자문 로펌 홈',
  palette: {
    base: '#123b63',
    surface: '#ffffff',
    surfaceAlt: '#eef3f8',
    ink: '#15233b',
    mutedInk: '#5d6b7e',
    accent: '#b18a4a',
    onAccent: '#15233b',
    line: '#d4dde6',
  },
  heroImage: '/images/placeholder-hero.jpg',
  heroImageAlt: '대만 타이베이 도심 전경과 법률 사무소',
  heroEyebrow: '한국어 법률 자문 · 대만',
  heroTitle: '신뢰할 수 있는\n법률 파트너',
  heroSubtitle: '복잡한 법률 문제, 경험 많은 전문가와 함께 해결하세요. 초기 상담은 무료로 제공합니다.',
  heroPrimaryCta: '무료 상담 신청',
  heroSecondaryCta: '업무 분야 보기',
  stats: [
    { value: '15년+', label: '대만 법률 자문 경력' },
    { value: '1,200+', label: '한국어 상담 누적 건수' },
    { value: '4.9', label: '의뢰인 만족도 평점' },
  ],
  servicesTitle: '주요 업무 분야',
  servicesSubtitle: '기업부터 개인까지, 대만에서 마주하는 법률 문제를 한국어로 끝까지 함께합니다.',
  services: [
    { title: '기업법', desc: '설립, M&A, 계약 검토 등 기업 활동 전반에 걸친 법률 자문을 제공합니다.', image: '/images/placeholder-office.jpg', imageAlt: '기업 회의가 진행되는 사무실' },
    { title: '부동산법', desc: '부동산 거래, 임대차 분쟁, 등기 등 부동산 관련 법률 서비스를 전문으로 합니다.', image: '/images/header-skyline-buildings.webp', imageAlt: '타이베이 도심 빌딩 전경' },
    { title: '이민법', desc: '비자 발급, 거류증 연장, 영주권 취득 등 이민 관련 전문 상담을 제공합니다.', image: '/images/placeholder-consulting-hero.jpg', imageAlt: '이민 상담을 진행하는 변호사' },
  ],
  featureTitle: '한국어로, 끝까지 함께하는 법률 파트너',
  featureBody: '낯선 대만 법률 환경에서 언어 장벽 없이 정확하게 소통합니다. 기업 자문부터 가족·상속 분쟁까지, 초기 상담부터 사건 종결까지 한 명의 담당 변호사가 책임지고 안내합니다.',
  featureBullets: ['모든 상담 한국어 진행', '가족·상속 분쟁 대응', '초기 상담 무료'],
  featureImage: '/images/footer-ground-skyline.webp',
  featureImageAlt: '타이베이 도심의 법률 사무소 전경',
  processTitle: '상담은 이렇게 진행됩니다',
  process: [
    { step: '01', title: '문의 접수', desc: '전화 또는 온라인으로 사건 내용을 남겨 주시면 24시간 내 회신드립니다.' },
    { step: '02', title: '무료 초기 상담', desc: '담당 변호사가 사건을 검토하고 해결 방향과 예상 절차를 한국어로 안내합니다.' },
    { step: '03', title: '사건 진행', desc: '선임 후 진행 상황을 단계별로 공유하며 사건 종결까지 책임지고 대리합니다.' },
  ],
  testimonialQuote: '처음 대만에서 법률 문제를 겪었을 때 막막했는데, 이 사무소 덕분에 무사히 해결할 수 있었습니다. 한국어 상담이 정말 큰 도움이 되었습니다.',
  testimonialAuthor: '김도현',
  testimonialRole: '기업 자문 의뢰인',
  ctaTitle: '지금 바로 무료 상담을 신청하세요',
  ctaSubtitle: '전문 변호사가 친절하게 안내해 드립니다. 초기 상담은 비용이 들지 않습니다.',
  ctaButton: '상담 신청하기',
});

import { buildIndustryHome } from '../_shared/industry-home';

/**
 * 컨퍼런스/행사 home — rebuilt from the shared industry-home builder (WIX-PERFECT backlog #7).
 * Replaces a 714-line, zero-image lorem skeleton with a distinct, image-rich, palette-driven
 * Wix-grade home page (hero + stats + service cards + feature split + process + testimonial + CTA).
 */
export const conferenceHomeTemplate = buildIndustryHome({
  id: "conference-home",
  name: "컨퍼런스/행사 홈",
  category: "conference",
  description: "국내외 120명의 연사, 40개 세션, 그리고 5천 명의 동료가 한자리에. AI와 비즈니스의 다음을 가장 먼저 만나보세요.",
  palette: {
    base: "#160f33",
    surface: "#ffffff",
    surfaceAlt: "#f4f2fb",
    ink: "#1c1530",
    mutedInk: "#5b5470",
    accent: "#6d28d9",
    onAccent: "#ffffff",
    line: "#e6e2f2",
  },
  heroImage: "/images/placeholder-photo-event.jpg",
  heroImageAlt: "무대 위 키노트 연사와 가득 찬 컨퍼런스 객석",
  heroEyebrow: "TECH & BUSINESS SUMMIT 2026",
  heroTitle: "내일의 비즈니스를\n움직이는 이틀",
  heroSubtitle: "국내외 120명의 연사, 40개 세션, 그리고 5천 명의 동료가 한자리에. AI와 비즈니스의 다음을 가장 먼저 만나보세요.",
  heroPrimaryCta: "티켓 예매하기",
  heroSecondaryCta: "전체 일정 보기",
  stats: [
    { value: "120+", label: "국내외 초청 연사" },
    { value: "40개", label: "트랙·세션 프로그램" },
    { value: "5,000명", label: "누적 참가자" },
  ],
  servicesTitle: "이번 서밋의 핵심 프로그램",
  servicesSubtitle: "키노트부터 실무 워크숍, 네트워킹까지 — 목적에 맞춰 골라 듣는 이틀간의 트랙",
  services: [
    { title: "키노트 & 연사 라인업", desc: "글로벌 테크 리더와 창업가가 무대에 올라 산업의 방향성과 인사이트를 직접 전합니다.", image: "/images/placeholder-author.jpg", imageAlt: "메인 스테이지에서 발표 중인 키노트 연사" },
    { title: "트랙별 세션 & 워크숍", desc: "AI, 프로덕트, 그로스, 리더십 등 4개 트랙에서 현업 노하우를 깊이 있게 다룹니다.", image: "/images/placeholder-campus.jpg", imageAlt: "세션이 진행되는 컨퍼런스 홀" },
    { title: "네트워킹 & 부스", desc: "참가자와 파트너사가 만나는 라운지와 데모 부스로 새로운 협업의 기회를 엽니다.", image: "/images/placeholder-creative-team.jpg", imageAlt: "네트워킹 중인 참가자들" },
  ],
  featureTitle: "한 번의 등록으로 이틀을 온전히",
  featureBody: "모바일 티켓 한 장이면 입장부터 세션 예약, 연사 자료 다운로드까지 끊김 없이 이어집니다. 사전 등록자에게는 우선 좌석과 공식 애프터파티 초대가 함께 제공됩니다.",
  featureBullets: [
    "QR 모바일 티켓으로 1초 입장",
    "관심 세션 사전 좌석 예약",
    "발표 자료·다시보기 무제한 제공",
  ],
  featureImage: "/images/placeholder-office.jpg",
  featureImageAlt: "행사장 등록 데스크와 참가자 라운지",
  processTitle: "참가까지 3단계",
  process: [
    { step: "01", title: "티켓 선택", desc: "1일권·2일권·VIP 중 일정과 목적에 맞는 티켓을 고릅니다." },
    { step: "02", title: "세션 예약", desc: "공개된 타임테이블에서 듣고 싶은 세션과 워크숍을 미리 담아둡니다." },
    { step: "03", title: "현장 입장", desc: "발급된 QR 모바일 티켓으로 대기 없이 바로 입장합니다." },
  ],
  testimonialQuote: "세션 구성이 알차서 이틀 내내 메모를 멈출 수 없었어요. 현장에서 만난 동료들과 행사 후에도 협업으로 이어졌습니다.",
  testimonialAuthor: "김서연",
  testimonialRole: "토스 프로덕트 매니저",
  ctaTitle: "얼리버드 좌석이 곧 마감됩니다",
  ctaSubtitle: "한정 수량 얼리버드 티켓으로 정가 대비 30% 혜택을 누려보세요. 좌석은 선착순으로 마감됩니다.",
  ctaButton: "얼리버드 티켓 예매",
});

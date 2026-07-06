import { buildIndustryHome } from '../_shared/industry-home';

/**
 * 비영리 단체 home — rebuilt from the shared industry-home builder (WIX-PERFECT backlog #7).
 * Replaces a 714-line, zero-image lorem skeleton with a distinct, image-rich, palette-driven
 * Wix-grade home page (hero + stats + service cards + feature split + process + testimonial + CTA).
 */
export const nonprofitHomeTemplate = buildIndustryHome({
  id: "nonprofit-home",
  name: "비영리 단체 홈",
  category: "nonprofit",
  description: "투명한 나눔으로 소외된 이웃의 일상을 바꿔갑니다. 당신의 후원이 오늘 누군가의 내일이 됩니다.",
  palette: {
    base: "#143d32",
    surface: "#ffffff",
    surfaceAlt: "#eef4ef",
    ink: "#1b2a24",
    mutedInk: "#5b6b63",
    accent: "#e0892e",
    onAccent: "#1b2a24",
    line: "#dce6e0",
  },
  heroImage: "/images/placeholder-campus.jpg",
  heroImageAlt: "손을 맞잡고 함께 걷는 지역사회 봉사자들과 이웃들",
  heroEyebrow: "TOGETHER FOR CHANGE",
  heroTitle: "작은 손길이 모여\n큰 변화를 만듭니다",
  heroSubtitle: "투명한 나눔으로 소외된 이웃의 일상을 바꿔갑니다. 당신의 후원이 오늘 누군가의 내일이 됩니다.",
  heroPrimaryCta: "지금 후원하기",
  heroSecondaryCta: "활동 살펴보기",
  stats: [
    { value: "12,840명", label: "누적 후원 회원" },
    { value: "94%", label: "사업비 직접 집행률" },
    { value: "38개", label: "지원 중인 지역 사업" },
  ],
  servicesTitle: "함께하는 방법",
  servicesSubtitle: "후원, 봉사, 결연 — 당신에게 맞는 방식으로 변화에 참여하세요.",
  services: [
    { title: "정기후원", desc: "매달 작은 정성이 모여 위기가정과 아동에게 끊김 없는 돌봄을 전합니다.", image: "/images/placeholder-founder.jpg", imageAlt: "후원 약정서에 서명하며 미소 짓는 정기후원자" },
    { title: "자원봉사", desc: "주말 도시락 나눔부터 교육 멘토링까지, 당신의 시간이 곧 든든한 힘이 됩니다.", image: "/images/placeholder-photo-event.jpg", imageAlt: "나눔 행사 현장에서 함께 봉사하는 자원봉사자들" },
    { title: "1:1 결연후원", desc: "한 명의 아이와 직접 연결되어 성장의 순간을 가장 가까이에서 응원합니다.", image: "/images/placeholder-photo-portrait.jpg", imageAlt: "결연 후원으로 돌봄받는 아동의 환한 얼굴" },
  ],
  featureTitle: "투명하게, 끝까지 책임지는 나눔",
  featureBody: "모든 후원금의 흐름을 분기별로 공개하고, 현장 활동가가 직접 전달까지 확인합니다. 외부 회계감사와 연차보고서로 당신의 신뢰에 보답합니다.",
  featureBullets: [
    "분기별 후원금 사용 내역 공개",
    "외부 회계법인 정기 감사",
    "현장 활동가 직접 전달 확인",
  ],
  featureImage: "/images/placeholder-creative-team.jpg",
  featureImageAlt: "현장 사업을 함께 점검하는 활동가와 자원봉사 팀",
  processTitle: "후원은 이렇게 진행됩니다",
  process: [
    { step: "01", title: "후원 신청", desc: "원하는 금액과 후원 방식을 선택해 1분 만에 간편하게 신청합니다." },
    { step: "02", title: "현장 전달", desc: "검증된 대상자에게 활동가가 직접 물품과 지원을 전달합니다." },
    { step: "03", title: "결과 보고", desc: "후원이 만든 변화를 정기 리포트와 감사 편지로 받아보세요." },
  ],
  testimonialQuote: "\"매달 보내주신 후원금이 어디에 쓰였는지 사진과 편지로 확인할 때마다 마음이 따뜻해집니다. 믿고 함께할 수 있는 단체를 만나 정말 다행이에요.\"",
  testimonialAuthor: "김서연",
  testimonialRole: "3년 차 정기후원 회원",
  ctaTitle: "오늘, 변화의 시작이 되어주세요",
  ctaSubtitle: "월 1만 원이면 한 아이의 한 달 식사와 배움을 지킬 수 있습니다. 지금 함께해 주세요.",
  ctaButton: "월 1만 원으로 후원 시작",
});

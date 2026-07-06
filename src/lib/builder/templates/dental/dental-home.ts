import { buildIndustryHome } from '../_shared/industry-home';

/**
 * 치과 home — rebuilt from the shared industry-home builder (WIX-PERFECT backlog #7).
 * Replaces a 714-line, zero-image lorem skeleton with a distinct, image-rich, palette-driven
 * Wix-grade home page (hero + stats + service cards + feature split + process + testimonial + CTA).
 */
export const dentalHomeTemplate = buildIndustryHome({
  id: "dental-home",
  name: "치과 홈",
  category: "dental",
  description: "3D 디지털 정밀진단과 통증을 줄인 진료로, 첫 방문부터 안심할 수 있는 치과를 만듭니다. 지금 편한 시간에 예약하세요.",
  palette: {
    base: "#0e3a40",
    surface: "#ffffff",
    surfaceAlt: "#eef9f9",
    ink: "#0f2c30",
    mutedInk: "#5a767a",
    accent: "#0fb5ba",
    onAccent: "#ffffff",
    line: "#d4e7e7",
  },
  heroImage: "/images/placeholder-health-hero.jpg",
  heroImageAlt: "밝고 청결한 치과 진료실에서 환자를 맞이하는 의료진",
  heroEyebrow: "SMILE & CARE DENTAL",
  heroTitle: "치아 건강의 기준,\n편안한 진료로 완성합니다",
  heroSubtitle: "3D 디지털 정밀진단과 통증을 줄인 진료로, 첫 방문부터 안심할 수 있는 치과를 만듭니다. 지금 편한 시간에 예약하세요.",
  heroPrimaryCta: "진료 예약하기",
  heroSecondaryCta: "진료 안내 보기",
  stats: [
    { value: "20년+", label: "누적 진료 경력" },
    { value: "98%", label: "환자 재방문율" },
    { value: "3D", label: "디지털 정밀진단" },
  ],
  servicesTitle: "한 곳에서 끝내는 전문 치과 진료",
  servicesSubtitle: "예방부터 임플란트, 교정까지. 분야별 전문 의료진이 환자 상태에 맞춰 정확하게 진료합니다.",
  services: [
    { title: "종합 구강검진·예방", desc: "디지털 엑스레이로 충치와 잇몸 상태를 정밀하게 확인하고 맞춤 예방 관리를 제공합니다.", image: "/images/placeholder-nutrition-hero.jpg", imageAlt: "치과 구강검진을 위한 디지털 진단 장비" },
    { title: "임플란트·심미보철", desc: "잃어버린 치아를 자연 치아처럼 회복시키는 정밀 임플란트와 보철 치료를 진행합니다.", image: "/images/placeholder-product-large.jpg", imageAlt: "정밀하게 제작된 임플란트 보철물 클로즈업" },
    { title: "투명교정·심미치료", desc: "눈에 띄지 않는 투명교정과 미백으로 건강하고 자신감 있는 미소를 완성합니다.", image: "/images/placeholder-photo-portrait.jpg", imageAlt: "교정 치료 후 환하게 미소 짓는 환자" },
  ],
  featureTitle: "통증은 줄이고, 신뢰는 더한 진료 환경",
  featureBody: "진료 전 충분한 상담으로 치료 계획을 투명하게 안내하고, 진료마다 멸균 기구와 1인 1소독 시스템을 지켜 안전을 최우선으로 합니다. 편안한 분위기 속에서 치과에 대한 부담을 덜어 드립니다.",
  featureBullets: [
    "철저한 멸균·감염 관리",
    "과잉진료 없는 투명한 상담",
    "통증을 줄인 무痛 마취 시스템",
  ],
  featureImage: "/images/placeholder-office.jpg",
  featureImageAlt: "깨끗하고 아늑하게 꾸며진 치과 대기 및 상담 공간",
  processTitle: "예약부터 치료까지, 이렇게 진행됩니다",
  process: [
    { step: "01", title: "예약·초진 상담", desc: "전화 또는 온라인으로 예약하고 증상과 치료 목표를 충분히 상담합니다." },
    { step: "02", title: "정밀 진단", desc: "3D CT와 디지털 스캔으로 구강 상태를 정확하게 분석합니다." },
    { step: "03", title: "맞춤 치료·관리", desc: "환자에게 맞는 치료 계획을 세우고 치료 후 정기 관리까지 책임집니다." },
  ],
  testimonialQuote: "치과만 가면 늘 긴장했는데, 치료 과정을 하나하나 설명해 주셔서 마음이 놓였어요. 임플란트도 생각보다 아프지 않았고 결과도 정말 자연스럽습니다.",
  testimonialAuthor: "김서연",
  testimonialRole: "임플란트 치료 환자",
  ctaTitle: "건강한 미소, 지금 시작하세요",
  ctaSubtitle: "평일 야간 진료와 주말 진료로 바쁜 일상에도 편하게 방문하실 수 있습니다.",
  ctaButton: "지금 예약하기",
});

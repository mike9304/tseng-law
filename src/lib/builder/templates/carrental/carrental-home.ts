import { buildIndustryHome } from '../_shared/industry-home';

/**
 * 렌터카 home — rebuilt from the shared industry-home builder (WIX-PERFECT backlog #7).
 * Replaces a 714-line, zero-image lorem skeleton with a distinct, image-rich, palette-driven
 * Wix-grade home page (hero + stats + service cards + feature split + process + testimonial + CTA).
 */
export const carrentalHomeTemplate = buildIndustryHome({
  id: "carrental-home",
  name: "렌터카 홈",
  category: "carrental",
  description: "경차부터 SUV·수입차까지 200여 대의 차량을 3분 만에 예약하세요. 보험료 포함 투명 요금과 24시간 무료 출동 서비스를 약속합니다.",
  palette: {
    base: "#0f172a",
    surface: "#ffffff",
    surfaceAlt: "#f1f5f9",
    ink: "#0f172a",
    mutedInk: "#475569",
    accent: "#ea580c",
    onAccent: "#ffffff",
    line: "#e2e8f0",
  },
  heroImage: "/images/placeholder-hero.jpg",
  heroImageAlt: "도심 도로 위를 달리는 렌터카",
  heroEyebrow: "PREMIUM CAR RENTAL",
  heroTitle: "필요한 순간,\n바로 출발하는 렌터카",
  heroSubtitle: "경차부터 SUV·수입차까지 200여 대의 차량을 3분 만에 예약하세요. 보험료 포함 투명 요금과 24시간 무료 출동 서비스를 약속합니다.",
  heroPrimaryCta: "지금 예약하기",
  heroSecondaryCta: "실시간 요금 보기",
  stats: [
    { value: "200+", label: "보유 차량" },
    { value: "3분", label: "평균 예약 완료" },
    { value: "98%", label: "재이용 고객 만족도" },
  ],
  servicesTitle: "목적에 딱 맞는 렌터카",
  servicesSubtitle: "하루 출장부터 장기 운행까지, 합리적인 요금으로 골라 타세요.",
  services: [
    { title: "단기 렌트", desc: "여행·출장·주말 나들이까지 하루 단위로 자유롭게 빌리는 가성비 렌트입니다.", image: "/images/placeholder-product-large.jpg", imageAlt: "단기 렌트용 준중형 차량" },
    { title: "월·장기 렌트", desc: "1개월 이상 이용 시 최대 40% 할인된 월정액으로 부담 없이 내 차처럼 운행하세요.", image: "/images/placeholder-product-1.jpg", imageAlt: "장기 렌트용 SUV" },
    { title: "공항 픽업·딜리버리", desc: "원하는 시간·장소로 차량을 가져다드리고 다시 수거하는 무인 비대면 인도 서비스입니다.", image: "/images/placeholder-product-2.jpg", imageAlt: "공항에서 인도되는 렌터카" },
  ],
  featureTitle: "예약부터 반납까지, 가장 쉬운 렌터카",
  featureBody: "전국 32개 지점과 모바일 앱으로 언제 어디서나 차를 빌리고 반납할 수 있습니다. 모든 차량은 자차·대인·대물 보험이 기본 포함되며, 출고 전 32개 항목 안전 점검을 마칩니다.",
  featureBullets: [
    "보험료 포함 투명 정찰 요금",
    "전국 32개 지점 즉시 픽업·반납",
    "24시간 무료 긴급출동 지원",
  ],
  featureImage: "/images/placeholder-office.jpg",
  featureImageAlt: "렌터카 영업소 인도 카운터",
  processTitle: "3단계로 끝나는 예약",
  process: [
    { step: "01", title: "차량 선택", desc: "이용 날짜와 지점을 고르면 예약 가능한 차종과 실시간 요금이 한눈에 표시됩니다." },
    { step: "02", title: "간편 결제", desc: "운전면허 등록과 카드 결제까지 모바일에서 3분 만에 끝낼 수 있습니다." },
    { step: "03", title: "픽업 & 출발", desc: "예약 시간에 지점에서 키를 받거나, 원하는 장소로 차량을 받아 바로 출발하세요." },
  ],
  testimonialQuote: "출장 때마다 이용하는데 차량 상태가 항상 새 차 같고, 보험까지 포함된 요금이라 추가 비용 걱정이 없어요. 앱 예약이 정말 빠르고 편합니다.",
  testimonialAuthor: "김도윤",
  testimonialRole: "중소기업 영업팀 차장",
  ctaTitle: "지금 예약하고 바로 출발하세요",
  ctaSubtitle: "신규 가입 시 첫 대여 20% 할인 쿠폰을 드립니다. 원하는 차량은 빠르게 마감되니 서두르세요.",
  ctaButton: "차량 예약하기",
});

import { buildIndustryHome } from '../_shared/industry-home';

/**
 * 웨딩 home — rebuilt from the shared industry-home builder (WIX-PERFECT backlog #7).
 * Replaces a 714-line, zero-image lorem skeleton with a distinct, image-rich, palette-driven
 * Wix-grade home page (hero + stats + service cards + feature split + process + testimonial + CTA).
 */
export const weddingHomeTemplate = buildIndustryHome({
  id: "wedding-home",
  name: "웨딩 홈",
  category: "wedding",
  description: "기획부터 본식 스냅, 앨범까지 한 팀이 함께합니다. 두 분의 결이 그대로 남도록 디렉팅하는 부티크 웨딩 스튜디오입니다.",
  palette: {
    base: "#2e2127",
    surface: "#ffffff",
    surfaceAlt: "#faf3ef",
    ink: "#2b2226",
    mutedInk: "#6f6168",
    accent: "#9c4f4a",
    onAccent: "#ffffff",
    line: "#ece1db",
  },
  heroImage: "/images/placeholder-photo-wedding.jpg",
  heroImageAlt: "햇살이 비치는 예식장에서 마주 본 신랑과 신부",
  heroEyebrow: "WEDDING ATELIER",
  heroTitle: "단 하루를\n평생의 장면으로",
  heroSubtitle: "기획부터 본식 스냅, 앨범까지 한 팀이 함께합니다. 두 분의 결이 그대로 남도록 디렉팅하는 부티크 웨딩 스튜디오입니다.",
  heroPrimaryCta: "상담 예약하기",
  heroSecondaryCta: "포트폴리오 보기",
  stats: [
    { value: "1,200+", label: "함께한 웨딩" },
    { value: "98%", label: "추천·재의뢰율" },
    { value: "5개월", label: "평균 예약 마감" },
  ],
  servicesTitle: "두 분에게 맞춘 웨딩 패키지",
  servicesSubtitle: "기획, 촬영, 화보까지 — 필요한 부분만 골라 담으셔도 좋습니다.",
  services: [
    { title: "풀 웨딩 디렉팅", desc: "식장 선정과 일정 조율부터 당일 진행까지 전담 플래너가 처음부터 끝까지 함께합니다.", image: "/images/placeholder-photo-wedding.jpg", imageAlt: "버진로드를 함께 걷는 신랑과 신부" },
    { title: "본식 스냅 촬영", desc: "식전 준비부터 2부까지, 연출 없이 흐르는 진짜 순간을 두 명의 작가가 담아냅니다.", image: "/images/placeholder-photo-event.jpg", imageAlt: "하객들 사이에서 행복하게 웃는 신부" },
    { title: "웨딩 화보·데이트 스냅", desc: "두 분만의 분위기를 살린 컨셉으로 결혼 전 가장 설레는 시간을 화보로 남겨 드립니다.", image: "/images/placeholder-photo-portrait.jpg", imageAlt: "노을빛 아래 다정하게 마주 본 예비 부부" },
  ],
  featureTitle: "사진 한 장에도 두 분의 이야기가 흐르도록",
  featureBody: "우리는 정해진 포즈를 찍지 않습니다. 긴장을 풀어 주는 자연스러운 디렉팅으로 표정과 공기까지 담고, 셀렉부터 보정·앨범 제작까지 한 팀이 책임집니다. 결혼식이 끝난 뒤 펼쳐 볼 때 그날의 온도가 그대로 떠오르는, 오래도록 곁에 두고 싶은 결과물을 만듭니다.",
  featureBullets: [
    "보정 컷 평균 300장 이상 제공",
    "48시간 내 미리보기 셀렉 전달",
    "수작업 프리미엄 앨범 제작",
  ],
  featureImage: "/images/placeholder-portfolio-teaser.jpg",
  featureImageAlt: "스튜디오에서 촬영한 웨딩 포트폴리오 화보",
  processTitle: "상담부터 앨범까지, 이렇게 진행됩니다",
  process: [
    { step: "01", title: "상담 & 견적", desc: "원하시는 분위기와 예산을 듣고 두 분께 맞는 패키지와 일정을 함께 설계합니다." },
    { step: "02", title: "촬영 & 디렉팅", desc: "리허설과 본식 당일, 전담 작가와 플래너가 편안한 분위기 속에서 모든 순간을 담습니다." },
    { step: "03", title: "셀렉 & 앨범 제작", desc: "미리보기로 컷을 함께 고르고 정성껏 보정한 뒤 앨범과 원본을 전달해 드립니다." },
  ],
  testimonialQuote: "예민해지기 쉬운 당일에 작가님이 먼저 농담을 건네 주셔서 긴장이 풀렸어요. 연출 없이 찍었다는데 표정이 너무 자연스러워서, 앨범을 받고 둘 다 한참을 울었습니다. 셀렉도 이틀 만에 와서 깜짝 놀랐어요.",
  testimonialAuthor: "김서연",
  testimonialRole: "2025년 4월의 신부",
  ctaTitle: "두 분의 날짜, 아직 비어 있을 때 잡으세요",
  ctaSubtitle: "성수기 주말은 빠르게 마감됩니다. 원하시는 날짜와 분위기를 남겨 주시면 24시간 내에 맞춤 견적을 보내 드립니다.",
  ctaButton: "무료 상담 신청",
});

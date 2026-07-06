import { buildIndustryHome } from '../_shared/industry-home';

/**
 * 이벤트 기획 home — rebuilt from the shared industry-home builder (WIX-PERFECT backlog #7).
 * Replaces a 714-line, zero-image lorem skeleton with a distinct, image-rich, palette-driven
 * Wix-grade home page (hero + stats + service cards + feature split + process + testimonial + CTA).
 */
export const eventplannerHomeTemplate = buildIndustryHome({
  id: "eventplanner-home",
  name: "이벤트 기획 홈",
  category: "eventplanner",
  description: "웨딩부터 기업 행사, 프라이빗 파티까지. 콘셉트 기획과 현장 연출, 당일 운영까지 한 팀이 끝까지 책임집니다.",
  palette: {
    base: "#2b1b2e",
    surface: "#ffffff",
    surfaceAlt: "#fff6f0",
    ink: "#241c22",
    mutedInk: "#6f6470",
    accent: "#c0392b",
    onAccent: "#ffffff",
    line: "#f0e3da",
  },
  heroImage: "/images/placeholder-photo-event.jpg",
  heroImageAlt: "조명과 꽃으로 화사하게 연출된 행사장에서 손님들이 즐기는 모습",
  heroEyebrow: "EVENT PLANNING STUDIO",
  heroTitle: "잊지 못할 순간을\n완벽하게 기획합니다",
  heroSubtitle: "웨딩부터 기업 행사, 프라이빗 파티까지. 콘셉트 기획과 현장 연출, 당일 운영까지 한 팀이 끝까지 책임집니다.",
  heroPrimaryCta: "무료 견적 요청",
  heroSecondaryCta: "포트폴리오 보기",
  stats: [
    { value: "850+", label: "성공적으로 마친 행사" },
    { value: "12년", label: "이벤트 기획 경력" },
    { value: "98%", label: "고객 재의뢰·추천율" },
  ],
  servicesTitle: "이런 행사를 만듭니다",
  servicesSubtitle: "규모와 예산에 맞춰 콘셉트부터 현장 운영까지 맞춤 설계해 드립니다.",
  services: [
    { title: "웨딩 & 스몰웨딩", desc: "두 사람의 이야기를 담은 콘셉트로 식순, 데코, 진행까지 완성합니다.", image: "/images/placeholder-photo-wedding.jpg", imageAlt: "꽃 장식과 따뜻한 조명으로 꾸며진 웨딩 연회장" },
    { title: "기업 & 브랜드 행사", desc: "신제품 론칭, 컨퍼런스, 시상식을 브랜드 톤에 맞춰 기획·운영합니다.", image: "/images/placeholder-music-hero.jpg", imageAlt: "무대 조명이 켜진 기업 행사장 전경" },
    { title: "프라이빗 파티 & 기념일", desc: "생일, 돌잔치, 기념 파티를 감각적인 연출로 특별하게 채웁니다.", image: "/images/placeholder-creative-hero.jpg", imageAlt: "풍선과 디저트 테이블로 장식된 프라이빗 파티 공간" },
  ],
  featureTitle: "왜 우리와 함께해야 할까요",
  featureBody: "아이디어 회의부터 행사가 끝나는 순간까지, 전담 기획자가 모든 디테일을 직접 챙겨 고객은 그날을 온전히 즐기기만 하면 됩니다.",
  featureBullets: [
    "전담 기획자 1:1 밀착 진행",
    "검증된 협력 업체 네트워크",
    "당일 현장 운영·돌발 상황 케어",
  ],
  featureImage: "/images/placeholder-creative-team.jpg",
  featureImageAlt: "행사 콘셉트를 함께 논의하는 이벤트 기획 팀",
  processTitle: "진행 과정",
  process: [
    { step: "01", title: "상담 & 견적", desc: "원하는 행사와 예산을 듣고 맞춤 기획안과 견적을 제안합니다." },
    { step: "02", title: "콘셉트 & 준비", desc: "콘셉트를 확정하고 장소, 데코, 협력 업체를 빈틈없이 준비합니다." },
    { step: "03", title: "현장 운영", desc: "행사 당일 진행과 운영을 전담해 완벽한 하루를 완성합니다." },
  ],
  testimonialQuote: "예산은 빠듯했는데 상상 이상으로 멋진 행사를 만들어 주셨어요. 당일 진행까지 꼼꼼히 챙겨 주셔서 저희는 손님들과 즐기기만 했습니다.",
  testimonialAuthor: "김서연",
  testimonialRole: "브랜드 론칭 행사 담당 / 마케팅 매니저",
  ctaTitle: "당신의 특별한 날, 지금 시작하세요",
  ctaSubtitle: "간단한 정보만 남겨 주시면 24시간 안에 맞춤 견적을 보내드립니다.",
  ctaButton: "무료 견적 요청하기",
});

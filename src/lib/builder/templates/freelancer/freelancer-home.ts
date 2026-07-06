import { buildIndustryHome } from '../_shared/industry-home';

/**
 * 프리랜서 home — rebuilt from the shared industry-home builder (WIX-PERFECT backlog #7).
 * Replaces a 714-line, zero-image lorem skeleton with a distinct, image-rich, palette-driven
 * Wix-grade home page (hero + stats + service cards + feature split + process + testimonial + CTA).
 */
export const freelancerHomeTemplate = buildIndustryHome({
  id: "freelancer-home",
  name: "프리랜서 홈",
  category: "freelancer",
  description: "브랜드 전략부터 실제 결과물까지, 대행사보다 빠르고 직접 챙기는 1인 전문가가 프로젝트를 끝까지 책임집니다.",
  palette: {
    base: "#161519",
    surface: "#ffffff",
    surfaceAlt: "#f4f3f8",
    ink: "#1a1820",
    mutedInk: "#615d6e",
    accent: "#5b4bd6",
    onAccent: "#ffffff",
    line: "#e6e3ef",
  },
  heroImage: "/images/placeholder-founder.jpg",
  heroImageAlt: "노트북 앞에서 작업하는 프리랜서 전문가",
  heroEyebrow: "FREELANCE CONSULTANT",
  heroTitle: "혼자가 아니라\n전담 파트너로 일합니다",
  heroSubtitle: "브랜드 전략부터 실제 결과물까지, 대행사보다 빠르고 직접 챙기는 1인 전문가가 프로젝트를 끝까지 책임집니다.",
  heroPrimaryCta: "프로젝트 의뢰하기",
  heroSecondaryCta: "작업 사례 보기",
  stats: [
    { value: "80+", label: "완료한 프로젝트" },
    { value: "98%", label: "재의뢰·추천 비율" },
    { value: "9년", label: "현업 경력" },
  ],
  servicesTitle: "이런 일을 함께합니다",
  servicesSubtitle: "필요한 만큼만, 군더더기 없이. 프로젝트 규모에 맞춰 유연하게 진행합니다.",
  services: [
    { title: "브랜드·전략 컨설팅", desc: "포지셔닝과 메시지를 정리해 비즈니스의 방향을 명확하게 잡아 드립니다.", image: "/images/placeholder-portfolio-teaser.jpg", imageAlt: "브랜드 전략 작업 자료" },
    { title: "웹·랜딩 제작", desc: "기획부터 디자인, 개발까지 한 사람이 맡아 전환되는 웹사이트를 만듭니다.", image: "/images/placeholder-product-screenshot.png", imageAlt: "완성된 웹사이트 화면" },
    { title: "콘텐츠·운영 지원", desc: "꾸준히 굴러가는 콘텐츠와 채널 운영을 옆에서 함께 챙겨 드립니다.", image: "/images/placeholder-creative-team.jpg", imageAlt: "콘텐츠 협업 작업 모습" },
  ],
  featureTitle: "왜 1인 전문가와 일할까요",
  featureBody: "담당자가 바뀌지 않고, 중간 마진과 불필요한 회의가 없습니다. 의뢰부터 납품까지 같은 사람이 책임지기 때문에 더 빠르고 정확하게 소통할 수 있습니다.",
  featureBullets: [
    "대표가 직접 작업하고 응대",
    "투명한 견적과 명확한 일정",
    "납품 후에도 이어지는 지원",
  ],
  featureImage: "/images/placeholder-office.jpg",
  featureImageAlt: "집중해서 작업 중인 1인 작업 공간",
  processTitle: "진행 방식",
  process: [
    { step: "01", title: "무료 상담", desc: "목표와 예산, 일정을 듣고 프로젝트 방향과 범위를 함께 정리합니다." },
    { step: "02", title: "제안·계약", desc: "투명한 견적과 단계별 일정이 담긴 제안서를 드리고 합의 후 시작합니다." },
    { step: "03", title: "작업·납품", desc: "중간 공유로 방향을 맞춰 가며 완성하고 납품 후 안정화까지 지원합니다." },
  ],
  testimonialQuote: "대행사 세 곳과 일해 봤지만, 직접 챙겨 주시는 속도와 디테일이 완전히 달랐어요. 다음 프로젝트도 무조건 함께합니다.",
  testimonialAuthor: "김서연",
  testimonialRole: "라움 스튜디오 대표",
  ctaTitle: "지금 진행 중인 고민, 같이 풀어볼까요",
  ctaSubtitle: "간단한 프로젝트 소개만 보내 주시면 1영업일 안에 방향과 예상 견적을 회신드립니다.",
  ctaButton: "상담 신청하기",
});

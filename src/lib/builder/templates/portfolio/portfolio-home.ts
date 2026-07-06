import { buildIndustryHome } from '../_shared/industry-home';

/**
 * 포트폴리오 home — rebuilt from the shared industry-home builder (WIX-PERFECT backlog #7).
 * Replaces a 714-line, zero-image lorem skeleton with a distinct, image-rich, palette-driven
 * Wix-grade home page (hero + stats + service cards + feature split + process + testimonial + CTA).
 */
export const portfolioHomeTemplate = buildIndustryHome({
  id: "portfolio-home",
  name: "포트폴리오 홈",
  category: "portfolio",
  description: "브랜딩부터 편집, 모션까지. 작은 디테일이 브랜드의 인상을 바꾼다고 믿으며 8년째 작업하고 있습니다.",
  palette: {
    base: "#111113",
    surface: "#ffffff",
    surfaceAlt: "#f4f2ef",
    ink: "#16161a",
    mutedInk: "#5f5f67",
    accent: "#d2502a",
    onAccent: "#ffffff",
    line: "#e4e1dc",
  },
  heroImage: "/images/placeholder-creative-hero.jpg",
  heroImageAlt: "어두운 작업실 책상 위에 펼쳐진 디자인 작업물과 스케치",
  heroEyebrow: "SELECTED WORK",
  heroTitle: "브랜드의 첫인상을\n설계하는 디자이너",
  heroSubtitle: "브랜딩부터 편집, 모션까지. 작은 디테일이 브랜드의 인상을 바꾼다고 믿으며 8년째 작업하고 있습니다.",
  heroPrimaryCta: "작업 보기",
  heroSecondaryCta: "소개 보기",
  stats: [
    { value: "8년", label: "디자인 경력" },
    { value: "120+", label: "완료한 프로젝트" },
    { value: "96%", label: "재의뢰·추천율" },
  ],
  servicesTitle: "제가 하는 일",
  servicesSubtitle: "브랜드의 결을 찾고, 그것을 보이는 형태로 만드는 세 가지 작업입니다.",
  services: [
    { title: "브랜드 아이덴티티", desc: "로고, 컬러, 타이포까지 브랜드의 성격을 일관된 시각 언어로 정리해 드립니다.", image: "/images/placeholder-product-large.jpg", imageAlt: "정돈된 브랜드 아이덴티티 가이드와 로고 시안" },
    { title: "편집·에디토리얼 디자인", desc: "브로슈어, 룩북, 포트폴리오 등 읽는 흐름까지 고려한 인쇄·웹 편집물을 만듭니다.", image: "/images/placeholder-featured-article.jpg", imageAlt: "펼쳐진 에디토리얼 잡지의 레이아웃 지면" },
    { title: "모션·인터랙션", desc: "로고 모션과 짧은 영상으로 정적인 브랜드에 움직임과 리듬을 더합니다.", image: "/images/placeholder-creative-team.jpg", imageAlt: "모션 디자인 작업 중인 화면과 협업 장면" },
  ],
  featureTitle: "왜 저와 함께 작업할까요",
  featureBody: "저는 트렌드를 따라가기보다, 그 브랜드만의 이야기를 오래 들여다보는 방식으로 작업합니다. 한 명의 디자이너가 처음부터 끝까지 책임지기에 결이 흐트러지지 않고, 작은 수정 하나에도 빠르게 반응합니다.",
  featureBullets: [
    "기획부터 마감까지 1:1 직접 작업",
    "브랜드 결을 지키는 일관된 디테일",
    "빠른 피드백과 유연한 수정",
  ],
  featureImage: "/images/placeholder-portfolio-teaser.jpg",
  featureImageAlt: "벽에 정돈되어 걸린 다양한 포트폴리오 작업물",
  processTitle: "작업은 이렇게 진행됩니다",
  process: [
    { step: "01", title: "대화와 리서치", desc: "브랜드가 처한 상황과 목표를 충분히 듣고 방향의 기준을 함께 정합니다." },
    { step: "02", title: "시안과 다듬기", desc: "핵심 콘셉트를 시안으로 보여 드리고 피드백을 받아 디테일을 조율합니다." },
    { step: "03", title: "전달과 가이드", desc: "최종 파일과 사용 가이드를 정리해 어디서든 일관되게 쓸 수 있도록 넘겨 드립니다." },
  ],
  testimonialQuote: "막연했던 브랜드 방향이 첫 미팅 한 번으로 또렷해졌어요. 로고부터 패키지까지 결이 하나로 이어져서, 고객들이 먼저 '브랜드가 바뀌었네요'라고 말해줍니다.",
  testimonialAuthor: "정유진",
  testimonialRole: "코코로스트 대표",
  ctaTitle: "지금 진행 중인 프로젝트가 있으신가요?",
  ctaSubtitle: "간단한 소개와 일정만 남겨 주시면 2일 안에 회신드립니다. 작은 문의도 환영합니다.",
  ctaButton: "프로젝트 문의하기",
});

import { buildIndustryHome } from '../_shared/industry-home';

/**
 * SaaS 제품 home — rebuilt from the shared industry-home builder (WIX-PERFECT backlog #7).
 * Replaces a 714-line, zero-image lorem skeleton with a distinct, image-rich, palette-driven
 * Wix-grade home page (hero + stats + service cards + feature split + process + testimonial + CTA).
 */
export const saasHomeTemplate = buildIndustryHome({
  id: "saas-home",
  name: "SaaS 제품 홈",
  category: "saas",
  description: "데이터 연동부터 자동화, 협업까지 한곳에서. 팀이 더 빠르게 결정하고 실행하도록 돕는 올인원 워크스페이스입니다.",
  palette: {
    base: "#0b1020",
    surface: "#ffffff",
    surfaceAlt: "#f4f6fb",
    ink: "#0f1729",
    mutedInk: "#5b6577",
    accent: "#2563eb",
    onAccent: "#ffffff",
    line: "#e3e8f1",
  },
  heroImage: "/images/placeholder-product-screenshot.png",
  heroImageAlt: "실시간 데이터를 보여주는 제품 대시보드 화면",
  heroEyebrow: "FOR MODERN TEAMS",
  heroTitle: "흩어진 업무를\n하나의 화면에서",
  heroSubtitle: "데이터 연동부터 자동화, 협업까지 한곳에서. 팀이 더 빠르게 결정하고 실행하도록 돕는 올인원 워크스페이스입니다.",
  heroPrimaryCta: "무료로 시작하기",
  heroSecondaryCta: "제품 데모 보기",
  stats: [
    { value: "32%", label: "도입 후 평균 업무 시간 절감" },
    { value: "99.98%", label: "지난 12개월 서비스 가동률" },
    { value: "4시간", label: "팀 온보딩 완료 평균 소요" },
  ],
  servicesTitle: "하나의 플랫폼, 세 가지 핵심",
  servicesSubtitle: "분산된 도구를 오가지 않아도 팀의 모든 업무가 매끄럽게 이어집니다.",
  services: [
    { title: "실시간 대시보드", desc: "흩어진 지표를 한 화면에 모아 누구나 데이터를 바로 읽고 의사결정할 수 있습니다.", image: "/images/placeholder-product-1.jpg", imageAlt: "실시간 지표 대시보드 화면" },
    { title: "자동화 워크플로", desc: "반복 업무를 코드 없이 규칙으로 연결해 사람이 할 일에만 집중하게 합니다.", image: "/images/placeholder-product-2.jpg", imageAlt: "자동화 워크플로 편집 화면" },
    { title: "협업·권한 관리", desc: "팀별 역할과 접근 권한을 세밀하게 설정해 안전하게 함께 일합니다.", image: "/images/placeholder-product-3.jpg", imageAlt: "팀 협업과 권한 설정 화면" },
  ],
  featureTitle: "도구를 바꾸지 말고, 연결하세요",
  featureBody: "이미 쓰고 있는 슬랙, 노션, 깃허브, 구글 워크스페이스를 그대로 연동해 업무 맥락을 한곳으로 모읍니다. 데이터는 실시간으로 동기화되고, 엔터프라이즈 보안 표준을 충족해 도입 첫날부터 안심하고 확장할 수 있습니다.",
  featureBullets: [
    "코드 없이 업무 자동화",
    "SSO·SAML 보안 로그인",
    "실시간 양방향 동기화",
  ],
  featureImage: "/images/placeholder-product-large.jpg",
  featureImageAlt: "여러 협업 도구가 연동된 통합 제품 화면",
  processTitle: "3단계면 충분합니다",
  process: [
    { step: "01", title: "가입하고 도구 연동", desc: "이메일 한 번으로 가입하고 쓰던 도구를 클릭 몇 번에 연결합니다." },
    { step: "02", title: "팀 초대와 설정", desc: "팀원을 초대하고 역할과 워크플로를 우리 팀에 맞게 구성합니다." },
    { step: "03", title: "인사이트와 확장", desc: "쌓인 데이터로 더 나은 결정을 내리고 필요에 맞춰 자유롭게 확장합니다." },
  ],
  testimonialQuote: "도입 한 달 만에 주간 리포트 작성 시간이 절반으로 줄었습니다. 흩어져 있던 지표가 한 화면에 모이니 회의가 빨라지고, 팀이 같은 숫자를 보며 일하게 됐어요.",
  testimonialAuthor: "김도현",
  testimonialRole: "렌즈테크 프로덕트 리드",
  ctaTitle: "팀의 속도를 바꿀 시간입니다",
  ctaSubtitle: "14일 무료 체험으로 카드 등록 없이 모든 기능을 직접 확인해 보세요.",
  ctaButton: "무료 체험 시작하기",
});

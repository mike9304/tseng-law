import { buildIndustryHome } from '../_shared/industry-home';

/**
 * 요가 스튜디오 home — rebuilt from the shared industry-home builder (WIX-PERFECT backlog #7).
 * Replaces a 714-line, zero-image lorem skeleton with a distinct, image-rich, palette-driven
 * Wix-grade home page (hero + stats + service cards + feature split + process + testimonial + CTA).
 */
export const yogaHomeTemplate = buildIndustryHome({
  id: "yoga-home",
  name: "요가 스튜디오 홈",
  category: "yoga",
  description: "소규모 정원제 클래스와 따뜻한 지도자가 함께합니다. 처음 매트를 펴는 분도 편안하게 시작할 수 있어요.",
  palette: {
    base: "#2f3a2e",
    surface: "#ffffff",
    surfaceAlt: "#f3f1ea",
    ink: "#2a2b26",
    mutedInk: "#6b6f63",
    accent: "#5d6f44",
    onAccent: "#ffffff",
    line: "#e3e0d6",
  },
  heroImage: "/images/placeholder-health-hero.jpg",
  heroImageAlt: "아침 햇살이 드는 스튜디오에서 매트 위에 앉아 호흡을 가다듬는 수련자",
  heroEyebrow: "BREATHE · MOVE · REST",
  heroTitle: "숨을 고르는 시간,\n오늘의 나를 위한 요가",
  heroSubtitle: "소규모 정원제 클래스와 따뜻한 지도자가 함께합니다. 처음 매트를 펴는 분도 편안하게 시작할 수 있어요.",
  heroPrimaryCta: "무료 체험 예약하기",
  heroSecondaryCta: "시간표 보기",
  stats: [
    { value: "12명", label: "클래스당 정원제 소수 수업" },
    { value: "주 40+", label: "새벽·저녁 운영 클래스" },
    { value: "8년", label: "누적 지도 경력의 강사진" },
  ],
  servicesTitle: "나에게 맞는 수련을 찾으세요",
  servicesSubtitle: "체력과 컨디션, 목표에 따라 단계별로 구성한 클래스를 제공합니다.",
  services: [
    { title: "빈야사 플로우", desc: "호흡에 맞춰 동작을 부드럽게 연결하며 체력과 유연성을 함께 기르는 다이내믹 클래스입니다.", image: "/images/placeholder-health-hero.jpg", imageAlt: "호흡에 맞춰 흐르듯 자세를 이어가는 빈야사 수련 모습" },
    { title: "인요가 & 이완", desc: "한 자세를 오래 머물며 깊은 이완과 회복을 돕는, 하루의 긴장을 풀어 주는 느린 수련입니다.", image: "/images/placeholder-nutrition-hero.jpg", imageAlt: "볼스터에 몸을 기대 깊게 이완하는 인요가 자세" },
    { title: "1:1 프라이빗", desc: "체형과 목표를 분석해 강사가 맞춤 시퀀스를 설계하는 개인 집중 레슨입니다.", image: "/images/placeholder-photo-portrait.jpg", imageAlt: "강사가 수련자의 자세를 가까이에서 교정해 주는 프라이빗 레슨" },
  ],
  featureTitle: "처음이어도, 혼자가 아니에요",
  featureBody: "유연하지 않아도 괜찮습니다. 모든 클래스는 수준별 변형 동작을 안내하고, 강사가 한 분 한 분의 호흡과 자세를 세심하게 살핍니다. 매트와 도구는 모두 준비되어 있으니 편한 마음으로 오시면 됩니다.",
  featureBullets: [
    "수준별 변형 동작 안내",
    "매트·블록·볼스터 무료 대여",
    "샤워실과 라커룸 완비",
  ],
  featureImage: "/images/placeholder-nutrition-hero.jpg",
  featureImageAlt: "자연광이 가득한 스튜디오에서 강사의 안내를 따라 자세를 잡는 초보 수련자",
  processTitle: "첫 수련까지 세 걸음",
  process: [
    { step: "01", title: "클래스 예약", desc: "원하는 시간의 클래스를 온라인으로 간편하게 예약하세요." },
    { step: "02", title: "편안하게 방문", desc: "수업 10분 전 도착해 매트와 도구를 받고 마음을 가다듬습니다." },
    { step: "03", title: "호흡과 함께 수련", desc: "강사의 안내를 따라 내 몸의 속도에 맞춰 수련을 마칩니다." },
  ],
  testimonialQuote: "목과 어깨가 늘 뭉쳐 있었는데, 인요가 클래스를 다닌 지 두 달 만에 몸이 한결 가벼워졌어요. 강사님이 자세를 꼼꼼히 봐 주셔서 운동을 처음 하는 저도 안심하고 따라갈 수 있었습니다.",
  testimonialAuthor: "김서연",
  testimonialRole: "인요가 회원 · 직장인",
  ctaTitle: "오늘, 첫 매트를 펴 보세요",
  ctaSubtitle: "무료 체험 클래스로 우리 스튜디오의 분위기를 직접 느껴 보세요. 부담 없이 시작할 수 있습니다.",
  ctaButton: "무료 체험 신청",
});

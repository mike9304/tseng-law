import { buildIndustryHome } from '../_shared/industry-home';

/**
 * 팟캐스트 home — rebuilt from the shared industry-home builder (WIX-PERFECT backlog #7).
 * Replaces a 714-line, zero-image lorem skeleton with a distinct, image-rich, palette-driven
 * Wix-grade home page (hero + stats + service cards + feature split + process + testimonial + CTA).
 */
export const podcastHomeTemplate = buildIndustryHome({
  id: "podcast-home",
  name: "팟캐스트 홈",
  category: "podcast",
  description: "출퇴근길 30분, 일과 삶과 사람에 대한 솔직한 이야기를 전합니다. 지금 구독하고 새 에피소드를 가장 먼저 들어보세요.",
  palette: {
    base: "#1c1033",
    surface: "#ffffff",
    surfaceAlt: "#f7f4fb",
    ink: "#211a36",
    mutedInk: "#6b6280",
    accent: "#b16cff",
    onAccent: "#1a0f2e",
    line: "#e7dff2",
  },
  heroImage: "/images/placeholder-music-hero.jpg",
  heroImageAlt: "보라빛 조명 아래 마이크 앞에서 녹음 중인 팟캐스트 진행자",
  heroEyebrow: "NEW EPISODE EVERY THURSDAY",
  heroTitle: "매주 목요일,\n귀로 듣는 깊은 대화",
  heroSubtitle: "출퇴근길 30분, 일과 삶과 사람에 대한 솔직한 이야기를 전합니다. 지금 구독하고 새 에피소드를 가장 먼저 들어보세요.",
  heroPrimaryCta: "무료로 구독하기",
  heroSecondaryCta: "최신 에피소드 듣기",
  stats: [
    { value: "180+", label: "공개된 에피소드" },
    { value: "47만", label: "월간 다운로드" },
    { value: "4.9★", label: "애플 팟캐스트 평점" },
  ],
  servicesTitle: "이번 주에 들을 만한 코너",
  servicesSubtitle: "고정 코너부터 단독 인터뷰까지, 매주 새로운 이야기가 채널을 채웁니다.",
  services: [
    { title: "게스트 단독 인터뷰", desc: "각 분야 최고의 전문가와 크리에이터를 초대해 60분간 깊이 있는 대화를 나눕니다.", image: "/images/placeholder-author.jpg", imageAlt: "인터뷰 게스트가 헤드폰을 쓰고 이야기하는 모습" },
    { title: "이번 주 라이브 토크", desc: "두 진행자가 한 주의 화제를 자유롭게 풀어내는 시그니처 수다 코너입니다.", image: "/images/placeholder-creative-hero.jpg", imageAlt: "스튜디오에서 마주 앉아 대화하는 두 진행자" },
    { title: "청취자 사연 읽기", desc: "여러분이 보내준 고민과 이야기를 함께 읽고 진심으로 답해드립니다.", image: "/images/placeholder-founder.jpg", imageAlt: "사연을 읽으며 미소 짓는 진행자의 모습" },
  ],
  featureTitle: "어디서 듣든, 끊김 없이",
  featureBody: "애플 팟캐스트, 스포티파이, 유튜브까지 원하는 플랫폼에서 자유롭게 들으세요. 구독해 두면 매주 새 에피소드가 자동으로 도착하고, 놓친 회차도 전체 아카이브에서 언제든 다시 들을 수 있습니다.",
  featureBullets: [
    "주요 플랫폼 전체 지원",
    "다운로드 후 오프라인 청취",
    "광고 없는 멤버십 제공",
  ],
  featureImage: "/images/placeholder-creative-team.jpg",
  featureImageAlt: "녹음 장비가 놓인 스튜디오에서 함께 작업하는 제작진",
  processTitle: "구독은 3단계면 충분해요",
  process: [
    { step: "01", title: "플랫폼 선택", desc: "애플 팟캐스트, 스포티파이, 유튜브 중 즐겨 쓰는 앱을 고르세요." },
    { step: "02", title: "구독 버튼 누르기", desc: "채널 페이지에서 구독을 누르면 모든 설정이 끝납니다." },
    { step: "03", title: "새 회차 자동 수신", desc: "매주 목요일, 새 에피소드가 알아서 도착합니다." },
  ],
  testimonialQuote: "출근길마다 챙겨 듣는데, 게스트 인터뷰는 매번 메모하게 돼요. 가볍게 틀었다가 결국 끝까지 듣게 되는 유일한 팟캐스트입니다.",
  testimonialAuthor: "김지현",
  testimonialRole: "2년 차 구독자 · 마케터",
  ctaTitle: "다음 목요일, 함께 들어요",
  ctaSubtitle: "지금 구독하면 새 에피소드와 청취자 전용 비하인드 소식을 가장 먼저 받아볼 수 있습니다.",
  ctaButton: "지금 구독하기",
});

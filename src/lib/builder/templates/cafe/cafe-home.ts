/**
 * Cafe home — MIGRATED 2026-06-04 from a 554-line hand-hardcoded skeleton to the shared
 * `buildIndustryHome` builder with a token-derived WARM café palette.
 *
 * BEFORE (the false-green smoking gun): hero bg `#123b63` law-navy (×16), cold corporate
 * palette, 0 fontFamily, 0 responsive, AND a ~1,960px "Wix-grade expansion scaffold" of EMPTY
 * placeholder boxes with self-referential meta-copy ("신뢰를 더하는 구성", "Showcase module")
 * + fake metrics — padding node count to look rich. See WIX-DESIGN-FIDELITY-SPEC-2026-06-04.md §3.5.
 *
 * AFTER (verified: 54 nodes ∈ [40,70], qaScore 95, no `#123b63`): genuine image-rich page —
 * hero + trust stats + 3 image service cards + feature split + 3-step + testimonial + CTA.
 * Palette derived from the `local-warm` TEMPLATE_PALETTES key (cream/terracotta); hero `base` =
 * darken(accent #c26f3d, 0.74) ≈ #331d10 so white hero text stays contrast-safe. Real assets only.
 * Full design upgrades (token bridge, image-overlay scrim, serif/sans pairing, responsive) → spec §3.2/§3.2c.
 */
import { buildIndustryHome } from '../_shared/industry-home';

export const cafeHomeTemplate = buildIndustryHome({
  id: 'cafe-home',
  name: '카페 홈',
  category: 'cafe',
  description: '동네에서 가장 따뜻한 한 잔. 직접 로스팅한 원두와 손수 구운 베이커리로 하루를 채웁니다.',
  palette: {
    base: '#331d10',
    surface: '#ffffff',
    surfaceAlt: '#efe1c8',
    ink: '#1f2622',
    mutedInk: '#687169',
    accent: '#c26f3d',
    onAccent: '#ffffff',
    line: '#ddcdb8',
  },
  heroImage: '/images/placeholder-cafe-hero.jpg',
  heroImageAlt: '햇살이 드는 카페 창가와 따뜻한 라떼',
  heroEyebrow: 'SINCE 2014 · 동네 로스터리',
  heroTitle: '천천히 내린\n오늘의 한 잔',
  heroSubtitle: '매일 아침 직접 로스팅한 싱글 오리진과 갓 구운 페이스트리. 머무는 시간까지 정성껏 준비했습니다.',
  heroPrimaryCta: '메뉴 둘러보기',
  heroSecondaryCta: '오시는 길',
  stats: [
    { value: '12종', label: '매일 바뀌는 싱글 오리진' },
    { value: '6:30', label: '이른 아침 오픈' },
    { value: '4.9', label: '단골들이 남긴 평점' },
  ],
  servicesTitle: '느긋하게 머무는 세 가지 시간',
  servicesSubtitle: '아침의 커피 한 잔부터 늦은 오후의 디저트까지, 하루의 결을 따라 준비했습니다.',
  services: [
    { title: '핸드드립 바', desc: '그날의 원두를 바리스타가 한 잔씩 정성껏 내려 드립니다.', image: '/images/placeholder-cafe-interior-1.jpg', imageAlt: '핸드드립을 내리는 바리스타' },
    { title: '데일리 베이커리', desc: '매일 아침 구워내는 크루아상과 스콘, 제철 과일 타르트.', image: '/images/placeholder-coffee-1.jpg', imageAlt: '갓 구운 베이커리와 커피' },
    { title: '오후의 디저트', desc: '계절을 담은 케이크와 어울리는 차 한 잔으로 쉼표를.', image: '/images/placeholder-cafe-interior-2.jpg', imageAlt: '디저트가 놓인 카페 테이블' },
  ],
  featureTitle: '원두는 가까이서, 시간은 느리게',
  featureBody: '농장과 직접 거래한 생두를 매주 소량으로 로스팅합니다. 신선함이 가장 좋은 순간에만 잔에 담아, 머무는 동안의 공기까지 천천히 흐르도록 공간을 다듬었습니다.',
  featureBullets: ['주간 소량 로스팅', '제철 재료 베이커리', '반려동물 동반 가능'],
  featureImage: '/images/placeholder-cafe-story.jpg',
  featureImageAlt: '로스터기와 원두가 놓인 카페 공간',
  processTitle: '한 잔이 나오기까지',
  process: [
    { step: '01', title: '고르기', desc: '오늘의 원두 노트를 보고 취향에 맞는 한 잔을 고릅니다.' },
    { step: '02', title: '내리기', desc: '주문 후 바리스타가 그 자리에서 정성껏 추출합니다.' },
    { step: '03', title: '머물기', desc: '창가 자리에서 책 한 권과 함께 느긋하게 즐깁니다.' },
  ],
  testimonialQuote: '출근 전 들르는 이 집 라떼로 하루를 시작해요. 원두가 매번 다르게 추천돼서 오는 재미가 있어요.',
  testimonialAuthor: '이수민',
  testimonialRole: '5년째 단골',
  ctaTitle: '오늘도 한 잔, 함께하실래요?',
  ctaSubtitle: '평일 아침 6시 30분부터, 주말은 8시부터 문을 엽니다.',
  ctaButton: '예약 없이 들르기',
});

/**
 * Blog/magazine home — MIGRATED 2026-06-04 from a hardcoded law-navy (#123b63 ×13) skeleton to
 * `buildIndustryHome` with a warm editorial palette. Inherits serif/sans pairing + hero scrim.
 * See WIX-DESIGN-FIDELITY-SPEC §3.4.
 */
import { buildIndustryHome } from '../_shared/industry-home';

export const blogHomeTemplate = buildIndustryHome({
  id: 'blog-home',
  name: '블로그 홈',
  category: 'blog',
  description: '천천히 읽을수록 좋은 글. 일상과 생각을 정성껏 적어 나가는 개인 매거진.',
  palette: {
    base: '#1a1a1a', surface: '#ffffff', surfaceAlt: '#f3f1ec', ink: '#1a1a1a',
    mutedInk: '#66645e', accent: '#9a6a3a', onAccent: '#ffffff', line: '#e4e0d6',
  },
  heroImage: '/images/placeholder-article-hero.jpg',
  heroImageAlt: '차분한 책상 위 노트와 커피',
  heroEyebrow: 'WORDS & THOUGHTS',
  heroTitle: '천천히 읽을수록\n좋은 글',
  heroSubtitle: '빠르게 소비되는 글 말고, 오래 곱씹게 되는 글을 적습니다. 일상과 생각을 정성껏 기록합니다.',
  heroPrimaryCta: '최신 글 읽기',
  heroSecondaryCta: '구독하기',
  stats: [
    { value: '320+', label: '쌓아온 글' },
    { value: '주 2회', label: '꾸준한 발행' },
    { value: '8k', label: '함께 읽는 구독자' },
  ],
  servicesTitle: '이런 이야기를 씁니다',
  servicesSubtitle: '카테고리는 달라도, 결국은 더 잘 살아가는 이야기입니다.',
  services: [
    { title: '에세이', desc: '일상에서 길어 올린 생각을 천천히 풀어 씁니다.', image: '/images/placeholder-featured-article.jpg', imageAlt: '에세이 글' },
    { title: '리뷰·기록', desc: '읽고 보고 경험한 것을 솔직하게 기록합니다.', image: '/images/placeholder-article-hero.jpg', imageAlt: '리뷰 기록' },
    { title: '인터뷰', desc: '저마다의 방식으로 살아가는 사람들의 이야기.', image: '/images/placeholder-author.jpg', imageAlt: '인터뷰' },
  ],
  featureTitle: '잘 쓰기보다, 정직하게 씁니다',
  featureBody: '멋진 문장을 흉내 내기보다 솔직한 생각을 담으려 합니다. 한 편을 쓰는 데 오래 걸리더라도, 시간이 지나 다시 읽어도 부끄럽지 않은 글을 남기고 싶습니다.',
  featureBullets: ['주 2회 새 글', '광고 없는 읽기', '뉴스레터 발송'],
  featureImage: '/images/placeholder-featured-article.jpg',
  featureImageAlt: '글을 쓰는 작업 공간',
  processTitle: '함께 읽는 방법',
  process: [
    { step: '01', title: '둘러보기', desc: '관심 가는 카테고리부터 편하게 읽어 보세요.' },
    { step: '02', title: '구독하기', desc: '이메일을 남기면 새 글을 가장 먼저 받아 봅니다.' },
    { step: '03', title: '함께 나누기', desc: '댓글과 답장으로 생각을 나누며 이어 갑니다.' },
  ],
  testimonialQuote: '바쁜 하루 끝에 이 블로그 글 한 편 읽는 게 작은 의식이 됐어요. 꾸밈없이 솔직해서 매번 제 이야기처럼 읽힙니다.',
  testimonialAuthor: '한 구독자',
  testimonialRole: '2년째 구독 중',
  ctaTitle: '다음 글, 함께 읽으실래요?',
  ctaSubtitle: '구독하면 새 글과 비하인드 노트를 메일로 받아 보실 수 있습니다.',
  ctaButton: '구독 신청하기',
});

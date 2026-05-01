import type { Locale } from '@/lib/locales';
import type { ColumnFrontmatter } from '@/lib/builder/columns/types';

export interface BlogAdminCategory {
  slug: string;
  legacyCategory?: 'formation' | 'legal' | 'case';
  color: string;
  label: Record<Locale, string>;
}

export const BLOG_ADMIN_CATEGORIES: BlogAdminCategory[] = [
  {
    slug: 'company-formation',
    legacyCategory: 'formation',
    color: '#3b82f6',
    label: { ko: '회사설립', 'zh-hant': '公司設立', en: 'Company setup' },
  },
  {
    slug: 'traffic-accident',
    color: '#ef4444',
    label: { ko: '교통사고', 'zh-hant': '交通事故', en: 'Traffic accident' },
  },
  {
    slug: 'labor-law',
    color: '#10b981',
    label: { ko: '노동법', 'zh-hant': '勞動法', en: 'Labor law' },
  },
  {
    slug: 'family-law',
    color: '#f59e0b',
    label: { ko: '이혼/가사', 'zh-hant': '離婚家事', en: 'Family law' },
  },
  {
    slug: 'criminal-law',
    legacyCategory: 'case',
    color: '#8b5cf6',
    label: { ko: '형사', 'zh-hant': '刑事', en: 'Criminal' },
  },
  {
    slug: 'inheritance',
    color: '#06b6d4',
    label: { ko: '상속', 'zh-hant': '繼承', en: 'Inheritance' },
  },
  {
    slug: 'general',
    legacyCategory: 'legal',
    color: '#6b7280',
    label: { ko: '일반', 'zh-hant': '一般', en: 'General' },
  },
];

export const BLOG_ADMIN_AUTHORS = [
  {
    id: 'tseng-law-team',
    name: '호정국제 법률사무소',
    title: 'Legal editorial team',
    photo: '',
  },
  {
    id: 'taiwan-business-desk',
    name: '대만 비즈니스 법무팀',
    title: 'Cross-border business counsel',
    photo: '',
  },
  {
    id: 'litigation-desk',
    name: '분쟁대응팀',
    title: 'Litigation and dispute resolution',
    photo: '',
  },
];

export const BLOG_ADMIN_TEMPLATES = [
  {
    id: 'blank',
    title: '빈 글',
    description: '제목과 요약만 만들고 본문은 직접 작성합니다.',
    summary: '',
    bodyHtml: '<p></p>',
    bodyMarkdown: '',
  },
  {
    id: 'company-guide',
    title: '회사설립 가이드',
    description: '절차, 필요 서류, 일정, 실무 체크리스트 중심 구조입니다.',
    summary: '회사설립 절차와 준비 사항을 실무 관점에서 정리합니다.',
    bodyHtml:
      '<h2>핵심 요약</h2><p>회사설립 전 확인해야 할 쟁점을 정리합니다.</p><h2>진행 절차</h2><ul><li>사전 검토</li><li>서류 준비</li><li>등기 및 후속 신고</li></ul><h2>실무 체크포인트</h2><p>일정, 책임자, 필요 자료를 함께 관리합니다.</p>',
    bodyMarkdown:
      '핵심 요약\n\n회사설립 전 확인해야 할 쟁점을 정리합니다.\n\n진행 절차\n- 사전 검토\n- 서류 준비\n- 등기 및 후속 신고\n\n실무 체크포인트\n일정, 책임자, 필요 자료를 함께 관리합니다.',
  },
  {
    id: 'qa',
    title: 'Q&A',
    description: '자주 받는 질문에 짧고 명확하게 답하는 구조입니다.',
    summary: '자주 묻는 법률 질문을 Q&A 형식으로 정리합니다.',
    bodyHtml:
      '<h2>질문</h2><p>상담자가 가장 자주 묻는 질문을 적습니다.</p><h2>답변</h2><p>결론을 먼저 쓰고 필요한 예외를 덧붙입니다.</p><h2>추가 확인 사항</h2><ul><li>사실관계</li><li>서류</li><li>기한</li></ul>',
    bodyMarkdown:
      '질문\n상담자가 가장 자주 묻는 질문을 적습니다.\n\n답변\n결론을 먼저 쓰고 필요한 예외를 덧붙입니다.\n\n추가 확인 사항\n- 사실관계\n- 서류\n- 기한',
  },
  {
    id: 'case-analysis',
    title: '사례 분석',
    description: '사실관계, 쟁점, 대응 전략, 시사점으로 이어지는 구조입니다.',
    summary: '실제 상담 흐름에 가까운 사례 기반 분석 글입니다.',
    bodyHtml:
      '<h2>사실관계</h2><p>사건의 배경과 당사자 관계를 설명합니다.</p><h2>주요 쟁점</h2><ul><li>계약상 의무</li><li>증거 확보</li><li>손해 산정</li></ul><h2>대응 전략</h2><p>초기 대응과 협상, 소송 가능성을 나누어 검토합니다.</p>',
    bodyMarkdown:
      '사실관계\n사건의 배경과 당사자 관계를 설명합니다.\n\n주요 쟁점\n- 계약상 의무\n- 증거 확보\n- 손해 산정\n\n대응 전략\n초기 대응과 협상, 소송 가능성을 나누어 검토합니다.',
  },
];

export function getBlogAdminCategory(slug?: string | null): BlogAdminCategory {
  return BLOG_ADMIN_CATEGORIES.find((category) => category.slug === slug) ?? BLOG_ADMIN_CATEGORIES[6];
}

export function getColumnBlogCategory(frontmatter: ColumnFrontmatter): BlogAdminCategory {
  if (frontmatter.blogCategory) return getBlogAdminCategory(frontmatter.blogCategory);
  return (
    BLOG_ADMIN_CATEGORIES.find((category) => category.legacyCategory === frontmatter.category)
    ?? BLOG_ADMIN_CATEGORIES[6]
  );
}

export function getCategoryLabel(category: BlogAdminCategory, locale: Locale): string {
  return category.label[locale] ?? category.label.ko;
}

export function estimateReadingTime(text: string): number {
  const words = text
    .replace(/<[^>]*>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return Math.max(1, Math.ceil(words.length / 350));
}

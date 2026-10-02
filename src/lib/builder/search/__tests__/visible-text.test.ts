import { expect, it } from 'vitest';
import { extractVisibleNodeText } from '../visible-text';
it('indexes public text and numbers without editor labels, styles or link targets', () => {
  const text = extractVisibleNodeText({ kind: 'container', content: {
    label: 'page-disclaimer legal card 1', className: 'card legal-card', layoutMode: 'grid',
    layoutItems: [{ title: '법인설립', description: '절차는 3단계입니다.', image: '/private-path.webp' }],
    style: { label: 'internal style', fontFamily: 'sans-serif', color: '#ffffff' },
  } });
  expect(text).toBe('법인설립\n절차는 3단계입니다.');
  expect(extractVisibleNodeText({ kind: 'button', content: { label: '상담 신청', href: '/contact', color: 'blue' } })).toBe('상담 신청');
  expect(extractVisibleNodeText({ kind: 'text', content: { text: '123', richText: { plainText: '금액 100원', blocks: [{ text: '금액 100원' }] } } })).toContain('금액 100원');
  expect(extractVisibleNodeText({ kind: 'composite', content: { config: { overrides: { 'hero.title': '회사 설립 안내' } } } })).toBe('회사 설립 안내');
  expect(extractVisibleNodeText({ kind: 'image', content: { src: '/image.webp', alt: '타이베이 사무실' } })).toBe('타이베이 사무실');
});

it('retains visible widget copy without indexing field and icon identifiers', () => {
  expect(extractVisibleNodeText({ kind: 'pricing-table', content: {
    plans: [{ name: '회사 설립', price: '상담 후 안내', period: '건별', features: ['등기 신청'], ctaLabel: '문의하기' }],
  } })).toBe('회사 설립\n상담 후 안내\n건별\n등기 신청\n문의하기');
  expect(extractVisibleNodeText({ kind: 'comparison-table', content: {
    columns: ['개인', '법인'], rows: [{ feature: '서류 검토', values: ['포함', '별도'] }],
  } })).toBe('개인\n법인\n서류 검토\n포함\n별도');
  expect(extractVisibleNodeText({ kind: 'team-member-card', content: {
    name: '담당자', role: '파트너 변호사', bio: '대만 법률업무', socialLinks: [{ label: '소개', url: 'https://internal.invalid' }],
  } })).toBe('담당자\n파트너 변호사\n대만 법률업무\n소개');
  expect(extractVisibleNodeText({ kind: 'form', content: {
    fields: [{ name: 'customer_internal_email', label: '이메일', options: [{ label: '법인', value: 'corp_internal' }] }],
  } })).toBe('이메일\n법인');
  expect(extractVisibleNodeText({ kind: 'icon', content: { name: 'internal-icon-name' } })).toBe('');
});

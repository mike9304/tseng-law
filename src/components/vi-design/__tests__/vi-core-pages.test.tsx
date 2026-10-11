import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ViHomeBody from '../ViHomeBody';
import ViPageBody, { type ViPageKey } from '../ViPageBody';
import { guidanceContent } from '@/data/international-guidance-content';
import { GUIDANCE_TEAM_MEMBER_IDS, guidanceTeamCopy } from '@/data/international-guidance-team';
import { internationalInquiryCopy } from '@/data/international-inquiry-copy';
import { taiwanOfficeData } from '@/data/office-locations';
import { teamContent } from '@/data/team-members';
import { viSiteCopy } from '@/data/vi-site';
import type { ColumnPost } from '@/lib/column-post';
import { CONSULTATION_LANGUAGES } from '@/lib/consultation/intake-language-contract';
import { CONSULTATION_EMAIL } from '@/lib/consultation/public-contact';
import { GUIDANCE_PAGE_KEYS } from '@/lib/public-guidance';

const textMarkup = (text: string) => renderToStaticMarkup(<>{text}</>);
const pageMarkup = (pageKey: ViPageKey) => renderToStaticMarkup(<ViPageBody pageKey={pageKey} />);

function column(slug: string, publicationDate: string): ColumnPost {
  return {
    slug,
    publicationDate,
    date: '2026-10-11',
    dateDisplay: publicationDate,
    title: `Bài viết ${slug}`,
    summary: 'Thông tin pháp luật Đài Loan.',
    readTime: '5 phút',
    category: 'legal',
    categoryLabel: 'Pháp luật',
    featuredImage: '/images/placeholder-article-hero.jpg',
    content: '',
  };
}

describe('Vietnamese core pages preserve the complete public content', () => {
  it('renders every core page with one primary heading and Vietnamese language', () => {
    const pages = GUIDANCE_PAGE_KEYS.map((pageKey) => ({
      pageKey,
      html: pageKey === 'home'
        ? renderToStaticMarkup(<ViHomeBody posts={[]} />)
        : pageMarkup(pageKey),
    }));

    for (const { pageKey, html } of pages) {
      expect(html.match(/<h1\b/g), pageKey).toHaveLength(1);
      expect(html, pageKey).toContain('lang="vi"');
      expect(html, pageKey).toContain(`data-vi-page="${pageKey}"`);
      expect(html, pageKey).toContain(pageKey === 'contact' ? 'href="#international-inquiry"' : 'href="/vi/contact');
    }
  });

  it('keeps every service detail and scope condition when reordering services for Vietnamese readers', () => {
    const html = pageMarkup('services');
    for (const section of guidanceContent.vi.pages.services.sections) {
      expect(html).toContain(textMarkup(section.heading));
      for (const paragraph of section.paragraphs) expect(html).toContain(textMarkup(paragraph));
      for (const item of section.items ?? []) expect(html).toContain(textMarkup(item));
    }
    const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
    expect(anchors).toHaveLength(6);
    for (const anchor of anchors) expect(html).toContain(`id="${anchor}"`);
  });

  it('preserves all canonical people, roles, photographs and individual email addresses', () => {
    const html = pageMarkup('lawyers');
    for (const memberId of GUIDANCE_TEAM_MEMBER_IDS) {
      const member = teamContent.en.members.find(({ id }) => id === memberId)!;
      expect(html).toContain(`id="${member.id}"`);
      expect(html).toContain(textMarkup(member.name));
      expect(html).toContain(textMarkup(guidanceTeamCopy.vi.roles[memberId]));
      expect(html).toContain(encodeURIComponent(member.photo));
      if (member.email) expect(html).toContain(`href="mailto:${member.email}"`);
    }
    expect(html).toContain(textMarkup(internationalInquiryCopy.vi.consultationNotice));
    expect(html).toContain('href="/vi/contact"');
  });

  it('keeps the inquiry controls, supported consultation languages, privacy route and original office address', () => {
    const html = pageMarkup('contact');
    const form = html.match(/<form\b[\s\S]*?<\/form>/)?.[0] ?? '';
    expect(form).not.toBe('');
    for (const name of ['name', 'email', 'originalLanguage', 'preferredConsultationLanguage', 'originalText', 'consent']) {
      expect(form).toContain(`name="${name}"`);
    }
    for (const language of CONSULTATION_LANGUAGES) expect(form).toContain(`value="${language}"`);
    expect(form).toContain('value="needs-method-confirmation"');
    expect(form).not.toContain('<option value="vi"');
    expect(form).toContain('href="/vi/privacy"');
    expect(form).toContain('type="submit"');
    expect(html).toContain(`href="mailto:${CONSULTATION_EMAIL}"`);
    expect(html).toContain(taiwanOfficeData['zh-hant'][0].address);
    for (const paragraph of guidanceContent.vi.pages.contact.sections[2].paragraphs) {
      expect(html).toContain(textMarkup(paragraph));
    }
  });

  it('keeps all FAQ answers and matches each accordion button to its panel', () => {
    const html = pageMarkup('faq');
    const faqs = guidanceContent.vi.pages.faq.faqs!;
    for (const [index, faq] of faqs.entries()) {
      expect(html).toContain(textMarkup(faq.question));
      expect(html).toContain(textMarkup(faq.answer));
      expect(html).toContain(`aria-controls="vi-faq-${index}-panel"`);
      expect(html).toContain(`id="vi-faq-${index}-panel"`);
    }
    expect(html.match(/aria-expanded="false"/g)).toHaveLength(faqs.length);
  });

  it('preserves pricing, privacy and disclaimer paragraphs and lists', () => {
    for (const pageKey of ['pricing', 'privacy', 'disclaimer'] as const) {
      const html = pageMarkup(pageKey);
      const page = guidanceContent.vi.pages[pageKey];
      expect(html).toContain(textMarkup(page.intro));
      for (const section of page.sections) {
        for (const paragraph of section.paragraphs) expect(html).toContain(textMarkup(paragraph));
        for (const item of section.items ?? []) expect(html).toContain(textMarkup(item));
      }
    }
  });
});

describe('Vietnamese home article and contact paths', () => {
  it('shows the newest four native articles by original publication date, keeping image disclosures', () => {
    const posts = [
      column('older', '2026-09-01'),
      column('second', '2026-10-08'),
      column('newest', '2026-10-10'),
      column('fourth', '2026-10-04'),
      column('third', '2026-10-06'),
    ];
    posts[2].featuredImageCaption = 'Hình minh họa; không phải ảnh của một vụ việc thực tế.';
    const html = renderToStaticMarkup(<ViHomeBody posts={posts} />);
    const articleLinks = [...html.matchAll(/<h3><a href="(\/vi\/columns\/[^"]+)"/g)].map((match) => match[1]);
    expect(articleLinks).toEqual(['/vi/columns/newest', '/vi/columns/second', '/vi/columns/third', '/vi/columns/fourth']);
    expect(html).not.toContain('/vi/columns/older');
    expect(html).not.toContain('href="/en/columns');
    expect(html).toContain(posts[2].featuredImageCaption);
    expect(html).toContain('dateTime="2026-10-10"');
    expect(html).toContain('10 tháng 10, 2026');
    expect(posts[0].slug).toBe('older');
  });

  it('retains usable navigation with no articles and never treats Vietnamese as a consultation language', () => {
    const html = renderToStaticMarkup(<ViHomeBody posts={[]} />);
    for (const route of ['/vi/services', '/vi/lawyers', '/vi/faq', '/vi/contact#international-inquiry', '/vi/columns', '/vi/columns/issues']) {
      expect(html).toContain(`href="${route}"`);
    }
    expect(html).toContain(textMarkup(viSiteCopy.columns.issueTitle));
    for (const office of taiwanOfficeData['zh-hant']) expect(html).toContain(office.address);
    expect(html).toContain('19號6樓之1');
    const nodes = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
    const legalService = nodes.find((node) => node['@type'] === 'LegalService');
    expect(legalService.inLanguage).toBe('vi');
    expect(legalService.availableLanguage).toEqual(['en', 'zh-Hant', 'ja', 'ko']);
    expect(nodes.some((node) => node['@type'] === 'Person')).toBe(true);
    expect(nodes.some((node) => node['@type'] === 'FAQPage')).toBe(true);
  });
});

import { siteContent } from '@/data/site-content';
import { insightsArchive } from '@/data/insights-archive';
import type { Locale } from '@/lib/locales';

export type SearchCategory = 'services' | 'insights' | 'videos' | 'faq';

export type SearchItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  category: SearchCategory;
  tags: string[];
};

const faqItems: Record<Locale, { title: string; description: string; href: string }[]> = {
  ko: [
    {
      title: '상담 절차 FAQ',
      description: '상담 절차 및 준비 사항을 확인하세요.',
      href: '/ko/faq'
    },
    {
      title: '연락 방법 FAQ',
      description: '연락 가능한 채널을 확인하세요.',
      href: '/ko/contact'
    }
  ],
  'zh-hant': [
    {
      title: '諮詢流程 FAQ',
      description: '查看諮詢流程與準備事項。',
      href: '/zh-hant/faq'
    },
    {
      title: '聯絡方式 FAQ',
      description: '查看可聯絡的管道。',
      href: '/zh-hant/contact'
    }
  ],
  en: [
    {
      title: 'Consultation Process FAQ',
      description: 'Check the consultation flow and preparation checklist.',
      href: '/en/faq'
    },
    {
      title: 'Contact Methods FAQ',
      description: 'See available contact channels and office information.',
      href: '/en/contact'
    }
  ]
};

export function getSearchIndex(locale: Locale): SearchItem[] {
  const content = siteContent[locale];
  const archive = insightsArchive[locale];
  const items: SearchItem[] = [];

  content.services.items.forEach((item, index) => {
    items.push({
      id: `services-${index}`,
      title: item.title,
      description: item.description,
      href: item.href,
      category: 'services',
      tags: [item.title]
    });
  });

  content.featured.items.forEach((item, index) => {
    items.push({
      id: `featured-${index}`,
      title: item.title,
      description: item.summary,
      href: item.href,
      category: 'services',
      tags: [item.title]
    });
  });

  archive.posts.forEach((post) => {
    items.push({
      id: `insight-post-${post.id}`,
      title: post.title,
      description: post.summary,
      href: post.href,
      category: 'insights',
      tags: [...post.keywords, archive.categories[post.category]]
    });
  });

  content.caseGuides.items.forEach((item, index) => {
    items.push({
      id: `guide-${index}`,
      title: item.title,
      description: item.summary,
      href: item.href,
      category: 'insights',
      tags: [item.title, item.tag ?? 'Guide']
    });
  });

  content.newsletters.items.forEach((item, index) => {
    items.push({
      id: `newsletter-${index}`,
      title: item.title,
      description: item.summary ?? '',
      href: item.href,
      category: 'insights',
      tags: [item.title]
    });
  });

  items.push({
    id: 'video-featured',
    title: content.videos.featured.title,
    description: content.videos.featured.duration ?? '',
    href: content.videos.featured.href,
    category: 'videos',
    tags: [content.videos.featured.title]
  });

  content.videos.items.forEach((item, index) => {
    items.push({
      id: `video-${index}`,
      title: item.title,
      description: item.duration ?? '',
      href: item.href,
      category: 'videos',
      tags: [item.title]
    });
  });

  faqItems[locale].forEach((item, index) => {
    items.push({
      id: `faq-${index}`,
      title: item.title,
      description: item.description,
      href: item.href,
      category: 'faq',
      tags: [item.title]
    });
  });

  return items;
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

export function filterSearchIndex(items: SearchItem[], query: string, category?: SearchCategory) {
  const normalized = normalize(query);
  const tokens = normalized.split(' ').filter(Boolean);

  return items.filter((item) => {
    if (category && item.category !== category) return false;
    if (!tokens.length) return true;
    const haystack = normalize([item.title, item.description, item.tags.join(' ')].join(' '));
    return tokens.every((token) => haystack.includes(token));
  });
}

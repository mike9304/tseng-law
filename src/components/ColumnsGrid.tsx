'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/locales';

type ColumnCategory = 'formation' | 'legal' | 'case';

interface ColumnListItem {
  slug: string;
  title: string;
  date: string;
  dateDisplay: string;
  readTime: string;
  category: ColumnCategory;
  categoryLabel: string;
  featuredImage: string;
  summary: string;
}

const categoryLabels = {
  ko: { all: '전체', formation: '법인설립', legal: '법률정보', case: '소송사례' },
  'zh-hant': { all: '全部', formation: '公司設立', legal: '法律資訊', case: '訴訟案例' },
  en: { all: 'All', formation: 'Company Setup', legal: 'Legal Info', case: 'Case Studies' }
} as const;

export default function ColumnsGrid({ locale, posts }: { locale: Locale; posts: ColumnListItem[] }) {
  const labels = categoryLabels[locale];
  const [active, setActive] = useState<ColumnCategory | 'all'>('all');
  const filtered = active === 'all' ? posts : posts.filter((p) => p.category === active);

  const cats: { id: ColumnCategory | 'all'; label: string }[] = [
    { id: 'all', label: labels.all },
    { id: 'formation', label: labels.formation },
    { id: 'legal', label: labels.legal },
    { id: 'case', label: labels.case },
  ];

  return (
    <section className="section section--light">
      <div className="container">
        <div className="columns-filters">
          {cats.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`columns-filter-btn ${active === cat.id ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="columns-grid">
          {filtered.map((post) => (
            <Link key={post.slug} href={`/${locale}/columns/${post.slug}`} className="columns-card">
              <div className="columns-card-img">
                <Image src={post.featuredImage} alt={post.title} width={600} height={340} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
              </div>
              <div className="columns-card-body">
                <div className="columns-card-meta">
                  <span className="columns-category-badge">{post.categoryLabel}</span>
                  {post.dateDisplay && <time className="columns-date">{post.dateDisplay}</time>}
                </div>
                <h3 className="columns-card-title">{post.title}</h3>
                <p className="columns-card-summary">{post.summary}</p>
                {post.readTime && <span className="columns-readtime">{post.readTime}</span>}
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="columns-empty">
            {locale === 'ko' ? '해당 카테고리의 글이 없습니다.' : locale === 'zh-hant' ? '此分類尚無文章。' : 'No posts in this category yet.'}
          </p>
        )}
      </div>
    </section>
  );
}

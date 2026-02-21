'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import SectionLabel from '@/components/SectionLabel';

interface CarouselPost {
  slug: string;
  title: string;
  dateDisplay: string;
  categoryLabel: string;
  featuredImage: string;
  summary: string;
}

const copy = {
  ko: { label: '최신 칼럼', title: '호정칼럼', desc: '대만 법률 실무 정보를 칼럼으로 만나보세요.', viewAll: '모든 칼럼 보기' },
  'zh-hant': { label: '最新專欄', title: '昊鼎專欄', desc: '透過專欄了解台灣法律實務資訊。', viewAll: '查看所有專欄' },
  en: { label: 'LATEST COLUMNS', title: 'Hovering Columns', desc: 'Read practical legal insights on Taiwan matters.', viewAll: 'View all columns' }
} as const;

export default function ColumnsCarousel({ locale, posts }: { locale: Locale; posts: CarouselPost[] }) {
  const c = copy[locale];
  const prevLabel = locale === 'ko' ? '이전' : locale === 'zh-hant' ? '上一頁' : 'Previous';
  const nextLabel = locale === 'ko' ? '다음' : locale === 'zh-hant' ? '下一頁' : 'Next';
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  // Drag state
  const down = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const scrollL = useRef(0);
  const dir = useRef<'none' | 'h' | 'v'>('none');
  const dragged = useRef(false);

  const check = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    check();
    el.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => { el.removeEventListener('scroll', check); window.removeEventListener('resize', check); };
  }, [check]);

  const onDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    down.current = true;
    dragged.current = false;
    dir.current = 'none';
    startX.current = e.clientX;
    startY.current = e.clientY;
    scrollL.current = scrollRef.current?.scrollLeft ?? 0;
  }, []);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!down.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    if (dir.current === 'none') {
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
      dir.current = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
      if (dir.current === 'h') { el.setPointerCapture(e.pointerId); el.style.scrollSnapType = 'none'; el.style.scrollBehavior = 'auto'; }
    }
    if (dir.current === 'v') return;
    e.preventDefault();
    dragged.current = true;
    el.scrollLeft = scrollL.current - dx;
  }, []);

  const onUp = useCallback((e: React.PointerEvent) => {
    if (!down.current) return;
    down.current = false;
    const el = scrollRef.current;
    if (!el) return;
    if (dir.current === 'h') { try { el.releasePointerCapture(e.pointerId); } catch {} el.style.scrollSnapType = ''; el.style.scrollBehavior = ''; }
    dir.current = 'none';
  }, []);

  const scroll = (d: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const w = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 24 : 340;
    el.scrollBy({ left: d === 'left' ? -w : w, behavior: 'smooth' });
  };

  const onClick = useCallback((e: React.MouseEvent) => {
    if (dragged.current) { e.preventDefault(); dragged.current = false; }
  }, []);

  if (!posts.length) return null;

  return (
    <section className="section section--gray" id="columns-carousel">
      <div className="container">
        <div className="columns-carousel-header">
          <div>
            <SectionLabel>{c.label}</SectionLabel>
            <h2 className="section-title">{c.title}</h2>
            <p className="section-lede">{c.desc}</p>
          </div>
          <div className="columns-carousel-nav">
            <button onClick={() => scroll('left')} disabled={!canLeft} className="columns-carousel-btn" aria-label={prevLabel}>‹</button>
            <button onClick={() => scroll('right')} disabled={!canRight} className="columns-carousel-btn" aria-label={nextLabel}>›</button>
          </div>
        </div>
      </div>
      <div
        ref={scrollRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onClickCapture={onClick}
        className="columns-carousel-track"
      >
        {posts.map((post) => (
          <Link key={post.slug} href={`/${locale}/columns/${post.slug}`} className="columns-carousel-card" draggable={false}>
            <div className="columns-carousel-card-img">
              <Image src={post.featuredImage} alt={post.title} width={400} height={250} draggable={false} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
            </div>
            <div className="columns-carousel-card-body">
              <div className="columns-card-meta">
                <span className="columns-category-badge">{post.categoryLabel}</span>
                <time className="columns-date">{post.dateDisplay}</time>
              </div>
              <h3 className="columns-carousel-card-title">{post.title}</h3>
              <p className="columns-card-summary">{post.summary}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="container" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link href={`/${locale}/columns`} className="button button--outline">{c.viewAll} →</Link>
      </div>
    </section>
  );
}

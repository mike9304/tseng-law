'use client';

import { useEffect, useMemo, useState } from 'react';
import type { BuilderBlogArchiveCanvasNode } from '@/lib/builder/canvas/types';
import type { BlogPost } from '@/lib/builder/blog/blog-engine';

interface BlogArchiveElementProps {
  node: BuilderBlogArchiveCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}

const MOCK = [
  { year: 2026, month: 4, count: 5 },
  { year: 2026, month: 3, count: 3 },
  { year: 2026, month: 2, count: 4 },
  { year: 2025, month: 12, count: 2 },
];

interface ArchiveBucket {
  year: number;
  month: number;
  count: number;
}

function toBuckets(posts: BlogPost[]): ArchiveBucket[] {
  const map = new Map<string, ArchiveBucket>();
  for (const p of posts) {
    const iso = p.publishedAt ?? p.updatedAt;
    if (!iso) continue;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) continue;
    const y = d.getUTCFullYear();
    const m = d.getUTCMonth() + 1;
    const key = `${y}-${m}`;
    const existing = map.get(key);
    if (existing) existing.count += 1;
    else map.set(key, { year: y, month: m, count: 1 });
  }
  return Array.from(map.values()).sort((a, b) => (b.year - a.year) || (b.month - a.month));
}

export default function BlogArchiveElement({ node, mode = 'edit' }: BlogArchiveElementProps) {
  const c = node.content;
  const isBuilder = mode !== 'published';
  const [posts, setPosts] = useState<BlogPost[] | null>(null);

  useEffect(() => {
    if (isBuilder) return;
    let cancelled = false;
    fetch(`/api/builder/blog/posts?locale=ko&limit=100`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json?.ok && Array.isArray(json.posts)) setPosts(json.posts as BlogPost[]);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isBuilder]);

  const buckets: ArchiveBucket[] = useMemo(() => {
    if (isBuilder) return MOCK;
    return posts ? toBuckets(posts) : [];
  }, [isBuilder, posts]);

  // Group by year if requested
  const grouped: Array<{ year: number; rows: ArchiveBucket[] }> = useMemo(() => {
    if (c.groupBy === 'year') {
      const m = new Map<number, ArchiveBucket>();
      for (const b of buckets) {
        const existing = m.get(b.year);
        if (existing) existing.count += b.count;
        else m.set(b.year, { year: b.year, month: 0, count: b.count });
      }
      return Array.from(m.values()).sort((a, b) => b.year - a.year).map((b) => ({ year: b.year, rows: [b] }));
    }
    const m = new Map<number, ArchiveBucket[]>();
    for (const b of buckets) {
      const arr = m.get(b.year) ?? [];
      arr.push(b);
      m.set(b.year, arr);
    }
    return Array.from(m.entries()).sort(([a], [b]) => b - a).map(([year, rows]) => ({ year, rows }));
  }, [c.groupBy, buckets]);

  return (
    <aside
      style={{
        width: '100%',
        height: '100%',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: 16,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        overflow: 'auto',
      }}
    >
      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Archive
      </h3>
      {grouped.length === 0 && (
        <span style={{ fontSize: 12, color: '#94a3b8' }}>등록된 글이 없습니다.</span>
      )}
      {grouped.map((group, i) => {
        const expanded = c.expandLatest ? i === 0 : false;
        return (
          <details key={group.year} open={expanded || c.groupBy === 'year'}>
            <summary
              style={{
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                color: '#0f172a',
                listStyle: 'none',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>{group.year}</span>
              {c.showCount && (
                <span style={{ color: '#94a3b8', fontWeight: 400 }}>
                  ({group.rows.reduce((s, r) => s + r.count, 0)})
                </span>
              )}
            </summary>
            {c.groupBy === 'month' && (
              <ul style={{ listStyle: 'none', margin: '6px 0 0', padding: '0 0 0 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {group.rows.map((r) => (
                  <li key={`${r.year}-${r.month}`}>
                    <a
                      href={`/ko/columns?year=${r.year}&month=${r.month}`}
                      style={{ display: 'flex', justifyContent: 'space-between', textDecoration: 'none', color: '#475569', fontSize: 12 }}
                    >
                      <span>{r.year}-{String(r.month).padStart(2, '0')}</span>
                      {c.showCount && <span style={{ color: '#94a3b8' }}>({r.count})</span>}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </details>
        );
      })}
    </aside>
  );
}

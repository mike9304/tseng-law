'use client';

import { useEffect, useMemo, useState } from 'react';
import type { BuilderBlogAuthorCanvasNode } from '@/lib/builder/canvas/types';
import type { BlogAuthor, BlogPost } from '@/lib/builder/blog/blog-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';
import styles from './BlogAuthor.module.css';

interface BlogAuthorElementProps {
  node: BuilderBlogAuthorCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}

interface AuthorGroup {
  key: string;
  author: BlogAuthor;
  posts: BlogPost[];
}

const MOCK_AUTHORS: AuthorGroup[] = [
  {
    key: 'mock-team',
    author: {
      name: '호정국제 법률사무소',
      title: 'Legal editorial team',
      bio: '대만 법률 실무와 외국인 상담 경험을 바탕으로 칼럼을 검토합니다.',
    },
    posts: [
      {
        postId: 'mock-post-1',
        slug: 'mock-post-1',
        locale: 'ko',
        title: '대만 회사설립 체크리스트',
        excerpt: '법인 설립 전 확인해야 할 절차와 실무 쟁점.',
        bodyHtml: '',
        bodyMarkdown: '',
        category: 'company-formation',
        tags: [],
        readingTimeMinutes: 4,
        publishedAt: '2026-04-12',
        updatedAt: '2026-04-12',
        featured: false,
        author: { name: '호정국제 법률사무소' },
      },
    ],
  },
];

function initials(name: string): string {
  const compact = name.replace(/\s+/g, '').trim();
  return Array.from(compact).slice(0, 2).join('').toUpperCase() || 'AU';
}

function groupAuthors(posts: BlogPost[]): AuthorGroup[] {
  const map = new Map<string, AuthorGroup>();
  for (const post of posts) {
    const name = post.author?.name?.trim() || '호정국제 법률사무소';
    const key = name.toLowerCase();
    const current = map.get(key);
    if (current) {
      current.posts.push(post);
      continue;
    }
    map.set(key, {
      key,
      author: {
        name,
        title: post.author?.title,
        bio: post.author?.bio,
        photo: post.author?.photo,
      },
      posts: [post],
    });
  }
  return Array.from(map.values()).sort((left, right) => right.posts.length - left.posts.length);
}

export default function BlogAuthorElement({ node, mode = 'edit', locale }: BlogAuthorElementProps) {
  const c = node.content;
  const isBuilder = mode !== 'published';
  const effectiveLocale = normalizeLocale(locale || 'ko');
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setPosts(null);
    setLoading(!isBuilder);

    const params = new URLSearchParams({
      locale: effectiveLocale,
      limit: '100',
      sort: 'newest',
      scope: isBuilder ? 'all' : 'public',
    });
    if (c.authorName) params.set('author', c.authorName);

    fetch(`/api/builder/blog/posts?${params.toString()}`)
      .then((response) => response.json())
      .then((json) => {
        if (cancelled) return;
        if (json?.ok && Array.isArray(json.posts)) setPosts(json.posts as BlogPost[]);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [c.authorName, effectiveLocale, isBuilder]);

  const authors = useMemo(() => {
    const grouped = posts ? groupAuthors(posts) : isBuilder ? MOCK_AUTHORS : [];
    if (!c.authorName) return grouped;
    return grouped.filter((group) => group.author.name === c.authorName);
  }, [c.authorName, isBuilder, posts]);

  if (!isBuilder && loading) {
    return (
      <div className={styles.state} data-builder-blog-author="true" role="status">
        Loading authors...
      </div>
    );
  }

  if (authors.length === 0) {
    return (
      <div className={styles.state} data-builder-blog-author="true">
        표시할 작성자가 없습니다.
      </div>
    );
  }

  return (
    <section
      className={`${styles.authorRoot} ${c.layout === 'list' ? styles.authorList : styles.authorCard}`}
      data-builder-blog-author="true"
    >
      {authors.map((group) => {
        const authorHref = `/${effectiveLocale}/columns?author=${encodeURIComponent(group.author.name)}`;
        return (
          <article key={group.key} className={styles.authorItem}>
            <a className={styles.authorHeader} href={isBuilder ? '#' : authorHref}>
              <span className={styles.avatar}>
                {group.author.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={group.author.photo} alt="" loading="lazy" />
                ) : (
                  <span>{initials(group.author.name)}</span>
                )}
              </span>
              <span className={styles.authorCopy}>
                <strong>{group.author.name}</strong>
                {group.author.title ? <small>{group.author.title}</small> : null}
              </span>
              {c.showPostCount ? <span className={styles.count}>{group.posts.length}</span> : null}
            </a>
            {c.showBio && group.author.bio ? <p className={styles.bio}>{group.author.bio}</p> : null}
            {c.showRecentPosts ? (
              <div className={styles.posts}>
                {group.posts.slice(0, c.maxPosts).map((post) => (
                  <a key={post.postId} href={isBuilder ? '#' : `/${effectiveLocale}/columns/${post.slug}`}>
                    {post.title}
                  </a>
                ))}
              </div>
            ) : null}
          </article>
        );
      })}
    </section>
  );
}

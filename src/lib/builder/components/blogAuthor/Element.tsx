'use client';

import { useEffect, useMemo, useState } from 'react';
import type { BuilderBlogAuthorCanvasNode } from '@/lib/builder/canvas/types';
import type { BlogAuthor, BlogPost } from '@/lib/builder/blog/blog-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { WidgetDataDisclosure } from '../_shared/WidgetDataDisclosure';
import styles from './BlogAuthor.module.css';
import { getBlogAuthorCopy, type BlogAuthorCopy } from './blog-author-copy';

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

function initials(name: string): string {
  const compact = name.replace(/\s+/g, '').trim();
  return Array.from(compact).slice(0, 2).join('').toUpperCase() || 'AU';
}

function createMockAuthors(locale: Locale, copy: BlogAuthorCopy): AuthorGroup[] {
  return [
    {
      key: 'mock-team',
      author: {
        name: copy.mock.authorName,
        title: copy.mock.authorTitle,
        bio: copy.mock.authorBio,
      },
      posts: [
        {
          postId: 'mock-post-1',
          slug: 'mock-post-1',
          locale,
          title: copy.mock.postTitle,
          excerpt: copy.mock.postExcerpt,
          bodyHtml: '',
          bodyMarkdown: '',
          category: 'company-formation',
          tags: [],
          readingTimeMinutes: 4,
          publishedAt: '2026-04-12',
          updatedAt: '2026-04-12',
          featured: false,
          author: { name: copy.mock.authorName },
        },
      ],
    },
  ];
}

function groupAuthors(posts: BlogPost[], fallbackAuthorName: string): AuthorGroup[] {
  const map = new Map<string, AuthorGroup>();
  for (const post of posts) {
    const name = post.author?.name?.trim() || fallbackAuthorName;
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
  const copy = getBlogAuthorCopy(effectiveLocale);
  const mockAuthors = useMemo(() => createMockAuthors(effectiveLocale, copy), [copy, effectiveLocale]);
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
    const grouped = posts ? groupAuthors(posts, copy.fallbackAuthorName) : isBuilder ? mockAuthors : [];
    if (!c.authorName) return grouped;
    return grouped.filter((group) => group.author.name === c.authorName);
  }, [c.authorName, copy.fallbackAuthorName, isBuilder, mockAuthors, posts]);

  if (!isBuilder && loading) {
    return (
      <div className={styles.state} data-builder-blog-author="true" role="status">
        {copy.loading}
      </div>
    );
  }

  if (authors.length === 0) {
    return (
      <div className={styles.state} data-builder-blog-author="true">
        {copy.empty}
      </div>
    );
  }

  return (
    <section
      className={`${styles.authorRoot} ${c.layout === 'list' ? styles.authorList : styles.authorCard}`}
      data-builder-blog-author="true"
    >
      {isBuilder ? <WidgetDataDisclosure locale={effectiveLocale} /> : null}
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

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IS_STATIC_SITE } from '@/lib/static-site';

export type CriminalBoardListPost = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  featuredImage?: string;
  date: string;
};

/**
 * Search form + filtered card grid of the criminal-litigation board. The server passes the
 * query it received; the static site (src/lib/static-site.ts) serves one snapshot for every
 * `?q=`, so there the query is read from the URL after hydration. Labels arrive as strings
 * (`resultsLabels[n]` = the result line for n hits) so no copy module enters the client bundle.
 */
export default function CriminalBoardList({ locale, boardPath, posts, initialQuery, labels, resultsLabels }: {
  locale: string;
  boardPath: string;
  posts: CriminalBoardListPost[];
  initialQuery: string;
  labels: { search: string; placeholder: string; submit: string; reset: string; empty: string; read: string };
  resultsLabels: string[];
}) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    if (!IS_STATIC_SITE) return;
    setQuery((new URLSearchParams(window.location.search).get('q') ?? '').trim().slice(0, 200));
  }, []);

  const needle = query.toLocaleLowerCase(locale);
  const visiblePosts = query
    ? posts.filter((post) => [post.title, post.summary, ...post.tags].join(' ').toLocaleLowerCase(locale).includes(needle))
    : posts;

  return (
    <>
      <form key={query} action={`/${locale}${boardPath}`} method="get" role="search" className="columns-search">
        <label className="columns-search-label" htmlFor="criminal-search-input">{labels.search}</label>
        <div className="columns-search-row">
          <input id="criminal-search-input" type="search" name="q" defaultValue={query} maxLength={200}
            placeholder={labels.placeholder} className="columns-search-input" />
          <button type="submit" className="columns-search-submit">{labels.submit}</button>
        </div>
      </form>
      {query ? <div className="columns-filter-summary">
        <p role="status" data-criminal-search-results={visiblePosts.length}>{resultsLabels[visiblePosts.length]}</p>
        <Link href={`/${locale}${boardPath}`} className="link-underline" data-criminal-search-reset>{labels.reset}</Link>
      </div> : null}
      {visiblePosts.length === 0 ? <p className="columns-empty">{labels.empty}</p> : null}
      <div className="svc-columns-grid">
        {visiblePosts.map((post) => (
          <Link key={post.slug} href={`/${locale}/columns/${post.slug}`}
            className="svc-col-card" data-criminal-column={post.slug}>
            {post.featuredImage ? <div className="svc-col-card-media">
              <Image src={post.featuredImage} alt="" width={640} height={360} />
            </div> : null}
            <h2 className="svc-col-card-title">{post.title}</h2>
            <p className="svc-col-card-summary">{post.summary}</p>
            <span className="svc-col-card-meta"><time>{post.date}</time></span>
            <span className="svc-col-card-link">{labels.read} →</span>
          </Link>
        ))}
      </div>
    </>
  );
}

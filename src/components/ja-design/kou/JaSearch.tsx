'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import n from './JaNeeds.module.css';

/**
 * The hero search, moved into the needs chapter (CONCEPT-V2 D1, §7.8): same label, placeholder, action, field name and
 * button label as HeroSearch's editorial search. The six topics show as text links while the search has focus; Escape
 * closes them and returns focus to the field; a click outside closes them.
 */
export default function JaSearch({
  label,
  placeholder,
  buttonLabel,
  topics,
}: {
  label: string;
  placeholder: string;
  buttonLabel: string;
  topics: ReadonlyArray<{ label: string; href: string }>;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setOpen(false);
      inputRef.current?.focus();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className={n.search}
      onBlur={(event) => {
        if (!wrapRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <label htmlFor="ja-needs-search" className={n.searchLabel}>
        {label}
      </label>
      <form className={n.searchForm} action="/ja/search" method="get" role="search">
        <input
          id="ja-needs-search"
          ref={inputRef}
          className={n.searchInput}
          type="search"
          name="q"
          placeholder={placeholder}
          autoComplete="off"
          suppressHydrationWarning
          onFocus={() => setOpen(true)}
        />
        <button className={n.searchButton} type="submit" aria-label={buttonLabel}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-4.2-4.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </form>
      {open ? (
        <ul className={n.topics}>
          {topics.map((topic) => (
            <li key={topic.href}>
              <Link className={n.topic} href={topic.href} onClick={() => setOpen(false)}>
                {topic.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

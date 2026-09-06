'use client';

import { useEffect, useMemo, useRef, useState, type ComponentPropsWithoutRef } from 'react';

function tokenize(text: string) {
  if (text.includes(' ')) {
    return text.split(/(\s+)/);
  }
  return Array.from(text);
}

function tokenizeHighlights(text: string, highlightWords: string[]) {
  const keywords = [...new Set(highlightWords.filter((word) => word.length > 0))]
    .sort((a, b) => b.length - a.length);
  if (keywords.length === 0) {
    return tokenize(text).map((token) => ({ text: token, keyword: false }));
  }

  const pattern = new RegExp(
    `(${keywords.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'gu',
  );
  return text.split(pattern).flatMap((part, index) => (
    index % 2 === 1
      ? [{ text: part, keyword: true }]
      : tokenize(part).map((token) => ({ text: token, keyword: false }))
  ));
}

function isPunctuation(token: string) {
  return /^[.,!?;:()[\]{}"'、。！？；：，\-~]+$/.test(token);
}

export default function ScrollHighlightText({
  text,
  className,
  highlightWords = [],
  ...rest
}: {
  text: string;
  className?: string;
  highlightWords?: string[];
} & Omit<ComponentPropsWithoutRef<'p'>, 'children'>) {
  const rootRef = useRef<HTMLParagraphElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const tokens = useMemo(() => tokenizeHighlights(text, highlightWords), [text, highlightWords]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener('change', updateMotion);
    return () => media.removeEventListener('change', updateMotion);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [reducedMotion]);

  let revealIndex = 0;
  return (
    <p ref={rootRef} className={`scroll-highlight ${className ?? ''}`.trim()} {...rest}>
      {tokens.map(({ text: token, keyword }, index) => {
        if (!token) return null;
        if (/^\s+$/.test(token)) {
          return <span key={`${token}-${index}`}>{token}</span>;
        }
        const punctuation = isPunctuation(token);
        const delay = punctuation ? 0 : Math.min(revealIndex++ * 24, 360);
        return (
          <span
            key={`${token}-${index}`}
            className={`scroll-highlight-word${keyword ? ' is-keyword' : ''}${visible ? ' is-visible' : ''}`}
            style={{ transitionDelay: `${delay}ms` }}
          >
            {token}
          </span>
        );
      })}
    </p>
  );
}

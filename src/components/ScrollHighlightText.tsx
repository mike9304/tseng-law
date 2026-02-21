'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

function tokenize(text: string) {
  if (text.includes(' ')) {
    return text.split(/(\s+)/);
  }
  return Array.from(text);
}

function isPunctuation(token: string) {
  return /^[.,!?;:()[\]{}"'、。！？；：，\-~]+$/.test(token);
}

export default function ScrollHighlightText({
  text,
  className,
  highlightWords = []
}: {
  text: string;
  className?: string;
  highlightWords?: string[];
}) {
  const rootRef = useRef<HTMLParagraphElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const tokens = useMemo(() => tokenize(text), [text]);

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
    <p ref={rootRef} className={`scroll-highlight ${className ?? ''}`.trim()}>
      {tokens.map((token, index) => {
        if (!token) return null;
        if (/^\s+$/.test(token)) {
          return <span key={`${token}-${index}`}>{token}</span>;
        }
        const keyword = highlightWords.some((word) => token.includes(word));
        const punctuation = isPunctuation(token);
        const delay = punctuation ? 0 : revealIndex++ * 36;
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

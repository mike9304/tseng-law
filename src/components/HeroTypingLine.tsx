'use client';

import { useEffect, useMemo, useState } from 'react';

export default function HeroTypingLine({ phrases }: { phrases: string[] }) {
  const safePhrases = useMemo(() => phrases.filter(Boolean), [phrases]);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handle = () => setReducedMotion(media.matches);
    handle();
    media.addEventListener('change', handle);
    return () => media.removeEventListener('change', handle);
  }, []);

  useEffect(() => {
    if (!safePhrases.length || reducedMotion) return;

    const phrase = safePhrases[phraseIndex] ?? '';
    let delay = deleting ? 30 : 50;
    let next: () => void;

    if (!deleting && charIndex < phrase.length) {
      next = () => setCharIndex((prev) => prev + 1);
    } else if (!deleting && charIndex === phrase.length) {
      delay = 2500;
      next = () => setDeleting(true);
    } else if (deleting && charIndex > 0) {
      next = () => setCharIndex((prev) => prev - 1);
    } else {
      delay = 280;
      next = () => {
        setDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % safePhrases.length);
      };
    }

    const id = window.setTimeout(next, delay);
    return () => window.clearTimeout(id);
  }, [charIndex, deleting, phraseIndex, reducedMotion, safePhrases]);

  if (!safePhrases.length) return null;

  const current = reducedMotion ? safePhrases[0] : (safePhrases[phraseIndex] ?? '').slice(0, charIndex);

  return (
    <p className="hero-typing" aria-live="polite">
      <span>{current}</span>
      {!reducedMotion ? (
        <span className="hero-typing-cursor" aria-hidden>
          |
        </span>
      ) : null}
    </p>
  );
}

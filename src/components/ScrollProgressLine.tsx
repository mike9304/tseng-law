'use client';

import { useEffect, useState } from 'react';

function getProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (maxScroll <= 0) return 0;
  return Math.min(window.scrollY / maxScroll, 1);
}

export default function ScrollProgressLine() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handle = () => setProgress(getProgress());
    handle();
    window.addEventListener('scroll', handle, { passive: true });
    window.addEventListener('resize', handle);
    return () => {
      window.removeEventListener('scroll', handle);
      window.removeEventListener('resize', handle);
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden>
      <span style={{ width: `${progress * 100}%` }} />
    </div>
  );
}

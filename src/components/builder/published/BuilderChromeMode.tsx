'use client';

import { useEffect } from 'react';

export default function BuilderChromeMode() {
  useEffect(() => {
    document.body.classList.add('builder-main-route');

    const unlockScroll = () => {
      if (document.body.style.overflow) {
        document.body.style.overflow = '';
      }
    };
    unlockScroll();

    const observer = new MutationObserver(unlockScroll);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style'],
    });

    return () => {
      observer.disconnect();
      document.body.classList.remove('builder-main-route');
    };
  }, []);

  return null;
}

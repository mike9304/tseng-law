/** Start once on first view; subsequent playback belongs to the reader. */
export function autoplayColumnVideoWhenVisible(video: HTMLVideoElement): () => void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  let attempted = false;
  let cancelled = false;
  let observer: IntersectionObserver | undefined;
  const cancel = () => {
    cancelled = true;
    observer?.disconnect();
  };
  const start = () => {
    if (attempted || cancelled) return;
    attempted = true;
    observer?.disconnect();
    video.muted = true;
    video.autoplay = true;
    // Browser policies can still reject autoplay. Native controls remain usable.
    void video.play().catch(() => {});
  };

  video.addEventListener('pointerdown', cancel);
  video.addEventListener('keydown', cancel);
  video.addEventListener('play', cancel);
  if (typeof IntersectionObserver === 'undefined') {
    start();
  } else {
    observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.25)) start();
    }, { threshold: 0.25 });
    observer.observe(video);
  }

  return () => {
    cancel();
    video.removeEventListener('pointerdown', cancel);
    video.removeEventListener('keydown', cancel);
    video.removeEventListener('play', cancel);
  };
}

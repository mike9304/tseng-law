'use client';

import { useEffect, useRef, useState } from 'react';

const TRAIL_COUNT = 6;

type Point = {
  x: number;
  y: number;
};

function isFinePointer(): boolean {
  return window.matchMedia('(pointer: fine)').matches;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isHighEnoughSpec(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const memory = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  return memory > 4 && cores > 4;
}

export default function CyberCursor() {
  const [enabled, setEnabled] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLSpanElement | null>(null);
  const coreRef = useRef<HTMLSpanElement | null>(null);
  const pulseRef = useRef<HTMLSpanElement | null>(null);
  const trailRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion() || !isHighEnoughSpec()) {
      setEnabled(false);
      return;
    }
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const root = rootRef.current;
    const ring = ringRef.current;
    const core = coreRef.current;
    const pulse = pulseRef.current;
    if (!root || !ring || !core || !pulse) return;

    document.documentElement.classList.add('has-cyber-cursor');
    root.dataset.surface = 'light';

    let rafId = 0;
    let visible = false;
    let pulseStrength = 0;
    let mode: 'default' | 'active' | 'text' = 'default';

    const target = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
    const ringPos = { x: target.x, y: target.y };
    const corePos = { x: target.x, y: target.y };

    const trail: Point[] = Array.from({ length: TRAIL_COUNT }, () => ({ x: target.x, y: target.y }));

    const applyMode = (nextMode: 'default' | 'active' | 'text') => {
      if (mode === nextMode) return;
      mode = nextMode;
      root.dataset.mode = mode;
    };

    const applySurface = (nextSurface: 'light' | 'dark') => {
      if (root.dataset.surface === nextSurface) return;
      root.dataset.surface = nextSurface;
    };

    const updateModeFromTarget = (el: EventTarget | null) => {
      if (!(el instanceof Element)) {
        applyMode('default');
        applySurface('light');
        return;
      }

      const toneTarget = el.closest('[data-tone]') as HTMLElement | null;
      applySurface(toneTarget?.dataset.tone === 'dark' ? 'dark' : 'light');

      const textTarget = el.closest('input, textarea, [contenteditable="true"]');
      if (textTarget) {
        applyMode('text');
        return;
      }

      const activeTarget = el.closest('a, button, [role="button"], summary, label, .dot, .button');
      applyMode(activeTarget ? 'active' : 'default');
    };

    const handlePointerMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      visible = true;
      updateModeFromTarget(event.target);
    };

    const handlePointerDown = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      pulseStrength = 1;
      visible = true;
      updateModeFromTarget(event.target);
    };

    const handlePointerLeave = () => {
      visible = false;
    };

    const stopLoop = () => {
      if (!rafId) return;
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    };

    const startLoop = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(frame);
    };

    const frame = () => {
      rafId = 0;
      ringPos.x += (target.x - ringPos.x) * 0.17;
      ringPos.y += (target.y - ringPos.y) * 0.17;
      corePos.x += (target.x - corePos.x) * 0.34;
      corePos.y += (target.y - corePos.y) * 0.34;

      trail[0].x += (ringPos.x - trail[0].x) * 0.52;
      trail[0].y += (ringPos.y - trail[0].y) * 0.52;
      for (let i = 1; i < trail.length; i += 1) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * 0.4;
        trail[i].y += (trail[i - 1].y - trail[i].y) * 0.4;
      }

      ring.style.left = `${ringPos.x}px`;
      ring.style.top = `${ringPos.y}px`;
      ring.style.opacity = visible ? '1' : '0';

      core.style.left = `${corePos.x}px`;
      core.style.top = `${corePos.y}px`;
      core.style.opacity = visible ? '1' : '0';

      for (let i = 0; i < trail.length; i += 1) {
        const trailEl = trailRefs.current[i];
        if (!trailEl) continue;
        const scale = 1 - i * 0.08;
        const opacity = visible ? Math.max(0, 0.62 - i * 0.075) : 0;
        trailEl.style.left = `${trail[i].x}px`;
        trailEl.style.top = `${trail[i].y}px`;
        trailEl.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
        trailEl.style.opacity = `${opacity.toFixed(3)}`;
      }

      pulseStrength *= 0.88;
      if (pulseStrength < 0.001) pulseStrength = 0;
      const pulseSize = 28 + pulseStrength * 62;
      pulse.style.left = `${ringPos.x}px`;
      pulse.style.top = `${ringPos.y}px`;
      pulse.style.width = `${pulseSize}px`;
      pulse.style.height = `${pulseSize}px`;
      pulse.style.opacity = `${(pulseStrength * 0.45).toFixed(3)}`;

      const shouldContinue = visible || pulseStrength > 0.01;
      if (shouldContinue) {
        rafId = window.requestAnimationFrame(frame);
      }
    };

    const wrappedMove = (event: PointerEvent) => {
      handlePointerMove(event);
      startLoop();
    };
    const wrappedDown = (event: PointerEvent) => {
      handlePointerDown(event);
      startLoop();
    };

    window.addEventListener('pointermove', wrappedMove, { passive: true });
    window.addEventListener('pointerdown', wrappedDown, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('blur', handlePointerLeave);

    return () => {
      stopLoop();
      window.removeEventListener('pointermove', wrappedMove);
      window.removeEventListener('pointerdown', wrappedDown);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('blur', handlePointerLeave);
      document.documentElement.classList.remove('has-cyber-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={rootRef} className="cyber-cursor" data-mode="default" aria-hidden>
      <span ref={pulseRef} className="cyber-cursor-pulse" />
      <span ref={ringRef} className="cyber-cursor-ring" />
      <span ref={coreRef} className="cyber-cursor-core" />
      {Array.from({ length: TRAIL_COUNT }).map((_, index) => (
        <span
          key={index}
          ref={(element) => {
            trailRefs.current[index] = element;
          }}
          className="cyber-cursor-trail"
        />
      ))}
    </div>
  );
}

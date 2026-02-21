'use client';

import { useEffect, useRef } from 'react';

type BrainNode = {
  x: number;
  y: number;
  z: number;
  side: -1 | 1;
  size: number;
  phase: number;
  speed: number;
  hueShift: number;
};

type ProjectedNode = {
  x: number;
  y: number;
  side: -1 | 1;
  size: number;
  alpha: number;
  hueShift: number;
};

type PerfProfile = 'balanced' | 'high';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function createNodes(count: number): BrainNode[] {
  const nodes: BrainNode[] = [];
  for (let index = 0; index < count; index += 1) {
    const side: -1 | 1 = index % 2 === 0 ? -1 : 1;
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random());
    const lobeWidth = 0.3;
    const lobeHeight = 0.5;
    let x = side * 0.28 + Math.cos(angle) * lobeWidth * (0.48 + radius * 0.58);
    const y = Math.sin(angle) * lobeHeight * (0.42 + radius * 0.56);
    const z = (Math.random() - 0.5) * 0.72;

    if (Math.abs(y) < 0.1) {
      x += side * 0.05;
    }

    nodes.push({
      x,
      y,
      z,
      side,
      size: 1.15 + Math.random() * 2.05,
      phase: Math.random() * Math.PI * 2,
      speed: 0.55 + Math.random() * 0.95,
      hueShift: (Math.random() - 0.5) * 26
    });
  }
  return nodes;
}

export default function HeroBrainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const nav = navigator as Navigator & { deviceMemory?: number };
    const memory = nav.deviceMemory ?? 8;
    const cores = navigator.hardwareConcurrency ?? 8;

    // Skip heavy canvas processing on lower-spec devices.
    if (memory <= 4 || cores <= 4) return;

    const profile: PerfProfile = memory >= 8 && cores >= 8 ? 'high' : 'balanced';
    const frameInterval = profile === 'high' ? 33 : 45; // about 30fps / 22fps
    const linkStride = profile === 'high' ? 2 : 3;

    let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotion = () => {
      reducedMotion = motionQuery.matches;
    };
    motionQuery.addEventListener('change', handleMotion);

    const heroSection = canvas.closest('.hero');
    const state = {
      width: 0,
      height: 0,
      dpr: 1,
      nodes: [] as BrainNode[],
      pointerX: 0,
      pointerY: 0,
      targetX: 0,
      targetY: 0
    };

    let rafId = 0;
    let lastFrame = 0;
    let pageVisible = !document.hidden;
    let heroInView = true;
    let observer: IntersectionObserver | null = null;

    const stop = () => {
      if (!rafId) return;
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    };

    const schedule = () => {
      if (rafId || !pageVisible || !heroInView) return;
      rafId = window.requestAnimationFrame(render);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      state.width = Math.max(1, Math.floor(rect.width));
      state.height = Math.max(1, Math.floor(rect.height));
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(state.width * state.dpr);
      canvas.height = Math.floor(state.height * state.dpr);
      canvas.style.width = `${state.width}px`;
      canvas.style.height = `${state.height}px`;
      context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

      const dense = state.width < 900;
      const nodeCount = profile === 'high' ? (dense ? 72 : 110) : dense ? 50 : 76;
      state.nodes = createNodes(nodeCount);
    };

    const updateTarget = (clientX: number, clientY: number) => {
      if (!(heroSection instanceof HTMLElement)) return;
      const rect = heroSection.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;

      const inside = clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
      if (!inside) return;

      const nx = ((clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((clientY - rect.top) / rect.height - 0.5) * 2;
      state.targetX = clamp(nx, -1, 1);
      state.targetY = clamp(ny, -1, 1);
      schedule();
    };

    const handlePointerMove = (event: PointerEvent) => updateTarget(event.clientX, event.clientY);
    const handlePointerLeave = () => {
      state.targetX = 0;
      state.targetY = 0;
    };

    const handleVisibility = () => {
      pageVisible = !document.hidden;
      if (!pageVisible) {
        stop();
        return;
      }
      schedule();
    };

    const render = (time: number) => {
      rafId = 0;
      if (!pageVisible || !heroInView) return;

      if (time - lastFrame < frameInterval) {
        schedule();
        return;
      }
      lastFrame = time;

      const t = time * 0.001;
      state.pointerX += (state.targetX - state.pointerX) * 0.07;
      state.pointerY += (state.targetY - state.pointerY) * 0.07;

      const rotateY = reducedMotion ? -0.08 : state.pointerX * 0.42;
      const rotateX = reducedMotion ? 0.06 : state.pointerY * 0.28;

      context.clearRect(0, 0, state.width, state.height);

      const centerX = state.width * 0.5;
      const centerY = state.height * 0.46;
      const scaleX = state.width * 0.29;
      const scaleY = state.height * 0.4;
      const wobble = reducedMotion ? 0.005 : 0.015;

      const projected: ProjectedNode[] = [];

      for (let index = 0; index < state.nodes.length; index += 1) {
        const node = state.nodes[index];
        const x = node.x + Math.cos(t * node.speed + node.phase) * wobble;
        const y = node.y + Math.sin(t * (node.speed * 0.84) + node.phase) * wobble * 1.25;
        const z = node.z + Math.sin(t * (node.speed * 0.66) + node.phase) * (reducedMotion ? 0.008 : 0.03);

        const cosY = Math.cos(rotateY);
        const sinY = Math.sin(rotateY);
        const rx = x * cosY + z * sinY;
        let rz = -x * sinY + z * cosY;

        const cosX = Math.cos(rotateX);
        const sinX = Math.sin(rotateX);
        const ry = y * cosX - rz * sinX;
        rz = y * sinX + rz * cosX;

        const perspective = 1 / (1 + rz * 0.95);
        const screenX = centerX + rx * scaleX * perspective;
        const screenY = centerY + ry * scaleY * perspective;

        projected.push({
          x: screenX,
          y: screenY,
          side: node.side,
          size: node.size * perspective,
          alpha: clamp(0.28 + perspective * 0.52, 0.2, 0.78),
          hueShift: node.hueShift
        });
      }

      const linkDistance = Math.min(state.width, state.height) * (reducedMotion ? 0.11 : 0.14);
      for (let i = 0; i < projected.length; i += 1) {
        const a = projected[i];
        for (let j = i + 1; j < projected.length; j += linkStride) {
          const b = projected[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy);
          if (distance > linkDistance) continue;

          const ratio = 1 - distance / linkDistance;
          const alpha = ratio * ratio * (reducedMotion ? 0.11 : 0.2) * ((a.alpha + b.alpha) * 0.5);
          const mixedHue = 210 + (a.hueShift + b.hueShift) * 0.25;

          context.strokeStyle = `hsla(${mixedHue.toFixed(1)}, 78%, 66%, ${alpha.toFixed(3)})`;
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }

      for (let index = 0; index < projected.length; index += 1) {
        const node = projected[index];
        const hue = node.side < 0 ? 210 + node.hueShift : 36 + node.hueShift * 0.35;
        const saturation = node.side < 0 ? 78 : 72;
        const lightness = node.side < 0 ? 70 : 66;

        context.fillStyle = `hsla(${hue.toFixed(1)}, ${saturation}%, ${lightness}%, ${node.alpha.toFixed(3)})`;
        context.beginPath();
        context.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        context.fill();
      }

      context.strokeStyle = `rgba(196, 162, 101, ${reducedMotion ? 0.14 : 0.22})`;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(centerX, centerY - scaleY * 0.58);
      context.bezierCurveTo(
        centerX - scaleX * 0.06,
        centerY - scaleY * 0.25,
        centerX + scaleX * 0.07,
        centerY + scaleY * 0.08,
        centerX,
        centerY + scaleY * 0.5
      );
      context.stroke();

      schedule();
    };

    const pointerTarget: Window | HTMLElement = heroSection instanceof HTMLElement ? heroSection : window;

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', handleVisibility);
    pointerTarget.addEventListener('pointermove', handlePointerMove as EventListener, { passive: true });
    pointerTarget.addEventListener('pointerdown', handlePointerMove as EventListener, { passive: true });
    if (heroSection instanceof HTMLElement) {
      heroSection.addEventListener('pointerleave', handlePointerLeave);
      observer = new IntersectionObserver(
        ([entry]) => {
          heroInView = entry.isIntersecting;
          if (!heroInView) {
            stop();
            return;
          }
          schedule();
        },
        { threshold: 0.05 }
      );
      observer.observe(heroSection);
    }

    resize();
    schedule();

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
      pointerTarget.removeEventListener('pointermove', handlePointerMove as EventListener);
      pointerTarget.removeEventListener('pointerdown', handlePointerMove as EventListener);
      if (heroSection instanceof HTMLElement) {
        heroSection.removeEventListener('pointerleave', handlePointerLeave);
      }
      observer?.disconnect();
      motionQuery.removeEventListener('change', handleMotion);
    };
  }, []);

  return (
    <div className="hero-brain-layer" aria-hidden>
      <canvas ref={canvasRef} className="hero-brain-canvas" />
    </div>
  );
}


'use client';

import { useEffect, useMemo, useRef } from 'react';

type RGB = { r: number; g: number; b: number };
type Point = {
  x0: number;
  y0: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  seed: number;
  boundary: boolean;
};

type Intensity = 'low' | 'medium' | 'high';

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function hexToRgb(hex: string): RGB {
  const trimmed = hex.replace('#', '').trim();
  const normalized = trimmed.length === 3 ? trimmed.split('').map((char) => char + char).join('') : trimmed;
  const parsed = Number.parseInt(normalized, 16);
  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255
  };
}

function mix(a: RGB, b: RGB, t: number): RGB {
  const ratio = clamp(t, 0, 1);
  return {
    r: Math.round(a.r + (b.r - a.r) * ratio),
    g: Math.round(a.g + (b.g - a.g) * ratio),
    b: Math.round(a.b + (b.b - a.b) * ratio)
  };
}

function superellipsePoint(theta: number, a: number, b: number, n: number) {
  const cosTheta = Math.cos(theta);
  const sinTheta = Math.sin(theta);
  return {
    x: a * Math.sign(cosTheta) * Math.pow(Math.abs(cosTheta), 2 / n),
    y: b * Math.sign(sinTheta) * Math.pow(Math.abs(sinTheta), 2 / n)
  };
}

function insideBrain(nx: number, ny: number) {
  const exponent = 2.6;
  const axisX = 1.05;
  const axisY = 1.25;
  const lobeShift = 0.55;

  const leftLobe =
    Math.pow(Math.abs((nx + lobeShift) / axisX), exponent) + Math.pow(Math.abs(ny / axisY), exponent) <= 1;
  const rightLobe =
    Math.pow(Math.abs((nx - lobeShift) / axisX), exponent) + Math.pow(Math.abs(ny / axisY), exponent) <= 1;

  const stemX = nx / 0.35;
  const stemY = (ny + 1.22) / 0.35;
  const stem = stemX * stemX + stemY * stemY <= 1;

  const bounded = ny <= 1.3 && ny >= -1.55;
  const groove = Math.abs(nx) < 0.12 && ny > -0.15;

  return bounded && (leftLobe || rightLobe || stem) && !groove;
}

function removeMediaListener(query: MediaQueryList, listener: (event: MediaQueryListEvent) => void) {
  if (query.removeEventListener) {
    query.removeEventListener('change', listener);
    return;
  }
  query.removeListener(listener);
}

function addMediaListener(query: MediaQueryList, listener: (event: MediaQueryListEvent) => void) {
  if (query.addEventListener) {
    query.addEventListener('change', listener);
    return;
  }
  query.addListener(listener);
}

export default function BrainMeshCanvas({ className, intensity = 'medium' }: { className?: string; intensity?: Intensity }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const palette = useMemo(
    () => ({
      ink: hexToRgb('#111318'),
      accent: hexToRgb('#2D7C6F'),
      highlight: hexToRgb('#B08D57')
    }),
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionQuery.matches;

    let width = 1;
    let height = 1;
    let rafId = 0;
    let inView = true;
    let pageVisible = !document.hidden;
    let lastFrame = performance.now();
    let points: Point[] = [];
    let neighbors: number[][] = [];

    const pointer = {
      x: 0,
      y: 0,
      active: false,
      pulseStart: -1
    };

    const stop = () => {
      if (!rafId) return;
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    };

    const canRender = () => inView && pageVisible;

    const draw = (timestamp: number) => {
      context.clearRect(0, 0, width, height);
      context.globalAlpha = 0.7;

      const pulseAge = pointer.pulseStart < 0 ? Number.POSITIVE_INFINITY : timestamp - pointer.pulseStart;
      const pulseStrength = clamp(1 - pulseAge / 900, 0, 1);
      const maxDistance = Math.min(width, height) * 0.18;

      for (let index = 0; index < points.length; index += 1) {
        const current = points[index];
        const links = neighbors[index] ?? [];

        for (const targetIndex of links) {
          if (targetIndex <= index) continue;

          const target = points[targetIndex];
          const dx = target.x - current.x;
          const dy = target.y - current.y;
          const distance = Math.hypot(dx, dy);

          const baseRatio = clamp(1 - distance / maxDistance, 0, 1);
          let pointerBoost = 0;
          if (pointer.active) {
            const midX = (current.x + target.x) * 0.5;
            const midY = (current.y + target.y) * 0.5;
            const pointerDistance = Math.hypot(midX - pointer.x, midY - pointer.y);
            pointerBoost = clamp(1 - pointerDistance / (Math.min(width, height) * 0.22), 0, 1) * 0.65;
          }

          let pulseBoost = 0;
          if (pulseStrength > 0) {
            const midX = (current.x + target.x) * 0.5;
            const midY = (current.y + target.y) * 0.5;
            const pointerDistance = Math.hypot(midX - pointer.x, midY - pointer.y);
            const ringDistance = Math.abs(pointerDistance - pulseAge * 0.22);
            pulseBoost = clamp(1 - ringDistance / 60, 0, 1) * 0.8 * pulseStrength;
          }

          const phase = timestamp * 0.00055 + (current.seed + target.seed) * 6;
          const oscillation = 0.5 + 0.5 * Math.sin(phase);
          const stroke = mix(palette.accent, palette.highlight, oscillation);
          const alpha = (0.06 + baseRatio * 0.2) + pointerBoost * 0.2 + pulseBoost * 0.25;
          if (alpha <= 0.01) continue;

          context.strokeStyle = `rgba(${stroke.r}, ${stroke.g}, ${stroke.b}, ${clamp(alpha, 0, 0.65)})`;
          context.lineWidth = current.boundary || target.boundary ? 1.15 : 0.85;
          context.beginPath();
          context.moveTo(current.x, current.y);
          context.lineTo(target.x, target.y);
          context.stroke();
        }
      }

      for (const node of points) {
        const radius = node.boundary ? 2.1 : 1.6;
        const glowPhase = timestamp * 0.0007 + node.seed * 8;
        const glow = 0.1 + 0.08 * (0.5 + 0.5 * Math.sin(glowPhase));

        let boost = 0;
        if (pointer.active) {
          const pointerDistance = Math.hypot(node.x - pointer.x, node.y - pointer.y);
          boost = clamp(1 - pointerDistance / (Math.min(width, height) * 0.22), 0, 1);
        }

        const color = mix(palette.ink, palette.accent, node.boundary ? 0.75 : 0.55);
        const alpha = clamp(glow + boost * 0.25, 0.06, 0.55);
        context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
        context.beginPath();
        context.arc(node.x, node.y, radius, 0, Math.PI * 2);
        context.fill();
      }

      context.globalAlpha = 1;
    };

    const stepPhysics = (delta: number, timestamp: number) => {
      const minDimension = Math.min(width, height);
      const interactionRadius = minDimension * 0.22;

      const spring = 0.015;
      const damping = 0.9;
      const driftAmplitude = 0.35;
      const time = timestamp * 0.001;

      for (const point of points) {
        point.vx += (point.x0 - point.x) * spring;
        point.vy += (point.y0 - point.y) * spring;

        point.vx += Math.sin(time + point.seed * 10) * driftAmplitude * 0.002;
        point.vy += Math.cos(time * 0.9 + point.seed * 10) * driftAmplitude * 0.002;

        if (pointer.active) {
          const dx = point.x - pointer.x;
          const dy = point.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance > 0.001 && distance < interactionRadius) {
            const strength = (1 - distance / interactionRadius) * (point.boundary ? 0.18 : 0.3);
            point.vx += (dx / distance) * strength;
            point.vy += (dy / distance) * strength;
          }
        }

        point.vx *= damping;
        point.vy *= damping;
        point.x += point.vx * (delta / 16.67);
        point.y += point.vy * (delta / 16.67);
      }
    };

    const frame = (timestamp: number) => {
      rafId = 0;
      if (!canRender()) return;

      const delta = clamp(timestamp - lastFrame, 8, 34);
      lastFrame = timestamp;

      if (!reducedMotion) {
        stepPhysics(delta, timestamp);
      }
      draw(timestamp);

      if (!reducedMotion) {
        rafId = window.requestAnimationFrame(frame);
      }
    };

    const schedule = () => {
      if (reducedMotion || rafId || !canRender()) return;
      rafId = window.requestAnimationFrame(frame);
    };

    const rebuild = () => {
      const rect = wrap.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));

      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const baseCount = intensity === 'low' ? 120 : intensity === 'high' ? 260 : 190;
      const isMobile = width < 768;
      const pointCount = isMobile ? Math.round(baseCount * 0.75) : baseCount;

      const centerX = width * 0.52;
      const centerY = height * 0.52;
      const scale = Math.min(width, height) * 0.3;
      const builtPoints: Point[] = [];

      const boundaryCount = Math.round(pointCount * 0.35);
      const exponent = 2.6;
      const axisX = 1.05;
      const axisY = 1.25;
      const lobeShift = 0.55;

      for (let i = 0; i < boundaryCount; i += 1) {
        const theta = (i / boundaryCount) * Math.PI * 2;
        const boundary = superellipsePoint(theta, axisX, axisY, exponent);
        const side = i % 2 === 0 ? -1 : 1;
        const nx = boundary.x + side * lobeShift;
        const ny = boundary.y;
        const px = centerX + nx * scale;
        const py = centerY + ny * scale;

        builtPoints.push({
          x0: px,
          y0: py,
          x: px + (Math.random() - 0.5) * 8,
          y: py + (Math.random() - 0.5) * 8,
          vx: 0,
          vy: 0,
          seed: Math.random(),
          boundary: true
        });
      }

      let tries = 0;
      while (builtPoints.length < pointCount && tries < pointCount * 200) {
        tries += 1;
        const nx = Math.random() * 2.8 - 1.4;
        const ny = Math.random() * 2.9 - 1.55;
        if (!insideBrain(nx, ny)) continue;

        const px = centerX + nx * scale;
        const py = centerY + ny * scale;

        builtPoints.push({
          x0: px,
          y0: py,
          x: px + (Math.random() - 0.5) * 10,
          y: py + (Math.random() - 0.5) * 10,
          vx: 0,
          vy: 0,
          seed: Math.random(),
          boundary: false
        });
      }

      const maxDistance = scale * (isMobile ? 0.55 : 0.5);
      const maxDistanceSq = maxDistance * maxDistance;
      const neighborCount = isMobile ? 3 : 4;
      const builtNeighbors: number[][] = Array.from({ length: builtPoints.length }, () => []);

      for (let i = 0; i < builtPoints.length; i += 1) {
        const distances: Array<[number, number]> = [];
        for (let j = 0; j < builtPoints.length; j += 1) {
          if (i === j) continue;
          const dx = builtPoints[i].x0 - builtPoints[j].x0;
          const dy = builtPoints[i].y0 - builtPoints[j].y0;
          const distanceSq = dx * dx + dy * dy;
          if (distanceSq <= maxDistanceSq) {
            distances.push([distanceSq, j]);
          }
        }

        distances.sort((a, b) => a[0] - b[0]);
        builtNeighbors[i] = distances.slice(0, neighborCount).map((entry) => entry[1]);
      }

      points = builtPoints;
      neighbors = builtNeighbors;

      pointer.x = width * 0.55;
      pointer.y = height * 0.45;
      pointer.active = false;

      draw(performance.now());
    };

    const updatePointer = (clientX: number, clientY: number, withPulse: boolean) => {
      const rect = wrap.getBoundingClientRect();
      const inside =
        clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;

      pointer.active = inside;
      if (!inside) {
        if (reducedMotion) {
          draw(performance.now());
        }
        return;
      }

      pointer.x = clientX - rect.left;
      pointer.y = clientY - rect.top;
      if (withPulse) {
        pointer.pulseStart = performance.now();
      }

      if (reducedMotion) {
        draw(performance.now());
      } else {
        schedule();
      }
    };

    const handlePointerMove = (event: PointerEvent) => updatePointer(event.clientX, event.clientY, false);
    const handlePointerDown = (event: PointerEvent) => updatePointer(event.clientX, event.clientY, true);
    const handleVisibilityChange = () => {
      pageVisible = !document.hidden;
      if (!canRender()) {
        stop();
        return;
      }
      if (reducedMotion) {
        draw(performance.now());
      } else {
        schedule();
      }
    };

    const handleMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      if (reducedMotion) {
        stop();
        draw(performance.now());
        return;
      }
      schedule();
    };

    const resizeObserver = new ResizeObserver(() => {
      rebuild();
      if (!reducedMotion) {
        schedule();
      }
    });
    resizeObserver.observe(wrap);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        inView = entries.some((entry) => entry.isIntersecting);
        if (!canRender()) {
          stop();
          return;
        }
        if (reducedMotion) {
          draw(performance.now());
        } else {
          schedule();
        }
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(wrap);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    addMediaListener(motionQuery, handleMotionChange);

    rebuild();
    if (!reducedMotion) {
      schedule();
    }

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      removeMediaListener(motionQuery, handleMotionChange);
    };
  }, [intensity, palette]);

  return (
    <div ref={wrapRef} className={className} style={{ position: 'absolute', inset: 0 }}>
      <canvas ref={canvasRef} className="brain-bg-canvas" aria-hidden="true" />
    </div>
  );
}

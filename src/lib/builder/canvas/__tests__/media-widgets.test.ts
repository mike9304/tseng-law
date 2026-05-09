import { describe, expect, it } from 'vitest';
import {
  createDefaultCanvasNodeStyle,
  normalizeCanvasDocument,
} from '@/lib/builder/canvas/types';

describe('M12 media widget schema', () => {
  it('preserves Wix-style media controls through normalization', () => {
    const normalized = normalizeCanvasDocument({
      version: 1,
      locale: 'ko',
      updatedAt: '2026-05-10T00:00:00.000Z',
      updatedBy: 'm12-test',
      stageWidth: 1280,
      stageHeight: 880,
      nodes: [
        {
          id: 'image-media',
          kind: 'image',
          rect: { x: 100, y: 100, width: 420, height: 260 },
          style: createDefaultCanvasNodeStyle(),
          zIndex: 0,
          rotation: 0,
          locked: false,
          visible: true,
          content: {
            src: '/images/header-skyline-buildings.webp',
            alt: 'Media image',
            fit: 'cover',
            clickAction: 'lightbox',
            hoverSrc: '/images/header-skyline-buildings.png',
            hotspots: [{ x: 35, y: 48, label: '상담 포인트', href: '/ko/contact' }],
            compare: {
              enabled: true,
              beforeSrc: '/images/header-skyline-buildings.webp',
              afterSrc: '/images/header-skyline-buildings.png',
              position: 60,
            },
            svg: {
              enabled: true,
              name: 'scales',
              color: { kind: 'token', token: 'primary' },
            },
            gif: { provider: 'giphy', query: 'law office' },
          },
        },
        {
          id: 'video-box',
          kind: 'video',
          rect: { x: 100, y: 390, width: 420, height: 236 },
          style: createDefaultCanvasNodeStyle(),
          zIndex: 1,
          rotation: 0,
          locked: false,
          visible: true,
          content: {
            url: '/videos/intro.mp4',
            autoplay: true,
            loop: true,
            muted: true,
            controls: false,
            thumbnail: '/images/header-skyline-buildings.webp',
            mode: 'background',
          },
        },
        {
          id: 'audio-player',
          kind: 'audio',
          rect: { x: 560, y: 100, width: 360, height: 150 },
          style: createDefaultCanvasNodeStyle(),
          zIndex: 2,
          rotation: 0,
          locked: false,
          visible: true,
          content: {
            provider: 'spotify',
            src: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT',
            title: 'Podcast embed',
            artist: 'Spotify',
            autoplay: false,
            controls: true,
          },
        },
        {
          id: 'lottie-motion',
          kind: 'lottie',
          rect: { x: 560, y: 290, width: 260, height: 220 },
          style: createDefaultCanvasNodeStyle(),
          zIndex: 3,
          rotation: 0,
          locked: false,
          visible: true,
          content: {
            src: '',
            label: 'Consultation motion',
            autoplay: true,
            loop: true,
            speed: 1.5,
          },
        },
        {
          id: 'icon-library',
          kind: 'icon',
          rect: { x: 860, y: 100, width: 96, height: 96 },
          style: createDefaultCanvasNodeStyle(),
          zIndex: 4,
          rotation: 0,
          locked: false,
          visible: true,
          content: {
            name: 'scale',
            size: 58,
            color: { kind: 'token', token: 'primary' },
            set: 'lucide',
          },
        },
      ],
    }, 'ko');

    expect(normalized.nodes).toHaveLength(5);
    const imageNode = normalized.nodes.find((node) => node.id === 'image-media');
    expect(imageNode?.kind).toBe('image');
    if (imageNode?.kind === 'image') {
      expect(imageNode.content.clickAction).toBe('lightbox');
      expect(imageNode.content.hotspots?.[0]?.label).toBe('상담 포인트');
      expect(imageNode.content.compare?.position).toBe(60);
      expect(imageNode.content.svg?.name).toBe('scales');
      expect(imageNode.content.gif?.provider).toBe('giphy');
    }

    const videoNode = normalized.nodes.find((node) => node.id === 'video-box');
    expect(videoNode?.kind).toBe('video');
    if (videoNode?.kind === 'video') {
      expect(videoNode.content.mode).toBe('background');
      expect(videoNode.content.controls).toBe(false);
    }

    const audioNode = normalized.nodes.find((node) => node.id === 'audio-player');
    expect(audioNode?.kind).toBe('audio');
    if (audioNode?.kind === 'audio') {
      expect(audioNode.content.provider).toBe('spotify');
    }

    const lottieNode = normalized.nodes.find((node) => node.id === 'lottie-motion');
    expect(lottieNode?.kind).toBe('lottie');
    if (lottieNode?.kind === 'lottie') {
      expect(lottieNode.content.speed).toBe(1.5);
    }

    const iconNode = normalized.nodes.find((node) => node.id === 'icon-library');
    expect(iconNode?.kind).toBe('icon');
    if (iconNode?.kind === 'icon') {
      expect(iconNode.content.set).toBe('lucide');
    }
  });
});

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type {
  BuilderAudioCanvasNode,
  BuilderLottieCanvasNode,
  BuilderVideoCanvasNode,
} from '@/lib/builder/canvas/types';
import audioComponent from '../audio';
import lottieComponent from '../lottie';
import { AUDIO_LEGACY_DEFAULTS, getMediaWidgetsCopy, localizedAudioTitle } from '../media-widgets-copy';
import videoComponent from '../video';

const componentRoot = join(process.cwd(), 'src/lib/builder/components');

describe('media widgets localization', () => {
  it('returns localized media widget copy in zh-hant', () => {
    const copy = getMediaWidgetsCopy('zh-hant');

    expect(copy.audio.fallbackTitle).toBe('音訊軌');
    expect(copy.audio.emptyUrl).toBe('請輸入音訊 URL');
    expect(copy.audio.providers.file).toBe('音訊檔案');
    expect(localizedAudioTitle(AUDIO_LEGACY_DEFAULTS.title, copy.audio.fallbackTitle)).toBe('音訊軌');
    expect(copy.video.backgroundBadge).toBe('背景影片');
    expect(copy.video.inspector.modes.box).toBe('影片框');
    expect(copy.video.inspector.urlPlaceholder).toBe('/videos/intro.mp4 或 https://youtu.be/...');
    expect(copy.video.inspector.posterPlaceholder).toBe('/images/video-poster.jpg');
    expect(copy.lottie.fallbackLabel).toBe('Lottie 動畫');
    expect(copy.lottie.inspector.urlPlaceholder).toBe('https://lottie.host/embed/<id>/<hash>.lottie');
    expect(copy.lottie.inspector.emptyHint.spaceAfterSource).toBe(true);
    expect(copy.lottie.inspector.emptyHint.spaceBeforeFinal).toBe(false);
    expect(copy.lottie.inspector.speed(1.25)).toBe('速度 1.25x');
  });

  it('renders localized audio runtime and inspector chrome in zh-hant', () => {
    const Render = audioComponent.Render as React.ComponentType<{
      node: BuilderAudioCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const Inspector = audioComponent.Inspector as React.ComponentType<{
      node: BuilderAudioCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const node = {
      kind: 'audio',
      content: {
        provider: 'file',
        src: '',
        title: AUDIO_LEGACY_DEFAULTS.title,
        artist: '',
        autoplay: false,
        controls: true,
      },
    } as unknown as BuilderAudioCanvasNode;

    expect(audioComponent.defaultContent).toMatchObject({
      title: AUDIO_LEGACY_DEFAULTS.title,
    });

    const renderHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" />);
    expect(renderHtml).toContain('音訊軌');
    expect(renderHtml).not.toContain('Audio track');
    expect(renderHtml).toContain('Builder 音訊');
    expect(renderHtml).toContain('請輸入音訊 URL');

    const inspectorHtml = renderToStaticMarkup(<Inspector node={node} locale="zh-hant" onUpdate={() => undefined} />);
    expect(inspectorHtml).toContain('data-builder-audio-inspector="true"');
    expect(inspectorHtml).toContain('服務商');
    expect(inspectorHtml).toContain('音訊檔案');
    expect(inspectorHtml).toContain('來源 URL');
    expect(inspectorHtml).toContain('藝人 / 來源');
    expect(inspectorHtml).toContain('value="音訊軌"');
    expect(inspectorHtml).not.toContain('value="Audio track"');
    expect(inspectorHtml).toContain('顯示控制列');
    expect(inspectorHtml).toContain('自動播放');
  });

  it('keeps the audio inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'audio/index.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'audio/AudioInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './AudioInspector.module.css';");
    expect(source).toContain('data-builder-audio-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={styles.checkboxRow}',
    ]) {
      expect(source).toContain(classUsage);
    }
    expect(source).not.toContain("style={{ display: 'flex', alignItems: 'center', gap: 8 }}");
    expect(css).toContain('.control:focus-visible');
    expect(css).toContain('.checkboxRow');
  });

  it('renders localized video runtime and inspector chrome in zh-hant', () => {
    const Render = videoComponent.Render as React.ComponentType<{
      node: BuilderVideoCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const Inspector = videoComponent.Inspector as React.ComponentType<{
      node: BuilderVideoCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const node = {
      kind: 'video',
      content: {
        url: '/videos/intro.mp4',
        autoplay: false,
        loop: false,
        muted: true,
        controls: false,
        thumbnail: '',
        mode: 'background',
      },
    } as unknown as BuilderVideoCanvasNode;

    const renderHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" />);
    expect(renderHtml).toContain('背景影片');

    const inspectorHtml = renderToStaticMarkup(<Inspector node={node} locale="zh-hant" onUpdate={() => undefined} />);
    expect(inspectorHtml).toContain('data-builder-video-inspector="true"');
    expect(inspectorHtml).toContain('影片 URL');
    expect(inspectorHtml).toContain('模式');
    expect(inspectorHtml).toContain('影片框');
    expect(inspectorHtml).toContain('背景影片');
    expect(inspectorHtml).toContain('封面 / 縮圖');
    expect(inspectorHtml).toContain('placeholder="/videos/intro.mp4 或 https://youtu.be/..."');
    expect(inspectorHtml).toContain('placeholder="/images/video-poster.jpg"');
    expect(inspectorHtml).toContain('循環播放');
    expect(inspectorHtml).toContain('靜音');
    expect(inspectorHtml).toContain('顯示控制列');
    expect(inspectorHtml).not.toContain('/videos/intro.mp4 or https://youtu.be/...');
  });

  it('keeps the video inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'video/index.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'video/VideoInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './VideoInspector.module.css';");
    expect(source).toContain('data-builder-video-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={styles.checkboxRow}',
    ]) {
      expect(source).toContain(classUsage);
    }
    expect(source).not.toContain("style={{ display: 'flex', alignItems: 'center', gap: 8 }}");
    expect(css).toContain('.control:focus-visible');
    expect(css).toContain('.checkboxRow');
  });

  it('renders localized lottie runtime and inspector chrome in zh-hant', () => {
    const Render = lottieComponent.Render as React.ComponentType<{
      node: BuilderLottieCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const Inspector = lottieComponent.Inspector as React.ComponentType<{
      node: BuilderLottieCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const node = {
      kind: 'lottie',
      content: {
        src: '',
        label: '',
        autoplay: true,
        loop: true,
        speed: 1,
      },
    } as unknown as BuilderLottieCanvasNode;

    const renderHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" />);
    expect(renderHtml).toContain('Lottie 動畫');

    const inspectorHtml = renderToStaticMarkup(<Inspector node={node} locale="zh-hant" onUpdate={() => undefined} />);
    expect(inspectorHtml).toContain('data-builder-lottie-inspector="true"');
    expect(inspectorHtml).toContain('Lottie URL');
    expect(inspectorHtml).toContain('placeholder="https://lottie.host/embed/&lt;id&gt;/&lt;hash&gt;.lottie"');
    expect(inspectorHtml).toContain('選擇動畫後，複製');
    expect(inspectorHtml).toContain('lottie.host</code>，再使用相同格式的嵌入 URL。');
    expect(inspectorHtml).toContain('標籤');
    expect(inspectorHtml).toContain('速度 1x');
    expect(inspectorHtml).toContain('自動播放');
    expect(inspectorHtml).toContain('循環播放');
  });

  it('keeps the lottie inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'lottie/index.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'lottie/LottieInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './LottieInspector.module.css';");
    expect(source).toContain('data-builder-lottie-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={styles.range}',
      'className={styles.helpText}',
      'className={styles.warningText}',
      'className={styles.checkboxRow}',
    ]) {
      expect(source).toContain(classUsage);
    }
    expect(source).not.toContain("style={{ display: 'flex', alignItems: 'center', gap: 8 }}");
    expect(source).not.toContain("style={{ margin: 0, color: '#64748b', fontSize: '0.72rem', lineHeight: 1.5 }}");
    expect(source).not.toContain("style={{ color: '#1d4ed8', textDecoration: 'underline' }}");
    expect(css).toContain('.control:focus-visible');
    expect(css).toContain('.range:focus-visible');
    expect(css).toContain('.checkboxRow');
  });

  it('renders Korean Lottie empty hint without heuristic spacing around the source link', () => {
    const Inspector = lottieComponent.Inspector as React.ComponentType<{
      node: BuilderLottieCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const node = {
      kind: 'lottie',
      content: {
        src: '',
        label: '',
        autoplay: true,
        loop: true,
        speed: 1,
      },
    } as unknown as BuilderLottieCanvasNode;

    const inspectorHtml = renderToStaticMarkup(<Inspector node={node} locale="ko" onUpdate={() => undefined} />);
    expect(inspectorHtml).toContain('lottiefiles.com</a>에서 애니메이션을 고른 뒤');
  });
});

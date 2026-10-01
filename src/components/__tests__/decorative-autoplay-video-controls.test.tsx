import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import DecorativeAutoplayVideo, {
  DECORATIVE_VIDEO_CONTROL_LABELS,
  handleDecorativeVideoCanPlay,
  resolveDecorativeVideoPresentation,
  resolveDecorativeVideoControlLabel,
  runDecorativeVideoControlActivation,
  shouldAutoplayDecorativeVideo,
  syncDecorativeVideoPlayback,
  type DecorativeVideoPlaybackState,
} from '../DecorativeAutoplayVideo';

function createVideoDouble(currentTime = 6.5) {
  return {
    currentTime,
    pause: vi.fn(),
    play: vi.fn(() => Promise.resolve()),
  };
}

describe('DecorativeAutoplayVideo playback controls', () => {
  it('pauses and resumes a loop without confusing user intent with viewport pauses', () => {
    const video = createVideoDouble();
    const playing: DecorativeVideoPlaybackState = {
      userPaused: false,
      ended: false,
    };

    const userPaused = runDecorativeVideoControlActivation(
      video,
      playing,
      true,
    );
    expect(userPaused).toEqual({ userPaused: true, ended: false });
    expect(video.pause).toHaveBeenCalledTimes(1);
    expect(video.play).not.toHaveBeenCalled();

    video.pause.mockClear();
    syncDecorativeVideoPlayback(video, {
      inViewport: false,
      ...userPaused,
    });
    syncDecorativeVideoPlayback(video, {
      inViewport: true,
      ...userPaused,
    });
    expect(video.pause).toHaveBeenCalledTimes(2);
    expect(video.play).not.toHaveBeenCalled();

    const resumed = runDecorativeVideoControlActivation(
      video,
      userPaused,
      true,
    );
    expect(resumed).toEqual({ userPaused: false, ended: false });
    expect(video.play).toHaveBeenCalledTimes(1);
  });

  it('keeps a pause across a breakpoint change that remounts the other encoding', () => {
    // Visitor pauses at 390x844, then rotates to 844x390: the keyed <video> remounts with
    // the desktop encoding. The replacement must not autoplay or resume on canplay.
    const playing: DecorativeVideoPlaybackState = { userPaused: false, ended: false };
    const paused = runDecorativeVideoControlActivation(createVideoDouble(), playing, true);
    expect(paused).toEqual({ userPaused: true, ended: false });

    const replacement = createVideoDouble(0);
    expect(shouldAutoplayDecorativeVideo(paused)).toBe(false);
    syncDecorativeVideoPlayback(replacement, { inViewport: true, ...paused });
    handleDecorativeVideoCanPlay(replacement, { inViewport: true, ...paused });
    expect(replacement.play).not.toHaveBeenCalled();
    expect(replacement.pause).toHaveBeenCalledTimes(2);
    expect(resolveDecorativeVideoControlLabel(paused, DECORATIVE_VIDEO_CONTROL_LABELS['zh-hant'])).toBe(
      DECORATIVE_VIDEO_CONTROL_LABELS['zh-hant'].play,
    );

    const finished: DecorativeVideoPlaybackState = { userPaused: false, ended: true };
    const replay = createVideoDouble(0);
    expect(shouldAutoplayDecorativeVideo(finished)).toBe(false);
    handleDecorativeVideoCanPlay(replay, { inViewport: true, ...finished });
    expect(replay.pause).toHaveBeenCalledTimes(1);

    // Playing visitors still get autoplay, and canplay leaves an in-view video alone.
    const live = createVideoDouble(0);
    expect(shouldAutoplayDecorativeVideo(playing)).toBe(true);
    handleDecorativeVideoCanPlay(live, { inViewport: true, ...playing });
    expect(live.pause).not.toHaveBeenCalled();
    handleDecorativeVideoCanPlay(live, { inViewport: false, ...playing });
    expect(live.pause).toHaveBeenCalledTimes(1);
  });

  it('shows the poster until the mounted element has a frame, and keeps the control usable', () => {
    // First load on a phone (mount 0): nothing ready yet — poster only, no control.
    expect(resolveDecorativeVideoPresentation({
      shouldMountVideo: true, readyMountId: null, mountId: 0, controlRevealed: false,
    })).toEqual({ videoReady: false, showControl: false });
    // Mount 0 ready.
    expect(resolveDecorativeVideoPresentation({
      shouldMountVideo: true, readyMountId: 0, mountId: 0, controlRevealed: true,
    })).toEqual({ videoReady: true, showControl: true });
    // Rotated while paused (mount 1, no frame in WebKit): poster back, Play control stays.
    expect(resolveDecorativeVideoPresentation({
      shouldMountVideo: true, readyMountId: 0, mountId: 1, controlRevealed: true,
    })).toEqual({ videoReady: false, showControl: true });
    // Rotated back to the first encoding (mount 2): still not ready — the old mount's readiness
    // must not carry over even though the encoding matches again (Astra round 4).
    expect(resolveDecorativeVideoPresentation({
      shouldMountVideo: true, readyMountId: 0, mountId: 2, controlRevealed: true,
    })).toEqual({ videoReady: false, showControl: true });
    // After a media error: no readiness, no control.
    expect(resolveDecorativeVideoPresentation({
      shouldMountVideo: true, readyMountId: null, mountId: 2, controlRevealed: false,
    })).toEqual({ videoReady: false, showControl: false });
    // Reduced motion / save-data: no video, no control.
    expect(resolveDecorativeVideoPresentation({
      shouldMountVideo: false, readyMountId: 0, mountId: 0, controlRevealed: true,
    })).toEqual({ videoReady: false, showControl: false });
  });

  it('re-applies playback state to the replacement element after a source switch', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'src/components/DecorativeAutoplayVideo.tsx'),
      'utf8',
    );
    expect(source).toContain('}, [inViewport, playbackState, shouldMountVideo, useMobileSources]);');
    expect(source).toContain('handleDecorativeVideoCanPlay(videoRef.current, {');
  });

  it('replays a completed one-shot from the beginning', () => {
    const video = createVideoDouble();

    const replaying = runDecorativeVideoControlActivation(
      video,
      { userPaused: false, ended: true },
      true,
    );

    expect(replaying).toEqual({ userPaused: false, ended: false });
    expect(video.currentTime).toBe(0);
    expect(video.play).toHaveBeenCalledTimes(1);
    expect(video.pause).not.toHaveBeenCalled();
  });

  it('keeps the control absent from the poster-only server and preference fallback', () => {
    const html = renderToStaticMarkup(
      <DecorativeAutoplayVideo
        webmSrc="/videos/example.webm"
        mp4Src="/videos/example.mp4"
        poster="/images/example.webp"
        alt=""
        width={1600}
        height={900}
        controlLabels={DECORATIVE_VIDEO_CONTROL_LABELS.ko}
      />,
    );

    expect(html).toContain('data-video-mounted="false"');
    expect(html).not.toContain('<video');
    expect(html).not.toContain('<button');
    expect(html).not.toContain('영상 일시정지');
  });

  it.each([
    ['ko', '영상 일시정지', '영상 재생', '영상 다시 보기'],
    ['zh-hant', '暫停影片', '播放影片', '重新播放影片'],
    ['en', 'Pause video', 'Play video', 'Replay video'],
    ['ja', '動画を一時停止', '動画を再生', '動画をもう一度再生'],
  ] as const)(
    'provides visible and aria-ready %s labels for every playback state',
    (locale, pause, play, replay) => {
      const labels = DECORATIVE_VIDEO_CONTROL_LABELS[locale];

      expect(
        resolveDecorativeVideoControlLabel(
          { userPaused: false, ended: false },
          labels,
        ),
      ).toBe(pause);
      expect(
        resolveDecorativeVideoControlLabel(
          { userPaused: true, ended: false },
          labels,
        ),
      ).toBe(play);
      expect(
        resolveDecorativeVideoControlLabel(
          { userPaused: false, ended: true },
          labels,
        ),
      ).toBe(replay);
    },
  );

  it('fails safe to Korean labels if a legacy runtime omits control copy', () => {
    expect(
      resolveDecorativeVideoControlLabel(
        { userPaused: false, ended: false },
        undefined,
      ),
    ).toBe('영상 일시정지');
  });
});

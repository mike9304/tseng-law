import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import DecorativeAutoplayVideo, {
  DECORATIVE_VIDEO_CONTROL_LABELS,
  resolveDecorativeVideoControlLabel,
  runDecorativeVideoControlActivation,
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

import { readFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const CINEMATIC_MEDIA = [
  {
    name: 'Taiwan Central Mountain Range cloud flight v2 desktop',
    poster: 'images/editorial/taiwan-central-mountains-cloud-flight-v2.webp',
    webm: 'videos/taiwan-central-mountains-cloud-flight-v2.webm',
    mp4: 'videos/taiwan-central-mountains-cloud-flight-v2.mp4',
    sizeCeilings: {
      poster: 400_000,
      webm: 6_000_000,
      mp4: 6_000_000,
    },
  },
  {
    name: 'Taiwan Central Mountain Range cloud flight v2 mobile',
    poster:
      'images/editorial/taiwan-central-mountains-cloud-flight-v2-mobile.webp',
    webm: 'videos/taiwan-central-mountains-cloud-flight-v2-mobile.webm',
    mp4: 'videos/taiwan-central-mountains-cloud-flight-v2-mobile.mp4',
    sizeCeilings: {
      poster: 300_000,
      webm: 3_000_000,
      mp4: 3_000_000,
    },
  },
  {
    name: 'Taichung courthouse civic daylight v2',
    poster: 'images/editorial/taichung-courthouse-civic-daylight-v2.webp',
    webm: 'videos/taichung-courthouse-civic-daylight-v2.webm',
    mp4: 'videos/taichung-courthouse-civic-daylight-v2.mp4',
    sizeCeilings: {
      poster: 400_000,
      webm: 6_500_000,
      mp4: 6_500_000,
    },
  },
  {
    name: 'Taichung courthouse civic daylight v2 mobile',
    poster:
      'images/editorial/taichung-courthouse-civic-daylight-v2-mobile.webp',
    webm: 'videos/taichung-courthouse-civic-daylight-v2-mobile.webm',
    mp4: 'videos/taichung-courthouse-civic-daylight-v2-mobile.mp4',
    sizeCeilings: {
      poster: 300_000,
      webm: 2_000_000,
      mp4: 2_000_000,
    },
  },
  {
    name: 'Taiwan Sanheyuan modern daylight v2',
    poster: 'images/editorial/taiwan-sanheyuan-modern-daylight-v2.webp',
    webm: 'videos/taiwan-sanheyuan-modern-daylight-v2.webm',
    mp4: 'videos/taiwan-sanheyuan-modern-daylight-v2.mp4',
    sizeCeilings: {
      poster: 400_000,
      webm: 7_000_000,
      mp4: 7_000_000,
    },
  },
  {
    name: 'Taiwan Sanheyuan modern daylight v2 mobile',
    poster:
      'images/editorial/taiwan-sanheyuan-modern-daylight-v2-mobile.webp',
    webm: 'videos/taiwan-sanheyuan-modern-daylight-v2-mobile.webm',
    mp4: 'videos/taiwan-sanheyuan-modern-daylight-v2-mobile.mp4',
    sizeCeilings: {
      poster: 300_000,
      webm: 2_000_000,
      mp4: 2_000_000,
    },
  },
  {
    name: 'Taiwan courtroom calm daylight v2',
    poster: 'images/editorial/taiwan-courtroom-calm-daylight-v2.webp',
    webm: 'videos/taiwan-courtroom-calm-daylight-v2.webm',
    mp4: 'videos/taiwan-courtroom-calm-daylight-v2.mp4',
    sizeCeilings: {
      poster: 400_000,
      webm: 3_000_000,
      mp4: 3_000_000,
    },
  },
  {
    name: 'Taiwan courtroom calm daylight v2 mobile',
    poster: 'images/editorial/taiwan-courtroom-calm-daylight-v2-mobile.webp',
    webm: 'videos/taiwan-courtroom-calm-daylight-v2-mobile.webm',
    mp4: 'videos/taiwan-courtroom-calm-daylight-v2-mobile.mp4',
    sizeCeilings: {
      poster: 200_000,
      webm: 1_000_000,
      mp4: 1_000_000,
    },
  },
  {
    name: 'Pingtung court-inspired daylight',
    poster: 'images/editorial/pingtung-court-daylight.webp',
    webm: 'videos/pingtung-court-daylight.webm',
    mp4: 'videos/pingtung-court-daylight.mp4',
    sizeCeilings: {
      poster: 400_000,
      webm: 6_000_000,
      mp4: 6_000_000,
    },
  },
  {
    name: 'Taiwan courtroom-inspired daylight',
    poster: 'images/editorial/taiwan-courtroom-daylight.webp',
    webm: 'videos/taiwan-courtroom-daylight.webm',
    mp4: 'videos/taiwan-courtroom-daylight.mp4',
    sizeCeilings: {
      poster: 400_000,
      webm: 6_000_000,
      mp4: 6_000_000,
    },
  },
] as const;

const NEW_CINEMATIC_VIDEO_STREAMS = [
  ['videos/taiwan-central-mountains-cloud-flight-v2.mp4', 'h264', 1920, 1080],
  ['videos/taiwan-central-mountains-cloud-flight-v2.webm', 'vp9', 1920, 1080],
  [
    'videos/taiwan-central-mountains-cloud-flight-v2-mobile.mp4',
    'h264',
    720,
    1280,
  ],
  [
    'videos/taiwan-central-mountains-cloud-flight-v2-mobile.webm',
    'vp9',
    720,
    1280,
  ],
  ['videos/taichung-courthouse-civic-daylight-v2.mp4', 'h264', 1920, 1080],
  ['videos/taichung-courthouse-civic-daylight-v2.webm', 'vp9', 1920, 1080],
  [
    'videos/taichung-courthouse-civic-daylight-v2-mobile.mp4',
    'h264',
    720,
    1280,
  ],
  [
    'videos/taichung-courthouse-civic-daylight-v2-mobile.webm',
    'vp9',
    720,
    1280,
  ],
  ['videos/taiwan-sanheyuan-modern-daylight-v2.mp4', 'h264', 1920, 1080],
  ['videos/taiwan-sanheyuan-modern-daylight-v2.webm', 'vp9', 1920, 1080],
  [
    'videos/taiwan-sanheyuan-modern-daylight-v2-mobile.mp4',
    'h264',
    720,
    1280,
  ],
  [
    'videos/taiwan-sanheyuan-modern-daylight-v2-mobile.webm',
    'vp9',
    720,
    1280,
  ],
  ['videos/taiwan-courtroom-calm-daylight-v2.mp4', 'h264', 1920, 1080],
  ['videos/taiwan-courtroom-calm-daylight-v2.webm', 'vp9', 1920, 1080],
  [
    'videos/taiwan-courtroom-calm-daylight-v2-mobile.mp4',
    'h264',
    960,
    540,
  ],
  [
    'videos/taiwan-courtroom-calm-daylight-v2-mobile.webm',
    'vp9',
    960,
    540,
  ],
  ['videos/pingtung-court-daylight.mp4', 'h264', 1920, 1080],
  ['videos/pingtung-court-daylight.webm', 'vp9', 1920, 1080],
  ['videos/taiwan-courtroom-daylight.mp4', 'h264', 1920, 1080],
  ['videos/taiwan-courtroom-daylight.webm', 'vp9', 1920, 1080],
] as const;

const CINEMATIC_POSTERS = [
  [
    'images/editorial/taiwan-central-mountains-cloud-flight-v2.webp',
    1920,
    1080,
  ],
  [
    'images/editorial/taiwan-central-mountains-cloud-flight-v2-mobile.webp',
    720,
    1280,
  ],
  [
    'images/editorial/taichung-courthouse-civic-daylight-v2.webp',
    1920,
    1080,
  ],
  [
    'images/editorial/taichung-courthouse-civic-daylight-v2-mobile.webp',
    720,
    1280,
  ],
  [
    'images/editorial/taiwan-sanheyuan-modern-daylight-v2.webp',
    1920,
    1080,
  ],
  [
    'images/editorial/taiwan-sanheyuan-modern-daylight-v2-mobile.webp',
    720,
    1280,
  ],
  [
    'images/editorial/taiwan-courtroom-calm-daylight-v2.webp',
    1920,
    1080,
  ],
  [
    'images/editorial/taiwan-courtroom-calm-daylight-v2-mobile.webp',
    960,
    540,
  ],
  ['images/editorial/pingtung-court-daylight.webp', 1920, 1080],
  ['images/editorial/taiwan-courtroom-daylight.webp', 1920, 1080],
] as const;

function publicAssetPath(relativePath: string) {
  return path.join(process.cwd(), 'public', relativePath);
}

function probeVideoStream(relativePath: string) {
  const output = execFileSync(
    'ffprobe',
    [
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-show_entries',
      'stream=codec_name,width,height,pix_fmt,r_frame_rate',
      '-of',
      'json',
      publicAssetPath(relativePath),
    ],
    { encoding: 'utf8' },
  );
  return JSON.parse(output) as {
    streams: Array<{
      codec_name: string;
      width: number;
      height: number;
      pix_fmt: string;
      r_frame_rate: string;
    }>;
  };
}

function readTopLevelMp4BoxTypes(file: Buffer) {
  const boxTypes: string[] = [];
  let offset = 0;

  while (offset + 8 <= file.length) {
    const size32 = file.readUInt32BE(offset);
    const type = file.toString('ascii', offset + 4, offset + 8);
    let headerSize = 8;
    let boxSize = size32;

    if (size32 === 1) {
      if (offset + 16 > file.length) break;
      const extendedSize = file.readBigUInt64BE(offset + 8);
      if (extendedSize > BigInt(Number.MAX_SAFE_INTEGER)) break;
      headerSize = 16;
      boxSize = Number(extendedSize);
    } else if (size32 === 0) {
      boxSize = file.length - offset;
    }

    if (boxSize < headerSize || offset + boxSize > file.length) break;

    boxTypes.push(type);
    offset += boxSize;
  }

  return boxTypes;
}

describe('cinematic media asset regression', () => {
  it.each(CINEMATIC_POSTERS)(
    'keeps the cinematic poster %s at its delivery geometry',
    (relativePath, width, height) => {
      const stream = probeVideoStream(relativePath).streams[0];

      expect(stream).toMatchObject({
        codec_name: 'webp',
        width,
        height,
      });
    },
  );

  it.each(NEW_CINEMATIC_VIDEO_STREAMS)(
    'keeps the finalized cinematic encoding %s at its delivery geometry and codec',
    (relativePath, codecName, width, height) => {
      const stream = probeVideoStream(relativePath).streams[0];

      expect(stream).toMatchObject({
        codec_name: codecName,
        width,
        height,
        pix_fmt: 'yuv420p',
        r_frame_rate: '24/1',
      });
    },
  );

  it.each(CINEMATIC_MEDIA)(
    'keeps the $name poster and encodings within their delivery budgets',
    (media) => {
      const { poster, webm, mp4 } = media;
      const { sizeCeilings } = media;
      const assets = [
        [poster, sizeCeilings.poster],
        [webm, sizeCeilings.webm],
        [mp4, sizeCeilings.mp4],
      ] as const;

      for (const [relativePath, maximumBytes] of assets) {
        const bytes = statSync(publicAssetPath(relativePath)).size;
        expect(bytes, relativePath).toBeGreaterThan(0);
        expect(bytes, relativePath).toBeLessThan(maximumBytes);
      }
    },
  );

  it.each(CINEMATIC_MEDIA)(
    'keeps the $name MP4 optimized for progressive playback',
    ({ mp4 }) => {
      const boxTypes = readTopLevelMp4BoxTypes(
        readFileSync(publicAssetPath(mp4)),
      );
      const moovIndex = boxTypes.indexOf('moov');
      const mdatIndex = boxTypes.indexOf('mdat');

      expect(moovIndex, `${mp4}: missing top-level moov atom`).toBeGreaterThan(
        -1,
      );
      expect(mdatIndex, `${mp4}: missing top-level mdat atom`).toBeGreaterThan(
        -1,
      );
      expect(
        moovIndex,
        `${mp4}: moov must precede mdat for faststart`,
      ).toBeLessThan(mdatIndex);
    },
  );
});

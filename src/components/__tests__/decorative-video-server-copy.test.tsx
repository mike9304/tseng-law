import { readFileSync } from 'node:fs';
import path from 'node:path';
import { isValidElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { SiteLocale } from '@/lib/locales';
import TaiwanHeritageInterlude from '@/components/TaiwanHeritageInterlude';

vi.mock('@/components/DecorativeAutoplayVideo', () => {
  const DECORATIVE_VIDEO_CONTROL_LABELS = Object.assign(
    function DECORATIVE_VIDEO_CONTROL_LABELS() {
      throw new Error('client reference is not a locale label map');
    },
    { $$typeof: Symbol.for('react.client.reference') },
  );

  function DecorativeAutoplayVideo() {
    return null;
  }

  return {
    __esModule: true,
    default: DecorativeAutoplayVideo,
    DecorativeAutoplayVideo,
    DECORATIVE_VIDEO_CONTROL_LABELS,
  };
});

const EXPECTED_CONTROL_LABELS: Record<
  SiteLocale,
  { pause: string; play: string; replay: string }
> = {
  ko: {
    pause: '영상 일시정지',
    play: '영상 재생',
    replay: '영상 다시 보기',
  },
  'zh-hant': {
    pause: '暫停影片',
    play: '播放影片',
    replay: '重新播放影片',
  },
  en: {
    pause: 'Pause video',
    play: 'Play video',
    replay: 'Replay video',
  },
  ja: {
    pause: '動画を一時停止',
    play: '動画を再生',
    replay: '動画をもう一度再生',
  },
};

const SERVER_CONSUMERS = [
  'src/lib/builder/site/public-page.tsx',
  'src/components/HomeCaseResultsSplit.tsx',
  'src/components/TaiwanHeritageInterlude.tsx',
  'src/components/VideoChannel.tsx',
] as const;

const SHARED_LABELS_MODULE = '@/components/decorative-video-controls';

function namedImportModules(source: string, importedName: string): string[] {
  const modules: string[] = [];
  const importRe = /import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"]\s*;/g;
  for (const match of source.matchAll(importRe)) {
    const clause = match[1];
    const specifier = match[2];
    const namedBlock = clause.match(/\{([\s\S]*)\}/);
    if (!namedBlock) continue;
    const names = namedBlock[1]
      .split(',')
      .map((entry) =>
        entry
          .trim()
          .replace(/^type\s+/u, '')
          .split(/\s+as\s+/u)[0]
          ?.trim(),
      )
      .filter((name): name is string => Boolean(name));
    if (names.includes(importedName)) {
      modules.push(specifier);
    }
  }
  return modules;
}

function readHeritageControlLabels(locale: SiteLocale): unknown {
  const tree = TaiwanHeritageInterlude({ locale });
  if (!isValidElement(tree)) {
    throw new Error('TaiwanHeritageInterlude did not return a React element');
  }
  const child = (tree.props as { children?: unknown }).children;
  if (!isValidElement(child)) {
    throw new Error('expected DecorativeAutoplayVideo child element');
  }
  return (child.props as { controlLabels?: unknown }).controlLabels;
}

describe('decorative video server copy', () => {
  it('passes JSON-serializable controlLabels for every locale through TaiwanHeritageInterlude', () => {
    for (const locale of Object.keys(EXPECTED_CONTROL_LABELS) as SiteLocale[]) {
      const controlLabels = readHeritageControlLabels(locale);
      expect(controlLabels).toEqual(EXPECTED_CONTROL_LABELS[locale]);
      expect(JSON.parse(JSON.stringify(controlLabels) as string)).toEqual(
        EXPECTED_CONTROL_LABELS[locale],
      );
    }
  });

  it.each(SERVER_CONSUMERS)(
    '%s imports DECORATIVE_VIDEO_CONTROL_LABELS from the shared data module',
    (relativePath) => {
      const source = readFileSync(path.join(process.cwd(), relativePath), 'utf8');
      expect(
        namedImportModules(source, 'DECORATIVE_VIDEO_CONTROL_LABELS'),
      ).toEqual([SHARED_LABELS_MODULE]);
    },
  );
});

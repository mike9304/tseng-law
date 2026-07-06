import { describe, expect, it } from 'vitest';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type { BuilderPageMeta } from '@/lib/builder/site/types';
import { buildSeoAssistantTasks } from '@/lib/builder/seo/assistant';
import { getSeoAssistantTaskCopy } from '@/lib/builder/seo/assistant-task-copy';

const now = '2026-06-02T00:00:00.000Z';

function page(overrides: Partial<BuilderPageMeta> = {}): BuilderPageMeta {
  return {
    pageId: 'page-1',
    slug: 'services',
    title: { ko: '서비스', en: 'Services', 'zh-hant': '服務' },
    locale: 'ko',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    ...overrides,
  };
}

function canvas(text: string): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: 'test',
    stageWidth: 1200,
    stageHeight: 800,
    nodes: [
      {
        id: 'h1',
        kind: 'heading',
        rect: { x: 0, y: 0, width: 100, height: 40 },
        style: {} as never,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 1,
        content: { level: 1, text, color: '#0f172a', align: 'left' },
      },
    ],
  };
}

function assistantTaskText(locale: BuilderPageMeta['locale'], keyword: string, body: string): string {
  const tasks = buildSeoAssistantTasks({
    page: page({
      locale,
      seo: {
        focusKeyword: keyword,
        title: locale === 'en' ? 'Services | Tseng Law' : locale === 'zh-hant' ? '服務 | 皓正國際' : '서비스 | 호정국제',
        description: locale === 'en'
          ? 'Legal service page.'
          : locale === 'zh-hant'
            ? '法律服務頁面。'
            : '법률 서비스 페이지입니다.',
      },
    }),
    canvas: canvas(body),
  });

  return tasks
    .filter((task) => task.id.startsWith('assistant-'))
    .flatMap((task) => [task.label, task.detail, task.applyHint ?? ''])
    .join(' ');
}

describe('SEO assistant task copy', () => {
  it('returns ko generated assistant task copy', () => {
    const copy = getSeoAssistantTaskCopy('ko');
    const text = assistantTaskText('ko', '국제 소송', '국제 소송 서비스');

    expect(copy.indexable.label).toBe('검색엔진 색인 허용');
    expect(copy.keywordTitle.invalid('국제 소송')).toBe('SEO 제목에 "국제 소송"를 자연스럽게 포함하세요.');
    expect(text).toContain('제목 태그에 포커스 키워드 추가');
    expect(text).toContain('이미지 대체 텍스트가 채워져 있습니다.');
    expect(text).not.toContain('Add focus keyword');
    expect(text).not.toContain('Write alt text');
  });

  it('returns zh-hant generated assistant task copy without Hangul', () => {
    const text = assistantTaskText('zh-hant', '國際法律', '國際法律服務');

    expect(text).toContain('在標題標籤加入焦點關鍵字');
    expect(text).toContain('圖片 alt text 已填寫。');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en generated assistant task copy without CJK', () => {
    const text = assistantTaskText('en', 'international law', 'international law services');

    expect(text).toContain('Add focus keyword to title tag');
    expect(text).toContain('Image alt text is filled in.');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });
});

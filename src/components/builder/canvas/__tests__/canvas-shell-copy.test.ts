import { describe, expect, it } from 'vitest';
import { getCanvasShellCopy } from '../canvas-shell-copy';

describe('getCanvasShellCopy', () => {
  it('localizes the shared canvas shells', () => {
    expect(getCanvasShellCopy('ko').workspaceHeader).toMatchObject({
      headerLabel: '헤더',
      menuEditable: '메뉴 편집 가능',
      editMenu: '메뉴 편집',
      siteSettings: '사이트 설정',
      title: '헤더 내비게이션 편집',
    });
    expect(getCanvasShellCopy('ko').globalCanvas).toMatchObject({
      backLabel: '편집기로 돌아가기',
      addLabel: '추가',
      layersLabel: '레이어',
      headerTitle: '글로벌 헤더 편집기',
      footerTitle: '글로벌 푸터 편집기',
    });
    expect(getCanvasShellCopy('ko').lightbox).toMatchObject({
      backLabel: '라이트박스',
      settingsLabel: '설정',
      addLabel: '추가',
      layersLabel: '레이어',
      settingsHeading: '라이트박스 설정',
      sizeModeLabel: '크기 모드',
    });

    expect(getCanvasShellCopy('zh-hant').workspaceHeader).toMatchObject({
      headerLabel: '頁首',
      menuEditable: '選單可編輯',
      editMenu: '編輯選單',
      siteSettings: '網站設定',
      title: '編輯頁首導覽',
    });
    expect(getCanvasShellCopy('zh-hant').globalCanvas).toMatchObject({
      backLabel: '返回編輯器',
      addLabel: '新增',
      layersLabel: '圖層',
      headerTitle: '全域頁首編輯器',
      footerTitle: '全域頁尾編輯器',
    });
    expect(getCanvasShellCopy('zh-hant').lightbox).toMatchObject({
      backLabel: 'Lightbox',
      settingsLabel: '設定',
      addLabel: '新增',
      layersLabel: '圖層',
      settingsHeading: 'Lightbox 設定',
      sizeModeLabel: '尺寸模式',
    });
  });
});

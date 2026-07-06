import { describe, expect, it } from 'vitest';
import { getSandboxEditorRailCopy } from '../sandbox-editor-rail-copy';

describe('getSandboxEditorRailCopy', () => {
  it('localizes rail and drawer labels for ko', () => {
    const copy = getSandboxEditorRailCopy('ko');
    expect(copy.rail.pages).toBe('페이지');
    expect(copy.rail.appMarket).toBe('앱 마켓');
    expect(copy.design.openTemplates(12)).toBe('전체 페이지 템플릿 12개 보기');
    expect(copy.design.previewSynced).toContain('추가 변경 없음');
    expect(copy.design.presets.classic.label).toBe('기본형 시스템');
    expect(copy.design.presets.studio.recommendation).toContain('고급 페이지 기준');
    expect(copy.design.changeTo('button', 'cta-shadow')).toBe('버튼 → 강조 섀도 CTA');
    expect(copy.design.priorityReason('field')).toBe('레이아웃 후 필드 질감 동기화');
    expect(copy.design.qualitySignal('preset:conversion')).toBe('전환형 시스템');
    expect(copy.design.qualitySignal('change:field:2')).toBe('필드 변경 2');
    expect(copy.columns.openPublicColumns).toBe('공개 칼럼 보기');
    expect(copy.history.versionHistory).toBe('버전 히스토리');
    expect(copy.history.description).toBe('저장된 버전을 확인하고 필요한 시점으로 복원합니다.');
  });

  it('localizes rail and drawer labels for zh-hant', () => {
    const copy = getSandboxEditorRailCopy('zh-hant');
    expect(copy.rail.pages).toBe('頁面');
    expect(copy.rail.contentManager).toBe('內容管理器');
    expect(copy.design.openTemplates(12)).toBe('查看全部頁面範本 12 個');
    expect(copy.design.previewPending(3, 1)).toContain('預計 3 項變更');
    expect(copy.design.presets.classic.label).toBe('基礎型系統');
    expect(copy.design.presets.classic.description).not.toMatch(/[가-힣]/);
    expect(copy.design.changeTo('button', 'cta-shadow')).toBe('按鈕 → 強調陰影 CTA');
    expect(copy.design.priorityReason('field')).toBe('版面後同步欄位質感');
    expect(copy.design.qualitySignal('preset:conversion')).toBe('轉換型系統');
    expect(copy.columns.openPublicColumns).toBe('查看公開專欄');
    expect(copy.history.versionHistory).toBe('版本歷史');
    expect(copy.history.description).not.toContain('modal');
  });

  it('keeps English designer preset copy available for English builders', () => {
    const copy = getSandboxEditorRailCopy('en');
    expect(copy.design.presets.classic.label).toBe('Classic system');
    expect(copy.design.changeTo('button', 'cta-shadow')).toBe('button → CTA shadow');
    expect(copy.design.priorityReason('field')).toBe('Match field finish after layout');
    expect(copy.design.qualitySignal('preset:conversion')).toBe('Conversion system');
  });
});

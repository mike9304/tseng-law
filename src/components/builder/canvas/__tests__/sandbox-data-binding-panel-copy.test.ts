import { describe, expect, it } from 'vitest';
import { getSandboxDataBindingPanelCopy } from '../sandbox-data-binding-panel-copy';

function fieldControlText(locale: 'ko' | 'zh-hant' | 'en') {
  const copy = getSandboxDataBindingPanelCopy(locale);
  return Object.values(copy.fieldControlsByKind)
    .flat()
    .map((control) => `${control.key} ${control.label} ${control.hint}`)
    .join(' ');
}

describe('sandbox data binding panel copy', () => {
  it('returns ko data binding panel copy', () => {
    const copy = getSandboxDataBindingPanelCopy('ko');

    expect(copy.sectionLabel).toBe('데이터');
    expect(copy.sectionTitle).toBe('필드 바인딩');
    expect(copy.fieldControlsByKind.image[1]?.label).toBe('대체 텍스트');
    expect(copy.connectedTo('서비스')).toBe('연결됨: 서비스');
    expect(copy.limitSummary(undefined)).toBe('제한: 전체');
    expect(copy.filterSummary(copy.noneSummary)).toBe('필터: 없음');
    expect(copy.activeFilterSummary(2)).toBe('2개 활성');
    expect(copy.sortDirectionLabel('desc')).toBe('내림차순');
    expect(copy.recordPosition(2, 5)).toBe('레코드 2 / 5');
    expect(copy.missingFieldOption('summary')).toBe('누락된 필드: summary');
    expect(copy.repeaterPreviewLoadingStatus).toBe('CMS 레코드를 불러오는 중입니다...');
    expect(copy.repeaterPreviewVisibleSummary(3, 4)).toBe('4개 레코드 중 3개 표시');
    expect(copy.repeaterTemplateReadyNotice(3)).toContain('템플릿 자식 3개');
    expect(copy.repeaterTemplateBoundStatus(1)).toBe('템플릿 자식 1개 바인딩됨');
    expect(copy.childMappingCopyLabel).toBe('카드 본문 / 갤러리 캡션');
  });

  it('returns zh-hant data binding panel copy without Hangul', () => {
    const copy = getSandboxDataBindingPanelCopy('zh-hant');

    expect(copy.sectionLabel).toBe('資料');
    expect(copy.fieldControlsByKind.button[0]?.label).toBe('標籤');
    expect([
      fieldControlText('zh-hant'),
      copy.sectionLabel,
      copy.sectionTitle,
      copy.staleNotice,
      copy.enabledNotice,
      copy.disabledNotice,
      copy.connectedTo('服務'),
      copy.collectionSummary('services'),
      copy.limitSummary(undefined),
      copy.filterSummary(copy.noneSummary),
      copy.sortSummary(copy.sortRuleSummary(2)),
      copy.publishedRuntimeApplied,
      copy.staleWarningTitle,
      copy.staleWarningBody,
      copy.useDataLabel,
      copy.useDataHint,
      copy.toggleBindingAriaLabel,
      copy.datasetLabel,
      copy.datasetHint,
      copy.previewLabel,
      copy.previewHint,
      copy.previewHelper,
      copy.recordLabel,
      copy.recordHint,
      copy.recordNumberAriaLabel,
      copy.previewModeInherited,
      copy.previewModeDirect,
      copy.recordPosition(1, 4),
      copy.emptyValue,
      copy.noSampleRecordsNotice,
      copy.repeaterPreviewTitle,
      copy.repeaterPreviewEnabledDescription,
      copy.repeaterPreviewDisabledDescription,
      copy.repeaterPreviewLoadingStatus,
      copy.repeaterPreviewLoadingAriaLabel,
      copy.repeaterPreviewEmptyMessage,
      copy.repeaterPreviewVisibleSummary(3, 4),
      copy.repeaterPreviewSwitcherAriaLabel,
      copy.repeaterComparisonAriaLabel,
      copy.repeaterComparisonTitle,
      copy.repeaterComparisonPrimaryFallback,
      copy.notBoundOption,
      copy.missingFieldOption('title'),
      copy.repeaterTemplateReadyNotice(2),
      copy.repeaterTemplateEmptyNotice,
      copy.repeaterTemplateBoundStatus(2),
      copy.repeaterTemplateUnboundStatus,
      copy.repeaterChildBindingMapAriaLabel,
      copy.replaceChildTemplateBindingsLabel,
      copy.bindChildTemplateLabel,
      copy.fieldFallbackLabel,
      copy.activeFilterSummary(2),
      copy.containsOperatorLabel,
      copy.sortDirectionLabel('asc'),
      copy.childMappingTextLabel,
      copy.childMappingImageSourceLabel,
      copy.childMappingLinkLabel,
      copy.childMappingCopyLabel,
    ].join(' ')).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en data binding panel copy without CJK', () => {
    const copy = getSandboxDataBindingPanelCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;

    expect(copy.sectionLabel).toBe('Data');
    expect(copy.fieldControlsByKind.gallery[2]?.label).toBe('Caption');
    expect(copy.repeaterTemplateReadyNotice(1)).toContain('1 template child ready');
    expect(copy.repeaterTemplateReadyNotice(2)).toContain('2 template children ready');
    expect([
      fieldControlText('en'),
      copy.sectionLabel,
      copy.sectionTitle,
      copy.staleNotice,
      copy.enabledNotice,
      copy.disabledNotice,
      copy.connectedTo('Services'),
      copy.collectionSummary('services'),
      copy.limitSummary(undefined),
      copy.filterSummary(copy.noneSummary),
      copy.sortSummary(copy.sortRuleSummary(2)),
      copy.publishedRuntimeApplied,
      copy.staleWarningTitle,
      copy.staleWarningBody,
      copy.useDataLabel,
      copy.useDataHint,
      copy.toggleBindingAriaLabel,
      copy.datasetLabel,
      copy.datasetHint,
      copy.previewLabel,
      copy.previewHint,
      copy.previewHelper,
      copy.recordLabel,
      copy.recordHint,
      copy.recordNumberAriaLabel,
      copy.previewModeInherited,
      copy.previewModeDirect,
      copy.recordPosition(1, 4),
      copy.emptyValue,
      copy.noSampleRecordsNotice,
      copy.repeaterPreviewTitle,
      copy.repeaterPreviewEnabledDescription,
      copy.repeaterPreviewDisabledDescription,
      copy.repeaterPreviewLoadingStatus,
      copy.repeaterPreviewLoadingAriaLabel,
      copy.repeaterPreviewEmptyMessage,
      copy.repeaterPreviewVisibleSummary(3, 4),
      copy.repeaterPreviewSwitcherAriaLabel,
      copy.repeaterComparisonAriaLabel,
      copy.repeaterComparisonTitle,
      copy.repeaterComparisonPrimaryFallback,
      copy.notBoundOption,
      copy.missingFieldOption('title'),
      copy.repeaterTemplateReadyNotice(2),
      copy.repeaterTemplateEmptyNotice,
      copy.repeaterTemplateBoundStatus(2),
      copy.repeaterTemplateUnboundStatus,
      copy.repeaterChildBindingMapAriaLabel,
      copy.replaceChildTemplateBindingsLabel,
      copy.bindChildTemplateLabel,
      copy.fieldFallbackLabel,
      copy.activeFilterSummary(2),
      copy.containsOperatorLabel,
      copy.sortDirectionLabel('asc'),
      copy.childMappingTextLabel,
      copy.childMappingImageSourceLabel,
      copy.childMappingLinkLabel,
      copy.childMappingCopyLabel,
    ].join(' ')).not.toMatch(cjk);
  });
});

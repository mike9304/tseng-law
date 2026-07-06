import { describe, expect, it } from 'vitest';
import { getRepeaterTemplateCopy } from '../repeater-template-copy';

describe('getRepeaterTemplateCopy', () => {
  it('localizes the repeater template chrome', () => {
    expect(getRepeaterTemplateCopy('ko').childBadge).toMatchObject({
      ariaLabel: '리피터 템플릿 자식',
      label: '템플릿 자식',
      recordPrefix: '상위 데이터의 레코드',
    });
    expect(getRepeaterTemplateCopy('ko').warning).toMatchObject({
      ariaLabel: '데이터셋 바인딩 주의 필요',
      label: '데이터셋 필드 누락',
    });
    expect(getRepeaterTemplateCopy('ko').hud.duplicate).toBe('복제');
    expect(getRepeaterTemplateCopy('ko').hud.duplicateChildAriaLabel).toBe('첫 번째 바인딩된 템플릿 자식 복제');
    expect(getRepeaterTemplateCopy('ko').hud.noMatchingRecords).toBe('일치하는 레코드가 없습니다');
    expect(getRepeaterTemplateCopy('ko').hud.loadingRecords).toBe('CMS 레코드를 불러오는 중');
    expect(getRepeaterTemplateCopy('ko').childBadge.renameGroupAriaLabel(2)).toBe('템플릿 필드 그룹 이름 변경, 레코드 2');
    expect(getRepeaterTemplateCopy('ko').childBadge.renameGroupPlaceholder).toBe('그룹 이름');
    expect(getRepeaterTemplateCopy('ko').childBadge.duplicateGroupActionLabel).toBe('그룹 복제');
    expect(getRepeaterTemplateCopy('ko').childBadge.duplicateGroupActionAriaLabel(2)).toBe('템플릿 필드 그룹 복제, 레코드 2');
    expect(getRepeaterTemplateCopy('ko').childBadge.ungroupActionLabel).toBe('그룹 해제');
    expect(getRepeaterTemplateCopy('ko').fallbackText).toBe('바인딩 텍스트');

    expect(getRepeaterTemplateCopy('zh-hant').childBadge).toMatchObject({
      ariaLabel: '重複器範本子項',
      label: '範本子項',
      recordPrefix: '來自父層的記錄',
    });
    expect(getRepeaterTemplateCopy('zh-hant').warning).toMatchObject({
      ariaLabel: '資料集綁定需注意',
      label: '缺少資料集欄位',
    });
    expect(getRepeaterTemplateCopy('zh-hant').hud.duplicate).toBe('複製');
    expect(getRepeaterTemplateCopy('zh-hant').hud.duplicateChildAriaLabel).toBe('複製第一個已綁定的範本子項');
    expect(getRepeaterTemplateCopy('zh-hant').hud.noMatchingRecords).toBe('沒有相符的記錄');
    expect(getRepeaterTemplateCopy('zh-hant').hud.loadingRecords).toBe('正在載入 CMS 記錄');
    expect(getRepeaterTemplateCopy('zh-hant').childBadge.renameGroupAriaLabel(2)).toBe('重新命名記錄 2 的範本欄位群組');
    expect(getRepeaterTemplateCopy('zh-hant').childBadge.renameGroupPlaceholder).toBe('群組名稱');
    expect(getRepeaterTemplateCopy('zh-hant').childBadge.duplicateGroupActionLabel).toBe('複製群組');
    expect(getRepeaterTemplateCopy('zh-hant').childBadge.duplicateGroupActionAriaLabel(2)).toBe('複製記錄 2 的範本欄位群組');
    expect(getRepeaterTemplateCopy('zh-hant').childBadge.ungroupActionLabel).toBe('取消群組');
    expect(getRepeaterTemplateCopy('zh-hant').fallbackText).toBe('綁定文字');
  });
});

import { describe, expect, it } from 'vitest';
import { getSandboxInspectorOfficeQuickEditCopy } from '../sandbox-inspector-office-quick-edit-copy';

describe('sandbox inspector office quick edit copy', () => {
  it('returns ko office quick edit copy', () => {
    const copy = getSandboxInspectorOfficeQuickEditCopy('ko');

    expect(copy.sectionLabel).toBe('사무소 동기화');
    expect(copy.sectionTitle).toBe('Wix 스타일 위치 설정');
    expect(copy.presetsLabel).toBe('사무소 프리셋');
    expect(copy.presetAriaLabel('타이중')).toBe('타이중 사무소 지도 프리셋 사용');
    expect(copy.officeTitleLabel).toBe('사무소명');
    expect(copy.zoomLabel).toBe('확대');
    expect(copy.phoneAriaLabel).toBe('동기화된 사무소 전화번호');
    expect(copy.generateFromAddressLabel).toBe('주소로 생성');
  });

  it('returns zh-hant office quick edit copy without Hangul', () => {
    const copy = getSandboxInspectorOfficeQuickEditCopy('zh-hant');

    expect(copy.sectionLabel).toBe('辦公室同步');
    expect(copy.presetAriaLabel('台中')).toBe('使用台中辦公室地圖預設');
    expect([
      copy.sectionLabel,
      copy.sectionTitle,
      copy.presetsLabel,
      copy.presetAriaLabel('台中'),
      copy.officeTitleLabel,
      copy.officeTitleAriaLabel,
      copy.addressLabel,
      copy.addressAriaLabel,
      copy.zoomLabel,
      copy.zoomAriaLabel,
      copy.phoneLabel,
      copy.phoneAriaLabel,
      copy.faxLabel,
      copy.faxAriaLabel,
      copy.directionsUrlLabel,
      copy.mapUrlAriaLabel,
      copy.generateFromAddressLabel,
    ].join(' ')).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en office quick edit copy without CJK', () => {
    const copy = getSandboxInspectorOfficeQuickEditCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;

    expect(copy.sectionLabel).toBe('Office sync');
    expect(copy.presetAriaLabel('Taichung')).toBe('Use Taichung office map preset');
    expect([
      copy.sectionLabel,
      copy.sectionTitle,
      copy.presetsLabel,
      copy.presetAriaLabel('Taichung'),
      copy.officeTitleLabel,
      copy.officeTitleAriaLabel,
      copy.addressLabel,
      copy.addressAriaLabel,
      copy.zoomLabel,
      copy.zoomAriaLabel,
      copy.phoneLabel,
      copy.phoneAriaLabel,
      copy.faxLabel,
      copy.faxAriaLabel,
      copy.directionsUrlLabel,
      copy.mapUrlAriaLabel,
      copy.generateFromAddressLabel,
    ].join(' ')).not.toMatch(cjk);
  });
});

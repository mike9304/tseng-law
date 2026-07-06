import { describe, expect, it } from 'vitest';
import { getSdkDocSections } from '@/lib/builder/dev/sdk-docs';

describe('getSdkDocSections', () => {
  it('documents the Functions API with invoke and ctx helpers', () => {
    const functions = getSdkDocSections('en').find((section) => section.id === 'functions');
    expect(functions).toBeTruthy();
    expect(functions?.title).toBe('Functions API');
    expect(functions?.types.join('\n')).toContain('BuilderServerlessFunction');
    expect(functions?.types.join('\n')).toContain('ctx');
    expect(functions?.example).toContain('/api/builder/dev/functions/{slug-or-id}/invoke');
  });

  it('keeps stable unique section ids for page anchors and JSON docs', () => {
    const sections = getSdkDocSections('en');
    expect(sections.length).toBeGreaterThan(1);
    expect(new Set(sections.map((section) => section.id)).size).toBe(sections.length);
  });

  it('localizes doc prose for ko and zh-hant', () => {
    const ko = getSdkDocSections('ko');
    expect(ko.find((section) => section.id === 'functions')?.title).toBe('함수 API');
    expect(ko.find((section) => section.id === 'functions')?.paragraphs[0]).toContain('서버 측 함수');
    expect(ko.find((section) => section.id === 'publish')?.paragraphs[0]).toContain('발행본');

    const zh = getSdkDocSections('zh-hant');
    expect(zh.find((section) => section.id === 'functions')?.title).toBe('函式 API');
    expect(zh.find((section) => section.id === 'functions')?.paragraphs[0]).toContain('伺服器端函式');
    expect(zh.find((section) => section.id === 'publish')?.paragraphs[0]).toContain('已發佈');
  });

  it('documents the Data SDK facade with createDataSdk and permission error', () => {
    const section = getSdkDocSections('en').find((entry) => entry.id === 'data-sdk');
    expect(section).toBeTruthy();
    expect(section?.title).toBe('Data SDK');
    const types = section?.types.join('\n') ?? '';
    expect(types).toContain('DataSdk.records');
    expect(types).toContain('DataSdkRecordListResult');
    expect(types).toContain('DataSdkPermissionError');
    expect(section?.example).toContain("createDataSdk({ actor: 'admin' })");
    expect(section?.example).toContain('sdk.records.list');

    // Localized prose exists for ko and zh-hant as well.
    expect(getSdkDocSections('ko').find((entry) => entry.id === 'data-sdk')?.paragraphs[0]).toBeTruthy();
    expect(getSdkDocSections('zh-hant').find((entry) => entry.id === 'data-sdk')?.paragraphs[0]).toBeTruthy();
  });
});

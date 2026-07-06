import { expect } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { canvasEditor, gotoBuilder } from '../helpers';

export const W03_inlineTextEdit: CheckpointDefinition = {
  id: 'W03',
  title: '텍스트 더블클릭 → 인라인 편집 (커서 + 키보드 입력)',
  verification: 'Hero 제목 더블클릭 → 글자 수정 → 블러 → 저장됨',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    const canvas = canvasEditor(page);
    const textNode = canvas
      .locator('[data-node-id="home-hero-title"]:visible, [data-node-id="home-hero-subtitle"]:visible, [data-node-id*="title"]:visible, [data-node-id*="subtitle"]:visible')
      .first();
    await expect(textNode).toBeVisible({ timeout: 10_000 });
    const originalText = (await textNode.textContent())?.trim() ?? '';

    log('텍스트 노드 더블클릭');
    await textNode.dblclick({ force: true });
    await recordEvidence('after-dblclick');

    const findings: CheckpointFinding[] = [];

    const inlineEditor = page.locator('[data-builder-inline-text-editor="true"]');
    const inlineEditorAlt = page.locator('.ProseMirror[contenteditable="true"]:visible');

    log('인라인 에디터 활성화 여부 확인');
    const inlineActiveCount = await inlineEditor.count();
    const inlineAltCount = await inlineEditorAlt.count();
    const hasInline = inlineActiveCount > 0 || inlineAltCount > 0;

    if (!hasInline) {
      findings.push({
        severity: 'blocker',
        summary: '더블클릭해도 인라인 에디터가 활성화되지 않음',
        detail: `[data-builder-inline-text-active] count=${inlineActiveCount}, contenteditable count=${inlineAltCount}`,
      });
      return { findings };
    }

    log('floating toolbar visible 확인');
    const toolbar = page.locator('[data-builder-inline-text-toolbar], [class*="inlineTextToolbar"]').first();
    const toolbarVisible = await toolbar.isVisible().catch(() => false);
    if (!toolbarVisible) {
      findings.push({
        severity: 'visual',
        summary: '인라인 편집 중 floating toolbar가 표시되지 않음',
      });
    }
    await recordEvidence('inline-editor-active');

    log('키보드 입력 및 Escape로 저장');
    await page.keyboard.type(' QA✓');
    await recordEvidence('after-typing');
    await page.keyboard.press('Escape');

    log('편집 종료 후 텍스트 반영 확인');
    await page.waitForTimeout(500);
    const afterText = (await textNode.textContent())?.trim() ?? '';
    const textInjected = afterText.includes('QA✓');
    if (!textInjected) {
      findings.push({
        severity: 'blocker',
        summary: 'Escape 후 입력한 텍스트가 노드에 반영되지 않음',
        detail: `현재 텍스트: ${afterText.slice(0, 60)}`,
      });
    }
    await recordEvidence('after-escape');

    if (textInjected) {
      log('원래 텍스트로 복구 (드래프트 오염 방지)');
      try {
        await textNode.dblclick({ force: true });
        await page.waitForTimeout(300);
        const stillActive = await page
          .locator('[data-builder-inline-text-editor="true"], .ProseMirror[contenteditable="true"]:visible')
          .first()
          .isVisible()
          .catch(() => false);
        if (stillActive) {
          await page.keyboard.press(`${process.platform === 'darwin' ? 'Meta' : 'Control'}+A`);
          await page.keyboard.type(originalText);
          await page.keyboard.press('Escape');
        } else {
          findings.push({
            severity: 'minor',
            summary: '복구 단계 dblclick 시 인라인 에디터가 활성화되지 않아 자동 복구 스킵. home draft에 "QA✓"가 남아 있을 수 있음.',
          });
        }
      } catch (err) {
        findings.push({
          severity: 'minor',
          summary: '원본 텍스트 복구 중 예외 — home draft에 "QA✓"가 남아 있을 수 있음',
          detail: (err as Error).message,
        });
      }
    } else {
      log('주입이 안 됐으므로 복구 단계 자동 스킵');
    }

    return { findings };
  },
};

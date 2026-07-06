import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { gotoBuilder } from '../helpers';
import {
  canvasFingerprint,
  createBlankPage,
  deletePageBySlug,
  openPagesDrawer,
  pageRowCount,
  renamePageViaMenu,
  rowText,
  waitForStableCanvas,
} from './_builderPageNav';

export const W14_pagesCrudDeep: CheckpointDefinition = {
  id: 'W14',
  title: '좌측 페이지 스위처 — 전체 CRUD 동작 (생성/이름변경/삭제)',
  verification:
    'drawer 열기 → 목록 카운트 → 새 페이지 생성(+1 & 전환) → 이름 변경 반영 → 삭제(원래 카운트 복귀)',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);

    const findings: CheckpointFinding[] = [];
    const token = Date.now().toString(36);
    const slug = `qa-w14-${token}`;
    const renameTitle = `QA-W14-이름변경-${token}`;

    log('drawer 열기 + 기준 페이지 카운트');
    if (!(await openPagesDrawer(page))) {
      findings.push({ severity: 'blocker', summary: 'Pages drawer 가 열리지 않음' });
      await recordEvidence('pages-drawer-missing');
      return { findings };
    }
    const baseline = await pageRowCount(page);
    log(`기준 페이지 수: ${baseline}`);
    const homeFp = await canvasFingerprint(page);
    await recordEvidence('pages-list-baseline');

    log('새 빈 페이지 생성');
    const created = await createBlankPage(page, slug);
    if (!created.created) {
      findings.push({
        severity: 'blocker',
        summary: `새 페이지 생성 실패 — ${created.reason ?? '원인 미상'}`,
      });
      await recordEvidence('pages-create-failed');
      return { findings };
    }
    await waitForStableCanvas(page);

    log('목록 +1 및 새 페이지로 전환 확인');
    await openPagesDrawer(page).catch(() => undefined);
    const afterCreate = await pageRowCount(page);
    const afterFp = await canvasFingerprint(page);
    log(`생성 후 페이지 수: ${afterCreate} / fingerprint 변경: ${homeFp !== afterFp}`);
    if (afterCreate !== baseline + 1) {
      findings.push({
        severity: 'blocker',
        summary: `새 페이지 생성 후 목록이 +1 되지 않음 (baseline=${baseline}, after=${afterCreate})`,
      });
    }
    if (homeFp === afterFp) {
      findings.push({
        severity: 'visual',
        summary: '새 페이지 생성 후 캔버스가 새 페이지로 전환되지 않은 것으로 보임 (fingerprint 동일)',
      });
    }
    await recordEvidence('pages-created');

    log('생성한 페이지 이름 변경');
    const renamed = await renamePageViaMenu(page, slug, renameTitle);
    if (!renamed) {
      findings.push({
        severity: 'blocker',
        summary: '페이지 row 메뉴의 "이름 변경" 진입/저장 동작을 수행하지 못함',
      });
    } else {
      const text = await rowText(page, slug);
      log(`이름 변경 후 row 텍스트: "${text}"`);
      if (!text.includes(renameTitle)) {
        findings.push({
          severity: 'blocker',
          summary: `이름 변경 후 목록에 새 이름이 반영되지 않음 (기대 "${renameTitle}" 포함)`,
        });
      }
    }
    await recordEvidence('pages-renamed');

    log('생성한 페이지 삭제 (confirm dialog 자동 수락)');
    const deleted = await deletePageBySlug(page, slug);
    if (!deleted) {
      findings.push({
        severity: 'blocker',
        summary: '페이지 row 메뉴의 "삭제" 동작을 수행하지 못함',
      });
    }
    await openPagesDrawer(page).catch(() => undefined);
    const afterDelete = await pageRowCount(page);
    log(`삭제 후 페이지 수: ${afterDelete}`);
    if (afterDelete !== baseline) {
      findings.push({
        severity: 'blocker',
        summary: `삭제 후 페이지 수가 기준으로 돌아가지 않음 (baseline=${baseline}, after=${afterDelete})`,
      });
    }
    await recordEvidence('pages-deleted');

    return { findings };
  },
};

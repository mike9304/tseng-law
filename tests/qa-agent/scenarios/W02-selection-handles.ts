import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { ensureSelected, gotoBuilder } from '../helpers';

export const W02_selectionHandles: CheckpointDefinition = {
  id: 'W02',
  title: '요소 클릭 시 선택 핸들 (8 corners/edges) 표시',
  verification: '홈 Hero 영역 클릭 → 파란 테두리 + 8 handle',
  async run({ page, baseUrl, recordEvidence, log }) {
    log('admin-builder 진입');
    await gotoBuilder(page, baseUrl);
    await recordEvidence('builder-loaded');

    log('첫 visible 노드 선택 (최대 3회 재시도)');
    const selected = await ensureSelected(page);
    await recordEvidence('node-selected');

    log('resize handle 개수 검증');
    const handleCount = await selected.locator('[class*="resizeHandle"]:visible').count();

    log('outline 색상 검증');
    const outline = await selected.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        outlineColor: style.outlineColor,
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
      };
    });

    const findings: CheckpointFinding[] = [];
    if (handleCount !== 8) {
      findings.push({
        severity: 'blocker',
        summary: `resize handle 8개가 아닌 ${handleCount}개 표시됨`,
      });
    }
    // rgba(r,g,b,a) 형태도 허용 — alpha 0.99 등 부동소수점 반올림 무시
    const colorMatch = outline.outlineColor.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    const colorOk = colorMatch
      ? colorMatch[1] === '17' && colorMatch[2] === '109' && colorMatch[3] === '255'
      : outline.outlineColor === 'rgb(17, 109, 255)';
    if (!colorOk) {
      findings.push({
        severity: 'visual',
        summary: `선택 outline 색상이 Wix 파란색(rgb(17,109,255))이 아님: ${outline.outlineColor}`,
      });
    }
    if (outline.outlineStyle !== 'solid' || outline.outlineWidth !== '2px') {
      findings.push({
        severity: 'visual',
        summary: `선택 outline 스타일/굵기 불일치: ${outline.outlineStyle} ${outline.outlineWidth}`,
      });
    }

    return { findings };
  },
};

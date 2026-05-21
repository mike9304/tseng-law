import path from 'node:path';
import { ollamaVisionReview, ollamaTextGenerate } from './ollama';
import type { CheckpointFinding, CheckpointResult } from '../types';

const VISION_MODEL = process.env.QA_VISION_MODEL ?? 'qwen2.5vl:32b';
const TEXT_MODEL = process.env.QA_TEXT_MODEL ?? 'exaone3.5:32b';

const VISION_PROMPT = (ctx: { id: string; title: string; verification: string; label: string }) => `당신은 Wix 같은 사이트 빌더의 시각 QA 전문가입니다.
체크포인트: ${ctx.id} — ${ctx.title}
사용자 검증 시나리오: ${ctx.verification}
이 스크린샷은 "${ctx.label}" 시점입니다.

이 화면에서 Wix 빌더 기준으로 어색하거나 깨졌거나 사용자가 헷갈릴 만한 시각/UX 이슈를 찾으세요.
각 이슈를 한 줄씩 다음 형식으로만 답하세요. 이슈가 없으면 "OK"만 출력하세요.

[severity] summary
  detail (선택)

severity는 blocker/visual/minor 중 하나.
- blocker: 기능을 못 쓸 정도의 결함
- visual: 색/정렬/간격 등 시각적 어긋남
- minor: 사소한 폴리시 이슈

가벼운 추측이나 일반론적 조언은 쓰지 마세요. 이 스크린샷에서 실제로 보이는 것만 적으세요.`;

const HEAD_RE = /^\s*(?:\d+[.)]\s*)?\*{0,2}\[(blocker|visual|minor|note)\]\*{0,2}\s*\*{0,2}\s*(.+?)\s*\*{0,2}\s*$/i;

export function parseVisionResponse(text: string): CheckpointFinding[] {
  if (!text) return [];
  const trimmed = text.trim();
  if (/^ok\s*$/i.test(trimmed) || trimmed.length < 4) return [];
  const findings: CheckpointFinding[] = [];
  const lines = trimmed.split(/\r?\n/);
  let current: CheckpointFinding | undefined;
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;
    const m = line.match(HEAD_RE);
    if (m) {
      if (current) findings.push(current);
      const sev = m[1].toLowerCase();
      const mappedSeverity: CheckpointFinding['severity'] = sev === 'note' ? 'minor' : (sev as CheckpointFinding['severity']);
      const summary = m[2].replace(/^\*+|\*+$/g, '').trim();
      current = {
        severity: mappedSeverity,
        summary,
      };
    } else if (current && /^\s{2,}|^\t/.test(raw)) {
      current.detail = (current.detail ? current.detail + ' ' : '') + line.trim();
    }
  }
  if (current) findings.push(current);
  return findings;
}

export interface VisionReviewOptions {
  model?: string;
  maxImagesPerCheckpoint?: number;
}

export async function reviewCheckpointVisually(
  result: CheckpointResult,
  verification: string,
  options: VisionReviewOptions = {},
): Promise<CheckpointFinding[]> {
  const model = options.model ?? VISION_MODEL;
  const limit = options.maxImagesPerCheckpoint ?? 2;
  const targets = result.evidence.slice(-limit);
  const allFindings: CheckpointFinding[] = [];
  for (const ev of targets) {
    try {
      const response = await ollamaVisionReview({
        model,
        imagePath: ev.screenshotPath,
        prompt: VISION_PROMPT({
          id: result.id,
          title: result.title,
          verification,
          label: ev.label,
        }),
      });
      if (process.env.QA_DEBUG_VISION === '1') {
        // eslint-disable-next-line no-console
        console.log(`[vision raw ${result.id}/${ev.label}]\n${response}\n[/vision raw]`);
      }
      const parsed = parseVisionResponse(response);
      for (const f of parsed) {
        allFindings.push({
          ...f,
          summary: `[vision:${path.basename(ev.screenshotPath)}] ${f.summary}`,
        });
      }
    } catch (err) {
      allFindings.push({
        severity: 'minor',
        summary: `vision review 실패 (${ev.label})`,
        detail: (err as Error).message,
      });
    }
  }
  return allFindings;
}

export async function summarizeForClaude(
  results: CheckpointResult[],
  options: { model?: string } = {},
): Promise<string> {
  const model = options.model ?? TEXT_MODEL;
  const focus = results.filter((r) => r.status === 'fail' || r.status === 'unclear');
  if (focus.length === 0) return '_(LLM 요약: 모두 통과)_';
  const lines: string[] = [];
  lines.push('다음은 호정 사이트 빌더 QA 에이전트가 발견한 이슈 목록입니다.');
  lines.push('각 이슈를 (1) 우선순위 (P0/P1/P2), (2) 추측되는 근본 원인, (3) Claude가 수정 시 먼저 봐야 할 영역 (인스펙터/캔버스/라우트/스토어 등) 으로 정리해주세요.');
  lines.push('출력은 한국어 마크다운 리스트로 간결하게.');
  lines.push('');
  for (const r of focus) {
    lines.push(`### ${r.id} ${r.title} (${r.status})`);
    for (const f of r.findings) {
      lines.push(`- [${f.severity}] ${f.summary}`);
      if (f.detail) lines.push(`  - ${f.detail}`);
    }
    if (r.consoleErrors.length > 0) {
      lines.push(`- 콘솔에러: ${r.consoleErrors.slice(0, 3).join(' | ')}`);
    }
  }
  return ollamaTextGenerate({ model, prompt: lines.join('\n') });
}

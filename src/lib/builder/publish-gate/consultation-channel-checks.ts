import type {
  BuilderCanvasDocument,
  BuilderCanvasNode,
} from '@/lib/builder/canvas/types';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { normalizeBuilderSiteId } from '@/lib/builder/site/identity';
import type { CheckResult } from './check-types';

const DISABLED_PROVIDER_NAMES = new Set(['kakao', 'line']);
const DISABLED_CHANNEL_URL =
  /(?:^|[^\p{L}\p{N}.-])(?:https?:\/\/)?(?:(?:[a-z0-9-]+\.)*line\.me|(?:[a-z0-9-]+\.)*lin\.ee|pf\.kakao\.com|open\.kakao\.com|talk\.kakao\.com)(?:[/:?#]|$)/iu;

const CONSULTATION_TERMS =
  '(?:상담|문의|연락|채팅|메신저|메시지|연결|변호사|諮詢|咨询|聯絡|联系|洽詢|洽询|律師|律师|即時通訊|即时通讯|相談|問い合わせ|問合せ|連絡|チャット|consult(?:ation)?|contact|inquir(?:y|ies)|message|chat|connect|attorney|lawyer)';

const KAKAO_CHANNEL_COPY = new RegExp(
  `(?:카카오톡|카카오|kakao\\s*talk|kakao).{0,40}${CONSULTATION_TERMS}|${CONSULTATION_TERMS}.{0,40}(?:카카오톡|카카오|kakao\\s*talk|kakao)`,
  'iu',
);
const LINE_CHANNEL_COPY = new RegExp(
  `(?:라인|ライン|\\bline\\b).{0,40}${CONSULTATION_TERMS}|${CONSULTATION_TERMS}.{0,40}(?:라인|ライン|\\bline\\b)`,
  'iu',
);

function decodedCandidates(value: string): string[] {
  const candidates = [value];
  let current = value;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const decoded = decodeURIComponent(current);
      if (decoded === current) break;
      candidates.push(decoded);
      current = decoded;
    } catch {
      break;
    }
  }
  return candidates;
}

function containsDisabledChannelValue(value: string): boolean {
  return decodedCandidates(value).some((candidate) => {
    const copyCandidate = candidate.replace(/\bsubject\s+line\b/giu, '');
    return (
      DISABLED_CHANNEL_URL.test(candidate)
      || KAKAO_CHANNEL_COPY.test(copyCandidate)
      || LINE_CHANNEL_COPY.test(copyCandidate)
    );
  });
}

function collectStringValues(value: unknown, output: string[], seen: Set<object>): void {
  if (typeof value === 'string') {
    output.push(value);
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (seen.has(value)) return;
  seen.add(value);
  if (Array.isArray(value)) {
    for (const item of value) collectStringValues(item, output, seen);
    return;
  }
  for (const item of Object.values(value)) {
    collectStringValues(item, output, seen);
  }
}

function disabledProviderReason(node: BuilderCanvasNode): string | null {
  if (node.kind === 'floating-chat') {
    return DISABLED_PROVIDER_NAMES.has(node.content.provider)
      ? `${node.content.provider} floating-chat provider`
      : null;
  }
  if (node.kind === 'social-bar') {
    const provider = node.content.items.find((item) => (
      DISABLED_PROVIDER_NAMES.has(item.provider)
    ))?.provider;
    return provider ? `${provider} social-bar provider` : null;
  }
  return null;
}

function disabledValueReason(node: BuilderCanvasNode): string | null {
  const values: string[] = [];
  collectStringValues(node.content, values, new Set<object>());
  return values.some(containsDisabledChannelValue)
    ? 'disabled KakaoTalk/LINE consultation copy or URL'
    : null;
}

/**
 * The canonical law-firm site has intentionally disabled KakaoTalk and LINE
 * until the operator reconnects them. This check is scoped to that site only:
 * templates and customer sites remain free to use the generic social widgets.
 */
export function checkDisabledConsultationChannels(
  doc: BuilderCanvasDocument,
  siteId?: string | null,
): CheckResult[] {
  if (normalizeBuilderSiteId(siteId) !== DEFAULT_BUILDER_SITE_ID) return [];

  const results: CheckResult[] = [];
  for (const node of doc.nodes) {
    const reason = disabledProviderReason(node) ?? disabledValueReason(node);
    if (!reason) continue;
    results.push({
      id: `disabled-consultation-channel-${node.id}`,
      severity: 'blocker',
      category: 'links',
      message: `노드 ${node.id}에 현재 비활성화된 상담 채널이 포함되어 있습니다 (${reason}).`,
      affectedNodeIds: [node.id],
      fixHint: 'KakaoTalk/LINE 상담 문구와 링크를 제거하고 공식 이메일 상담 CTA를 사용하세요.',
    });
  }
  return results;
}

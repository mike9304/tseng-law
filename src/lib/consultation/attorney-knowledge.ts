import type { Locale } from '@/lib/locales';
import type { ConsultationCategory } from '@/lib/consultation/types';
import {
  appendConsultationLogLine,
  readConsultationLogLines,
} from '@/lib/consultation/log-storage';

export type AttorneyKnowledgeStatus = 'approved' | 'archived';

export interface ConsultationAttorneyKnowledgeReference {
  id: string;
  locale: Locale;
  category: ConsultationCategory;
  question: string;
  answer: string;
  keywords: string[];
  reviewedBy?: string;
  reviewedAt: string;
  updatedAt: string;
  sourceNote?: string;
}

interface AttorneyKnowledgeRecord extends ConsultationAttorneyKnowledgeReference {
  status: AttorneyKnowledgeStatus;
  action: 'upsert' | 'archive';
}

export interface AttorneyKnowledgeInput {
  id?: string;
  locale: Locale;
  category: ConsultationCategory;
  question: string;
  answer: string;
  keywords?: string[] | string;
  reviewedBy?: string;
  sourceNote?: string;
}

export interface AttorneyQuestionSuggestion {
  id: string;
  locale: Locale;
  category: ConsultationCategory;
  question: string;
  why: string;
  priority: 'high' | 'medium';
  keywords: string[];
}

const MAX_QUESTION_CHARS = 420;
const MAX_ANSWER_CHARS = 1800;
const MAX_KEYWORDS = 12;

export const ATTORNEY_QUESTION_SUGGESTIONS: AttorneyQuestionSuggestion[] = [
  {
    id: 'expected-company-costs',
    locale: 'ko',
    category: 'company_setup',
    question: '대만 회사 설립 비용과 기간은 어느 정도인가요?',
    why: '회사설립 상담에서 가장 먼저 나오는 질문이지만 공개 칼럼만으로 최신 비용·기간을 단정하기 어렵습니다.',
    priority: 'high',
    keywords: ['회사설립', '비용', '기간', '견적', '등기'],
  },
  {
    id: 'expected-company-capital',
    locale: 'ko',
    category: 'company_setup',
    question: '외국인이 대만 회사를 만들 때 최소 자본금은 얼마로 잡아야 하나요?',
    why: '최저자본·은행·회계사 검토가 섞여 환각 위험이 높아 변호사 기준 답변이 필요합니다.',
    priority: 'high',
    keywords: ['최소자본금', '자본금', '외국인투자', '회사설립'],
  },
  {
    id: 'expected-consultation-fee',
    locale: 'ko',
    category: 'general',
    question: '상담료는 얼마이고 상담은 어떻게 예약하나요?',
    why: '법률 칼럼 범위 밖이라 자주 저신뢰 처리되는 운영 질문입니다.',
    priority: 'high',
    keywords: ['상담료', '예약', '비용', '상담'],
  },
  {
    id: 'expected-traffic-settlement',
    locale: 'ko',
    category: 'traffic_accident',
    question: '대만 교통사고 합의 전에 어떤 자료를 준비해야 하나요?',
    why: '사고 직후 사용자가 바로 필요한 실무 체크리스트입니다.',
    priority: 'high',
    keywords: ['교통사고', '합의', '자료', '증거', '보험'],
  },
  {
    id: 'expected-labor-termination',
    locale: 'ko',
    category: 'labor',
    question: '대만 회사에서 갑자기 해고 통보를 받으면 바로 무엇을 해야 하나요?',
    why: 'L3로 연결되기 쉬운 질문이지만 초기 보존 자료 안내는 표준 답변화할 수 있습니다.',
    priority: 'high',
    keywords: ['해고', '자遣', '퇴직금', '서명', '증거'],
  },
  {
    id: 'expected-family-custody',
    locale: 'ko',
    category: 'divorce_family',
    question: '대만에서 이혼 중 상대방이 아이를 못 보게 하면 어떻게 대응하나요?',
    why: '감정적·긴급성이 높아 모호하게 넘기기 쉬운 가족법 핵심 질문입니다.',
    priority: 'medium',
    keywords: ['이혼', '친권', '양육', '면접교섭', '아이'],
  },
  {
    id: 'expected-inheritance-deadline',
    locale: 'ko',
    category: 'inheritance',
    question: '대만 상속 포기나 한정승인은 언제까지 해야 하나요?',
    why: '기한성 질문이라 최신 변호사 확인 답변이 있으면 사용자 가치가 큽니다.',
    priority: 'medium',
    keywords: ['상속포기', '한정승인', '기한', '상속'],
  },
  {
    id: 'expected-criminal-police',
    locale: 'ko',
    category: 'criminal_investigation',
    question: '대만 경찰에서 출석 연락이 오면 조사 전에 무엇을 조심해야 하나요?',
    why: '고위험이지만 반복 질문이 많아 안전한 초기 행동 기준을 고정할 필요가 있습니다.',
    priority: 'high',
    keywords: ['경찰조사', '출석', '진술', '서명', '형사'],
  },
];

function clip(value: string, limit: number): string {
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, limit - 3)}...`;
}

function makeKnowledgeId(question: string): string {
  const stem = question
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 42) || 'attorney-answer';
  return `ak-${stem}-${Date.now().toString(36)}`;
}

function parseKeywords(raw: string[] | string | undefined): string[] {
  const items = Array.isArray(raw) ? raw : typeof raw === 'string' ? raw.split(',') : [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    const keyword = item.replace(/\s+/g, ' ').trim();
    if (!keyword || seen.has(keyword)) continue;
    out.push(keyword);
    seen.add(keyword);
    if (out.length >= MAX_KEYWORDS) break;
  }
  return out;
}

function safeParse<T>(line: string): T | null {
  try {
    return JSON.parse(line) as T;
  } catch {
    return null;
  }
}

export async function saveAttorneyKnowledgeEntry(
  input: AttorneyKnowledgeInput,
): Promise<ConsultationAttorneyKnowledgeReference> {
  const now = new Date().toISOString();
  const record: AttorneyKnowledgeRecord = {
    id: input.id?.trim() || makeKnowledgeId(input.question),
    locale: input.locale,
    category: input.category,
    question: clip(input.question, MAX_QUESTION_CHARS),
    answer: clip(input.answer, MAX_ANSWER_CHARS),
    keywords: parseKeywords(input.keywords),
    reviewedBy: input.reviewedBy ? clip(input.reviewedBy, 80) : undefined,
    reviewedAt: now,
    updatedAt: now,
    sourceNote: input.sourceNote ? clip(input.sourceNote, 240) : undefined,
    status: 'approved',
    action: 'upsert',
  };
  const dateKey = now.slice(0, 10);
  await appendConsultationLogLine('knowledge', dateKey, JSON.stringify(record));
  const { status: _status, action: _action, ...entry } = record;
  void _status;
  void _action;
  return entry;
}

export async function archiveAttorneyKnowledgeEntry(id: string): Promise<void> {
  const now = new Date().toISOString();
  const record: AttorneyKnowledgeRecord = {
    id,
    locale: 'ko',
    category: 'general',
    question: '',
    answer: '',
    keywords: [],
    reviewedAt: now,
    updatedAt: now,
    status: 'archived',
    action: 'archive',
  };
  await appendConsultationLogLine('knowledge', now.slice(0, 10), JSON.stringify(record));
}

export async function readAttorneyKnowledgeEntries(): Promise<ConsultationAttorneyKnowledgeReference[]> {
  const lines = await readConsultationLogLines('knowledge', 0);
  const byId = new Map<string, AttorneyKnowledgeRecord>();
  for (const line of lines) {
    const record = safeParse<AttorneyKnowledgeRecord>(line);
    if (!record || typeof record.id !== 'string') continue;
    const previous = byId.get(record.id);
    if (!previous || record.updatedAt > previous.updatedAt) {
      byId.set(record.id, record);
    }
  }

  return Array.from(byId.values())
    .filter((record) => record.status === 'approved' && record.question && record.answer)
    .map((record) => {
      const { status: _status, action: _action, ...entry } = record;
      void _status;
      void _action;
      return entry;
    })
    .sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1));
}

function tokenize(value: string): Set<string> {
  const normalized = value.toLowerCase();
  const rawTokens = normalized.split(/[\s\u3000。、，．・！？『』「」（）\[\],.!?;:()]+/u);
  const out = new Set<string>();
  for (const raw of rawTokens) {
    const token = raw.trim();
    if (token.length < 2) continue;
    out.add(token);
    const compact = token.replace(/[^a-z0-9가-힣\u4e00-\u9fff]/g, '');
    if (compact.length >= 2) out.add(compact);
  }
  return out;
}

function scoreKnowledgeEntry(
  query: string,
  category: ConsultationCategory,
  entry: ConsultationAttorneyKnowledgeReference,
): number {
  const queryTokens = tokenize(query);
  if (queryTokens.size === 0) return 0;
  const haystack = tokenize([
    entry.question,
    entry.answer.slice(0, 500),
    entry.keywords.join(' '),
  ].join(' '));
  let hits = 0;
  for (const token of queryTokens) {
    if (haystack.has(token) || entry.keywords.some((kw) => kw.toLowerCase().includes(token))) {
      hits += 1;
    }
  }
  const overlap = hits / queryTokens.size;
  const categoryBoost = entry.category === category ? 0.18 : entry.category === 'general' ? 0.05 : 0;
  const keywordBoost = entry.keywords.some((kw) => query.toLowerCase().includes(kw.toLowerCase())) ? 0.22 : 0;
  return overlap + categoryBoost + keywordBoost;
}

export async function findAttorneyKnowledgeForQuery(
  query: string,
  category: ConsultationCategory,
  locale: Locale,
  limit = 2,
): Promise<ConsultationAttorneyKnowledgeReference[]> {
  const entries = await readAttorneyKnowledgeEntries();
  return entries
    .filter((entry) => entry.locale === locale)
    .map((entry) => ({ entry, score: scoreKnowledgeEntry(query, category, entry) }))
    .filter(({ score }) => score >= 0.25)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }) => entry);
}

export function getAttorneyKnowledgeContextText(
  entries: ConsultationAttorneyKnowledgeReference[],
): string {
  if (entries.length === 0) return '';
  return entries
    .map((entry) => [
      `<attorney_qa id="${entry.id}" category="${entry.category}" reviewedAt="${entry.reviewedAt}">`,
      `Question: ${entry.question}`,
      `Attorney-reviewed answer: ${entry.answer}`,
      entry.keywords.length > 0 ? `Keywords: ${entry.keywords.join(', ')}` : '',
      '</attorney_qa>',
    ].filter(Boolean).join('\n'))
    .join('\n\n');
}

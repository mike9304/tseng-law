import type { Locale } from '@/lib/locales';
import { normalizeLocale } from '@/lib/locales';

export type ConsultationCopy = {
  pageTitle: string;
  heroTitle: string;
  heroDescription: string;
  windowLabel: string;
  windowAriaLabel: string;
  windowOptions: Array<{ days: number; label: string }>;
  loadErrorTitle: string;
  loadErrorDescription: string;
  loadErrorFallbackPrefix: string;
  loadErrorSecondaryNote: string;
  conversionTitle: string;
  conversionDescription: string;
  funnelHeaders: {
    stage: string;
    count: string;
  };
  funnelStages: string[];
  conversionHeaders: {
    step: string;
    rate: string;
  };
  conversionSteps: string[];
  performanceTitle: string;
  performanceDescription: string;
  performanceRowLabels: {
    latencyP50: string;
    latencyP95: string;
    latencyP99: string;
    avgLatency: string;
    totalPromptTokens: string;
    totalCompletionTokens: string;
    estimatedTotalCost: string;
    avgCostPerChat: string;
  };
  safetyTitle: string;
  safetyRowLabels: {
    chatFailed: string;
    chatRateLimited: string;
    promptInjectionBlocked: string;
    piiBypassTriggered: string;
    lowConfidenceBypass: string;
    groundednessFlagged: string;
    stalenessWarningShown: string;
    submitRateLimited: string;
    submitDuplicate: string;
    submitConsentMissing: string;
    submitEmailFailed: string;
  };
  categoryTitle: string;
  riskTitle: string;
  localeTitle: string;
  riskTableHeaders: {
    level: string;
    count: string;
  };
  localeTableHeaders: {
    locale: string;
    count: string;
  };
  feedbackTitle: string;
  feedbackDescription: string;
  categoryTableHeader: string;
  categoryTableHeaders: {
    chats: string;
    submissions: string;
    positive: string;
    negative: string;
    empty: string;
  };
  recentNegativeTitle: string;
  recentNegativeDescription: string;
  recentNegativeEmpty: string;
  recentSubmissionsTitle: string;
  recentSubmissionsDescription: string;
  recentSubmissionsEmpty: string;
  recentSubmissionsHeaders: {
    time: string;
    intakeId: string;
    category: string;
    risk: string;
    urgency: string;
    contact: string;
    status: string;
  };
  recentChatTitle: string;
  recentChatDescription: string;
  recentChatEmpty: string;
  knowledgeTitle: string;
  knowledgeDescription: string;
  knowledgeDirectTitle: string;
  knowledgeApprovedTitle: string;
  knowledgeGapTitle: string;
  knowledgeSuggestedTitle: string;
  knowledgeStatus: {
    saved: string;
    archived: string;
    missing: string;
    error: string;
  };
  knowledgeForm: {
    categoryLabel: string;
    questionLabel: string;
    questionPlaceholder: string;
    answerLabel: string;
    answerPlaceholder: string;
    answerHint: string;
    keywordsLabel: string;
    keywordsPlaceholder: string;
    reviewerLabel: string;
    reviewerPlaceholder: string;
    submitLabel: string;
    archiveLabel: string;
    saveLabel: string;
    candidateSaveLabel: string;
    suggestedSaveLabel: string;
  };
  emptyStates: {
    approvedKnowledge: string;
    gapCandidates: string;
    suggestedQuestions: string;
  };
};

const COPY: Record<Locale, ConsultationCopy> = {
  ko: {
    pageTitle: '상담 관리',
    heroTitle: '호정 AI 상담 운영 대시보드',
    heroDescription: '최근 {days}일 구간 · 총 이벤트 {events}개 · 피드백 {feedback}개 · 생성 시각 {generatedAt}',
    windowLabel: '시간 범위',
    windowAriaLabel: '상담 대시보드 기간 선택',
    windowOptions: [
      { days: 1, label: '1일' },
      { days: 7, label: '7일' },
      { days: 14, label: '14일' },
      { days: 30, label: '30일' },
      { days: 90, label: '90일' },
    ],
    loadErrorTitle: '대시보드 대체 모드',
    loadErrorDescription: '메트릭 로딩에 실패했지만 페이지 자체는 열어 둡니다.',
    loadErrorFallbackPrefix: '로그 스토리지 읽기 실패',
    loadErrorSecondaryNote: '현재는 0값 fallback으로 렌더링 중입니다. 로컬 리뷰에서는 파일 로그를 우선 사용하도록 조정했습니다.',
    conversionTitle: '전환 퍼널',
    conversionDescription: '세션 발생부터 이메일 접수 완료까지 단계별 드롭오프.',
    funnelHeaders: { stage: '단계', count: '개수' },
    funnelStages: [
      '세션 시작',
      '채팅 수신',
      '채팅 답변',
      '에스컬레이션 표시',
      '폼 열림',
      '폼 제출 시도',
      '제출 수신',
      '제출 검증',
      '제출 이메일 발송',
    ],
    conversionHeaders: { step: '전환 단계', rate: '비율' },
    conversionSteps: [
      '채팅 수신 → 답변',
      '채팅 수신 → 제출 수신',
      '제출 수신 → 이메일 발송',
      '전체 퍼널 (채팅 → 이메일 발송)',
    ],
    performanceTitle: '성능 및 비용',
    performanceDescription: '최근 {days}일 LLM 호출 {samples}건 기준. gpt-4o-mini 가격 (입력 $0.15 / 출력 $0.60 per 1M tokens).',
    performanceRowLabels: {
      latencyP50: '지연 p50',
      latencyP95: '지연 p95',
      latencyP99: '지연 p99',
      avgLatency: '평균 지연',
      totalPromptTokens: '총 프롬프트 토큰',
      totalCompletionTokens: '총 완성 토큰',
      estimatedTotalCost: '예상 총비용 (USD)',
      avgCostPerChat: '채팅당 평균 비용 (USD)',
    },
    safetyTitle: '안전 및 제한',
    safetyRowLabels: {
      chatFailed: '채팅 실패',
      chatRateLimited: '채팅 속도 제한(IP)',
      promptInjectionBlocked: '프롬프트 인젝션 차단',
      piiBypassTriggered: 'PII 우회 발생',
      lowConfidenceBypass: '낮은 신뢰도 우회',
      groundednessFlagged: '근거성 경고',
      stalenessWarningShown: '오래된 정보 경고',
      submitRateLimited: '제출 속도 제한(세션)',
      submitDuplicate: '중복 제출',
      submitConsentMissing: '제출 동의 누락',
      submitEmailFailed: '제출 이메일 실패',
    },
    categoryTitle: '카테고리 분포',
    riskTitle: '위험도 분포',
    localeTitle: '언어 분포',
    riskTableHeaders: { level: '레벨', count: '개수' },
    localeTableHeaders: { locale: '언어', count: '개수' },
    feedbackTitle: '피드백 개요',
    feedbackDescription: '전체 피드백 {total}건 중 👍 {helpful}건 ({ratio}%), 👎 {unhelpful}건.',
    categoryTableHeader: '카테고리',
    categoryTableHeaders: {
      chats: '채팅',
      submissions: '제출',
      positive: '👍',
      negative: '👎',
      empty: '기간 내 채팅 이벤트가 없습니다.',
    },
    recentNegativeTitle: '최근 👎 피드백',
    recentNegativeDescription: '변호사 재검토 대상. 메시지 본문은 저장되지 않고, 사용자가 남긴 코멘트만 PII 마스킹 후 노출됩니다.',
    recentNegativeEmpty: '👎 피드백이 없습니다.',
    recentSubmissionsTitle: '최근 접수',
    recentSubmissionsDescription: '최근 10건의 상담 접수 (실제 수신 이메일 내용은 본 문서에 노출되지 않습니다).',
    recentSubmissionsEmpty: '기간 내 제출 이벤트가 없습니다.',
    recentSubmissionsHeaders: {
      time: '시간(타이베이)',
      intakeId: '접수 ID',
      category: '카테고리',
      risk: '위험',
      urgency: '긴급도',
      contact: '연락 방법',
      status: '상태',
    },
    recentChatTitle: 'Recent chat samples',
    recentChatDescription: '최근 15개 채팅 이벤트. 메시지는 이메일/전화번호/RRN이 서버 저장 시점에 redact된 상태입니다.',
    recentChatEmpty: '기간 내 채팅 이벤트가 없습니다.',
    knowledgeTitle: '변호사 검토 Q&A 학습',
    knowledgeDescription: '승인된 답변 {approvedCount}개. AI는 공개 칼럼 근거가 약해도 이 답변과 질문이 맞으면 변호사 검토 Q&A를 우선 사용합니다.',
    knowledgeDirectTitle: '직접 추가',
    knowledgeApprovedTitle: '승인된 Q&A',
    knowledgeGapTitle: '로그 기반 공백 후보',
    knowledgeSuggestedTitle: '미리 준비할 예상 질문',
    knowledgeStatus: {
      saved: '변호사 검토 Q&A가 저장되었습니다.',
      archived: '선택한 Q&A가 보관 처리되었습니다.',
      missing: '질문과 변호사 답변을 모두 입력해야 저장됩니다.',
      error: 'Q&A 저장 중 오류가 발생했습니다.',
    },
    knowledgeForm: {
      categoryLabel: '분류',
      questionLabel: '질문',
      questionPlaceholder: '사용자가 자주 물어보는 질문을 그대로 적습니다.',
      answerLabel: '변호사 답변',
      answerPlaceholder: 'AI가 그대로 인용할 수 있는 안전한 범위의 답변을 작성합니다.',
      answerHint: '최신 법률 판단이 필요하면 “구체 사안은 상담 필요”처럼 경계를 포함해 주세요.',
      keywordsLabel: '검색 키워드',
      keywordsPlaceholder: '상담료, 예약, 비용',
      reviewerLabel: '검토자',
      reviewerPlaceholder: '담당 변호사 또는 운영자',
      submitLabel: '답변 저장',
      archiveLabel: '보관',
      saveLabel: '수정 저장',
      candidateSaveLabel: '후보 답변 저장',
      suggestedSaveLabel: '예상 질문 답변 저장',
    },
    emptyStates: {
      approvedKnowledge: '아직 승인된 변호사 Q&A가 없습니다. 아래 후보 질문부터 답변을 채워 주세요.',
      gapCandidates: '최근 로그에서 반복 답변 공백 후보가 아직 발견되지 않았습니다.',
      suggestedQuestions: '현재 언어의 예상 질문 후보가 없습니다.',
    },
  },
  'zh-hant': {
    pageTitle: '諮詢管理',
    heroTitle: 'Hojeong AI 諮詢營運儀表板',
    heroDescription: '最近 {days} 天 · 總事件 {events} 筆 · 回饋 {feedback} 筆 · 產生時間 {generatedAt}',
    windowLabel: '時間範圍',
    windowAriaLabel: '選擇諮詢儀表板期間',
    windowOptions: [
      { days: 1, label: '1天' },
      { days: 7, label: '7天' },
      { days: 14, label: '14天' },
      { days: 30, label: '30天' },
      { days: 90, label: '90天' },
    ],
    loadErrorTitle: '儀表板備援模式',
    loadErrorDescription: '雖然指標載入失敗，但頁面仍可開啟。',
    loadErrorFallbackPrefix: '日誌儲存讀取失敗',
    loadErrorSecondaryNote: '目前以 0 值備援方式呈現。於本地檢視時已優先使用檔案日誌。',
    conversionTitle: '轉換漏斗',
    conversionDescription: '從 session 發生到 email 接收完成的各步驟掉落。',
    funnelHeaders: { stage: '階段', count: '數量' },
    funnelStages: [
      'Session 開始',
      '收到聊天',
      '聊天已回覆',
      '顯示升級處理',
      '表單開啟',
      '表單提交嘗試',
      '收到提交',
      '提交驗證',
      '提交 email 已送出',
    ],
    conversionHeaders: { step: '轉換步驟', rate: '比例' },
    conversionSteps: [
      '收到聊天 → 已回覆',
      '收到聊天 → 收到提交',
      '收到提交 → email 已送出',
      '完整漏斗（聊天 → email 已送出）',
    ],
    performanceTitle: '效能與成本',
    performanceDescription: '依最近 {days} 天 {samples} 次 LLM 呼叫。gpt-4o-mini 價格（輸入 $0.15 / 輸出 $0.60 per 1M tokens）。',
    performanceRowLabels: {
      latencyP50: '延遲 p50',
      latencyP95: '延遲 p95',
      latencyP99: '延遲 p99',
      avgLatency: '平均延遲',
      totalPromptTokens: '總提示 token',
      totalCompletionTokens: '總完成 token',
      estimatedTotalCost: '預估總成本 (USD)',
      avgCostPerChat: '平均每則聊天成本 (USD)',
    },
    safetyTitle: '安全與限制',
    safetyRowLabels: {
      chatFailed: '聊天失敗',
      chatRateLimited: '聊天速率限制(IP)',
      promptInjectionBlocked: '提示注入已阻擋',
      piiBypassTriggered: 'PII 繞過觸發',
      lowConfidenceBypass: '低信心繞過',
      groundednessFlagged: '可依據性警示',
      stalenessWarningShown: '舊資訊警示',
      submitRateLimited: '提交速率限制(工作階段)',
      submitDuplicate: '重複提交',
      submitConsentMissing: '缺少提交同意',
      submitEmailFailed: '提交 email 失敗',
    },
    categoryTitle: '分類分布',
    riskTitle: '風險等級分布',
    localeTitle: '語言分布',
    riskTableHeaders: { level: '等級', count: '數量' },
    localeTableHeaders: { locale: '語言', count: '數量' },
    feedbackTitle: '回饋總覽',
    feedbackDescription: '所有回饋 {total} 筆中 👍 {helpful} 筆 ({ratio}%)、👎 {unhelpful} 筆。',
    categoryTableHeader: '分類',
    categoryTableHeaders: {
      chats: '聊天',
      submissions: '提交',
      positive: '👍',
      negative: '👎',
      empty: '期間內沒有聊天事件。',
    },
    recentNegativeTitle: '最近 👎 回饋',
    recentNegativeDescription: '供律師複查。訊息正文不會儲存，僅顯示經 PII 遮罩後的使用者留言。',
    recentNegativeEmpty: '沒有 👎 回饋。',
    recentSubmissionsTitle: '最近提交',
    recentSubmissionsDescription: '最近 10 筆諮詢提交（實際收到的 email 內容不會顯示在此文件中）。',
    recentSubmissionsEmpty: '期間內沒有提交事件。',
    recentSubmissionsHeaders: {
      time: '時間（台北）',
      intakeId: '收件 ID',
      category: '分類',
      risk: '風險',
      urgency: '緊急度',
      contact: '聯絡方式',
      status: '狀態',
    },
    recentChatTitle: '最近聊天樣本',
    recentChatDescription: '最近 15 筆聊天事件。訊息在伺服器儲存時已遮罩電子郵件、電話號碼與 RRN。',
    recentChatEmpty: '期間內沒有聊天事件。',
    knowledgeTitle: '律師審核 Q&A 學習',
    knowledgeDescription: '已核准答案 {approvedCount} 筆。即使公開欄位依據較弱，只要問題與答案吻合，AI 會優先使用這些律師審核 Q&A。',
    knowledgeDirectTitle: '直接新增',
    knowledgeApprovedTitle: '已核准 Q&A',
    knowledgeGapTitle: '日誌中的缺口候選',
    knowledgeSuggestedTitle: '預先準備的預期問題',
    knowledgeStatus: {
      saved: '律師審核 Q&A 已儲存。',
      archived: '已將所選 Q&A 封存。',
      missing: '需要同時輸入問題與律師答案才能儲存。',
      error: '儲存 Q&A 時發生錯誤。',
    },
    knowledgeForm: {
      categoryLabel: '分類',
      questionLabel: '問題',
      questionPlaceholder: '直接寫下使用者最常問的問題。',
      answerLabel: '律師答案',
      answerPlaceholder: '撰寫 AI 可直接引用且安全的回答。',
      answerHint: '若需要最新法律判斷，請包含「具體情況仍需諮詢」之類的界線。',
      keywordsLabel: '搜尋關鍵字',
      keywordsPlaceholder: '諮詢費, 預約, 費用',
      reviewerLabel: '審核者',
      reviewerPlaceholder: '承辦律師或營運人員',
      submitLabel: '儲存答案',
      archiveLabel: '封存',
      saveLabel: '儲存修改',
      candidateSaveLabel: '儲存候選答案',
      suggestedSaveLabel: '儲存預期問題答案',
    },
    emptyStates: {
      approvedKnowledge: '尚未有已核准的律師 Q&A。請先從下方候選問題開始填寫答案。',
      gapCandidates: '最近的日誌中尚未發現重複的答覆缺口候選。',
      suggestedQuestions: '目前語言沒有預期問題候選。',
    },
  },
  en: {
    pageTitle: 'Consultation admin',
    heroTitle: 'Hojeong AI consultation operations dashboard',
    heroDescription: 'Last {days} days · {events} total events · {feedback} feedback entries · generated at {generatedAt}',
    windowLabel: 'Time window',
    windowAriaLabel: 'Select consultation dashboard time window',
    windowOptions: [
      { days: 1, label: '1d' },
      { days: 7, label: '7d' },
      { days: 14, label: '14d' },
      { days: 30, label: '30d' },
      { days: 90, label: '90d' },
    ],
    loadErrorTitle: 'Dashboard fallback mode',
    loadErrorDescription: 'Metric loading failed, but the page stays open.',
    loadErrorFallbackPrefix: 'Failed to read log storage',
    loadErrorSecondaryNote: 'The page is currently rendering with a zero-value fallback. Local review prefers file logs first.',
    conversionTitle: 'Conversion funnel',
    conversionDescription: 'Stage-by-stage drop-off from session start through email receipt.',
    funnelHeaders: { stage: 'Stage', count: 'Count' },
    funnelStages: [
      'Session started',
      'Chat received',
      'Chat answered',
      'Escalation shown',
      'Form opened',
      'Form submit attempted',
      'Submit received',
      'Submit validated',
      'Submit email sent',
    ],
    conversionHeaders: { step: 'Conversion step', rate: 'Rate' },
    conversionSteps: [
      'Chat received → answered',
      'Chat received → submit received',
      'Submit received → email sent',
      'Full funnel (chat → email sent)',
    ],
    performanceTitle: 'Performance & cost',
    performanceDescription: 'Based on {samples} LLM calls across the last {days} days. gpt-4o-mini pricing (input $0.15 / output $0.60 per 1M tokens).',
    performanceRowLabels: {
      latencyP50: 'Latency p50',
      latencyP95: 'Latency p95',
      latencyP99: 'Latency p99',
      avgLatency: 'Avg latency',
      totalPromptTokens: 'Total prompt tokens',
      totalCompletionTokens: 'Total completion tokens',
      estimatedTotalCost: 'Estimated total cost (USD)',
      avgCostPerChat: 'Avg cost per chat (USD)',
    },
    safetyTitle: 'Safety & rate limits',
    safetyRowLabels: {
      chatFailed: 'Chat failed',
      chatRateLimited: 'Chat rate-limited (IP)',
      promptInjectionBlocked: 'Prompt injection blocked',
      piiBypassTriggered: 'PII bypass triggered',
      lowConfidenceBypass: 'Low-confidence bypass',
      groundednessFlagged: 'Groundedness flagged',
      stalenessWarningShown: 'Staleness warning shown',
      submitRateLimited: 'Submit rate-limited (session)',
      submitDuplicate: 'Submit duplicate',
      submitConsentMissing: 'Submit consent missing',
      submitEmailFailed: 'Submit email failed',
    },
    categoryTitle: 'Category breakdown',
    riskTitle: 'Risk level distribution',
    localeTitle: 'Locale distribution',
    riskTableHeaders: { level: 'Level', count: 'Count' },
    localeTableHeaders: { locale: 'Locale', count: 'Count' },
    feedbackTitle: 'Feedback overview',
    feedbackDescription: 'Out of {total} total feedback entries, 👍 {helpful} ({ratio}%), 👎 {unhelpful}.',
    categoryTableHeader: 'Category',
    categoryTableHeaders: {
      chats: 'Chats',
      submissions: 'Submissions',
      positive: '👍',
      negative: '👎',
      empty: '(no chat events in window)',
    },
    recentNegativeTitle: 'Recent 👎 feedback',
    recentNegativeDescription: 'Attorney review queue. Message bodies are not stored; only user comments masked for PII are shown.',
    recentNegativeEmpty: 'No 👎 feedback.',
    recentSubmissionsTitle: 'Recent submissions',
    recentSubmissionsDescription: 'The last 10 consultation submissions (raw email bodies are not shown in this document).',
    recentSubmissionsEmpty: 'No submission events in this window.',
    recentSubmissionsHeaders: {
      time: 'Time (Taipei)',
      intakeId: 'Intake ID',
      category: 'Category',
      risk: 'Risk',
      urgency: 'Urgency',
      contact: 'Contact',
      status: 'Status',
    },
    recentChatTitle: 'Recent chat samples',
    recentChatDescription: 'The last 15 chat events. Messages are redacted for email, phone number, and RRN at storage time.',
    recentChatEmpty: 'No chat events in this window.',
    knowledgeTitle: 'Attorney review Q&A training',
    knowledgeDescription: '{approvedCount} approved answers. If the public article evidence is weak but the question matches, AI uses these attorney-reviewed Q&As first.',
    knowledgeDirectTitle: 'Add directly',
    knowledgeApprovedTitle: 'Approved Q&A',
    knowledgeGapTitle: 'Log-based gap candidates',
    knowledgeSuggestedTitle: 'Questions to prepare in advance',
    knowledgeStatus: {
      saved: 'Attorney-review Q&A saved.',
      archived: 'Selected Q&A archived.',
      missing: 'Enter both a question and an attorney answer before saving.',
      error: 'Error while saving Q&A.',
    },
    knowledgeForm: {
      categoryLabel: 'Category',
      questionLabel: 'Question',
      questionPlaceholder: 'Write the question users ask most often.',
      answerLabel: 'Attorney answer',
      answerPlaceholder: 'Write an answer that AI can quote safely and directly.',
      answerHint: 'If current legal judgment is needed, include a boundary such as “specific case still requires consultation.”',
      keywordsLabel: 'Search keywords',
      keywordsPlaceholder: 'consultation fee, booking, cost',
      reviewerLabel: 'Reviewer',
      reviewerPlaceholder: 'Attorney or operator',
      submitLabel: 'Save answer',
      archiveLabel: 'Archive',
      saveLabel: 'Save changes',
      candidateSaveLabel: 'Save candidate answer',
      suggestedSaveLabel: 'Save suggested question answer',
    },
    emptyStates: {
      approvedKnowledge: 'No approved attorney Q&A yet. Start with a candidate question below.',
      gapCandidates: 'No repeated answer-gap candidates found in recent logs.',
      suggestedQuestions: 'No suggested questions for the current locale.',
    },
  },
};

export function getConsultationCopy(locale: Locale): ConsultationCopy {
  return COPY[normalizeLocale(locale)];
}

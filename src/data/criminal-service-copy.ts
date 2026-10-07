import type { SiteLocale } from '@/lib/locales';

export const CRIMINAL_SERVICE_COLUMN_SLUGS = [
  "taiwan-criminal-witness-summons-refuse-testimony",
  "taiwan-criminal-settlement-withdraw-complaint",
  "taiwan-non-prosecution-reconsideration-deadline",
  "taiwan-seized-phone-property-return"
];

export const CRIMINAL_SERVICE_POINTS: Record<SiteLocale, string[]> = {
  "ko": [
    "수사 단계의 진술과 통역은 증인·피의자 등 절차상 지위와 발송 기관을 확인한 뒤 준비합니다.",
    "고소가 소추 요건인 죄의 고소기간은 고소권자가 범인을 안 때부터 6개월입니다. 모든 형사사건에 같은 기한이 적용되지는 않습니다(형사소송법 제237조).",
    "고소가 필요한 죄의 고소취소는 1심 변론 종결 전까지 가능하며, 취소한 사람은 다시 고소하지 못합니다. 합의금 지급 시점과 취소 문구를 함께 살핍니다(제238조).",
    "고소인이 불기소 처분에 불복하면 처분서를 받은 뒤 10일 안에 원 검사를 거쳐 재의를 신청합니다. 신청 자격과 예외, 송달에 따른 기간 계산을 확인해야 합니다(제256조).",
    "보관할 필요가 없는 압수물은 사건 종결 전에도 법원 결정이나 검사 명령으로 반환해야 합니다. 임시 반환과 불복은 요건·기한을 따로 확인합니다(제142조·제416조)."
  ],
  "zh-hant": [
    "準備偵查中的陳述與通譯需求時，先確認是證人、犯罪嫌疑人或其他身分，以及通知由哪個機關發出。",
    "告訴乃論之罪的告訴期間，自告訴權人知悉犯人時起算6個月；並非所有刑案都適用同一期限（刑事訴訟法第237條）。",
    "告訴乃論之罪，可在第一審辯論終結前撤回告訴，撤回者不得再行告訴。和解付款時間與撤告文字需一併閱讀（第238條）。",
    "告訴人不服不起訴處分，得於接受處分書後10日內經原檢察官聲請再議；仍須核對資格、例外及送達所涉及的期間計算（第256條）。",
    "扣押物無留存必要時，不待案件終結，應由法院裁定或檢察官命令發還。暫行發還與不服處分的救濟，另有條件與期限（第142、416條）。"
  ],
  "en": [
    "Preparation for questioning and interpretation starts with the person’s procedural role and the authority issuing the summons.",
    "For offenses requiring a complaint, the period is six months after the person entitled to complain learns who the offender is. This is not a universal deadline for every criminal case (Code of Criminal Procedure, Article 237).",
    "For a complaint-dependent offense, withdrawal is possible before argument closes at first instance, and the person withdrawing cannot complain again. Read withdrawal language together with settlement payment terms (Article 238).",
    "A complainant seeking reconsideration of non-prosecution has ten days after receipt to submit reasons through the original prosecutor. Eligibility, exceptions and service-based calculation must be checked (Article 256).",
    "A seized item no longer needing retention must be returned by court ruling or prosecutor’s order without waiting for the case to end. Temporary return and review of a disposition have separate requirements (Articles 142 and 416)."
  ],
  "ja": [
    "取調べや通訳の準備では、証人・被疑者などの手続上の立場と、通知を出した機関を確認します。",
    "告訴を必要とする罪の告訴期間は、告訴権者が犯人を知った時から6か月です。すべての刑事事件に共通する期限ではありません（刑事訴訟法第237条）。",
    "告訴を必要とする罪では、第一審弁論終結前まで告訴を取り消せますが、取り消した人は再び告訴できません。示談金の支払条件と取消しの文言を合わせて確認します（第238条）。",
    "不起訴処分に不服がある告訴人は、処分書の受領後10日以内に原検察官を経由して再議を申し立てます。資格、例外、送達に関わる期間計算も確認します（第256条）。",
    "留置の必要がない押収物は、事件終結前でも裁判所の決定または検察官の命令で還付する必要があります。一時的な還付と不服申立てには別の要件があります（第142・416条）。"
  ]
};

/** Exact previous defaults: replace these statements in persisted public records, retaining custom copy. */
export const PREVIOUS_CRIMINAL_SERVICE_POINTS = {
  "ko": [
    "수사 단계 변호인 접견 및 진술 자문, 피해자 대리(고소·고발 절차), 외국인 피의자 한국어 통역 소송 지원.",
    "회사 자금 무단 인출: 회사법 제9조 — 최대 5년 징역 또는 50만~250만 TWD 벌금.",
    "뺑소니(교통사고 후 도주): 형법 제185조의4 — 1년 이상 7년 이하 징역.",
    "취업허가 없이 대만에서 근무하다 적발되면 3년간 입국 금지.",
    "형사 고소 기한은 6개월이며, 이 기한을 놓치면 민사만 가능하므로 사고 직후 빠른 상담이 중요합니다."
  ],
  "zh-hant": [
    "偵查階段律師接見及陳述諮詢、被害人代理（告訴程序），以及外籍被告的韓文口譯與訴訟協助。",
    "違法抽回資本（公司法第9條）：最重5年有期徒刑，或新台幣50萬元至250萬元罰金。",
    "肇事逃逸（刑法第185條之4）：1年以上7年以下有期徒刑。",
    "無工作許可在台工作被查獲者，3年內禁止入境。",
    "刑事告訴期限為6個月，逾期僅能提起民事訴訟，因此事故發生後應儘速諮詢律師。"
  ],
  "en": [
    "Support includes investigation-stage attorney consultation, victim complaint procedure support, and multilingual communication assistance for foreign nationals.",
    "Unlawful withdrawal of company capital can trigger severe penalties under Taiwan company law.",
    "Hit-and-run and serious traffic offenses carry substantial criminal liability.",
    "Working without proper work authorization may cause immigration and criminal exposure.",
    "Criminal complaint deadlines are strict, so immediate legal review after an incident is essential."
  ]
};

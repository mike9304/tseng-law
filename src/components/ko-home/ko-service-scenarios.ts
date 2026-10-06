/**
 * Scenario labels for the ko home service tiles (the zh-hant tag row, 2026-10-06), drawn verbatim from each
 * ko service's description in site-content (or a split of one phrase, e.g. 「피의자·피해자 대리」). No new claims.
 */
export const KO_SERVICE_SCENARIOS: Readonly<Record<string, readonly string[]>> = {
  investment: ['법인 형태 선택', '투자심의위원회 승인', '업종별 인허가'],
  civil: ['계약 분쟁', '손해배상', '소비자 피해'],
  family: ['이혼', '재산분할', '상속'],
  labor: ['해고', '퇴직금', '근로계약 분쟁'],
  criminal: ['수사 대응', '피의자 대리', '피해자 대리'],
  ip: ['상표', '저작권', '금융·투자 관련 분쟁'],
};

/**
 * Scenario labels for zh-hant service cards, drawn from each zh-hant service's title or
 * description (verbatim phrases, or a split of one phrase such as 「被告與被害人代理」). No new claims.
 */
export const ZH_HANT_SERVICE_SCENARIOS: Readonly<Record<string, readonly string[]>> = {
  investment: ['公司設立', '投資審議司審查', '特殊行業許可'],
  civil: ['契約糾紛', '損害賠償', '消費者權益'],
  family: ['離婚', '親權', '繼承'],
  labor: ['解僱', '資遣費', '勞動契約'],
  criminal: ['偵查應對', '被告代理', '被害人代理'],
  ip: ['商標', '著作權', '金融投資相關爭議'],
};

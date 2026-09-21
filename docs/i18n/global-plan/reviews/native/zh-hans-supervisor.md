# zh-hans supervisor review (Fable 5.1, 2026-09-21) — guidance pack, independent of the Grok pass

verdict: meaning faithful, grammar clean; but the register is **Taiwanese Mandarin written in Simplified characters**, not mainland-reader Chinese. A reader in mainland China will notice Taiwan-only legal vocabulary and corner quotes. Naturalness 3/5.

## P1
| # | cat | path | quote | problem | fix |
|---|-----|------|-------|---------|-----|
| 1 | A | pages.services.sections[0].paragraphs[1] | 居留证（居留）或工作许可（工作许可） | self-gloss: the parenthesis repeats the same Simplified word instead of the Taiwan Traditional term | 居留证（外僑居留證，ARC）或工作许可（工作許可） |
| 2 | A | pages.services.sections[2].paragraphs[0] | 离婚（离婚）…继承（继承） | same self-gloss defect | 离婚、财产分配…与继承（drop the parentheses; common words need no gloss） |
| 3 | A | pages.services.sections[3].paragraphs[0] | 资遣费（资遣费；不可与… | self-gloss | 资遣费（資遣費；不可与其他法域的制度等同） |
| 4 | A | pages.services.sections[5].paragraphs[0] | 商标（商标）与专利（专利） | self-gloss | 商标与专利 |

## P2 (mainland localization)
| # | cat | where | quote | fix |
|---|-----|-------|-------|-----|
| 5 | D | systemic (home/services/faq/about/columns) | 智慧财产 | 知识产权（智慧財產權） on first use, then 知识产权 |
| 6 | D | services.sections[3] | 劳动契约 | 劳动合同（勞動契約） |
| 7 | D | home.videoPauseLabel / videoPlayLabel / videoReplayLabel | 暂停影片 / 播放影片 / 重新播放影片 | 暂停视频 / 播放视频 / 重新播放视频 |
| 8 | D | privacy page (systemic) | 资料 (收集哪些资料, 您的资料…) | 信息 / 个人信息 (mainland PIPL vocabulary); keep 资料 only for "文件资料" |
| 9 | B | systemic | 「沟通方式须待确认」, 「昊」, 「鼎」 | mainland typography uses “ ” — “沟通方式须待确认” |
| 10 | D | services.sections[2].paragraphs[0] | 未成年子女权利义务之行使或负担 | 未成年子女的抚养与监护（親權） |
| 11 | D | services.sections[4].paragraphs[1] | 检警 | 检察机关或警方 |

## P3
| 12 | D | about / teamCopy | 营运 / 主持律师 | 运营 / 主任律师（主持律師） — acceptable as is |

Notes: attorney feminine — Chinese does not mark gender in 律师; OK. Consultation-language FAQ (可以用中文咨询吗？可以。) is correct because zh-hans is the one guidance locale whose readers can consult in Chinese (GUIDANCE_CONSULTATION_LANGUAGE_LOCALES = ['zh-hans']).

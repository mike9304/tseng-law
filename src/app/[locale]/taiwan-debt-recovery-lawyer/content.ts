import { CONSULTATION_EMAIL } from '@/lib/consultation/public-contact';
import { EN_INTERNATIONAL_REVIEW } from '@/data/en-international-paths';
import { ML_INTERNATIONAL_REVIEW } from '@/data/multilingual-international-v2';
import type { SiteLocale } from '@/lib/locales';

export const DEBT_RECOVERY_SLUG = 'taiwan-debt-recovery-lawyer';

export const debtRecoveryReview = EN_INTERNATIONAL_REVIEW;

export type DebtRecoveryFaq = { q: string; a: string };

export type DebtRecoverySituation = {
  id: string;
  heading: string;
  problem: string;
  documents: readonly string[];
  questions: readonly string[];
};

export const debtRecoveryContent = {
  metaTitle: 'Taiwan Debt Recovery and Supplier Disputes',
  title: 'Taiwan Debt Recovery and Commercial Disputes for Overseas Businesses',
  description:
    'Prepare for legal advice on unpaid invoices, advance payments, undelivered goods and supplier disputes involving Taiwan.',
  keywords: [
    'Taiwan debt recovery lawyer',
    'Taiwan unpaid invoice',
    'Taiwan supplier dispute',
    'Taiwan commercial dispute',
  ],
  heroLabel: 'Commercial dispute intake',
  lead:
    'Has a customer missed payment, or has a Taiwan supplier failed to deliver after receiving an advance? This page explains the information to organise before discussing a commercial dispute with the firm and the questions an initial legal review may need to address. It does not predict recovery, court outcomes, or a single procedure for every case.',
  reviewNote:
    'This English draft is for local unpublished review. Service-scope, language, and legal wording require attorney review before any public release.',
  situationsHeading: 'Situation-specific starting points',
  situations: [
    {
      id: 'unpaid-invoices',
      heading: 'Unpaid Invoices and Outstanding Payments',
      problem:
        'A Taiwan-connected buyer may have accepted goods or services and then missed an agreed payment date. The first task is to identify the parties, the payment terms, and what has already been performed or disputed.',
      documents: [
        'Contract, purchase order, or written confirmation of the sale',
        'Invoices and the stated payment date',
        'Delivery, acceptance, or performance records',
        'Payment records and any partial-payment history',
      ],
      questions: [
        'Who are the contracting parties, and is the Taiwan entity the correct counterparty?',
        'What payment terms were agreed, and what has already been paid or refused?',
        'Has the counterparty raised a quality, quantity, or set-off objection?',
      ],
    },
    {
      id: 'advance-undelivered',
      heading: 'Advance Payments and Undelivered Goods',
      problem:
        'An overseas buyer may have paid a deposit or the full price and then received no goods, incomplete goods, or a delayed shipment. The review starts from what was promised and what actually happened.',
      documents: [
        'Order confirmation and specification',
        'Proof of the advance or progress payment',
        'Agreed delivery date and any later change',
        'Later messages about production, shipping, or excuses for delay',
      ],
      questions: [
        'What was the agreed product, quantity, and delivery date?',
        'What was paid, when, and to which account or party?',
        'What, if anything, has been delivered, and what remains outstanding?',
      ],
    },
    {
      id: 'defective-inspection',
      heading: 'Defective Goods, Inspection and Acceptance Disputes',
      problem:
        'The parties may disagree about whether goods or equipment meet the contract, a sample, or an inspection standard. The useful starting point is the written standard and the contemporaneous inspection record, not a later summary.',
      documents: [
        'Product specifications, drawings, or quality standards',
        'Inspection or acceptance criteria and any inspection report',
        'Notice of defect and the date it was given',
        'Photographs, test data, or third-party inspection materials already in hand',
      ],
      questions: [
        'What standard was used to judge conformity?',
        'When was the alleged defect discovered and notified?',
        'Was there an agreed inspection, acceptance, or rejection procedure?',
      ],
    },
    {
      id: 'delay-breach',
      heading: 'Delayed Performance and Contract Disagreements',
      problem:
        'A delay, a change order, or a disagreement about contract terms can affect both commercial loss and the available legal options. Those options depend on the contract, later variations, and the evidence of what was actually agreed.',
      documents: [
        'The contract and any written variation',
        'Project or delivery schedule',
        'Correspondence about delay, excuse, or a proposed workaround',
        'Records of the commercial effect already documented, without treating them as a damages conclusion',
      ],
      questions: [
        'Was there a change to the original agreement, and was it recorded?',
        'Does the contract address delay, force majeure, or liquidated amounts?',
        'What deadline, if any, is already running?',
      ],
    },
    {
      id: 'no-response',
      heading: 'When the Taiwan Counterparty Stops Responding',
      problem:
        'Silence does not by itself prove fraud or make a particular court measure available. The first step is still to identify the correct company, the last known contact, and the transaction trail.',
      documents: [
        'Company name, unified business number, and last known address if available',
        'Names and contact details of the people who handled the deal',
        'The full transaction and payment trail',
        'The last incoming and outgoing messages, with dates',
      ],
      questions: [
        'Can the Taiwan company be identified with enough precision to proceed?',
        'Who last communicated, and on what channel?',
        'Is there a registered office, a known representative, or another reachable party?',
      ],
    },
  ] satisfies DebtRecoverySituation[],
  documentsHeading: 'Documents to Organise Before Seeking Advice',
  documentsIntro:
    'The lists on this page are a preparation aid for an initial discussion. They are not a complete statutory document set, and sending originals or sensitive financial files in the first email is not required.',
  processHeading: 'Discussing Options, Costs and Practical Recoverability',
  processIntro:
    'Negotiation, a formal demand, court proceedings, preservation measures, and enforcement are topics for review, not a sequence that applies automatically. Whether any of those steps is available, useful, or proportionate depends on the facts, the evidence, the counterparty, and Taiwan procedure. No percentage of sums collected, timeline, or result is promised.',
  processPoints: [
    'An initial review usually asks what was agreed, what was performed, what is unpaid or undelivered, and what deadline may already be running.',
    'Cost is discussed case by case. This page does not publish a fixed litigation budget, contingency percentage, or collected-sum percentage.',
    'A measure such as preservation or enforcement is not assumed to be available, and a court filing is not assumed to produce payment.',
  ],
  overseasHeading: 'Working with the Firm from Overseas',
  overseasIntro:
    'An initial discussion can usually begin by email or video from outside Taiwan. Later steps, including any filing, appearance, translation, or notarial formality, are mapped after that discussion. Completing an entire matter without any visit or local formality is not promised.',
  languageNote:
    'Office consultations are available in English, Chinese, Korean, and Japanese. Attorney Wei Tseng works with clients directly in Korean, Chinese, and Japanese. English consultation at the office is not the same as a claim that every attorney personally handles every matter in English.',
  faqHeading: 'Questions Before Starting a Claim',
  faq: [
    {
      q: 'Can the first discussion start while I am still overseas?',
      a: 'Yes. A brief outline of the transaction, the Taiwan connection, and any deadline is usually enough to start. Whether later steps can be handled remotely depends on the procedure and is decided after the facts are reviewed.',
    },
    {
      q: 'What if there is no formal contract, only emails or purchase orders?',
      a: 'Written messages, orders, invoices, and payment records can still be useful. They do not automatically prove a claim, and the firm will need to see how the parties actually dealt with each other.',
    },
    {
      q: 'The Taiwan company has stopped answering. Does that mean I can recover the money?',
      a: 'No. Silence is one fact among others. The first task is to identify the correct party and the transaction record. Recovery is not assumed from non-response alone.',
    },
    {
      q: 'Will you start litigation, freeze assets, or enforce a judgment automatically?',
      a: 'No. Those are possible topics for advice after the facts and documents are reviewed. None of them is promised, required, or universally available as the next step.',
    },
    {
      q: 'Should I attach contracts, passports, or bank records to the first email?',
      a: `Please do not send identity documents, account numbers, or other sensitive files in the first message to ${CONSULTATION_EMAIL}. After the firm gives instructions, materials can be provided by the method requested.`,
    },
  ] satisfies DebtRecoveryFaq[],
  ctaTitle: 'Discuss Your Taiwan Payment or Supplier Dispute',
  ctaText:
    'Send a short outline of the transaction, the Taiwan connection, and any deadline. The first email is an enquiry, not the start of a retainer.',
  ctaButton: 'Email the firm',
  civilLinkLabel: 'Explore Other Civil Litigation Services',
  litigationLinkLabel: 'Back to Taiwan litigation guidance',
} as const;

export type DebtRecoveryCopy = {
  metaTitle: string;
  title: string;
  description: string;
  keywords: readonly string[];
  heroLabel: string;
  lead: string;
  reviewNote: string;
  situationsHeading: string;
  situations: readonly DebtRecoverySituation[];
  documentsHeading: string;
  documentsIntro: string;
  processHeading: string;
  processIntro: string;
  processPoints: readonly string[];
  overseasHeading: string;
  overseasIntro: string;
  languageNote: string;
  faqHeading: string;
  faq: readonly DebtRecoveryFaq[];
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
  civilLinkLabel: string;
  litigationLinkLabel: string;
  documentsListLabel: string;
  questionsListLabel: string;
};

const jaDebtRecovery: DebtRecoveryCopy = {
  metaTitle: '台湾企業との取引トラブル・売掛金回収の相談',
  title: '台湾企業との取引トラブル・売掛金回収の相談',
  description:
    '未払い、前払い後の未納品、検収争い、納期・契約違反、連絡途絶について、相談前に整理する資料と確認事項を日本語で案内します。',
  keywords: ['台湾 債権回収', '台湾 取引先 未払い', '台湾 会社設立 弁護士', '台湾 契約紛争'],
  heroLabel: '企業紛争の事前整理',
  lead:
    '台湾の取引先から代金が支払われない、前払い後に品物が届かない、という場合の出発点を整理します。回収率、勝訴、全手続の遠隔完了は約束しません。',
  reviewNote:
    'この日本語原稿は未公開の弁護士レビュー用です。公開前に法律・業務範囲・言語の確認が必要です。',
  situationsHeading: '状況別の出発点',
  situations: [
    {
      id: 'unpaid-invoices',
      heading: '未払い・売掛金の未回収',
      problem:
        '台湾の買主が物品や役務を受領したあと、約定の支払日を過ぎている場合があります。まず当事者、支払条件、履行の有無を特定します。',
      documents: [
        '契約書、発注書、または取引を確認できる書面',
        '請求書と支払期限',
        '納品・検収・履行の記録',
        '入金記録と一部弁済の有無',
      ],
      questions: [
        '契約当事者は誰で、台湾側の相手方は正しいか。',
        '支払条件と、既払い・拒絶の内容は何か。',
        '品質・数量・相殺の異議は出ているか。',
      ],
    },
    {
      id: 'advance-undelivered',
      heading: '前払い後の未納品',
      problem:
        '手付や代金を支払ったあと、物品が届かない、一部しか届かない、遅延している場合があります。約束内容と実際の経過から確認します。',
      documents: [
        '注文確認と仕様',
        '前払い・中間金の証拠',
        '約定納期とその後の変更',
        '製造・出荷・遅延理由に関する連絡',
      ],
      questions: [
        '品目、数量、納期は何と合意したか。',
        'いつ、どの口座・相手にいくら支払ったか。',
        '何が届き、何が未了か。',
      ],
    },
    {
      id: 'defective-inspection',
      heading: '不良品・検収をめぐる争い',
      problem:
        '契約、見本、検査基準に適合するかで意見が分かれる場合があります。後からの要約ではなく、当時の基準と検査記録が出発点です。',
      documents: [
        '仕様、図面、品質基準',
        '検査・検収基準と検査報告書',
        '不適合の通知とその日付',
        '写真、試験データ、既にある第三者検査資料',
      ],
      questions: [
        '適合性を判断した基準は何か。',
        '不適合はいつ発見し、いつ通知したか。',
        '検査・合格・不合格の手続は合意されていたか。',
      ],
    },
    {
      id: 'delay-breach',
      heading: '納期遅延・契約条件の争い',
      problem:
        '遅延、仕様変更、条項の解釈の違いが、損害と取り得る手段の双方に影響します。契約、その後の変更、実際の合意内容によります。',
      documents: [
        '契約書と書面による変更',
        '工程または納期表',
        '遅延、免責、代替案に関する連絡',
        '既に記録されている取引上の影響（損害額の結論ではない）',
      ],
      questions: [
        '当初合意の変更はあり、記録されているか。',
        '遅延、不可抗力、予定損害金の条項はあるか。',
        '既に進行している期限はあるか。',
      ],
    },
    {
      id: 'no-response',
      heading: '取引先からの連絡途絶',
      problem:
        '無応答だけでは詐欺とは言えず、特定の保全手段が当然に使えるわけでもありません。まず正確な会社の特定と取引経緯の確認が必要です。',
      documents: [
        '会社名、統一番号、最後に把握している住所',
        '担当者の氏名と連絡先',
        '取引と支払の一連の記録',
        '最後の送受信とその日付',
      ],
      questions: [
        '台湾の会社を手続に足りる精度で特定できるか。',
        '最後に誰が、どの経路で連絡したか。',
        '登記上の事務所、代表者、他の到達可能な相手はいるか。',
      ],
    },
  ],
  documentsHeading: '相談前に整理するとよい資料',
  documentsIntro:
    'この一覧は初回の整理用です。法定の完全な書類一式ではなく、初回メールに原本や機微な金融情報を付ける必要はありません。',
  processHeading: '交渉・費用・回収可能性の検討',
  processIntro:
    '交渉、請求、訴訟、保全、執行は検討項目であり、自動で進む順序ではありません。利用できるか、実益があるかは事実、証拠、相手方、台湾の手続によります。回収割合、期間、結果は約束しません。',
  processPoints: [
    '初回は、何を合意し、何を履行し、何が未払いまたは未納品で、既に進行している期限があるかを確認します。',
    '費用は事案ごとに説明します。このページは固定の訴訟予算や成功報酬割合を示しません。',
    '保全や執行が可能とは限らず、提訴が支払を生むとも限りません。',
  ],
  overseasHeading: '海外からのご相談',
  overseasIntro:
    '初回のやり取りは、台湾国外からメールやオンラインで始めることができます。その後の提出、出頭、翻訳、公証などの要否は、事実確認のあとに整理します。訪問や現地手続が一切不要になることは約束しません。',
  languageNote:
    '法律相談は英語・中国語・韓国語・日本語で行います。曾雋崴弁護士は韓国語・中国語・日本語で直接対応します。日本語で読めることと、すべての事件を日本語のみで完結できることは異なります。',
  faqHeading: '請求を始める前の質問',
  faq: [
    {
      q: '海外にいても初回の相談を始められますか。',
      a: 'はい。取引の概要、台湾との関係、期限があれば、それで開始できます。その後の手続を遠隔で進められるかは、事実確認後に判断します。',
    },
    {
      q: '正式な契約書がなく、メールや発注書だけの場合は。',
      a: '書面の連絡、発注、請求、入金記録はなお有用です。それだけで請求が認められるわけではなく、実際の取引の進め方を確認します。',
    },
    {
      q: '相手が応答しません。それだけで回収できますか。',
      a: 'いいえ。無応答は一つの事実です。まず相手方と取引記録を特定します。無応答だけで回収できるとは限りません。',
    },
    {
      q: '訴訟、資産の保全、判決の執行を自動で始めますか。',
      a: 'いいえ。それらは事実と資料を確認したあとの検討項目です。次の手順として約束、必須、または常に利用可能ではありません。',
    },
    {
      q: '初回メールに契約書、旅券、口座情報を付けてよいですか。',
      a: `初回のメッセージで身分証、口座番号、その他の機微情報を ${CONSULTATION_EMAIL} に送らないでください。事務所の案内後、指定の方法で提出します。`,
    },
  ],
  ctaTitle: '台湾の代金・供給契約の問題を相談する',
  ctaText:
    '取引の概要、台湾との関係、期限を短く書いてください。初回メールは問い合わせであり、委任の開始ではありません。',
  ctaButton: 'メールで問い合わせる',
  civilLinkLabel: 'その他の民事訴訟サービスを見る',
  litigationLinkLabel: '台湾訴訟の案内に戻る',
  documentsListLabel: '整理するとよい資料',
  questionsListLabel: '初回に確認することが多い点',
};

const koDebtRecovery: DebtRecoveryCopy = {
  metaTitle: '대만 기업 거래 분쟁·미수금 상담 | 법무법인 호정',
  title: '대만 기업 거래 분쟁·미수금 상담',
  description:
    '미지급, 선금 후 미납품, 검수 다툼, 납기·계약 위반, 연락 단절에 대해 상담 전 정리할 자료와 확인 사항을 한국어로 안내합니다.',
  keywords: ['대만 미수금', '대만 계약 분쟁', '대만 채권회수', '대만 변호사'],
  heroLabel: '기업 분쟁 사전 정리',
  lead:
    '대만 거래처가 대금을 지급하지 않거나, 선금 후 물품을 보내지 않는 경우의 출발점을 정리합니다. 회수율, 승소, 전 절차 무방문을 약속하지 않습니다.',
  reviewNote:
    '이 한국어 원고는 미공개 변호사 검토용입니다. 공개 전에 법률·업무 범위·언어를 확인해야 합니다.',
  situationsHeading: '상황별 출발점',
  situations: [
    {
      id: 'unpaid-invoices',
      heading: '미지급·미수금',
      problem:
        '대만 매수인이 물품이나 용역을 받은 뒤 약정 지급일을 넘긴 경우가 있습니다. 먼저 당사자, 지급 조건, 이행 여부를 특정합니다.',
      documents: [
        '계약서, 발주서 또는 거래를 확인할 수 있는 서면',
        '청구서와 지급 기한',
        '납품·검수·이행 기록',
        '입금 기록과 일부 변제 여부',
      ],
      questions: [
        '계약 당사자는 누구이며 대만 측 상대방이 맞는가.',
        '지급 조건과 기지급·거절 내용은 무엇인가.',
        '품질·수량·상계 이의를 제기했는가.',
      ],
    },
    {
      id: 'advance-undelivered',
      heading: '선금 후 미납품',
      problem:
        '계약금이나 대금을 보낸 뒤 물품이 오지 않거나 일부만 오거나 지연되는 경우가 있습니다. 약속 내용과 실제 경과를 확인합니다.',
      documents: [
        '주문 확인과 사양',
        '선금·중도금 증거',
        '약정 납기와 이후 변경',
        '생산·출하·지연 사유 관련 연락',
      ],
      questions: [
        '품목, 수량, 납기를 무엇으로 합의했는가.',
        '언제, 어느 계좌·상대에게 얼마를 지급했는가.',
        '무엇이 도착했고 무엇이 남았는가.',
      ],
    },
    {
      id: 'defective-inspection',
      heading: '불량품·검수 다툼',
      problem:
        '계약, 견본, 검사 기준에 맞는지를 두고 의견이 갈릴 수 있습니다. 나중에 정리한 요약이 아니라 당시 기준과 검사 기록이 출발점입니다.',
      documents: [
        '사양, 도면, 품질 기준',
        '검사·검수 기준과 검사 보고서',
        '부적합 통지와 그 날짜',
        '사진, 시험 데이터, 이미 있는 제3자 검사 자료',
      ],
      questions: [
        '적합성을 판단한 기준은 무엇인가.',
        '부적합은 언제 발견하고 언제 통지했는가.',
        '검사·합격·불합격 절차를 합의했는가.',
      ],
    },
    {
      id: 'delay-breach',
      heading: '납기 지연·계약 조건 다툼',
      problem:
        '지연, 사양 변경, 조항 해석 차이가 손해와 선택 가능한 수단 모두에 영향을 줍니다. 계약, 이후 변경, 실제 합의 내용에 따릅니다.',
      documents: [
        '계약서와 서면 변경',
        '공정 또는 납기표',
        '지연, 면책, 대안에 관한 연락',
        '이미 기록된 거래상 영향(손해액 결론이 아님)',
      ],
      questions: [
        '최초 합의의 변경이 있고 기록되어 있는가.',
        '지연, 불가항력, 예정 손해금 조항이 있는가.',
        '이미 진행 중인 기한이 있는가.',
      ],
    },
    {
      id: 'no-response',
      heading: '거래처 연락 단절',
      problem:
        '무응답만으로 사기라고 단정하거나 특정 보전 수단이 당연히 가능하다고 볼 수 없습니다. 정확한 회사 특정과 거래 경위 확인이 먼저입니다.',
      documents: [
        '회사명, 통일번호, 마지막으로 파악한 주소',
        '담당자 성명과 연락처',
        '거래와 지급의 일련 기록',
        '마지막 송수신과 그 날짜',
      ],
      questions: [
        '대만 회사를 절차에 필요한 정도로 특정할 수 있는가.',
        '마지막으로 누가 어떤 경로로 연락했는가.',
        '등기 사무소, 대표자, 다른 도달 가능한 상대가 있는가.',
      ],
    },
  ],
  documentsHeading: '상담 전에 정리하면 좋은 자료',
  documentsIntro:
    '이 목록은 초회 정리용입니다. 법정 완전 서류 세트가 아니며, 첫 메일에 원본이나 민감한 금융 정보를 첨부할 필요는 없습니다.',
  processHeading: '협상·비용·회수 가능성 검토',
  processIntro:
    '협상, 청구, 소송, 보전, 집행은 검토 항목이지 자동으로 진행되는 순서가 아닙니다. 이용 가능 여부와 실익은 사실, 증거, 상대방, 대만 절차에 따릅니다. 회수 비율, 기간, 결과를 약속하지 않습니다.',
  processPoints: [
    '초회에는 무엇을 합의했고, 무엇을 이행했으며, 무엇이 미지급 또는 미납품이고, 이미 진행 중인 기한이 있는지를 확인합니다.',
    '비용은 사안별로 설명합니다. 이 페이지는 고정 소송 예산이나 성공보수 비율을 제시하지 않습니다.',
    '보전이나 집행이 가능하다고 단정하지 않으며, 소 제기가 지급을 만든다고 단정하지 않습니다.',
  ],
  overseasHeading: '해외에서의 상담',
  overseasIntro:
    '초회 연락은 대만 밖에서 이메일이나 온라인으로 시작할 수 있습니다. 이후 제출, 출석, 번역, 공증 필요 여부는 사실 확인 뒤에 정리합니다. 방문이나 현지 절차가 전혀 필요 없다고 약속하지 않습니다.',
  languageNote:
    '법률 상담은 영어·중국어·일본어·한국어로 진행합니다. 증준외 변호사는 한국어·중국어·일본어로 직접 대응합니다. 한국어로 읽을 수 있다는 것과 모든 사건을 한국어만으로 끝낼 수 있다는 것은 다릅니다.',
  faqHeading: '청구를 시작하기 전의 질문',
  faq: [
    {
      q: '해외에 있어도 초회 상담을 시작할 수 있나요?',
      a: '가능합니다. 거래 개요, 대만과의 관련, 기한이 있으면 시작할 수 있습니다. 이후 절차를 원격으로 진행할 수 있는지는 사실 확인 뒤에 판단합니다.',
    },
    {
      q: '정식 계약서가 없고 이메일이나 발주서만 있는 경우는요?',
      a: '서면 연락, 발주, 청구, 입금 기록은 여전히 유용합니다. 그것만으로 청구가 인정되는 것은 아니며, 실제 거래 진행 방식을 확인합니다.',
    },
    {
      q: '상대가 응답하지 않습니다. 그것만으로 회수할 수 있나요?',
      a: '아닙니다. 무응답은 하나의 사실입니다. 먼저 상대방과 거래 기록을 특정합니다. 무응답만으로 회수된다고 보지 않습니다.',
    },
    {
      q: '소송, 자산 보전, 판결 집행을 자동으로 시작하나요?',
      a: '아닙니다. 사실과 자료를 확인한 뒤의 검토 항목입니다. 다음 단계로 약속하거나 필수이거나 항상 가능한 것은 아닙니다.',
    },
    {
      q: '첫 메일에 계약서, 여권, 계좌 정보를 첨부해도 되나요?',
      a: `첫 메시지에 신분증, 계좌번호, 그 밖의 민감 정보를 ${CONSULTATION_EMAIL} 로 보내지 마세요. 사무소 안내 후 지정된 방법으로 제출합니다.`,
    },
  ],
  ctaTitle: '대만 대금·공급 계약 문제를 상담하기',
  ctaText:
    '거래 개요, 대만과의 관련, 기한을 짧게 적어 주세요. 첫 메일은 문의이며 수임의 시작이 아닙니다.',
  ctaButton: '이메일로 문의하기',
  civilLinkLabel: '다른 민사소송 서비스 보기',
  litigationLinkLabel: '대만 소송 안내로 돌아가기',
  documentsListLabel: '정리하면 좋은 자료',
  questionsListLabel: '초회에 자주 확인하는 점',
};

const zhDebtRecovery: DebtRecoveryCopy = {
  metaTitle: '台灣企業交易糾紛與應收帳款諮詢',
  title: '台灣企業交易糾紛與應收帳款諮詢',
  description:
    '就未付款、預付款後未交貨、驗收爭議、交期或契約違反、以及對方停止聯絡，說明諮詢前可整理的資料與確認事項。',
  keywords: ['台灣應收帳款', '台灣契約爭議', '台灣商業糾紛', '台灣律師'],
  heroLabel: '企業爭議事前整理',
  lead:
    '本頁整理台灣交易相對人未付款、或預付款後未交貨時的出發點。不承諾回收率、勝訴或全程遠端完成。',
  reviewNote: '此中文稿為未公開律師審閱用。公開前須確認法律、業務範圍與語言。',
  situationsHeading: '依情況出發',
  situations: [
    {
      id: 'unpaid-invoices',
      heading: '未付款與應收帳款',
      problem:
        '台灣買方可能已收受貨物或服務，卻超過約定付款日。先確認當事人、付款條件與履行狀況。',
      documents: [
        '契約、訂單或可確認交易的書面',
        '發票與付款期限',
        '交貨、驗收或履行紀錄',
        '入帳紀錄與是否部分付款',
      ],
      questions: [
        '契約當事人是誰，台灣相對人是否正確。',
        '付款條件、已付與拒絕內容為何。',
        '是否提出品質、數量或抵銷異議。',
      ],
    },
    {
      id: 'advance-undelivered',
      heading: '預付款後未交貨',
      problem:
        '可能已支付訂金或價金，卻未收到貨物、僅部分收到或遲延。從約定內容與實際過程確認。',
      documents: [
        '訂單確認與規格',
        '預付款或進度款證明',
        '約定交期及其後變更',
        '生產、出貨或遲延理由的聯繫',
      ],
      questions: [
        '品項、數量、交期如何約定。',
        '何時、向何帳戶或何人支付多少。',
        '已交付什麼、尚缺什麼。',
      ],
    },
    {
      id: 'defective-inspection',
      heading: '瑕疵與驗收爭議',
      problem:
        '雙方可能對是否符合契約、樣品或檢驗標準意見不同。出發點是當時的標準與檢驗紀錄，而非事後摘要。',
      documents: [
        '規格、圖面或品質標準',
        '檢驗或驗收標準與檢驗報告',
        '瑕疵通知及其日期',
        '照片、測試資料或既有第三方檢驗資料',
      ],
      questions: [
        '判斷符合性的標準是什麼。',
        '何時發現、何時通知瑕疵。',
        '是否約定檢驗、合格或不合格程序。',
      ],
    },
    {
      id: 'delay-breach',
      heading: '交期遲延與契約條件爭議',
      problem:
        '遲延、變更或條款解釋差異，會影響商業損失與可採手段。須依契約、其後變更與實際合意判斷。',
      documents: [
        '契約與書面變更',
        '工程或交期表',
        '遲延、免責或替代方案的聯繫',
        '已記錄的交易影響（並非損害結論）',
      ],
      questions: [
        '原合意是否變更，且有無紀錄。',
        '契約是否有遲延、不可抗力或預定損害賠償條款。',
        '是否已有進行中的期限。',
      ],
    },
    {
      id: 'no-response',
      heading: '相對人停止聯絡',
      problem:
        '未回覆本身不能證明詐欺，也不當然可以使用特定保全手段。仍須先特定正確公司與交易軌跡。',
      documents: [
        '公司名稱、統一編號、最後知悉的地址',
        '經辦人姓名與聯絡方式',
        '完整交易與付款軌跡',
        '最後往來訊息及其日期',
      ],
      questions: [
        '能否以足夠精度特定台灣公司。',
        '最後由誰、經何種管道聯繫。',
        '是否有登記事務所、代表人或其他可到達的相對人。',
      ],
    },
  ],
  documentsHeading: '諮詢前可整理的資料',
  documentsIntro:
    '本清單供初次整理使用，並非法定完整文件組合，第一次電子郵件不必附上原本或敏感金融資料。',
  processHeading: '協商、費用與可回收性的討論',
  processIntro:
    '協商、催告、訴訟、保全與執行是討論項目，不是自動進行的順序。能否使用、有無實益，取決於事實、證據、相對人與台灣程序。不承諾回收比例、期間或結果。',
  processPoints: [
    '初次通常確認約定內容、已履行部分、未付或未交部分，以及是否已有進行中的期限。',
    '費用依個案說明。本頁不公布固定訴訟預算或成功報酬比例。',
    '不假設保全或執行當然可用，也不假設起訴必然帶來付款。',
  ],
  overseasHeading: '從海外聯繫本所',
  overseasIntro:
    '初次討論通常可由台灣以外以電子郵件或視訊開始。其後的提出、到場、翻譯或公證需求，於事實確認後再整理。不承諾全程無需到場或無需在地程序。',
  languageNote:
    '法律諮詢以英文、中文、韓文、日文進行。曾雋崴律師可以韓文、中文、日文直接對接。能以中文閱讀，不代表每一案件都能僅以中文完成全部程序。',
  faqHeading: '開始請求前的問題',
  faq: [
    {
      q: '人在海外也能開始第一次討論嗎？',
      a: '可以。交易概要、與台灣的關連、期限通常就足以開始。後續步驟能否遠端進行，須待事實確認後判斷。',
    },
    {
      q: '沒有正式契約、只有電子郵件或訂單呢？',
      a: '書面聯繫、訂單、發票與付款紀錄仍有用。它們不自動證明請求，本所仍須了解雙方實際往來方式。',
    },
    {
      q: '台灣公司已不回覆，是否就能收回款項？',
      a: '不能這樣認定。未回覆只是事實之一。先特定正確相對人與交易紀錄。不能僅因未回覆就假設可回收。',
    },
    {
      q: '會自動起訴、凍結資產或執行判決嗎？',
      a: '不會。那些是事實與文件確認後的討論項目，並非承諾、必要或當然的下一步。',
    },
    {
      q: '第一次電子郵件可以附契約、護照或帳戶資料嗎？',
      a: `請勿在第一次寄給 ${CONSULTATION_EMAIL} 的訊息中附上身分證件、帳號或其他敏感資料。本所說明後，再依指定方式提供。`,
    },
  ],
  ctaTitle: '討論台灣貨款或供應契約問題',
  ctaText:
    '請簡短說明交易概要、與台灣的關連與期限。第一次電子郵件是詢問，不是委任開始。',
  ctaButton: '以電子郵件聯繫',
  civilLinkLabel: '查看其他民事訴訟服務',
  litigationLinkLabel: '返回台灣訴訟說明',
  documentsListLabel: '可整理的資料',
  questionsListLabel: '初次常需確認的問題',
};

export const debtRecoveryByLocale: Record<SiteLocale, DebtRecoveryCopy> = {
  en: {
    ...debtRecoveryContent,
    documentsListLabel: 'Documents that are often useful to organise:',
    questionsListLabel: 'Questions an initial review may need to address:',
  },
  ja: jaDebtRecovery,
  ko: koDebtRecovery,
  'zh-hant': zhDebtRecovery,
};

export const multilingualDebtRecoveryReview = ML_INTERNATIONAL_REVIEW;

/**
 * Simplified Chinese, Malay and Hindi guidance packs. Same contract as the
 * western packs: meaning-unit translation of the German pack; no new facts.
 * Consultations are only English, Chinese, Japanese and Korean. zh-hans is the
 * one guidance locale whose page language overlaps a consultation language
 * (中文). Hindi is a page language only.
 *
 * Formal address for Hindi: आप. Attorney Wei Tseng is named अधिवक्ता Wei Tseng
 * with feminine agreement (वह / उन्होंने). वकीला is not used.
 */
import type { GuidanceLocaleContent } from '@/data/international-guidance-content';

export const simplifiedChineseGuidanceContent: GuidanceLocaleContent = {
  languageName: '简体中文',
  nav: {
    home: '首页',
    services: '业务领域',
    about: '事务所',
    lawyers: '律师',
    pricing: '范围与费用',
    contact: '联系',
    faq: '常见问题',
    privacy: '隐私',
    disclaimer: '免责声明',
    columns: '文章',
  },
  contactCta: '提交咨询请求',
  footerNotice:
    '本简体中文页面仅提供关于本所依台湾法律所从事工作的一般说明。它不是针对具体案件的法律意见，仅提交信息本身并不成立律师与委托人关系。',
  skipLink: '跳过导航，前往正文',
  menuLabel: '页面目录',
  languageLabel: '显示语言',
  mega: {
    services: {
      description: '本所处理依台湾法律划分的主要业务类别。',
      viewAllLabel: '查看全部',
    },
    columns: {
      description: '说明常见台湾法律问题的文章。',
      viewAllLabel: '查看全部',
    },
    lawyers: {
      description: '介绍在职律师与联系方式。',
      viewAllLabel: '查看全部',
    },
    pricing: {
      description: '本页说明工作范围，以及费用如何确定。',
      viewAllLabel: '查看全部',
    },
    faq: {
      description: '关于本所在台湾工作的常见问题。',
      viewAllLabel: '查看全部',
    },
  },
  notFoundTitle: '找不到页面',
  notFoundText:
    '您查找的页面不存在或已移动。您可以返回简体中文首页，查看现有说明。',
  backHomeLabel: '返回首页',
  readSourceLabel: '打开原文语言的文章列表',
  home: {
    heroScrollLabel: '向下滚动',
    heroColumnsCtaLabel: '查看文章',
    servicesDetailLabel: '查看详情',
    servicesAssistanceBefore: '若不清楚您的事项属于哪一组，联系页面',
    servicesAssistanceLinkLabel: '联系',
    servicesAssistanceAfter:
      '说明如何撰写摘要，以便律师审阅。',
    columnsViewAllLabel: '查看全部文章',
    columnsReadMoreLabel: '继续阅读',
    columnsReviewLabel: '由律师曾雋崴审阅',
    columnsOriginalLanguageBadge: '原文语言',
    columnsOriginalLanguageNote:
      '下列文章尚无简体中文版本。列表保持原文语言并打开相应语言页面；内容不会被自动翻译。',
    imageBandAlt: '日光下的台湾传统三合院与现代亭阁',
    videoPauseLabel: '暂停影片',
    videoPlayLabel: '播放影片',
    videoReplayLabel: '重新播放影片',
  },
  pages: {
    home: {
      eyebrow: '说明',
      title: '台湾法律服务 — 简体中文说明',
      description:
        '以简体中文说明 Hovering International Law Firm 在台湾的业务范围、咨询语言与初次联系。',
      intro:
        'Hovering International Law Firm 协助来自境外、亦包括与台湾有关的委托人处理依台湾法律的事项：投资与公司设立、民事争议、婚姻家庭与继承、劳动、刑事与智慧财产。本简体中文部分协助您判断哪些工作属于本所范围、需要准备什么、以及如何联系我们。此处为一般说明，不是针对您本人案件的法律意见。',
      sections: [
        {
          heading: '我们做什么',
          paragraphs: [
            'Hovering International Law Firm 是在台湾执业的律师事务所。本所依台湾法律工作，并在台北、高雄、台中与屏东设有办公室。我们为企业提供咨询、代理诉讼，并协助境外委托人完成在台湾所需的步骤。',
            '此处全部内容均为一般说明。个案结果取决于事实、适用规定与时间点。这些说明不能取代就您的文件与律师进行的讨论。',
          ],
        },
        {
          heading: '页面语言与咨询语言',
          paragraphs: [
            '本页面以简体中文撰写。律师咨询以英语、中文、日语和韩语进行。咨询时使用的中文包括普通话与书面中文。阅读本页并不等于某一次咨询将以某一种书面形式进行。',
            '本页不承诺口译、回复时限或预约。若您无法使用这四种咨询语言中的任何一种，联系页面说明我们将如何审视沟通方式。',
          ],
        },
        {
          heading: '业务类别',
          paragraphs: [
            '业务范围包括以下六组。业务领域页面更详细地说明每一组，并写明本所不承诺的事项。',
          ],
          items: [
            '在台湾的投资与公司设立',
            '民事与损害赔偿',
            '婚姻、家庭与继承',
            '劳动争议',
            '刑事案件',
            '智慧财产：商标、专利与著作权',
          ],
        },
        {
          heading: '建议从何处开始',
          paragraphs: [
            '请先阅读业务领域页面，判断您的事项是否属于本所范围，再阅读范围与费用以及联系，了解工作范围如何确定、以及费用如何在开始工作前确认。',
            '发送信息时，您可以用自己的语言撰写摘要。原文会按您写下的内容保存，不会被自动翻译。已发送的信息是等待审阅的请求：这还不是咨询，也还不是已确认的预约。',
          ],
        },
      ],
    },
    services: {
      eyebrow: '业务领域',
      title: '我们处理哪些事项',
      description:
        '本所在台湾的六组业务，以及您应首先了解的界限。',
      intro:
        '以下是本所实际处理的类别，以及初期常被问到的问题。说明协助您判断事项是否属于本所范围；它是一般性的，不是对单一案件的法律分析。',
      sections: [
        {
          heading: '在台湾的投资与公司设立',
          paragraphs: [
            '我们协助境外投资人与企业在台湾设立或营运公司：选择组织形式、准备并提交文件、资本缴入、银行事项、营业场所审查以及行业特定要求。我们也协助因在台湾设立与营运而产生的会计与税务。',
            '流程与所需时间因组织形式、投资人、行业、银行与既有文件而异。公司设立本身并不会带来居留证（居留）或工作许可（工作许可）：那是另案程序，须依当事人情况另行判断。',
          ],
        },
        {
          heading: '民事与损害赔偿',
          paragraphs: [
            '本组包括合同争议、因侵权行为产生的损害赔偿以及消费者争议。工作通常先整理时序、审查现有文件与证据，然后再决定下一步。',
            '期限（包括法定起诉期间）与证据是否齐备会影响进程。因此请尽早告知已知日期。请保存合同、往来信息、付款凭证或现场照片，并在第一次信息中提及。',
          ],
        },
        {
          heading: '婚姻、家庭与继承',
          paragraphs: [
            '我们处理离婚（离婚）、财产分配、未成年子女权利义务之行使或负担、会面交往与继承（继承），即使当事人或财产位于不同国家。跨境家事案件往往需要额外审查户籍资料、文书形式及其在台湾的证明力。',
            '家事案件常伴随期限与并行程序，第一次摘要应写明当事人关系、目前居住地以及已经进行的程序。',
          ],
        },
        {
          heading: '劳动争议',
          paragraphs: [
            '本组包括劳动关系终止、依台湾法律的资遣费（资遣费；不可与其他法域的制度等同）、工资以及劳动契约争议，劳资双方均可能涉及。审查时，我们把终止原因与预告、给付及期限问题分开看待。',
            '劳动契约、工作规则、薪资单与当事人往来书面通常是关键文件。若您仍持有，请在摘要中提及。',
          ],
        },
        {
          heading: '刑事案件',
          paragraphs: [
            '我们在侦查与审判阶段提供协助，对象可以是犯罪嫌疑人或被告，也可以是被害人，并评估企业活动中的刑事风险。',
            '刑事案件往往期限短、阶段固定。若您已收到检警或法院文书，请尽早告知文书上的日期，以便按正确顺序审阅内容。',
          ],
        },
        {
          heading: '智慧财产',
          paragraphs: [
            '我们协助在台湾办理商标（商标）与专利（专利）登记、著作权以及这些权利的争议。',
            '本组中步骤顺序很重要：保护范围、申请时点与实际使用会影响选择。提交申请本身并不等于获得核准。',
          ],
        },
        {
          heading: '范围及其确认',
          paragraphs: [
            '本所依台湾法律执业，并处理上述各组事项。每一案件的范围会在律师审阅您的信息后另行确认。',
            '居留身份、工作许可及类似问题依各人文件与情况判断，而不是依国籍。若您的事项触及此类问题，请在联系时说明。本页既不承诺结果，也不承诺回复时限。',
          ],
        },
      ],
    },
    about: {
      eyebrow: '事务所',
      title: '关于 Hovering International Law Firm',
      description:
        '关于这家台湾律师事务所、其办公室以及与境外当事人合作的基本说明。',
      intro:
        'Hovering International Law Firm 是台湾的律师事务所。律师的工作涵盖企业咨询至诉讼。本部分说明事务所的成立、地点以及与境外当事人的合作。',
      sections: [
        {
          heading: '成立与组织',
          paragraphs: [
            'Hovering International Law Firm（昊鼎國際法律事務所）于 2016 年由曾就读国立台湾大学（國立臺灣大學）的律师创立。中文名称昊鼎结合「昊」（广阔的天空）与「鼎」（稳固的根基），说明事务所自创立以来的方向。',
            '我们在台北、高雄、台中与屏东设有办公室。高雄办公室侧重企业治理，并处理民事、刑事与行政争议。台中办公室处理营建、智慧财产以及与韩国、日本有关的事项。屏东办公室于 2017 年为当地需求开设。',
            '除律师业务外，自 2020 年起另有 Hovering Accounting Office，为企业主与高净值个人提供会计与税务规划。',
          ],
        },
        {
          heading: '与境外当事人的合作',
          paragraphs: [
            '跨境工作包括公司设立、签证、商标与专利申请、法律风险审查以及企业税务咨询。台中办公室尤其处理营建、智慧财产以及与韩国、日本有关的事项。律师曾雋崴（Wei Tseng）在上述各组中协助来自韩国、日本及其他国际委托人。',
            '能否承接取决于内容与沟通语言。若您的事项属于上述各组，并可以四种咨询语言之一讨论，您可以提交摘要供审阅。',
          ],
        },
        {
          heading: '当您联系我们时',
          paragraphs: [
            '收到您的摘要后，律师会审阅内容，再讨论可能的工作范围、仍需的文件以及下一步。涉及税务或会计问题时，事务所可与会计部门在同一流程中合作。',
            '每一案件的结果取决于事实与现有文件；我们不承诺结果。若您需要针对自身情况的确定答复，必须用四种咨询语言之一，就文件与律师讨论。',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: '律师',
      title: 'Hovering 国际团队',
      description: 'Hovering 律师、运营主管与合作会计师的简介。',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: '范围与费用',
      title: '工作范围与费用如何确定',
      description:
        '说明顺序：先确定工作范围，再确认费用，以及本页为何不含价目表。',
      intro:
        '本页说明费用如何确定，而不是金额。金额取决于各案工作范围，只有在该范围清楚之后才有意义。',
      sections: [
        {
          heading: '首先确定工作范围',
          paragraphs: [
            '同类事项的工作量可能相差很大，取决于当事人人数、现有文件、须遵守的期限，以及程序是否已经开始。因此第一步始终是确定哪些属于工作、哪些不属于。',
            '您一开始提交的摘要是确定该范围的基础。摘要越清楚说明经过、您的需求与期限，范围就能定得越准确。',
          ],
        },
        {
          heading: '费用在开始工作前确认',
          paragraphs: [
            '工作范围清楚后，费用金额与计算方式会在开始工作前与您讨论并确认。若范围中途改变，必须再次确认。',
            '本页不是报价，也不产生付款义务。通过本页发送请求同样不收取费用。',
          ],
        },
        {
          heading: '咨询可以是有偿服务',
          paragraphs: [
            '与律师的咨询可以是有偿服务。本页并未说明第一次谈话不收取费用，任何部分都不应被如此理解。',
            '若咨询有偿，金额与付款方式会在咨询进行前告知。',
          ],
        },
        {
          heading: '本页为何不列出费率',
          paragraphs: [
            '费用取决于案件本身：工作量、当事人人数、文件、期限，以及程序是否已经进行。预先给出的数字无法反映您这一件的费用。因此我们先确定工作范围，再在开始工作前告知费用。',
            '除律师酬金外，还可能产生法院、行政机关或第三方费用。这些与酬金分开，并取决于各该程序。',
          ],
        },
      ],
    },
    contact: {
      eyebrow: '联系',
      title: '如何联系事务所',
      description:
        '页面语言、咨询语言、当您无法使用四种语言时的做法，以及本页不承诺的事项。',
      intro:
        '写信之前，请先区分以下三点。它们常被混在一起，但含义不同。',
      sections: [
        {
          heading: '必须分开的三件事',
          paragraphs: [
            '页面的显示语言、与律师的咨询语言，以及您写信所用的语言，是三件分开的事。',
          ],
          items: [
            '页面语言：本说明以简体中文撰写。',
            '咨询语言：咨询以英语、中文、日语和韩语进行。',
            '您的书写语言：您可以用自己的语言撰写摘要；原文会按原样保存。',
          ],
        },
        {
          heading: '若您无法使用四种咨询语言中的任何一种',
          paragraphs: [
            '在联系表单中，您可以选择「沟通方式须待确认」。我们会回复，以审视是否存在可行的沟通方式；不以其他语言提供服务，也不承诺回复时限。',
            '这只是审视步骤，不是承诺。我们不承诺口译、不以四种语言之外的语言提供服务，也不承诺受理每一件事项。',
          ],
        },
        {
          heading: '第一次信息应写什么',
          paragraphs: [
            '请说明发生了什么、您需要何种协助、事项与台湾的关联，以及您所知的期限。若已收到法院或行政机关文书，请写明文书上的日期。',
            '初期不必发送护照号码、身份证号、账户资料、病历或全部证据。请等待律师指示，再以安全方式发送敏感文件。',
          ],
        },
        {
          heading: '本页不承诺的事项',
          paragraphs: [
            '我们不承诺回复时限，不通过本页确认预约，不指定特定律师，也不提供口译。书面翻译是另一回事：您的信息不会被自动翻译。',
            '若您发送请求，内容会被保存并等待审阅。若一段时间没有回复，您可以再次写信至联系页所列的电子邮件地址。',
          ],
        },
      ],
    },
    faq: {
      eyebrow: '常见问题',
      title: '常见问题',
      description:
        '关于业务范围、准备、语言、费用以及已发送请求含义的说明。',
      intro:
        '下列问题在一般说明的层面回答。针对您本人案件的答复，须待律师审阅文件之后才有可能。',
      sections: [
        {
          heading: '如何使用本部分',
          paragraphs: [
            '若找不到针对您情况的答案，答复通常取决于特殊事实。请把这些事实写进摘要，而不要从本页自行推论。',
          ],
        },
      ],
      faqs: [
        {
          question: '事务所处理哪些事项？',
          answer:
            '我们处理六组：在台湾的投资与公司设立、民事与损害赔偿、婚姻家庭与继承、劳动争议、刑事与智慧财产。是否受理，须在审阅内容后决定。',
        },
        {
          question: '联系前应准备什么？',
          answer:
            '请准备经过、您的需求、与台湾的关联以及期限（若有）的简短摘要。若已有法院或行政机关文书，请写明日期。此阶段不必发送身份证件或全部证据。',
        },
        {
          question: '可以用中文咨询吗？',
          answer:
            '可以。律师咨询以英语、中文、日语和韩语进行。本页面以简体中文撰写，咨询时使用的中文包括普通话与书面中文。本页不承诺口译。书面翻译是另一回事：您写下的原文会按原样保存，不会被自动翻译。',
        },
        {
          question: '若我无法使用这四种语言怎么办？',
          answer:
            '发送请求时请选择「沟通方式须待确认」。我们会回复以审视沟通方式，但不以其他语言提供服务。这是审视步骤，不是能够以其他语言工作的承诺。',
        },
        {
          question: '我写下的原文如何处理？',
          answer:
            '您写下的原文会按原样保存，不会被自动翻译。如有需要，后续沟通所用的语言会与您确认。',
        },
        {
          question: '请求发送后，咨询是否已经完成？',
          answer:
            '否。已发送的请求正在等待律师审阅。这不是法律意见，不是已确认的预约，发送本身也不成立律师与委托人关系。',
        },
        {
          question: '费用如何计算？',
          answer:
            '首先确定工作范围，然后在开始工作前与您确认费用金额与计算方式。本页不列出数字，也未说明第一次谈话不收取费用。',
        },
        {
          question: '若我的事项非常紧急怎么办？',
          answer:
            '请在摘要开头写明期限或公文上的日期，以便审阅时看见这些日期。本页没有紧急通道，也不承诺回复时限；若事项不能等待，您应同时在所在地寻找其他途径。',
        },
      ],
    },
    privacy: {
      eyebrow: '隐私',
      title: '通过联系表单收集的资料',
      description:
        '本简体中文部分的联系表单收集哪些资料、原文如何处理，以及您如何就资料联系我们。',
      intro:
        '本部分仅涉及这些说明页面上的联系表单。它描述资料处理，而不是技术上的绝对安全。',
      sections: [
        {
          heading: '收集哪些资料',
          paragraphs: [
            '当您通过本部分的表单发送请求时，会记录下列资料：',
          ],
          items: [
            '您填写的姓名',
            '用于回复的电子邮件地址',
            '发送时页面的显示语言',
            '您书写所用的语言',
            '您希望的咨询语言',
            '您写下的原文',
            '您对发送请求的同意',
            '用于找回该请求的收件编号',
          ],
        },
        {
          heading: '原文按原样保存',
          paragraphs: [
            '您的文本会按您写下的内容保存，不会被自动翻译。若处理需要翻译，会另行与您讨论。',
            '因为原文会被保存，初期请不要写下尚不需要的内容，例如护照号码、身份证号或账户资料。',
          ],
        },
        {
          heading: '存放地点与访问',
          paragraphs: [
            '您发送的内容存放在非公开场所。仅事务所内获授权的人员可为处理该请求而访问。',
            '本页不提供绝对安全承诺。任何传输途径与存放地点都不是完全安全的；因此敏感文件应仅在律师特别指示后再发送。',
          ],
        },
        {
          heading: '使用目的',
          paragraphs: [
            '所发送的资料用于审阅请求、回复您、厘清沟通方式，以及在开始工作后进行处理。',
            '未经另行同意，资料不会用于营销。',
          ],
        },
        {
          heading: '通知与收件编号',
          paragraphs: [
            '请求成功发送后，系统会通知事务所。若该通知尚未确认，您的文本仍会保存，不会丢失。',
            '收件编号用于在我们的记录中找回您的请求。保存后会显示；再次联系时您可以提及。',
          ],
        },
        {
          heading: '您的权利与联系途径',
          paragraphs: [
            '您可以通过联系页所列电子邮件地址，要求查阅、更正或删除您的资料，或撤回同意。若存在法定或程序上的保存义务，我们会说明限制。',
            '本页不列出固定保存期限，因为实际期间取决于事项是否继续以及相关义务。若您希望更早删除，请在联系时说明。',
          ],
        },
        {
          heading: '存放地点与服务提供者',
          paragraphs: [
            '本网站托管于 Vercel，您发送的内容存放在该服务的非公开对象存储中。电子邮件通过事务所使用的电子邮件服务发送。',
            '个别服务提供者的服务器可能位于台湾以外，您的资料可能在那里存放与处理。存放目的达成后，资料会立即删除；依法须保存的资料则在该期间内保留。个人资料相关询问请寄至 wei@hoveringlaw.com.tw。',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: '免责声明',
      title: '本页说明的范围与界限',
      description:
        '说明的一般性质、法律适用范围，以及律师与委托人关系成立的条件。',
      intro:
        '本部分说明这些简体中文说明页能为您做什么、不能做什么。',
      sections: [
        {
          heading: '仅一般说明',
          paragraphs: [
            '这些页面的内容作为一般信息撰写。它不是针对您案件的法律意见，也不能取代对您本人文件的审查。',
            '个案结果取决于事实、适用规定与时间点；看起来相似的两种情况也可能有不同结局。',
          ],
        },
        {
          heading: '法律适用范围',
          paragraphs: [
            '本所依台湾法律执业，本页只讨论这一范围内的工作。',
            '内容不是依台湾以外其他法域（包括您居住地法律）所作的咨询。若您的事项有一部分涉及其他法域，我们会与您厘清该部分需要哪一类具备资格的专业人员。',
          ],
        },
        {
          heading: '律师与委托人关系不会自行成立',
          paragraphs: [
            '阅读本页、提交表单或发送电子邮件，本身并不成立律师与委托人关系。',
            '该关系须在事项经过审阅、双方确认承接工作之后才成立。',
          ],
        },
        {
          heading: '不承诺结果',
          paragraphs: [
            '本页任何部分都不是对案件结果、申请核准或居留与工作身份的承诺。',
            '外部链接仅供参考；我们不就第三方内容的正确性或时效性作出承诺。',
          ],
        },
      ],
    },
    columns: {
      eyebrow: '文章',
      title: '关于台湾法律的文章',
      description:
        '关于常见台湾法律问题的简体中文文章。内容是发布当时的一般信息，不是针对您案件的法律意见。',
      intro:
        '本所就常见台湾法律问题发布文章。已有简体中文的文章列于本页；另有四个链接，分别打开一种原文语言的文章列表。',
      sections: [
        {
          heading: '依语言划分的四个列表',
          paragraphs: [
            '本部分含四个链接：韩文、中文、英文与日文的文章列表。每个链接写明列表语言，让您事先知道打开后是哪一种语言。',
            '这四个列表是依文章原文语言划分的列表，不是翻译列表。已有简体中文的文章另行列于本页。',
          ],
        },
        {
          heading: '链接通向何处',
          paragraphs: [
            '选择四个链接之一，会打开该语言的文章列表。您再从列表中自行选择文本；全部内容以该文章的原文语言显示。',
            '本页不摘要文章内容，也不承诺某一主题在四种语言中都有。每一列表只包含以该语言发布的文本。',
          ],
        },
        {
          heading: '文章能作为参考的限度',
          paragraphs: [
            '文章是发布当时的一般说明。规定及其适用可能改变，一篇文章也不包含您案件的全部情况。',
            '因此请不要仅凭一篇文章在真实事项中采取行动。用它了解概览，并另行就您的文件与律师讨论；本页不是咨询步骤。',
          ],
        },
      ],
    },
  },
};

export const malayGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Bahasa Melayu',
  nav: {
    home: 'Laman utama',
    services: 'Bidang kerja',
    about: 'Firma',
    lawyers: 'Peguam',
    pricing: 'Skop dan kos',
    contact: 'Hubungi',
    faq: 'Soalan lazim',
    privacy: 'Privasi',
    disclaimer: 'Penafian',
    columns: 'Rencana',
  },
  contactCta: 'Hantar permintaan perundingan',
  footerNotice:
    'Halaman bahasa Melayu ini hanya memberikan maklumat am tentang kerja firma menurut undang-undang Taiwan. Ia bukan nasihat undang-undang bagi suatu kes tertentu, dan penghantaran mesej dengan sendirinya tidak mewujudkan hubungan antara peguam dan klien.',
  skipLink: 'Langkau navigasi dan pergi ke kandungan',
  menuLabel: 'Direktori halaman',
  languageLabel: 'Bahasa paparan',
  mega: {
    services: {
      description: 'Firma mengendalikan bidang amalan utama menurut undang-undang Taiwan.',
      viewAllLabel: 'Lihat semua',
    },
    columns: {
      description: 'Rencana tentang soalan undang-undang Taiwan yang kerap timbul.',
      viewAllLabel: 'Lihat semua',
    },
    lawyers: {
      description: 'Pengenalan peguam yang bertugas dan cara menghubungi mereka.',
      viewAllLabel: 'Lihat semua',
    },
    pricing: {
      description: 'Halaman ini menerangkan skop kerja dan bagaimana kos ditentukan.',
      viewAllLabel: 'Lihat semua',
    },
    faq: {
      description: 'Soalan lazim tentang kerja firma di Taiwan.',
      viewAllLabel: 'Lihat semua',
    },
  },
  notFoundTitle: 'Halaman tidak dijumpai',
  notFoundText:
    'Halaman yang anda cari tidak wujud atau telah dipindahkan. Anda boleh kembali ke laman utama bahasa Melayu untuk melihat maklumat yang ada.',
  backHomeLabel: 'Ke laman utama',
  readSourceLabel: 'Buka senarai rencana dalam bahasa asal',
  home: {
    heroScrollLabel: 'Tatal ke bawah',
    heroColumnsCtaLabel: 'Lihat rencana',
    servicesDetailLabel: 'Lihat butiran',
    servicesAssistanceBefore: 'Jika tidak jelas bidang mana yang merangkumi hal anda, halaman ',
    servicesAssistanceLinkLabel: 'Hubungi',
    servicesAssistanceAfter:
      ' menerangkan bagaimana anda merumuskan ringkasan untuk disemak oleh peguam.',
    columnsViewAllLabel: 'Lihat semua rencana',
    columnsReadMoreLabel: 'Baca selanjutnya',
    columnsReviewLabel: 'Disemak oleh peguam Wei Tseng',
    columnsOriginalLanguageBadge: 'Bahasa asal',
    columnsOriginalLanguageNote:
      'Rencana berikut belum tersedia dalam bahasa Melayu. Senarai kekal dalam bahasa asal dan membuka halaman bahasa berkenaan; kandungannya tidak diterjemah secara automatik.',
    imageBandAlt: 'Sanheyuan tradisional Taiwan (三合院) dan paviliun moden pada waktu siang',
    videoPauseLabel: 'Jeda video',
    videoPlayLabel: 'Mainkan video',
    videoReplayLabel: 'Mainkan semula video',
  },
  pages: {
    home: {
      eyebrow: 'MAKLUMAT',
      title: 'Perkhidmatan undang-undang di Taiwan — maklumat dalam bahasa Melayu',
      description:
        'Penjelasan am dalam bahasa Melayu tentang bidang kerja Hovering International Law Firm di Taiwan, bahasa perundingan, dan hubungan pertama.',
      intro:
        'Hovering International Law Firm membantu klien dari luar negara, termasuk yang berkaitan dengan Taiwan, dalam hal menurut undang-undang Taiwan: pelaburan dan penubuhan syarikat, pertikaian sivil, perkahwinan, keluarga dan pusaka, buruh, jenayah dan harta intelek. Halaman bahasa Melayu ini menerangkan kerja mana yang termasuk dalam skop kami, apa yang perlu disediakan, dan bagaimana menghubungi kami. Ini ialah maklumat am, bukan nasihat undang-undang bagi kes anda sendiri.',
      sections: [
        {
          heading: 'Apa yang kami lakukan',
          paragraphs: [
            'Hovering International Law Firm ialah firma peguam yang ditubuhkan di Taiwan. Firma bekerja menurut undang-undang Taiwan dan mempunyai pejabat di Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) dan Pingtung (屏東). Kami menasihati syarikat, menjalankan prosedur di mahkamah, dan membimbing klien dari luar negara melalui langkah yang diperlukan di Taiwan.',
            'Semua kandungan di sini bersifat am. Hasil suatu hal bergantung pada fakta, peraturan yang terpakai, dan masa. Maklumat ini tidak menggantikan perbualan dengan peguam tentang dokumen anda.',
          ],
        },
        {
          heading: 'Bahasa halaman dan bahasa perundingan bukan perkara yang sama',
          paragraphs: [
            'Halaman ini ditulis dalam bahasa Melayu, tetapi perundingan dengan peguam hanya dijalankan dalam empat bahasa perundingan: Inggeris, Cina (中文), Jepun dan Korea. Membaca maklumat bahasa Melayu tidak bermakna perbualan dengan peguam akan berlangsung dalam bahasa Melayu.',
            'Kami tidak menjanjikan jurubahasa, tempoh jawapan, atau janji temu melalui halaman ini. Jika anda tidak dapat menggunakan mana-mana daripada empat bahasa itu, halaman Hubungi menerangkan bagaimana kami meneliti cara berkomunikasi.',
          ],
        },
        {
          heading: 'Bidang amalan',
          paragraphs: [
            'Skop kerja merangkumi enam bidang berikut. Halaman Bidang kerja menerangkan setiap bidang dengan lebih lanjut dan menyatakan apa yang tidak dijanjikan.',
          ],
          items: [
            'Pelaburan dan penubuhan syarikat di Taiwan',
            'Hal sivil dan ganti rugi',
            'Perkahwinan, keluarga dan pusaka',
            'Pertikaian buruh',
            'Hal jenayah',
            'Harta intelek: tanda dagangan, paten dan hak cipta',
          ],
        },
        {
          heading: 'Di mana anda sepatutnya bermula',
          paragraphs: [
            'Baca halaman Bidang kerja untuk menilai sama ada hal anda termasuk dalam skop kami, kemudian Skop dan kos serta Hubungi, untuk mengetahui bagaimana skop ditetapkan dan kos disahkan sebelum kerja bermula.',
            'Apabila menghantar mesej, anda boleh menulis ringkasan dalam bahasa anda sendiri. Teks asal disimpan sebagaimana anda menulisnya, dan tidak diterjemah secara automatik. Mesej yang dihantar ialah permintaan yang menunggu semakan: itu belum perundingan dan belum janji temu yang disahkan.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'BIDANG KERJA',
      title: 'Hal yang kami kendalikan',
      description:
        'Enam bidang amalan firma di Taiwan dan batas yang anda perlu ketahui dahulu.',
      intro:
        'Berikut ialah bidang yang kami kendalikan secara sebenar, dan soalan yang kerap timbul pada peringkat awal. Paparan ini membantu anda menilai sama ada hal anda termasuk dalam skop kami; ia bersifat am dan bukan analisis undang-undang bagi suatu urusan tunggal.',
      sections: [
        {
          heading: 'Pelaburan dan penubuhan syarikat di Taiwan',
          paragraphs: [
            'Kami membantu pelabur dan syarikat asing dalam penubuhan atau pengoperasian syarikat di Taiwan: pemilihan bentuk undang-undang, penyediaan dan penyerahan dokumen, modal masuk, urusan bank, semakan tempat operasi, serta keperluan khusus industri. Kami juga membantu perakaunan dan cukai yang timbul daripada penubuhan dan pengoperasian di Taiwan.',
            'Aliran dan tempoh berbeza mengikut bentuk undang-undang, pelabur, industri, bank dan dokumen yang ada. Penubuhan syarikat tidak dengan sendirinya membawa permit tinggal (居留) atau permit kerja (工作許可): itu prosedur berasingan yang dinilai menurut keadaan orang berkenaan.',
          ],
        },
        {
          heading: 'Hal sivil dan ganti rugi',
          paragraphs: [
            'Bidang ini merangkumi pertikaian kontrak, ganti rugi daripada perbuatan salah, dan pertikaian pengguna. Kerja biasanya bermula dengan kronologi, semakan dokumen dan bukti yang ada, dan hanya kemudian langkah seterusnya.',
            'Tempoh, termasuk tempoh saman berkanun, dan kelengkapan bukti membentuk perjalanan. Oleh itu nyatakan tarikh yang diketahui seawal mungkin. Simpan kontrak, mesej, resit bayaran atau foto keadaan di tempat, dan sebutkannya dalam mesej pertama.',
          ],
        },
        {
          heading: 'Perkahwinan, keluarga dan pusaka',
          paragraphs: [
            'Kami mengendalikan penceraian (離婚), pembahagian harta, pelaksanaan dan tanggungjawab hak dan kewajipan terhadap anak bawah umur (未成年子女權利義務之行使或負擔), kunjungan (會面交往) dan pusaka (繼承), termasuk jika pihak atau harta berada di negara berlainan. Hal keluarga merentas sempadan sering memerlukan semakan tambahan dokumen daftar isi rumah (戶籍), bentuk surat cara, dan kebolehbuktiannya di Taiwan.',
            'Kerana hal keluarga kerap membawa tempoh dan prosedur selari, ringkasan pertama sepatutnya menyatakan hubungan pihak, tempat tinggal semasa, dan prosedur yang sudah berjalan.',
          ],
        },
        {
          heading: 'Pertikaian buruh',
          paragraphs: [
            'Bidang ini merangkumi penamatan hubungan pekerjaan, pampasan pemberhentian menurut undang-undang Taiwan (資遣費; jangan disamakan dengan skim atau peraturan negara lain), upah, dan pertikaian daripada kontrak buruh (勞動契約), sama ada di pihak pekerja atau majikan. Semasa semakan kami memisahkan sebab penamatan daripada soalan notis, bayaran dan tempoh.',
            'Kontrak buruh, peraturan kerja (工作規則), slip gaji dan surat-menyurat pihak biasanya dokumen yang menentukan. Jika anda masih menyimpannya, sebutkan dalam ringkasan.',
          ],
        },
        {
          heading: 'Hal jenayah',
          paragraphs: [
            'Kami mewakili klien dalam siasatan dan di mahkamah, bagi tertuduh atau terdakwa serta bagi orang yang tercedera, dan menilai risiko jenayah aktiviti perniagaan.',
            'Hal jenayah kerap mempunyai tempoh pendek dan peringkat yang ditetapkan. Jika anda sudah menerima surat daripada pihak pendakwaan atau mahkamah, nyatakan tarikh pada surat itu awal, supaya kandungannya disemak dalam urutan yang betul.',
          ],
        },
        {
          heading: 'Harta intelek',
          paragraphs: [
            'Kami membantu pendaftaran tanda dagangan (商標) dan paten (專利), hak cipta, dan pertikaian tentang hak ini di Taiwan.',
            'Dalam bidang ini urutan langkah menentukan: skop perlindungan, masa pemfailan dan penggunaan sebenar mempengaruhi pilihan. Penyerahan permohonan tidak dengan sendirinya bermakna ia diluluskan.',
          ],
        },
        {
          heading: 'Skop dan pengesahannya',
          paragraphs: [
            'Firma bekerja menurut undang-undang Taiwan dan mengendalikan hal dalam bidang di atas. Skop setiap hal disahkan secara berasingan selepas peguam menyemak mesej anda.',
            'Status tinggal, permit kerja dan soalan sebanding dinilai daripada dokumen dan keadaan orang berkenaan, bukan daripada kewarganegaraan. Jika sebahagian hal anda menyentuh soalan demikian, nyatakan semasa menghubungi. Halaman ini tidak menjanjikan hasil mahupun tempoh jawapan.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'FIRMA',
      title: 'Tentang Hovering International Law Firm',
      description:
        'Maklumat asas tentang firma peguam Taiwan ini, pejabatnya, dan kerja dengan pihak asing.',
      intro:
        'Hovering International Law Firm ialah firma peguam di Taiwan. Peguam bekerja dari nasihat syarikat hingga prosedur mahkamah. Bahagian ini menerangkan penubuhan firma, lokasi, dan kerja dengan pihak asing.',
      sections: [
        {
          heading: 'Penubuhan dan struktur',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) ditubuhkan pada 2016 oleh peguam yang belajar di National Taiwan University (國立臺灣大學). Nama Cina 昊鼎 menggabungkan aksara 昊 (“langit luas”) dengan 鼎 (“asas kukuh”) dan menggambarkan hala tuju firma sejak penubuhan.',
            'Kami mempunyai pejabat di Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) dan Pingtung (屏東). Pejabat Kaohsiung menumpukan tadbir urus syarikat dan mengendalikan pertikaian sivil, jenayah dan pentadbiran. Pejabat Taichung mengendalikan hal pembinaan, harta intelek, dan hal yang berkaitan dengan Korea dan Jepun. Pejabat Pingtung dibuka pada 2017 untuk keperluan setempat.',
            'Selain kerja peguam, sejak 2020 wujud juga Hovering Accounting Office, yang menawarkan perakaunan dan perancangan cukai untuk usahawan dan individu beraset tinggi.',
          ],
        },
        {
          heading: 'Kerja dengan pihak asing',
          paragraphs: [
            'Kerja merentas sempadan merangkumi penubuhan syarikat, visa, pemfailan tanda dagangan dan paten, semakan risiko undang-undang, dan nasihat cukai syarikat. Pejabat Taichung khususnya mengendalikan hal pembinaan, harta intelek, dan hal yang berkaitan dengan Korea dan Jepun. Peguam Wei Tseng (曾雋崴) mewakili klien dari Korea, Jepun dan klien antarabangsa lain dalam bidang tersebut.',
            'Sama ada kami dapat menerima suatu hal bergantung pada kandungan dan bahasa komunikasi. Jika hal anda termasuk dalam bidang tersebut dan boleh dibincangkan dalam salah satu daripada empat bahasa perundingan, anda boleh menghantar ringkasan untuk disemak.',
          ],
        },
        {
          heading: 'Apabila anda menghubungi kami',
          paragraphs: [
            'Selepas ringkasan anda tiba, peguam menyemak kandungannya, kemudian membincangkan skop kerja yang mungkin, dokumen yang masih diperlukan, dan langkah seterusnya. Bagi soalan cukai atau perakaunan, firma boleh bekerja dengan bahagian perakaunan dalam satu aliran.',
            'Hasil setiap hal bergantung pada fakta dan dokumen yang ada; kami tidak menjanjikan hasil. Jika anda memerlukan jawapan yang mengikat bagi keadaan anda, dokumen mesti dibincangkan dengan peguam dalam salah satu daripada empat bahasa perundingan.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'PEGUAM',
      title: 'Pasukan antarabangsa Hovering',
      description: 'Profil peguam, pengurusan operasi dan akauntan rakan kongsi Hovering.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'SKOP DAN KOS',
      title: 'Bagaimana skop kerja dan kos ditetapkan',
      description:
        'Penjelasan urutan: dahulu skop kerja, kemudian pengesahan kos, dan mengapa halaman ini tidak menyiarkan jadual yuran.',
      intro:
        'Halaman ini menerangkan bagaimana kos ditetapkan, bukan jumlahnya. Jumlah bergantung pada skop kerja hal berkenaan dan hanya bermakna apabila skop itu jelas.',
      sections: [
        {
          heading: 'Skop kerja ditetapkan dahulu',
          paragraphs: [
            'Hal yang kelihatan sejenis boleh mempunyai usaha yang sangat berbeza, mengikut bilangan pihak, dokumen yang ada, tempoh yang mesti dipatuhi, dan sama ada prosedur sudah bermula. Oleh itu langkah pertama sentiasa menetapkan apa yang termasuk dalam kerja dan apa yang tidak.',
            'Ringkasan yang anda hantar pada permulaan ialah asas bagi skop ini. Semakin jelas ia menerangkan perjalanan, keperluan anda dan tempoh, semakin tepat skop dapat ditentukan.',
          ],
        },
        {
          heading: 'Kos disahkan sebelum kerja bermula',
          paragraphs: [
            'Apabila skop kerja jelas, jumlah dan cara pengiraan kos dibincangkan dan disahkan dengan anda sebelum kerja bermula. Jika skop berubah di tengah jalan, ia mesti disahkan semula.',
            'Halaman ini bukan tawaran harga dan tidak mewujudkan kewajipan membayar. Penghantaran permintaan melalui halaman ini juga tanpa bayaran.',
          ],
        },
        {
          heading: 'Perundingan boleh menjadi perkhidmatan berbayar',
          paragraphs: [
            'Perundingan dengan peguam boleh menjadi perkhidmatan berbayar. Halaman ini tidak menyatakan bahawa perbualan pertama tanpa bayaran, dan tiada bahagian boleh dibaca sedemikian.',
            'Jika perundingan berbayar, jumlah dan cara bayaran dimaklumkan sebelum ia berlangsung.',
          ],
        },
        {
          heading: 'Mengapa halaman ini tidak menyebut jadual yuran',
          paragraphs: [
            'Kos bergantung pada hal itu sendiri: usaha, bilangan pihak, dokumen, tempoh, dan sama ada prosedur sudah berjalan. Angka yang ditetapkan lebih awal tidak akan menunjukkan kos bagi urusan anda. Oleh itu kami menetapkan skop kerja dahulu, kemudian memaklumkan kos kepada anda sebelum kerja bermula.',
            'Selain yuran peguam, kos mahkamah, pihak berkuasa atau pihak ketiga boleh timbul. Ini berasingan daripada yuran dan bergantung pada prosedur berkenaan.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'HUBUNGI',
      title: 'Bagaimana anda menghubungi firma',
      description:
        'Bahasa halaman, bahasa perundingan, apa yang berlaku jika anda tidak dapat menggunakan mana-mana daripada empat bahasa, dan apa yang halaman ini tidak janjikan.',
      intro:
        'Sebelum anda menulis, sila bezakan tiga perkara berikut. Ia kerap dicampur, tetapi bermakna perkara yang berbeza.',
      sections: [
        {
          heading: 'Tiga perkara yang mesti kekal berasingan',
          paragraphs: [
            'Bahasa paparan halaman, bahasa perundingan dengan peguam, dan bahasa yang anda gunakan untuk menulis ialah tiga perkara yang berasingan.',
          ],
          items: [
            'Bahasa halaman: Maklumat ini ditulis dalam bahasa Melayu.',
            'Bahasa perundingan: Perundingan hanya dijalankan dalam bahasa Inggeris, Cina (中文), Jepun dan Korea.',
            'Bahasa tulisan anda: Anda boleh menulis ringkasan dalam bahasa anda sendiri; teks asal disimpan tanpa diubah.',
          ],
        },
        {
          heading: 'Jika anda tidak dapat menggunakan mana-mana daripada empat bahasa perundingan',
          paragraphs: [
            'Dalam borang pertanyaan anda boleh memilih “Cara berkomunikasi mesti disahkan”. Kami menjawab untuk meneliti sama ada terdapat cara berkomunikasi yang boleh digunakan; perkhidmatan dalam bahasa lain tidak dijanjikan dan tempoh jawapan tidak dijanjikan.',
            'Ini hanya langkah semakan, bukan janji. Kami tidak menjanjikan jurubahasa, tidak menjanjikan perkhidmatan dalam bahasa Melayu atau bahasa lain di luar empat bahasa tersebut, dan tidak menjanjikan bahawa kami menerima setiap hal.',
          ],
        },
        {
          heading: 'Apa yang sepatutnya ada dalam mesej pertama',
          paragraphs: [
            'Nyatakan apa yang berlaku, bantuan yang anda perlukan, kaitan hal itu dengan Taiwan, dan tempoh jika anda mengetahuinya. Jika anda sudah menerima surat mahkamah atau pihak berkuasa, nyatakan tarikh pada surat itu.',
            'Pada peringkat awal anda belum perlu menghantar nombor pasport, nombor pengenalan, data akaun, rekod perubatan atau seluruh bukti. Tunggu arahan peguam, kemudian hantar dokumen sensitif melalui cara yang selamat.',
          ],
        },
        {
          heading: 'Apa yang halaman ini tidak janjikan',
          paragraphs: [
            'Kami tidak menjanjikan tempoh jawapan, tidak mengesahkan janji temu melalui halaman ini, tidak menjanjikan peguam tertentu, dan tidak menyediakan jurubahasa. Terjemahan bertulis ialah perkara lain: mesej anda tidak diterjemah secara automatik.',
            'Jika anda menghantar permintaan, kandungannya disimpan dan menunggu semakan. Jika selepas beberapa masa anda tidak menerima jawapan, anda boleh menulis semula ke alamat e-mel yang dinyatakan pada halaman hubungan.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'SOALAN LAZIM',
      title: 'Soalan yang kerap ditanya',
      description:
        'Penjelasan tentang skop kerja, persediaan, bahasa, kos, dan makna permintaan yang telah dihantar.',
      intro:
        'Soalan berikut dijawab pada tahap maklumat am. Jawapan bagi kes anda sendiri hanya mungkin selepas peguam menyemak dokumen.',
      sections: [
        {
          heading: 'Bagaimana anda menggunakan bahagian ini',
          paragraphs: [
            'Jika anda tidak menemui jawapan bagi keadaan anda, jawapan biasanya bergantung pada fakta khas. Tuliskan fakta itu dalam ringkasan, dan jangan meneka sendiri daripada halaman ini.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Apakah hal yang dikendalikan oleh firma?',
          answer:
            'Kami mengendalikan enam bidang: pelaburan dan penubuhan syarikat di Taiwan, hal sivil dan ganti rugi, perkahwinan, keluarga dan pusaka, pertikaian buruh, hal jenayah dan harta intelek. Sama ada suatu hal diterima diputuskan selepas kandungan disemak.',
        },
        {
          question: 'Apa yang patut saya sediakan sebelum menghubungi?',
          answer:
            'Sediakan ringkasan pendek tentang perjalanan, keperluan anda, kaitan dengan Taiwan, dan tempoh jika ada. Jika sudah ada surat mahkamah atau pihak berkuasa, nyatakan tarikhnya. Pada peringkat ini anda belum perlu menghantar dokumen pengenalan atau seluruh bukti.',
        },
        {
          question: 'Bolehkah saya berunding dalam bahasa Melayu?',
          answer:
            'Tidak. Maklumat ini ditulis dalam bahasa Melayu, tetapi perundingan dengan peguam hanya dijalankan dalam bahasa Inggeris, Cina (中文), Jepun dan Korea. Kami juga tidak menjanjikan jurubahasa. Terjemahan bertulis ialah perkara lain: teks asal yang anda tulis disimpan sebagaimana adanya dan tidak diterjemah secara automatik.',
        },
        {
          question: 'Apa jika saya tidak dapat menggunakan mana-mana daripada empat bahasa itu?',
          answer:
            'Apabila menghantar permintaan, pilih “Cara berkomunikasi mesti disahkan”. Kami menjawab untuk meneliti cara berkomunikasi, tetapi perkhidmatan dalam bahasa lain tidak dijanjikan. Ini langkah semakan, bukan janji bahawa kami dapat bekerja dalam bahasa lain.',
        },
        {
          question: 'Bagaimana teks bahasa Melayu saya diuruskan?',
          answer:
            'Teks asal yang anda tulis disimpan sebagaimana adanya, dan tidak diterjemah secara automatik. Jika perlu, bahasa komunikasi seterusnya disahkan bersama anda.',
        },
        {
          question: 'Adakah perundingan sudah berlaku apabila permintaan dihantar?',
          answer:
            'Tidak. Permintaan yang dihantar menunggu semakan peguam. Itu bukan nasihat undang-undang, bukan janji temu yang disahkan, dan penghantaran dengan sendirinya tidak mewujudkan hubungan antara peguam dan klien.',
        },
        {
          question: 'Bagaimana kos dikira?',
          answer:
            'Dahulu skop kerja ditetapkan, kemudian jumlah dan cara pengiraan kos disahkan dengan anda sebelum kerja bermula. Halaman ini tidak menyebut angka dan tidak menyatakan bahawa perbualan pertama tanpa bayaran.',
        },
        {
          question: 'Apa jika hal saya sangat mendesak?',
          answer:
            'Nyatakan tempoh atau tarikh pada surat rasmi di awal ringkasan anda, supaya tarikh itu kelihatan semasa semakan. Halaman ini tidak mempunyai saluran kecemasan dan tidak menjanjikan tempoh jawapan; jika hal anda tidak boleh menunggu, anda sepatutnya mencari jalan lain di tempat anda secara selari.',
        },
      ],
    },
    privacy: {
      eyebrow: 'PRIVASI',
      title: 'Data yang dikumpul melalui borang pertanyaan',
      description:
        'Apa yang dikumpulkan oleh borang pertanyaan dalam halaman bahasa Melayu ini, bagaimana teks asal diuruskan, dan bagaimana anda menghubungi kami tentang data anda.',
      intro:
        'Bahagian ini hanya merangkumi borang pertanyaan pada halaman maklumat ini. Ia menerangkan pengendalian data, bukan jaminan teknikal.',
      sections: [
        {
          heading: 'Apakah data yang dikumpul',
          paragraphs: [
            'Apabila anda menghantar permintaan melalui borang dalam bahagian ini, maklumat berikut dicatat:',
          ],
          items: [
            'Nama yang anda nyatakan',
            'Alamat e-mel untuk jawapan',
            'Bahasa paparan halaman semasa penghantaran',
            'Bahasa yang anda gunakan untuk menulis',
            'Bahasa perundingan yang anda inginkan',
            'Teks asal yang anda tulis',
            'Persetujuan anda untuk menghantar permintaan',
            'Nombor penerimaan untuk mencari semula permintaan itu',
          ],
        },
        {
          heading: 'Teks asal disimpan tanpa diubah',
          paragraphs: [
            'Teks anda disimpan tepat sebagaimana anda menulisnya, dan tidak diterjemah secara automatik. Jika terjemahan diperlukan untuk pemprosesan, itu dibincangkan secara berasingan dengan anda.',
            'Kerana teks asal disimpan, pada peringkat awal jangan tulis apa yang belum diperlukan, misalnya nombor pasport, nombor pengenalan atau data akaun.',
          ],
        },
        {
          heading: 'Tempat simpanan dan akses',
          paragraphs: [
            'Kandungan penghantaran anda disimpan di tempat yang tidak boleh diakses secara awam. Hanya orang yang diberi kuasa dalam firma boleh mengaksesnya untuk memproses permintaan.',
            'Halaman ini tidak memberi janji keselamatan mutlak. Tiada laluan penghantaran dan tiada tempat simpanan yang sepenuhnya selamat; oleh itu dokumen sensitif sepatutnya dihantar hanya selepas arahan khas peguam.',
          ],
        },
        {
          heading: 'Tujuan penggunaan',
          paragraphs: [
            'Data yang dihantar digunakan untuk menyemak permintaan, membalas anda, menjelaskan cara berkomunikasi, dan memproses jika kerja dimulakan.',
            'Data tidak digunakan untuk pemasaran tanpa persetujuan yang berasingan.',
          ],
        },
        {
          heading: 'Pemberitahuan dan nombor penerimaan',
          paragraphs: [
            'Jika permintaan berjaya dihantar, sistem memberitahu firma. Jika pemberitahuan ini belum disahkan, teks anda kekal disimpan dan tidak hilang.',
            'Nombor penerimaan digunakan untuk mencari semula permintaan anda dalam rekod kami. Ia dipaparkan selepas disimpan; anda boleh menyebutnya apabila menghubungi semula.',
          ],
        },
        {
          heading: 'Hak anda dan cara menghubungi',
          paragraphs: [
            'Anda boleh meminta maklumat, pembetulan atau penghapusan data anda, atau menarik balik persetujuan, melalui alamat e-mel yang dinyatakan pada halaman hubungan. Jika wujud kewajipan simpanan menurut undang-undang atau prosedur, kami menerangkan batasannya.',
            'Halaman ini tidak menyebut tempoh simpanan yang tetap, kerana tempoh sebenar bergantung pada sama ada hal diteruskan dan pada kewajipan yang berkaitan. Jika anda mahu penghapusan lebih awal, nyatakan semasa menghubungi.',
          ],
        },
        {
          heading: 'Tempat simpanan dan pembekal perkhidmatan',
          paragraphs: [
            'Laman web ini dihoskan di Vercel, dan penghantaran anda disimpan dalam storan bukan awam perkhidmatan itu. E-mel dihantar melalui perkhidmatan e-mel yang digunakan oleh firma.',
            'Pelayan pembekal individu boleh berada di luar Taiwan, jadi data anda boleh disimpan dan diproses di situ. Apabila tujuan simpanan selesai, data dihapuskan tanpa kelewatan; data yang mesti disimpan menurut peraturan yang terpakai kekal untuk tempoh itu. Pertanyaan tentang data peribadi diterima di wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'PENAFIAN',
      title: 'Skop dan batas maklumat pada halaman ini',
      description:
        'Sifat am maklumat, skop undang-undang yang terpakai, dan syarat hubungan antara peguam dan klien.',
      intro:
        'Bahagian ini menjelaskan apa yang halaman maklumat bahasa Melayu ini dapat dan tidak dapat lakukan untuk anda.',
      sections: [
        {
          heading: 'Hanya maklumat am',
          paragraphs: [
            'Kandungan halaman ini ditulis sebagai maklumat am. Ia bukan nasihat undang-undang bagi kes anda dan tidak menggantikan semakan dokumen anda sendiri.',
            'Hasil suatu hal bergantung pada fakta, peraturan yang terpakai dan masa; dua keadaan yang kelihatan serupa boleh berakhir berbeza.',
          ],
        },
        {
          heading: 'Skop undang-undang yang terpakai',
          paragraphs: [
            'Firma beramal di bawah undang-undang Taiwan, dan halaman ini hanya bercakap tentang kerja dalam rangka itu.',
            'Kandungan bukan nasihat menurut undang-undang suatu bidang kuasa selain Taiwan, termasuk undang-undang tempat anda tinggal. Jika sebahagian hal anda menyentuh bidang kuasa lain, kami jelaskan bersama anda pakar berkelayakan yang diperlukan bagi bahagian itu.',
          ],
        },
        {
          heading: 'Hubungan antara peguam dan klien tidak timbul dengan sendirinya',
          paragraphs: [
            'Membaca halaman ini, menghantar borang atau e-mel dengan sendirinya tidak mewujudkan hubungan antara peguam dan klien.',
            'Hubungan ini timbul hanya selepas hal disemak dan kedua-dua pihak mengesahkan secara bertulis bahawa firma menerima kes itu.',
          ],
        },
        {
          heading: 'Tiada janji hasil',
          paragraphs: [
            'Tiada bahagian halaman ini merupakan janji tentang hasil suatu hal, kelulusan permohonan, atau status tinggal dan kerja.',
            'Pautan luaran adalah untuk rujukan; kami tidak menjanjikan ketepatan mahupun kemas kini kandungan pihak ketiga.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'RENCANA',
      title: 'Rencana tentang undang-undang Taiwan',
      description:
        'Rencana bahasa Melayu tentang soalan undang-undang Taiwan yang kerap timbul. Kandungan ialah maklumat am pada masa penerbitan, bukan nasihat undang-undang bagi kes anda.',
      intro:
        'Firma menerbitkan rencana tentang soalan undang-undang Taiwan yang kerap timbul. Rencana yang ada dalam bahasa Melayu berada pada halaman ini; di samping itu terdapat empat pautan yang masing-masing membuka senarai rencana suatu bahasa asal.',
      sections: [
        {
          heading: 'Empat senarai mengikut bahasa',
          paragraphs: [
            'Bahagian ini mengandungi empat pautan: senarai rencana dalam bahasa Korea, Cina, Inggeris dan Jepun. Setiap pautan menyatakan bahasa senarai itu, supaya anda tahu terlebih dahulu dalam bahasa mana kandungan akan dibuka.',
            'Empat senarai ini ialah senarai mengikut bahasa asal rencana, bukan senarai terjemahan. Rencana yang ada dalam bahasa Melayu disenaraikan secara berasingan pada halaman ini.',
          ],
        },
        {
          heading: 'Ke mana pautan itu membawa',
          paragraphs: [
            'Apabila anda memilih salah satu daripada empat pautan, senarai rencana bahasa itu dibuka. Daripada senarai itu anda sendiri memilih teks; seluruh kandungan muncul dalam bahasa asal rencana.',
            'Halaman ini tidak merumuskan kandungan rencana dan tidak menjanjikan bahawa suatu topik wujud dalam keempat-empat bahasa. Setiap senarai hanya mengandungi teks yang diterbitkan dalam bahasa itu.',
          ],
        },
        {
          heading: 'Sejauh mana suatu rencana boleh menjadi panduan',
          paragraphs: [
            'Rencana ialah maklumat am pada masa penerbitan. Peraturan dan penerapannya boleh berubah, dan suatu rencana tidak mengandungi semua keadaan kes anda.',
            'Oleh itu jangan jadikan suatu rencana sebagai asas tindakan dalam hal sebenar. Gunakannya untuk gambaran keseluruhan dan bincangkan dokumen anda secara berasingan dengan peguam; halaman ini bukan langkah perundingan.',
          ],
        },
      ],
    },
  },
};

export const hindiGuidanceContent: GuidanceLocaleContent = {
  languageName: 'हिन्दी',
  nav: {
    home: 'होम',
    services: 'सेवाएँ',
    about: 'कार्यालय',
    lawyers: 'अधिवक्ता',
    pricing: 'लागत',
    contact: 'संपर्क',
    faq: 'प्रश्न',
    privacy: 'गोपनीयता',
    disclaimer: 'अस्वीकरण',
    columns: 'लेख',
  },
  contactCta: 'परामर्श अनुरोध भेजें',
  footerNotice:
    'यह हिन्दी पृष्ठ ताइवान के विधि के अनुसार कार्यालय के कार्य की केवल सामान्य जानकारी देता है। यह किसी ठोस मामले की कानूनी राय नहीं है, और संदेश भेजना अपने आप अधिवक्ता और मुवक्किल के बीच संबंध नहीं बनाता।',
  skipLink: 'नेविगेशन छोड़कर मुख्य सामग्री पर जाएँ',
  menuLabel: 'पृष्ठ सूची',
  languageLabel: 'प्रदर्शन भाषा',
  mega: {
    services: {
      description: 'कार्यालय ताइवान के विधि के अनुसार मुख्य कार्य-समूहों का कार्य करता है।',
      viewAllLabel: 'सभी देखें',
    },
    columns: {
      description: 'ताइवान के विधि के सामान्य प्रश्नों पर लेख।',
      viewAllLabel: 'सभी देखें',
    },
    lawyers: {
      description: 'कार्यरत अधिवक्ताओं और संपर्क मार्गों का परिचय।',
      viewAllLabel: 'सभी देखें',
    },
    pricing: {
      description: 'यह पृष्ठ कार्य के दायरे और लागत तय होने का तरीका बताता है।',
      viewAllLabel: 'सभी देखें',
    },
    faq: {
      description: 'ताइवान में कार्यालय के कार्य से जुड़े सामान्य प्रश्न।',
      viewAllLabel: 'सभी देखें',
    },
  },
  notFoundTitle: 'पृष्ठ नहीं मिला',
  notFoundText:
    'आप जिस पृष्ठ की खोज कर रहे हैं वह मौजूद नहीं है या स्थानांतरित हो गया है। उपलब्ध जानकारी देखने के लिए आप हिन्दी मुखपृष्ठ पर लौट सकते हैं।',
  backHomeLabel: 'मुखपृष्ठ पर जाएँ',
  readSourceLabel: 'मूल भाषा में लेख सूची खोलें',
  home: {
    heroScrollLabel: 'नीचे स्क्रॉल करें',
    heroColumnsCtaLabel: 'लेख देखें',
    servicesDetailLabel: 'विवरण देखें',
    servicesAssistanceBefore: 'यदि यह स्पष्ट नहीं है कि आपका मामला किस समूह में आता है, तो पृष्ठ ',
    servicesAssistanceLinkLabel: 'संपर्क',
    servicesAssistanceAfter:
      ' बताता है कि आप ऐसा सार कैसे लिखें जिसे कोई अधिवक्ता जाँचे।',
    columnsViewAllLabel: 'सभी लेख देखें',
    columnsReadMoreLabel: 'आगे पढ़ें',
    columnsReviewLabel: 'अधिवक्ता Wei Tseng द्वारा जाँचा गया',
    columnsOriginalLanguageBadge: 'मूल भाषा',
    columnsOriginalLanguageNote:
      'निम्नलिखित लेख अभी हिन्दी में उपलब्ध नहीं हैं। सूची मूल भाषा में रहती है और संबंधित भाषा पृष्ठ खोलती है; सामग्री का स्वचालित अनुवाद नहीं होता।',
    imageBandAlt: 'दिन के प्रकाश में पारंपरिक ताइवानी सानहेयुआन (三合院) और एक आधुनिक मंडप',
    videoPauseLabel: 'वीडियो रोकें',
    videoPlayLabel: 'वीडियो चलाएँ',
    videoReplayLabel: 'वीडियो फिर चलाएँ',
  },
  pages: {
    home: {
      eyebrow: 'जानकारी',
      title: 'ताइवान में कानूनी सेवाएँ — हिन्दी में जानकारी',
      description:
        'Hovering International Law Firm के ताइवान में कार्य-क्षेत्र, परामर्श भाषाओं और प्रथम संपर्क पर हिन्दी में सामान्य स्पष्टीकरण।',
      intro:
        'Hovering International Law Firm विदेश से आने वाले मुवक्किलों, जिनमें ताइवान से संबंध रखने वाले भी शामिल हैं, का ताइवान के विधि के अनुसार साथ देती है: निवेश और कंपनी स्थापना, दीवानी विवाद, विवाह, परिवार और उत्तराधिकार, श्रम विधि, आपराधिक मामले और बौद्धिक संपदा। यह हिन्दी भाग आपको यह पहचानने में सहायता करता है कि कौन-सा कार्य हमारे दायरे में आता है, क्या तैयार करना है और हम तक कैसे पहुँचें। यह सामान्य जानकारी है, आपके अपने मामले की कानूनी राय नहीं।',
      sections: [
        {
          heading: 'हम क्या करते हैं',
          paragraphs: [
            'Hovering International Law Firm ताइवान में स्थापित एक कानून कार्यालय है। यह ताइवान के विधि के अनुसार कार्य करता है और ताइपेई (臺北), काओश्युंग (高雄), ताइचुंग (臺中) तथा पिंगतुंग (屏東) में कार्यालय रखता है। हम उद्यमों को सलाह देते हैं, न्यायालय में कार्यवाही चलाते हैं और विदेश से आए मुवक्किलों को ताइवान में आवश्यक चरणों में साथ देते हैं।',
            'यहाँ की सारी सामग्री सामान्य है। किसी मामले का परिणाम तथ्यों, लागू नियमों और समय पर निर्भर करता है। यह जानकारी आपके कागजात पर अधिवक्ता से बातचीत का स्थान नहीं लेती।',
          ],
        },
        {
          heading: 'पृष्ठ की भाषा और परामर्श भाषा एक नहीं हैं',
          paragraphs: [
            'यह पृष्ठ हिन्दी में लिखा गया है, किंतु अधिवक्ता से परामर्श केवल चार परामर्श भाषाओं — अंग्रेज़ी, चीनी (中文), जापानी और कोरियाई — में होता है। हिन्दी में जानकारी पढ़ने का अर्थ यह नहीं कि अधिवक्ता से बातचीत हिन्दी में होगी।',
            'हम इस पृष्ठ के माध्यम से दुभाषिए, उत्तर की समयसीमा या नियुक्ति का वादा नहीं करते। यदि आप चार भाषाओं में से किसी का उपयोग नहीं कर सकते, तो पृष्ठ «संपर्क» बताता है कि हम संचार मार्ग कैसे जाँचते हैं।',
          ],
        },
        {
          heading: 'कार्य-समूह',
          paragraphs: [
            'कार्य-क्षेत्र में निम्नलिखित छह समूह हैं। पृष्ठ «सेवाएँ» प्रत्येक समूह का अधिक सटीक वर्णन करता है और बताता है कि क्या वादा नहीं किया जाता।',
          ],
          items: [
            'ताइवान में निवेश और कंपनी स्थापना',
            'दीवानी विवाद और क्षतिपूर्ति',
            'विवाह, परिवार और उत्तराधिकार',
            'श्रम संबंधी विवाद',
            'आपराधिक मामले',
            'बौद्धिक संपदा: चिह्न, पेटेंट और कॉपीराइट',
          ],
        },
        {
          heading: 'आपको कहाँ से आरंभ करना चाहिए',
          paragraphs: [
            'यह देखने के लिए कि आपका मामला हमारे दायरे में आता है या नहीं, पृष्ठ «सेवाएँ» पढ़ें; फिर «लागत» और «संपर्क» पढ़ें ताकि पता चले कि दायरा कैसे तय होता है और कार्य आरंभ होने से पहले लागत कैसे पुष्ट होती है।',
            'संदेश भेजते समय आप सार अपनी भाषा में लिख सकते हैं। मूल पाठ उसी रूप में रखा जाता है जैसा आपने लिखा और स्वचालित रूप से अनुवाद नहीं किया जाता। भेजा गया संदेश जाँच की प्रतीक्षा करने वाला अनुरोध है: यह अभी परामर्श नहीं है और पुष्ट नियुक्ति भी नहीं है।',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'सेवाएँ',
      title: 'हम किन मामलों का कार्य करते हैं',
      description:
        'ताइवान में कार्यालय के छह कार्य-समूह और वे सीमाएँ जिन्हें पहले जानना उपयोगी है।',
      intro:
        'नीचे वे समूह हैं जिनका हम वास्तव में कार्य करते हैं, और वे प्रश्न जो आरंभिक चरण में प्रायः पूछे जाते हैं। यह विवरण आपको यह आँकने में सहायता करता है कि आपका मामला हमारे दायरे में आता है या नहीं; यह सामान्य है और किसी एक फ़ाइल का कानूनी विश्लेषण नहीं है।',
      sections: [
        {
          heading: 'ताइवान में निवेश और कंपनी स्थापना',
          paragraphs: [
            'हम विदेशी निवेशकों और उद्यमों को ताइवान में कंपनी स्थापित करने या चलाने में साथ देते हैं: कानूनी रूप का चयन, कागजात तैयार करना और जमा करना, पूँजी लगाना, बैंक संबंधी प्रश्न, स्थल की जाँच तथा क्षेत्र की अपेक्षाएँ। हम ताइवान में स्थापना और संचालन से उत्पन्न लेखांकन और कर में भी सहायता करते हैं।',
            'प्रक्रिया और समय रूप, निवेशक, क्षेत्र, बैंक और उपलब्ध कागजात के अनुसार भिन्न होते हैं। कंपनी स्थापना अपने आप निवास अनुमति (居留) या कार्य अनुमति (工作許可) नहीं देती: ये अलग प्रक्रियाएँ हैं, जिन्हें व्यक्ति की स्थिति के अनुसार देखा जाता है।',
          ],
        },
        {
          heading: 'दीवानी विवाद और क्षतिपूर्ति',
          paragraphs: [
            'इस समूह में संविदा विवाद, अवैध कृत्य से क्षतिपूर्ति और उपभोक्ता विवाद आते हैं। कार्य सामान्यतः कालक्रम, विद्यमान कागजात और प्रमाण की जाँच से आरंभ होता है और उसके बाद ही अगले चरण आते हैं।',
            'समयसीमाएँ, जिनमें परिसीमा भी शामिल है, और प्रमाण की पूर्णता मार्ग तय करती हैं। अतः ज्ञात तिथियाँ यथासंभव शीघ्र बताएँ। संविदाएँ, संदेश, भुगतान रसीदें या स्थल की स्थिति के चित्र सुरक्षित रखें और प्रथम संदेश में उनका उल्लेख करें।',
          ],
        },
        {
          heading: 'विवाह, परिवार और उत्तराधिकार',
          paragraphs: [
            'हम तलाक (離婚), संपत्ति विभाजन, अवयस्क संतानों के प्रति अधिकारों और कर्तव्यों का प्रयोग तथा वहन (未成年子女權利義務之行使或負擔), भेंट-मिलन (會面交往) और उत्तराधिकार (繼承) का कार्य करते हैं, तब भी जब पक्ष या संपत्ति भिन्न राज्यों में हों। सीमा-पार पारिवारिक मामलों में प्रायः परिवार रजिस्टर (戶籍), दस्तावेज़ों के रूप और ताइवान में उनकी प्रमाणिकता की अतिरिक्त जाँच चाहिए।',
            'क्योंकि पारिवारिक मामलों में प्रायः समयसीमाएँ और समानांतर प्रक्रियाएँ होती हैं, प्रथम सार में पक्षों का संबंध, वर्तमान निवास और पहले से चल रही प्रक्रियाएँ बतानी चाहिए।',
          ],
        },
        {
          heading: 'श्रम संबंधी विवाद',
          paragraphs: [
            'इस समूह में सेवा समाप्ति, ताइवान के विधि के अनुसार विच्छेद राशि (資遣費; अन्य राज्यों की संस्थाओं के समान नहीं मानी जाती), वेतन और श्रम संविदा (勞動契約) से विवाद आते हैं, कर्मचारी और नियोक्ता दोनों पक्षों पर। जाँच में हम समाप्ति के कारण को सूचना, भुगतान और समयसीमा के प्रश्नों से अलग रखते हैं।',
            'श्रम संविदा, कार्य नियम (工作規則), वेतन पर्ची और पक्षों का पत्र-व्यवहार प्रायः निर्णायक कागजात होते हैं। यदि वे अभी आपके पास हैं, तो सार में बताएँ।',
          ],
        },
        {
          heading: 'आपराधिक मामले',
          paragraphs: [
            'हम अन्वेषण और न्यायालय में साथ देते हैं, अभियुक्त या आरोपी के लिए तथा पीड़ित के लिए भी, और उद्यम गतिविधि के आपराधिक जोखिमों का आकलन करते हैं।',
            'आपराधिक मामलों में प्रायः छोटी समयसीमाएँ और निर्धारित चरण होते हैं। यदि आपको अभियोजन या न्यायालय का पत्र पहले ही मिल चुका है, तो पत्र की तिथि शीघ्र बताएँ ताकि सामग्री सही क्रम में जाँची जाए।',
          ],
        },
        {
          heading: 'बौद्धिक संपदा',
          paragraphs: [
            'हम चिह्न (商標) और पेटेंट (專利) के पंजीकरण, कॉपीराइट तथा ताइवान में इन अधिकारों के विवादों में सहायता करते हैं।',
            'इस समूह में चरणों का क्रम निर्णायक होता है: संरक्षण का दायरा, आवेदन का समय और वास्तविक उपयोग चयन को प्रभावित करते हैं। आवेदन जमा करना अपने आप यह नहीं दर्शाता कि वह स्वीकृत होगा।',
          ],
        },
        {
          heading: 'दायरा और उसकी पुष्टि',
          paragraphs: [
            'कार्यालय ताइवान के विधि के अनुसार कार्य करता है और उपर्युक्त समूहों के मामलों का कार्य करता है। प्रत्येक मामले का दायरा अलग से पुष्ट होता है, जब कोई अधिवक्ता आपके संदेश की जाँच कर लेता है।',
            'निवास स्थिति, कार्य अनुमति और तुलनीय प्रश्न कागजात और व्यक्ति की स्थिति से आँके जाते हैं, नागरिकता से नहीं। यदि आपके मामले का कोई भाग ऐसे प्रश्नों से जुड़ता है, तो संपर्क करते समय बताएँ। यह पृष्ठ न परिणाम का वादा करता है और न उत्तर की समयसीमा का।',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'कार्यालय',
      title: 'Hovering International Law Firm के बारे में',
      description:
        'इस ताइवानी कानून कार्यालय, उसके कार्यालयों और विदेशी पक्षों के साथ कार्य की मूल जानकारी।',
      intro:
        'Hovering International Law Firm ताइवान का एक कानून कार्यालय है। अधिवक्ता उद्यम सलाह से न्यायालय की कार्यवाही तक कार्य करते हैं। यह भाग कार्यालय की स्थापना, स्थानों और विदेशी पक्षों के साथ कार्य का वर्णन करता है।',
      sections: [
        {
          heading: 'स्थापना और संरचना',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) की स्थापना 2016 में उन अधिवक्ताओं ने की जो National Taiwan University (國立臺灣大學) में पढ़े। चीनी नाम 昊鼎 अक्षर 昊 («विस्तृत आकाश») को 鼎 («दृढ़ आधार») से जोड़ता है और स्थापना से कार्यालय की दिशा बताता है।',
            'हमारे कार्यालय ताइपेई (臺北), काओश्युंग (高雄), ताइचुंग (臺中) और पिंगतुंग (屏東) में हैं। काओश्युंग कार्यालय उद्यम संचालन पर केंद्रित है और दीवानी, आपराधिक तथा प्रशासनिक विवादों का कार्य करता है। ताइचुंग कार्यालय निर्माण, बौद्धिक संपदा तथा कोरिया और जापान से जुड़े मामलों का कार्य करता है। पिंगतुंग कार्यालय 2017 में स्थानीय आवश्यकता के लिए खोला गया।',
            'अधिवक्ता कार्य के अतिरिक्त 2020 से Hovering Accounting Office भी है, जो उद्यमियों और संपन्न निजी व्यक्तियों के लिए लेखांकन और कर योजना देता है।',
          ],
        },
        {
          heading: 'विदेशी पक्षों के साथ कार्य',
          paragraphs: [
            'सीमा-पार कार्य में कंपनी स्थापना, वीज़ा, चिह्न और पेटेंट आवेदन, कानूनी जोखिम जाँच और उद्यमों की कर सलाह शामिल है। ताइचुंग कार्यालय विशेष रूप से निर्माण, बौद्धिक संपदा तथा कोरिया और जापान से जुड़े मामलों का कार्य करता है। अधिवक्ता Wei Tseng (曾雋崴) कोरिया, जापान और अन्य अंतरराष्ट्रीय मुवक्किलों का उपर्युक्त समूहों में साथ देती हैं।',
            'क्या हम कोई मामला ले सकते हैं, यह सामग्री और संचार की भाषा पर निर्भर करता है। यदि आपका मामला उपर्युक्त समूहों में आता है और चार परामर्श भाषाओं में से किसी में चर्चा हो सकती है, तो आप जाँच के लिए सार भेज सकते हैं।',
          ],
        },
        {
          heading: 'जब आप हमसे संपर्क करते हैं',
          paragraphs: [
            'आपका सार आने के बाद कोई अधिवक्ता सामग्री जाँचता है और फिर संभावित कार्य-दायरे, अभी आवश्यक कागजात और अगले चरणों पर बात करता है। कर या लेखांकन प्रश्नों में कार्यालय लेखांकन विभाग के साथ एक ही प्रवाह में कार्य कर सकता है।',
            'प्रत्येक मामले का परिणाम तथ्यों और उपलब्ध कागजात पर निर्भर करता है; हम परिणाम का वादा नहीं करते। यदि आपको अपनी स्थिति के लिए बाध्यकारी उत्तर चाहिए, तो कागजात चार परामर्श भाषाओं में से किसी में अधिवक्ता से चर्चा करने होंगे।',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'अधिवक्ता',
      title: 'Hovering की अंतरराष्ट्रीय टीम',
      description: 'Hovering के अधिवक्ताओं, संचालन नेतृत्व और साझेदार लेखापरीक्षा की रूपरेखा।',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'लागत',
      title: 'कार्य-दायरा और लागत कैसे तय होते हैं',
      description:
        'क्रम की व्याख्या: पहले कार्य-दायरा, फिर लागत की पुष्टि, और यह पृष्ठ मूल्य सूची क्यों नहीं रखता।',
      intro:
        'यह पृष्ठ बताता है कि लागत कैसे तय होती है, उसकी राशि नहीं। राशि प्रत्येक मामले के कार्य-दायरे पर निर्भर करती है और तभी सार्थक है जब वह दायरा स्पष्ट हो।',
      sections: [
        {
          heading: 'पहले कार्य-दायरा तय होता है',
          paragraphs: [
            'एक ही प्रकार के मामलों में श्रम बहुत भिन्न हो सकता है, पक्षों की संख्या, उपलब्ध कागजात, पालन की जाने वाली समयसीमाओं और इस पर निर्भर कि प्रक्रिया पहले ही आरंभ हो चुकी है या नहीं। इसलिए पहला चरण सदा यह तय करना है कि कार्य में क्या आता है और क्या नहीं।',
            'आरंभ में आपके द्वारा भेजा सार इसी दायरे का आधार है। जितना स्पष्ट वह क्रम, आपकी माँग और समयसीमाएँ बताए, उतना ही सटीक दायरा निर्धारित हो सकता है।',
          ],
        },
        {
          heading: 'कार्य आरंभ होने से पहले लागत पुष्ट होती है',
          paragraphs: [
            'जब कार्य-दायरा स्पष्ट हो, तो राशि और गणना का तरीका आपके साथ चर्चा करके कार्य आरंभ होने से पहले पुष्ट किया जाता है। मार्ग में दायरा बदलने पर उसे फिर पुष्ट करना होता है।',
            'यह पृष्ठ मूल्य प्रस्ताव नहीं है और भुगतान का दायित्व नहीं बनाता।',
          ],
        },
        {
          heading: 'परामर्श सशुल्क हो सकता है',
          paragraphs: [
            'अधिवक्ता से परामर्श सशुल्क सेवा हो सकती है। यह पृष्ठ यह नहीं कहता कि पहली बातचीत निःशुल्क है, और कोई भाग इस अर्थ में नहीं पढ़ा जाना चाहिए।',
            'यदि परामर्श सशुल्क है, तो राशि और भुगतान का तरीका उसके होने से पहले बताया जाता है।',
          ],
        },
        {
          heading: 'यह पृष्ठ दरें क्यों नहीं बताता',
          paragraphs: [
            'लागत मामले पर ही निर्भर करती है: श्रम, पक्षों की संख्या, कागजात, समयसीमाएँ और इस पर कि प्रक्रिया पहले से चल रही है या नहीं। पहले से तय संख्या आपके मामले की लागत नहीं दिखाएगी। इसलिए हम पहले कार्य-दायरा तय करते हैं और फिर कार्य आरंभ होने से पहले आपको लागत बताते हैं।',
            'अधिवक्ता शुल्क के अतिरिक्त न्यायालय, प्राधिकरण या तीसरे पक्ष की लागतें उत्पन्न हो सकती हैं। ये शुल्क से अलग हैं और संबंधित प्रक्रिया पर निर्भर करती हैं।',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'संपर्क',
      title: 'कार्यालय तक कैसे पहुँचें',
      description:
        'पृष्ठ की भाषा, परामर्श भाषाएँ, वह मार्ग जब आप चार भाषाओं में से किसी का उपयोग न कर सकें, और यह पृष्ठ क्या नहीं कहता।',
      intro:
        'लिखने से पहले निम्नलिखित तीन बिंदु अलग रखें। इन्हें प्रायः मिला दिया जाता है, किंतु अर्थ भिन्न हैं।',
      sections: [
        {
          heading: 'तीन बातें जो अलग रहनी चाहिए',
          paragraphs: [
            'पृष्ठ की प्रदर्शन भाषा, अधिवक्ता से परामर्श भाषा और वह भाषा जिसमें आप लिखते हैं — ये तीन अलग बातें हैं।',
          ],
          items: [
            'पृष्ठ भाषा: यह जानकारी हिन्दी में लिखी गई है।',
            'परामर्श भाषा: परामर्श अंग्रेज़ी, चीनी (中文), जापानी और कोरियाई में होता है।',
            'आपकी लेखन भाषा: आप सार अपनी भाषा में लिख सकते हैं; मूल पाठ अपरिवर्तित रखा जाता है।',
          ],
        },
        {
          heading: 'यदि आप चार परामर्श भाषाओं में से किसी का उपयोग नहीं कर सकते',
          paragraphs: [
            'संपर्क फ़ॉर्म में आप «संचार मार्ग की पुष्टि आवश्यक है» चुन सकते हैं। हम उत्तर देते हैं ताकि व्यावहारिक संचार मार्ग जाँचा जा सके, यदि ऐसा मार्ग हो; अन्य भाषा में सेवा नहीं दी जाती और उत्तर की समयसीमा नहीं कही जाती।',
            'यह केवल जाँच का चरण है, वादा नहीं। हम दुभाषिए का वादा नहीं करते, हिन्दी या चार कही गई भाषाओं के बाहर किसी अन्य भाषा में सेवा का वादा नहीं करते, और यह भी नहीं कहते कि हम प्रत्येक मामला लेंगे।',
          ],
        },
        {
          heading: 'प्रथम संदेश में क्या होना चाहिए',
          paragraphs: [
            'बताएँ कि क्या हुआ, आपको किस सहायता की आवश्यकता है, मामले का ताइवान से क्या संबंध है और समयसीमा, यदि आप जानते हैं। यदि आपको न्यायालय या प्राधिकरण का पत्र पहले ही मिल चुका है, तो पत्र की तिथि बताएँ।',
            'आरंभिक चरण में आपको अभी पासपोर्ट संख्या, पहचान संख्या, खाता विवरण, चिकित्सा अभिलेख या संपूर्ण प्रमाण नहीं भेजने होते। अधिवक्ता के संकेत की प्रतीक्षा करें और तब संवेदनशील कागजात सुरक्षित मार्ग से भेजें।',
          ],
        },
        {
          heading: 'यह पृष्ठ क्या नहीं कहता',
          paragraphs: [
            'हम उत्तर की समयसीमा नहीं कहते, इस पृष्ठ से नियुक्ति पुष्ट नहीं करते, किसी निश्चित अधिवक्ता का वादा नहीं करते और दुभाषिया नहीं देते। लिखित अनुवाद अलग बात है: आपके संदेश का स्वचालित अनुवाद नहीं होता।',
            'जब आप अनुरोध भेजते हैं, सामग्री रखी जाती है और जाँच की प्रतीक्षा करती है। यदि कुछ समय बाद उत्तर न आए, तो आप संपर्क पृष्ठ पर बताए गए ई-मेल पते पर फिर लिख सकते हैं।',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'प्रश्न',
      title: 'अक्सर पूछे जाने वाले प्रश्न',
      description:
        'कार्य-क्षेत्र, तैयारी, भाषाओं, लागत और भेजे गए अनुरोध के अर्थ पर स्पष्टीकरण।',
      intro:
        'निम्नलिखित प्रश्नों का उत्तर सामान्य जानकारी के स्तर पर दिया जाता है। आपके अपने मामले का उत्तर तभी संभव है जब कोई अधिवक्ता कागजात जाँच ले।',
      sections: [
        {
          heading: 'इस भाग का उपयोग कैसे करें',
          paragraphs: [
            'यदि आपको अपनी स्थिति का उत्तर नहीं मिलता, तो उत्तर प्रायः विशेष तथ्यों पर निर्भर करता है। तब वे तथ्य सार में लिखें, इस पृष्ठ से स्वयं निष्कर्ष निकालने के स्थान पर।',
          ],
        },
      ],
      faqs: [
        {
          question: 'कार्यालय किन मामलों का कार्य करता है?',
          answer:
            'हम छह समूहों का कार्य करते हैं: ताइवान में निवेश और कंपनी स्थापना, दीवानी विवाद और क्षतिपूर्ति, विवाह, परिवार और उत्तराधिकार, श्रम संबंधी विवाद, आपराधिक मामले और बौद्धिक संपदा। कोई मामला लिया जाएगा या नहीं, यह सामग्री की जाँच के बाद तय होता है।',
        },
        {
          question: 'संपर्क से पहले मुझे क्या तैयार करना चाहिए?',
          answer:
            'क्रम, अपनी माँग, ताइवान से संबंध और समयसीमा, यदि हो, का संक्षिप्त सार तैयार करें। यदि न्यायालय या प्राधिकरण का पत्र पहले से है, तो तिथि बताएँ। इस चरण में आपको अभी पहचान पत्र या संपूर्ण प्रमाण नहीं भेजने होते।',
        },
        {
          question: 'क्या हिंदी में परामर्श संभव है?',
          answer:
            'नहीं। ये निर्देश हिंदी में लिखे गए हैं, लेकिन अधिवक्ता से परामर्श केवल अंग्रेज़ी, चीनी (中文), जापानी और कोरियाई में होता है। हम दुभाषिए का भी वादा नहीं करते। लिखित अनुवाद अलग बात है: आपके लिखे मूल पाठ को वैसे ही रखा जाता है और स्वचालित रूप से अनुवाद नहीं किया जाता।',
        },
        {
          question: 'यदि मैं चार भाषाओं में से किसी का उपयोग न कर सकूँ तो क्या?',
          answer:
            'अनुरोध भेजते समय «संचार मार्ग की पुष्टि आवश्यक है» चुनें। हम संचार मार्ग जाँचने के लिए उत्तर देते हैं, किंतु अन्य भाषा में सेवा नहीं दी जाती। यह जाँच का चरण है, यह वादा नहीं कि हम अन्य भाषा में कार्य कर सकते हैं।',
        },
        {
          question: 'मेरे हिन्दी पाठ का क्या होता है?',
          answer:
            'आपके लिखे मूल पाठ को वैसे ही रखा जाता है और स्वचालित रूप से अनुवाद नहीं किया जाता। आवश्यकता होने पर आगे के संचार की भाषा आपके साथ पुष्ट की जाती है।',
        },
        {
          question: 'क्या अनुरोध भेजते ही परामर्श हो चुका माना जाता है?',
          answer:
            'नहीं। भेजा गया अनुरोध अधिवक्ता की जाँच की प्रतीक्षा करता है। यह कानूनी राय नहीं है, पुष्ट नियुक्ति नहीं है, और भेजना अपने आप अधिवक्ता और मुवक्किल के बीच संबंध नहीं बनाता।',
        },
        {
          question: 'लागत कैसे निकाली जाती है?',
          answer:
            'पहले कार्य-दायरा तय होता है, उसके बाद राशि और गणना का तरीका आपके साथ पुष्ट होता है, कार्य आरंभ होने से पहले। यह पृष्ठ संख्याएँ नहीं बताता और यह नहीं कहता कि पहली बातचीत निःशुल्क है।',
        },
        {
          question: 'यदि मेरा मामला अत्यंत तात्कालिक हो तो क्या?',
          answer:
            'समयसीमा या आधिकारिक पत्र की तिथि अपने सार के आरंभ में बताएँ, ताकि जाँच में ये तिथियाँ दिखें। इस पृष्ठ पर आपात मार्ग नहीं है और उत्तर की समयसीमा नहीं कही जाती; यदि आपका मामला प्रतीक्षा नहीं कर सकता, तो आपको अपने स्थान पर समानांतर अन्य मार्ग भी देखने चाहिए।',
        },
      ],
    },
    privacy: {
      eyebrow: 'गोपनीयता',
      title: 'संपर्क फ़ॉर्म से एकत्र किए जाने वाले आँकड़े',
      description:
        'इस हिन्दी भाग का संपर्क फ़ॉर्म क्या एकत्र करता है, मूल पाठ का कैसे व्यवहार होता है, और अपने आँकड़ों के लिए आप हम तक कैसे पहुँचें।',
      intro:
        'यह भाग केवल इन जानकारी पृष्ठों के संपर्क फ़ॉर्म से संबंधित है। यह आँकड़ों के व्यवहार का वर्णन करता है, तकनीकी वादा नहीं।',
      sections: [
        {
          heading: 'कौन-से आँकड़े एकत्र होते हैं',
          paragraphs: [
            'जब आप इस भाग के फ़ॉर्म से अनुरोध भेजते हैं, निम्नलिखित दर्ज किए जाते हैं:',
          ],
          items: [
            'आपके द्वारा बताया गया नाम',
            'उत्तर के लिए ई-मेल पता',
            'भेजते समय पृष्ठ की प्रदर्शन भाषा',
            'वह भाषा जिसमें आपने लिखा',
            'आपकी इच्छित परामर्श भाषा',
            'आपके द्वारा लिखा मूल पाठ',
            'अनुरोध भेजने की आपकी सहमति',
            'अनुरोध पुनः खोजने के लिए प्राप्ति संख्या',
          ],
        },
        {
          heading: 'मूल पाठ अपरिवर्तित रखा जाता है',
          paragraphs: [
            'आपका पाठ ठीक उसी रूप में रखा जाता है जैसा आपने लिखा और स्वचालित रूप से अनुवाद नहीं किया जाता। यदि कार्य के लिए अनुवाद आवश्यक हो, तो यह आपके साथ अलग से चर्चा की जाती है।',
            'क्योंकि मूल पाठ रखा जाता है, आरंभिक चरण में वह न लिखें जिसकी अभी आवश्यकता नहीं, जैसे पासपोर्ट संख्या, पहचान संख्या या खाता विवरण।',
          ],
        },
        {
          heading: 'संग्रह स्थान और पहुँच',
          paragraphs: [
            'आपके प्रेषण की सामग्री ऐसे स्थान पर रखी जाती है जो सार्वजनिक रूप से उपलब्ध नहीं है। केवल कार्यालय के अधिकृत व्यक्ति अनुरोध का कार्य करने के लिए उस तक पहुँच सकते हैं।',
            'यह पृष्ठ पूर्ण सुरक्षा का वादा नहीं करता। कोई भी संचरण मार्ग और कोई भी संग्रह स्थान पूरी तरह सुरक्षित नहीं; अतः संवेदनशील कागजात अधिवक्ता के विशेष संकेत के बाद ही भेजने चाहिए।',
          ],
        },
        {
          heading: 'उपयोग का उद्देश्य',
          paragraphs: [
            'भेजे गए आँकड़े अनुरोध की जाँच, आपको उत्तर, संचार मार्ग स्पष्ट करने और यदि कार्य लिया जाए तो उसके संचालन के लिए हैं।',
            'आँकड़ों का विपणन के लिए उपयोग अलग सहमति के बिना नहीं होता।',
          ],
        },
        {
          heading: 'सूचना और प्राप्ति संख्या',
          paragraphs: [
            'अनुरोध सफलतापूर्वक भेजे जाने पर प्रणाली कार्यालय को सूचित करती है। यदि यह सूचना अभी पुष्ट नहीं हुई, तो आपका पाठ रखा रहता है और खोता नहीं।',
            'प्राप्ति संख्या हमारे अभिलेखों में आपका अनुरोध खोजने के लिए है। संग्रह के बाद यह दिखाई जाती है; नई संपर्क में आप इसे बता सकते हैं।',
          ],
        },
        {
          heading: 'आपके अधिकार और संपर्क मार्ग',
          paragraphs: [
            'आप संपर्क पृष्ठ पर बताए गए ई-मेल पते से अपने आँकड़ों की जानकारी, सुधार या विलोपन माँग सकते हैं या सहमति वापस ले सकते हैं। यदि कानूनी या प्रक्रियात्मक संग्रह कर्तव्य हो, तो हम सीमा समझाते हैं।',
            'यह पृष्ठ निश्चित संग्रह अवधि नहीं बताता, क्योंकि वास्तविक अवधि इस पर निर्भर करती है कि मामला आगे बढ़ता है या नहीं, और उससे जुड़े कर्तव्यों पर। यदि आप पहले विलोपन चाहते हैं, तो संपर्क में बताएँ।',
          ],
        },
        {
          heading: 'संग्रह स्थान और सेवा प्रदाता',
          paragraphs: [
            'यह जालस्थल Vercel पर होस्ट है, और आपका प्रेषण इस सेवा के गैर-सार्वजनिक वस्तु संग्रह में रखा जाता है। ई-मेल कार्यालय द्वारा प्रयुक्त ई-मेल सेवा से भेजे जाते हैं।',
            'कुछ सेवा प्रदाताओं के सर्वर ताइवान के बाहर हो सकते हैं, जिससे आपके आँकड़े वहाँ रखे और संसाधित हो सकते हैं। जब संग्रह का उद्देश्य पूरा हो जाता है, आँकड़े बिना विलंब मिटाए जाते हैं; लागू नियमों के अनुसार रखे जाने वाले आँकड़े उस अवधि तक रहते हैं। व्यक्तिगत आँकड़ों के अनुरोध wei@hoveringlaw.com.tw ग्रहण करता है।',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'अस्वीकरण',
      title: 'इस पृष्ठ की जानकारी का दायरा और सीमाएँ',
      description:
        'जानकारी का सामान्य स्वरूप, कानूनी लागू क्षेत्र और अधिवक्ता-मुवक्किल संबंध की शर्तें।',
      intro:
        'यह भाग स्पष्ट करता है कि ये हिन्दी जानकारी पृष्ठ आपके लिए क्या कर सकते हैं और क्या नहीं।',
      sections: [
        {
          heading: 'केवल सामान्य जानकारी',
          paragraphs: [
            'इन पृष्ठों की सामग्री सामान्य जानकारी के रूप में लिखी गई है। यह आपके मामले की कानूनी राय नहीं है और आपके अपने कागजात की जाँच का स्थान नहीं लेती।',
            'किसी मामले का परिणाम तथ्यों, लागू नियमों और समय पर निर्भर करता है; दो समान दिखने वाली स्थितियाँ भिन्न समाप्त हो सकती हैं।',
          ],
        },
        {
          heading: 'कानूनी लागू क्षेत्र',
          paragraphs: [
            'कार्यालय ताइवान के विधि के अनुसार कार्य करता है, और यह पृष्ठ केवल इसी ढाँचे में कार्य की बात करता है।',
            'सामग्री ताइवान से भिन्न किसी अन्य व्यवस्था के विधि के अनुसार सलाह नहीं है, जिसमें आपके निवास स्थान का विधि भी शामिल है। यदि आपके मामले का कोई भाग अन्य व्यवस्था से जुड़ता है, तो हम आपके साथ स्पष्ट करेंगे कि उस भाग के लिए कौन-सा योग्य विशेषज्ञ आवश्यक है।',
          ],
        },
        {
          heading: 'अधिवक्ता और मुवक्किल का संबंध अपने आप नहीं बनता',
          paragraphs: [
            'इस पृष्ठ को पढ़ना, फ़ॉर्म या ई-मेल भेजना अपने आप अधिवक्ता और मुवक्किल के बीच संबंध नहीं बनाता।',
            'यह संबंध तभी बनता है जब मामला जाँच लिया गया हो और दोनों पक्षों ने कार्य लेने की पुष्टि कर दी हो।',
          ],
        },
        {
          heading: 'परिणाम का कोई वादा नहीं',
          paragraphs: [
            'इस पृष्ठ का कोई भाग किसी मामले के परिणाम, आवेदन की स्वीकृति या निवास तथा कार्य स्थिति का वादा नहीं है।',
            'बाहरी कड़ियाँ दिशा के लिए हैं; हम तीसरे पक्ष की सामग्री की शुद्धता या अद्यतनता नहीं कहते।',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'लेख',
      title: 'ताइवान के विधि पर लेख',
      description:
        'ताइवान के विधि के सामान्य प्रश्नों पर हिन्दी लेख। सामग्री प्रकाशन के समय की सामान्य जानकारी है, आपके मामले की कानूनी राय नहीं।',
      intro:
        'कार्यालय ताइवान के विधि के सामान्य प्रश्नों पर लेख प्रकाशित करता है। हिन्दी में उपलब्ध लेख इस पृष्ठ पर हैं; साथ में चार कड़ियाँ हैं जो प्रत्येक एक मूल भाषा की लेख सूची खोलती हैं।',
      sections: [
        {
          heading: 'भाषा के अनुसार चार सूचियाँ',
          paragraphs: [
            'इस भाग में चार कड़ियाँ हैं: कोरियाई, चीनी, अंग्रेज़ी और जापानी में लेख सूची। प्रत्येक कड़ी सूची की भाषा बताती है, ताकि आप पहले से जान सकें कि सामग्री किस भाषा में खुलेगी।',
            'ये चार सूचियाँ लेखों की मूल भाषा के अनुसार सूचियाँ हैं, अनुवाद सूचियाँ नहीं। हिन्दी में उपलब्ध लेख इस पृष्ठ पर अलग हैं।',
          ],
        },
        {
          heading: 'कड़ियाँ कहाँ ले जाती हैं',
          paragraphs: [
            'जब आप चार कड़ियों में से एक चुनते हैं, उस भाषा की लेख सूची खुलती है। सूची से आप स्वयं पाठ चुनते हैं; पूरी सामग्री लेख की मूल भाषा में दिखाई देती है।',
            'यह पृष्ठ लेखों की सामग्री का सार नहीं देता और यह नहीं कहता कि कोई विषय चारों भाषाओं में उपलब्ध है। प्रत्येक सूची में केवल वे पाठ हैं जो उस भाषा में प्रकाशित हैं।',
          ],
        },
        {
          heading: 'लेख दिशा के रूप में कहाँ तक काम आ सकता है',
          paragraphs: [
            'लेख प्रकाशन के समय की सामान्य जानकारी हैं। नियम और उनका प्रयोग बदल सकते हैं, और कोई लेख आपके मामले की सभी परिस्थितियों को नहीं समेटता।',
            'इसलिए वास्तविक मामले में कोई कदम केवल लेख पर आधारित न करें। उसे अवलोकन के लिए उपयोग करें और अपने कागजात अधिवक्ता से अलग चर्चा करें; यह पृष्ठ परामर्श चरण नहीं है।',
          ],
        },
      ],
    },
  },
};


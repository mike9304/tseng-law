/**
 * Answer-first summary blocks for the five guidance languages.
 *
 * These blocks exist so that a generative engine quoting one of the guidance
 * pages quotes a short, self-contained, accurate paragraph instead of stitching
 * one together from the body copy. Every sentence below restates a fact that is
 * already published in `guidanceContent[locale].pages[key]`; nothing here adds a
 * new legal statement, a figure, a promise, or a case outcome.
 *
 * Language contract (identical to the guidance pages themselves): the page is
 * written in the guidance language, but a consultation with an attorney is held
 * only in English, Chinese, Japanese and Korean. No answer below names the
 * guidance language at all, so no sentence can be read as an offer of a
 * consultation, interpreting, or support in Vietnamese, Indonesian, Thai,
 * Filipino or Arabic.
 *
 * The content module (`international-guidance-content.ts`) is intentionally not
 * touched by this file: only its two types are imported.
 */

import type {
  GuidanceLocale,
  GuidancePageKey,
} from '@/data/international-guidance-content';

export interface GuidanceAnswer {
  /**
   * 40–80 words (Thai: 120–400 characters) restating the page in one block:
   * the direct answer, one sentence on the consultation languages.
   */
  answer: string;
  /**
   * One or two supporting links. Site-internal paths only, each one an existing
   * guidance route in the same language.
   */
  sources: string[];
}

export const guidanceAnswers: Record<
  GuidanceLocale,
  Partial<Record<GuidancePageKey, GuidanceAnswer>>
> = {
  vi: {
    services: {
      answer:
        'Văn phòng nhận sáu nhóm công việc theo pháp luật Đài Loan: đầu tư và thành lập doanh nghiệp, tranh chấp dân sự và bồi thường, hôn nhân, gia đình và thừa kế, tranh chấp lao động, hình sự và sở hữu trí tuệ. Phạm vi từng vụ việc được xác nhận riêng sau khi luật sư xem xét nội dung quý vị gửi. Tư vấn được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn.',
      sources: ['/vi/faq', '/vi/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm là văn phòng luật tại Đài Loan, thành lập năm 2016 bởi luật sư Đại học Quốc lập Đài Loan (國立臺灣大學), cơ sở tại Đài Bắc, Cao Hùng, Đài Trung và Bình Đông. Từ 2020 có bộ phận kế toán; cơ sở Đài Trung phụ trách việc liên quan đến Hàn Quốc, Nhật Bản. Văn phòng không cam kết kết quả. Tư vấn được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn.',
      sources: ['/vi/lawyers', '/vi/services'],
    },
    lawyers: {
      answer:
        'Trang này giới thiệu các luật sư, quản lý nghiệp vụ và kế toán viên hợp tác của Hovering. Luật sư Wei Tseng (曾雋崴) có tư cách hành nghề tại Đài Loan và là luật sư điều hành của văn phòng, làm việc với khách hàng Hàn Quốc, Nhật Bản và khách hàng quốc tế. Việc tư vấn của văn phòng được thực hiện bằng bốn ngôn ngữ: tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn.',
      sources: ['/vi/about', '/vi/contact'],
    },
    pricing: {
      answer:
        'Trang này không công bố bảng giá. Phạm vi công việc được xác định từ tóm tắt quý vị gửi, sau đó mức phí và cách tính được xác nhận trước khi bắt đầu. Buổi tư vấn có thể là dịch vụ có thu phí. Ngoài thù lao luật sư có thể có khoản nộp cho tòa án hoặc cơ quan nhà nước. Việc tư vấn được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn.',
      sources: ['/vi/contact', '/vi/faq'],
    },
    contact: {
      answer:
        'Hãy gửi tóm tắt qua biểu mẫu liên hệ: chuyện gì đã xảy ra, cần hỗ trợ gì, vụ việc liên quan đến Đài Loan ra sao và thời hạn nếu có. Bước đầu chưa cần gửi giấy tờ tùy thân hay toàn bộ chứng cứ. Văn phòng không cam kết thời gian phản hồi, không xác nhận lịch hẹn qua trang này. Việc tư vấn được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn.',
      sources: ['/vi/faq', '/vi/pricing'],
    },
    faq: {
      answer:
        'Phần hỏi đáp trả lời ở mức thông tin chung: sáu nhóm công việc, cách chuẩn bị tóm tắt, chi phí và ý nghĩa của việc gửi yêu cầu. Yêu cầu đã gửi đang chờ luật sư xem xét; không phải ý kiến pháp lý, không phải lịch hẹn, và không tạo lập quan hệ giữa luật sư và khách hàng. Việc tư vấn được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn.',
      sources: ['/vi/contact', '/vi/services'],
    },
  },
  id: {
    services: {
      answer:
        'Kantor menangani enam kelompok perkara berdasarkan hukum Taiwan: investasi dan pendirian perusahaan di Taiwan, sengketa perdata dan ganti rugi, perkara perkawinan, keluarga, dan waris, sengketa ketenagakerjaan, perkara pidana, serta kekayaan intelektual. Lingkup setiap perkara dipastikan tersendiri setelah advokat meninjau isi pesan Anda. Konsultasi dengan advokat dilayani dalam bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea.',
      sources: ['/id/faq', '/id/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm adalah kantor advokat di Taiwan yang didirikan pada 2016 oleh para advokat lulusan Universitas Nasional Taiwan (國立臺灣大學), dengan kantor di Taipei, Kaohsiung, Taichung, dan Pingtung. Sejak 2020 kantor juga memiliki bagian akuntansi, dan kantor Taichung menangani urusan yang berkaitan dengan Korea dan Jepang. Hasil setiap perkara bergantung pada faktanya, sehingga kami tidak menjanjikan hasil. Konsultasi dengan advokat dilayani dalam bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea.',
      sources: ['/id/lawyers', '/id/services'],
    },
    lawyers: {
      answer:
        'Halaman ini memuat profil para advokat, manajer operasional, dan akuntan mitra Hovering. Wei Tseng (曾雋崴) adalah advokat berizin praktik di Taiwan dan advokat pengelola di Hovering International Law Firm, yang bekerja untuk klien dari Korea, Jepang, dan klien internasional lainnya. Konsultasi di kantor dilayani dalam empat bahasa: bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea.',
      sources: ['/id/about', '/id/contact'],
    },
    pricing: {
      answer:
        'Halaman ini tidak memuat daftar tarif. Lingkup pekerjaan ditetapkan lebih dulu berdasarkan ringkasan yang Anda kirim, lalu besaran dan cara penghitungan biaya dipastikan bersama Anda sebelum pekerjaan dimulai. Pertemuan dengan advokat dapat merupakan layanan berbayar, dan selain honorarium advokat dapat timbul pungutan untuk pengadilan atau instansi pemerintah. Konsultasi dilayani dalam bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea.',
      sources: ['/id/contact', '/id/faq'],
    },
    contact: {
      answer:
        'Kirimkan ringkasan melalui formulir kontak: apa yang terjadi, bantuan apa yang Anda perlukan, apa kaitan perkara itu dengan Taiwan, dan tenggat waktu jika Anda mengetahuinya. Pada tahap awal Anda belum perlu mengirim dokumen identitas atau seluruh bukti. Kantor tidak menjanjikan waktu balasan dan tidak memastikan janji temu melalui halaman ini. Konsultasi dengan advokat dilayani dalam bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea.',
      sources: ['/id/faq', '/id/pricing'],
    },
    faq: {
      answer:
        'Bagian tanya jawab menjelaskan pada tingkat keterangan umum: enam kelompok perkara, persiapan sebelum menghubungi kantor, cara biaya ditetapkan, dan arti dari mengirim permintaan. Permintaan yang terkirim berarti permintaan yang menunggu ditinjau advokat; itu bukan nasihat hukum, bukan janji temu, dan tidak membentuk hubungan antara advokat dan klien. Konsultasi dengan advokat dilayani dalam bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea.',
      sources: ['/id/contact', '/id/services'],
    },
  },
  th: {
    services: {
      answer:
        'สำนักงานรับดำเนินการงาน 6 กลุ่มภายใต้กฎหมายไต้หวัน ได้แก่ การลงทุนและการจัดตั้งบริษัทในไต้หวัน ข้อพิพาททางแพ่งและการเรียกค่าสินไหมทดแทน คดีการสมรส ครอบครัว และมรดก ข้อพิพาทแรงงาน คดีอาญา และทรัพย์สินทางปัญญา ส่วนขอบเขตของแต่ละเรื่องจะได้รับการยืนยันเป็นการเฉพาะ หลังจากทนายความตรวจสอบเนื้อหาที่ท่านส่งมาแล้ว การให้คำปรึกษาดำเนินการเป็นภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี',
      sources: ['/th/faq', '/th/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm เป็นสำนักงานกฎหมายในไต้หวัน ก่อตั้งขึ้นในปี 2016 โดยกลุ่มทนายความที่จบการศึกษาจากมหาวิทยาลัยแห่งชาติไต้หวัน (國立臺灣大學) มีที่ทำการที่ไทเป เกาสง ไถจง และผิงตง และมีส่วนงานบัญชีตั้งแต่ปี 2020 โดยสาขาไถจงรับงานที่เกี่ยวข้องกับเกาหลีและญี่ปุ่น ทั้งนี้ เราไม่รับประกันผล การให้คำปรึกษาดำเนินการเป็นภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี',
      sources: ['/th/lawyers', '/th/services'],
    },
    lawyers: {
      answer:
        'หน้านี้แนะนำประวัติของทนายความ ผู้จัดการงาน และผู้สอบบัญชีพันธมิตรของ Hovering โดย Wei Tseng (曾雋崴) เป็นทนายความที่มีคุณสมบัติประกอบวิชาชีพในไต้หวัน และเป็นทนายความผู้บริหารของสำนักงาน ทำงานให้แก่ลูกความชาวเกาหลี ชาวญี่ปุ่น และลูกความต่างชาติรายอื่น การให้คำปรึกษาของสำนักงานดำเนินการใน 4 ภาษา ได้แก่ ภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี',
      sources: ['/th/about', '/th/contact'],
    },
    pricing: {
      answer:
        'หน้านี้ไม่แสดงอัตราค่าบริการ สำนักงานจะกำหนดขอบเขตงานก่อนจากสรุปเรื่องที่ท่านส่งมา จากนั้นจำนวนเงินและวิธีคิดค่าใช้จ่ายจะได้รับการยืนยันกับท่านก่อนเริ่มงาน การพบทนายความอาจเป็นบริการที่มีค่าใช้จ่าย และนอกจากค่าทนายความยังอาจมีค่าธรรมเนียมที่ต้องชำระต่อศาลหรือหน่วยงานของรัฐ การให้คำปรึกษาดำเนินการเป็นภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี',
      sources: ['/th/contact', '/th/faq'],
    },
    contact: {
      answer:
        'โปรดส่งสรุปเรื่องผ่านแบบฟอร์มติดต่อ โดยระบุว่าเกิดอะไรขึ้น ท่านต้องการความช่วยเหลือด้านใด เรื่องนี้เกี่ยวข้องกับไต้หวันอย่างไร และมีกำหนดเวลาหรือไม่ ในขั้นแรกยังไม่จำเป็นต้องส่งเอกสารแสดงตนหรือพยานหลักฐานทั้งหมด สำนักงานไม่รับประกันระยะเวลาตอบกลับและไม่ได้ยืนยันการนัดหมายผ่านหน้านี้ การให้คำปรึกษาดำเนินการเป็นภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี',
      sources: ['/th/faq', '/th/pricing'],
    },
    faq: {
      answer:
        'ส่วนคำถามที่พบบ่อยตอบไว้ในระดับข้อมูลทั่วไป ทั้งกลุ่มงาน 6 กลุ่ม การเตรียมตัวก่อนติดต่อ วิธีกำหนดค่าใช้จ่าย และความหมายของการส่งเรื่องเข้ามา เรื่องที่ส่งแล้วคือเรื่องที่รอทนายความตรวจสอบ ไม่ใช่ความเห็นทางกฎหมาย ไม่ใช่การนัดหมาย และไม่ได้ทำให้เกิดความสัมพันธ์ระหว่างทนายความกับลูกความ การให้คำปรึกษาดำเนินการเป็นภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี',
      sources: ['/th/contact', '/th/services'],
    },
  },
  fil: {
    services: {
      answer:
        'Anim na pangkat ng usapin ang hinahawakan ng tanggapan sa ilalim ng batas ng Taiwan: pamumuhunan at pagtatatag ng kompanya sa Taiwan, sibil na hidwaan at danyos, usaping pag-aasawa, pampamilya, at pagmamana, hidwaan sa paggawa, usaping kriminal, at intelektuwal na ari-arian. Hiwalay na kinukumpirma ang saklaw ng bawat usapin matapos suriin ng abogado ang ipinadala ninyo. Isinasagawa ang konsultasyon sa abogado sa Ingles, Tsino, Hapon, at Koreano.',
      sources: ['/fil/faq', '/fil/contact'],
    },
    about: {
      answer:
        'Ang Hovering International Law Firm ay tanggapan ng mga abogado sa Taiwan na itinatag noong 2016 ng mga abogadong nagmula sa National Taiwan University (國立臺灣大學), na may mga tanggapan sa Taipei, Kaohsiung, Taichung, at Pingtung. Mula noong 2020 ay may bahagi rin itong pang-akawnting, at hinahawakan ng tanggapan sa Taichung ang gawaing may kaugnayan sa Korea at Japan. Wala kaming ipinapangakong resulta. Isinasagawa ang konsultasyon sa abogado sa Ingles, Tsino, Hapon, at Koreano.',
      sources: ['/fil/lawyers', '/fil/services'],
    },
    lawyers: {
      answer:
        'Inilalahad ng pahinang ito ang mga profile ng mga abogado, tagapamahala ng operasyon, at kasosyong akawntant ng Hovering. Si Wei Tseng (曾雋崴) ay abogadang kwalipikadong magpraktis sa Taiwan at ang namamahalang abogada ng tanggapan, na gumagawa para sa mga kliyenteng Koreano, Hapon, at iba pang dayuhang kliyente. Isinasagawa ang konsultasyon sa tanggapan sa apat na wika: Ingles, Tsino, Hapon, at Koreano.',
      sources: ['/fil/about', '/fil/contact'],
    },
    pricing: {
      answer:
        'Walang listahan ng presyo sa pahinang ito. Itinatakda muna ang saklaw ng trabaho batay sa buod na ipinadala ninyo, saka kinukumpirma kasama kayo ang halaga at ang paraan ng pagkuwenta bago magsimula ang trabaho. Maaaring bayad na serbisyo ang pagharap sa abogado, at maaari ring may singil na babayaran sa korte o sa ahensiya ng pamahalaan. Isinasagawa ang konsultasyon sa abogado sa Ingles, Tsino, Hapon, at Koreano.',
      sources: ['/fil/contact', '/fil/faq'],
    },
    contact: {
      answer:
        'Ipadala ang buod sa pamamagitan ng form ng kontak: kung ano ang nangyari, anong tulong ang kailangan ninyo, ano ang kaugnayan ng usapin sa Taiwan, at kung may takdang petsa na alam ninyo. Sa unang yugto ay hindi pa ninyo kailangang ipadala ang mga dokumento ng pagkakakilanlan o ang buong ebidensiya. Walang ipinapangakong panahon ng pagsagot at walang kinukumpirmang appointment dito. Isinasagawa ang konsultasyon sa abogado sa Ingles, Tsino, Hapon, at Koreano.',
      sources: ['/fil/faq', '/fil/pricing'],
    },
    faq: {
      answer:
        'Sinasagot ng bahaging ito ang mga madalas itanong sa antas ng pangkalahatang impormasyon: ang anim na pangkat ng usapin, ang paghahanda bago makipag-ugnayan, ang pagtatakda ng bayarin, at ang kahulugan ng pagpapadala ng mensahe. Ang naipadalang mensahe ay naghihintay pa ng pagsusuri ng abogado; hindi ito legal na payo, hindi ito appointment, at hindi ito bumubuo ng ugnayan ng abogado at kliyente. Isinasagawa ang konsultasyon sa abogado sa Ingles, Tsino, Hapon, at Koreano.',
      sources: ['/fil/contact', '/fil/services'],
    },
  },
  ar: {
    services: {
      answer:
        'يتولّى المكتب ست مجموعات من القضايا وفق القانون التايواني: الاستثمار وتأسيس الشركات في تايوان، والمنازعات المدنية ودعاوى التعويض، وقضايا الزواج والأسرة والميراث، ومنازعات العمل، والقضايا الجزائية، والملكية الفكرية. ويُؤكَّد نطاق كل قضية على حدة بعد مراجعة المحامي لما ترسله. الاستشارات تُقدَّم بالإنجليزية أو الصينية أو اليابانية أو الكورية.',
      sources: ['/ar/faq', '/ar/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm مكتب محاماة في تايوان، تأسّس عام 2016 على يد محامين من خرّيجي الجامعة الوطنية التايوانية (國立臺灣大學)، وله مكاتب في تايبيه وكاوهسيونغ وتايتشونغ وبينغتونغ. ومنذ عام 2020 يضم قسمًا للمحاسبة، ويتولّى مكتب تايتشونغ الأعمال المتصلة بكوريا واليابان. ولا يقدّم المكتب أي التزام بالنتيجة. الاستشارات تُقدَّم بالإنجليزية أو الصينية أو اليابانية أو الكورية.',
      sources: ['/ar/lawyers', '/ar/services'],
    },
    lawyers: {
      answer:
        'تعرض هذه الصفحة ملفات المحامين ومديري الأعمال والمحاسب الشريك في Hovering. والمحامية Wei Tseng (曾雋崴) محامية مؤهَّلة لمزاولة المهنة في تايوان والمحامية المديرة في المكتب، وتعمل مع العملاء من كوريا واليابان وسائر العملاء الدوليين. الاستشارات تُقدَّم بالإنجليزية أو الصينية أو اليابانية أو الكورية.',
      sources: ['/ar/about', '/ar/contact'],
    },
    pricing: {
      answer:
        'لا تنشر هذه الصفحة قائمة أسعار. يُحدَّد نطاق العمل أولًا من الملخّص الذي ترسله، ثم تُؤكَّد معك الأتعاب وطريقة احتسابها قبل بدء العمل. وقد تكون الجلسة مع المحامي خدمة بمقابل، وقد تنشأ إلى جانب أتعاب المحاماة مبالغ تُدفَع للمحكمة أو لجهة حكومية. الاستشارات تُقدَّم بالإنجليزية أو الصينية أو اليابانية أو الكورية.',
      sources: ['/ar/contact', '/ar/faq'],
    },
    contact: {
      answer:
        'أرسل ملخّصك عبر نموذج التواصل: ما الذي حدث، وما المساعدة التي تحتاج إليها، وما صلة القضية بتايوان، والمواعيد إن كنت تعرفها. ولا حاجة في المرحلة الأولى إلى إرسال وثائق الهوية أو ملف الأدلة كاملًا. ولا يلتزم المكتب بمدة للرد، ولا يؤكّد المواعيد عبر هذه الصفحة. الاستشارات تُقدَّم بالإنجليزية أو الصينية أو اليابانية أو الكورية.',
      sources: ['/ar/faq', '/ar/pricing'],
    },
    faq: {
      answer:
        'يجيب قسم الأسئلة الشائعة على مستوى المعلومات العامة: مجموعات العمل الست، وكيفية تحضير الملخّص، وطريقة تحديد التكلفة، ومعنى إرسال الطلب. والطلب المُرسَل ينتظر مراجعة المحامي؛ فهو ليس رأيًا قانونيًا، وليس موعدًا مؤكّدًا، ولا يُنشئ علاقة بين المحامي والموكّل. الاستشارات تُقدَّم بالإنجليزية أو الصينية أو اليابانية أو الكورية.',
      sources: ['/ar/contact', '/ar/services'],
    },
  },
  de: {
    services: {
      answer:
        'Die Kanzlei bearbeitet sechs Tätigkeitsgruppen nach taiwanischem Recht: Investition und Gesellschaftsgründung, Zivilsachen und Schadensersatz, Ehe, Familie und Erbrecht, Arbeitsrecht, Strafsachen und geistiges Eigentum. Der Umfang jeder Sache wird gesondert bestätigt, nachdem eine Anwältin oder ein Anwalt den Inhalt geprüft hat. Die Beratung erfolgt nur auf Englisch, Chinesisch, Japanisch und Koreanisch.',
      sources: ['/de/faq', '/de/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm ist eine Anwaltskanzlei in Taiwan, 2016 gegründet von Absolventinnen und Absolventen der National Taiwan University (國立臺灣大學), mit Büros in Taipeh, Kaohsiung, Taichung und Pingtung. Seit 2020 gibt es eine Buchhaltungsabteilung; das Büro Taichung bearbeitet Angelegenheiten mit Bezug zu Korea und Japan. Die Kanzlei verspricht kein Ergebnis. Die Beratung erfolgt nur auf Englisch, Chinesisch, Japanisch und Koreanisch.',
      sources: ['/de/lawyers', '/de/services'],
    },
    lawyers: {
      answer:
        'Diese Seite zeigt die Profile der Anwältinnen und Anwälte, der Betriebsleitung und der Partner-Wirtschaftsprüfung von Hovering. Rechtsanwältin Wei Tseng (曾雋崴) ist in Taiwan zur anwaltlichen Tätigkeit zugelassen und geschäftsführende Anwältin der Kanzlei; sie arbeitet mit Mandanten aus Korea, Japan und anderen internationalen Mandanten. Die Beratung erfolgt nur auf Englisch, Chinesisch, Japanisch und Koreanisch.',
      sources: ['/de/about', '/de/contact'],
    },
    pricing: {
      answer:
        'Diese Seite veröffentlicht keine Preisliste. Zuerst wird der Arbeitsumfang aus der von Ihnen gesendeten Zusammenfassung festgelegt, danach werden Höhe und Berechnungsweise der Kosten mit Ihnen bestätigt, bevor die Arbeit beginnt. Die Beratung durch eine Anwältin oder einen Anwalt kann entgeltlich sein; neben dem Honorar können Gerichts- oder Behördenkosten entstehen. Die Beratung erfolgt nur auf Englisch, Chinesisch, Japanisch und Koreanisch.',
      sources: ['/de/contact', '/de/faq'],
    },
    contact: {
      answer:
        'Senden Sie Ihre Zusammenfassung über das Kontaktformular: was geschehen ist, welche Hilfe Sie brauchen, welchen Bezug die Sache zu Taiwan hat und die Frist, falls Sie eine kennen. In der Anfangsphase müssen Sie noch keine Ausweisdokumente oder den gesamten Beweisbestand senden. Die Kanzlei verspricht keine Antwortfrist und bestätigt keinen Termin über diese Seite. Die Beratung erfolgt nur auf Englisch, Chinesisch, Japanisch und Koreanisch.',
      sources: ['/de/faq', '/de/pricing'],
    },
    faq: {
      answer:
        'Dieser Teil beantwortet häufige Fragen auf der Ebene allgemeiner Angaben: die sechs Tätigkeitsgruppen, die Vorbereitung vor dem Kontakt, die Festlegung der Kosten und die Bedeutung einer gesendeten Nachricht. Eine gesendete Anfrage wartet auf Prüfung durch eine Anwältin oder einen Anwalt; sie ist keine Rechtsberatung, kein Termin und begründet kein Mandatsverhältnis. Die Beratung erfolgt nur auf Englisch, Chinesisch, Japanisch und Koreanisch.',
      sources: ['/de/contact', '/de/services'],
    },
  },
  es: {
    services: {
      answer:
        'El despacho atiende seis grupos de trabajo según el derecho de Taiwán: inversión y constitución de sociedades, litigios civiles y daños, matrimonio, familia y sucesiones, laboral, penal y propiedad intelectual. El alcance de cada asunto se confirma por separado después de que un abogado revise el contenido que usted envía. La consulta se realiza en inglés, chino, japonés y coreano.',
      sources: ['/es/faq', '/es/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm es un despacho de abogados en Taiwán, fundado en 2016 por egresados de la National Taiwan University (國立臺灣大學), con oficinas en Taipéi, Kaohsiung, Taichung y Pingtung. Desde 2020 incluye un área de contabilidad, y la oficina de Taichung atiende asuntos relacionados con Corea y Japón. El despacho no promete un resultado. La consulta se realiza en inglés, chino, japonés y coreano.',
      sources: ['/es/lawyers', '/es/services'],
    },
    lawyers: {
      answer:
        'Esta página muestra los perfiles de los abogados, de la dirección de operaciones y del contador asociado de Hovering. La abogada Wei Tseng (曾雋崴) está habilitada para ejercer en Taiwán y es la abogada directora del despacho; trabaja con clientes de Corea, de Japón y con otros clientes internacionales. La consulta se realiza en inglés, chino, japonés y coreano.',
      sources: ['/es/about', '/es/contact'],
    },
    pricing: {
      answer:
        'Esta página no publica una lista de precios. Primero se fija el alcance del trabajo a partir del resumen que usted envía, y después se confirman con usted la cuantía y el modo de cálculo antes de empezar. La consulta con un abogado puede ser un servicio de pago, y junto a los honorarios pueden surgir tasas judiciales o administrativas. La consulta se realiza en inglés, chino, japonés y coreano.',
      sources: ['/es/contact', '/es/faq'],
    },
    contact: {
      answer:
        'Envíe su resumen a través del formulario de contacto: qué ocurrió, qué ayuda necesita, qué relación tiene el asunto con Taiwán y el plazo si lo conoce. En esta primera fase no hace falta enviar documentos de identidad ni el expediente completo de pruebas. El despacho no promete un plazo de respuesta y no confirma una cita a través de esta página. La consulta se realiza en inglés, chino, japonés y coreano.',
      sources: ['/es/faq', '/es/pricing'],
    },
    faq: {
      answer:
        'Esta parte responde a preguntas frecuentes en el plano de la información general: los seis grupos de trabajo, la preparación antes del contacto, el modo de fijar los honorarios y el significado de enviar un mensaje. Una solicitud enviada espera la revisión de un abogado; no es asesoramiento jurídico, no es una cita y no crea una relación entre abogado y cliente. La consulta se realiza en inglés, chino, japonés y coreano.',
      sources: ['/es/contact', '/es/services'],
    },
  },
  fr: {
    services: {
      answer:
        'Le cabinet traite six groupes de travail selon le droit de Taïwan : investissement et constitution de sociétés, affaires civiles et dommages-intérêts, mariage, famille et successions, droit du travail, affaires pénales et propriété intellectuelle. L’étendue de chaque affaire est confirmée séparément après qu’une avocate ou un avocat a examiné le contenu que vous envoyez. La consultation a lieu seulement en anglais, en chinois, en japonais et en coréen.',
      sources: ['/fr/faq', '/fr/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm est un cabinet d’avocats à Taïwan, fondé en 2016 par des diplômées et diplômés de la National Taiwan University (國立臺灣大學), avec des bureaux à Taipei, Kaohsiung, Taichung et Pingtung. Depuis 2020 il existe un service de comptabilité ; le bureau de Taichung traite des affaires liées à la Corée et au Japon. Le cabinet ne promet pas de résultat. La consultation a lieu seulement en anglais, en chinois, en japonais et en coréen.',
      sources: ['/fr/lawyers', '/fr/services'],
    },
    lawyers: {
      answer:
        'Cette page présente les profils des avocates et avocats, de la direction des opérations et de l’expertise-comptable associée de Hovering. L’avocate Wei Tseng (曾雋崴) est habilitée à exercer à Taïwan et elle est l’avocate dirigeante du cabinet ; elle travaille avec des clients de Corée, du Japon et d’autres clients internationaux. La consultation a lieu seulement en anglais, en chinois, en japonais et en coréen.',
      sources: ['/fr/about', '/fr/contact'],
    },
    pricing: {
      answer:
        'Cette page ne publie pas de liste de prix. L’étendue du travail est d’abord fixée à partir du résumé que vous envoyez, puis le montant et le mode de calcul sont confirmés avec vous avant le début du travail. La consultation avec une avocate ou un avocat peut être une prestation payante ; outre les honoraires, des frais de tribunal ou d’autorité peuvent naître. La consultation a lieu seulement en anglais, en chinois, en japonais et en coréen.',
      sources: ['/fr/contact', '/fr/faq'],
    },
    contact: {
      answer:
        'Envoyez votre résumé par le formulaire de contact : ce qui s’est passé, l’aide demandée, le lien avec Taïwan et le délai s’il existe. À ce stade, n’envoyez pas encore de pièces d’identité ni l’ensemble des preuves. Le cabinet ne promet pas de délai de réponse et ne confirme pas de rendez-vous par cette page. La consultation a lieu seulement en anglais, en chinois, en japonais et en coréen.',
      sources: ['/fr/faq', '/fr/pricing'],
    },
    faq: {
      answer:
        'Cette partie répond à des questions fréquentes : les six groupes de travail, la préparation avant le contact, le mode de fixation des honoraires et le sens d’un message envoyé. Une demande envoyée attend l’examen d’une avocate ou d’un avocat ; ce n’est pas un avis juridique, ce n’est pas un rendez-vous, et cela ne crée pas de relation entre avocate ou avocat et client. La consultation a lieu seulement en anglais, en chinois, en japonais et en coréen.',
      sources: ['/fr/contact', '/fr/services'],
    },
  },
  pt: {
    services: {
      answer:
        'O escritório trata seis grupos de trabalho segundo o direito de Taiwan: investimento e constituição de sociedades, litígios civis e indemnizações, casamento, família e sucessões, laboral, penal e propriedade intelectual. O âmbito de cada assunto confirma-se separadamente depois de uma advogada ou um advogado rever o conteúdo que envia. A consulta realiza-se apenas em inglês, chinês, japonês e coreano.',
      sources: ['/pt/faq', '/pt/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm é um escritório de advogados em Taiwan, fundado em 2016 por diplomadas e diplomados da National Taiwan University (國立臺灣大學), com escritórios em Taipé, Kaohsiung, Taichung e Pingtung. Desde 2020 inclui uma área de contabilidade, e o escritório de Taichung trata assuntos relacionados com a Coreia e o Japão. O escritório não promete um resultado. A consulta realiza-se apenas em inglês, chinês, japonês e coreano.',
      sources: ['/pt/lawyers', '/pt/services'],
    },
    lawyers: {
      answer:
        'Esta página mostra os perfis das advogadas e dos advogados, da direção de operações e da contabilidade associada de Hovering. A advogada Wei Tseng (曾雋崴) está habilitada a exercer em Taiwan e é a advogada diretora do escritório; trabalha com clientes da Coreia, do Japão e com outros clientes internacionais. A consulta realiza-se apenas em inglês, chinês, japonês e coreano.',
      sources: ['/pt/about', '/pt/contact'],
    },
    pricing: {
      answer:
        'Esta página não publica uma lista de preços. Primeiro fixa-se o âmbito do trabalho a partir do resumo que envia, e depois confirmam-se consigo o montante e o modo de cálculo antes de começar. A consulta com uma advogada ou um advogado pode ser um serviço pago, e junto aos honorários podem surgir taxas judiciais ou administrativas. A consulta realiza-se apenas em inglês, chinês, japonês e coreano.',
      sources: ['/pt/contact', '/pt/faq'],
    },
    contact: {
      answer:
        'Envie o seu resumo através do formulário de contacto: o que ocorreu, que ajuda precisa, que relação tem o assunto com Taiwan e o prazo se o conhecer. Nesta primeira fase não é preciso enviar documentos de identidade nem o processo completo de provas. O escritório não promete um prazo de resposta e não confirma uma marcação através desta página. A consulta realiza-se apenas em inglês, chinês, japonês e coreano.',
      sources: ['/pt/faq', '/pt/pricing'],
    },
    faq: {
      answer:
        'Esta parte responde a perguntas frequentes no plano da informação geral: os seis grupos de trabalho, a preparação antes do contacto, o modo de fixar os honorários e o significado de enviar uma mensagem. Um pedido enviado espera a revisão de uma advogada ou de um advogado; não é parecer jurídico, não é uma marcação e não cria uma relação entre advogada ou advogado e cliente. A consulta realiza-se apenas em inglês, chinês, japonês e coreano.',
        sources: ['/pt/contact', '/pt/services'],
    },
  },
  'zh-hans': {
    services: {
      answer:
        '事务所依台湾法律处理六组工作：投资与公司设立、民事与损害赔偿、婚姻家庭与继承、劳动、刑事与智慧财产。每一案件的范围在律师审阅您提交的内容后另行确认。咨询以英语、中文、日语和韩语进行。',
      sources: ['/zh-hans/faq', '/zh-hans/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm 是台湾律师事务所，2016 年由国立台湾大学（國立臺灣大學）出身的律师创立，办公室在台北、高雄、台中与屏东。自 2020 年起设有会计部门；台中办公室处理与韩国、日本有关的事项。事务所不承诺结果。咨询以英语、中文、日语和韩语进行。',
      sources: ['/zh-hans/lawyers', '/zh-hans/services'],
    },
    lawyers: {
      answer:
        '本页介绍 Hovering 的律师、运营主管与合作会计师。律师曾雋崴（Wei Tseng）具有台湾执业资格，为事务所主持律师，与来自韩国、日本及其他国际委托人合作。事务所的咨询以英语、中文、日语和韩语四种语言进行。',
      sources: ['/zh-hans/about', '/zh-hans/contact'],
    },
    pricing: {
      answer:
        '本页不公布价目表。工作范围先根据您提交的摘要确定，费用金额与计算方式在开始工作前与您确认。与律师的咨询可以是有偿服务。除律师酬金外，还可能产生法院或行政机关费用。咨询以英语、中文、日语和韩语进行。',
      sources: ['/zh-hans/contact', '/zh-hans/faq'],
    },
    contact: {
      answer:
        '请通过联系表单提交摘要：发生了什么、需要何种协助、事项与台湾的关联，以及期限（若有）。初期不必发送身份证件或全部证据。事务所不承诺回复时限，也不通过本页确认预约。咨询以英语、中文、日语和韩语进行。',
      sources: ['/zh-hans/faq', '/zh-hans/pricing'],
    },
    faq: {
      answer:
        '问答部分在一般说明的层面回答：六组工作、联系前如何准备、费用如何确定，以及发送请求的含义。已发送的请求正在等待律师审阅；不是法律意见，不是预约，也不成立律师与委托人关系。咨询以英语、中文、日语和韩语进行。',
      sources: ['/zh-hans/contact', '/zh-hans/services'],
    },
  },
  ms: {
    services: {
      answer:
        'Firma mengendalikan enam kumpulan kerja menurut undang-undang Taiwan: pelaburan dan penubuhan syarikat, pertikaian sivil dan ganti rugi, perkahwinan, keluarga dan pusaka, pertikaian buruh, jenayah dan harta intelek. Skop setiap hal disahkan secara berasingan selepas peguam menyemak kandungan yang anda hantar. Perundingan hanya dijalankan dalam bahasa Inggeris, Cina, Jepun dan Korea.',
      sources: ['/ms/faq', '/ms/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm ialah firma peguam di Taiwan, ditubuhkan pada 2016 oleh graduan National Taiwan University (國立臺灣大學), dengan pejabat di Taipei, Kaohsiung, Taichung dan Pingtung. Sejak 2020 terdapat bahagian perakaunan; pejabat Taichung mengendalikan hal yang berkaitan dengan Korea dan Jepun. Firma tidak menjanjikan hasil. Perundingan hanya dijalankan dalam bahasa Inggeris, Cina, Jepun dan Korea.',
      sources: ['/ms/lawyers', '/ms/services'],
    },
    lawyers: {
      answer:
        'Halaman ini memperkenalkan peguam, pengurusan operasi dan perakaunan rakan kongsi Hovering. Peguam Wei Tseng (曾雋崴) mempunyai kelayakan untuk beramal di Taiwan dan ialah peguam pengarah firma; beliau bekerja dengan klien dari Korea, Jepun dan klien antarabangsa lain. Perundingan hanya dijalankan dalam bahasa Inggeris, Cina, Jepun dan Korea.',
      sources: ['/ms/about', '/ms/contact'],
    },
    pricing: {
      answer:
        'Halaman ini tidak menerbitkan senarai harga. Skop kerja ditetapkan dahulu daripada ringkasan yang anda hantar, kemudian jumlah dan cara pengiraan disahkan dengan anda sebelum kerja bermula. Perundingan dengan peguam boleh menjadi perkhidmatan berbayar; selain yuran, kos mahkamah atau pihak berkuasa boleh timbul. Perundingan hanya dijalankan dalam bahasa Inggeris, Cina, Jepun dan Korea.',
      sources: ['/ms/contact', '/ms/faq'],
    },
    contact: {
      answer:
        'Hantar ringkasan melalui borang hubungan: apa yang berlaku, bantuan yang diperlukan, kaitan dengan Taiwan dan tempoh jika ada. Pada peringkat ini belum perlu menghantar dokumen pengenalan atau seluruh bukti. Firma tidak menjanjikan tempoh jawapan dan tidak mengesahkan janji temu melalui halaman ini. Perundingan hanya dijalankan dalam bahasa Inggeris, Cina, Jepun dan Korea.',
      sources: ['/ms/faq', '/ms/pricing'],
    },
    faq: {
      answer:
        'Bahagian soalan menjawab pada tahap maklumat am: enam kumpulan kerja, persediaan sebelum hubungan, cara menetapkan yuran dan makna mesej yang dihantar. Permintaan yang dihantar menunggu semakan peguam; bukan nasihat undang-undang, bukan janji temu, dan tidak mewujudkan hubungan antara peguam dan klien. Perundingan hanya dijalankan dalam bahasa Inggeris, Cina, Jepun dan Korea.',
      sources: ['/ms/contact', '/ms/services'],
    },
  },
  ru: {
    services: {
      answer:
        'Фирма ведёт шесть групп работы по праву Тайваня: инвестиции и учреждение компаний, гражданские дела и возмещение вреда, брак, семья и наследство, трудовые споры, уголовные дела и интеллектуальная собственность. Объём каждого дела подтверждается отдельно после того, как адвокат рассмотрит содержание, которое Вы отправляете. Консультация проводится только на английском, китайском, японском и корейском языках.',
      sources: ['/ru/faq', '/ru/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm — адвокатская фирма на Тайване, основанная в 2016 году выпускниками National Taiwan University (國立臺灣大學), с офисами Тайбэй, Гаосюн, Тайчжун и Пиндун. С 2020 года есть бухгалтерское подразделение; офис Тайчжун ведёт дела, связанные с Кореей и Японией. Фирма не обещает результата. Консультация проводится только на английском, китайском, японском и корейском языках.',
      sources: ['/ru/lawyers', '/ru/services'],
    },
    lawyers: {
      answer:
        'Эта страница представляет адвокатов, руководство по операциям и партнёрскую бухгалтерию Hovering. Адвокат Вэй Цзэн (曾雋崴) уполномочена практиковать на Тайване и является руководящим адвокатом фирмы; она работает с доверителями из Кореи, Японии и другими международными доверителями. Консультация проводится только на английском, китайском, японском и корейском языках.',
      sources: ['/ru/about', '/ru/contact'],
    },
    pricing: {
      answer:
        'Эта страница не публикует прейскурант. Объём работы сначала определяется по краткому изложению, которое Вы отправляете, затем размер и способ расчёта подтверждаются с Вами до начала работы. Консультация с адвокатом может быть возмездной услугой; помимо гонорара могут возникнуть судебные или административные расходы. Консультация проводится только на английском, китайском, японском и корейском языках.',
      sources: ['/ru/contact', '/ru/faq'],
    },
    contact: {
      answer:
        'Отправьте краткое изложение через контактную форму: что произошло, какая помощь нужна, какая связь у дела с Тайванем и срок, если он есть. На этом этапе ещё не нужно отправлять документы, удостоверяющие личность, или все доказательства. Фирма не обещает срок ответа и не подтверждает запись через эту страницу. Консультация проводится только на английском, китайском, японском и корейском языках.',
      sources: ['/ru/faq', '/ru/pricing'],
    },
    faq: {
      answer:
        'Этот раздел отвечает на частые вопросы на уровне общих сведений: шесть групп работы, подготовка до обращения, способ определения гонорара и смысл отправленного сообщения. Отправленный запрос ожидает рассмотрения адвокатом; это не юридическая консультация, не запись и не создаёт отношений между адвокатом и доверителем. Консультация проводится только на английском, китайском, японском и корейском языках.',
      sources: ['/ru/contact', '/ru/services'],
    },
  },
  tr: {
    services: {
      answer:
        'Büro, Tayvan hukukuna göre altı çalışma grubu yürütür: yatırım ve şirket kuruluşu, hukuk davaları ve tazminat, evlilik, aile ve miras, iş hukuku, ceza ve fikri mülkiyet. Her işin kapsamı, bir avukat gönderdiğiniz içeriği inceledikten sonra ayrıca doğrulanır. Görüşme yalnızca İngilizce, Çince, Japonca ve Korece yapılır.',
      sources: ['/tr/faq', '/tr/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm, 2016 yılında National Taiwan University (國立臺灣大學) mezunları tarafından kurulmuş, Taipei, Kaohsiung, Taichung ve Pingtung ofisleri olan bir Tayvan avukatlık bürosudur. 2020’den beri bir muhasebe birimi vardır; Taichung ofisi Kore ve Japonya bağlantılı işleri yürütür. Büro sonuç vaat etmez. Görüşme yalnızca İngilizce, Çince, Japonca ve Korece yapılır.',
      sources: ['/tr/lawyers', '/tr/services'],
    },
    lawyers: {
      answer:
        'Bu sayfa Hovering avukatlarının, operasyon yönetiminin ve ortak muhasebenin profillerini gösterir. Avukat Wei Tseng (曾雋崴) Tayvan’da meslek yürütmeye yetkilidir ve büronun yönetici avukatıdır; Kore, Japonya ve diğer uluslararası müvekkillerle çalışır. Büro bir sonuç vaat etmez. Görüşme yalnızca İngilizce, Çince, Japonca ve Korece yapılır.',
      sources: ['/tr/about', '/tr/contact'],
    },
    pricing: {
      answer:
        'Bu sayfa fiyat listesi yayımlamaz. Çalışma kapsamı önce gönderdiğiniz özete göre belirlenir, sonra tutar ve hesaplanma biçimi işe başlamadan önce sizinle doğrulanır. Avukatla görüşme ücretli bir hizmet olabilir; ücretin yanında mahkeme veya idare giderleri doğabilir. Görüşme yalnızca İngilizce, Çince, Japonca ve Korece yapılır.',
      sources: ['/tr/contact', '/tr/faq'],
    },
    contact: {
      answer:
        'Özetinizi iletişim formu üzerinden gönderin: ne olduğu, ne yardıma gereksinim duyduğunuz, işin Tayvan ile ilişkisi ve varsa süre. Bu ilk aşamada kimlik belgesi veya tüm kanıtları göndermeniz gerekmez. Büro yanıt süresi vaat etmez ve bu sayfa üzerinden randevu doğrulamaz. Görüşme yalnızca İngilizce, Çince, Japonca ve Korece yapılır.',
      sources: ['/tr/faq', '/tr/pricing'],
    },
    faq: {
      answer:
        'Bu bölüm sık sorulan soruları genel bilgi düzleminde yanıtlar: altı çalışma grubu, iletişimden önce hazırlık, ücretin belirlenme biçimi ve bir ileti göndermenin anlamı. Gönderilen talep bir avukatın incelemesini bekler; hukuki görüş değildir, randevu değildir ve avukat ile müvekkil arasında ilişki kurmaz. Görüşme yalnızca İngilizce, Çince, Japonca ve Korece yapılır.',
        sources: ['/tr/contact', '/tr/services'],
    },
  },
  it: {
    services: {
      answer:
        'Lo studio tratta sei gruppi di lavoro secondo il diritto di Taiwan: investimento e costituzione di società, controversie civili e risarcimento, matrimonio, famiglia e successioni, lavoro, penale e proprietà intellettuale. L’ambito di ciascuna questione viene confermato separatamente dopo che un’avvocata o un avvocato ha esaminato il contenuto che Lei invia. La consulenza si svolge soltanto in inglese, cinese, giapponese e coreano.',
      sources: ['/it/faq', '/it/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm è uno studio legale a Taiwan, fondato nel 2016 da laureate e laureati della National Taiwan University (國立臺灣大學), con uffici a Taipei, Kaohsiung, Taichung e Pingtung. Dal 2020 esiste una sezione di contabilità; l’ufficio di Taichung tratta questioni con nesso con la Corea e il Giappone. Lo studio non promette un risultato. La consulenza si svolge soltanto in inglese, cinese, giapponese e coreano.',
      sources: ['/it/lawyers', '/it/services'],
    },
    lawyers: {
      answer:
        'Questa pagina mostra i profili delle avvocate e degli avvocati, della direzione operativa e della revisione associata di Hovering. L’avvocata Wei Tseng (曾雋崴) è abilitata a Taiwan ed è l’avvocata dirigente dello studio; lavora con clienti dalla Corea, dal Giappone e con altri clienti internazionali. La consulenza si svolge soltanto in inglese, cinese, giapponese e coreano.',
      sources: ['/it/about', '/it/contact'],
    },
    pricing: {
      answer:
        'Questa pagina non pubblica un listino. Prima si fissa l’ambito di lavoro dal riassunto che Lei invia, poi importo e modo di calcolo dei costi si confermano con Lei prima che il lavoro inizi. La consulenza con un’avvocata o un avvocato può essere a pagamento; oltre all’onorario possono sorgere costi di tribunale o di autorità. La consulenza si svolge soltanto in inglese, cinese, giapponese e coreano.',
      sources: ['/it/contact', '/it/faq'],
    },
    contact: {
      answer:
        'Invii il riassunto tramite il modulo di contatto: che cosa è accaduto, di quale aiuto ha bisogno, quale nesso ha la questione con Taiwan e il termine, se Lo conosce. Nella fase iniziale non deve ancora inviare documenti di identità o l’insieme delle prove. Lo studio non promette un termine di risposta e non conferma un appuntamento tramite questa pagina. La consulenza si svolge soltanto in inglese, cinese, giapponese e coreano.',
      sources: ['/it/faq', '/it/pricing'],
    },
    faq: {
      answer:
        'Questa parte risponde a domande frequenti al livello di indicazioni generali: i sei gruppi di lavoro, la preparazione prima del contatto, la fissazione dei costi e il significato di un messaggio inviato. Una richiesta inviata attende l’esame di un’avvocata o di un avvocato; non è un parere giuridico, non è un appuntamento e non costituisce un rapporto tra avvocata o avvocato e cliente. La consulenza si svolge soltanto in inglese, cinese, giapponese e coreano.',
      sources: ['/it/contact', '/it/services'],
    },
  },
  nl: {
    services: {
      answer:
        'Het kantoor behandelt zes werkgroepen volgens Taiwanees recht: investering en oprichting van vennootschappen, civiele zaken en schadevergoeding, huwelijk, familie en erfrecht, arbeidsrecht, strafzaken en intellectuele eigendom. De omvang van elke zaak wordt afzonderlijk bevestigd nadat een advocaat de inhoud heeft beoordeeld die u stuurt. De consultatie vindt alleen plaats in het Engels, Chinees, Japans en Koreaans.',
      sources: ['/nl/faq', '/nl/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm is een advocatenkantoor in Taiwan, in 2016 opgericht door afgestudeerden van de National Taiwan University (國立臺灣大學), met kantoren in Taipei, Kaohsiung, Taichung en Pingtung. Sinds 2020 is er een boekhoudafdeling; het kantoor Taichung behandelt zaken met betrekking tot Korea en Japan. Het kantoor belooft geen resultaat. De consultatie vindt alleen plaats in het Engels, Chinees, Japans en Koreaans.',
      sources: ['/nl/lawyers', '/nl/services'],
    },
    lawyers: {
      answer:
        'Deze pagina toont de profielen van de advocaten, de operationele leiding en de partneraccountancy van Hovering. Advocaat Wei Tseng (曾雋崴) is bevoegd in Taiwan en is leidinggevend advocaat van het kantoor; zij werkt met cliënten uit Korea, Japan en andere internationale cliënten. De consultatie vindt alleen plaats in het Engels, Chinees, Japans en Koreaans.',
      sources: ['/nl/about', '/nl/contact'],
    },
    pricing: {
      answer:
        'Deze pagina publiceert geen prijslijst. Eerst wordt de omvang van het werk vastgesteld uit de samenvatting die u stuurt, daarna worden hoogte en berekeningswijze van de kosten met u bevestigd voordat het werk begint. Het gesprek met een advocaat kan tegen betaling zijn; naast het honorarium kunnen gerechtelijke of bestuurlijke kosten ontstaan. De consultatie vindt alleen plaats in het Engels, Chinees, Japans en Koreaans.',
      sources: ['/nl/contact', '/nl/faq'],
    },
    contact: {
      answer:
        'Stuur uw samenvatting via het contactformulier: wat er is gebeurd, welke hulp u nodig hebt, welk verband de zaak met Taiwan heeft en de termijn, als u er een kent. In de beginfase hoeft u nog geen identiteitsdocumenten of het gehele bewijs te sturen. Het kantoor belooft geen antwoordtermijn en bevestigt geen afspraak via deze pagina. De consultatie vindt alleen plaats in het Engels, Chinees, Japans en Koreaans.',
      sources: ['/nl/faq', '/nl/pricing'],
    },
    faq: {
      answer:
        'Dit deel beantwoordt veelgestelde vragen op het niveau van algemene informatie: de zes werkgroepen, de voorbereiding vóór het contact, de vaststelling van de kosten en de betekenis van een verzonden bericht. Een verzonden verzoek wacht op beoordeling door een advocaat; het is geen juridisch advies, geen afspraak en schept geen relatie tussen advocaat en cliënt. De consultatie vindt alleen plaats in het Engels, Chinees, Japans en Koreaans.',
      sources: ['/nl/contact', '/nl/services'],
    },
  },
  pl: {
    services: {
      answer:
        'Kancelaria prowadzi sześć grup spraw według prawa Tajwanu: inwestycje i zakładanie spółek, sprawy cywilne i odszkodowania, małżeństwo, rodzina i spadki, prawo pracy, sprawy karne oraz własność intelektualną. Zakres każdej sprawy jest potwierdzany osobno po tym, jak adwokat rozpatrzy treść, którą Państwo wysyłają. Konsultacja odbywa się wyłącznie po angielsku, chińsku, japońsku i koreańsku.',
      sources: ['/pl/faq', '/pl/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm jest kancelarią adwokacką na Tajwanie, założoną w 2016 r. przez absolwentów National Taiwan University (國立臺灣大學), z biurami w Taipei, Kaohsiung, Taichung i Pingtung. Od 2020 r. istnieje dział księgowości; biuro w Taichung prowadzi sprawy związane z Koreą i Japonią. Kancelaria nie obiecuje wyniku. Konsultacja odbywa się wyłącznie po angielsku, chińsku, japońsku i koreańsku.',
      sources: ['/pl/lawyers', '/pl/services'],
    },
    lawyers: {
      answer:
        'Ta strona pokazuje profile adwokatów, kierownictwa operacyjnego i partnerskiego biura rachunkowego Hovering. Adwokat Wei Tseng (曾雋崴) jest uprawniona do wykonywania zawodu na Tajwanie i jest adwokatem kierującym kancelarią; pracuje z klientami z Korei, Japonii i innymi klientami międzynarodowymi. Konsultacja odbywa się wyłącznie po angielsku, chińsku, japońsku i koreańsku.',
      sources: ['/pl/about', '/pl/contact'],
    },
    pricing: {
      answer:
        'Ta strona nie publikuje cennika. Najpierw ustala się zakres pracy ze streszczenia, które Państwo wysyłają, a następnie wysokość i sposób obliczania kosztów potwierdza się z Państwem, zanim praca się zacznie. Rozmowa z adwokatem może być odpłatna; obok honorarium mogą powstać koszty sądowe lub urzędowe. Konsultacja odbywa się wyłącznie po angielsku, chińsku, japońsku i koreańsku.',
      sources: ['/pl/contact', '/pl/faq'],
    },
    contact: {
      answer:
        'Prosimy wysłać streszczenie przez formularz kontaktowy: co się stało, jakiej pomocy potrzeba, jaki związek ma sprawa z Tajwanem oraz termin, jeśli jest znany. Na początku nie trzeba jeszcze wysyłać dokumentów tożsamości ani całości dowodów. Kancelaria nie obiecuje terminu odpowiedzi i nie potwierdza spotkania za pośrednictwem tej strony. Konsultacja odbywa się wyłącznie po angielsku, chińsku, japońsku i koreańsku.',
      sources: ['/pl/faq', '/pl/pricing'],
    },
    faq: {
      answer:
        'Ta część odpowiada na częste pytania na poziomie informacji ogólnych: sześć grup spraw, przygotowanie przed kontaktem, ustalanie kosztów i znaczenie wysłanej wiadomości. Wysłany wniosek czeka na rozpatrzenie przez adwokata; nie jest poradą prawną, nie jest terminem i nie tworzy stosunku między adwokatem a klientem. Konsultacja odbywa się wyłącznie po angielsku, chińsku, japońsku i koreańsku.',
      sources: ['/pl/contact', '/pl/services'],
    },
  },
  hi: {
    services: {
      answer:
        'कार्यालय ताइवान के विधि के अनुसार छह कार्य-समूहों का कार्य करता है: निवेश और कंपनी स्थापना, दीवानी विवाद और हर्जाना, विवाह, परिवार और उत्तराधिकार, श्रम, आपराधिक तथा बौद्धिक संपदा। प्रत्येक मामले का दायरा उस सामग्री की जाँच के बाद अलग से पुष्टि होता है जिसे आप भेजते हैं। परामर्श केवल अंग्रेज़ी, चीनी, जापानी और कोरियाई में होता है।',
      sources: ['/hi/faq', '/hi/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm ताइवान का एक कानून कार्यालय है, 2016 में National Taiwan University (國立臺灣大學) के स्नातकों द्वारा स्थापित, ताइपेई, काओश्युंग, ताइचुंग और पिंगतुंग में कार्यालयों के साथ। 2020 से लेखा विभाग है; ताइचुंग कार्यालय कोरिया और जापान से जुड़े मामलों का कार्य करता है। कार्यालय परिणाम का वादा नहीं करता। परामर्श केवल अंग्रेज़ी, चीनी, जापानी और कोरियाई में होता है।',
      sources: ['/hi/lawyers', '/hi/services'],
    },
    lawyers: {
      answer:
        'यह पृष्ठ Hovering के अधिवक्ताओं, संचालन प्रबंधन और सहभागी लेखा की प्रोफ़ाइलें दिखाता है। अधिवक्ता Wei Tseng (曾雋崴) ताइवान में अधिकृत हैं और कार्यालय की प्रबंध अधिवक्ता हैं; वह कोरिया, जापान और अन्य अंतरराष्ट्रीय मुवक्किलों के साथ कार्य करती हैं। परामर्श केवल अंग्रेज़ी, चीनी, जापानी और कोरियाई में होता है।',
      sources: ['/hi/about', '/hi/contact'],
    },
    pricing: {
      answer:
        'यह पृष्ठ मूल्य सूची प्रकाशित नहीं करता। पहले आपके भेजे सार से कार्य का दायरा तय होता है, फिर लागत की राशि और गणना का तरीका कार्य शुरू होने से पहले आपके साथ पुष्टि होता है। अधिवक्ता से बात शुल्क सहित हो सकती है; मानदेय के अतिरिक्त न्यायालय या प्राधिकरण की लागतें भी उठ सकती हैं। परामर्श केवल अंग्रेज़ी, चीनी, जापानी और कोरियाई में होता है।',
      sources: ['/hi/contact', '/hi/faq'],
    },
    contact: {
      answer:
        'संपर्क फ़ॉर्म से अपना सार भेजें: क्या हुआ, किस सहायता की आवश्यकता है, मामले का ताइवान से क्या संबंध है और यदि ज्ञात हो तो समयसीमा। आरंभ में पहचान पत्र या संपूर्ण प्रमाण भेजना आवश्यक नहीं। कार्यालय उत्तर की समयसीमा का वादा नहीं करता और इस पृष्ठ से नियुक्ति की पुष्टि नहीं करता। परामर्श केवल अंग्रेज़ी, चीनी, जापानी और कोरियाई में होता है।',
      sources: ['/hi/faq', '/hi/pricing'],
    },
    faq: {
      answer:
        'यह भाग सामान्य जानकारी के स्तर पर बार-बार पूछे जाने वाले प्रश्नों का उत्तर देता है: छह कार्य-समूह, संपर्क से पहले तैयारी, लागत तय होने का तरीका और भेजे गए संदेश का अर्थ। भेजा गया अनुरोध अधिवक्ता की जाँच की प्रतीक्षा करता है; यह कानूनी राय नहीं है, नियुक्ति नहीं है और अधिवक्ता तथा मुवक्किल के बीच संबंध नहीं बनाता। परामर्श केवल अंग्रेज़ी, चीनी, जापानी और कोरियाई में होता है।',
      sources: ['/hi/contact', '/hi/services'],
    },
  },
  sv: {
    services: {
      answer:
        'Byrån behandlar sex arbetsgrupper enligt Taiwans rätt: investering och bolagsbildning, civilrättsliga tvister och skadestånd, äktenskap, familj och arv, arbete, straffrätt samt immaterialrätt. Omfattningen av varje ärende bekräftas separat efter att en advokat har granskat det innehåll ni skickar. Rådgivningen sker endast på engelska, kinesiska, japanska och koreanska.',
      sources: ['/sv/faq', '/sv/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm är en advokatbyrå i Taiwan, grundad 2016 av utexaminerade från National Taiwan University (國立臺灣大學), med kontor i Taipei, Kaohsiung, Taichung och Pingtung. Sedan 2020 finns en redovisningsavdelning; kontoret i Taichung behandlar ärenden med anknytning till Korea och Japan. Byrån lovar inget resultat. Rådgivningen sker endast på engelska, kinesiska, japanska och koreanska.',
      sources: ['/sv/lawyers', '/sv/services'],
    },
    lawyers: {
      answer:
        'Denna sida visar profiler för Hoverings advokater, operativa ledning och anknutna revision. Advokat Wei Tseng (曾雋崴) är behörig i Taiwan och är byråns ledande advokat; hon arbetar med klienter från Korea, Japan och andra internationella klienter. Rådgivningen sker endast på engelska, kinesiska, japanska och koreanska.',
      sources: ['/sv/about', '/sv/contact'],
    },
    pricing: {
      answer:
        'Denna sida publicerar ingen prislista. Först fastställs arbetets omfattning utifrån sammanfattningen ni skickar, därefter bekräftas belopp och beräkningssätt med er innan arbetet börjar. Samtalet med en advokat kan vara mot betalning; utöver arvodet kan rättegångs- eller myndighetskostnader uppstå. Rådgivningen sker endast på engelska, kinesiska, japanska och koreanska.',
      sources: ['/sv/contact', '/sv/faq'],
    },
    contact: {
      answer:
        'Skicka er sammanfattning via kontaktformuläret: vad som har hänt, vilket stöd ni behöver, vilket samband ärendet har med Taiwan och fristen, om ni känner till den. I det första steget behöver ni ännu inte skicka identitetshandlingar eller hela bevisningen. Byrån lovar ingen svarstid och bekräftar ingen tid via denna sida. Rådgivningen sker endast på engelska, kinesiska, japanska och koreanska.',
      sources: ['/sv/faq', '/sv/pricing'],
    },
    faq: {
      answer:
        'Denna del besvarar vanliga frågor på nivån allmän information: de sex arbetsgrupperna, förberedelsen före kontakten, hur kostnaderna fastställs och vad ett skickat meddelande betyder. En skickad begäran väntar på en advokats granskning; den är inte ett juridiskt yttrande, inte en tid och skapar inte ett förhållande mellan advokat och klient. Rådgivningen sker endast på engelska, kinesiska, japanska och koreanska.',
      sources: ['/sv/contact', '/sv/services'],
    },
  },
  da: {
    services: {
      answer:
        'Kontoret behandler seks arbejdsgrupper efter Taiwans ret: investering og selskabsstiftelse, civile tvister og erstatning, ægteskab, familie og arv, arbejde, strafferet samt immaterialret. Omfanget af hver sag bekræftes separat, efter at en advokat har gennemgået det indhold, De sender. Rådgivningen foregår kun på engelsk, kinesisk, japansk og koreansk.',
      sources: ['/da/faq', '/da/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm er et advokatkontor i Taiwan, grundlagt i 2016 af dimittender fra National Taiwan University (國立臺灣大學), med kontorer i Taipei, Kaohsiung, Taichung og Pingtung. Siden 2020 findes en regnskabsafdeling; kontoret i Taichung behandler sager med tilknytning til Korea og Japan. Kontoret lover intet resultat. Rådgivningen foregår kun på engelsk, kinesisk, japansk og koreansk.',
      sources: ['/da/lawyers', '/da/services'],
    },
    lawyers: {
      answer:
        'Denne side viser profiler for Hoverings advokater, operative ledelse og tilknyttede revision. Advokat Wei Tseng (曾雋崴) er berettiget i Taiwan og er kontorets ledende advokat; hun arbejder med klienter fra Korea, Japan og andre internationale klienter. Rådgivningen foregår kun på engelsk, kinesisk, japansk og koreansk.',
      sources: ['/da/about', '/da/contact'],
    },
    pricing: {
      answer:
        'Denne side offentliggør ingen prisliste. Først fastlægges arbejdets omfang ud fra det resumé, De sender, derefter bekræftes beløb og beregningsmåde med Dem, før arbejdet begynder. Samtalen med en advokat kan være mod betaling; ud over honoraret kan rets- eller myndighedsomkostninger opstå. Rådgivningen foregår kun på engelsk, kinesisk, japansk og koreansk.',
      sources: ['/da/contact', '/da/faq'],
    },
    contact: {
      answer:
        'Send Deres resumé via kontaktformularen: hvad der er sket, hvilken hjælp De har brug for, hvilken forbindelse sagen har med Taiwan, og fristen, hvis De kender den. I det første trin behøver De endnu ikke sende identitetsdokumenter eller hele beviset. Kontoret lover ingen svartid og bekræfter ingen tid via denne side. Rådgivningen foregår kun på engelsk, kinesisk, japansk og koreansk.',
      sources: ['/da/faq', '/da/pricing'],
    },
    faq: {
      answer:
        'Denne del besvarer hyppige spørgsmål på niveauet almindelig information: de seks arbejdsgrupper, forberedelsen før kontakten, hvordan omkostningerne fastlægges, og hvad en sendt meddelelse betyder. En sendt anmodning venter på en advokats gennemgang; den er ikke en juridisk udtalelse, ikke en tid og skaber ikke et forhold mellem advokat og klient. Rådgivningen foregår kun på engelsk, kinesisk, japansk og koreansk.',
      sources: ['/da/contact', '/da/services'],
    },
  },
  nb: {
    services: {
      answer:
        'Kontoret behandler seks arbeidsgrupper etter Taiwans rett: investering og selskapsstiftelse, sivile tvister og erstatning, ekteskap, familie og arv, arbeid, strafferett samt immaterialrett. Omfanget av hver sak bekreftes separat etter at en advokat har gjennomgått innholdet De sender. Rådgivningen foregår bare på engelsk, kinesisk, japansk og koreansk.',
      sources: ['/nb/faq', '/nb/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm er et advokatkontor i Taiwan, grunnlagt i 2016 av uteksaminerte fra National Taiwan University (國立臺灣大學), med kontorer i Taipei, Kaohsiung, Taichung og Pingtung. Siden 2020 finnes en regnskapsavdeling; kontoret i Taichung behandler saker med tilknytning til Korea og Japan. Kontoret lover ikke et resultat. Rådgivningen foregår bare på engelsk, kinesisk, japansk og koreansk.',
      sources: ['/nb/lawyers', '/nb/services'],
    },
    lawyers: {
      answer:
        'Denne siden viser profiler for Hoverings advokater, operative ledelse og tilknyttede revisjon. Advokat Wei Tseng (曾雋崴) er berettiget i Taiwan og er kontorets ledende advokat; hun arbeider med klienter fra Korea, Japan og andre internasjonale klienter. Rådgivningen foregår bare på engelsk, kinesisk, japansk og koreansk.',
      sources: ['/nb/about', '/nb/contact'],
    },
    pricing: {
      answer:
        'Denne siden publiserer ingen prisliste. Først fastsettes arbeidets omfang ut fra sammendraget De sender, deretter bekreftes beløp og beregningsmåte med Dem før arbeidet begynner. Samtalen med en advokat kan være mot betaling; i tillegg til honoraret kan retts- eller myndighetskostnader oppstå. Rådgivningen foregår bare på engelsk, kinesisk, japansk og koreansk.',
      sources: ['/nb/contact', '/nb/faq'],
    },
    contact: {
      answer:
        'Send Deres sammendrag via kontaktskjemaet: hva som har skjedd, hvilken hjelp De trenger, hvilken sammenheng saken har med Taiwan, og fristen hvis De kjenner den. I det første trinnet trenger De ennå ikke sende identitetsdokumenter eller hele beviset. Kontoret lover ingen svartid og bekrefter ingen time via denne siden. Rådgivningen foregår bare på engelsk, kinesisk, japansk og koreansk.',
      sources: ['/nb/faq', '/nb/pricing'],
    },
    faq: {
      answer:
        'Denne delen besvarer vanlige spørsmål på nivået alminnelig informasjon: de seks arbeidsgruppene, forberedelsen før kontakten, hvordan kostnadene fastsettes, og hva en sendt melding betyr. En sendt forespørsel venter på en advokats gjennomgang; den er ikke en juridisk uttalelse, ikke en time og skaper ikke et forhold mellom advokat og klient. Rådgivningen foregår bare på engelsk, kinesisk, japansk og koreansk.',
      sources: ['/nb/contact', '/nb/services'],
    },
  },
  fi: {
    services: {
      answer:
        'Toimisto käsittelee kuutta työryhmää Taiwanin oikeuden mukaan: investointi ja yhtiön perustaminen, siviiliriidat ja vahingonkorvaus, avioliitto, perhe ja perintö, työ, rikosasiat sekä immateriaalioikeus. Kunkin asian laajuus vahvistetaan erikseen sen jälkeen, kun asianajaja on tarkastanut lähettämänne sisällön. Neuvonta tapahtuu vain englanniksi, kiinaksi, japaniksi ja koreaksi.',
      sources: ['/fi/faq', '/fi/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm on taiwanilainen asianajotoimisto, jonka National Taiwan Universityn (國立臺灣大學) valmistuneet perustivat vuonna 2016, toimistoilla Taipeissa, Kaohsiungissa, Taichungissa ja Pingtungissa. Vuodesta 2020 on kirjanpito-osasto; Taichungin toimisto käsittelee Korean ja Japanin yhteyden omaavia asioita. Toimisto ei lupaa tulosta. Neuvonta tapahtuu vain englanniksi, kiinaksi, japaniksi ja koreaksi.',
      sources: ['/fi/lawyers', '/fi/services'],
    },
    lawyers: {
      answer:
        'Tämä sivu näyttää Hoveringin asianajajien, operatiivisen johdon ja osakaskirjanpidon profiilit. Asianajaja Wei Tseng (曾雋崴) on kelpoinen Taiwanissa ja on toimiston johtava asianajaja; hän työskentelee päämiesten kanssa Koreasta, Japanista ja muiden kansainvälisten päämiesten kanssa. Neuvonta tapahtuu vain englanniksi, kiinaksi, japaniksi ja koreaksi.',
      sources: ['/fi/about', '/fi/contact'],
    },
    pricing: {
      answer:
        'Tämä sivu ei julkaise hinnastoa. Ensin työn laajuus vahvistetaan lähettämästänne yhteenvedosta, sen jälkeen määrä ja laskentatapa vahvistetaan kanssanne ennen työn alkamista. Keskustelu asianajajan kanssa voi olla maksullinen; palkkion lisäksi voi syntyä tuomioistuin- tai viranomaiskuluja. Neuvonta tapahtuu vain englanniksi, kiinaksi, japaniksi ja koreaksi.',
      sources: ['/fi/contact', '/fi/faq'],
    },
    contact: {
      answer:
        'Lähettäkää yhteenvedon yhteydenottolomakkeella: mitä on tapahtunut, millaista apua tarvitsette, mikä yhteys asialla on Taiwaniin, ja määräaika, jos tunnette sen. Ensimmäisessä vaiheessa ei vielä tarvitse lähettää henkilöllisyysasiakirjoja eikä koko näyttöä. Toimisto ei lupaa vastausaikaa eikä vahvista tapaamista tämän sivun kautta. Neuvonta tapahtuu vain englanniksi, kiinaksi, japaniksi ja koreaksi.',
      sources: ['/fi/faq', '/fi/pricing'],
    },
    faq: {
      answer:
        'Tämä osa vastaa usein kysyttyihin kysymyksiin yleisen tiedon tasolla: kuusi työryhmää, valmistelu ennen yhteydenottoa, kulujen vahvistaminen ja lähetetyn viestin merkitys. Lähetetty pyyntö odottaa asianajajan tarkastusta; se ei ole oikeudellinen lausunto, ei tapaaminen eikä synnytä suhdetta asianajajan ja päämiehen välillä. Neuvonta tapahtuu vain englanniksi, kiinaksi, japaniksi ja koreaksi.',
      sources: ['/fi/contact', '/fi/services'],
    },
  },
  cs: {
    services: {
      answer:
        'Kancelář vede šest skupin podle taiwanského práva: investice a zakládání společností, občanskoprávní spory a náhradu škody, manželství, rodinu a dědictví, práci, trestní věci a duševní vlastnictví. Rozsah každé věci se potvrzuje zvlášť poté, co advokátka nebo advokát posoudí zaslaný obsah. Porada probíhá pouze anglicky, čínsky, japonsky a korejsky.',
      sources: ['/cs/faq', '/cs/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm je taiwanská advokátní kancelář, kterou v roce 2016 založili absolventi National Taiwan University (國立臺灣大學), s pobočkami v Tchaj-peji, Kao-siungu, Tchaj-čungu a Pchingtungu. Od roku 2020 působí i účetní úsek; pobočka v Tchaj-čungu vede věci s vazbou na Koreu a Japonsko. Kancelář neslibuje výsledek. Porada probíhá pouze anglicky, čínsky, japonsky a korejsky.',
      sources: ['/cs/lawyers', '/cs/services'],
    },
    lawyers: {
      answer:
        'Tato stránka ukazuje profily advokátek a advokátů Hovering, provozního vedení a přidružené účetní revize. Advokátka Wei Tseng (曾雋崴) je oprávněna na Tchaj-wanu a je řídící advokátkou kanceláře; pracuje s klienty z Koreje, z Japonska a s dalšími mezinárodními klienty. Porada probíhá pouze anglicky, čínsky, japonsky a korejsky.',
      sources: ['/cs/about', '/cs/contact'],
    },
    pricing: {
      answer:
        'Tato stránka nezveřejňuje ceník. Nejprve se z Vašeho shrnutí potvrdí rozsah práce, poté se s Vámi potvrdí výše a způsob výpočtu, dříve než práce začne. Rozhovor s advokátkou nebo advokátem může být úplatný; vedle odměny mohou vzniknout soudní nebo správní poplatky. Porada probíhá pouze anglicky, čínsky, japonsky a korejsky.',
      sources: ['/cs/contact', '/cs/faq'],
    },
    contact: {
      answer:
        'Zašlete shrnutí kontaktním formulářem: co se stalo, jakou pomoc potřebujete, jakou vazbu má věc na Tchaj-wan a lhůtu, znáte-li ji. V počáteční fázi zatím není třeba zasílat doklady totožnosti ani celý důkazní materiál. Kancelář neslibuje lhůtu k odpovědi a nepotvrzuje schůzku prostřednictvím této stránky. Porada probíhá pouze anglicky, čínsky, japonsky a korejsky.',
      sources: ['/cs/faq', '/cs/pricing'],
    },
    faq: {
      answer:
        'Tato část odpovídá na časté otázky na úrovni obecných informací: šest skupin práce, příprava před kontaktem, potvrzení nákladů a význam odeslané zprávy. Odeslaná zpráva čeká na posouzení a není poradou ani potvrzenou schůzkou. Porada probíhá pouze anglicky, čínsky, japonsky a korejsky.',
      sources: ['/cs/services', '/cs/contact'],
    },
  },
  hu: {
    services: {
      answer:
        'Az iroda hat csoportot visz a tajvani jog szerint: befektetés és cégalapítás, polgári jogi jogviták és kártérítés, házasság, család és öröklés, munkaügy, büntetőügyek és szellemi tulajdon. Az egyes ügyek terjedelmét külön erősítjük meg azt követően, hogy egy ügyvéd megvizsgálta a beküldött tartalmat. A tanácsadás kizárólag angolul, kínaiul, japánul és koreaiul zajlik.',
      sources: ['/hu/faq', '/hu/contact'],
    },
    about: {
      answer:
        'A Hovering International Law Firm tajvani ügyvédi iroda, amelyet 2016-ban a National Taiwan University (國立臺灣大學) végzettjei alapítottak, irodákkal Tajpejben, Kaohsiungban, Taicsungban és Pingtungban. 2020 óta könyvviteli részleg is működik; a taicsungi iroda koreai és japán kötődésű ügyeket visz. Az iroda nem ígér eredményt. A tanácsadás kizárólag angolul, kínaiul, japánul és koreaiul zajlik.',
      sources: ['/hu/lawyers', '/hu/services'],
    },
    lawyers: {
      answer:
        'Ez az oldal a Hovering ügyvédeinek, működési vezetésének és társult könyvvizsgálatának profiljait mutatja. Wei Tseng ügyvéd (曾雋崴) Tajvanon jogosult, és az iroda vezető ügyvédje; koreai, japán és további nemzetközi ügyfelekkel dolgozik. A tanácsadás kizárólag angolul, kínaiul, japánul és koreaiul zajlik.',
      sources: ['/hu/about', '/hu/contact'],
    },
    pricing: {
      answer:
        'Ez az oldal nem tesz közzé árlistát. Előbb az összefoglalóból rögzítjük a munka terjedelmét, majd az összeget és a számítás módját erősítjük meg Önnel, a munka megkezdése előtt. Az ügyvéddel folytatott beszélgetés díjköteles lehet; a munkadíjon felül bírósági vagy hatósági költségek merülhetnek fel. A tanácsadás kizárólag angolul, kínaiul, japánul és koreaiul zajlik.',
      sources: ['/hu/contact', '/hu/faq'],
    },
    contact: {
      answer:
        'Küldjön összefoglalót a kapcsolatfelvételi űrlapon: mi történt, milyen segítségre van szüksége, milyen kötődése van az ügynek Tajvanhoz, és a határidő, ha ismeri. A kezdeti szakaszban még nem kell személyazonosító okmányokat vagy a teljes bizonyítékanyagot beküldeni. Az iroda nem ígér válaszadási határidőt, és nem erősít meg időpontot ezen az oldalon keresztül. A tanácsadás kizárólag angolul, kínaiul, japánul és koreaiul zajlik.',
      sources: ['/hu/faq', '/hu/pricing'],
    },
    faq: {
      answer:
        'Ez a rész gyakori kérdésekre válaszol általános tájékoztatás szintjén: a hat ügycsoport, a kapcsolatfelvétel előtti előkészület, a költségek megerősítése és az elküldött üzenet jelentése. Az elküldött üzenet vizsgálatra vár, és nem tanácsadás, nem is megerősített időpont. A tanácsadás kizárólag angolul, kínaiul, japánul és koreaiul zajlik.',
      sources: ['/hu/services', '/hu/contact'],
    },
  },
  ro: {
    services: {
      answer:
        'Cabinetul vede șase grupe potrivit dreptului taiwanez: investiții și înființare de societăți, litigii civile și despăgubiri, căsătorie, familie și succesiuni, muncă, cauze penale și proprietate intelectuală. Întinderea fiecărei cauze se confirmă separat, după ce o avocată sau un avocat a examinat conținutul trimis. Consultanța se desfășoară numai în engleză, chineză, japoneză și coreeană.',
      sources: ['/ro/faq', '/ro/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm este un cabinet de avocatură taiwanez, înființat în 2016 de absolvenți ai National Taiwan University (國立臺灣大學), cu birouri în Taipei, Kaohsiung, Taichung și Pingtung. Din 2020 există și o secțiune de contabilitate; biroul din Taichung tratează cauze cu legătură cu Coreea și Japonia. Cabinetul nu promite un rezultat. Consultanța se desfășoară numai în engleză, chineză, japoneză și coreeană.',
      sources: ['/ro/lawyers', '/ro/services'],
    },
    lawyers: {
      answer:
        'Această pagină arată profilurile avocatelor și avocaților Hovering, ale conducerii operative și ale revizuirii contabile asociate. Avocata Wei Tseng (曾雋崴) este autorizată în Taiwan și este avocata coordonatoare a cabinetului; lucrează cu clienți din Coreea, din Japonia și cu alți clienți internaționali. Consultanța se desfășoară numai în engleză, chineză, japoneză și coreeană.',
      sources: ['/ro/about', '/ro/contact'],
    },
    pricing: {
      answer:
        'Această pagină nu publică o listă de prețuri. Mai întâi se confirmă întinderea lucrării din rezumatul dumneavoastră, apoi cuantumul și modul de calcul se confirmă cu dumneavoastră înainte ca lucrarea să înceapă. Discuția cu o avocată sau un avocat poate fi cu plată; pe lângă onorariu pot apărea taxe de instanță sau ale autorităților. Consultanța se desfășoară numai în engleză, chineză, japoneză și coreeană.',
      sources: ['/ro/contact', '/ro/faq'],
    },
    contact: {
      answer:
        'Trimiteți un rezumat prin formularul de contact: ce s-a întâmplat, de ce ajutor aveți nevoie, ce legătură are cauza cu Taiwanul și termenul, dacă îl cunoașteți. În faza inițială nu trebuie trimise încă acte de identitate sau întregul material probator. Cabinetul nu promite un termen de răspuns și nu confirmă o programare prin această pagină. Consultanța se desfășoară numai în engleză, chineză, japoneză și coreeană.',
      sources: ['/ro/faq', '/ro/pricing'],
    },
    faq: {
      answer:
        'Această parte răspunde la întrebări frecvente la nivel de informații generale: cele șase grupe de lucrări, pregătirea înainte de contactare, confirmarea costurilor și înțelesul unui mesaj trimis. Un mesaj trimis așteaptă examinarea și nu este consultanță și nici programare confirmată. Consultanța se desfășoară numai în engleză, chineză, japoneză și coreeană.',
      sources: ['/ro/services', '/ro/contact'],
    },
  },
  uk: {
    services: {
      answer:
        'Фірма веде шість груп за правом Тайваню: інвестиції та створення товариств, цивільні спори та відшкодування шкоди, шлюб, сім’я та спадкування, праця, кримінальні справи та інтелектуальна власність. Обсяг кожної справи підтверджують окремо після того, як адвокат розгляне надісланий зміст. Консультація відбувається лише англійською, китайською, японською та корейською.',
      sources: ['/uk/faq', '/uk/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm — тайванська адвокатська фірма, заснована 2016 року випускниками National Taiwan University (國立臺灣大學), з офісами в Тайбеї, Гаосюні, Тайчжуні та Піндуні. Від 2020 року діє й бухгалтерський відділ; офіс у Тайчжуні веде справи з вазкою на Корею та Японію. Фірма не обіцяє результату. Консультація відбувається лише англійською, китайською, японською та корейською.',
      sources: ['/uk/lawyers', '/uk/services'],
    },
    lawyers: {
      answer:
        'Ця сторінка показує профілі адвокатів Hovering, операційного керівництва та партнерської бухгалтерії. Адвокат Wei Tseng (曾雋崴) уповноважена на Тайвані та є керівним адвокатом фірми; вона працює з клієнтами з Кореї, Японії та іншими міжнародними клієнтами. Консультація відбувається лише англійською, китайською, японською та корейською.',
      sources: ['/uk/about', '/uk/contact'],
    },
    pricing: {
      answer:
        'Ця сторінка не оприлюднює переліку цін. Спершу з Вашого викладу підтверджують обсяг роботи, потім розмір і спосіб обчислення підтверджують із Вами до початку роботи. Розмова з адвокатом може бути платною; крім гонорару можуть виникнути судові або адміністративні збори. Консультація відбувається лише англійською, китайською, японською та корейською.',
      sources: ['/uk/contact', '/uk/faq'],
    },
    contact: {
      answer:
        'Надішліть виклад через форму звернення: що сталося, якої допомоги потребуєте, який зв’язок справа має з Тайванем, і строк, якщо Ви його знаєте. На початковому етапі ще не потрібно надсилати документи, що посвідчують особу, чи весь доказовий матеріал. Фірма не обіцяє строку відповіді та не підтверджує зустріч через цю сторінку. Консультація відбувається лише англійською, китайською, японською та корейською.',
      sources: ['/uk/faq', '/uk/pricing'],
    },
    faq: {
      answer:
        'Ця частина відповідає на часті питання на рівні загальних відомостей: шість груп роботи, підготовка перед зверненням, підтвердження витрат і значення надісланого повідомлення. Надіслане повідомлення очікує розгляду й не є консультацією чи підтвердженою зустріччю. Консультація відбувається лише англійською, китайською, японською та корейською.',
      sources: ['/uk/services', '/uk/contact'],
    },
  },
  el: {
    services: {
      answer:
        'Το γραφείο χειρίζεται έξι ομάδες κατά το δίκαιο της Ταϊβάν: επενδύσεις και σύσταση εταιρειών, αστικές διαφορές και αποζημίωση, γάμο, οικογένεια και κληρονομικά, εργασία, ποινικές υποθέσεις και διανοητική ιδιοκτησία. Το εύρος κάθε υπόθεσης επιβεβαιώνεται χωριστά, αφού δικηγόρος εξετάσει το περιεχόμενο που στείλατε. Η συμβουλευτική διεξάγεται μόνο στα αγγλικά, κινεζικά, ιαπωνικά και κορεατικά.',
      sources: ['/el/faq', '/el/contact'],
    },
    about: {
      answer:
        'Η Hovering International Law Firm είναι ταϊβανέζικο δικηγορικό γραφείο, που ιδρύθηκε το 2016 από αποφοίτους του National Taiwan University (國立臺灣大學), με γραφεία στην Ταϊπέι, το Καοσιούνγκ, το Ταϊτσούνγκ και το Πινγκτούνγκ. Από το 2020 λειτουργεί και λογιστικό τμήμα· το γραφείο στο Ταϊτσούνγκ χειρίζεται υποθέσεις με δεσμό προς την Κορέα και την Ιαπωνία. Το γραφείο δεν υπόσχεται αποτέλεσμα. Η συμβουλευτική διεξάγεται μόνο στα αγγλικά, κινεζικά, ιαπωνικά και κορεατικά.',
      sources: ['/el/lawyers', '/el/services'],
    },
    lawyers: {
      answer:
        'Η σελίδα αυτή δείχνει τα προφίλ των δικηγόρων της Hovering, της λειτουργικής διεύθυνσης και του συνεργαζόμενου λογιστικού ελέγχου. Η δικηγόρος Wei Tseng (曾雋崴) έχει άδεια στην Ταϊβάν και είναι η διευθύνουσα δικηγόρος του γραφείου· συνεργάζεται με εντολείς από την Κορέα, την Ιαπωνία και άλλους διεθνείς εντολείς. Η συμβουλευτική διεξάγεται μόνο στα αγγλικά, κινεζικά, ιαπωνικά και κορεατικά.',
      sources: ['/el/about', '/el/contact'],
    },
    pricing: {
      answer:
        'Η σελίδα αυτή δεν δημοσιεύει τιμοκατάλογο. Πρώτα επιβεβαιώνεται το εύρος της εργασίας από την περίληψή σας, έπειτα το ύψος και ο τρόπος υπολογισμού επιβεβαιώνονται μαζί σας πριν αρχίσει η εργασία. Η συζήτηση με δικηγόρο μπορεί να είναι με αμοιβή· πέρα από την αμοιβή μπορεί να προκύψουν δικαστικά τέλη ή έξοδα αρχών. Η συμβουλευτική διεξάγεται μόνο στα αγγλικά, κινεζικά, ιαπωνικά και κορεατικά.',
      sources: ['/el/contact', '/el/faq'],
    },
    contact: {
      answer:
        'Στείλτε περίληψη με τη φόρμα επικοινωνίας: τι συνέβη, ποια βοήθεια χρειάζεστε, ποιον δεσμό έχει η υπόθεση με την Ταϊβάν και την προθεσμία, αν τη γνωρίζετε. Στο αρχικό στάδιο δεν χρειάζεται ακόμη να σταλούν έγγραφα ταυτότητας ή το σύνολο των αποδεικτικών στοιχείων. Το γραφείο δεν υπόσχεται προθεσμία απάντησης και δεν επιβεβαιώνει ραντεβού μέσω αυτής της σελίδας. Η συμβουλευτική διεξάγεται μόνο στα αγγλικά, κινεζικά, ιαπωνικά και κορεατικά.',
      sources: ['/el/faq', '/el/pricing'],
    },
    faq: {
      answer:
        'Το μέρος αυτό απαντά σε συχνά ερωτήματα σε επίπεδο γενικών πληροφοριών: οι έξι ομάδες εργασιών, η προετοιμασία πριν την επικοινωνία, η επιβεβαίωση του κόστους και η σημασία ενός μηνύματος που έχει σταλεί. Ένα μήνυμα που έχει σταλεί αναμένει εξέταση και δεν είναι συμβουλευτική ούτε επιβεβαιωμένο ραντεβού. Η συμβουλευτική διεξάγεται μόνο στα αγγλικά, κινεζικά, ιαπωνικά και κορεατικά.',
      sources: ['/el/services', '/el/contact'],
    },
  },
  he: {
    services: {
      answer:
        'המשרד מטפל בשש קבוצות לפי דין טאיוואן: השקעה והקמת חברות, סכסוכים אזרחיים ופיצויים, נישואין, משפחה וירושה, עבודה, עניינים פליליים וקניין רוחני. היקף כל עניין מאושר בנפרד לאחר שעורכת דין או עורך דין בדקו את התוכן שנשלח. הייעוץ מתקיים רק באנגלית, בסינית, ביפנית ובקוריאנית.',
      sources: ['/he/faq', '/he/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm הוא משרד עורכי דין טאיוואני, שנוסד בשנת 2016 בידי בוגרי National Taiwan University (國立臺灣大學), ולו סניפים בטאיפיי, בקאוסיונג, בטאיצ׳ונג ובפינגטונג. משנת 2020 פועלת גם מחלקת הנהלת חשבונות; הסניף בטאיצ׳ונג מטפל בעניינים בעלי זיקה לקוריאה וליפן. המשרד אינו מבטיח תוצאה. הייעוץ מתקיים רק באנגלית, בסינית, ביפנית ובקוריאנית.',
      sources: ['/he/lawyers', '/he/services'],
    },
    lawyers: {
      answer:
        'עמוד זה מציג את הפרופילים של עורכות ועורכי הדין של Hovering, של ההנהלה התפעולית ושל ביקורת החשבונות השותפה. עורכת הדין Wei Tseng (曾雋崴) מוסמכת בטאיוואן והיא עורכת הדין המנהלת של המשרד; היא עובדת עם לקוחות מקוריאה, מיפן ועם לקוחות בין־לאומיים נוספים. הייעוץ מתקיים רק באנגלית, בסינית, ביפנית ובקוריאנית.',
      sources: ['/he/about', '/he/contact'],
    },
    pricing: {
      answer:
        'עמוד זה אינו מפרסם מחירון. תחילה מאושר היקף העבודה מתוך התקציר שלכם, ולאחר מכן הגובה ואופן החישוב מאושרים עמכם לפני שהעבודה מתחילה. שיחה עם עורכת דין או עורך דין עשויה להיות בתשלום; מלבד שכר הטרחה עשויות להיווצר אגרות בית משפט או הוצאות רשויות. הייעוץ מתקיים רק באנגלית, בסינית, ביפנית ובקוריאנית.',
      sources: ['/he/contact', '/he/faq'],
    },
    contact: {
      answer:
        'שלחו תקציר בטופס יצירת הקשר: מה קרה, לאיזו עזרה אתם זקוקים, מהי זיקת העניין לטאיוואן, והמועד אם הוא ידוע לכם. בשלב הראשון אין צורך לשלוח עדיין מסמכי זיהוי או את מכלול הראיות. המשרד אינו מבטיח מועד למענה ואינו מאשר פגישה דרך עמוד זה. הייעוץ מתקיים רק באנגלית, בסינית, ביפנית ובקוריאנית.',
      sources: ['/he/faq', '/he/pricing'],
    },
    faq: {
      answer:
        'חלק זה משיב על שאלות נפוצות ברמת מידע כללי: שש קבוצות העבודה, ההכנה לפני הפנייה, אישור העלויות ומשמעותה של הודעה שנשלחה. הודעה שנשלחה ממתינה לבדיקה ואינה ייעוץ ואף לא פגישה מאושרת. הייעוץ מתקיים רק באנגלית, בסינית, ביפנית ובקוריאנית.',
      sources: ['/he/services', '/he/contact'],
    },
  },
};

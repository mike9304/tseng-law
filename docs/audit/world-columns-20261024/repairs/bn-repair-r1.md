# bn repair round 1 (review: reviews/codex-bn-r1.md)

Checked 2026-10-24 with `python3 tools/law.py N0090027 51` and `python3 tools/law.py H0110001 23`. After the edits, `variety_metrics.py --lang hi` (proxy, bn unsupported) still shows no FAIL for 823 and 824 (823 cv 0.539, 824 cv 0.518); no bold added. FAQ and summary fields of 823 and 824 were checked and needed no change (neither mentions the research/teaching exemptions, the art. 23 trigger or the first-inquiry contents).

## 822

- S1 (Bengali idiom limit, all files): NOTED, no text change. Matches my work note: no native-speaker review has taken place and the articles do not claim one. The checker has no Bengali mode; I used `--lang hi` only as a proxy.

## 823

- M1 ACCEPTED. Statute (Regs 51(2)): 「外國留學生符合下列資格之一者，不受前項規定之限制：一、具語文專長，且有下列情形之一，並經教育部專案核准：（一）入學後於各大專校院附設語文中心或外國在華文教機構附設之語文中心兼任外國語文教師。（二）入學後協助各級學校語文專長相關教學活動。二、就讀研究所，並經就讀學校同意從事與修習課業有關之研究工作。」 The old sentence said only "language-expert student involved in language teaching" and dropped the after-enrolment timing, the institutions and the activities.
  - Old: "দ্বিতীয় দফা দুটি ক্ষেত্রে প্রথম দফার শর্ত থেকে ছাড় দেয়: শিক্ষা মন্ত্রণালয়ের বিশেষ অনুমোদন নিয়ে ভাষা-শিক্ষায় যুক্ত ভাষা-দক্ষ ছাত্র, আর স্কুলের সম্মতিতে পড়ার সঙ্গে সম্পর্কিত গবেষণার কাজ করা স্নাতকোত্তর ছাত্র।"
  - New: "দ্বিতীয় দফা প্রথম দফার শর্ত থেকে ছাড়ের দুটি পথ রেখেছে। একটি: ভাষাগত দক্ষতা আছে এমন ছাত্র ভর্তি হওয়ার পর কলেজ-বিশ্ববিদ্যালয়ের বা তাইওয়ানে বিদেশি সাংস্কৃতিক-শিক্ষা প্রতিষ্ঠানের সংযুক্ত ভাষাকেন্দ্রে খণ্ডকালীন বিদেশি ভাষার শিক্ষকতা করলে, অথবা বিভিন্ন স্তরের স্কুলে সংশ্লিষ্ট ভাষার শিক্ষাদানে সহায়তা করলে; দুই ক্ষেত্রেই শিক্ষা মন্ত্রণালয়ের বিশেষ অনুমোদন লাগে। অন্যটি: স্নাতকোত্তর ছাত্র স্কুলের সম্মতিতে পড়ার সঙ্গে সম্পর্কিত গবেষণার কাজ করলে।" (The research route is unchanged; the sentences after it, including the unconfirmed lab-stipend and scholarship notes, are untouched.)
- M2 ACCEPTED. Statute (Student Regs 23): 「外國學生有違反就業服務法之規定經查證屬實者，學校或相關主管機關應即依規定處理。」 The trigger is a verified violation of the Employment Service Act, not any "law" violation, and the duty is to handle it at once under the rules.
  - Old: "আইন লঙ্ঘন যাচাইয়ে প্রমাণিত হলে স্কুল বা সংশ্লিষ্ট কর্তৃপক্ষকে ব্যবস্থা নিতে হয়"
  - New: "কর্মসংস্থান সেবা আইন লঙ্ঘনের ঘটনা যাচাইয়ে প্রমাণিত হলে স্কুল বা সংশ্লিষ্ট কর্তৃপক্ষকে তৎক্ষণাৎ বিধি অনুযায়ী ব্যবস্থা নিতে হয়" (link to art. 23 unchanged).
- M3 ACCEPTED. The brief's first-inquiry list is a non-sensitive summary, the other party's name, the Taiwan connection and any deadline; a letter's date is not a deadline.
  - Old: "সংক্ষিপ্ত সারাংশে জানান আপনি ডিগ্রি না ভাষা-কোর্সের ছাত্র, নিয়োগকর্তার নাম (স্বার্থের সংঘাত যাচাইয়ের জন্য), কাজ শুরুর তারিখ আর কোনো চিঠি এসে থাকলে তার তারিখ।"
  - New: "প্রথম ইমেইলে সংবেদনশীল তথ্য ছাড়া ঘটনার সংক্ষিপ্ত সারাংশ, নিয়োগকর্তার নাম (স্বার্থের সংঘাত যাচাইয়ের জন্য), ঘটনার সঙ্গে তাইওয়ানের সম্পর্ক (যেমন আপনি ডিগ্রি না ভাষা-কোর্সের ছাত্র) এবং কোনো প্রযোজ্য সময়সীমা থাকলে তার তারিখ জানান।" The rest of the paragraph (no passport or ARC copies, no bank statements, no lawyer-client relationship from an email, language arrangement) is unchanged.

## 824

- S1 ACCEPTED (small, and it matches Civil Code 310(2): 「受領人係債權之準占有人者，以債務人不知其非債權人者為限，有清償之效力」).
  - Old: "...হলে এবং দেনাদার তাকে পাওনাদার নয় বলে জানতেন না হলে শোধ কার্যকর;"
  - New: "...হলে এবং দেনাদার যদি না জানতেন যে গ্রহীতা প্রকৃত পাওনাদার নন, তাহলে শোধ কার্যকর;" The quasi-possession requirement and the art. 966 definition that follow are unchanged.

No item was rebutted.

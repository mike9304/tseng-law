import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/** Column image captions carry only the locale's short fictional-scene label; alt text stays descriptive. */
const LABEL: Record<string, string> = {
  'ko': '가상의 장면',
  'zh': '虛構情境',
  'ja': '架空の情景',
  'en': 'Fictional scene',
  'es': 'Escena ficticia',
  'vi': 'Cảnh hư cấu',
  'fr': 'Scène fictive',
  'id': 'Adegan fiksi',
  'th': 'ภาพฉากสมมติ',
  'de': 'Fiktive Szene',
  'it': 'Scena immaginaria',
  'pt': 'Cena fictícia',
  'nl': 'Fictieve scène',
  'pl': 'Scena fikcyjna',
  'ru': 'Вымышленная сцена',
  'uk': 'Вигадана сцена',
  'el': 'Φανταστική σκηνή',
  'sv': 'Fiktiv scen',
  'da': 'Fiktiv scene',
  'nb': 'Oppdiktet scene',
  'fi': 'Kuvitteellinen kohtaus',
  'cs': 'Smyšlená scéna',
  'hu': 'Kitalált jelenet',
  'ro': 'Scenă fictivă',
  'sk': 'Vymyslená scéna',
  'bg': 'Измислена сцена',
  'hr': 'Izmišljena scena',
  'sr': 'Izmišljeni prizor',
  'sl': 'Izmišljen prizor',
  'lt': 'Išgalvota scena',
  'lv': 'Izdomāta aina',
  'et': 'Väljamõeldud stseen',
  'ca': 'Escena fictícia',
  'is': 'Skálduð mynd',
  'ar': 'مشهد متخيَّل',
  'hi': 'काल्पनिक दृश्य',
  'fil': 'Kathang-isip na eksena',
  'ms': 'Adegan rekaan',
  'zh-hans': '虚构情境',
  'km': 'ឈុតឆាកប្រឌិត',
  'ne': 'काल्पनिक दृश्य',
  'bn': 'কাল্পনিক দৃশ্য',
  'ur': 'فرضی منظر',
  'fa': 'صحنه خیالی',
  'ta': 'கற்பனைக் காட்சி',
  'he': 'סצנה בדיונית',
  'tr': 'Kurgusal sahne',
  'mn': 'Зохиомол дүр зураг',
  'my': 'စိတ်ကူးယဉ် မြင်ကွင်း',
};

const root = path.join(process.cwd(), 'src/content');
const files = fs.readdirSync(root)
  .filter((dir) => dir === 'columns' || dir.startsWith('columns-'))
  .flatMap((dir) => fs.readdirSync(path.join(root, dir)).filter((f) => f.endsWith('.md'))
    .map((f) => ({ locale: dir === 'columns' ? 'ko' : dir.slice(8), file: path.join(dir, f) })));

describe('column image caption label', () => {
  it('every caption is the locale fictional-scene label', () => {
    const bad: string[] = [];
    for (const { locale, file } of files) {
      const head = fs.readFileSync(path.join(root, file), 'utf8').split('\n---')[0];
      const m = head.match(/^featured_image_caption: "(.*)"$/m);
      if (m && m[1] !== LABEL[locale]) bad.push(`${file}: ${m[1]}`);
    }
    expect(bad).toEqual([]);
  });
});

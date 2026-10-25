"""Literal neutral expectations, set without reading new7 target manuscripts.

No checker imports. LT reuses a separately reviewed neutral research fixture.
Other examples are AI-authored orthographic probes, not native approval.
"""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]


def row(sentences, words, sources, not_sources, contrast, caveat, hypothetical, formula, citation, url):
    return dict(sentences=[[' '.join(s.split(' | ')), s.split(' | ')] for s in sentences],
                words=words, sources=sources, not_sources=not_sources, contrast=contrast,
                caveat=caveat, hypothetical=hypothetical, formula=formula, citation=citation, url=url)


data = {}
data['km'] = row([
    'សៀវភៅនៅលើតុ។ | ប៊ិចនៅក្នុងប្រអប់។',
    'សិស្សអានសៀវភៅ៕ | គ្រូបិទទ្វារ។',
    'មានសម្ភារៈ៖ សៀវភៅ ប៊ិច និងក្រដាស។ | ប្រអប់នៅលើតុ។',
    'សៀវភៅថ្មីៗនៅលើតុ។ | សិស្សចូលបន្ទប់។',
    'គ្រូមកនៅម៉ោង 9:30។ | ការបង្រៀនចាប់ផ្តើម។',
    'តម្លៃគឺ ៣,៥ ដុល្លារ។ | សិស្សកត់ត្រា។',
    'លេខគឺ 3.5។ | តារាងនៅលើក្តារ។',
    'Dr. Smith អានសៀវភៅ។ | គ្រូសរសេរលើក្តារ។',
    'សៀវភៅ ប៊ិច ។ល។',
    'សៀវភៅ ប៊ិច ។ល។, ទាំងអស់នៅលើតុ។ | ប្រអប់ទទេ។',
    'សៀវភៅ ប៊ិច ៘ នៅលើតុ។ | ប្រអប់ទទេ។',
    '«សូមអានសៀវភៅ!» គាត់បាននិយាយ។ | សិស្សបើកសៀវភៅ។',
    '«សូមអានសៀវភៅ!» | សិស្សបើកសៀវភៅ។',
], [
    ['សៀវភៅ ខ្មៅ ១២', ['សៀវភៅ', 'ខ្មៅ', '១២']],
    ['សៀវភៅខ្មៅ', ['សៀវភៅ', 'ខ្មៅ']],
    ['សៀវភៅ\u200bខ្មៅ', ['សៀវភៅ', 'ខ្មៅ']],
    ['សៀវភៅប៊ិច ៣,៥ 9:30', ['សៀវភៅ', 'ប៊ិច', '៣,៥', '9', '30']],
    ['សៀវភៅៗ', ['សៀវភៅ', 'ៗ']],
], ['## ប្រភព', '### ប្រភពផ្លូវការ:'], ['## ប្រភពនៃការយល់ច្រឡំ', 'ប្រភព'],
    [['នេះមិនមែនជាប៊ិចទេ ប៉ុន្តែជាខ្មៅដៃ។', 1], ['នេះមិនមែនជាប៊ិចទេ។', 0],
     ['នេះមិនត្រឹមតែជាប៊ិចទេ ប៉ុន្តែជាឧបករណ៍គូរផងដែរ។', 0], ['នេះមិនមែនជាប៊ិចទេ។ ប៉ុន្តែមានសៀវភៅ។', 0]],
    'ទោះយ៉ាងណា ប្រអប់បើក។', 'ឧបមាថា ប្រអប់មានពណ៌ក្រហម។', 'នេះជាព័ត៌មានទូទៅ។',
    'អត្ថបទយោងមាត្រា 7។', ['អាសយដ្ឋាន https://example.test/a?x=1។ប្រអប់បើក។', ['អាសយដ្ឋាន ។', 'ប្រអប់បើក។']])
data['km']['sentences'].append(['សៀវភៅនៅលើតុ។ប៊ិចនៅក្នុងប្រអប់។', ['សៀវភៅនៅលើតុ។', 'ប៊ិចនៅក្នុងប្រអប់។']])
data['km']['unavailable'] = ['សៀវភៅ ប៊ិច ។ល។ សិស្សអាន។', 'សៀវភៅ ។បេ។ នៅលើតុ។']

data['mn'] = row([
    'Ном ширээн дээр байна. | Хайрцаг нээлттэй байна.',
    'Багш Д. Баттай уулзав. | Хичээл эхлэв.',
    'Д.Бат ном уншив. | Сурагч бичив.',
    'Жишээ нь 3.5 гэсэн тоо байна. | Дараа нь 7 гарна.',
    'Сургалт 9:30 цагт эхэлнэ. | Хаалга нээгдэв.',
    'Сурагч 2-р бүлгийг уншив. | Дараагийн бүлэг урт.',
    'Дүрмийн 7.2 дахь хэсгийг уншив. | Дасгал эхэллээ.',
    '«Номоо унш!» гэж багш хэлэв. | Сурагч номоо нээв.',
    '«Номоо унш!» | Сурагч номоо нээв.',
    'Тооны хариу 12. | Дараагийн бодлого урт.',
], [['Өрөө ном 3.5 2-р', ['Өрөө', 'ном', '3.5', '2', 'р']], ['Багшийн үйл ажиллагаа', ['Багшийн', 'үйл', 'ажиллагаа']]],
    ['## Эх сурвалж', '### Албан ёсны эх сурвалжууд:'], ['## Эх сурвалжийг хэрхэн унших вэ', 'Эх сурвалж'],
    [['Энэ нь ном биш, харин дэвтэр юм.', 1], ['Энэ нь ном биш.', 0], ['Энэ нь зөвхөн ном биш, харин зурагтай ном юм.', 0], ['Энэ нь ном биш. Харин өрөө нээлттэй.', 0]],
    'Гэсэн хэдий ч хайрцаг нээлттэй.', 'Жишээ нь хайрцаг улаан байна.', 'Энэ бол ерөнхий мэдээлэл.', 'Тайлбар 7 дугаар зүйлд байна.',
    ['Хаяг https://example.test/a?x=1. Хайрцаг нээлттэй.', ['Хаяг .', 'Хайрцаг нээлттэй.']])

data['sr'] = row([
    'Knjiga je na stolu. | Kutija je otvorena.',
    'Књига је на столу. | Кутија је отворена.',
    'Dr Marković čita knjigu. | Učenik piše.',
    'Prof. J. Petrović dolazi. | Čas počinje.',
    'Проф. Ј. Петровић долази. | Час почиње.',
    'Na 2. i 5. polici stoje knjige. | Vrata su zatvorena.',
    'У 2. и 5. реду су столице. | Врата су затворена.',
    'Pravila iz člana 7 važe danas. | Proverite str. 9.',
    'Čitamo II poglavlje. | Zatim sledi III poglavlje.',
    'Datum je 3. 6. 2019. i upisan je u svesku. | Rukopis je jasan.',
    'Godina je 2019. | Sutra nastavljamo.',
    'Broj je 12. | iPhone je na stolu.',
    'Tu su knjige, sveske itd. | Polica je puna.',
    'Ту су књиге, свеске итд. | Полица је пуна.',
    '„Čitaj!“, rekla je učiteljica. | Učenik je otvorio knjigu.',
    '„Čitaj!“ | Učenik je otvorio knjigu.',
], [['Četiri žute knjige 3,5', ['Četiri', 'žute', 'knjige', '3,5']], ['Четири жуте књиге 3,5', ['Четири', 'жуте', 'књиге', '3,5']], ['srpsko-engleski', ['srpsko', 'engleski']]],
    ['## Izvori', '### Zvanični izvori:', '## Извори', '## Званични извори'], ['## Izvori nesporazuma', 'Izvori', '## Извори забуне'],
    [['To nije knjiga, nego sveska.', 1], ['То није књига, већ свеска.', 1], ['To nije knjiga.', 0], ['To nije samo knjiga, nego i slika.', 0], ['То није само књига, већ и слика.', 0], ['To nije knjiga. Nego ovde počinje novo.', 0]],
    'Međutim, kutija je otvorena.', 'Pretpostavimo da je kutija crvena.', 'Ovo su opšte informacije.', 'Pravilo je u članu 7.',
    ['Adresa https://example.test/a?x=1. Kutija je otvorena.', ['Adresa .', 'Kutija je otvorena.']])

data['sl'] = row([
    'Knjiga je na mizi. | Škatla je odprta.',
    'Dr. Novak bere knjigo. | Učenec piše.',
    'Na 2. in 5. polici so knjige. | Vrata so zaprta.',
    'V II. in IV. poglavju so slike. | Dodatek je kratek.',
    'Bral je 2. popravljeno izdajo. | Zgodba je kratka.',
    'Prišli so 3. 6. 2019. leta. | Zapis je jasen.',
    'Prišli so 3. VI. 2019. | Naslednji dan so odšli.',
    'Rezultat je 12. | Naslednja naloga je daljša.',
    'Rezultat je 12. | iPhone je na mizi.',
    'Na mizi so knjige, zvezki itd. | Polica je prazna.',
    'Podatek je na str. 9. | Poglejte sliko.',
    '»Beri!« je rekla učiteljica. | Učenec je odprl knjigo.',
    '»Beri!« | Učenec je odprl knjigo.',
], [['Črna škatla 3,5 e-pošta', ['Črna', 'škatla', '3,5', 'e', 'pošta']]],
    ['## Viri', '### Uradni viri:'], ['## Viri nesporazumov', 'Viri'],
    [['To ni knjiga, temveč zvezek.', 1], ['To ni knjiga.', 0], ['To ni samo knjiga, temveč tudi slika.', 0], ['To ni knjiga. Temveč tukaj začnemo.', 0]],
    'Vendar je škatla odprta.', 'Predpostavimo, da je škatla rdeča.', 'To so splošne informacije.', 'Pravilo je v 7. členu.',
    ['Naslov https://example.test/a?x=1. Škatla je odprta.', ['Naslov .', 'Škatla je odprta.']])

ltpath = Path('/Users/son7/Projects/tseng-law-all-locales-20261025/docs/audit/market-expansion-20261025/work/variety-candidate/candidate/profiles/lt.json')
lt = json.loads(ltpath.read_text())
data['lt'] = dict(sentences=[[r['text'], r['sentences']] for r in lt['sentence_fixtures']],
    words=[[r['text'], r['tokens']] for r in lt['word_fixtures']],
    sources=lt['source_positive'], not_sources=lt['source_negative'],
    contrast=[[r[1], r[2]] for r in lt['rhetorical_fixtures'] if r[0] == 'contrast'] + [['Tai nėra knyga.', 0], ['Tai ne knyga. O čia prasideda naujas sakinys.', 0]],
    caveat='Tačiau dėžė atvira.', hypothetical='Tarkime, dėžė raudona.', formula='Tai bendro pobūdžio informacija.', citation='Taisyklė nurodyta 7 straipsnyje.',
    url=['Adresas https://example.test/a?x=1. Dėžė atvira.', ['Adresas .', 'Dėžė atvira.']])
data['lt']['sentences'] += [
    ['Pamoka prasideda 9 val. Mokytoja atidaro duris.', ['Pamoka prasideda 9 val.', 'Mokytoja atidaro duris.']],
    ['Žr. str. 7. Mokytoja skaito.', ['Žr. str. 7.', 'Mokytoja skaito.']],
    ['Nuoroda į 7 str. Mokytoja skaito.', ['Nuoroda į 7 str.', 'Mokytoja skaito.']],
]

data['lv'] = row([
    'Grāmata ir uz galda. | Kaste ir atvērta.',
    'Dr. Kalniņš lasa grāmatu. | Skolēns raksta.',
    '2. un 5. plauktā ir grāmatas. | Durvis ir aizvērtas.',
    'Skolēns lasa II nodaļu. | III nodaļa ir īsa.',
    'Datums ir 3. jūnijs. | Nākamā diena ir brīva.',
    'Sanāksme ir 03.06.2019. plkst. 9.30. | Durvis ir atvērtas.',
    'Rezultāts ir 12. | Nākamais uzdevums ir garš.',
    'Rezultāts ir 12. | iPhone ir uz galda.',
    'Tur ir grāmatas, burtnīcas u. c. | Plaukts ir pilns.',
    'Tur ir grāmatas utt. | Plaukts ir pilns.',
    'Teksts ir 9. lpp. | Attēls ir nākamajā lapā.',
    'Skatiet lpp. 9. | Tur ir attēls.',
    '„Lasi!” sacīja skolotāja. | Skolēns atvēra grāmatu.',
    '„Lasi!” | Skolēns atvēra grāmatu.',
], [['Četras zaļas grāmatas 3,5', ['Četras', 'zaļas', 'grāmatas', '3,5']], ['e-pasts', ['e', 'pasts']]],
    ['## Avoti', '### Oficiālie avoti:'], ['## Avoti un to nozīme', 'Avoti'],
    [['Tā nav grāmata, bet burtnīca.', 1], ['Tā nav grāmata.', 0], ['Tā nav tikai grāmata, bet arī attēls.', 0], ['Tā nav grāmata. Bet šeit ir galds.', 0]],
    'Tomēr kaste ir atvērta.', 'Pieņemsim, ka kaste ir sarkana.', 'Tā ir vispārīga informācija.', 'Noteikums ir 7. pantā.',
    ['Adrese https://example.test/a?x=1. Kaste ir atvērta.', ['Adrese .', 'Kaste ir atvērta.']])

data['et'] = row([
    'Raamat on laual. | Kast on lahti.',
    'Dr Tamm loeb raamatut. | Õpilane kirjutab.',
    '2. ja 5. riiulil on raamatud. | Uks on kinni.',
    'II peatükk on lühike. | III peatükk on pikem.',
    'Koosolek on 3. juunil. | Järgmine päev on vaba.',
    'Koosolek on 3. VI 2019. | Järgmisel päeval on kool kinni.',
    'Kuupäev on 03.06.2019. | Kirje on selge.',
    'Tulemus on 12. | Järgmine ülesanne on pikem.',
    'Tulemus on 12. | iPhone on laual.',
    'Laual on raamatud, vihikud jne. | Riiul on täis.',
    'Kehtib erand, s.t. teine reegel. | Loe lk 9.',
    '„Loe!” ütles õpetaja. | Õpilane avas raamatu.',
    '„Loe!” | Õpilane avas raamatu.',
], [['Õpilane loeb 3,5 e-kirja', ['Õpilane', 'loeb', '3,5', 'e', 'kirja']]],
    ['## Allikad', '### Ametlikud allikad:'], ['## Allikate kasutamine', 'Allikad'],
    [['See ei ole raamat, vaid vihik.', 1], ['See ei ole raamat.', 0], ['See ei ole ainult raamat, vaid ka pilt.', 0], ['See ei ole raamat. Vaid siin algab uus lause.', 0]],
    'Siiski on kast lahti.', 'Oletame, et kast on punane.', 'See on üldine teave.', 'Reegel on artiklis 7.',
    ['Aadress https://example.test/a?x=1. Kast on lahti.', ['Aadress .', 'Kast on lahti.']])

(ROOT / 'tests/fixtures-batch05.json').write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({k: len(v['sentences']) for k, v in data.items()}))

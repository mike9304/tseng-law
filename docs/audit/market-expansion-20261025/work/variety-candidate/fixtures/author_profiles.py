"""Manually specified neutral profiles/expectations, before candidate execution.

This file never imports or calls the measurement implementation. Examples are
invented stationery/office sentences, not target manuscripts or legal claims.
The implementing author is not the independent reviewer.
"""
from pathlib import Path
import datetime
import hashlib
import json
import unicodedata

ROOT = Path(__file__).resolve().parents[1]

def heading(names):
    return r'(?i:^#{1,6}[^\S\r\n]+(?:[0-9]+[.)][^\S\r\n]+)?(?:' + names + r')[^\S\r\n]*[:：]?(?:[^\S\r\n]+#+)?[^\S\r\n]*$)'

def sentence(*parts):
    return {'text': ' '.join(parts), 'sentences': list(parts)}

def words(text, *tokens):
    return {'text': text, 'tokens': list(tokens)}

PROFILES = {
 'fil': {
  'source_heading_pattern': heading(r'(?:Mga\s+)?(?:opisyal\s+na\s+)?sanggunian|Mga\s+pinagkunan'),
  'abbreviations': ['G', 'Gng', 'Bb', 'Dr', 'Prop', 'Kgg', 'Sen', 'Gob', 'Hen', 'Blg', 'Art', 'Sek', 'hal', 'p', 'pp', 'atbp', 'etc', 'e.g', 'i.e'],
  'terminal_abbreviations': ['atbp', 'etc'],
  'join_hyphens': True,
  'citation_pattern': r'(?i:\b(?:Artikulo|Seksyon|Art\.?|Sek\.?)\s*\d+)',
  'contrast_patterns': [r'(?i:\bhindi\b(?!\s+lamang\b)[^.!?\n]{0,160}\bkundi\b)', r'(?i:\bsa\s+halip\s+na\b)', r'(?i:\bkaiba\s+sa\b)'],
  'caveat_pattern': r'(?i:^[\s“"‘\x27(\[]*(?:Ngunit|Subalit|Gayunman|Gayunpaman)\b)',
  'hypo_pattern': r'(?i:^[\s“"‘\x27(\[]*(?:Ipagpalagay|Halimbawa|Isang\s+kathang-isip\s+na\s+halimbawa)\b)',
  'formula_close_pattern': r'(?i:\b(?:Pangkalahatang\s+impormasyon\s+lamang\s+ang\s+artikulong\s+ito|Maaaring\s+tumulong\s+ang\s+aming\s+tanggapan|Iba-iba\s+ang\s+bawat\s+kaso)\b)',
  'sentence_fixtures': [
   sentence('Nasa mesa ang sobre.', 'Bukas ang kahon.'),
   sentence('Nasaan ang lapis?', 'Narito!'),
   sentence('Binasa ni Gng. Ana Cruz ang tala.', 'Isinara ni Dr. Luis Santos ang kahon.'),
   sentence('Nasa hal. 7 ang larawan.', 'Blg. 3 ang nakasulat sa etiketa.'),
   sentence('May 1,250.50 sa kathang-isip na tala.', 'Walang lagda.'),
   sentence('May papel, lapis, atbp.', 'Nasa labas ang gunting.'),
   sentence('“Nasaan ang papel?” tanong ni Ana.', 'Nasa mesa iyon.'),
   sentence('“Handa na ang kopya.”', 'Isinara ni Ana ang kahon.'),
   sentence('Nasa papel ang e.g. at i.e. bilang mga halimbawa ng daglat.', 'Malinaw ang tinta.')],
  'word_fixtures': [
   words('Araw-araw ang pag-aaral.', 'Araw-araw', 'ang', 'pag-aaral'),
   words('3-5 pahina at ika-3 kahon.', '3', '5', 'pahina', 'at', 'ika-3', 'kahon'),
   words('Ito’y tala ni O’Neil.', 'Ito’y', 'tala', 'ni', 'O’Neil'),
   words('₱1,250.50; 25%.', '1,250.50', '25'),
   words('Gng. Ana; PDF; A4.', 'Gng', 'Ana', 'PDF', 'A4'),
   words('May\u00a0puting papel.', 'May', 'puting', 'papel')],
  'source_positive': ['## Mga sanggunian', '### Opisyal na sanggunian:', '## 7. Mga pinagkunan', '## SANGGUNIAN ##'],
  'source_negative': ['## Mga sanggunian sa pagpopondo', '## Pinagmulan ng problema', 'Sanggunian', '## Mga sanggunian at pagsusuri'],
  'rhetorical_fixtures': [
   ['contrast', 'Hindi pula kundi asul ang etiketa.', 1],
   ['contrast', 'Hindi lamang papel kundi pati lapis ang nasa kahon.', 0],
   ['contrast', 'Sa halip na sobre, kahon ang dala niya.', 1],
   ['contrast', 'Nasa mesa ang sobre.', 0],
   ['caveat', 'Gayunman, bukas ang kahon.', 1],
   ['caveat', 'Bukas ang kahon ngunit sarado ang sobre.', 0],
   ['hypo', 'Ipagpalagay na may pulang kahon.', 1],
   ['hypo', 'May pulang kahon sa mesa.', 0],
   ['formula', 'Pangkalahatang impormasyon lamang ang artikulong ito.', 1],
   ['formula', 'Nasa ikalawang sobre ang huling kopya.', 0]],
 },
 'he': {
  'source_heading_pattern': heading(r'מקורות(?:\s+(?:רשמיים|משפטיים))?|אסמכתאות'),
  'abbreviations': ['Dr', 'Prof', 'Mr', 'Ms', 'Art', 'No', 'p', 'pp', 'e.g', 'i.e', 'etc'],
  'terminal_abbreviations': ['etc'],
  'join_hyphens': False,
  'citation_pattern': r'(?<!\w)(?:סעיף|סעיפים|ס[׳\x27])\s*\d+',
  'quote_closers': '״',
  'quote_attribution_pattern': r'^(?:אמר|אמרה|שאל|שאלה|השיב|השיבה)\s',
  'contrast_patterns': [r'(?<!\w)לא(?!\s+רק\b)[^.!?\n]{0,160}\sאלא\b', r'(?<!\w)במקום\b', r'(?<!\w)שונה\s+מ'],
  'caveat_pattern': r'^[\s“"״(\[]*(?:אולם|ואולם|עם\s+זאת|למרות\s+זאת)(?!\w)',
  'hypo_pattern': r'^[\s“"״(\[]*(?:נניח|למשל|דוגמה\s+היפותטית)(?!\w)',
  'formula_close_pattern': r'(?:מאמר\s+זה\s+מכיל\s+מידע\s+כללי|כל\s+מקרה\s+שונה|משרדנו\s+יכול\s+לעזור)',
  'sentence_fixtures': [
   sentence('המעטפה על השולחן.', 'הקופסה פתוחה.'),
   sentence('איפה העיפרון?', 'הוא כאן!'),
   sentence('ד״ר לוי קרא את הדף.', 'פרופ׳ כהן סגר את הקופסה.'),
   sentence('ד"ר לוי קרא את הדף.', "פרופ' כהן סגר את הקופסה."),
   sentence('ברשימה הדמיונית נכתב 1,250.50.', 'אין חתימה.'),
   sentence('״איפה הדף?״ שאלה דנה.', 'יואב הצביע על השולחן.'),
   sentence('״העותק מוכן.״', 'דנה סגרה את הקופסה.'),
   sentence('הסימון Dr. מופיע על הכרטיס.', 'הכרטיס לבן.')],
  'word_fixtures': [
   words('ד״ר לוי קרא דוא״ל.', 'ד״ר', 'לוי', 'קרא', 'דוא״ל'),
   words('ד"ר לוי קרא דוא"ל.', 'ד"ר', 'לוי', 'קרא', 'דוא"ל'),
   words('ג׳ון ביקר בבית־הספר.', 'ג׳ון', 'ביקר', 'בבית', 'הספר'),
   words('וכשהמסמך הגיע, שמרנו אותו.', 'וכשהמסמך', 'הגיע', 'שמרנו', 'אותו'),
   words('שָׁלוֹם, ₪1,250.50 ו־25%.', 'שָׁלוֹם', '1,250.50', 'ו', '25'),
   words("פרופ׳ כהן; פרופ' לוי.", 'פרופ', 'כהן', 'פרופ', 'לוי'),
   words('הטקסט "מוכן" בתוך הקופסה.', 'הטקסט', 'מוכן', 'בתוך', 'הקופסה')],
  'source_positive': ['## מקורות', '### מקורות רשמיים:', '## 7. אסמכתאות', '## מקורות משפטיים ##'],
  'source_negative': ['## מקורות המימון', '## מקור הבעיה', 'מקורות', '## מקורות וניתוח'],
  'rhetorical_fixtures': [
   ['contrast', 'זו לא מעטפה אלא קופסה.', 1],
   ['contrast', 'לא רק מעטפה אלא גם קופסה מונחת כאן.', 0],
   ['contrast', 'הוא הביא קופסה במקום מעטפה.', 1],
   ['contrast', 'המעטפה על השולחן.', 0],
   ['caveat', 'עם זאת, הקופסה פתוחה.', 1],
   ['caveat', 'הקופסה פתוחה אולם המעטפה סגורה.', 0],
   ['hypo', 'נניח שהקופסה אדומה.', 1],
   ['hypo', 'הקופסה האדומה על השולחן.', 0],
   ['formula', 'מאמר זה מכיל מידע כללי.', 1],
   ['formula', 'העותק האחרון במעטפה השנייה.', 0]],
 },
 'nl': {
  'source_heading_pattern': heading(r'Bronnen|Officiële\s+bronnen|Geraadpleegde\s+bronnen|Rechtsbronnen'),
  'abbreviations': ['dr', 'drs', 'mr', 'ir', 'ing', 'prof', 'dhr', 'mevr', 'art', 'nr', 'blz', 'p', 'pp', 'bijv', 'ca', 'enz', 'etc', 'e.d', 'd.w.z', 'm.a.w', 'i.p.v', 'o.a', 'a.u.b', 'nl'],
  'terminal_abbreviations': ['enz', 'etc', 'e.d'],
  'join_hyphens': False,
  'citation_pattern': r'(?i:\b(?:artikel(?:en)?|art\.?|lid|leden)\s*\d+)',
  'contrast_patterns': [r'(?i:\bniet\b(?!\s+alleen\b)[^.!?\n]{0,160}\bmaar\b)', r'(?i:\bin\s+plaats\s+van\b)', r'(?i:\banders\s+dan\b)'],
  'caveat_pattern': r'(?i:^[\s“"‘\x27(\[]*(?:Echter|Toch|Desondanks|Evenwel)\b)',
  'hypo_pattern': r'(?i:^[\s“"‘\x27(\[]*(?:Stel\s+dat|Veronderstel|Een\s+fictief\s+voorbeeld)\b)',
  'formula_close_pattern': r'(?i:\b(?:Dit\s+artikel\s+bevat\s+algemene\s+informatie|Ieder\s+geval\s+is\s+anders|Ons\s+kantoor\s+kan\s+u\s+helpen)\b)',
  'sentence_fixtures': [
   sentence('De envelop ligt op tafel.', 'De doos is open.'),
   sentence('Waar ligt het potlood?', 'Hier!'),
   sentence('Dr. De Vries leest het blad.', 'Mevr. Jansen sluit de doos.'),
   sentence('Op blz. 7 staat een tekening.', 'Art. 3 is slechts een fictief etiket.'),
   sentence('De fictieve lijst vermeldt 1.250,50 euro.', 'Er staat geen handtekening.'),
   sentence('In de doos liggen papier, potloden enz.', 'De schaar ligt erbuiten.'),
   sentence('Er liggen enveloppen e.d.', 'De doos blijft open.'),
   sentence('“Waar is het blad?” vraagt Anna.', 'Joost wijst naar de tafel.'),
   sentence('Dit is een kopie, d.w.z. een tweede exemplaar.', 'Het origineel blijft hier.')],
  'word_fixtures': [
   words('De aansprakelijkheidsverzekering staat vermeld.', 'De', 'aansprakelijkheidsverzekering', 'staat', 'vermeld'),
   words('O’Neils e-mail bevat één bijlage.', 'O’Neils', 'e', 'mail', 'bevat', 'één', 'bijlage'),
   words('€1.250,50; 3-5 bladen.', '1.250,50', '3', '5', 'bladen'),
   words("Anna's kopie ligt hier.", "Anna's", 'kopie', 'ligt', 'hier'),
   words('Dr. Jansen gebruikt A4.', 'Dr', 'Jansen', 'gebruikt', 'A4'),
   words('Eén\u00a0wit vel.', 'Eén', 'wit', 'vel')],
  'source_positive': ['## Bronnen', '### Officiële bronnen:', '## 7. Geraadpleegde bronnen', '## RECHTSBRONNEN ##'],
  'source_negative': ['## Bronnen van financiering', '## De bron van het probleem', 'Bronnen', '## Bronnen en analyse'],
  'rhetorical_fixtures': [
   ['contrast', 'Het is niet rood maar blauw.', 1],
   ['contrast', 'Er ligt niet alleen papier maar ook een potlood.', 0],
   ['contrast', 'Hij brengt een doos in plaats van een envelop.', 1],
   ['contrast', 'De envelop ligt op tafel.', 0],
   ['caveat', 'Toch blijft de doos open.', 1],
   ['caveat', 'De doos is open, toch blijft de envelop dicht.', 0],
   ['hypo', 'Stel dat de doos rood is.', 1],
   ['hypo', 'De rode doos staat op tafel.', 0],
   ['formula', 'Dit artikel bevat algemene informatie.', 1],
   ['formula', 'De laatste kopie zit in de tweede envelop.', 0]],
 },
 'pl': {
  'source_heading_pattern': heading(r'Źródła|Źródła\s+oficjalne|Oficjalne\s+źródła|Materiały\s+źródłowe'),
  'abbreviations': ['art', 'ust', 'pkt', 'lit', 'nr', 'str', 's', 'r', 'prof', 'hab', 'inż', 'np', 'tj', 'tzn', 'itd', 'itp', 'zob', 'por', 'm.in', 'godz', 'ok'],
  'terminal_abbreviations': ['itd', 'itp', 'r'],
  'join_hyphens': False,
  'citation_pattern': r'(?i:\b(?:art\.?|artykuł|artykuły|ust\.?|paragraf)\s*\d+)',
  'contrast_patterns': [r'(?i:\bnie\b(?!\s+tylko\b)[^.!?\n]{0,160}\b(?:lecz|ale)\b)', r'(?i:\bzamiast\b)', r'(?i:\bróżni\s+się\s+od\b)'],
  'caveat_pattern': r'(?i:^[\s„“"‘\x27(\[]*(?:Jednak|Jednakże|Niemniej|Mimo\s+to)\b)',
  'hypo_pattern': r'(?i:^[\s„“"‘\x27(\[]*(?:Załóżmy|Wyobraźmy\s+sobie|Przypuśćmy|Hipotetyczny\s+przykład)\b)',
  'formula_close_pattern': r'(?i:\b(?:Ten\s+artykuł\s+zawiera\s+ogólne\s+informacje|Każdy\s+przypadek\s+jest\s+inny|Nasza\s+kancelaria\s+może\s+pomóc)\b)',
  'sentence_fixtures': [
   sentence('Koperta leży na stole.', 'Pudełko jest otwarte.'),
   sentence('Gdzie jest ołówek?', 'Tutaj!'),
   sentence('Prof. Kowalska czyta kartkę.', 'Dr Nowak zamyka pudełko.'),
   sentence('Na str. 7 jest rysunek.', 'Fikcyjna etykieta zawiera art. 3 ust. 2.'),
   sentence('Przykładowy zapis to 1.250,50 zł.', 'Brakuje podpisu.'),
   sentence('W pudełku są kartki, ołówki itd.', 'Nożyczki leżą obok.'),
   sentence('Notatka pochodzi z 2026 r.', 'Kopia jest biała.'),
   sentence('„Gdzie jest kartka?” pyta Anna.', 'Jan wskazuje stół.'),
   sentence('W środku są m.in. kartki.', 'Pudełko jest lekkie.')],
  'word_fixtures': [
   words('Żółta koperta leży tutaj.', 'Żółta', 'koperta', 'leży', 'tutaj'),
   words('Polsko-tajwański napis; 3-5 kartek.', 'Polsko', 'tajwański', 'napis', '3', '5', 'kartek'),
   words('1\u202f250,50 zł; 25%.', '1', '250,50', 'zł', '25'),
   words('O’Neill czyta PDF.', 'O’Neill', 'czyta', 'PDF'),
   words('Art. 3 ust. 2, A4.', 'Art', '3', 'ust', '2', 'A4'),
   words('Zażółć gęślą jaźń.', 'Zażółć', 'gęślą', 'jaźń')],
  'source_positive': ['## Źródła', '### Oficjalne źródła:', '## 7. Materiały źródłowe', '## ŹRÓDŁA OFICJALNE ##'],
  'source_negative': ['## Źródła finansowania', '## Podstawa prawna roszczenia', 'Źródła', '## Źródła i analiza'],
  'rhetorical_fixtures': [
   ['contrast', 'To nie koperta, lecz pudełko.', 1],
   ['contrast', 'Jest tu nie tylko papier, ale także ołówek.', 0],
   ['contrast', 'Przyniósł pudełko zamiast koperty.', 1],
   ['contrast', 'Koperta leży na stole.', 0],
   ['caveat', 'Jednak pudełko jest otwarte.', 1],
   ['caveat', 'Pudełko jest otwarte, jednak koperta pozostaje zamknięta.', 0],
   ['hypo', 'Załóżmy, że pudełko jest czerwone.', 1],
   ['hypo', 'Czerwone pudełko stoi na stole.', 0],
   ['formula', 'Ten artykuł zawiera ogólne informacje.', 1],
   ['formula', 'Ostatnia kopia jest w drugiej kopercie.', 0]],
 },
 'cs': {
  'source_heading_pattern': heading(r'Zdroje|Oficiální\s+zdroje|Použité\s+zdroje|Prameny'),
  'abbreviations': ['č', 'čl', 'odst', 'písm', 'str', 's', 'r', 'např', 'tj', 'tzn', 'atd', 'apod', 'resp', 'prof', 'doc', 'Ing', 'JUDr', 'MUDr', 'Ph.D', 'Sb', 'sp. zn', 'č. j', 's. r. o', 's.r.o', 'a. s', 'a.s'],
  'terminal_abbreviations': ['atd', 'apod', 's.r.o', 's. r. o', 'a.s', 'a. s', 'r'],
  'join_hyphens': False,
  'citation_pattern': r'(?i:\b(?:čl\.?|článek|odst\.?|odstavec)\s*\d+)',
  'quote_closers': '“',
  'calendar_months': ['ledna','února','března','dubna','května','června','července','srpna','září','října','listopadu','prosince'],
  'spaced_numeric_dates': True,
  'contrast_patterns': [r'(?i:\bnikoli\b[^.!?\n]{0,160}\bnýbrž\b)', r'(?i:\bne\b[^.!?\n]{0,160}\bale\b)', r'(?i:\bnamísto\b)', r'(?i:\bna\s+rozdíl\s+od\b)'],
  'caveat_pattern': r'(?i:^[\s„“"‘\x27(\[]*(?:Avšak|Nicméně|Přesto|Ovšem)\b)',
  'hypo_pattern': r'(?i:^[\s„“"‘\x27(\[]*(?:Představme\s+si|Předpokládejme|Dejme\s+tomu|Hypotetický\s+příklad)\b)',
  'formula_close_pattern': r'(?i:\b(?:Tento\s+text\s+obsahuje\s+obecné\s+informace|Každý\s+případ\s+je\s+jiný|Naše\s+kancelář\s+vám\s+může\s+pomoci)\b)',
  'sentence_fixtures': [
   sentence('Obálka leží na stole.', 'Krabice je otevřená.'),
   sentence('Kde je tužka?', 'Tady!'),
   sentence('Ing. Novák čte list.', 'Prof. Černá zavírá krabici.'),
   sentence('Na str. 7 je obrázek.', 'Fiktivní štítek uvádí čl. 3 odst. 2.'),
   sentence('Na lístku je 1 250,50 Kč.', 'Podpis chybí.'),
   sentence('Uvnitř jsou listy, tužky atd.', 'Nůžky leží vedle.'),
   sentence('Dne 3. května dorazila obálka.', 'Krabice zůstala otevřená.'),
   sentence('Lístek nese datum 5. 10. 2026.', 'Text je čitelný.'),
   sentence('„Kde je list?“ zeptala se Eva.', 'Petr ukázal na stůl.'),
   sentence('„Kopie je hotová.“', 'Eva zavřela krabici.'),
   sentence('Fiktivní název zní Papír s. r. o.', 'Vedle je prázdný řádek.')],
  'word_fixtures': [
   words('Žlutá obálka leží tady.', 'Žlutá', 'obálka', 'leží', 'tady'),
   words('Česko-tchajwanský text; 3-5 listů.', 'Česko', 'tchajwanský', 'text', '3', '5', 'listů'),
   words('1\u00a0250,50 Kč; 25%.', '1', '250,50', 'Kč', '25'),
   words('O’Neill čte PDF.', 'O’Neill', 'čte', 'PDF'),
   words('Čl. 3 odst. 2, A4.', 'Čl', '3', 'odst', '2', 'A4'),
   words('Příliš žluťoučký kůň.', 'Příliš', 'žluťoučký', 'kůň')],
  'source_positive': ['## Zdroje', '### Oficiální zdroje:', '## 7. Použité zdroje', '## PRAMENY ##'],
  'source_negative': ['## Zdroje financování', '## Právní základ nároku', 'Zdroje', '## Zdroje a rozbor'],
  'rhetorical_fixtures': [
   ['contrast', 'Je to nikoli obálka, nýbrž krabice.', 1],
   ['contrast', 'Je tu nejen papír, ale i tužka.', 0],
   ['contrast', 'Přinesl krabici namísto obálky.', 1],
   ['contrast', 'Obálka leží na stole.', 0],
   ['caveat', 'Nicméně krabice je otevřená.', 1],
   ['caveat', 'Krabice je otevřená, nicméně obálka zůstává zavřená.', 0],
   ['hypo', 'Představme si červenou krabici.', 1],
   ['hypo', 'Červená krabice stojí na stole.', 0],
   ['formula', 'Tento text obsahuje obecné informace.', 1],
   ['formula', 'Poslední kopie je v druhé obálce.', 0]],
 },
 'lt': {
  'source_heading_pattern': heading(r'Šaltiniai|Oficialūs\s+šaltiniai|Naudoti\s+šaltiniai|Informacijos\s+šaltiniai'),
  'abbreviations': ['str', 'd', 'p', 'Nr', 'pvz', 't. y', 't.y', 't. t', 't.t', 'ir kt', 'kt', 'pan', 'm', 'mėn', 'g', 'pr', 'žr', 'plg', 'dr', 'prof', 'doc', 'val'],
  'terminal_abbreviations': ['t. t', 't.t', 'kt', 'pan', 'm', 'd'],
  'join_hyphens': False,
  'citation_pattern': r'(?i:\b(?:straipsn(?:is|io|į|iai|ius)|str\.?)\s*\d+)',
  'quote_closers': '“',
  'contrast_patterns': [r'(?i:\bne\b(?!\s+tik\b)[^.!?\n]{0,160}\bo\b)', r'(?i:\bvietoj\b)', r'(?i:\bskiriasi\s+nuo\b)'],
  'caveat_pattern': r'(?i:^[\s„“"‘\x27(\[]*(?:Tačiau|Vis\s+dėlto|Visgi|Nepaisant\s+to)\b)',
  'hypo_pattern': r'(?i:^[\s„“"‘\x27(\[]*(?:Tarkime|Įsivaizduokime|Hipotetinis\s+pavyzdys)\b)',
  'formula_close_pattern': r'(?i:\b(?:Šiame\s+straipsnyje\s+pateikiama\s+bendra\s+informacija|Kiekvienas\s+atvejis\s+yra\s+skirtingas|Mūsų\s+kontora\s+gali\s+jums\s+padėti)\b)',
  'sentence_fixtures': [
   sentence('Vokas guli ant stalo.', 'Dėžė atidaryta.'),
   sentence('Kur pieštukas?', 'Čia!'),
   sentence('Dr. Jonaitis skaito lapą.', 'Prof. Žukienė uždaro dėžę.'),
   sentence('Piešinys yra p. 7.', 'Išgalvotoje etiketėje nurodytas str. 3.'),
   sentence('Lape įrašyta 1 250,50 Eur.', 'Parašo nėra.'),
   sentence('Dėžėje yra lapų, pieštukų ir t. t.', 'Žirklės guli šalia.'),
   sentence('Tai kopija, t. y. antras egzempliorius.', 'Originalas lieka čia.'),
   sentence('Raštelis parašytas 2026 m.', 'Popierius baltas.'),
   sentence('Data yra 2026 m. spalio 5 d.', 'Tekstas įskaitomas.'),
   sentence('„Kur lapas?“ paklausė Ona.', 'Jonas parodė į stalą.'),
   sentence('„Kopija paruošta.“', 'Ona uždarė dėžę.')],
  'word_fixtures': [
   words('Žalias vokas guli čia.', 'Žalias', 'vokas', 'guli', 'čia'),
   words('Lietuvos–Taivano tekstas; 3-5 lapai.', 'Lietuvos', 'Taivano', 'tekstas', '3', '5', 'lapai'),
   words('1\u202f250,50 Eur; 25%.', '1', '250,50', 'Eur', '25'),
   words('O’Neill skaito PDF.', 'O’Neill', 'skaito', 'PDF'),
   words('Str. 3, p. 7, A4.', 'Str', '3', 'p', '7', 'A4'),
   words('Ąžuolas, ėriukas ir ūdra.', 'Ąžuolas', 'ėriukas', 'ir', 'ūdra')],
  'source_positive': ['## Šaltiniai', '### Oficialūs šaltiniai:', '## 7. Naudoti šaltiniai', '## INFORMACIJOS ŠALTINIAI ##'],
  'source_negative': ['## Finansavimo šaltiniai', '## Reikalavimo teisinis pagrindas', 'Šaltiniai', '## Šaltiniai ir analizė'],
  'rhetorical_fixtures': [
   ['contrast', 'Tai ne vokas, o dėžė.', 1],
   ['contrast', 'Čia yra ne tik popierius, bet ir pieštukas.', 0],
   ['contrast', 'Jis atnešė dėžę vietoj voko.', 1],
   ['contrast', 'Vokas guli ant stalo.', 0],
   ['caveat', 'Vis dėlto dėžė atidaryta.', 1],
   ['caveat', 'Dėžė atidaryta, tačiau vokas užklijuotas.', 0],
   ['hypo', 'Įsivaizduokime raudoną dėžę.', 1],
   ['hypo', 'Raudona dėžė stovi ant stalo.', 0],
   ['formula', 'Šiame straipsnyje pateikiama bendra informacija.', 1],
   ['formula', 'Paskutinė kopija yra antrame voke.', 0]],
 },
}

if __name__ == '__main__':
    out=ROOT/'evidence/fixture-freeze.json'
    if out.exists():
        raise SystemExit('Refusing to overwrite frozen profiles or initial fixture freeze')
    rows=[]
    for locale, data in PROFILES.items():
        data={'locale':locale, 'directory':f'columns-{locale}', **data}
        # NFC/NFD expectations are transformed together from manually written
        # arrays. They are not obtained from the candidate's token/sentence output.
        for key, arraykey in [('sentence_fixtures','sentences'),('word_fixtures','tokens')]:
            first=data[key][0]
            nfd={'text':unicodedata.normalize('NFD',first['text']),
                 arraykey:[unicodedata.normalize('NFD',x) for x in first[arraykey]]}
            if nfd != first: data[key].append(nfd)
        path=ROOT/'candidate/profiles'/f'{locale}.json'
        path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
        rows.append({'locale':locale,'path':str(path.relative_to(ROOT)),
                     'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),
                     'sentence':len(data['sentence_fixtures']),
                     'words':len(data['word_fixtures']),
                     'source':len(data['source_positive'])+len(data['source_negative']),
                     'rhetorical':len(data['rhetorical_fixtures'])})
    out.write_text(json.dumps({'created_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),
      'provenance':'Manually authored neutral expected arrays before first candidate execution. Not machine-generated expected outputs; fresh independent review still required.',
      'target_manuscripts_or_scores_read':False,'rows':rows},ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'profiles':len(rows),'neutral_fixtures':sum(sum(r[k] for k in ('sentence','words','source','rhetorical')) for r in rows),'freeze':str(out)}))

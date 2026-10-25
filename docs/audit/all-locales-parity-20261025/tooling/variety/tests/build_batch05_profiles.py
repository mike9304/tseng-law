"""Finite profiles implementing the separately frozen neutral contract."""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
START = r'^[\s“”„"\x27«»(\[]*'


def heading(aliases):
    return r'(?i:^#{1,6}[^\S\r\n]+(?:\d+[.)][^\S\r\n]+)?(?:' + aliases + r')[^\S\r\n]*[:：]?(?:[^\S\r\n]+#+)?[^\S\r\n]*$)'


def replacement(negation, correction, additive, stops='.!?'):
    span = r'[^' + stops + r'\n;]'
    return (r'(?i:(?:^|(?<=[' + stops + r'\n]))\s*(?!' + span + r'{0,220}(?:' + additive + r'))'
            + span + r'{0,220}(?:' + negation + ')' + span + r'{0,120}(?:' + correction + r'))')


def opening(pattern):
    return '(?i:' + START + '(?:' + pattern + r')\b)'


base = dict(review_status='AI neutral contract; root independent review/install pending',
            provenance='METHOD-BATCH05.md; tests/fixtures-batch05.json fixed before production edits',
            join_hyphens=False, canonical_abbreviations=True, flexible_abbreviation_spaces=True,
            length_unit='orthographic_words', short_threshold=8, long_threshold=32,
            question_pattern=r'[?？؟]\s*["”’»›“)]*$', terminal_abbreviations=[])
profiles = {}
profiles['km'] = {**base, 'register':'Modern Khmer; ICU dictionary wordlike units',
    'length_unit':'icu_dictionary_wordlike_units',
    'abbreviations':['Dr','Prof','Mr','Ms','Art','No','p','pp','e.g','i.e'],
    'additional_sentence_terminators':'។៕', 'unspaced_sentence_terminators':'។៕',
    'native_abbreviation_sequences':['។ល។','។បេ។'],
    'quote_attribution_pattern':r'^(?:គាត់បាននិយាយ|គាត់និយាយ|គ្រូបាននិយាយ|គ្រូនិយាយ)',
    'source_heading_pattern':heading(r'ប្រភព|ប្រភពផ្លូវការ|ឯកសារយោង'),
    'citation_pattern':r'មាត្រា\s*\d+',
    'contrast_patterns':[replacement('មិនមែន','ប៉ុន្តែ','មិនត្រឹមតែ','.!?។៕')],
    'caveat_pattern':START + r'(?:ទោះយ៉ាងណា|ប៉ុន្តែ)',
    'hypo_pattern':START + r'(?:ឧបមាថា|សន្មតថា)',
    'formula_close_pattern':r'ព័ត៌មានទូទៅ'}
profiles['mn'] = {**base,'register':'Modern Cyrillic Mongolian; not traditional vertical script',
    'abbreviations':['Dr','Prof','Mr','Ms','e.g','i.e','ж','г.м','г. м','гэх мэт'],
    'terminal_abbreviations':['г.м','г. м'],
    'source_heading_pattern':heading(r'Эх\s+сурвалж(?:ууд)?|Албан\s+ёсны\s+эх\s+сурвалж(?:ууд)?'),
    'contrast_patterns':[replacement(r'\bбиш\b',r'\bхарин\b',r'\bзөвхөн\b')],
    'caveat_pattern':opening(r'Гэсэн\s+хэдий\s+ч|Гэвч|Гэхдээ'),
    'hypo_pattern':opening(r'Жишээ\s+нь|Төсөөлье'),
    'formula_close_pattern':r'(?i:ерөнхий\s+мэдээлэл)',
    'citation_pattern':r'(?i:\d+\s*(?:дугаар|дүгээр)\s+зүйл(?:д|ийн)?|зүйл\s*\d+)'}
profiles['sr'] = {**base,'register':'Serbian Latin and Cyrillic, explicit spellings without transliteration',
    'abbreviations':['prof','doc','dr','mr','npr','tj','itd','sl','br','čl','st','str','god','проф','доц','др','мр','нпр','тј','итд','сл','бр','чл','ст','стр','год'],
    'terminal_abbreviations':['itd','sl','god','итд','сл','год'],
    'context_terminal_abbreviations':{'str':r'\d+[\ue000.]?\s*$','стр':r'\d+[\ue000.]?\s*$'},
    'dotted_ordinal_lowercase_continuation':True, 'dotted_ordinal_arabic_only':True,
    'ordinal_pattern':r'(?<!\w)\d{1,2}[.\ue000]\s+\d{1,2}\.(?=\s+\d{4})|(?<!\w)\d{1,2}\.(?=\s+[IVX]+\s+\d{4})',
    'additional_closing_quotes':'“',
    'source_heading_pattern':heading(r'Izvori|Zvanični\s+izvori|Službeni\s+izvori|Извори|Званични\s+извори|Службени\s+извори'),
    'contrast_patterns':[replacement(r'\b(?:nije|није)\b',r'\b(?:nego|već|него|већ)\b',r'\b(?:samo|само)\b')],
    'caveat_pattern':opening(r'Međutim|Ipak|Међутим|Ипак'),
    'hypo_pattern':opening(r'Pretpostavimo|Zamislimo|Претпоставимо|Замислимо'),
    'formula_close_pattern':r'(?i:opšte\s+informacije|опште\s+информације)',
    'citation_pattern':r'(?i:\b(?:član(?:u|a|om)?|čl\.|члан(?:у|а|ом)?|чл\.)\s*\d+)'}
profiles['sl'] = {**base,'register':'Standard Slovenian',
    'abbreviations':['dr','prof','mag','doc','npr','tj','t.j','t. j','itd','ipd','oz','prim','gl','št','čl','odst','str','t.i','t. i','d.o.o','d. o. o'],
    'terminal_abbreviations':['itd','ipd','d.o.o','d. o. o'],
    'context_terminal_abbreviations':{'čl':r'\d+[\ue000.]?\s*$','str':r'\d+[\ue000.]?\s*$'},
    'dotted_ordinal_lowercase_continuation':True,
    'ordinal_pattern':r'(?<!\w)\d{1,2}[.\ue000]\s+(?:\d{1,2}|[IVX]+)\.(?=\s+\d{4})',
    'additional_closing_quotes':'“«',
    'source_heading_pattern':heading(r'Viri|Uradni\s+viri|Literatura'),
    'contrast_patterns':[replacement(r'\bni\b',r'\b(?:temveč|ampak)\b',r'\b(?:samo|le)\b')],
    'caveat_pattern':opening(r'Vendar|Kljub\s+temu|Toda'),
    'hypo_pattern':opening(r'Predpostavimo|Zamislimo\s+si'),
    'formula_close_pattern':r'(?i:splošne\s+informacije)',
    'citation_pattern':r'(?i:\b\d+\.\s*člen(?:u|a|om)?|\bčlen(?:u|a|om)?\s*\d+)'}

ltpath=Path('/Users/son7/Projects/tseng-law-all-locales-20261025/docs/audit/market-expansion-20261025/work/variety-candidate/candidate/profiles/lt.json')
lt=json.loads(ltpath.read_text())
profiles['lt'] = {**base, **{k:lt[k] for k in ('source_heading_pattern','abbreviations','terminal_abbreviations','contrast_patterns','caveat_pattern','hypo_pattern','formula_close_pattern')},
    'register':'Standard Lithuanian; independently researched neutral arrays reused',
    'additional_closing_quotes':'“',
    'terminal_abbreviations':lt['terminal_abbreviations']+['val'],
    'context_terminal_abbreviations':{'str':r'\d+\s*$'},
    'citation_pattern':r'(?i:\b(?:(?:straipsn(?:is|io|į|iai|ius|yje)|str\.?)\s*\d+|\d+\s*(?:straipsn(?:is|io|į|iai|ius|yje)|str\.?)))'}
profiles['lv'] = {**base,'register':'Standard Latvian',
    'abbreviations':['Dr','prof','doc','piem','t.i','t. i','t.sk','t. sk','u.c','u. c','u.tml','u. tml','utt','Nr','nr','lpp','lp','g','plkst','sk','sal','att','tab'],
    'terminal_abbreviations':['u.c','u. c','u.tml','u. tml','utt','g'],
    'context_terminal_abbreviations':{'lpp':r'\d+[\ue000.]?\s*$','lp':r'\d+[\ue000.]?\s*$'},
    'dotted_ordinal_lowercase_continuation':True, 'dotted_ordinal_arabic_only':True,
    'additional_closing_quotes':'“',
    'source_heading_pattern':heading(r'Avoti|Oficiālie\s+avoti|Izmantotie\s+avoti'),
    'contrast_patterns':[replacement(r'\bnav\b',r'\bbet\b',r'\b(?:tikai|vienīgi)\b')],
    'caveat_pattern':opening(r'Tomēr|Taču|Neraugoties\s+uz\s+to'),
    'hypo_pattern':opening(r'Pieņemsim|Iedomāsimies'),
    'formula_close_pattern':r'(?i:vispārīga\s+informācija)',
    'citation_pattern':r'(?i:\b\d+\.\s*pant(?:s|a|ā|u)|\bpant(?:s|a|ā|u)\s*\d+)'}
profiles['et'] = {**base,'register':'Standard Estonian; native abbreviations normally undotted',
    'abbreviations':['dr','prof','hr','pr','nt','s.t','s. t','s.o','s. o','k.a','k. a','v.a','v. a','jne','jms','jm','nr','lk','lg','p','a'],
    'terminal_abbreviations':['jne','jms','jm'],
    'context_terminal_abbreviations':{'a':r'\d{4}\s*$'},
    'dotted_ordinal_lowercase_continuation':True, 'dotted_ordinal_arabic_only':True,
    'ordinal_pattern':r'(?<!\w)\d{1,2}\.(?=\s+[IVX]+\s+\d{4})',
    'additional_closing_quotes':'“',
    'source_heading_pattern':heading(r'Allikad|Ametlikud\s+allikad|Kasutatud\s+allikad'),
    'contrast_patterns':[replacement(r'\b(?:ei\s+ole|pole|mitte)\b',r'\bvaid\b',r'\b(?:ainult|üksnes)\b')],
    'caveat_pattern':opening(r'Siiski|Kuid|Sellest\s+hoolimata'),
    'hypo_pattern':opening(r'Oletame|Kujutame\s+ette'),
    'formula_close_pattern':r'(?i:üldine\s+teave|üldine\s+info)',
    'citation_pattern':r'(?i:\b(?:artik(?:kel|li|lis)|paragrahv(?:i|is)?|§)\s*\d+|\d+\.\s*artik(?:kel|li|lis))'}

for lang, data in profiles.items():
    data.update(locale=lang, directory='columns-'+lang)
    (ROOT / 'profiles' / (lang+'.json')).write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n')

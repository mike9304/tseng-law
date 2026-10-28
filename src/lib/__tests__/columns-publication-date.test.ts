import { AIR_COLUMN_FILES_20261011, AIR_COLUMN_PUBLICATION_DATE } from './air-column-files';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getAllColumnPosts, sortColumnPostsNewestFirst, type ColumnPost } from '@/lib/columns';
import {
  NATIVE_LOCALE_COLUMN_FILES,
  archiveLeadPublicationDate,
  archiveLeadSlugsFor,
  expertiseSlugsFor,
  isNativeLocaleColumnSlug,
} from './native-locale-columns';
import { taxAccountingPublicationDate } from './tax-accounting-column-files';
import { CRIMINAL_COLUMN_FILES_20261008 } from './criminal-coverage-column-files';

const COSMETICS_SLUG = 'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide';

const VERIFIED_PUBLICATION_DATES: Record<string, string> = {
  '001': '2025-09-13',
  '002': '2025-09-13',
  '003': '2025-09-13',
  '004': '2025-09-13',
  '005': '2025-09-13',
  '006': '2025-09-13',
  '007': '2025-09-13',
  '008': '2025-09-13',
  '009': '2025-09-13',
  '010': '2025-09-13',
  '011': '2026-02-04',
  '012': '2025-09-13',
  '013': '2025-09-13',
  '014': '2025-09-13',
  '015': '2025-09-13',
  '016': '2025-09-13',
  '017': '2025-09-13',
  '018': '2026-09-17',
  '019': '2026-09-27',
  '020': '2026-09-27',
  '021': '2026-09-27',
  '022': '2026-09-27',
  '023': '2026-09-27',
  '024': '2026-09-29',
  '025': '2026-09-29',
  '026': '2026-09-29',
  '027': '2026-09-29',
  '028': '2026-09-29',
  '029': '2026-09-29',
  '030': '2026-09-29',
  '031': '2026-09-29',
  // Native en/ja/vi columns (one locale each), published 2026-09-29.
  '032': '2026-09-29',
  '033': '2026-09-29',
  '034': '2026-09-29',
  '035': '2026-09-29',
  '036': '2026-09-29',
  '037': '2026-09-29',
  '038': '2026-09-29',
  '039': '2026-09-29',
  '040': '2026-09-29',
  // Locale-specific expertise columns (ko/en/ja/zh-hant subsets), published 2026-09-30.
  '041': '2026-09-30',
  '042': '2026-09-30',
  '043': '2026-09-30',
  '044': '2026-09-30',
  '045': '2026-09-30',
  '046': '2026-09-30',
  '047': '2026-09-30',
  '048': '2026-09-30',
  '050': '2026-09-30', // traffic police-records column (049 in its lane)
  '052': '2026-10-01',
  '053': '2026-10-01',
  '054': '2026-10-01',
  '055': '2026-10-01',
  '056': '2026-10-01',
  '057': '2026-10-01',
  '058': '2026-10-01',
  '059': '2026-10-01',
  // zh-hant-only domestic columns (inheritance renunciation, defamation, overtime pay).
  '060': '2026-10-01',
  '061': '2026-10-01',
  '062': '2026-10-01',
  '051': '2026-10-01', // Korean-first traffic column (left turn vs straight motorcycle)
  // Expertise columns 063–069 (2026-10-02 weekday routine).
  '063': '2026-10-02',
  '064': '2026-10-02',
  '065': '2026-10-02',
  '066': '2026-10-02',
  '067': '2026-10-02',
  '068': '2026-10-02',
  '069': '2026-10-02',
  '070': '2026-10-02', // Vietnamese document-return column
  '071': '2026-10-02', // Japanese heated-tobacco entry column
  '072': '2026-10-02', // Taiwan domestic lane-change column
  '074': '2026-10-02',
  '075': '2026-10-02',
  '073': '2026-10-02', // Taiwan domestic right-turn evidence column
  // 2026-10-02–03 native audience and traffic releases.
  '076': '2026-10-02',
  '077': '2026-10-02',
  '078': '2026-10-02',
  '079': '2026-10-02',
  '080': '2026-10-02',
  '081': '2026-10-02',
  '082': '2026-10-02',
  '083': '2026-10-02',
  '084': '2026-10-02',
  '085': '2026-10-03',
  '086': '2026-10-03',
  '087': '2026-10-03',
  '088': '2026-10-03',
  '089': '2026-10-03',
  '090': '2026-10-03',
  '091': '2026-10-03',
  '092': '2026-10-03',
  '093': '2026-10-03',
  // Family-law columns 094–096 (2026-10-03, one locale each: ko / en / ja).
  '094': '2026-10-03',
  '095': '2026-10-03',
  '096': '2026-10-03',
  '097': '2026-10-03',
  '098': '2026-10-03',
  '099': '2026-10-03', // road-rage series: freeway cut-in sentence reduced (all four locales)
  '109': '2026-10-03', // road-rage series: baseball bat after a driving dispute — 7 months + civil damages (all four locales)
  '100': '2026-10-03',
  '101': '2026-10-03',
  '102': '2026-10-03',
  '103': '2026-10-03',
  // Family-law ship b02+b03: zh-hant 104–107 and en 108.
  '104': '2026-10-03',
  '105': '2026-10-03',
  '106': '2026-10-03',
  '107': '2026-10-03',
  '108': '2026-10-03',
  // semiconductor lane b01
  '110': '2026-10-03',
  '111': '2026-10-03',
  '112': '2026-10-03',
  // family lane b04
  '113': '2026-10-03',
  '114': '2026-10-03',
  '115': '2026-10-03',
  // semiconductor lane b04
  '116': '2026-10-03',
  '117': '2026-10-03',
  '118': '2026-10-03',
  '119': '2026-10-03',
  '120': '2026-10-03',
  '121': '2026-10-03',
  '122': '2026-10-03', // road-rage series: taiwan-road-rage-reversing-into-tailgater-no-self-defense (all four locales)
  // Reviewed fraud and semiconductor release.
  '133': '2026-10-03',
  '134': '2026-10-03',
  '135': '2026-10-03',
  '136': '2026-10-03',
  '137': '2026-10-03',
  '138': '2026-10-03',
  '139': '2026-10-03',
  '140': '2026-10-03',
  '141': '2026-10-03',
  '142': '2026-10-03',
  '143': '2026-10-03',
  // family lane b05
  '144': '2026-10-03',
  // Taiwan-first editorial batch002.
  '154': '2026-10-03',
  '155': '2026-10-03',
  '156': '2026-10-03',
  '157': '2026-10-03',
  '158': '2026-10-03',
  '159': '2026-10-03',
  '160': '2026-10-03',
  // Taiwan-first editorial batch003.
  '161': '2026-10-03',
  '162': '2026-10-03',
  '163': '2026-10-03',
  '164': '2026-10-03',
  '165': '2026-10-03',
  '166': '2026-10-03',
  '167': '2026-10-03',
  '204': '2026-10-04', // road-rage series: taiwan-road-rage-two-second-stop-taipei-not-enough (all four locales)
  '205': '2026-10-04',
  '206': '2026-10-04',
  '201': '2026-10-04',
  '202': '2026-10-04',
  '203': '2026-10-04', // road-rage series: taiwan-road-rage-52-seconds-subtracted-case (all four locales)
  '194': '2026-10-04', // road-rage series: taiwan-road-rage-freeway-chase-own-dashcam-too (all four locales)
  '191': '2026-10-04', // road-rage series: taiwan-road-rage-driver-stopped-route-66s-fast-lane (all four locales)
  '188': '2026-10-04', // road-rage series: taiwan-road-rage-started-did-not-matter-driver-blocked (all four locales)
  '189': '2026-10-04',
  '190': '2026-10-04',
  // semiconductor lane b06
  '168': '2026-10-04',
  '169': '2026-10-04',
  '170': '2026-10-04',
  '171': '2026-10-04',
  '172': '2026-10-04',
  '173': '2026-10-04',
  // Taiwan-first editorial batch004.
  '174': '2026-10-04',
  '175': '2026-10-04',
  '176': '2026-10-04',
  '177': '2026-10-04',
  '178': '2026-10-04',
  '179': '2026-10-04',
  '180': '2026-10-04',
  // Taiwan-first editorial batch005.
  '181': '2026-10-04',
  '182': '2026-10-04',
  '183': '2026-10-04',
  '184': '2026-10-04',
  '185': '2026-10-04',
  '186': '2026-10-04',
  '187': '2026-10-04',
  // semiconductor lane b08
  '192': '2026-10-04',
  '193': '2026-10-04',
  // family lane b08
  '195': '2026-10-04',
  '196': '2026-10-04',
  '197': '2026-10-04',
  // family lane b09
  '198': '2026-10-04',
  '199': '2026-10-04',
  '200': '2026-10-04',
  // semiconductor lane b09
  '207': '2026-10-04',
  '208': '2026-10-04',
  '209': '2026-10-04',
  '210': '2026-10-04',
  // semiconductor lane b10
  '211': '2026-10-04',
  '212': '2026-10-04',
  '214': '2026-10-04',
  // family lane b27
  '213': '2026-10-05',
  '215': '2026-10-05',
  '216': '2026-10-05',
  // fraud lane b05
  '217': '2026-10-05',
  '218': '2026-10-05',
  // semiconductor lane b15
  '219': '2026-10-05',
  '220': '2026-10-05',
  '221': '2026-10-05',
  '222': '2026-10-05',
  // fraud lane b53
  '223': '2026-10-05',
  '224': '2026-10-05',
  '225': '2026-10-05',
  // semiconductor lane b17
  '226': '2026-10-05',
  '227': '2026-10-05',
  '228': '2026-10-05',
  '229': '2026-10-05',
  // inherit-20261005-I1
  '230': '2026-10-05',
  // inherit-20261005-I2
  '231': '2026-10-05',
  // inherit-20261005-I3
  '232': '2026-10-05',
  // inherit-20261005-I5
  '233': '2026-10-05',
  // inherit-20261005-I6
  '234': '2026-10-05',
  // fraud lane b57
  '235': '2026-10-05',
  '236': '2026-10-05',
  '237': '2026-10-05',
  // semiconductor lane b19
  '238': '2026-10-05',
  '239': '2026-10-05',
  // family lane b79
  '240': '2026-10-05',
  '241': '2026-10-05',
  '242': '2026-10-05',
  // family lane b80
  '243': '2026-10-05',
  '244': '2026-10-05',
  '245': '2026-10-05',
  // fraud lane b59
  '246': '2026-10-05',
  '247': '2026-10-05',
  '248': '2026-10-05',
  // inherit-20261005-I4
  '249': '2026-10-05',
  // cols-20261006-C1
  '250': '2026-10-06',
  // cols-20261006-C2
  '251': '2026-10-06',
  // cols-20261006-C3
  '252': '2026-10-06',
  // cols-20261006-C4
  '253': '2026-10-06',
  // cols-20261006-C5
  '254': '2026-10-06',
  // cols-20261006-C6
  '255': '2026-10-06',
  // cols-20261006-C7
  '256': '2026-10-06',
  // cols-20261006-C8
  '257': '2026-10-06',
  // gap1006-G1
  '258': '2026-10-06',
  // gap1006-G2
  '259': '2026-10-06',
  // gap1006-G3
  '260': '2026-10-06',
  // ja-plan-20261006
  '261': '2026-10-07',
  '262': '2026-10-07',
  '263': '2026-10-07',
  '264': '2026-10-07',
  '265': '2026-10-07',
  '266': '2026-10-07',
  '267': '2026-10-07',
  '268': '2026-10-07',
  '269': '2026-10-07',
  '270': '2026-10-07',
  '271': '2026-10-07',
  '272': '2026-10-07',
  '273': '2026-10-07',
  // enja-inbound-20261007 (ja 346–350, en 351–355)
  '346': '2026-10-07',
  '347': '2026-10-07',
  '348': '2026-10-07',
  '349': '2026-10-07',
  '350': '2026-10-07',
  '351': '2026-10-07',
  '352': '2026-10-07',
  '353': '2026-10-07',
  '354': '2026-10-07',
  '355': '2026-10-07',
  // audit-split-1006
  '275': '2026-10-06',
  // audit-split-1006
  '307': '2026-10-06',
  '308': '2026-10-06',
  '309': '2026-10-06',
  // audit-split-1006
  '310': '2026-10-06',
  // criminal-20261007
  '401': '2026-10-07',
  '402': '2026-10-07',
  '403': '2026-10-07',
  '404': '2026-10-07',
  // ai-semiconductor-15-20261008
  '484': '2026-10-09',
  '485': '2026-10-09',
  '486': '2026-10-09',
  '487': '2026-10-09',
  '488': '2026-10-09',
  '489': '2026-10-09',
  '490': '2026-10-09',
  '491': '2026-10-09',
  '492': '2026-10-09',
  '493': '2026-10-09',
  '494': '2026-10-09',
  '495': '2026-10-09',
  '496': '2026-10-09',
  '497': '2026-10-09',
  '498': '2026-10-09',
  // Singapore-facing original columns
  '499': '2026-10-10',
  '500': '2026-10-10',
  '501': '2026-10-10',
  // Four-market original gap columns
  '502': '2026-10-10',
  '503': '2026-10-10',
  '504': '2026-10-10',
  '505': '2026-10-10',
  '506': '2026-10-10',
  '507': '2026-10-10',
  '508': '2026-10-10',
  '509': '2026-10-10',
  '510': '2026-10-10',
  '511': '2026-10-10',
  '512': '2026-10-10',
  '513': '2026-10-10',
  // Four-market follow-up columns
  '514': '2026-10-11',
  '515': '2026-10-11',
  '516': '2026-10-11',
  '517': '2026-10-11',
  ...Object.fromEntries(
    Object.values(AIR_COLUMN_FILES_20261011).flat().map((file) => [file.slice(0, 3), AIR_COLUMN_PUBLICATION_DATE]),
  ),
  // gap1006-G4
  '518': '2026-10-13',
  // gap1006-G5
  '519': '2026-10-13',
  // gap1006-G6
  '520': '2026-10-13',
  // gap1006-G7
  '521': '2026-10-13',
  // gap1006-G8
  '522': '2026-10-13',
  // gap1006-G9
  '523': '2026-10-13',
  // gap1006-G10
  '524': '2026-10-13',
  // jp-us-kr-20261014
  '601': '2026-10-14',
  '602': '2026-10-14',
  '611': '2026-10-15',
  '621': '2026-10-15',
  '622': '2026-10-15',
  '623': '2026-10-15',
  '624': '2026-10-15',
  '625': '2026-10-15',
  '626': '2026-10-15',
  '627': '2026-10-15',
  '628': '2026-10-15',
  '540': '2026-10-14',
  '542': '2026-10-14',
  '543': '2026-10-14',
  '544': '2026-10-14',
  '545': '2026-10-14',
  '546': '2026-10-14',
  '547': '2026-10-14',
  '548': '2026-10-14',
  '549': '2026-10-14',
  '550': '2026-10-14',
  '551': '2026-10-14',
  '552': '2026-10-14',
  // cols-20261013-C1
  '603': '2026-10-14',
  // cols-20261013-C4
  '604': '2026-10-14',
  // cols-20261013-C5
  '605': '2026-10-14',
  // cols-20261014-C1
  '606': '2026-10-14',
  // cols-20261013-C6
  '607': '2026-10-14',
  // cols-20261014-C3
  '608': '2026-10-14',
  // cols-20261014-C4
  '609': '2026-10-14',
  // cols-20261013-C2
  '610': '2026-10-15',
  // cols-20261016-C3
  '629': '2026-10-16',
  // cols-20261016-C1
  '630': '2026-10-16',
  // cols-20261016-C2
  '631': '2026-10-16',
  // cols-20261016-C4
  '632': '2026-10-18',
  // cols-20261016-C5
  '633': '2026-10-18',
  // cols-20261016-C6
  '634': '2026-10-18',
  // cols-20261016-C7
  '635': '2026-10-18',
  // cols-20261016-C8
  '636': '2026-10-18',
  // cols-20261019-C3
  '637': '2026-10-20',
  // cols-20261019-C4
  '638': '2026-10-20',
  // cols-20261019-C1
  '639': '2026-10-20',
  // cols-20261019-C2
  '640': '2026-10-20',
  '641': '2026-10-21',
  // ship-20261022-P-CIV
  '642': '2026-10-22',
  // ship-20261022-P-CORP
  '643': '2026-10-22',
  // ship-20261022-P-CRIM
  '644': '2026-10-22',
  // ship-20261022-G1
  '647': '2026-10-22',
  // ship-20261022-G2
  '648': '2026-10-22',
  // ship-20261022-G3
  '649': '2026-10-22',
  // ship-20261022-G4
  '650': '2026-10-22',
  // ship-20261022-G5
  '651': '2026-10-22',
  // ship-20261022-G6
  '652': '2026-10-22',
  // esfr-20261022 (fr-only)
  '653': '2026-10-22',
  '654': '2026-10-22',
  '655': '2026-10-22',
  '656': '2026-10-22',
  '657': '2026-10-22',
  '658': '2026-10-22',
  // nine-market-20261023
  '659': '2026-10-23',
  '660': '2026-10-23',
  '661': '2026-10-23',
  '662': '2026-10-23',
  '663': '2026-10-23',
  '664': '2026-10-23',
  '665': '2026-10-23',
  '666': '2026-10-23',
  '667': '2026-10-23',
  '668': '2026-10-23',
  '669': '2026-10-23',
  '670': '2026-10-23',
  '671': '2026-10-23',
  '672': '2026-10-23',
  '673': '2026-10-23',
  '674': '2026-10-23',
  '675': '2026-10-23',
  '676': '2026-10-23',
  '677': '2026-10-23',
  '678': '2026-10-23',
  '679': '2026-10-23',
  '680': '2026-10-23',
  '681': '2026-10-23',
  '682': '2026-10-23',
  '683': '2026-10-23',
  '684': '2026-10-23',
  '685': '2026-10-23',
  '686': '2026-10-23',
  '687': '2026-10-23',
  '688': '2026-10-23',
  '689': '2026-10-23',
  '690': '2026-10-23',
  '691': '2026-10-23',
  '692': '2026-10-23',
  '693': '2026-10-23',
  '694': '2026-10-23',
  '695': '2026-10-23',
  '696': '2026-10-23',
  '697': '2026-10-23',
  '698': '2026-10-23',
  '699': '2026-10-23',
  '700': '2026-10-23',
  '701': '2026-10-23',
  '702': '2026-10-23',
  '703': '2026-10-23',
  '704': '2026-10-24',
  '705': '2026-10-24',
  '706': '2026-10-24',
  // ja-gap-20261024
  '711': '2026-10-24',
  '712': '2026-10-24',
  '713': '2026-10-24',
  '714': '2026-10-24',
  '715': '2026-10-24',
  '716': '2026-10-24',
  '717': '2026-10-24',
  '718': '2026-10-24',
  '719': '2026-10-24',
  '720': '2026-10-24',
  '801': '2026-10-24', // world-columns-20261024
  '802': '2026-10-24', // world-columns-20261024
  '803': '2026-10-24', // world-columns-20261024
  '804': '2026-10-24', // world-columns-20261024
  '805': '2026-10-24', // world-columns-20261024
  '806': '2026-10-24', // world-columns-20261024
  '807': '2026-10-24', // world-columns-20261024
  '808': '2026-10-24', // world-columns-20261024
  '809': '2026-10-24', // world-columns-20261024
  '813': '2026-10-24', // world-columns-20261024
  '814': '2026-10-24', // world-columns-20261024
  '815': '2026-10-24', // world-columns-20261024
  '819': '2026-10-24', // world-columns-20261024
  '820': '2026-10-24', // world-columns-20261024
  '821': '2026-10-24', // world-columns-20261024
  '822': '2026-10-24', // world-columns-20261024
  '823': '2026-10-24', // world-columns-20261024
  '824': '2026-10-24', // world-columns-20261024
  '825': '2026-10-24', // world-columns-20261024
  '826': '2026-10-24', // world-columns-20261024
  '827': '2026-10-24', // world-columns-20261024
  '828': '2026-10-24', // world-columns-20261024
  '829': '2026-10-24', // world-columns-20261024
  '830': '2026-10-24', // world-columns-20261024
  '831': '2026-10-24', // world-columns-20261024
  '832': '2026-10-24', // world-columns-20261024
  '833': '2026-10-24', // world-columns-20261024
  '834': '2026-10-24', // world-columns-20261024
  '835': '2026-10-24', // world-columns-20261024
  '836': '2026-10-24', // world-columns-20261024
  '855': '2026-10-24', // world-columns-20261024
  '856': '2026-10-24', // world-columns-20261024
  '857': '2026-10-24', // world-columns-20261024
  '858': '2026-10-24', // world-columns-20261024
  '859': '2026-10-24', // world-columns-20261024
  '860': '2026-10-24', // world-columns-20261024
  '864': '2026-10-24', // world-columns-20261024
  '865': '2026-10-24', // world-columns-20261024
  '866': '2026-10-24', // world-columns-20261024
  '870': '2026-10-24', // world-columns-20261024
  '871': '2026-10-24', // world-columns-20261024
  '872': '2026-10-24', // world-columns-20261024
  '873': '2026-10-24', // world-columns-20261024
  '874': '2026-10-24', // world-columns-20261024
  '875': '2026-10-24', // world-columns-20261024
  '897': '2026-10-24', // world-columns-20261024
  '898': '2026-10-24', // world-columns-20261024
  '899': '2026-10-24', // world-columns-20261024
  '879': '2026-10-24', // world-columns-20261024
  '880': '2026-10-24', // world-columns-20261024
  '881': '2026-10-24', // world-columns-20261024
  '816': '2026-10-24', // world-columns-20261024
  '817': '2026-10-24', // world-columns-20261024
  '818': '2026-10-24', // world-columns-20261024
  '810': '2026-10-24', // world-columns-20261024
  '811': '2026-10-24', // world-columns-20261024
  '812': '2026-10-24', // world-columns-20261024
  '837': '2026-10-24', // world-columns-20261024
  '838': '2026-10-24', // world-columns-20261024
  '839': '2026-10-24', // world-columns-20261024
  '840': '2026-10-24', // world-columns-20261024
  '841': '2026-10-24', // world-columns-20261024
  '842': '2026-10-24', // world-columns-20261024
  '861': '2026-10-24', // world-columns-20261024
  '862': '2026-10-24', // world-columns-20261024
  '863': '2026-10-24', // world-columns-20261024
  '876': '2026-10-24', // world-columns-20261024
  '877': '2026-10-24', // world-columns-20261024
  '878': '2026-10-24', // world-columns-20261024
  '882': '2026-10-24', // world-columns-20261024
  '883': '2026-10-24', // world-columns-20261024
  '884': '2026-10-24', // world-columns-20261024
  '885': '2026-10-24', // world-columns-20261024
  '886': '2026-10-24', // world-columns-20261024
  '887': '2026-10-24', // world-columns-20261024
  '888': '2026-10-24', // world-columns-20261024
  '889': '2026-10-24', // world-columns-20261024
  '890': '2026-10-24', // world-columns-20261024
  '846': '2026-10-24', // world-columns-20261024
  '847': '2026-10-24', // world-columns-20261024
  '848': '2026-10-24', // world-columns-20261024
  '867': '2026-10-24', // world-columns-20261024
  '868': '2026-10-24', // world-columns-20261024
  '869': '2026-10-24', // world-columns-20261024
  '843': '2026-10-24', // world-columns-20261024
  '844': '2026-10-24', // world-columns-20261024
  '845': '2026-10-24', // world-columns-20261024
  '849': '2026-10-24', // world-columns-20261024
  '850': '2026-10-24', // world-columns-20261024
  '851': '2026-10-24', // world-columns-20261024
  '852': '2026-10-24', // world-columns-20261024
  '853': '2026-10-24', // world-columns-20261024
  '854': '2026-10-24', // world-columns-20261024
  '891': '2026-10-24', // world-columns-20261024
  '892': '2026-10-24', // world-columns-20261024
  '893': '2026-10-24', // world-columns-20261024
  '894': '2026-10-24', // world-columns-20261024
  '895': '2026-10-24', // world-columns-20261024
  '896': '2026-10-24', // world-columns-20261024
  '900': '2026-10-24', // world-columns-20261024
  '901': '2026-10-24', // world-columns-20261024
  '902': '2026-10-24', // world-columns-20261024
  '903': '2026-10-24', // world-columns-20261024
  '904': '2026-10-24', // world-columns-20261024
  '905': '2026-10-24', // world-columns-20261024
  '906': '2026-10-25', // case-trends-20261025
  '907': '2026-10-25',
  '908': '2026-10-25',
  '909': '2026-10-25',
  '910': '2026-10-25',
  '911': '2026-10-25',
  '912': '2026-10-25',
  '913': '2026-10-25',
  '914': '2026-10-25',
  '915': '2026-10-25',
  '916': '2026-10-25',
  '917': '2026-10-25',
  '918': '2026-10-25',
  '919': '2026-10-25',
  '920': '2026-10-25',
  '921': '2026-10-25',
  // market-expansion-20261025
  '922': '2026-10-25',
  '923': '2026-10-25',
  '924': '2026-10-25',
  '925': '2026-10-25',
  '926': '2026-10-25',
  '927': '2026-10-25',
  '928': '2026-10-25',
  '929': '2026-10-25',
  '930': '2026-10-25',
  '931': '2026-10-25',
  '932': '2026-10-25',
  '933': '2026-10-25',
  '934': '2026-10-25',
  '935': '2026-10-25',
  '936': '2026-10-25',
  '937': '2026-10-25',
  '938': '2026-10-25',
  '939': '2026-10-25',
  '940': '2026-10-25',
  '941': '2026-10-25',
  '942': '2026-10-25',
  '943': '2026-10-25',
  '944': '2026-10-25',
  '945': '2026-10-25',
  // ship-20261026-G1
  '946': '2026-10-26',
  // ship-20261026-G2
  '947': '2026-10-26',
  // ship-20261026-G3
  '948': '2026-10-26',
  // ship-20261026-G4
  '949': '2026-10-26',
  // ship-20261026-G5
  '950': '2026-10-26',
  // ship-20261026-G6
  '951': '2026-10-26',
  // ship-20261027-G1
  '952': '2026-10-27',
  // ship-20261027-G2
  '953': '2026-10-27',
  // ship-20261027-G3
  '954': '2026-10-27',
  // ship-20261027-G4
  '955': '2026-10-27',
  // ship-20261027-G5
  '956': '2026-10-27',
  // ship-20261027-G6
  '957': '2026-10-27',
  // ship-20261028-G1
  '958': '2026-10-28',
  // ship-20261028-G2
  '959': '2026-10-28',
  // ship-20261028-G3
  '960': '2026-10-28',
};

// Columns revised after the 2026-09-28 Fable review were re-dated to that day (user
// decision 2026-09-28); these locales derive the publication date from date_display.
// The review's unchanged PASS files (ja 021-023) keep 2026-09-27.
const REDATED_20260928: Record<string, readonly string[]> = {
  ko: ['019', '020', '021', '022', '023'],
  'zh-hant': ['019', '020', '021', '022', '023'],
  en: ['019', '020', '021', '022', '023'],
  ja: ['019', '020'],
};

function verifiedPublicationDate(locale: string, prefix: string): string {
  if (Object.values(CRIMINAL_COLUMN_FILES_20261008).flat().some((file) => file.startsWith(`${prefix}-`))) {
    return '2026-10-08';
  }
  return REDATED_20260928[locale]?.includes(prefix)
    ? '2026-09-28'
    : VERIFIED_PUBLICATION_DATES[prefix] ?? taxAccountingPublicationDate(prefix)!;
}

const CONTENT_DIR_BY_LOCALE = {
  ko: 'columns',
  'zh-hant': 'columns-zh',
  en: 'columns-en',
  ja: 'columns-ja',
} as const;

function expectedDisplay(locale: keyof typeof CONTENT_DIR_BY_LOCALE, publicationDate: string): string {
  const [year, month, day] = publicationDate.split('-').map(Number);
  if (locale === 'ko') return `${year}년 ${month}월 ${day}일`;
  if (locale === 'zh-hant' || locale === 'ja') return `${year}年${month}月${day}日`;
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

const SEMICONDUCTOR_SLUG = 'taiwan-semiconductor-market-entry';

const NEW_DIVORCE_SLUGS = [
  'taiwanese-spouse-divorce-agreement-registration',
  'taiwanese-spouse-divorce-from-abroad',
  'taiwanese-spouse-divorce-cross-border-parenting',
];

// 2026-09-29 gap columns (024-031): newest in the archive, in source order.
const GAP_COLUMN_SLUGS = [
  'taiwan-income-tax-residency',
  'taiwan-estate-tax-foreign-decedent',
  'foreign-heir-taiwan-succession-law-land',
  'taiwan-employment-gold-card',
  'taiwan-foreign-spouse-residence',
  'taiwan-permanent-residence-aprc',
  'enforce-foreign-judgment-in-taiwan',
  'hire-taiwan-lawyer-from-abroad',
];
const GAP = GAP_COLUMN_SLUGS.length;

// 2026-09-30 expertise columns in the Korean archive (043, 046, 048): newest, in source order.
const KO_EXPERTISE_SLUGS = archiveLeadSlugsFor('ko'); // 051…059 (2026-10-01, source order) then the 2026-09-30 batch
const KO_LEAD = KO_EXPERTISE_SLUGS.length;

const EXPECTED_ARCHIVE_ORDER = [
  ...KO_EXPERTISE_SLUGS,
  ...GAP_COLUMN_SLUGS,
  ...NEW_DIVORCE_SLUGS,
  'marrying-taiwanese-national-registration-checklist',
  'baby-taiwan-nationality-birth-registration',
  SEMICONDUCTOR_SLUG,
  COSMETICS_SLUG,
  'taiwan-company-establishment-basics',
  'withdraw-capital-taiwan-company',
  'taiwan-traffic-accident-procedure',
  'taiwan-company-subsidiary-vs-branch',
  'taiwan-company-establishment-advanced-2',
  'taiwan-massage-history-law',
  'taiwan-divorce-lawsuit-qna',
  'taiwan-labor-severance-law',
  'taiwan-voluntary-resignation-severance',
  'taiwan-gym-injury-lawsuit',
  'taiwan-overtaking-accident-liability',
  'taiwan-company-establishment-advanced-1',
  'taiwan-mandatory-employment-period',
  'taiwan-company-setup-pitch-location',
  'taiwan-inheritance-custody-analysis',
  'taiwan-logistics-business-setup',
];

describe('Korean column publication dates', () => {
  it('keeps later lastmod metadata while displaying the original publication date', () => {
    const posts = getAllColumnPosts('ko');
    const cosmetics = posts.find((post) => post.slug === COSMETICS_SLUG);
    const updatedTrafficGuide = posts.find((post) => post.slug === 'taiwan-traffic-accident-procedure');

    expect(cosmetics).toMatchObject({
      publicationDate: '2026-02-04',
      date: '2026-10-12',
      dateDisplay: '2026년 2월 4일',
    });
    expect(updatedTrafficGuide).toMatchObject({
      publicationDate: '2025-09-13',
      date: '2026-10-12',
      dateDisplay: '2025년 9월 13일',
    });
  });

  it('sorts newest-first and keeps equal-date posts in source order', () => {
    const posts = getAllColumnPosts('ko');

    expect(posts.map((post) => post.slug)).toEqual(EXPECTED_ARCHIVE_ORDER);
    expect(posts.slice(0, KO_LEAD).map((post) => post.slug)).toEqual(KO_EXPERTISE_SLUGS);
    expect(posts.slice(KO_LEAD, KO_LEAD + GAP).map((post) => post.slug)).toEqual(GAP_COLUMN_SLUGS);
    expect(posts.slice(KO_LEAD + GAP, KO_LEAD + GAP + 3).map((post) => post.slug)).toEqual(NEW_DIVORCE_SLUGS);
    expect(posts[KO_LEAD + GAP + 5]?.slug).toBe(SEMICONDUCTOR_SLUG);
    expect(posts[KO_LEAD + GAP + 6]?.slug).toBe(COSMETICS_SLUG);
    expect(posts.slice(KO_LEAD + GAP + 7).every((post) => post.dateDisplay === '2025년 9월 13일')).toBe(true);
  });

  it('formats every Korean archive date as YYYY년 M월 D일', () => {
    const posts = getAllColumnPosts('ko');

    expect(posts).toHaveLength(31 + KO_LEAD);
    expect(posts.every((post) => /^\d{4}년 \d{1,2}월 \d{1,2}일$/.test(post.dateDisplay))).toBe(true);
  });
});

describe('localized column publication ordering', () => {
  it.each(Object.entries(CONTENT_DIR_BY_LOCALE))(
    'stores every verified localized publication display in %s frontmatter',
    (localeValue, directory) => {
      const locale = localeValue as keyof typeof CONTENT_DIR_BY_LOCALE;
      const contentDir = path.join(process.cwd(), 'src', 'content', directory);
      const files = fs.readdirSync(contentDir).filter((file) => file.endsWith('.md'));

      const nativeCount =
        locale in NATIVE_LOCALE_COLUMN_FILES
          ? NATIVE_LOCALE_COLUMN_FILES[locale as keyof typeof NATIVE_LOCALE_COLUMN_FILES].length
          : 0;
      const expertiseCount = expertiseSlugsFor(locale).length; // 041–048 subset + 050 traffic
      expect(files).toHaveLength(31 + nativeCount + expertiseCount);
      for (const file of files) {
        const prefix = file.slice(0, 3);
        const verifiedDate = verifiedPublicationDate(locale, prefix);
        const { data } = matter(fs.readFileSync(path.join(contentDir, file), 'utf8'));

        expect(data.date_display, file).toBe(expectedDisplay(locale, verifiedDate));
      }
    },
  );

  it.each([
    ['ko', '2026년 9월 17일'],
    ['zh-hant', '2026年9月17日'],
    ['en', 'September 17, 2026'],
    ['ja', '2026年9月17日'],
  ] as const)('uses the verified publication date in %s', (locale, expectedDateDisplay) => {
    const allPosts = getAllColumnPosts(locale);
    // The 2026-09-30 expertise columns (a per-locale subset of 041-048) lead the archive.
    const expertiseSlugs = archiveLeadSlugsFor(locale);
    const lead = expertiseSlugs.length;
    expect(allPosts.slice(0, lead).map((post) => post.slug)).toEqual(expertiseSlugs);
    expect(allPosts.slice(0, lead).map((post) => post.publicationDate)).toEqual(
      expertiseSlugs.map((slug) => archiveLeadPublicationDate(slug, locale)),
    );
    // Native single-locale columns share the 2026-09-29 date with the gap columns (024-031),
    // so equal-date source order places them right after that batch; the shared corpus follows.
    const natives = allPosts.filter((post) => isNativeLocaleColumnSlug(post.slug));
    expect(allPosts.slice(lead + GAP, lead + GAP + natives.length)).toEqual(natives);
    expect(natives.every((post) => post.publicationDate === '2026-09-29')).toBe(true);
    const posts = allPosts.filter(
      (post) => !isNativeLocaleColumnSlug(post.slug) && !expertiseSlugs.includes(post.slug),
    );

    expect(posts.slice(0, GAP).map((post) => post.publicationDate)).toEqual(
      ['024', '025', '026', '027', '028', '029', '030', '031'].map((prefix) =>
        verifiedPublicationDate(locale, prefix),
      ),
    );
    expect(posts.slice(GAP, GAP + 3).map((post) => post.publicationDate)).toEqual(
      ['019', '020', '021'].map((prefix) => verifiedPublicationDate(locale, prefix)),
    );
    expect(posts[GAP + 5]).toMatchObject({
      slug: SEMICONDUCTOR_SLUG,
      publicationDate: '2026-09-17',
      dateDisplay: expectedDateDisplay,
    });
    expect(posts[GAP + 6]).toMatchObject({
      slug: COSMETICS_SLUG,
      publicationDate: '2026-02-04',
    });
    expect(posts.slice(GAP + 7).every((post) => post.publicationDate === '2025-09-13')).toBe(true);
  });

  it('keeps input order for equal publication dates regardless of lastmod', () => {
    const makePost = (
      slug: string,
      publicationDate: string,
      date: string,
    ): ColumnPost => ({
      slug,
      title: slug,
      publicationDate,
      date,
      dateDisplay: publicationDate,
      readTime: '',
      category: 'legal',
      categoryLabel: '법률정보',
      featuredImage: '',
      content: '',
      summary: '',
    });
    const posts = [
      makePost('first-source', '2025-09-13', '2035-01-01'),
      makePost('newer-publication', '2026-02-04', '2026-02-05'),
      makePost('second-source', '2025-09-13', '2025-09-13'),
    ];

    expect(sortColumnPostsNewestFirst(posts).map((post) => post.slug)).toEqual([
      'newer-publication',
      'first-source',
      'second-source',
    ]);
  });
});

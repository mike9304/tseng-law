/**
 * German, Spanish, French, Portuguese, Russian, Turkish, Italian, Dutch and
 * Polish guidance packs.
 * Same contract as vi/id/th/fil/ar: page language ≠ consultation language
 * (except as noted for Chinese on the Simplified Chinese pack). Consultations
 * are only English, Chinese, Japanese and Korean. No interpreter, reply-time,
 * appointment, fee figure, outcome or residency promise.
 */
import type { GuidanceLocaleContent } from '@/data/international-guidance-content';
export {
  dutchGuidanceContent,
  italianGuidanceContent,
  polishGuidanceContent,
} from '@/data/international-guidance-it-nl-pl';

export const germanGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Deutsch',
  nav: {
    home: 'Startseite',
    services: 'Tätigkeitsfelder',
    about: 'Die Kanzlei',
    lawyers: 'Anwältinnen und Anwälte',
    pricing: 'Umfang und Kosten',
    contact: 'Kontakt',
    faq: 'Häufige Fragen',
    privacy: 'Datenschutz',
    disclaimer: 'Haftungsausschluss',
    columns: 'Beiträge',
  },
  contactCta: 'Beratungsanfrage senden',
  footerNotice:
    'Diese deutsche Seite enthält nur allgemeine Hinweise zur Arbeit der Kanzlei nach taiwanischem Recht. Sie ist keine Rechtsberatung für einen konkreten Fall, und das Absenden einer Nachricht begründet für sich kein Mandatsverhältnis.',
  skipLink: 'Navigation überspringen und zum Inhalt',
  menuLabel: 'Seitenverzeichnis',
  languageLabel: 'Anzeigesprache',
  mega: {
    services: {
      description: 'Die Kanzlei bearbeitet die wesentlichen Tätigkeitsgruppen nach taiwanischem Recht.',
      viewAllLabel: 'Alle anzeigen',
    },
    columns: {
      description: 'Beiträge zu häufigen Fragen des taiwanischen Rechts.',
      viewAllLabel: 'Alle anzeigen',
    },
    lawyers: {
      description: 'Vorstellung der tätigen Anwältinnen und Anwälte und der Kontaktwege.',
      viewAllLabel: 'Alle anzeigen',
    },
    pricing: {
      description: 'Diese Seite erklärt den Arbeitsumfang und, wie Kosten geklärt werden.',
      viewAllLabel: 'Alle anzeigen',
    },
    faq: {
      description: 'Häufige Fragen zur Arbeit der Kanzlei in Taiwan.',
      viewAllLabel: 'Alle anzeigen',
    },
  },
  notFoundTitle: 'Seite nicht gefunden',
  notFoundText:
    'Die gesuchte Seite gibt es nicht oder sie wurde verschoben. Sie können zur deutschen Startseite zurückkehren, um die verfügbaren Hinweise zu sehen.',
  backHomeLabel: 'Zur Startseite',
  readSourceLabel: 'Beitragsliste in der Originalsprache öffnen',
  home: {
    heroScrollLabel: 'Nach unten scrollen',
    heroColumnsCtaLabel: 'Beiträge ansehen',
    servicesDetailLabel: 'Details ansehen',
    servicesAssistanceBefore: 'Wenn unklar ist, zu welcher Gruppe Ihr Anliegen gehört, erläutert die Seite ',
    servicesAssistanceLinkLabel: 'Kontakt',
    servicesAssistanceAfter:
      ', wie Sie eine Zusammenfassung formulieren, die eine Anwältin oder ein Anwalt prüft.',
    columnsViewAllLabel: 'Alle Beiträge ansehen',
    columnsReadMoreLabel: 'Weiterlesen',
    columnsReviewLabel: 'Geprüft von Rechtsanwältin Wei Tseng',
    columnsOriginalLanguageBadge: 'Originalsprache',
    columnsOriginalLanguageNote:
      'Die folgenden Beiträge liegen noch nicht auf Deutsch vor. Die Liste bleibt in der Originalsprache und öffnet die jeweilige Sprachseite; der Inhalt wird nicht automatisch übersetzt.',
    imageBandAlt: 'Traditionelles taiwanisches Sanheyuan (三合院) und ein moderner Pavillon bei Tageslicht',
    videoPauseLabel: 'Video anhalten',
    videoPlayLabel: 'Video abspielen',
    videoReplayLabel: 'Video erneut abspielen',
  },
  pages: {
    home: {
      eyebrow: 'HINWEISE',
      title: 'Rechtsdienstleistungen in Taiwan — Hinweise auf Deutsch',
      description:
        'Allgemeine Erläuterungen auf Deutsch zum Tätigkeitsbereich von Hovering International Law Firm in Taiwan, zu den Beratungssprachen und zum ersten Kontakt.',
      intro:
        'Hovering International Law Firm begleitet Mandanten aus dem Ausland, auch solche mit Bezug zu Taiwan, in Angelegenheiten nach taiwanischem Recht: Investition und Gesellschaftsgründung, zivilrechtliche Streitigkeiten, Ehe-, Familien- und Erbsachen, Arbeitsrecht, Strafsachen und geistiges Eigentum. Dieser deutsche Teil hilft Ihnen zu erkennen, welche Arbeit in unseren Tätigkeitsbereich fällt, was vorzubereiten ist und wie Sie uns erreichen. Es handelt sich um allgemeine Angaben, nicht um Rechtsberatung für Ihren eigenen Fall.',
      sections: [
        {
          heading: 'Was wir tun',
          paragraphs: [
            'Hovering International Law Firm ist eine in Taiwan niedergelassene Anwaltskanzlei. Sie arbeitet nach taiwanischem Recht und unterhält Büros in Taipeh (臺北), Kaohsiung (高雄), Taichung (臺中) und Pingtung (屏東). Wir beraten Unternehmen und führen Verfahren vor Gericht und begleiten Mandanten aus dem Ausland durch die in Taiwan erforderlichen Schritte.',
            'Der gesamte Inhalt hier ist allgemein. Der Ausgang einer Sache hängt von den Tatsachen, den anwendbaren Vorschriften und dem Zeitpunkt ab. Diese Hinweise ersetzen nicht das Gespräch mit einer Anwältin oder einem Anwalt über Ihre Unterlagen.',
          ],
        },
        {
          heading: 'Seitensprache und Beratungssprache sind nicht dasselbe',
          paragraphs: [
            'Diese Seite ist auf Deutsch geschrieben, aber die Beratung durch eine Anwältin oder einen Anwalt erfolgt nur in den vier Beratungssprachen Englisch, Chinesisch (中文), Japanisch und Koreanisch. Das Lesen der deutschen Hinweise bedeutet nicht, dass das Gespräch mit der Anwältin oder dem Anwalt auf Deutsch stattfindet.',
            'Wir versprechen keinen Dolmetscher, keine Antwortfrist und keinen Termin über diese Seite. Wenn Sie keine der vier Sprachen nutzen können, erläutert die Seite „Kontakt“, wie wir eine Kommunikationsweise prüfen.',
          ],
        },
        {
          heading: 'Tätigkeitsgruppen',
          paragraphs: [
            'Der Tätigkeitsbereich umfasst die folgenden sechs Gruppen. Die Seite „Tätigkeitsfelder“ beschreibt jede Gruppe genauer und nennt, was nicht zugesagt wird.',
          ],
          items: [
            'Investition und Gesellschaftsgründung in Taiwan',
            'Zivilsachen und Schadensersatz',
            'Ehe, Familie und Erbrecht',
            'Arbeitsrechtliche Streitigkeiten',
            'Strafsachen',
            'Geistiges Eigentum: Marken, Patente und Urheberrecht',
          ],
        },
        {
          heading: 'Wo Sie beginnen sollten',
          paragraphs: [
            'Lesen Sie die Seite „Tätigkeitsfelder“, um zu prüfen, ob Ihr Anliegen in unseren Tätigkeitsbereich fällt, danach „Umfang und Kosten“ sowie „Kontakt“, um zu erfahren, wie der Umfang festgelegt und die Kosten vor Beginn der Arbeit bestätigt werden.',
            'Beim Senden einer Nachricht dürfen Sie die Zusammenfassung in Ihrer eigenen Sprache schreiben. Der Originaltext wird so gespeichert, wie Sie ihn geschrieben haben, und nicht automatisch übersetzt. Eine gesendete Nachricht ist eine Anfrage, die auf Prüfung wartet: Das ist noch keine Beratung und noch kein bestätigter Termin.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'TÄTIGKEITSFELDER',
      title: 'Welche Angelegenheiten wir bearbeiten',
      description:
        'Sechs Tätigkeitsgruppen der Kanzlei in Taiwan und die Grenzen, die Sie zuerst kennen sollten.',
      intro:
        'Nachfolgend die Gruppen, die wir tatsächlich bearbeiten, und Fragen, die in der Anfangsphase häufig gestellt werden. Die Darstellung hilft Ihnen zu beurteilen, ob Ihr Anliegen in unseren Tätigkeitsbereich fällt; sie ist allgemein und keine rechtliche Analyse eines einzelnen Vorgangs.',
      sections: [
        {
          heading: 'Investition und Gesellschaftsgründung in Taiwan',
          paragraphs: [
            'Wir begleiten ausländische Investoren und Unternehmen bei der Gründung oder dem Betrieb einer Gesellschaft in Taiwan: Wahl der Rechtsform, Vorbereitung und Einreichung von Unterlagen, Kapitaleinlage, Bankangelegenheiten, Prüfung des Betriebsortes sowie branchenspezifische Anforderungen. Wir unterstützen auch Buchhaltung und Steuern, die aus Gründung und Betrieb in Taiwan entstehen.',
            'Ablauf und Dauer unterscheiden sich nach Rechtsform, Investor, Branche, Bank und vorhandenen Unterlagen. Eine Gesellschaftsgründung führt nicht von selbst zu einem Aufenthaltstitel (居留) oder einer Arbeitserlaubnis (工作許可): Das sind gesonderte Verfahren, die nach der Lage der jeweiligen Person beurteilt werden.',
          ],
        },
        {
          heading: 'Zivilsachen und Schadensersatz',
          paragraphs: [
            'Diese Gruppe umfasst Vertragsstreitigkeiten, Schadensersatz aus unerlaubter Handlung und Verbraucherstreitigkeiten. Die Arbeit beginnt in der Regel mit einer Chronologie, der Prüfung vorhandener Unterlagen und Beweise und erst danach mit den nächsten Schritten.',
            'Fristen, einschließlich gesetzlicher Klagefristen, und die Vollständigkeit der Beweise prägen den Verlauf. Nennen Sie daher bekannte Daten möglichst früh. Bewahren Sie Verträge, Nachrichten, Zahlungsbelege oder Fotos der Lage vor Ort auf und erwähnen Sie sie in der ersten Nachricht.',
          ],
        },
        {
          heading: 'Ehe, Familie und Erbrecht',
          paragraphs: [
            'Wir bearbeiten Scheidung (離婚), Vermögensauseinandersetzung, Ausübung und Tragung der Rechte und Pflichten gegenüber minderjährigen Kindern (未成年子女權利義務之行使或負擔), Umgang (會面交往) und Erbrecht (繼承), auch wenn Parteien oder Vermögen in verschiedenen Staaten liegen. Grenzüberschreitende Familiensachen erfordern oft zusätzliche Prüfung von Haushaltsregisterunterlagen (戶籍), der Form von Urkunden und ihrer Beweisbarkeit in Taiwan.',
            'Weil Familiensachen häufig Fristen und parallele Verfahren mit sich bringen, sollte die erste Zusammenfassung das Verhältnis der Parteien, den aktuellen Wohnort und bereits laufende Verfahren nennen.',
          ],
        },
        {
          heading: 'Arbeitsrechtliche Streitigkeiten',
          paragraphs: [
            'Diese Gruppe umfasst Beendigung des Arbeitsverhältnisses, Abfindung nach taiwanischem Recht (資遣費; nicht mit Instituten anderer Staaten gleichzusetzen), Lohn und Streitigkeiten aus dem Arbeitsvertrag (勞動契約), sowohl auf Arbeitnehmer- als auch auf Arbeitgeberseite. Bei der Prüfung trennen wir den Beendigungsgrund von Fragen der Ankündigung, der Zahlung und der Fristen.',
            'Arbeitsvertrag, Betriebsordnung (工作規則), Gehaltsabrechnungen und der Schriftwechsel der Parteien sind meist die entscheidenden Unterlagen. Wenn Sie sie noch haben, erwähnen Sie das in der Zusammenfassung.',
          ],
        },
        {
          heading: 'Strafsachen',
          paragraphs: [
            'Wir begleiten im Ermittlungsverfahren und vor Gericht, für Beschuldigte oder Angeklagte ebenso wie für Verletzte, und bewerten strafrechtliche Risiken unternehmerischer Tätigkeit.',
            'Strafsachen haben oft kurze Fristen und festgelegte Stufen. Wenn Sie bereits ein Schreiben der Strafverfolgungsbehörde oder des Gerichts erhalten haben, nennen Sie das Datum auf dem Schreiben früh, damit der Inhalt in der richtigen Reihenfolge geprüft wird.',
          ],
        },
        {
          heading: 'Geistiges Eigentum',
          paragraphs: [
            'Wir unterstützen bei der Eintragung von Marken (商標) und Patenten (專利), bei Urheberrecht und bei Streitigkeiten über diese Rechte in Taiwan.',
            'In dieser Gruppe entscheidet die Reihenfolge der Schritte: Schutzumfang, Anmeldezeitpunkt und tatsächliche Benutzung beeinflussen die Wahl. Das Einreichen eines Antrags bedeutet nicht von selbst, dass er bewilligt wird.',
          ],
        },
        {
          heading: 'Umfang und seine Bestätigung',
          paragraphs: [
            'Die Kanzlei arbeitet nach taiwanischem Recht und bearbeitet Angelegenheiten der oben genannten Gruppen. Der Umfang jeder Sache wird gesondert bestätigt, nachdem eine Anwältin oder ein Anwalt Ihre Nachricht geprüft hat.',
            'Aufenthaltsstatus, Arbeitserlaubnis und vergleichbare Fragen werden aus den Unterlagen und der Lage der jeweiligen Person beurteilt, nicht aus der Staatsangehörigkeit. Wenn ein Teil Ihres Anliegens solche Fragen berührt, nennen Sie das bei der Kontaktaufnahme. Diese Seite verspricht weder ein Ergebnis noch eine Antwortfrist.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'DIE KANZLEI',
      title: 'Über Hovering International Law Firm',
      description:
        'Grundangaben zu dieser taiwanischen Anwaltskanzlei, ihren Büros und der Arbeit mit ausländischen Beteiligten.',
      intro:
        'Hovering International Law Firm ist eine Anwaltskanzlei in Taiwan. Die Anwältinnen und Anwälte arbeiten von der Unternehmensberatung bis zum Gerichtsverfahren. Dieser Teil beschreibt die Entstehung der Kanzlei, die Standorte und die Arbeit mit ausländischen Beteiligten.',
      sections: [
        {
          heading: 'Gründung und Aufbau',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) wurde 2016 von Anwältinnen und Anwälten gegründet, die an der National Taiwan University (國立臺灣大學) studiert haben. Der chinesische Name 昊鼎 verbindet das Schriftzeichen 昊 („weiter Himmel“) mit 鼎 („fester Grund“) und beschreibt die Ausrichtung der Kanzlei seit der Gründung.',
            'Wir haben Büros in Taipeh (臺北), Kaohsiung (高雄), Taichung (臺中) und Pingtung (屏東). Das Büro Kaohsiung konzentriert sich auf Unternehmensführung und bearbeitet zivil-, straf- und verwaltungsrechtliche Streitigkeiten. Das Büro Taichung bearbeitet Bausachen, geistiges Eigentum und Angelegenheiten mit Bezug zu Korea und Japan. Das Büro Pingtung wurde 2017 für den örtlichen Bedarf eröffnet.',
            'Neben der anwaltlichen Arbeit besteht seit 2020 auch Hovering Accounting Office, das Buchhaltung und Steuerplanung für Unternehmer und vermögende Privatpersonen anbietet.',
          ],
        },
        {
          heading: 'Arbeit mit ausländischen Beteiligten',
          paragraphs: [
            'Die grenzüberschreitende Arbeit umfasst Gesellschaftsgründung, Visa, Marken- und Patentanmeldungen, rechtliche Risikoprüfung und steuerliche Beratung von Unternehmen. Das Büro Taichung bearbeitet insbesondere Bausachen, geistiges Eigentum und Angelegenheiten mit Bezug zu Korea und Japan. Rechtsanwältin Wei Tseng (曾雋崴) begleitet Mandanten aus Korea, Japan und andere internationale Mandanten in den genannten Gruppen.',
            'Ob wir eine Sache übernehmen können, hängt vom Inhalt und von der Sprache der Kommunikation ab. Fällt Ihr Anliegen in die genannten Gruppen und kann es in einer der vier Beratungssprachen besprochen werden, können Sie eine Zusammenfassung zur Prüfung senden.',
          ],
        },
        {
          heading: 'Wenn Sie uns kontaktieren',
          paragraphs: [
            'Nach Eingang Ihrer Zusammenfassung prüft eine Anwältin oder ein Anwalt den Inhalt und spricht dann über den möglichen Arbeitsumfang, noch benötigte Unterlagen und die nächsten Schritte. Bei steuerlichen oder buchhalterischen Fragen kann die Kanzlei mit der Buchhaltungsabteilung in einem Ablauf arbeiten.',
            'Das Ergebnis jeder Sache hängt von den Tatsachen und den vorhandenen Unterlagen ab; wir versprechen kein Ergebnis. Wenn Sie eine verbindliche Antwort für Ihre Lage brauchen, müssen die Unterlagen in einer der vier Beratungssprachen mit einer Anwältin oder einem Anwalt besprochen werden.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'ANWÄLTINNEN UND ANWÄLTE',
      title: 'Internationales Team von Hovering',
      description: 'Profile der Anwältinnen und Anwälte, der Betriebsleitung und der Partner-Wirtschaftsprüfung von Hovering.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'UMFANG UND KOSTEN',
      title: 'Wie Arbeitsumfang und Kosten festgelegt werden',
      description:
        'Erläuterung der Reihenfolge: zuerst der Arbeitsumfang, dann die Kostenbestätigung, und warum diese Seite keine Preisliste enthält.',
      intro:
        'Diese Seite erklärt, wie Kosten festgelegt werden, nicht deren Höhe. Die Höhe hängt vom Arbeitsumfang der jeweiligen Sache ab und ist erst sinnvoll, wenn dieser Umfang klar ist.',
      sections: [
        {
          heading: 'Zuerst wird der Arbeitsumfang festgelegt',
          paragraphs: [
            'Sachen derselben Art können sehr unterschiedlichen Aufwand haben, je nach Zahl der Beteiligten, vorhandenen Unterlagen, einzuhaltenden Fristen und danach, ob ein Verfahren bereits begonnen hat. Deshalb ist der erste Schritt stets, festzulegen, was zur Arbeit gehört und was nicht.',
            'Die Zusammenfassung, die Sie am Anfang senden, ist die Grundlage für diesen Umfang. Je klarer sie den Ablauf, Ihr Anliegen und die Fristen beschreibt, desto genauer kann der Umfang bestimmt werden.',
          ],
        },
        {
          heading: 'Kosten werden vor Beginn der Arbeit bestätigt',
          paragraphs: [
            'Ist der Arbeitsumfang klar, werden Höhe und Berechnungsweise der Kosten mit Ihnen besprochen und bestätigt, bevor die Arbeit beginnt. Ändert sich der Umfang unterwegs, muss das erneut bestätigt werden.',
            'Diese Seite ist kein Preisangebot und begründet keine Zahlungspflicht. Das Senden einer Anfrage über diese Seite ist ebenfalls kostenfrei.',
          ],
        },
        {
          heading: 'Die Beratung kann entgeltlich sein',
          paragraphs: [
            'Die Beratung durch eine Anwältin oder einen Anwalt kann eine entgeltliche Leistung sein. Diese Seite sagt nicht, dass das erste Gespräch kostenfrei ist, und kein Teil darf so gelesen werden.',
            'Ist die Beratung entgeltlich, werden Höhe und Zahlungsweise mitgeteilt, bevor sie stattfindet.',
          ],
        },
        {
          heading: 'Warum diese Seite keine Tarife nennt',
          paragraphs: [
            'Die Kosten hängen von der Sache selbst ab: vom Aufwand, der Zahl der Beteiligten, den Unterlagen, den Fristen und davon, ob ein Verfahren bereits läuft. Eine vorab gesetzte Zahl würde die Kosten für Ihren Vorgang nicht zeigen. Deshalb legen wir zuerst den Arbeitsumfang fest und teilen Ihnen dann die Kosten mit, bevor die Arbeit beginnt.',
            'Neben dem Anwaltshonorar können Gerichts-, Behörden- oder Drittkosten entstehen. Diese sind vom Honorar getrennt und hängen vom jeweiligen Verfahren ab.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'KONTAKT',
      title: 'Wie Sie die Kanzlei erreichen',
      description:
        'Seitensprache, Beratungssprachen, das Vorgehen, wenn Sie keine der vier Sprachen nutzen können, und was diese Seite nicht zusagt.',
      intro:
        'Bevor Sie uns schreiben, unterscheiden Sie bitte die folgenden drei Punkte. Sie werden oft vermischt, bedeuten aber Unterschiedliches.',
      sections: [
        {
          heading: 'Drei Dinge, die getrennt bleiben müssen',
          paragraphs: [
            'Die Anzeigesprache der Seite, die Beratungssprache mit der Anwältin oder dem Anwalt und die Sprache, in der Sie schreiben, sind drei getrennte Dinge.',
          ],
          items: [
            'Seitensprache: Diese Hinweise sind auf Deutsch geschrieben.',
            'Beratungssprache: Die Beratung erfolgt auf Englisch, Chinesisch (中文), Japanisch und Koreanisch.',
            'Ihre Schreibsprache: Sie dürfen die Zusammenfassung in Ihrer eigenen Sprache schreiben; der Originaltext wird unverändert gespeichert.',
          ],
        },
        {
          heading: 'Wenn Sie keine der vier Beratungssprachen nutzen können',
          paragraphs: [
            'Im Kontaktformular können Sie „Kommunikationsweise muss bestätigt werden“ wählen. Wir antworten, um eine gangbare Kommunikationsweise zu prüfen, wenn eine solche besteht; eine Leistung in einer anderen Sprache wird nicht gewährleistet und eine Antwortfrist nicht zugesagt.',
            'Das ist nur ein Prüfungsschritt, kein Versprechen. Wir versprechen keinen Dolmetscher, keine Leistung auf Deutsch oder in einer anderen Sprache außerhalb der vier genannten Sprachen, und nicht, dass wir jede Sache annehmen.',
          ],
        },
        {
          heading: 'Was in der ersten Nachricht stehen sollte',
          paragraphs: [
            'Nennen Sie, was geschehen ist, welche Hilfe Sie brauchen, welchen Bezug die Sache zu Taiwan hat und die Frist, falls Sie eine kennen. Wenn Sie bereits ein Schreiben eines Gerichts oder einer Behörde erhalten haben, nennen Sie das Datum auf dem Schreiben.',
            'In der Anfangsphase müssen Sie noch keine Passnummer, Ausweisnummer, Kontodaten, Krankenakte oder die gesamten Beweise senden. Warten Sie auf Hinweise der Anwältin oder des Anwalts und senden Sie sensible Unterlagen dann auf einem sicheren Weg.',
          ],
        },
        {
          heading: 'Was diese Seite nicht zusagt',
          paragraphs: [
            'Wir versprechen keine Antwortfrist, bestätigen keinen Termin über diese Seite, versprechen keine bestimmte Anwältin oder keinen bestimmten Anwalt und stellen keinen Dolmetscher. Schriftliche Übersetzung ist etwas anderes: Ihre Nachricht wird nicht automatisch übersetzt.',
            'Wenn Sie eine Anfrage senden, wird der Inhalt gespeichert und wartet auf Prüfung. Erhalten Sie nach einiger Zeit keine Antwort, können Sie erneut an die auf der Kontaktseite genannte E-Mail-Adresse schreiben.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'HÄUFIGE FRAGEN',
      title: 'Häufig gestellte Fragen',
      description:
        'Erläuterungen zu Tätigkeitsbereich, Vorbereitung, Sprachen, Kosten und zur Bedeutung einer gesendeten Anfrage.',
      intro:
        'Die folgenden Fragen werden auf der Ebene allgemeiner Angaben beantwortet. Eine Antwort für Ihren eigenen Fall ist erst möglich, nachdem eine Anwältin oder ein Anwalt die Unterlagen geprüft hat.',
      sections: [
        {
          heading: 'Wie Sie diesen Teil nutzen',
          paragraphs: [
            'Finden Sie keine Antwort auf Ihre Lage, hängt die Antwort meist von besonderen Tatsachen ab. Schreiben Sie diese Tatsachen dann in die Zusammenfassung, statt sie selbst aus dieser Seite abzuleiten.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Welche Angelegenheiten bearbeitet die Kanzlei?',
          answer:
            'Wir bearbeiten sechs Gruppen: Investition und Gesellschaftsgründung in Taiwan, Zivilsachen und Schadensersatz, Ehe, Familie und Erbrecht, arbeitsrechtliche Streitigkeiten, Strafsachen und geistiges Eigentum. Ob eine Sache angenommen wird, entscheidet sich nach Prüfung des Inhalts.',
        },
        {
          question: 'Was sollte ich vor der Kontaktaufnahme vorbereiten?',
          answer:
            'Bereiten Sie eine kurze Zusammenfassung des Ablaufs, Ihres Anliegens, des Bezugs zu Taiwan und der Frist vor, falls eine besteht. Liegt bereits ein Schreiben eines Gerichts oder einer Behörde vor, nennen Sie das Datum. In diesem Stadium müssen Sie noch keine Ausweisdokumente oder die gesamten Beweise senden.',
        },
        {
          question: 'Kann ich auf Deutsch beraten werden?',
          answer:
            'Nein. Diese Hinweise sind auf Deutsch geschrieben, aber die Beratung durch eine Anwältin oder einen Anwalt erfolgt nur auf Englisch, Chinesisch (中文), Japanisch und Koreanisch. Wir versprechen auch keinen Dolmetscher. Schriftliche Übersetzung ist etwas anderes: Der Originaltext, den Sie schreiben, wird so gespeichert und nicht automatisch übersetzt.',
        },
        {
          question: 'Was, wenn ich keine der vier Sprachen nutzen kann?',
          answer:
            'Wählen Sie beim Senden der Anfrage „Kommunikationsweise muss bestätigt werden“. Wir antworten, um eine Kommunikationsweise zu prüfen, aber eine Leistung in einer anderen Sprache wird nicht gewährleistet. Das ist ein Prüfungsschritt, kein Versprechen, dass wir in einer anderen Sprache arbeiten können.',
        },
        {
          question: 'Wie wird mein deutscher Text behandelt?',
          answer:
            'Der Originaltext, den Sie schreiben, wird so gespeichert, wie er ist, und nicht automatisch übersetzt. Falls nötig, wird die Sprache der weiteren Kommunikation mit Ihnen bestätigt.',
        },
        {
          question: 'Ist die Beratung schon erfolgt, wenn die Anfrage gesendet ist?',
          answer:
            'Nein. Eine gesendete Anfrage wartet auf Prüfung durch eine Anwältin oder einen Anwalt. Das ist keine Rechtsberatung, kein bestätigter Termin, und das Senden begründet für sich kein Mandatsverhältnis.',
        },
        {
          question: 'Wie werden die Kosten berechnet?',
          answer:
            'Zuerst wird der Arbeitsumfang festgelegt, danach werden Höhe und Berechnungsweise der Kosten mit Ihnen bestätigt, bevor die Arbeit beginnt. Diese Seite nennt keine Zahlen und sagt nicht, dass das erste Gespräch kostenfrei ist.',
        },
        {
          question: 'Was, wenn mein Anliegen sehr eilig ist?',
          answer:
            'Nennen Sie die Frist oder das Datum auf einem amtlichen Schreiben am Anfang Ihrer Zusammenfassung, damit diese Daten bei der Prüfung sichtbar sind. Diese Seite hat keinen Notfallkanal und gewährleistet keine Antwortfrist; wenn Ihr Anliegen nicht warten kann, sollten Sie parallel andere Wege an Ihrem Ort suchen.',
        },
      ],
    },
    privacy: {
      eyebrow: 'DATENSCHUTZ',
      title: 'Daten, die über das Kontaktformular erhoben werden',
      description:
        'Was das Kontaktformular in diesem deutschen Teil erhebt, wie der Originaltext behandelt wird und wie Sie uns zu Ihren Daten erreichen.',
      intro:
        'Dieser Teil betrifft nur das Kontaktformular auf diesen Hinweisseiten. Er beschreibt den Umgang mit Daten, nicht eine technische Garantie.',
      sections: [
        {
          heading: 'Welche Daten erhoben werden',
          paragraphs: [
            'Wenn Sie über das Formular in diesem Teil eine Anfrage senden, werden folgende Angaben festgehalten:',
          ],
          items: [
            'Der von Ihnen angegebene Name',
            'Die E-Mail-Adresse für die Antwort',
            'Die Anzeigesprache der Seite beim Senden',
            'Die Sprache, in der Sie geschrieben haben',
            'Die von Ihnen gewünschte Beratungssprache',
            'Der Originaltext, den Sie geschrieben haben',
            'Ihre Einwilligung zum Senden der Anfrage',
            'Eine Empfangsnummer, um die Anfrage wiederzufinden',
          ],
        },
        {
          heading: 'Der Originaltext wird unverändert gespeichert',
          paragraphs: [
            'Ihr Text wird genau so gespeichert, wie Sie ihn geschrieben haben, und nicht automatisch übersetzt. Ist eine Übersetzung für die Bearbeitung nötig, wird das gesondert mit Ihnen besprochen.',
            'Weil der Originaltext gespeichert wird, schreiben Sie in der Anfangsphase bitte nichts, das noch nicht nötig ist, etwa Passnummer, Ausweisnummer oder Kontodaten.',
          ],
        },
        {
          heading: 'Speicherort und Zugriff',
          paragraphs: [
            'Der Inhalt Ihrer Sendung wird an einem nicht öffentlich zugänglichen Ort gespeichert. Nur befugte Personen in der Kanzlei dürfen darauf zugreifen, um die Anfrage zu bearbeiten.',
            'Diese Seite gibt keine absolute Sicherheitsgarantie. Kein Übertragungsweg und kein Speicherort ist vollständig sicher; sensible Unterlagen sollten daher nur nach besonderer Anweisung der Anwältin oder des Anwalts gesendet werden.',
          ],
        },
        {
          heading: 'Zweck der Verwendung',
          paragraphs: [
            'Die gesendeten Daten dienen der Prüfung der Anfrage, der Rückmeldung an Sie, der Klärung der Kommunikationsweise und der Bearbeitung, falls die Arbeit aufgenommen wird.',
            'Die Daten werden nicht ohne eine gesonderte Einwilligung für Marketing verwendet.',
          ],
        },
        {
          heading: 'Benachrichtigung und Empfangsnummer',
          paragraphs: [
            'Wird eine Anfrage erfolgreich gesendet, benachrichtigt das System die Kanzlei. Ist diese Benachrichtigung noch nicht bestätigt, bleibt Ihr Text gespeichert und geht nicht verloren.',
            'Die Empfangsnummer dient dazu, Ihre Anfrage in unseren Unterlagen wiederzufinden. Sie wird nach dem Speichern angezeigt; Sie können sie bei einer erneuten Kontaktaufnahme nennen.',
          ],
        },
        {
          heading: 'Ihre Rechte und der Kontaktweg',
          paragraphs: [
            'Sie können Auskunft, Berichtigung oder Löschung Ihrer Daten verlangen oder die Einwilligung widerrufen, über die auf der Kontaktseite genannte E-Mail-Adresse. Besteht eine gesetzliche oder verfahrensbedingte Aufbewahrungspflicht, erläutern wir die Einschränkung.',
            'Diese Seite nennt keine feste Aufbewahrungsfrist, weil die tatsächliche Dauer davon abhängt, ob die Sache fortgesetzt wird, und von den damit verbundenen Pflichten. Wünschen Sie eine frühere Löschung, teilen Sie das bei der Kontaktaufnahme mit.',
          ],
        },
        {
          heading: 'Speicherort und Dienstleister',
          paragraphs: [
            'Diese Website wird bei Vercel gehostet, und Ihre Sendung wird in einem nicht öffentlichen Objektspeicher dieses Dienstes gespeichert. E-Mails werden über den von der Kanzlei genutzten E-Mail-Dienst versendet.',
            'Server einzelner Dienstleister können außerhalb Taiwans stehen, sodass Ihre Daten dort gespeichert und verarbeitet werden können. Ist der Speicherzweck erfüllt, werden die Daten ohne Verzögerung gelöscht; Daten, die nach geltenden Vorschriften aufbewahrt werden müssen, bleiben für diese Dauer. Anfragen zu personenbezogenen Daten nimmt wei@hoveringlaw.com.tw entgegen.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'HAFTUNGSAUSSCHLUSS',
      title: 'Umfang und Grenzen der Angaben auf dieser Seite',
      description:
        'Der allgemeine Charakter der Angaben, der rechtliche Geltungsbereich und die Voraussetzungen eines Mandatsverhältnisses.',
      intro:
        'Dieser Teil stellt klar, was diese deutschen Hinweisseiten für Sie tun können und was nicht.',
      sections: [
        {
          heading: 'Nur allgemeine Angaben',
          paragraphs: [
            'Der Inhalt dieser Seiten ist als allgemeine Information geschrieben. Er ist keine Rechtsberatung für Ihren Fall und ersetzt nicht die Prüfung Ihrer eigenen Unterlagen.',
            'Der Ausgang einer Sache hängt von den Tatsachen, den anwendbaren Vorschriften und dem Zeitpunkt ab; zwei ähnlich erscheinende Lagen können unterschiedlich enden.',
          ],
        },
        {
          heading: 'Rechtlicher Geltungsbereich',
          paragraphs: [
            'Die Kanzlei praktiziert nach taiwanischem Recht, und diese Seite spricht nur über Arbeit in diesem Rahmen.',
            'Der Inhalt ist keine Beratung nach dem Recht einer anderen Rechtsordnung als Taiwan, einschließlich des Rechts Ihres Wohnorts. Betrifft ein Teil Ihrer Sache eine andere Rechtsordnung, klären wir mit Ihnen, welche qualifizierte Fachperson für diesen Teil nötig ist.',
          ],
        },
        {
          heading: 'Ein Mandatsverhältnis entsteht nicht von selbst',
          paragraphs: [
            'Das Lesen dieser Seite, das Absenden eines Formulars oder einer E-Mail begründet für sich kein Mandatsverhältnis.',
            'Dieses Verhältnis entsteht erst, nachdem die Sache geprüft wurde und beide Seiten die Übernahme der Arbeit bestätigt haben.',
          ],
        },
        {
          heading: 'Kein Ergebnisversprechen',
          paragraphs: [
            'Kein Teil dieser Seite ist ein Versprechen über das Ergebnis einer Sache, über die Bewilligung eines Antrags oder über Aufenthalts- und Arbeitsstatus.',
            'Externe Links dienen der Orientierung; wir gewährleisten weder die Richtigkeit noch die Aktualität von Inhalten Dritter.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'BEITRÄGE',
      title: 'Beiträge zum taiwanischen Recht',
      description:
        'Deutsche Beiträge zu häufigen Fragen des taiwanischen Rechts. Der Inhalt ist allgemeine Information zum Zeitpunkt der Veröffentlichung, keine Rechtsberatung für Ihren Fall.',
      intro:
        'Die Kanzlei veröffentlicht Beiträge zu häufigen Fragen des taiwanischen Rechts. Beiträge, die auf Deutsch vorliegen, stehen auf dieser Seite; daneben gibt es vier Links, die jeweils die Beitragsliste einer Originalsprache öffnen.',
      sections: [
        {
          heading: 'Vier Listen nach Sprache',
          paragraphs: [
            'Dieser Teil enthält vier Links: die Beitragsliste auf Koreanisch, auf Chinesisch, auf Englisch und auf Japanisch. Jeder Link nennt die Sprache der Liste, damit Sie vorher wissen, in welcher Sprache der Inhalt öffnet.',
            'Diese vier Listen sind Listen nach der Originalsprache der Beiträge, keine Übersetzungslisten. Beiträge, die auf Deutsch vorliegen, stehen gesondert auf dieser Seite.',
          ],
        },
        {
          heading: 'Wohin die Links führen',
          paragraphs: [
            'Wenn Sie einen der vier Links wählen, öffnet die Beitragsliste dieser Sprache. Aus der Liste wählen Sie selbst den Text; der gesamte Inhalt erscheint in der Originalsprache des Beitrags.',
            'Diese Seite fasst den Inhalt der Beiträge nicht zusammen und gewährleistet nicht, dass ein Thema in allen vier Sprachen vorliegt. Jede Liste enthält nur Texte, die in dieser Sprache veröffentlicht sind.',
          ],
        },
        {
          heading: 'Wie weit ein Beitrag als Orientierung dienen kann',
          paragraphs: [
            'Beiträge sind allgemeine Angaben zum Zeitpunkt der Veröffentlichung. Vorschriften und ihre Anwendung können sich ändern, und ein Beitrag enthält nicht alle Umstände Ihres Falls.',
            'Bitte stützen Sie daher keine Handlung in einer echten Sache allein auf einen Beitrag. Nutzen Sie ihn für den Überblick und besprechen Sie Ihre Unterlagen gesondert mit einer Anwältin oder einem Anwalt; diese Seite ist nicht der Beratungsschritt.',
          ],
        },
      ],
    },
  },
};

export const spanishGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Español',
  nav: {
    home: 'Inicio',
    services: 'Áreas de trabajo',
    about: 'El despacho',
    lawyers: 'Abogados',
    pricing: 'Alcance y honorarios',
    contact: 'Contacto',
    faq: 'Preguntas frecuentes',
    privacy: 'Privacidad',
    disclaimer: 'Aviso legal',
    columns: 'Artículos',
  },
  contactCta: 'Enviar una solicitud de consulta',
  footerNotice:
    'Esta página en español solo ofrece orientación general sobre el trabajo del despacho según el derecho de Taiwán. No es asesoramiento jurídico para un asunto concreto, y el envío de un mensaje no crea por sí solo una relación entre abogado y cliente.',
  skipLink: 'Saltar la navegación e ir al contenido',
  menuLabel: 'Menú',
  languageLabel: 'Idioma de la página',
  mega: {
    services: {
      description: 'El despacho atiende las principales áreas de práctica según el derecho de Taiwán.',
      viewAllLabel: 'Ver todo',
    },
    columns: {
      description: 'Artículos que explican temas frecuentes del derecho de Taiwán.',
      viewAllLabel: 'Ver todo',
    },
    lawyers: {
      description: 'Presentación de los abogados que atienden los asuntos y de las vías de contacto.',
      viewAllLabel: 'Ver todo',
    },
    pricing: {
      description: 'Esta página explica el alcance del trabajo y cómo se confirman los honorarios.',
      viewAllLabel: 'Ver todo',
    },
    faq: {
      description: 'Preguntas frecuentes sobre el trabajo del despacho en Taiwán.',
      viewAllLabel: 'Ver todo',
    },
  },
  notFoundTitle: 'Página no encontrada',
  notFoundText:
    'La página que busca no existe o se ha trasladado. Puede volver al inicio en español para ver la orientación disponible.',
  backHomeLabel: 'Volver al inicio',
  readSourceLabel: 'Abrir la lista de artículos en el idioma original',
  home: {
    heroScrollLabel: 'Desplazarse hacia abajo',
    heroColumnsCtaLabel: 'Ver artículos',
    servicesDetailLabel: 'Ver detalles',
    servicesAssistanceBefore:
      'Si aún no tiene claro a qué área pertenece su asunto, la página de ',
    servicesAssistanceLinkLabel: 'Contacto',
    servicesAssistanceAfter:
      ' explica cómo redactar un resumen que un abogado revisará.',
    columnsViewAllLabel: 'Ver todos los artículos',
    columnsReadMoreLabel: 'Seguir leyendo',
    columnsReviewLabel: 'Revisado por la abogada Wei Tseng',
    columnsOriginalLanguageBadge: 'Idioma original',
    columnsOriginalLanguageNote:
      'Los artículos siguientes aún no están en español. Esta lista permanece en el idioma original y abre esa página; el contenido no se traduce de forma automática.',
    imageBandAlt: 'Casa tradicional taiwanesa (三合院) y un pabellón contemporáneo a plena luz del día',
    videoPauseLabel: 'Pausar el vídeo',
    videoPlayLabel: 'Reproducir el vídeo',
    videoReplayLabel: 'Volver a reproducir el vídeo',
  },
  pages: {
    home: {
      eyebrow: 'ORIENTACIÓN',
      title: 'Servicios jurídicos en Taiwán — orientación en español',
      description:
        'Explicación general en español sobre el alcance de Hovering International Law Firm en Taiwán, los idiomas de consulta y el primer contacto.',
      intro:
        'Hovering International Law Firm acompaña a clientes del extranjero, también a quienes tienen un vínculo con Taiwán, en asuntos de derecho taiwanés: inversión y constitución de sociedades, litigios civiles, matrimonio, familia y sucesiones, laboral, penal y propiedad intelectual. Esta parte en español le ayuda a saber qué trabajo entra en nuestro alcance, qué conviene preparar y cómo contactarnos. Son indicaciones generales, no asesoramiento jurídico para su propio caso.',
      sections: [
        {
          heading: 'Qué hacemos',
          paragraphs: [
            'Hovering International Law Firm es un despacho de abogados establecido en Taiwán. Trabaja según el derecho taiwanés y tiene oficinas en Taipéi (臺北), Kaohsiung (高雄), Taichung (臺中) y Pingtung (屏東). Asesoramos a empresas y tramitamos procedimientos ante los tribunales, y acompañamos a clientes del extranjero en los trámites que deben seguirse en Taiwán.',
            'Todo el contenido de estas páginas es general. El resultado de un asunto depende de los hechos, de las normas aplicables y del momento, de modo que esta orientación no sustituye una conversación directa con un abogado sobre su expediente.',
          ],
        },
        {
          heading: 'El idioma de la página y el idioma de la consulta no son lo mismo',
          paragraphs: [
            'Esta página está escrita en español, pero la consulta con un abogado se realiza únicamente en los cuatro idiomas de consulta: inglés, chino (中文), japonés y coreano. Leer la orientación en español no significa que la conversación con el abogado se celebre en español.',
            'No prometemos intérprete, no prometemos un plazo de respuesta y no confirmamos citas a través de esta página. Si no puede usar ninguno de esos cuatro idiomas, la página «Contacto» explica cómo comprobamos una forma de comunicarnos.',
          ],
        },
        {
          heading: 'Áreas de práctica que atendemos',
          paragraphs: [
            'El alcance del despacho cubre las seis áreas siguientes. La página «Áreas de trabajo» describe cada una con más detalle y señala lo que no se garantiza.',
          ],
          items: [
            'Inversión y constitución de sociedades en Taiwán',
            'Litigios civiles y reclamaciones de daños',
            'Matrimonio, familia y sucesiones',
            'Conflictos laborales',
            'Asuntos penales',
            'Propiedad intelectual: marcas, patentes y derechos de autor',
          ],
        },
        {
          heading: 'Por dónde conviene empezar',
          paragraphs: [
            'Lea la página «Áreas de trabajo» para comprobar si su asunto entra en nuestro alcance y, a continuación, «Alcance y honorarios» y «Contacto» para saber cómo se fija el alcance y se confirman los honorarios antes de empezar el trabajo.',
            'Al enviar un mensaje puede escribir el resumen en su propio idioma. El texto original se guarda tal como lo escribe y no se traduce de forma automática. Un mensaje enviado es una solicitud que espera revisión: aún no es una consulta ni una cita confirmada.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'ÁREAS DE TRABAJO',
      title: 'Asuntos que atendemos',
      description:
        'Las seis áreas de práctica del despacho en Taiwán y los límites que conviene conocer de antemano.',
      intro:
        'A continuación, los asuntos de los que nos ocupamos y las cuestiones que suelen plantearse al inicio. Esta descripción le ayuda a valorar si su asunto entra en nuestro alcance; es información general, no el análisis jurídico de un expediente concreto.',
      sections: [
        {
          heading: 'Inversión y constitución de sociedades en Taiwán',
          paragraphs: [
            'Acompañamos a inversores y empresas extranjeras que constituyen o gestionan una sociedad en Taiwán: elección de la forma societaria, preparación y presentación de documentos, aportación de capital, banca, valoración del local y requisitos propios de determinados sectores. También apoyamos la contabilidad y la fiscalidad derivadas de constituir y operar en Taiwán.',
            'El orden y la duración del proceso varían según la forma societaria, el inversor, el sector, el banco y los documentos disponibles. Constituir una sociedad no produce por sí solo un permiso de residencia (居留) ni un permiso de trabajo (工作許可): son trámites distintos que se valoran según la situación de cada persona.',
          ],
        },
        {
          heading: 'Litigios civiles y daños',
          paragraphs: [
            'Esta área cubre conflictos contractuales, reclamaciones de daños por acto ilícito y conflictos de consumo. El trabajo suele empezar por una cronología de los hechos, la revisión de documentos y pruebas existentes y, solo después, los siguientes pasos.',
            'Los plazos, incluidos los plazos legales para demandar, y la integridad de las pruebas influyen mucho en el curso del asunto civil, así que indique desde el principio las fechas que conozca. Si conserva contratos, mensajes, justificantes de pago o fotos del lugar, menciónelo en el primer mensaje.',
          ],
        },
        {
          heading: 'Matrimonio, familia y sucesiones',
          paragraphs: [
            'Atendemos divorcio (離婚), liquidación de bienes, ejercicio y asunción de derechos y deberes respecto de hijos menores (未成年子女權利義務之行使或負擔), régimen de visitas (會面交往) y sucesiones (繼承), también cuando las partes o los bienes están en países distintos. Los asuntos de familia transfronterizos suelen exigir un examen adicional de documentos del registro de domicilio (戶籍), de la forma de los documentos y de su valor probatorio en Taiwán.',
            'Como los asuntos de familia suelen ir unidos a plazos y a varios trámites en paralelo, el resumen inicial debería indicar la relación entre las partes, el lugar de residencia actual y los procedimientos ya iniciados.',
          ],
        },
        {
          heading: 'Conflictos laborales',
          paragraphs: [
            'Esta área cubre la extinción del contrato de trabajo, la indemnización según el derecho de Taiwán (資遣費; no se identifica con instituciones de otros países), salarios y conflictos derivados del contrato de trabajo (勞動契約), tanto del lado de la persona trabajadora como del empleador. Al revisar el asunto separamos el fundamento de la extinción de las cuestiones de preaviso, pago y plazos.',
            'El contrato de trabajo, el reglamento interno (工作規則), las nóminas y el intercambio escrito entre las partes suelen ser los documentos decisivos. Si aún los conserva, indíquelo en el resumen.',
          ],
        },
        {
          heading: 'Asuntos penales',
          paragraphs: [
            'Acompañamos en la investigación y ante el tribunal, tanto a la persona investigada o acusada como a la víctima, y valoramos el riesgo penal de la actividad empresarial.',
            'Los asuntos penales suelen tener plazos cortos y etapas ya definidas, de modo que si ya ha recibido un escrito de la autoridad o del tribunal, indique la fecha de ese escrito desde el principio para que el contenido se revise en el orden adecuado.',
          ],
        },
        {
          heading: 'Propiedad intelectual',
          paragraphs: [
            'Ayudamos en el registro de marcas (商標) y patentes (專利), en derechos de autor y en conflictos sobre esos derechos en Taiwán.',
            'En esta área el orden de los pasos es decisivo: el alcance de la protección, el momento de la presentación y el uso efectivo influyen en la estrategia. Presentar una solicitud no garantiza por sí solo que se conceda.',
          ],
        },
        {
          heading: 'Alcance y cómo se confirma',
          paragraphs: [
            'El despacho trabaja según el derecho de Taiwán y atiende asuntos de las áreas anteriores. El alcance de cada asunto se confirma por separado después de que un abogado revise el contenido que usted envía.',
            'El estatus de residencia, el permiso de trabajo y cuestiones similares se valoran a partir del expediente y de la situación de cada persona, no a partir de la nacionalidad. Si alguna parte de su asunto toca esos temas, indíquelo al contactarnos. Esta página no promete un resultado ni un plazo de respuesta.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'EL DESPACHO',
      title: 'Sobre Hovering International Law Firm',
      description:
        'Información básica sobre este despacho de abogados en Taiwán, sus oficinas y el trabajo con partes extranjeras.',
      intro:
        'Hovering International Law Firm es un despacho de abogados en Taiwán. Las abogadas y los abogados trabajan desde el asesoramiento a empresas hasta la actuación ante los tribunales. Esta parte explica cómo se fundó el despacho, sus sedes y el trabajo con partes extranjeras.',
      sections: [
        {
          heading: 'Fundación y estructura',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) se fundó en 2016 por abogados titulados por la National Taiwan University (國立臺灣大學). El nombre chino 昊鼎 une el carácter 昊 («cielo amplio») y el carácter 鼎 («base sólida»), y expresa la orientación del despacho desde su origen.',
            'Tenemos oficinas en Taipéi (臺北), Kaohsiung (高雄), Taichung (臺中) y Pingtung (屏東). La oficina de Kaohsiung se centra en el gobierno corporativo y atiende conflictos civiles, penales y administrativos. La oficina de Taichung atiende construcción, propiedad intelectual y asuntos relacionados con Corea y Japón. La oficina de Pingtung se abrió en 2017 para atender la demanda local.',
            'Además del trabajo de abogacía, en 2020 se creó Hovering Accounting Office, que ofrece contabilidad y planificación fiscal a empresarios y a particulares con patrimonio elevado.',
          ],
        },
        {
          heading: 'Trabajo con partes extranjeras',
          paragraphs: [
            'El trabajo transfronterizo cubre constitución de sociedades, visados, registro de marcas y patentes, evaluación de riesgos jurídicos y asesoramiento fiscal empresarial. La oficina de Taichung atiende en particular construcción, propiedad intelectual y asuntos relacionados con Corea y Japón. La abogada Wei Tseng (曾雋崴) acompaña a clientes de Corea, de Japón y a otros clientes internacionales en las áreas anteriores.',
            'Si podemos o no atender un asunto depende de su contenido y del idioma de la comunicación. Si su asunto entra en las áreas anteriores y puede hablarse en uno de los cuatro idiomas de consulta, puede enviar un resumen para que un abogado lo revise.',
          ],
        },
        {
          heading: 'Cuando nos contacta',
          paragraphs: [
            'Tras recibir su resumen, un abogado revisa el contenido y habla después del alcance posible, de los documentos que aún se necesitan y de los siguientes pasos. Si el asunto plantea cuestiones contables o fiscales, el despacho puede trabajar de forma integrada con el área de contabilidad.',
            'El resultado de cada asunto depende de los hechos y de los documentos existentes, de modo que no prometemos un resultado. Si necesita una respuesta concreta para su situación, ese expediente debe hablarse directamente con un abogado en uno de los cuatro idiomas de consulta.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'ABOGADOS',
      title: 'Equipo internacional de Hovering',
      description: 'Perfiles de los abogados, de la dirección de operaciones y del auditor asociado de Hovering.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'ALCANCE Y HONORARIOS',
      title: 'Cómo se fijan el alcance del trabajo y los honorarios',
      description:
        'Explicación del orden: primero el alcance, después la confirmación de honorarios, y por qué esta página no publica una lista de tarifas.',
      intro:
        'Esta página explica cómo se fijan los honorarios, no su cuantía. La cuantía depende del alcance de cada asunto y solo tiene sentido cuando ese alcance está claro.',
      sections: [
        {
          heading: 'El primer paso es fijar el alcance del trabajo',
          paragraphs: [
            'Asuntos del mismo tipo pueden exigir un trabajo muy distinto, según el número de partes, los documentos disponibles, los plazos que deban cumplirse y si un procedimiento ya ha empezado. Por eso el primer paso es siempre aclarar qué entra en el trabajo y qué no.',
            'El resumen que envía al inicio es la base de ese alcance. Cuanto más claro describa los hechos, lo que espera y los plazos, más preciso podrá ser el alcance.',
          ],
        },
        {
          heading: 'Los honorarios se confirman antes de empezar el trabajo',
          paragraphs: [
            'Cuando el alcance está claro, la cuantía y el modo de cálculo se hablan y se confirman con usted antes de empezar. Si el alcance cambia a mitad de camino, ese cambio también debe confirmarse de nuevo.',
            'Esta página no es una oferta de precio y no genera ninguna obligación de pago. Enviar una solicitud a través de esta página tampoco tiene coste.',
          ],
        },
        {
          heading: 'La consulta puede ser un servicio de pago',
          paragraphs: [
            'La consulta con un abogado puede ser un servicio de pago. Esta página no afirma que la primera consulta sea gratuita, y ninguna parte debe leerse en ese sentido.',
            'Si la consulta tiene coste, la cuantía y la forma de pago se comunican antes de que tenga lugar.',
          ],
        },
        {
          heading: 'Por qué esta página no publica tarifas',
          paragraphs: [
            'La cuantía depende del propio asunto: del trabajo que haya que hacer, del número de partes, de los documentos, de los plazos y de si un procedimiento ya ha empezado. Un importe indicado de antemano no reflejaría el coste de su expediente; por eso, en lugar de una lista de tarifas, fijamos primero el alcance de su asunto y le comunicamos después los honorarios para que los valore antes de empezar.',
            'Además de los honorarios del abogado, un asunto puede generar tasas que deban pagarse al tribunal, a una autoridad o a un tercero. Esas tasas son distintas de los honorarios y dependen del procedimiento que se siga.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'CONTACTO',
      title: 'Cómo contactar con el despacho',
      description:
        'Idioma de la página, idiomas de consulta, qué ocurre si no puede usar esos cuatro idiomas, y lo que esta página no garantiza.',
      intro:
        'Antes de escribirnos, tenga en cuenta estos tres puntos por separado. A menudo se confunden, pero no significan lo mismo.',
      sections: [
        {
          heading: 'Tres cosas que conviene distinguir',
          paragraphs: [
            'El idioma de visualización de la página, el idioma de la consulta con el abogado y el idioma en que usted escribe son tres cosas distintas.',
          ],
          items: [
            'Idioma de la página: esta orientación está escrita en español.',
            'Idioma de consulta: la consulta con un abogado se realiza únicamente en inglés, chino (中文), japonés y coreano.',
            'Idioma de su texto: puede escribir el resumen en su propio idioma, y el texto original se guarda tal cual.',
          ],
        },
        {
          heading: 'Si no puede usar ninguno de los cuatro idiomas de consulta',
          paragraphs: [
            'En el formulario de contacto puede elegir «Hace falta confirmar la forma de comunicarse». Responderemos para comprobar si existe una vía posible de comunicación; no se garantiza el servicio en otro idioma y no se promete un plazo de respuesta.',
            'Esto es solo un paso de comprobación, no es una promesa. No prometemos intérprete, no prometemos servicio en español ni en otro idioma fuera de los cuatro indicados, y no prometemos que podamos aceptar todos los asuntos.',
          ],
        },
        {
          heading: 'Qué conviene escribir en el primer mensaje',
          paragraphs: [
            'Indique qué ocurrió, qué ayuda necesita, qué relación tiene el asunto con Taiwán y el plazo si lo conoce. Si ya ha recibido un escrito de un tribunal o de una autoridad, indique la fecha de ese escrito.',
            'En esta primera fase aún no necesita enviar número de pasaporte, número de identidad, datos bancarios, historial médico ni el expediente completo de pruebas. Espere las indicaciones del abogado y envíe entonces el material sensible por un medio seguro.',
          ],
        },
        {
          heading: 'Lo que esta página no garantiza',
          paragraphs: [
            'No prometemos un plazo de respuesta, no confirmamos una cita a través de esta página, no prometemos un abogado concreto y no ponemos intérprete. La traducción escrita es otra cosa: el mensaje que envía no se traduce de forma automática.',
            'Cuando envía una solicitud, el contenido se guarda y espera revisión. Si pasado un tiempo no recibe respuesta, puede volver a escribir a la dirección de correo que figura en la página de contacto.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'PREGUNTAS FRECUENTES',
      title: 'Preguntas frecuentes',
      description:
        'Explicación del alcance, de la preparación, de los idiomas, de los honorarios y del significado de enviar una solicitud.',
      intro:
        'Las respuestas siguientes son información general. La respuesta para su propio caso solo puede darse después de que un abogado revise el expediente.',
      sections: [
        {
          heading: 'Cómo usar esta parte',
          paragraphs: [
            'Si no encuentra una respuesta para su situación, suele ser señal de que la respuesta depende de hechos particulares. En ese caso, escriba esos hechos en el resumen al contactarnos, en lugar de deducirlos por su cuenta de esta página.',
          ],
        },
      ],
      faqs: [
        {
          question: '¿Qué tipo de asuntos atiende este despacho?',
          answer:
            'Atendemos seis áreas de práctica: inversión y constitución de sociedades en Taiwán, litigios civiles y daños, matrimonio, familia y sucesiones, conflictos laborales, asuntos penales y propiedad intelectual. Si un asunto se acepta o no se decide después de revisar su contenido.',
        },
        {
          question: '¿Qué debo preparar antes de contactar con el despacho?',
          answer:
            'Prepare un resumen breve de lo ocurrido, de lo que espera, del vínculo con Taiwán y del plazo si existe. Si ya hay un escrito de un tribunal o de una autoridad, indique la fecha. En esta fase aún no necesita enviar documentos de identidad ni todas las pruebas.',
        },
        {
          question: '¿Puedo consultar en español?',
          answer:
            'No. Esta orientación está escrita en español, pero la consulta con un abogado se realiza únicamente en inglés, chino (中文), japonés y coreano. Tampoco prometemos intérprete. La traducción escrita es otra cosa: el texto original que usted escribe se guarda tal cual y no se traduce de forma automática.',
        },
        {
          question: '¿Qué ocurre si no puedo usar ninguno de esos cuatro idiomas?',
          answer:
            'Elija «Hace falta confirmar la forma de comunicarse» al enviar la solicitud. Responderemos para comprobar una forma de comunicarnos, pero no se garantiza el servicio en otro idioma. Es un paso de comprobación, no una promesa de que podamos atender en otro idioma.',
        },
        {
          question: '¿Cómo se trata el texto que escribo en español?',
          answer:
            'El texto original que usted escribe se guarda tal cual y no se traduce de forma automática. Si hace falta, el idioma de la comunicación posterior se confirma con usted.',
        },
        {
          question: 'Si ya envié la solicitud, ¿la consulta ya ha tenido lugar?',
          answer:
            'No. Una solicitud enviada espera la revisión de un abogado. No es asesoramiento jurídico, no es una cita confirmada, y el envío no crea por sí solo una relación entre abogado y cliente.',
        },
        {
          question: '¿Cómo se calculan los honorarios?',
          answer:
            'Primero se fija el alcance del trabajo y después se confirman con usted la cuantía y el modo de cálculo antes de empezar. Esta página no publica cifras y no afirma que la primera consulta sea gratuita.',
        },
        {
          question: '¿Qué hago si mi asunto es urgente?',
          answer:
            'Indique el plazo o la fecha de un escrito oficial al inicio de su resumen para que el abogado vea esas fechas al revisar. Esta página no tiene un canal de emergencia y no garantiza un plazo de respuesta; si su asunto no puede esperar, conviene buscar al mismo tiempo otras vías donde usted se encuentre.',
        },
      ],
    },
    privacy: {
      eyebrow: 'PRIVACIDAD',
      title: 'Datos que se recogen a través del formulario de contacto',
      description:
        'Qué recoge el formulario de esta parte en español, cómo se trata el texto original y cómo contactarnos sobre sus datos.',
      intro:
        'Esta parte se refiere solo al formulario de contacto de estas páginas de orientación. Describe el trato de los datos, no una garantía técnica.',
      sections: [
        {
          heading: 'Datos que se recogen',
          paragraphs: [
            'Cuando envía una solicitud a través del formulario de esta parte, se registran los siguientes elementos:',
          ],
          items: [
            'El nombre que indica',
            'La dirección de correo para responder',
            'El idioma de visualización de la página en el momento del envío',
            'El idioma en que escribió',
            'El idioma de consulta que desea',
            'El texto original que escribió',
            'Su consentimiento para enviar la solicitud',
            'Un número de recepción para volver a localizar la solicitud',
          ],
        },
        {
          heading: 'El texto original se guarda tal cual',
          paragraphs: [
            'Su escrito se guarda exactamente como lo redactó y no se traduce de forma automática. Si hace falta una traducción para tramitar el asunto, se habla con usted por separado.',
            'Como el texto original se guarda, no escriba en esta primera fase datos que aún no hacen falta, como el número de pasaporte, el número de identidad o datos de una cuenta bancaria.',
          ],
        },
        {
          heading: 'Dónde se guarda y quién puede verlo',
          paragraphs: [
            'El contenido de su envío se guarda en un lugar que no es de acceso público, y solo las personas autorizadas del despacho pueden acceder a él para tramitar esa solicitud.',
            'Esta página no ofrece una garantía absoluta de seguridad. Ninguna vía de envío ni de almacenamiento es del todo segura, de modo que el material sensible conviene enviarlo solo según las indicaciones concretas del abogado.',
          ],
        },
        {
          heading: 'Finalidad del uso',
          paragraphs: [
            'Los datos que envía se usan para revisar la solicitud, volver a contactarle, confirmar la forma de comunicarse y tramitar el asunto si el trabajo llega a empezar.',
            'Estos datos no se usan para marketing sin un consentimiento suyo dado por separado para ese fin.',
          ],
        },
        {
          heading: 'Aviso y número de recepción',
          paragraphs: [
            'Cuando una solicitud se envía con éxito, el sistema avisa al despacho. Si ese aviso aún no está confirmado, lo que usted escribió sigue guardado y no se pierde.',
            'El número de recepción sirve para volver a encontrar su solicitud en nuestros registros. Se muestra después de guardar la solicitud, y puede mencionarlo si vuelve a contactarnos.',
          ],
        },
        {
          heading: 'Sus derechos y cómo contactarnos',
          paragraphs: [
            'Puede pedir acceso, rectificación o supresión de sus datos, o retirar el consentimiento, a través de la dirección de correo que figura en la página de contacto. Si existe una obligación de conservación según las normas aplicables o por un asunto en curso, explicaremos el motivo de la limitación.',
            'Esta página no indica un plazo fijo de conservación, porque la duración real depende de si el asunto continúa y de las obligaciones de conservación asociadas. Si desea que se supriman antes, indíquelo al contactarnos.',
          ],
        },
        {
          heading: 'Lugar de almacenamiento y prestadores',
          paragraphs: [
            'Este sitio se aloja en Vercel, y su envío se guarda en un almacenamiento de objetos no público de ese servicio. El correo se envía a través del servicio de correo que utiliza el despacho.',
            'Los servidores de algunos prestadores pueden estar fuera de Taiwán, de modo que sus datos pueden almacenarse y tratarse allí. Cumplida la finalidad del almacenamiento, los datos se suprimen sin demora; los datos que deban conservarse según las normas aplicables se conservan durante ese plazo. Las solicitudes relativas a datos personales se reciben en wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'AVISO LEGAL',
      title: 'Alcance y límites de la información de esta página',
      description:
        'El carácter general de la información, el ámbito jurídico y las condiciones para que exista una relación entre abogado y cliente.',
      intro:
        'Esta parte aclara qué pueden y qué no pueden hacer por usted estas páginas de orientación en español.',
      sections: [
        {
          heading: 'Solo información general',
          paragraphs: [
            'El contenido de estas páginas está escrito como información general. No es asesoramiento jurídico para su caso y no sustituye la revisión de su propio expediente.',
            'El resultado de un asunto depende de los hechos, de las normas aplicables y del momento, de modo que dos situaciones que parecen similares pueden terminar de forma distinta.',
          ],
        },
        {
          heading: 'Ámbito jurídico',
          paragraphs: [
            'El despacho ejerce según el derecho de Taiwán, y esta página solo habla del trabajo en ese marco.',
            'El contenido no es asesoramiento según el derecho de ninguna jurisdicción distinta de Taiwán, incluido el derecho del lugar donde usted reside. Si alguna parte de su asunto se rige por otra jurisdicción, confirmaremos con usted qué profesional cualificado hace falta para esa parte.',
          ],
        },
        {
          heading: 'La relación entre abogado y cliente no nace por sí sola',
          paragraphs: [
            'Leer esta página, enviar el formulario o enviar un correo no crea por sí solo una relación entre abogado y cliente.',
            'Esa relación solo nace después de revisar el asunto y de que ambas partes confirmen la aceptación del trabajo.',
          ],
        },
        {
          heading: 'No hay garantía de resultado',
          paragraphs: [
            'Ninguna parte de esta página es una promesa sobre el resultado de un asunto, sobre la concesión de una solicitud o sobre el estatus de residencia y de trabajo.',
            'Los enlaces externos se ofrecen para su comodidad; no garantizamos la exactitud ni la actualidad del contenido publicado por terceros.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'ARTÍCULOS',
      title: 'Artículos sobre el derecho de Taiwán',
      description:
        'Artículos en español que explican temas frecuentes del derecho de Taiwán. El contenido es información general en el momento de su publicación, no asesoramiento jurídico para su caso.',
      intro:
        'El despacho publica artículos que explican temas frecuentes del derecho de Taiwán. Los artículos disponibles en español figuran en esta página; además hay cuatro enlaces, cada uno abre la lista de artículos de un idioma original.',
      sections: [
        {
          heading: 'Cuatro listas según el idioma',
          paragraphs: [
            'Esta parte contiene cuatro enlaces: la lista de artículos en coreano, la lista en chino, la lista en inglés y la lista en japonés. Cada enlace indica el idioma de su lista, para que sepa de antemano en qué idioma se abrirá el contenido.',
            'Esas cuatro listas son listas según el idioma original del artículo, no listas de traducciones. Los artículos ya disponibles en español figuran por separado en esta misma página.',
          ],
        },
        {
          heading: 'Adónde llevan los enlaces',
          paragraphs: [
            'Al elegir uno de los cuatro enlaces se abre la lista de artículos de ese idioma. En esa lista usted elige el texto que desea leer, y todo el contenido aparece en el idioma original del artículo.',
            'Esta página no resume el contenido de los artículos y no garantiza que un tema exista en los cuatro idiomas. Cada lista solo incluye los textos publicados en esa lengua.',
          ],
        },
        {
          heading: 'Hasta dónde puede orientarle un artículo',
          paragraphs: [
            'Los artículos se escribieron como información general en el momento de su publicación. Las normas y su aplicación pueden cambiar, y un artículo no recoge todas las circunstancias de su caso.',
            'Por eso, no tome un artículo como base para actuar en un asunto real. Úselo para entender el panorama general y hable después de su expediente con un abogado; esta página no es el paso de consulta.',
          ],
        },
      ],
    },
  },
};

export const frenchGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Français',
  nav: {
    home: 'Accueil',
    services: 'Domaines d’activité',
    about: 'Le cabinet',
    lawyers: 'Avocates et avocats',
    pricing: 'Étendue et honoraires',
    contact: 'Contact',
    faq: 'Questions fréquentes',
    privacy: 'Confidentialité',
    disclaimer: 'Avertissement',
    columns: 'Articles',
  },
  contactCta: 'Envoyer une demande de consultation',
  footerNotice:
    'Cette page en français ne contient que des indications générales sur le travail du cabinet selon le droit de Taïwan. Elle n’est pas un avis juridique pour une affaire concrète, et l’envoi d’un message ne crée pas, à lui seul, une relation entre avocate ou avocat et client.',
  skipLink: 'Passer la navigation et aller au contenu',
  menuLabel: 'Sommaire des pages',
  languageLabel: 'Langue d’affichage',
  mega: {
    services: {
      description: 'Le cabinet traite les groupes d’activité essentiels selon le droit de Taïwan.',
      viewAllLabel: 'Tout afficher',
    },
    columns: {
      description: 'Articles sur des questions fréquentes du droit de Taïwan.',
      viewAllLabel: 'Tout afficher',
    },
    lawyers: {
      description: 'Présentation des avocates et avocats en activité et des voies de contact.',
      viewAllLabel: 'Tout afficher',
    },
    pricing: {
      description: 'Cette page explique l’étendue du travail et la manière dont les honoraires sont confirmés.',
      viewAllLabel: 'Tout afficher',
    },
    faq: {
      description: 'Questions fréquentes sur le travail du cabinet à Taïwan.',
      viewAllLabel: 'Tout afficher',
    },
  },
  notFoundTitle: 'Page introuvable',
  notFoundText:
    'La page recherchée n’existe pas ou a été déplacée. Vous pouvez revenir à l’accueil en français pour voir les indications disponibles.',
  backHomeLabel: 'Retour à l’accueil',
  readSourceLabel: 'Ouvrir la liste d’articles dans la langue d’origine',
  home: {
    heroScrollLabel: 'Faire défiler vers le bas',
    heroColumnsCtaLabel: 'Voir les articles',
    servicesDetailLabel: 'Voir les détails',
    servicesAssistanceBefore: 'Si le groupe auquel appartient votre affaire n’est pas clair, la page ',
    servicesAssistanceLinkLabel: 'Contact',
    servicesAssistanceAfter:
      ' explique comment rédiger un résumé qu’une avocate ou un avocat examinera.',
    columnsViewAllLabel: 'Voir tous les articles',
    columnsReadMoreLabel: 'Lire la suite',
    columnsReviewLabel: 'Révisé par l’avocate Wei Tseng',
    columnsOriginalLanguageBadge: 'Langue d’origine',
    columnsOriginalLanguageNote:
      'Les articles suivants ne sont pas encore disponibles en français. La liste reste dans la langue d’origine et ouvre la page correspondante ; le contenu n’est pas traduit automatiquement.',
    imageBandAlt: 'Maison traditionnelle taïwanaise (三合院) et un pavillon contemporain en plein jour',
    videoPauseLabel: 'Mettre la vidéo en pause',
    videoPlayLabel: 'Lire la vidéo',
    videoReplayLabel: 'Relire la vidéo',
  },
  pages: {
    home: {
      eyebrow: 'INDICATIONS',
      title: 'Services juridiques à Taïwan — indications en français',
      description:
        'Explications générales en français sur le champ d’activité de Hovering International Law Firm à Taïwan, les langues de consultation et le premier contact.',
      intro:
        'Hovering International Law Firm accompagne des clients de l’étranger, y compris ceux qui ont un lien avec Taïwan, dans des affaires de droit taïwanais : investissement et constitution de sociétés, litiges civils, mariage, famille et successions, droit du travail, affaires pénales et propriété intellectuelle. Cette partie en français vous aide à voir quel travail entre dans notre champ, ce qu’il convient de préparer et comment nous joindre. Il s’agit d’indications générales, non d’un avis juridique pour votre propre affaire.',
      sections: [
        {
          heading: 'Ce que nous faisons',
          paragraphs: [
            'Hovering International Law Firm est un cabinet d’avocats établi à Taïwan. Il travaille selon le droit taïwanais et tient des bureaux à Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) et Pingtung (屏東). Nous conseillons des entreprises et menons des procédures devant les tribunaux, et nous accompagnons des clients de l’étranger dans les démarches à suivre à Taïwan.',
            'Tout le contenu de ces pages est général. L’issue d’une affaire dépend des faits, des règles applicables et du moment. Ces indications ne remplacent pas un entretien avec une avocate ou un avocat sur vos pièces.',
          ],
        },
        {
          heading: 'La langue de la page et la langue de consultation ne sont pas la même chose',
          paragraphs: [
            'Cette page est rédigée en français, mais la consultation avec une avocate ou un avocat a lieu seulement dans les quatre langues de consultation : anglais, chinois (中文), japonais et coréen. Lire les indications en français ne signifie pas que l’entretien avec l’avocate ou l’avocat se tient en français.',
            'Nous ne promettons ni service d’interprétation, ni délai de réponse, ni rendez-vous par cette page. Si vous ne pouvez utiliser aucune des quatre langues, la page « Contact » explique comment nous examinons une manière de communiquer.',
          ],
        },
        {
          heading: 'Groupes d’activité',
          paragraphs: [
            'Le champ d’activité couvre les six groupes suivants. La page « Domaines d’activité » décrit chaque groupe plus en détail et indique ce qui n’est pas promis.',
          ],
          items: [
            'Investissement et constitution de sociétés à Taïwan',
            'Affaires civiles et dommages-intérêts',
            'Mariage, famille et successions',
            'Litiges du travail',
            'Affaires pénales',
            'Propriété intellectuelle : marques, brevets et droit d’auteur',
          ],
        },
        {
          heading: 'Par où commencer',
          paragraphs: [
            'Lisez la page « Domaines d’activité » pour vérifier si votre affaire entre dans notre champ, puis « Étendue et honoraires » et « Contact » pour savoir comment l’étendue est fixée et comment les honoraires sont confirmés avant le début du travail.',
            'Lorsque vous envoyez un message, vous pouvez rédiger le résumé dans votre propre langue. Le texte original est conservé tel que vous l’avez écrit et n’est pas traduit automatiquement. Un message envoyé est une demande en attente d’examen : ce n’est pas encore une consultation ni un rendez-vous confirmé.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'DOMAINES D’ACTIVITÉ',
      title: 'Affaires que nous traitons',
      description:
        'Six groupes d’activité du cabinet à Taïwan et les limites qu’il convient de connaître d’abord.',
      intro:
        'Voici les groupes que nous traitons réellement et les questions souvent posées au début. Cette présentation vous aide à juger si votre affaire entre dans notre champ ; elle est générale et n’est pas l’analyse juridique d’un dossier particulier.',
      sections: [
        {
          heading: 'Investissement et constitution de sociétés à Taïwan',
          paragraphs: [
            'Nous accompagnons des entreprises et des investisseurs étrangers pour constituer ou exploiter une société à Taïwan : choix de la forme, préparation et dépôt des pièces, apport de capital, questions bancaires, examen du lieu d’exploitation et exigences propres à certains secteurs. Nous appuyons aussi la comptabilité et la fiscalité nées de la constitution et de l’exploitation à Taïwan.',
            'L’ordre et la durée varient selon la forme, l’investisseur, le secteur, la banque et les pièces disponibles. La constitution d’une société ne produit pas, à elle seule, un titre de séjour (居留) ni un permis de travail (工作許可) : ce sont des procédures distinctes, appréciées selon la situation de chaque personne.',
          ],
        },
        {
          heading: 'Affaires civiles et dommages-intérêts',
          paragraphs: [
            'Ce groupe couvre les litiges contractuels, les dommages-intérêts nés d’un acte illicite et les litiges de consommation. Le travail commence en général par une chronologie, l’examen des pièces et des preuves existantes, puis seulement les étapes suivantes.',
            'Les délais, y compris les délais légaux pour agir, et le caractère complet des preuves marquent le cours de l’affaire. Indiquez donc dès que possible les dates que vous connaissez. Conservez contrats, messages, justificatifs de paiement ou photos des lieux et mentionnez-les dans le premier message.',
          ],
        },
        {
          heading: 'Mariage, famille et successions',
          paragraphs: [
            'Nous traitons le divorce (離婚), le partage des biens, l’exercice et la charge des droits et devoirs à l’égard des enfants mineurs (未成年子女權利義務之行使或負擔), le droit de visite (會面交往) et les successions (繼承), y compris lorsque les parties ou les biens se trouvent dans des États différents. Les affaires familiales transfrontalières exigent souvent un examen supplémentaire des pièces du registre des ménages (戶籍), de la forme des actes et de leur force probante à Taïwan.',
            'Parce que les affaires de famille s’accompagnent souvent de délais et de procédures parallèles, le premier résumé devrait indiquer le lien entre les parties, le lieu de résidence actuel et les procédures déjà en cours.',
          ],
        },
        {
          heading: 'Litiges du travail',
          paragraphs: [
            'Ce groupe couvre la fin du contrat de travail, l’indemnité selon le droit de Taïwan (資遣費 ; à ne pas identifier avec des institutions d’autres États), les salaires et les litiges nés du contrat de travail (勞動契約), du côté de la personne salariée comme de l’employeur. Lors de l’examen, nous séparons le motif de la fin des questions de préavis, de paiement et de délais.',
            'Le contrat de travail, le règlement intérieur (工作規則), les bulletins de paie et les échanges écrits entre les parties sont le plus souvent les pièces décisives. Si vous les avez encore, mentionnez-le dans le résumé.',
          ],
        },
        {
          heading: 'Affaires pénales',
          paragraphs: [
            'Nous intervenons au stade de l’enquête et devant le tribunal, pour la personne mise en cause ou accusée comme pour la victime, et nous évaluons le risque pénal de l’activité d’entreprise.',
            'Les affaires pénales ont souvent des délais courts et des étapes déjà fixées. Si vous avez déjà reçu un écrit de l’autorité de poursuite ou du tribunal, indiquez tôt la date de cet écrit afin que le contenu soit examiné dans le bon ordre.',
          ],
        },
        {
          heading: 'Propriété intellectuelle',
          paragraphs: [
            'Nous aidons à l’enregistrement des marques (商標) et des brevets (專利), au droit d’auteur et aux litiges sur ces droits à Taïwan.',
            'Dans ce groupe, l’ordre des étapes est décisif : l’étendue de la protection, le moment du dépôt et l’usage effectif influencent le choix. Déposer une demande ne signifie pas, à lui seul, qu’elle sera accordée.',
          ],
        },
        {
          heading: 'Étendue et sa confirmation',
          paragraphs: [
            'Le cabinet travaille selon le droit de Taïwan et traite les affaires des groupes ci-dessus. L’étendue de chaque affaire est confirmée séparément après qu’une avocate ou un avocat a examiné votre message.',
            'Le statut de séjour, le permis de travail et des questions comparables sont appréciés à partir des pièces et de la situation de chaque personne, non à partir de la nationalité. Si une partie de votre affaire touche ces questions, mentionnez-le lors du contact. Cette page ne promet ni un résultat ni un délai de réponse.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'LE CABINET',
      title: 'À propos de Hovering International Law Firm',
      description:
        'Indications de base sur ce cabinet d’avocats taïwanais, ses bureaux et le travail avec des parties étrangères.',
      intro:
        'Hovering International Law Firm est un cabinet d’avocats à Taïwan. Les avocates et avocats travaillent du conseil aux entreprises jusqu’à la procédure judiciaire. Cette partie décrit la création du cabinet, les implantations et le travail avec des parties étrangères.',
      sections: [
        {
          heading: 'Création et organisation',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) a été fondé en 2016 par des avocates et avocats formés à la National Taiwan University (國立臺灣大學). Le nom chinois 昊鼎 unit le caractère 昊 (« ciel vaste ») et le caractère 鼎 (« base solide ») et décrit l’orientation du cabinet depuis sa création.',
            'Nous avons des bureaux à Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) et Pingtung (屏東). Le bureau de Kaohsiung se concentre sur la gouvernance d’entreprise et traite des litiges civils, pénaux et administratifs. Le bureau de Taichung traite des affaires de construction, de propriété intellectuelle et des affaires liées à la Corée et au Japon. Le bureau de Pingtung a été ouvert en 2017 pour le besoin local.',
            'Outre le travail d’avocat, Hovering Accounting Office existe depuis 2020 et propose comptabilité et planification fiscale aux entrepreneurs et aux particuliers fortunés.',
          ],
        },
        {
          heading: 'Travail avec des parties étrangères',
          paragraphs: [
            'Le travail transfrontalier couvre la constitution de sociétés, les visas, les dépôts de marques et de brevets, l’examen des risques juridiques et le conseil fiscal des entreprises. Le bureau de Taichung traite en particulier la construction, la propriété intellectuelle et les affaires liées à la Corée et au Japon. L’avocate Wei Tseng (曾雋崴) accompagne des clients de Corée, du Japon et d’autres clients internationaux dans les groupes indiqués.',
            'La possibilité de prendre une affaire dépend du contenu et de la langue de communication. Si votre affaire entre dans les groupes indiqués et peut être discutée dans l’une des quatre langues de consultation, vous pouvez envoyer un résumé pour examen.',
          ],
        },
        {
          heading: 'Lorsque vous nous contactez',
          paragraphs: [
            'Après réception de votre résumé, une avocate ou un avocat examine le contenu, puis parle de l’étendue possible, des pièces encore nécessaires et des étapes suivantes. Pour des questions fiscales ou comptables, le cabinet peut travailler avec le service de comptabilité dans un même flux.',
            'Le résultat de chaque affaire dépend des faits et des pièces existantes ; nous ne promettons pas un résultat. Si vous avez besoin d’une réponse concrète pour votre situation, les pièces doivent être discutées dans l’une des quatre langues de consultation avec une avocate ou un avocat.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'AVOCATES ET AVOCATS',
      title: 'Équipe internationale de Hovering',
      description: 'Profils des avocates et avocats, de la direction des opérations et de l’expertise-comptable associée de Hovering.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'ÉTENDUE ET HONORAIRES',
      title: 'Comment l’étendue du travail et les honoraires sont fixés',
      description:
        'Explication de l’ordre : d’abord l’étendue du travail, puis la confirmation des honoraires, et pourquoi cette page ne publie pas de liste de tarifs.',
      intro:
        'Cette page explique comment les honoraires sont fixés, non leur montant. Le montant dépend de l’étendue de chaque affaire et n’a de sens que lorsque cette étendue est claire.',
      sections: [
        {
          heading: 'L’étendue du travail est fixée en premier',
          paragraphs: [
            'Des affaires du même type peuvent exiger un travail très différent, selon le nombre de parties, les pièces disponibles, les délais à respecter et le fait qu’une procédure a déjà commencé. C’est pourquoi la première étape est toujours de fixer ce qui entre dans le travail et ce qui n’y entre pas.',
            'Le résumé que vous envoyez au début est la base de cette étendue. Plus il décrit clairement le déroulement, votre demande et les délais, plus l’étendue peut être déterminée avec précision.',
          ],
        },
        {
          heading: 'Les honoraires sont confirmés avant le début du travail',
          paragraphs: [
            'Lorsque l’étendue est claire, le montant et le mode de calcul sont discutés et confirmés avec vous avant le début du travail. Si l’étendue change en cours de route, cela doit être confirmé à nouveau.',
            'Cette page n’est pas une offre de prix et ne crée aucune obligation de paiement. L’envoi d’une demande par cette page n’entraîne aucun paiement.',
          ],
        },
        {
          heading: 'La consultation peut être un service payant',
          paragraphs: [
            'La consultation avec une avocate ou un avocat peut être une prestation payante. Cette page n’affirme pas que le premier entretien est offert, et aucune partie ne doit se lire en ce sens.',
            'Si la consultation est payante, le montant et le mode de paiement sont communiqués avant qu’elle ait lieu.',
          ],
        },
        {
          heading: 'Pourquoi cette page ne publie pas de tarifs',
          paragraphs: [
            'Les honoraires dépendent de l’affaire elle-même : du travail à faire, du nombre de parties, des pièces, des délais et du fait qu’une procédure est déjà en cours. Un chiffre fixé à l’avance ne montrerait pas le coût de votre dossier. C’est pourquoi nous fixons d’abord l’étendue du travail, puis nous vous communiquons les honoraires avant le début du travail.',
            'Outre les honoraires d’avocat, des frais de tribunal, d’autorité ou de tiers peuvent naître. Ils sont distincts des honoraires et dépendent de la procédure suivie.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'CONTACT',
      title: 'Comment joindre le cabinet',
      description:
        'Langue de la page, langues de consultation, la démarche si vous ne pouvez utiliser aucune des quatre langues, et ce que cette page ne promet pas.',
      intro:
        'Avant de nous écrire, distinguez s’il vous plaît les trois points suivants. Ils sont souvent mêlés, mais ils ne signifient pas la même chose.',
      sections: [
        {
          heading: 'Trois choses à tenir séparées',
          paragraphs: [
            'La langue d’affichage de la page, la langue de consultation avec l’avocate ou l’avocat et la langue dans laquelle vous écrivez sont trois choses distinctes.',
          ],
          items: [
            'Langue de la page : ces indications sont rédigées en français.',
            'Langue de consultation : la consultation a lieu en anglais, en chinois (中文), en japonais et en coréen.',
            'Votre langue d’écriture : vous pouvez rédiger le résumé dans votre propre langue ; le texte original est conservé tel quel.',
          ],
        },
        {
          heading: 'Si vous ne pouvez utiliser aucune des quatre langues de consultation',
          paragraphs: [
            'Dans le formulaire de contact, vous pouvez choisir « La manière de communiquer doit être confirmée ». Nous répondons pour examiner une manière possible de communiquer lorsqu’il en existe une ; une prestation dans une autre langue n’est pas assurée et aucun délai de réponse n’est promis.',
            'Ce n’est qu’une étape d’examen, non une promesse. Nous ne promettons pas de service d’interprétation, ni une prestation en français ou dans une autre langue hors des quatre langues indiquées, ni d’accepter toutes les affaires.',
          ],
        },
        {
          heading: 'Ce que le premier message devrait contenir',
          paragraphs: [
            'Indiquez ce qui s’est passé, l’aide dont vous avez besoin, le lien de l’affaire avec Taïwan et le délai, si vous en connaissez un. Si vous avez déjà reçu un écrit d’un tribunal ou d’une autorité, indiquez la date de cet écrit.',
            'À ce premier stade, vous n’avez pas encore à envoyer un numéro de passeport, un numéro d’identité, des données de compte, un dossier médical ou l’ensemble des preuves. Attendez les indications de l’avocate ou de l’avocat, puis envoyez les pièces sensibles par une voie sûre.',
          ],
        },
        {
          heading: 'Ce que cette page ne promet pas',
          paragraphs: [
            'Nous ne promettons pas de délai de réponse, nous ne confirmons pas de rendez-vous par cette page, nous ne promettons pas une avocate ou un avocat en particulier et nous ne mettons pas en place un service d’interprétation. La traduction écrite est autre chose : votre message n’est pas traduit automatiquement.',
            'Lorsque vous envoyez une demande, le contenu est conservé et attend un examen. Si, après un certain temps, vous ne recevez pas de réponse, vous pouvez écrire à nouveau à l’adresse de courrier indiquée sur la page de contact.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'QUESTIONS FRÉQUENTES',
      title: 'Questions souvent posées',
      description:
        'Explications sur le champ d’activité, la préparation, les langues, les honoraires et le sens d’une demande envoyée.',
      intro:
        'Les questions suivantes reçoivent une réponse au niveau des indications générales. Une réponse pour votre propre affaire n’est possible qu’après qu’une avocate ou un avocat a examiné les pièces.',
      sections: [
        {
          heading: 'Comment utiliser cette partie',
          paragraphs: [
            'Si vous ne trouvez pas de réponse pour votre situation, c’est souvent que la réponse dépend de faits particuliers. Écrivez alors ces faits dans le résumé, au lieu de les déduire vous-même de cette page.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Quelles affaires le cabinet traite-t-il ?',
          answer:
            'Nous traitons six groupes : investissement et constitution de sociétés à Taïwan, affaires civiles et dommages-intérêts, mariage, famille et successions, litiges du travail, affaires pénales et propriété intellectuelle. L’acceptation d’une affaire se décide après examen du contenu.',
        },
        {
          question: 'Que dois-je préparer avant de contacter le cabinet ?',
          answer:
            'Préparez un court résumé du déroulement, de votre demande, du lien avec Taïwan et du délai s’il en existe un. S’il existe déjà un écrit d’un tribunal ou d’une autorité, indiquez la date. À ce stade, vous n’avez pas encore à envoyer des pièces d’identité ni l’ensemble des preuves.',
        },
        {
          question: 'La consultation en français est-elle possible ?',
          answer:
            'Non. Ces indications sont rédigées en français, mais la consultation avec une avocate ou un avocat a lieu seulement en anglais, en chinois (中文), en japonais et en coréen. Nous ne promettons pas non plus de service d’interprétation. La traduction écrite est autre chose : le texte original que vous écrivez est conservé tel quel et n’est pas traduit automatiquement.',
        },
        {
          question: 'Que se passe-t-il si je ne peux utiliser aucune des quatre langues ?',
          answer:
            'Choisissez « La manière de communiquer doit être confirmée » lors de l’envoi de la demande. Nous répondons pour examiner une manière de communiquer, mais une prestation dans une autre langue n’est pas assurée. C’est une étape d’examen, non une promesse que nous puissions travailler dans une autre langue.',
        },
        {
          question: 'Comment le texte que j’écris en français est-il traité ?',
          answer:
            'Le texte original que vous écrivez est conservé tel quel et n’est pas traduit automatiquement. Si besoin, la langue de la communication ultérieure est confirmée avec vous.',
        },
        {
          question: 'La consultation a-t-elle déjà eu lieu une fois la demande envoyée ?',
          answer:
            'Non. Une demande envoyée attend l’examen d’une avocate ou d’un avocat. Ce n’est pas un avis juridique, ce n’est pas un rendez-vous confirmé, et l’envoi ne crée pas, à lui seul, une relation entre avocate ou avocat et client.',
        },
        {
          question: 'Comment les honoraires sont-ils calculés ?',
          answer:
            'L’étendue du travail est d’abord fixée, puis le montant et le mode de calcul sont confirmés avec vous avant le début du travail. Cette page ne publie pas de chiffres et n’affirme pas que le premier entretien est offert.',
        },
        {
          question: 'Que faire si mon affaire est urgente ?',
          answer:
            'Indiquez le délai ou la date d’un écrit officiel au début de votre résumé, afin que ces dates soient visibles lors de l’examen. Cette page n’a pas de canal d’urgence et n’assure aucun délai de réponse ; si votre affaire ne peut pas attendre, il convient de chercher en parallèle d’autres voies là où vous vous trouvez.',
        },
      ],
    },
    privacy: {
      eyebrow: 'CONFIDENTIALITÉ',
      title: 'Données recueillies par le formulaire de contact',
      description:
        'Ce que le formulaire de cette partie en français recueille, comment le texte original est traité et comment nous joindre au sujet de vos données.',
      intro:
        'Cette partie concerne seulement le formulaire de contact de ces pages d’indications. Elle décrit le traitement des données, non une assurance technique.',
      sections: [
        {
          heading: 'Données recueillies',
          paragraphs: [
            'Lorsque vous envoyez une demande par le formulaire de cette partie, les éléments suivants sont enregistrés :',
          ],
          items: [
            'Le nom que vous indiquez',
            'L’adresse de courrier pour la réponse',
            'La langue d’affichage de la page au moment de l’envoi',
            'La langue dans laquelle vous avez écrit',
            'La langue de consultation que vous souhaitez',
            'Le texte original que vous avez écrit',
            'Votre consentement à l’envoi de la demande',
            'Un numéro de réception pour retrouver la demande',
          ],
        },
        {
          heading: 'Le texte original est conservé tel quel',
          paragraphs: [
            'Votre texte est conservé exactement comme vous l’avez écrit et n’est pas traduit automatiquement. Si une traduction est nécessaire pour le traitement, cela est discuté avec vous séparément.',
            'Parce que le texte original est conservé, n’écrivez pas, à ce premier stade, ce qui n’est pas encore nécessaire, par exemple un numéro de passeport, un numéro d’identité ou des données de compte.',
          ],
        },
        {
          heading: 'Lieu de conservation et accès',
          paragraphs: [
            'Le contenu de votre envoi est conservé dans un lieu qui n’est pas d’accès public. Seules les personnes autorisées du cabinet peuvent y accéder pour traiter la demande.',
            'Cette page n’offre pas une assurance absolue de sécurité. Aucune voie de transmission ni aucun lieu de conservation n’est entièrement sûr ; les pièces sensibles ne devraient donc être envoyées que selon les indications particulières de l’avocate ou de l’avocat.',
          ],
        },
        {
          heading: 'Finalité de l’usage',
          paragraphs: [
            'Les données envoyées servent à l’examen de la demande, à vous répondre, à clarifier la manière de communiquer et au traitement si le travail est entrepris.',
            'Les données ne sont pas utilisées à des fins de marketing sans un consentement distinct.',
          ],
        },
        {
          heading: 'Avis et numéro de réception',
          paragraphs: [
            'Lorsqu’une demande est envoyée avec succès, le système avise le cabinet. Si cet avis n’est pas encore confirmé, votre texte reste conservé et n’est pas perdu.',
            'Le numéro de réception sert à retrouver votre demande dans nos dossiers. Il s’affiche après l’enregistrement ; vous pouvez le citer lors d’un nouveau contact.',
          ],
        },
        {
          heading: 'Vos droits et la voie de contact',
          paragraphs: [
            'Vous pouvez demander l’accès, la rectification ou l’effacement de vos données, ou retirer le consentement, par l’adresse de courrier indiquée sur la page de contact. S’il existe une obligation de conservation légale ou liée à une procédure, nous expliquons la limite.',
            'Cette page n’indique pas de durée fixe de conservation, parce que la durée réelle dépend de la poursuite de l’affaire et des obligations liées. Si vous souhaitez un effacement plus tôt, indiquez-le lors du contact.',
          ],
        },
        {
          heading: 'Lieu de conservation et prestataires',
          paragraphs: [
            'Ce site est hébergé chez Vercel, et votre envoi est conservé dans un stockage d’objets non public de ce service. Les courriers sont envoyés par le service de courrier utilisé par le cabinet.',
            'Les serveurs de certains prestataires peuvent se trouver hors de Taïwan, de sorte que vos données peuvent y être conservées et traitées. Une fois la finalité de conservation atteinte, les données sont effacées sans délai ; les données qui doivent être conservées selon les règles applicables le restent pendant cette durée. Les demandes relatives aux données personnelles sont reçues à wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'AVERTISSEMENT',
      title: 'Étendue et limites des indications de cette page',
      description:
        'Le caractère général des indications, le cadre juridique et les conditions d’une relation entre avocate ou avocat et client.',
      intro:
        'Cette partie précise ce que ces pages d’indications en français peuvent et ne peuvent pas faire pour vous.',
      sections: [
        {
          heading: 'Indications générales seulement',
          paragraphs: [
            'Le contenu de ces pages est rédigé comme information générale. Il n’est pas un avis juridique pour votre affaire et ne remplace pas l’examen de vos propres pièces.',
            'L’issue d’une affaire dépend des faits, des règles applicables et du moment ; deux situations qui semblent proches peuvent se terminer différemment.',
          ],
        },
        {
          heading: 'Cadre juridique',
          paragraphs: [
            'Le cabinet exerce selon le droit de Taïwan, et cette page ne parle que du travail dans ce cadre.',
            'Le contenu n’est pas un conseil selon le droit d’un autre ordre juridique que Taïwan, y compris le droit de votre lieu de résidence. Si une partie de votre affaire relève d’un autre ordre juridique, nous clarifions avec vous quelle personne qualifiée est nécessaire pour cette partie.',
          ],
        },
        {
          heading: 'Une relation entre avocate ou avocat et client ne naît pas d’elle-même',
          paragraphs: [
            'Lire cette page, envoyer un formulaire ou un courrier ne crée pas, à lui seul, une relation entre avocate ou avocat et client.',
            'Cette relation naît seulement après examen de l’affaire et confirmation, par les deux parties, de la prise en charge du travail.',
          ],
        },
        {
          heading: 'Aucune promesse de résultat',
          paragraphs: [
            'Aucune partie de cette page n’est une promesse sur le résultat d’une affaire, sur l’octroi d’une demande ou sur le statut de séjour et de travail.',
            'Les liens externes sont fournis pour s’orienter ; nous n’assurons ni l’exactitude ni l’actualité des contenus de tiers.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'ARTICLES',
      title: 'Articles sur le droit de Taïwan',
      description:
        'Articles en français sur des questions fréquentes du droit de Taïwan. Le contenu est une information générale au moment de la publication, non un avis juridique pour votre affaire.',
      intro:
        'Le cabinet publie des articles sur des questions fréquentes du droit de Taïwan. Les articles disponibles en français figurent sur cette page ; il y a en outre quatre liens, chacun ouvrant la liste d’articles d’une langue d’origine.',
      sections: [
        {
          heading: 'Quatre listes selon la langue',
          paragraphs: [
            'Cette partie contient quatre liens : la liste d’articles en coréen, en chinois, en anglais et en japonais. Chaque lien indique la langue de sa liste, afin que vous sachiez d’avance dans quelle langue le contenu s’ouvrira.',
            'Ces quatre listes sont des listes selon la langue d’origine des articles, non des listes de traductions. Les articles déjà disponibles en français figurent séparément sur cette même page.',
          ],
        },
        {
          heading: 'Où mènent les liens',
          paragraphs: [
            'Lorsque vous choisissez l’un des quatre liens, la liste d’articles de cette langue s’ouvre. Dans la liste, vous choisissez vous-même le texte ; l’ensemble du contenu apparaît dans la langue d’origine de l’article.',
            'Cette page ne résume pas le contenu des articles et n’assure pas qu’un thème existe dans les quatre langues. Chaque liste ne contient que les textes publiés dans cette langue.',
          ],
        },
        {
          heading: 'Jusqu’où un article peut servir d’orientation',
          paragraphs: [
            'Les articles sont des indications générales au moment de la publication. Les règles et leur application peuvent changer, et un article ne reprend pas toutes les circonstances de votre affaire.',
            'Ne fondez donc aucune action dans une affaire réelle sur un article seul. Servez-vous-en pour une vue d’ensemble, puis discutez vos pièces séparément avec une avocate ou un avocat ; cette page n’est pas l’étape de consultation.',
          ],
        },
      ],
    },
  },
};

export const portugueseGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Português',
  nav: {
    home: 'Início',
    services: 'Áreas de atividade',
    about: 'O escritório',
    lawyers: 'Advogadas e advogados',
    pricing: 'Âmbito e honorários',
    contact: 'Contacto',
    faq: 'Perguntas frequentes',
    privacy: 'Privacidade',
    disclaimer: 'Aviso legal',
    columns: 'Artigos',
  },
  contactCta: 'Enviar um pedido de consulta',
  footerNotice:
    'Esta página em português contém apenas indicações gerais sobre o trabalho do escritório segundo o direito de Taiwan. Não é um parecer jurídico para um caso concreto, e o envio de uma mensagem não cria, por si só, uma relação entre advogada ou advogado e cliente.',
  skipLink: 'Saltar a navegação e ir para o conteúdo',
  menuLabel: 'Menu',
  languageLabel: 'Língua da página',
  mega: {
    services: {
      description: 'O escritório trata os grupos principais de atividade segundo o direito de Taiwan.',
      viewAllLabel: 'Ver tudo',
    },
    columns: {
      description: 'Artigos sobre questões frequentes do direito de Taiwan.',
      viewAllLabel: 'Ver tudo',
    },
    lawyers: {
      description: 'Apresentação das advogadas e dos advogados em atividade e das vias de contacto.',
      viewAllLabel: 'Ver tudo',
    },
    pricing: {
      description: 'Esta página explica o âmbito do trabalho e o modo como os honorários são confirmados.',
      viewAllLabel: 'Ver tudo',
    },
    faq: {
      description: 'Perguntas frequentes sobre o trabalho do escritório em Taiwan.',
      viewAllLabel: 'Ver tudo',
    },
  },
  notFoundTitle: 'Página não encontrada',
  notFoundText:
    'A página procurada não existe ou foi deslocada. Pode regressar ao início em português para ver as indicações disponíveis.',
  backHomeLabel: 'Voltar ao início',
  readSourceLabel: 'Abrir a lista de artigos na língua original',
  home: {
    heroScrollLabel: 'Deslocar para baixo',
    heroColumnsCtaLabel: 'Ver artigos',
    servicesDetailLabel: 'Ver pormenores',
    servicesAssistanceBefore: 'Se ainda não for claro a que grupo pertence o seu assunto, a página de ',
    servicesAssistanceLinkLabel: 'Contacto',
    servicesAssistanceAfter:
      ' explica como redigir um resumo que uma advogada ou um advogado irá examinar.',
    columnsViewAllLabel: 'Ver todos os artigos',
    columnsReadMoreLabel: 'Continuar a ler',
    columnsReviewLabel: 'Revisto pela advogada Wei Tseng',
    columnsOriginalLanguageBadge: 'Língua original',
    columnsOriginalLanguageNote:
      'Os artigos seguintes ainda não estão disponíveis em português. A lista permanece na língua original e abre essa página; o conteúdo não é traduzido de forma automática.',
    imageBandAlt: 'Casa tradicional taiwanesa (三合院) e um pavilhão contemporâneo em plena luz do dia',
    videoPauseLabel: 'Pausar o vídeo',
    videoPlayLabel: 'Reproduzir o vídeo',
    videoReplayLabel: 'Voltar a reproduzir o vídeo',
  },
  pages: {
    home: {
      eyebrow: 'INDICAÇÕES',
      title: 'Serviços jurídicos em Taiwan — indicações em português',
      description:
        'Explicação geral em português sobre o âmbito de Hovering International Law Firm em Taiwan, as línguas de consulta e o primeiro contacto.',
      intro:
        'Hovering International Law Firm acompanha clientes do estrangeiro, incluindo quem tem um vínculo com Taiwan, em assuntos de direito taiwanês: investimento e constituição de sociedades, litígios civis, casamento, família e sucessões, laboral, penal e propriedade intelectual. Esta parte em português ajuda a saber que trabalho entra no nosso âmbito, o que convém preparar e como nos contactar. São indicações gerais, não um parecer jurídico para o seu próprio caso.',
      sections: [
        {
          heading: 'O que fazemos',
          paragraphs: [
            'Hovering International Law Firm é um escritório de advogados estabelecido em Taiwan. Trabalha segundo o direito taiwanês e tem escritórios em Taipé (臺北), Kaohsiung (高雄), Taichung (臺中) e Pingtung (屏東). Aconselhamos empresas e conduzimos procedimentos perante os tribunais, e acompanhamos clientes do estrangeiro nos trâmites que devem seguir-se em Taiwan.',
            'Todo o conteúdo destas páginas é geral. O resultado de um assunto depende dos factos, das normas aplicáveis e do momento. Estas indicações não substituem uma conversa com uma advogada ou um advogado sobre o seu processo.',
          ],
        },
        {
          heading: 'A língua da página e a língua de consulta não são a mesma coisa',
          paragraphs: [
            'Esta página está escrita em português, mas a consulta com uma advogada ou um advogado realiza-se apenas nas quatro línguas de consulta: inglês, chinês (中文), japonês e coreano. Ler as indicações em português não significa que a conversa com a advogada ou o advogado se realize em português.',
            'Não prometemos serviço de interpretação, não prometemos um prazo de resposta e não confirmamos marcações através desta página. Se não puder usar nenhuma dessas quatro línguas, a página «Contacto» explica como examinamos uma forma de comunicar.',
          ],
        },
        {
          heading: 'Áreas de atividade',
          paragraphs: [
            'O âmbito do escritório cobre os seis grupos seguintes. A página «Áreas de atividade» descreve cada grupo com mais pormenor e indica o que não é prometido.',
          ],
          items: [
            'Investimento e constituição de sociedades em Taiwan',
            'Litígios civis e indemnizações',
            'Casamento, família e sucessões',
            'Conflitos laborais',
            'Assuntos penais',
            'Propriedade intelectual: marcas, patentes e direitos de autor',
          ],
        },
        {
          heading: 'Por onde convém começar',
          paragraphs: [
            'Leia a página «Áreas de atividade» para verificar se o seu assunto entra no nosso âmbito e, em seguida, «Âmbito e honorários» e «Contacto» para saber como se fixa o âmbito e se confirmam os honorários antes de começar o trabalho.',
            'Ao enviar uma mensagem, pode escrever o resumo na sua própria língua. O texto original é guardado tal como o escreve e não é traduzido de forma automática. Uma mensagem enviada é um pedido que espera exame: ainda não é uma consulta nem uma marcação confirmada.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'ÁREAS DE ATIVIDADE',
      title: 'Assuntos que tratamos',
      description:
        'Seis grupos de trabalho do escritório em Taiwan e os limites que convém conhecer de antemão.',
      intro:
        'Seguem-se os grupos de que nos ocupamos e as questões que costumam surgir no início. Esta descrição ajuda a avaliar se o seu assunto entra no nosso âmbito; é informação geral, não a análise jurídica de um processo concreto.',
      sections: [
        {
          heading: 'Investimento e constituição de sociedades em Taiwan',
          paragraphs: [
            'Acompanhamos investidores e empresas estrangeiras que constituem ou exploram uma sociedade em Taiwan: escolha da forma societária, preparação e apresentação de documentos, entrada de capital, banca, avaliação do local e requisitos próprios de certos setores. Também apoiamos a contabilidade e a fiscalidade decorrentes de constituir e operar em Taiwan.',
            'A ordem e a duração do processo variam segundo a forma societária, o investidor, o setor, o banco e os documentos disponíveis. Constituir uma sociedade não produz, por si só, um título de residência (居留) nem uma autorização de trabalho (工作許可): são trâmites distintos, apreciados segundo a situação de cada pessoa.',
          ],
        },
        {
          heading: 'Litígios civis e indemnizações',
          paragraphs: [
            'Este grupo cobre conflitos contratuais, pedidos de indemnização por ato ilícito e conflitos de consumo. O trabalho costuma começar por uma cronologia dos factos, a revisão de documentos e provas existentes e, só depois, os passos seguintes.',
            'Os prazos, incluindo os prazos legais para demandar, e a integridade das provas marcam o curso do assunto civil, pelo que deve indicar desde o início as datas que conheça. Se conservar contratos, mensagens, comprovativos de pagamento ou fotografias do local, mencione-os na primeira mensagem.',
          ],
        },
        {
          heading: 'Casamento, família e sucessões',
          paragraphs: [
            'Tratamos divórcio (離婚), partilha de bens, exercício e assunção de direitos e deveres relativamente a filhos menores (未成年子女權利義務之行使或負擔), regime de visitas (會面交往) e sucessões (繼承), também quando as partes ou os bens estão em países distintos. Os assuntos de família transfronteiriços exigem muitas vezes um exame adicional de documentos do registo de agregados (戶籍), da forma dos documentos e do seu valor probatório em Taiwan.',
            'Como os assuntos de família costumam ir ligados a prazos e a vários trâmites em paralelo, o resumo inicial deve indicar a relação entre as partes, o local de residência atual e os procedimentos já iniciados.',
          ],
        },
        {
          heading: 'Conflitos laborais',
          paragraphs: [
            'Este grupo cobre a cessação do contrato de trabalho, a indemnização segundo o direito de Taiwan (資遣費; não se identifica com instituições de outros países), salários e conflitos decorrentes do contrato de trabalho (勞動契約), tanto do lado da pessoa trabalhadora como do empregador. Ao rever o assunto separamos o fundamento da cessação das questões de pré-aviso, pagamento e prazos.',
            'O contrato de trabalho, o regulamento interno (工作規則), os recibos de vencimento e a troca escrita entre as partes são, em regra, os documentos decisivos. Se ainda os conserva, indique-o no resumo.',
          ],
        },
        {
          heading: 'Assuntos penais',
          paragraphs: [
            'Intervimos na fase de investigação e em tribunal, tanto a favor da pessoa investigada ou acusada como da vítima, e avaliamos o risco penal da atividade empresarial.',
            'Os assuntos penais costumam ter prazos curtos e etapas já definidas, pelo que, se já recebeu um escrito da autoridade ou do tribunal, indique a data desse escrito desde o início para que o conteúdo seja revisto na ordem adequada.',
          ],
        },
        {
          heading: 'Propriedade intelectual',
          paragraphs: [
            'Ajudamos no registo de marcas (商標) e patentes (專利), em direitos de autor e em conflitos sobre esses direitos em Taiwan.',
            'Neste grupo a ordem dos passos é decisiva: o âmbito da proteção, o momento da apresentação e o uso efetivo influenciam a escolha. Apresentar um pedido não significa, por si só, que seja concedido.',
          ],
        },
        {
          heading: 'Âmbito e a sua confirmação',
          paragraphs: [
            'O escritório trabalha segundo o direito de Taiwan e trata assuntos dos grupos anteriores. O âmbito de cada assunto confirma-se separadamente depois de uma advogada ou um advogado rever o conteúdo que envia.',
            'O estatuto de residência, a autorização de trabalho e questões semelhantes avaliam-se a partir do processo e da situação de cada pessoa, não a partir da nacionalidade. Se alguma parte do seu assunto tocar esses temas, indique-o ao contactar-nos. Esta página não promete um resultado nem um prazo de resposta.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'O ESCRITÓRIO',
      title: 'Sobre Hovering International Law Firm',
      description:
        'Informação de base sobre este escritório de advogados em Taiwan, os seus escritórios e o trabalho com partes estrangeiras.',
      intro:
        'Hovering International Law Firm é um escritório de advogados em Taiwan. As advogadas e os advogados trabalham desde o aconselhamento a empresas até à atuação perante os tribunais. Esta parte descreve a fundação do escritório, as sedes e o trabalho com partes estrangeiras.',
      sections: [
        {
          heading: 'Fundação e estrutura',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) foi fundado em 2016 por advogadas e advogados formados na National Taiwan University (國立臺灣大學). O nome chinês 昊鼎 une o carácter 昊 («céu amplo») e o carácter 鼎 («base sólida») e descreve a orientação do escritório desde a fundação.',
            'Temos escritórios em Taipé (臺北), Kaohsiung (高雄), Taichung (臺中) e Pingtung (屏東). O escritório de Kaohsiung centra-se na governação de empresas e trata conflitos civis, penais e administrativos. O escritório de Taichung trata construção, propriedade intelectual e assuntos relacionados com a Coreia e o Japão. O escritório de Pingtung abriu em 2017 para responder às necessidades locais.',
            'Além do trabalho de advocacia, em 2020 criou-se Hovering Accounting Office, que oferece contabilidade e planeamento fiscal a empresários e a particulares com património elevado.',
          ],
        },
        {
          heading: 'Trabalho com partes estrangeiras',
          paragraphs: [
            'O trabalho transfronteiriço cobre constituição de sociedades, vistos, registo de marcas e patentes, avaliação de riscos jurídicos e aconselhamento fiscal empresarial. O escritório de Taichung trata em particular construção, propriedade intelectual e assuntos relacionados com a Coreia e o Japão. A advogada Wei Tseng (曾雋崴) acompanha clientes da Coreia, do Japão e outros clientes internacionais nos grupos indicados.',
            'A possibilidade de tratar um assunto depende do conteúdo e da língua da comunicação. Se o seu assunto entra nos grupos indicados e pode ser tratado numa das quatro línguas de consulta, pode enviar um resumo para exame.',
          ],
        },
        {
          heading: 'Quando nos contacta',
          paragraphs: [
            'Após receber o seu resumo, uma advogada ou um advogado examina o conteúdo e fala depois do âmbito possível, dos documentos ainda necessários e dos passos seguintes. Se o assunto colocar questões contabilísticas ou fiscais, o escritório pode trabalhar com a área de contabilidade de forma integrada.',
            'O resultado de cada assunto depende dos factos e dos documentos existentes; não prometemos um resultado. Se precisar de uma resposta concreta para a sua situação, esse processo deve ser discutido diretamente com uma advogada ou um advogado numa das quatro línguas de consulta.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'ADVOGADAS E ADVOGADOS',
      title: 'Equipa internacional de Hovering',
      description: 'Perfis das advogadas e dos advogados, da direção de operações e da contabilidade associada de Hovering.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'ÂMBITO E HONORÁRIOS',
      title: 'Como se fixam o âmbito do trabalho e os honorários',
      description:
        'Explicação da ordem: primeiro o âmbito, depois a confirmação dos honorários, e por que esta página não publica uma lista de tarifas.',
      intro:
        'Esta página explica como se fixam os honorários, não o respetivo montante. O montante depende do âmbito de cada assunto e só faz sentido quando esse âmbito está claro.',
      sections: [
        {
          heading: 'O primeiro passo é fixar o âmbito do trabalho',
          paragraphs: [
            'Assuntos do mesmo tipo podem exigir um trabalho muito distinto, segundo o número de partes, os documentos disponíveis, os prazos a cumprir e se um procedimento já começou. Por isso o primeiro passo é sempre esclarecer o que entra no trabalho e o que não entra.',
            'O resumo que envia no início é a base desse âmbito. Quanto mais claro descrever os factos, o que espera e os prazos, mais preciso poderá ser o âmbito.',
          ],
        },
        {
          heading: 'Os honorários confirmam-se antes de começar o trabalho',
          paragraphs: [
            'Quando o âmbito está claro, o montante e o modo de cálculo são discutidos e confirmados consigo antes de começar. Se o âmbito mudar a meio do caminho, essa mudança também deve confirmar-se de novo.',
            'Esta página não é uma oferta de preço e não gera qualquer obrigação de pagamento. Enviar um pedido através desta página também não implica qualquer pagamento.',
          ],
        },
        {
          heading: 'A consulta pode ser um serviço pago',
          paragraphs: [
            'A consulta com uma advogada ou um advogado pode ser um serviço pago. Esta página não afirma que a primeira consulta seja gratuita, e nenhuma parte deve ler-se nesse sentido.',
            'Se a consulta tiver custo, o montante e a forma de pagamento comunicam-se antes de ter lugar.',
          ],
        },
        {
          heading: 'Por que esta página não publica tarifas',
          paragraphs: [
            'O montante depende do próprio assunto: do trabalho a fazer, do número de partes, dos documentos, dos prazos e de se um procedimento já começou. Um valor indicado de antemão não mostraria o custo do seu processo. Por isso fixamos primeiro o âmbito do seu assunto e comunicamos-lhe depois os honorários para os avaliar antes de começar.',
            'Além dos honorários da advogada ou do advogado, um assunto pode gerar taxas a pagar ao tribunal, a uma autoridade ou a um terceiro. Essas taxas são distintas dos honorários e dependem do procedimento seguido.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'CONTACTO',
      title: 'Como contactar o escritório',
      description:
        'Língua da página, línguas de consulta, o que ocorre se não puder usar essas quatro línguas, e o que esta página não promete.',
      intro:
        'Antes de nos escrever, tenha em conta estes três pontos em separado. Muitas vezes confundem-se, mas não significam o mesmo.',
      sections: [
        {
          heading: 'Três coisas que convém distinguir',
          paragraphs: [
            'A língua em que a página é apresentada, a língua da consulta com a advogada ou o advogado e a língua em que escreve são três coisas distintas.',
          ],
          items: [
            'Língua da página: esta orientação está escrita em português.',
            'Língua de consulta: a consulta realiza-se apenas em inglês, chinês (中文), japonês e coreano.',
            'Língua do seu texto: pode escrever o resumo na sua própria língua, e o texto original guarda-se tal qual.',
          ],
        },
        {
          heading: 'Se não puder usar nenhuma das quatro línguas de consulta',
          paragraphs: [
            'No formulário de contacto pode escolher «É preciso confirmar a forma de comunicar». Responderemos para examinar uma via possível de comunicação quando existir uma forma possível; não se assegura o serviço noutra língua e não se promete um prazo de resposta.',
            'Isto é apenas um passo de verificação, não é uma promessa. Não prometemos serviço de interpretação, não prometemos serviço em português nem noutra língua fora das quatro indicadas, e não prometemos que possamos aceitar todos os assuntos.',
          ],
        },
        {
          heading: 'O que convém escrever na primeira mensagem',
          paragraphs: [
            'Indique o que ocorreu, que ajuda precisa, que relação tem o assunto com Taiwan e o prazo se o conhecer. Se já recebeu um escrito de um tribunal ou de uma autoridade, indique a data desse escrito.',
            'Nesta primeira fase ainda não precisa de enviar número de passaporte, número de identidade, dados bancários, historial clínico nem o processo completo de provas. Espere as indicações da advogada ou do advogado e envie então o material sensível por um meio seguro.',
          ],
        },
        {
          heading: 'O que esta página não promete',
          paragraphs: [
            'Não prometemos um prazo de resposta, não confirmamos uma marcação através desta página, não prometemos uma advogada ou um advogado concreto e não disponibilizamos serviço de interpretação. A tradução escrita é outra coisa: a mensagem que envia não se traduz de forma automática.',
            'Quando envia um pedido, o conteúdo guarda-se e espera revisão. Se passado algum tempo não receber resposta, pode voltar a escrever para o endereço de correio indicado na página de contacto.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'PERGUNTAS FREQUENTES',
      title: 'Perguntas frequentes',
      description:
        'Explicação do âmbito, da preparação, das línguas, dos honorários e do significado de enviar um pedido.',
      intro:
        'As respostas seguintes são informação geral. A resposta para o seu próprio caso só pode dar-se depois de uma advogada ou um advogado rever o processo.',
      sections: [
        {
          heading: 'Como usar esta parte',
          paragraphs: [
            'Se não encontrar uma resposta para a sua situação, costuma ser sinal de que a resposta depende de factos particulares. Nesse caso, escreva esses factos no resumo ao contactar-nos, em vez de os deduzir por sua conta desta página.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Que tipo de assuntos trata este escritório?',
          answer:
            'Tratamos seis grupos: investimento e constituição de sociedades em Taiwan, litígios civis e indemnizações, casamento, família e sucessões, conflitos laborais, assuntos penais e propriedade intelectual. A aceitação de um assunto decide-se depois de rever o conteúdo.',
        },
        {
          question: 'O que devo preparar antes de contactar o escritório?',
          answer:
            'Prepare um resumo breve do ocorrido, do que espera, do vínculo com Taiwan e do prazo se existir. Se já houver um escrito de um tribunal ou de uma autoridade, indique a data. Nesta fase ainda não precisa de enviar documentos de identidade nem todas as provas.',
        },
        {
          question: 'Posso ter uma consulta em português?',
          answer:
            'Não. Esta orientação está escrita em português, mas a consulta com uma advogada ou um advogado realiza-se apenas em inglês, chinês (中文), japonês e coreano. Também não prometemos serviço de interpretação. A tradução escrita é outra coisa: o texto original que escreve guarda-se tal qual e não se traduz de forma automática.',
        },
        {
          question: 'O que ocorre se não puder usar nenhuma dessas quatro línguas?',
          answer:
            'Escolha «É preciso confirmar a forma de comunicar» ao enviar o pedido. Responderemos para examinar uma forma de comunicar, mas não se assegura o serviço noutra língua. É um passo de verificação, não uma promessa de que possamos atender noutra língua.',
        },
        {
          question: 'Como se trata o texto que escrevo em português?',
          answer:
            'O texto original que escreve guarda-se tal qual e não se traduz de forma automática. Se for preciso, a língua da comunicação posterior confirma-se consigo.',
        },
        {
          question: 'Se já enviei o pedido, a consulta já teve lugar?',
          answer:
            'Não. Um pedido enviado espera a revisão de uma advogada ou de um advogado. Não é parecer jurídico, não é uma marcação confirmada, e o envio não cria, por si só, uma relação entre advogada ou advogado e cliente.',
        },
        {
          question: 'Como se calculam os honorários?',
          answer:
            'Primeiro fixa-se o âmbito do trabalho e depois confirmam-se consigo o montante e o modo de cálculo antes de começar. Esta página não publica valores e não afirma que a primeira consulta seja gratuita.',
        },
        {
          question: 'O que faço se o meu assunto for urgente?',
          answer:
            'Indique o prazo ou a data de um escrito oficial no início do seu resumo para que essas datas sejam visíveis na revisão. Esta página não tem um canal de emergência e não assegura um prazo de resposta; se o seu assunto não puder esperar, convém procurar ao mesmo tempo outras vias no local onde se encontra.',
        },
      ],
    },
    privacy: {
      eyebrow: 'PRIVACIDADE',
      title: 'Dados recolhidos através do formulário de contacto',
      description:
        'O que o formulário desta parte em português recolhe, como se trata o texto original e como nos contactar sobre os seus dados.',
      intro:
        'Esta parte refere-se apenas ao formulário de contacto destas páginas de orientação. Descreve o tratamento dos dados, não uma garantia técnica.',
      sections: [
        {
          heading: 'Dados que se recolhem',
          paragraphs: [
            'Quando envia um pedido através do formulário desta parte, registam-se os seguintes elementos:',
          ],
          items: [
            'O nome que indica',
            'O endereço de correio para responder',
            'A língua da página no momento do envio',
            'A língua em que escreveu',
            'A língua de consulta que deseja',
            'O texto original que escreveu',
            'O seu consentimento para enviar o pedido',
            'Um número de receção para voltar a localizar o pedido',
          ],
        },
        {
          heading: 'O texto original guarda-se tal qual',
          paragraphs: [
            'O seu escrito guarda-se exatamente como o redigiu e não se traduz de forma automática. Se for precisa uma tradução para tramitar o assunto, fala-se consigo em separado.',
            'Como o texto original se guarda, não escreva nesta primeira fase dados que ainda não fazem falta, como o número de passaporte, o número de identidade ou dados de uma conta bancária.',
          ],
        },
        {
          heading: 'Onde se guarda e quem pode vê-lo',
          paragraphs: [
            'O conteúdo do seu envio guarda-se num lugar que não é de acesso público, e só as pessoas autorizadas do escritório podem aceder a ele para tramitar esse pedido.',
            'Esta página não oferece uma segurança absoluta. Nenhuma via de envio nem de armazenamento é de todo segura, pelo que o material sensível convém enviá-lo apenas segundo as indicações concretas da advogada ou do advogado.',
          ],
        },
        {
          heading: 'Finalidade do uso',
          paragraphs: [
            'Os dados que envia usam-se para rever o pedido, voltar a contactá-lo, confirmar a forma de comunicar e tramitar o assunto se o trabalho chegar a começar.',
            'Estes dados não se usam para marketing sem um consentimento seu dado em separado para esse fim.',
          ],
        },
        {
          heading: 'Aviso e número de receção',
          paragraphs: [
            'Quando um pedido se envia com êxito, o sistema avisa o escritório. Se esse aviso ainda não estiver confirmado, o que escreveu continua guardado e não se perde.',
            'O número de receção serve para voltar a encontrar o seu pedido nos nossos registos. Mostra-se depois de guardar o pedido, e pode mencioná-lo se voltar a contactar-nos.',
          ],
        },
        {
          heading: 'Os seus direitos e como nos contactar',
          paragraphs: [
            'Pode pedir acesso, retificação ou supressão dos seus dados, ou retirar o consentimento, através do endereço de correio indicado na página de contacto. Se existir uma obrigação de conservação segundo as normas aplicáveis ou por um assunto em curso, explicaremos o motivo da limitação.',
            'Esta página não indica um prazo fixo de conservação, porque a duração real depende de o assunto continuar e das obrigações de conservação associadas. Se desejar que se suprimam antes, indique-o ao contactar-nos.',
          ],
        },
        {
          heading: 'Lugar de armazenamento e prestadores',
          paragraphs: [
            'Este sítio aloja-se na Vercel, e o seu envio guarda-se num armazenamento de objetos não público desse serviço. O correio envia-se através do serviço de correio que o escritório utiliza.',
            'Os servidores de alguns prestadores podem estar fora de Taiwan, de modo que os seus dados podem armazenar-se e tratar-se aí. Cumprida a finalidade do armazenamento, os dados suprimem-se sem demora; os dados que devam conservar-se segundo as normas aplicáveis conservam-se durante esse prazo. Os pedidos relativos a dados pessoais recebem-se em wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'AVISO LEGAL',
      title: 'Âmbito e limites da informação desta página',
      description:
        'O carácter geral da informação, o âmbito jurídico e as condições para que exista uma relação entre advogada ou advogado e cliente.',
      intro:
        'Esta parte esclarece o que estas páginas de orientação em português podem e não podem fazer por si.',
      sections: [
        {
          heading: 'Apenas informação geral',
          paragraphs: [
            'O conteúdo destas páginas está escrito como informação geral. Não é um parecer jurídico para o seu caso e não substitui a revisão do seu próprio processo.',
            'O resultado de um assunto depende dos factos, das normas aplicáveis e do momento, de modo que duas situações que parecem semelhantes podem terminar de forma distinta.',
          ],
        },
        {
          heading: 'Âmbito jurídico',
          paragraphs: [
            'O escritório exerce segundo o direito de Taiwan, e esta página só fala do trabalho nesse quadro.',
            'O conteúdo não é aconselhamento segundo o direito de nenhuma jurisdição distinta de Taiwan, incluindo o direito do lugar onde reside. Se alguma parte do seu assunto se rege por outra jurisdição, confirmaremos consigo que profissional qualificado faz falta para essa parte.',
          ],
        },
        {
          heading: 'A relação entre advogada ou advogado e cliente não nasce por si só',
          paragraphs: [
            'Ler esta página, enviar o formulário ou enviar um correio não cria, por si só, uma relação entre advogada ou advogado e cliente.',
            'Essa relação só nasce depois de rever o assunto e de ambas as partes confirmarem a aceitação do trabalho.',
          ],
        },
        {
          heading: 'Não há promessa de resultado',
          paragraphs: [
            'Nenhuma parte desta página é uma promessa sobre o resultado de um assunto, sobre a concessão de um pedido ou sobre o estatuto de residência e de trabalho.',
            'As ligações externas oferecem-se para orientação; não asseguramos a exatidão nem a atualidade do conteúdo publicado por terceiros.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'ARTIGOS',
      title: 'Artigos sobre o direito de Taiwan',
      description:
        'Artigos em português que explicam temas frequentes do direito de Taiwan. O conteúdo é informação geral no momento da sua publicação, não um parecer jurídico para o seu caso.',
      intro:
        'O escritório publica artigos que explicam temas frequentes do direito de Taiwan. Os artigos disponíveis em português encontram-se nesta página; além disso há quatro ligações, cada uma abre a lista de artigos de uma língua original.',
      sections: [
        {
          heading: 'Quatro listas segundo a língua',
          paragraphs: [
            'Esta parte contém quatro ligações: a lista de artigos em coreano, a lista em chinês, a lista em inglês e a lista em japonês. Cada ligação indica a língua da sua lista, para que saiba de antemão em que língua se abrirá o conteúdo.',
            'Essas quatro listas são listas segundo a língua original do artigo, não listas de traduções. Os artigos já disponíveis em português encontram-se em separado nesta mesma página.',
          ],
        },
        {
          heading: 'Para onde levam as ligações',
          paragraphs: [
            'Ao escolher uma das quatro ligações abre-se a lista de artigos dessa língua. Nessa lista escolhe o texto que deseja ler, e todo o conteúdo aparece na língua original do artigo.',
            'Esta página não resume o conteúdo dos artigos e não assegura que um tema exista nas quatro línguas. Cada lista só inclui os textos publicados nessa língua.',
          ],
        },
        {
          heading: 'Até onde o pode orientar um artigo',
          paragraphs: [
            'Os artigos escreveram-se como informação geral no momento da sua publicação. As normas e a sua aplicação podem mudar, e um artigo não recolhe todas as circunstâncias do seu caso.',
            'Por isso, não tome um artigo como base para atuar num assunto real. Use-o para entender o panorama geral e fale depois do seu processo com uma advogada ou um advogado; esta página não é o passo de consulta.',
          ],
        },
      ],
    },
  },
};

export const russianGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Русский',
  nav: {
    home: 'Главная',
    services: 'Услуги',
    about: 'Фирма',
    lawyers: 'Адвокаты',
    pricing: 'Стоимость',
    contact: 'Контакты',
    faq: 'Частые вопросы',
    privacy: 'Данные',
    disclaimer: 'Оговорка',
    columns: 'Материалы',
  },
  contactCta: 'Отправить запрос на консультацию',
  footerNotice:
    'Эта русскоязычная страница содержит лишь общие сведения о работе фирмы по праву Тайваня. Это не юридическая консультация по конкретному делу, и отправка сообщения сама по себе не создаёт отношений между адвокатом и доверителем.',
  skipLink: 'Пропустить навигацию и перейти к содержанию',
  menuLabel: 'Каталог страниц',
  languageLabel: 'Язык отображения',
  mega: {
    services: {
      description: 'Фирма ведёт основные группы дел по праву Тайваня.',
      viewAllLabel: 'Показать все',
    },
    columns: {
      description: 'Материалы по частым вопросам права Тайваня.',
      viewAllLabel: 'Показать все',
    },
    lawyers: {
      description: 'Представление адвокатов и способов связи.',
      viewAllLabel: 'Показать все',
    },
    pricing: {
      description: 'Эта страница объясняет объём работы и то, как определяется стоимость.',
      viewAllLabel: 'Показать все',
    },
    faq: {
      description: 'Частые вопросы о работе фирмы на Тайване.',
      viewAllLabel: 'Показать все',
    },
  },
  notFoundTitle: 'Страница не найдена',
  notFoundText:
    'Искомая страница не существует или была перемещена. Вы можете вернуться на русскую главную страницу, чтобы увидеть доступные сведения.',
  backHomeLabel: 'На главную',
  readSourceLabel: 'Открыть список материалов на языке оригинала',
  home: {
    heroScrollLabel: 'Прокрутить вниз',
    heroColumnsCtaLabel: 'Смотреть материалы',
    servicesDetailLabel: 'Смотреть подробности',
    servicesAssistanceBefore: 'Если неясно, к какой группе относится Ваш вопрос, страница ',
    servicesAssistanceLinkLabel: 'Контакты',
    servicesAssistanceAfter:
      ' объясняет, как составить краткое изложение, которое рассмотрит адвокат.',
    columnsViewAllLabel: 'Смотреть все материалы',
    columnsReadMoreLabel: 'Читать далее',
    columnsReviewLabel: 'Проверено адвокатом Wei Tseng (曾雋崴)',
    columnsOriginalLanguageBadge: 'Язык оригинала',
    columnsOriginalLanguageNote:
      'Следующие материалы ещё не подготовлены на русском языке. Список остаётся на языке оригинала и открывает соответствующую языковую страницу; содержание автоматически не переводится.',
    imageBandAlt: 'Традиционный тайваньский санхэюань (三合院) и современный павильон при дневном свете',
    videoPauseLabel: 'Приостановить видео',
    videoPlayLabel: 'Воспроизвести видео',
    videoReplayLabel: 'Воспроизвести видео снова',
  },
  pages: {
    home: {
      eyebrow: 'СВЕДЕНИЯ',
      title: 'Юридические услуги на Тайване — сведения на русском языке',
      description:
        'Общие пояснения на русском языке о сфере работы Hovering International Law Firm на Тайване, о языках консультации и о первом обращении.',
      intro:
        'Hovering International Law Firm сопровождает доверителей из-за рубежа, в том числе связанных с Тайванем, в делах по праву Тайваня: инвестиции и учреждение компаний, гражданские споры, брак, семья и наследство, трудовое право, уголовные дела и интеллектуальная собственность. Этот русский раздел помогает понять, какая работа входит в нашу сферу, что подготовить и как с нами связаться. Это общие сведения, а не юридическая консультация по Вашему делу.',
      sections: [
        {
          heading: 'Чем мы занимаемся',
          paragraphs: [
            'Hovering International Law Firm — адвокатская фирма, учреждённая на Тайване. Она работает по праву Тайваня и имеет офисы в городах Тайбэй (臺北), Гаосюн (高雄), Тайчжун (臺中) и Пиндун (屏東). Мы консультируем компании, ведём дела в суде и сопровождаем доверителей из-за рубежа через шаги, необходимые на Тайване.',
            'Всё содержание здесь носит общий характер. Исход дела зависит от фактов, применимых норм и момента времени. Эти сведения не заменяют беседу с адвокатом о Ваших документах.',
          ],
        },
        {
          heading: 'Язык страницы и язык консультации — не одно и то же',
          paragraphs: [
            'Эта страница написана на русском языке, но консультация с адвокатом проводится только на четырёх языках консультации: английском, китайском (中文), японском и корейском. Чтение русских сведений не означает, что беседа с адвокатом состоится на русском языке.',
            'Мы не обещаем переводчика, срок ответа и запись через эту страницу. Если Вы не можете пользоваться ни одним из четырёх языков, страница «Контакты» объясняет, как мы рассматриваем способ связи.',
          ],
        },
        {
          heading: 'Направления работы',
          paragraphs: [
            'Сфера работы включает следующие шесть групп. Страница «Направления работы» описывает каждую группу подробнее и указывает, что не обещается.',
          ],
          items: [
            'Инвестиции и учреждение компании на Тайване',
            'Гражданские дела и возмещение вреда',
            'Брак, семья и наследство',
            'Трудовые споры',
            'Уголовные дела',
            'Интеллектуальная собственность: товарные знаки, патенты и авторское право',
          ],
        },
        {
          heading: 'С чего следует начать',
          paragraphs: [
            'Прочитайте страницу «Направления работы», чтобы проверить, входит ли Ваш вопрос в нашу сферу, затем «Объём и стоимость» и «Контакты», чтобы узнать, как определяется объём и как стоимость подтверждается до начала работы.',
            'При отправке сообщения Вы можете написать краткое изложение на своём языке. Исходный текст сохраняется так, как Вы его написали, и автоматически не переводится. Отправленное сообщение — запрос, ожидающий рассмотрения: это ещё не консультация и ещё не подтверждённая запись.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'НАПРАВЛЕНИЯ РАБОТЫ',
      title: 'Какие дела мы ведём',
      description:
        'Шесть групп работы фирмы на Тайване и границы, которые следует знать сначала.',
      intro:
        'Ниже — группы, которые мы действительно ведём, и вопросы, которые часто задают на начальном этапе. Изложение помогает оценить, входит ли Ваш вопрос в нашу сферу; оно носит общий характер и не является юридическим разбором отдельного дела.',
      sections: [
        {
          heading: 'Инвестиции и учреждение компании на Тайване',
          paragraphs: [
            'Мы сопровождаем иностранных инвесторов и компании при учреждении или ведении общества на Тайване: выбор правовой формы, подготовка и подача документов, внесение капитала, банковские вопросы, проверка места деятельности и отраслевые требования. Мы также помогаем с бухгалтерией и налогами, которые возникают из учреждения и деятельности на Тайване.',
            'Порядок и сроки различаются в зависимости от правовой формы, инвестора, отрасли, банка и имеющихся документов. Учреждение компании само по себе не ведёт к виду на жительство (居留) или разрешению на работу (工作許可): это отдельные процедуры, которые оцениваются по положению конкретного лица.',
          ],
        },
        {
          heading: 'Гражданские дела и возмещение вреда',
          paragraphs: [
            'Эта группа включает договорные споры, возмещение вреда из деликта и потребительские споры. Работа обычно начинается с хронологии, проверки имеющихся документов и доказательств и лишь затем — со следующих шагов.',
            'Сроки, включая законные сроки подачи иска, и полнота доказательств формируют ход дела. Поэтому известные даты следует назвать как можно раньше. Сохраняйте договоры, сообщения, платёжные документы или фотографии обстановки на месте и упомяните их в первом сообщении.',
          ],
        },
        {
          heading: 'Брак, семья и наследство',
          paragraphs: [
            'Мы ведём развод (離婚), раздел имущества, осуществление и несение прав и обязанностей в отношении несовершеннолетних детей (未成年子女權利義務之行使或負擔), общение (會面交往) и наследование (繼承), в том числе если стороны или имущество находятся в разных государствах. Трансграничные семейные дела часто требуют дополнительной проверки документов о регистрации по месту жительства (戶籍), формы актов и их доказательственной силы на Тайване.',
            'Поскольку семейные дела часто связаны со сроками и параллельными процедурами, первое краткое изложение должно назвать отношения сторон, нынешнее место жительства и уже идущие процедуры.',
          ],
        },
        {
          heading: 'Трудовые споры',
          paragraphs: [
            'Эта группа включает прекращение трудовых отношений, выходное пособие по праву Тайваня (資遣費; его не следует отождествлять с институтами других государств), заработную плату и споры из трудового договора (勞動契約) — как на стороне работника, так и на стороне работодателя. При рассмотрении мы отделяем основание прекращения от вопросов уведомления, выплаты и сроков.',
            'Трудовой договор, правила работы (工作規則), расчётные листки и переписка сторон обычно являются решающими документами. Если они у Вас ещё есть, упомяните это в кратком изложении.',
          ],
        },
        {
          heading: 'Уголовные дела',
          paragraphs: [
            'Мы сопровождаем в расследовании и в суде — как для подозреваемых или обвиняемых, так и для потерпевших — и оцениваем уголовные риски предпринимательской деятельности.',
            'У уголовных дел часто короткие сроки и установленные стадии. Если Вы уже получили письмо органа уголовного преследования или суда, укажите дату письма как можно раньше, чтобы содержание рассмотрели в верном порядке.',
          ],
        },
        {
          heading: 'Интеллектуальная собственность',
          paragraphs: [
            'Мы помогаем при регистрации товарных знаков (商標) и патентов (專利), при авторском праве и при спорах об этих правах на Тайване.',
            'В этой группе важен порядок шагов: объём охраны, момент подачи и фактическое использование влияют на выбор. Подача заявления сама по себе не означает, что оно будет удовлетворено.',
          ],
        },
        {
          heading: 'Объём и его подтверждение',
          paragraphs: [
            'Фирма работает по праву Тайваня и ведёт дела названных групп. Объём каждого дела подтверждается отдельно после того, как адвокат рассмотрит Ваше сообщение.',
            'Статус пребывания, разрешение на работу и сходные вопросы оцениваются по документам и положению конкретного лица, а не по гражданству. Если часть Вашего вопроса затрагивает такие темы, назовите это при обращении. Эта страница не обещает ни результата, ни срока ответа.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'ФИРМА',
      title: 'О Hovering International Law Firm',
      description:
        'Основные сведения об этой тайваньской адвокатской фирме, её офисах и работе с иностранными участниками.',
      intro:
        'Hovering International Law Firm — адвокатская фирма на Тайване. Адвокаты ведут работу от консультирования компаний до судебных разбирательств. Этот раздел описывает возникновение фирмы, места и работу с иностранными участниками.',
      sections: [
        {
          heading: 'Основание и структура',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) основана в 2016 году адвокатами, учившимися в National Taiwan University (國立臺灣大學). Китайское название 昊鼎 соединяет знак 昊 («широкое небо») со знаком 鼎 («прочное основание») и описывает направление фирмы с момента основания.',
            'У нас есть офисы в городах Тайбэй (臺北), Гаосюн (高雄), Тайчжун (臺中) и Пиндун (屏東). Офис в Гаосюне сосредоточен на корпоративной практике и ведёт гражданские, уголовные и административные споры. Офис в Тайчжуне ведёт строительные дела, интеллектуальную собственность и дела, связанные с Кореей и Японией. Офис в Пиндуне открыт в 2017 году для местных нужд.',
            'Помимо адвокатской работы с 2020 года существует также Hovering Accounting Office, которое предлагает бухгалтерию и налоговое планирование предпринимателям и состоятельным частным лицам.',
          ],
        },
        {
          heading: 'Работа с иностранными участниками',
          paragraphs: [
            'Трансграничная работа включает учреждение компаний, визы, подачу заявок на товарные знаки и патенты, проверку правовых рисков и налоговое консультирование компаний. Офис в Тайчжуне особенно ведёт строительные дела, интеллектуальную собственность и дела, связанные с Кореей и Японией. Адвокат Wei Tseng (曾雋崴) сопровождает доверителей из Кореи, Японии и других международных доверителей в названных группах.',
            'Можем ли мы принять дело, зависит от содержания и языка общения. Если Ваш вопрос входит в названные группы и его можно обсудить на одном из четырёх языков консультации, Вы можете отправить краткое изложение на рассмотрение.',
          ],
        },
        {
          heading: 'Когда Вы обращаетесь к нам',
          paragraphs: [
            'После поступления Вашего краткого изложения адвокат рассматривает содержание и затем обсуждает возможный объём работы, ещё нужные документы и следующие шаги. При налоговых или бухгалтерских вопросах фирма может вести их вместе с бухгалтерским подразделением.',
            'Исход каждого дела зависит от фактов и имеющихся документов; мы не обещаем результата. Если Вам нужен обязывающий ответ для Вашей ситуации, документы необходимо обсудить с адвокатом на одном из четырёх языков консультации.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'АДВОКАТЫ',
      title: 'Международная команда Hovering',
      description: 'Профили адвокатов, операционного менеджера и партнёра-бухгалтера Hovering.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'ОБЪЁМ И СТОИМОСТЬ',
      title: 'Как определяются объём работы и стоимость',
      description:
        'Пояснение порядка: сначала объём работы, затем подтверждение стоимости, и почему на этой странице нет прейскуранта.',
      intro:
        'Эта страница объясняет, как определяется стоимость, а не её размер. Размер зависит от объёма работы конкретного дела и имеет смысл лишь тогда, когда этот объём ясен.',
      sections: [
        {
          heading: 'Сначала определяется объём работы',
          paragraphs: [
            'Дела одного вида могут требовать очень разного труда в зависимости от числа участников, имеющихся документов, сроков, которые нужно соблюсти, и того, началась ли уже процедура. Поэтому первый шаг всегда — определить, что входит в работу, а что нет.',
            'Краткое изложение, которое Вы отправляете в начале, — основа этого объёма. Чем яснее оно описывает ход событий, Ваш запрос и сроки, тем точнее можно определить объём.',
          ],
        },
        {
          heading: 'Стоимость подтверждается до начала работы',
          paragraphs: [
            'Когда объём работы ясен, размер и способ расчёта стоимости обсуждаются и подтверждаются с Вами до начала работы. Если объём меняется по ходу, это нужно подтвердить снова.',
            'Эта страница не является предложением цены и не создаёт обязанности платить. Отправка запроса через эту страницу также не требует оплаты.',
          ],
        },
        {
          heading: 'Консультация может быть возмездной услугой',
          paragraphs: [
            'Консультация с адвокатом может быть возмездной услугой. Эта страница не говорит, что первая беседа проводится без оплаты, и никакая часть не должна так читаться.',
            'Если консультация возмездна, размер и способ оплаты сообщаются до её проведения.',
          ],
        },
        {
          heading: 'Почему эта страница не называет тарифы',
          paragraphs: [
            'Стоимость зависит от самого дела: от труда, числа участников, документов, сроков и того, идёт ли уже процедура. Заранее названная цифра не показала бы стоимость Вашего дела. Поэтому мы сначала определяем объём работы и затем сообщаем Вам стоимость до начала работы.',
            'Помимо гонорара адвоката могут возникнуть судебные и административные расходы, а также расходы третьих лиц. Они отделены от гонорара и зависят от соответствующей процедуры.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'КОНТАКТЫ',
      title: 'Как связаться с фирмой',
      description:
        'Язык страницы, языки консультации, порядок, если Вы не можете пользоваться ни одним из четырёх языков, и что эта страница не обещает.',
      intro:
        'Прежде чем писать нам, различайте следующие три пункта. Их часто смешивают, но они означают разное.',
      sections: [
        {
          heading: 'Три вещи, которые нужно держать раздельно',
          paragraphs: [
            'Язык отображения страницы, язык консультации с адвокатом и язык, на котором Вы пишете, — три разные вещи.',
          ],
          items: [
            'Язык страницы: эти сведения написаны на русском языке.',
            'Язык консультации: консультация проводится на английском, китайском (中文), японском и корейском языках.',
            'Язык Вашего письма: Вы можете написать краткое изложение на своём языке; исходный текст сохраняется без изменений.',
          ],
        },
        {
          heading: 'Если Вы не можете пользоваться ни одним из четырёх языков консультации',
          paragraphs: [
            'В контактной форме Вы можете выбрать «Способ связи должен быть подтверждён». Мы отвечаем, чтобы рассмотреть возможный способ связи, если такой способ есть; услуга на другом языке не обеспечивается, и срок ответа не обещается.',
            'Это лишь шаг проверки, а не обещание. Мы не обещаем переводчика, не обещаем услугу на русском или ином языке вне четырёх названных и не обещаем, что примем каждое дело.',
          ],
        },
        {
          heading: 'Что должно быть в первом сообщении',
          paragraphs: [
            'Назовите, что произошло, какая помощь Вам нужна, какое отношение дело имеет к Тайваню, и срок, если Вы его знаете. Если Вы уже получили письмо суда или органа, укажите дату письма.',
            'На начальном этапе ещё не нужно отправлять номер паспорта, номер удостоверения, данные счёта, медицинскую карту или все доказательства. Дождитесь указаний адвоката и затем отправьте чувствительные документы безопасным путём.',
          ],
        },
        {
          heading: 'Что эта страница не обещает',
          paragraphs: [
            'Мы не обещаем срок ответа, не подтверждаем запись через эту страницу, не обещаем конкретного адвоката и не предоставляем переводчика. Устный переводчик и письменный перевод обращения — разные вещи: Ваше сообщение автоматически не переводится.',
            'Если Вы отправляете запрос, содержание сохраняется и ждёт рассмотрения. Если ответа нет, Вы можете снова написать на адрес электронной почты, указанный на странице контактов.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'ЧАСТЫЕ ВОПРОСЫ',
      title: 'Часто задаваемые вопросы',
      description:
        'Пояснения о сфере работы, подготовке, языках, стоимости и о значении отправленного запроса.',
      intro:
        'Ответы ниже даны на уровне общих сведений. Ответ по Вашему делу возможен лишь после того, как адвокат рассмотрит документы.',
      sections: [
        {
          heading: 'Как пользоваться этим разделом',
          paragraphs: [
            'Если Вы не находите ответа для Вашей ситуации, ответ обычно зависит от особых фактов. Тогда запишите эти факты в краткое изложение, вместо того чтобы выводить их самостоятельно с этой страницы.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Какие дела ведёт фирма?',
          answer:
            'Мы ведём шесть групп: инвестиции и учреждение компании на Тайване, гражданские дела и возмещение вреда, брак, семья и наследство, трудовые споры, уголовные дела и интеллектуальную собственность. Принимается ли дело, решается после рассмотрения содержания.',
        },
        {
          question: 'Что подготовить до обращения?',
          answer:
            'Подготовьте краткое изложение хода событий, Вашего запроса, связи с Тайванем и срока, если он есть. Если уже есть письмо суда или органа, назовите дату. На этой стадии ещё не нужно отправлять документы, удостоверяющие личность, или все доказательства.',
        },
        {
          question: 'Возможна ли консультация на русском языке?',
          answer:
            'Нет. Эти сведения написаны на русском языке, но консультация с адвокатом проводится только на английском, китайском (中文), японском и корейском языках. Мы также не обещаем переводчика. Устный переводчик и письменный перевод обращения — разные вещи: исходный текст, который Вы пишете, сохраняется без изменений и автоматически не переводится.',
        },
        {
          question: 'Что, если я не могу пользоваться ни одним из четырёх языков?',
          answer:
            'При отправке запроса выберите «Способ связи должен быть подтверждён». Мы отвечаем, чтобы рассмотреть способ связи, но услуга на другом языке не обеспечивается. Это шаг проверки, а не обещание, что мы можем работать на другом языке.',
        },
        {
          question: 'Как обрабатывается мой русский текст?',
          answer:
            'Исходный текст, который Вы пишете, сохраняется без изменений и автоматически не переводится. При необходимости язык дальнейшего общения подтверждается вместе с Вами.',
        },
        {
          question: 'Состоялась ли консультация, если запрос уже отправлен?',
          answer:
            'Нет. Отправленный запрос ожидает рассмотрения адвокатом. Это не юридическая консультация, не подтверждённая запись, и отправка сама по себе не создаёт отношений между адвокатом и доверителем.',
        },
        {
          question: 'Как рассчитывается стоимость?',
          answer:
            'Сначала определяется объём работы, затем размер и способ расчёта стоимости подтверждаются с Вами до начала работы. Эта страница не называет цифр и не говорит, что первая беседа проводится без оплаты.',
        },
        {
          question: 'Что, если мой вопрос очень срочный?',
          answer:
            'Назовите срок или дату на официальном письме в начале краткого изложения, чтобы эти даты были видны при рассмотрении. У этой страницы нет канала для неотложных случаев, и срок ответа не обеспечивается; если Ваш вопрос не может ждать, Вам следует параллельно искать другие пути по месту нахождения.',
        },
      ],
    },
    privacy: {
      eyebrow: 'КОНФИДЕНЦИАЛЬНОСТЬ',
      title: 'Данные, собираемые через контактную форму',
      description:
        'Что собирает контактная форма в этом русском разделе, как обрабатывается исходный текст и как связаться с нами по поводу Ваших данных.',
      intro:
        'Этот раздел касается только контактной формы на этих информационных страницах. Он описывает обращение с данными, а не техническую абсолютную защиту.',
      sections: [
        {
          heading: 'Какие данные собираются',
          paragraphs: [
            'Когда Вы отправляете запрос через форму в этом разделе, фиксируются следующие сведения:',
          ],
          items: [
            'Указанное Вами имя',
            'Адрес электронной почты для ответа',
            'Язык отображения страницы в момент отправки',
            'Язык, на котором Вы писали',
            'Желаемый Вами язык консультации',
            'Исходный текст, который Вы написали',
            'Ваше согласие на отправку запроса',
            'Номер обращения, чтобы найти запрос снова',
          ],
        },
        {
          heading: 'Исходный текст сохраняется без изменений',
          paragraphs: [
            'Ваш текст сохраняется точно так, как Вы его написали, и автоматически не переводится. Если для обработки нужен перевод, это отдельно обсуждается с Вами.',
            'Поскольку исходный текст сохраняется, на первом этапе не пишите то, что ещё не нужно: номер паспорта, номер удостоверения или данные счёта.',
          ],
        },
        {
          heading: 'Место хранения и доступ',
          paragraphs: [
            'Отправленные Вами данные хранятся в месте, недоступном публично. Только уполномоченные лица в фирме могут получать к нему доступ для обработки запроса.',
            'Эта страница не даёт абсолютного обещания безопасности. Ни один путь передачи и ни одно место хранения не являются полностью безопасными; поэтому чувствительные документы следует отправлять только после особого указания адвоката.',
          ],
        },
        {
          heading: 'Цель использования',
          paragraphs: [
            'Отправленные данные служат рассмотрению запроса, ответу Вам, выяснению способа связи и обработке, если работа будет начата.',
            'Данные не используются для маркетинга без отдельного согласия.',
          ],
        },
        {
          heading: 'Уведомление и номер обращения',
          paragraphs: [
            'Если запрос успешно отправлен, система уведомляет фирму. Если это уведомление ещё не подтверждено, Ваш текст остаётся сохранённым и не теряется.',
            'Номер обращения служит тому, чтобы найти Ваш запрос в наших записях. Он показывается после сохранения; Вы можете назвать его при повторном обращении.',
          ],
        },
        {
          heading: 'Ваши права и способ связи',
          paragraphs: [
            'Вы можете запросить сведения, исправление или удаление Ваших данных либо отозвать согласие через адрес электронной почты, указанный на странице контактов. Если есть законная или процессуальная обязанность хранения, мы объясним ограничение.',
            'Эта страница не называет фиксированный срок хранения, потому что фактическая длительность зависит от того, продолжается ли дело, и от связанных обязанностей. Если Вы хотите более раннее удаление, сообщите это при обращении.',
          ],
        },
        {
          heading: 'Место хранения и поставщики услуг',
          paragraphs: [
            'Этот сайт размещён у Vercel, и отправленные Вами данные хранятся в закрытом облачном хранилище этой службы. Письма отправляются через почтовую службу, которой пользуется фирма.',
            'Серверы отдельных поставщиков могут находиться за пределами Тайваня, поэтому Ваши данные могут там храниться и обрабатываться. Когда цель хранения достигнута, данные удаляются без промедления; данные, которые по действующим нормам должны храниться, остаются на этот срок. Запросы о персональных данных принимает wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'ОТКАЗ ОТ ОТВЕТСТВЕННОСТИ',
      title: 'Объём и границы сведений на этой странице',
      description:
        'Общий характер сведений, правовая сфера действия и условия возникновения отношений между адвокатом и доверителем.',
      intro:
        'Этот раздел разъясняет, что эти русские информационные страницы могут и не могут сделать для Вас.',
      sections: [
        {
          heading: 'Только общие сведения',
          paragraphs: [
            'Содержание этих страниц написано как общая информация. Это не юридическая консультация по Вашему делу и не заменяет проверку Ваших собственных документов.',
            'Исход дела зависит от фактов, применимых норм и момента времени; два внешне сходных положения могут завершиться по-разному.',
          ],
        },
        {
          heading: 'Правовая сфера действия',
          paragraphs: [
            'Фирма ведёт дела по праву Тайваня, и эта страница говорит только о работе в этих рамках.',
            'Содержание не является консультацией по праву иной правовой системы, кроме Тайваня, включая право места Вашего проживания. Если часть Вашего дела затрагивает иную правовую систему, мы выясним с Вами, какой квалифицированный специалист нужен для этой части.',
          ],
        },
        {
          heading: 'Отношения между адвокатом и доверителем не возникают сами собой',
          paragraphs: [
            'Чтение этой страницы, отправка формы или письма сами по себе не создают отношений между адвокатом и доверителем.',
            'Эти отношения возникают лишь после того, как дело рассмотрено и обе стороны подтвердили принятие работы.',
          ],
        },
        {
          heading: 'Нет обещания результата',
          paragraphs: [
            'Никакая часть этой страницы не является обещанием результата дела, удовлетворения заявления или статуса пребывания и работы.',
            'Внешние ссылки служат ориентиром; мы не обещаем ни правильность, ни актуальность содержания третьих лиц.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'МАТЕРИАЛЫ',
      title: 'Материалы о праве Тайваня',
      description:
        'Русские материалы по частым вопросам права Тайваня. Содержание — общая информация на момент публикации, а не юридическая консультация по Вашему делу.',
      intro:
        'Фирма публикует материалы по частым вопросам права Тайваня. Материалы, имеющиеся на русском языке, находятся на этой странице; рядом есть четыре ссылки, каждая из которых открывает список материалов языка оригинала.',
      sections: [
        {
          heading: 'Четыре списка по языкам',
          paragraphs: [
            'В этом разделе четыре ссылки: список материалов на корейском, китайском, английском и японском языках. Каждая ссылка называет язык списка, чтобы Вы заранее знали, на каком языке откроется содержание.',
            'Эти четыре списка — списки по языку оригинала материалов, а не списки переводов. Материалы, имеющиеся на русском языке, приведены отдельно на этой странице.',
          ],
        },
        {
          heading: 'Куда ведут ссылки',
          paragraphs: [
            'Если Вы выбираете одну из четырёх ссылок, открывается список материалов этого языка. Из списка Вы сами выбираете текст; всё содержание появляется на языке оригинала материала.',
            'Эта страница не излагает содержание материалов и не обещает, что тема есть на всех четырёх языках. Каждый список содержит только тексты, опубликованные на этом языке.',
          ],
        },
        {
          heading: 'Насколько материал может служить ориентиром',
          paragraphs: [
            'Материалы — общие сведения на момент публикации. Нормы и их применение могут измениться, и материал не содержит всех обстоятельств Вашего дела.',
            'Поэтому не опирайтесь на материал как на основание действий в реальном деле. Используйте его для обзора и отдельно обсудите Ваши документы с адвокатом; эта страница не является шагом консультации.',
          ],
        },
      ],
    },
  },
};

export const turkishGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Türkçe',
  nav: {
    home: 'Ana sayfa',
    services: 'Çalışma alanları',
    about: 'Büro',
    lawyers: 'Avukatlar',
    pricing: 'Kapsam ve ücret',
    contact: 'İletişim',
    faq: 'Sık sorulan sorular',
    privacy: 'Gizlilik',
    disclaimer: 'Sorumluluk reddi',
    columns: 'Yazılar',
  },
  contactCta: 'Görüşme talebi gönderin',
  footerNotice:
    'Bu Türkçe sayfa, firmanın Tayvan hukukuna göre yürüttüğü çalışma hakkında yalnızca genel bilgi verir. Belirli bir dosya için hukuki görüş değildir ve bir ileti göndermek kendi başına avukat ile müvekkil arasında ilişki kurmaz.',
  skipLink: 'Gezinmeyi atlayıp içeriğe geçin',
  menuLabel: 'Sayfa dizini',
  languageLabel: 'Görüntüleme dili',
  mega: {
    services: {
      description: 'Büro, Tayvan hukukuna göre başlıca çalışma gruplarını yürütür.',
      viewAllLabel: 'Tümünü göster',
    },
    columns: {
      description: 'Sık karşılaşılan Tayvan hukuku konularına ilişkin yazılar.',
      viewAllLabel: 'Tümünü göster',
    },
    lawyers: {
      description: 'Görevli avukatların tanıtımı ve iletişim yolları.',
      viewAllLabel: 'Tümünü göster',
    },
    pricing: {
      description: 'Bu sayfa çalışma kapsamını ve ücretin nasıl belirlendiğini açıklar.',
      viewAllLabel: 'Tümünü göster',
    },
    faq: {
      description: 'Firmanın Tayvan’daki çalışmasına ilişkin sık sorulan sorular.',
      viewAllLabel: 'Tümünü göster',
    },
  },
  notFoundTitle: 'Sayfa bulunamadı',
  notFoundText:
    'Aradığınız sayfa yok veya taşınmış. Mevcut bilgileri görmek için Türkçe ana sayfaya dönebilirsiniz.',
  backHomeLabel: 'Ana sayfaya',
  readSourceLabel: 'Özgün dildeki yazı listesini açın',
  home: {
    heroScrollLabel: 'Aşağı kaydırın',
    heroColumnsCtaLabel: 'Yazılara bakın',
    servicesDetailLabel: 'Ayrıntılara bakın',
    servicesAssistanceBefore: 'Konunuzun hangi gruba girdiği belirsizse, ',
    servicesAssistanceLinkLabel: 'İletişim',
    servicesAssistanceAfter:
      ' sayfası, bir avukatın inceleyeceği özeti nasıl yazacağınızı açıklar.',
    columnsViewAllLabel: 'Tüm yazılara bakın',
    columnsReadMoreLabel: 'Devamını oku',
    columnsReviewLabel: 'Avukat Wei Tseng tarafından incelendi',
    columnsOriginalLanguageBadge: 'Özgün dil',
    columnsOriginalLanguageNote:
      'Aşağıdaki yazılar henüz Türkçe hazır değildir. Liste özgün dilde kalır ve ilgili dil sayfasını açar; içerik kendiliğinden çevrilmez.',
    imageBandAlt: 'Gündüz ışığında geleneksel Tayvan sanheyuanı (三合院) ve modern bir köşk',
    videoPauseLabel: 'Videoyu duraklat',
    videoPlayLabel: 'Videoyu oynat',
    videoReplayLabel: 'Videoyu yeniden oynat',
  },
  pages: {
    home: {
      eyebrow: 'BİLGİ',
      title: 'Tayvan’da hukuki hizmetler — Türkçe bilgi',
      description:
        'Hovering International Law Firm’in Tayvan’daki çalışma alanı, görüşme dilleri ve ilk iletişim hakkında Türkçe genel açıklama.',
      intro:
        'Hovering International Law Firm, yurt dışından gelen ve Tayvan ile bağlantısı olan müvekkilleri Tayvan hukukuna göre yatırım ve şirket kuruluşu, hukuk uyuşmazlıkları, evlilik, aile ve miras, iş hukuku, ceza ve fikri mülkiyet konularında destekler. Bu Türkçe bölüm, hangi işin kapsamımıza girdiğini, neyin hazırlanması gerektiğini ve bize nasıl ulaşılacağını görmenize yardımcı olur. Bunlar genel bilgilerdir; sizin dosyanız için hukuki görüş değildir.',
      sections: [
        {
          heading: 'Ne yapıyoruz',
          paragraphs: [
            'Hovering International Law Firm, Tayvan’da kurulmuş bir avukatlık bürosudur. Tayvan hukukuna göre çalışır ve Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) ile Pingtung (屏東) ofisleri vardır. Şirketlere danışmanlık verir, mahkemede usul yürütür ve yurt dışından gelen müvekkilleri Tayvan’da gereken adımlarda destekler.',
            'Buradaki tüm içerik geneldir. Bir işin sonucu olgulara, uygulanacak kurallara ve zamana bağlıdır. Bu bilgiler, belgeleriniz hakkında bir avukatla konuşmanın yerine geçmez.',
          ],
        },
        {
          heading: 'Sayfa dili ile görüşme dili aynı şey değildir',
          paragraphs: [
            'Bu sayfa Türkçe yazılmıştır; ancak avukatla görüşme yalnızca dört görüşme dilinde yapılır: İngilizce, Çince (中文), Japonca ve Korece. Türkçe bilgileri okumak, avukatla konuşmanın Türkçe olacağı anlamına gelmez.',
            'Bu sayfa üzerinden tercüman, yanıt süresi veya randevu vaat etmeyiz. Dört dilden hiçbirini kullanamıyorsanız, İletişim sayfası iletişim yolunu nasıl incelediğimizi açıklar.',
          ],
        },
        {
          heading: 'Çalışma grupları',
          paragraphs: [
            'Çalışma alanı aşağıdaki altı grubu kapsar. Çalışma alanları sayfası her grubu daha ayrıntılı anlatır ve nelerin vaat edilmediğini belirtir.',
          ],
          items: [
            'Tayvan’da yatırım ve şirket kuruluşu',
            'Hukuk davaları ve tazminat',
            'Evlilik, aile ve miras',
            'İş uyuşmazlıkları',
            'Ceza işleri',
            'Fikri mülkiyet: marka, patent ve telif',
          ],
        },
        {
          heading: 'Nereden başlamalısınız',
          paragraphs: [
            'Konunuzun kapsamımıza girip girmediğini değerlendirmek için Çalışma alanları sayfasını, ardından kapsamın nasıl belirlendiğini ve ücretin işe başlamadan önce nasıl doğrulandığını öğrenmek için Kapsam ve ücret ile İletişim sayfalarını okuyun.',
            'İleti gönderirken özeti kendi dilinizde yazabilirsiniz. Özgün metin yazdığınız gibi saklanır ve kendiliğinden çevrilmez. Gönderilen ileti, inceleme bekleyen bir taleptir: henüz görüşme değildir ve henüz doğrulanmış bir randevu değildir.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'ÇALIŞMA ALANLARI',
      title: 'Hangi işleri yürütürüz',
      description:
        'Firmanın Tayvan’daki altı çalışma grubu ve önce bilmeniz gereken sınırlar.',
      intro:
        'Aşağıda gerçekten yürüttüğümüz gruplar ve ilk aşamada sık sorulan sorular yer alır. Anlatım, konunuzun kapsamımıza girip girmediğini değerlendirmenize yardımcı olur; geneldir ve ayrı bir dosyanın hukuki çözümlemesi değildir.',
      sections: [
        {
          heading: 'Tayvan’da yatırım ve şirket kuruluşu',
          paragraphs: [
            'Yabancı yatırımcıları ve şirketleri Tayvan’da şirket kurma veya işletmede destekleriz: hukuk biçiminin seçimi, belgelerin hazırlanması ve sunulması, sermaye koyma, banka işleri, işyerinin incelenmesi ve sektöre özgü gerekler. Tayvan’da kuruluş ve işletmeden doğan muhasebe ve vergi konularında da yardımcı oluruz.',
            'Akış ve süre, hukuk biçimine, yatırımcıya, sektöre, bankaya ve eldeki belgelere göre değişir. Şirket kuruluşu kendiliğinden oturma iznine (居留) veya çalışma iznine (工作許可) götürmez: bunlar, ilgili kişinin durumuna göre değerlendirilen ayrı usullerdir.',
          ],
        },
        {
          heading: 'Hukuk davaları ve tazminat',
          paragraphs: [
            'Bu grup sözleşme uyuşmazlıklarını, haksız fiilden doğan tazminatı ve tüketici uyuşmazlıklarını kapsar. Çalışma genellikle bir zaman dizisi, eldeki belge ve kanıtların incelenmesi ve ancak ondan sonra sonraki adımlarla başlar.',
            'Süreler, yasal dava süreleri dâhil, ve kanıtların tamlığı seyri biçimlendirir. Bu yüzden bilinen tarihleri mümkün olduğunca erken belirtin. Sözleşmeleri, iletileri, ödeme belgelerini veya yerindeki durumun fotoğraflarını saklayın ve ilk iletide anın.',
          ],
        },
        {
          heading: 'Evlilik, aile ve miras',
          paragraphs: [
            'Boşanma (離婚), mal paylaşımı, reşit olmayan çocuklara ilişkin hak ve yükümlülüklerin kullanılması veya yüklenilmesi (未成年子女權利義務之行使或負擔), görüşme (會面交往) ve miras (繼承) işlerini yürütürüz; taraflar veya malvarlığı farklı devletlerde olsa da. Sınır aşan aile işleri çoğu zaman hane kaydı belgelerinin (戶籍), belgenin biçiminin ve Tayvan’daki ispat gücünün ek incelenmesini gerektirir.',
            'Aile işleri sık sık süreler ve paralel usuller getirdiğinden, ilk özet tarafların ilişkisini, güncel oturma yerini ve hâlihazırda yürüyen usulleri belirtmelidir.',
          ],
        },
        {
          heading: 'İş uyuşmazlıkları',
          paragraphs: [
            'Bu grup iş ilişkisinin sona ermesini, Tayvan hukukuna göre kıdem tazminatını (資遣費; başka devletlerin kurumlarıyla aynı tutulmamalıdır), ücreti ve iş sözleşmesinden (勞動契約) doğan uyuşmazlıkları kapsar; işçi veya işveren tarafında. İncelemede sona erme sebebini bildirim, ödeme ve süre sorularından ayırırız.',
            'İş sözleşmesi, iş kuralları (工作規則), ücret bordroları ve tarafların yazışması çoğu zaman belirleyici belgelerdir. Hâlâ elinizdeyse özetinizde belirtin.',
          ],
        },
        {
          heading: 'Ceza işleri',
          paragraphs: [
            'Soruşturmada ve mahkemede, şüpheli veya sanık için olduğu kadar mağdur için de destekleriz ve ticari faaliyetin ceza risklerini değerlendiririz.',
            'Ceza işlerinin çoğu zaman kısa süreleri ve belirlenmiş aşamaları vardır. Savcılık veya mahkemeden bir yazı aldıysanız, içeriğin doğru sırada incelenmesi için yazıdaki tarihi erken belirtin.',
          ],
        },
        {
          heading: 'Fikri mülkiyet',
          paragraphs: [
            'Tayvan’da marka (商標) ve patent (專利) tescilinde, telifte ve bu haklara ilişkin uyuşmazlıklarda yardımcı oluruz.',
            'Bu grupta adımların sırası belirleyicidir: koruma kapsamı, başvuru anı ve fiilî kullanım seçimi etkiler. Bir başvurunun sunulması, kendiliğinden onaylandığı anlamına gelmez.',
          ],
        },
        {
          heading: 'Kapsam ve doğrulanması',
          paragraphs: [
            'Büro Tayvan hukukuna göre çalışır ve yukarıdaki gruplardaki işleri yürütür. Her işin kapsamı, bir avukat iletinizi inceledikten sonra ayrıca doğrulanır.',
            'Oturma durumu, çalışma izni ve benzeri sorular uyruktan değil, belgelerden ve ilgili kişinin durumundan değerlendirilir. Konunuzun bir kısmı bu soruları ilgilendiriyorsa, iletişimde belirtin. Bu sayfa ne sonuç ne de yanıt süresi vaat eder.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'BÜRO',
      title: 'Hovering International Law Firm hakkında',
      description:
        'Bu Tayvan avukatlık bürosuna, ofislerine ve yabancı taraflarla çalışmaya ilişkin temel bilgiler.',
      intro:
        'Hovering International Law Firm, Tayvan’da bir avukatlık bürosudur. Avukatlar şirket danışmanlığından mahkeme usulüne kadar çalışır. Bu bölüm firmanın kuruluşunu, yerleri ve yabancı taraflarla çalışmayı anlatır.',
      sections: [
        {
          heading: 'Kuruluş ve yapı',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所), 2016 yılında National Taiwan University’de (國立臺灣大學) öğrenim görmüş avukatlar tarafından kuruldu. Çin adı 昊鼎, 昊 (“geniş gök”) işaretini 鼎 (“sağlam temel”) ile birleştirir ve firmanın kuruluşundan beri yönünü anlatır.',
            'Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) ve Pingtung (屏東) ofislerimiz vardır. Kaohsiung ofisi şirket yönetimine odaklanır ve hukuk, ceza ve idare uyuşmazlıklarını yürütür. Taichung ofisi inşaat işleri, fikri mülkiyet ve Kore ile Japonya bağlantılı işleri yürütür. Pingtung ofisi 2017’de yerel gereksinim için açıldı.',
            'Avukatlık çalışmasının yanında 2020’den beri Hovering Accounting Office da vardır; girişimcilere ve varlıklı kişilere muhasebe ve vergi planlaması sunar.',
          ],
        },
        {
          heading: 'Yabancı taraflarla çalışma',
          paragraphs: [
            'Sınır aşan çalışma şirket kuruluşunu, vizeleri, marka ve patent başvurularını, hukuki risk incelemesini ve şirketlere vergi danışmanlığını kapsar. Taichung ofisi özellikle inşaat işleri, fikri mülkiyet ve Kore ile Japonya bağlantılı işleri yürütür. Avukat Wei Tseng (曾雋崴), anılan gruplarda Kore, Japonya ve diğer uluslararası müvekkilleri destekler.',
            'Bir işi alıp alamayacağımız içeriğe ve iletişim diline bağlıdır. Konunuz anılan gruplara giriyorsa ve dört görüşme dilinden birinde konuşulabiliyorsa, inceleme için bir özet gönderebilirsiniz.',
          ],
        },
        {
          heading: 'Bizimle iletişime geçtiğinizde',
          paragraphs: [
            'Özetiniz geldikten sonra bir avukat içeriği inceler, ardından olası çalışma kapsamını, hâlâ gereken belgeleri ve sonraki adımları konuşur. Vergi veya muhasebe sorularında büro, muhasebe birimiyle aynı akışta çalışabilir.',
            'Her işin sonucu olgulara ve eldeki belgelere bağlıdır; sonuç vaat etmeyiz. Durumunuz için bağlayıcı bir yanıt gerekiyorsa, belgeler dört görüşme dilinden birinde bir avukatla konuşulmalıdır.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'AVUKATLAR',
      title: 'Hovering uluslararası ekibi',
      description: 'Hovering avukatlarının, operasyon yönetiminin ve ortak muhasebenin profilleri.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'KAPSAM VE ÜCRET',
      title: 'Çalışma kapsamı ve ücret nasıl belirlenir',
      description:
        'Sıranın açıklaması: önce çalışma kapsamı, sonra ücretin doğrulanması ve bu sayfada neden fiyat listesi olmadığı.',
      intro:
        'Bu sayfa ücretin nasıl belirlendiğini açıklar, tutarını değil. Tutar, ilgili işin çalışma kapsamına bağlıdır ve bu kapsam açık olmadan anlamlı değildir.',
      sections: [
        {
          heading: 'Önce çalışma kapsamı belirlenir',
          paragraphs: [
            'Aynı tür işler, taraf sayısına, eldeki belgelere, uyulması gereken sürelere ve bir usulün başlayıp başlamadığına göre çok farklı emek gerektirebilir. Bu yüzden ilk adım her zaman işe neyin girip neyin girmediğini belirlemektir.',
            'Başta gönderdiğiniz özet, bu kapsamın temelidir. Olay akışını, isteğinizi ve süreleri ne kadar açık anlatırsa kapsam o kadar kesin belirlenebilir.',
          ],
        },
        {
          heading: 'Ücret, işe başlamadan önce doğrulanır',
          paragraphs: [
            'Çalışma kapsamı açık olduğunda ücretin tutarı ve hesaplanma biçimi, işe başlamadan önce sizinle konuşulur ve doğrulanır. Kapsam yolda değişirse yeniden doğrulanmalıdır.',
            'Bu sayfa bir fiyat önerisi değildir ve ödeme yükümlülüğü doğurmaz. Bu sayfa üzerinden talep göndermek de ücret gerektirmez.',
          ],
        },
        {
          heading: 'Görüşme ücretli bir hizmet olabilir',
          paragraphs: [
            'Bir avukatla görüşme ücretli bir hizmet olabilir. Bu sayfa ilk konuşmanın ücretsiz olduğunu söylemez ve hiçbir bölüm böyle okunmamalıdır.',
            'Görüşme ücretliyse tutar ve ödeme biçimi, görüşme yapılmadan önce bildirilir.',
          ],
        },
        {
          heading: 'Bu sayfa neden tarife belirtmez',
          paragraphs: [
            'Ücret işin kendisine bağlıdır: emeğe, taraf sayısına, belgelere, sürelere ve bir usulün yürüyüp yürümediğine. Önceden konmuş bir sayı, sizin işinizin ücretini göstermez. Bu yüzden önce çalışma kapsamını belirler, sonra işe başlamadan önce ücreti size bildiririz.',
            'Avukatlık ücretinin yanında mahkeme, idare veya üçüncü kişi giderleri doğabilir. Bunlar ücretten ayrıdır ve ilgili usule bağlıdır.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'İLETİŞİM',
      title: 'Büroya nasıl ulaşırsınız',
      description:
        'Sayfa dili, görüşme dilleri, dört dilden hiçbirini kullanamıyorsanız izlenecek yol ve bu sayfanın vaat etmediği şeyler.',
      intro:
        'Yazmadan önce lütfen aşağıdaki üç noktayı ayırın. Sıkça karıştırılırlar ama farklı şeyler anlamına gelirler.',
      sections: [
        {
          heading: 'Ayrı tutulması gereken üç şey',
          paragraphs: [
            'Sayfanın görüntüleme dili, avukatla görüşme dili ve yazdığınız dil üç ayrı şeydir.',
          ],
          items: [
            'Sayfa dili: Bu bilgiler Türkçe yazılmıştır.',
            'Görüşme dili: Görüşme İngilizce, Çince (中文), Japonca ve Korece yapılır.',
            'Yazma diliniz: Özeti kendi dilinizde yazabilirsiniz; özgün metin değiştirilmeden saklanır.',
          ],
        },
        {
          heading: 'Dört görüşme dilinden hiçbirini kullanamıyorsanız',
          paragraphs: [
            'İletişim formunda «İletişim yolunun doğrulanması gerekir» seçeneğini seçebilirsiniz. Kullanılabilir bir yol varsa, o yolu incelemek için yanıtlarız; başka dilde hizmet sağlanmaz ve yanıt süresi vaat edilmez.',
            'Bu yalnızca bir inceleme adımıdır, bir vaat değildir. Tercüman vaat etmeyiz, dört dilin dışında Türkçe veya başka dilde hizmet vaat etmeyiz ve her işi kabul edeceğimizi vaat etmeyiz.',
          ],
        },
        {
          heading: 'İlk iletide neler olmalıdır',
          paragraphs: [
            'Ne olduğunu, ne yardıma gereksinim duyduğunuzu, işin Tayvan ile ilişkisini ve biliyorsanız süreyi belirtin. Mahkemeden veya bir idareden yazı aldıysanız, yazıdaki tarihi belirtin.',
            'İlk aşamada henüz pasaport numarası, kimlik numarası, hesap bilgisi, sağlık kaydı veya tüm kanıtları göndermeniz gerekmez. Avukatın yönlendirmesini bekleyin ve duyarlı belgeleri o zaman güvenli bir yolla gönderin.',
          ],
        },
        {
          heading: 'Bu sayfanın vaat etmediği şeyler',
          paragraphs: [
            'Yanıt süresi vaat etmeyiz, bu sayfa üzerinden randevu doğrulamayız, belirli bir avukat vaat etmeyiz ve tercüman sağlamayız. Yazılı çeviri başka bir şeydir: iletiniz kendiliğinden çevrilmez.',
            'Talep gönderirseniz içerik saklanır ve inceleme bekler. Bir süre sonra yanıt almazsanız, iletişim sayfasında belirtilen e-posta adresine yeniden yazabilirsiniz.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'SIK SORULAN SORULAR',
      title: 'Sık sorulan sorular',
      description:
        'Çalışma alanı, hazırlık, diller, ücret ve gönderilmiş bir talebin anlamı hakkında açıklamalar.',
      intro:
        'Aşağıdaki sorular genel bilgi düzeyinde yanıtlanır. Sizin dosyanız için bir yanıt, bir avukat belgeleri inceledikten sonra mümkün olur.',
      sections: [
        {
          heading: 'Bu bölümü nasıl kullanırsınız',
          paragraphs: [
            'Durumunuza yanıt bulamazsanız, yanıt çoğu zaman özel olgulara bağlıdır. O olguları bu sayfadan kendiniz çıkarmak yerine özetinize yazın.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Büro hangi işleri yürütür?',
          answer:
            'Altı grup yürütürüz: Tayvan’da yatırım ve şirket kuruluşu, hukuk davaları ve tazminat, evlilik, aile ve miras, iş uyuşmazlıkları, ceza işleri ve fikri mülkiyet. Bir işin alınıp alınmayacağı içerik incelendikten sonra kararlaştırılır.',
        },
        {
          question: 'İletişimden önce ne hazırlamalıyım?',
          answer:
            'Olay akışının, isteğinizin, Tayvan ile ilişkinin ve varsa sürenin kısa bir özetini hazırlayın. Mahkeme veya idare yazısı varsa tarihi belirtin. Bu aşamada henüz kimlik belgesi veya tüm kanıtları göndermeniz gerekmez.',
        },
        {
          question: 'Türkçe danışma mümkün mü?',
          answer:
            'Hayır. Bu bilgiler Türkçe yazılmıştır; ancak avukatla görüşme yalnızca İngilizce, Çince (中文), Japonca ve Korece yapılır. Tercüman da vaat etmeyiz. Yazılı çeviri başka bir şeydir: yazdığınız özgün metin olduğu gibi saklanır ve kendiliğinden çevrilmez.',
        },
        {
          question: 'Dört dilden hiçbirini kullanamazsam ne olur?',
          answer:
            'Talebi gönderirken «İletişim yolunun doğrulanması gerekir» seçeneğini seçin. İletişim yolunu incelemek için yanıtlarız, ancak başka dilde hizmet sağlanmaz. Bu bir inceleme adımıdır, başka dilde çalışabileceğimize dair bir vaat değildir.',
        },
        {
          question: 'Türkçe metnim nasıl ele alınır?',
          answer:
            'Yazdığınız özgün metin olduğu gibi saklanır ve kendiliğinden çevrilmez. Gerekirse sonraki iletişimin dili sizinle birlikte doğrulanır.',
        },
        {
          question: 'Talep gönderildiğinde görüşme yapılmış mı olur?',
          answer:
            'Hayır. Gönderilen talep bir avukatın incelemesini bekler. Bu hukuki görüş değildir, doğrulanmış randevu değildir ve göndermek kendi başına avukat ile müvekkil arasında ilişki kurmaz.',
        },
        {
          question: 'Ücret nasıl hesaplanır?',
          answer:
            'Önce çalışma kapsamı belirlenir, sonra ücretin tutarı ve hesaplanma biçimi işe başlamadan önce sizinle doğrulanır. Bu sayfa sayı vermez ve ilk konuşmanın ücretsiz olduğunu söylemez.',
        },
        {
          question: 'Konum çok ivediyse ne olur?',
          answer:
            'Süreyi veya resmi bir yazıdaki tarihi özetinizin başında belirtin ki incelemede görülsün. Bu sayfanın ivedi bir kanalı yoktur ve yanıt süresi sağlanmaz; konum bekleyemiyorsa bulunduğunuz yerde paralel başka yollar aramalısınız.',
        },
      ],
    },
    privacy: {
      eyebrow: 'GİZLİLİK',
      title: 'İletişim formuyla toplanan veriler',
      description:
        'Bu Türkçe bölümdeki iletişim formunun neleri topladığı, özgün metnin nasıl ele alındığı ve verileriniz için bize nasıl ulaşacağınız.',
      intro:
        'Bu bölüm yalnızca bu bilgi sayfalarındaki iletişim formunu kapsar. Veri işlemeyi anlatır, teknik bir mutlak koruma vaadi değildir.',
      sections: [
        {
          heading: 'Hangi veriler toplanır',
          paragraphs: [
            'Bu bölümdeki form üzerinden talep gönderdiğinizde aşağıdaki bilgiler kaydedilir:',
          ],
          items: [
            'Belirttiğiniz ad',
            'Yanıt için e-posta adresi',
            'Gönderim anındaki sayfa görüntüleme dili',
            'Yazdığınız dil',
            'İstediğiniz görüşme dili',
            'Yazdığınız özgün metin',
            'Talebi göndermeye verdiğiniz onay',
            'Talebi yeniden bulmak için bir alındı numarası',
          ],
        },
        {
          heading: 'Özgün metin değiştirilmeden saklanır',
          paragraphs: [
            'Metniniz yazdığınız gibi saklanır ve kendiliğinden çevrilmez. İşleme için çeviri gerekirse bu sizinle ayrıca konuşulur.',
            'Özgün metin saklandığı için ilk aşamada henüz gerekmeyen şeyleri yazmayın; örneğin pasaport numarası, kimlik numarası veya hesap bilgileri.',
          ],
        },
        {
          heading: 'Saklama yeri ve erişim',
          paragraphs: [
            'Gönderinizin içeriği kamuya açık olmayan bir yerde saklanır. Yalnızca büroda yetkili kişiler talebi işlemek için erişebilir.',
            'Bu sayfa mutlak bir güvenlik vaadi vermez. Hiçbir iletim yolu ve hiçbir saklama yeri tümüyle güvenli değildir; bu yüzden duyarlı belgeler yalnızca avukatın özel yönlendirmesinden sonra gönderilmelidir.',
          ],
        },
        {
          heading: 'Kullanım amacı',
          paragraphs: [
            'Gönderilen veriler talebin incelenmesine, size yanıt verilmesine, iletişim yolunun açıklığa kavuşturulmasına ve işe başlanırsa işlemeye hizmet eder.',
            'Veriler, ayrı bir onay olmadan pazarlama için kullanılmaz.',
          ],
        },
        {
          heading: 'Bildirim ve alındı numarası',
          paragraphs: [
            'Bir talep başarıyla gönderilirse sistem büroyu bilgilendirir. Bu bildirim henüz doğrulanmamışsa metniniz saklı kalır ve kaybolmaz.',
            'Alındı numarası, talebinizi kayıtlarımızda yeniden bulmaya yarar. Saklandıktan sonra gösterilir; yeniden iletişimde belirtebilirsiniz.',
          ],
        },
        {
          heading: 'Haklarınız ve iletişim yolu',
          paragraphs: [
            'Verilerinizin bilgisine, düzeltilmesine veya silinmesine ilişkin talepte bulunabilir veya onayı, iletişim sayfasında belirtilen e-posta adresi üzerinden geri çekebilirsiniz. Yasal veya usule bağlı bir saklama yükümlülüğü varsa sınırlamayı açıklarız.',
            'Bu sayfa sabit bir saklama süresi belirtmez, çünkü fiilî süre işin sürdürülüp sürdürülmediğine ve buna bağlı yükümlülüklere bağlıdır. Daha erken silme isterseniz bunu iletişimde belirtin.',
          ],
        },
        {
          heading: 'Saklama yeri ve hizmet sağlayıcılar',
          paragraphs: [
            'Bu site Vercel’de barındırılır ve gönderiniz bu hizmetin kamuya açık olmayan nesne depolamasında saklanır. E-postalar büronun kullandığı e-posta hizmeti üzerinden gönderilir.',
            'Bazı sağlayıcıların sunucuları Tayvan dışında olabilir, bu yüzden verileriniz orada saklanıp işlenebilir. Saklama amacı dolunca veriler gecikmeksizin silinir; yürürlükteki kurallara göre saklanması gereken veriler bu süre boyunca kalır. Kişisel verilere ilişkin soruları wei@hoveringlaw.com.tw alır.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'SORUMLULUK REDDİ',
      title: 'Bu sayfadaki bilgilerin kapsamı ve sınırları',
      description:
        'Bilgilerin genel niteliği, hukuki uygulama alanı ve avukat–müvekkil ilişkisinin koşulları.',
      intro:
        'Bu bölüm, bu Türkçe bilgi sayfalarının sizin için ne yapabileceğini ve ne yapamayacağını açıklar.',
      sections: [
        {
          heading: 'Yalnızca genel bilgi',
          paragraphs: [
            'Bu sayfaların içeriği genel bilgi olarak yazılmıştır. Dosyanız için hukuki görüş değildir ve kendi belgelerinizin incelenmesinin yerine geçmez.',
            'Bir işin sonucu olgulara, uygulanacak kurallara ve zamana bağlıdır; benzer görünen iki durum farklı bitebilir.',
          ],
        },
        {
          heading: 'Hukuki uygulama alanı',
          paragraphs: [
            'Büro Tayvan hukukuna göre meslek yürütür ve bu sayfa yalnızca bu çerçevedeki çalışmadan söz eder.',
            'İçerik, oturduğunuz yerin hukuku dâhil, Tayvan dışındaki bir hukuk düzenine göre görüş değildir. İşinizin bir kısmı başka bir hukuk düzenini ilgilendiriyorsa, o kısım için hangi nitelikli uzmanın gerektiğini sizinle netleştiririz.',
          ],
        },
        {
          heading: 'Avukat–müvekkil ilişkisi kendiliğinden doğmaz',
          paragraphs: [
            'Bu sayfayı okumak, bir form veya e-posta göndermek kendi başına avukat ile müvekkil arasında ilişki kurmaz.',
            'Bu ilişki ancak iş incelendikten ve her iki taraf çalışmanın üstlenilmesini doğruladıktan sonra doğar.',
          ],
        },
        {
          heading: 'Sonuç vaadi yoktur',
          paragraphs: [
            'Bu sayfanın hiçbir bölümü bir işin sonucu, bir başvurunun onayı veya oturma ve çalışma durumu hakkında vaat değildir.',
            'Dış bağlantılar yönlendirme içindir; üçüncü kişi içeriğinin doğruluğunu veya güncelliğini vaat etmeyiz.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'YAZILAR',
      title: 'Tayvan hukukuna ilişkin yazılar',
      description:
        'Sık karşılaşılan Tayvan hukuku konularına ilişkin Türkçe yazılar. İçerik, yayımlanma anındaki genel bilgidir; dosyanız için hukuki görüş değildir.',
      intro:
        'Büro, sık karşılaşılan Tayvan hukuku konularına ilişkin yazılar yayımlar. Türkçe olan yazılar bu sayfadadır; yanında her biri bir özgün dilin yazı listesini açan dört bağlantı vardır.',
      sections: [
        {
          heading: 'Dile göre dört liste',
          paragraphs: [
            'Bu bölümde dört bağlantı vardır: Korece, Çince, İngilizce ve Japonca yazı listesi. Her bağlantı listenin dilini belirtir, böylece içeriğin hangi dilde açılacağını önceden bilirsiniz.',
            'Bu dört liste, yazıların özgün diline göre listelerdir, çeviri listeleri değildir. Türkçe olan yazılar bu sayfada ayrıca yer alır.',
          ],
        },
        {
          heading: 'Bağlantılar nereye gider',
          paragraphs: [
            'Dört bağlantıdan birini seçtiğinizde o dilin yazı listesi açılır. Listeden metni siz seçersiniz; tüm içerik yazının özgün dilinde görünür.',
            'Bu sayfa yazıların içeriğini özetlemez ve bir konunun dört dilde de bulunduğunu vaat etmez. Her liste yalnızca o dilde yayımlanmış metinleri içerir.',
          ],
        },
        {
          heading: 'Bir yazının yol göstericiliği ne kadardır',
          paragraphs: [
            'Yazılar, yayımlanma anındaki genel bilgilerdir. Kurallar ve uygulanışları değişebilir ve bir yazı dosyanızın tüm koşullarını içermez.',
            'Bu yüzden gerçek bir işte eyleminizi yalnızca bir yazıya dayandırmayın. Genel bakış için kullanın ve belgelerinizi ayrı olarak bir avukatla konuşun; bu sayfa görüşme adımı değildir.',
          ],
        },
      ],
    },
  },
};

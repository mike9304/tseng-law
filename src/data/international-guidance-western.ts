/**
 * German and Spanish guidance packs. Same contract as vi/id/th/fil/ar:
 * page language ≠ consultation language. Consultations are only English,
 * Chinese, Japanese and Korean. No interpreter, reply-time, appointment,
 * fee figure, outcome or residency promise.
 */
import type { GuidanceLocaleContent } from '@/data/international-guidance-content';

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
    columnsReviewLabel: 'Geprüft von Rechtsanwalt Wei Tseng',
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
            'Die grenzüberschreitende Arbeit umfasst Gesellschaftsgründung, Visa, Marken- und Patentanmeldungen, rechtliche Risikoprüfung und steuerliche Beratung von Unternehmen. Das Büro Taichung bearbeitet insbesondere Bausachen, geistiges Eigentum und Angelegenheiten mit Bezug zu Korea und Japan. Rechtsanwalt Wei Tseng (曾雋崴) begleitet Mandanten aus Korea, Japan und andere internationale Mandanten in den genannten Gruppen.',
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
  menuLabel: 'Índice de páginas',
  languageLabel: 'Idioma de visualización',
  mega: {
    services: {
      description: 'El despacho atiende los grupos principales de trabajo según el derecho de Taiwán.',
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
      'Si aún no tiene claro a qué grupo pertenece su asunto, la página de ',
    servicesAssistanceLinkLabel: 'Contacto',
    servicesAssistanceAfter:
      ' explica cómo redactar un resumen que un abogado revisará.',
    columnsViewAllLabel: 'Ver todos los artículos',
    columnsReadMoreLabel: 'Seguir leyendo',
    columnsReviewLabel: 'Revisado por el abogado Wei Tseng',
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
          heading: 'Grupos de asuntos que atendemos',
          paragraphs: [
            'El alcance del despacho cubre los seis grupos siguientes. La página «Áreas de trabajo» describe cada grupo con más detalle y señala lo que no se garantiza.',
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
        'Seis grupos de trabajo del despacho en Taiwán y los límites que conviene conocer de antemano.',
      intro:
        'A continuación, los grupos que realmente atendemos y las cuestiones que suelen plantearse al inicio. Esta descripción le ayuda a valorar si su asunto entra en nuestro alcance; es información general, no el análisis jurídico de un expediente concreto.',
      sections: [
        {
          heading: 'Inversión y constitución de sociedades en Taiwán',
          paragraphs: [
            'Acompañamos a inversores y empresas extranjeras que constituyen o explotan una sociedad en Taiwán: elección de la forma societaria, preparación y presentación de documentos, aportación de capital, banca, valoración del local y requisitos propios de determinados sectores. También apoyamos la contabilidad y la fiscalidad derivadas de constituir y operar en Taiwán.',
            'El orden y la duración del proceso varían según la forma societaria, el inversor, el sector, el banco y los documentos disponibles. Constituir una sociedad no produce por sí solo un permiso de residencia (居留) ni un permiso de trabajo (工作許可): son trámites distintos que se valoran según la situación de cada persona.',
          ],
        },
        {
          heading: 'Litigios civiles y daños',
          paragraphs: [
            'Este grupo cubre conflictos contractuales, reclamaciones de daños por acto ilícito y conflictos de consumo. El trabajo suele empezar por una cronología de los hechos, la revisión de documentos y pruebas existentes y, solo después, los siguientes pasos.',
            'Los plazos, incluidos los plazos legales para demandar, y la integridad de las pruebas influyen mucho en el curso del asunto civil, así que indique desde el principio las fechas que conozca. Si conserva contratos, mensajes, justificantes de pago o fotos del lugar, menciónelo en el primer mensaje.',
          ],
        },
        {
          heading: 'Matrimonio, familia y sucesiones',
          paragraphs: [
            'Atendemos divorcio (離婚), liquidación de bienes, ejercicio y asunción de derechos y deberes respecto de hijos menores (未成年子女權利義務之行使或負擔), régimen de visitas (會面交往) y sucesiones (繼承), también cuando las partes o los bienes están en países distintos. Los asuntos de familia transfronterizos suelen exigir un examen adicional de documentos del registro de hogar (戶籍), de la forma de los documentos y de su valor probatorio en Taiwán.',
            'Como los asuntos de familia suelen ir unidos a plazos y a varios trámites en paralelo, el resumen inicial debería indicar la relación entre las partes, el lugar de residencia actual y los procedimientos ya iniciados.',
          ],
        },
        {
          heading: 'Conflictos laborales',
          paragraphs: [
            'Este grupo cubre la extinción del contrato de trabajo, la indemnización según el derecho de Taiwán (資遣費; no se identifica con instituciones de otros países), salarios y conflictos derivados del contrato de trabajo (勞動契約), tanto del lado de la persona trabajadora como del empleador. Al revisar el asunto separamos el fundamento de la extinción de las cuestiones de preaviso, pago y plazos.',
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
            'En este grupo el orden de los pasos es decisivo: el alcance de la protección, el momento de la presentación y el uso efectivo influyen en la estrategia. Presentar una solicitud no garantiza por sí solo que se conceda.',
          ],
        },
        {
          heading: 'Alcance y cómo se confirma',
          paragraphs: [
            'El despacho trabaja según el derecho de Taiwán y atiende asuntos de los grupos anteriores. El alcance de cada asunto se confirma por separado después de que un abogado revise el contenido que usted envía.',
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
            'Hovering International Law Firm (昊鼎國際法律事務所) se fundó en 2016 por abogados egresados de la National Taiwan University (國立臺灣大學). El nombre chino 昊鼎 une el carácter 昊 («cielo amplio») y el carácter 鼎 («base sólida»), y expresa la orientación del despacho desde su origen.',
            'Tenemos oficinas en Taipéi (臺北), Kaohsiung (高雄), Taichung (臺中) y Pingtung (屏東). La oficina de Kaohsiung se centra en el gobierno corporativo y atiende conflictos civiles, penales y administrativos. La oficina de Taichung atiende construcción, propiedad intelectual y asuntos relacionados con Corea y Japón. La oficina de Pingtung se abrió en 2017 para atender la demanda local.',
            'Además del trabajo de abogacía, en 2020 se creó Hovering Accounting Office, que ofrece contabilidad y planificación fiscal a empresarios y a particulares con patrimonio elevado.',
          ],
        },
        {
          heading: 'Trabajo con partes extranjeras',
          paragraphs: [
            'El trabajo transfronterizo cubre constitución de sociedades, visados, registro de marcas y patentes, evaluación de riesgos jurídicos y asesoramiento fiscal empresarial. La oficina de Taichung atiende en particular construcción, propiedad intelectual y asuntos relacionados con Corea y Japón. El abogado Wei Tseng (曾雋崴) acompaña a clientes de Corea, de Japón y a otros clientes internacionales en los grupos anteriores.',
            'Si podemos o no atender un asunto depende de su contenido y del idioma de la comunicación. Si su asunto entra en los grupos anteriores y puede hablarse en uno de los cuatro idiomas de consulta, puede enviar un resumen para que un abogado lo revise.',
          ],
        },
        {
          heading: 'Cuando nos contacta',
          paragraphs: [
            'Tras recibir su resumen, un abogado revisa el contenido y habla después del alcance posible, de los documentos que aún se necesitan y de los siguientes pasos. Si el asunto plantea cuestiones contables o fiscales, el despacho puede trabajar con el área de contabilidad en un mismo flujo.',
            'El resultado de cada asunto depende de los hechos y de los documentos existentes, de modo que no prometemos un resultado. Si necesita una respuesta concreta para su situación, ese expediente debe hablarse directamente con un abogado en uno de los cuatro idiomas de consulta.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'ABOGADOS',
      title: 'Equipo internacional de Hovering',
      description: 'Perfiles de los abogados, de la dirección de operaciones y del contador asociado de Hovering.',
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
            'La cuantía depende del propio asunto: del trabajo que haya que hacer, del número de partes, de los documentos, de los plazos y de si un procedimiento ya ha empezado. Una cifra puesta de antemano no mostraría el coste de su expediente; por eso, en lugar de una lista de tarifas, fijamos primero el alcance de su asunto y le comunicamos después los honorarios para que los valore antes de empezar.',
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
            'Idioma de consulta: la consulta con un abogado se realiza en inglés, chino (中文), japonés y coreano.',
            'Idioma de su texto: puede escribir el resumen en su propio idioma, y el texto original se guarda tal cual.',
          ],
        },
        {
          heading: 'Si no puede usar ninguno de los cuatro idiomas de consulta',
          paragraphs: [
            'En el formulario de contacto puede elegir «Hace falta confirmar la forma de comunicarse». Responderemos para comprobar una vía posible de comunicación cuando exista una forma posible; no se garantiza el servicio en otro idioma y no se promete un plazo de respuesta.',
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
      title: 'Preguntas que se formulan a menudo',
      description:
        'Explicación del alcance, de la preparación, de los idiomas, de los honorarios y del significado de enviar una solicitud.',
      intro:
        'Las preguntas siguientes se responden en el plano de la información general. La respuesta para su propio caso solo puede darse después de que un abogado revise el expediente.',
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
            'Atendemos seis grupos: inversión y constitución de sociedades en Taiwán, litigios civiles y daños, matrimonio, familia y sucesiones, conflictos laborales, asuntos penales y propiedad intelectual. Si un asunto se acepta o no se decide después de revisar su contenido.',
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

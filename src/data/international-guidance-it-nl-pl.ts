/**
 * Italian, Dutch and Polish guidance packs. Same contract as the western
 * German pack: page language ≠ consultation language. Consultations are only
 * English, Chinese, Japanese and Korean. No interpreter, reply-time,
 * appointment, fee figure, outcome or residency promise.
 *
 * Formal address: Italian Lei (capitalised), Dutch u, Polish Państwo.
 * Attorney Wei Tseng is female: Italian l'avvocata; Dutch advocaat + zij/haar;
 * Polish adwokatka + feminine agreement (native review 2026-09-21).
 */
import type { GuidanceLocaleContent } from '@/data/international-guidance-content';

export const italianGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Italiano',
  nav: {
    home: 'Home',
    services: 'Servizi',
    about: 'Lo studio',
    lawyers: 'Avvocati',
    pricing: 'Costi',
    contact: 'Contatti',
    faq: 'Domande',
    privacy: 'Privacy',
    disclaimer: 'Avvertenze',
    columns: 'Articoli',
  },
  contactCta: 'Inviare una richiesta di consulenza',
  footerNotice:
    'Questa pagina in italiano contiene soltanto indicazioni generali sul lavoro dello studio secondo il diritto di Taiwan. Non è una consulenza legale per un caso concreto, e l’invio di un messaggio non costituisce di per sé un rapporto tra avvocata o avvocato e cliente.',
  skipLink: 'Saltare la navigazione e andare al contenuto',
  menuLabel: 'Menu',
  languageLabel: 'Lingua di visualizzazione',
  mega: {
    services: {
      description: 'Lo studio tratta le principali aree di attività secondo il diritto di Taiwan.',
      viewAllLabel: 'Mostra tutti',
    },
    columns: {
      description: 'Articoli su domande frequenti del diritto di Taiwan.',
      viewAllLabel: 'Mostra tutti',
    },
    lawyers: {
      description: 'Presentazione delle avvocate e degli avvocati e dei modi di contatto.',
      viewAllLabel: 'Mostra tutti',
    },
    pricing: {
      description: 'Questa pagina spiega l’ambito del lavoro e come si chiariscono i costi.',
      viewAllLabel: 'Mostra tutti',
    },
    faq: {
      description: 'Domande frequenti sul lavoro dello studio a Taiwan.',
      viewAllLabel: 'Mostra tutti',
    },
  },
  notFoundTitle: 'Pagina non trovata',
  notFoundText:
    'La pagina cercata non esiste o è stata spostata. Può tornare alla pagina iniziale in italiano per vedere le indicazioni disponibili.',
  backHomeLabel: 'Alla pagina iniziale',
  readSourceLabel: 'Aprire l’elenco degli articoli nella lingua originale',
  home: {
    heroScrollLabel: 'Scorrere verso il basso',
    heroColumnsCtaLabel: 'Vedere gli articoli',
    servicesDetailLabel: 'Vedere i dettagli',
    servicesAssistanceBefore: 'Se non è chiaro a quale area di attività appartiene la Sua questione, la pagina ',
    servicesAssistanceLinkLabel: 'Contatti',
    servicesAssistanceAfter:
      ' spiega come formulare un riassunto che un’avvocata o un avvocato esamina.',
    columnsViewAllLabel: 'Vedere tutti gli articoli',
    columnsReadMoreLabel: 'Continua a leggere',
    columnsReviewLabel: 'Verificato dall’avvocata Wei Tseng',
    columnsOriginalLanguageBadge: 'Lingua originale',
    columnsOriginalLanguageNote:
      'I seguenti articoli non sono ancora disponibili in italiano. L’elenco resta nella lingua originale e apre la relativa pagina linguistica; il contenuto non viene tradotto automaticamente.',
    imageBandAlt: 'Tradizionale sanheyuan taiwanese (三合院) e un padiglione moderno alla luce del giorno',
    videoPauseLabel: 'Mettere in pausa il video',
    videoPlayLabel: 'Riprodurre il video',
    videoReplayLabel: 'Riprodurre di nuovo il video',
  },
  pages: {
    home: {
      eyebrow: 'INDICAZIONI',
      title: 'Servizi legali a Taiwan — indicazioni in italiano',
      description:
        'Spiegazioni generali in italiano sull’ambito di lavoro di Hovering International Law Firm a Taiwan, sulle lingue di consulenza e sul primo contatto.',
      intro:
        'Hovering International Law Firm accompagna clienti dall’estero, anche quando hanno un collegamento con Taiwan, in questioni di diritto taiwanese: investimento e costituzione di società, controversie civili, matrimonio, famiglia e successioni, diritto del lavoro, penale e proprietà intellettuale. Questa parte in italiano La aiuta a riconoscere quale lavoro rientra nel nostro ambito, che cosa preparare e come raggiungerci. Si tratta di indicazioni generali, non di una consulenza legale per il Suo caso.',
      sections: [
        {
          heading: 'Che cosa facciamo',
          paragraphs: [
            'Hovering International Law Firm è uno studio legale stabilito a Taiwan. Lavora secondo il diritto di Taiwan e ha uffici a Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) e Pingtung (屏東). Forniamo consulenza alle imprese, le rappresentiamo in giudizio e accompagniamo i clienti dall’estero nei passi necessari a Taiwan.',
            'Tutto il contenuto qui è generale. L’esito di una questione dipende dai fatti, dalle norme applicabili e dal momento. Queste indicazioni non sostituiscono il colloquio con un’avvocata o un avvocato sui Suoi documenti.',
          ],
        },
        {
          heading: 'La lingua della pagina e la lingua di consulenza non sono la stessa cosa',
          paragraphs: [
            'Questa pagina è scritta in italiano, ma la consulenza con un’avvocata o un avvocato si svolge soltanto nelle quattro lingue di consulenza inglese, cinese (中文), giapponese e coreano. Leggere le indicazioni in italiano non significa che il colloquio con l’avvocata o l’avvocato avvenga in italiano.',
            'Non promettiamo un interprete, un termine di risposta né un appuntamento tramite questa pagina. Se non può usare nessuna delle quattro lingue, la pagina «Contatti» spiega come esaminiamo un canale di comunicazione.',
          ],
        },
        {
          heading: 'Aree di attività',
          paragraphs: [
            'L’ambito di lavoro comprende le sei aree seguenti. La pagina «Servizi» descrive ogni area con più precisione e indica che cosa non viene promesso.',
          ],
          items: [
            'Investimento e costituzione di società a Taiwan',
            'Controversie civili e risarcimento',
            'Matrimonio, famiglia e successioni',
            'Controversie di lavoro',
            'Questioni penali',
            'Proprietà intellettuale: marchi, brevetti e diritto d’autore',
          ],
        },
        {
          heading: 'Da dove iniziare',
          paragraphs: [
            'Legga la pagina «Servizi» per verificare se la Sua questione rientra nel nostro ambito, poi «Costi» e «Contatti» per sapere come si fissa l’ambito e come i costi vengono confermati prima dell’inizio del lavoro.',
            'Nell’inviare un messaggio può scrivere il riassunto nella Sua lingua. Il testo originale viene conservato così come lo ha scritto e non viene tradotto automaticamente. Un messaggio inviato è una richiesta in attesa di esame: non è ancora una consulenza né un appuntamento confermato.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'SERVIZI',
      title: 'Quali questioni trattiamo',
      description:
        'Le sei aree di attività dello studio a Taiwan e i limiti che conviene conoscere per primi.',
      intro:
        'Di seguito le aree di cui ci occupiamo e le domande che nella fase iniziale si pongono spesso. L’esposizione La aiuta a valutare se la Sua questione rientra nel nostro ambito; è generale e non è un’analisi giuridica di un singolo fascicolo.',
      sections: [
        {
          heading: 'Investimento e costituzione di società a Taiwan',
          paragraphs: [
            'Accompagniamo investitori e imprese straniere nella costituzione o nella gestione di una società a Taiwan: scelta della forma giuridica, preparazione e deposito di documenti, conferimento del capitale, questioni bancarie, esame della sede e requisiti di settore. Assistiamo anche in materia contabile e fiscale per quanto deriva dalla costituzione e dalla gestione a Taiwan.',
            'Il percorso e i tempi differiscono secondo la forma, l’investitore, il settore, la banca e i documenti già disponibili. La costituzione di una società non porta da sola a un titolo di soggiorno (居留) o a un permesso di lavoro (工作許可): sono procedimenti distinti, valutati secondo la situazione della persona.',
          ],
        },
        {
          heading: 'Controversie civili e risarcimento',
          paragraphs: [
            'Quest’area comprende controversie contrattuali, risarcimento da illecito e controversie dei consumatori. Il lavoro inizia di regola con una cronologia, l’esame dei documenti e delle prove esistenti e soltanto dopo con i passi successivi.',
            'I termini, comprese le prescrizioni, e la completezza delle prove determinano l’andamento della pratica. Indichi quindi le date note il più presto possibile. Conservi contratti, messaggi, ricevute di pagamento o fotografie della situazione sul posto e li menzioni nel primo messaggio.',
          ],
        },
        {
          heading: 'Matrimonio, famiglia e successioni',
          paragraphs: [
            'Trattiamo il divorzio (離婚), la divisione patrimoniale, l’affidamento e la responsabilità genitoriale sui figli minori (未成年子女權利義務之行使或負擔), il diritto di visita (會面交往) e le successioni (繼承), anche quando le parti o i beni si trovano in Stati diversi. Le questioni familiari transfrontaliere richiedono spesso un esame ulteriore dei registri anagrafici (戶籍), della forma degli atti e della loro prova a Taiwan.',
            'Poiché le questioni familiari portano spesso termini e procedimenti paralleli, il primo riassunto dovrebbe indicare il rapporto tra le parti, il domicilio attuale e i procedimenti già in corso.',
          ],
        },
        {
          heading: 'Controversie di lavoro',
          paragraphs: [
            'Quest’area comprende la cessazione del rapporto di lavoro, l’indennità secondo il diritto di Taiwan (資遣費; non da equiparare a istituti di altri Stati), la retribuzione e le controversie dal contratto di lavoro (勞動契約), sia dal lato del lavoratore sia da quello del datore di lavoro. Nell’esame distinguiamo il motivo della cessazione dalle questioni di preavviso, di pagamento e di termini.',
            'Il contratto di lavoro, il regolamento interno (工作規則), le buste paga e la corrispondenza delle parti sono di solito i documenti decisivi. Se li ha ancora, lo menzioni nel riassunto.',
          ],
        },
        {
          heading: 'Questioni penali',
          paragraphs: [
            'Accompagniamo nel procedimento di indagine e in giudizio, per indagati o imputati così come per persone offese, e valutiamo i rischi penali dell’attività d’impresa.',
            'Le questioni penali hanno spesso termini brevi e fasi fissate. Se ha già ricevuto uno scritto dell’autorità inquirente o del giudice, indichi presto la data sullo scritto, così il contenuto viene esaminato nell’ordine giusto.',
          ],
        },
        {
          heading: 'Proprietà intellettuale',
          paragraphs: [
            'Assistiamo nella registrazione di marchi (商標) e brevetti (專利), nel diritto d’autore e nelle controversie su questi diritti a Taiwan.',
            'In quest’area decide l’ordine dei passi: l’ambito di protezione, il momento del deposito e l’uso effettivo influenzano la scelta. Il deposito di una domanda non significa di per sé che essa sia accolta.',
          ],
        },
        {
          heading: 'Ambito e sua conferma',
          paragraphs: [
            'Lo studio lavora secondo il diritto di Taiwan e tratta questioni delle aree sopra indicate. L’ambito di ciascuna questione viene confermato separatamente dopo che un’avvocata o un avvocato ha esaminato il Suo messaggio.',
            'Lo status di soggiorno, il permesso di lavoro e questioni analoghe si valutano dai documenti e dalla situazione della persona, non dalla nazionalità. Se una parte della Sua questione tocca tali punti, lo indichi nel contatto. Questa pagina non promette un risultato né un termine di risposta.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'LO STUDIO',
      title: 'Su Hovering International Law Firm',
      description:
        'Dati di base su questo studio legale taiwanese, i suoi uffici e il lavoro con parti straniere.',
      intro:
        'Hovering International Law Firm è uno studio legale a Taiwan. Le avvocate e gli avvocati lavorano dalla consulenza d’impresa al procedimento giudiziario. Questa parte descrive la nascita dello studio, le sedi e il lavoro con parti straniere.',
      sections: [
        {
          heading: 'Fondazione e struttura',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) è stato fondato nel 2016 da avvocate e avvocati che hanno studiato alla National Taiwan University (國立臺灣大學). Il nome cinese 昊鼎 unisce il carattere 昊 («cielo ampio») con 鼎 («base solida») e descrive l’orientamento dello studio dalla fondazione.',
            'Abbiamo uffici a Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) e Pingtung (屏東). L’ufficio di Kaohsiung si concentra sulla gestione d’impresa e tratta controversie civili, penali e amministrative. L’ufficio di Taichung tratta questioni edilizie, proprietà intellettuale e questioni collegate alla Corea e al Giappone. L’ufficio di Pingtung è stato aperto nel 2017 per le esigenze del territorio.',
            'Oltre al lavoro forense esiste dal 2020 anche Hovering Accounting Office, che offre contabilità e pianificazione fiscale a imprenditori e privati con patrimoni rilevanti.',
          ],
        },
        {
          heading: 'Lavoro con parti straniere',
          paragraphs: [
            'Il lavoro transfrontaliero comprende costituzione di società, visti, depositi di marchi e brevetti, esame del rischio giuridico e consulenza fiscale di imprese. L’ufficio di Taichung tratta in particolare questioni edilizie, proprietà intellettuale e questioni collegate alla Corea e al Giappone. L’avvocata Wei Tseng (曾雋崴) accompagna clienti dalla Corea, dal Giappone e altri clienti internazionali nelle aree indicate.',
            'Se possiamo assumere una questione dipende dal contenuto e dalla lingua della comunicazione. Se la Sua questione rientra nelle aree indicate e può essere discussa in una delle quattro lingue di consulenza, può inviare un riassunto per l’esame.',
          ],
        },
        {
          heading: 'Quando ci contatta',
          paragraphs: [
            'Dopo l’arrivo del Suo riassunto un’avvocata o un avvocato esamina il contenuto e parla poi del possibile ambito di lavoro, dei documenti ancora necessari e dei passi successivi. Per questioni fiscali o contabili lo studio può lavorare con la sezione di contabilità in modo integrato.',
            'Il risultato di ciascuna questione dipende dai fatti e dai documenti disponibili; non promettiamo un risultato. Se ha bisogno di una risposta vincolante per la Sua situazione, i documenti devono essere discussi in una delle quattro lingue di consulenza con un’avvocata o un avvocato.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'AVVOCATI',
      title: 'Team internazionale di Hovering',
      description: 'Profili delle avvocate e degli avvocati, del responsabile operativo e del commercialista partner di Hovering.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'COSTI',
      title: 'Come si fissano ambito di lavoro e costi',
      description:
        'Spiegazione dell’ordine: prima l’ambito di lavoro, poi la conferma dei costi, e perché questa pagina non contiene un listino.',
      intro:
        'Questa pagina spiega come si fissano i costi, non il loro importo. L’importo dipende dall’ambito di lavoro della singola questione ed è utile soltanto quando quell’ambito è chiaro.',
      sections: [
        {
          heading: 'Prima si fissa l’ambito di lavoro',
          paragraphs: [
            'Questioni dello stesso tipo possono avere un impegno molto diverso, secondo il numero delle parti, i documenti disponibili, i termini da rispettare e se un procedimento è già iniziato. Perciò il primo passo è sempre fissare che cosa appartiene al lavoro e che cosa no.',
            'Il riassunto che invia all’inizio è la base di questo ambito. Quanto più chiaramente descrive il corso, la Sua richiesta e i termini, tanto più precisamente si può determinare l’ambito.',
          ],
        },
        {
          heading: 'I costi si confermano prima dell’inizio del lavoro',
          paragraphs: [
            'Quando l’ambito di lavoro è chiaro, l’importo e il modo di calcolo dei costi si discutono e si confermano con Lei prima che il lavoro inizi. Se l’ambito cambia in corso d’opera, ciò deve essere confermato di nuovo.',
            'Questa pagina non è un’offerta di prezzo e non crea un obbligo di pagamento.',
          ],
        },
        {
          heading: 'La consulenza può essere a pagamento',
          paragraphs: [
            'La consulenza con un’avvocata o un avvocato può essere una prestazione a pagamento. Questa pagina non dice che il primo colloquio è gratuito, e nessuna parte può essere letta in quel senso.',
            'Se la consulenza è a pagamento, l’importo e il modo di pagamento vengono comunicati prima che essa abbia luogo.',
          ],
        },
        {
          heading: 'Perché questa pagina non indica tariffe',
          paragraphs: [
            'I costi dipendono dalla questione stessa: dall’impegno, dal numero delle parti, dai documenti, dai termini e dal fatto che un procedimento sia già in corso. Un numero fissato in anticipo non mostrerebbe i costi del Suo fascicolo. Perciò fissiamo prima l’ambito di lavoro e Le comunichiamo poi i costi, prima che il lavoro inizi.',
            'Oltre all’onorario possono sorgere costi di tribunale, di autorità o di terzi. Questi sono distinti dall’onorario e dipendono dal rispettivo procedimento.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'CONTATTI',
      title: 'Come raggiungere lo studio',
      description:
        'Lingua della pagina, lingue di consulenza, il da farsi se non può usare nessuna delle quattro lingue, e che cosa questa pagina non promette.',
      intro:
        'Prima di scriverci, distingua i tre punti seguenti. Vengono spesso mescolati, ma significano cose diverse.',
      sections: [
        {
          heading: 'Tre cose che devono restare distinte',
          paragraphs: [
            'La lingua di visualizzazione della pagina, la lingua di consulenza con l’avvocata o l’avvocato e la lingua in cui scrive sono tre cose distinte.',
          ],
          items: [
            'Lingua della pagina: queste indicazioni sono scritte in italiano.',
            'Lingua di consulenza: la consulenza si svolge in inglese, cinese (中文), giapponese e coreano.',
            'La Sua lingua di scrittura: può scrivere il riassunto nella Sua lingua; il testo originale viene conservato senza modifiche.',
          ],
        },
        {
          heading: 'Se non può usare nessuna delle quattro lingue di consulenza',
          paragraphs: [
            'Nel modulo di contatto può scegliere «Il canale di comunicazione deve essere confermato». Rispondiamo per esaminare un canale di comunicazione praticabile, se un canale del genere esiste; una prestazione in un’altra lingua non è garantita e un termine di risposta non è promesso.',
            'Questo è soltanto un passo di esame, non è una promessa. Non promettiamo un interprete, una prestazione in italiano o in un’altra lingua fuori dalle quattro lingue indicate, né promettiamo di accettare ogni questione.',
          ],
        },
        {
          heading: 'Che cosa dovrebbe contenere il primo messaggio',
          paragraphs: [
            'Indichi che cosa è accaduto, di quale aiuto ha bisogno, quale nesso ha la questione con Taiwan e il termine, se ne conosce uno. Se ha già ricevuto uno scritto di un tribunale o di un’autorità, indichi la data sullo scritto.',
            'Nella fase iniziale non deve ancora inviare il numero di passaporto, il numero di documento, i dati di un conto, cartelle cliniche o l’insieme delle prove. Attenda le indicazioni dell’avvocata o dell’avvocato e invii allora i documenti sensibili attraverso un canale sicuro.',
          ],
        },
        {
          heading: 'Che cosa questa pagina non promette',
          paragraphs: [
            'Non promettiamo un termine di risposta, non confermiamo un appuntamento tramite questa pagina, non promettiamo una determinata avvocata o un determinato avvocato e non mettiamo a disposizione un interprete. La traduzione scritta è un’altra cosa: il Suo messaggio non viene tradotto automaticamente.',
            'Se invia una richiesta, il contenuto viene conservato e attende l’esame. Se dopo un po’ di tempo non riceve risposta, può scrivere di nuovo all’indirizzo di posta elettronica indicato nella pagina di contatto.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'DOMANDE',
      title: 'Domande frequenti',
      description:
        'Spiegazioni su ambito di lavoro, preparazione, lingue, costi e sul significato di una richiesta inviata.',
      intro:
        'Alle domande seguenti si risponde a livello di indicazioni generali. Una risposta per il Suo caso è possibile soltanto dopo che un’avvocata o un avvocato ha esaminato i documenti.',
      sections: [
        {
          heading: 'Come usare questa parte',
          paragraphs: [
            'Se non trova una risposta per la Sua situazione, la risposta dipende di solito da fatti particolari. Scriva allora quei fatti nel riassunto, invece di dedurli da questa pagina.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Quali questioni tratta lo studio?',
          answer:
            'Trattiamo sei aree di attività: investimento e costituzione di società a Taiwan, controversie civili e risarcimento, matrimonio, famiglia e successioni, controversie di lavoro, questioni penali e proprietà intellettuale. Se una questione viene accettata si decide dopo l’esame del contenuto.',
        },
        {
          question: 'Che cosa dovrei preparare prima del contatto?',
          answer:
            'Prepari un breve riassunto del corso, della Sua richiesta, del nesso con Taiwan e del termine, se ve n’è uno. Se c’è già uno scritto di un tribunale o di un’autorità, indichi la data. In questa fase non deve ancora inviare documenti di identità o l’insieme delle prove.',
        },
        {
          question: 'È possibile una consulenza in italiano?',
          answer:
            'No. Queste indicazioni sono scritte in italiano, ma la consulenza con un’avvocata o un avvocato si svolge soltanto in inglese, cinese (中文), giapponese e coreano. Non promettiamo nemmeno un interprete. La traduzione scritta è un’altra cosa: il testo originale che scrive viene conservato così e non viene tradotto automaticamente.',
        },
        {
          question: 'Che fare se non posso usare nessuna delle quattro lingue?',
          answer:
            'Scelga, nell’inviare la richiesta, «Il canale di comunicazione deve essere confermato». Rispondiamo per esaminare un canale di comunicazione, ma una prestazione in un’altra lingua non è garantita. Questo è un passo di esame, non è una promessa che possiamo lavorare in un’altra lingua.',
        },
        {
          question: 'Come viene trattato il mio testo in italiano?',
          answer:
            'Il testo originale che scrive viene conservato così com’è e non viene tradotto automaticamente. Se occorre, la lingua della comunicazione successiva viene confermata con Lei.',
        },
        {
          question: 'La consulenza è già avvenuta quando la richiesta è inviata?',
          answer:
            'No. Una richiesta inviata attende l’esame di un’avvocata o di un avvocato. Non è un parere giuridico, non è un appuntamento confermato, e l’invio non costituisce di per sé un rapporto tra avvocata o avvocato e cliente.',
        },
        {
          question: 'Come si calcolano i costi?',
          answer:
            'Prima si fissa l’ambito di lavoro, poi l’importo e il modo di calcolo dei costi si confermano con Lei prima che il lavoro inizi. Questa pagina non indica cifre e non dice che il primo colloquio è gratuito.',
        },
        {
          question: 'Che fare se la mia questione è molto urgente?',
          answer:
            'Indichi il termine o la data su uno scritto ufficiale all’inizio del riassunto, così quelle date sono visibili nell’esame. Questa pagina non ha un canale di emergenza e non assicura un termine di risposta; se la Sua questione non può attendere, dovrebbe cercare in parallelo altre vie nel Suo luogo.',
        },
      ],
    },
    privacy: {
      eyebrow: 'PRIVACY',
      title: 'Dati raccolti tramite il modulo di contatto',
      description:
        'Che cosa raccoglie il modulo di contatto in questa parte in italiano, come viene trattato il testo originale e come raggiungerci sui Suoi dati.',
      intro:
        'Questa parte riguarda soltanto il modulo di contatto su queste pagine di indicazioni. Descrive il trattamento dei dati, non una garanzia tecnica.',
      sections: [
        {
          heading: 'Quali dati vengono raccolti',
          paragraphs: [
            'Quando invia una richiesta tramite il modulo in questa parte, vengono registrati i seguenti dati:',
          ],
          items: [
            'Il nome da Lei indicato',
            'L’indirizzo di posta elettronica per la risposta',
            'La lingua di visualizzazione della pagina al momento dell’invio',
            'La lingua in cui ha scritto',
            'La lingua di consulenza da Lei desiderata',
            'Il testo originale che ha scritto',
            'Il Suo consenso all’invio della richiesta',
            'Un numero di ricezione per ritrovare la richiesta',
          ],
        },
        {
          heading: 'Il testo originale viene conservato senza modifiche',
          paragraphs: [
            'Il Suo testo viene conservato esattamente come lo ha scritto e non viene tradotto automaticamente. Se una traduzione è necessaria per il trattamento, ciò viene discusso con Lei a parte.',
            'Poiché il testo originale viene conservato, nella fase iniziale non scriva ciò che non è ancora necessario, ad esempio il numero di passaporto, il numero di documento o i dati di un conto.',
          ],
        },
        {
          heading: 'Luogo di conservazione e accesso',
          paragraphs: [
            'Il contenuto del Suo invio viene conservato in un luogo non accessibile al pubblico. Soltanto persone autorizzate nello studio possono accedervi per trattare la richiesta.',
            'Questa pagina non dà una garanzia assoluta di sicurezza. Nessun canale di trasmissione e nessun luogo di conservazione è del tutto sicuro; i documenti sensibili dovrebbero quindi essere inviati soltanto dopo un’istruzione particolare dell’avvocata o dell’avvocato.',
          ],
        },
        {
          heading: 'Scopo dell’uso',
          paragraphs: [
            'I dati inviati servono all’esame della richiesta, alla risposta a Lei, al chiarimento del canale di comunicazione e al trattamento, se il lavoro viene assunto.',
            'I dati non vengono usati per il marketing senza un consenso distinto.',
          ],
        },
        {
          heading: 'Notifica e numero di ricezione',
          paragraphs: [
            'Se una richiesta viene inviata con successo, il sistema notifica lo studio. Se questa notifica non è ancora confermata, il Suo testo resta conservato e non va perduto.',
            'Il numero di ricezione serve a ritrovare la Sua richiesta nei nostri atti. Viene mostrato dopo la conservazione; può indicarlo in un nuovo contatto.',
          ],
        },
        {
          heading: 'I Suoi diritti e il canale di contatto',
          paragraphs: [
            'Può chiedere accesso, rettifica o cancellazione dei Suoi dati o revocare il consenso, tramite l’indirizzo di posta elettronica indicato nella pagina di contatto. Se esiste un obbligo legale o processuale di conservazione, spieghiamo la limitazione.',
            'Questa pagina non indica un termine fisso di conservazione, perché la durata effettiva dipende dal seguito della questione e dagli obblighi connessi. Se desidera una cancellazione anteriore, lo comunichi nel contatto.',
          ],
        },
        {
          heading: 'Luogo di conservazione e fornitori',
          paragraphs: [
            'Questo sito è ospitato presso Vercel, e il Suo invio viene conservato in un archivio di oggetti non pubblico di questo servizio. Le e-mail vengono inviate tramite il servizio di posta usato dallo studio.',
            'I server di singoli fornitori possono trovarsi fuori da Taiwan, così i Suoi dati possono essere ivi conservati e trattati. Quando lo scopo di conservazione è soddisfatto, i dati vengono cancellati senza ritardo; i dati che devono essere conservati secondo le norme applicabili restano per quella durata. Per le richieste sui dati personali si scriva a wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'AVVERTENZE',
      title: 'Ambito e limiti delle indicazioni su questa pagina',
      description:
        'Il carattere generale delle indicazioni, l’ambito giuridico e i presupposti di un rapporto tra avvocata o avvocato e cliente.',
      intro:
        'Questa parte chiarisce che cosa queste pagine di indicazioni in italiano possono fare per Lei e che cosa no.',
      sections: [
        {
          heading: 'Soltanto indicazioni generali',
          paragraphs: [
            'Il contenuto di queste pagine è scritto come informazione generale. Non è una consulenza legale per il Suo caso e non sostituisce l’esame dei Suoi documenti.',
            'L’esito di una questione dipende dai fatti, dalle norme applicabili e dal momento; due situazioni apparentemente simili possono finire in modo diverso.',
          ],
        },
        {
          heading: 'Ambito giuridico',
          paragraphs: [
            'Lo studio opera secondo il diritto di Taiwan, e questa pagina parla soltanto del lavoro in questo quadro.',
            'Il contenuto non è una consulenza secondo il diritto di un altro ordinamento diverso da Taiwan, compreso il diritto del Suo luogo di residenza. Se una parte della Sua questione riguarda un altro ordinamento, chiariremo con Lei quale persona qualificata è necessaria per quella parte.',
          ],
        },
        {
          heading: 'Un rapporto tra avvocata o avvocato e cliente non sorge automaticamente',
          paragraphs: [
            'La lettura di questa pagina, l’invio di un modulo o di un’e-mail non costituisce di per sé un rapporto tra avvocata o avvocato e cliente.',
            'Questo rapporto nasce soltanto dopo che la questione è stata esaminata e entrambe le parti hanno confermato l’assunzione del lavoro.',
          ],
        },
        {
          heading: 'Nessuna promessa di risultato',
          paragraphs: [
            'Nessuna parte di questa pagina è una promessa sul risultato di una questione, sull’accoglimento di una domanda o sullo status di soggiorno e di lavoro.',
            'I collegamenti esterni servono all’orientamento; non promettiamo né l’esattezza né l’attualità di contenuti di terzi.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'ARTICOLI',
      title: 'Articoli sul diritto di Taiwan',
      description:
        'Articoli in italiano su domande frequenti del diritto di Taiwan. Il contenuto è informazione generale al momento della pubblicazione, non una consulenza legale per il Suo caso.',
      intro:
        'Lo studio pubblica articoli su domande frequenti del diritto di Taiwan. Gli articoli disponibili in italiano si trovano su questa pagina; accanto ci sono quattro collegamenti che aprono ciascuno l’elenco degli articoli di una lingua originale.',
      sections: [
        {
          heading: 'Quattro elenchi per lingua',
          paragraphs: [
            'Questa parte contiene quattro collegamenti: l’elenco degli articoli in coreano, in cinese, in inglese e in giapponese. Ogni collegamento indica la lingua dell’elenco, così sa in anticipo in quale lingua si apre il contenuto.',
            'Questi quattro elenchi sono elenchi secondo la lingua originale degli articoli, non elenchi di traduzione. Gli articoli disponibili in italiano si trovano a parte su questa pagina.',
          ],
        },
        {
          heading: 'Dove portano i collegamenti',
          paragraphs: [
            'Se sceglie uno dei quattro collegamenti, si apre l’elenco degli articoli di quella lingua. Dall’elenco sceglie Lei il testo; l’intero contenuto appare nella lingua originale dell’articolo.',
            'Questa pagina non riassume il contenuto degli articoli e non garantisce che un tema sia disponibile in tutte e quattro le lingue. Ogni elenco contiene soltanto testi pubblicati in quella lingua.',
          ],
        },
        {
          heading: 'Fino a che punto un articolo può servire da orientamento',
          paragraphs: [
            'Gli articoli sono indicazioni generali al momento della pubblicazione. Le norme e la loro applicazione possono cambiare, e un articolo non contiene tutte le circostanze del Suo caso.',
            'Non fondi quindi una decisione su un caso reale soltanto su un articolo. Lo usi per la visione d’insieme e discuta i Suoi documenti a parte con un’avvocata o un avvocato; questa pagina non è il passo di consulenza.',
          ],
        },
      ],
    },
  },
};

export const dutchGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Nederlands',
  nav: {
    home: 'Home',
    services: 'Diensten',
    about: 'Het kantoor',
    lawyers: 'Advocaten',
    pricing: 'Kosten',
    contact: 'Contact',
    faq: 'Vragen',
    privacy: 'Privacy',
    disclaimer: 'Voorbehoud',
    columns: 'Artikelen',
  },
  contactCta: 'Een verzoek om advies sturen',
  footerNotice:
    'Deze Nederlandstalige pagina bevat alleen algemene toelichting over het werk van het kantoor volgens Taiwanees recht. Het is geen juridisch advies voor een concreet dossier, en het versturen van een bericht schept op zich geen relatie tussen advocaat en cliënt.',
  skipLink: 'Navigatie overslaan en naar de inhoud',
  menuLabel: 'Pagina-overzicht',
  languageLabel: 'Weergavetaal',
  mega: {
    services: {
      description: 'Het kantoor behandelt de belangrijkste praktijkgebieden van het Taiwanese recht.',
      viewAllLabel: 'Alles tonen',
    },
    columns: {
      description: 'Artikelen over veelgestelde vragen over het Taiwanese recht.',
      viewAllLabel: 'Alles tonen',
    },
    lawyers: {
      description: 'Kennismaking met de advocaten en de contactmogelijkheden.',
      viewAllLabel: 'Alles tonen',
    },
    pricing: {
      description: 'Deze pagina legt de omvang van het werk uit en hoe kosten worden vastgesteld.',
      viewAllLabel: 'Alles tonen',
    },
    faq: {
      description: 'Veelgestelde vragen over het werk van het kantoor in Taiwan.',
      viewAllLabel: 'Alles tonen',
    },
  },
  notFoundTitle: 'Pagina niet gevonden',
  notFoundText:
    'De gezochte pagina bestaat niet of is verplaatst. U kunt terugkeren naar de Nederlandse startpagina om de beschikbare toelichting te zien.',
  backHomeLabel: 'Naar de startpagina',
  readSourceLabel: 'De artikelenlijst in de oorspronkelijke taal openen',
  home: {
    heroScrollLabel: 'Naar beneden scrollen',
    heroColumnsCtaLabel: 'Artikelen bekijken',
    servicesDetailLabel: 'Details bekijken',
    servicesAssistanceBefore: 'Als onduidelijk is tot welke groep uw zaak behoort, legt de pagina ',
    servicesAssistanceLinkLabel: 'Contact',
    servicesAssistanceAfter:
      ' uit hoe u een korte samenvatting opstelt die een advocaat kan beoordelen.',
    columnsViewAllLabel: 'Alle artikelen bekijken',
    columnsReadMoreLabel: 'Verder lezen',
    columnsReviewLabel: 'Beoordeeld door advocaat Wei Tseng',
    columnsOriginalLanguageBadge: 'Oorspronkelijke taal',
    columnsOriginalLanguageNote:
      'De volgende artikelen zijn nog niet in het Nederlands beschikbaar. De lijst blijft in de oorspronkelijke taal en opent de betreffende taalpagina; de inhoud wordt niet automatisch vertaald.',
    imageBandAlt: 'Traditioneel Taiwanees sanheyuan (三合院) en een modern paviljoen bij daglicht',
    videoPauseLabel: 'Video pauzeren',
    videoPlayLabel: 'Video afspelen',
    videoReplayLabel: 'Video opnieuw afspelen',
  },
  pages: {
    home: {
      eyebrow: 'TOELICHTING',
      title: 'Rechtsdiensten in Taiwan — toelichting in het Nederlands',
      description:
        'Algemene uitleg in het Nederlands over het werkterrein van Hovering International Law Firm in Taiwan, de consultatietalen en het eerste contact.',
      intro:
        'Hovering International Law Firm begeleidt cliënten uit het buitenland, ook met een band met Taiwan, in zaken volgens Taiwanees recht: investering en oprichting van vennootschappen, civiele geschillen, huwelijk, familie en erfrecht, arbeidsrecht, strafzaken en intellectuele eigendom. Dit Nederlandse deel helpt u te zien welk werk tot ons terrein behoort, wat u moet voorbereiden en hoe u ons bereikt. Het gaat om algemene informatie, niet om juridisch advies voor uw eigen zaak.',
      sections: [
        {
          heading: 'Wat wij doen',
          paragraphs: [
            'Hovering International Law Firm is een in Taiwan gevestigd advocatenkantoor. Het werkt volgens Taiwanees recht en heeft kantoren in Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) en Pingtung (屏東). Wij adviseren ondernemingen, voeren procedures voor de rechter en begeleiden buitenlandse cliënten door de stappen die in Taiwan nodig zijn.',
            'De hele inhoud hier is algemeen. De afloop van een zaak hangt af van de feiten, de toepasselijke regels en het tijdstip. Deze toelichting vervangt niet het gesprek met een advocaat over uw stukken.',
          ],
        },
        {
          heading: 'De taal van de pagina is niet de taal van het gesprek met de advocaat',
          paragraphs: [
            'Deze pagina is in het Nederlands geschreven, maar het gesprek met een advocaat vindt alleen plaats in de vier consultatietalen Engels, Chinees (中文), Japans en Koreaans. Het lezen van de Nederlandse toelichting betekent niet dat het gesprek met de advocaat in het Nederlands plaatsvindt.',
            'Wij beloven geen tolk, geen antwoordtermijn en geen afspraak via deze pagina. Als u geen van de vier talen kunt gebruiken, legt de pagina “Contact” uit hoe wij naar een werkbare manier van communiceren zoeken.',
          ],
        },
        {
          heading: 'Praktijkgebieden',
          paragraphs: [
            'Het werkterrein omvat de volgende zes praktijkgebieden. De pagina “Diensten” beschrijft elk gebied nader en noemt wat niet wordt toegezegd.',
          ],
          items: [
            'Investering en oprichting van een vennootschap in Taiwan',
            'Civiele zaken en schadevergoeding',
            'Huwelijk, familie en erfrecht',
            'Arbeidsrechtelijke geschillen',
            'Strafzaken',
            'Intellectuele eigendom: merken, octrooien en auteursrecht',
          ],
        },
        {
          heading: 'Waar u moet beginnen',
          paragraphs: [
            'Lees de pagina “Diensten” om te toetsen of uw zaak tot ons terrein behoort, daarna “Kosten” en “Contact” om te weten hoe de omvang wordt vastgesteld en hoe de kosten vóór het begin van het werk worden bevestigd.',
            'Bij het sturen van een bericht mag u de samenvatting in uw eigen taal schrijven. De oorspronkelijke tekst wordt bewaard zoals u die hebt geschreven en niet automatisch vertaald. Een verzonden bericht is een verzoek dat op beoordeling wacht: dat is nog geen advies en nog geen bevestigde afspraak.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'DIENSTEN',
      title: 'Welke zaken wij behandelen',
      description:
        'De zes praktijkgebieden van het kantoor in Taiwan en de grenzen die u eerst moet kennen.',
      intro:
        'Hieronder staan de praktijkgebieden die wij daadwerkelijk behandelen, met vragen die in de beginfase vaak worden gesteld. De weergave helpt u te beoordelen of uw zaak tot ons terrein behoort; zij is algemeen en geen juridische analyse van één dossier.',
      sections: [
        {
          heading: 'Investering en oprichting van een vennootschap in Taiwan',
          paragraphs: [
            'Wij begeleiden buitenlandse investeerders en ondernemingen bij de oprichting of de exploitatie van een vennootschap in Taiwan: keuze van de rechtsvorm, voorbereiding en indiening van stukken, kapitaalinbreng, bankzaken, toetsing van de vestigingsplaats en branchespecifieke eisen. Wij ondersteunen ook boekhouding en belastingen die uit oprichting en exploitatie in Taiwan voortvloeien.',
            'Verloop en duur verschillen naar rechtsvorm, investeerder, branche, bank en aanwezige stukken. Oprichting van een vennootschap leidt niet vanzelf tot een verblijfstitel (居留) of een werkvergunning (工作許可): dat zijn afzonderlijke procedures, beoordeeld naar de situatie van de persoon.',
          ],
        },
        {
          heading: 'Civiele zaken en schadevergoeding',
          paragraphs: [
            'Deze groep omvat contractgeschillen, schadevergoeding uit onrechtmatige daad en consumentengeschillen. Het werk begint meestal met een chronologie, de toetsing van aanwezige stukken en bewijzen en pas daarna met de volgende stappen.',
            'Termijnen, waaronder wettelijke vervaltermijnen, en de volledigheid van het bewijs bepalen het verloop. Noem daarom bekende data zo vroeg mogelijk. Bewaar contracten, berichten, betalingsbewijzen of foto’s van de situatie ter plaatse en vermeld ze in het eerste bericht.',
          ],
        },
        {
          heading: 'Huwelijk, familie en erfrecht',
          paragraphs: [
            'Wij behandelen echtscheiding (離婚), vermogensverdeling, uitoefening en dragen van rechten en plichten jegens minderjarige kinderen (未成年子女權利義務之行使或負擔), omgang (會面交往) en erfrecht (繼承), ook als partijen of vermogen in verschillende staten liggen. Grensoverschrijdende familiezaken vragen vaak extra toetsing van huishoudregisters (戶籍), de vorm van akten en hun bewijsbaarheid in Taiwan.',
            'Omdat familiezaken vaak termijnen en parallelle procedures meebrengen, moet de eerste samenvatting de verhouding van de partijen, de huidige woonplaats en al lopende procedures noemen.',
          ],
        },
        {
          heading: 'Arbeidsrechtelijke geschillen',
          paragraphs: [
            'Deze groep omvat beëindiging van de arbeidsovereenkomst, ontslagvergoeding volgens Taiwanees recht (資遣費; dit is niet hetzelfde als de ontslagvergoeding of de transitievergoeding in Nederland of België), loon en geschillen uit de arbeidsovereenkomst (勞動契約), zowel aan werknemers- als aan werkgeverszijde. Bij de toetsing scheiden wij de beëindigingsgrond van vragen over aankondiging, betaling en termijnen.',
            'Arbeidsovereenkomst, arbeidsreglement (工作規則), loonstroken en de briefwisseling van de partijen zijn meestal de beslissende stukken. Als u ze nog hebt, vermeld dat in de samenvatting.',
          ],
        },
        {
          heading: 'Strafzaken',
          paragraphs: [
            'Wij begeleiden in het opsporingsonderzoek en voor de rechter, voor verdachten of beklaagden evenzeer als voor benadeelden, en beoordelen strafrechtelijke risico’s van ondernemingsactiviteit.',
            'Strafzaken hebben vaak korte termijnen en vastgelegde stappen. Als u al een schrijven van het openbaar ministerie of de rechter hebt ontvangen, noem vroeg de datum op het schrijven, zodat de inhoud in de juiste volgorde wordt beoordeeld.',
          ],
        },
        {
          heading: 'Intellectuele eigendom',
          paragraphs: [
            'Wij ondersteunen bij de inschrijving van merken (商標) en octrooien (專利), bij auteursrecht en bij geschillen over deze rechten in Taiwan.',
            'In deze groep beslist de volgorde van de stappen: beschermingsomvang, aanmeldtijdstip en feitelijk gebruik beïnvloeden de keuze. Het indienen van een aanvraag betekent niet vanzelf dat zij wordt ingewilligd.',
          ],
        },
        {
          heading: 'Omvang en de bevestiging daarvan',
          paragraphs: [
            'Het kantoor werkt volgens Taiwanees recht en behandelt zaken van de bovengenoemde groepen. De omvang van elke zaak wordt afzonderlijk bevestigd nadat een advocaat uw bericht heeft beoordeeld.',
            'Verblijfsstatus, werkvergunning en vergelijkbare vragen worden beoordeeld uit de stukken en de situatie van de persoon, niet uit de nationaliteit. Als een deel van uw zaak zulke vragen raakt, noem dat bij het contact. Deze pagina belooft geen resultaat en geen antwoordtermijn.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'HET KANTOOR',
      title: 'Over Hovering International Law Firm',
      description:
        'Basisgegevens over dit Taiwanese advocatenkantoor, de kantoren en het werk met buitenlandse betrokkenen.',
      intro:
        'Hovering International Law Firm is een advocatenkantoor in Taiwan. De advocaten werken van ondernemingsadvies tot gerechtelijke procedure. Dit deel beschrijft het ontstaan van het kantoor, de vestigingen en het werk met buitenlandse betrokkenen.',
      sections: [
        {
          heading: 'Oprichting en opbouw',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) is in 2016 opgericht door advocaten die aan de National Taiwan University (國立臺灣大學) hebben gestudeerd. De Chinese naam 昊鼎 verbindt het teken 昊 (“wijde hemel”) met 鼎 (“vaste grond”) en beschrijft de koers van het kantoor sinds de oprichting.',
            'Wij hebben kantoren in Taipei (臺北), Kaohsiung (高雄), Taichung (臺中) en Pingtung (屏東). Het kantoor Kaohsiung richt zich op ondernemingsbestuur en behandelt civiele, straf- en bestuursrechtelijke geschillen. Het kantoor Taichung behandelt bouwzaken, intellectuele eigendom en zaken met betrekking tot Korea en Japan. Het kantoor Pingtung is in 2017 geopend voor de plaatselijke behoefte.',
            'Naast het advocatenwerk bestaat sinds 2020 ook Hovering Accounting Office, dat boekhouding en fiscale planning biedt voor ondernemers en vermogende particulieren.',
          ],
        },
        {
          heading: 'Werk met buitenlandse betrokkenen',
          paragraphs: [
            'Het grensoverschrijdende werk omvat oprichting van vennootschappen, visa, merken- en octrooiaanvragen, juridische risicotoetsing en fiscale advisering van ondernemingen. Het kantoor Taichung behandelt in het bijzonder bouwzaken, intellectuele eigendom en zaken met betrekking tot Korea en Japan. Advocaat Wei Tseng (曾雋崴) begeleidt cliënten uit Korea, Japan en andere internationale cliënten in de genoemde groepen.',
            'Of wij een zaak kunnen aannemen, hangt af van de inhoud en van de taal van de communicatie. Valt uw zaak in de genoemde groepen en kan zij in een van de vier consultatietalen worden besproken, dan kunt u een samenvatting ter beoordeling sturen.',
          ],
        },
        {
          heading: 'Als u contact opneemt',
          paragraphs: [
            'Na ontvangst van uw samenvatting beoordeelt een advocaat de inhoud en spreekt daarna over de mogelijke omvang van het werk, nog benodigde stukken en de volgende stappen. Bij fiscale of boekhoudkundige vragen kan het kantoor met de boekhouding in één verloop werken.',
            'Het resultaat van elke zaak hangt af van de feiten en de aanwezige stukken; wij beloven geen resultaat. Als u een bindend antwoord voor uw situatie nodig hebt, moeten de stukken in een van de vier consultatietalen met een advocaat worden besproken.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'ADVOCATEN',
      title: 'Internationaal team van Hovering',
      description: 'Profielen van de advocaten, de bedrijfsleiding en het aangesloten accountantskantoor van Hovering.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'KOSTEN',
      title: 'Hoe omvang van het werk en kosten worden vastgesteld',
      description:
        'Uitleg van de volgorde: eerst de omvang van het werk, daarna de kostenbevestiging, en waarom deze pagina geen prijslijst bevat.',
      intro:
        'Deze pagina legt uit hoe kosten worden vastgesteld, niet hun hoogte. De hoogte hangt af van de omvang van het werk van de betreffende zaak en is pas zinvol wanneer die omvang duidelijk is.',
      sections: [
        {
          heading: 'Eerst wordt de omvang van het werk vastgesteld',
          paragraphs: [
            'Zaken van hetzelfde type kunnen zeer verschillende inzet hebben, naar het aantal betrokkenen, aanwezige stukken, na te leven termijnen en of een procedure al is begonnen. Daarom is de eerste stap steeds vast te stellen wat tot het werk behoort en wat niet.',
            'De samenvatting die u aan het begin stuurt, is de grondslag voor die omvang. Hoe duidelijker zij het verloop, uw verzoek en de termijnen beschrijft, hoe nauwkeuriger de omvang kan worden bepaald.',
          ],
        },
        {
          heading: 'Kosten worden vóór het begin van het werk bevestigd',
          paragraphs: [
            'Is de omvang van het werk duidelijk, dan worden hoogte en berekeningswijze van de kosten met u besproken en bevestigd voordat het werk begint. Wijzigt de omvang onderweg, dan moet dat opnieuw worden bevestigd.',
            'Deze pagina is geen prijsvoorstel en schept geen betalingsplicht.',
          ],
        },
        {
          heading: 'De consultatie kan tegen betaling zijn',
          paragraphs: [
            'Het gesprek met een advocaat kan een dienst tegen betaling zijn. Deze pagina zegt niet dat het eerste gesprek kosteloos is, en geen deel mag zo worden gelezen.',
            'Is de consultatie tegen betaling, dan worden hoogte en betalingswijze meegedeeld voordat zij plaatsvindt.',
          ],
        },
        {
          heading: 'Waarom deze pagina geen tarieven noemt',
          paragraphs: [
            'De kosten hangen van de zaak zelf af: van de inzet, het aantal betrokkenen, de stukken, de termijnen en of een procedure al loopt. Een vooraf genoemd bedrag zou de kosten van uw dossier niet weergeven. Daarom stellen wij eerst de omvang van het werk vast en delen u daarna de kosten mee, voordat het werk begint.',
            'Naast het honorarium kunnen gerechtelijke, bestuurlijke of derdenkosten ontstaan. Die zijn van het honorarium gescheiden en hangen van de betreffende procedure af.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'CONTACT',
      title: 'Hoe u het kantoor bereikt',
      description:
        'De taal van de pagina, de consultatietalen, de werkwijze als u geen van de vier talen kunt gebruiken, en wat deze pagina niet toezegt.',
      intro:
        'Voordat u ons schrijft, onderscheidt u de volgende drie punten. Zij worden vaak vermengd, maar betekenen iets anders.',
      sections: [
        {
          heading: 'Drie dingen die gescheiden moeten blijven',
          paragraphs: [
            'De weergavetaal van de pagina, de consultatietaal met de advocaat en de taal waarin u schrijft, zijn drie gescheiden dingen.',
          ],
          items: [
            'Taal van de pagina: deze toelichting is in het Nederlands geschreven.',
            'Consultatietaal: de consultatie vindt plaats in het Engels, Chinees (中文), Japans en Koreaans.',
            'Uw schrijftaal: u mag de samenvatting in uw eigen taal schrijven; de oorspronkelijke tekst wordt ongewijzigd bewaard.',
          ],
        },
        {
          heading: 'Als u geen van de vier consultatietalen kunt gebruiken',
          paragraphs: [
            'In het contactformulier kunt u “Communicatiekanaal moet worden bevestigd” kiezen. Wij antwoorden om te onderzoeken of er een werkbare manier van communiceren bestaat; een dienst in een andere taal wordt niet gewaarborgd en een antwoordtermijn niet toegezegd.',
            'Dit is alleen een controle, geen belofte. Wij beloven geen tolk, geen dienst in het Nederlands of in een andere taal buiten de vier genoemde talen, en niet dat wij elke zaak aannemen.',
          ],
        },
        {
          heading: 'Wat in het eerste bericht moet staan',
          paragraphs: [
            'Noem wat er is gebeurd, welke hulp u nodig hebt, welk verband de zaak met Taiwan heeft en de termijn, als u er een kent. Als u al een schrijven van een rechter of een instantie hebt ontvangen, noem de datum op het schrijven.',
            'In de beginfase hoeft u nog geen paspoortnummer, identiteitsnummer, rekeninggegevens, medische dossiers of het gehele bewijs te sturen. Wacht op aanwijzingen van de advocaat en stuur gevoelige stukken dan via een veilige weg.',
          ],
        },
        {
          heading: 'Wat deze pagina niet toezegt',
          paragraphs: [
            'Wij beloven geen antwoordtermijn, bevestigen geen afspraak via deze pagina, beloven geen bepaalde advocaat en stellen geen tolk ter beschikking. Schriftelijke vertaling is iets anders: uw bericht wordt niet automatisch vertaald.',
            'Als u een verzoek stuurt, wordt de inhoud bewaard en wacht op beoordeling. Ontvangt u na enige tijd geen antwoord, dan kunt u opnieuw schrijven naar het e-mailadres op de contactpagina.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'VRAGEN',
      title: 'Veelgestelde vragen',
      description:
        'Toelichting over werkterrein, voorbereiding, talen, kosten en de betekenis van een verzonden verzoek.',
      intro:
        'De volgende vragen worden beantwoord op het niveau van algemene informatie. Een antwoord voor uw eigen zaak is pas mogelijk nadat een advocaat de stukken heeft beoordeeld.',
      sections: [
        {
          heading: 'Hoe u dit deel gebruikt',
          paragraphs: [
            'Vindt u geen antwoord voor uw situatie, dan hangt het antwoord meestal van bijzondere feiten af. Schrijf die feiten dan in de samenvatting, in plaats van ze zelf uit deze pagina af te leiden.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Welke zaken behandelt het kantoor?',
          answer:
            'Wij behandelen zes groepen: investering en oprichting van een vennootschap in Taiwan, civiele zaken en schadevergoeding, huwelijk, familie en erfrecht, arbeidsrechtelijke geschillen, strafzaken en intellectuele eigendom. Of wij een zaak aannemen, wordt beslist na beoordeling van de inhoud.',
        },
        {
          question: 'Wat moet ik voorbereiden vóór het contact?',
          answer:
            'Bereid een korte samenvatting van het verloop, uw verzoek, het verband met Taiwan en de termijn voor, als er een is. Ligt er al een schrijven van een rechter of een instantie, noem de datum. In dit stadium hoeft u nog geen identiteitsdocumenten of het gehele bewijs te sturen.',
        },
        {
          question: 'Kan ik in het Nederlands worden geadviseerd?',
          answer:
            'Nee. Deze toelichting is in het Nederlands geschreven, maar het gesprek met een advocaat vindt alleen plaats in het Engels, Chinees (中文), Japans en Koreaans. Wij beloven ook geen tolk. Schriftelijke vertaling is iets anders: de oorspronkelijke tekst die u schrijft, wordt zo bewaard en niet automatisch vertaald.',
        },
        {
          question: 'Wat als ik geen van de vier talen kan gebruiken?',
          answer:
            'Kies bij het sturen van het verzoek “Communicatiekanaal moet worden bevestigd”. Wij antwoorden om te onderzoeken of er een werkbare manier van communiceren bestaat, maar een dienst in een andere taal wordt niet gewaarborgd. Dit is een controle, geen belofte dat wij in een andere taal kunnen werken.',
        },
        {
          question: 'Hoe wordt mijn Nederlandse tekst behandeld?',
          answer:
            'De oorspronkelijke tekst die u schrijft, wordt bewaard zoals die is en niet automatisch vertaald. Indien nodig wordt de taal van de verdere communicatie met u bevestigd.',
        },
        {
          question: 'Heeft de consultatie al plaatsgevonden als het verzoek is verzonden?',
          answer:
            'Nee. Een verzonden verzoek wacht op beoordeling door een advocaat. Dat is geen juridisch advies, geen bevestigde afspraak, en het versturen schept op zich geen relatie tussen advocaat en cliënt.',
        },
        {
          question: 'Hoe worden de kosten berekend?',
          answer:
            'Eerst wordt de omvang van het werk vastgesteld, daarna worden hoogte en berekeningswijze van de kosten met u bevestigd voordat het werk begint. Deze pagina noemt geen cijfers en zegt niet dat het eerste gesprek kosteloos is.',
        },
        {
          question: 'Wat als mijn zaak zeer spoedeisend is?',
          answer:
            'Noem de termijn of de datum op een ambtelijk schrijven aan het begin van uw samenvatting, zodat die data bij de beoordeling zichtbaar zijn. Deze pagina heeft geen spoedlijn en belooft geen antwoordtermijn; als uw zaak niet kan wachten, zoek dan tegelijk naar andere mogelijkheden in uw eigen land.',
        },
      ],
    },
    privacy: {
      eyebrow: 'PRIVACY',
      title: 'Gegevens die via het contactformulier worden verzameld',
      description:
        'Wat het contactformulier in dit Nederlandse deel verzamelt, hoe de oorspronkelijke tekst wordt behandeld en hoe u ons over uw gegevens bereikt.',
      intro:
        'Dit deel betreft alleen het contactformulier op deze toelichtingspagina’s. Het beschrijft de omgang met gegevens, niet een technische garantie.',
      sections: [
        {
          heading: 'Welke gegevens worden verzameld',
          paragraphs: [
            'Als u via het formulier in dit deel een verzoek stuurt, worden de volgende gegevens vastgelegd:',
          ],
          items: [
            'De door u opgegeven naam',
            'Het e-mailadres voor het antwoord',
            'De weergavetaal van de pagina bij het versturen',
            'De taal waarin u hebt geschreven',
            'De door u gewenste consultatietaal',
            'De oorspronkelijke tekst die u hebt geschreven',
            'Uw toestemming tot het versturen van het verzoek',
            'Een ontvangstnummer om het verzoek terug te vinden',
          ],
        },
        {
          heading: 'De oorspronkelijke tekst wordt ongewijzigd bewaard',
          paragraphs: [
            'Uw tekst wordt precies zo bewaard als u die hebt geschreven en niet automatisch vertaald. Is een vertaling voor de behandeling nodig, dan wordt dat afzonderlijk met u besproken.',
            'Omdat de oorspronkelijke tekst wordt bewaard, schrijf in deze eerste fase niets wat nog niet nodig is, zoals een paspoortnummer, een identiteitsnummer of rekeninggegevens.',
          ],
        },
        {
          heading: 'Bewaarplaats en toegang',
          paragraphs: [
            'De inhoud van uw bericht wordt bewaard op een niet openbaar toegankelijke plaats. Alleen bevoegde personen in het kantoor mogen erbij om het verzoek te behandelen.',
            'Deze pagina geeft geen absolute veiligheidsgarantie. Geen overdrachtweg en geen bewaarplaats is volledig veilig; gevoelige stukken moeten daarom alleen na bijzondere aanwijzing van de advocaat worden verzonden.',
          ],
        },
        {
          heading: 'Doel van het gebruik',
          paragraphs: [
            'De verzonden gegevens worden gebruikt om het verzoek te beoordelen, u te antwoorden, het communicatiekanaal af te spreken en de zaak te behandelen als het kantoor die aanneemt.',
            'De gegevens worden niet zonder een afzonderlijke toestemming voor marketing gebruikt.',
          ],
        },
        {
          heading: 'Kennisgeving en ontvangstnummer',
          paragraphs: [
            'Wordt een verzoek succesvol verzonden, dan stelt het systeem het kantoor in kennis. Is deze kennisgeving nog niet bevestigd, dan blijft uw tekst bewaard en gaat niet verloren.',
            'Het ontvangstnummer dient om uw verzoek in onze stukken terug te vinden. Het wordt na het bewaren getoond; u kunt het bij een nieuw contact noemen.',
          ],
        },
        {
          heading: 'Uw rechten en de contactweg',
          paragraphs: [
            'U kunt inzage, rectificatie of verwijdering van uw gegevens vragen of de toestemming intrekken, via het e-mailadres op de contactpagina. Bestaat een wettelijke of procedurele bewaarplicht, dan lichten wij de beperking toe.',
            'Deze pagina noemt geen vaste bewaartermijn, omdat de werkelijke duur afhangt van of de zaak wordt voortgezet, en van de daarmee verbonden plichten. Wenst u een eerdere verwijdering, deel dat mee bij het contact.',
          ],
        },
        {
          heading: 'Bewaarplaats en dienstverleners',
          paragraphs: [
            'Deze website wordt bij Vercel gehost, en uw bericht wordt in een niet-openbare opslag van deze dienst bewaard. E-mails worden verzonden via de e-maildienst die het kantoor gebruikt.',
            'Servers van afzonderlijke dienstverleners kunnen buiten Taiwan staan, zodat uw gegevens daar kunnen worden bewaard en verwerkt. Is het bewaardoel vervuld, dan worden de gegevens zonder vertraging gewist; gegevens die volgens toepasselijke voorschriften moeten worden bewaard, blijven voor die duur. Verzoeken over persoonsgegevens neemt wei@hoveringlaw.com.tw in ontvangst.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'VOORBEHOUD',
      title: 'Omvang en grenzen van de informatie op deze pagina',
      description:
        'Het algemene karakter van de informatie, het juridische geldingsgebied en de voorwaarden van een relatie tussen advocaat en cliënt.',
      intro:
        'Dit deel maakt duidelijk wat deze Nederlandse toelichtingspagina’s voor u kunnen doen en wat niet.',
      sections: [
        {
          heading: 'Alleen algemene informatie',
          paragraphs: [
            'De inhoud van deze pagina’s is als algemene informatie geschreven. Zij is geen juridisch advies voor uw zaak en vervangt niet de toetsing van uw eigen stukken.',
            'De afloop van een zaak hangt af van de feiten, de toepasselijke regels en het tijdstip; twee ogenschijnlijk gelijke situaties kunnen verschillend eindigen.',
          ],
        },
        {
          heading: 'Juridisch geldingsgebied',
          paragraphs: [
            'Het kantoor werkt volgens Taiwanees recht, en deze pagina spreekt alleen over werk in dat kader.',
            'De inhoud is geen advies volgens het recht van een andere rechtsorde dan Taiwan, met inbegrip van het recht van uw woonplaats. Raakt een deel van uw zaak een andere rechtsorde, dan overleggen wij met u welke bevoegde deskundige u voor dat deel nodig hebt.',
          ],
        },
        {
          heading: 'Een relatie tussen advocaat en cliënt ontstaat niet vanzelf',
          paragraphs: [
            'Het lezen van deze pagina, het versturen van een formulier of een e-mail schept op zich geen relatie tussen advocaat en cliënt.',
            'Die relatie ontstaat pas nadat de zaak is beoordeeld en beide partijen hebben bevestigd dat het kantoor de zaak aanvaardt.',
          ],
        },
        {
          heading: 'Geen resultaatbelofte',
          paragraphs: [
            'Geen deel van deze pagina is een belofte over het resultaat van een zaak, over de inwilliging van een aanvraag of over verblijfs- en werkstatus.',
            'Externe koppelingen dienen ter oriëntatie; wij waarborgen noch de juistheid noch de actualiteit van inhoud van derden.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'ARTIKELEN',
      title: 'Artikelen over Taiwanees recht',
      description:
        'Nederlandse artikelen over veelgestelde vragen over het Taiwanese recht. De inhoud is algemene informatie op het tijdstip van publicatie, geen juridisch advies voor uw zaak.',
      intro:
        'Het kantoor publiceert artikelen over veelgestelde vragen over het Taiwanese recht. Artikelen die in het Nederlands beschikbaar zijn, staan op deze pagina; daarnaast zijn er vier koppelingen die elk de artikelenlijst van een oorspronkelijke taal openen.',
      sections: [
        {
          heading: 'Vier lijsten naar taal',
          paragraphs: [
            'Dit deel bevat vier koppelingen: de artikelenlijst in het Koreaans, in het Chinees, in het Engels en in het Japans. Elke koppeling noemt de taal van de lijst, zodat u vooraf weet in welke taal de inhoud opent.',
            'Deze vier lijsten zijn lijsten naar de oorspronkelijke taal van de artikelen, geen vertaallijsten. Artikelen die in het Nederlands beschikbaar zijn, staan afzonderlijk op deze pagina.',
          ],
        },
        {
          heading: 'Waar de koppelingen naartoe leiden',
          paragraphs: [
            'Als u een van de vier koppelingen kiest, opent de artikelenlijst van die taal. Uit de lijst kiest u zelf de tekst; de hele inhoud verschijnt in de oorspronkelijke taal van het artikel.',
            'Deze pagina vat de inhoud van de artikelen niet samen en waarborgt niet dat een onderwerp in alle vier de talen beschikbaar is. Elke lijst bevat alleen teksten die in die taal zijn gepubliceerd.',
          ],
        },
        {
          heading: 'Hoe ver een artikel als oriëntatie kan dienen',
          paragraphs: [
            'Artikelen zijn algemene informatie op het tijdstip van publicatie. Voorschriften en hun toepassing kunnen veranderen, en een artikel bevat niet alle omstandigheden van uw zaak.',
            'Baseer in een echte zaak geen stappen alleen op een artikel. Gebruik het voor het overzicht en bespreek uw stukken afzonderlijk met een advocaat; deze pagina is niet de consultatiestap.',
          ],
        },
      ],
    },
  },
};

export const polishGuidanceContent: GuidanceLocaleContent = {
  languageName: 'Polski',
  nav: {
    home: 'Strona główna',
    services: 'Usługi',
    about: 'Kancelaria',
    lawyers: 'Adwokaci',
    pricing: 'Koszty',
    contact: 'Kontakt',
    faq: 'Pytania',
    privacy: 'Prywatność',
    disclaimer: 'Zastrzeżenia',
    columns: 'Artykuły',
  },
  contactCta: 'Wyślij wniosek o konsultację',
  footerNotice:
    'Ta strona po polsku zawiera jedynie ogólne informacje o pracy kancelarii według prawa Tajwanu. Nie jest poradą prawną w konkretnej sprawie, a wysłanie wiadomości samo w sobie nie tworzy stosunku między adwokatem a klientem.',
  skipLink: 'Pomiń nawigację i przejdź do treści',
  menuLabel: 'Spis stron',
  languageLabel: 'Język wyświetlania',
  mega: {
    services: {
      description: 'Kancelaria prowadzi zasadnicze grupy spraw według prawa Tajwanu.',
      viewAllLabel: 'Pokaż wszystkie',
    },
    columns: {
      description: 'Artykuły o częstych pytaniach z zakresu prawa Tajwanu.',
      viewAllLabel: 'Pokaż wszystkie',
    },
    lawyers: {
      description: 'Przedstawienie adwokatów i sposobów kontaktu.',
      viewAllLabel: 'Pokaż wszystkie',
    },
    pricing: {
      description: 'Ta strona wyjaśnia zakres pracy i to, jak ustala się koszty.',
      viewAllLabel: 'Pokaż wszystkie',
    },
    faq: {
      description: 'Częste pytania o pracę kancelarii na Tajwanie.',
      viewAllLabel: 'Pokaż wszystkie',
    },
  },
  notFoundTitle: 'Nie znaleziono strony',
  notFoundText:
    'Szukana strona nie istnieje albo została przeniesiona. Można wrócić na polską stronę główną, aby zobaczyć dostępne informacje.',
  backHomeLabel: 'Na stronę główną',
  readSourceLabel: 'Otwórz listę artykułów w języku oryginału',
  home: {
    heroScrollLabel: 'Przewiń w dół',
    heroColumnsCtaLabel: 'Zobacz artykuły',
    servicesDetailLabel: 'Zobacz szczegóły',
    servicesAssistanceBefore: 'Jeśli nie jest jasne, do której grupy należy sprawa, strona ',
    servicesAssistanceLinkLabel: 'Kontakt',
    servicesAssistanceAfter:
      ' wyjaśnia, jak sformułować streszczenie, które adwokat rozpatruje.',
    columnsViewAllLabel: 'Zobacz wszystkie artykuły',
    columnsReadMoreLabel: 'Czytaj dalej',
    columnsReviewLabel: 'Sprawdziła adwokatka Wei Tseng',
    columnsOriginalLanguageBadge: 'Język oryginału',
    columnsOriginalLanguageNote:
      'Poniższe artykuły nie są jeszcze dostępne po polsku. Lista pozostaje w języku oryginału i otwiera odpowiednią stronę językową; treść nie jest tłumaczona automatycznie.',
    imageBandAlt: 'Tradycyjny tajwański sanheyuan (三合院) i nowoczesny pawilon w świetle dziennym',
    videoPauseLabel: 'Wstrzymaj wideo',
    videoPlayLabel: 'Odtwórz wideo',
    videoReplayLabel: 'Odtwórz wideo ponownie',
  },
  pages: {
    home: {
      eyebrow: 'INFORMACJE',
      title: 'Usługi prawne na Tajwanie — informacje po polsku',
      description:
        'Ogólne wyjaśnienia po polsku o zakresie pracy Hovering International Law Firm na Tajwanie, o językach konsultacji i o pierwszym kontakcie.',
      intro:
        'Hovering International Law Firm prowadzi sprawy klientów z zagranicy, także z powiązaniem z Tajwanem, według prawa Tajwanu: inwestycje i zakładanie spółek, spory cywilne, małżeństwo, rodzina i spadki, prawo pracy, sprawy karne oraz własność intelektualna. Ta polska część pomaga rozpoznać, jaka praca wchodzi w nasz zakres, co przygotować i jak się z nami skontaktować. Są to informacje ogólne, a nie porada prawna w Państwa sprawie.',
      sections: [
        {
          heading: 'Czym się zajmujemy',
          paragraphs: [
            'Hovering International Law Firm jest kancelarią adwokacką z siedzibą na Tajwanie. Pracuje według prawa Tajwanu i ma biura w Tajpej (臺北), Kaohsiung (高雄), Taichung (臺中) i Pingtung (屏東). Doradzamy przedsiębiorstwom i prowadzimy postępowania przed sądem oraz towarzyszymy klientom z zagranicy w krokach wymaganych na Tajwanie.',
            'Cała treść tutaj jest ogólna. Wynik sprawy zależy od faktów, od stosowanych przepisów i od chwili. Te informacje nie zastępują rozmowy z adwokatem o Państwa dokumentach.',
          ],
        },
        {
          heading: 'Język strony i język konsultacji to nie to samo',
          paragraphs: [
            'Ta strona jest napisana po polsku, ale konsultacja z adwokatem odbywa się wyłącznie w czterech językach konsultacji: angielskim, chińskim (中文), japońskim i koreańskim. Czytanie informacji po polsku nie oznacza, że rozmowa z adwokatem odbywa się po polsku.',
            'Nie obiecujemy tłumacza ustnego, terminu odpowiedzi ani spotkania za pośrednictwem tej strony. Jeśli nie można korzystać z żadnego z czterech języków, strona „Kontakt” wyjaśnia, jak ustalamy sposób komunikacji.',
          ],
        },
        {
          heading: 'Grupy spraw',
          paragraphs: [
            'Zakres pracy obejmuje następujące sześć grup. Strona „Usługi” opisuje każdą grupę dokładniej i wskazuje, czego się nie obiecuje.',
          ],
          items: [
            'Inwestycje i zakładanie spółki na Tajwanie',
            'Sprawy cywilne i odszkodowania',
            'Małżeństwo, rodzina i spadki',
            'Spory ze stosunku pracy',
            'Sprawy karne',
            'Własność intelektualna: znaki towarowe, patenty i prawo autorskie',
          ],
        },
        {
          heading: 'Od czego zacząć',
          paragraphs: [
            'Prosimy przeczytać stronę „Usługi”, aby sprawdzić, czy sprawa wchodzi w nasz zakres, a następnie „Koszty” i „Kontakt”, aby dowiedzieć się, jak ustala się zakres i jak koszty są potwierdzane przed rozpoczęciem pracy.',
            'Przy wysyłaniu wiadomości można napisać streszczenie we własnym języku. Oryginalny tekst jest zapisywany tak, jak został napisany, i nie jest tłumaczony automatycznie. Wysłana wiadomość jest wnioskiem oczekującym na rozpatrzenie: to jeszcze nie konsultacja i jeszcze nie potwierdzony termin.',
          ],
        },
      ],
    },
    services: {
      eyebrow: 'USŁUGI',
      title: 'Jakie sprawy prowadzimy',
      description:
        'Sześć grup spraw kancelarii na Tajwanie i granice, które warto znać najpierw.',
      intro:
        'Poniżej grupy, które rzeczywiście prowadzimy, oraz pytania często zadawane na początku. Opis pomaga ocenić, czy sprawa wchodzi w nasz zakres; jest ogólny i nie jest analizą prawną konkretnej sprawy.',
      sections: [
        {
          heading: 'Inwestycje i zakładanie spółki na Tajwanie',
          paragraphs: [
            'Towarzyszymy zagranicznym inwestorom i przedsiębiorstwom przy zakładaniu lub prowadzeniu spółki na Tajwanie: wybór formy prawnej, przygotowanie i złożenie dokumentów, wniesienie kapitału, sprawy bankowe, ocena siedziby oraz wymagania branżowe. Wspieramy także księgowość i podatki wynikające z założenia i prowadzenia działalności na Tajwanie.',
            'Przebieg i czas różnią się według formy, inwestora, branży, banku i posiadanych dokumentów. Założenie spółki samo w sobie nie prowadzi do tytułu pobytu (居留) ani zezwolenia na pracę (工作許可): to odrębne postępowania, oceniane według sytuacji danej osoby.',
          ],
        },
        {
          heading: 'Sprawy cywilne i odszkodowania',
          paragraphs: [
            'Ta grupa obejmuje spory umowne, odszkodowania z czynu niedozwolonego i spory konsumenckie. Praca zaczyna się zwykle od chronologii, oceny posiadanych dokumentów i dowodów, a dopiero potem od kolejnych kroków.',
            'Terminy, w tym ustawowe terminy do wytoczenia powództwa, oraz kompletność dowodów kształtują przebieg. Dlatego znane daty należy podać jak najwcześniej. Prosimy zachować umowy, wiadomości, dowody zapłaty lub zdjęcia sytuacji na miejscu i wymienić je w pierwszej wiadomości.',
          ],
        },
        {
          heading: 'Małżeństwo, rodzina i spadki',
          paragraphs: [
            'Prowadzimy sprawy o rozwód (離婚), podział majątku, wykonywanie praw i obowiązków rodzicielskich wobec małoletnich dzieci (未成年子女權利義務之行使或負擔), kontakty (會面交往) i spadki (繼承), także gdy strony lub majątek znajdują się w różnych państwach. Transgraniczne sprawy rodzinne często wymagają dodatkowego badania rejestrów gospodarstw domowych (戶籍), formy dokumentów i ich dowodowości na Tajwanie.',
            'Ponieważ sprawy rodzinne często niosą terminy i równoległe postępowania, pierwsze streszczenie powinno wskazać stosunek stron, aktualne miejsce zamieszkania i już toczące się postępowania.',
          ],
        },
        {
          heading: 'Spory ze stosunku pracy',
          paragraphs: [
            'Ta grupa obejmuje rozwiązanie stosunku pracy, odprawę według prawa Tajwanu (資遣費; nie należy jej utożsamiać z instytucjami innych państw), wynagrodzenie i spory z umowy o pracę (勞動契約), zarówno po stronie pracownika, jak i pracodawcy. Przy ocenie oddzielamy przyczynę rozwiązania od kwestii wypowiedzenia, zapłaty i terminów.',
            'Umowa o pracę, regulamin pracy (工作規則), paski wynagrodzeń i korespondencja stron są zwykle dokumentami rozstrzygającymi. Jeśli nadal je Państwo mają, prosimy o wzmiankę w streszczeniu.',
          ],
        },
        {
          heading: 'Sprawy karne',
          paragraphs: [
            'Towarzyszymy w postępowaniu przygotowawczym i przed sądem, zarówno dla podejrzanych lub oskarżonych, jak i dla pokrzywdzonych, oraz oceniamy ryzyko karne działalności przedsiębiorstwa.',
            'Sprawy karne mają często krótkie terminy i ustalone etapy. Jeśli otrzymano już pismo organu ścigania lub sądu, prosimy wcześnie podać datę na piśmie, aby treść została rozpatrzona we właściwej kolejności.',
          ],
        },
        {
          heading: 'Własność intelektualna',
          paragraphs: [
            'Wspieramy przy zgłoszeniu znaków towarowych (商標) i patentów (專利), przy prawie autorskim i przy sporach o te prawa na Tajwanie.',
            'W tej grupie decyduje kolejność kroków: zakres ochrony, chwila zgłoszenia i faktyczne używanie wpływają na wybór. Złożenie wniosku samo w sobie nie oznacza, że zostanie on uwzględniony.',
          ],
        },
        {
          heading: 'Zakres i jego potwierdzenie',
          paragraphs: [
            'Kancelaria pracuje według prawa Tajwanu i prowadzi sprawy wymienionych grup. Zakres każdej sprawy jest potwierdzany osobno po tym, jak adwokat rozpatrzy wiadomość.',
            'Status pobytu, zezwolenie na pracę i podobne kwestie ocenia się na podstawie dokumentów i sytuacji danej osoby, a nie obywatelstwa. Jeśli część sprawy dotyczy takich kwestii, prosimy o wzmiankę przy kontakcie. Ta strona nie obiecuje wyniku ani terminu odpowiedzi.',
          ],
        },
      ],
    },
    about: {
      eyebrow: 'KANCELARIA',
      title: 'O Hovering International Law Firm',
      description:
        'Podstawowe dane o tej tajwańskiej kancelarii adwokackiej, jej biurach i pracy z podmiotami zagranicznymi.',
      intro:
        'Hovering International Law Firm jest kancelarią adwokacką na Tajwanie. Adwokaci pracują od doradztwa dla przedsiębiorstw po postępowanie sądowe. Ta część opisuje powstanie kancelarii, siedziby i pracę z podmiotami zagranicznymi.',
      sections: [
        {
          heading: 'Założenie i struktura',
          paragraphs: [
            'Hovering International Law Firm (昊鼎國際法律事務所) została założona w 2016 r. przez adwokatów, którzy studiowali na National Taiwan University (國立臺灣大學). Chińska nazwa 昊鼎 łączy znak 昊 („szerokie niebo”) ze znakiem 鼎 („trwała podstawa”) i opisuje kierunek kancelarii od założenia.',
            'Mamy biura w Tajpej (臺北), Kaohsiung (高雄), Taichung (臺中) i Pingtung (屏東). Biuro w Kaohsiung koncentruje się na zarządzaniu przedsiębiorstwem i prowadzi spory cywilne, karne i administracyjne. Biuro w Taichung prowadzi sprawy budowlane, własność intelektualną oraz sprawy związane z Koreą i Japonią. Biuro w Pingtung otwarto w 2017 r. na potrzeby lokalne.',
            'Oprócz pracy adwokackiej od 2020 r. istnieje także Hovering Accounting Office, które oferuje księgowość i planowanie podatkowe przedsiębiorcom i osobom z majątkiem.',
          ],
        },
        {
          heading: 'Praca z podmiotami zagranicznymi',
          paragraphs: [
            'Praca transgraniczna obejmuje zakładanie spółek, wizy, zgłoszenia znaków towarowych i patentów, ocenę ryzyka prawnego oraz doradztwo podatkowe przedsiębiorstw. Biuro w Taichung prowadzi zwłaszcza sprawy budowlane, własność intelektualną oraz sprawy związane z Koreą i Japonią. Adwokatka Wei Tseng (曾雋崴) towarzyszy klientom z Korei, Japonii i innym klientom międzynarodowym we wskazanych grupach.',
            'Czy możemy przyjąć sprawę, zależy od treści i od języka komunikacji. Jeśli sprawa wchodzi we wskazane grupy i można ją omówić w jednym z czterech języków konsultacji, można wysłać streszczenie do rozpatrzenia.',
          ],
        },
        {
          heading: 'Gdy Państwo się z nami kontaktują',
          paragraphs: [
            'Po wpłynięciu streszczenia adwokat rozpatruje treść, a następnie omawia możliwy zakres pracy, jeszcze potrzebne dokumenty i kolejne kroki. W sprawach podatkowych lub księgowych kancelaria może prowadzić sprawę razem z działem księgowości.',
            'Wynik każdej sprawy zależy od faktów i posiadanych dokumentów; nie obiecujemy wyniku. Jeśli potrzebna jest wiążąca odpowiedź dla danej sytuacji, dokumenty muszą być omówione w jednym z czterech języków konsultacji z adwokatem.',
          ],
        },
      ],
    },
    lawyers: {
      eyebrow: 'ADWOKACI',
      title: 'Międzynarodowy zespół Hovering',
      description: 'Profile adwokatów, kierownictwa operacyjnego i partnerskiego biura rachunkowego Hovering.',
      intro: '',
      sections: [],
    },
    pricing: {
      eyebrow: 'KOSZTY',
      title: 'Jak ustala się zakres pracy i koszty',
      description:
        'Wyjaśnienie kolejności: najpierw zakres pracy, potem potwierdzenie kosztów, i dlaczego ta strona nie zawiera cennika.',
      intro:
        'Ta strona wyjaśnia, jak ustala się koszty, a nie ich wysokość. Wysokość zależy od zakresu pracy danej sprawy i ma sens dopiero wtedy, gdy ten zakres jest jasny.',
      sections: [
        {
          heading: 'Najpierw ustala się zakres pracy',
          paragraphs: [
            'Sprawy tego samego rodzaju mogą wymagać bardzo różnego nakładu, zależnie od liczby stron, posiadanych dokumentów, terminów do zachowania i od tego, czy postępowanie już się zaczęło. Dlatego pierwszym krokiem jest zawsze ustalenie, co należy do pracy, a co nie.',
            'Streszczenie wysłane na początku jest podstawą tego zakresu. Im jaśniej opisuje przebieg, żądanie i terminy, tym dokładniej można określić zakres.',
          ],
        },
        {
          heading: 'Koszty potwierdza się przed rozpoczęciem pracy',
          paragraphs: [
            'Gdy zakres pracy jest jasny, wysokość i sposób obliczania kosztów omawia się i potwierdza z Państwem, zanim praca się zacznie. Jeśli zakres zmieni się w trakcie, trzeba to potwierdzić ponownie.',
            'Ta strona nie jest ofertą cenową i nie tworzy obowiązku zapłaty.',
          ],
        },
        {
          heading: 'Konsultacja może być odpłatna',
          paragraphs: [
            'Konsultacja z adwokatem może być świadczeniem odpłatnym. Ta strona nie mówi, że pierwsza rozmowa jest bezpłatna, i żadna część nie może być tak odczytana.',
            'Jeśli konsultacja jest odpłatna, wysokość i sposób zapłaty podaje się, zanim do niej dojdzie.',
          ],
        },
        {
          heading: 'Dlaczego ta strona nie podaje stawek',
          paragraphs: [
            'Koszty zależą od samej sprawy: od nakładu, liczby stron, dokumentów, terminów i od tego, czy postępowanie już trwa. Liczba ustalona z góry nie pokazałaby kosztów Państwa akt. Dlatego najpierw ustalamy zakres pracy, a następnie podajemy koszty, zanim praca się zacznie.',
            'Obok honorarium adwokackiego mogą powstać koszty sądowe, urzędowe lub osób trzecich. Są one oddzielone od honorarium i zależą od danego postępowania.',
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'KONTAKT',
      title: 'Jak skontaktować się z kancelarią',
      description:
        'Język strony, języki konsultacji, postępowanie, gdy nie można korzystać z żadnego z czterech języków, oraz to, czego ta strona nie obiecuje.',
      intro:
        'Zanim Państwo do nas napiszą, prosimy rozróżnić trzy poniższe punkty. Często się je miesza, ale oznaczają coś innego.',
      sections: [
        {
          heading: 'Trzy rzeczy, które muszą pozostać rozdzielone',
          paragraphs: [
            'Język wyświetlania strony, język konsultacji z adwokatem i język, w którym Państwo piszą, to trzy osobne rzeczy.',
          ],
          items: [
            'Język strony: te informacje są napisane po polsku.',
            'Język konsultacji: konsultacja odbywa się po angielsku, chińsku (中文), japońsku i koreańsku.',
            'Język pisania: można napisać streszczenie we własnym języku; oryginalny tekst jest zapisywany bez zmian.',
          ],
        },
        {
          heading: 'Jeśli nie można korzystać z żadnego z czterech języków konsultacji',
          paragraphs: [
            'W formularzu kontaktowym można wybrać „Sposób komunikacji musi zostać potwierdzony”. Odpowiadamy, aby ustalić możliwy sposób komunikacji, jeśli taki sposób istnieje; nie świadczymy usług w innym języku i nie obiecujemy terminu odpowiedzi.',
            'To tylko krok badania, nie jest obietnicą. Nie obiecujemy tłumacza ustnego, świadczenia po polsku ani w innym języku poza czterema wskazanymi językami, i nie obiecujemy, że przyjmiemy każdą sprawę.',
          ],
        },
        {
          heading: 'Co powinno znaleźć się w pierwszej wiadomości',
          paragraphs: [
            'Prosimy podać, co się stało, jakiej pomocy potrzeba, jaki związek ma sprawa z Tajwanem oraz termin, jeśli jest znany. Jeśli otrzymano już pismo sądu lub urzędu, prosimy podać datę na piśmie.',
            'Na początku nie trzeba jeszcze wysyłać numeru paszportu, numeru dokumentu tożsamości, danych rachunku, dokumentacji medycznej ani całości dowodów. Prosimy czekać na wskazówki adwokata i dopiero wtedy wysłać wrażliwe dokumenty bezpieczną drogą.',
          ],
        },
        {
          heading: 'Czego ta strona nie obiecuje',
          paragraphs: [
            'Nie obiecujemy terminu odpowiedzi, nie potwierdzamy spotkania za pośrednictwem tej strony, nie obiecujemy konkretnego adwokata i nie zapewniamy tłumacza ustnego. Tłumaczenie pisemne to coś innego: wiadomość nie jest tłumaczona automatycznie.',
            'Jeśli Państwo wyślą wniosek, treść jest zapisywana i czeka na rozpatrzenie. Jeśli nie ma odpowiedzi, można ponownie napisać na adres poczty elektronicznej podany na stronie kontaktu.',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'PYTANIA',
      title: 'Często zadawane pytania',
      description:
        'Wyjaśnienia o zakresie pracy, przygotowaniu, językach, kosztach i znaczeniu wysłanego wniosku.',
      intro:
        'Poniższe pytania są odpowiedziami na poziomie informacji ogólnych. Odpowiedź w Państwa sprawie jest możliwa dopiero po rozpatrzeniu dokumentów przez adwokata.',
      sections: [
        {
          heading: 'Jak korzystać z tej części',
          paragraphs: [
            'Jeśli nie ma odpowiedzi na daną sytuację, odpowiedź zwykle zależy od szczególnych faktów. Prosimy wtedy wpisać te fakty w streszczeniu, zamiast wyprowadzać je samodzielnie z tej strony.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Jakie sprawy prowadzi kancelaria?',
          answer:
            'Prowadzimy sześć grup: inwestycje i zakładanie spółki na Tajwanie, sprawy cywilne i odszkodowania, małżeństwo, rodzina i spadki, spory ze stosunku pracy, sprawy karne oraz własność intelektualną. Czy sprawa zostanie przyjęta, rozstrzyga się po rozpatrzeniu treści.',
        },
        {
          question: 'Co przygotować przed kontaktem?',
          answer:
            'Prosimy przygotować krótkie streszczenie przebiegu, żądania, związku z Tajwanem i terminu, jeśli istnieje. Jeśli jest już pismo sądu lub urzędu, prosimy podać datę. Na tym etapie nie trzeba jeszcze wysyłać dokumentów tożsamości ani całości dowodów.',
        },
        {
          question: 'Czy możliwa jest konsultacja po polsku?',
          answer:
            'Nie. Te informacje są napisane po polsku, ale konsultacja z adwokatem odbywa się wyłącznie w języku angielskim, chińskim (中文), japońskim i koreańskim. Nie obiecujemy też tłumacza ustnego. Tłumaczenie pisemne to coś innego: oryginalny tekst, który Państwo napiszą, jest zapisywany tak i nie jest tłumaczony automatycznie.',
        },
        {
          question: 'Co, jeśli nie można korzystać z żadnego z czterech języków?',
          answer:
            'Przy wysyłaniu wniosku prosimy wybrać „Sposób komunikacji musi zostać potwierdzony”. Odpowiadamy, aby ustalić sposób komunikacji, ale nie świadczymy usług w innym języku. To krok badania, nie jest obietnicą, że możemy pracować w innym języku.',
        },
        {
          question: 'Jak traktowany jest mój tekst po polsku?',
          answer:
            'Oryginalny tekst, który Państwo napiszą, jest zapisywany taki, jaki jest, i nie jest tłumaczony automatycznie. W razie potrzeby język dalszej komunikacji zostanie z Państwem potwierdzony.',
        },
        {
          question: 'Czy konsultacja już się odbyła, gdy wniosek został wysłany?',
          answer:
            'Nie. Wysłany wniosek czeka na rozpatrzenie przez adwokata. To nie jest porada prawna, nie jest potwierdzonym terminem, a wysłanie samo w sobie nie tworzy stosunku między adwokatem a klientem.',
        },
        {
          question: 'Jak oblicza się koszty?',
          answer:
            'Najpierw ustala się zakres pracy, a następnie wysokość i sposób obliczania kosztów potwierdza się z Państwem, zanim praca się zacznie. Ta strona nie podaje liczb i nie mówi, że pierwsza rozmowa jest bezpłatna.',
        },
        {
          question: 'Co, jeśli sprawa jest bardzo pilna?',
          answer:
            'Prosimy podać termin lub datę na piśmie urzędowym na początku streszczenia, aby te daty były widoczne przy rozpatrzeniu. Ta strona nie ma kanału awaryjnego i nie zapewnia terminu odpowiedzi; jeśli sprawa nie może czekać, należy równolegle szukać innych dróg w swoim miejscu.',
        },
      ],
    },
    privacy: {
      eyebrow: 'PRYWATNOŚĆ',
      title: 'Dane zbierane przez formularz kontaktowy',
      description:
        'Co zbiera formularz kontaktowy w tej polskiej części, jak traktowany jest oryginalny tekst i jak skontaktować się z nami w sprawie Państwa danych.',
      intro:
        'Ta część dotyczy wyłącznie formularza kontaktowego na tych stronach informacyjnych. Opisuje postępowanie z danymi, a nie gwarancję techniczną.',
      sections: [
        {
          heading: 'Jakie dane są zbierane',
          paragraphs: [
            'Gdy za pośrednictwem formularza w tej części wysyłany jest wniosek, rejestrowane są następujące dane:',
          ],
          items: [
            'Podane imię i nazwisko',
            'Adres poczty elektronicznej do odpowiedzi',
            'Język wyświetlania strony w chwili wysłania',
            'Język, w którym napisano',
            'Żądany język konsultacji',
            'Oryginalny tekst, który napisano',
            'Zgoda na wysłanie wniosku',
            'Numer odbioru, aby odnaleźć wniosek',
          ],
        },
        {
          heading: 'Oryginalny tekst jest zapisywany bez zmian',
          paragraphs: [
            'Tekst jest zapisywany dokładnie tak, jak został napisany, i nie jest tłumaczony automatycznie. Jeśli do opracowania potrzebne jest tłumaczenie, omawia się to z Państwem osobno.',
            'Ponieważ oryginalny tekst jest zapisywany, na pierwszym etapie nie należy wpisywać tego, co jeszcze nie jest potrzebne, na przykład numeru paszportu, numeru dokumentu tożsamości ani danych rachunku.',
          ],
        },
        {
          heading: 'Miejsce przechowywania i dostęp',
          paragraphs: [
            'Treść wysyłki jest przechowywana w miejscu niedostępnym publicznie. Tylko uprawnione osoby w kancelarii mogą z niej korzystać, aby opracować wniosek.',
            'Ta strona nie daje bezwzględnej gwarancji bezpieczeństwa. Żadna droga przesyłu i żadne miejsce przechowywania nie jest całkowicie bezpieczne; wrażliwe dokumenty należy więc wysyłać dopiero po szczególnym wskazaniu adwokata.',
          ],
        },
        {
          heading: 'Cel wykorzystania',
          paragraphs: [
            'Wysłane dane służą rozpatrzeniu wniosku, odpowiedzi, wyjaśnieniu sposobu komunikacji oraz opracowaniu, jeśli praca zostanie podjęta.',
            'Dane nie są wykorzystywane do marketingu bez odrębnej zgody.',
          ],
        },
        {
          heading: 'Powiadomienie i numer odbioru',
          paragraphs: [
            'Jeśli wniosek zostanie pomyślnie wysłany, system powiadamia kancelarię. Jeśli to powiadomienie nie jest jeszcze potwierdzone, tekst pozostaje zapisany i nie zostaje utracony.',
            'Numer odbioru służy do odnalezienia wniosku w naszych aktach. Jest pokazywany po zapisaniu; można go podać przy ponownym kontakcie.',
          ],
        },
        {
          heading: 'Państwa prawa i droga kontaktu',
          paragraphs: [
            'Można żądać dostępu, sprostowania lub usunięcia danych albo odwołać zgodę, za pośrednictwem adresu poczty elektronicznej podanego na stronie kontaktu. Jeśli istnieje ustawowy lub procesowy obowiązek przechowywania, wyjaśniamy ograniczenie.',
            'Ta strona nie podaje stałego terminu przechowywania, ponieważ faktyczny czas zależy od tego, czy sprawa jest kontynuowana, oraz od związanych z tym obowiązków. Jeśli Państwo życzą sobie wcześniejszego usunięcia, prosimy o informację przy kontakcie.',
          ],
        },
        {
          heading: 'Miejsce przechowywania i dostawcy',
          paragraphs: [
            'Ta witryna jest hostowana u Vercel, a wysyłka jest przechowywana w niepublicznej przestrzeni dyskowej tej usługi. Poczta elektroniczna jest wysyłana przez usługę poczty używaną przez kancelarię.',
            'Serwery poszczególnych dostawców mogą znajdować się poza Tajwanem, więc dane mogą tam być przechowywane i przetwarzane. Gdy cel przechowywania zostanie spełniony, dane usuwa się bez zwłoki; dane, które według stosowanych przepisów muszą być przechowywane, pozostają przez ten czas. Wnioski dotyczące danych osobowych przyjmuje wei@hoveringlaw.com.tw.',
          ],
        },
      ],
    },
    disclaimer: {
      eyebrow: 'ZASTRZEŻENIA',
      title: 'Zakres i granice informacji na tej stronie',
      description:
        'Ogólny charakter informacji, zakres prawny oraz przesłanki stosunku między adwokatem a klientem.',
      intro:
        'Ta część wyjaśnia, co te polskie strony informacyjne mogą dla Państwa zrobić, a czego nie.',
      sections: [
        {
          heading: 'Tylko informacje ogólne',
          paragraphs: [
            'Treść tych stron jest napisana jako informacja ogólna. Nie jest poradą prawną w Państwa sprawie i nie zastępuje oceny własnych dokumentów.',
            'Wynik sprawy zależy od faktów, stosowanych przepisów i chwili; dwie pozornie podobne sytuacje mogą zakończyć się inaczej.',
          ],
        },
        {
          heading: 'Zakres prawny',
          paragraphs: [
            'Kancelaria prowadzi sprawy według prawa Tajwanu, a ta strona mówi wyłącznie o pracy w tych ramach.',
            'Treść nie jest doradztwem według prawa innego porządku niż Tajwan, w tym prawa miejsca zamieszkania. Jeśli część sprawy dotyczy innego porządku prawnego, wyjaśnimy z Państwem, jaka wykwalifikowana osoba jest potrzebna do tej części.',
          ],
        },
        {
          heading: 'Stosunek między adwokatem a klientem nie powstaje sam',
          paragraphs: [
            'Czytanie tej strony, wysłanie formularza lub wiadomości elektronicznej samo w sobie nie tworzy stosunku między adwokatem a klientem.',
            'Ten stosunek powstaje dopiero po rozpatrzeniu sprawy i po tym, jak obie strony potwierdzą podjęcie pracy.',
          ],
        },
        {
          heading: 'Brak obietnicy wyniku',
          paragraphs: [
            'Żadna część tej strony nie jest obietnicą wyniku sprawy, uwzględnienia wniosku ani statusu pobytu i pracy.',
            'Łącza zewnętrzne służą orientacji; nie zapewniamy ani poprawności, ani aktualności treści osób trzecich.',
          ],
        },
      ],
    },
    columns: {
      eyebrow: 'ARTYKUŁY',
      title: 'Artykuły o prawie Tajwanu',
      description:
        'Polskie artykuły o częstych pytaniach z zakresu prawa Tajwanu. Treść jest informacją ogólną w chwili publikacji, a nie poradą prawną w Państwa sprawie.',
      intro:
        'Kancelaria publikuje artykuły o częstych pytaniach z zakresu prawa Tajwanu. Artykuły dostępne po polsku znajdują się na tej stronie; obok są cztery łącza, z których każde otwiera listę artykułów w jednym języku oryginału.',
      sections: [
        {
          heading: 'Cztery listy według języka',
          paragraphs: [
            'Ta część zawiera cztery łącza: listę artykułów po koreańsku, po chińsku, po angielsku i po japońsku. Każde łącze podaje język listy, aby było wiadomo z góry, w jakim języku otworzy się treść.',
            'Te cztery listy są listami według języka oryginału artykułów, a nie listami tłumaczeń. Artykuły dostępne po polsku znajdują się osobno na tej stronie.',
          ],
        },
        {
          heading: 'Dokąd prowadzą łącza',
          paragraphs: [
            'Gdy wybiorą Państwo jedno z czterech łączy, otwiera się lista artykułów w tym języku. Z listy wybierają Państwo tekst; cała treść ukazuje się w języku oryginału artykułu.',
            'Ta strona nie streszcza treści artykułów i nie zapewnia, że temat jest dostępny we wszystkich czterech językach. Każda lista zawiera tylko teksty opublikowane w tym języku.',
          ],
        },
        {
          heading: 'Jak dalece artykuł może służyć orientacji',
          paragraphs: [
            'Artykuły są informacjami ogólnymi w chwili publikacji. Przepisy i ich stosowanie mogą się zmieniać, a artykuł nie zawiera wszystkich okoliczności Państwa sprawy.',
            'Dlatego prosimy nie opierać działania w prawdziwej sprawie wyłącznie na artykule. Prosimy użyć go do przeglądu i omówić dokumenty osobno z adwokatem; ta strona nie jest etapem konsultacji.',
          ],
        },
      ],
    },
  },
};


